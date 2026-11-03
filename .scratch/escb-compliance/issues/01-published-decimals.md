# 01: Bundesbank values shown at their published decimals

**What to build:** A series taken directly from the Bundesbank is displayed with the number of decimals the Bundesbank published for it, not the decimals the number formatter picks. The published count is already kept with each snapshot. Series that the site derives (resampled to quarters or years, scaled, summed) keep their current formatting and stay marked as derived. This closes the rounding gap against rule 2 of `docs/bundesbank-data-licensing.md` for original values.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Every place a direct Bundesbank value is shown (headline figure, chart tooltip, table, Series details) uses the published decimals
- [x] A direct Bundesbank series with a published count of 0 shows no decimals, and one with 1 shows one, in both English and German number formats
- [x] A derived series shows no change in formatting
- [x] A snapshot without a published decimals count (DBnomics, Destatis, OECD) shows no change in formatting
- [x] Tests cover an original series, a derived series and a series without the count
