import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { AppFrame } from '../components/AppFrame';
import { Backdrop } from '../components/Backdrop';
import { ClipPlayer } from '../components/ClipPlayer';
import { Outline } from '../components/Marks';
import { Shots, type ShotComponent } from '../components/Shots';
import { TitleChip } from '../components/TitleChip';
import type { Scene } from '../lib/data';
import { LANG } from '../lib/layout';
import { ramp } from '../lib/motion';
import { FRAME } from '../lib/theme';
import { fullView } from '../lib/zoom';

/** Real AR to EN toggle; an outline sits on z -1.94, then on the same value in English.
 *  It starts at 2.7 s, not 3 s, because the clip only shows the Arabic value from 2.6 to 3.1 s. */
const Lang1: ShotComponent = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = ramp(frame, fps, LANG.outlineSec, 0.25);
  const swap = ramp(frame, fps, LANG.toggleSec, 0.25);
  return (
    <Backdrop>
      <AppFrame view={fullView(FRAME.width)}>
        <ClipPlayer file="clip-lang-toggle.webm" />
        <Outline box={LANG.ar} opacity={on * (1 - swap)} pad={7} radius={10} width={3} />
        <Outline box={LANG.en} opacity={on * swap} pad={7} radius={10} width={3} glow={14} />
      </AppFrame>
      <TitleChip text={shot.text} />
    </Backdrop>
  );
};

export const LanguageScene: React.FC<{ scene: Scene }> = ({ scene }) => (
  <Shots scene={scene} render={{ 'lang-1': Lang1 }} />
);
