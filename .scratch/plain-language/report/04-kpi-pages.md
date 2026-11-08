# Ticket 4: before and after

Original = `21da6f0`. Numbers, keys and identifiers unchanged.

## Interface strings, English (ticket 4 keys)

| Key | Original | New | Reason |
|---|---|---|---|
| note.short_cycle | This window contains essentially one interest-rate cycle, so the pattern may not hold in other periods. | This period covers about one interest-rate cycle. The pattern may not hold in other periods. | "essentially one" became "about one". |
| note.scope.index | Index (2013 = 100): shows change over time, not a price level in euros. | Index (2013 = 100): we set 2013 to 100. It shows change over time, not a price in euros. | Adds the plain explanation "we set 2013 to 100" (one short sentence per technical term). The digits 2013 and 100 are the existing base year, not new data. |
| note.scope.city_class | Aggregate for {class}, not an individual city. | Combined figure for {class}, not for one city. |  |
| sources.intro | One row per series shown on this site. Series are fetched directly from the publisher or through DBnomics, which aggregates them; the data keeps the publisher's licence. | One row per series shown on this site. We fetch each series directly from the publisher, or through DBnomics, which collects data from many publishers. The data keeps the publisher's licence. |  |
| note.partial_total | Germany total is the sum of the Länder with data; no value for {laender} in {year}. | The Germany total adds up the Länder (federal states) that have data. There is no value for {laender} in {year}. | Adds "(federal states)" to explain Länder. Meaning unchanged. |
| na.kpi-initial-yield.office | office yields on their own; the source reports office and retail combined (see Commercial overall) | office yields on their own (the source reports office and retail combined, see Commercial overall) |  |
| na.kpi-initial-yield.retail | retail yields on their own; the source reports office and retail combined (see Commercial overall) | retail yields on their own (the source reports office and retail combined, see Commercial overall) |  |
| na.kpi-transaction-volume.office | office transaction volumes; the source covers all commercial property | office transaction volumes (the source covers all commercial property together) |  |
| na.kpi-transaction-volume.retail | retail transaction volumes; the source covers all commercial property | retail transaction volumes (the source covers all commercial property together) |  |
| na.kpi-transaction-volume.logistics | logistics transaction volumes; the source covers all commercial property | logistics transaction volumes (the source covers all commercial property together) |  |
| na.construction.retail | retail buildings; Destatis has no separate building type for them | retail buildings (the Federal Statistical Office, Destatis, has no separate building type for them) | Adds the plain name of Destatis (Federal Statistical Office). |
| segment.intro | One national chart per KPI where a source has it; each chart opens the full KPI page. | We show one chart for Germany per KPI (key figure) where a source has it. Each chart opens the full KPI page. | "national chart" became "chart for Germany"; adds "(key figure)" to explain KPI once. |
| availability.intro | Every KPI for every Segment. A gap is stated with its reason; nothing is planned for later. | Every KPI (key figure) for every Segment (property type). We give the reason for each gap. Nothing is planned for later. Open data sources are free to use and may be shown publicly. | Adds one short explanation each for KPI, Segment and "open data source", which the page used without explaining. |
| kpi.insights.heading | Insights using this KPI | Insights that use this KPI (key figure) | English adds "(key figure)" to explain KPI once on each KPI page; German already says Kennzahl. |
| kpi.price-index.definition | How the general price level of commercial property compares with its level in a base year. | How commercial property prices in general compare with prices in a base year. The base year is set to 100. | Adds "The base year is set to 100" to explain the base year. 100 is the index convention, not a data value. |
| kpi.transaction-volume.definition | The euro value of property sold, shown as an index. It shows how active and liquid the market is. | The euro value of property sold, shown as an index. It shows how active the market is and how easy it is to buy and sell. | "liquid" became "how easy it is to buy and sell". |

## Interface strings, German (ticket 4 keys)

