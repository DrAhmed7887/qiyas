# NAMAA_BRIEF.md: build brief for a fresh agent session

> Written 2026-10-12 by Claude (Opus) for Dr. Ahmed Zayed. Hand this whole file to the build model (Fable 5.1 if your account serves it, otherwise Opus 5.5) with: **"Read NAMAA_BRIEF.md and execute it. Stop at each CHECKPOINT and report."**

## 0. Who and why

- **Owner:** Dr. Ahmed Zayed: physician (12 years), physician-engineer, RWTH Aachen M.Sc. Health Informatics student. He reviews all clinical wording and signs off on it.
- **Event:** UnivaBio 2026 on Devpost, theme "Artificial Intelligence for Human Health" (detect illness earlier, understand it better, or live with it more easily).
- **Deadline:** treat it as **Tue 13 Oct 2026, 18:00 Europe/Madrid**. The Devpost countdown says 20 Oct, but a 10 Oct update said "3 days left", so plan for the earlier date.
- **Judging (5 points each):** Idea & Innovation · Implementation · Health Impact & Rigor · Design & Usability · Presentation ("honest about what's finished vs planned"). The judges are mostly software engineers. Ahmed must be able to walk them through the code, so keep it readable.
- **Required submission:** an interactive prototype, a demo video, a one-page PDF, and the GitHub repo or a PDF of the code. The rules require a "novel creation", so everything in this repo is new work.

## 1. The product in one paragraph

**Namaa (نماء, "growth")** is an Arabic-first growth check for parents that runs in the browser, for one visit, with nothing to install. A parent enters the child's date of birth (or age in months), sex, weight, length or height, and how the child was measured (lying down or standing). Namaa computes the **WHO Child Growth Standards z-scores** (0–5 years) exactly as WHO specifies. It catches measurement mistakes, then explains the result in plain Arabic or English and says when to see a health worker.

**Pitch:** *"WHO did the math. Parents need the meaning."*

**Why it's new:**
- WHO's tools (Anthro for Windows, the Anthro Survey Analyser) are for health workers and population surveys.
- UNICEF's Bebbo app does parent-facing growth bands, but its Arabic was removed in April 2025. It also needs an install and a child profile, and it has no checks on how the child was measured.
- Credit Bebbo openly in the README and the PDF. Never claim "first ever".

## 2. Hard rules (non-negotiable)

1. **The maths is deterministic, never AI.** z-scores, flags and the result band come from code and WHO tables only. The AI layer (section 5) may only reword the approved text for that band and answer a parent's follow-up question. It can never change the band, and never diagnose.
2. **No diagnosis language.** Never "your child is malnourished" or "stunted" as a label. Say what the measurement shows and what to do next.
3. **No real child data, ever.** Use synthetic examples only. Store nothing: no localStorage, no analytics, no server logs of inputs.
4. **No secrets in git.** The optional API key is read from an env var on a tiny local server, never in browser code. `.env` is already in `.gitignore`.
5. **Clinical wording is Ahmed's.** Draft every parent-facing message and mark it `TODO-AHMED-REVIEW`. Don't invent clinical timings: use placeholders such as `[within ___ days]` for him to fill in.
6. **Small and readable.** Vite + TypeScript, no UI framework, Vitest for tests. Functions under 50 lines, files under 400. No frameworks, ORMs, databases, auth or Docker.
7. **Machine limits:** an M1 with 8 GB of RAM. Run one dev server at a time and don't install heavy tooling.
8. **Git:** small conventional commits (`feat:`, `test:`, `docs:`). Push to `origin main` (the repo is private). **Never make the repo public, and never submit anything on Devpost.** Ahmed does both.

## 3. Repo state you start from

```
2026-10-univabio-namaa/      (remote: github.com/DrAhmed7887/namaa, private)
  README.md  docs/PLAN.md  NAMAA_BRIEF.md (this file)
  data/who/  web/  tests/  submission/   (empty)
```

## 4. Build steps (with checkpoints)

### Step 1: WHO data (about 30 min)
- Download WHO's **expanded LMS tables by day** for boys and girls, from the WHO Child Growth Standards pages (https://www.who.int/tools/child-growth-standards/standards):
  - weight-for-age;
  - length/height-for-age;
  - weight-for-length;
  - weight-for-height;
  - BMI-for-age.
