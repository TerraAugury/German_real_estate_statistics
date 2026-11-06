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

**The lag selector on the Links page.** Above the table of all Links, one selector sets the timing for the whole table at once: "Same year", "Indicator 1 year earlier (N-1)" or "Indicator 2 years earlier (N-2)". These are the +1 and +2 shifts of the lag profile on each KPI page, so every box shows the same number as that bar and the same count of pairs. (For a quarterly KPI they would be +4 and +8 quarters.) A box under the minimum overlap at the chosen timing shows "Not shown". The page opens on N-1, the pre-set timing described next. The choice is kept in the page address (#lag-0 for the same year, #lag-2 for N-2) so a view can be shared; with no address part, the table shows N-1.

**A pre-set timing for appraisal-based KPIs.** Initial yield and the commercial property price index rest largely on appraisals, which follow interest rates with a delay. For these two KPIs against the 10-year Bund yield, Euribor 3 months and the loan rate, one year earlier (N-1) is therefore set in advance on economic grounds, not chosen from the results. These boxes are marked "pre-set lag" whichever timing is selected, and on the Link panels the +1 bar carries the same label, apart from the "strongest" mark. Switching between timings and keeping the one that looks strongest overstates the link, for the same reason as the "strongest" marker.

**Grey boxes and the band on the bars.** A correlation based on few years can look strong by chance. For every box we therefore work out a band of ±2/√(n−1), using that box's own n at the chosen timing. A box whose number lies inside the band is shown in grey, with the number still visible; the same band is drawn as a light strip on the bars of each Link panel. This is a rough guide, not a significance test: we show no stars and no p-values, for the reasons given above. For quarterly KPIs, each change is compared with a year earlier, so neighbouring quarters overlap and are not independent; the band then uses an adjusted n of n ÷ 4, rounded down, and the panel shows both numbers.

**Many boxes at once.** The Links page shows many comparisons together, so a few boxes will look strong by chance alone, in the same way that several shifts tried on one Link produce a good-looking one. Treat a single strong box with caution, especially when n is small.

**Nominal and real.** Rents and transaction volume are in nominal euros, as are CPI and construction prices, so their links to those two indicators partly reflect shared inflation. Real GDP is adjusted for inflation, so a link between a nominal KPI and real GDP compares nominal with real. The rent and transaction volume rows on the Links page, and their Link panels against these three indicators, carry a note saying so. We do not adjust the figures for inflation in a Link.

**Rows and areas.** The rows of the Links page cover different segments and areas, and each row starts with a tag naming its own: commercial overall or office, Germany or the 7 major cities, and for initial yield office and retail combined. Every indicator is national, so reading down a column compares unlike things.

**Geography.** Every indicator is national. On a City class or Land view, the Link compares the national indicator with that geography's KPI.

## The eight indicators

1. 10-year Bund yield (Deutsche Bundesbank), monthly.
2. Euribor 3 months, monthly average (European Central Bank), standing in for the ECB policy rate.
3. Interest rate on new loans to non-financial corporations over EUR 1 million with an initial rate fixation of over 5 years (Deutsche Bundesbank), monthly. Commercial property is mostly financed at long fixed rates, so we use the long-fixation bucket, not the floating rate.
4. Consumer price index (Destatis), monthly.
5. Real GDP (Deutsche Bundesbank), quarterly.
6. Registered unemployment rate (Deutsche Bundesbank), monthly.
7. Construction price index (Destatis), quarterly: office buildings for office views and for construction of office buildings, industrial and commercial buildings for all others.
8. OECD business confidence (OECD), monthly: retail for retail views, construction for all others. These series are not seasonally adjusted and are percentage balances, so their changes are differences in points.

## Insights

An Insight puts several series on one chart over a stated period and adds a fixed one-line reading. Like a Link, it describes what the lines show. It does not show a cause, and it is not a forecast. Unlike a Link, it has no correlation and no lag.

- **One value per year.** An Insight uses yearly values. Monthly and quarterly series are averaged over each calendar year. If a year is missing any months or quarters, we leave that year out instead of averaging part of it.
- **Period.** The period is the set of years that all the series cover. The average and the standard deviation (how much values usually vary) use all of these years. An Insight needs at least 10 years. With fewer, the site says "Insight not shown" and tells you how many years it had. With fewer than 20 years, a note warns that the average rests on little data.
- **Big number.** The large number is one of these: the gap between the KPI and the reference series, in percentage points; the KPI divided by the reference series (two indices with different base years are first rebased to the same year); the gap between the year-on-year percent changes of the two series; or the year-on-year percent change of one series; or, for two Insights, the latest value of one series against its own average over the period (completions in percent, vacancy in percentage points). Measures based on change lose the first year. Gaps and growth rates show one decimal. Ratios show two.
- **Real figures.** A real rent is the rent index divided by the consumer price index, then compared year on year. Rent is paid over the whole year, so we use the yearly average of the consumer price index. "Real office rents vs real GDP" compares this real rent growth with real GDP growth, so both sides are free of inflation. A price at one moment in time, such as a property price, would use the December index.
- **Vacancy and employment.** This Insight shows two things on one chart: the yearly change in office vacancy, in percentage points, and the yearly growth of national employment in information and communication (section J) and in finance, real estate and business services (sections K to N), in percent. The two are added up, and the total starts in 2000 because section J has no earlier value; a year in which a section is not yet published is left out. Only the vacancy change gets a verdict. The employment series covers the whole country, because no source publishes it for a City class. It is only a rough stand-in for office employment. In the small chart, vacancy is shown in % on the left axis and employment as an index (2015 = 100) on the right axis. The two axes have different units, so the crossings of the lines and the gaps between them carry no meaning, and the chart has no shading between the lines.
- **Vacancy and new completions.** The big number is the latest year's office completions (floor space of new office and administrative buildings, whole country) as a percent above or below their average over the shared years; the verdict and the tint follow it, and fewer completions is better. The small top chart shows something else: the yearly change in 127-town office vacancy, in percentage points, against the yearly growth of completions, in percent. The bottom chart shows vacancy in % on the left axis and completions as an index (2015 = 100) on the right axis; the two axes have different units, so crossings carry no meaning. Completions cover the whole country, include public and owner-occupied buildings and exclude refurbishments and conversions.
- **Vacancy and rent growth.** The big number is the gap between the latest office vacancy in the 127 towns and its average over the period, in percentage points; the top chart shows this gap year by year. The period starts in the first year with a real rent growth rate, because that needs the year before. The bottom chart shows vacancy in % on the left axis and real rent growth (the real calculation above, on the rent index for new lettings) in percent on the right axis. The rent index measures asking rents, not incentives such as rent-free months.
- **Verdict.** The tag compares the latest value with the average of the whole period, the latest year included. It says "in line with" when the latest value is within half a standard deviation of the average (we use the population standard deviation). Otherwise it says "higher than" or "lower than". The grey band on the chart is the average plus or minus half a standard deviation. The verdict only says where the latest value sits compared with the past. It does not mean values will move back to the average. It is not a cause and not a forecast.
- **Better and worse.** Some Insights are also tinted light green (better) or light pink (worse). Screen readers get the words. This is our own reading, from the point of view of an investor in office property. It is not a fact about the market, and it is not a cause or a forecast. For each Insight we say which direction counts as better. The tint is green when the latest value is on the better side of the average, as the verdict judges it. It is pink when the value is on the other side. It stays plain when the verdict is "in line with" or when neither side is better. The sign of the number does not decide: a fall in vacancy is a negative change and is better, and a gap of -0.3 points is higher than an average of -2.0 points. Where the better direction is a close call, the table says so.
- **Growth charts.** Where the big number is a year-on-year change or a gap between two year-on-year changes, the small chart shows those year-on-year changes as two lines on one axis, in percent. This covers real office rents vs real GDP, office rents vs construction costs, construction costs vs inflation, and real office rents (nominal rent growth against consumer price inflation; real growth is (1 + rent growth) / (1 + inflation) − 1, so it differs slightly from the gap between the two lines). The gap between the two lines in the latest year is the big number. The shading between the lines is blue where the KPI line is above the reference line and red where it is below.
- **Rebasing.** The remaining small charts show levels, and where the two series have different units or bases we show both as an index with the base year set to 100: office prices vs rents (two indices with different base years, compared as a ratio), office completions vs permits two years earlier (floor space, a ratio of two volumes) and the employment line of office vacancy and office employment. The base year is 2015, or the first shared year if a series has no value for 2015. 2015 is only a reference point (the year the ECB began buying assets). The site does not claim that it caused anything. The size of the shaded gap between two rebased lines depends on this choice of base year. Series measured in percent or percentage points (vacancy rates, yields, interest rates) are never rebased: they are shown in their own unit, on their own axis, beside any index.
- **Shift.** We compare completions with the permits issued two years earlier, because a permit takes about two years to become a completion. The permits series is moved forward two years and labelled as such.

Which direction counts as better, per Insight:

| Insight | Better when the value is | Why |
|---|---|---|
| Initial yield spread over the 10-year Bund, by City class | higher | more income per unit of price than a government bond pays |
| Initial yield spread over the corporate loan rate | higher | more income per unit of price than the corporate loan rate costs |
| Office prices vs rents | neither | the number is an indexed price-to-rent multiple (2015 = 100): a buyer pays more per unit of rent when it is high, an owner holds more value, so it depends on whose side you take |
| Real office rents | higher | rents growing faster than prices generally |
| Office rents vs construction costs | higher | rents growing faster than the cost of building |
| Real office rents vs real GDP | higher | real rents growing faster than the real economy. A close call: it also means a rising cost burden for occupiers. Editorial judgement. |
| Office completions vs permits two years earlier | neither | fewer completions per permit mean less new supply for owners but fewer projects for developers: it depends on whose side you take |
| Construction costs vs inflation | lower | building and refurbishing costs rising faster than prices generally raise the cost of new capital spending. Editorial judgement. |
| Office vacancy: 7 major cities vs 127 towns | lower | a positive spread means the 7 major cities are emptier than the 127 towns, which is worse; a negative spread is better |
| Office vacancy and office employment | lower | a rise in vacancy is worse and a fall is better, so a negative change is better |
| Office vacancy and new office completions | lower | fewer completions mean less new competing space, so the number is better when it is below the average |
| Office vacancy and office rent growth | lower | vacancy above its average puts pressure on rents and is worse; vacancy below it is better |

Insight figures, including spreads, ratios, averages and rebased series, are our own calculation and are marked as such in the source lines.

## How to read these figures

- Each series is fetched either directly from its publisher or through DBnomics, which aggregates official sources; the source line says which. The publishers are not responsible for this site.
- For series fetched directly, the source line gives the date new data was last retrieved and the original unit (and, for the Bundesbank, the original title) as the publisher gave them. Our own titles, number formatting and rounding are not the publisher's.
- Germany construction totals, unit conversions, year-on-year changes and Links are our own calculation and are marked as such.
- The site shows only the latest published version of each series and keeps no revision history.
- The Deutsche Bundesbank commercial property series are compiled from third-party data (bulwiengesa, vdp).
- Publisher, series id and licence for every series are listed under [Sources and licences](/en/sources).
