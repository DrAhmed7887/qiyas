import { Config } from '@remotion/cli/config';

// 8 GB M1: one Chromium tab at a time.
Config.setConcurrency(1);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
