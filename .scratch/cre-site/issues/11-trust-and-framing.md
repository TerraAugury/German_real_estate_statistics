# Trust and framing

Label: wayfinder:grilling
Type: grilling (HITL)
Status: resolved
Blocked by: 06 (resolved)

## Question

Beyond the per-Link sentence settled in ticket 06, what trust and framing does the site carry? Settle: the "not investment advice" disclaimer and where it sits, how short histories, data gaps, Not available entries and provisional series are shown so a reader is not misled, the tone of the short-window note, and the wording for revisions and stale data (a series whose last observation lags).

## Answer

The not-investment-advice disclaimer lives only in the Terms and conditions. Everything else the site says about data state is a one-line **Note** inside the chart container, driven by the pipeline flags and the manifest.

**Disclaimer.** Full text only in the Terms (ticket 13); the footer already links Terms on every page. No footer line, banner or KPI-page notice. Short-form text the Terms must carry in both languages:
- EN: "For information only. This site presents public statistics and is not investment, tax or legal advice, and not an offer or recommendation to buy or sell any asset. Figures come from third-party sources and may be incomplete, delayed or revised."
- DE: "Nur zur Information. Diese Seite stellt öffentliche Statistiken dar und ist keine Anlage-, Steuer- oder Rechtsberatung und kein Angebot und keine Empfehlung zum Kauf oder Verkauf von Vermögenswerten. Die Zahlen stammen von Dritten und können unvollständig, verspätet oder revidiert sein."

**Notes.** One line each, inside the chart container above the source line, prefixed "Note" / "Hinweis" (not colour or icon alone). Fixed order: scope, short history, stale, fetch failed, revised. All shown, never collapsed. Tone plain and descriptive: no "warning", no exclamation marks, no emoji.

| Note | Shown when | EN | DE |
|---|---|---|---|
| Stale | `stale`; thresholds unchanged (150 / 240 / 540 days) | "Latest observation: [period]. The source has not published newer data within the expected interval, so this series may be out of date." | "Letzte Beobachtung: [Zeitraum]. Die Quelle hat innerhalb des erwarteten Zeitraums keine neueren Daten veröffentlicht; die Reihe ist möglicherweise nicht aktuell." |
| Revised | 90 days after `revised_at` | "The source revised earlier values; detected [date]. This chart shows the latest published version." | "Die Quelle hat frühere Werte revidiert (festgestellt am [Datum]). Dargestellt ist die zuletzt veröffentlichte Fassung." |
| Fetch failed | `fetch_failed`, until the next successful fetch | "Could not refresh from DBnomics on [date]; showing data retrieved on [date of last snapshot]." | "Aktualisierung über DBnomics am [Datum] fehlgeschlagen; dargestellt sind die am [Datum] abgerufenen Daten." |
| Short history | manifest `short_window` (series starting after 2010) | "Short history ([start] to [end])." plus, only on the Bundesbank 2013-based price indices: "this window contains essentially one interest-rate cycle, so the pattern may not hold in other periods." | "Kurze Zeitreihe ([Beginn] bis [Ende])." plus: "Der Zeitraum umfasst im Wesentlichen einen Zinszyklus; das Muster muss in anderen Zeiträumen nicht gelten." |
| Scope: index | index series | "Index (2013 = 100): shows change over time, not a price level in euros." | "Index (2013 = 100): zeigt die Entwicklung, nicht ein Preisniveau in Euro." |
| Scope: City class | City class geography | "Aggregate for [class], not an individual city." | "Aggregat für [Klasse], keine einzelne Stadt." |
| Scope: combined | office and retail combined | "Office and retail combined; no separate office or retail figure." | "Büro und Einzelhandel zusammen; keine getrennten Werte." |

The short-window caveat on the Bundesbank 2013-based price indices replaces ticket 06's placeholder "Short window dominated by one interest-rate cycle"; ticket 10 translates only formatting, the DE text above is fixed. The series name (not the rule) carries the cycle sentence.

**Where.** Link panels inherit the notes of both series, each prefixed with the series title; a stale or fetch-failed series does not suppress its Link. Home cards and Segment compact charts show only stale and fetch failed (plus the latest period beside the value on Home); scope, short-history and revised notes appear on KPI pages only.

**Three kinds of empty stay distinct.** "Not available: no Open source for [reason]" (ticket 05, 09), "Link not shown: too few observations (n = ...)" (ticket 06), and, if licence is refused under 08, "Not available: licence for public redisplay not confirmed" / "Nicht verfügbar: Lizenz für die öffentliche Wiedergabe nicht bestätigt". Never "missing" or "coming soon".

**Methodology "How to read these figures".** DBnomics is an aggregator and the publishers are not responsible for this site; derived values are our own calculation; the site shows only the latest vintage and keeps no revision history; the Bundesbank CRE series are compiled from third-party data (bulwiengesa, vdp); points to Sources & licences. (A claim that the series are valuation-based was dropped: the research does not support it.)

**Constraints on siblings**
- 13 legal pages: the Terms must carry the disclaimer above in EN and DE, no-warranty wording and no endorsement by source publishers; no other page repeats it.
- 10 bilingual workflow: the note texts are fixed here; period and date formatting inside them is localisation; the manifest `short_window` and scope keys need the same translation handling as titles.
- 12 pipeline: needs a `short_window` manifest field (plus its extra sentence key) and a 90-day check on `revised_at`.
