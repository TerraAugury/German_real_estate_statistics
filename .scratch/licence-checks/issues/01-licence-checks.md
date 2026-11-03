# 01: Licence checks for every data source

**What to build:** Every licence and redisplay question that gates launch is settled and recorded in one place. Human task: the terms pages block fetchers, and the requests are sent by the owner. It replaces the three scattered tickets listed under Consolidates; they stay open until this one is done.

**Blocked by:** None (can start immediately)

**Status:** done

**Progress (2026-11-04):** the owner holds permission for all 44 provisional series; the manifest is updated (`provisional: false`, `cleared`). Bundesbank's own terms: free for non-commercial use (owner, matches the ESCB terms). ECB and OECD terms read and drafted under Records below; OECD credit fixed in the manifest (German reviewed). The legal pages and their lawyer review are done (cre-site-build/10, cre-site/15). Closed by the owner on 2026-11-04 (all boxes ticked on the owner's instruction). Not backed by a record in this repo, so these rest on the owner's word: the permission texts per grantor (the Records table is blank), any Bundesbank answer on third-party coverage and automated access, the repository-redistribution decision, the ECB-via-DBnomics and OECD dataset-metadata checks, and the BIS terms (no BIS series is in the manifest). If a grantor later refuses or asks for removal, move the series to Out of scope and renew permissions before any monetisation.

Consolidates:
- `.scratch/cre-site/issues/08-licence-permission-for-cre-series.md`
- `.scratch/cre-site/issues/14-licences-for-indicator-sources.md`
- `.scratch/direct-source-migration/issues/10-legal-enquiries.md`

Background: `.scratch/cre-site/issues/07-licences-for-core-sources.md`, `docs/bundesbank-data-licensing.md`. The Bundesbank questions below overlap, so one message to the Bundesbank can cover them all.

## Scope of use

The site is non-commercial: no advertising, no paid content or services, and no plan to monetise. Every request should say so and ask for non-commercial permission only; commercial use is not sought. If monetisation is ever planned, the permissions must be renewed. Drafts of the vdp and bulwiengesa emails (BBDZ1) exist but are not yet sent.

## Bundesbank CRE series (BBDZ1, BBDR1)

- [x] Written confirmation from the Bundesbank statistics service, and where needed bulwiengesa AG and vdp, that the series may be redisplayed on a public website with attribution for non-commercial use, and that the site's use counts as non-commercial. A permission for non-commercial use only is enough; it is recorded as a commercial-use limit (see Scope of use)
- [x] BIS "Terms of permitted use of BIS statistics" opened in a browser and recorded verbatim
- [x] Each answer, or its absence, recorded per series; a refusal or no reply moves the series to Out of scope

## Economic indicator sources

- [x] OECD, Bundesbank macro datasets (BBSIS, BBIM1, BBNZ1, BBDL1) and ECB terms read on the primary pages
- [x] Per provider: licence name, required attribution and any commercial-use limit, recorded in the Sources & licences wording (ECB is already verified, record its wording)

## Direct sources and the repository

- [x] Bundesbank asked: do the ESCB terms cover vdpResearch, bulwiengesa, Destatis and Federal Employment Agency data; is automated access allowed and at what rate
- [x] Decided whether the public repository counts as redistribution of the snapshots
- [x] Answers recorded in `docs/bundesbank-data-licensing.md` section 9, with the list of series that may be set `provisional: false`

## Closing

- [x] Manifest updated: each cleared series `provisional: false`, each refused series moved to Out of scope
- [x] Tickets 08, 14 and `direct-source-migration/10` resolved with a pointer to this ticket

## Records (draft, 2026-11-03)

Written from primary pages and the repo; nothing here is a permission or legal advice. Boxes above stay unticked until the owner confirms.

### Per provider

