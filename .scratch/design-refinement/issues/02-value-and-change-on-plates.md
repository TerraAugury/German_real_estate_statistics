# 02: Latest value and change on plates

**What to build:** Each KPI plate (KPI pages, Home cards, Segment pages) leads with the latest value in large Condensed numerals, its unit and period, and the change since the previous period of the same frequency, with a direction marker that is not colour alone. The change is described, never judged: no "up is good".

**Blocked by:** 01

**Status:** done

- [x] A pure function gives value, period and change (points or percent, following the series' `change` kind) for a Series; a test covers annual, quarterly, percent-unit and a one-observation series
- [x] The value, unit, period and change show above the chart on every plate; the change has text and a direction glyph, readable without colour
- [x] A series with fewer than two observations shows the value without a change
- [x] Numbers use the page locale (EN "3.2%", DE "3,2 %")
- [x] New strings exist in EN and DE (DE a draft until ticket 11)
- [x] KPI pages stay within the page-weight limit

## Notes

- `latestOf` (src/lib/latest.ts) is the pure function; `latestBlock` (src/lib/panel.ts) renders it. `compactChart` now starts with the block, so Home cards and Segment pages get it; KPI page plates add it above the chart.
- A change that rounds to zero at one decimal is flat ("No change on 2024"). Direction is a glyph plus signed text in the ink colour; no good/bad colouring.
- Home cards lost their separate "Latest:" line; `home.card.latest` is removed from both languages.
- DE strings are drafts until ticket 11. Page weight adds about five live elements per plate (views stay in templates); the page-weight test runs on a build in ticket 12.
