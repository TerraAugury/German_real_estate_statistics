# 14: One Note module

**What to build:** Every chart gets its Notes from `notesFor(series, lang, context)` in `src/lib/notes.ts`. The fixed Note order for KPI charts, compact charts and Link panels lives there and nowhere else. `Series` keeps only the facts behind the Notes, not translated Note text. Output is unchanged.

**Blocked by:** 13

**Status:** done

From the 2026-11-02 architecture review (candidate 2). Spec: `.scratch/cre-site/spec.md`, Section 9.

- [x] `notesFor` takes a context: `kpi` (with the geography label), `compact`, or `link` (with the indicator series and, when the Link is shown, its lag-0 pairs)
- [x] Link panels get their whole Note list from `notesFor`: the KPI's short history, small sample, then each series' stale, fetch failed and revised Notes, named by series. `renderPanel` no longer splices the Small sample Note in by counting lines
- [x] The Small sample threshold moves from `panel.ts` to `notes.ts`
- [x] `Series.notes` is gone; `loadSeries` no longer translates anything
- [x] `kpiNotes`, `notes`, `noteTexts` and `shortNote` are replaced by `notesFor`
- [x] `tests/notes.test.ts` covers all three contexts; the Note tests from `pipeline.test.ts` and `kpi.test.ts` move there
- [x] A preview build (`INCLUDE_PROVISIONAL=1`) is byte-for-byte identical before and after

## Notes

- `notesFor` returns plain text. The Link panel and compact charts now escape each whole Note, where the panel used to escape only the series title and Note text. No Note string contains `& < > "`, so the output is the same.
- A Link panel's revised Note now uses the time it is rendered, not the time the series was loaded. In a build both are the same moment.
