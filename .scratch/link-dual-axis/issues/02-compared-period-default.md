# 02: Open a Link's chart on the compared period, with a switch to the full history

**What to build:** When the Real estate KPI and the Economic indicator of a Link cover different periods (a 13-year index against 50 years of yields), the chart opens on the period both cover, with both axes scaled to it, so the picture matches the coefficient. A two-way switch under the chart, "Compared period (2013 to 2025)" and "Full history (1973 to 2025)", shows the full history: both histories on one x axis, the compared period on a grey band, the parts of the lines outside it lighter. A Link whose two series cover the same period is unchanged and has no switch.

**Blocked by:** 01

**Status:** done

- [x] Different histories: the panel opens on the compared period, x axis and both y axes cut to it; equal histories: plain chart, no switch
- [x] The switch is a radio pair in a fieldset with a legend, labelled with both year ranges, in English and German (German is a draft for review)
- [x] The full-history chart is not in the page: a KPI page is held to 300 KB, so the switch fetches it from `fragments/full/<page>/<panel>/` the first time "Full history" is picked; without script the switch is hidden
- [x] Full history draws the compared period on a grey band, the rest of each line at 40% opacity, and a note says so
- [x] Tests cover the switch, the two views' axes, the fragment and the no-switch case; `vitest`, `tsc`, `astro check` and the preview build pass; checked at 1024 px and 375 px, English and German

## Notes

- Decision (owner, 2026-11-19): compared period first, full history one click away.
- The compared period is the overlap of the two level series. The Link's shift is not applied to it, so for an N-1 comparison the ochre year before the first blue year is not on the compared view; it is on Full history.
- Tried and dropped: a dot on every point of a short series. It pushed the pages over the 300 KB limit.
- The two views were first both on the page; the price index page reached 380 KB, hence the fragment.
