// Group (a): table-driven check against the real WHO files in data/who.
// For every 30th row we feed each SD column of that row back through the engine's z function.
//
// The WHO files print the SD columns rounded to 3 decimals, so an exact +-0.001 z is not always
// reachable (a rounding error of 0.0005 in a column is 0.0005 / (spacing of the SD lines) in z).
// So there are two checks:
//   (a1) the printed columns, with a tolerance of the proven rounding bound (half a unit of the
//        3rd decimal divided by the gap to the neighbouring SD line, plus 1e-4 for the rounded L, M, S).
//        The largest error actually seen is printed by the last test and reported to the owner.
//   (a2) SD lines recomputed unrounded from L, M, S: must come back as -3..3 within +-0.001.
import { describe, expect, it } from 'vitest';
import { restrictedZ, lmsZ, sdLine, type LmsRow } from '../web/src/growth/lms';
import { toRow, whoFile } from '../web/src/growth/tables';
import type { Sex, TableId } from '../web/src/growth/types';

const TABLES: TableId[] = ['wfa', 'lhfa', 'wfl', 'wfh'];
const SEXES: Sex[] = ['boys', 'girls'];
const KS = [-3, -2, -1, 0, 1, 2, 3] as const;
const COL: Record<number, keyof LmsRow> = {
  [-3]: 'SD3neg', [-2]: 'SD2neg', [-1]: 'SD1neg', 0: 'SD0', 1: 'SD1', 2: 'SD2', 3: 'SD3',
};

function zFor(table: TableId, x: number, row: LmsRow): number {
  // Restricted method for weight-for-age and weight-for-length/height only.
  return table === 'lhfa' ? lmsZ(x, row) : restrictedZ(x, row);
}

function sampledRows(table: TableId, sex: Sex): LmsRow[] {
  const f = whoFile(table, sex);
  return f.rows.filter((_, i) => i % 30 === 0).map((r) => toRow(f.columns, r));
}

/** Largest |z - k| over the printed SD columns and the rounding bound that explains it. */
function checkPrinted(table: TableId, sex: Sex) {
  let maxErr = 0;
  let worstExcess = 0;
  for (const row of sampledRows(table, sex)) {
    for (const k of KS) {
      const x = row[COL[k] as keyof LmsRow] as number;
      const err = Math.abs(zFor(table, x, row) - k);
      // z moves by (gap between SD lines) per unit z; half a unit of the 3rd decimal is the rounding.
      const gap = Math.abs(sdLine(Math.min(k + 1, 3), row) - sdLine(Math.min(k + 1, 3) - 1, row));
      const bound = 0.0005 / gap + 1e-4; // 1e-4: L, M, S are printed rounded too
      maxErr = Math.max(maxErr, err);
      worstExcess = Math.max(worstExcess, err - bound);
    }
  }
  return { maxErr, worstExcess };
}

describe('(a1) printed SD columns round-trip within the rounding of the columns', () => {
  for (const table of TABLES) {
    for (const sex of SEXES) {
      it(`${table} ${sex}`, () => {
        expect(checkPrinted(table, sex).worstExcess).toBeLessThanOrEqual(0);
      });
    }
  }
  it('reports the largest raw error seen across all tables', () => {
    const all = TABLES.flatMap((t) => SEXES.map((s) => checkPrinted(t, s).maxErr));
    const max = Math.max(...all);
    console.info(`MAX_PRINTED_COLUMN_ERROR_Z=${max.toFixed(5)}`);
    expect(max).toBeLessThan(0.02);
  });
});

describe('(a2) SD lines recomputed from L, M, S round-trip within +-0.001', () => {
  for (const table of TABLES) {
    for (const sex of SEXES) {
      it(`${table} ${sex}`, () => {
        for (const row of sampledRows(table, sex)) {
          for (const k of KS) {
            expect(Math.abs(zFor(table, sdLine(k, row), row) - k)).toBeLessThanOrEqual(0.001);
          }
        }
      });
    }
  }
});

describe('the files themselves', () => {
  it('have the expected row counts and keys', () => {
    expect(whoFile('wfa', 'boys').rows).toHaveLength(1857); // days 0..1856
    expect(whoFile('lhfa', 'girls').rows).toHaveLength(1857);
    expect(whoFile('wfl', 'boys').rows).toHaveLength(651); // 45.0..110.0 cm in 0.1 steps
    expect(whoFile('wfh', 'girls').rows).toHaveLength(551); // 65.0..120.0 cm
  });
});