| Key | Original | New | Reason |
|---|---|---|---|
| note.short_cycle | Der Zeitraum umfasst im Wesentlichen einen Zinszyklus; das Muster muss in anderen Zeiträumen nicht gelten. | Der Zeitraum umfasst etwa einen Zinszyklus. Das Muster muss in anderen Zeiträumen nicht gelten. | "essentially one" became "about one". |
| note.scope.index | Index (2013 = 100): zeigt die Entwicklung, nicht ein Preisniveau in Euro. | Index (2013 = 100): Wir setzen 2013 auf 100. Er zeigt die Entwicklung, keinen Preis in Euro. | Adds the plain explanation "we set 2013 to 100" (one short sentence per technical term). The digits 2013 and 100 are the existing base year, not new data. |
| note.scope.city_class | Aggregat für {class}, keine einzelne Stadt. | Gesamtwert für {class}, nicht für eine einzelne Stadt. |  |
| sources.intro | Eine Zeile je Reihe, die auf dieser Seite gezeigt wird. Die Reihen werden direkt beim Herausgeber oder über DBnomics abgerufen, das sie bündelt; die Daten behalten die Lizenz des Herausgebers. | Eine Zeile je Reihe, die auf dieser Seite gezeigt wird. Wir rufen jede Reihe direkt beim Herausgeber ab oder über DBnomics, das Daten vieler Herausgeber sammelt. Die Daten behalten die Lizenz des Herausgebers. |  |
| note.partial_total | Deutschland-Summe aus den Ländern mit Daten; für {laender} liegt für {year} kein Wert vor. | Die Summe für Deutschland zählt die Länder mit Daten zusammen. Für {laender} gibt es für {year} keinen Wert. | Adds "(federal states)" to explain Länder. Meaning unchanged. |
| na.kpi-initial-yield.office | Büro-Renditen allein; die Quelle weist Büro und Einzelhandel zusammen aus (siehe Gewerbe gesamt) | Büro-Renditen allein (die Quelle weist Büro und Einzelhandel zusammen aus, siehe Gewerbe gesamt) |  |
| na.kpi-initial-yield.retail | Einzelhandels-Renditen allein; die Quelle weist Büro und Einzelhandel zusammen aus (siehe Gewerbe gesamt) | Einzelhandels-Renditen allein (die Quelle weist Büro und Einzelhandel zusammen aus, siehe Gewerbe gesamt) |  |
| na.kpi-transaction-volume.office | Transaktionsvolumen bei Büros; die Quelle erfasst alle Gewerbeimmobilien zusammen | Transaktionsvolumen bei Büros (die Quelle erfasst alle Gewerbeimmobilien zusammen) |  |
| na.kpi-transaction-volume.retail | Transaktionsvolumen im Einzelhandel; die Quelle erfasst alle Gewerbeimmobilien zusammen | Transaktionsvolumen im Einzelhandel (die Quelle erfasst alle Gewerbeimmobilien zusammen) |  |
| na.kpi-transaction-volume.logistics | Transaktionsvolumen bei Logistikimmobilien; die Quelle erfasst alle Gewerbeimmobilien zusammen | Transaktionsvolumen bei Logistikimmobilien (die Quelle erfasst alle Gewerbeimmobilien zusammen) |  |
| na.construction.retail | Einzelhandelsgebäude; Destatis führt dafür keine eigene Gebäudeart | Einzelhandelsgebäude (das Statistische Bundesamt, Destatis, führt dafür keine eigene Gebäudeart) | Adds the plain name of Destatis (Federal Statistical Office). |
| segment.intro | Je Kennzahl eine Grafik für Deutschland, soweit eine Quelle sie liefert; jede Grafik öffnet die vollständige Kennzahlseite. | Je Kennzahl eine Grafik für Deutschland, soweit eine Quelle sie liefert. Jede Grafik öffnet die vollständige Kennzahlseite. | "national chart" became "chart for Germany"; adds "(key figure)" to explain KPI once. |
| availability.intro | Jede Kennzahl für jedes Segment. Eine Lücke wird mit ihrem Grund genannt; nichts ist für später vorgesehen. | Jede Kennzahl für jedes Segment (Immobilienart). Für jede Lücke nennen wir den Grund. Für später ist nichts geplant. Offene Datenquellen sind frei nutzbar und dürfen öffentlich gezeigt werden. | Adds one short explanation each for KPI, Segment and "open data source", which the page used without explaining. |
| kpi.insights.heading | Einblicke zu dieser Kennzahl | Einblicke, die diese Kennzahl nutzen | English adds "(key figure)" to explain KPI once on each KPI page; German already says Kennzahl. |
| kpi.price-index.definition | Wie sich das allgemeine Preisniveau von Gewerbeimmobilien zu seinem Stand in einem Basisjahr verhält. | Wie sich die Preise von Gewerbeimmobilien im Allgemeinen zu den Preisen in einem Basisjahr verhalten. Das Basisjahr ist auf 100 gesetzt. | Adds "The base year is set to 100" to explain the base year. 100 is the index convention, not a data value. |
| kpi.transaction-volume.definition | Der Eurowert der verkauften Immobilien, dargestellt als Index. Er zeigt, wie aktiv und liquide der Markt ist. | Der Eurowert der verkauften Immobilien, dargestellt als Index. Er zeigt, wie aktiv der Markt ist und wie leicht sich Immobilien kaufen und verkaufen lassen. | "liquid" became "how easy it is to buy and sell". |

