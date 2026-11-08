# 02: Shared interface wording

**What to build:** The wording that every page reuses is plain in English and German: navigation, footer, buttons, tags, verdict and tone words, "Insight not shown" and other messages, tooltips, chart titles and axis labels, captions, and alt and screen-reader text. This sets the vocabulary the later tickets follow.

**Blocked by:** 1

**Status:** ready-for-agent

See `spec.md` for the scope, writing rules and decisions. Run tickets 2 to 6 one at a time: they share the interface-string files.

- [ ] Every shared user-facing string assigned to this ticket in the inventory is reviewed in English and German; keys, IDs and identifiers are unchanged
- [ ] The writing and German rules from the spec are applied, glossary terms are used consistently, and every warning (not a cause, not a forecast, our own reading, rough stand-in) is still in place
- [ ] A report in `.scratch/plain-language/report/` has one table per page and language (original text, new text, reason only where the meaning could shift), plus a one-line-per-key coverage list of strings left alone
- [ ] Existing English/German differences found here are flagged in the report, and both sides are rewritten to the English meaning; English that looks wrong or unclear is left and flagged
- [ ] Tests that assert wording are updated to the new text, with no change to logic, numbers or thresholds, and `vitest` passes
- [ ] Numbers extracted from a preview build match the baseline for the pages touched
- [ ] The commit sets `**Status:** done` and ticks every criterion met
