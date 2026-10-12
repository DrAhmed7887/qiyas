// The three synthetic demo profiles behave as the demo script says they do.
import { describe, expect, it } from 'vitest';
import { assess } from '../web/src/growth';
import { DEMO_PROFILES } from '../web/src/demo/profiles';
import type { Assessment } from '../web/src/growth/types';

function profile(id: string) {
  const p = DEMO_PROFILES.find((d) => d.id === id);
  if (!p) throw new Error(`no profile ${id}`);
  return p.input;
}
function run(input: ReturnType<typeof profile>): Assessment {
  const r = assess(input);
  if (!r.ok) throw new Error(r.errors.join());
  return r;
}

describe('demo profiles', () => {
  it('has exactly correction, redflag and normal', () => {
    expect(DEMO_PROFILES.map((d) => d.id)).toEqual(['correction', 'redflag', 'normal']);
  });

  it('correction: the 0.7 cm adjustment moves length-for-age across the -2 cut-off', () => {
    const input = profile('correction');
    const withAdjustment = run(input);
    const asIfLying = run({ ...input, position: 'lying' }); // same numbers, no adjustment
    expect(withAdjustment.adjustmentCm).toBe(0.7);
    expect(asIfLying.adjustmentCm).toBe(0);
    expect(asIfLying.indicators[1]?.band).toBe('low');
    expect(withAdjustment.indicators[1]?.band).toBe('normal');
    expect(withAdjustment.indicators.every((i) => i.band === 'normal')).toBe(true);
  });

  it('redflag: an implausible indicator plus oedema is still urgent and asks for a re-measure', () => {
    const r = run(profile('redflag'));
    expect(r.indicators.some((i) => i.status === 'implausible')).toBe(true);
    expect(r.remeasure).toBe(true);
    expect(r.urgent).toBe(true);
    expect(r.overall).toBe('urgent');
  });

  it('normal: all indicators normal, no flags, routine', () => {
    const r = run(profile('normal'));
    expect(r.indicators.every((i) => i.status === 'ok' && i.band === 'normal')).toBe(true);
    expect(r.remeasure).toBe(false);
    expect(r.urgent).toBe(false);
    expect(r.overall).toBe('routine');
  });
});
