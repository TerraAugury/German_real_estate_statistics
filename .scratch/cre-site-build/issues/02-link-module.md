# 02: Link module with scipy-checked tests

**What to build:** A tested module that turns two series into a Link result or a "Link not shown" state, with no UI. Given a KPI series and an indicator series it returns the levels overlay data, Spearman on changes at every lag, n per lag, the lag-0 headline and the strongest lag.

**Blocked by:** None (can start immediately)

**Status:** done

Spec: `.scratch/cre-site/spec.md`, Section 6 and the tests part of section 11.

- [ ] Resampling rules (period mean; event-dated series forward-filled to daily, then mean), incomplete periods dropped
- [ ] Year-on-year percent change for indices and money, point difference for rates and balance series (OECD confidence)
- [ ] Spearman with ties; positive lag means the indicator moved earlier; sign convention covered by a test
- [ ] Lags -8 to +8 quarterly, -3 to +3 annual; minimum 40 quarterly / 10 annual pairs per lag, blank below it
- [ ] A Link shows only if lag 0 passes and at least 3 lags pass; otherwise "Link not shown" with n at lag 0
- [ ] Fixture expected values computed independently with scipy and committed; invariants (|rho| <= 1, n >= minimum on shown lags) enforced as build failures
