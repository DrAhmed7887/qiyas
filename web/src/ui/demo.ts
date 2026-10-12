import type { DEMO_PROFILES } from '../demo/profiles';
import type { GrowthInput } from '../growth/types';
import { h } from './dom';
import { t } from './i18n';

type Profiles = typeof DEMO_PROFILES;

/** One button per synthetic profile. Labels are kept in sync by applyStatic(). */
export function renderDemoButtons(
  container: HTMLElement,
  profiles: Profiles,
  onPick: (input: GrowthInput) => void,
): void {
  const buttons = profiles.map((profile) => {
    const key = `demo.${profile.id}`;
    const button = h('button', { type: 'button', class: 'btn btn-demo', 'data-i18n': key }, t(key));
    button.addEventListener('click', () => onPick(profile.input));
    return button;
  });
  container.replaceChildren(...buttons);
}
