// Group (e): every validation error, plus the edges that must still be accepted.
import { describe, expect, it } from 'vitest';
import { assess } from '../web/src/growth';
import type { GrowthInput } from '../web/src/growth/types';

const base: GrowthInput = {
  sex: 'girls', dobISO: '2025-01-15', visitISO: '2026-01-15',
  weightKg: 9.5, lengthCm: 76, position: 'lying',
  redFlags: { oedema: false, weakOrNotFeeding: false, recentWeightLoss: false },
};
const errors = (over: Partial<GrowthInput>) => {
  const r = assess({ ...base, ...over });
  return r.ok ? [] : r.errors;
};

describe('validation errors', () => {
  it('age_missing: no dob and no months', () => {
    expect(errors({ dobISO: undefined, ageMonths: undefined })).toContain('age_missing');
  });
  it('age_missing: an unreadable date', () => {
    expect(errors({ dobISO: '15/01/2025' })).toContain('age_missing');
  });
  it('visit_before_dob', () => {
    expect(errors({ visitISO: '2025-01-14' })).toContain('visit_before_dob');
  });
  it('age_range: 1857 days is too old, 1856 is fine', () => {
    expect(errors({ dobISO: '2021-01-01', visitISO: '2026-02-01' })).toContain('age_range'); // 1857 days
    expect(errors({ dobISO: '2021-01-01', visitISO: '2026-01-31' })).not.toContain('age_range'); // 1856 days
    expect(errors({ dobISO: undefined, ageMonths: 61 })).toContain('age_range');
    expect(errors({ dobISO: undefined, ageMonths: -1 })).toContain('age_range');
  });
  it('weight_range: outside 0.9-58 kg', () => {
    expect(errors({ weightKg: 0.89 })).toContain('weight_range');
    expect(errors({ weightKg: 58.01 })).toContain('weight_range');
    expect(errors({ weightKg: Number.NaN })).toContain('weight_range');
    expect(errors({ weightKg: 0.9 })).not.toContain('weight_range');
    expect(errors({ weightKg: 58 })).not.toContain('weight_range');
  });
  it('length_range: outside 38-150 cm', () => {
    expect(errors({ lengthCm: 37.9 })).toContain('length_range');
    expect(errors({ lengthCm: 150.1 })).toContain('length_range');
    expect(errors({ lengthCm: Number.NaN })).toContain('length_range');
    expect(errors({ lengthCm: 38 })).not.toContain('length_range');
    expect(errors({ lengthCm: 150 })).not.toContain('length_range');
  });
  it('reports every problem at once', () => {
    expect(errors({ weightKg: 100, lengthCm: 10, visitISO: '2024-01-01' })).toEqual([
      'visit_before_dob', 'weight_range', 'length_range',
    ]);
  });
  it('accepts the age from months when no dob is given', () => {
    const r = assess({ ...base, dobISO: undefined, visitISO: undefined, ageMonths: 12 });
    expect(r.ok && r.ageDays).toBe(365);
  });
  it('defaults the visit date to today when only a dob is given', () => {
    const today = new Date().toISOString().slice(0, 10);
    const r = assess({ ...base, dobISO: today, visitISO: undefined, lengthCm: 50, weightKg: 3.3 });
    expect(r.ok && r.ageDays).toBe(0);
  });
});
