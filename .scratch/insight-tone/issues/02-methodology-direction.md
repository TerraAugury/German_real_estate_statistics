# 02: Methodology: what "better" means

**What to build:** The Methodology page's Insights section explains the tone: the office-investor perspective, that better and worse are an editorial reading of where the latest value sits against its average, and, per Insight, which direction counts as better and why. It says in plain words that a negative number is not worse by itself, and that the tone describes no cause or forecast.

**Blocked by:** 01

**Status:** done

- [x] The Methodology Insights section (English and German) states the perspective and the rule: tone follows the verdict and the declared direction, not the sign
- [x] It lists every Insight with its better direction (or "none") and one reason, and says why G and C carry none; the list is generated from or checked against the declaration, so the two cannot drift apart
- [x] It marks the most contestable directions (J, I) as an editorial judgement
- [x] The legend from ticket 01 links to this section
- [x] No wording implies a cause, forecast or investment advice; copy follows `GLOSSARY.md`
- [x] German is a draft until reviewed (ticket 03)

## Notes

- The Insights section of `content/en/methodology.md` and `content/de/methodology.md` gains a "Better and worse" bullet (perspective, rule, the sign does not decide) and a table of every Insight with its direction and a one-line reason; I and J are marked "Editorial judgement", and G and C read "neither".
- A test reads both Methodology files and checks each Insight's row against its declared `better`, so the page and `manifest/insights.yaml` cannot drift apart.
- The legend above the Insights index is now `renderToneLegend` in `src/lib/panel.ts` and links to the Methodology Insights section (`insights.tone.more`); a test covers the link in both languages.
- A markdown table is new to a prose page, so German words overflowed at 375 px; `main > table` now wraps long words (CSS only). Checked at 375 px in English and German: no horizontal scroll.
- `GLOSSARY.md` Tone now has the German draft "Bewertung": the German Methodology already uses "Einordnung" for the Verdict.
- Checks: `vitest`, `tsc`, `astro check` and the preview build pass. The production build still stops only at the German review gate (ticket 03).
