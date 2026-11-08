# Ticket 2: before and after

Original = `594539e`. Numbers, keys and identifiers unchanged.

## Interface strings, English (ticket 2 keys)

| Key | Original | New | Reason |
|---|---|---|---|
| source.terms.original | Original statistics and metadata used unmodified, under the {terms}. | We use the original statistics and metadata unchanged, under the {terms}. |  |
| source.terms.derived | Derived from Deutsche Bundesbank data by us, under the {terms}. | We calculated this from Deutsche Bundesbank data, under the {terms}. | "derived" became "calculated"; the German drops the brackets "(eigene Berechnung)" because "berechnet" says the same. |
| note.stale | Latest observation: {period}. {source} has not published newer data within the expected interval, so this series may be out of date. | Latest value: {period}. {source} has not published newer data in the time we expect, so this series may be out of date. | "expected interval" became "the time we expect". |
| note.fetch_failed | Could not refresh from {source} on {date}; showing data retrieved on {snapshot}. | We could not update this from {source} on {date}. We show the data we retrieved on {snapshot}. |  |
| note.unavailable | {source} no longer provides this series (not found on {date}); showing data retrieved on {snapshot}. | {source} no longer provides this series. We did not find it on {date}. We show the data we retrieved on {snapshot}. |  |
| note.revised | {source} revised earlier values; detected {date}. This chart shows the latest published version. | {source} changed (revised) earlier values. We noticed this on {date}. The chart shows the latest published version. | Keeps the glossary term "revised" in brackets after the plain word "changed". |
| kpi.not_available.licence | Not available: licence for public redisplay not confirmed | Not available: the licence to show this data publicly is not confirmed yet. | "public redisplay" became "show this data publicly". |
| na.source | Not available: no Open source for {reason} | Not available: no open data source for {reason} | "Open source" became "open data source"; ticket 4 explains the term once on Availability. |
| nav.breadcrumb | Breadcrumb | You are here | Screen-reader label only; says what the breadcrumb is for. |
| latest.change.pct | {change} on {period} | {change} compared with {period} | "on" became "compared with": the change is against that earlier period. |
| latest.change.diff | {change} points on {period} | {change} points compared with {period} | As above. |
| latest.unchanged | No change on {period} | No change compared with {period} | As above. |
| insight.not_shown | Insight not shown: too few observations (n = {n}); at least {min} are needed. | Insight not shown: too few years of data (n = {n}). We need at least {min}. | "observations" became "years of data": Insight values are yearly (Methodology: needs at least 10 years). Same in German. |
| insight.short_history | Short history ({n} years, {from} to {to}): the average rests on little data. | Short history ({n} years, {from} to {to}): the average is based on little data. |  |

## Interface strings, German (ticket 2 keys)

| Key | Original | New | Reason |
|---|---|---|---|
| source.terms.original | Originalstatistik und Metadaten unverändert verwendet, gemäß {terms}. | Wir verwenden die Originalstatistik und die Metadaten unverändert, gemäß {terms}. |  |
| source.terms.derived | Aus Daten der Deutschen Bundesbank abgeleitet (eigene Berechnung), gemäß {terms}. | Wir haben dies aus Daten der Deutschen Bundesbank berechnet, gemäß {terms}. | "derived" became "calculated"; the German drops the brackets "(eigene Berechnung)" because "berechnet" says the same. |
| note.stale | Letzte Beobachtung: {period}. {source} hat innerhalb des erwarteten Zeitraums keine neueren Daten veröffentlicht; die Reihe ist möglicherweise nicht aktuell. | Letzter Wert: {period}. {source} hat in der erwarteten Zeit keine neueren Daten veröffentlicht. Die Reihe ist möglicherweise nicht aktuell. | "expected interval" became "the time we expect". |
| note.fetch_failed | Aktualisierung ({source}) am {date} fehlgeschlagen; dargestellt sind die am {snapshot} abgerufenen Daten. | Am {date} konnten wir die Daten von {source} nicht aktualisieren. Wir zeigen die Daten, die wir am {snapshot} abgerufen haben. |  |
| note.unavailable | {source} stellt diese Reihe nicht mehr bereit (am {date} nicht gefunden); dargestellt sind die am {snapshot} abgerufenen Daten. | {source} stellt diese Reihe nicht mehr bereit. Wir haben sie am {date} nicht gefunden. Wir zeigen die Daten, die wir am {snapshot} abgerufen haben. |  |
| note.revised | {source} hat frühere Werte revidiert (festgestellt am {date}). Dargestellt ist die zuletzt veröffentlichte Fassung. | {source} hat frühere Werte geändert (revidiert). Wir haben das am {date} bemerkt. Die Grafik zeigt die zuletzt veröffentlichte Fassung. | Keeps the glossary term "revised" in brackets after the plain word "changed". |
| kpi.not_available.licence | Nicht verfügbar: Lizenz für die öffentliche Wiedergabe nicht bestätigt | Nicht verfügbar: Die Lizenz, diese Daten öffentlich zu zeigen, ist noch nicht bestätigt. | "public redisplay" became "show this data publicly". |
| na.source | Nicht verfügbar: keine offene Quelle für {reason} | Nicht verfügbar: keine offene Datenquelle für {reason} | "Open source" became "open data source"; ticket 4 explains the term once on Availability. |
| nav.breadcrumb | Brotkrümelnavigation | Sie sind hier | Screen-reader label only; says what the breadcrumb is for. |
| insight.not_shown | Einblick nicht angezeigt: zu wenige Beobachtungen (n = {n}); mindestens {min} sind nötig. | Einblick nicht angezeigt: zu wenige Jahre mit Daten (n = {n}). Wir brauchen mindestens {min}. | "observations" became "years of data": Insight values are yearly (Methodology: needs at least 10 years). Same in German. |

