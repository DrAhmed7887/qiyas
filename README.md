# Qiyas (قياس) — growth check for parents

**Hackathon:** UnivaBio 2026 (Devpost), theme "AI for Human Health".
**Pitch:** WHO did the math. Parents need the meaning. *Qiyas: the measurement, explained.*

An Arabic-first growth check that runs in the browser, for one visit, with nothing to install. A parent enters date of birth, sex, weight, length or height, and how the child was measured. Qiyas computes the WHO Child Growth Standards z-scores (0–5 years), catches measurement mistakes, then explains the result in plain Arabic or English and says when to see a health worker. It also shows its working: the entered length, the WHO 0.7 cm lying/standing correction, the WHO table row, the z-score and the percentile.

**Not a diagnosis.** No real child data. Nothing you enter is stored (no localStorage, no analytics, no server logs).

## Run it

```bash
npm install
npm test          # engine tests, including every 30th row of every WHO table
npm run dev       # http://localhost:5173
```

Optional AI layer (one fixed parent question, answered from the approved text only; the app works fully without it):

```bash
ANTHROPIC_API_KEY=... npm run explain   # http://localhost:8787, proxied at /api by Vite
```

## How it works

```
inputs ──► web/src/growth/measurement.ts   age in days, 0.7 cm rule at 731 days, wfl vs wfh by age
       ──► web/src/growth/lms.ts           WHO LMS z-score, restricted method beyond ±3 (weight indicators)
       ──► web/src/growth/flags.ts         WHO implausible-value flags → "re-measure", no number shown
       ──► web/src/growth/bands.ts         WHO cut-offs → band; red flags → "see a health worker today"
       ──► web/src/ui/*                    fixed, physician-reviewed Arabic/English text
       ──► server/ (optional)              AI may answer one question in plain words; it cannot change the result
```

- **Deterministic maths, never AI.** z-scores, flags, bands and the action come from code and WHO tables only.
- **Three independent result blocks:** urgent action (red flags), re-measure (implausible values), and what the measurement shows. A red flag shows its urgent action even when every number is implausible.
- **Tests:** WHO's own SD columns are fed back through the engine and must return −3 … +3; plus the restricted method, the 730/731-day boundaries, every flag edge, every validation error and the red-flag override. Run `npm test` for the current count.

## Data

WHO Child Growth Standards expanded tables (weight-for-age, length/height-for-age, weight-for-length, weight-for-height; boys and girls), downloaded from WHO's site on 2026-10-12, values unmodified. URLs and conversion script in [`data/who/SOURCE.md`](data/who/SOURCE.md).

Citation: WHO Multicentre Growth Reference Study Group. *WHO Child Growth Standards: Length/height-for-age, weight-for-age, weight-for-length, weight-for-height and body mass index-for-age: Methods and development.* Geneva: World Health Organization, 2006.

## Prior art, credited openly

- **WHO Anthro** and the **Anthro Survey Analyser**: WHO's own tools, built for health workers and population surveys.
- **UNICEF Bebbo**: a parent app that already checks growth against WHO standards. Its Arabic was removed in April 2025, and it needs an install and a child profile.
- Qiyas is a *measurement check* for one visit: it corrects for how the child was measured and shows the working.

## Scope

**In this build:** weight-for-age, length/height-for-age, weight-for-length/height, ages 0–5, Arabic (default, right-to-left) and English, three synthetic demo profiles.

**Not in this build:** BMI-for-age, ages 5–19, growth over several visits, saving children, a native app, PDF export.

**Naming:** "Qiyas" (قياس) means "measurement". It is also the name of Saudi Arabia's national assessment centre; this project is unrelated.

## Layout
- `web/`: the app (`src/growth/` engine, `src/ui/` page, `src/i18n/` strings)
- `data/who/`: WHO growth-standard tables and their source
- `tests/`: engine tests
- `server/`: optional AI explain layer
- `docs/`: plan, build brief context, reviews
- `submission/`: one-pager, video script, wording review list (rendered files go to Drive, not git)

## Where things live
| What | Where |
|---|---|
| Code (working copy) | `~/Projects/hackathons/2026-10-univabio-namaa` on the MacBook Pro |
| Code (source of truth) | GitHub `DrAhmed7887/namaa` (private until submission) |
| Video, PDF, screenshots | Google Drive `Zayed OS/Hackathons/2026-10-univabio-namaa/` |
| Tracking | Notion → 🇪🇺 EU Opportunity Scout → UnivaBio row |

## When the hackathon is over (keep the laptops light)
1. Push everything and tag it: `git tag univabio-submission && git push --tags`
2. Bundle it to the SSD archive: `git bundle create "/Volumes/Extreme SSD/Archive/hackathons/2026-10-univabio-namaa.bundle" --all`
3. Check the bundle: `git bundle verify <that file>`
4. Only then, with Ahmed's OK, move this local folder to the Trash. GitHub + the SSD bundle keep it; Drive keeps the media.

Built solo by Dr. Ahmed Zayed, physician-engineer.
