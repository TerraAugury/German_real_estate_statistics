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
