# 07: Methodology: data and Links sections

**What to build:** Every part of the Methodology page except the Insights section reads in plain English and plain German: sources, data handling, series, and how Links are computed. "Standard deviation" becomes "usual spread" with the technical term kept once in brackets. The English and German pages say the same thing.

**Blocked by:** 2, 4, 6

**Status:** ready-for-agent

See `spec.md` for the scope, writing rules and decisions. Formulas may stay as written, and the 20-word limit does not apply to formulas and lists. Use the terms ticket 2, 4 and 6 settled.

- [ ] Every Methodology string outside the Insights section is reviewed in English and German; numbers, years, thresholds, decimal rules and formulas are unchanged
- [ ] The writing and German rules from the spec are applied, each technical term is explained once on the page, glossary terms are used consistently, and every warning is still in place
- [ ] A report in `.scratch/plain-language/report/` has one table per page and language (original text, new text, reason only where the meaning could shift), plus a coverage list of passages left alone
- [ ] Existing English/German differences found here are flagged in the report, and both sides are rewritten to the English meaning; English that looks wrong or unclear is left and flagged
- [ ] Tests that assert wording are updated to the new text, with no change to logic, numbers or thresholds, and `vitest` passes
- [ ] Numbers extracted from a preview build match the baseline for the page
- [ ] The commit sets `**Status:** done` and ticks every criterion met
