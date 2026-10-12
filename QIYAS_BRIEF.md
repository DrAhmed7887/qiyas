# QIYAS_BRIEF.md: build brief (v2)

> v1 written 2026-10-12 by Claude (Opus). v2 (same night) folds in the reviews from GPT-6 Sol (`docs/WIN_PLAN.md`) and Fable 5.1 (`docs/FABLE_REVIEW.md`). Claude Code (Opus) orchestrates the build. Workers get one step each and stop at its CHECKPOINT.

## 0. Who and why

- **Owner:** Dr. Ahmed Zayed: physician (12 years), physician-engineer, RWTH Aachen M.Sc. Health Informatics student. He reviews all clinical wording and signs off on it.
- **Event:** UnivaBio 2026 on Devpost, theme "Artificial Intelligence for Human Health" (detect illness earlier, understand it better, or live with it more easily).
- **Deadline:** treat it as **Tue 13 Oct 2026, 18:00 Europe/Madrid**. Internal target: **submitted by 15:00**. Ahmed checks the live Devpost page tonight.
- **Judging (5 points each):** Idea & Innovation · Implementation · Health Impact & Rigor · Design & Usability · Presentation ("honest about what's finished vs planned"). The judges are mostly software engineers. Ahmed must be able to walk them through the code, so keep it readable.
- **Required submission:** an interactive prototype, a demo video, a one-page PDF, and the GitHub repo or a PDF of the code. The rules require a "novel creation", so everything in this repo is new work.

## 1. The product in one paragraph

**Qiyas (قياس, "measurement")** is an Arabic-first growth check for parents that runs in the browser, for one visit, with nothing to install. A parent enters the child's date of birth (or age in months), sex, weight, length or height, and how the child was measured (lying down or standing). Qiyas computes the **WHO Child Growth Standards z-scores** (0–5 years) exactly as WHO specifies. It catches measurement mistakes, then explains the result in plain Arabic or English and says when to see a health worker.

**Pitch:** *"WHO did the math. Parents need the meaning."* **Subtitle:** *"Qiyas: the measurement, explained."*

**Why it's new:**
- WHO's tools (Anthro for Windows, the Anthro Survey Analyser) are for health workers and population surveys.
- UNICEF's Bebbo app does parent-facing growth bands, but its Arabic was removed in April 2025. It also needs an install and a child profile, and it has no checks on how the child was measured.
- Qiyas is a *measurement check*: it corrects how the child was measured and shows its working.
- Credit Bebbo openly in the README and the PDF. Never claim "first ever".
- Naming note for the README: "Qiyas" is also the name of Saudi Arabia's national assessment centre; this project is unrelated.

## 2. Hard rules (non-negotiable)

1. **The maths is deterministic, never AI.** z-scores, flags, the band and the action come from code and WHO tables only. The AI layer (Step 6) can never change any of them, and never diagnoses.
2. **No diagnosis language.** Never "your child is malnourished" or "stunted" as a label. Say what the measurement shows and what to do next.
3. **No real child data, ever.** Use synthetic examples only. Store nothing: no localStorage, no analytics, no server logs of inputs.
4. **No secrets in git.** The optional API key is read from an env var on a tiny local server, never in browser code. `.env` is already in `.gitignore`.
5. **Clinical wording is Ahmed's.** Draft every parent-facing string, and list each one in `submission/review-list.md` for his review. **Nothing like `TODO` or `[___]` ever appears on screen.** Don't invent clinical timings: say "ask your health worker when to come back".
6. **Small and readable.** Vite + TypeScript, no UI framework, Vitest for tests. Functions under 50 lines, files under 400. No frameworks, ORMs, databases, auth or Docker.
7. **Machine limits:** an M1 with 8 GB of RAM. Run one dev server at a time and don't install heavy tooling.
8. **Git:** workers don't commit; the orchestrator commits small conventional commits (`feat:`, `test:`, `docs:`). **Never make the repo public, and never submit anything on Devpost.** Ahmed does both.

## 3. Layout and the data contract

