# 10: German review of the rewritten text

**What to build:** Every German string and page changed by tickets 2 to 9 is checked by a named human against the new English, and the review is recorded, so the production build's review gate passes.

**Blocked by:** 9

**Status:** ready-for-human

An agent cannot do this: it never records a review. The German is a draft and shows `[DRAFT]` in preview builds until then.

- [ ] The list of changed interface keys, inline Insight texts and German pages is attached under Comments
- [ ] A named reviewer has checked each against its English source, including the einfache Sprache wording, the Sie form and the glossary terms
- [ ] The review lock and the German page front matter are updated through the review script
- [ ] The review check passes and a production build passes the review gate
