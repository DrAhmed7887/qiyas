import type { GrowthInput, Position, RedFlags, Sex, ValidationError } from '../growth/types';
import { t } from './i18n';

export type FieldKey = 'sex' | 'age' | 'visit' | 'weight' | 'length' | 'position' | 'redflags';
/** Maps a field to the i18n key of its error message. */
export type FieldErrors = Readonly<Partial<Record<FieldKey, string>>>;

export interface ReadOutcome {
  readonly input: GrowthInput | null;
  readonly errors: FieldErrors;
}

const ENGINE_FIELD: Readonly<Record<ValidationError, FieldKey>> = {
  age_missing: 'age',
  age_range: 'age',
  visit_before_dob: 'visit',
  weight_range: 'weight',
  length_range: 'length',
};

export function todayISO(): string {
  const d = new Date();
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Accepts Western or Arabic-Indic digits and "," or "٫" as the decimal mark. */
export function parseNumber(raw: string): number | null {
  const s = raw
    .trim()
    .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 0x06f0))
    .replace(/[,٫]/g, '.');
  return /^\d+(\.\d+)?$/.test(s) ? Number(s) : null;
}

function field(form: HTMLFormElement, id: string): string {
  return form.querySelector<HTMLInputElement>(`#${id}`)?.value ?? '';
}

function radio(form: HTMLFormElement, name: string): string | null {
  return form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? null;
}

function readRedFlags(form: HTMLFormElement): RedFlags | null {
  const answers = ['oedema', 'weak', 'loss'].map((n) => radio(form, n));
  if (answers.some((a) => a === null)) return null;
  return {
    oedema: answers[0] === 'yes',
    weakOrNotFeeding: answers[1] === 'yes',
    recentWeightLoss: answers[2] === 'yes',
  };
}

function readAge(form: HTMLFormElement): { age: Partial<GrowthInput>; bad: boolean } {
  const dob = field(form, 'dob');
  if (dob !== '') return { age: { dobISO: dob }, bad: false };
  const raw = field(form, 'months').trim();
  if (raw === '') return { age: {}, bad: false };
  const months = parseNumber(raw);
  return months === null ? { age: {}, bad: true } : { age: { ageMonths: months }, bad: false };
}

/** Reads and syntax-checks the form. Range checks are left to assess(). */
export function readForm(form: HTMLFormElement): ReadOutcome {
  const sex = radio(form, 'sex') as Sex | null;
  const position = radio(form, 'position') as Position | null;
  const redFlags = readRedFlags(form);
  const weight = parseNumber(field(form, 'weight'));
  const length = parseNumber(field(form, 'length'));
  const { age, bad } = readAge(form);
  const visit = field(form, 'visit');

  const errors: FieldErrors = {
    ...(sex === null && { sex: 'err.sex' }),
    ...(bad && { age: 'err.number' }),
    ...(weight === null && { weight: 'err.number' }),
    ...(length === null && { length: 'err.number' }),
    ...(position === null && { position: 'err.position' }),
    ...(redFlags === null && { redflags: 'err.redflags' }),
  };
  if (Object.keys(errors).length > 0 || !sex || !position || !redFlags) {
    return { input: null, errors };
  }
  const input: GrowthInput = {
    sex,
    ...age,
    ...(visit !== '' && { visitISO: visit }),
    weightKg: weight ?? 0,
    lengthCm: length ?? 0,
    position,
    redFlags,
  };
  return { input, errors: {} };
}

function setRadio(form: HTMLFormElement, name: string, value: string): void {
  for (const el of form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`)) {
    el.checked = el.value === value;
  }
}

function setText(form: HTMLFormElement, id: string, value: string): void {
  const el = form.querySelector<HTMLInputElement>(`#${id}`);
  if (el) el.value = value;
}

const yesNo = (flag: boolean): string => (flag ? 'yes' : 'no');

export function fillForm(form: HTMLFormElement, input: GrowthInput): void {
  setRadio(form, 'sex', input.sex);
  setRadio(form, 'position', input.position);
  setRadio(form, 'oedema', yesNo(input.redFlags.oedema));
  setRadio(form, 'weak', yesNo(input.redFlags.weakOrNotFeeding));
  setRadio(form, 'loss', yesNo(input.redFlags.recentWeightLoss));
  setText(form, 'dob', input.dobISO ?? '');
  setText(form, 'months', input.ageMonths === undefined ? '' : String(input.ageMonths));
  setText(form, 'visit', input.visitISO ?? todayISO());
  setText(form, 'weight', String(input.weightKg));
  setText(form, 'length', String(input.lengthCm));
}

export function resetForm(form: HTMLFormElement): void {
  form.reset();
  setText(form, 'visit', todayISO());
}

/** Translates engine ValidationError codes into per-field message keys. */
export function engineErrorsToFields(codes: ReadonlyArray<ValidationError>): FieldErrors {
  const entries = codes
    .slice()
    .reverse() // earlier codes win when two share a field
    .map((code) => [ENGINE_FIELD[code], `err.${code}`] as const);
  return Object.fromEntries(entries) as FieldErrors;
}

/** Shows or hides the inline error under each field, in the current language. */
export function showErrors(form: HTMLFormElement, errors: FieldErrors): void {
  for (const wrapper of form.querySelectorAll<HTMLElement>('[data-field]')) {
    const key = errors[wrapper.dataset['field'] as FieldKey];
    const message = wrapper.querySelector<HTMLElement>('[data-error-for]');
    if (message) {
      message.textContent = key ? t(key) : '';
      message.hidden = !key;
    }
    wrapper.classList.toggle('invalid', Boolean(key));
    for (const input of wrapper.querySelectorAll('input')) {
      if (key) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
  }
}

export function focusFirstError(form: HTMLFormElement): void {
  form.querySelector<HTMLElement>('[data-field].invalid input')?.focus();
}
