# Follow-up: Methodology aligned with the site (EN, DE)

Requested by the owner after the Insight tile dates. Every claim on the page was checked against `link.ts`, `links.ts`, `insight.ts`, `notes.ts`, `panel.ts`, `insights.yaml`, `series.yaml` and the interface strings. Sentences were also shortened and simplified.

## Corrected to match the site
| Where | Was | Now | Why |
|---|---|---|---|
| Insights intro | "it has no correlation and no shift" | "does not try different shifts"; one Insight uses a fixed two-year shift | Insight c compares with permits of two years earlier. |
| Real figures | "A price at one moment in time, such as a property price, would use the December index." | removed | No Insight uses a December (stock) value. |
| Base year | "Series in percent ... are shown in their own unit, on their own axis, beside any index." | "are never set to 100" | Dual-axis charts went away with Insights m, n, o. |
| Minimum overlap | "Link not shown" and the number of pairs | also says whether there were too few periods or one series did not change | Two reasons exist (`link.not_shown`, `link.not_shown.constant`). |
| How to read | "keeps no record of earlier revisions" | no record kept; a Note says so for 90 days after a revision is noticed | `note.revised`, `REVISED_DAYS = 90`. |
| How to read | (nothing) | new bullet on Notes (out of date, not updated, no longer provided, short history, what a figure covers) | `note.stale`, `note.fetch_failed`, `note.unavailable`, `note.short_window`, `note.scope.*`. |
| Insights | (nothing) | new bullet "As of": tiles and big numbers show the latest year | New tile and headline date. |
| Rows and areas / Geography | two paragraphs saying the same | one paragraph | Duplicate. |

Checked and found correct: shift limits (8 quarters, 3 years), minimums (40 and 10 periods, 3 shifts, 20 for the small-sample note), the band ±2/√(n−1) and n ÷ 4, "strongest" = furthest from zero, positive shift = indicator earlier, the eight indicators with publisher and rhythm, construction and OECD series choice, 10 and 20 years for Insights, verdict at half a standard deviation, decimals, base years 2015 and 1992, the better/worse table against `insights.yaml`.

## Wording
Shorter sentences, everyday words ("compare" for "set against", "chance" for "coincidental", "the same inflation" for "shared inflation", "does not try different shifts"). Quoted interface strings, the heading anchors, the table titles and the phrases the tests look for are unchanged.

## Flags
- Kept as before, per the earlier decision: the ECB parenthetical in Base year. Only the unclear next sentence was changed to "We do not claim that the ECB's purchases caused anything." Mark both languages to be reviewed.
- The German front matter hash is stale, so `page:methodology` is unreviewed until a human records the review. `na.source` is also unreviewed.
- The page says nothing about what KPIs, Segments, City classes or Länder are; they are explained on their own pages. Not added.
- "Spread" is still the word in Insight titles; the prose says "gap".

## Visual examples (follow-up)
Twelve figures on the Methodology page (EN, DE), drawn at build time from the real data with the site's own chart code (`src/lib/method-figures.ts`), so they update with the data. A line `{{figure:<name>|<caption>}}` in the Markdown marks the place; the page swaps it for the figure. A figure that cannot be drawn (for example an Insight hidden in production) leaves nothing behind.

| Point | Figure |
|---|---|
| Two series on one chart | initial yield (7 major cities) against the 10-year Bund yield |
| Did one move first? (main number) | the shift bars, plain |
| Strongest shift | the same bars with the orange "strongest" bar |
| Choosing a shift, grey boxes, pre-set | three rows of the Links table at the three shifts |
| Pre-set shift | the same bars with the dashed N-1 outline |
| Grey boxes and the band | the same bars with the chance strips |
| Big number, As of | four Insight tiles (gap, ratio, gap between two changes, one change) |
| Real construction costs | the real construction cost index |
| Verdict | Insight chart with average and the half-spread band |
| Better and worse | three tiles (plain, green, pink) |
| Growth charts | two yearly changes with the shading |
| Base year | two indices set to 100 |

Captions carry no numbers, so they stay true when data changes.

**Chart fix made on the way.** The shift bars were trimmed at the top and bottom by `inset: 8` (the library applies it on all four sides), so small correlations nearly vanished and no bar started on the 0 line. Now only the left and right gaps remain (`insetLeft`, `insetRight`). Effect: `rect` `y` and `height` change in the Link bar charts on 171 pages. No value, label or other SVG attribute changed.
