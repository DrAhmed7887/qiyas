# Plan

**Deadline:** **Wed 21 Oct 2026, 03:45 UTC (05:45 Madrid)**, confirmed on Devpost on 12 Oct. Internal target: submitted by **Sat 17 Oct** (Aachen block 19–23 Oct).
**Submission needs:** working prototype · demo video · one-page PDF · GitHub repo or code PDF.
**Judging (5 points each):** Idea & Innovation · Implementation · Health Impact & Rigor · Design & Usability · Presentation (honest about what's finished vs planned).

## Scope (small on purpose)
1. Inputs: age (date of birth or months), sex, weight, length/height, and how it was measured (lying or standing).
2. WHO z-scores for 0–5 years: weight-for-age, length/height-for-age, weight-for-length/height, BMI-for-age. LMS method with WHO's published tables.
3. Measurement checks: lying vs standing (WHO's 0.7 cm adjustment), WHO's flags for implausible values, ages out of range.
4. Plain-language result in Arabic (RTL) and English: what it shows, and when to see a doctor. The rules pick the message band; the language model only rewords it.
5. Static web page. No accounts, no storage.

## Out of scope
School-age 5–19 (AnthroPlus), growth over several visits, PDF export, a native app.

## Hours
- Agents: about 3–4 h of build time.
- Ahmed: about 3 h (review, then record the video and submit).
