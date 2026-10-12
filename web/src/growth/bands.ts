// Turns z-scores into bands, percentiles and an overall urgency (WHO cut-offs).
import type { Band, IndicatorId, IndicatorResult, Overall } from './types';

export function bandFor(id: IndicatorId, z: number): Band {
  if (z < -3) return 'severely_low';
  if (z < -2) return 'low';
  if (id === 'wflh') {
    if (z > 3) return 'obesity';
    if (z > 2) return 'overweight';
    if (z > 1) return 'risk_overweight';
  }
  return 'normal';
}

// Abramowitz & Stegun 7.1.26 for erf, absolute error below 1.5e-7.
function erf(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const poly =
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
    t;
  const y = 1 - poly * Math.exp(-x * x);
  return x >= 0 ? y : -y;
}

/** Percentile (0-100) of a z-score under the standard normal curve. */
export function percentile(z: number): number {
  return 50 * (1 + erf(z / Math.SQRT2));
}

const SEE_SOON: ReadonlyArray<Band> = ['severely_low', 'obesity'];
const CHECK: ReadonlyArray<Band> = ['low', 'risk_overweight', 'overweight'];

/**
 * Most urgent first: urgent (red flag) > see_soon > check > routine.
 * Implausible indicators carry no band, so they never lower an urgent result.
 */
export function overallUrgency(urgent: boolean, indicators: ReadonlyArray<IndicatorResult>): Overall {
  if (urgent) return 'urgent';
  const bands = indicators.flatMap((i) => (i.status === 'ok' && i.band ? [i.band] : []));
  if (bands.some((b) => SEE_SOON.includes(b))) return 'see_soon';
  const remeasure = indicators.some((i) => i.status === 'implausible');
  if (remeasure || bands.some((b) => CHECK.includes(b))) return 'check';
  return 'routine';
}
