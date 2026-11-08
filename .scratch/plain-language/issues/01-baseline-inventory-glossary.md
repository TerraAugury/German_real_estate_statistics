# 01: Baseline, inventory and glossary

**What to build:** A reference point and a shared vocabulary before any wording changes. A baseline build of the current `work` HEAD lets later tickets prove no number moved. A full inventory shows where every user-facing string lives. A glossary fixes the terms. This ticket ends at the user's OK: no text is edited before that.

**Blocked by:** None (can start immediately)

**Status:** done

See `spec.md` for the scope, writing rules and decisions.

- [x] A baseline build of the current `work` HEAD exists outside version control, and the displayed numbers, chart data and SVG values are extracted per page and language; the path and a repeatable extraction command are recorded under Comments
- [x] The inventory lists every file and component that holds user-facing text in English and German (page copy, interface strings, chart titles, axis labels, tooltips, captions, notes, verdict and tag wording, messages, alt and screen-reader text, inline text in manifests, any hard-coded strings), and assigns each to tickets 2 to 8
- [x] Texts that also serve as a key or ID are listed and marked "do not change"
- [x] The glossary (English term, plain-English term, German term) is reported and written into `GLOSSARY.md` as a plain-English column; "main line" and "comparison line" apply only to chart lines
- [x] The inventory and glossary are reported to the user, and the user has approved them under Comments before this ticket is set to done
- [x] No user-facing text outside `GLOSSARY.md` has been edited

## Comments

**Baseline (agent).** Built from `work` HEAD `52903bb` in preview mode (`INCLUDE_PROVISIONAL=1`), 197 pages. Outside version control: `/Users/olivierelamine/Developer/German_real_estate_statistics-baseline/plain-language/` (`dist/`, `numbers.json`, `HEAD.txt`). A rebuild of the same commit gave an identical fingerprint.

Repeat for a later build:

```bash
INCLUDE_PROVISIONAL=1 npx astro build
node .scratch/plain-language/tools/extract-numbers.mjs extract dist /tmp/new-numbers.json
node .scratch/plain-language/tools/extract-numbers.mjs compare /Users/olivierelamine/Developer/German_real_estate_statistics-baseline/plain-language/numbers.json /tmp/new-numbers.json [path-prefix ...]
```

**Inventory and glossary (agent).** See `report/01-inventory.md`, `report/01-key-assignment.tsv` and `report/01-glossary.md`; the glossary is also in `GLOSSARY.md` (a `_Plain_` line per entry and a "Plain-language vocabulary" table). Awaiting the user's approval; this ticket stays `ready-for-agent` until then. Flags needing a decision: the ECB sentence exists (spec decision 8), the Shift full stop is already present, the growth-charts "except" wording, and the About German-only sentence.

**Approval (user).** Inventory and glossary approved. Decisions: Q1 ECB sentence: do not rewrite it; mark the Methodology for review in the report and ticket 8. Q4: delete the German-only "Sie enthält keine Werbung und verkauft nichts." from the German About page. Q2 (Shift full stop) and Q3 (growth charts "except") need an explanation first; open. Q5 to Q7 agreed (Segments, Availability and Sources in ticket 4; verdict words in ticket 2 and sentences in ticket 5; "Verschiebung" for lag; Methodology headings unchanged).
