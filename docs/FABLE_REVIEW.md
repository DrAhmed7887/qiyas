> Generated 2026-10-12 ~21:50 by claude-fable-5-1 via the Anthropic API (11.4k in / 9.8k out). Review of QIYAS_BRIEF.md + WIN_PLAN.md. Not yet folded into the brief.

# Qiyas — final review before build

## 1. Sol's WIN_PLAN: disagreements, then what I accept

**Wrong / overcautious / missing**

- **Owner clock is fiction.** Sol gives Ahmed 22:30–00:30 tonight *plus* 8:30–17:30 tomorrow (≈10 h). He has 3. Ahmed does 15 min tonight (deadline check, GO), sleeps, then one 2.75 h morning block. All clinical review happens in the morning in a single pass.
- **Cutting percentiles is false economy.** `Φ(z)` is three lines; health workers in the Arab world read percentiles, not z. Keep it in the "exact numbers" fold.
- **"Don't pick a preset that changes the band"** is backwards. The 0.7 cm rule crossing a cut-off *is* the demo. The engine is tested; brute-force a synthetic triple that flips. A numeric wiggle is not a wow.
- **AI-as-paraphraser is the weakest possible AI story.** An engineer-judge will ask why you need an LLM to reword a sentence. If AI ships at all, demo *one fixed* parent question ("هل أوقف الرضاعة؟") with the guardrail visibly refusing to touch the band. No free-text box, agreed.
- **The "WHO tables inaccessible" pivot is paranoia.** Fallback is `github.com/WorldHealthOrganization/anthro` (the CRAN package ships the LMS tables as data files). Name the fallback; don't plan a different product.
- **Conditional BMI cut is indecision.** Decide now: cut BMI-for-age. WHO under-5 overweight/wasting classification uses WFL/WFH; BMI-for-age adds nothing a parent sees.
- **Missing the biggest engineer-proof.** The WHO expanded tables carry `SD3neg…SD3` columns next to L/M/S. A table-driven test that feeds every row's SD columns back through the engine and expects exactly ±3/±2/±1/0 gives thousands of traceable cases for free. That beats "12 cases."
- **Missing the WFL vs WFH selection rule** (by age, not by measurement type) and lookup-key rounding — see §2.
- **"Weight loss since last visit" is a one-visit app contradiction.** Reword as "has the child lost weight recently" or drop it.

**Accepted without repetition:** cut vaccination stats; urgent action survives an implausible flag; AI time-boxed to 30 min and never marketed if absent; traceability > count; the drop order; no `TODO`/`[___]` visible on screen; go/no-go gates; code PDF if repo stays private; Bebbo credited; the judge Q&A.

## 2. Brief: clinical/technical check

| Item | Verdict |
|---|---|
| LMS `z = ((X/M)^L − 1)/(L·S)` | Correct. Guard `L = 0 → ln(X/M)/S` (never hit in these tables, but write it). |
| Restricted method on WAZ, WFL/WFH, BAZ only; not LHFA | Correct. Formulas: `z>3: 3 + (X − SD3pos)/(SD3pos − SD2pos)`; `z<−3: −3 + (X − SD3neg)/(SD2neg − SD3neg)`, with `SDk = M(1 + L·S·k)^(1/L)`. Write them in the brief — "SD3/SD23 adjustment" is a label, not a spec. |
| Flags: LHFA ±6; WAZ −6/+5; WHZ ±5; BAZ ±5 | Correct. **Verify** whether flags are evaluated on the restricted z (igrowup does; I believe yes). |
| 0.7 cm rule | Correct direction. Boundary: WHO igrowup uses age **< 731 days** = length, **≥ 731** = height. Say that in days, not "24 months". |
| "Length tables below 24 mo, height tables from 24 mo" | **Misleading.** Length/height-for-age is **one** table (0–1856 days). The switch is **WFL (45–110 cm) vs WFH (65–120 cm)**, chosen by *age* (<731 days → WFL with adjusted length; ≥731 → WFH with adjusted height), not by how the child was measured. Out-of-range → no z, not an error. |
| Months → days `× 30.4375` | Correct constant. **Verify** rounding: `24 × 30.4375 = 730.5` lands on the table switch. Specify `round()` and test the boundary. DOB input avoids this; make DOB the primary path. |
| Lookup keys | Missing: age → integer day, length/height → nearest 0.1 cm (WFL/WFH tables are in 0.1 cm steps). No interpolation. |
| WFL/WFH bands (−3, −2, +1, +2, +3) and WAZ/LHFA (−3, −2) | Correct. Note WAZ has no overweight band by WHO; don't invent one. |
| Validation ranges (0.9–58 kg, 38–150 cm) | Harmless as UI limits; **verify** they are WHO Anthro's input limits before citing them as such. |
| Test tolerance ±0.01 | Too tight if you invert WHO's **rounded** 1-decimal SD charts (~0.03 z error at 3 kg). Use the expanded tables' multi-decimal SD columns → tolerance 0.001. |
| BMI | Cut; if kept, compute from the **adjusted** length/height. |
| Red flags | Bilateral foot swelling (oedema) is IMCI-standard; fine. Fix the "last visit" wording. |
| `claude-haiku-4-5` | **Verify** exact model ID string; the API may require the dated form. |
| Devpost deadline | Ahmed verifies tonight. Unresolved = 13 Oct 18:00 stands. |

