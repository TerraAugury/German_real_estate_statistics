# 10: Legal pages and About

**What to build:** Terms, Privacy policy, Legal notice (Impressum) and About exist in EN and DE, drafted from the spec outline. Blocked on a human: the owner's private facts file with the real company details (uncommitted, never in the repo). The drafts need lawyer review (launch gate 15) before production.

**Blocked by:** 01, 09

**Status:** done

Spec: `.scratch/cre-site/spec.md`, Section 12 and ticket 13 in `.scratch/cre-site/issues/`.

- [x] Pages follow the outlines in the spec; English is binding, German is a reviewed translation
- [x] Terms contain the fixed short-form disclaimer in EN and DE; no other page repeats it
- [x] Privacy states no cookies, no local storage, no analytics, no third-party requests; GitHub Actions is not mentioned
- [x] Impressum fields filled from the facts file; address as the owner chose; email in plain text without mailto
- [x] Build check proves there are no requests to third-party hosts
- [x] About names the operator and has no promotional content

## Notes

- Drafted EN and DE: `content/{en,de}/{about,terms,privacy,legal-notice}.md` (the Impressum is `legal-notice.md` in both languages), footer links, `*.title` strings. `tests/legal-pages.test.ts` covers the disclaimer, no GitHub mention, no mailto, and no third-party request in shipped files.
- Facts in: director and person responsible for content (O. Elamine), company name, postcode and city, registration number, VAT, general and privacy email (written `privacy(a)terraaugury.com`; the reviewer should rule on that form).
- German reviewed by the owner on 2026-11-03 (lock and page front matter updated); lawyer review reported fine by the owner (ticket 15). Production build passes the review gate; the licence gates (licence-checks 01) still hold the deploy.
- No phone number: the owner has none to publish, so the Impressum gives the email only. The lawyer review (ticket 15) should rule on that. No `TODO(facts)` remains; a production build still fails while the German is unreviewed.
- Privacy says the language redirect runs in the browser (`navigator.language`), not from the Accept-Language header as spec 12 assumed.
