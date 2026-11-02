# Insight calculation rules

Label: wayfinder:grilling
Type: grilling (HITL)
Status: resolved
Blocked by:

## Question

What are the shared rules for computing an Insight's series and its reading? Settle:

- **Aligning frequencies**: annual KPIs against monthly or quarterly indicators. Is the annual mean used (the existing `resampling: mean`)? How are partial current years handled?
- **Shared period**: the overlap of all series. Is there a minimum length before an Insight is shown, and what happens below it (the Short-window Note)?
- **Deflating**: which CPI, annual average, base year.
- **Rebasing**: the base is the first shared year = 100; confirm, or use a fixed year such as 2015.
- **Headline-measure kinds**: gap (pp), ratio, difference, year-on-year growth. How each is computed and rounded.
- **Verdict**: the mean and standard deviation over the full shared period, whether the latest value is included in them, the half-standard-deviation band, and the precision of the numbers in the sentence.
- Whether these rules live in one tested module next to `src/link/link.ts`.

## Answer

Shared rules for every Insight, to live in one pure, tested module `src/insight/insight.ts` beside `src/link/link.ts` (fixtures like the Link tests, no page code).

- **Frequency**: an Insight runs at the coarsest frequency of its series, using the Link period-mean function. A period with missing observations is dropped, never partly averaged (so the Bund and CPI end at the last full year).
- **Shared period**: the overlap of all series; the average and standard deviation use all of it. At least **10** annual observations to show an Insight, otherwise the existing "not shown" empty state with the reason. Under **20**, a short-history Note says the average is weak. This keeps F (16 years) and G (13 years) in.
- **Rebasing**: every index or differently-united series is rebased to a fixed base year, **2015 = 100**. 2015 is the year the ECB's asset purchases began. The Methodology page says so as a reference point only, never as a cause. A series with no 2015 value falls back to the first shared year. The axis label names the base ("index, 2015 = 100").
- **Deflating**: real = nominal / CPI x 100, then rebased, so the CPI's own base year drops out. Annual-average CPI for flows (rents, wages), December CPI for stocks (property prices, valuations); the CPI snapshot is monthly, so December exists. The mode is a parameter chosen per Insight in ticket 04; only B (real rents) deflates today, as a flow. Open fact for ticket 04: whether the Bundesbank annual price index is an average or a year-end value, before any price Insight is deflated. Labelled "own calculation".
- **Headline-measure kinds**: gap (percentage points), ratio, difference (same unit), year-on-year growth (%). Printed with one decimal (ratios two), through the existing `Intl` formatting (EN "1.5", DE "1,5").
- **Verdict**: mean and population standard deviation over the whole shared period, latest value included. "In line" when the latest value is within half a standard deviation of the mean, otherwise "higher" or "lower". A zero standard deviation reads "in line".
