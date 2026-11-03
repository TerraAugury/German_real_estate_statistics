# 10: Dark mode

**What to build:** The site follows the system colour scheme. In dark mode the page, plates, charts, heatmap, chips and tags are readable with the same meaning (blue data, ochre highlight, diverging scale). There is no toggle and no stored preference. Charts follow the scheme without a rebuild.

**Blocked by:** 02, 03, 04, 05, 06, 07, 08, 09

**Status:** done

- [x] Dark values for every token exist beside the light ones, with the same contrast floors (text 4.5:1, graphics 3:1)
- [x] Chart colours switch with the scheme (CSS custom properties reach the SVG); a test checks no chart hard-codes a light-only hex
- [x] Heatmap, chips, tags, hatched not-available cells and the legend are legible in dark
- [x] Form controls and focus rings follow the scheme (`color-scheme` set)
- [x] The `<meta name="color-scheme">` or equivalent avoids a white flash on load
- [x] Checked in the preview at desktop and 375 px, EN and DE, in both schemes

## Notes

- `src/lib/palette.ts` now holds `LIGHT` and `DARK` token sets; `rootCss()` emits the light `:root` (with `color-scheme: light dark`) and the dark set under `prefers-color-scheme: dark`. `<meta name="color-scheme" content="light dark">` avoids the white flash.
- Charts name their colours as `var(--data)` and so on; Plot writes them as presentation attributes and the browser resolves them, so no rebuild per scheme. Checked in the preview: the chart stroke resolves to the dark `data` colour.
- Heat shades take their own hues (`heat-neg`, `heat-pos`): in dark they are darker than the line colours, so light ink stays at 4.5:1 on a 55% shade. Tests check text (ink, muted, data, ochre text) on page, plate and the two availability tints in both schemes, graphics at 3:1 on the plate, and ink on every heat shade in both.
- Viewed in dark at 1024 px (Home, Links, Availability, KPI page with lag chart, Insights) and at 375 px (German Home with the Menu open). No toggle, no stored preference, no new strings.
