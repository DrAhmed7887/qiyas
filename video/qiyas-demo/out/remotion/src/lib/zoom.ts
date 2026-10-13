import type { Box } from './data';

export const VIEWPORT = { width: 1920, height: 1080 } as const;
export interface View { scale: number; cx: number; cy: number }

/** The whole 1920x1080 viewport fitted into a frame of width w. */
export const fullView = (w: number): View => ({ scale: w / VIEWPORT.width, cx: VIEWPORT.width / 2, cy: VIEWPORT.height / 2 });

/** A view that fits `box` (CSS px) into a w x h frame with some breathing room. */
export function focusView(box: Box, w: number, h: number, fill = 0.82): View {
  return {
    scale: Math.min((w * fill) / box.width, (h * fill) / box.height),
    cx: box.x + box.width / 2,
    cy: box.y + box.height / 2,
  };
}

/** Interpolate two views; scale moves geometrically so the zoom speed feels even. */
export function lerpView(a: View, b: View, t: number): View {
  return {
    scale: a.scale * Math.pow(b.scale / a.scale, t),
    cx: a.cx + (b.cx - a.cx) * t,
    cy: a.cy + (b.cy - a.cy) * t,
  };
}

/** CSS transform for a 1920x1080 layer (origin top-left) so the view fills a w x h frame, never showing past the edges. */
export function viewTransform(v: View, w: number, h: number): string {
  const clampT = (t: number, size: number, frame: number) => Math.min(0, Math.max(frame - size * v.scale, t));
  const tx = clampT(w / 2 - v.cx * v.scale, VIEWPORT.width, w);
  const ty = clampT(h / 2 - v.cy * v.scale, VIEWPORT.height, h);
  return `translate(${tx}px, ${ty}px) scale(${v.scale})`;
}
