import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { captions } from '../lib/data';
import { FONT } from '../lib/theme';

/** Burned-in captions from captions.srt: bottom centre, at most two lines. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = captions.find((c) => frame >= c.startFrame && frame < c.endFrame);
  if (!cue) return null;
  const opacity = interpolate(frame, [cue.startFrame, cue.startFrame + 5, cue.endFrame - 5, cue.endFrame], [0, 1, 1, 0]);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 30, display: 'flex', justifyContent: 'center', opacity }}>
      <div style={{
        maxWidth: 1360, padding: '10px 26px', borderRadius: 14, background: 'rgba(14,31,28,.84)', color: '#fff',
        fontFamily: FONT, fontSize: 36, fontWeight: 500, lineHeight: 1.38, textAlign: 'center', textWrap: 'balance',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {cue.text}
      </div>
    </div>
  );
};
