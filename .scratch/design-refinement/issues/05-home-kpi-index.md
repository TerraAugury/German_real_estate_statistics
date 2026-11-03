# 05: Home KPI index

**What to build:** The Home card grid becomes a compact KPI index: one row per KPI with the latest value, its change (ticket 02) and a small sparkline, each linking to the KPI page at the same view as today. A KPI without a public series keeps its "Not available" reason. The Home page title no longer repeats the site name.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] A page-model function gives one row per KPI (value, change, sparkline points or not-available); a test covers a live KPI and a licence-gap KPI
- [ ] Each row links to the headline view, as the cards do now
- [ ] Stale and fetch-failed Notes still show for the series (spec section 9)
- [ ] The document title on Home is the site name once, in EN and DE
- [ ] Home keeps its Segment entry points
- [ ] Sparklines have an accessible label