- Convert them to compact JSON in `data/who/` and keep the original files' URLs.
- Write `data/who/SOURCE.md`: the URLs, the download date, a "public WHO data, unmodified values" note, and the citation (WHO Multicentre Growth Reference Study Group, *WHO Child Growth Standards*, 2006).
- If a download is blocked, stop and report. **Never type LMS values from memory.**

### Step 2: the z-score engine, test first (about 60 min)
`web/src/growth/` will hold `lms.ts`, `indicators.ts`, `measurement.ts` and `flags.ts`.

1. **The LMS formula:** z = ((X/M)^L − 1) / (L·S).
2. **For weight-based indicators** (weight-for-age, weight-for-length/height, BMI-for-age), apply WHO's **restricted method for |z| > 3**, the SD3/SD23 adjustment from the WHO Anthro documentation. Length/height-for-age has no restriction.
3. **Age:** age in days from date of birth and visit date. If only months are given, use WHO's conversion: days = months × 30.4375.
4. **Lying vs standing:**
   - under 24 months, measured standing: **add 0.7 cm**;
   - 24 months or older, measured lying: **subtract 0.7 cm**.
   - Use length tables below 24 months and height tables from 24 months.
   - Weight-for-length covers 45–110 cm; weight-for-height covers 65–120 cm.
5. **WHO flags for implausible values** (z outside these ranges means "please re-measure"; no result is shown):
   - length/height-for-age: below −6 or above +6;
   - weight-for-age: below −6 or above +5;
   - weight-for-length/height: below −5 or above +5;
   - BMI-for-age: below −5 or above +5.
6. **Input validation:** age 0–60 months; weight 0.9–58 kg; length/height 38–150 cm; visit date not before date of birth. Each failure gets a clear message in both languages.
7. **Tests first** (`tests/growth.test.ts`):
   - at least 12 cases checked against WHO's own published values. **The source of each expected value must be traceable**, for example WHO's published SD tables (z = 0, ±2, ±3 rows), or the CRAN `anthro` package's examples if they are documented;
   - the 0.7 cm adjustment;
   - the restricted method above +3 and below −3;
   - every flag boundary;
   - every validation error.
   - Tolerance is ±0.01 z.

**CHECKPOINT 1:** stop. Report the test count and the pass rate, plus where each expected value came from.

### Step 3: result bands (about 30 min)
`web/src/growth/bands.ts` turns z-scores into bands, using WHO's cut-offs:
- **Length/height-for-age:** below −3 is severely low; below −2 is low.
- **Weight-for-length/height:** below −3 severely low; below −2 low; above +1 possible risk of overweight; above +2 overweight; above +3 obesity range.
- **Weight-for-age:** below −3 severely low; below −2 low.
- **Overall urgency** is the most urgent single band.
- **Red-flag questions** (asked every time, yes/no):
  - swelling of both feet;
  - child very weak, not feeding, or unusually sleepy;
  - weight loss since the last visit.
  - Any "yes" means **urgent: see a health worker today**. Ahmed will review this wording.

### Step 4: messages, in Arabic and English (about 45 min)
- `web/src/i18n/ar.json` and `web/src/i18n/en.json` hold one message per band and per flag. Each one says:
  - what the measurement shows;
  - what it can mean, without labelling the child;
  - when to see a health worker (a `[___]` placeholder);
  - one line on how to re-measure correctly.
- **Arabic:** simple Modern Standard Arabic and full right-to-left layout.
- Every string starts as `TODO-AHMED-REVIEW`.

### Step 5: the page (about 60 min)
**`web/index.html`** is one screen:
1. Language toggle (AR/EN, Arabic by default, right-to-left).
2. The form. Inputs carry units, and the lying/standing choice has a small illustration.
3. A **"Check" button**, then the result card showing:
   - the band as a colour plus a word (never colour alone);
   - "what this means";
   - "when to see a health worker";
   - an "Exact numbers for your health worker" fold with each z-score, its WHO percentile, and the indicator name.
4. A footer:
   - "Uses WHO Child Growth Standards (2006). Not a diagnosis. Nothing you enter is stored."
   - a link to `SOURCE.md`.

