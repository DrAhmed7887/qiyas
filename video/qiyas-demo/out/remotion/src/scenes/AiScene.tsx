import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { AppFrame, Still } from '../components/AppFrame';
import { Backdrop } from '../components/Backdrop';
import { ClipPlayer } from '../components/ClipPlayer';
import { Placeholder } from '../components/Placeholder';
import { Shots, type ShotComponent } from '../components/Shots';
import { TitleChip } from '../components/TitleChip';
import { assets, type Scene } from '../lib/data';
import { AI_BRACKET } from '../lib/layout';
import { ramp } from '../lib/motion';
import { C, FONT, FRAME } from '../lib/theme';
import { fullView, lerpView } from '../lib/zoom';

const PUSH = 1.12;

/** At 6 s: a bracket beside the fixed result card, labelled "fixed by code". */
const Bracket: React.FC<{ bottom: number; t: number }> = ({ bottom, t }) => {
  const top = AI_BRACKET.top;
  return (
    <div style={{ position: 'absolute', left: AI_BRACKET.x - 16, top, height: bottom - top, opacity: t }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 14, height: (bottom - top) * t,
        borderLeft: `4px solid ${C.primary}`, borderTop: `4px solid ${C.primary}`, borderBottom: `4px solid ${C.primary}`, borderRadius: '8px 0 0 8px' }} />
      <div style={{ position: 'absolute', right: 28, top: (bottom - top) / 2 - 24, whiteSpace: 'nowrap', padding: '6px 14px',
        borderRadius: 10, background: C.primary, color: '#fff', fontFamily: FONT, fontSize: 26, fontWeight: 600 }}>fixed by code</div>
    </div>
  );
};

const Ai1: ShotComponent = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { clip, still, element } = assets.ai;
  if (!clip && !still) return <Placeholder title="AI clip: capture pending" hint="CAPTURE_AI=1 npm run capture (with npm run explain running)" />;
  const full = fullView(FRAME.width);
  const target = { scale: full.scale * PUSH, cx: element ? element.box.x + element.box.width / 2 : full.cx, cy: full.cy };
  const view = lerpView(full, target, ramp(frame, fps, 0, durationInFrames / fps));
  return (
    <Backdrop>
      <AppFrame view={view}>
        {clip ? <ClipPlayer file={clip} /> : <Still file={still as string} />}
        {element && <Bracket bottom={element.box.y - AI_BRACKET.bottomAboveAnswer} t={ramp(frame, fps, 6, 0.6)} />}
      </AppFrame>
      <TitleChip text={shot.text} />
    </Backdrop>
  );
};

export const AiScene: React.FC<{ scene: Scene }> = ({ scene }) => (
  <Shots scene={scene} render={{ 'ai-1': Ai1 }} />
);
