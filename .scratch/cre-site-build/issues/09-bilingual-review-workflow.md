# 09: Bilingual review workflow

**What to build:** German can only reach production after a named human has reviewed it, and a change in English flags the German as unreviewed.

**Blocked by:** 01

**Status:** ready-for-agent

Spec: `.scratch/cre-site/spec.md`, Section 10.

- [ ] `de.reviewed.lock` stores a hash of each English string at review time; prose pages carry `en_hash` in the German front matter; a mismatch means unreviewed
- [ ] Review recorded per file (`reviewed_by`, `reviewed_on`)
- [ ] Production build fails on unreviewed German; preview builds show it with a visible "[DRAFT]" marker
- [ ] No English fallback ever reaches the public site
- [ ] Manifest titles need both `en` and `de`; a changed DBnomics series name logs a warning, a changed id, frequency or unit fails the build
