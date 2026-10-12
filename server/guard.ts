// Pure output filter. No Node imports, so tests (and tsc) can load it.
// If the model's text looks unsafe, the approved text is shown instead.

export type Overall = 'urgent' | 'see_soon' | 'check' | 'routine';
export interface Guarded {
  readonly text: string;
  readonly source: 'ai' | 'fallback';
}

// A letter from the Arabic block, used to keep short Arabic words from matching inside longer ones.
const AR = '\\u0600-\\u06FF';

/** Drug, dose or treatment words (English and Arabic). */
const DRUG_WORDS = new RegExp(
  [
    '\\b(?:mg|ml|mcg|dose|doses|dosage|tablet|tablets|pill|pills|syrup|medicine|medication|treatment|drug|antibiotic|antibiotics|supplement|supplements|iron|zinc|vitamin|vitamins|ointment|injection)\\b',
    'زنك|جرعة|جرعات|دواء|أدوية|ادوية|علاج|مضاد حيوي|مضادات حيوية|شراب|حبوب|حبة|مكمل|مكملات|فيتامين|حديد|حقنة',
    `(?<![${AR}])(?:ال)?(?:ملغ|مل|مجم)(?![${AR}])`,
  ].join('|'),
  'i',
);

/** Reassurance that would contradict "see a health worker". */
const DOWNPLAY = new RegExp(
  [
    'no need to (?:see|visit|go|worry)',
    "(?:do not|don't|does not|doesn't) need to (?:see|visit|go)",
    'nothing to worry',
    "(?:do not|don't) worry",
    'لا داعي',
    'لا حاجة',
    'لا تقلق',
    'لا يدعو للقلق',
    'لا شيء يدعو',
  ].join('|'),
  'i',
);

/** Alarm that would contradict a routine or non-urgent result. */
const ALARM = new RegExp(
  [
    'emergency',
    '\\btoday\\b',
    'right away',
    'immediately',
    'urgent(?:ly)?',
    'اليوم',
    'طوارئ',
    'طارئ',
    'عاجل',
    'فوراً|فورا',
  ].join('|'),
  'i',
);

function conflictsWithUrgency(text: string, overall: Overall): boolean {
  if (overall !== 'routine' && DOWNPLAY.test(text)) return true;
  // The approved text for 'urgent' says "today"; every other level must not.
  if (overall !== 'urgent' && ALARM.test(text)) return true;
  return false;
}

/** Returns the model text only if it passes every check; otherwise the approved text. */
export function guard(modelText: string, approvedText: string, overall: Overall): Guarded {
  const text = modelText.trim();
  const fallback: Guarded = { text: approvedText, source: 'fallback' };
  if (text.length === 0 || text.length > 700) return fallback;
  if (DRUG_WORDS.test(text)) return fallback;
  if (conflictsWithUrgency(text, overall)) return fallback;
  return { text, source: 'ai' };
}
