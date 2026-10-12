// Group (c) and age/length handling. Expected values come from the brief (Step 2 items 4-7), worked by hand.
import { describe, expect, it } from 'vitest';
import {
  adjustLength, ageInDays, lengthAdjustment, lengthKey, monthsToDays, wflhTable,
} from '../web/src/growth/measurement';

describe('ageInDays', () => {
  it('counts whole days between two dates', () => {
    expect(ageInDays('2025-01-01', '2025-01-01')).toBe(0);
    expect(ageInDays('2025-01-01', '2025-01-31')).toBe(30);
    expect(ageInDays('2024-02-28', '2024-03-01')).toBe(2); // leap year
  });
  it('is not thrown off by daylight-saving changes', () => {
    expect(ageInDays('2025-03-29', '2025-03-31')).toBe(2);
    expect(ageInDays('2025-10-25', '2025-10-27')).toBe(2);
  });
  it('is negative when the visit is before birth, undefined for bad dates', () => {
    expect(ageInDays('2025-02-01', '2025-01-31')).toBe(-1);
    expect(ageInDays('2025-02-30', '2025-03-01')).toBeUndefined();
    expect(ageInDays('not a date', '2025-03-01')).toBeUndefined();
  });
});

describe('monthsToDays', () => {
  it('is round(months * 30.4375)', () => {
    expect(monthsToDays(12)).toBe(365); // 365.25
    expect(monthsToDays(24)).toBe(731); // 730.5 rounds up
    expect(monthsToDays(23.99)).toBe(730);
    expect(monthsToDays(0)).toBe(0);
  });
});

describe('lying / standing rule at 731 days (group c)', () => {
  it.each([
    [730, 'standing', 0.7],
    [730, 'lying', 0],
    [731, 'standing', 0],
    [731, 'lying', -0.7],
    [0, 'standing', 0.7],
    [1856, 'lying', -0.7],
  ] as const)('%s days, %s -> %s cm', (days, pos, adj) => {
    expect(lengthAdjustment(days, pos)).toBe(adj);
  });
  it('adjusts the length without float noise', () => {
    expect(adjustLength(80.1, 0.7)).toBe(80.8);
    expect(adjustLength(95.3, -0.7)).toBe(94.6);
    expect(adjustLength(70, 0)).toBe(70);
    expect(adjustLength(70.96, 0)).toBe(70.96); // keeps hundredths: only the table key is rounded
    expect(adjustLength(70.26, 0.7)).toBe(70.96);
  });
});

describe('table choice depends on age, not on position (group c)', () => {
  it('730 days -> wfl, 731 days -> wfh', () => {
    expect(wflhTable(730)).toBe('wfl');
    expect(wflhTable(731)).toBe('wfh');
  });
  it('a months input of 24 lands on 731 days, so wfh', () => {
    expect(wflhTable(monthsToDays(24))).toBe('wfh');
    expect(wflhTable(monthsToDays(23.99))).toBe('wfl');
  });
});

describe('lengthKey', () => {
  it('rounds to the nearest 0.1 cm and returns mm', () => {
    expect(lengthKey(65.3)).toBe(653);
    expect(lengthKey(80.8)).toBe(808);
    expect(lengthKey(65.04)).toBe(650);
    expect(lengthKey(65.05)).toBe(651);
    expect(lengthKey(45)).toBe(450);
  });
});
