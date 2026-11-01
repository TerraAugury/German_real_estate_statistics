# Map: German commercial real estate statistics site

Label: wayfinder:map

## Destination

A spec, ready to hand off for building, for a bilingual (EN/DE) website that shows German commercial real estate KPIs (office, retail, logistics, commercial overall; national and city level) from open sources, and links them to economic indicators. Reaching the end means no decision remains open before building starts.

## Notes

- Domain language is in `GLOSSARY.md`: Real estate KPI, Economic indicator, Link, Segment, Open source. Use these terms exactly.
- Audience: investors, analysts, journalists, academics.
- Source rule: only Open sources (free, documented API, licence allowing public redisplay). DBnomics first; each KPI or indicator DBnomics cannot supply gets its own second-source decision. Never silently mix sources: every chart names its source and licence.
- Listed property company share prices were of interest but failed the Open source test (see Decisions so far); they are out of scope.
- Geography: national plus city level was the aim. DBnomics has no named-city CRE series, only city classes (7 major cities, 120/127 towns, supra-regional cities) and Länder for construction. How to treat city level is decided in the KPI catalogue ticket.
- Link method: overlays plus correlation and lead/lag, computed at build time and always labelled as co-movement. No forecasting or regression models.
- Languages: English and German from the start.
- Stack already chosen (not re-opened here): Astro static site, build-time fetch from the DBnomics API, Observable Plot or ECharts, scheduled rebuild, Cloudflare Pages.
- Tracker is local markdown: tickets in `issues/`, `Type:` and `Status:` and `Blocked by:` lines per `docs/agents/issue-tracker.md`.

## Decisions so far

<!-- one line per resolved ticket: [title](issues/file.md): gist -->

- [DBnomics inventory: German commercial real estate KPIs](issues/01-dbnomics-cre-inventory.md): CRE KPIs come from the Bundesbank (BBDZ1, BBDR1), BIS and Destatis; no named-city series; logistics, retail yield and non-office vacancy are gaps; licences unverified.
- [Open second sources for CRE KPIs DBnomics cannot supply](issues/04-second-sources-for-cre-gaps.md): none closes a gap; Bundesbank direct is the same data, Destatis GENESIS needs credentials, Eurostat adds only permits by building type; named-city, logistics, retail yield and non-office vacancy are unavailable from an Open source.
- [DBnomics inventory: economic indicators relevant to German CRE](issues/02-dbnomics-economic-indicators.md): rates, inflation, GDP, unemployment, lending and construction prices exist; ifo is absent (EC and OECD surveys substitute); Eurostat mirror is stale; short CRE histories make Links fragile; licences mostly unverified.
- [Licences for the core DBnomics CRE sources](issues/07-licences-for-core-sources.md): Destatis passes (dl-de/by-2-0); Bundesbank CRE series unconfirmed because bulwiengesa and vdp redistribution terms are unknown; BIS statistics terms unread.
- [Deutsche Börse and listed property company share prices](issues/03-deutsche-boerse-share-prices.md): no source passes the Open source test, so share prices are out of scope.

## Not yet specified

- Site information architecture: which pages and views exist (segment pages, city pages, a Link explorer?) and how they navigate. Waits on the KPI catalogue and indicator set.
- Bilingual workflow: how EN/DE labels, series names and explanatory text are authored and kept in sync. Waits on the KPI catalogue.
- Data pipeline: refresh cadence per source, caching so public APIs are not hammered, handling revisions and gaps, source attribution and licence display. Waits on source research.
- Trust and framing: disclaimers (not investment advice), how data gaps and short histories are shown to avoid misleading Links. Waits on the Link method.
- Spec assembly: the final spec document that is the destination. Waits on everything above.

## Out of scope

- Residential real estate (house price index, rents, mortgages as a market): a later effort. Macro indicators like mortgage rates stay in scope only as Economic indicators linked to CRE KPIs.
- Hotel and other segments beyond office, retail, logistics and commercial overall: later release.
- Forecasting and regression models: Links are descriptive only.
- Sources that fail the Open source test: excluded, not scraped or worked around.
- Listed property company share prices: no Deutsche Börse API or alternative passes the Open source test ([ticket](issues/03-deutsche-boerse-share-prices.md)). Reopens only on written confirmation from Deutsche Börse.
