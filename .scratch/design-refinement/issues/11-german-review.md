# 11: German review of the new strings

**What to build:** Every German string added by tickets 02 to 09 is checked by a named human against its English source, and the review lock records it, so the production build's review gate passes.

**Blocked by:** 02, 03, 04, 05, 06, 07, 08, 09

**Status:** done

- [x] The list of new and changed keys is attached under Comments
- [x] A named reviewer has checked each against its English source
- [x] `src/i18n/de.reviewed.lock` is updated through the review script
- [x] `scripts/check-review.ts` passes

## Comments

Written by the implementing agent on 2026-11-03, after tickets 02 to 10. These 14 strings are new in this effort; their German is a draft and shows `[DRAFT]` in preview builds.

| Key | English | German draft |
|---|---|---|
| `nav.menu` | Menu | Menü |
| `nav.logistics` | Logistics: not available, see Availability | Logistik: nicht verfügbar, siehe Verfügbarkeit |
| `source.cite` | Source: {publisher} / Licence: {licence} / Data to {period} | Quelle: {publisher} / Lizenz: {licence} / Daten bis {period} |
| `source.details` | Series details | Angaben zur Reihe |
| `source.detail.dbnomics` | {publisher}, DBnomics series {id} | {publisher}, DBnomics-Reihe {id} |
| `source.detail.direct` | {publisher}, {service}, series {id} / New data last retrieved {retrieved} | {publisher}, {service}, Reihe {id} / Letzte neue Daten abgerufen am {retrieved} |
| `source.chip.provisional` | Provisional | Vorläufig |
| `home.hero.more` | Open this Insight | Diesen Einblick öffnen |
| `home.spark.label` | Trend of {title} | Verlauf von {title} |
| `latest.change.pct` | {change} on {period} | {change} gegenüber {period} |
| `latest.change.diff` | {change} points on {period} | {change} Punkte gegenüber {period} |
| `latest.unchanged` | No change on {period} | Keine Änderung gegenüber {period} |
| `links.cell.n` | n = {n} | n = {n} |
| `links.legend` | Shade: ochre where the changes moved in the same direction, blue where they moved in opposite directions; the deeper the shade, the larger the coefficient. It shows co-movement only, not a cause or a forecast. | Schattierung: ocker, wo sich die Veränderungen in dieselbe Richtung bewegt haben, blau, wo in entgegengesetzte Richtungen; je dunkler, desto größer der Koeffizient. Sie zeigt nur Gleichlauf, keine Ursache und keine Prognose. |

Notes for the reviewer:

- `latest.change.*` take a signed number, for example "+5.2%" / "+5,2 %", and a period such as "2024" or "Q4 2025". "points" means percentage points; the German draft uses "Punkte", as the Insight readings already do.
- `source.chip.provisional` is the glossary term "Provisional" (DE "Vorläufig").
- `links.legend` must describe co-movement only, never cause or forecast (GLOSSARY.md, Link).
- Record the review with `npx tsx scripts/review.ts "<your name>" <key> ...` (a prefix such as `source.*` works). The production build still fails the review gate on many older unreviewed items beyond these 14 (the 67 noted in insights-build ticket 11, plus manifest text and the Methodology page), so this ticket alone does not make a production build pass.

- 2026-11-03: reviewed by terra augury, covering the full list of 123 unreviewed items (these 14 keys, the older interface strings, manifest text, Insight titles and measures, and the Methodology page). Recorded with `scripts/review.ts`; `scripts/check-review.ts` passes.
