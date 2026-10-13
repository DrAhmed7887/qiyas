import React from 'react';
import { Composition } from 'remotion';
import { timeline } from './lib/data';
import { loadFonts } from './lib/fonts';
import { QiyasDemo, type QiyasDemoProps } from './QiyasDemo';

loadFonts();

export const RemotionRoot: React.FC = () => (
  <Composition
    id="QiyasDemo"
    component={QiyasDemo}
    durationInFrames={timeline.totalFrames}
    fps={timeline.fps}
    width={timeline.width}
    height={timeline.height}
    defaultProps={{ showCaptions: true }}
  />
);
