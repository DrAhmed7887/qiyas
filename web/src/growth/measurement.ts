// Age, lying/standing adjustment, table choice and input validation.
import type { GrowthInput, Position, TableId, ValidationError } from './types';

export const DAYS_PER_MONTH = 30.4375;
export const MAX_AGE_DAYS = 1856; // 0-5 years, the span of the WHO tables
/** From this age (in days) a child is measured standing; below it, lying down. */
export const LYING_CUTOFF_DAYS = 731;
export const LENGTH_ADJUSTMENT_CM = 0.7;

// Qiyas input limits (ours, not WHO's).
export const WEIGHT_RANGE_KG = { min: 0.9, max: 58 } as const;
export const LENGTH_RANGE_CM = { min: 38, max: 150 } as const;

const MS_PER_DAY = 86_400_000;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** UTC midnight of a YYYY-MM-DD date, or undefined if it is not a real calendar date. */
function parseISODate(iso: string): number | undefined {
  const m = ISO_DATE.exec(iso);
  if (!m) return undefined;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = Date.UTC(y, mo - 1, d);
  const back = new Date(t);
  const real = back.getUTCFullYear() === y && back.getUTCMonth() === mo - 1 && back.getUTCDate() === d;
  return real ? t : undefined;
}

/** Whole days from birth to visit (UTC, so daylight saving cannot shift it). */
export function ageInDays(dobISO: string, visitISO: string): number | undefined {
  const dob = parseISODate(dobISO);
  const visit = parseISODate(visitISO);
  if (dob === undefined || visit === undefined) return undefined;
  return Math.round((visit - dob) / MS_PER_DAY);
}

export function monthsToDays(months: number): number {
  return Math.round(months * DAYS_PER_MONTH);
}

export function lengthAdjustment(ageDays: number, position: Position): 0 | 0.7 | -0.7 {
  if (ageDays < LYING_CUTOFF_DAYS && position === 'standing') return LENGTH_ADJUSTMENT_CM;
  if (ageDays >= LYING_CUTOFF_DAYS && position === 'lying') return -0.7;
  return 0;
}

/**
 * Adds the adjustment, keeping hundredths (80.1 + 0.7 is 80.8, not 80.80000000000001).
 * Only the wfl/wfh table key is rounded to 0.1 cm; length-for-age uses this value as is.
 */
export function adjustLength(measuredCm: number, adjustmentCm: number): number {
  return Math.round((measuredCm + adjustmentCm) * 100) / 100;
}

/** Weight-for-length below 731 days, weight-for-height from 731 days. Chosen by age only. */
export function wflhTable(ageDays: number): Extract<TableId, 'wfl' | 'wfh'> {
  return ageDays < LYING_CUTOFF_DAYS ? 'wfl' : 'wfh';
}

/** Table key for length/height: the nearest 0.1 cm, as whole millimetres. */
export function lengthKey(cm: number): number {
  return Math.round(cm * 10);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface AgeResult {
  readonly ageDays?: number;
  readonly errors: ReadonlyArray<ValidationError>;
}

/** Date of birth is the main path; months are used only when no date of birth is given. */
export function resolveAge(input: GrowthInput): AgeResult {
  const days = input.dobISO
    ? ageInDays(input.dobISO, input.visitISO ?? todayISO())
    : input.ageMonths !== undefined && Number.isFinite(input.ageMonths)
      ? monthsToDays(input.ageMonths)
      : undefined;
  if (days === undefined) return { errors: ['age_missing'] };
  if (days < 0 && input.dobISO) return { errors: ['visit_before_dob'] };
  if (days < 0 || days > MAX_AGE_DAYS) return { errors: ['age_range'] };
  return { ageDays: days, errors: [] };
}

const outside = (v: number, r: { min: number; max: number }) => !(v >= r.min && v <= r.max);

/** Weight and length checks (NaN counts as out of range). */
export function bodyErrors(input: GrowthInput): ValidationError[] {
  return [
    ...(outside(input.weightKg, WEIGHT_RANGE_KG) ? (['weight_range'] as const) : []),
    ...(outside(input.lengthCm, LENGTH_RANGE_CM) ? (['length_range'] as const) : []),
  ];
}
