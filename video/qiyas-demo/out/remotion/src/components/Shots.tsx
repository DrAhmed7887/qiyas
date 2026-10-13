import React from 'react';
import { Sequence } from 'remotion';
import type { Scene, Shot } from '../lib/data';
import { Placeholder } from './Placeholder';

export type ShotComponent = React.FC<{ shot: Shot }>;

const Missing: ShotComponent = ({ shot }) => <Placeholder title={`No component for ${shot.id}`} hint="add it to the scene file" />;

/** Lays out a scene's shots with the storyboard timings (relative to the scene start). */
export const Shots: React.FC<{ scene: Scene; render: Record<string, ShotComponent> }> = ({ scene, render }) => (
  <>
    {scene.shots.map((shot) => {
      const Comp = render[shot.id] ?? Missing;
      return (
        <Sequence key={shot.id} name={shot.id} from={shot.from - scene.from} durationInFrames={shot.durationInFrames}>
          <Comp shot={shot} />
        </Sequence>
      );
    })}
  </>
);
