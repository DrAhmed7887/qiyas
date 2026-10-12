import ar from '../i18n/ar.json';
import en from '../i18n/en.json';

export type Lang = 'ar' | 'en';
type Dict = Readonly<Record<string, string>>;

const dictionaries: Readonly<Record<Lang, Dict>> = { ar, en };
let current: Lang = 'ar';

export function getLang(): Lang {
  return current;
}

/** Switches language and text direction on <html>. Nothing is stored. */
export function setLang(lang: Lang): void {
  current = lang;
  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t('doc.title');
}

/** Looks up a message; {name} placeholders are filled from params. */
export function t(key: string, params: Readonly<Record<string, string>> = {}): string {
  const template = dictionaries[current][key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_m, name: string) => params[name] ?? '');
}

/** Re-translates every element marked with data-i18n under root. */
export function applyStatic(root: ParentNode): void {
  for (const el of root.querySelectorAll<HTMLElement>('[data-i18n]')) {
    el.textContent = t(el.dataset['i18n'] ?? '');
  }
}
