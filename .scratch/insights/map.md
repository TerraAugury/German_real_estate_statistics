# Map: Insights

Label: wayfinder:map

## Destination

A build-ready spec for adding Insights (see `GLOSSARY.md`) to the site: the final catalogue, the calculation and reading rules, the chart form, and where Insights sit on the site. Reaching the end means nothing is left to decide before a build effort starts. Building them is a separate, later effort.

## Notes

- Domain language is in `GLOSSARY.md`. An **Insight** is a curated chart with several series on one axis and a fixed one-line reading. It is not a **Link**: it has no coefficient and no lag. Prompted by a "net initial yields by City class vs 10-year Bund, 1995–2025" chart.
- Settled while charting (2026-11-02):
  - The destination is a spec, not code.
  - Insights are curated and fixed. There is no visitor-built chart builder.
  - Insights may show calculated series (spreads, inflation-adjusted, rebased), labelled "own calculation" like existing derived series.
  - **Provisional**: an Insight that uses any Provisional series is hidden in production and shown in previews. A plain `npm run dev` must also show them; today it needs `INCLUDE_PROVISIONAL=1`, and the spec includes that dev default.
  - **Placement**: one Insights page in the main navigation, one anchor per Insight. Every KPI page an Insight uses links to it.
  - **Units**: one y-axis only, never two. Series with different units are each rebased to 100 in their first shared year.
  - **Reading**: a template filled at build time, reviewed once in EN and DE. It compares the latest value of the Insight's **headline measure** with its historical mean over the full shared period. The verdict is "in line" when the latest value is within half a standard deviation of the mean, otherwise "higher" or "lower". The mean and the period are stated in the sentence, e.g. "The latest spread over the Bund is 1.5 points, higher than the 1995–2025 average of 1.1 points."
  - **Headline measure**: each Insight names one measure with no trend (a gap, ratio, difference or growth rate). It is never the level of a series that trends upward.
  - Every Insight contains at least one Real estate KPI.
- Candidate catalogue, agreed in principle (exact series, segments and City classes per Insight are decided in ticket 04):
  - A. Initial yield premium over the 10-year Bund, by City class
  - B. Real rents: rent index deflated by CPI
  - C. Construction pipeline: permits vs completions
  - D. Rents vs construction costs
  - E. City class gap (vacancy or rent, 7 cities vs 127 towns)
  - F. Initial yield vs corporate loan rate (2010+)
  - G. Prices vs rents (2013+)
  - H. Office vacancy vs unemployment rate
  - I. GDP vs rent index
  - J. Construction costs vs CPI
  - K. Office completions vs GDP
  - L. GDP vs vacancy
  - M. GDP vs office employment, only if ticket 01 finds an Open source, and only with a Real estate KPI added (e.g. office employment vs office vacancy)
- Reuse the existing pipeline, manifest, Note module, Provisional gate and bilingual review. No new Open source unless ticket 01 finds one.
- Tracker: local markdown, tickets in `issues/`, per `docs/agents/issue-tracker.md`.

## Decisions so far

<!-- one line per resolved ticket: [title](issues/file.md): gist -->
- [Office employment: is there an Open source?](issues/01-office-employment-open-source.md): yes, `DESTATIS/13311BJ002/DG.WZ08-K-N.ERW063` (persons employed in WZ K-N, annual 1991-2025, Germany; Länder in 13311LJ002; dl-de/by-2-0); no City class source, so Insight M stays in.

## Not yet specified

- Whether Home features one Insight, and whether the Links overview gains an Insights column.
- How an Insight behaves when its series are Stale, Revised or a fetch failed (likely the existing Notes, but the Insight-level wording isn't settled).
- Methodology page section for Insights (calculation rules, the half-standard-deviation rule, rebasing), once ticket 02 settles the rules.

## Out of scope

- Visitor-built charts and free series pairing.
- Dual-axis charts.
- Any reading that implies mean reversion, a cause or a forecast. The verdict only states where the latest value sits against the past.
- Insights with no Real estate KPI, e.g. GDP vs unemployment.
