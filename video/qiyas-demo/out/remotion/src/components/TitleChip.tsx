import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { ramp } from '../lib/motion';
import { C, dirOf, FONT, FRAME } from '../lib/theme';

interface Props { text: string; typed?: number; size?: number; delaySec?: number }

/** The shot's on-screen text, in the strip above the app frame. `typed` (0 to 1) types it on. */
export const TitleChip: React.FC<Props> = ({ text, typed, size = 30, delaySec = 0.15 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = ramp(frame, fps, delaySec, 0.4);
  const shown = typed === undefined ? text : text.slice(0, Math.round(text.length * typed));
  return (
    <div dir={dirOf(text)} style={{
      position: 'absolute', left: FRAME.x, top: 14, height: 52, display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: FONT, fontSize: size, fontWeight: 600, color: C.ink, opacity: t, transform: `translateY(${(1 - t) * 10}px)`,
    }}>
      <span style={{ width: 12, height: 12, borderRadius: 6, background: C.primary, flex: 'none' }} />
      <span style={{ whiteSpace: 'pre' }}>{shown}</span>
    </div>
  );
};
