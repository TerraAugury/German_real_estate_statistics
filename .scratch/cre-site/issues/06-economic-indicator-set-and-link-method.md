# Economic indicator set and Link method

Label: wayfinder:grilling
Type: grilling (HITL)
Status: resolved
Blocked by: 02, 03, 05

## Question

Which Economic indicators ship in release one, and exactly how is a Link computed and shown? Settle: the indicator set, which KPI-indicator pairs are offered, frequency alignment (e.g. quarterly resampling), lag range and step, correlation measure, minimum overlap length before a Link is shown, and the wording that keeps a Link from reading as causation.

## Answer

Release one ships eight Economic indicators and offers a Link for every KPI-indicator pair that has enough data. A Link is a levels overlay plus a Spearman correlation on changes and a lag profile, built at build time and worded as co-movement.

**Indicator set (8, nine series).** Nothing from the stale Eurostat mirror.
1. 10-year Bund yield, monthly (BUBA/BBSIS)
2. Euribor 3M, monthly average (ECB/FM); stands in for the event-dated ECB policy rate
3. New-business loan rate, non-financial corporations over EUR 1m (BUBA/BBIM1, from 2010-06)
4. Consumer price index (DESTATIS `DG.PREIS1`)
5. Real GDP, quarterly (BUBA/BBNZ1)
6. Registered unemployment rate (BUBA/BBDL1)
7. Construction price index, office buildings, and industrial and commercial buildings (DESTATIS 61261BV001)
8. OECD composite business confidence, retail and construction (substitute for the absent ifo)

Dropped: Bank Lending Survey (too short), insolvencies, residential indices, wage rates, HICP rents, BBDZ1 lending volumes (same licence caveat as the KPIs).

**Pairs.** Every KPI x indicator pair that passes the minimum overlap is offered; no curated "driver" list. A failing pair shows "Link not shown: too few observations (n = ...)" and is never hidden. Effect: the annual price index (12 changes) gets no Link; quarterly price and rent indices and the annual class-level KPIs do.

**Geography.** Links are offered for every geography in the KPI catalogue (Germany, City classes, Länder). All indicators are national and every Link says "national indicator against [geography]".

**Frequency.** A Link runs at the KPI's native frequency; nothing is upsampled. The indicator is resampled down: rates, indices, levels = period mean; flows = period sum (no flow in the set yet); event-dated series (ECB rates) forward-filled to daily, then period mean. Calendar years; incomplete periods dropped.

**Transformation.** The overlay shows levels. The correlation uses changes: year-on-year percent change for indices and money amounts, percentage-point difference for rates; annual change for annual Links.

**Measure.** Spearman rank correlation, always shown with n and the period. No p-values or significance stars.

**Lag.** Quarterly Links: -8 to +8 quarters, step 1. Annual Links: -3 to +3 years, step 1. Positive lag = the indicator moved earlier than the KPI.

**Minimum overlap.** At each lag, at least 40 paired observations (quarterly) or 20 (annual); a lag below the minimum is blank. A Link is shown only if lag 0 passes.

**Best lag.** Headline is lag 0. The full lag profile is shown as a bar chart, with the strongest lag marked and the note "strongest of N lags tested; chosen after looking at the data, so likely overstated". The site never states a lead time as a finding.

**Wording.** A Link is called "Co-movement" / "Gleichlauf"; never impact, driver, effect, Einfluss, Treiber. Lead and lag read "moved earlier / later" ("lief voraus / lief nach"). Under every Link chart (not only the footer):
- EN: "This shows how two series moved together over [period] (n = [n]). It does not show that one causes the other, and it is not a forecast."
- DE: "Dargestellt ist, wie sich zwei Reihen im Zeitraum [Zeitraum] (n = [n]) gemeinsam entwickelt haben. Das belegt keine Ursache-Wirkungs-Beziehung und ist keine Prognose."

Links on the Bundesbank 2013-based price indices also carry: "Short window dominated by one interest-rate cycle." / DE equivalent (to be worded in the bilingual ticket).

**Provisional.** Links inherit the provisional status of their KPI: computed in the build, not published until the licence ticket (08) resolves, dropped if refused. Destatis construction Links are unaffected.

**Open checks for later tickets.** Exact series ids and start dates of the eight indicators must be re-verified at pipeline build; OECD confidence is unadjusted (`N`), so decide whether year-on-year change is enough there; transaction volume index history length is unchecked.
