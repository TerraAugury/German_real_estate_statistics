# 01: Draw a Link's two series on one chart with a left and a right axis

**What to build:** Every Link panel, on every KPI page that shows Links, gets the same change: its two side-by-side level charts become one chart. The real estate KPI is read against the left axis, the economic indicator against the right axis, both over one shared x axis that spans the union of their periods (so a series with a shorter history simply starts later). Each axis and its unit is drawn in its own line's colour (KPI in the data colour, indicator in ochre), and a small legend names the two series, so a reader can tell which scale belongs to which line. The lag chart, coefficient, Notes and citation line below are unchanged. The chart claims co-movement only; nothing in it implies the two scales are comparable.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Every shown Link panel renders one level chart, not two, whichever KPI page or geography it sits on (one shared panel renderer, so all pages change together; a build-level check over the built pages finds no `.pair` left); a Link that is not shown renders as before
- [x] The KPI line is scaled to the left axis and the indicator line to the right axis, each with its own unit label; a test checks both units appear and sit on opposite sides
- [x] The x axis spans the union of both series' periods; the shorter series starts later and has no line where it has no data
- [x] Left axis, left unit label and KPI line share the data colour; right axis, right unit label and indicator line share ochre (the text in the darker `strong-text`); both lines stay at least 3:1 on the plate in light and dark (palette tests cover it)
- [x] A legend names both series by their titles, in English and German, and the chart's accessible label names both series (the existing "Levels of {title}" string is replaced by one that covers the pair; German is a draft for review)
- [x] The wide and narrow variants both work: on 375 px the two axis labels do not collide with the lines or each other, and the page does not scroll horizontally
- [x] The two per-series `<h4>` headings and the `.pair` two-column layout are gone, with no unused CSS or strings left behind
- [x] Existing panel tests are updated to the single chart; one test renders a pair with different histories and checks the union span
- [x] Checked in the preview at 1024 px and 375 px, in light and dark, in English and German
- [x] `vitest`, `tsc`, `astro check` and the preview build pass

## Notes

- Decisions (owner, 2026-11-03): union x range, colour-matched axes plus a legend, no extra "scales are independent" Note.
- The glossary already calls a Link "shown as an overlay"; this makes that literal. No glossary change is needed. An Insight stays the single-axis chart, so the dual axis is a Link-only treatment.
- Scope check (owner, 2026-11-03): the two-chart pattern exists only in the shared Link panel renderer, which every KPI page uses. Insight charts already draw both series on one chart with one shared axis, so they are not touched.
- Today's source: the panel builds two `levelChart` calls from the Link result's `overlay` array, which already holds both series per period with nulls where a series has no value.
- Done: `overlayChart` in `src/lib/chart.ts` replaces `levelChart`; each series gets its own round tick range scaled to the same height, so the picture is a co-movement view and the legend says the two axes have separate scales. `renderPanel` draws one chart plus a one-line legend; the `.pair` grid and `h4` CSS are gone. The legend and accessible label are new strings (`link.overlay.chart`, `link.overlay.legend`); the old `link.overlay.label` and its review record are removed, so the two new German strings are unreviewed drafts.
- Changed from the first plan: the indicator line is ochre, not grey. In light mode the data blue and muted grey were too close to tell apart; ochre is what Insight charts already pair with blue. `strong` (3:1) is the line, `strong-text` (4.5:1) the right axis text; both were already in the palette tests.
- No per-point hover targets: they doubled the element count and pushed the construction pages past the 5,000-element page-weight limit. The old level charts had none either.
- Checks: `vitest` (332), `tsc`, `astro check` and the preview build pass; checked at 1024 px and 375 px in light and dark, English and German, no horizontal scroll; no `class="pair"` left in `dist`.
- Review (code-review, standards and spec): no hard violations. Fixed: reuse of `Points`, one `line` mark per series without repeated tick maths, clearer names, a legend that no longer adds the "separate scales" sentence (the owner chose colour-matched axes without that note), and tests for the unit labels' side and colour and for both line strokes. Left as is: the legend reuses `.note` like the Insight legends; chart height is 240 (was 200 per chart) with 4 x ticks on narrow, so the one chart has room for two axes; the "no collision at 375 px" criterion rests on the preview check, not a test.
