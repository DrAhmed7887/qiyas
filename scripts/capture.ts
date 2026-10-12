// Automated captures of the real app for the Remotion demo video.
// Run: npm run capture   (needs `npm run preview` on CAPTURE_URL, default http://localhost:4173/)
import { chromium, type Page, type Browser } from 'playwright';
import { mkdirSync, rmSync, writeFileSync, readdirSync, renameSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const URL = process.env.CAPTURE_URL ?? 'http://localhost:4173/';
const OUT = join(process.cwd(), 'video', 'captures');
const SETTLE = 1400;
const AI = process.env.CAPTURE_AI === '1';

type Box = { x: number; y: number; width: number; height: number };
interface Entry { file: string; beat: string; lang: string; viewport: string; kind: 'still' | 'element' | 'clip' | 'text'; box?: Box }
const manifest: Entry[] = [];
const problems: string[] = [];

const RIPPLE_CSS = `
.qc-ripple{position:fixed;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;
 border:3px solid #1a73e8;background:rgba(26,115,232,.25);pointer-events:none;z-index:2147483647;
 animation:qc-rip .7s ease-out forwards}
@keyframes qc-rip{to{transform:scale(4);opacity:0}}
.qc-cursor{position:fixed;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:#1a73e8;
 box-shadow:0 0 0 3px #fff;pointer-events:none;z-index:2147483647;left:0;top:0}`;
const RIPPLE_JS = `
(()=>{const c=document.createElement('div');c.className='qc-cursor';document.documentElement.appendChild(c);
addEventListener('mousemove',e=>{c.style.left=e.clientX+'px';c.style.top=e.clientY+'px'},true);
addEventListener('mousedown',e=>{const r=document.createElement('div');r.className='qc-ripple';
r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';document.documentElement.appendChild(r);setTimeout(()=>r.remove(),800)},true);})()`;

const tid = (p: Page, id: string) => p.getByTestId(id);
const wait = (p: Page, ms = SETTLE) => p.waitForTimeout(ms);

async function setLang(p: Page, lang: 'ar' | 'en') {
  const cur = await p.evaluate(() => document.documentElement.lang);
  if (!cur.startsWith(lang)) { await tid(p, 'lang-toggle').click(); await wait(p, 300); }
}
async function fresh(b: Browser, w: number, h: number, lang: 'ar' | 'en', record?: string) {
  const ctx = await b.newContext({
    viewport: { width: w, height: h }, deviceScaleFactor: 2,
    ...(w < 600 ? { isMobile: true, hasTouch: true } : {}),
    ...(record ? { recordVideo: { dir: record, size: { width: w, height: h } } } : {}),
  });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await setLang(p, lang);
  return { ctx, p };
}
async function runDemo(p: Page, id: 'correction' | 'redflag' | 'normal') {
  await tid(p, `demo-${id}`).click();
  if (await tid(p, 'result').isHidden()) await tid(p, 'check-button').click();
  await tid(p, 'result').waitFor({ state: 'visible' });
}
async function still(p: Page, name: string, beat: string, lang: string, vp: string, full = false) {
  const file = `${name}.png`;
  await p.screenshot({ path: join(OUT, file), fullPage: full });
  manifest.push({ file, beat, lang, viewport: vp, kind: 'still' });
}
async function elShot(p: Page, id: string, name: string, beat: string, lang: string, vp: string) {
  const el = tid(p, id);
  await el.scrollIntoViewIfNeeded();
  await wait(p, 500);
  const box = await el.boundingBox();
  const file = `${name}.png`;
  await el.screenshot({ path: join(OUT, file) });
  manifest.push({ file, beat, lang, viewport: vp, kind: 'element', box: box ?? undefined });
}
async function viewportBox(p: Page, id: string): Promise<Box | undefined> {
  return (await tid(p, id).boundingBox()) ?? undefined;
}
async function guard(name: string, fn: () => Promise<void>) {
  try { await fn(); } catch (e) { problems.push(`${name}: ${(e as Error).message.split('\n')[0]}`); console.error('FAIL', name); }
}

async function clip(b: Browser, name: string, beat: string, lang: 'ar' | 'en', body: (p: Page) => Promise<void>) {
  const dir = join(OUT, `.rec-${name}`);
  rmSync(dir, { recursive: true, force: true });
  const { ctx, p } = await fresh(b, 1920, 1080, lang, dir);
  await p.addStyleTag({ content: RIPPLE_CSS });
  await p.evaluate(RIPPLE_JS);
  await p.mouse.move(300, 300);
  await body(p);
  const vid = p.video();
  await ctx.close();
  const src = await vid!.path();
  renameSync(src, join(OUT, `${name}.webm`));
  rmSync(dir, { recursive: true, force: true });
  manifest.push({ file: `${name}.webm`, beat, lang, viewport: '1920x1080', kind: 'clip' });
}
async function glide(p: Page, id: string) {
  const b = await tid(p, id).boundingBox();
  if (!b) return;
  await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 25 });
  await wait(p, 150);
}

