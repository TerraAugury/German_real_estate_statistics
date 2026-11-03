# 05: Home KPI index

**What to build:** The Home card grid becomes a compact KPI index: one row per KPI with the latest value, its change (ticket 02) and a small sparkline, each linking to the KPI page at the same view as today. A KPI without a public series keeps its "Not available" reason. The Home page title no longer repeats the site name.

**Blocked by:** 02

**Status:** done

- [x] A page-model function gives one row per KPI (value, change, sparkline points or not-available); a test covers a live KPI and a licence-gap KPI
- [x] Each row links to the headline view, as the cards do now
- [x] Stale and fetch-failed Notes still show for the series (spec section 9)
- [x] The document title on Home is the site name once, in EN and DE
- [x] Home keeps its Segment entry points
- [x] Sparklines have an accessible label

## Notes

- `homeIndex()` (src/lib/pages.ts) is the page model; `sparkline()` (src/lib/chart.ts) draws the 120 x 36 trend; `documentTitle()` (src/lib/i18n.ts) gives Home the site name once.
- Each row keeps what the cards had: stale and fetch-failed Notes, the short citation and the lineage disclosure. Segment entry points are unchanged.
- The old `.card` and `.cards` styles are gone (nothing else used them); plate headings are now `figure` only.
- New string `home.spark.label` (DE draft until ticket 11).
- At 375 px a row stacks: name, what it measures, value with sparkline, then Notes and citation. No page scroll at 375 px.
