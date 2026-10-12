> Generated 2026-10-12 21:35 by RWTHgpt gpt-6-sol (Astra quota exhausted). Unreviewed second opinion — see QIYAS_BRIEF.md for the binding build brief.

# Qiyas: win by making the boundary between WHO maths and AI visible

**Blunt verdict:** this is a credible health-tech concept, but the current brief is a **six-hour build disguised as a much larger one**. The winning version is not the one with the most indicators or an open-ended chatbot. It is the one where an engineer can watch a measurement correction change a **tested, deterministic WHO result**, then see that neither the AI nor the interface can change the safety action.

There are **20½ hours on the clock**, but only about **3–4 agent build hours and 3 owner hours**. Plan against the latter. Treat **13 October, 18:00 Madrid as the hard stop** until Ahmed verifies the live Devpost deadline and requirements tonight; the documents disagree.

## 1. Verdict on the concept as it stands

These are scores for the **current idea and documents, with nothing built**, not predicted scores for a finished entry.

| Criterion | Now / 5 | Judge’s likely reaction |
|---|---:|---|
| Idea & Innovation | 3 | Sensible Arabic-first, no-profile positioning; Bebbo already establishes the category. |
| Implementation | 1 | No running product, data, or tests yet. |
| Health Impact & Rigor | 2 | Good safety intent; WHO implementation and clinical wording are unverified. |
| Design & Usability | 1 | A proposed one-screen flow, not an interface someone can use. |
| Presentation | 2 | Strong pitch, but no video, PDF, or honest finished/planned inventory. |

**Biggest weakness judges will see:** “AI for Human Health” currently reads as **a WHO calculator with an optional, possibly absent AI wrapper**. Claim a narrower, defensible innovation: **a safety-bounded explanation layer for an Arabic-first growth check**. Demonstrate the boundary in code and on screen. If the AI layer is not built, say so plainly rather than implying that fixed bilingual copy is AI.

## 2. Highest-leverage changes

| Change | Why it moves the score | Cost |
|---|---|---:|
| **Ship one complete, traceable clinical slice.** Prioritise weight-for-age, length/height-for-age, and weight-for-length/height, with WHO tables, 0.7 cm adjustment, applicable restricted z-score method, flags, and source-linked tests. **Cut BMI-for-age for this entry** if it threatens completion; identify the omission on screen and in the PDF. | Implementation and Rigor. Three correct indicators beat four asserted ones. A judge can trace an expected test value to WHO, rather than trusting a screenshot. | Agent 1.5–2 h |
| **Make safety states unmistakable.** Show separately: measurement needs rechecking; what the valid measurement shows; red-flag action. A red-flag “yes” must **still show the urgent instruction even when a z-score is flagged**—do not hide it behind “no result.” Keep the action fixed by code, not model output. Ahmed approves every displayed clinical sentence before recording. | Health Impact, Design, Rigor. This resolves a dangerous conflict in the brief and makes the physician-engineer advantage tangible. | Agent 0.5 h; Ahmed 0.5–0.75 h |
| **Build the demo around one correction, not three tours of the form.** Provide synthetic preset buttons, a clear “standing under 2 → +0.7 cm” note, resulting indicator values, Arabic/English toggle, and a readable “How this was calculated” disclosure. If time is tight, use **two** presets: correction and red-flag/remeasure. | Design and Presentation. An engineer sees a real transformation and its provenance in seconds. | Agent 0.75–1 h |
| **Time-box a genuinely bounded AI demonstration.** Only after the deterministic app passes: allow AI to simplify an Ahmed-approved explanation for a **synthetic demo**, while band, numerical results, and care instruction stay immutable outside the AI response. No open-ended parent question box. If the local server/API is unreliable after **30 minutes**, cut it, label it planned, and do **not** market the shipped app as AI-powered. | Idea and theme fit, without trading away safety or honesty. | Agent ≤0.5 h; Ahmed 0.25 h to review wording |
| **Finish the submission before polishing.** One-page PDF, accessible code artifact, working prototype recording, and a video under three minutes. | Presentation is worth the same five points as Implementation. An unsubmitted polished app scores zero. | Ahmed 1.75–2 h; agent 0.25 h drafts |

**Explicit cuts:** five-indicator completeness if it delays the core; percentile conversion; six screenshot variants; illustrations beyond a simple lying/standing label; exhaustive coverage targets; open-ended chatbot; production deployment; and any statistics that do not directly support the growth-check problem. The migration/vaccination figures in the brief are **not evidence that parents cannot interpret growth measurements**—leave them out of the one-pager. Cite KhunLook accurately as evidence for a *different parent-facing growth app*, not evidence that Qiyas works.

