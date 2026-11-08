# Ticket 6: before and after

Original = `c1e448e`. Numbers, keys and identifiers unchanged.

## Interface strings, English (ticket 6 keys)

| Key | Original | New | Reason |
|---|---|---|---|
| link.scope | National indicator against {geography} | National indicator compared with {geography} | Wording simplified; scope of the comparison unchanged. |
| link.sentence | This shows how two series moved together over {period} (n = {n}). It does not show that one causes the other, and it is not a forecast. | This shows how two series moved together over {period} (n = {n}, the number of periods compared). Rank correlation runs from -1 (opposite ways) to +1 (same way). It does not show that one causes the other, and it is not a forecast. | Added a plain definition of n and of rank correlation (range -1 to +1) from the Methodology text. Caution (not a cause, not a forecast) kept in both languages. |
| link.headline | Rank correlation (Spearman) of changes at lag 0: {rho} (n = {n}) | Rank correlation (Spearman) of changes at shift 0: {rho} (n = {n}) | Terminology: lag became shift (one term in the interface and in Methodology). |
| link.not_shown | Link not shown: too few observations (n = {n}) | Link not shown: too few periods to compare (n = {n}) | observations became periods to compare; same meaning, same n. |
| link.strongest | Strongest of {n} lags tested; chosen after looking at the data, so likely overstated. | Strongest of {n} shifts tested. We chose it after looking at the data, so it is likely overstated. | Split into two sentences; wording of the caution (chosen after looking at the data, likely overstated) unchanged in meaning. |
| link.small_sample | Based on only {n} annual observations. With a sample this small the pattern may be coincidental. | Based on only {n} yearly values. With so little data, the pattern may be coincidental. | observations became yearly values; caution kept (may be coincidental). |
| link.lag.label | Lag in years (positive: indicator moved earlier, negative: later) | Shift in years (positive: indicator moved earlier, negative: later) | Terminology: lag became shift. Sign explanation unchanged: positive means the indicator moved earlier. |
| link.rho.label | Spearman rho | Rank correlation | Spearman rho became Rank correlation (plain term; Spearman named once on Methodology in ticket 7). |
| link.overlay.chart | Levels of {kpi} and {indicator} | Values of {kpi} and {indicator} | Levels became Values (German: Niveau became Werte). |
| link.lags.label | Lag profile of {kpi} and {indicator} | Rank correlation at each shift: {kpi} and {indicator} |  |
| links.intro | Each row is a KPI and each column an economic indicator. A box shows how closely their changes moved together, with the number of pairs (n) it is based on. Where a Link cannot be shown, the box says “Not shown”. Each KPI appears in its main view; click a box to open the full Link on the KPI page. | Each row is a KPI (key figure) and each column an economic indicator (a figure from the wider economy). A box shows how closely their changes moved together. It also shows n, the number of periods compared. Where we cannot show a Link, the box says “Not shown”. Each KPI appears in its main view. Click a box to open the full Link on the KPI page. |  |
| links.legend | Colour: olive green means the two tended to rise and fall together; violet means one tended to rise when the other fell. The deeper the colour, the closer the match. This shows that they move together, not that one causes the other or predicts it. | Colour: olive green means the two tended to rise and fall together. Violet means one tended to rise when the other fell. The deeper the colour, the closer the match. This shows that they move together. It does not show that one causes the other or predicts it. |  |
| indicator.loan-rate-nfc | Loan rate, non-financial corporations, fixation over 5 years | Loan rate, non-financial corporations, rate fixed for over 5 years |  |
| link.preset.mark | pre-set lag | pre-set shift | lag became shift (German: Versatz became Verschiebung, as in the glossary). |
| links.cell.preset | pre-set lag: N-1 | pre-set shift: N-1 | lag became shift (German: Versatz became Verschiebung). |
| links.preset.note | Appraisal-based yields and prices react to interest rates with a delay. For these boxes, one year earlier (N-1) is set in advance on economic grounds, not chosen from the results. | Appraisal-based yields and prices react to interest rates with a delay. For these boxes, we set one year earlier (N-1) in advance, on economic grounds. We did not choose it from the results. |  |
| link.band.legend | Grey band: the range of rank correlation that chance alone often produces at lag 0 for n = {n} (±{band}; each bar uses its own n). A rough guide, not a significance test. | Grey band: the range of rank correlation that chance alone often produces at shift 0 for n = {n} (±{band}; each bar uses its own n). It is a rough guide, not a significance test. | lag became shift; kept the caution that the band is a rough guide, not a significance test. |
| link.band.adjusted | Quarterly changes are each compared with a year earlier, so neighbouring quarters overlap; the band uses an adjusted n = {eff} (n ÷ 4, rounded down). | Quarterly changes are each compared with a year earlier, so neighbouring quarters overlap. The band uses an adjusted n = {eff} (n ÷ 4, rounded down). | Split into shorter sentences; numbers unchanged. |
| note.nominal.inflation | This KPI and this indicator are both in nominal terms, so their link partly reflects shared inflation. | This KPI and this indicator are both nominal, meaning not adjusted for inflation. So their Link partly reflects shared inflation. |  |
| note.nominal.gdp | This KPI is in nominal euros and real GDP is adjusted for inflation, so this link compares nominal with real. | This KPI is in nominal euros (not adjusted for inflation). Real GDP is adjusted for inflation. So this Link compares nominal with real. |  |
| links.nominal.note | * Rents and transaction volume are in nominal euros. Their links to CPI and construction prices partly reflect shared inflation, and their link to real GDP compares nominal with real. | * Nominal euros are not adjusted for inflation. Rents and transaction volume are in nominal euros. Their Links to CPI and construction prices partly reflect shared inflation. Their Link to real GDP compares nominal with real. |  |
| links.rows.note | Rows cover different segments and areas; every indicator is national. | Rows cover different Segments and areas. Every indicator is for Germany as a whole. |  |
| links.cell.preset_other | pre-set lag is N-1 | pre-set shift is N-1 | lag became shift (German: Versatz became Verschiebung). |

