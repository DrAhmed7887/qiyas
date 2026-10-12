# Render notes

1. App running: `npm run preview` (port 4173).
2. Captures: `npm run capture` (add `CAPTURE_AI=1` with `npm run explain` running for the AI clip, before 18 Oct). Output: `video/captures/`.
3. External assets into `video/qiyas-demo/out/remotion/public/`:
   - `broll-open.mp4`: the Flow/Veo clip (5–6 s, 16:9).
   - `vo/<shot-id>.wav`: Gemini TTS, one file per shot, generated from `tts-input.txt` (one paragraph per shot, same order as the storyboard).
4. Preview: `cd video/qiyas-demo/out/remotion && npx remotion studio`.
5. Render: `npx remotion render QiyasDemo out/qiyas-demo.mp4 --concurrency=1`.
6. Master MP4 goes to Drive `Zayed OS/Hackathons/2026-10-univabio-namaa/`, then YouTube (unlisted). Never commit the MP4 (`*.mp4` is git-ignored).

Gotchas: the z-scale marker animates ~900 ms after a result renders; captures already wait 1.2 s. If the TTS for a shot runs longer than the shot, lengthen the shot in `storyboard.xml` first, then regenerate everything downstream.
