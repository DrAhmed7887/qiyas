// The growth engine: validates, adjusts the length, looks up WHO tables, and returns one Assessment.
import type {
  Assess, Assessment, GrowthInput, IndicatorId, IndicatorResult, Sex, TableId,
} from './types';
import { restrictedZ, lmsZ } from './lms';
import { lookupRow } from './tables';
import { isImplausible, hasRedFlag } from './flags';
import { bandFor, overallUrgency, percentile } from './bands';
import {
  adjustLength, bodyErrors, lengthAdjustment, lengthKey, resolveAge, wflhTable,
} from './measurement';

interface Lookup {
  readonly id: IndicatorId;
  readonly table: TableId;
  readonly value: number;
  readonly lookupKey: number;
}

/** One indicator: table lookup, z-score (restricted for wfa and wflh), flag, band, percentile. */
function evaluate(sex: Sex, { id, table, value, lookupKey }: Lookup): IndicatorResult {
  const base = { id, table, value, lookupKey };
  const row = lookupRow(table, sex, lookupKey);
  if (!row) return { ...base, z: null, percentile: null, band: null, status: 'not_applicable' };
  const z = id === 'lhfa' ? lmsZ(value, row) : restrictedZ(value, row);
  if (isImplausible(id, z)) return { ...base, z, percentile: null, band: null, status: 'implausible' };
  return { ...base, z, percentile: percentile(z), band: bandFor(id, z), status: 'ok' };
}

function lookups(ageDays: number, weightKg: number, adjustedCm: number): ReadonlyArray<Lookup> {
  return [
    { id: 'wfa', table: 'wfa', value: weightKg, lookupKey: ageDays },
    { id: 'lhfa', table: 'lhfa', value: adjustedCm, lookupKey: ageDays },
    { id: 'wflh', table: wflhTable(ageDays), value: weightKg, lookupKey: lengthKey(adjustedCm) },
  ];
}

export const assess: Assess = (input: GrowthInput) => {
  const age = resolveAge(input);
  const errors = [...age.errors, ...bodyErrors(input)];
  if (age.ageDays === undefined || errors.length > 0) return { ok: false, errors };

  const ageDays = age.ageDays;
  const adjustmentCm = lengthAdjustment(ageDays, input.position);
  const adjustedCm = adjustLength(input.lengthCm, adjustmentCm);
  const indicators = lookups(ageDays, input.weightKg, adjustedCm).map((l) => evaluate(input.sex, l));
  const urgent = hasRedFlag(input.redFlags);

  const result: Assessment = {
    ok: true,
    ageDays,
    measuredCm: input.lengthCm,
    adjustmentCm,
    adjustedCm,
    indicators,
    remeasure: indicators.some((i) => i.status === 'implausible'),
    urgent,
    overall: overallUrgency(urgent, indicators),
  };
  return result;
};
