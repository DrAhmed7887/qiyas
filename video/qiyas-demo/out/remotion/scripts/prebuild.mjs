// Prebuild: turns the storyboard, captions, captures and real source files into JSON the
// composition imports. Re-run after editing storyboard.xml or re-capturing (npm run prebuild).
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const FPS = 30;
const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEMO = resolve(HERE, '../..');
const REPO = resolve(DEMO, '../..');
const CAPTURES = join(REPO, 'video/captures');
const PUBLIC = join(HERE, 'public');
const GEN = join(HERE, 'src/generated');

const fail = (msg) => { process.stderr.write(`prebuild: ${msg}\n`); process.exit(1); };
const warn = (msg) => process.stderr.write(`prebuild warning: ${msg}\n`);
const read = (p) => { if (!existsSync(p)) fail(`missing ${p}`); return readFileSync(p, 'utf8'); };
const writeJson = (p, data) => writeFileSync(p, JSON.stringify(data, null, 2) + '\n');

// ---------- storyboard.xml -> src/timeline.json ----------
const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'").replace(/&amp;/g, '&').trim();
const tag = (block, name) => { const m = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`)); return m ? decode(m[1]) : ''; };
const attrs = (s) => Object.fromEntries([...s.matchAll(/(\w+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

function parseStoryboard(xml) {
  const body = xml.replace(/<!--[\s\S]*?-->/g, '');
  const total = Number(tag(body, 'duration_seconds'));
  const scenes = [];
  let cursor = 0;
  for (const sm of body.matchAll(/<scene\s([^>]*)>([\s\S]*?)<\/scene>/g)) {
    const a = attrs(sm[1]);
    const sceneFrom = cursor;
    const shots = [];
    for (const shm of sm[2].matchAll(/<shot\s([^>]*)>([\s\S]*?)<\/shot>/g)) {
      const s = attrs(shm[1]);
      const durationInFrames = Math.round(Number(s.duration) * FPS);
      if (!s.id || !(durationInFrames > 0)) fail(`bad shot in scene ${a.id}: ${shm[1]}`);
      shots.push({
        id: s.id, from: cursor, durationInFrames,
        visual: tag(shm[2], 'visual'), text: tag(shm[2], 'text'),
        motion: tag(shm[2], 'motion'), voiceover: tag(shm[2], 'voiceover'),
      });
      cursor += durationInFrames;
    }
    const durationInFrames = cursor - sceneFrom;
    if (Math.round(Number(a.duration) * FPS) !== durationInFrames) {
      fail(`scene ${a.id}: duration="${a.duration}" but its shots add up to ${durationInFrames / FPS}s`);
    }
    scenes.push({ id: a.id, from: sceneFrom, durationInFrames, intent: tag(sm[2], 'intent'), shots });
  }
  if (!scenes.length) fail('no <scene> elements found in storyboard.xml');
  if (total && Math.round(total * FPS) !== cursor) fail(`metadata says ${total}s but scenes add up to ${cursor / FPS}s`);
  return { fps: FPS, width: 1920, height: 1080, title: tag(body, 'title'), totalFrames: cursor, scenes };
}

// ---------- captions.srt -> captions.json ----------
const toFrames = (t) => { const [h, m, rest] = t.split(':'); const [s, ms] = rest.split(','); return Math.round(((+h * 60 + +m) * 60 + +s + +ms / 1000) * FPS); };
function parseSrt(srt) {
  return srt.replace(/\r/g, '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean).map((b) => {
    const lines = b.split('\n');
    const i = lines.findIndex((l) => l.includes('-->'));
    if (i < 0) fail(`bad caption block: ${b.slice(0, 60)}`);
    const [start, end] = lines[i].split('-->').map((x) => x.trim());
    return { startFrame: toFrames(start), endFrame: toFrames(end), text: lines.slice(i + 1).join(' ').trim() };
  });
}

// ---------- real source files -> code.json ----------
function whoSnippet() {
  const path = 'data/who/lhfa_boys.json';
  const raw = readFileSync(join(REPO, path)).subarray(0, 400).toString('utf8');
  const lines = (raw + '…').replace(/,(?="[a-z]+":)/g, ',\n').replace(/^\{/, '{\n').split('\n').map((l, i) => (i ? '  ' + l : l));
  const highlight = lines.findIndex((l) => l.includes('"source"'));
  if (highlight < 0) fail(`${path}: no "source" field in the first 400 bytes`);
  return { path, lines, highlight };
}
function bandsSnippet() {
  const path = 'web/src/growth/bands.ts';
  const all = read(join(REPO, path)).split('\n');
  const start = all.findIndex((l) => l.startsWith('export function overallUrgency'));
  if (start < 0) fail(`${path}: overallUrgency not found`);
  const end = all.findIndex((l, i) => i > start && l.startsWith('}'));
  const lines = all.slice(start, end + 1);
  if (lines.length > 12) fail(`${path}: overallUrgency is ${lines.length} lines (card fits 12)`);
  const highlight = lines.findIndex((l) => l.includes("if (urgent) return 'urgent'"));
  if (highlight < 0) fail(`${path}: "if (urgent) return 'urgent'" not found in overallUrgency`);
  return { path, firstLine: start + 1, lines, highlight };
}
function testSnippet(timeline) {
  const lines = read(join(CAPTURES, 'test-summary.txt')).split('\n').filter((l) => l.trim());
  const passed = lines.findIndex((l) => /^\s*Tests\s+\d+ passed/.test(l));
  if (passed < 0) fail('test-summary.txt has no "Tests N passed" line');
  const count = Number(lines[passed].match(/(\d+) passed/)[1]);
  const said = timeline.scenes.flatMap((s) => s.shots).find((s) => s.id === 'proof-2')?.text ?? '';
  if (!said.includes(String(count))) warn(`npm test reports ${count} tests but proof-2 says "${said}": update the storyboard and TTS`);
  return { command: 'npm test', lines, passed, count };
}

// ---------- assets ----------
function ffprobeSeconds(file) {
  try {
    return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }).trim()) || null;
  } catch { return null; }
}
function copyCaptures() {
  if (!existsSync(join(CAPTURES, 'manifest.json'))) fail('video/captures/manifest.json missing: run `npm run capture` at the repo root first');
  rmSync(join(PUBLIC, 'captures'), { recursive: true, force: true });
  cpSync(CAPTURES, join(PUBLIC, 'captures'), { recursive: true });
  cpSync(join(REPO, 'web/public/favicon.svg'), join(PUBLIC, 'logo.svg'));
  return JSON.parse(read(join(CAPTURES, 'manifest.json')));
}
function assets(manifest, timeline) {
  const captures = Object.fromEntries(manifest.files.map((f) => [f.file, { beat: f.beat, lang: f.lang, kind: f.kind, box: f.box ?? null }]));
  const clips = Object.fromEntries(manifest.files.filter((f) => f.kind === 'clip').map((f) => [f.file, ffprobeSeconds(join(CAPTURES, f.file))]));
  const aiFiles = manifest.files.filter((f) => f.beat.startsWith('ai'));
  const ai = {
    clip: aiFiles.find((f) => f.kind === 'clip')?.file ?? null,
    still: aiFiles.find((f) => f.kind === 'still')?.file ?? null,
    element: aiFiles.find((f) => f.kind === 'element') ?? null,
  };
  const shotIds = timeline.scenes.flatMap((s) => s.shots.map((x) => x.id));
  const vo = shotIds.filter((id) => existsSync(join(PUBLIC, 'vo', `${id}.wav`)));
  if (manifest.problems?.length) warn(`capture problems: ${manifest.problems.join('; ')}`);
  return { generated: manifest.generated, captures, clips, ai, broll: existsSync(join(PUBLIC, 'broll-open.mp4')) ? ffprobeSeconds(join(PUBLIC, 'broll-open.mp4')) ?? 6 : null, vo };
}

// ---------- fonts (IBM Plex Sans Arabic from the app's node_modules) ----------
function fonts() {
  const pkg = join(REPO, 'node_modules/@fontsource/ibm-plex-sans-arabic');
  if (!existsSync(pkg)) fail('run `npm install` at the repo root (needs @fontsource/ibm-plex-sans-arabic)');
  mkdirSync(join(PUBLIC, 'fonts'), { recursive: true });
  const out = [];
  for (const weight of [400, 500, 600, 700]) {
    for (const block of read(join(pkg, `${weight}.css`)).split('@font-face').slice(1)) {
      const file = block.match(/url\(\.\/files\/([^)]+\.woff2)\)/)?.[1];
      const unicodeRange = block.match(/unicode-range:\s*([^;]+);/)?.[1];
      if (!file || !unicodeRange || file.includes('cyrillic')) continue;
      cpSync(join(pkg, 'files', file), join(PUBLIC, 'fonts', file));
      out.push({ file, weight, unicodeRange });
    }
  }
  if (!out.length) fail('no font files found');
  return out;
}

mkdirSync(GEN, { recursive: true });
mkdirSync(join(PUBLIC, 'vo'), { recursive: true });
const timeline = parseStoryboard(read(join(DEMO, 'storyboard.xml')));
writeJson(join(HERE, 'src/timeline.json'), timeline);
writeJson(join(GEN, 'captions.json'), parseSrt(read(join(DEMO, 'captions.srt'))));
writeJson(join(GEN, 'code.json'), { who: whoSnippet(), bands: bandsSnippet(), tests: testSnippet(timeline) });
const manifest = copyCaptures();
const a = assets(manifest, timeline);
writeJson(join(GEN, 'assets.json'), a);
writeJson(join(GEN, 'fonts.json'), fonts());
process.stdout.write(`prebuild: ${timeline.scenes.length} scenes, ${timeline.totalFrames} frames, ` +
  `${readdirSync(join(PUBLIC, 'captures')).length} capture files, broll=${a.broll !== null}, vo=${a.vo.length}, ` +
  `ai=${a.ai.clip ? 'clip' : a.ai.still ? 'still' : 'pending'}\n`);
