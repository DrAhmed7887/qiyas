import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from '../components/Backdrop';
import { CodeCard } from '../components/CodeCard';
import { Shots, type ShotComponent } from '../components/Shots';
import { Terminal } from '../components/Terminal';
import { TitleChip } from '../components/TitleChip';
import { code, type Scene } from '../lib/data';
import { ramp, settle } from '../lib/motion';

const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 90, ...style }}>{children}</AbsoluteFill>
);

const Proof1: ShotComponent = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = settle(frame, fps, 0, 1);
  return (
    <Backdrop>
      <Center style={{ opacity: t, transform: `translateY(${(1 - t) * 90}px)` }}>
        <CodeCard path={shot.text || code.who.path} lines={code.who.lines} highlightIndex={code.who.highlight}
          highlightOn={ramp(frame, fps, 2, 0.4)} fontSize={26} />
      </Center>
    </Backdrop>
  );
};

const LINE_SEC = 0.33;

const Proof2: ShotComponent = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const visible = Math.max(0, Math.floor((frame / fps - 0.5) / LINE_SEC) + 1);
  return (
    <Backdrop>
      <Center style={{ paddingTop: 40 }}>
        <Terminal command={code.tests.command} lines={code.tests.lines} visible={visible}
          passedIndex={code.tests.passed} passedOn={ramp(frame, fps, 6, 0.4)} />
      </Center>
      <TitleChip text={shot.text} />
    </Backdrop>
  );
};

const Proof3: ShotComponent = ({ shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Backdrop>
      <Center style={{ opacity: ramp(frame, fps, 0, 0.5) }}>
        <CodeCard path={shot.text || code.bands.path} lines={code.bands.lines} highlightIndex={code.bands.highlight}
          highlightOn={ramp(frame, fps, 2, 0.4)} firstLine={code.bands.firstLine} fontSize={25} width={1740} />
      </Center>
    </Backdrop>
  );
};

export const ProofScene: React.FC<{ scene: Scene }> = ({ scene }) => (
  <Shots scene={scene} render={{ 'proof-1': Proof1, 'proof-2': Proof2, 'proof-3': Proof3 }} />
);
