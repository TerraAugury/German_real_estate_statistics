# Licences for core DBnomics sources (Bundesbank BBDZ1/BBDR1, BIS, Destatis, DBnomics)

Researched 2026-11-01 from primary pages. Not legal advice. Items marked **NOT CONFIRMED** could not be verified from a primary source.

## Bottom line

| Source | Public redisplay | Attribution | Commercial use | Confidence |
|---|---|---|---|---|
| Bundesbank (BBDZ1, BBDR1) | Yes for Bundesbank-made statistics, if unaltered and sourced | "Source: Deutsche Bundesbank" | Not excluded for text/statistics ("personal or professional purposes"); ESCB policy says free "irrespective of any subsequent commercial or non-commercial use" | Medium. No dataset-specific licence found. |
| bulwiengesa AG inputs | **NOT CONFIRMED** | NOT CONFIRMED | Site imprint says copies are for "private, nicht kommerziellen Gebrauch" only | Low |
| vdp inputs | **NOT CONFIRMED** | NOT CONFIRMED | NOT CONFIRMED | Low |
| BIS | Statistics: terms page blocked; secondary snippets only. General site content: non-commercial only | "BIS" cited as source | General: non-commercial only. Statistics: unconfirmed | Low-Medium |
| Destatis | Yes | Provider, licence notice + link, dataset URI | Yes | High |
| DBnomics | Aggregation is ODbL; underlying data keeps provider's licence | Not specified | Per provider | High |

Overall "Open source" test for BBDZ1 / BBDR1: **cannot be passed with confidence** until bulwiengesa's (and, for the vdp-based series, vdp's) permission is confirmed. The Bundesbank's own terms are permissive, but its ESCB reuse policy expressly excludes third-party data without the originator's permission.

## 1. Bundesbank (BBDZ1, BBDR1)

**Current terms page.** The DBnomics-listed URL (`.../Redaktion/EN/Dossier/Service/terms_of_use.html?notFirst=true&docId=109018`) returns HTTP 404 (verified with curl). The current page is
https://www.bundesbank.de/en/homepage/user-information/terms-of-use-642972 with sections:
- Conditions for the general use of the website: https://www.bundesbank.de/en/homepage/user-information/conditions-for-the-general-use-of-the-website-764706 (also `?index=2`)
- Terms regarding reuse of ESCB statistics: https://www.bundesbank.de/en/homepage/user-information/terms-of-use-regarding-the-reuse-of-escb-statistics-621188 (also `?index=6`)

**General website terms (4.1/4.2):**
- "Unless otherwise stated, the user rights for the content of this website lie with the Deutsche Bundesbank."
- "You are free to save, forward or reproduce the information produced in physical or electronic form." Allowed for personal or professional purposes; must not be altered; credit "Source: Deutsche Bundesbank."
- Images/videos: no commercial use, editorial/educational/private only. (Not relevant to data series.)
- Some publications come from other copyright owners; their own rules apply.

**ESCB reuse policy (applies to "publicly available ESCB statistics"):**
- "All publicly available ESCB statistics may be reused free of charge on the condition that the source is quoted (e.g. 'Source: ECB statistics.') and that the statistics (including metadata) are not modified."
- "The right of free reuse does not apply to third-party data without a prior permission from the originator."
- Free "irrespective of any subsequent commercial or non-commercial use."
- Revisions may occur; continuity not guaranteed.

**Caveats (not confirmed):**
- No licence name (no CC / dl-de) is attached to the Bundesbank's statistics; the terms above are bespoke.
- The Bundesbank pages do not say whether BBDZ1/BBDR1 count as "ESCB statistics" or as Bundesbank own calculations on third-party data. BBDR1 itself lists bulwiengesa, Destatis and Hypoport series on DBnomics, and Bundesbank methodology credits "Eigene Berechnungen auf Basis von Preisangaben der bulwiengesa AG" and, in the methods report, data from Destatis and vdpResearch GmbH. I could not read the methods report PDF (compressed) so the source note there is only from search-result text.
- The dataset page on DBnomics shows no licence for BBDZ1.

**Suggested attribution:** "Source: Deutsche Bundesbank" (plus, to be safe, "based on data from bulwiengesa AG" as the Bundesbank itself credits).

## 2. Third-party inputs

