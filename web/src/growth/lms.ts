// The WHO LMS method: pure maths, no tables and no dates in here.
// Reference: WHO Child Growth Standards, Methods and development (2006), ch. 4.

/** One row of a WHO expanded table, keyed by column name. */
export interface LmsRow {
  key: number; // age in days, or length/height in mm
  L: number;
  M: number;
  S: number;
  SD3neg: number;
  SD2neg: number;
  SD1neg: number;
  SD0: number;
  SD1: number;
  SD2: number;
  SD3: number;
}

/** z = ((X/M)^L - 1) / (L*S); when L = 0, z = ln(X/M) / S. */
export function lmsZ(x: number, row: Pick<LmsRow, 'L' | 'M' | 'S'>): number {
  const { L, M, S } = row;
  if (L === 0) return Math.log(x / M) / S;
  return (Math.pow(x / M, L) - 1) / (L * S);
}

/** The measurement that sits exactly k SDs from the median: M * (1 + L*S*k)^(1/L). */
export function sdLine(k: number, row: Pick<LmsRow, 'L' | 'M' | 'S'>): number {
  const { L, M, S } = row;
  if (L === 0) return M * Math.exp(S * k);
  return M * Math.pow(1 + L * S * k, 1 / L);
}

/**
 * WHO's restricted method, used for weight-for-age and weight-for-length/height only.
 * Beyond +-3 SD the z-score continues linearly in the units of the measurement, so
 * very large or very small weights do not produce absurd z-scores.
 * The SD lines come from L, M and S (as WHO's own macros do), not from the rounded columns.
 */
export function restrictedZ(x: number, row: Pick<LmsRow, 'L' | 'M' | 'S'>): number {
  const z = lmsZ(x, row);
  if (z > 3) {
    const sd3 = sdLine(3, row);
    return 3 + (x - sd3) / (sd3 - sdLine(2, row));
  }
  if (z < -3) {
    const sd3 = sdLine(-3, row);
    return -3 + (x - sd3) / (sdLine(-2, row) - sd3);
  }
  return z;
}
