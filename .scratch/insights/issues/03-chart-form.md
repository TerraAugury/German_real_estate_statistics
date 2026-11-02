# Insight chart form

Label: wayfinder:prototype
Type: prototype (HITL)
Status: open
Blocked by:

## Question

What does an Insight look like? Prototype Insight A (initial yields for 7 / 120 / 127 towns against the 10-year Bund) with the existing Plot setup in `src/lib/chart.ts` (wide and narrow SVG pair, page palette), and react to:

- multiple lines on one axis: colours for 3–4 series within the existing palette, legend vs direct labels at the line ends
- whether the headline measure (e.g. the spread) gets its own small panel under the main chart, a shaded band between the lines, or nothing
- how the historical mean and the half-standard-deviation band are shown, if at all
- placement of the reading sentence, Notes and the multi-series source line
- the narrow (320 px) version
