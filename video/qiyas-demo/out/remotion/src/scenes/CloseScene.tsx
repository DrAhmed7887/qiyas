import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AppFrame, Still } from '../components/AppFrame';
import { Backdrop } from '../components/Backdrop';
import { Shots, type ShotComponent } from '../components/Shots';
import { assets, type Scene } from '../lib/data';
import { ramp } from '../lib/motion';
import { C, FONT, FRAME } from '../lib/theme';
import { fullView } from '../lib/zoom';

const quoted = (s: string): string[] => [...s.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

const Close1: ShotComponent = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typed = shot.text.slice(0, Math.round(shot.text.length * ramp(frame, fps, 0.3, 2.4)));
  const credits = quoted(shot.motion)[0] ?? '';
  return (
    <Backdrop>
      <AppFrame view={fullView(FRAME.width)} blur={12}><Still file="desktop-ar-hero.png" /></AppFrame>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 80, background: 'rgba(243,246,245,.5)' }}>
        <div style={{ fontFamily: FONT, fontSize: 78, fontWeight: 700, color: C.primaryDark, minHeight: 110, whiteSpace: 'pre' }}>{typed}</div>
        <div style={{ fontFamily: FONT, fontSize: 36, color: C.muted, marginTop: 26, opacity: ramp(frame, fps, 4, 0.6) }}>{credits}</div>
      </AbsoluteFill>
    </Backdrop>
  );
};

const Close2: ShotComponent = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [byline = '', small = ''] = quoted(shot.visual);
  const fine = small.split(/\s*·\s*/).filter((s) => assets.vo.length > 0 || !/voiceover/i.test(s)).join(' · ');
  return (
    <Backdrop>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 60, fontFamily: FONT, color: C.ink }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, opacity: ramp(frame, fps, 0, 0.5) }}>
          <Img src={staticFile('logo.svg')} style={{ width: 120, height: 120 }} />
          <div style={{ fontSize: 88, fontWeight: 700, color: C.primaryDark }}>Qiyas · <bdi>قياس</bdi></div>
        </div>
        <div style={{ position: 'relative', marginTop: 46, fontSize: 56, fontWeight: 600, color: C.primary }}>
          {shot.text}
          <div style={{ position: 'absolute', left: 0, bottom: -8, height: 5, borderRadius: 3, background: C.primary,
            width: `${100 * ramp(frame, fps, 0.6, 1)}%` }} />
        </div>
        <div style={{ marginTop: 50, fontSize: 38, opacity: ramp(frame, fps, 1.2, 0.5) }}>{byline}</div>
        <div style={{ marginTop: 18, fontSize: 26, color: C.muted, opacity: ramp(frame, fps, 1.6, 0.5) }}>{fine}</div>
      </AbsoluteFill>
    </Backdrop>
  );
};

export const CloseScene: React.FC<{ scene: Scene }> = ({ scene }) => (
  <Shots scene={scene} render={{ 'close-1': Close1, 'close-2': Close2 }} />
);
