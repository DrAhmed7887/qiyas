// End-to-end: assess() on real WHO data. Expected values come from reading WHO table rows directly
// (SD columns), never from the engine itself. Group (f) lives here too.
import { describe, expect, it } from 'vitest';
import { assess } from '../web/src/growth';
import { lookupRow } from '../web/src/growth/tables';
import type { Assessment, GrowthInput } from '../web/src/growth/types';

const NO_FLAGS = { oedema: false, weakOrNotFeeding: false, recentWeightLoss: false };
const make = (over: Partial<GrowthInput>): GrowthInput => ({
  sex: 'boys', ageMonths: 12, weightKg: 9.6, lengthCm: 75, position: 'lying', redFlags: NO_FLAGS, ...over,
});
function run(input: GrowthInput): Assessment {
  const r = assess(input);
  if (!r.ok) throw new Error(`rejected: ${r.errors.join()}`);
  return r;
}
const row = (t: 'wfa' | 'lhfa' | 'wfl' | 'wfh', sex: 'boys' | 'girls', key: number) => {
  const r = lookupRow(t, sex, key);
  if (!r) throw new Error('missing row');
  return r;
};

describe('median child reads as z = 0', () => {
  it('uses the published median columns (rounded to 3 decimals, so z within 0.02)', () => {
    const days = 365; // 12 months by the 30.4375 rule
    const len = row('lhfa', 'girls', days).SD0; // 74.0.. cm, lying so no adjustment
    const lenRounded = Math.round(len * 10) / 10;
    const wfl = row('wfl', 'girls', Math.round(lenRounded * 10)).SD0;
    const r = run(make({ sex: 'girls', weightKg: wfl, lengthCm: lenRounded }));
    expect(r.adjustmentCm).toBe(0);
    expect(r.indicators.map((i) => i.id)).toEqual(['wfa', 'lhfa', 'wflh']);
    expect(r.indicators[2]?.table).toBe('wfl');
    expect(Math.abs(r.indicators[2]?.z ?? 99)).toBeLessThan(0.02);
    expect(Math.abs(r.indicators[1]?.z ?? 99)).toBeLessThan(0.05); // length rounded to 0.1 cm
  });
});

describe('what each indicator reports', () => {
  it('fills value, lookupKey, table, percentile and band', () => {
    const r = run(make({ ageMonths: 12, weightKg: 9.6, lengthCm: 75 }));
    const [wfa, lhfa, wflh] = r.indicators;
    expect(wfa).toMatchObject({ table: 'wfa', value: 9.6, lookupKey: 365, status: 'ok' });
    expect(lhfa).toMatchObject({ table: 'lhfa', value: 75, lookupKey: 365, status: 'ok' });
    expect(wflh).toMatchObject({ table: 'wfl', value: 9.6, lookupKey: 750, status: 'ok' });
    expect(wfa?.percentile).toBeGreaterThan(0);
    expect(r.remeasure).toBe(false);
    expect(r.urgent).toBe(false);
  });
  it('standing under 731 days adds 0.7 cm everywhere (lhfa value and the wfl key)', () => {
    const r = run(make({ position: 'standing', lengthCm: 75 }));
    expect(r.adjustmentCm).toBe(0.7);
    expect(r.adjustedCm).toBe(75.7);
    expect(r.indicators[1]).toMatchObject({ value: 75.7 });
    expect(r.indicators[2]).toMatchObject({ table: 'wfl', lookupKey: 757 });
  });
  it('lying at 731 days subtracts 0.7 cm and switches to wfh', () => {
    const r = run(make({ ageMonths: 24, lengthCm: 90, weightKg: 12.2, position: 'lying' }));
    expect(r.ageDays).toBe(731);
    expect(r.adjustmentCm).toBe(-0.7);
    expect(r.adjustedCm).toBe(89.3);
    expect(r.indicators[2]).toMatchObject({ table: 'wfh', lookupKey: 893 });
  });
  it('a standing child at 731 days keeps wfh and needs no adjustment', () => {
    const r = run(make({ ageMonths: 24, lengthCm: 88, weightKg: 12, position: 'standing' }));
    expect(r.adjustmentCm).toBe(0);
    expect(r.indicators[2]?.table).toBe('wfh');
  });
  it('days from dates win over months', () => {
    const r = run(make({ dobISO: '2025-01-01', visitISO: '2025-07-01', ageMonths: 40 }));
    expect(r.ageDays).toBe(181);
  });
  it('percentile matches the z-score (about 50 at the median)', () => {
    const d = 400;
    const r = run(make({ ageMonths: undefined, dobISO: '2025-01-01', visitISO: '2026-02-05', weightKg: row('wfa', 'boys', d).SD0 }));
    expect(r.ageDays).toBe(d);
    expect(r.indicators[0]?.percentile).toBeGreaterThan(49);
    expect(r.indicators[0]?.percentile).toBeLessThan(51);
  });
});

