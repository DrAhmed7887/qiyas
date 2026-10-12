// Group (d): every flag edge. Limits from WHO Anthro (igrowup) flag rules; a z exactly on a limit is plausible.
import { describe, expect, it } from 'vitest';
import { hasRedFlag, isImplausible } from '../web/src/growth/flags';

describe('isImplausible', () => {
  it.each([
    ['lhfa', -6, false], ['lhfa', -6.001, true], ['lhfa', 6, false], ['lhfa', 6.001, true],
    ['wfa', -6, false], ['wfa', -6.001, true], ['wfa', 5, false], ['wfa', 5.001, true],
    ['wfa', 5.5, true], // the upper limit for wfa is +5, not +6
    ['wflh', -5, false], ['wflh', -5.001, true], ['wflh', 5, false], ['wflh', 5.001, true],
    ['wflh', 0, false],
  ] as const)('%s z=%s -> %s', (id, z, expected) => {
    expect(isImplausible(id, z)).toBe(expected);
  });
});

describe('hasRedFlag', () => {
  const none = { oedema: false, weakOrNotFeeding: false, recentWeightLoss: false };
  it('is false with no flags', () => expect(hasRedFlag(none)).toBe(false));
  it.each(['oedema', 'weakOrNotFeeding', 'recentWeightLoss'] as const)('%s alone is enough', (k) => {
    expect(hasRedFlag({ ...none, [k]: true })).toBe(true);
  });
});
