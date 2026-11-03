# 04: Links overview heatmap

**What to build:** The Links overview shades each cell by the sign and size of its rank correlation on the diverging scale, so strong and weak co-movement scan at a glance. The coefficient is the cell's main text; n sits on a second, smaller line. A legend explains the scale. Cells that are not shown keep the hatched style. The first column stays in view when the table scrolls on a phone. Wording stays on co-movement.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Cell shade is a pure function of rho; a test pins the mapping at -1, 0 and 1 and for a not-shown cell
- [ ] Colour is never the only carrier: the number stays in every shown cell
- [ ] Text on every shade is at least 4.5:1
- [ ] n shows as "n = 12" on its own line; no cell wraps its coefficient at 1024 px
- [ ] The legend says the shade shows direction and size of co-movement, not cause or forecast, in EN and DE
- [ ] At 375 px the KPI column stays visible while the rest scrolls, with no horizontal page scroll
