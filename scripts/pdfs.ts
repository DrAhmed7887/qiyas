// Builds the two Devpost PDFs with Playwright's Chromium:
//   submission/qiyas-one-pager.pdf  from submission/one-pager.html (VIDEO_URL env fills the video link)
//   submission/qiyas-code.pdf       every source file in git (not the WHO data tables or lockfiles)
// Run: VIDEO_URL=https://youtu.be/... node scripts/pdfs.ts
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const ROOT = resolve(import.meta.dirname, '..');
const FONTS = `${ROOT}/node_modules/@fontsource/ibm-plex-sans-arabic/files`;
const CODE_FILES = /^(web\/index\.html|web\/src\/.*|tests\/.*|server\/.*|scripts\/.*|data\/who\/SOURCE\.md|README\.md|package\.json|tsconfig\.json|vite\.config\.ts)$/;

function fontFaces(): string {
  return ['400', '700'].flatMap((w) => ['arabic', 'latin'].map((s) =>
    `@font-face{font-family:"IBM Plex Sans Arabic";font-weight:${w};src:url("file://${FONTS}/ibm-plex-sans-arabic-${s}-${w}-normal.woff2") format("woff2");}`,
  )).join('\n');
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function codeHtml(): string {
  const files = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n').filter((f) => CODE_FILES.test(f));
  const sections = files.map((f) => {
    const lines = readFileSync(`${ROOT}/${f}`, 'utf8').split('\n');
    const numbered = lines.map((l, i) => `<span class="n">${i + 1}</span>${escapeHtml(l)}`).join('\n');
    return `<section><h2>${f}</h2><pre>${numbered}</pre></section>`;
  });
  const toc = files.map((f) => `<li>${f}</li>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fontFaces()}
    @page{size:A4;margin:12mm}body{font-family:"IBM Plex Sans Arabic",Arial,sans-serif;font-size:9pt;color:#1d2a28}
    h1{color:#0f6b5c}h2{font-size:10pt;color:#0f6b5c;border-bottom:1px solid #cfe0dc;margin:14px 0 4px;break-after:avoid}
    pre{font-family:Menlo,monospace;font-size:7pt;line-height:1.35;white-space:pre-wrap;word-break:break-all;margin:0}
    .n{display:inline-block;width:3.2em;color:#9aa8a5;user-select:none}ol{columns:2;font-size:8pt}</style></head><body>
    <h1>Qiyas: source code</h1><p>github.com/DrAhmed7887/qiyas · ${files.length} files · the WHO data tables (data/who/*.json) and lockfiles are omitted; see data/who/SOURCE.md.</p>
    <ol>${toc}</ol>${sections.join('')}</body></html>`;
}

async function main(): Promise<void> {
  const video = process.env.VIDEO_URL ?? 'see the Devpost submission';
  const onePager = readFileSync(`${ROOT}/submission/one-pager.html`, 'utf8')
    .replace('{{VIDEO_URL}}', `<a href="${video}">${video.replace(/^https?:\/\//, '')}</a>`)
    .replace('<style>', `<style>${fontFaces()}`);
  const tmpOnePager = `${ROOT}/submission/.one-pager.render.html`;
  writeFileSync(tmpOnePager, onePager);
  const tmpCode = `${ROOT}/submission/.code.render.html`;
  writeFileSync(tmpCode, codeHtml());

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(tmpOnePager).href, { waitUntil: 'load' });
    await page.pdf({ path: `${ROOT}/submission/qiyas-one-pager.pdf`, format: 'A4', printBackground: true, preferCSSPageSize: true });
    await page.goto(pathToFileURL(tmpCode).href, { waitUntil: 'load' });
    await page.pdf({ path: `${ROOT}/submission/qiyas-code.pdf`, format: 'A4', printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }
  process.stdout.write('wrote submission/qiyas-one-pager.pdf and submission/qiyas-code.pdf\n');
}

await main();
