import { cancelRender, continueRender, delayRender, staticFile } from 'remotion';
import { fontFiles } from './data';

const FAMILY = 'IBM Plex Sans Arabic';
let started = false;

/** Loads the app's own font (copied from @fontsource by prebuild) before any frame renders. */
export function loadFonts(): void {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender(`Loading ${FAMILY}`);
  Promise.all(fontFiles.map(async (f) => {
    const face = new FontFace(FAMILY, `url(${staticFile(`fonts/${f.file}`)}) format('woff2')`, {
      weight: String(f.weight), unicodeRange: f.unicodeRange,
    });
    document.fonts.add(await face.load());
  }))
    .then(() => continueRender(handle))
    .catch((err: unknown) => cancelRender(err instanceof Error ? err : new Error(String(err))));
}
