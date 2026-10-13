// Positions measured on the 12 Oct 2026 captures, in CSS px of the 1920x1080 viewport.
// Where possible they are offsets from a manifest bounding box, so a vertical layout shift
// in a re-capture still lines up. Re-check with `npm run stills` after any UI change.
import type { Box } from './data';

export const rel = (b: Box, dx: number, dy: number, width: number, height: number): Box =>
  ({ x: b.x + dx, y: b.y + dy, width, height });

/** Inside the zscale-lhfa box (AR correction still): ghost marker (z -2.19) and the -2 tick. */
export const ZSCALE = { ghost: { dx: 136, dy: 30 }, minusTwoDx: 149, barTop: 22, barBottom: 70 };

/** clip-correction-marker: after the scroll (t >= 2.7 s) the second click replays the slide 3.9 to 4.2 s. */
export const SLIDE = { trimSec: 3.5, rate: 0.35, focus: { x: 300, y: 430, width: 640, height: 215 } as Box };

/** Fold step list, relative to calc-without-correction (step 5): step 3 (+0.7 cm) sits above it. */
export const FOLD = { step3: { dx: 0, dy: -213, h: 150 }, focusTop: -265 };

/** clip-lang-toggle: the z -1.94 chip on the length bar, before and after the toggle at ~3.15 s. */
export const LANG = {
  outlineSec: 2.7,
  toggleSec: 3.15,
  ar: { x: 441, y: 689, width: 66, height: 24 } as Box,
  en: { x: 1123, y: 694, width: 66, height: 24 } as Box,
};

/** "Swelling of both feet" inside block-urgent (EN redflag still). */
export const SWELLING = { dx: 50, dy: 202, width: 186 };

/** AI still: the fixed result card above the AI box ends ~150 px above the ask-answer box. */
export const AI_BRACKET = { x: 236, top: 12, bottomAboveAnswer: 150 };