```
package.json  vite.config.ts  tsconfig.json   (repo root; Vite root = web/)
data/who/     {wfa,lhfa,wfl,wfh}_{boys,girls}.json + SOURCE.md
web/          index.html  src/main.ts  src/growth/*  src/i18n/{ar,en}.json  src/style.css
tests/        *.test.ts
submission/   one-pager.md  video-script.md  review-list.md  (screenshots/ is git-ignored)
server/       explain.ts   (optional, Step 6)
```

**Each WHO JSON file** (the contract between the data step and the engine):

```json
{
  "indicator": "wfa",
  "sex": "boys",
  "key": "day",
  "source": "<exact URL of the WHO file>",
  "columns": ["key","L","M","S","SD3neg","SD2neg","SD1neg","SD0","SD1","SD2","SD3"],
  "rows": [[0, 0.3487, 3.3464, 0.14602, 2.08, 2.46, 2.88, 3.35, 3.86, 4.42, 5.03]]
}
```

- `key` is `"day"` (integer age in days) for wfa and lhfa, and `"length_mm"` (length or height in tenths of a cm as an integer: 45.0 cm → 450) for wfl and wfh.
- The values in that example row only show the shape. **Every real value comes from the WHO file, unmodified.**

## 4. Build steps (with checkpoints)

### Step 1: WHO data (about 20 min)
- Download WHO's **expanded tables** (the z-score files with L, M, S and the SD columns), boys and girls, 8 files in all:
  - weight-for-age (by day);
  - length/height-for-age (by day: one table covering 0–1856 days);
  - weight-for-length (45–110 cm);
  - weight-for-height (65–120 cm).
- Start at https://www.who.int/tools/child-growth-standards/standards. Fallback source: WHO's `anthro` package (github.com/WorldHealthOrganization/anthro, or CRAN).
- **BMI-for-age is cut.**
- Convert the files to the JSON contract above. Keep each file's URL.
- Write `data/who/SOURCE.md`: the URLs, the download date, a "public WHO data, unmodified values" note, and the citation (WHO Multicentre Growth Reference Study Group, *WHO Child Growth Standards*, 2006).
- **GO/NO-GO:** if no download works, stop and report. **Never type LMS values from memory.**

### Step 2: the z-score engine, test first (about 60 min)
`web/src/growth/` holds `lms.ts`, `measurement.ts`, `flags.ts` and `bands.ts`.

1. **The LMS formula:** z = ((X/M)^L − 1) / (L·S). If L = 0, z = ln(X/M)/S.
2. **SD lines:** SDk = M·(1 + L·S·k)^(1/L).
3. **Restricted method** for weight-for-age and weight-for-length/height only (not length/height-for-age):
   - if z > 3: z\* = 3 + (X − SD3pos) / (SD3pos − SD2pos);
   - if z < −3: z\* = −3 + (X − SD3neg) / (SD2neg − SD3neg).
4. **Age:**
   - From date of birth: age in days = visit date − date of birth.
   - If only months are given: days = round(months × 30.4375).
   - Date of birth is the main path in the UI.
5. **Lying vs standing:** the cut-off is **731 days**.
   - Under 731 days and measured standing: **add 0.7 cm**.
   - 731 days or older and measured lying: **subtract 0.7 cm**.
6. **Table choice:**
   - Length/height-for-age always uses the one lhfa table, looked up by day.
   - The weight-for-length vs weight-for-height choice depends on **age**, not on how the child was measured: under 731 days → wfl with the adjusted length; 731 days or older → wfh with the adjusted height.
   - If the adjusted value is outside the table range, report no z-score for that indicator ("not applicable"). That is not an error.
7. **Lookup keys:**
   - Age: an integer day.
   - Length/height: rounded to the nearest 0.1 cm.
   - No interpolation.
8. **WHO flags for implausible values:** a flagged indicator shows no result and asks for a re-measure.
   - length/height-for-age: below −6 or above +6;
   - weight-for-age: below −6 or above +5;
   - weight-for-length/height: below −5 or above +5.
   - Check the flags on the final z. Verify against the WHO `anthro` documentation that this means the restricted z, and note the source.
