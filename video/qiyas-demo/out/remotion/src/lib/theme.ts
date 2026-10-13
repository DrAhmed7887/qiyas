// Palette copied from web/src/style.css so the video matches the app.
export const C = {
  bg: '#f3f6f5',
  bgTop: '#e3efec',
  surface: '#ffffff',
  ink: '#1f2933',
  muted: '#4d5b66',
  line: '#dbe3e1',
  primary: '#0f6b5c',
  primaryDark: '#0b5649',
  primaryTint: '#e6f2ef',
  danger: '#b42318',
  dangerInk: '#7a1010',
  amber: '#b36b00',
  amberBg: '#fff3dc',
  green: '#2f855a',
  terminal: '#0e1f1c',
  terminalInk: '#cfe3de',
  terminalGreen: '#5fd38d',
} as const;

export const FONT = "'IBM Plex Sans Arabic', system-ui, -apple-system, sans-serif";
export const MONO = "Menlo, 'SF Mono', ui-monospace, monospace";

/** App screenshots sit in a window card; the strip above holds the shot title, captions sit below. */
export const FRAME = { x: 160, y: 76, width: 1600, height: 900, radius: 22 } as const;

const ARABIC = /[؀-ۿ]/;
const LATIN = /[A-Za-z]/;
/** Mixed Arabic/English titles read LTR; pure Arabic reads RTL. */
export const dirOf = (text: string): 'rtl' | 'ltr' => (ARABIC.test(text) && !LATIN.test(text) ? 'rtl' : 'ltr');
