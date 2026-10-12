import { assess } from '../growth';
import type { Assessment, GrowthInput, IndicatorResult } from '../growth/types';

/**
 * Length-for-age as it would read if the WHO 0.7 cm lying/standing correction were skipped.
 * Returns null when no correction was applied or the unadjusted result has no band.
 */
export function unadjustedLhfa(a: Assessment, input: GrowthInput): IndicatorResult | null {
  if (a.adjustmentCm === 0) return null;
  // Pretend the child was measured the WHO way for this age, so no correction is applied.
  const unadjusted = assess({ ...input, position: a.adjustmentCm > 0 ? 'lying' : 'standing' });
  const before = unadjusted.ok ? unadjusted.indicators.find((r) => r.id === 'lhfa') : undefined;
  if (!before?.band || before.z === null) return null;
  return before;
}