## Series manifest, English

| Key | Original | New | Reason |
|---|---|---|---|
| bund-yield-10y.unit | % p.a. | % per year |  |
| euribor-3m.unit | % p.a. | % per year |  |
| loan-rate-nfc.title | New-business loan rate, non-financial corporations, over EUR 1m, fixation over 5 years | Interest rate on new loans to non-financial corporations, over EUR 1 million, fixed for over 5 years | "New-business" became "on new loans"; "fixation" became "initial rate fixed for". Same loans, same bands (over EUR 1 million, over 5 years). |
| loan-rate-nfc.unit | % p.a. | % per year |  |
| cpi.title | Consumer price index, Germany | Consumer price index (CPI), Germany |  |
| gdp-real.title | Real GDP, Germany | Real GDP (gross domestic product, adjusted for inflation), Germany | Explains GDP and "real" in brackets. |
| office-employment.title | Persons in employment: information and communication, finance, real estate and business services (sections J, K-N), Germany | People in work: information and communication, finance, real estate and business services (sections J and K to N), Germany | "Persons in employment" became "People in work"; "K-N" became "K to N" and the German now says Wirtschaftsabschnitte. WZ 2008 is left for Methodology (ticket 7) so no new year appears on the pages. |

## Series manifest, German

| Key | Original | New | Reason |
|---|---|---|---|
| bund-yield-10y.unit | % p. a. | % pro Jahr |  |
| euribor-3m.unit | % p. a. | % pro Jahr |  |
| loan-rate-nfc.title | Kreditzins Neugeschäft, nichtfinanzielle Kapitalgesellschaften, über 1 Mio. EUR, Zinsbindung über 5 Jahre | Zins auf neue Kredite an nichtfinanzielle Kapitalgesellschaften, über 1 Mio. EUR, Zinsbindung über 5 Jahre | "New-business" became "on new loans"; "fixation" became "initial rate fixed for". Same loans, same bands (over EUR 1 million, over 5 years). |
| loan-rate-nfc.unit | % p. a. | % pro Jahr |  |
| gdp-real.title | Reales Bruttoinlandsprodukt, Deutschland | Reales Bruttoinlandsprodukt (BIP, inflationsbereinigt), Deutschland | Explains GDP and "real" in brackets. |
| office-employment.title | Erwerbstätige: Information und Kommunikation, Finanzierung, Immobilien und Unternehmensdienstleistungen (Abschnitte J, K-N), Deutschland | Erwerbstätige: Information und Kommunikation, Finanzierung, Immobilien und Unternehmensdienstleistungen (Wirtschaftsabschnitte J und K bis N), Deutschland | "Persons in employment" became "People in work"; "K-N" became "K to N" and the German now says Wirtschaftsabschnitte. WZ 2008 is left for Methodology (ticket 7) so no new year appears on the pages. |

## Coverage: strings left alone