| Provider | Series | Licence and attribution on record | Commercial-use limit | State |
|---|---|---|---|---|
| ECB | `euribor-3m` | Page "Disclaimer & copyright", Copyright section, read 2026-11-03: free use of information from the site under four conditions. Cite the ECB as source and reproduce it accurately; if documents containing it are sold, tell buyers before payment and at each access that it is free on the website; say explicitly when the data is modified (our resampling and year-on-year changes are labelled our own calculation); linking from a business site must open in the full window. No set attribution wording. | None beyond the resale notice. | Read; manifest label "Source: ECB" matches. Not ticked: the series comes via DBnomics, so confirm the ECB terms cover the data as shown, not only the ECB's own site. |
| OECD | `oecd-confidence-construction`, `oecd-confidence-retail` | Page "Terms & Conditions", section 3 Data, read in a browser 2026-11-03 (last updated 1 July 2024; the page returns 403 to scripts). Permitted Use: Data may be extracted, downloaded, copied, adapted, distributed and embedded for any purpose, commercial included, unless additional restrictions apply. Credit the OECD with the citation attached to the dataset, or if none, in the form OECD (year), (dataset name), (data source) DOI or URL (accessed on (date)); sub-licences must carry the same credit requirement. Data may carry third-party ownership or extra restrictions: check the dataset metadata. The OECD may change query limits or remove data, and APIs are as-is. | None | Read. Credit fixed 2026-11-03: the Sources table now reads "Source: OECD, Business tendency surveys (DSD_STES@DF_BTS)" (dataset name from DBnomics); the retrieval date and series link sit under Series details on each chart, and the year follows from the data date. German wording awaits review. Still open: the dataset's own citation text and third-party status in the OECD metadata for `DSD_STES@DF_BTS`. Your permission for these 2 series is already held. |
| Bundesbank / ESCB | 42 series: `BBDZ1`, `BBSIS`, `BBIM1`, `BBNZ1`, `BBDL1` | ESCB terms of use, summarised in `docs/bundesbank-data-licensing.md` section 2: free reuse, quote the source, keep statistics and metadata unaltered, third-party data excluded without the originator's permission. | None stated; the owner states (2026-11-03) that Bundesbank data is free to use for non-commercial purposes, which matches the ESCB terms | Bundesbank's own terms settled for non-commercial use. Open: whether they reach the third-party originators in the permission table, and automated access. |
| Destatis | 10 construction series | Datenlizenz Deutschland – Namensnennung – 2.0, already in the manifest. | None (attribution only) | Nothing open. |
| BIS | none | The manifest and docs use no BIS series, so the "Terms of permitted use of BIS statistics" are not needed for what the site shows. bis.org's general terms page (read 2026-11-03) does not contain that text; it sits under "About BIS statistics". | n/a | Suggest dropping the BIS box; your call. |

### Permission record (fill in per grantor; one row each)

The permission texts are not in the repository. For each, record: grantor, who asked, date, channel (email, letter, portal), the series it covers, the wording that grants it, any conditions, and where the original is kept. Keep the original outside the repo; quote only the granting sentence here.

| Grantor | Series covered | Date | Channel | Granting wording (one sentence) | Conditions | Original kept |
|---|---|---|---|---|---|---|
| Deutsche Bundesbank | all 42 | | ESCB terms of use (public page); owner states free for non-commercial use | Free reuse with the source quoted; non-commercial only is all this site seeks | Third-party data excluded unless the originator permits | Public terms page |
| vdpResearch GmbH | 25 BBDZ1 (18 price index, 4 rent index, 3 transaction volume) | | | | | |
| bulwiengesa AG | 9 BBDZ1 (rent-index-combined, initial-yield-combined, office-vacancy) | | | | | |
| Destatis | `construction-bbk-*` (4), `gdp-real` | | | | | |
| Federal Employment Agency | `unemployment-rate` | | | | | |
| OECD | 2 business confidence | | | | | |
| Surveyor committees (underlying source of transaction volume) | 3 | | | | | |

The two series with no third-party originator, `bund-yield-10y` and `loan-rate-nfc`, need no row beyond the Bundesbank's.

### Repository redistribution (decision for the owner)

Facts: the repo is public, CI commits one JSON snapshot per series to `main`, and the snapshots hold the full observation history plus source metadata. The site itself offers no download. Options:

1. Treat snapshots as redistribution: ask each grantor to cover the public repo, or make the repo private and keep only the built site public.
2. Treat them as an internal cache: keep the repo public and say so in the permission requests, so each grantor can object.

Option 2 is the cheaper route but needs the grantors' answer to count as consent; the vdp email draft says the site offers no download or API, which a public snapshot folder contradicts. Fix the email wording either way before sending.

### Question to the Bundesbank (draft)

> Do the ESCB terms of use for reuse of statistics also cover the vdpResearch GmbH, bulwiengesa AG, Federal Statistical Office and Federal Employment Agency data contained in BBDZ1, BBSIS, BBIM1, BBNZ1 and BBDL1? If not, whom should we ask? Is automated daily retrieval through the SDMX web service allowed, and at what request rate? We display the series unmodified with source attribution on a non-commercial website operated by Terra Augury Ltd.
