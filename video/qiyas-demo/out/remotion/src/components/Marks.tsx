import React from 'react';
import type { Box } from '../lib/data';
import { C } from '../lib/theme';

interface OutlineProps { box: Box; opacity: number; color?: string; pad?: number; radius?: number; glow?: number; width?: number }

/** A rounded outline around a box, in the coordinates of whatever layer it sits in. */
export const Outline: React.FC<OutlineProps> = ({ box, opacity, color = C.primary, pad = 8, radius = 14, glow = 0, width = 3 }) => (
  <div style={{
    position: 'absolute', left: box.x - pad, top: box.y - pad, width: box.width + pad * 2, height: box.height + pad * 2,
    borderRadius: radius, border: `${width}px solid ${color}`, opacity,
    boxShadow: glow ? `0 0 ${glow}px ${glow / 3}px ${color}55` : undefined,
  }} />
);

/** A line that draws on from left to right as progress goes 0 to 1. */
export const Underline: React.FC<{ x: number; y: number; width: number; progress: number; color?: string }> = ({ x, y, width, progress, color = C.danger }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: width * progress, height: 3, borderRadius: 2, background: color }} />
);
