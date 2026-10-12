# Qiyas — Demo Video Script (v2)

**Target length: about 2:40** (hard ceiling 2:45). One take, no edit beyond trimming the ends. Show only features present in the final build. v2 applies the `video-director` critique: open on the child, fewer words per second, the normal demo as a control.

**Before you press record:** the app open at http://localhost:4173 in Arabic, phone-width window. Second tab: the repo in the editor, with `data/who/lhfa_boys.json` and `web/src/growth/bands.ts` open. Terminal with `npm test` **already run**, green output on screen. If the AI layer shipped, `npm run explain` running.

| Time | On screen | Voiceover (exact) |
|---|---|---|
| 0:00 – 0:20 | Qiyas open, Arabic, right-to-left. Click **Example 1**. Scroll to the result: all three indicators "in the usual range". | "This is a synthetic example. A boy, 607 days old, measured standing. Measured that way, a standard chart reads him below the usual range for length. WHO says: under two, measured standing, add 0.7 centimetres. Qiyas does that, and shows its working." |
| 0:20 – 0:40 | **WOW BEAT.** Open "How this was calculated". Hold on the steps: 78.0 cm entered → +0.7 cm → 78.7 cm. Hold **3 seconds** on the highlighted box: "Without this correction … z −2.19 · below the usual range — the correction changes the result to: in the usual range." | "Without the correction: z minus 2.19, below the usual range. With it: minus 1.94, in the usual range. Same child. Same tape measure. The only change is measuring the way WHO measures." |
| 0:40 – 0:50 | Click **English**. The same fold, same numbers. | "Every number is shown. Switch language, and none of them change." |
| 0:50 – 1:20 | Click **Example 2**. Red block on top: "See a health worker today", swelling of both feet. Amber block below: "Re-measure". No numbers shown for the implausible values. | "Now a harder case. The weight entered is implausible, so Qiyas shows no number and asks to re-measure. But the parent answered yes: swelling of both feet. That is a warning sign whatever the numbers say. So the first thing on screen is: see a health worker today. No diagnosis. Just what to do next." |
| 1:20 – 1:27 | Click **Example 3**. All green, routine text. | "And a typical child: no alarm, no action. Keep up regular check-ups." |
| 1:27 – 2:05 | Switch to the repo tab. (1) `data/who/lhfa_boys.json`, the `source` URL visible. (2) The terminal: `npm test` green, {{TEST_COUNT}} passed. (3) `web/src/growth/bands.ts`: the WHO cut-offs and the red-flag override, in plain code. If the AI layer shipped: back to the app, click the question button, show the boxed "AI answer (experimental)" under the unchanged result. | "The tables are WHO's own files, values unmodified. The tests feed WHO's own table rows back through the engine and expect exactly minus three to plus three. {{TEST_COUNT}} tests pass. The band and the urgent action are set here, in code, from WHO cut-offs. The AI answer, where it's used, sits below the result and is not wired to it." |
| 2:05 – 2:20 | The README "Scope" section on screen. | "Shipped: three WHO indicators, ages zero to five, Arabic and English. Not shipped: BMI, school-age children, tracking over visits, a native app." |
| 2:20 – 2:40 | The app's footer, then the README "Prior art" section. | "WHO did the math. Parents need the meaning. WHO Anthro and UNICEF's Bebbo came first, and I credit them. I'm Ahmed, a physician and engineer. I wrote and checked the Arabic and English text myself. This is a prototype, not a diagnosis. Thank you." |

## Recording notes

- 1080p, one continuous pass. Keep the browser chrome visible so judges see a real web page.
- Only the demo buttons are used; don't type anything.
- Check before recording: the `source` URL in `lhfa_boys.json` matches `data/who/SOURCE.md`.
- If the AI layer is cut: drop the AI click and the last sentence of the 1:27 voiceover.
- Don't say "validated clinically" or "exact". Say "prototype" and "WHO's own tables".
