# 04: KPI pages

**What to build:** The KPI pages read in plain English and plain German: definitions, notes, scope and short-window sentences, and any page text that is not shared wording from ticket 2. Where "KPI" means the category, it stays and is explained once per page.

**Blocked by:** 1

**Status:** done

See `spec.md` for the scope, writing rules and decisions. Run tickets 2 to 6 one at a time: they share the interface-string files. Attribution lines in the series manifest are fixed credit lines and stay as they are.

- [x] Every KPI page string assigned to this ticket in the inventory is reviewed in English and German; keys, IDs and identifiers are unchanged
- [x] The writing and German rules from the spec are applied, glossary terms are used consistently, and every warning is still in place
- [x] A report in `.scratch/plain-language/report/` has one table per page and language (original text, new text, reason only where the meaning could shift), plus a one-line-per-key coverage list of strings left alone
- [x] Existing English/German differences found here are flagged in the report, and both sides are rewritten to the English meaning; English that looks wrong or unclear is left and flagged
- [x] Tests that assert wording are updated to the new text, with no change to logic, numbers or thresholds, and `vitest` passes
- [x] Numbers extracted from a preview build match the baseline for the pages touched
- [x] The commit sets `**Status:** done` and ticks every criterion met

## Comments

Done. Report: `report/04-kpi-pages.md`. SVG values identical to the baseline on all 197 preview pages; the only text-number additions are "2013" and "100" in new explanatory prose. `vitest` 413 pass, `tsc` clean.
