# 07: Insight A: initial yield spread over the 10-year Bund, by City class

**What to build:** A Provisional Insight that shows, in previews, how the 7 cities' and the 127 towns' initial yield sits against the 10-year Bund, 1995 to 2025. It is hidden in production.

**Blocked by:** 02, 03, 06

**Status:** done

Spec: `.scratch/insights/spec.md`, Section 2 (catalogue row A).

- [x] The Bund is used as an annual mean of its daily or monthly observations, through the period-mean function; the 7-city spread is the headline, the 127 towns also shown in the small multiples
- [x] City class 120 appears nowhere
- [x] EN and DE titles from the catalogue; the spread reading template
- [x] Hidden in a production build, shown with `INCLUDE_PROVISIONAL=1`; Methodology notes the annual mean

## Notes

- `compareLines` (Insight module) gives the lines of every KPI series after the first over the headline years, rebased and shifted like the headline; the renderer draws one small chart per KPI series on one shared y-domain.
- The Bund needs no declaration of its own for the annual mean: a monthly series is averaged per year by the module, and dropped for a year with a missing month.
- A is declared in the Insights file in catalogue position (first); it has no `base`, so its small charts show the yields in per cent.
