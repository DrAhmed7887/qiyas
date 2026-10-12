// Shared contract between the growth engine and the UI.
// The engine (web/src/growth/*) implements `assess`; the UI only reads these types.

export type Sex = 'boys' | 'girls';
export type Position = 'lying' | 'standing';

export interface RedFlags {
  oedema: boolean; // swelling of both feet
  weakOrNotFeeding: boolean; // very weak, not feeding, or unusually sleepy
  recentWeightLoss: boolean; // has lost weight recently
}

export interface GrowthInput {
  sex: Sex;
  dobISO?: string; // date of birth, YYYY-MM-DD (main path)
  visitISO?: string; // visit date, YYYY-MM-DD (defaults to today in the UI)
  ageMonths?: number; // used only when dobISO is missing
  weightKg: number;
  lengthCm: number; // as measured, before the 0.7 cm adjustment
  position: Position;
  redFlags: RedFlags;
}

export type IndicatorId = 'wfa' | 'lhfa' | 'wflh';
export type TableId = 'wfa' | 'lhfa' | 'wfl' | 'wfh';

export type Band =
  | 'severely_low'
  | 'low'
  | 'normal'
  | 'risk_overweight' // wflh only, z > +1
  | 'overweight' // wflh only, z > +2
  | 'obesity'; // wflh only, z > +3

export type IndicatorStatus = 'ok' | 'implausible' | 'not_applicable';

export interface IndicatorResult {
  id: IndicatorId;
  table: TableId; // which WHO table was used
  value: number; // the X fed to the table: kg for wfa/wflh, adjusted cm for lhfa
  lookupKey: number; // age in days (wfa, lhfa) or length in mm (wfl, wfh)
  z: number | null; // final z (restricted where it applies); null unless status is 'ok' or 'implausible'
  percentile: number | null; // 0-100, only when status is 'ok'
  band: Band | null; // only when status is 'ok'
  status: IndicatorStatus;
}

// Most urgent first. 'urgent' comes only from red flags.
// 'see_soon': any severely_low or obesity band. 'check': any low, risk_overweight or overweight band,
// or any implausible value (a re-measure is never 'routine').
export type Overall = 'urgent' | 'see_soon' | 'check' | 'routine';

export type ValidationError =
  | 'age_missing'
  | 'age_range' // outside 0-1856 days
  | 'visit_before_dob'
  | 'weight_range' // outside 0.9-58 kg
  | 'length_range'; // outside 38-150 cm

export interface Assessment {
  ok: true;
  ageDays: number;
  measuredCm: number;
  adjustmentCm: 0 | 0.7 | -0.7;
  adjustedCm: number;
  indicators: IndicatorResult[]; // always wfa, lhfa, wflh in that order
  remeasure: boolean; // any indicator implausible
  urgent: boolean; // any red flag is yes; independent of remeasure
  overall: Overall;
}

export interface Rejected {
  ok: false;
  errors: ValidationError[];
}

export type AssessResult = Assessment | Rejected;

// Implemented in web/src/growth/index.ts
export type Assess = (input: GrowthInput) => AssessResult;
