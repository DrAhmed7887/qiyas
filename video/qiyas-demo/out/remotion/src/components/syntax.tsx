import React from 'react';
import { C } from '../lib/theme';

const TOKEN = /("(?:[^"\\]|\\.)*"(?=\s*:))|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(export|function|const|let|if|return|true|false|null)\b|(-?\b\d[\d.]*\b)/g;
const STYLE: Record<number, React.CSSProperties> = {
  1: { color: C.primaryDark, fontWeight: 700 }, // JSON key
  2: { color: '#8a4b00' }, // string
  3: { color: C.primary, fontWeight: 700 }, // keyword
  4: { color: '#1b4fd8' }, // number
};

/** Minimal highlighter for the two snippets we show (JSON and a short TS function). */
export function highlight(line: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(line.slice(last, at));
    const group = [1, 2, 3, 4].find((g) => m[g] !== undefined) ?? 2;
    out.push(<span key={at} style={STYLE[group]}>{m[0]}</span>);
    last = at + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}