**bulwiengesa AG.** The only primary text found is the German imprint (https://www.bulwiengesa.de/de/impressum): content is under German copyright; reproduction, editing, distribution and any exploitation beyond copyright limits needs written consent; "Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet." That is about the website, not the Bundesbank-published indices. The English homepage footer mentions terms on reuse/redistribution of bulwiengesa data but I could not read them. **No licence permitting redistribution found. NOT CONFIRMED.** Recommend written confirmation from bulwiengesa or the Bundesbank statistics department.

**Verband deutscher Pfandbriefbanken (vdp).** https://www.pfandbrief.de/impressum/ carries only "© 2026 Verband deutscher Pfandbriefbanken (vdp) e.V." with no reuse terms; no vdp data terms found (Datenschutz/Cookies pages not read). Index is produced by vdpResearch GmbH. **NOT CONFIRMED.** Whether BBDZ1/BBDR1 series actually include vdp data was not verified (only the Bundesbank methods text, via search snippet).

## 3. BIS

Source: https://www.bis.org/terms_conditions.htm (read in full).
- BIS owns copyright in publications and statistical data; "Except as outlined below, all rights are reserved."
- Without permission, users may "download, display, print out, photocopy or redistribute any BIS Material for non-commercial purposes."
- A "limited extract" (not more than 400 words or two tables/graphs and underlying data, max 10% of publication) may be reused free "provided the BIS is cited as the source", **excluding Data Portal statistics**.
- "Users may use the statistics published in the BIS Data Portal in accordance with the terms set out under the heading 'About BIS statistics'."
- Anything else needs written permission via the BIS permission request form.
- Disclaimers: no warranty; no implied endorsement/affiliation when linking.

**Statistics-specific terms could not be read.** `https://www.bis.org/terms_statistics.htm` and `https://www.bis.org/about/legal/permitted-use-statistics` return 403; `bis.org/statistics/about_stats.htm` is 404. Search-engine summaries (secondary, not verified) say: use of BIS statistics is unrestricted provided BIS is cited as source, no implied endorsement, and no extra charge for including them; terms may change at any time. https://www.bis.org/approval_guidelines.htm confirms only that use of statistics under the "Statistics" tab is permitted if it meets the "Terms of permitted use of BIS statistics". **NOT CONFIRMED verbatim; re-check in a browser.**

**Attribution:** cite "BIS" as source (exact wording not confirmed). **Commercial:** general material non-commercial only; statistics terms pending verification.

## 4. Destatis

Primary: https://www.destatis.de/EN/Service/Legal-Notice/CopyrightGENESISOnlineDatabase.html and https://www.destatis.de/EN/Service/OpenData/_node.html (Open Data page also says the Data Licence Germany 2.0 is recognised by the Open Definition council).
- Copyright "© Statistisches Bundesamt (Destatis), 2026"; licence **"Data licence Germany – attribution – version 2.0" (dl-de/by-2-0)**. Answer to (4): yes.
- Licence text: https://www.govdata.de/dl-de/by-2-0 . Commercial and non-commercial use allowed; copy, modify, combine, pass on, embed in products.
- Required source note: provider name; "Data licence Germany – attribution – version 2.0" or "dl-de/by-2-0" with link to the licence; dataset URI (only where the holder supplies them).
- Destatis recommended wording: "Data source: Statistisches Bundesamt (Destatis), Genesis-Online, [retrieval date]; Data licence by-2-0" (link on "Data licence by-2-0"). For own calculations add "own calculation/own representation".
- Modifications must be marked in the source note.
- Exception: basic geodata in map applications follow the atlas imprint's licence notes.
- Note: BBDR1's Destatis house price index series on DBnomics is distributed via the Bundesbank, so check whether the dl-de/by note is carried through.

## 5. DBnomics

Primary: https://docs.db.nomics.world/legal-terms/
- "DBnomics copyright © 2015 – present, Cepremap."
- "Data distributed by DBnomics is subject to the same license and terms of use as its original source provider."
- DBnomics' aggregated datasets are released under the **Open Database License (ODbL)**; the ODbL covers the database as compiled, not the providers' underlying rights.
- Most fetchers are AGPLv3+ (each repo has its own licence on https://git.nomics.world).
- "DBnomics and Cepremap are not responsible for the accuracy or continued availability of the source data."
- Dataset pages for BBDZ1 show no licence field, only the provider and retrieval date.
- Attribution wording for DBnomics itself: not specified in the page read. ODbL requires attribution; credit "DBnomics (Cepremap)" plus the original provider.
- https://db.nomics.world/terms returns 404.

## What to do next
1. Ask the Bundesbank statistics service (and/or bulwiengesa) in writing whether BBDZ1/BBDR1 may be redisplayed publicly, including commercially.
2. Open the BIS statistics terms in a browser and copy the text verbatim.
3. Until then treat Destatis series as safe, Bundesbank own-calculation series as likely-ok with attribution, and bulwiengesa/vdp-derived series as unverified.
