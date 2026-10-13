# Devpost submission fields (UnivaBio 2026)

## Project name
Qiyas (قياس)

## Elevator pitch (tagline, ≤200 characters)
WHO did the math. Parents need the meaning. An Arabic-first child growth check that corrects how the child was measured, explains the result, and shows its working.

## Try it out (links)
- https://drahmed7887.github.io/qiyas/
- https://github.com/DrAhmed7887/qiyas

## Video demo link
{{YOUTUBE_URL}}

## Built with
typescript, vite, vitest, html, css, who-child-growth-standards, playwright, remotion, claude, gemini, github-pages

## Project story

### Inspiration
I'm a physician. The WHO Child Growth Standards are the global reference for how a child is growing, but the tools built on them (WHO Anthro, the Anthro Survey Analyser) are made for health workers and surveys. A parent with a tape measure gets a number and no meaning. And there is a silent error almost nobody mentions at home: under two years, WHO measures children **lying down**. Measured standing, a child reads about 0.7 cm short, which can be enough to move a result across a WHO cut-off.

### What it does
Qiyas ("measurement" in Arabic) is a one-visit growth check that runs in the browser, Arabic first. A parent enters date of birth, sex, weight, length or height, and how the child was measured.
- It computes weight-for-age, length/height-for-age and weight-for-length/height z-scores (0–5 years) from WHO's own tables.
- It applies WHO's 0.7 cm lying/standing correction and **shows what the result would have read without it**.
- It flags implausible values (WHO limits) and asks to re-measure instead of showing a number.
- Three warning-sign questions (e.g. swelling of both feet): any "yes" shows **"see a health worker today"** first, even if every measurement needs re-measuring.
- A "How this was calculated" view shows entered → adjusted → WHO table row → z-score → percentile.
- Nothing is stored: no accounts, no localStorage, no analytics. No diagnosis labels.
- Optional AI: one fixed parent question, answered by Claude Haiku from the physician-approved text only, filtered for medicines, doses and urgency changes. It sits below the result and cannot change it. The hosted demo runs without it and shows the approved text.

### How we built it
- **Deterministic engine** (TypeScript, `web/src/growth/`): WHO's LMS formula, the restricted method beyond ±3 for weight indicators, the 731-day rules, lookup rounding, flags and bands. No AI in the maths.
- **Data**: WHO's expanded tables, downloaded from WHO and converted to JSON with values unmodified (`data/who/SOURCE.md`).
- **134 tests** (Vitest): WHO's own table rows are fed back through the engine and must return exactly −3 … +3, plus the restricted method, the 730/731-day boundaries, every flag edge, every input error and the warning-sign override.
- **UI**: plain TypeScript + Vite, right-to-left Arabic by default with a bundled Arabic typeface, phone-first, z-score bars with the uncorrected value shown as a ghost marker.
- **Demo video**: built from automated Playwright captures of the real app, composed in Remotion; the narration is Gemini TTS and the opening shot is an AI-generated illustration, both labelled.
- AI assistants (Claude, GPT, Gemini) helped write code and review it; I directed the design, checked the WHO methodology and wrote the clinical rules.

### Challenges we ran into
- WHO's method has sharp edges: the length/height switch is by age (731 days), the weight-for-length vs weight-for-height table is chosen by age not by how the child was measured, and the restricted z-score applies only to weight indicators. An independent review caught a bug where the length was rounded before the length-for-age score, which could flip a band; it's fixed and tested.
- Safety rules that interact: an implausible number must never be shown, but a warning sign must never be hidden. The three result blocks are independent so both hold at once.
- Right-to-left layout with numbers and units ("78.0 سم") needed care so Arabic reads naturally.

### Accomplishments that we're proud of
- The demo child: 78.0 cm measured standing reads "below the usual range" (z −2.19); with WHO's correction it reads "in the usual range" (z −1.94). Same child, same tape measure.
- Every number is traceable to a WHO table row, and the test suite proves it.

### What we learned
Parents don't need more numbers; they need to know whether the number is trustworthy and what to do next. Most of the value is in the boring parts: measurement method, plausibility, and wording.

### What's next for Qiyas
Being honest about scope: BMI-for-age, ages 5–19, tracking over visits and a native app are not in this build. Next: a usability test with Arabic-speaking parents and community health workers, more languages, and clinical validation of the wording.

**Prior art, credited:** WHO Anthro and the Anthro Survey Analyser; UNICEF's Bebbo app (parent growth bands; its Arabic was removed in April 2025, and it needs an install and a child profile). Qiyas is not the first growth app; it is a one-visit measurement check that corrects how the child was measured and shows its working.

*Prototype, not a diagnosis. Synthetic examples only. Uses WHO Child Growth Standards (2006).*

## Files to attach
- One-page PDF: `submission/qiyas-one-pager.pdf`
- Code PDF: `submission/qiyas-code.pdf`
- Gallery images: `video/captures/desktop-en-correction-result.png`, `desktop-ar-correction-result.png`, `desktop-en-redflag-result.png`, `desktop-en-zscale-lhfa.png`
