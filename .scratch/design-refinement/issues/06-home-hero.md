# 06: Home hero

**What to build:** Home opens with one large chart and its fixed one-line reading, taken from the yield-spread Insight (or the first Insight that is shown in the production build), above the KPI index. It describes what the lines show, never a cause or forecast. When no Insight is shown, Home opens with the KPI index as before.

**Blocked by:** 05

**Status:** ready-for-agent

- [ ] The hero picks only an Insight that passes the Provisional gate for the current build; a test covers production and `INCLUDE_PROVISIONAL=1`
- [ ] The hero shows the headline number, verdict tag, reading, chart and citation, and links to the Insight on the Insights page
- [ ] Home with no shown Insight renders without a hero and without an empty gap
- [ ] The hero is the only element above the fold that uses the large headline number
- [ ] Home stays within the page-weight limit and has no horizontal scroll at 375 px
- [ ] The insights spec section 10 records that Home now shows one Insight
