# Qiyas — Demo Video Script

**Target length: 2 min 38 s** (hard ceiling 2:45). Record in one pass. Show only features present in the final build.

| Time | On screen | Voiceover (exact) |
|---|---|---|
| 0:00 – 0:15 | Qiyas open in a browser tab. Arabic UI, right-to-left. No logo animation. The form is visible. | "WHO built the growth standards. But a parent at home doesn't have a z-score table. Qiyas fills that gap. It runs in the browser. One visit. Nothing to install." |
| 0:15 – 0:30 | **WOW BEAT.** Click the preset button: "20 months, measured standing." An Arabic line appears: *قياس واقفًا ← +0.7 سم ← طول 78.0 → 78.7 سم (z −2.19 → −1.94)*. The band label flips from "below expected range" to "within expected range." | "This child was measured standing. Qiyas adds zero point seven centimetres. The band changes. That's the whole correction. One line of arithmetic, shown on screen." |
| 0:30 – 0:45 | Open the "How this was calculated" fold: entered 78.0 → 78.7 سم (z −2.19 → −1.94) → adjusted 78.0 → 78.7 سم (z −2.19 → −1.94) → WHO lhfa table, day row → z → percentile. Click the EN toggle. Every number stays identical; only the words switch to English. Caption fades in: *"WHO did the math. Qiyas explains it."* | "The full working is here. Enter, adjust, table row, z-score. Now I switch to English. Every number stays the same. Only the words change." |
| 0:45 – 0:55 | Scroll to show the three-part result card: (1) Re-measure, (2) What the measurement shows, (3) Urgent action. Brief pause on each. | "The result card has three independent parts. Re-measure. What the measurement shows. And urgent action. They don't override each other." |
| 0:55 – 1:25 | Click the second preset: "Red flag + implausible." One indicator shows a re-measure prompt. Red-flag question "Swelling of both feet?" is set to Yes. The urgent-action block reads "See a health worker today" and remains fully visible below the re-measure prompt. No diagnosis label appears anywhere. | "Now the harder case. One measurement is implausible, so Qiyas says: re-measure. But the child has swollen feet. The urgent action—see a health worker today—stays on screen. It doesn't disappear because a number needs checking. No diagnosis. Just what to do next." |
| 1:25 – 1:55 | Screen share of the repo. (1) Open `data/who/lhfa_boys.json`; the `source` URL is visible. (2) Run `npm test`; the table-driven test group scrolls past, green checkmarks, total {{TEST_COUNT}} passed. (3) Open `web/src/growth/bands.ts` and `index.ts`; highlight where the band and the overall action are assigned from WHO cut-offs in plain code. If the AI button is present: click it, show the boxed "AI answer (experimental)" area and the fallback text when the server is off. | "The numbers come straight from WHO's files. Unmodified. This test feeds every thirtieth table row back through the engine and checks the z-score. All {{TEST_COUNT}} pass. And here's the safety boundary. The band and the action are set in code, from WHO's cut-offs. The AI layer can read them. It can never write to them. If the server is off, you just get the approved text." |
| 1:55 – 2:20 | A clean bullet list appears on a dark background. **Shipped:** weight-for-age, length/height-for-age and weight-for-length/height for ages 0–5; WHO 0.7 cm correction; implausible-value flags; red-flag override; Arabic (RTL) and English; "how this was calculated" view. **Not in this build:** BMI-for-age · ages 5–19 · multi-visit tracking · native app. Each item one line, no elaboration. | "Here's what's real and what's not. Shipped: weight-for-age, length/height-for-age and weight-for-length/height for ages 0–5; WHO 0.7 cm correction; implausible-value flags; red-flag override; Arabic (RTL) and English; "how this was calculated" view. Not in this build: BMI, ages five to nineteen, tracking over visits, a native app. I'd rather show you what works than promise what doesn't." |
| 2:20 – 2:38 | Footer card: "WHO Child Growth Standards, 2006." "Prior art, credited: WHO Anthro, UNICEF Bebbo." "Not a diagnosis. Nothing stored." Name: **Dr. Ahmed Zayed** — physician · engineer. Repo and video links. | "WHO provided the standards. Bebbo and WHO Anthro came first, and I credit them. I'm Ahmed, a physician and engineer. I reviewed every word you saw. This is a prototype. Not a diagnosis. Thank you." |
| 2:38 – 2:40 | Fade to black. | *(silent)* |

---

### Recording notes for Ahmed

- Record at 1080p, one continuous pass, no cuts.
- Keep the browser chrome visible so judges see it's a real web page.
- The two presets are the only inputs; do not type anything manually.
- If the AI button is **absent** (cut before 01:30), delete the last sentence of the 1:25–1:55 voiceover and skip the AI click.
- Do not say "validated clinically" or "exact WHO maths." Say "prototype" and "WHO tables, unmodified."
- Total runtime must not exceed 2:45.
