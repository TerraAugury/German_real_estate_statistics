# 02: Terms of use stated on every Bundesbank series, as data and on the page

**What to build:** Each direct Bundesbank series carries the terms it is reused under (ESCB Terms of Use for the Reuse of Statistics, with their address) in its snapshot source metadata, and its Series details say that the original statistics and metadata are used unmodified under those terms. A derived series says instead that it is derived from Deutsche Bundesbank data. This closes the rule 1 gaps in `docs/bundesbank-data-licensing.md` section 9 ("Gaps remaining"). The wording "unmodified" depends on ticket 01.

**Blocked by:** 01

**Status:** done

- [x] Source metadata of a direct Bundesbank series includes the terms name and address, written on every fetch
- [x] Existing Bundesbank snapshots receive the field on the next fetch even when their values are unchanged
- [x] Series details of an original Bundesbank series state the terms and "original statistics and metadata used unmodified", in English and German
- [x] Series details of a derived Bundesbank series state "Derived from Deutsche Bundesbank data" and do not claim to be unmodified
- [x] New German strings are marked unreviewed under the existing bilingual workflow
- [x] Series from other sources (Destatis, DBnomics, OECD) show no Bundesbank terms line
- [x] Tests cover the snapshot field, the original wording and the derived wording
