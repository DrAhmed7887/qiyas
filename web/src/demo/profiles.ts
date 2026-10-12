// Synthetic demo children, one button each. No real child data.
// The numbers were found by brute-force search with the tested engine (see tests/demo.test.ts).
import type { GrowthInput } from '../growth/types';

const NO_FLAGS = { oedema: false, weakOrNotFeeding: false, recentWeightLoss: false } as const;

export interface DemoProfile {
  readonly id: 'correction' | 'redflag' | 'normal';
  readonly input: GrowthInput;
}

export const DEMO_PROFILES: ReadonlyArray<DemoProfile> = [
  {
    // 607 days old, measured standing. The +0.7 cm correction moves length-for-age
    // from 'low' (z -2.19) to 'normal' (z -1.94).
    id: 'correction',
    input: {
      sex: 'boys', dobISO: '2025-02-13', visitISO: '2026-10-13',
      weightKg: 10.5, lengthCm: 78, position: 'standing', redFlags: NO_FLAGS,
    },
  },
  {
    // Weight is implausible for the age (re-measure), and swelling of both feet is 'yes'.
    id: 'redflag',
    input: {
      sex: 'girls', dobISO: '2025-08-13', visitISO: '2026-10-13',
      weightKg: 4, lengthCm: 74, position: 'lying', redFlags: { ...NO_FLAGS, oedema: true },
    },
  },
  {
    // Every indicator in the normal band, no red flags.
    id: 'normal',
    input: {
      sex: 'girls', dobISO: '2025-10-13', visitISO: '2026-10-13',
      weightKg: 9, lengthCm: 74, position: 'lying', redFlags: NO_FLAGS,
    },
  },
];
