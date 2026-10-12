import type { Assessment, GrowthInput, IndicatorResult } from '../growth/types';
import { unadjustedLhfa } from './correction';
import { h, ltr, type Child } from './dom';
import { fixed, signed } from './format';
import { icon } from './icons';
import { t } from './i18n';

/** The "How this was calculated" fold: entered, adjusted, table, key, z, percentile. */
export function renderCalc(a: Assessment, input: GrowthInput): HTMLElement {
  return h(
    'details',
    { class: 'fold', 'data-testid': 'calc-fold' },
    h('summary', {}, h('span', { class: 'fold-icon' }, icon('calc')), h('span', {}, t('calc.title'))),
    h(
      'div',
      { class: 'fold-body' },
      h('p', { class: 'muted' }, t('calc.intro')),
      lengthSteps(a, input),
      ...a.indicators.map((r) => indicatorCalc(r, input)),
      h('p', { class: 'hint' }, t('calc.zHelp')),
      h('p', { class: 'hint' }, t('calc.percentileHelp')),
    ),
  );
}

function row(label: string, value: Child, extra = ''): HTMLElement {
  return h('div', { class: `row ${extra}`.trim() }, h('dt', {}, label), h('dd', {}, value));
}

/** A number with its unit; only the number is isolated left-to-right, so Arabic reads "78.0 سم". */
function qty(n: string, unit: string): HTMLElement {
  return h('span', {}, ltr(n), ` ${unit}`);
}

/** One decimal, or two when the value has hundredths (70.96 must not show as 71.0). */
function cm(n: number): HTMLElement {
  const digits = Number.isInteger(Math.round(n * 100) / 10) ? 1 : 2;
  return qty(fixed(n, digits), t('unit.cm'));
}

function adjustNote(a: Assessment): string {
  if (a.adjustmentCm > 0) return t('calc.adjust.plus');
  if (a.adjustmentCm < 0) return t('calc.adjust.minus');
  return t('calc.adjust.none');
}

function lengthSteps(a: Assessment, input: GrowthInput): HTMLElement {
  const adjustment = qty(signed(a.adjustmentCm, 1), t('unit.cm'));
  return h(
    'dl',
    { class: 'rows steps' },
    row(t('calc.age'), qty(String(a.ageDays), t('unit.days'))),
    row(t('calc.entered'), h('span', {}, cm(a.measuredCm), ` (${t(`calc.measuredAs.${input.position}`)})`)),
    row(t('calc.adjustment'), h('span', {}, adjustment, h('span', { class: 'note' }, adjustNote(a))), 'adjust'),
    row(t('calc.adjusted'), cm(a.adjustedCm), 'total'),
    withoutCorrection(a, input),
  );
}

/** Length-for-age as it would read if the 0.7 cm correction were skipped. */
function withoutCorrection(a: Assessment, input: GrowthInput): HTMLElement | null {
  const before = unadjustedLhfa(a, input);
  const after = a.indicators.find((r) => r.id === 'lhfa');
  if (!before?.band || before.z === null || !after?.band) return null;
  const changed = before.band !== after.band;
  const value = h('span', {}, ltr(`z ${fixed(before.z, 2)}`), ` · ${t(`band.${before.band}`)}`,
    changed ? h('span', { class: 'note' }, t('calc.without.changed', { band: t(`band.${after.band}`) })) : null);
  const el = row(t('calc.without'), value, changed ? 'adjust changed' : 'adjust');
  el.setAttribute('data-testid', 'calc-without-correction');
  return el;
}

function valueUsed(r: IndicatorResult): HTMLElement {
  return r.id === 'lhfa' ? cm(r.value) : qty(fixed(r.value, 2), t('unit.kg'));
}

function lookupKey(r: IndicatorResult): HTMLElement {
  const byAge = r.table === 'wfa' || r.table === 'lhfa';
  return byAge ? qty(String(r.lookupKey), t('unit.days')) : cm(r.lookupKey / 10);
}

function percentileText(r: IndicatorResult): Child {
  if (r.percentile !== null) return ltr(`${fixed(r.percentile, 1)}%`);
  return r.status === 'implausible' ? t('calc.notShown') : t('calc.noResult');
}

function indicatorCalc(r: IndicatorResult, input: GrowthInput): HTMLElement {
  const table = t('calc.tableWithSex', { table: t(`table.${r.table}`), sex: t(`calc.sex.${input.sex}`) });
  // Implausible values get no number on screen: re-measure first (brief, Step 2 item 8).
  const z = r.status !== 'ok' || r.z === null ? percentileText(r) : ltr(fixed(r.z, 2));
  return h(
    'section',
    { class: 'calc-ind' },
    h('h4', {}, t(`ind.${r.id}`)),
    h(
      'dl',
      { class: 'rows' },
      row(t('calc.table'), table),
      row(t('calc.value'), valueUsed(r)),
      row(t('calc.lookup'), lookupKey(r)),
      row(t('calc.z'), z, 'total'),
      row(t('calc.percentile'), percentileText(r)),
    ),
    r.status === 'ok' ? null : h('p', { class: 'note' }, t(`status.${r.status}`)),
  );
}
