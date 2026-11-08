## Links

A Link compares one real estate KPI (key figure) with one economic indicator (a figure from the wider economy) over a period we state. It shows whether the two moved together. It does not show that one causes the other, and it is not a forecast.

Each Link has three parts:

- **Two series on one chart.** The chart draws the KPI and the indicator over the same years. The KPI uses the left axis and the indicator uses the right axis. Some indicators come out more often than the KPI, for example monthly while the KPI is quarterly. We average them to match the KPI (see Frequency). So the indicator line is our own calculation, not the figure the source published.
- **How closely they move together.** We compare *changes*, not the values themselves. For each series, we take its change from a year earlier. For indices (series set to 100 in a base year) and money amounts, this is a percent change. For interest rates and confidence balances, it is a difference in percentage points. (A percentage point is the plain difference between two percentages.) Then we check whether the two tend to rise and fall together.

  The answer is one number from −1 to +1, called Spearman's rank correlation. Near +1, the two tend to move the same way. Near −1, they tend to move in opposite ways. Near 0, there is no clear pattern.

  We always show *n*, the number of periods compared, and the time span.

  We show no significance tests. A significance test usually appears as a *p-value* or as stars (\*). It tries to say how likely it is that a pattern this strong came from luck alone. We leave it out on purpose. A star can look like proof. With only a few years or quarters, and several shifts tried, a good-looking result is easy to get by chance. So we show the number itself, *n* and the time span. You can then judge how much weight it deserves.
- **Did one move first?** Sometimes one series turns first and the other follows. To test this, we shift the indicator earlier or later in time and compare again each time. For quarterly KPIs, we shift by whole quarters, up to 8 either way. For yearly KPIs, we shift by whole years, up to 3 either way.
  - A **positive shift** means the indicator moved earlier. We compare the indicator's change with the KPI's change from a later period. Example: at +2 quarters, we compare the indicator's change with the KPI's change two quarters later.
  - A **negative shift** is the reverse: the indicator moved later.
  - The main number is the one with **no shift**. It is written above the chart. Its bar is in the middle, under the 0 mark. The other bars show how the match changes with the shift.
  - We mark the shift whose number is **furthest from zero**: the strongest match in either direction. Be careful with this mark. We picked it from several shifts after seeing the results. It is the best of several tries, so it probably looks stronger than it is. A line under the chart says so. It also gives the number of shifts that had enough data.
  - We never present a shift as a lead time or an early warning. It describes the past only.

**Frequency.** A Link uses the KPI's own rhythm, quarterly or yearly. We never invent in-between values. We average monthly and quarterly indicators over each quarter or calendar year. We leave out any quarter or year with missing data.

**Minimum overlap.** A comparison over too few periods can mislead. Each shift needs at least 40 periods for quarterly KPIs and 10 for yearly KPIs. Below that, we leave the shift blank. We show a Link only if the comparison with no shift reaches that minimum and at least three shifts in all do. Otherwise the panel says "Link not shown". It gives *n* with no shift, and it says whether there were too few periods or one series did not change. For yearly Links with fewer than 20 periods, we add a note that the pattern may be chance.

**Choosing a shift on the Links page.** Above the table, you can pick one shift. It applies to every box in the table. You can choose:

- "Same year": we compare the indicator and the KPI in the same year.
- "Indicator 1 year earlier (N-1)": we compare the KPI with the indicator from one year before.
- "Indicator 2 years earlier (N-2)": we compare the KPI with the indicator from two years before.

Each box shows the same number as the matching bar on the KPI page. For a quarterly KPI, N-1 and N-2 mean 4 and 8 quarters earlier. If a box has too few periods at the chosen shift, it says "Not shown". The table opens on N-1. We explain why in the next paragraph. The page address changes with your choice, so you can copy it to share your view.

**A pre-set shift for appraisal-based KPIs.** Initial yield and the commercial property price index rest mostly on appraisals (valuations by experts). Appraisals follow interest rates with a delay. We compare these two KPIs with the 10-year Bund yield (the interest rate on 10-year German government bonds), Euribor 3 months and the loan rate. For these pairs, we chose one year earlier (N-1) in advance. We chose it for economic reasons, not from the results. These boxes are marked "pre-set shift" at every shift. On the Link panels, the +1 bar has the same label, separate from the "strongest" mark. If you switch between shifts and keep the one that looks strongest, you overstate the link. This is the same problem as with the "strongest" mark.

**Grey boxes and the band on the bars.** A correlation from few years can look strong by chance. So for every box, we work out a band of ±2/√(n−1), using that box's own *n* at the chosen shift. A box whose number is inside the band is grey. Its number stays visible. The same band is drawn as a light strip on the bars of each Link panel. It is a rough guide, not a significance test. We show no stars and no p-values, for the reasons above. For quarterly KPIs, each change is taken against a year earlier. So neighbouring quarters overlap and are not independent. The band then uses an adjusted *n* of *n* ÷ 4, rounded down. The panel shows both numbers.

