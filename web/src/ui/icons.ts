// Small inline icons (static, trusted markup). Decorative: always aria-hidden.
const PATHS = {
  alert:
    '<path d="M12 3.5 2.5 20h19L12 3.5Z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.25" r="0.6" fill="currentColor"/>',
  remeasure:
    '<rect x="2.5" y="13" width="19" height="6" rx="1.5"/><path d="M6.5 13v2.5M10 13v1.5M13.5 13v2.5M17 13v1.5"/>' +
    '<path d="M7 8.5a5.5 5.5 0 0 1 9.6-2.4"/><path d="M17 3v3.4h-3.4"/>',
  shows:
    '<path d="M3 20h18"/><path d="M4 16.5c3-1 4.5-6 8-6s5 2.5 8-5"/><circle cx="12" cy="10.5" r="1.6" fill="currentColor"/>',
  next: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5l3 2"/>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 7h7M8.5 11h1M12 11h1M15 11h.5M8.5 14.5h1M12 14.5h1M15 14.5h.5M8.5 18h1M12 18h3.5"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="M12 8.5 13.2 11l2.3 1-2.3 1L12 15.5 10.8 13l-2.3-1 2.3-1L12 8.5Z"/>',
} as const;

export type IconName = keyof typeof PATHS;

export function icon(name: IconName, extraClass = ''): SVGSVGElement {
  const tpl = document.createElement('template');
  tpl.innerHTML =
    `<svg class="icon ${extraClass}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" ` +
    `stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${PATHS[name]}</svg>`;
  return tpl.content.firstElementChild as SVGSVGElement;
}
