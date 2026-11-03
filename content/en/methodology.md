## Links

A Link relates one real estate KPI to one economic indicator over a stated period. It shows co-movement: how two series moved together. It does not show that one causes the other, and it is not a forecast.

Each Link has three parts:

- **Levels overlay.** Both series, one chart each, over the same periods. Indicators are averaged to the KPI's frequency as described under Frequency, so the overlay shows our own calculation, not the published figures.
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
7. Construction price index (Destatis), quarterly: office buildings for office views and for construction of office buildings, industrial and commercial buildings for all others.
8. OECD business confidence (OECD), monthly: retail for retail views, construction for all others. These series are not seasonally adjusted and are percentage balances, so their changes are differences in points.

## Insights

An Insight puts several series on one axis over a stated period, with a fixed one-line reading. Like a Link it describes what the lines show: it does not show a cause and is not a forecast. Unlike a Link it carries no correlation and no lag.

- **Frequency.** An Insight runs at the coarsest frequency of its series, which is annual. Monthly and quarterly series are averaged over each calendar year; a year with missing months or quarters is dropped, never partly averaged.
- **Shared period.** The shared period is the years that every series covers, and the average and standard deviation use all of it. An Insight needs at least 10 annual observations; with fewer, the site says "Insight not shown" and gives the number it had. With fewer than 20, a note says the average rests on little data.
- **Headline.** The large number is a spread (the KPI minus the reference series, in percentage points), a ratio (the KPI divided by the reference series; for two indices with different base years, after both are rebased to the same year), a spread of year-on-year percent changes, or the year-on-year percent change of one series. Measures based on changes lose the first year. Spreads and growth rates are shown with one decimal and ratios with two.
- **Real figures.** A real rent is the rent index divided by the consumer price index, then compared year on year. Rents are a flow over the year, so they are deflated with the annual-average consumer price index; a price at a point in time, such as a property price, would be deflated with the December index.
- **Vacancy and employment.** The Insight on office vacancy and office employment shows the year-on-year change of vacancy in percentage points and the year-on-year growth of national employment in finance, real estate and business services in percent, on one axis. Only the vacancy change gets a verdict. The employment series is national, because no source publishes it for a City class, and it is an approximation of office employment. The rank correlation of the two is on the Link pages, not here.
- **Verdict.** The tag compares the latest value with the average of the whole shared period, the latest value included. It reads "in line with" when the latest value is within half a standard deviation (population standard deviation) of the average, otherwise "higher than" or "lower than". The grey band on the chart is the average plus or minus half a standard deviation. The verdict says where the latest value sits against the past; it does not imply that values return to the average, and it is neither a cause nor a forecast.
- **Rebasing.** The small charts show both series as an index with the base year set to 100: 2015, or the first shared year when a series has no value for 2015. 2015 is a reference point only (the year of the ECB's asset purchases); the site does not claim that it caused anything. The shading between the two lines is blue where the KPI is above the reference series and red where it is below.
- **Shift.** Completions are compared with the permits issued two years earlier, because a permit takes about two years to become a completion. The permits series is moved forward two years and labelled as such.

Insight figures, including spreads, ratios, averages and rebased series, are our own calculation and are marked as such in the source lines.

## How to read these figures

- Each series is fetched either directly from its publisher or through DBnomics, which aggregates official sources; the source line says which. The publishers are not responsible for this site.
- For series fetched directly, the source line gives the date new data was last retrieved and the original unit (and, for the Bundesbank, the original title) as the publisher gave them. Our own titles, number formatting and rounding are not the publisher's.
- Germany construction totals, unit conversions, year-on-year changes and Links are our own calculation and are marked as such.
- The site shows only the latest published version of each series and keeps no revision history.
- The Deutsche Bundesbank commercial property series are compiled from third-party data (bulwiengesa, vdp).
- Publisher, series id and licence for every series are listed under [Sources and licences](/en/sources).
