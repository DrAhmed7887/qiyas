import type { Assessment, Band, GrowthInput, IndicatorResult } from '../growth/types';
import { renderCalc } from './calc';
import { unadjustedLhfa } from './correction';
import { h } from './dom';
import { t } from './i18n';
import { icon, type IconName } from './icons';
import { renderZScale, settleZScales } from './zscale';

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
    measurementBlock(a, input),
    meaningBlock(a),
    renderCalc(a, input),
  ];
  container.replaceChildren(...blocks.filter((b): b is HTMLElement => b !== null));
  container.hidden = false;
  settleZScales(container);
}

/** A block heading with its icon; the text always carries the meaning, the icon only helps. */
function blockHead(id: string, name: IconName, text: string): HTMLElement {
  return h('h3', { id, class: 'block-head' }, h('span', { class: 'block-icon' }, icon(name)), h('span', {}, text));
}

function urgentBlock(input: GrowthInput): HTMLElement {
  const signs = SIGNS.filter(([flag]) => input.redFlags[flag]).map(([, key]) => h('li', {}, t(key)));
  return h(
    'section',
    { class: 'block block-urgent', 'aria-labelledby': 'urgent-h', 'data-testid': 'block-urgent' },
    blockHead('urgent-h', 'alert', t('urgent.title')),
    h('p', {}, t('urgent.body')),
    h('p', { class: 'strong' }, t('urgent.signs')),
    h('ul', {}, ...signs),
  );
}

function remeasureBlock(): HTMLElement {
  return h(
    'section',
    { class: 'block block-remeasure', 'aria-labelledby': 'remeasure-h', 'data-testid': 'block-remeasure' },
    blockHead('remeasure-h', 'remeasure', t('remeasure.title')),
    h('p', {}, t('remeasure.body')),
    h('p', { class: 'how' }, t('remeasure.how')),
  );
}

function measurementBlock(a: Assessment, input: GrowthInput): HTMLElement {
  // The faded "ghost" marker: length-for-age before the WHO 0.7 cm correction.
  const ghostZ = unadjustedLhfa(a, input)?.z ?? null;
  return h(
    'section',
    { class: 'block block-shows', 'aria-labelledby': 'measure-h', 'data-testid': 'block-shows' },
    blockHead('measure-h', 'shows', t('measure.title')),
    h('p', { class: 'muted' }, t('measure.note')),
    h('ul', { class: 'indicators' }, ...a.indicators.map((r) => indicatorItem(r, r.id === 'lhfa' ? ghostZ : null))),
  );
}

function indicatorItem(r: IndicatorResult, ghostZ: number | null): HTMLElement {
  const scale = r.status === 'ok' && r.band && r.z !== null ? renderZScale({ id: r.id, z: r.z, band: r.band, ghostZ }) : null;
  return h(
    'li',
    { class: `indicator status-${r.status}` },
    h('div', { class: 'ind-head' }, h('div', {}, h('h4', {}, t(`ind.${r.id}`)), h('p', { class: 'muted q' }, t(`ind.${r.id}.q`))), chip(r)),
    scale,
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
    { class: 'block block-meaning', 'aria-labelledby': 'meaning-h' },
    blockHead('meaning-h', 'next', t('meaning.title')),
    h('p', {}, t(`meaning.${key}`)),
    h('h4', { class: 'see-title' }, t('see.title')),
    h('p', { class: 'strong' }, t(`see.${key}`)),
  );
}
