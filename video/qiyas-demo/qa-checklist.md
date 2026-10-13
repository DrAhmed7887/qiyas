# QA checklist (filled in, 2026-10-12)

## Structural
- [x] Validator passes (1 warning: engine fit, considered in engine-decision.md).
- [x] 8 scenes, 19 shots; every shot has visual, text, motion, voiceover; scene sums match; total 138 s.

## Narrative
- [x] Payoff in one sentence: the same child reads "below the usual range" or "in the usual range" depending only on how he was measured, and Qiyas fixes that and shows its working.
- [x] Hook is concrete (a toddler measured standing), not "today I'll show you".
- [x] Each scene has one intent; no filler.

## Visual / motion
- [x] No shot < 1 s or > 11 s; the 10–11 s shots have sub-motions.
- [x] ≤ 3 simultaneous animations per shot.
- [x] Code cards ≤ 12 lines.
- [x] Real screenshots and real clips only. ai-1 is marked TODO until captured with CAPTURE_AI=1.

## Voice / text
- [x] 268 words in 138 s (≈1.9 words/s); every line fits its shot at 2.5 words/s.
- [x] On-screen text ≤ 12 words.
- [x] VO paraphrases rather than reads on-screen text (except "Same child. Same tape measure.", on purpose).
- [x] Captions re-timed against the real TTS audio (2026-10-13; 19 segments cut from one Gemini 3.8 Flash TTS take).

## Honesty / safety
- [x] No unsourced statistics. "Might be measured standing" is not a frequency claim. The test count is read from the real test run.
- [x] The generated opening is labelled "Illustration (AI-generated)"; the end card says the voice is synthetic.
- [x] No speed-ups of recorded clips.
- [x] Fonts: IBM Plex Sans Arabic (SIL OFL). Logo: original.

## Engine readiness
- [x] engine-decision.md written.
- [x] script.md and captions.srt generated from the storyboard.
- [ ] Ahmed approves the storyboard before the final render.
