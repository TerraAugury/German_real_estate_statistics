# 09: Insights G and B: price-to-rent ratio and real rents

**What to build:** Two Provisional Insights visible in previews: the office price index against the rent index (G), and office rents grown in real terms (B).

**Blocked by:** 02, 03, 06

**Status:** ready-for-agent

Spec: `.scratch/insights/spec.md`, Section 2 (rows G, B) and Section 4 (Deflating, templates).

- [ ] G: ratio of the two indices, both rebased to 2015 = 100, 2013 to 2025, with its reading template
- [ ] B: office rent deflated as a flow with the annual-average CPI, shown as real growth in percent, 2004 to 2025, with its reading template; labelled "own calculation"
- [ ] Deflating supports flow (annual-average CPI) and stock (December CPI) as a per-Insight parameter; tests cover both and the CPI's own base year dropping out
- [ ] Methodology gains the 2015 = 100 reference-point paragraph and the flow vs stock paragraph, EN and DE
