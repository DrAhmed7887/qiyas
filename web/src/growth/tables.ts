// WHO expanded tables (public WHO data, unmodified values), indexed for exact lookup.
import type { Sex, TableId } from './types';
import type { LmsRow } from './lms';
import wfaBoys from '../../../data/who/wfa_boys.json';
import wfaGirls from '../../../data/who/wfa_girls.json';
import lhfaBoys from '../../../data/who/lhfa_boys.json';
import lhfaGirls from '../../../data/who/lhfa_girls.json';
import wflBoys from '../../../data/who/wfl_boys.json';
import wflGirls from '../../../data/who/wfl_girls.json';
import wfhBoys from '../../../data/who/wfh_boys.json';
import wfhGirls from '../../../data/who/wfh_girls.json';

export interface WhoFile {
  indicator: string;
  sex: string;
  key: string;
  source: string;
  columns: string[];
  rows: number[][];
}

const FILES: Readonly<Record<TableId, Readonly<Record<Sex, WhoFile>>>> = {
  wfa: { boys: wfaBoys, girls: wfaGirls },
  lhfa: { boys: lhfaBoys, girls: lhfaGirls },
  wfl: { boys: wflBoys, girls: wflGirls },
  wfh: { boys: wfhBoys, girls: wfhGirls },
};

/** Zip one array row with the file's column names into a typed row. */
export function toRow(columns: ReadonlyArray<string>, values: ReadonlyArray<number>): LmsRow {
  return Object.fromEntries(columns.map((c, i) => [c, values[i]])) as unknown as LmsRow;
}

function indexFile(file: WhoFile): ReadonlyMap<number, LmsRow> {
  return new Map(file.rows.map((values) => [values[0] as number, toRow(file.columns, values)]));
}

const INDEX: Readonly<Record<TableId, Readonly<Record<Sex, ReadonlyMap<number, LmsRow>>>>> = {
  wfa: { boys: indexFile(wfaBoys), girls: indexFile(wfaGirls) },
  lhfa: { boys: indexFile(lhfaBoys), girls: indexFile(lhfaGirls) },
  wfl: { boys: indexFile(wflBoys), girls: indexFile(wflGirls) },
  wfh: { boys: indexFile(wfhBoys), girls: indexFile(wfhGirls) },
};

/** Exact lookup, no interpolation. Undefined when the key is outside the table. */
export function lookupRow(table: TableId, sex: Sex, key: number): LmsRow | undefined {
  return INDEX[table][sex].get(key);
}

/** The raw WHO file, for tests and the "how this was calculated" view. */
export function whoFile(table: TableId, sex: Sex): WhoFile {
  return FILES[table][sex];
}
