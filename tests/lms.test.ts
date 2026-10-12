// Group (b) and the formulas. Expected values are worked by hand from the WHO formulas
// on synthetic L/M/S rows, so they do not depend on any WHO file.
import { describe, expect, it } from 'vitest';
import { lmsZ, restrictedZ, sdLine } from '../web/src/growth/lms';
import { percentile } from '../web/src/growth/bands';

const TOL = 0.001;
const L1 = { L: 1, M: 10, S: 0.1 }; // z = (x - 10) / 1
const L0 = { L: 0, M: 10, S: 0.1 }; // z = ln(x/10) / 0.1
const LNEG = { L: -0.5, M: 10, S: 0.1 };

describe('lmsZ', () => {
  it('L = 1 is a plain standardised distance', () => {
    expect(lmsZ(12, L1)).toBeCloseTo(2, 6);
    expect(lmsZ(10, L1)).toBe(0);
  });
  it('L = 0 uses the log formula', () => {
    expect(lmsZ(10 * Math.exp(0.1), L0)).toBeCloseTo(1, 9);
    expect(lmsZ(10 * Math.exp(-0.3), L0)).toBeCloseTo(-3, 9);
  });
  it('negative L: ((x/M)^L - 1) / (L*S), worked by hand', () => {
    // x = 10 * 1.21^(-2) with L = -0.5 gives (x/M)^L = 1.21^1 -> (1.21 - 1)/(-0.05)
    const x = 10 * Math.pow(1.21, -2);
    expect(lmsZ(x, LNEG)).toBeCloseTo(-4.2, 9);
  });
});

describe('sdLine', () => {
  it('is the inverse of lmsZ for k = -3..3 (L = 1, 0 and negative)', () => {
    for (const row of [L1, L0, LNEG]) {
      for (let k = -3; k <= 3; k++) {
        expect(Math.abs(lmsZ(sdLine(k, row), row) - k)).toBeLessThan(1e-9);
      }
    }
  });
  it('L = 1: M * (1 + S*k)', () => {
    expect(sdLine(2, L1)).toBeCloseTo(12, 9);
  });
});

describe('restrictedZ (group b)', () => {
  it('is identical to the plain z inside +-3', () => {
    expect(restrictedZ(12, L1)).toBeCloseTo(2, 9);
    expect(restrictedZ(8, L1)).toBeCloseTo(-2, 9);
  });
  it('above +3: 3 + (x - SD3) / (SD3 - SD2); L = 1 worked by hand', () => {
    // SD3 = 13, SD2 = 12, so x = 14.5 -> 3 + 1.5 = 4.5 (plain z would be 4.5 too for L = 1,
    // so use L = -0.5 below where the two differ).
    expect(Math.abs(restrictedZ(14.5, L1) - 4.5)).toBeLessThan(TOL);
    const sd3 = sdLine(3, LNEG);
    const sd2 = sdLine(2, LNEG);
    const x = sd3 + 0.5 * (sd3 - sd2);
    expect(Math.abs(restrictedZ(x, LNEG) - 3.5)).toBeLessThan(TOL);
    expect(lmsZ(x, LNEG)).not.toBeCloseTo(3.5, 2); // the plain z really is different
  });
  it('below -3: -3 + (x - SD3neg) / (SD2neg - SD3neg)', () => {
    const sd3 = sdLine(-3, LNEG);
    const sd2 = sdLine(-2, LNEG);
    const x = sd3 - 1.5 * (sd2 - sd3);
    expect(Math.abs(restrictedZ(x, LNEG) - -4.5)).toBeLessThan(TOL);
  });
  it('exactly on SD3 gives 3', () => {
    expect(Math.abs(restrictedZ(sdLine(3, LNEG), LNEG) - 3)).toBeLessThan(TOL);
    expect(Math.abs(restrictedZ(sdLine(-3, LNEG), LNEG) - -3)).toBeLessThan(TOL);
  });
});

describe('percentile', () => {
  it('matches standard normal values (A&S 26.2 table)', () => {
    expect(percentile(0)).toBeCloseTo(50, 5);
    expect(percentile(1)).toBeCloseTo(84.1345, 3);
    expect(percentile(-2)).toBeCloseTo(2.275, 3);
    expect(percentile(3)).toBeCloseTo(99.865, 3);
  });
  it('is symmetric and bounded', () => {
    expect(percentile(1.7) + percentile(-1.7)).toBeCloseTo(100, 5);
    expect(percentile(8)).toBeLessThanOrEqual(100);
    expect(percentile(-8)).toBeGreaterThanOrEqual(0);
  });
});