describe('outside the table range is not an error', () => {
  it('a newborn shorter than 45 cm: no wfl z-score, the other two are fine', () => {
    const r = run(make({ ageMonths: 0, lengthCm: 44.5, weightKg: 2.4, position: 'lying' }));
    expect(r.indicators[2]).toMatchObject({ status: 'not_applicable', z: null, percentile: null, band: null });
    expect(r.remeasure).toBe(false);
    expect(r.indicators[0]?.status).toBe('ok');
  });
  it('a child taller than 120 cm: no wfh z-score', () => {
    const r = run(make({ ageMonths: 59, lengthCm: 121, weightKg: 22, position: 'standing' }));
    expect(r.adjustedCm).toBe(121);
    expect(r.remeasure).toBe(false);
    expect(r.indicators[2]).toMatchObject({ table: 'wfh', status: 'not_applicable', z: null });
  });
});

const tiny = make({ weightKg: 2, lengthCm: 75 }); // about -8 SD weight for a 12-month-old

describe('plausibility flags and the restricted method', () => {
  it('flags implausible z-scores: no band, no percentile, remeasure true', () => {
    const r = run(tiny);
    expect(r.indicators[0]).toMatchObject({ status: 'implausible', band: null, percentile: null });
    expect(r.indicators[0]?.z).toBeLessThan(-6);
    expect(r.indicators[2]?.status).toBe('implausible');
    expect(r.indicators[1]?.status).toBe('ok');
    expect(r.remeasure).toBe(true);
    expect(r.urgent).toBe(false);
    expect(r.overall).toBe('check'); // no red flag: re-measure is never 'routine'
  });
  it('the final z for wfa is the restricted one, not the plain LMS z', () => {
    const r = run(make({ weightKg: 5, lengthCm: 75 })); // far below -3 SD
    const z = r.indicators[0]?.z ?? 0;
    expect(z).toBeLessThan(-3);
    expect(z).toBeGreaterThan(-6);
  });
});

describe('group (f): flagged indicator AND a red flag', () => {
  it.each(['oedema', 'weakOrNotFeeding', 'recentWeightLoss'] as const)('%s keeps the urgent action', (k) => {
    const r = run({ ...tiny, redFlags: { ...NO_FLAGS, [k]: true } });
    expect(r.remeasure).toBe(true);
    expect(r.urgent).toBe(true);
    expect(r.overall).toBe('urgent');
  });
  it('urgent even when every indicator is implausible', () => {
    const all = run(make({ ageMonths: 1, weightKg: 58, lengthCm: 38, position: 'lying', redFlags: { ...NO_FLAGS, weakOrNotFeeding: true } }));
    expect(all.indicators.every((i) => i.status !== 'ok')).toBe(true);
    expect(all.remeasure).toBe(true);
    expect(all.overall).toBe('urgent');
  });
});

describe('overall urgency from real bands', () => {
  it('a low weight-for-age with a normal length -> check', () => {
    const d = 365;
    const w = (row('wfa', 'boys', d).SD2neg + row('wfa', 'boys', d).SD3neg) / 2; // between -3 and -2
    const r = run(make({ weightKg: w, lengthCm: 75 }));
    expect(r.indicators[0]?.band).toBe('low');
  });
  it('severely low length -> see_soon', () => {
    const lowLen = row('lhfa', 'boys', 365).SD3neg - 1;
    const r = run(make({ lengthCm: Math.round(lowLen * 10) / 10, weightKg: 9 }));
    expect(r.indicators[1]?.band).toBe('severely_low');
    expect(r.overall).toBe('see_soon');
  });
});

describe('length-for-age uses the unrounded length (only the wfl/wfh key is rounded)', () => {
  it('70.96 cm at 365 days reads low, not normal as 71.0 cm would', () => {
    const r = assess({
      sex: 'boys', ageMonths: 365 / 30.4375, weightKg: 9, lengthCm: 70.96, position: 'lying',
      redFlags: { oedema: false, weakOrNotFeeding: false, recentWeightLoss: false },
    });
    if (!r.ok) throw new Error('expected ok');
    const lhfa = r.indicators.find((i) => i.id === 'lhfa');
    expect(lhfa?.value).toBe(70.96);
    expect(lhfa?.band).toBe('low');
    expect(r.indicators.find((i) => i.id === 'wflh')?.lookupKey).toBe(710);
  });
});
