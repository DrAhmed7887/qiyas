# Engine decision: Remotion

**Choice:** Remotion (React, rendered locally to 1920×1080 MP4 at 30 fps).

**Why**
- The video is a product demo built from real screenshots and real recorded clips (`video/captures/`). That is Remotion's core fit: `<Img>`, `<OffthreadVideo>`, CSS zooms driven by the bounding boxes in `manifest.json`, and captions.
- The code and terminal cards (proof-1..3) read real files at build time (`data/who/lhfa_boys.json`, `web/src/growth/bands.ts`, `test-summary.txt`), so nothing is retyped. Plain React components do this; Motion Canvas would add a second toolchain for three shots.
- Ahmed used Remotion on a previous hackathon video, so the workflow is familiar.

**Validator warning considered:** it flags 5 "Motion Canvas-like" shots (code/terminal cards and the z-scale zoom). These are static cards with simple highlights, not animated diagrams, so one engine is simpler than two.

**Trade-offs**
- Rendering uses headless Chromium: on the 8 GB M1, close other apps and render with `--concurrency=1`.
- The Flow/Veo opening clip and the Gemini TTS audio are external assets dropped into `out/remotion/public/`; the composition falls back to a title card / silent track if they are missing, so the cut can be reviewed before they exist.

**Not chosen:** Motion Canvas (diagram-first, no gain here), generative video for app footage (cannot show the real UI or numbers; fails the honesty rule).
