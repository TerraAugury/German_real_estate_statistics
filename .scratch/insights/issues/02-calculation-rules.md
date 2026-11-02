# Insight calculation rules

Label: wayfinder:grilling
Type: grilling (HITL)
Status: open
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
