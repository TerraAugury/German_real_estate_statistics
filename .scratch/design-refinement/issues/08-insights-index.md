# 08: Insights page index

**What to build:** The Insights page opens with a grid of its Insights, each showing title, headline number, unit and verdict tag, instead of a bullet list. In each Insight the headline chart and the small charts below it are visibly separated. Nothing new is written per Insight: numbers and tags come from the computed result.

**Blocked by:** 01

**Status:** done

- [x] The index lists every shown Insight in catalogue order and links to its section; a test covers the entries and their numbers from a result
- [x] A not-shown Insight appears with its reason, not a number
- [x] Each Insight section separates the headline chart from the small multiples with a heading or rule
- [x] The grid is one column at 375 px with no horizontal scroll
- [x] Verdict tags carry text, not colour alone

## Notes

- `renderInsightIndex()` (src/lib/panel.ts) renders the grid; the number uses the same `headlineNumber` as the Insight section (ratios two decimals, others one), and a test checks they agree. A not-shown Insight shows `insight.not_shown` in place of the number.
- Each small chart is separated from what precedes it by a hairline rule and padding (CSS only); no new strings.
- Checked in the preview: three tiles per row at 1024 px, one column at 375 px with no page scroll.