## Interface strings, German (ticket 6 keys)

| Key | Original | New | Reason |
|---|---|---|---|
| link.scope | Nationaler Indikator gegen {geography} | Nationaler Indikator im Vergleich zu {geography} | Wording simplified; scope of the comparison unchanged. |
| link.sentence | Dargestellt ist, wie sich zwei Reihen im Zeitraum {period} (n = {n}) gemeinsam entwickelt haben. Das belegt keine Ursache-Wirkungs-Beziehung und ist keine Prognose. | Die Grafik zeigt, wie sich zwei Reihen im Zeitraum {period} gemeinsam entwickelt haben (n = {n}, Zahl der verglichenen Zeiträume). Die Rangkorrelation reicht von -1 (gegenläufig) bis +1 (gleichläufig). Das belegt keine Ursache-Wirkungs-Beziehung und ist keine Prognose. | Added a plain definition of n and of rank correlation (range -1 to +1) from the Methodology text. Caution (not a cause, not a forecast) kept in both languages. |
| link.headline | Rangkorrelation (Spearman) der Veränderungen bei Zeitversatz 0: {rho} (n = {n}) | Rangkorrelation (Spearman) der Veränderungen bei Verschiebung 0: {rho} (n = {n}) | Terminology: lag became shift (one term in the interface and in Methodology). |
| link.not_shown | Verknüpfung nicht angezeigt: zu wenige Beobachtungen (n = {n}) | Verknüpfung nicht angezeigt: zu wenige Zeiträume zum Vergleich (n = {n}) | observations became periods to compare; same meaning, same n. |
| link.strongest | Stärkster von {n} getesteten Zeitversätzen; nach Ansicht der Daten ausgewählt, daher wahrscheinlich überschätzt. | Stärkste von {n} getesteten Verschiebungen. Wir haben sie nach einem Blick auf die Daten ausgewählt, daher ist sie wahrscheinlich überschätzt. | Split into two sentences; wording of the caution (chosen after looking at the data, likely overstated) unchanged in meaning. |
| link.small_sample | Auf nur {n} Jahresbeobachtungen beruhend. Bei so kleiner Stichprobe kann das Muster zufällig sein. | Beruht auf nur {n} Jahreswerten. Bei so wenigen Daten kann das Muster zufällig sein. | observations became yearly values; caution kept (may be coincidental). |
| link.lag.label | Zeitversatz in Jahren (positiv: Indikator lief voraus, negativ: lief nach) | Verschiebung in Jahren (positiv: Indikator lief voraus, negativ: lief nach) | Terminology: lag became shift. Sign explanation unchanged: positive means the indicator moved earlier. |
| link.rho.label | Spearman-Rho | Rangkorrelation | Spearman rho became Rank correlation (plain term; Spearman named once on Methodology in ticket 7). |
| link.overlay.chart | Niveau: {kpi} und {indicator} | Werte: {kpi} und {indicator} | Levels became Values (German: Niveau became Werte). |
| link.lags.label | Zeitversatzprofil von {kpi} und {indicator} | Rangkorrelation bei jeder Verschiebung: {kpi} und {indicator} |  |
| links.intro | Jede Zeile ist eine Kennzahl, jede Spalte ein Wirtschaftsindikator. Ein Feld zeigt, wie eng sich ihre Veränderungen gemeinsam bewegt haben, dazu die Zahl der Paare (n), auf denen es beruht. Wo die Verknüpfung nicht angezeigt werden kann, steht im Feld „Nicht angezeigt“. Jede Kennzahl erscheint in ihrer Hauptansicht; ein Klick auf ein Feld öffnet die vollständige Verknüpfung auf der Kennzahlseite. | Jede Zeile ist eine Kennzahl, jede Spalte ein Wirtschaftsindikator (eine Größe aus der Gesamtwirtschaft). Ein Feld zeigt, wie eng sich ihre Veränderungen gemeinsam bewegt haben. Dazu steht n, die Zahl der verglichenen Zeiträume. Wo wir die Verknüpfung nicht anzeigen können, steht im Feld „Nicht angezeigt“. Jede Kennzahl erscheint in ihrer Hauptansicht. Ein Klick auf ein Feld öffnet die vollständige Verknüpfung auf der Kennzahlseite. |  |
| links.legend | Farbe: olivgrün bedeutet, dass beide eher gemeinsam stiegen und fielen; violett bedeutet, dass die eine eher stieg, wenn die andere fiel. Je dunkler die Farbe, desto enger der Zusammenhang. Das zeigt, dass sie sich gemeinsam bewegen, nicht, dass eine die andere verursacht oder vorhersagt. | Farbe: olivgrün bedeutet, dass beide eher gemeinsam stiegen und fielen. Bei violett stieg die eine eher, wenn die andere fiel. Je dunkler die Farbe, desto enger der Zusammenhang. Das zeigt, dass sie sich gemeinsam bewegen. Es zeigt nicht, dass eine die andere verursacht oder vorhersagt. |  |
| link.preset.mark | vorab gewählter Versatz | vorab gewählte Verschiebung | lag became shift (German: Versatz became Verschiebung, as in the glossary). |
| links.lag.label | Zeitversatz des Indikators | Verschiebung des Indikators | German: Versatz became Verschiebung. |
| links.cell.preset | vorab gewählter Versatz: N-1 | vorab gewählte Verschiebung: N-1 | lag became shift (German: Versatz became Verschiebung). |
| links.preset.note | Auf Bewertungen beruhende Renditen und Preise reagieren mit Verzögerung auf Zinsen. Für diese Felder ist ein Jahr früher (N-1) aus ökonomischen Gründen im Voraus festgelegt und nicht anhand der Ergebnisse gewählt. | Renditen und Preise, die auf Bewertungen beruhen, reagieren mit Verzögerung auf Zinsen. Für diese Felder legen wir ein Jahr früher (N-1) im Voraus aus ökonomischen Gründen fest. Wir haben es nicht anhand der Ergebnisse gewählt. |  |
| link.band.legend | Graues Band: der Bereich der Rangkorrelation, den allein der Zufall bei Versatz 0 und n = {n} häufig erzeugt (±{band}; jeder Balken verwendet sein eigenes n). Eine grobe Orientierung, kein Signifikanztest. | Graues Band: der Bereich der Rangkorrelation, den allein der Zufall bei Verschiebung 0 und n = {n} häufig erzeugt (±{band}; jeder Balken verwendet sein eigenes n). Es ist eine grobe Orientierung, kein Signifikanztest. | lag became shift; kept the caution that the band is a rough guide, not a significance test. |
| link.band.adjusted | Quartalsveränderungen werden jeweils mit dem Vorjahr verglichen, benachbarte Quartale überlappen also; das Band verwendet ein angepasstes n = {eff} (n ÷ 4, abgerundet). | Quartalsveränderungen werden jeweils mit dem Vorjahr verglichen, benachbarte Quartale überlappen also. Das Band verwendet ein angepasstes n = {eff} (n ÷ 4, abgerundet). | Split into shorter sentences; numbers unchanged. |
| links.chance.note | Bei so vielen Vergleichen sehen einige Felder allein durch Zufall stark aus. Ein einzelnes starkes Feld sollte man mit Vorsicht behandeln, besonders wenn n klein ist. | Bei so vielen Vergleichen sehen einige Felder allein durch Zufall stark aus. Behandeln Sie ein einzelnes starkes Feld mit Vorsicht, besonders wenn n klein ist. | German addressed with Sie as elsewhere on the site. |
| note.nominal.inflation | Diese Kennzahl und dieser Indikator sind beide nominal, daher spiegelt ihre Verknüpfung teilweise gemeinsame Inflation wider. | Diese Kennzahl und dieser Indikator sind beide nominal, also nicht um die Inflation bereinigt. Daher spiegelt ihre Verknüpfung teilweise gemeinsame Inflation wider. |  |
| note.nominal.gdp | Diese Kennzahl ist in nominalen Euro, das reale BIP ist inflationsbereinigt; die Verknüpfung stellt daher Nominal gegen real. | Diese Kennzahl ist in nominalen Euro (nicht um die Inflation bereinigt). Das reale BIP ist inflationsbereinigt. Die Verknüpfung stellt daher Nominal gegen real. |  |
| links.nominal.note | * Mieten und Transaktionsvolumen sind in nominalen Euro. Ihre Verknüpfungen mit dem Verbraucherpreisindex und den Baupreisen spiegeln teilweise gemeinsame Inflation wider, und ihre Verknüpfung mit dem realen BIP stellt Nominal gegen real. | * Nominale Euro sind nicht um die Inflation bereinigt. Mieten und Transaktionsvolumen sind in nominalen Euro. Ihre Verknüpfungen mit dem Verbraucherpreisindex und den Baupreisen spiegeln teilweise gemeinsame Inflation wider. Ihre Verknüpfung mit dem realen BIP stellt Nominal gegen real. |  |
| links.rows.note | Die Zeilen decken unterschiedliche Segmente und Gebiete ab; jeder Indikator ist bundesweit. | Die Zeilen decken unterschiedliche Segmente und Gebiete ab. Jeder Indikator gilt für ganz Deutschland. |  |
| links.cell.preset_other | vorab gewählter Versatz ist N-1 | vorab gewählte Verschiebung ist N-1 | lag became shift (German: Versatz became Verschiebung). |

