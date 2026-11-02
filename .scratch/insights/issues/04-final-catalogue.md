# Final Insight catalogue

Label: wayfinder:grilling
Type: grilling (HITL)
Status: open
Blocked by:

## Question

For each candidate Insight A–M on the map, settle: in or out; the exact manifest series (which segment, City class, annual or quarterly, Destatis or Bundesbank construction); the headline measure; the title in EN and DE; the reading template in EN; and the order on the Insights page. Check every pair's shared period against the minimum length from ticket 02. Note which Insights are public today and which wait on Provisional series.

For Insight M, ticket 01 found office employment (Destatis 13311, WZ K-N) nationally and by Land, but not by City class. Decide whether M is national only, uses Länder, or sums Eurostat NUTS 3 data for the seven A-cities as an own calculation (which would mean narrowing the glossary's "no named-city series" line to Real estate KPIs). Treat Destatis's `0.0` for unpublished 2025 single sections as missing.

Starting point: most candidates use Provisional Bundesbank series. C, J and K (Destatis version) and the indicator-only sides are public.

Also: whether Insights comparing City classes show both 120 and 127 towns, which nearly overlap (ticket 03).

From ticket 02: check whether the Bundesbank annual price index is an average or a year-end value, to pick the CPI mode for any price Insight; every Insight must reach 10 shared annual observations.

## Answer

**Catalogue: 10 Insights, in page order.** L (GDP vs vacancy), H (vacancy vs unemployment) and K (completions vs GDP) are out. M is now office vacancy vs office employment. All Insights are annual; every pair clears the 10-observation minimum. "Gap" is renamed **spread** everywhere.

| # | | Series (manifest keys) | Shared period (obs) | Headline measure | Today |
|---|---|---|---|---|---|
| 1 | A | `initial-yield-combined-7`, `-127`; `bund-yield-10y` (annual mean) | 1995-2025 (31) | Spread, pp: 7 cities yield minus Bund (127 towns also shown) | Provisional |
| 2 | F | `initial-yield-combined-7`; `loan-rate-nfc` | 2011-2025 (15) | Spread, pp: yield minus corporate loan rate | Provisional |
| 3 | G | `price-index-de-office-a`; `rent-index-de-office-a` (rebased 2015 = 100) | 2013-2025 (13) | Ratio: price index / rent index | Provisional |
| 4 | B | `rent-index-de-office-a`; `cpi` (annual average, flow) | 2004-2025 (22) | Real rent growth, % | Provisional |
| 5 | D | `rent-index-de-office-a`; `construction-price-office` (annual mean) | 2004-2025 (22) | Spread, pp: rent growth minus construction price growth | Provisional |
| 6 | I | `rent-index-de-office-a`; `gdp-real` | 2004-2025 (22) | Spread, pp: rent growth minus real GDP growth | Provisional |
| 7 | C | `construction-completions-office`; `construction-permits-office` (Destatis) | 2010-2025 (16) | Ratio: completions in t / permits in t-2 | **Public** |
| 8 | J | `construction-price-office`; `cpi` | 1991-2025 (35) | Spread, pp: construction price growth minus CPI inflation | **Public** |
| 9 | E | `office-vacancy-7`; `office-vacancy-127` | 1995-2025 (31) | Spread, pp: 7 cities minus 127 towns | Provisional |
| 10 | M | `office-vacancy-127`; new `DESTATIS/13311BJ002/DG.WZ08-K-N.ERW063` | about 1996-2024/25 | Year-on-year change in vacancy, pp (employment growth shown as context) | Provisional vacancy |

**Decisions behind the table**
- **City classes:** 7 and 127 only; 120 is dropped (127 contains it; ticket 03). F uses 7, H's replacement M uses 127.
- **Segments:** B, D, G, I use the office series for Germany; A, E, F use the "office and retail combined" City class series (the only one that exists); E and M use office vacancy.
- **C:** Destatis, not the longer Provisional Bundesbank series. Permits are shifted two years forward in the chart ("permits, two years earlier"). Under 20 observations, so it carries the short-history Note. The same applies to F (15), G (13) and C (16).
- **M:** national office employment against 127-town vacancy; no NUTS 3 sum, so the glossary's "no named-city series" line is **not** narrowed. Both series are plotted as year-on-year change on one axis (vacancy in points, employment in %). Only the vacancy change gets the verdict. The rank correlation stays on the Link pages. Destatis `0.0` for an unpublished year is treated as missing, so M may end in 2024. M needs a new manifest entry for the employment series.
- **Deflating:** only B deflates, as a flow with the annual-average CPI. No Insight deflates a price, so whether the Bundesbank price index is an average or a year-end value does not matter here.
- **Public today:** only C and J. Every other Insight uses a Provisional series. K would have been Provisional too, since `gdp-real` is.

**Titles (EN / DE draft, DE not yet Reviewed) and anchors**

| # | EN | DE |
|---|---|---|
| 1 | Initial yield spread over the 10-year Bund, by City class | Renditeabstand der Anfangsrendite zur 10-jährigen Bundesanleihe, nach Städtegruppe |
| 2 | Initial yield spread over the corporate loan rate | Renditeabstand der Anfangsrendite zum Unternehmenskreditzins |
| 3 | Office prices vs rents | Büropreise und Büromieten |
| 4 | Real office rents | Reale Büromieten |
| 5 | Office rents vs construction costs | Büromieten und Baupreise |
| 6 | Office rents vs GDP | Büromieten und Wirtschaftsleistung |
| 7 | Office completions vs permits two years earlier | Büro-Fertigstellungen und Baugenehmigungen zwei Jahre zuvor |
| 8 | Construction costs vs inflation | Baupreise und Inflation |
| 9 | Office vacancy: 7 major cities vs 127 towns | Büroleerstand: A-Städte und 127 Städte |
| 10 | Office vacancy and office employment | Büroleerstand und Bürobeschäftigung |

Order groups yields, rents, supply, vacancy. Hidden Provisional Insights leave no gap. Each Insight keeps a stable anchor.

**Reading templates (EN)**, filled at build time; verdict word is "higher than" / "lower than" / "in line with"; points and % one decimal, ratios two:
- Spread (A, D, E, F, I, J): "The latest {name} is {latest} points, {verdict} the {from}-{to} average of {mean} points."
- Growth (B): "Real office rents grew {latest}% in {to}, {verdict} the {from}-{to} average of {mean}%."
- Ratio, C: "Completions were {latest} times the permits issued two years earlier, {verdict} the {from}-{to} average of {mean}."
- Ratio, G: "The price index stands at {latest} times the rent index, {verdict} the {from}-{to} average of {mean}."
- M: "Office vacancy changed by {latest} points in {to} while office employment grew {emp}%; the {from}-{to} average vacancy change is {mean} points."
