# Bilingual workflow

Label: wayfinder:grilling
Status: resolved
Blocked by: 05 (resolved)

## Question

How are EN and DE labels, KPI and series names, City class names, Not available reasons and explanatory text authored and kept in sync? The canonical KPI names are fixed in the catalogue. Decide where translations live, who reviews them, what happens when a source name changes, and how a missing translation is handled at build time.

## Answer

English is the source language; German is a machine draft at most, and only German a named human has reviewed ships to production. The reviewer is the project owner (the user). The build refuses missing, mismatched or unreviewed translations; the public site never falls back to English.

**Where translations live**
- Series data: the series manifest (ticket 12) holds `title: {en, de}`, the `short_window` sentence key and scope keys. City class names and Not available reasons are keyed enums defined once with EN and DE.
- Interface strings and Notes: `src/i18n/en.yaml` and `de.yaml`, identical key sets. The Note, disclaimer-short-form and Link texts fixed by tickets 06 and 11 are seeded as already reviewed.
- Prose pages (Methodology, About, legal pages): one Markdown file per page per language, e.g. `content/en/methodology.md`, `content/de/methodology.md`. No translation service, no database.
- Placeholders are plain `{name}`; a build check requires the same placeholder set in EN and DE per key. No ICU or plural library (no Note needs plurals).

**Slugs and URLs.** Page slugs are translated (`/en/segments/office`, `/de/segmente/buero`) through one route table mapping page key to slug per language; a missing entry fails the build and the `/en/` and `/de/` page sets must match one-to-one. Selector parameters (`segment`, `geo`, `freq`) and their values are language-neutral English keys, so the switcher passes them through unchanged.

**Formatting.** All formatting goes through `Intl` with the page locale, including chart axes and tooltips. DE `1.234,5` and `3,2 %` (no-break space); EN `1,234.5` and `3.2%`. Periods: "Q1 2026" in both languages, months and years via `Intl`, annual "2026". Dates inside Notes are written out ("1 November 2026" / "1. November 2026").

**Authorship and review**
- English first, German by machine draft plus human review, or written directly by the reviewer.
- Reviewer: the project owner. Review is recorded per file (`reviewed_by`, `reviewed_on`), not per string.
- Methodology and About are EN-first. Impressum, Privacy and Terms are DE-authoritative (German is the legally binding text, English the translation); ticket 13 decides the text itself and follows the same file layout, lock and build rule.
- German terminology is fixed in `GLOSSARY.md` (each term now carries a `DE` line, plus the term Reviewed); translators and UI strings use it, with Städtegruppe for City class.

**Staying in sync.** Interface strings: a committed `de.reviewed.lock` stores a hash of each English string at the time its German was reviewed. Prose pages carry `en_hash` of the English file in the German file's front matter. A mismatch means the German is unreviewed. Reviewing updates the lock or hash and nothing else.

**Build behaviour**
- Always fails: missing key, empty value, placeholder mismatch, missing route-table entry, a manifest entry without both `en` and `de`.
- Production build also fails on unreviewed German (no review record, or hash mismatch).
- Preview builds (`INCLUDE_PROVISIONAL=1`) show unreviewed German with a visible "[DRAFT]" marker.
- No fallback to English ever reaches the public site.

**Source-provided names.** Every title shown is our own manifest title in EN and DE; a DBnomics series or dataset name is never displayed as a label. Publisher names are proper nouns shown the same in both languages (German form where one exists, e.g. "Deutsche Bundesbank"); DBnomics ids stay untranslated. The snapshot stores the DBnomics name; a change logs a warning listing the series for a human to re-check our titles. A change in id, frequency or unit still fails the build (ticket 12).

**Constraints on siblings**
- 13 legal pages: DE-authoritative text, EN translation; same files, review record and build rule; the Terms must contain the DE disclaimer fixed in ticket 11. The build cannot ship legal pages without the owner's recorded review.
- 12 pipeline: the manifest build step must check `title.en`/`title.de`, `short_window` and scope keys, and warn on a changed DBnomics name.
- 08 and 14 are unaffected.
