# Insight chart form

Label: wayfinder:prototype
Type: prototype (HITL)
Status: resolved
Blocked by:

## Question

What does an Insight look like? Prototype Insight A (initial yields for 7 / 120 / 127 towns against the 10-year Bund) with the existing Plot setup in `src/lib/chart.ts` (wide and narrow SVG pair, page palette), and react to:

- multiple lines on one axis: colours for 3–4 series within the existing palette, legend vs direct labels at the line ends
- whether the headline measure (e.g. the spread) gets its own small panel under the main chart, a shaded band between the lines, or nothing
- how the historical mean and the half-standard-deviation band are shown, if at all
- placement of the reading sentence, Notes and the multi-series source line
- the narrow (320 px) version

## Answer

**Variant C, "headline first", with the gap shading from D added to its small charts.** An Insight has four parts, top to bottom:

1. **Headline number and verdict.** The latest value of the headline measure in large type (e.g. "1.5 pts"), with a tag giving the verdict: in line with / higher than / lower than the average.
2. **The reading sentence** (template from ticket 02).
3. **Main chart: the headline measure over time.** The latest point is labelled. The historical average is a dashed line labelled "average x". The "in line" band (average ± half a standard deviation) is shaded grey.
4. **Small multiples: the levels.** One small chart per compared series (e.g. per City class), each against the reference series (e.g. the Bund in ochre). The gap between the two lines is shaded by sign: blue where the KPI is above the reference, red where it is below (Plot `differenceY`). Shared y-domain across the small charts.

Then the Notes and the source lines in the figcaption.

Settled along the way: one y-axis (map Notes); line-end labels and legends are not needed, because each small chart titles its series and the main chart shows a single line.

Not settled here:
- Four Bundesbank source lines stack up under one Insight. A compact multi-series source line belongs to ticket 05.
- 120 towns and 127 towns nearly overlap. Whether an Insight shows both is for ticket 04.
- Only the wide (720 px) layout was checked in the browser; the narrow one was not.
- Proposal for ticket 04: where the headline measure is a ratio or growth rate (e.g. C, J), part 4 shows the two rebased lines with the same shading.

Prototype: branch `prototype/insight-chart-form` (local, never merged), route `/en/prototype-insights?variant=C`, run with `npm run prototype:insights`.
