# 05: First Link panel end to end

**What to build:** On the Construction page a reader sees one complete Link panel: Destatis office construction against Euribor and CPI, with the overlay, the lag profile and the fixed co-movement sentence, including the not-shown state when data is too thin.

**Blocked by:** 01, 02

**Status:** ready-for-agent

Spec: `.scratch/cre-site/spec.md`, Sections 6 and 9.

- [ ] Overlay of levels with both series named; lag bar chart with the strongest lag marked and the "strongest of N lags tested" note
- [ ] Co-movement sentence (EN and DE, exact text) under the chart, with period and n filled in
- [ ] Small sample Note shown for annual Links with n below 20 at lag 0
- [ ] "Link not shown: too few observations (n = ...)" shown, never hidden, when the module says so
- [ ] Panel inherits the Notes of both series, each prefixed with the series title
