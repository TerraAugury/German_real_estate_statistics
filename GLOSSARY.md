# German Real Estate Statistics

A public website that presents open statistics on the German commercial real estate market and relates them to the wider economy. Audience: investors, analysts, journalists and academics.

## Language

German terms (_DE_) are the canonical translations for the site and for translators.

**Real estate KPI**:
A series that measures the property market itself: rent, yield, vacancy, capital value, transaction volume or construction activity.
_DE_: Immobilienkennzahl
_Avoid_: Metric, property indicator

**Economic indicator**:
A macro or financial series from outside the property market: interest rates, inflation, GDP, unemployment, and credit.
_DE_: Wirtschaftsindikator
_Avoid_: Macro variable, driver

**Link**:
A computed relationship between one real estate KPI and one economic indicator over a stated period, shown as an overlay with a rank correlation of changes and a lag profile. A link describes co-movement ("Gleichlauf"), never causation or forecast. It is shown only when enough paired observations exist; otherwise the site says why not.
_DE_: Verknüpfung (the relationship it describes is called "Gleichlauf")
_Avoid_: Correlation (a link includes more than the coefficient), prediction, impact, driver, effect

**Insight**:
A curated chart that puts two or more series (Real estate KPIs, Economic indicators, or values computed from them such as a spread or an inflation-adjusted index) on one axis over a stated period, with a fixed one-line reading. Unlike a Link it carries no coefficient or lag. Its reading describes what the lines show, never a cause or forecast. For the Construction KPI page an Insight may use the construction price series, which is otherwise an Economic indicator, as its Real estate KPI.
_DE_: Einblick
_Avoid_: Analysis (too broad), comparison, spread (one kind of Insight), chart (any chart)

**Headline measure**:
The one number an Insight leads with, calculated from its series: a spread, a ratio, or a year-on-year change. The Insight's verdict and reading describe this number only. The series it compares the Real estate KPI against is the **reference series**.
_Avoid_: Headline (also the name of a KPI's lead view in code), result

**Verdict**:
The tag on an Insight's headline measure: "higher than", "lower than" or "in line with" the average of the whole shared period, judged against half a standard deviation. It says where the latest value sits against the past, never a cause or forecast.

**Tone**:
Whether an Insight's verdict reads better, worse or neutral for an investor in office property. It follows the verdict (where the latest value sits against the average) through a direction declared per Insight, never the sign of the number: a falling vacancy is better although it is negative. An Insight whose direction depends on whose side you take has no better side and stays neutral, as does a verdict "in line". An editorial reading from a stated perspective, never a cause or forecast.
_DE_: Bewertung (draft, not yet Reviewed; "Einordnung" already names the Verdict in the German Methodology)
_Avoid_: Sentiment, rating, score, signal

**Lead Insight**:
The one Insight that Home opens with: the yield spread when it is public and shown, otherwise the first Insight that is shown. Home shows no lead when no Insight is shown.
_Avoid_: Featured insight, hero (the hero is how Home draws it)

**Citation line**:
The short source line under a chart: publisher, licence and the date of the latest data, with a Provisional marker where the licence is not confirmed. The full lineage (series id, service, retrieval date, original series and unit) sits behind "Series details".
_DE_: Quellenangabe
_Avoid_: Source line (that is the full lineage), footnote

**Heat shade**:
The tint of a cell in the Links overview: violet where a Link's changes moved in opposite directions, olive green where they moved together, deeper for a larger rank correlation. The coefficient stays printed in the cell; the shade describes co-movement only.
_DE_: Farbabstufung
_Avoid_: Heatmap (the overview is a table), strength of effect

**Lag**:
The shift, in whole periods, between an economic indicator and a real estate KPI when a link is computed. Positive lag means the indicator moved earlier than the KPI. It describes timing of co-movement, never lead time for prediction.
_DE_: Verschiebung (in Perioden)
_Avoid_: Lead time, delay

**Segment**:
A commercial property type tracked by the site: office, retail or logistics, plus a "commercial overall" view. Residential and hotel are not segments in this effort.
_DE_: Segment
_Avoid_: Asset class, sector

**City class**:
A group of German cities that a source reports as one aggregate, such as the "7 major cities (A-Städte)", "120 towns", "127 towns" or "cities of supra-regional importance". The site shows city classes, never named cities, because no Open source supplies named-city series.
_DE_: Städtegruppe
_Avoid_: City level (suggests named cities), city data

**Not available**:
A Real estate KPI and Segment combination for which no Open source exists. The site shows it as an explicit "not available" entry with the reason, rather than hiding it or promising it for later.
_DE_: Nicht verfügbar
_Avoid_: Missing, coming soon, deferred

**Open source**:
A data source that is free to call, documented, and licensed to allow public redisplay. A source that fails this test is excluded.
_DE_: Offene Quelle
_Avoid_: Free source, public data

**Provisional**:
A series whose licence for public redisplay is not yet confirmed. It is kept out of the public site, together with every Link that uses it, until the licence is confirmed.
_DE_: Vorläufig
_Avoid_: Draft, unverified, beta

**Original source**:
The third party a series' metadata names as the maker of the data (for example vdpResearch, bulwiengesa, the Federal Employment Agency), when the publisher serving it is a different body. A series with an Original source other than the Bundesbank or ESCB stays Provisional until its permission is confirmed. The Citation line and the Sources page credit vdpResearch and bulwiengesa by name (the manifest `credit`), with the publisher named after them.
_DE_: Ursprungsquelle
_Avoid_: Provider (that is the operator of the site), Publisher (the body that serves the series, not the maker of the data)

**Stale**:
A series whose latest observation is older than the expected interval for its frequency. The site still shows it, with a note.
_DE_: Nicht aktuell
_Avoid_: Outdated, expired

**Revised**:
A series where the source changed values for earlier periods. The site shows only the latest version and keeps no revision history.
_DE_: Revidiert
_Avoid_: Corrected, updated

**Note** (DE "Hinweis"):
A one-line statement inside a chart container about scope, short history, staleness, a failed refresh or a revision.
_Avoid_: Warning, disclaimer (the disclaimer lives only in the Terms)

**Reviewed** (German text):
A German string or page that a named human has checked against its current English source. The production site contains only reviewed German; a machine translation is a draft until reviewed.
_DE_: Geprüft
_Avoid_: Translated, approved

**Provider**:
The legal entity that operates the site and is responsible for it: Terra Augury Ltd, a company registered in Cyprus. Named in the Impressum and the Privacy policy.
_DE_: Diensteanbieter
_Avoid_: Owner, publisher (the publisher is the source of the data)
