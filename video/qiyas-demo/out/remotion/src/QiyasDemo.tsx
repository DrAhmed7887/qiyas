import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Captions } from './components/Captions';
import { Placeholder } from './components/Placeholder';
import { assets, timeline, type Scene } from './lib/data';
import { C } from './lib/theme';
import { AiScene } from './scenes/AiScene';
import { CloseScene } from './scenes/CloseScene';
import { CorrectionScene } from './scenes/CorrectionScene';
import { LanguageScene } from './scenes/LanguageScene';
import { OpenScene } from './scenes/OpenScene';
import { ProofScene } from './scenes/ProofScene';
import { SafetyScene } from './scenes/SafetyScene';
import { ScopeScene } from './scenes/ScopeScene';

export interface QiyasDemoProps { showCaptions: boolean; [key: string]: unknown }

const SCENES: Record<string, React.FC<{ scene: Scene }>> = {
  open: OpenScene, correction: CorrectionScene, language: LanguageScene, safety: SafetyScene,
  ai: AiScene, proof: ProofScene, scope: ScopeScene, close: CloseScene,
};

const MissingScene: React.FC<{ scene: Scene }> = ({ scene }) => <Placeholder title={`No component for scene "${scene.id}"`} hint="add it to src/QiyasDemo.tsx" />;

/** Per-shot voiceover files that prebuild found in public/vo (silence otherwise). */
const Voiceover: React.FC = () => (
  <>
    {timeline.scenes.flatMap((s) => s.shots).filter((shot) => assets.vo.includes(shot.id)).map((shot) => (
      <Sequence key={shot.id} name={`vo ${shot.id}`} from={shot.from} durationInFrames={shot.durationInFrames} layout="none">
        <Audio src={staticFile(`vo/${shot.id}.wav`)} />
      </Sequence>
    ))}
  </>
);

export const QiyasDemo: React.FC<QiyasDemoProps> = ({ showCaptions }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {timeline.scenes.map((scene) => {
      const Comp = SCENES[scene.id] ?? MissingScene;
      return (
        <Sequence key={scene.id} name={scene.id} from={scene.from} durationInFrames={scene.durationInFrames}>
          <Comp scene={scene} />
        </Sequence>
      );
    })}
    <Voiceover />
    {showCaptions && <Captions />}
  </AbsoluteFill>
);
