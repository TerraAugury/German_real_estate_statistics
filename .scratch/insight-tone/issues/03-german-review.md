# 03: German review of the new strings

**What to build:** Every German string added by tickets 01 and 02 is checked by a named human against its English source, and the review lock records it, so the production build's review gate passes.

**Blocked by:** 01, 02

**Status:** ready-for-human

- [ ] The list of new and changed keys, and the changed Methodology prose, is attached under Comments
- [ ] A named reviewer has checked each against its English source, including the better and worse words and the **Tone** term
- [ ] `src/i18n/de.reviewed.lock` is updated through the review script
- [ ] `scripts/check-review.ts` passes
