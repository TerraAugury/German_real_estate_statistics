# 01: Walking skeleton: Insights page with Insight J

**What to build:** A reader opens Insights from the nav, in English or German, and sees Insight J (construction costs vs inflation) end to end: the headline number with its verdict tag, the one-line reading, and the main chart with the average line and the half-standard-deviation band. This slice carries the whole path: the pure calculation module, the Insight declaration with its build checks, the derived Provisional gate and the page.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

Spec: `.scratch/insights/spec.md`, Sections 4 to 7 and 9.

- [ ] Calculation module, pure and tested with fixtures like the Link tests: period means with partial periods dropped, shared period, year-on-year growth, spread headline, verdict (in line within half a standard deviation, zero deviation reads "in line"), at least 10 observations to show and a short-history flag under 20
- [ ] Number formatting through `Intl` (EN "1.5", DE "1,5")
- [ ] Insights are declared in one hand-written manifest file separate from the series manifest; the build fails on an unknown series, no Real estate KPI series, a duplicate key, a missing EN or DE title, or an unknown headline kind or template
- [ ] An Insight's Provisional status is derived from its series, never declared; Provisional Insights are hidden in production and shown in previews; `npm run dev` shows them
- [ ] Insight J is declared and shown in production
- [ ] New Insights page (slug `insights` / `einblicke`) with a nav entry after Links and before Availability, a two-sentence intro, a jump list of visible Insights, one section per Insight; if production hides every Insight the page still builds with one sentence and the nav entry stays
- [ ] Main chart: one y-axis, latest point labelled, dashed average line labelled "average x", grey band for average plus or minus half a standard deviation
- [ ] The "not shown" state names the reason when data is too thin
- [ ] Interface strings in both language files; vitest, tsc, astro check and both build modes pass

## Notes

Production builds fail on unreviewed German, so the new German strings block production until ticket 12.
