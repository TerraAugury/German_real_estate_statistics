# 08: Methodology: Insights section and known fixes

**What to build:** The Insights section of the Methodology page reads in plain English and plain German, and carries the known fixes that apply: growth charts say the big number is the gap between the two lines "except for real office rents"; the vacancy and employment paragraph makes clear that section J and sections K to N are the two employment groups added together; the Shift paragraph ends with a full stop. The English and German versions say the same thing.

**Blocked by:** 2, 5, 7

**Status:** ready-for-agent

See `spec.md` for the scope, writing rules and decisions. The ECB bond-buying sentence does not exist in the repo: report "sentence not found" and write nothing new. Formulas may stay as written. Use the terms ticket 5 settled.

- [ ] Every string in the Insights section of Methodology is reviewed in English and German; numbers, years, thresholds, decimal rules and formulas are unchanged
- [ ] Growth charts carry "except for real office rents" in English and the matching German
- [ ] The vacancy and employment paragraph states that the two employment groups (section J and sections K to N) are added together, not vacancy and employment, in English and German
- [ ] The Shift paragraph ends with a full stop in English and German
- [ ] The report states that the ECB sentence was not found and nothing was written for it
- [ ] The writing and German rules from the spec are applied, each technical term is explained once on the page, glossary terms are used consistently, and every warning is still in place
- [ ] A report in `.scratch/plain-language/report/` has one table per page and language (original text, new text, reason only where the meaning could shift), plus a coverage list of passages left alone
- [ ] Existing English/German differences found here are flagged in the report, and both sides are rewritten to the English meaning; English that looks wrong or unclear is left and flagged
- [ ] Tests that assert wording are updated to the new text, with no change to logic, numbers or thresholds, and `vitest` passes
- [ ] Numbers extracted from a preview build match the baseline for the page
- [ ] The commit sets `**Status:** done` and ticks every criterion met