The brief’s “12 WHO cases plus every edge case” is valuable, but **traceability outranks test count**. Never invent expected LMS values to hit twelve. Record exactly which sourced cases and boundary tests passed.

## 3. The 15-second wow moment

> **Screen recording, Arabic UI.** Click the synthetic “standing, under 2” preset. A small line appears: **“Measured standing → adjusted +0.7 cm for the WHO length calculation.”** The indicator/result updates. Open “How calculated”: show entered measurement → adjusted measurement → WHO table indicator → z-score. Toggle to English; the **numbers and action do not change**, only the explanation does.

Overlay one short caption: **“The model cannot change this result.”** Say that only if the shipped architecture actually enforces it. Do not deliberately choose a preset that changes a clinical band unless verified WHO data produce that change; a visible numeric change is enough.

## 4. Clock plan: Monday 21:30 → Tuesday 18:00

Agent time is capped at **four hours**; owner work at roughly **three**. The intervening hours are sleep, waits, and deadline protection—not a licence to expand scope. Owner and agent can overlap.

| Madrid time | Agent | Ahmed / checkpoint |
|---|---|---|
| **Mon 21:30–22:30** | Locate/download authoritative WHO tables and method documentation; record URLs. Scaffold only if sources are obtained. | **Immediately verify** live deadline, submission fields, video/PDF/code-access rules. Decide whether private GitHub is accessible to judges; otherwise prepare the permitted **code PDF**. **GO/NO-GO 1, 22:30:** no authoritative data → no claimed WHO z-scores. |
| **22:30–23:30** | Implement sourced core and initial reference tests; document scope omitted. | Review proposed result and urgent/remeasure wording. Replace every visible `TODO-AHMED-REVIEW` or prevent that text from appearing. |
| **23:30–00:30** | Complete flags, measurement correction, bands, synthetic fixtures; run tests. | Approve the exact action text and check Arabic/English meaning. **GO/NO-GO 2, 00:30:** if maths cannot be independently checked, do not proceed to an elaborate UI or AI. |
| **Tue 00:30–01:30** | Build minimal responsive bilingual UI, source disclosure and fallback text; build/test. Spend **at most the final 30 minutes** on bounded AI *only if everything else works*. | Quick phone-size and RTL inspection if available; then stop for sleep. **GO/NO-GO 3:** AI failure means remove its control, not ship a broken button. |
| **01:30–02:30** | No planned work. | Sleep. |
| **02:30–03:30** | — | Sleep. |
| **03:30–04:30** | — | Sleep. |
| **04:30–05:30** | — | Sleep. |
| **05:30–06:30** | — | Sleep. |
| **06:30–07:30** | — | Sleep. |
| **07:30–08:30** | — | Sleep / start-up buffer. |
| **08:30–09:30** | — | Run the app from clean instructions. Check both languages, both presets, no storage/secrets, and that red-flag action survives invalid measurement. |
| **09:30–10:30** | — | Freeze clinical wording and capture the actual test result and code walkthrough. If a test fails, remove the affected indicator/claim rather than filming it. |
| **10:30–11:30** | — | Record screen and voice in one pass; use the beat sheet below. |
| **11:30–12:30** | — | Re-record only a materially wrong section. Export and play the entire video once. |
| **12:30–13:30** | — | Make the one-page PDF from what is **actually working**. Include sources, exclusions, and solo attribution. |
| **13:30–14:30** | — | Check accessible code artifact, repo state, no secrets, and all required submission links/files. If GitHub remains private, use the rules-permitted code PDF rather than assuming judges have access. |
| **14:30–15:30** | — | Upload video and PDF; test links in a logged-out/private window where possible. |
| **15:30–16:30** | — | Complete Devpost fields and submit or save the earliest permitted complete submission. **Hard internal deadline: 16:30.** |
| **16:30–17:30** | — | Verify the submitted page and playable media. Fix only broken links, missing files, or factual errors. |
| **17:30–18:00** | — | Final confirmation buffer; no features or fresh recording unless submission is unusable. |

**If behind:** drop AI first, then BMI/percentiles, then the third preset, then visual embellishments. **Never drop** source attribution, the deterministic/safety boundary, owner-reviewed visible wording, a working recording, or the required submission artifacts. If authoritative tables remain inaccessible, pivot to an honestly labelled **measurement-check/communication prototype with no WHO numerical results**; that is weaker, but fabricated clinical maths is disqualifying.

## 5. Video and one-pager

### Video: target 2:20–2:40

