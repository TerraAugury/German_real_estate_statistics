# Site information architecture

Label: wayfinder:grilling
Status: resolved
Blocked by: 05 (resolved), 06 (resolved)

## Question

Which pages and views does the site have, and how do they navigate? Start from the release-one catalogue: Segment pages, City class views, a Land view for construction, a Not available matrix, and a Link explorer once the indicator set is known. Decide page set, navigation, and where source, licence and "provisional" notices appear on each view.

## Answer

Release one is a flat, bilingual, static site of 18 pages per language. Segment pages are hubs, KPI pages are the canonical view, Links live on KPI pages, and no live view carries a "provisional" notice.

**Page set (per language)**
- Home: one-paragraph purpose, six KPI cards (national headline chart, latest value and period), Segment entry points.
- Segment pages (3): Office, Retail, Commercial overall. One compact national chart per KPI in catalogue order, each linking to its KPI page; Not available KPIs appear as greyed placeholders "Not available: no Open source for [reason]". **Logistics has no Segment page**: its Construction series (warehouse buildings) is on the Construction KPI page, and the gap is stated on Availability.
- KPI pages (6): the canonical, citable view. Full chart, selectors for Segment, geography (Germany, the four City classes where the KPI has them, the 16 Länder for construction only) and frequency, all reflected in the URL; source line; one Link panel per Economic indicator (eight), including "Link not shown: too few observations" panels. No separate City class or Land pages, no map.
- Links overview (1): table of all KPI x indicator pairs showing lag-0 co-movement or the not-shown state; each cell deep-links to the KPI page. It repeats no full charts.
- Availability (1): the full KPI x Segment grid with the reason for every Not available cell; linked from the footer and from every Segment page.
- Methodology (1): Link method and the eight Economic indicators.
- Sources & licences (1): one row per series: publisher, DBnomics series id, licence, attribution.
- About (1).
- Legal (3): Terms and conditions, Privacy policy, Impressum (required under German law, DDG section 5). Footer on every page, both languages.

**Navigation.** Header: Home, Segments (dropdown of three), KPIs (dropdown of six), Links, Availability, Methodology, language switch. Footer: Sources & licences, About, Terms, Privacy, Impressum. Breadcrumbs on Segment and KPI pages.

**Language (navigation only).** URLs carry a prefix `/en/` and `/de/`; `/` redirects by browser language; the switcher goes to the same page in the other language and keeps the selector parameters. The page set is identical in both languages. Slug translation and the translation workflow are left to ticket 10.

**Notices**
- **Source and licence line** under every chart on every page, inside the chart container so a screenshot keeps it: "Source: [publisher], DBnomics series [id] / Licence: [name] / Data to [last period]". The series id links to the series on DBnomics and the licence to Sources & licences. Link charts list both series. Link charts also carry the ticket 06 co-movement sentence under the chart.
- **Provisional:** no badge or banner on any live view. Launch is gated on ticket 08; a build-time `provisional` flag keeps flagged series (and Links built on them) out of the public build until then.
- **Refusal under 08:** not decided here. If it happens, it is decided then (likely Not available with a licence reason).
- **No cookies, no analytics** in release one, so no consent banner; the Privacy policy covers server logs and Cloudflare.
- **No data download, CSV or embeds** in release one; each chart links to its DBnomics series. Revisit when 08 gives the Bundesbank terms.

**Constraints on siblings**
- 10 bilingual workflow: must translate the page set above, including legal pages and Not available reasons; slugs are open.
- 11 trust and framing: the not-investment-advice disclaimer, gap and short-history wording, and stale-data wording are placed by 11; this ticket fixes only the source line and the Link sentence.
- 12 data pipeline: needs per-series metadata (publisher, series id, licence, last period) to build the source line and Sources & licences, and the `provisional` build flag. It must also build the Links overview table.
- 08: no live view shows the provisional state, so launch waits on it.
- New ticket 13 covers the legal page content.
