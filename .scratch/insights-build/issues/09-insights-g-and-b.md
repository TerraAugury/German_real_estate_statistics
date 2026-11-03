# 09: Insights G and B: price-to-rent ratio and real rents

**What to build:** Two Provisional Insights visible in previews: the office price index against the rent index (G), and office rents grown in real terms (B).

**Blocked by:** 02, 03, 06

**Status:** done

Spec: `.scratch/insights/spec.md`, Section 2 (rows G, B) and Section 4 (Deflating, templates).

- [x] G: ratio of the two indices, both rebased to 2015 = 100, 2013 to 2025, with its reading template
- [x] B: office rent deflated as a flow with the annual-average CPI, shown as real growth in percent, 2004 to 2025, with its reading template; labelled "own calculation"
- [x] Deflating supports flow (annual-average CPI) and stock (December CPI) as a per-Insight parameter; tests cover both and the CPI's own base year dropping out
- [x] Methodology gains the 2015 = 100 reference-point paragraph and the flow vs stock paragraph, EN and DE

## Notes

- New declaration options: `indexed: true` (G takes its ratio after both indices are rebased, so it is 1.00 in 2015; C's ratio stays raw while its lines are rebased), `deflate: flow | stock` on a `growth` headline (the KPI alone, deflated by the reference price level, then its year-on-year change). A third headline kind, `growth`, is new.
- G's rent index is its `reference`; the KPI-page rule now lists an Insight on the page of any series that sits in a KPI view, whatever its role, so G lists on both the price and the rent page. A construction price still counts only as a `kpi` (D has one as `reference` and does not list on Construction).
- B's small charts show the nominal rent index against the consumer price index (both 2015 = 100); the shading is the real change.
- Methodology gained the headline kinds and a "Real figures" paragraph in EN and DE.
