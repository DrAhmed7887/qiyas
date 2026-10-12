export type Child = Node | string | null | undefined | false;
type Attrs = Readonly<Record<string, string>>;

/** Tiny element builder: h('p', { class: 'x' }, 'text', childNode). */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child);
  }
  return el;
}

/** Keeps numbers and signs in reading order inside right-to-left text. */
export function ltr(text: string): HTMLElement {
  return h('bdi', { dir: 'ltr' }, text);
}
