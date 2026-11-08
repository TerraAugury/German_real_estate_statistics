# Follow-up: Insight titles and removal of Insights m, n, o

Requested by the owner after ticket 10.

## Removed for now
Insights `m` (office vacancy and office employment), `n` (office vacancy and new office completions) and `o` (office vacancy and office rent growth) are removed from `manifest/insights.yaml`. Reason: each judges one series only (vacancy change, completions against their average, vacancy against its average); the second series was drawn on a second axis as context, with no calculation between the two. Nine Insights remain: a, f, g, b, d, i, c, j, e.

Kept so they can come back (restore the three blocks from git history of `manifest/insights.yaml`): the i18n keys for their templates, notes and legends (`insight.template.office-employment`, `vacancy-completions`, `vacancy-rents`, `insight.context.legend*`, `insight.small.vacancy-rents.legend`, `insight.note.completions_*`, `rents_scope`, `asking_rents`), the `small`, `context` and dual-axis code in `panel.ts`, and the series `office-employment` (still fetched and tested, now used by no Insight).

Methodology (EN, DE): three bullets and three table rows removed; the "for two Insights" case removed from Big number; Base year now lists two charts; the "sign does not decide" example now uses real construction prices instead of vacancy.

## New titles (EN, DE; one source, so tiles, headings, chart labels and the Methodology table all follow)
| Key | New English title | New German title |
|---|---|---|
| a | Spread of initial yield over the 10-year Bund yield, by City class | Abstand der Anfangsrendite zur Rendite 10-jähriger Bundesanleihen, nach Städtegruppe |
| f | Spread of initial yield over the corporate loan rate | Abstand der Anfangsrendite zum Unternehmenskreditzins |
| g | Ratio of office prices to office rents | Verhältnis der Büropreise zu den Büromieten |
| b | Real growth of office rents | Reales Wachstum der Büromieten |
| d | Spread of office rent growth over construction price growth | Abstand des Büromietwachstums zum Baupreisanstieg |
| i | Spread of real office rent growth over real GDP growth | Abstand des realen Büromietwachstums zum Wachstum des realen BIP |
| c | Ratio of office completions to permits two years earlier | Verhältnis der Büro-Fertigstellungen zu den Baugenehmigungen zwei Jahre zuvor |
| j | Real growth of construction prices | Reales Wachstum der Baupreise |
| e | Spread of office vacancy in the 7 major cities over the 127 towns | Abstand des Büroleerstands in den 7 Großstädten zu den 127 Städten |

## Checks
413 tests before; 409 now (four tests of the removed Insights deleted, two title assertions updated). `tsc` clean. SVG values identical on 195 of 197 pages; the two Insights pages (EN, DE) differ only by the missing m, n, o charts: the first 8218 SVG items are identical.

## Flags
- "Spread" is used in titles while the glossary and prose say "gap"/"Abstand" for the same thing.
- The chart label reads "{title}: {measure} over time", which now repeats the title for a, f, d, i, e (screen readers hear it twice). Not changed.
- German `insight:*.title` and `page:methodology` are unreviewed again; the production build fails the review gate until a human records them.
- GLOSSARY.md Verdict entry still mentions a falling vacancy as an example and "standard deviation".
