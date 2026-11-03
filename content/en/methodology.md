## Links

A Link relates one real estate KPI to one economic indicator over a stated period. It shows co-movement: how two series moved together. It does not show that one causes the other, and it is not a forecast.

Each Link has three parts:

- **The two series on one chart.** The KPI and the indicator are drawn together over the same stretch of time: the KPI against the left axis, the indicator against the right axis. Some indicators come out more often than the KPI, for example monthly against quarterly. We average them to match the KPI, as described under Frequency. So the indicator line is our own calculation, not the figure the source published.
- **How closely they move together.** We compare *changes*, not levels. For each series we look at how much it rose or fell compared with a year earlier. That is a percent change for indices and money amounts, and a difference in points for interest rates and confidence balances. Then we ask whether the two tend to rise and fall together.

  The answer is one number between −1 and +1, called Spearman's rank correlation. Near +1 means they tend to move the same way. Near −1 means they tend to move opposite ways. Near 0 means no clear pattern.

  We always show *n*, the number of periods compared, and the time span.

  We do not show significance tests. A significance test, often shown as a *p-value* or as stars (\*), tries to say how likely it is that a pattern this strong appeared by pure luck. We leave it out on purpose. A star can look like proof, and with only a handful of years or quarters, and several shifts tried, a good-looking result is easy to get by chance. So we show the number itself, how many periods it rests on (*n*), and the time span, and you can judge how much weight it deserves.
- **Did one move before the other?** Sometimes one series turns first and the other follows. To test this, we shift the indicator back or forward in time and repeat the comparison each time. We shift by whole quarters (up to 8 either way) for quarterly KPIs, and by whole years (up to 3 either way) for annual KPIs.
  - A **positive shift** means we compared the indicator with the KPI *later* in time, so the indicator moved earlier. Example: at +2 quarters, the indicator's change is set against the KPI's change two quarters afterwards.
  - A **negative shift** is the reverse: the indicator moved after the KPI.
  - The main figure is the one with **no shift**. It is written out above the chart, and its bar is the one in the middle, under the 0 mark. The other bars show how the match changes as the timing changes.
  - We mark the shift whose number is **furthest from zero**, meaning the strongest match in either direction. Be careful with this mark. We picked it from several shifts after seeing the results, so it is the best-looking of several tries and probably looks stronger than it really is. A line under the chart says so and gives the number of shifts that had enough data to be counted.
  - We never present a shift as a lead time or an advance warning. It describes the past only.

**Frequency.** A Link follows the KPI's own rhythm, quarterly or yearly. We never invent in-between values. Monthly and quarterly indicators are averaged over each quarter or calendar year. A quarter or year with missing data is left out.

**Minimum overlap.** A comparison on too few periods can mislead. Each shift needs at least 40 periods for quarterly KPIs or 10 for annual ones. Below that, the shift is left blank. We show a Link only if the no-shift comparison and at least three shifts in all reach that minimum. Otherwise the panel says "Link not shown" and gives the number of pairs it had with no shift. For annual Links with fewer than 20 pairs, we add a note that the pattern may be coincidence.

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
- **Vacancy and employment.** The Insight on office vacancy and office employment shows the year-on-year change of vacancy in percentage points and the year-on-year growth of national employment in finance, real estate and business services in percent, on one axis. Only the vacancy change gets a verdict. The employment series is national, because no source publishes it for a City class, and it is an approximation of office employment.
- **Verdict.** The tag compares the latest value with the average of the whole shared period, the latest value included. It reads "in line with" when the latest value is within half a standard deviation (population standard deviation) of the average, otherwise "higher than" or "lower than". The grey band on the chart is the average plus or minus half a standard deviation. The verdict says where the latest value sits against the past; it does not imply that values return to the average, and it is neither a cause nor a forecast.
- **Better and worse.** Besides the verdict, some Insights are tinted light green (better) or light pink (worse); screen readers get the words. This is our editorial reading from the point of view of an investor in office property, not a fact about the market, and it is neither a cause nor a forecast. For each Insight we state which direction counts as better. The plate is tinted green when the latest value sits on that side of the average (as the verdict judges it), pink when it sits on the other side, and stays plain when the verdict is “in line with” or when neither side is better. The sign of the number does not decide: a fall in vacancy is a negative change and is better, and a spread of -0.3 points is higher than an average of -2.0 points. Where the direction is a closer call, the table says so.
- **Rebasing.** The small charts show both series as an index with the base year set to 100: 2015, or the first shared year when a series has no value for 2015. 2015 is a reference point only (the year of the ECB's asset purchases); the site does not claim that it caused anything. The shading between the two lines is blue where the KPI is above the reference series and red where it is below.
- **Shift.** Completions are compared with the permits issued two years earlier, because a permit takes about two years to become a completion. The permits series is moved forward two years and labelled as such.

Which direction counts as better, per Insight:

| Insight | Better when the value is | Why |
|---|---|---|
| Initial yield spread over the 10-year Bund, by City class | higher | more income per unit of price than a government bond pays |
| Initial yield spread over the corporate loan rate | higher | more income per unit of price than the corporate loan rate costs |
| Office prices vs rents | neither | the number is an indexed price-to-rent multiple (2015 = 100): a buyer pays more per unit of rent when it is high, an owner holds more value, so it depends on whose side you take |
| Real office rents | higher | rents growing faster than prices generally |
| Office rents vs construction costs | higher | rents growing faster than the cost of building |
| Office rents vs GDP | higher | rents growing faster than the economy. Editorial judgement. |
| Office completions vs permits two years earlier | neither | fewer completions per permit mean less new supply for owners but fewer projects for developers: it depends on whose side you take |
| Construction costs vs inflation | lower | building and refurbishing costs rising faster than prices generally raise the cost of new capital spending. Editorial judgement. |
| Office vacancy: 7 major cities vs 127 towns | lower | a positive spread means the 7 major cities are emptier than the 127 towns, which is worse; a negative spread is better |
| Office vacancy and office employment | lower | a rise in vacancy is worse and a fall is better, so a negative change is better |

Insight figures, including spreads, ratios, averages and rebased series, are our own calculation and are marked as such in the source lines.

## How to read these figures

- Each series is fetched either directly from its publisher or through DBnomics, which aggregates official sources; the source line says which. The publishers are not responsible for this site.
- For series fetched directly, the source line gives the date new data was last retrieved and the original unit (and, for the Bundesbank, the original title) as the publisher gave them. Our own titles, number formatting and rounding are not the publisher's.
- Germany construction totals, unit conversions, year-on-year changes and Links are our own calculation and are marked as such.
- The site shows only the latest published version of each series and keeps no revision history.
- The Deutsche Bundesbank commercial property series are compiled from third-party data (bulwiengesa, vdp).
- Publisher, series id and licence for every series are listed under [Sources and licences](/en/sources).