async function main() {
  try {
    const r = await fetch(URL);
    if (!r.ok) throw new Error(String(r.status));
  } catch {
    console.error(`App not reachable at ${URL}. Start it with: npm run preview  (or set CAPTURE_URL)`);
    process.exit(1);
  }
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  const t0 = Date.now();
  const browser = await chromium.launch();
  try {
    // Desktop stills
    for (const lang of ['ar', 'en'] as const) {
      const vp = '1920x1080';
      const { ctx, p } = await fresh(browser, 1920, 1080, lang);
      await p.addStyleTag({ content: RIPPLE_CSS }); // harmless: no cursor element in stills
      await guard(`hero-${lang}`, async () => { await wait(p, 600); await still(p, `desktop-${lang}-hero`, 'hero', lang, vp); });
      await guard(`correction-${lang}`, async () => {
        await runDemo(p, 'correction'); await wait(p);
        await tid(p, 'result').scrollIntoViewIfNeeded(); await wait(p, 300);
        await still(p, `desktop-${lang}-correction-result`, 'correction-result', lang, vp);
        await still(p, `desktop-${lang}-correction-result-full`, 'correction-result', lang, vp, true);
        await elShot(p, 'zscale-lhfa', `desktop-${lang}-zscale-lhfa`, 'zscale-lhfa', lang, vp);
      });
      await guard(`fold-${lang}`, async () => {
        await tid(p, 'calc-fold').evaluate((d: HTMLDetailsElement) => { d.open = true; });
        await wait(p, 600);
        await elShot(p, 'calc-without-correction', `desktop-${lang}-calc-without-correction`, 'calc-fold', lang, vp);
        await still(p, `desktop-${lang}-calc-fold-viewport`, 'calc-fold', lang, vp);
      });
      await guard(`redflag-${lang}`, async () => {
        await runDemo(p, 'redflag'); await wait(p);
        await tid(p, 'block-urgent').scrollIntoViewIfNeeded(); await wait(p, 300);
        await still(p, `desktop-${lang}-redflag-result`, 'redflag-result', lang, vp);
        await elShot(p, 'block-urgent', `desktop-${lang}-block-urgent`, 'redflag-urgent', lang, vp);
        await elShot(p, 'block-remeasure', `desktop-${lang}-block-remeasure`, 'redflag-remeasure', lang, vp);
      });
      await guard(`normal-${lang}`, async () => {
        await runDemo(p, 'normal'); await wait(p);
        await tid(p, 'result').scrollIntoViewIfNeeded(); await wait(p, 300);
        await still(p, `desktop-${lang}-normal-result`, 'normal-result', lang, vp);
      });
      await ctx.close();
    }

    // Mobile stills (Arabic)
    {
      const { ctx, p } = await fresh(browser, 390, 844, 'ar');
      for (const id of ['correction', 'redflag'] as const) {
        await guard(`mobile-${id}`, async () => {
          await runDemo(p, id); await wait(p);
          await tid(p, 'result').scrollIntoViewIfNeeded(); await wait(p, 300);
          await still(p, `mobile-ar-${id}-result`, `${id}-result`, 'ar', '390x844');
          await still(p, `mobile-ar-${id}-result-full`, `${id}-result`, 'ar', '390x844', true);
        });
      }
      await ctx.close();
    }

    // Clips
    await guard('clip-a', () => clip(browser, 'clip-correction-marker', 'zscale-slide', 'ar', async (p) => {
      await glide(p, 'demo-correction');
      await tid(p, 'demo-correction').click();
      if (await tid(p, 'result').isHidden()) await tid(p, 'check-button').click();
      await wait(p, 1300);
      await tid(p, 'zscale-lhfa').evaluate((e) => e.scrollIntoView({ block: 'center' }));
      await wait(p, 600);
      await glide(p, 'demo-correction');
      await tid(p, 'demo-correction').click();
      if (await tid(p, 'result').isHidden()) await tid(p, 'check-button').click();
      await tid(p, 'zscale-lhfa').evaluate((e) => e.scrollIntoView({ block: 'center' }));
      await wait(p, 1800);
    }));
    await guard('clip-b', () => clip(browser, 'clip-lang-toggle', 'lang-toggle', 'ar', async (p) => {
      await runDemo(p, 'correction'); await wait(p, 1300);
      await tid(p, 'calc-fold').evaluate((d: HTMLDetailsElement) => { d.open = true; });
      await tid(p, 'calc-fold').evaluate((e) => e.scrollIntoView({ block: 'center' }));
      await wait(p, 600);
      await tid(p, 'lang-toggle').evaluate((e) => e.scrollIntoView({ block: 'center' }));
      await glide(p, 'lang-toggle');
      await tid(p, 'lang-toggle').click();
      await wait(p, 1800);
    }));
    await guard('clip-c', () => clip(browser, 'clip-redflag', 'redflag', 'ar', async (p) => {
      await glide(p, 'demo-redflag');
      await tid(p, 'demo-redflag').click();
      if (await tid(p, 'result').isHidden()) await tid(p, 'check-button').click();
      await wait(p, 1000);
      await tid(p, 'block-urgent').evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'smooth' }));
      await wait(p, 1600);
    }));

    // Optional AI
    if (AI) {
      await guard('ai', async () => {
        const { ctx, p } = await fresh(browser, 1920, 1080, 'ar');
        await runDemo(p, 'correction'); await wait(p);
        await tid(p, 'ask-button').scrollIntoViewIfNeeded();
        await tid(p, 'ask-button').click();
        await tid(p, 'ask-answer').filter({ hasText: /\S/ }).waitFor({ timeout: 30000 });
        await wait(p, 800);
        await still(p, 'desktop-ar-ai-answer', 'ai-answer', 'ar', '1920x1080');
        await elShot(p, 'ask-answer', 'desktop-ar-ai-answer-el', 'ai-answer', 'ar', '1920x1080');
        await ctx.close();
      });
    }
  } finally {
    await browser.close();
  }

  // Text evidence
  const sh = (c: string) => { try { return execSync(c, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { return String((e as { stdout?: string }).stdout ?? e); } };
  const strip = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '');
  const test = strip(sh('npm test 2>&1'));
  const lines = test.split('\n').filter((l) => /(✓|Test Files|Tests|Duration|Start at|FAIL|passed|failed)/.test(l));
  writeFileSync(join(OUT, 'test-summary.txt'), lines.join('\n') + '\n');
  manifest.push({ file: 'test-summary.txt', beat: 'proof-tests', lang: '-', viewport: '-', kind: 'text' });
  writeFileSync(join(OUT, 'who-source-snippet.txt'), sh('head -c 400 data/who/lhfa_boys.json') + '\n');
  manifest.push({ file: 'who-source-snippet.txt', beat: 'proof-who-source', lang: '-', viewport: '-', kind: 'text' });

  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify({ url: URL, deviceScaleFactor: 2, generated: new Date().toISOString(), files: manifest, problems }, null, 2));
  const files = readdirSync(OUT);
  const bytes = files.reduce((n, f) => n + statSync(join(OUT, f)).size, 0);
  console.log(`${files.length} files, ${(bytes / 1e6).toFixed(1)} MB, ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  if (problems.length) { console.error('PROBLEMS:\n' + problems.join('\n')); process.exitCode = 2; }
}
main();
