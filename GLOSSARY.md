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
