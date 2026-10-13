import { Easing, interpolate, spring } from 'remotion';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const EASE = Easing.bezier(0.33, 0, 0.2, 1);

/** 0 to 1 between two times (seconds), eased. */
export const ramp = (frame: number, fps: number, startSec: number, durSec: number): number =>
  interpolate(frame, [startSec * fps, (startSec + durSec) * fps], [0, 1], { ...clamp, easing: EASE });

/** Critically damped spring starting at startSec (no overshoot: calm, clinical). */
export const settle = (frame: number, fps: number, startSec: number, durSec = 1.2): number =>
  spring({ frame: frame - startSec * fps, fps, durationInFrames: durSec * fps, config: { damping: 200 } });

/** One soft pulse (0 to 1 to 0) starting at startSec. */
export const pulse = (frame: number, fps: number, startSec: number, durSec = 0.9): number =>
  interpolate(frame, [startSec * fps, (startSec + durSec / 2) * fps, (startSec + durSec) * fps], [0, 1, 0], clamp);

export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;
