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
- [Release-one KPI catalogue](issues/05-release-one-kpi-catalogue.md): six KPIs (price index, rent index, initial yield, office vacancy, transaction volume index, construction) at national and City class level, Länder for construction; real gaps shown as Not available; named cities dropped; Bundesbank series provisional.
- [Economic indicator set and Link method](issues/06-economic-indicator-set-and-link-method.md): eight indicators (Bund yield, Euribor, corporate loan rate, CPI, GDP, unemployment, DESTATIS construction prices, OECD confidence); every pair with enough data gets a Link at native KPI frequency; Spearman on year-on-year changes, lag +-8 quarters / +-3 years, minimum 40 quarterly / 20 annual pairs, lag 0 headline, "Co-movement" wording with a fixed no-causation sentence under every chart.
- [Site information architecture](issues/09-site-information-architecture.md): flat site of Home, 3 Segment pages (no Logistics page), 6 KPI pages holding the Links, Links overview, Availability, Methodology, Sources & licences, About and three legal pages; /en and /de prefixes; source line under every chart; no live provisional notice, launch gated on 08; no cookies, analytics or downloads.
- [Data pipeline](issues/12-data-pipeline.md): daily cron fetches DBnomics into committed snapshots (`indexed_at` change check), falls back to the last snapshot on failure, validates a series manifest, records stale/revised, computes tested Links and deploys; `provisional` means licence unconfirmed and gates the production deploy with 08 and 14; ids re-verified; transaction volume index gets no Link (17 changes).
- [Trust and framing](issues/11-trust-and-framing.md): disclaimer only in the Terms; all other trust wording is one-line Notes in the chart container (scope, short history, stale, fetch failed, revised) with fixed EN/DE text; stale thresholds unchanged; three distinct empty states.
- [Bilingual workflow](issues/10-bilingual-workflow.md): EN source, German machine-drafted at most and reviewed by the owner before production; strings in `src/i18n/*.yaml`, manifest, per-language Markdown; translated slugs via one route table; `Intl` formatting; hash lock detects stale German; build fails on missing/unreviewed German, no English fallback on the public site; source names never displayed, a change only warns.
- [Legal pages content and operator identity](issues/13-legal-pages-content.md): Provider is Terra Augury Ltd (Cyprus), GDPR controller, Terms under Cypriot law; English binding (reverses ticket 10 for legal pages), Impressum shown as "Legal notice" in EN; Impressum address is postcode and city only (accepted risk for the reviewer); Privacy and Terms outlines fixed, no third-party requests build rule; real details from a private facts file; lawyer review gates deploy (new ticket).

- [Destination spec](spec.md): build-ready specification assembled from all resolved tickets; launch gated on open tickets 08, 14 and 15; unresolved gaps listed under its Open questions.

## Not yet specified

Nothing. Open human tasks 08, 14 and 15 gate the production deploy, not the spec.

## Out of scope

- Residential real estate (house price index, rents, mortgages as a market): a later effort. Macro indicators like mortgage rates stay in scope only as Economic indicators linked to CRE KPIs.
- Hotel and other segments beyond office, retail, logistics and commercial overall: later release.
- Forecasting and regression models: Links are descriptive only.
- Sources that fail the Open source test: excluded, not scraped or worked around.
- Named-city series: no Open source supplies them, so release one shows City classes only ([ticket](issues/05-release-one-kpi-catalogue.md)). Reopens only if an Open source for named cities appears.
- Listed property company share prices: no Deutsche Börse API or alternative passes the Open source test ([ticket](issues/03-deutsche-boerse-share-prices.md)). Reopens only on written confirmation from Deutsche Börse.
