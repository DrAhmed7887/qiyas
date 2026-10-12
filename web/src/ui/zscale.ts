// The z-scale bar: WHO band zones from low to high, with a marker at the child's z.
// The bar always runs low → high left-to-right (numbers are LTR), even in Arabic.
import type { Band, IndicatorId } from '../growth/types';
import { h, ltr } from './dom';
import { fixed, signed } from './format';
import { t } from './i18n';

/** The drawn scale. ±3 are labelled; the space beyond holds the outer zones. */
export const Z_MIN = -4;
export const Z_MAX = 4;

export type Tone = 'red' | 'amber' | 'yellow' | 'green' | 'green-soft';

export interface Zone {
  readonly from: number;
  readonly to: number;
  readonly tone: Tone;
}

export interface ZPosition {
  /** 0-100, left to right. */
  readonly pct: number;
  /** Set when z is outside the drawn scale and the marker is pinned to an edge. */
  readonly beyond: 'low' | 'high' | null;
}

/** Maps a z-score onto the bar, clamping to the edge when it is off the scale. */
export function zToPercent(z: number): ZPosition {
  if (z < Z_MIN) return { pct: 0, beyond: 'low' };
  if (z > Z_MAX) return { pct: 100, beyond: 'high' };
  return { pct: ((z - Z_MIN) / (Z_MAX - Z_MIN)) * 100, beyond: null };
}

const LOW_ZONES: ReadonlyArray<Zone> = [
  { from: Z_MIN, to: -3, tone: 'red' },
  { from: -3, to: -2, tone: 'amber' },
];

/** Zone colours follow the engine's cut-offs in growth/bands.ts. */
export function zonesFor(id: IndicatorId): ReadonlyArray<Zone> {
  if (id !== 'wflh') {
    // Above +2 is still the usual band for these two indicators, so it stays green (lighter).
    return [...LOW_ZONES, { from: -2, to: 2, tone: 'green' }, { from: 2, to: Z_MAX, tone: 'green-soft' }];
  }
  return [
    ...LOW_ZONES,
    { from: -2, to: 1, tone: 'green' },
    { from: 1, to: 2, tone: 'yellow' },
    { from: 2, to: 3, tone: 'amber' },
    { from: 3, to: Z_MAX, tone: 'red' },
  ];
}

export function ticksFor(id: IndicatorId): ReadonlyArray<number> {
  return id === 'wflh' ? [-3, -2, 0, 1, 2, 3] : [-3, -2, 0, 2, 3];
}

export interface ZScaleOptions {
  readonly id: IndicatorId;
  readonly z: number;
  readonly band: Band;
  /** Length-for-age before the 0.7 cm correction; draws a faded "ghost" marker. */
  readonly ghostZ?: number | null;
}

const pct = (n: number): string => `${n.toFixed(2)}%`;
const span = (from: number, to: number): string =>
  `left:${pct(zToPercent(from).pct)};width:${pct(zToPercent(to).pct - zToPercent(from).pct)}`;

function bands(id: IndicatorId): HTMLElement {
  const zones = zonesFor(id).map((z) => h('div', { class: `zs-zone tone-${z.tone}`, style: span(z.from, z.to) }));
  return h('div', { class: 'zs-bands' }, ...zones);
}

/** "Lower" and "Higher" at the ends, and a bracket under the usual range. */
function ends(id: IndicatorId): HTMLElement {
  return h(
    'div',
    { class: 'zs-ends', dir: 'ltr', 'aria-hidden': 'true' },
    h('span', { class: 'zs-end low' }, t('zscale.lower')),
    h('span', { class: 'zs-usual', style: span(-2, id === 'wflh' ? 1 : 2) }, h('span', {}, t('zscale.usual'))),
    h('span', { class: 'zs-end high' }, t('zscale.higher')),
  );
}

function zLabel(z: number): string {
  return `z ${fixed(z, 2)}`;
}

function marker(z: number, startPct: number): HTMLElement {
  const pos = zToPercent(z);
  const arrow = pos.beyond === 'low' ? '◀ ' : pos.beyond === 'high' ? ' ▶' : '';
  const text = pos.beyond === 'low' ? `${arrow}${zLabel(z)}` : `${zLabel(z)}${arrow}`;
  return h(
    'div',
    {
      class: `zs-marker zs-final${pos.beyond ? ` beyond-${pos.beyond}` : ''}`,
      style: `left:${pct(startPct)}`,
      'data-to': pct(pos.pct),
    },
    h('span', { class: 'zs-bubble' }, text),
  );
}

/**
 * Call once the bars are in the page: commits each marker's start position, then moves it
 * to the child's z so the CSS transition slides it (instant under prefers-reduced-motion).
 */
export function settleZScales(root: ParentNode): void {
  for (const el of root.querySelectorAll<HTMLElement>('.zs-final[data-to]')) {
    void getComputedStyle(el).left;
    el.style.setProperty('left', el.dataset['to'] ?? '50%');
  }
}

function ghostEls(ghostZ: number, z: number): HTMLElement[] {
  const from = zToPercent(ghostZ).pct;
  const to = zToPercent(z).pct;
  const dir = to >= from ? 'right' : 'left';
  const link = h('div', { class: `zs-link to-${dir}`, style: `left:${pct(Math.min(from, to))};width:${pct(Math.abs(to - from))}` });
  return [link, h('div', { class: 'zs-marker zs-ghost', style: `left:${pct(from)}` })];
}

function legend(ghostZ: number, z: number): HTMLElement {
  return h(
    'figcaption',
    { class: 'zs-legend' },
    h('span', { class: 'zs-key' }, h('i', { class: 'swatch ghost', 'aria-hidden': 'true' }), t('zscale.ghost'), ' ', ltr(zLabel(ghostZ))),
    h('span', { class: 'zs-key' }, h('i', { class: 'swatch final', 'aria-hidden': 'true' }), t('zscale.final'), ' ', ltr(zLabel(z))),
  );
}

function ticks(id: IndicatorId): HTMLElement {
  const labels = ticksFor(id).map((n) =>
    h('span', { class: 'zs-tick', style: `left:${pct(zToPercent(n).pct)}` }, n === 0 ? '0' : signed(n, 0)),
  );
  return h('div', { class: 'zs-ticks', dir: 'ltr', 'aria-hidden': 'true' }, ...labels);
}

/** Builds one bar. The text band label (chip) stays next to it, so colour is never alone. */
export function renderZScale(o: ZScaleOptions): HTMLElement {
  const ghost = o.ghostZ ?? null;
  const start = zToPercent(ghost ?? 0).pct;
  const label = t('zscale.aria', { z: fixed(o.z, 2), band: t(`band.${o.band}`) });
  const track = h(
    'div',
    { class: 'zs-track', dir: 'ltr', role: 'img', 'aria-label': label },
    bands(o.id),
    ...(ghost === null ? [] : ghostEls(ghost, o.z)),
    marker(o.z, start),
  );
  return h(
    'figure',
    { class: 'zscale', 'data-testid': `zscale-${o.id}` },
    track,
    ticks(o.id),
    ends(o.id),
    ghost === null ? null : legend(ghost, o.z),
  );
}