## Coverage: strings left alone

- `site.title`: already plain, kept (EN and DE)
- `nav.home`: already plain, kept (EN and DE)
- `nav.menu`: already plain, kept (EN and DE)
- `nav.logistics`: already plain, kept (EN and DE)
- `lang.switch`: already plain, kept (EN and DE)
- `source.cite`: already plain, kept (EN and DE)
- `source.cite.credit`: already plain, kept (EN and DE)
- `source.details`: already plain, kept (EN and DE)
- `source.detail.dbnomics`: already plain, kept (EN and DE)
- `source.detail.direct`: already plain, kept (EN and DE)
- `source.chip.provisional`: already plain, kept (EN and DE)
- `source.original`: already plain, kept (EN and DE)
- `source.original.unit`: already plain, kept (EN and DE)
- `source.original.source`: already plain, kept (EN and DE)
- `source.own`: already plain, kept (EN and DE)
- `footer.text`: already plain, kept (EN and DE)
- `note.prefix`: already plain, kept (EN and DE)
- `geo.germany`: already plain, kept (EN and DE)
- `nav.sources`: already plain, kept (EN and DE)
- `sources.title`: already plain, kept (EN and DE)
- `nav.kpis`: already plain, kept (EN and DE)
- `select.segment`: already plain, kept (EN and DE)
- `select.geo`: already plain, kept (EN and DE)
- `select.freq`: already plain, kept (EN and DE)
- `select.city_classes`: already plain, kept (EN and DE)
- `select.laender`: already plain, kept (EN and DE)
- `segment.office`: already plain, kept (EN and DE)
- `segment.retail`: already plain, kept (EN and DE)
- `segment.logistics`: already plain, kept (EN and DE)
- `segment.commercial-overall`: already plain, kept (EN and DE)
- `freq.annual`: already plain, kept (EN and DE)
- `freq.quarterly`: already plain, kept (EN and DE)
- `geo.supra-regional`: already plain, kept (EN and DE)
- `geo.excl-supra-regional`: already plain, kept (EN and DE)
- `geo.7-cities`: already plain, kept (EN and DE)
- `geo.120-towns`: already plain, kept (EN and DE)
- `geo.127-towns`: already plain, kept (EN and DE)
- `geo.127-districts`: already plain, kept (EN and DE)
- `geo.de-sh`: already plain, kept (EN and DE)
- `geo.de-hh`: already plain, kept (EN and DE)
- `geo.de-ni`: already plain, kept (EN and DE)
- `geo.de-hb`: already plain, kept (EN and DE)
- `geo.de-nw`: already plain, kept (EN and DE)
- `geo.de-he`: already plain, kept (EN and DE)
- `geo.de-rp`: already plain, kept (EN and DE)
- `geo.de-bw`: already plain, kept (EN and DE)
- `geo.de-by`: already plain, kept (EN and DE)
- `geo.de-sl`: already plain, kept (EN and DE)
- `geo.de-be`: already plain, kept (EN and DE)
- `geo.de-bb`: already plain, kept (EN and DE)
- `geo.de-mv`: already plain, kept (EN and DE)
- `geo.de-sn`: already plain, kept (EN and DE)
- `geo.de-st`: already plain, kept (EN and DE)
- `geo.de-th`: already plain, kept (EN and DE)
- `kpi.noscript`: already plain, kept (EN and DE)
- `nav.segments`: already plain, kept (EN and DE)
- `nav.availability`: already plain, kept (EN and DE)
- `home.spark.label`: already plain, kept (EN and DE)
- `availability.title`: already plain, kept (EN and DE)
- `nav.links`: already plain, kept (EN and DE)
- `nav.methodology`: already plain, kept (EN and DE)
- `methodology.title`: already plain, kept (EN and DE)
- `about.title`: already plain, kept (EN and DE)
- `terms.title`: already plain, kept (EN and DE)
- `privacy.title`: already plain, kept (EN and DE)
- `legal-notice.title`: already plain, kept (EN and DE)
- `links.title`: already plain, kept (EN and DE)
- `insight.back`: already plain, kept (EN and DE)
- `link.back`: already plain, kept (EN and DE)
- `nav.insights`: already plain, kept (EN and DE)
- `insights.title`: already plain, kept (EN and DE)
- `insight.verdict.higher`: already plain, kept (EN and DE)
- `insight.verdict.lower`: already plain, kept (EN and DE)
- `insight.verdict.in_line`: already plain, kept (EN and DE)
- `insight.tag.higher`: already plain, kept (EN and DE)
- `insight.tag.lower`: already plain, kept (EN and DE)
- `insight.tag.in_line`: already plain, kept (EN and DE)
- `insight.tone.better`: already plain, kept (EN and DE)
- `insight.tone.worse`: already plain, kept (EN and DE)
- `insight.average`: already plain, kept (EN and DE)
- `insight.chart.label`: already plain, kept (EN and DE)
- `insight.method`: already plain, kept (EN and DE)

## Other shared text

| Place | Original | New | Reason |
|---|---|---|---|
| `src/pages/index.astro` `<title>` (redirect page, English only) | German CRE statistics | German commercial real estate statistics | Same as the site name; "CRE" is not used elsewhere. |

## Flags (nothing changed)

- `geo.supra-regional` and `geo.excl-supra-regional` ("Cities of supra-regional importance") are the source's own category name, so I left them. A plainer wording would need your decision.
- `nav.kpis` ("KPIs") is the category label; ticket 4 explains "KPI" once on each KPI page.
- `source.chip.provisional` ("Provisional") and `source.cite` ("Data to {period}") are short labels and already plain.
- No English and German differences in meaning found in ticket 2 keys. German formats are unchanged (decimal comma, long German dates).
