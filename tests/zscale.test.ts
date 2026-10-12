import { describe, expect, it } from 'vitest';
import { Z_MAX, Z_MIN, ticksFor, zToPercent, zonesFor } from '../web/src/ui/zscale';

describe('zToPercent', () => {
  it('puts z = 0 in the middle and the scale ends at 0% and 100%', () => {
    expect(zToPercent(0)).toEqual({ pct: 50, beyond: null });
    expect(zToPercent(Z_MIN)).toEqual({ pct: 0, beyond: null });
    expect(zToPercent(Z_MAX)).toEqual({ pct: 100, beyond: null });
  });

  it('is linear, low to high', () => {
    expect(zToPercent(-2).pct).toBeCloseTo(25, 10);
    expect(zToPercent(2).pct).toBeCloseTo(75, 10);
    expect(zToPercent(-1.94).pct).toBeGreaterThan(zToPercent(-2.19).pct);
  });

  it('clamps to the edge and says which side when z is off the scale', () => {
    expect(zToPercent(-5.2)).toEqual({ pct: 0, beyond: 'low' });
    expect(zToPercent(6)).toEqual({ pct: 100, beyond: 'high' });
  });
});

describe('zonesFor', () => {
  const covers = (id: 'wfa' | 'lhfa' | 'wflh'): void => {
    const zones = zonesFor(id);
    expect(zones[0]?.from).toBe(Z_MIN);
    expect(zones[zones.length - 1]?.to).toBe(Z_MAX);
    zones.slice(1).forEach((z, i) => expect(z.from).toBe(zones[i]?.to));
  };

  it('covers the whole scale with no gaps', () => {
    covers('wfa');
    covers('lhfa');
    covers('wflh');
  });

  it('matches the WHO cut-offs used by the engine', () => {
    expect(zonesFor('lhfa').map((z) => [z.from, z.tone])).toEqual([
      [Z_MIN, 'red'], [-3, 'amber'], [-2, 'green'], [2, 'green-soft'],
    ]);
    expect(zonesFor('wflh').map((z) => [z.from, z.tone])).toEqual([
      [Z_MIN, 'red'], [-3, 'amber'], [-2, 'green'], [1, 'yellow'], [2, 'amber'], [3, 'red'],
    ]);
  });

  it('labels +1 only on weight-for-length/height', () => {
    expect(ticksFor('wfa')).toEqual([-3, -2, 0, 2, 3]);
    expect(ticksFor('wflh')).toContain(1);
  });
});
