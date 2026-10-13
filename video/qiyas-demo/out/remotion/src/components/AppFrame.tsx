import React from 'react';
import { Img, staticFile } from 'remotion';
import { FRAME } from '../lib/theme';
import { viewTransform, type View } from '../lib/zoom';

interface Props { view: View; children: React.ReactNode; blur?: number; fadeTop?: boolean }

/** A window card holding a 1920x1080 app layer; `view` zooms/pans that layer. */
export const AppFrame: React.FC<Props> = ({ view, children, blur = 0, fadeTop = false }) => (
  <div style={{
    position: 'absolute', left: FRAME.x, top: FRAME.y, width: FRAME.width, height: FRAME.height,
    borderRadius: FRAME.radius, overflow: 'hidden', background: '#f3f6f5',
    boxShadow: '0 2px 6px rgba(16,42,38,.08), 0 24px 60px rgba(16,42,38,.16)',
  }}>
    <div style={{
      position: 'absolute', width: 1920, height: 1080, transformOrigin: '0 0',
      transform: viewTransform(view, FRAME.width, FRAME.height), filter: blur ? `blur(${blur}px)` : undefined,
    }}>
      {children}
    </div>
    {fadeTop && <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 90, background: 'linear-gradient(#ffffff, rgba(255,255,255,0))' }} />}
  </div>
);

/** A full-viewport capture still (3840x2160 at DPR 2) drawn on the 1920x1080 CSS layer. */
export const Still: React.FC<{ file: string }> = ({ file }) => (
  <Img src={staticFile(`captures/${file}`)} style={{ position: 'absolute', width: 1920, height: 1080 }} />
);