- `kpi.construction.title`: already plain, kept (EN and DE)
- `note.short_window`: already plain, kept (EN and DE)
- `note.scope.combined`: already plain, kept (EN and DE)
- `sources.col.series`: already plain, kept (EN and DE)
- `sources.col.publisher`: already plain, kept (EN and DE)
- `sources.col.id`: already plain, kept (EN and DE)
- `sources.col.licence`: already plain, kept (EN and DE)
- `sources.col.attribution`: already plain, kept (EN and DE)
- `kpi.price-index.title`: already plain, kept (EN and DE)
- `kpi.rent-index.title`: already plain, kept (EN and DE)
- `kpi.initial-yield.title`: already plain, kept (EN and DE)
- `kpi.office-vacancy.title`: already plain, kept (EN and DE)
- `kpi.transaction-volume.title`: already plain, kept (EN and DE)
- `na.kpi-price-index.logistics`: already plain, kept (EN and DE)
- `na.kpi-rent-index.logistics`: already plain, kept (EN and DE)
- `na.kpi-initial-yield.logistics`: already plain, kept (EN and DE)
- `na.kpi-office-vacancy.retail`: already plain, kept (EN and DE)
- `na.kpi-office-vacancy.logistics`: already plain, kept (EN and DE)
- `na.kpi-office-vacancy.commercial-overall`: already plain, kept (EN and DE)
- `segment.availability`: already plain, kept (EN and DE)
- `availability.kpi`: already plain, kept (EN and DE)
- `availability.available`: already plain, kept (EN and DE)
- `kpi.rent-index.definition`: already plain, kept (EN and DE)
- `kpi.initial-yield.definition`: already plain, kept (EN and DE)
- `kpi.office-vacancy.definition`: already plain, kept (EN and DE)
- `kpi.construction.definition`: already plain, kept (EN and DE)
- `Series manifest:construction-permits-office.title`: kept
- `Series manifest:construction-permits-office.unit`: kept
- `Series manifest:construction-permits-commercial.title`: kept
- `Series manifest:construction-permits-commercial.unit`: kept
- `Series manifest:construction-permits-warehouse.title`: kept
- `Series manifest:construction-permits-warehouse.unit`: kept
- `Series manifest:construction-completions-office.title`: kept
- `Series manifest:construction-completions-office.unit`: kept
- `Series manifest:construction-completions-commercial.title`: kept
- `Series manifest:construction-completions-commercial.unit`: kept
- `Series manifest:construction-completions-warehouse.title`: kept
- `Series manifest:construction-completions-warehouse.unit`: kept
- `Series manifest:price-index-de-total-a.title`: kept
- `Series manifest:price-index-de-total-a.unit`: kept
- `Series manifest:price-index-de-total-q.title`: kept
- `Series manifest:price-index-de-total-q.unit`: kept
- `Series manifest:price-index-de-office-a.title`: kept
- `Series manifest:price-index-de-office-a.unit`: kept
- `Series manifest:price-index-de-office-q.title`: kept
- `Series manifest:price-index-de-office-q.unit`: kept
- `Series manifest:price-index-de-retail-a.title`: kept
- `Series manifest:price-index-de-retail-a.unit`: kept
- `Series manifest:price-index-de-retail-q.title`: kept
- `Series manifest:price-index-de-retail-q.unit`: kept
- `Series manifest:price-index-cities-total-a.title`: kept
- `Series manifest:price-index-cities-total-a.unit`: kept
- `Series manifest:price-index-cities-total-q.title`: kept
- `Series manifest:price-index-cities-total-q.unit`: kept
- `Series manifest:price-index-cities-office-a.title`: kept
- `Series manifest:price-index-cities-office-a.unit`: kept
- `Series manifest:price-index-cities-office-q.title`: kept
- `Series manifest:price-index-cities-office-q.unit`: kept
- `Series manifest:price-index-cities-retail-a.title`: kept
- `Series manifest:price-index-cities-retail-a.unit`: kept
- `Series manifest:price-index-cities-retail-q.title`: kept
- `Series manifest:price-index-cities-retail-q.unit`: kept
- `Series manifest:price-index-excl-total-a.title`: kept
- `Series manifest:price-index-excl-total-a.unit`: kept
- `Series manifest:price-index-excl-total-q.title`: kept
- `Series manifest:price-index-excl-total-q.unit`: kept
- `Series manifest:price-index-excl-office-a.title`: kept
- `Series manifest:price-index-excl-office-a.unit`: kept
- `Series manifest:price-index-excl-office-q.title`: kept
- `Series manifest:price-index-excl-office-q.unit`: kept
- `Series manifest:price-index-excl-retail-a.title`: kept
- `Series manifest:price-index-excl-retail-a.unit`: kept
- `Series manifest:price-index-excl-retail-q.title`: kept
- `Series manifest:price-index-excl-retail-q.unit`: kept
- `Series manifest:rent-index-de-office-a.title`: kept
- `Series manifest:rent-index-de-office-a.unit`: kept
- `Series manifest:rent-index-de-office-q.title`: kept
- `Series manifest:rent-index-de-office-q.unit`: kept
- `Series manifest:rent-index-de-retail-a.title`: kept
- `Series manifest:rent-index-de-retail-a.unit`: kept
- `Series manifest:rent-index-de-retail-q.title`: kept
- `Series manifest:rent-index-de-retail-q.unit`: kept
- `Series manifest:rent-index-combined-127.title`: kept
- `Series manifest:rent-index-combined-127.unit`: kept
- `Series manifest:rent-index-combined-120.title`: kept
- `Series manifest:rent-index-combined-120.unit`: kept
- `Series manifest:rent-index-combined-7.title`: kept
- `Series manifest:rent-index-combined-7.unit`: kept
- `Series manifest:initial-yield-combined-127.title`: kept
- `Series manifest:initial-yield-combined-127.unit`: kept
- `Series manifest:initial-yield-combined-120.title`: kept
- `Series manifest:initial-yield-combined-120.unit`: kept
- `Series manifest:initial-yield-combined-7.title`: kept
- `Series manifest:initial-yield-combined-7.unit`: kept
- `Series manifest:office-vacancy-127.title`: kept
- `Series manifest:office-vacancy-127.unit`: kept
- `Series manifest:office-vacancy-7.title`: kept
- `Series manifest:office-vacancy-7.unit`: kept
- `Series manifest:office-vacancy-120.title`: kept
- `Series manifest:office-vacancy-120.unit`: kept
- `Series manifest:transaction-volume-de.title`: kept
- `Series manifest:transaction-volume-de.unit`: kept
- `Series manifest:transaction-volume-127.title`: kept
- `Series manifest:transaction-volume-127.unit`: kept
- `Series manifest:transaction-volume-7.title`: kept
- `Series manifest:transaction-volume-7.unit`: kept
- `Series manifest:construction-bbk-permits-office.title`: kept
- `Series manifest:construction-bbk-permits-office.unit`: kept
- `Series manifest:construction-bbk-permits-wholesale-warehouse.title`: kept
- `Series manifest:construction-bbk-permits-wholesale-warehouse.unit`: kept
- `Series manifest:construction-bbk-completions-office.title`: kept
- `Series manifest:construction-bbk-completions-office.unit`: kept
- `Series manifest:construction-bbk-completions-wholesale-warehouse.title`: kept
- `Series manifest:construction-bbk-completions-wholesale-warehouse.unit`: kept
- `Series manifest:bund-yield-10y.title`: kept
- `Series manifest:euribor-3m.title`: kept
- `Series manifest:cpi.unit`: kept
- `Series manifest:gdp-real.unit`: kept
- `Series manifest:unemployment-rate.title`: kept
- `Series manifest:unemployment-rate.unit`: kept
- `Series manifest:construction-price-office.title`: kept
- `Series manifest:construction-price-office.unit`: kept
- `Series manifest:construction-price-commercial.title`: kept
- `Series manifest:construction-price-commercial.unit`: kept
- `Series manifest:oecd-confidence-construction.title`: kept
- `Series manifest:oecd-confidence-construction.unit`: kept
- `Series manifest:oecd-confidence-retail.title`: kept
- `Series manifest:oecd-confidence-retail.unit`: kept
- `Series manifest:office-employment.unit`: kept

## Flags (nothing changed unless stated)

- **Construction definition covers permits only.** `kpi.construction.definition` ("Floor space approved for construction…") describes permits, while the title says "permits, completions". English and German agree, so I left both. Needs your decision.
- **German "von" or "mit":** series titles say "Städte von überregionaler Bedeutung", the selector label (`geo.supra-regional`) says "Städte mit überregionaler Bedeutung". Left as is; one of them should change.
- **OECD unit "% balance" / "Saldo in %"** is jargon (share of positive minus negative answers). Explaining it would add content; I left it and ask whether to add a short explanation.
- **Euribor, Bund, CPI:** the series titles stay short; Methodology (ticket 7) will explain them. "(CPI)" was added to the English CPI title because English text uses the abbreviation.
- **Numbers.** Preview build compared with the baseline: all SVG values identical on 197 pages. Two numbers appear in new prose only: "2013" and "100" (price-index definition and index note, "we set 2013 to 100"). No data number changed.
- **Mixed number formats:** none met in this ticket.
