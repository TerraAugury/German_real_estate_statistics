# 10: Legal pages and About

**What to build:** Terms, Privacy policy, Legal notice (Impressum) and About exist in EN and DE, drafted from the spec outline. Blocked on a human: the owner's private facts file with the real company details (uncommitted, never in the repo). The drafts need lawyer review (launch gate 15) before production.

**Blocked by:** 01, 09

**Status:** needs-info

Spec: `.scratch/cre-site/spec.md`, Section 12 and ticket 13 in `.scratch/cre-site/issues/`.

- [ ] Pages follow the outlines in the spec; English is binding, German is a reviewed translation
- [ ] Terms contain the fixed short-form disclaimer in EN and DE; no other page repeats it
- [ ] Privacy states no cookies, no local storage, no analytics, no third-party requests; GitHub Actions is not mentioned
- [ ] Impressum fields filled from the facts file; address as the owner chose; email in plain text without mailto
- [ ] Build check proves there are no requests to third-party hosts
- [ ] About names the operator and has no promotional content
