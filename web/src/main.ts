// Self-hosted IBM Plex Sans Arabic (Arabic + Latin). Bundled by Vite: no third-party requests.
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/700.css';
import './style.css';
import { DEMO_PROFILES } from './demo/profiles';
import { assess } from './growth';
import type { Assessment, GrowthInput } from './growth/types';
import { renderDemoButtons } from './ui/demo';
import {
  engineErrorsToFields,
  fillForm,
  focusFirstError,
  readForm,
  resetForm,
  showErrors,
  type FieldErrors,
} from './ui/form';
import { applyStatic, getLang, setLang, t } from './ui/i18n';
import { approvedTextFor, renderAsk } from './ui/ask';
import { renderResult } from './ui/result';

interface State {
  readonly errors: FieldErrors;
  readonly last: { readonly input: GrowthInput; readonly assessment: Assessment } | null;
}

function must<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

const form = must<HTMLFormElement>('growth-form');
const resultEl = must('result');
const askEl = must('ask');
const emptyEl = must('result-empty');
const toggle = must<HTMLButtonElement>('lang-toggle');

// In-memory only. Nothing is written to storage, cookies or the network.
let state: State = { errors: {}, last: null };

function render(): void {
  applyStatic(document);
  toggle.lang = getLang() === 'ar' ? 'en' : 'ar';
  toggle.setAttribute('aria-label', t('lang.toggleLabel'));
  showErrors(form, state.errors);
  emptyEl.hidden = state.last !== null;
  if (state.last) {
    const a = state.last.assessment;
    renderResult(resultEl, state.last.input, a);
    renderAsk(askEl, a.overall, approvedTextFor(a.overall, a.remeasure));
  } else {
    resultEl.replaceChildren();
    resultEl.hidden = true;
    askEl.replaceChildren();
    askEl.hidden = true;
  }
}

function runCheck(): void {
  const read = readForm(form);
  if (read.input === null) {
    state = { errors: read.errors, last: null };
    render();
    focusFirstError(form);
    return;
  }
  const outcome = assess(read.input);
  if (!outcome.ok) {
    state = { errors: engineErrorsToFields(outcome.errors), last: null };
    render();
    focusFirstError(form);
    return;
  }
  state = { errors: {}, last: { input: read.input, assessment: outcome } };
  render();
  resultEl.focus({ preventScroll: true });
  // On wide screens the result sits beside the form and is already in view.
  const top = resultEl.getBoundingClientRect().top;
  if (top < 0 || top > window.innerHeight * 0.4) resultEl.scrollIntoView({ block: 'start' });
}

function init(): void {
  setLang('ar');
  resetForm(form);
  renderDemoButtons(must('demo-buttons'), DEMO_PROFILES, (input) => {
    fillForm(form, input);
    runCheck();
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    runCheck();
  });
  must('clear-btn').addEventListener('click', () => {
    resetForm(form);
    state = { errors: {}, last: null };
    render();
  });
  toggle.addEventListener('click', () => {
    setLang(getLang() === 'ar' ? 'en' : 'ar');
    render();
  });
  render();
}

init();