9. **Input validation:** age 0–1856 days; weight 0.9–58 kg; length/height 38–150 cm; visit date not before date of birth. Each failure gets a clear message in both languages. These are UI limits; don't claim they are WHO's.
10. **Tests first** (in `tests/`). Tolerance is **±0.001 z**.
    - **(a) Table-driven:** for every 30th row of every table, feed each SD column value back through the engine and expect exactly −3, −2, −1, 0, 1, 2 and 3. Rows inside the restricted range will hit the restricted path at ±3, so expect ±3 there as well.
    - **(b)** The restricted method: a value beyond SD3 built from one row's SD2 and SD3 columns.
    - **(c)** The 730/731-day boundary for the 0.7 cm rule and for the wfl/wfh switch, including a months input that lands on it.
    - **(d)** Every flag edge.
    - **(e)** Every validation error.
    - **(f)** One case where an indicator is flagged *and* a red flag is "yes": the urgent action must still be present (see Step 3).

**CHECKPOINT 1:** stop. Report the test count, the pass rate, and the source of each test group.

### Step 3: result bands and actions (part of Step 2's hour)
`web/src/growth/bands.ts` turns z-scores into bands, using WHO's cut-offs:
- **Length/height-for-age:** below −3 severely low; below −2 low.
- **Weight-for-length/height:**
  - below −3 severely low; below −2 low;
  - above +1 possible risk of overweight; above +2 overweight; above +3 obesity range.
- **Weight-for-age:** below −3 severely low; below −2 low. There is no overweight band for weight-for-age.
- **Percentile:** Φ(z) from the normal CDF, shown only in the "exact numbers" fold.
- **Red-flag questions** (asked every time, yes/no):
  - swelling of both feet;
  - child very weak, not feeding, or unusually sleepy;
  - the child has lost weight recently.
- **The result has three independent parts:**
  1. **Re-measure:** any implausible flag.
  2. **What the measurement shows:** the bands of the valid indicators.
  3. **Urgent action:** any red-flag "yes" means **see a health worker today**. This shows even when every indicator is flagged.
- **Overall urgency** is the most urgent of these.

### Step 4: messages, in Arabic and English (about 30 min)
- `web/src/i18n/ar.json` and `web/src/i18n/en.json` hold one message per band, per flag and per red flag. Each one says:
  - what the measurement shows;
  - what it can mean, without labelling the child;
  - when to see a health worker (no invented timings);
  - one line on how to re-measure correctly.
- **Arabic:** simple Modern Standard Arabic and full right-to-left layout.
- Every key is listed in `submission/review-list.md` with both languages, for Ahmed.

### Step 5: the page (about 60 min)
**`web/index.html`** is one screen:
1. Language toggle (AR/EN, Arabic by default, right-to-left).
2. The form. Inputs carry units. Lying/standing is a labelled choice (text, no illustration needed).
3. A **"Check" button**, then the result card with the three parts from Step 3:
   - each band as a colour plus a word (never colour alone);
   - "what this means" and "when to see a health worker";
   - a **"How this was calculated"** fold: entered value → adjusted value (with the +0.7 / −0.7 cm note) → WHO table used → z-score → percentile.
4. A footer:
   - "Uses WHO Child Growth Standards (2006). Not a diagnosis. Nothing you enter is stored."
   - a link to `SOURCE.md`.

**Design and access:**
- Large tap targets, works on a phone, readable at a primary-school reading level.
- Labelled inputs and keyboard access. Contrast of at least 4.5:1.

**Synthetic demo profiles**, one button each:
- **Correction (the wow):** about 20 months, measured standing, where the +0.7 cm correction **moves length-for-age across a band cut-off**. Find the exact numbers with the tested engine (brute-force a synthetic set), never by hand.
- **Red flag + implausible:** one indicator flagged for re-measure, and swelling of both feet = yes. The urgent action still shows.
- **Normal:** only if it takes 5 minutes or less.

**CHECKPOINT 2:** stop. Run `npm run build` and `npm run preview`. Take 4 screenshots (2 profiles × AR/EN) into `submission/screenshots/` (git-ignored). Zero console errors.

