# 06: Home hero

**What to build:** Home opens with one large chart and its fixed one-line reading, taken from the yield-spread Insight (or the first Insight that is shown in the production build), above the KPI index. It describes what the lines show, never a cause or forecast. When no Insight is shown, Home opens with the KPI index as before.

**Blocked by:** 05

**Status:** done

- [x] The hero picks only an Insight that passes the Provisional gate for the current build; a test covers production and `INCLUDE_PROVISIONAL=1`
- [x] The hero shows the headline number, verdict tag, reading, chart and citation, and links to the Insight on the Insights page
- [x] Home with no shown Insight renders without a hero and without an empty gap
- [x] The hero is the only element above the fold that uses the large headline number
- [x] Home stays within the page-weight limit and has no horizontal scroll at 375 px
- [x] The insights spec section 10 records that Home now shows one Insight

## Notes

- `leadInsight()` (src/lib/insights.ts) picks the yield spread (a) when public and shown, else the first shown Insight. The production build publishes only c and j, so production Home leads with c (completions against permits).
- `renderHero()` and `renderInsight()` share `insightLead()` (headline with verdict tag, reading, chart, Notes); the Insights page output is unchanged. The hero omits the small charts and links to the full Insight (`home.hero.more`, DE draft until ticket 11).
- With no shown Insight Home renders the index directly, with no hero markup.
- The Home KPI index numerals use `--step-2`, so the hero's `--step-4` number is the only large figure above the fold.
