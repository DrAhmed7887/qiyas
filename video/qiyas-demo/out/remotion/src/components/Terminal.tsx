import React from 'react';
import { interpolateColors } from 'remotion';
import { C, MONO } from '../lib/theme';

interface Props { command: string; lines: string[]; visible: number; passedIndex: number; passedOn: number }

/** Dark terminal card; `visible` lines are shown, the "Tests N passed" line turns green with passedOn. */
export const Terminal: React.FC<Props> = ({ command, lines, visible, passedIndex, passedOn }) => (
  <div style={{ width: 1500, borderRadius: 20, background: C.terminal, overflow: 'hidden', boxShadow: '0 24px 60px rgba(16,42,38,.28)' }}>
    <div style={{ display: 'flex', gap: 10, padding: '16px 22px', background: '#16302b' }}>
      {['#e5675f', '#e8b04a', '#5fbf6d'].map((c) => <span key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
    </div>
    <div style={{ padding: '22px 34px 30px', fontFamily: MONO, fontSize: 26, lineHeight: 1.55, color: C.terminalInk }}>
      <div><span style={{ color: C.terminalGreen }}>$ </span>{command}</div>
      {lines.slice(0, visible).map((line, i) => {
        const pass = i === passedIndex;
        const color = pass ? interpolateColors(passedOn, [0, 1], [C.terminalInk, C.terminalGreen]) : C.terminalInk;
        return (
          <div key={i} style={{ whiteSpace: 'pre-wrap', color, fontWeight: pass && passedOn > 0.5 ? 700 : 400 }}>
            {line.startsWith(' ✓') ? <><span style={{ color: '#7fcf9b' }}> ✓</span>{line.slice(2)}</> : line}
          </div>
        );
      })}
    </div>
  </div>
);
