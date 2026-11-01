## Links

A Link relates one real estate KPI to one economic indicator over a stated period. It shows co-movement: how two series moved together. It does not show that one causes the other, and it is not a forecast.

Each Link has three parts:

- **Levels overlay.** Both series as published, one chart each, over the same periods.
- **Rank correlation of changes.** Spearman's rank correlation, with ties, of the changes of both series: year-on-year percent change for indices and money amounts, year-on-year difference in points for rates and confidence balances. It is always shown with the number of paired observations (n) and the period. No p-values or significance stars are shown.
- **Lag profile.** The same correlation with the indicator shifted by whole periods: −8 to +8 quarters for quarterly KPIs, −3 to +3 years for annual KPIs. A positive lag means the indicator moved earlier than the KPI. The headline figure is lag 0. The strongest lag is marked, but it was chosen after looking at the data, so it is likely overstated; the site never presents a lag as a lead time.

**Frequency.** A Link uses the KPI's own frequency; nothing is upsampled. Monthly and quarterly indicators are averaged over each quarter or calendar year, and incomplete periods are dropped.

**Minimum overlap.** Each lag needs at least 40 paired observations for quarterly KPIs or 10 for annual KPIs; a lag below the minimum is left blank. A Link is shown only when lag 0 and at least three lags in all meet the minimum. Otherwise the panel says "Link not shown" with the number of pairs at lag 0. Annual Links with fewer than 20 pairs at lag 0 carry a note that the pattern may be coincidental.

**Geography.** Every indicator is national. On a City class or Land view, the Link compares the national indicator with that geography's KPI.

## The eight indicators

1. 10-year Bund yield (Deutsche Bundesbank), monthly.
2. Euribor 3 months, monthly average (European Central Bank), standing in for the ECB policy rate.
3. Interest rate on new loans to non-financial corporations over EUR 1 million (Deutsche Bundesbank), monthly.
4. Consumer price index (Destatis), monthly.
5. Real GDP (Deutsche Bundesbank), quarterly.
6. Registered unemployment rate (Deutsche Bundesbank), monthly.
7. Construction price index (Destatis), quarterly: office buildings for office views, industrial and commercial buildings for all others.
8. OECD business confidence (OECD), monthly: retail for retail views, construction for all others. These series are not seasonally adjusted and are percentage balances, so their changes are differences in points.

## How to read these figures

- The data comes through DBnomics, which aggregates official sources. The publishers are not responsible for this site.
- Germany construction totals, unit conversions, year-on-year changes and Links are our own calculation and are marked as such.
- The site shows only the latest published version of each series and keeps no revision history.
- The Deutsche Bundesbank commercial property series are compiled from third-party data (bulwiengesa, vdp).
- Publisher, series id and licence for every series are listed under Sources and licences.
