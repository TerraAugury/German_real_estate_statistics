# 06: Links

**What to build:** The Links overview, the matrix and each Link panel read in plain English and plain German: intro, scale labels, band legend, lag wording, hidden and screen-reader text, and notes. The "co-movement, not cause or forecast" caution stays visible.

**Blocked by:** 1

**Status:** done

See `spec.md` for the scope, writing rules and decisions. Run tickets 2 to 6 one at a time: they share the interface-string files. Keep "Lag" and "Verschiebung" consistent with the glossary.

- [x] Every Links string assigned to this ticket in the inventory is reviewed in English and German; keys, IDs and identifiers are unchanged
- [x] The writing and German rules from the spec are applied, glossary terms are used consistently, and every warning is still in place
- [x] A report in `.scratch/plain-language/report/` has one table per page and language (original text, new text, reason only where the meaning could shift), plus a one-line-per-key coverage list of strings left alone
- [x] Existing English/German differences found here are flagged in the report, and both sides are rewritten to the English meaning; English that looks wrong or unclear is left and flagged
- [x] Tests that assert wording are updated to the new text, with no change to logic, numbers or thresholds, and `vitest` passes
- [x] Numbers extracted from a preview build match the baseline for the pages touched
- [x] The commit sets `**Status:** done` and ticks every criterion met

## Comments

Report: `report/06-links.md`. 25 keys changed in each language. 413 tests pass; `tsc` clean; SVG values identical on 197 pages; added text numbers are only "-1"/"+1" in the Link panel sentence. German stays an unreviewed draft.
