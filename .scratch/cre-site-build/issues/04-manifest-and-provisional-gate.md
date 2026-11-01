# 04: Full series manifest, provisional gate and Sources & licences

**What to build:** Every series in the spec has a manifest entry, flagged `provisional` where the licence is unconfirmed, and the public build excludes flagged series and their Links. A Sources & licences page lists one row per live series.

**Blocked by:** 01

**Status:** done

Spec: `.scratch/cre-site/spec.md`, Sections 3, 4, 5 and 11.

- [x] Hand-written manifest covers all CRE series (BBDZ1, Destatis) and all Economic indicator series with the ids and start dates in the spec
- [x] `provisional: true` set for the BBDZ1 CRE series, the four Bundesbank macro series and OECD confidence; ECB and Destatis not flagged
- [x] Default build removes provisional series and every Link using them; `INCLUDE_PROVISIONAL=1` includes them for preview builds
- [x] Sources & licences page: publisher, DBnomics series id, licence, attribution per series, in both languages
- [x] Open items resolved or listed: remaining Destatis `FLC002` series for other building types and their start dates

## Notes

- 54 manifest entries; ids and start years validated against live DBnomics snapshots (2026-11-01).
- Open, listed: (1) other Destatis `FLC002` building types beyond office, commercial, warehouse are not in the manifest; the spec names only these three. (2) Bundesbank and OECD licence names and URLs are placeholders until tickets 08 and 14. (3) Units for `gdp-real` ("index") and the BBDZ1 vacancy/yield series are unverified against DBnomics metadata. (4) OECD retail start (1985) matches the live API; the spec gave no start for it. (5) Bundesbank `G650` and `Q.` construction variants: only annual ids in the manifest.