| Time | Beat | What to show |
|---|---|---|
| **0:00–0:15** | “WHO did the math. Parents need the meaning.” One sentence on the interpretation gap; acknowledge existing tools. | Product already open—no logo animation. |
| **0:15–0:55** | The wow moment, then explain the correction in plain words. | Synthetic under-2 standing preset, calculation disclosure, AR→EN toggle. |
| **0:55–1:25** | Safety path. | Synthetic red-flag preset; show that urgent action remains visible even if a measurement needs rechecking. Do not imply a diagnosis. |
| **1:25–1:55** | Engineer proof. | WHO source file/URL, a reference-value test, green test output, and the few lines that keep band/action outside any AI response. If AI shipped, briefly show its fallback. |
| **1:55–2:20** | Finished versus planned. | Explicit list: shipped indicators, languages, checks, tests; BMI/AI/other omissions as applicable. |
| **2:20–2:40** | Why this matters and attribution. | Physician review, no real data or storage, credit WHO and Bebbo; solo build. |

**Recording rule:** show only features present in the final build. Do not say “validated clinically” or “exact WHO maths” unless the relevant source-backed checks passed. Say “prototype; not a diagnosis.”

### One-page PDF: reading order

1. **Headline + one screenshot:** Arabic-first, browser-based, one visit, no profile.
2. **Problem and prior art:** WHO tools serve health workers; Bebbo already offers parent-facing growth information. State the specific Qiyas distinction without “first.”
3. **How it works, in a four-box diagram:** synthetic inputs → WHO tables/deterministic calculation → flags and fixed band/action → approved bilingual explanation; optional bounded AI **only if shipped**.
4. **Evidence and safety:** WHO table/documentation citations, number and provenance of passing reference tests, 0.7 cm correction, no diagnosis, no real data/storage, Ahmed’s wording review. KhunLook may be cited as related evidence, not a Qiyas outcome.
5. **Finished / not finished:** explicit indicators and omissions, one line each.
6. **Solo team and links:** Ahmed’s physician-engineer role; working video/prototype and **judge-accessible** code artifact.

## 6. Risks to control

| Risk | Mitigation |
|---|---|
| **WHO data or method mismatch**—wrong table, age indexing, interpolation, or restricted-z handling. | Source every downloaded file and expected value; test boundaries and a known WHO reference value per shipped indicator. Omit an indicator rather than approximate it or silently substitute a formula. |
| **Clinical harm from result wording or flag interaction.** | Ahmed signs off all displayed action text. No diagnosis or invented follow-up interval. Keep urgent red-flag instruction visible even when numerical results are withheld for remeasurement. Do not expose `[___]` or `TODO` in the demo. |
| **AI changes a care instruction or returns treatment advice.** | Fixed band and action rendered from deterministic code; optional model text confined to a separate explanation area with an approved-text fallback. No free-form follow-up feature in this build. No API call with real child data. |
| **“AI” or novelty challenged.** | Credit Bebbo; show the distinctive measurement/safety boundary. If no AI runs, call it a deterministic prototype with a planned AI explanation layer—accept the theme-score cost instead of misrepresenting it. |
| **Deadline or inaccessible submission.** | Verify official timing tonight; target complete submission by 16:30. Test video/PDF links and code access. A private repo link alone is not a safe assumption; use a permitted code PDF if needed. |
| **Six-hour work budget expands into an overnight rewrite.** | Three go/no-go gates; no new feature after the build window. Preserve owner time for clinical approval and submission. |

## 7. Five likely judge questions—and answers

1. **“Is this actually AI, or just a calculator?”**  
   **If AI shipped:** “WHO tables and code determine every number, band, and action. AI only simplifies physician-approved explanatory text; the fixed result and action cannot be edited by its response, and the app works without it.”  
   **If not:** “The submitted prototype is deterministic. Bounded AI explanation is planned, not claimed as shipped.”

2. **“How do you know the z-scores are right?”**  
   “The repo identifies the WHO source tables and method, and tests compare shipped indicators with traceable published values, including measurement correction and boundary cases. Here is one source row and its passing test.” Give the **actual** count, not the brief’s target.

3. **“What happens if a parent enters a bad measurement—or reports swelling?”**  
   “An implausible measurement suppresses its numerical interpretation and requests remeasurement. A red-flag answer independently keeps the physician-reviewed urgent action visible. Neither path diagnoses the child.”

4. **“How is this different from Bebbo?”**  
   “It is not the first growth app. This prototype focuses on an Arabic-first, browser-based, one-visit flow without a stored profile, plus explicit measurement-method correction and visible calculation provenance. We credit Bebbo.”

5. **“Is this suitable for real parents today?”**  
   “No. This is a synthetic-data hackathon prototype, not a diagnosis or a clinically deployed service. Ahmed reviewed the displayed wording; broader clinical validation, usability testing, and deployment safeguards are future work.”

**Winning threshold:** by submission, a judge can open it, trigger the correction, inspect one source-backed passing test, understand the safety boundary, and distinguish shipped work from plans—all without relying on a verbal promise.
