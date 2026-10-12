import type { Assessment, Band, GrowthInput, IndicatorResult } from '../growth/types';
import { renderCalc } from './calc';
import { h } from './dom';
import { t } from './i18n';

const BAND_GLYPH: Readonly<Record<Band, string>> = {
  severely_low: '▼▼',
  low: '▼',
  normal: '●',
  risk_overweight: '▲',
  overweight: '▲▲',
  obesity: '▲▲▲',
};

const SIGNS: ReadonlyArray<readonly [keyof GrowthInput['redFlags'], string]> = [
  ['oedema', 'urgent.sign.oedema'],
  ['weakOrNotFeeding', 'urgent.sign.weak'],
  ['recentWeightLoss', 'urgent.sign.loss'],
];

/** Draws the result card: urgent, re-measure, measurement, meaning, calculation. */
export function renderResult(container: HTMLElement, input: GrowthInput, a: Assessment): void {
  const blocks: ReadonlyArray<HTMLElement | null> = [
    h('h2', { class: 'card-title' }, t('result.title')),
    a.urgent ? urgentBlock(input) : null,
    a.remeasure ? remeasureBlock() : null,
    measurementBlock(a),
    meaningBlock(a),
    renderCalc(a, input),
  ];
  container.replaceChildren(...blocks.filter((b): b is HTMLElement => b !== null));
  container.hidden = false;
}

function urgentBlock(input: GrowthInput): HTMLElement {
  const signs = SIGNS.filter(([flag]) => input.redFlags[flag]).map(([, key]) => h('li', {}, t(key)));
  return h(
    'section',
    { class: 'block block-urgent', 'aria-labelledby': 'urgent-h' },
    h('h3', { id: 'urgent-h' }, t('urgent.title')),
    h('p', {}, t('urgent.body')),
    h('p', { class: 'strong' }, t('urgent.signs')),
    h('ul', {}, ...signs),
  );
}

function remeasureBlock(): HTMLElement {
  return h(
    'section',
    { class: 'block block-remeasure', 'aria-labelledby': 'remeasure-h' },
    h('h3', { id: 'remeasure-h' }, t('remeasure.title')),
    h('p', {}, t('remeasure.body')),
    h('p', { class: 'how' }, t('remeasure.how')),
  );
}

function measurementBlock(a: Assessment): HTMLElement {
  return h(
    'section',
    { class: 'block', 'aria-labelledby': 'measure-h' },
    h('h3', { id: 'measure-h' }, t('measure.title')),
    h('p', { class: 'muted' }, t('measure.note')),
    h('ul', { class: 'indicators' }, ...a.indicators.map(indicatorItem)),
  );
}

function indicatorItem(r: IndicatorResult): HTMLElement {
  return h(
    'li',
    { class: `indicator status-${r.status}` },
    h('h4', {}, t(`ind.${r.id}`)),
    h('p', { class: 'muted q' }, t(`ind.${r.id}.q`)),
    chip(r),
    h('p', { class: 'msg' }, message(r)),
  );
}

function chip(r: IndicatorResult): HTMLElement {
  if (r.status === 'ok' && r.band) {
    return h(
      'span',
      { class: `chip band-${r.band}` },
      h('span', { class: 'glyph', 'aria-hidden': 'true' }, BAND_GLYPH[r.band]),
      t(`band.${r.band}`),
    );
  }
  const glyph = r.status === 'implausible' ? '!' : '–';
  return h(
    'span',
    { class: `chip chip-${r.status}` },
    h('span', { class: 'glyph', 'aria-hidden': 'true' }, glyph),
    t(`status.${r.status}.chip`),
  );
}

function message(r: IndicatorResult): string {
  if (r.status === 'ok' && r.band) return t(`msg.${r.id}.${r.band}`);
  return t(`status.${r.status}`);
}

function meaningBlock(a: Assessment): HTMLElement {
  const key = a.remeasure && a.overall === 'routine' ? 'routine_remeasure' : a.overall;
  return h(
    'section',
    { class: 'block block-meaning' },
    h('h3', {}, t('meaning.title')),
    h('p', {}, t(`meaning.${key}`)),
    h('h3', {}, t('see.title')),
    h('p', { class: 'strong' }, t(`see.${key}`)),
  );
}
