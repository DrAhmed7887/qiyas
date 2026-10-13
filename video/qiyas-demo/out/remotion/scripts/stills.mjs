// Renders one still per scene (mid-scene) to out/stills/, bundling once.
// Extra frames: `node scripts/stills.mjs 450 1210` (absolute frame numbers). Add --scale=1 for full size.
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(HERE, 'out/stills');
const args = process.argv.slice(2);
const scale = Number(args.find((a) => a.startsWith('--scale='))?.split('=')[1] ?? 0.5);
const extra = args.filter((a) => /^\d+$/.test(a)).map(Number);

/** Middle of the shot that contains the scene's midpoint (avoids landing on a shot's first frame). */
function midShotFrame(scene) {
  const mid = scene.from + scene.durationInFrames / 2;
  const shot = scene.shots.find((x) => mid >= x.from && mid < x.from + x.durationInFrames) ?? scene.shots[0];
  return shot.from + Math.floor(shot.durationInFrames / 2);
}

const timeline = JSON.parse(readFileSync(join(HERE, 'src/timeline.json'), 'utf8'));
const jobs = extra.length
  ? extra.map((f) => ({ name: `frame-${f}`, frame: f }))
  : timeline.scenes.map((s, i) => ({ name: `${i + 1}-${s.id}`, frame: midShotFrame(s) }));

mkdirSync(OUT, { recursive: true });
const serveUrl = await bundle({ entryPoint: join(HERE, 'src/index.ts'), publicDir: join(HERE, 'public') });
const composition = await selectComposition({ serveUrl, id: 'QiyasDemo' });
for (const job of jobs) {
  const output = join(OUT, `${job.name}.png`);
  await renderStill({ serveUrl, composition, frame: job.frame, output, scale });
  process.stdout.write(`${output} (frame ${job.frame})\n`);
}
