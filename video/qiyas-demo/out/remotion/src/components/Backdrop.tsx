import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from '../lib/theme';

/** The app's own soft teal page gradient, used behind every shot. */
export const Backdrop: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.bgTop} 0%, ${C.bg} 55%)` }}>
    {children}
  </AbsoluteFill>
);
