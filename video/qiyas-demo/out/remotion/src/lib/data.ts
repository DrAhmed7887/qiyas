// Typed access to the JSON that scripts/prebuild.mjs generates. Never edit those files by hand.
import timelineJson from '../timeline.json';
import assetsJson from '../generated/assets.json';
import captionsJson from '../generated/captions.json';
import codeJson from '../generated/code.json';
import fontsJson from '../generated/fonts.json';

export interface Box { x: number; y: number; width: number; height: number }

export interface Shot {
  id: string; from: number; durationInFrames: number;
  visual: string; text: string; motion: string; voiceover: string;
}
export interface Scene { id: string; from: number; durationInFrames: number; intent: string; shots: Shot[] }
export interface Timeline { fps: number; width: number; height: number; title: string; totalFrames: number; scenes: Scene[] }

export interface Capture { beat: string; lang: string; kind: string; box: Box | null }
export interface Assets {
  generated: string;
  captures: Record<string, Capture>;
  clips: Record<string, number | null>;
  ai: { clip: string | null; still: string | null; element: { file: string; box: Box } | null };
  /** Seconds of public/broll-open.mp4, or null when it is not there. */
  broll: number | null;
  vo: string[];
}
export interface Cue { startFrame: number; endFrame: number; text: string }
export interface CodeSnippet { path: string; lines: string[]; highlight: number; firstLine?: number }
export interface Code {
  who: CodeSnippet;
  bands: CodeSnippet;
  tests: { command: string; lines: string[]; passed: number; count: number };
}
export interface FontFile { file: string; weight: number; unicodeRange: string }

export const timeline = timelineJson as Timeline;
export const assets = assetsJson as unknown as Assets;
export const captions = captionsJson as Cue[];
export const code = codeJson as Code;
export const fontFiles = fontsJson as FontFile[];

export const shotById = (id: string): Shot | undefined =>
  timeline.scenes.flatMap((s) => s.shots).find((s) => s.id === id);

/** Bounding box of an element capture (CSS px of the 1920x1080 viewport). */
export function boxOf(file: string): Box {
  const box = assets.captures[file]?.box;
  if (!box) throw new Error(`No bounding box for ${file} in video/captures/manifest.json`);
  return box;
}

export const hasCapture = (file: string): boolean => file in assets.captures;
