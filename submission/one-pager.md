# Qiyas (قياس) — "The Measurement, Explained"

> *WHO did the math. Parents need the meaning.*

![Arabic-first result card, correction profile](screenshots/correction-ar.png)

Browser-based. Arabic by default. One visit. No install, no profile, nothing stored.

---

## Problem & Prior Art

WHO's Child Growth Standards (2006) define the z-scores. WHO's own tools—**Anthro** and the **Anthro Survey Analyser**—are built for health workers running population surveys. UNICEF's **Bebbo** app gave parents growth bands, but removed its Arabic interface in April 2025 and requires an app install plus a saved child profile. Qiyas is a *measurement check*: it runs in the browser, corrects for how the child was measured, and explains the result in the parent's language. It complements, not replaces, the tools above.

## How It Works

```
Inputs (DOB, sex, weight, length, lying/standing)
  → WHO 2006 tables + deterministic LMS engine (0.7 cm rule at 731 days, restricted z)
  → WHO implausibility flags · fixed band · independent urgent-action check
  → approved Arabic/English explanation  (+ bounded AI: shipped as an optional local server; one fixed question, answered from the approved text, output filtered, never changes the result)
```

## Evidence & Safety

- **Source data:** WHO Multicentre Growth Reference Study Group, *WHO Child Growth Standards*, 2006. Eight expanded LMS tables downloaded unmodified; URLs in `data/who/SOURCE.md`.
- **Tests:** 128 automated tests, all green. Expected values are WHO's own table rows: every 30th row's SD columns are fed back through the engine and must return −3 … +3 (within the rounding of WHO's 3-decimal tables; ±0.001 z against SD lines recomputed from L, M, S).
- **0.7 cm correction** applied at the 731-day boundary, per WHO guidance.
- **No diagnosis language.** The app states what the measurement shows and when to see a health worker.
- **No data stored.** No localStorage, no analytics, no server logs.
- **Clinical wording** reviewed and signed off by Dr. Ahmed Zayed (physician, 12 years' practice). <!-- ORCHESTRATOR: true only after Ahmed's Tuesday review of submission/review-list.md -->
- **Related evidence:** KhunLook randomised trial (JMIR 2023, https://www.jmir.org/2023/1/e43196) — a parent-facing growth app raised high health-literacy scores from 51.6 % to 59.9 %. Cited as context for a related app, not as a Qiyas outcome.

## Finished / Not Finished

- **Shipped:** weight-for-age, length/height-for-age and weight-for-length/height for ages 0–5; WHO 0.7 cm correction; implausible-value flags; red-flag override; Arabic (RTL) and English; "how this was calculated" view
- **Not in this build:** BMI-for-age, ages 5–19, multi-visit tracking, native app, PDF export.

## Team & Links

**Solo:** Dr. Ahmed Zayed — physician (12 yrs), physician-engineer, M.Sc. student, Applied Health Informatics & Digital Medicine (RWTH Aachen). Reviews and signs all clinical wording.

- Prototype & video: [Devpost submission](https://devpost.com/)
- Code: [github.com/DrAhmed7887/namaa](https://github.com/DrAhmed7887/namaa)

*Not a diagnosis. Uses WHO Child Growth Standards (2006). Nothing you enter is stored.*
