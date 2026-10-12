// Pure request validation and prompt building. No Node imports.
import type { Overall } from './guard.ts';

export const OVERALLS: readonly Overall[] = ['urgent', 'see_soon', 'check', 'routine'];
export type Lang = 'ar' | 'en';

/** The only questions a parent can ask. Never free text. */
export const QUESTIONS = {
  what_next: {
    en: 'What does this mean for my child, and what should I do next?',
    ar: 'ماذا يعني هذا لطفلي، وماذا أفعل الآن؟',
  },
} as const;
export type QuestionKey = keyof typeof QUESTIONS;

export interface ExplainRequest {
  readonly overall: Overall;
  readonly lang: Lang;
  readonly approvedText: string;
  readonly question: QuestionKey;
}

export type Validated =
  | { readonly ok: true; readonly value: ExplainRequest }
  | { readonly ok: false; readonly error: string };

const MAX_TEXT = 900;

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

export function validateRequest(body: unknown): Validated {
  if (!isRecord(body)) return { ok: false, error: 'body must be an object' };
  const { overall, lang, approvedText, question } = body;
  if (typeof overall !== 'string' || !OVERALLS.includes(overall as Overall)) {
    return { ok: false, error: 'bad overall' };
  }
  if (lang !== 'ar' && lang !== 'en') return { ok: false, error: 'bad lang' };
  if (typeof approvedText !== 'string' || approvedText.trim() === '' || approvedText.length > MAX_TEXT) {
    return { ok: false, error: 'bad approvedText' };
  }
  if (typeof question !== 'string' || !Object.hasOwn(QUESTIONS, question)) {
    return { ok: false, error: 'bad question' };
  }
  return {
    ok: true,
    value: { overall: overall as Overall, lang, approvedText, question: question as QuestionKey },
  };
}
