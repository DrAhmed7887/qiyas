import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { AppFrame, Still } from '../components/AppFrame';
import { Backdrop } from '../components/Backdrop';
import { HoldVideo } from '../components/ClipPlayer';
import { Shots, type ShotComponent } from '../components/Shots';
import { TitleChip } from '../components/TitleChip';
import { assets, type Scene } from '../lib/data';
import { mix, ramp, settle } from '../lib/motion';
import { C, FONT, FRAME } from '../lib/theme';
import { fullView, lerpView } from '../lib/zoom';

/** Fallback for the Flow clip: a tape measure drawing on. No "AI-generated" label: nothing is generated. */
const RulerCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const ticks = Array.from({ length: 31 }, (_, i) => i);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${C.primaryTint}, ${C.bgTop} 60%, ${C.bg})` }}>
      <div style={{ position: 'absolute', left: 860, top: 120, transform: `scale(${mix(1, 1.05, frame / durationInFrames)})` }}>
        <div style={{ width: 200, height: 760, borderRadius: 18, background: '#fbe7a8', boxShadow: '0 20px 50px rgba(16,42,38,.18)', position: 'relative' }}>
          {ticks.map((i) => {
            const t = ramp(frame, fps, 0.2 + i * 0.06, 0.25);
            const major = i % 5 === 0;
            return <div key={i} style={{ position: 'absolute', left: 0, bottom: 20 + i * 24, height: 4, borderRadius: 2,
              width: (major ? 92 : 48) * t, background: C.ink, opacity: 0.85 }} />;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Open1: ShotComponent = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  if (assets.broll === null) return <RulerCard />;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${mix(1, 1.05, frame / durationInFrames)})` }}>
        <HoldVideo src="broll-open.mp4" seconds={assets.broll} style={{ objectFit: 'cover' }} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', right: 40, top: 36, padding: '8px 16px', borderRadius: 10, background: 'rgba(0,0,0,.55)',
        color: '#fff', fontFamily: FONT, fontSize: 24, opacity: ramp(frame, fps, 0.3, 0.4) }}>{shot.text}</div>
    </AbsoluteFill>
  );
};

const Open2: ShotComponent = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const full = fullView(FRAME.width);
  const view = lerpView({ ...full, scale: full.scale * 1.04 }, full, settle(frame, fps, 0, 1.6));
  return (
    <Backdrop>
      <AbsoluteFill style={{ opacity: ramp(frame, fps, 0, 0.5) }}>
        <AppFrame view={view}><Still file="desktop-ar-hero.png" /></AppFrame>
        <TitleChip text={shot.text} typed={ramp(frame, fps, 0.6, 1.8)} size={34} delaySec={0.4} />
      </AbsoluteFill>
    </Backdrop>
  );
};

export const OpenScene: React.FC<{ scene: Scene }> = ({ scene }) => (
  <Shots scene={scene} render={{ 'open-1': Open1, 'open-2': Open2 }} />
);
