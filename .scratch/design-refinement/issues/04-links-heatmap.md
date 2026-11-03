# 04: Links overview heatmap

**What to build:** The Links overview shades each cell by the sign and size of its rank correlation on the diverging scale, so strong and weak co-movement scan at a glance. The coefficient is the cell's main text; n sits on a second, smaller line. A legend explains the scale. Cells that are not shown keep the hatched style. The first column stays in view when the table scrolls on a phone. Wording stays on co-movement.

**Blocked by:** 01

**Status:** done

- [x] Cell shade is a pure function of rho; a test pins the mapping at -1, 0 and 1 and for a not-shown cell
- [x] Colour is never the only carrier: the number stays in every shown cell
- [x] Text on every shade is at least 4.5:1
- [x] n shows as "n = 12" on its own line; no cell wraps its coefficient at 1024 px
- [x] The legend says the shade shows direction and size of co-movement, not cause or forecast, in EN and DE
- [x] At 375 px the KPI column stays visible while the rest scrolls, with no horizontal page scroll

## Notes

- `heat(rho)` (src/lib/heat.ts) gives the side and the share of hue (cap `HEAT_MAX` 55%, in the palette module and as `--heat-max`); the page model puts it on each shown cell. CSS paints it with `color-mix` over the plate. A test checks ink is at least 4.5:1 on every shade from -1 to 1.
- Anchors inside shaded cells are ink, not link blue (blue on the deepest blue shade is 3.2:1).
- A not-shown cell was plain white before; it now takes the hatched Not available style, as the ticket assumed it already had.
- `links.cell.shown` became `links.cell.n` ("n = 12") with the coefficient on its own line; `links.legend` is new. DE is a draft until ticket 11.
- The Links table has class `matrix`; its first column is sticky. Checked at 1024 px (no wrapped coefficient) and 375 px (no page scroll, first column stays).
