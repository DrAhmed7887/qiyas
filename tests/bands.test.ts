// Band cut-offs from the brief (Step 3), edge by edge. A z exactly on a cut-off stays in the milder band.
import { describe, expect, it } from 'vitest';
import { bandFor, overallUrgency } from '../web/src/growth/bands';
import type { IndicatorResult } from '../web/src/growth/types';

describe('bandFor', () => {
  it.each([
    ['lhfa', -3.001, 'severely_low'],
    ['lhfa', -3, 'low'],
    ['lhfa', -2.001, 'low'],
    ['lhfa', -2, 'normal'],
    ['lhfa', 5, 'normal'], // no overweight band for length/height-for-age
    ['wfa', -3.001, 'severely_low'],
    ['wfa', -2.5, 'low'],
    ['wfa', 4, 'normal'], // no overweight band for weight-for-age
    ['wflh', -3.5, 'severely_low'],
    ['wflh', -2.2, 'low'],
    ['wflh', 1, 'normal'],
    ['wflh', 1.001, 'risk_overweight'],
    ['wflh', 2, 'risk_overweight'],
    ['wflh', 2.001, 'overweight'],
    ['wflh', 3, 'overweight'],
    ['wflh', 3.001, 'obesity'],
  ] as const)('%s z=%s -> %s', (id, z, band) => {
    expect(bandFor(id, z)).toBe(band);
  });
});

const ok = (band: IndicatorResult['band']): IndicatorResult => ({
  id: 'wfa', table: 'wfa', value: 1, lookupKey: 1, z: 0, percentile: 50, band, status: 'ok',
});
const bad: IndicatorResult = { ...ok(null), status: 'implausible', percentile: null };

describe('overallUrgency', () => {
  it('red flag wins over everything, even all-implausible', () => {
    expect(overallUrgency(true, [bad, bad, bad])).toBe('urgent');
    expect(overallUrgency(true, [ok('normal')])).toBe('urgent');
  });
  it('severely_low and obesity -> see_soon', () => {
    expect(overallUrgency(false, [ok('normal'), ok('severely_low')])).toBe('see_soon');
    expect(overallUrgency(false, [ok('obesity'), ok('low')])).toBe('see_soon');
  });
  it('low, risk_overweight, overweight -> check', () => {
    expect(overallUrgency(false, [ok('low')])).toBe('check');
    expect(overallUrgency(false, [ok('risk_overweight')])).toBe('check');
    expect(overallUrgency(false, [ok('overweight')])).toBe('check');
  });
  it('all normal -> routine', () => {
    expect(overallUrgency(false, [ok('normal'), ok('normal')])).toBe('routine');
  });
  it('any implausible value -> check, never routine', () => {
    expect(overallUrgency(false, [bad, ok('normal')])).toBe('check');
    expect(overallUrgency(false, [bad, ok('severely_low')])).toBe('see_soon');
  });
});
