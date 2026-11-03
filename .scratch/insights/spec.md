# Spec: Insights

Status: assembled from resolved tickets 01-05 and the map's Notes. Building is a separate, later effort.
Source of truth for decisions: the tickets in `issues/`. This document synthesises them and decides nothing new. Anything a builder needs that no ticket settles is under [Open questions](#10-open-questions).

| Ticket | Subject | Status |
|---|---|---|
| 01 | Office employment: is there an Open source? | resolved |
| 02 | Calculation rules | resolved |
| 03 | Chart form | resolved |
| 04 | Final catalogue | resolved |
| 05 | Page and site integration | resolved |

---

## 1. Purpose and scope

An **Insight** (DE *Einblick*; see `GLOSSARY.md`) is a curated chart that puts several series on one axis over a stated period, with a fixed one-line reading. It carries no coefficient and no lag, so it is not a Link. Prompted by "net initial yields by City class vs 10-year Bund, 1995-2025".

- Insights are curated and fixed. No visitor-built charts, no free series pairing, no dual axes.
- Every Insight contains at least one Real estate KPI; GDP vs unemployment is out.
- The reading states where the latest value sits against the past. It never implies mean reversion, a cause or a forecast.
- Reuses the existing pipeline, manifest, Note module, Provisional gate and bilingual review. The only new Open source is one Destatis series (section 3).

## 2. Catalogue (T04)

Ten Insights, in page order. All are annual. Out: L (GDP vs vacancy, duplicates H), H (vacancy vs unemployment), K (completions vs GDP, Provisional and thin). Public today: **C and J only**; every other Insight uses a Provisional series and is hidden in production.

| # | Key | Series (manifest keys) | Shared period (obs) | Headline measure | Today |
|---|---|---|---|---|---|
| 1 | A | `initial-yield-combined-7`, `-127`; `bund-yield-10y` (annual mean) | 1995-2025 (31) | Spread, pp: 7-city yield minus Bund; 127 towns also shown | Provisional |
| 2 | F | `initial-yield-combined-7`; `loan-rate-nfc` | 2011-2025 (15) | Spread, pp: yield minus corporate loan rate | Provisional |
| 3 | G | `price-index-de-office-a`; `rent-index-de-office-a` (2015 = 100) | 2013-2025 (13) | Ratio: price index / rent index | Provisional |
| 4 | B | `rent-index-de-office-a`; `cpi` (annual average, flow) | 2004-2025 (22) | Real office rent growth, % | Provisional |
| 5 | D | `rent-index-de-office-a`; `construction-price-office` (annual mean) | 2004-2025 (22) | Spread, pp: rent growth minus construction price growth | Provisional |
| 6 | I | `rent-index-de-office-a`; `gdp-real` | 2004-2025 (22) | Spread, pp: rent growth minus real GDP growth | Provisional |
| 7 | C | `construction-completions-office`; `construction-permits-office` (Destatis) | 2010-2025 (16) | Ratio: completions in t / permits in t-2 | **Public** |
| 8 | J | `construction-price-office`; `cpi` | 1991-2025 (35) | Spread, pp: construction price growth minus CPI inflation | **Public** |
| 9 | E | `office-vacancy-7`; `office-vacancy-127` | 1995-2025 (31) | Spread, pp: 7 cities minus 127 towns | Provisional |
| 10 | M | `office-vacancy-127`; new office employment series (section 3) | about 1996-2024/25 | Year-on-year change in vacancy, pp; employment growth shown as context | Provisional vacancy |

Notes on the table:
- Periods are of the levels; growth-based headlines (B, D, I, J, M) lose the first year. GDP, the Bund and the loan rate are cut to full years (loan rate starts 2011). Every Insight still clears the 10-observation minimum.
- **City classes**: only 7 and 127 are shown; 120 is dropped (127 contains it; T03). F uses 7, M uses 127.
- **Segments**: B, D, G, I, M use the office series for Germany; A, E, F use the "office and retail combined" City class series (the only one that exists); E and M use office vacancy.
- **C**: Destatis, not the longer Provisional Bundesbank series. The chart shifts permits forward two years, labelled "permits, two years earlier", because permit to completion takes about two years.
- **M**: national office employment against 127-town vacancy; no NUTS 3 sum, so the glossary's "no named-city series" line is **not** narrowed. Both series are plotted as year-on-year change on one axis (vacancy in points, employment in %). Only the vacancy change gets the verdict. The rank correlation stays on the Link pages. A Destatis `0.0` for an unpublished year is missing, so M may end in 2024.
- **Deflating**: only B deflates, as a flow with the annual-average CPI. No Insight deflates a price, so whether the Bundesbank price index is an average or a year-end value does not matter here.
- **Titles and page order**:

| # | EN | DE (draft, not yet Reviewed) |
|---|---|---|
| 1 A | Initial yield spread over the 10-year Bund, by City class | Renditeabstand der Anfangsrendite zur 10-jährigen Bundesanleihe, nach Städtegruppe |
| 2 F | Initial yield spread over the corporate loan rate | Renditeabstand der Anfangsrendite zum Unternehmenskreditzins |
| 3 G | Office prices vs rents | Büropreise und Büromieten |
| 4 B | Real office rents | Reale Büromieten |
| 5 D | Office rents vs construction costs | Büromieten und Baupreise |
| 6 I | Office rents vs GDP | Büromieten und Wirtschaftsleistung |
| 7 C | Office completions vs permits two years earlier | Büro-Fertigstellungen und Baugenehmigungen zwei Jahre zuvor |
| 8 J | Construction costs vs inflation | Baupreise und Inflation |
| 9 E | Office vacancy: 7 major cities vs 127 towns | Büroleerstand: A-Städte und 127 Städte |
| 10 M | Office vacancy and office employment | Büroleerstand und Bürobeschäftigung |

The order groups yields, rents, supply, vacancy. Hidden Provisional Insights leave no gap.

## 3. New Open source: office employment (T01)

`DESTATIS/13311BJ002/DG.WZ08-K-N.ERW063`: persons in employment, WZ 2008 sections K-N, annual 1991-2025, Germany (Länder in 13311LJ002). Licence dl-de/by-2-0. No source publishes a City class aggregate; GENESIS needs credentials; the BA API has no sector split. Needs a new `manifest/series.yaml` entry (Destatis publisher, licence and attribution anchors already exist there). Details: `research/office-employment.md`.

## 4. Calculation rules (T02)

All rules live in one pure, tested module `src/insight/insight.ts` beside `src/link/link.ts`, with fixtures like the Link tests and no page code.

- **Frequency**: an Insight runs at the coarsest frequency of its series, using the Link period-mean function. A period with missing observations is dropped, never partly averaged (the Bund, GDP and CPI end at the last full year).
- **Shared period**: the overlap of all series; the average and standard deviation use all of it. At least **10** annual observations to show an Insight, otherwise the existing "not shown" empty state with the reason. Under **20**, a short-history Note says the average is weak.
- **Rebasing**: index or differently-united series are rebased to **2015 = 100**; a series without a 2015 value falls back to its first shared year. 2015 is the year of the ECB's asset purchases, stated on the Methodology page as a reference point only, never as a cause. The axis label names the base ("index, 2015 = 100").
- **Deflating**: real = nominal / CPI x 100, then rebased, so the CPI's own base year drops out. Annual-average CPI for flows (rents), December CPI for stocks (property prices); the mode is a per-Insight parameter. Labelled "own calculation".
- **Headline kinds**: spread (percentage points), ratio, difference (same unit), year-on-year growth (%). One decimal, ratios two, through `Intl` (EN "1.5", DE "1,5"). "Gap" in earlier tickets means spread.
- **Verdict**: mean and population standard deviation over the whole shared period, latest value included. "In line" when the latest value is within half a standard deviation of the mean, otherwise "higher" or "lower". A zero standard deviation reads "in line".
- **Reading templates (EN)**, filled at build time, reviewed once in EN and DE; verdict words "higher than" / "lower than" / "in line with":
  - Spread (A, D, E, F, I, J): "The latest {name} is {latest} points, {verdict} the {from}-{to} average of {mean} points."
  - Growth (B): "Real office rents grew {latest}% in {to}, {verdict} the {from}-{to} average of {mean}%."
  - Ratio, C: "Completions were {latest} times the permits issued two years earlier, {verdict} the {from}-{to} average of {mean}."
  - Ratio, G: "The price index stands at {latest} times the rent index, {verdict} the {from}-{to} average of {mean}."
  - M: "Office vacancy changed by {latest} points in {to} while office employment grew {emp}%; the {from}-{to} average vacancy change is {mean} points."

## 5. Chart form (T03, prototype variant C + D)

Top to bottom:
1. **Headline number and verdict tag**: the latest value of the headline measure in large type, tag "in line with / higher than / lower than the average".
2. **Reading sentence** from the template.
3. **Main chart**: the headline measure over time, latest point labelled, dashed average line labelled "average x", grey band for average +/- half a standard deviation.
4. **Small multiples**: one small chart per compared series (e.g. per City class), each against the reference series (e.g. the Bund in ochre), the gap between the lines shaded blue where the KPI is above and red where below (Plot `differenceY`), shared y-domain.

Then Notes and source lines in the figcaption. One y-axis only. Prototype: branch `prototype/insight-chart-form` (local, never merged), run with `npm run prototype:insights`.

## 6. Page and site integration (T05)

- **Route**: page key `insights`, slug `insights` (EN) / `einblicke` (DE), added to `routes` and `built` in `src/lib/routes.ts`. Nav entry after Links, before Availability. Footer unchanged. No Home card, no Insights column on the Links overview.
- **Page**: two-sentence intro, a jump list of the visible Insights' titles, then one section per Insight in catalogue order; section id = the Insight's `key`. If production hides every Insight the page still builds with one sentence (none published yet, licences being confirmed); the nav entry stays.
- **KPI pages**: an "Insights using this KPI" list below the Link panels, one link per Insight (title, to `/insights#key`), only Insights that pass the Provisional gate, absent when none do. Initial yield: A, F. Rent index: B, D, G, I. Price index: G. Office vacancy: E, M. Construction: C, J.
- **Notes**: Link-panel pattern. Order: the Insight's short-history Note, then each series' stale, fetch-failed and revised Notes prefixed with the series title; scope Notes (index, city class, combined) once. Source line: the existing line once per series; calculated series tagged `source.own` (spread, real, rebased, shifted, Bund annual mean); plus a "How this is calculated" link to Methodology.
- **Provisional gate**: an Insight with any Provisional series is hidden in production and shown in previews. Status is derived from its series, never declared. `npm run dev` becomes `INCLUDE_PROVISIONAL=1 astro dev`; `build` stays production, `INCLUDE_PROVISIONAL=1 npm run build` is the preview.

## 7. Declaration and build checks (T05)

New hand-written `manifest/insights.yaml`, separate from `series.yaml`. Entry: `key`, EN/DE `title`, `headline` (spread | growth | ratio), `series` with a `role` (kpi | reference), options (`deflate: flow`, `shift: 2`, `base: 2015`), reading template key. Order is file order. The build fails on: unknown series key, no KPI series (checked against `KPIS` in `src/lib/kpis.ts`), duplicate key, missing title in either language, unknown headline kind or template. The 10-observation minimum is the "not shown" state, not a build error.

## 8. i18n, review and Methodology (T05)

- Titles live in `insights.yaml` (manifest-text pattern). Reading templates, verdict words, intro, empty state, new Notes and the list heading are `insight.*` keys in `en.yaml` and `de.yaml`. All are covered by the existing `de.reviewed.lock` hash flow: production fails on unreviewed German, previews show `[DRAFT]`. No new review mechanism.
- Methodology gains an "Insights" section in `content/en/methodology.md` and `content/de/methodology.md` (German Reviewed through the prose hash): what an Insight is (no cause or forecast), annual frequency and period means, shared period and the 10/20 thresholds, 2015 = 100 as a reference point only, flow vs stock deflating, the three headline kinds, the verdict rule (mean, population SD, +/- half SD), C's two-year shift, M's year-on-year change.

## 9. Done criteria for the build handoff

- `src/insight/insight.ts` with tests for: period means and dropped partial years, shared period, minimum 10 and Note under 20, rebasing with 2015 fallback, flow vs stock deflating, each headline kind, the two-year shift, the verdict at the half-SD boundary and zero SD.
- `manifest/insights.yaml` with the ten Insights and the build checks above; the employment series added to `series.yaml` and fetched.
- The Insights page, nav entry, KPI-page lists, Notes, source lines, `insight.*` keys and Methodology section, EN and DE.
- In production only C and J appear; with `INCLUDE_PROVISIONAL=1` and under `npm run dev` all ten.
- `vitest`, `tsc`, `astro check` and `build` (production and preview) pass.

## 10. Open questions

Resolved by the build (`.scratch/insights-build/`):

- **Small multiples for ratio and growth Insights**: built as the default says, the two rebased lines with the same shading; Insights that compare levels in one unit (A, F, E) show the levels.
- **Narrow (320 px) layout**: checked on the built Insights page in English and German, all ten sections, no horizontal scroll. The only overflow was a long Destatis series id in the source line; fixed for every source.
- **M's end year**: Destatis publishes 2025 for sections K-N, so M runs 1996 to 2025.
- **Home**: no Home card and no Links-overview column; out of scope.
- **KPI check for J**: J (construction prices vs CPI) has no series in `KPIS`; the build check accepts the construction price series as the Construction KPI's.

Still open:

- **Launch gates**: Insights using Provisional series appear only once the Bundesbank redisplay permission (cre-site tickets 08, 14) is confirmed.
- **German wording**: the DE titles, measures, templates and Methodology text are drafts until Reviewed by a named human (build ticket 12).