### Step 6: the optional AI layer (30 min maximum, only after Checkpoint 2, only before 01:00)
**`server/explain.ts`** is a tiny Node server.
- One fixed parent question button, e.g. "Should I stop breastfeeding?" / "هل أوقف الرضاعة؟". **No free-text box.**
- The page sends `{band, lang, approvedText, question}`. The server calls `claude-haiku-5-5` through the Anthropic API, key in `ANTHROPIC_API_KEY`.
- The answer shows in a boxed "AI answer (experimental)" area *below* the fixed result card. It never replaces the card.

**The system prompt must say:**
- answer the parent's question using the approved text;
- never change the urgency;
- never diagnose, never give a dose or treatment;
- if unsure, repeat the approved text;
- reply in `lang`.

**Output filter:** if the answer mentions a drug, a dose, or an urgency word different from the band, show the approved text instead.

**Fallbacks:** if the server isn't running or the key is missing, the page shows the approved text. **The app must work fully without this layer.**

**Tests:** one mocked test for the filter.

If it doesn't work by 01:30, delete the button and list the AI layer as "planned" in the one-pager.

### Step 7: submission drafts (about 20 min)
Write these drafts to `submission/`:
- **`one-pager.md`:**
  - headline and one screenshot;
  - problem and prior art (WHO tools and Bebbo, credited);
  - how it works, as a four-box diagram: inputs → WHO tables + deterministic engine → flags, band and action → approved bilingual explanation (+ bounded AI only if it shipped);
  - evidence and safety: the WHO citations, the real test count and where the expected values come from, the 0.7 cm correction, no diagnosis, no data stored, Ahmed's review;
  - finished vs not finished;
  - team (solo) and links.
  - The only outside study allowed: the KhunLook randomized trial (JMIR 2023, https://www.jmir.org/2023/1/e43196): a parent-facing growth app raised the share of parents with high health literacy from 51.6% to 59.9%. Cite it as evidence about a related app, not about Qiyas. **No vaccination statistics.**
- **`video-script.md`:** follow the beat sheet in `docs/WIN_PLAN.md` §5, with the wow beat from `docs/FABLE_REVIEW.md` §4.
- Update `README.md`: how to run it (`npm install`, `npm test`, `npm run dev`, optional `npm run explain`), prior art, and the naming note.

**CHECKPOINT 3:** final report. Include:
- the test count and coverage;
- `submission/review-list.md`;
- what works, what's stubbed and what was skipped;
- the exact commands Ahmed runs to record the demo.

## 5. Out of scope (don't build)
- BMI-for-age, and ages 5–19 (WHO 2007 reference / AnthroPlus).
- Growth charts over several visits, or saving children.
- A free-text chat box.
- Accounts, a database, deployment or hosting.
- PDF export, a native app, more languages.

## 6. Definition of done
- [ ] `npm test` is green, including the table-driven WHO checks and the edge cases.
- [ ] Both demo profiles render correctly in Arabic (right-to-left) and English, with no console errors.
- [ ] The app works with the AI layer off.
- [ ] Nothing is stored, there are no secrets in git, and no real data is used.
- [ ] Every parent-facing string is in `submission/review-list.md`, and no `TODO` is visible on screen.
- [ ] Commits are pushed.

## 7. Timeline (Madrid)
- **Mon 22:00–01:30:** the agents build Steps 1–7. The orchestrator stops at 01:30 whatever state it's in.
- **Tue 09:00–12:00, Ahmed:**
  - 15 min: a clean run;
  - 30 min: freeze the wording from `review-list.md`;
  - 45 min: record in one pass;
  - 30 min: make the PDF from what runs;
  - 45 min: make the repo public, upload, and **submit by 15:00**.
- **If behind, drop in this order:** the AI layer, then the Normal profile, then visual polish. **Never drop:** sources, the safety boundary, the reviewed wording, or the submission files.

## 8. Where things live
- **Code:** `~/Projects/hackathons/2026-10-univabio-namaa`, with GitHub `DrAhmed7887/namaa` as the source of truth (the repo and folder keep the old name for now).
- **Media** (video, final PDF, screenshots for Devpost): Google Drive `Zayed OS/Hackathons/2026-10-univabio-namaa/`.
- **Tracking:** the Notion row in 🇪🇺 EU Opportunity Scout, "UnivaBio 2026 — Namaa".
- **After the hackathon:** archive to the Extreme SSD under `Archive/hackathons/`. The steps are in the README.