**Many boxes at once.** The Links page shows many comparisons together. So a few boxes will look strong by chance alone, just as several shifts tried on one Link will give a good-looking one. Be careful with a single strong box, especially when *n* is small.

**Nominal and real.** Nominal means not adjusted for inflation. Real means adjusted for inflation. Rents and transaction volume are in nominal euros. So are the consumer price index and construction prices. Their Links to those two indicators therefore partly reflect the same inflation. Real GDP (gross domestic product, the value of all goods and services produced) is adjusted for inflation. So a Link between a nominal KPI and real GDP compares nominal with real. The rent and transaction volume rows on the Links page carry a note about this. So do their Link panels for these three indicators. We do not adjust any figure for inflation in a Link.

**Rows and areas.** The rows on the Links page cover different Segments (property types) and areas. Each row starts with a tag that names its own: commercial overall or office, Germany or the 7 major cities, and for initial yield office and retail combined. Every indicator is national. So reading down a column compares unlike things. On a City class or Land view, the Link compares the national indicator with the KPI for that area.

## The eight indicators

1. 10-year Bund yield (Deutsche Bundesbank), monthly.
2. Euribor 3 months, monthly average (European Central Bank). It is the rate at which banks lend to each other for 3 months. We use it as a stand-in for the ECB policy rate (the ECB's main interest rate).
3. Interest rate on new loans to non-financial corporations (companies outside the financial sector) of over EUR 1 million, with the rate fixed for over 5 years (Deutsche Bundesbank), monthly. Commercial property is mostly financed with long fixed rates. So we use loans with a long fixed rate, not the floating rate.
4. Consumer price index (Destatis), monthly. It follows the prices of a basket of goods that households buy.
5. Real GDP (Deutsche Bundesbank), quarterly.
6. Registered unemployment rate (Deutsche Bundesbank), monthly.
7. Construction price index (Destatis), quarterly. We use office buildings for office views and for the construction of office buildings. We use industrial and commercial buildings for all other views.
8. OECD business confidence (OECD), monthly. We use retail for retail views and construction for all other views. These series are not seasonally adjusted, so regular swings within the year stay in. They are percentage balances, so their changes are differences in percentage points.

## Insights

An Insight draws several series on one chart over a period we state. It comes with a fixed one-line reading. Like a Link, it only describes what the lines show. It does not show a cause, and it is not a forecast. Unlike a Link, it has no correlation and does not try different shifts. (One Insight compares with an earlier year that we fixed in advance. See Shift below.)

- **One value per year.** An Insight uses yearly values. We average monthly and quarterly series over each calendar year. If a year is missing any month or quarter, we leave that year out instead of averaging part of it.
- **Period.** The period is the set of years that all the series cover. The average and the usual spread (the standard deviation: how much values usually vary) use all these years. An Insight needs at least 10 years. With fewer, the site says "Insight not shown" and gives the number of years it had. With fewer than 20 years, a note warns that the average rests on little data.
- **"As of".** Each tile on the Insights page and each big number says "As of" and a year. This is the latest year of the period. The big number is the value for that year.
- **Big number.** The big number is one of these:
  - the gap between the main line (the KPI) and the comparison line (the reference series), in percentage points;
  - the KPI divided by the reference series (two indices with different base years are first set to 100 in the same year);
  - the gap between the two series' percent changes from the year before;
  - the percent change from the year before of one series.

  Measures based on change lose the first year. Gaps and growth rates show one decimal. Ratios show two.
- **Real figures.** A real rent is the rent index divided by the consumer price index. We then take its change from the year before. Rent is paid over the whole year, so we use the yearly average of the consumer price index. "Spread of real office rent growth over real GDP growth" compares this real rent growth with real GDP growth, so both are free of inflation.
- **Real construction costs.** The construction price index (office buildings) is quarterly. The consumer price index is monthly. We average each over the calendar year. We leave out a year with a missing quarter or month. The big number is the real growth of construction prices, in percent: (1 + construction price growth) / (1 + inflation) − 1. The average, the verdict and the background colour follow this number. Lower is better. The first figure on that Insight is the real construction cost index. It sets both indices to 1992 = 100 and builds each one up year by year (each year's change builds on the year before). Then it divides the construction index by the consumer price index. It shows the total real change since 1992 and the yearly rate. It has no verdict and no background colour, because its level depends on the choice of base year. Construction prices are for office buildings. The consumer price index is for a household basket.
- **Verdict.** The tag compares the latest value with the average of the whole period, the latest year included. It says "in line with" when the latest value is within half the usual spread of the average (we use the version for the whole period, not a sample). Otherwise it says "higher than" or "lower than". The grey band on the chart is the average plus or minus half the usual spread. The verdict only says where the latest value sits compared with the past. It does not mean values will move back to the average. It is not a cause and not a forecast.
- **Better and worse.** Some Insights also have a light green (better) or light pink (worse) background. Screen readers get the words. This is our own reading, from the point of view of an investor in office property. It is not a fact about the market, and it is not a cause or a forecast. For each Insight, we say which direction counts as better. The background is green when the latest value is on the better side of the average, as the verdict judges it. It is pink when the value is on the other side. It stays plain when the verdict is "in line with" or when neither side is better. The sign of the number does not decide. A fall in real construction prices is a negative change, and it is better. A gap of -0.3 percentage points is higher than an average of -2.0 percentage points. Where the better direction is a close call, the table says so.
- **Growth charts.** Some big numbers are a change from the year before, or the gap between two such changes. For these, the small chart shows the changes as two lines on one axis, in percent. This covers three groups: real office rents against real GDP; office rents against construction costs; and real office rents and real construction costs against inflation. In the last group, we show nominal growth against consumer price inflation. Real growth is (1 + rent growth) / (1 + inflation) − 1, and for construction costs (1 + construction price growth) / (1 + inflation) − 1. So it differs slightly from the gap between the two lines. The gap between the two lines in the latest year is the big number, except for real office rents and real construction costs. For these two, the big number is the real growth. The shading between the lines is blue where the main line is above the comparison line and red where it is below.
- **Base year.** The other small charts show values. Where the two series have different units or bases, we show both as an index with the base year set to 100. This applies to two charts: "Ratio of office prices to office rents" (two indices with different base years, compared as a ratio) and "Ratio of office completions to permits two years earlier" (floor space, a ratio of two volumes). The base year is 2015, or the first shared year if a series has no value for 2015. 2015 is only a reference point (the year the ECB began buying assets). We do not claim that the ECB's purchases caused anything. The one exception is the real construction cost index, which starts at 1992 = 100. The size of the shaded gap between two lines set to 100 depends on the base year we choose. Series in percent or percentage points (vacancy rates, yields, interest rates) are never set to 100.
- **Shift.** We compare completions with the permits issued two years earlier, because a permit takes about two years to become a completion. We move the permits series forward by two years and label it that way.

Which direction counts as better, for each Insight:

| Insight | Better when the value is | Why |
|---|---|---|
| Spread of initial yield over the 10-year Bund yield, by City class | higher | more income per unit of price than a government bond pays |
| Spread of initial yield over the corporate loan rate | higher | more income per unit of price than the corporate loan rate costs |
| Ratio of office prices to office rents | neither | The number is a price-to-rent multiple, shown as an index (2015 = 100). When it is high, a buyer pays more per unit of rent and an owner holds more value. So it depends on whose side you take. |
| Real growth of office rents | higher | rents growing faster than prices generally |
| Spread of office rent growth over construction price growth | higher | rents growing faster than the cost of building |
| Spread of real office rent growth over real GDP growth | higher | Real rents grow faster than the real economy. This is a close call: it also means a rising cost burden for occupiers. It is an editorial judgement. |
| Ratio of office completions to permits two years earlier | neither | Fewer completions per permit mean less new supply for owners but fewer projects for developers. It depends on whose side you take. |
| Real growth of construction prices | lower | Building and refurbishing costs that rise faster than prices generally make new investment more expensive. This is an editorial judgement. |
| Spread of office vacancy in the 7 major cities over the 127 towns | lower | A positive gap means the 7 major cities are emptier than the 127 towns, which is worse. A negative gap is better. |

Insight figures are our own calculation. This covers gaps, ratios, averages and series set to 100 in the base year. We mark them as such in the source lines.

## How to read these figures

- We fetch each series either directly from its publisher or through DBnomics, a site that collects official sources. The source line says which. The publishers are not responsible for this site.
- For series fetched directly, the source line gives the date we last retrieved new data. It also gives the original unit as the publisher gave it, and for the Bundesbank the original title. Our own titles, number formats and rounding are not the publisher's.
- Germany totals for construction, unit conversions, changes from the year before and Links are our own calculation. We mark them as such.
- The site shows only the latest published version of each series. We keep no record of earlier versions. When a publisher changes earlier values, a Note says so for 90 days after we notice it.
- Notes under a chart also tell you when a series is out of date, when we could not update it, and when the publisher no longer provides it. They flag a short history. They also say what a figure covers, for example one combined figure for a City class.
- The Deutsche Bundesbank commercial property series are based on data from other organisations (bulwiengesa, vdp).
- Publisher, series ID and licence for every series are listed under [Sources and licences](/en/sources).
