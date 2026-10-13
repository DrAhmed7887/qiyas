import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { AppFrame, Still } from '../components/AppFrame';
import { Backdrop } from '../components/Backdrop';
import { ClipPlayer } from '../components/ClipPlayer';
import { Outline, Underline } from '../components/Marks';
import { Shots, type ShotComponent } from '../components/Shots';
import { TitleChip } from '../components/TitleChip';
import { boxOf, type Scene } from '../lib/data';
import { SWELLING } from '../lib/layout';
import { pulse, ramp, settle } from '../lib/motion';
import { C, FRAME } from '../lib/theme';
import { focusView, fullView, lerpView } from '../lib/zoom';

const W = FRAME.width, H = FRAME.height;
const RED_STILL = 'desktop-en-redflag-result.png';

const Safe1: ShotComponent = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pulse(frame, fps, 4, 1.1);
  return (
    <Backdrop>
      <AppFrame view={fullView(W)}>
        <ClipPlayer file="clip-redflag.webm" />
        <Outline box={boxOf('desktop-ar-block-remeasure.png')} opacity={p} color={C.amber} pad={6} radius={18} glow={24 * p} width={4} />
      </AppFrame>
      <TitleChip text={shot.text} />
    </Backdrop>
  );
};

const Safe2: ShotComponent = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const box = boxOf('desktop-en-block-urgent.png');
  const view = lerpView(fullView(W), focusView(box, W, H, 0.84), settle(frame, fps, 0.2, 1.8));
  return (
    <Backdrop>
      <AppFrame view={view}>
        <Still file={RED_STILL} />
        <Underline x={box.x + SWELLING.dx} y={box.y + SWELLING.dy} width={SWELLING.width} progress={ramp(frame, fps, 3, 0.6)} />
      </AppFrame>
      <TitleChip text={shot.text} />
    </Backdrop>
  );
};

const Safe3: ShotComponent = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const box = boxOf('desktop-en-block-urgent.png');
  const view = lerpView(focusView(box, W, H, 0.84), fullView(W), settle(frame, fps, 0, 1.6));
  const glow = ramp(frame, fps, 1.6, 0.8);
  return (
    <Backdrop>
      <AppFrame view={view}>
        <Still file={RED_STILL} />
        <Outline box={box} opacity={0.9 * glow} color={C.danger} pad={2} radius={14} glow={36 * glow} width={2} />
      </AppFrame>
      <TitleChip text={shot.text} />
    </Backdrop>
  );
};

const Safe4: ShotComponent = ({ shot }) => (
  <Backdrop>
    <AppFrame view={fullView(W)}><Still file="desktop-ar-normal-result.png" /></AppFrame>
    <TitleChip text={shot.text} delaySec={0} />
  </Backdrop>
);

export const SafetyScene: React.FC<{ scene: Scene }> = ({ scene }) => (
  <Shots scene={scene} render={{ 'safe-1': Safe1, 'safe-2': Safe2, 'safe-3': Safe3, 'safe-4': Safe4 }} />
);
