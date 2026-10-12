// Optional AI answer. Sits BELOW the fixed result card and never changes it.
// If the local server is off, the approved text is shown with a small note.
import type { Overall } from '../growth/types';
import { h } from './dom';
import { getLang, t } from './i18n';
import { icon } from './icons';

interface Reply {
  readonly text: string;
  readonly source: 'ai' | 'fallback';
}

async function fetchReply(overall: Overall, approvedText: string): Promise<Reply> {
  const fallback: Reply = { text: approvedText, source: 'fallback' };
  try {
    const res = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        overall,
        lang: getLang(),
        approvedText,
        question: 'what_next',
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as Partial<Reply>;
    if (typeof data.text !== 'string' || data.text === '') return fallback;
    return { text: data.text, source: data.source === 'ai' ? 'ai' : 'fallback' };
  } catch {
    return fallback;
  }
}

/** The approved text the result card already shows for this overall level. */
export function approvedTextFor(overall: Overall, remeasureOnly: boolean): string {
  const key = remeasureOnly && overall === 'routine' ? 'routine_remeasure' : overall;
  return `${t(`meaning.${key}`)} ${t(`see.${key}`)}`;
}

/** Fills `container` with the question button and an answer area. */
export function renderAsk(container: HTMLElement, overall: Overall, approvedText: string): void {
  const answer = h('div', { class: 'ask-answer', 'aria-live': 'polite', 'data-testid': 'ask-answer' });
  const button = h(
    'button',
    { type: 'button', class: 'ask-btn', 'data-testid': 'ask-button' },
    icon('spark'),
    h('span', {}, t('ask.button')),
  );
  button.addEventListener('click', () => {
    button.disabled = true;
    answer.replaceChildren(h('p', { class: 'muted' }, t('ask.loading')));
    void fetchReply(overall, approvedText).then((reply) => {
      answer.replaceChildren(
        h(
          'section',
          { class: 'ask-box' },
          h('h3', {}, t('ask.label')),
          h('p', {}, reply.text),
          reply.source === 'fallback' ? h('p', { class: 'muted small' }, t('ask.unavailable')) : null,
        ),
      );
      button.disabled = false;
    });
  });
  const head = h('p', { class: 'ask-head' }, h('span', { class: 'badge' }, t('ask.badge')), h('span', {}, t('ask.note')));
  container.replaceChildren(head, button, answer);
  container.hidden = false;
}
