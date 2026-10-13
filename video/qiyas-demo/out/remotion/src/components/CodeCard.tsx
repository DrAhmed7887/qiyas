import React from 'react';
import { C, FONT, MONO } from '../lib/theme';
import { highlight } from './syntax';

interface Props {
  path: string; lines: string[]; highlightIndex: number; highlightOn: number;
  firstLine?: number; style?: React.CSSProperties; fontSize?: number; width?: number;
}

/** A light code card showing real file contents; one line can be highlighted. */
export const CodeCard: React.FC<Props> = ({ path, lines, highlightIndex, highlightOn, firstLine, style, fontSize = 25, width = 1640 }) => (
  <div style={{
    width, borderRadius: 22, background: C.surface, overflow: 'hidden',
    boxShadow: '0 2px 6px rgba(16,42,38,.08), 0 24px 60px rgba(16,42,38,.16)', ...style,
  }}>
    <div style={{ padding: '18px 32px', borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 14, background: C.primaryTint }}>
      <span style={{ fontFamily: MONO, fontSize: 24, color: C.primaryDark, fontWeight: 700 }}>{path}</span>
      <span style={{ fontFamily: FONT, fontSize: 20, color: C.muted, marginLeft: 'auto' }}>read from the repo at build time</span>
    </div>
    <div style={{ padding: '22px 0' }}>
      {lines.map((line, i) => {
        const on = i === highlightIndex ? highlightOn : 0;
        return (
          <div key={i} style={{
            display: 'flex', padding: '3px 32px', fontFamily: MONO, fontSize, lineHeight: 1.6, color: C.ink,
            background: `rgba(15,107,92,${0.13 * on})`, boxShadow: `inset ${6 * on}px 0 0 ${C.primary}`,
          }}>
            {firstLine !== undefined && <span style={{ width: 56, flex: 'none', color: '#8a989f' }}>{firstLine + i}</span>}
            <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{highlight(line)}</span>
          </div>
        );
      })}
    </div>
  </div>
);