**Design and access:**
- Large tap targets, works on a phone, readable at a primary-school reading level.
- Labelled inputs and keyboard access. Contrast of at least 4.5:1.

**Three synthetic demo profiles**, one button each:
- a normal result;
- a "measured standing under 2" correction;
- a severe low weight-for-height with the feet-swelling red flag, showing the urgent path.

**CHECKPOINT 2:** stop. Run `npm run build` and `npm run preview`. Take screenshots of all three demo profiles in AR and in EN, save them to `submission/screenshots/` (git-ignored), and report.

### Step 6: the optional AI layer (about 45 min, only after Checkpoint 2 passes)
**`server/explain.ts`** is a tiny Node server.
- It takes `{band, lang, approvedText, question?}`.
- It calls `claude-haiku-4-5` through the Anthropic API, key in `ANTHROPIC_API_KEY`. Ahmed's promotional credit runs out on 18 Oct.

**The system prompt must say:**
- reword the approved text more simply, or answer the parent's question;
- never change the urgency;
- never diagnose, never give a dose or treatment;
- if unsure, repeat the approved text;
- reply in `lang`.

**Fallbacks:** if the server isn't running or the key is missing, the page shows the approved text. **The app must work fully without this layer.**

**Tests:** mock the API and check that the urgency word in the output equals the band, and that a reply mentioning a drug or dose is replaced by the approved text.

### Step 7: submission drafts (about 30 min)
Write these drafts to `submission/`:
- **`one-pager.md`:** problem, solution, how it works, prior art (WHO tools and Bebbo, credited), safety design, what's finished vs planned, and team (solo).
  - Problem: parents can't interpret growth numbers, and WHO's tools are for health workers.
  - Use **only these verified facts** for the problem section, citing their DOIs:
    - 33% of 2,126 asylum-seeking children in Denmark were not immunised to national guidelines (doi:10.1016/j.puhe.2018.02.018);
    - 13 EU/EEA countries don't share individual migrant vaccination data (doi:10.1016/j.vaccine.2019.06.068);
    - in a randomized trial, a parent-facing growth app raised the share of parents with high health literacy from 51.6% to 59.9% (KhunLook, JMIR 2023, https://www.jmir.org/2023/1/e43196).
  - Use the first two only as context about migrant families' health records. Add a line marked TODO-AHMED for any further statistics.
- **`video-script.md`:** under 3 minutes:
  - 0:00–0:20: the problem;
  - 0:20–1:50: live demo of the three profiles, including the switch to Arabic;
  - 1:50–2:30: the code walkthrough (the engine, the tests passing, the AI guardrail);
  - 2:30–2:50: finished vs planned.
- Update `README.md`: how to run it (`npm install`, `npm test`, `npm run dev`, optional `npm run explain`), and a prior-art section.

**CHECKPOINT 3:** final report. Include:
- the test count and coverage;
- a list of every `TODO-AHMED-REVIEW` string;
- what works, what's stubbed and what was skipped;
- the exact commands Ahmed runs to record the demo.

## 5. Out of scope (don't build)
- Ages 5–19 (WHO 2007 reference / AnthroPlus).
- Growth charts over several visits, or saving children.
- Accounts, a database, deployment or hosting.
- PDF export, a native app, more languages.

## 6. Definition of done
- [ ] `npm test` is green, with at least 12 traceable WHO cases plus the edge cases, and engine coverage of at least 80%.
- [ ] All three demo profiles render correctly in Arabic (right-to-left) and English, with no console errors.
- [ ] The app works with the AI layer off.
- [ ] Nothing is stored, there are no secrets in git, and no real data is used.
- [ ] Every parent-facing string is marked for Ahmed's review.
- [ ] Commits are pushed to the private `origin main`.

## 7. Where things live
- **Code:** `~/Projects/hackathons/2026-10-univabio-namaa`, with GitHub `DrAhmed7887/namaa` as the source of truth.
- **Media** (video, final PDF, screenshots for Devpost): Google Drive `Zayed OS/Hackathons/2026-10-univabio-namaa/`.
- **Tracking:** the Notion row in 🇪🇺 EU Opportunity Scout, "UnivaBio 2026 — Namaa".
- **After the hackathon:** archive to the Extreme SSD under `Archive/hackathons/`. The steps are in the README.
