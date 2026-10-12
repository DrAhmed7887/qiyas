# Namaa (نماء) — growth check for parents

**Hackathon:** UnivaBio 2026 (Devpost), theme "AI for Human Health".
**Pitch:** WHO did the math. Parents need the meaning.

An Arabic-first growth check that runs in the browser, for one visit, with nothing to install. A parent enters age, sex, weight and height. Namaa computes the WHO Child Growth Standards z-scores (deterministic, tested against WHO's published tables), catches measurement mistakes (length lying down under age 2, impossible values, wrong ages), then explains the result in plain Arabic or English and says when to see a doctor.

**Prior art, credited openly:** UNICEF's Bebbo app already checks growth against WHO standards for parents. Its Arabic was removed in April 2025, and it needs an install and a child profile. WHO's own tools (Anthro, the Survey Analyser) are for health workers and surveys.

**Never:** a diagnosis ("your child is malnourished"), real child data, or stored measurements. Synthetic examples only.

## Layout
- `web/`: the app
- `data/who/`: WHO growth-standard tables (public data, cited in `data/who/SOURCE.md`)
- `tests/`: z-score checks against WHO's published values
- `docs/`: plan and build brief
- `submission/`: one-page PDF source and video script (rendered files go to Drive, not git)

## Where things live
| What | Where |
|---|---|
| Code (working copy) | `~/projects/hackathons/2026-10-univabio-namaa` on the MacBook Pro |
| Code (source of truth) | GitHub `DrAhmed7887/namaa` (private until submission) |
| Video, PDF, screenshots | Google Drive `Zayed OS/Hackathons/2026-10-univabio-namaa/` |
| Tracking | Notion → 🇪🇺 EU Opportunity Scout → UnivaBio row |

## When the hackathon is over (keep the laptops light)
1. Push everything and tag it: `git tag univabio-submission && git push --tags`
2. Bundle it to the SSD archive: `git bundle create "/Volumes/Extreme SSD/_WORKSPACE/03_ARCHIVE/hackathons/2026-10-univabio-namaa.bundle" --all`
3. Check the bundle: `git bundle verify <that file>`
4. Only then, with Ahmed's OK, move this local folder to the Trash. GitHub + the SSD bundle keep it; Drive keeps the media.
