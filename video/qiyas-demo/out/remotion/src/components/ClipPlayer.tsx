import React from 'react';
import { Freeze, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { assets } from '../lib/data';

interface VideoProps { src: string; seconds: number | null; trimSec?: number; rate?: number; style?: React.CSSProperties }

/** Plays a video from public/; when it runs out before the shot ends, holds its last frame. */
export const HoldVideo: React.FC<VideoProps> = ({ src, seconds, trimSec = 0, rate = 1, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const playable = seconds ? Math.floor(((seconds - trimSec) / rate) * fps) - 2 : Infinity;
  const video = (
    <OffthreadVideo
      src={staticFile(src)} muted playbackRate={rate}
      trimBefore={trimSec ? Math.round(trimSec * fps) : undefined}
      style={{ position: 'absolute', width: 1920, height: 1080, ...style }}
    />
  );
  return frame < playable ? video : <Freeze frame={playable}>{video}</Freeze>;
};

/** A real capture clip (video/captures) on the 1920x1080 app layer. */
export const ClipPlayer: React.FC<{ file: string; trimSec?: number; rate?: number }> = ({ file, ...rest }) => (
  <HoldVideo src={`captures/${file}`} seconds={assets.clips[file] ?? null} {...rest} />
);
