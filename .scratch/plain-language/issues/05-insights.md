# 05: Insights

**What to build:** The Insights index and every Insight page read in plain English and plain German: titles, measures, definitions, verdicts, tone wording, notes, captions and chart labels. "Reference series" becomes "comparison line" and "KPI" becomes "main line" where the text means a chart line.

**Blocked by:** 1

**Status:** done

See `spec.md` for the scope, writing rules and decisions. Run tickets 2 to 6 one at a time: they share the interface-string files. The Insights manifest holds inline English and German text; edit only the text, never the keys, series roles, thresholds or headline settings.

- [x] Every Insight string assigned to this ticket in the inventory is reviewed in English and German; keys, IDs and identifiers are unchanged
- [x] The writing and German rules from the spec are applied, glossary terms are used consistently, and every warning (including the verdict and tone cautions) is still in place
- [x] A report in `.scratch/plain-language/report/` has one table per page and language (original text, new text, reason only where the meaning could shift), plus a one-line-per-key coverage list of strings left alone
- [x] Existing English/German differences found here are flagged in the report, and both sides are rewritten to the English meaning; English that looks wrong or unclear is left and flagged
- [x] Tests that assert wording are updated to the new text, with no change to logic, numbers or thresholds, and `vitest` passes
- [x] Numbers extracted from a preview build match the baseline for the pages touched
- [x] The commit sets `**Status:** done` and ticks every criterion met

## Comments

Done. Report: `report/05-insights.md`. SVG values identical to the baseline on all 197 preview pages; new text numbers are listed in the report. `vitest` 413 pass (one slow test timed out once under heavy machine load and passed on rerun), `tsc` clean. German unreviewed until ticket 10.
