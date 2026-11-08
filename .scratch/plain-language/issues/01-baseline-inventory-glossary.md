# 01: Baseline, inventory and glossary

**What to build:** A reference point and a shared vocabulary before any wording changes. A baseline build of the current `work` HEAD lets later tickets prove no number moved. A full inventory shows where every user-facing string lives. A glossary fixes the terms. This ticket ends at the user's OK: no text is edited before that.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

See `spec.md` for the scope, writing rules and decisions.

- [ ] A baseline build of the current `work` HEAD exists outside version control, and the displayed numbers, chart data and SVG values are extracted per page and language; the path and a repeatable extraction command are recorded under Comments
- [ ] The inventory lists every file and component that holds user-facing text in English and German (page copy, interface strings, chart titles, axis labels, tooltips, captions, notes, verdict and tag wording, messages, alt and screen-reader text, inline text in manifests, any hard-coded strings), and assigns each to tickets 2 to 8
- [ ] Texts that also serve as a key or ID are listed and marked "do not change"
- [ ] The glossary (English term, plain-English term, German term) is reported and written into `GLOSSARY.md` as a plain-English column; "main line" and "comparison line" apply only to chart lines
- [ ] The inventory and glossary are reported to the user, and the user has approved them under Comments before this ticket is set to done
- [ ] No user-facing text outside `GLOSSARY.md` has been edited