## 3. Name

"Qiyas" is better than "Namaa": it says *measurement check*, not *growth monitor*, which is exactly the Bebbo distinction. Keep "WHO did the math. Parents need the meaning." as the pitch; use **"Qiyas (قياس): the measurement, explained."** as the product subtitle. One caveat: Qiyas is also the Saudi national testing centre; harmless for a hackathon, note it in the README's naming line.

## 4. FINAL build order

**Ahmed, tonight, 15 min:** verify live Devpost deadline, required fields, video-host rule. Confirm he flips the repo public at submission. Say GO.

**Agent (≤4 h, hard stop 01:30):**

1. **Data (20 min).** Download WHO *expanded tables by day*: wfa, lhfa, wfl, wfh, boys+girls (8 files). Skip BMI. Convert to JSON keyed `day` / `length×10`, keeping L, M, S **and SD3neg…SD3**. `SOURCE.md` with URLs, date, citation. Fallback source: `github.com/WorldHealthOrganization/anthro`. Never type values. **GO/NO-GO:** no sourced tables → stop and report.
2. **Engine, tests first (60 min).** `lms.ts` (z, SD_k, restricted), `measurement.ts` (age days via DOB or `round(months×30.4375)`; 0.7 rule at 731 days; WFL/WFH by age; 0.1 cm rounding), `flags.ts`, `bands.ts`. Tests: (a) table-driven, every 30th row of every table, SD columns → ±3/±2/±1/0 within 0.001; (b) restricted method assembled from a row's SD2/SD3; (c) 730/731-day and 24-month-input boundaries; (d) each flag edge; (e) each validation error; (f) one flagged-z + red-flag case asserting urgent text still present.
   **CHECKPOINT 1:** test count, pass rate, provenance per group.
3. **Page (60 min).** `index.html`, Arabic default, RTL, large targets. Result card = three *independent* blocks: Remeasure / What the measurement shows / Urgent action. "How calculated" fold: entered → adjusted (+0.7 note) → table used → z → percentile. Strings in `ar.json`/`en.json`; review flags live in `submission/review-list.md`, **never on screen**; follow-up timing sentence says "ask your health worker when to return" — no blanks. Two presets: **Correction** (band flips), **Red flag + implausible** (urgent survives). Add "Normal" only if ≤5 min.
   **CHECKPOINT 2:** `npm run build && npm run preview`, 4 screenshots (2 presets × 2 langs), zero console errors.
4. **Drafts (20 min).** `one-pager.md` (Sol's reading order; KhunLook as related evidence only; no vaccination stats), `video-script.md` (Sol's beat sheet), README run steps + prior art + naming note. Push.
5. **AI, only if clock < 01:00 (≤30 min).** One button: "Ask: should I stop breastfeeding?" → `server/explain.ts` → Haiku, system prompt per brief, output in a boxed "AI answer (experimental)" area below the fixed card. Drug/dose/urgency-word filter → fallback text. One mocked test. Not working by 01:30 → delete the button, write "planned" in one-pager.
   **CHECKPOINT 3:** finished/stubbed/skipped, review-list, exact demo commands.

**Cut:** BMI-for-age, free-text question box, illustrations beyond a text label, coverage target, Docker/deploy.

**Ahmed, Tuesday 09:00–12:00 (2.75 h):** clean run (15) → wording freeze from review-list (30) → record one pass (45) → PDF from what runs (30) → repo public, upload, submit by 15:00 (45). Verify links logged-out. No features after 12:00.

**15-second wow beat (Arabic UI):** click **"20 months, measured standing."** A line appears: *قياس واقفًا ← +0.7 سم ← طول 79.7 سم*. The band label flips (e.g. "low" → "within expected range"). Open "How calculated": entered → adjusted → WHO table row → z → percentile. Toggle EN: **every number and the action stay identical; only the words change.** Caption: *"WHO did the math. Qiyas explains it."*
