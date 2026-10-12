// WHO flags for biologically implausible values, plus the parent's red-flag questions.
import type { IndicatorId, RedFlags } from './types';

interface Range {
  readonly min: number;
  readonly max: number;
}

// Source: WHO Anthro (igrowup) flag limits, checked on the final (restricted) z-score
// for weight-for-age and weight-for-length/height. A z exactly on a limit is plausible.
export const PLAUSIBLE_Z: Readonly<Record<IndicatorId, Range>> = {
  lhfa: { min: -6, max: 6 },
  wfa: { min: -6, max: 5 },
  wflh: { min: -5, max: 5 },
};

export function isImplausible(id: IndicatorId, z: number): boolean {
  const { min, max } = PLAUSIBLE_Z[id];
  return z < min || z > max;
}

export function hasRedFlag(flags: RedFlags): boolean {
  return flags.oedema || flags.weakOrNotFeeding || flags.recentWeightLoss;
}
