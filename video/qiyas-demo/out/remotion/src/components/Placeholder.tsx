import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT, MONO } from '../lib/theme';

/** Loud on purpose: a missing capture must never ship by accident. */
export const Placeholder: React.FC<{ title: string; hint: string }> = ({ title, hint }) => (
  <AbsoluteFill style={{
    background: 'repeating-linear-gradient(45deg, #ffd400 0 60px, #1a1a1a 60px 120px)',
    alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{ background: '#b42318', color: '#fff', padding: '48px 72px', borderRadius: 24, textAlign: 'center', border: '8px solid #fff' }}>
      <div style={{ fontFamily: FONT, fontSize: 84, fontWeight: 700 }}>{title}</div>
      <div style={{ fontFamily: MONO, fontSize: 30, marginTop: 18 }}>{hint}</div>
    </div>
  </AbsoluteFill>
);
