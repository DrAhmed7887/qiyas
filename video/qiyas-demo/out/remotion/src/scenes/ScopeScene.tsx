import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop } from '../components/Backdrop';
import type { Scene, Shot } from '../lib/data';
import { ramp } from '../lib/motion';
import { C, FONT } from '../lib/theme';

/** "Shipped: a · b · c" -> ["a", "b", "c"] (items come from the storyboard text). */
const items = (text: string): string[] => text.replace(/^[^:]*:\s*/, '').split(/\s*·\s*/).filter(Boolean);
const STAGGER = 0.3;

interface ColumnProps { title: string; list: string[]; startFrame: number; muted: boolean }

const Column: React.FC<ColumnProps> = ({ title, list, startFrame, muted }) => {
  const frame = useCurrentFrame() - startFrame;
  const { fps } = useVideoConfig();
  const head = ramp(frame, fps, 0.1, 0.4);
  return (
    <div style={{ flex: 1, padding: '44px 52px', opacity: frame < 0 ? 0 : 1 }}>
      <div style={{ fontFamily: FONT, fontSize: 44, fontWeight: 700, color: muted ? C.muted : C.primaryDark, opacity: head, marginBottom: 26 }}>{title}</div>
      {list.map((item, i) => {
        const t = ramp(frame, fps, 0.5 + i * STAGGER, 0.35);
        return (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 20, fontFamily: FONT, fontSize: 40, lineHeight: 1.9,
            color: muted ? '#7b8790' : C.ink, opacity: t, transform: `translateX(${(1 - t) * -14}px)` }}>
            <span style={{ width: 30, height: 30, borderRadius: 15, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: muted ? 'transparent' : C.primary, border: muted ? `3px solid #a7b3b0` : 'none', color: '#fff', fontSize: 20 }}>{muted ? '' : '✓'}</span>
            {item}
          </div>
        );
      })}
    </div>
  );
};

const header = (visual: string, fallback: string) => visual.match(/"([^"]+)"/)?.[1] ?? fallback;

/** One card for both shots: the left column fills in scope-1, the right column in scope-2. */
export const ScopeScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const [shipped, notYet] = scene.shots as [Shot, Shot];
  return (
    <Backdrop>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 90 }}>
        <div style={{ width: 1640, display: 'flex', borderRadius: 26, background: C.surface, boxShadow: '0 24px 60px rgba(16,42,38,.14)' }}>
          <Column title={header(shipped.visual, 'Shipped')} list={items(shipped.text)} startFrame={0} muted={false} />
          <div style={{ width: 2, background: C.line, margin: '40px 0' }} />
          <Column title={header(notYet.visual, 'Not in this build')} list={items(notYet.text)} startFrame={notYet.from - scene.from} muted />
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};