## Coverage: strings left alone

- `link.title`: already plain, kept (EN and DE)
- `link.period`: already plain, kept (EN and DE)
- `link.not_shown.constant`: already plain, kept (EN and DE)
- `link.strongest.mark`: already plain, kept (EN and DE)
- `link.overlay.legend`: already plain, kept (EN and DE)
- `links.heading`: already plain, kept (EN and DE)
- `links.cell.n`: already plain, kept (EN and DE)
- `links.scale.neg`: already plain, kept (EN and DE)
- `links.scale.zero`: already plain, kept (EN and DE)
- `links.scale.pos`: already plain, kept (EN and DE)
- `links.cell.not_shown`: already plain, kept (EN and DE)
- `indicator.bund-yield-10y`: already plain, kept (EN and DE)
- `indicator.euribor-3m`: already plain, kept (EN and DE)
- `indicator.cpi`: already plain, kept (EN and DE)
- `indicator.gdp-real`: already plain, kept (EN and DE)
- `indicator.unemployment-rate`: already plain, kept (EN and DE)
- `indicator.construction-price`: already plain, kept (EN and DE)
- `indicator.oecd-confidence`: already plain, kept (EN and DE)
- `links.lag.label`: already plain, kept (EN and DE; German changed only)
- `links.lag.0`: already plain, kept (EN and DE)
- `links.lag.1`: already plain, kept (EN and DE)
- `links.lag.2`: already plain, kept (EN and DE)
- `links.cell.noise`: already plain, kept (EN and DE)
- `links.noise.legend`: already plain, kept (EN and DE)
- `links.chance.note`: already plain, kept (EN and DE; German changed only)
- `links.nominal.tag`: already plain, kept (EN and DE)
- `links.row.kpi-price-index`: already plain, kept (EN and DE)
- `links.row.kpi-rent-index`: already plain, kept (EN and DE)
- `links.row.kpi-initial-yield`: already plain, kept (EN and DE)
- `links.row.kpi-office-vacancy`: already plain, kept (EN and DE)
- `links.row.kpi-transaction-volume`: already plain, kept (EN and DE)
- `links.row.construction`: already plain, kept (EN and DE)
- `links.cell.preset_2`: already plain, kept (EN and DE)

German changed, English kept: `links.lag.label`, `links.chance.note`

## Flags (not changed)

1. **Lag / shift:** English used "lag" in the interface and "shift" in Methodology; German used Zeitversatz, Versatz and Verschiebung. Both languages now say shift / Verschiebung. Methodology still quotes "pre-set lag" in places; ticket 7 changes it to "pre-set shift".
2. **Number tokens added in prose:** the Link panel sentence now says "-1" and "+1" (range of rank correlation, already stated on Methodology). The number check lists these as added text tokens; SVG values are identical on all 197 pages.
3. **Indicator name vs series title:** DE `indicator.loan-rate-nfc` says "Unternehmen" while the series title says "Kapitalgesellschaften". Left as is.
4. **"Appraisal-based"** in indicator names is jargon and is not explained on the Links page. Left as is.
5. **Methodology still quotes** the old lag selector and "Link not shown" wording in places: ticket 7 copies the new text.
