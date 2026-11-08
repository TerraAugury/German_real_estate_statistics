# 08: Methodology: Insights section and known fixes

**What to build:** The Insights section of the Methodology page reads in plain English and plain German, and carries the known fixes that apply: growth charts say the big number is the gap between the two lines "except for real office rents"; the vacancy and employment paragraph makes clear that section J and sections K to N are the two employment groups added together; the Shift paragraph ends with a full stop. The English and German versions say the same thing.

**Blocked by:** 2, 5, 7

**Status:** done

See `spec.md` for the scope, writing rules and decisions. The ECB bond-buying sentence does not exist in the repo: report "sentence not found" and write nothing new. Formulas may stay as written. Use the terms ticket 5 settled.

- [x] Every string in the Insights section of Methodology is reviewed in English and German; numbers, years, thresholds, decimal rules and formulas are unchanged
- [x] Growth charts carry "except for real office rents" in English and the matching German
- [x] The vacancy and employment paragraph states that the two employment groups (section J and sections K to N) are added together, not vacancy and employment, in English and German
- [x] The Shift paragraph ends with a full stop in English and German
- [x] The report states that the ECB sentence exists (it was found), was not rewritten per the user's decision and is marked to be reviewed (replaces: sentence not found, spec decision 8 was wrong)
- [x] The writing and German rules from the spec are applied, each technical term is explained once on the page, glossary terms are used consistently, and every warning is still in place
- [x] A report in `.scratch/plain-language/report/` has one table per page and language (original text, new text, reason only where the meaning could shift), plus a coverage list of passages left alone
- [x] Existing English/German differences found here are flagged in the report, and both sides are rewritten to the English meaning; English that looks wrong or unclear is left and flagged
- [x] Tests that assert wording are updated to the new text, with no change to logic, numbers or thresholds, and `vitest` passes
- [x] Numbers extracted from a preview build match the baseline for the page
- [x] The commit sets `**Status:** done` and ticks every criterion met

## Comments

Report: `report/08-methodology-insights.md`. Q2 (full stop already present) and Q3 (both real office rents and real construction costs named) applied as agreed. 413 tests pass; `tsc` clean; SVG values identical on 197 pages. German stays an unreviewed draft.
