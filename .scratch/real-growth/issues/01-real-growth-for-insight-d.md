# 01: Real relative growth for Insight D (and a decision on Insight I)

**What to build:** Insight D "Office rents vs construction costs" compares the two growth rates by subtraction. Replace it with relative growth, (1 + rent growth) / (1 + construction price growth) − 1, in percent, the way Insight J now does it. Decide whether Insight I follows.

**Blocked by:** none

**Status:** needs-triage

Found while changing Insight J ("Construction costs vs inflation", real growth and a compounded index). Spec: `.scratch/insights/spec.md`, Section 4 (calculation rules).

## Why

A plain gap between two growth rates is a good approximation only while both are small. In 2022 the construction price rose 17.2% and CPI 6.9%: the gap is 10.3 points, the relative growth 9.7%. D has the same weakness whenever construction costs jump.

## Scope

- **D (recommended):** headline and spread series become relative growth in percent. Keep the two growth lines and the shading. Reading template, unit ("percent", not "percentage points"), the footnote ("relative growth differs slightly from the gap between the two lines"), the legend (no "gap is the headline number") and the Methodology text follow Insight J. Recompute the average and say which plate (better, worse, plain) results.
- **D, open question:** should D also get a compounded level view, rent index over construction price index with the first common year = 100, as J has? Decide before building; it is a design choice, not a fix.
- **I (default: leave as is):** both sides are already real growth rates, so a spread in points is defensible and the ratio form would barely differ at GDP-sized rates. Reopen only if the site wants all growth comparisons in one form.

## Acceptance criteria

- [ ] D's headline equals (1 + rent growth) / (1 + construction growth) − 1 for the latest year, tested against hand-computed values for at least two years, one of them a high-growth year
- [ ] D shows its new average and plate; the reading and index tile say percent
- [ ] Footnote, legend, "How this is calculated" and the better/worse table row in the Methodology updated, EN and DE
- [ ] No other Insight's numbers change
- [ ] German strings recorded as reviewed with `scripts/review.ts`; vitest, tsc, astro check and production build pass

## Notes

- The calculation for a deflated growth headline already exists (`headline: growth`, `deflate`). D has no price level to deflate by, so it needs the reference growth rate used as the divisor; check whether `opts.deflator` can carry it before adding an option.
- A ticket ships in one commit with its code, with `Status: done`.
