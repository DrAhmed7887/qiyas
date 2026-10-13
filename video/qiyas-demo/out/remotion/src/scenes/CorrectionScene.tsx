import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { AppFrame, Still } from '../components/AppFrame';
import { Backdrop } from '../components/Backdrop';
import { ClipPlayer } from '../components/ClipPlayer';
import { Outline } from '../components/Marks';
import { Shots, type ShotComponent } from '../components/Shots';
import { TitleChip } from '../components/TitleChip';
import { boxOf, type Scene } from '../lib/data';
import { FOLD, rel, SLIDE, ZSCALE } from '../lib/layout';
import { pulse, ramp, settle } from '../lib/motion';
import { C, FONT, FRAME } from '../lib/theme';
import { focusView, fullView, lerpView } from '../lib/zoom';

const W = FRAME.width, H = FRAME.height;

const Corr1: ShotComponent = ({ shot }) => (
  <Backdrop>
    <AppFrame view={fullView(W)}><ClipPlayer file="clip-correction-marker.webm" /></AppFrame>
    <TitleChip text={shot.text} />
  </Backdrop>
);

const Corr2: ShotComponent = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const box = boxOf('desktop-ar-zscale-lhfa.png');
  const view = lerpView(fullView(W), focusView(box, W, H, 0.86), settle(frame, fps, 0.3, 2));
  const ring = ramp(frame, fps, 2.6, 0.5);
  const line = pulse(frame, fps, 5, 1);
  const lineX = box.x + ZSCALE.minusTwoDx;
  return (
    <Backdrop>
      <AppFrame view={view}>
        <Still file="desktop-ar-correction-result.png" />
        <div style={{ position: 'absolute', left: box.x + ZSCALE.ghost.dx - 11, top: box.y + ZSCALE.ghost.dy - 11, width: 22, height: 22,
          borderRadius: 11, border: `2.5px solid ${C.amber}`, opacity: ring, transform: `scale(${1 + ring * 0.25})` }} />
        <div style={{ position: 'absolute', left: lineX - 2, top: box.y + ZSCALE.barTop, width: 4, height: ZSCALE.barBottom - ZSCALE.barTop,
          borderRadius: 2, background: C.danger, opacity: line, boxShadow: `0 0 ${14 * line}px ${C.danger}` }} />
      </AppFrame>
      <TitleChip text={shot.text} />
    </Backdrop>
  );
};

const SLIDE_SEC = 3.4;

const SlowTag: React.FC = () => (
  <div style={{ position: 'absolute', right: FRAME.x + 24, top: FRAME.y + 20, padding: '6px 14px', borderRadius: 10,
    background: 'rgba(14,31,28,.78)', color: '#fff', fontFamily: FONT, fontSize: 22 }}>{`real recording · ${SLIDE.rate}× speed`}</div>
);

const FoldSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step5 = boxOf('desktop-ar-calc-without-correction.png');
  const step3 = rel(step5, FOLD.step3.dx, FOLD.step3.dy, step5.width, FOLD.step3.h);
  const focus = rel(step5, -8, FOLD.focusTop, step5.width + 16, step5.height - FOLD.focusTop + 8);
  const view = lerpView(focusView(focus, W, H, 0.84), focusView(focus, W, H, 0.9), ramp(frame, fps, 0, 3.6));
  return (
    <AppFrame view={view} fadeTop>
      <Still file="desktop-ar-calc-fold-viewport.png" />
      <Outline box={step3} opacity={ramp(frame, fps, 0.5, 0.4)} color={C.amber} pad={4} glow={18 * ramp(frame, fps, 0.5, 0.4)} />
    </AppFrame>
  );
};

const Corr3: ShotComponent = ({ shot }) => {
  const { fps } = useVideoConfig();
  const cut = Math.round(SLIDE_SEC * fps);
  return (
    <Backdrop>
      <Sequence durationInFrames={cut} layout="none">
        <AppFrame view={focusView(SLIDE.focus, W, H, 0.9)}>
          <ClipPlayer file="clip-correction-marker.webm" trimSec={SLIDE.trimSec} rate={SLIDE.rate} />
        </AppFrame>
        <SlowTag />
      </Sequence>
      <Sequence from={cut} layout="none"><FoldSteps /></Sequence>
      <TitleChip text={shot.text} />
    </Backdrop>
  );
};

const Corr4: ShotComponent = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blur = 12 * ramp(frame, fps, 0, 0.5);
  const lines = shot.text.split(/(?<=\.)\s+/);
  return (
    <Backdrop>
      <AppFrame view={fullView(W)} blur={blur}><Still file="desktop-ar-correction-result.png" /></AppFrame>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', background: `rgba(243,246,245,${0.45 * blur / 12})` }}>
        {lines.map((l, i) => {
          const t = ramp(frame, fps, 0.4 + i * 0.4, 0.5);
          return <div key={l} style={{ fontFamily: FONT, fontSize: 96, fontWeight: 700, color: C.primaryDark, lineHeight: 1.2,
            opacity: t, transform: `translateY(${(1 - t) * 16}px)` }}>{l}</div>;
        })}
      </AbsoluteFill>
    </Backdrop>
  );
};

export const CorrectionScene: React.FC<{ scene: Scene }> = ({ scene }) => (
  <Shots scene={scene} render={{ 'corr-1': Corr1, 'corr-2': Corr2, 'corr-3': Corr3, 'corr-4': Corr4 }} />
);
