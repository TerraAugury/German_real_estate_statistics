# Ticket 5: before and after

Original = `d857317`. Numbers, keys and identifiers unchanged.

## Interface strings, English (ticket 5 keys)

| Key | Original | New | Reason |
|---|---|---|---|
| insights.intro | Each Insight puts several series on one axis over a stated period, with a fixed one-line reading. It describes what the lines show; it does not show a cause and is not a forecast. | Each Insight puts several series on one axis over a period we state. It comes with a fixed one-line reading. The reading describes what the lines show. It does not show a cause, and it is not a forecast. Gaps between two percentages are given in percentage points: from 4% to 5% is 1 percentage point. | Adds the one-sentence explanation of percentage points (allowed: explaining a technical term). The digits 4, 5 and 1 are only that example. |
| insights.tone.legend | A light green plate reads better and a light pink plate worse, for an investor in office property. A plain plate is in line with the average, or neither side is better. Screen readers also get the words “better” and “worse”. | A light green background means better and a light pink background means worse, for an investor in office property. A plain background means in line with the average, or neither side is better. Screen readers also read out the words “better” and “worse”. | "plate" became "background". Caution kept: our own reading, for an investor in office property; screen readers still get "better" and "worse". |
| insights.empty | No Insights are published yet; the licences for their data are being confirmed. | No Insights are published yet. We are still confirming the licences for their data. | Passive "are being confirmed" became "We are still confirming". |
| insight.template.spread | The latest {measure} is {latest} points, {verdict} the {from}-{to} average of {mean} points. | The latest {measure} is {latest} percentage points. This is {verdict} the {from}-{to} average of {mean} percentage points. | Split into two sentences. "points" became "percentage points" (the unit the tile already shows). Numbers and verdict unchanged. |
| insight.multiples.label | {kpi} and {reference}, rebased | {kpi} and {reference}, set to 100 in the base year | "rebased" became "set to 100 in the base year" (glossary). |
| insight.note.price_yield_coverage | Prices and rents are vdp series covering offices across Germany. The initial yields elsewhere on this site are bulwiengesa series for office and retail core properties in the 7 major cities, so they are not directly comparable. | Prices and rents are vdp series for offices across Germany. The initial yields elsewhere on this site are bulwiengesa series for office and retail core properties in the 7 major cities. So they are not directly comparable. | Split into three sentences. The caution (not directly comparable) stays. |
| insight.multiples.base_note | Both series set to {year} = 100; the size of the gap depends on this choice. | We set both series to {year} = 100. The size of the gap depends on this choice. |  |
| insight.axis.growth | year-on-year change, % | change from the year before, % |  |
| insight.multiples.label_growth | {kpi} and {reference}, year-on-year change | {kpi} and {reference}, change from the year before |  |
| insight.multiples.legend_growth | Blue line: year-on-year change of {kpi}. Ochre line: year-on-year change of {reference}. The shading is blue where the blue line is above the ochre line and red where it is below; the gap between the lines in the latest year is the headline number. | Blue line: change of {kpi} from the year before. Ochre line: change of {reference} from the year before. The shading is blue where the blue line is above the ochre line and red where it is below. The gap between the lines in the latest year is the big number. | "year-on-year change" became "change from the year before"; "headline number" became "big number" (glossary). |
| insight.multiples.legend_growth_real | Blue line: year-on-year change of {kpi}, adjusted for consumer prices. Ochre line: year-on-year change of {reference}. The shading is blue where the blue line is above the ochre line and red where it is below; the gap between the lines in the latest year is the headline number. | Blue line: change of {kpi} from the year before, adjusted for consumer prices. Ochre line: change of {reference} from the year before. The shading is blue where the blue line is above the ochre line and red where it is below. The gap between the lines in the latest year is the big number. | As above. |
| insight.multiples.legend_growth_rate | Blue line: year-on-year change of {kpi}. Ochre line: year-on-year change of {reference}. The shading is blue where the blue line is above the ochre line and red where it is below. | Blue line: change of {kpi} from the year before. Ochre line: change of {reference} from the year before. The shading is blue where the blue line is above the ochre line and red where it is below. |  |
| insight.template.real-construction | Real construction prices changed by {latest}% in {to}, {verdict} the {from}-{to} average of {mean}%. | Real construction prices changed by {latest}% in {to}. This is {verdict} the {from}-{to} average of {mean}%. | Split into two sentences; verdict and numbers unchanged. |
| insight.index.legend | Blue line: the construction price index divided by the consumer price index, both set to {year} = 100 and compounded year by year. The dashed line marks 100, the level in {year}. | Blue line: the construction price index divided by the consumer price index. Both are set to {year} = 100 and compounded year by year (each year's change builds on the year before). The dashed line marks 100, the level in {year}. | Adds a short explanation of "compounded". |
| insight.index.base_note | Index set to {year} = 100; the level depends on this choice. | We set the index to {year} = 100. The level depends on this choice. |  |
| insight.note.index_scope | Construction prices are for office buildings; CPI is for a household basket. | Construction prices are for office buildings. CPI (the consumer price index) is for a basket of goods that households buy. | Explains CPI in brackets and says what the basket is. Meaning unchanged. |
| insight.template.completions-permits | Completions were {latest} times the permits issued two years earlier, {verdict} the {from}-{to} average of {mean}. | Completions were {latest} times the permits issued two years earlier. This is {verdict} the {from}-{to} average of {mean}. | Split into two sentences; verdict and numbers unchanged. |
| insight.template.price-rent | The price index stands at {latest} times the rent index, {verdict} the {from}-{to} average of {mean}. | The price index stands at {latest} times the rent index. This is {verdict} the {from}-{to} average of {mean}. | Split into two sentences; verdict and numbers unchanged. |
| insight.template.real-rents | Real office rents changed by {latest}% in {to}, {verdict} the {from}-{to} average of {mean}%. | Real office rents changed by {latest}% in {to}. This is {verdict} the {from}-{to} average of {mean}%. | Split into two sentences; verdict and numbers unchanged. |
| insight.template.office-employment | Office vacancy changed by {latest} points in {to} while office employment grew {emp}%; the {from}-{to} average vacancy change is {mean} points. | Office vacancy changed by {latest} percentage points in {to}, while office employment grew {emp}%. The {from}-{to} average vacancy change is {mean} percentage points. | Split into two sentences; "points" became "percentage points". |
| insight.context.legend | Blue line: {measure}, in percentage points. Ochre line: year-on-year growth of {title}, in percent. Both are drawn on one axis. | Blue line: {measure}, in percentage points. Ochre line: growth of {title} from the year before, in percent. Both use one axis. |  |
| insight.template.vacancy-completions | Office completions in {to} differed by {latest}% from their {from}-{to} average, so they are {verdict} the average. | Office completions in {to} differed by {latest}% from their {from}-{to} average. They are {verdict} the average. | Split into two sentences; verdict and numbers unchanged. |
| insight.template.vacancy-rents | Office vacancy in {to} differed by {latest} points from its {from}-{to} average, {verdict} the average. | Office vacancy in {to} differed by {latest} percentage points from its {from}-{to} average. It is {verdict} the average. | Split into two sentences; "points" became "percentage points". |
| insight.axis.real_growth | real year-on-year change, % | real change from the year before, % |  |
| insight.small.vacancy-rents.legend | Blue line, left axis: {kpi}, in %. Ochre line, right axis: year-on-year change of the rent index, adjusted for consumer prices, in percent. The axes have different units, so the lines are not compared by height. | Blue line, left axis: {kpi}, in %. Ochre line, right axis: change of the rent index from the year before, adjusted for consumer prices, in percent. The axes have different units, so the lines are not compared by height. |  |
| insight.note.asking_rents | The rent index measures asking rents for new lettings. It does not capture incentives such as rent-free months, so the rents tenants actually pay may be weaker than shown. | The rent index measures asking rents (the rents landlords ask for) on new lettings. It does not include incentives such as rent-free months. So the rents tenants actually pay may be lower than shown. | Explains "asking rents"; "capture" became "include"; "weaker" became "lower". The caution (actual rents may be lower than shown) stays. |
| insight.context.legend_dual | Blue line, right axis: {measure}, in percentage points. Ochre line, left axis: year-on-year growth of {title}, in percent. The axes have different units, so the lines are not compared by height. | Blue line, right axis: {measure}, in percentage points. Ochre line, left axis: growth of {title} from the year before, in percent. The axes have different units, so the lines are not compared by height. |  |

## Interface strings, German (ticket 5 keys)

| Key | Original | New | Reason |
|---|---|---|---|
| insights.intro | Ein Einblick stellt mehrere Reihen über einen genannten Zeitraum auf einer Achse dar, mit einer festen Lesehilfe in einem Satz. Er beschreibt, was die Linien zeigen; er belegt keine Ursache und ist keine Prognose. | Ein Einblick zeigt mehrere Reihen über einen genannten Zeitraum auf einer Achse. Dazu gibt es eine feste Lesehilfe in einem Satz. Sie beschreibt, was die Linien zeigen. Sie belegt keine Ursache und ist keine Prognose. Abstände zwischen zwei Prozentwerten stehen in Prozentpunkten: von 4 % auf 5 % ist 1 Prozentpunkt. | Adds the one-sentence explanation of percentage points (allowed: explaining a technical term). The digits 4, 5 and 1 are only that example. |
| insights.tone.legend | Hellgrün heißt: für Anleger in Büroimmobilien besser; hellrosa: schlechter. Eine ungefärbte Fläche liegt im Einklang mit dem Durchschnitt, oder keine Seite ist besser. Screenreader erhalten zusätzlich die Wörter „besser“ und „schlechter“. | Hellgrün heißt: besser für Anleger in Büroimmobilien. Hellrosa heißt: schlechter. Eine Fläche ohne Farbe heißt: im Einklang mit dem Durchschnitt, oder keine Seite ist besser. Screenreader lesen zusätzlich die Wörter „besser“ und „schlechter“ vor. | "plate" became "background". Caution kept: our own reading, for an investor in office property; screen readers still get "better" and "worse". |
| insights.empty | Noch sind keine Einblicke veröffentlicht; die Lizenzen für die zugrunde liegenden Daten werden geklärt. | Noch sind keine Einblicke veröffentlicht. Wir klären noch die Lizenzen für die zugrunde liegenden Daten. | Passive "are being confirmed" became "We are still confirming". |
| insight.template.spread | Der aktuelle {measure} beträgt {latest} Punkte, {verdict} {from}-{to}-Durchschnitt von {mean} Punkten. | Der aktuelle {measure} beträgt {latest} Prozentpunkte. Das ist {verdict} {from}-{to}-Durchschnitt von {mean} Prozentpunkten. | Split into two sentences. "points" became "percentage points" (the unit the tile already shows). Numbers and verdict unchanged. |
| insight.multiples.label | {kpi} und {reference}, umbasiert | {kpi} und {reference}, im Basisjahr auf 100 gesetzt | "rebased" became "set to 100 in the base year" (glossary). |
| insight.note.price_yield_coverage | Preise und Mieten sind vdp-Reihen für Büros in ganz Deutschland. Die Anfangsrenditen an anderer Stelle dieser Seite sind bulwiengesa-Reihen für Core-Immobilien (Büro und Einzelhandel zusammen) in den 7 Großstädten und daher nicht direkt vergleichbar. | Preise und Mieten sind vdp-Reihen für Büros in ganz Deutschland. Die Anfangsrenditen an anderer Stelle dieser Seite sind bulwiengesa-Reihen für Core-Immobilien (Büro und Einzelhandel zusammen) in den 7 Großstädten. Sie sind daher nicht direkt vergleichbar. | Split into three sentences. The caution (not directly comparable) stays. |
| insight.multiples.base_note | Beide Reihen auf {year} = 100 gesetzt; die Größe des Abstands hängt von dieser Wahl ab. | Wir setzen beide Reihen auf {year} = 100. Die Größe des Abstands hängt von dieser Wahl ab. |  |
| insight.multiples.legend_growth | Blaue Linie: Veränderung von {kpi} gegenüber dem Vorjahr. Ockerfarbene Linie: Veränderung von {reference} gegenüber dem Vorjahr. Die Schattierung ist blau, wo die blaue Linie über der ockerfarbenen liegt, und rot, wo sie darunter liegt; der Abstand der Linien im letzten Jahr ist die große Zahl. | Blaue Linie: Veränderung von {kpi} gegenüber dem Vorjahr. Ockerfarbene Linie: Veränderung von {reference} gegenüber dem Vorjahr. Die Schattierung ist blau, wo die blaue Linie über der ockerfarbenen liegt, und rot, wo sie darunter liegt. Der Abstand der Linien im letzten Jahr ist die große Zahl. | "year-on-year change" became "change from the year before"; "headline number" became "big number" (glossary). |
| insight.multiples.legend_growth_real | Blaue Linie: preisbereinigte Veränderung von {kpi} gegenüber dem Vorjahr. Ockerfarbene Linie: Veränderung von {reference} gegenüber dem Vorjahr. Die Schattierung ist blau, wo die blaue Linie über der ockerfarbenen liegt, und rot, wo sie darunter liegt; der Abstand der Linien im letzten Jahr ist die große Zahl. | Blaue Linie: preisbereinigte Veränderung von {kpi} gegenüber dem Vorjahr. Ockerfarbene Linie: Veränderung von {reference} gegenüber dem Vorjahr. Die Schattierung ist blau, wo die blaue Linie über der ockerfarbenen liegt, und rot, wo sie darunter liegt. Der Abstand der Linien im letzten Jahr ist die große Zahl. | As above. |
| insight.template.real-construction | Die realen Baupreise haben sich {to} um {latest} % verändert, {verdict} {from}-{to}-Durchschnitt von {mean} %. | Die realen Baupreise haben sich {to} um {latest} % verändert. Das ist {verdict} {from}-{to}-Durchschnitt von {mean} %. | Split into two sentences; verdict and numbers unchanged. |
| insight.index.legend | Blaue Linie: der Baupreisindex geteilt durch den Verbraucherpreisindex, beide auf {year} = 100 gesetzt und Jahr für Jahr aufgezinst. Die gestrichelte Linie markiert 100, den Stand von {year}. | Blaue Linie: der Baupreisindex geteilt durch den Verbraucherpreisindex. Beide sind auf {year} = 100 gesetzt und Jahr für Jahr aufgezinst (die Veränderung jedes Jahres baut auf dem Vorjahr auf). Die gestrichelte Linie markiert 100, den Stand von {year}. | Adds a short explanation of "compounded". |
| insight.index.base_note | Index auf {year} = 100 gesetzt; das Niveau hängt von dieser Wahl ab. | Wir setzen den Index auf {year} = 100. Das Niveau hängt von dieser Wahl ab. |  |
| insight.note.index_scope | Die Baupreise gelten für Bürogebäude, der Verbraucherpreisindex für einen Haushaltswarenkorb. | Die Baupreise gelten für Bürogebäude. Der Verbraucherpreisindex gilt für einen Warenkorb privater Haushalte. | Explains CPI in brackets and says what the basket is. Meaning unchanged. |
| insight.template.completions-permits | Die Fertigstellungen entsprachen dem {latest}-Fachen der zwei Jahre zuvor erteilten Baugenehmigungen, {verdict} {from}-{to}-Durchschnitt von {mean}. | Die Fertigstellungen entsprachen dem {latest}-Fachen der zwei Jahre zuvor erteilten Baugenehmigungen. Das ist {verdict} {from}-{to}-Durchschnitt von {mean}. | Split into two sentences; verdict and numbers unchanged. |
| insight.template.price-rent | Der Preisindex liegt beim {latest}-Fachen des Mietindex, {verdict} {from}-{to}-Durchschnitt von {mean}. | Der Preisindex liegt beim {latest}-Fachen des Mietindex. Das ist {verdict} {from}-{to}-Durchschnitt von {mean}. | Split into two sentences; verdict and numbers unchanged. |
| insight.template.real-rents | Die realen Büromieten haben sich {to} um {latest} % verändert, {verdict} {from}-{to}-Durchschnitt von {mean} %. | Die realen Büromieten haben sich {to} um {latest} % verändert. Das ist {verdict} {from}-{to}-Durchschnitt von {mean} %. | Split into two sentences; verdict and numbers unchanged. |
| insight.template.office-employment | Der Büroleerstand hat sich {to} um {latest} Punkte verändert, während die Bürobeschäftigung um {emp} % gewachsen ist; die durchschnittliche Veränderung des Leerstands {from}-{to} beträgt {mean} Punkte. | Der Büroleerstand hat sich {to} um {latest} Prozentpunkte verändert, während die Bürobeschäftigung um {emp} % gewachsen ist. Die durchschnittliche Veränderung des Leerstands {from}-{to} beträgt {mean} Prozentpunkte. | Split into two sentences; "points" became "percentage points". |
| insight.template.vacancy-completions | Die Büro-Fertigstellungen weichen {to} um {latest} % von ihrem Durchschnitt {from}-{to} ab und liegen damit {verdict} Durchschnitt. | Die Büro-Fertigstellungen weichen {to} um {latest} % von ihrem Durchschnitt {from}-{to} ab. Sie liegen damit {verdict} Durchschnitt. | Split into two sentences; verdict and numbers unchanged. |
| insight.template.vacancy-rents | Der Büroleerstand weicht {to} um {latest} Punkte von seinem Durchschnitt {from}-{to} ab, {verdict} Durchschnitt. | Der Büroleerstand weicht {to} um {latest} Prozentpunkte von seinem Durchschnitt {from}-{to} ab. Er liegt {verdict} Durchschnitt. | Split into two sentences; "points" became "percentage points". |
| insight.note.asking_rents | Der Mietindex misst Angebotsmieten bei Neuvermietungen. Anreize wie mietfreie Monate erfasst er nicht, daher können die tatsächlich gezahlten Mieten schwächer sein als gezeigt. | Der Mietindex misst Angebotsmieten (die Mieten, die Vermieter verlangen) bei Neuvermietungen. Anreize wie mietfreie Monate enthält er nicht. Daher können die tatsächlich gezahlten Mieten niedriger sein als gezeigt. | Explains "asking rents"; "capture" became "include"; "weaker" became "lower". The caution (actual rents may be lower than shown) stays. |

## Insights manifest, English

| Key | Original | New | Reason |
|---|---|---|---|
| a.definition | The extra return investors require for holding property income, which is risky and hard to sell, instead of a safe government bond. It is the risk premium on property. | The extra return investors want for holding property income instead of a safe government bond. Property income is risky and hard to sell. This extra return is the risk premium on property. | Split into three sentences; same meaning. |
| g.definition | How much investors pay for each unit of rent. It is a price-to-rent valuation measure and shows how prices compare with the income they buy. | How much investors pay for each unit of rent. This price-to-rent ratio shows how prices compare with the income they buy. |  |
| e.definition | How the balance of supply and demand for office space in the big cities compares with that in a wider group of towns. It shows where space is harder to let. | Compares supply and demand for office space in the big cities with a wider group of towns. It shows where space is harder to let. | Shorter; same meaning. |

## Insights manifest, German

| Key | Original | New | Reason |
|---|---|---|---|
| a.definition | Der zusätzliche Ertrag, den Anleger für Immobilieneinnahmen verlangen, die riskant und schwer verkäuflich sind, statt einer sicheren Staatsanleihe. Er ist die Risikoprämie von Immobilien. | Der zusätzliche Ertrag, den Anleger verlangen, wenn sie Immobilieneinnahmen statt einer sicheren Staatsanleihe halten. Immobilieneinnahmen sind riskant und schwer verkäuflich. Dieser Zusatzertrag ist die Risikoprämie von Immobilien. | Split into three sentences; same meaning. |
| g.definition | Wie viel Anleger für jede Einheit Miete zahlen. Das Verhältnis von Preis zu Miete ist ein Bewertungsmaß und zeigt, wie sich die Preise zu den Einnahmen verhalten, die man damit erwirbt. | Wie viel Anleger für jede Einheit Miete zahlen. Dieses Verhältnis von Preis zu Miete zeigt, wie sich die Preise zu den Einnahmen verhalten, die man damit erwirbt. |  |
| e.definition | Wie sich das Verhältnis von Angebot und Nachfrage bei Büroflächen in den großen Städten zu dem in einer größeren Gruppe von Städten verhält. Es zeigt, wo sich Flächen schwerer vermieten lassen. | Vergleicht Angebot und Nachfrage bei Büroflächen in den großen Städten mit einer größeren Gruppe von Städten. Es zeigt, wo sich Flächen schwerer vermieten lassen. | Shorter; same meaning. |

## Coverage: strings left alone

- `insights.jump`: already plain, kept (EN and DE)
- `insights.tone.more`: already plain, kept (EN and DE)
- `insight.unit.spread`: already plain, kept (EN and DE)
- `insight.axis.rebased`: already plain, kept (EN and DE)
- `insight.multiples.title`: already plain, kept (EN and DE)
- `insight.multiples.legend`: already plain, kept (EN and DE)
- `insight.multiples.legend_dual`: already plain, kept (EN and DE)
- `insight.note.near_zero_rates`: already plain, kept (EN and DE)
- `insight.multiples.real_growth`: already plain, kept (EN and DE)
- `insight.multiples.real_growth.real-construction`: already plain, kept (EN and DE)
- `insight.index.title`: already plain, kept (EN and DE)
- `insight.index.reading`: already plain, kept (EN and DE)
- `insight.index.unit`: already plain, kept (EN and DE)
- `insight.index.label`: already plain, kept (EN and DE)
- `insight.unit.ratio`: already plain, kept (EN and DE)
- `insight.shift.2`: already plain, kept (EN and DE)
- `insight.shifted`: already plain, kept (EN and DE)
- `insight.unit.growth`: already plain, kept (EN and DE)
- `insight.unit.change`: already plain, kept (EN and DE)
- `insight.unit.deviation`: already plain, kept (EN and DE)
- `insight.unit.gap`: already plain, kept (EN and DE)
- `insight.small.vacancy-rents.title`: already plain, kept (EN and DE)
- `insight.small.vacancy-rents.label`: already plain, kept (EN and DE)
- `insight.note.completions_scope`: already plain, kept (EN and DE)
- `insight.note.completions_coverage`: already plain, kept (EN and DE)
- `insight.note.rents_scope`: already plain, kept (EN and DE)
- `Insights manifest:a.title`: kept
- `Insights manifest:a.measure`: kept
- `Insights manifest:f.title`: kept
- `Insights manifest:f.measure`: kept
- `Insights manifest:f.definition`: kept
- `Insights manifest:g.title`: kept
- `Insights manifest:g.measure`: kept
- `Insights manifest:b.title`: kept
- `Insights manifest:b.measure`: kept
- `Insights manifest:b.definition`: kept
- `Insights manifest:d.title`: kept
- `Insights manifest:d.measure`: kept
- `Insights manifest:d.definition`: kept
- `Insights manifest:i.title`: kept
- `Insights manifest:i.measure`: kept
- `Insights manifest:i.definition`: kept
- `Insights manifest:c.title`: kept
- `Insights manifest:c.measure`: kept
- `Insights manifest:c.definition`: kept
- `Insights manifest:j.title`: kept
- `Insights manifest:j.measure`: kept
- `Insights manifest:j.definition`: kept
- `Insights manifest:e.title`: kept
- `Insights manifest:e.measure`: kept
- `Insights manifest:m.title`: kept
- `Insights manifest:m.measure`: kept
- `Insights manifest:m.definition`: kept
- `Insights manifest:n.title`: kept
- `Insights manifest:n.measure`: kept
- `Insights manifest:o.title`: kept
- `Insights manifest:o.measure`: kept

## Flags (nothing changed unless stated)

- **Fertigstellungen vs Baufertigstellungen.** German Insight titles and templates say "Büro-Fertigstellungen" and "Fertigstellungen"; the glossary's standard term is "Baufertigstellungen" (used in the series titles). I left the short form: "Büro-Baufertigstellungen" reads badly. Your call.
- **"Ratio" vs "Anteil".** Insight c's measure says "ratio of completions to permits" and the German says "Anteil der Fertigstellungen an den Baugenehmigungen". "Anteil" suggests at most 1, while the number can be higher. Left; English and German do not match exactly.
- **Insight i title.** German says "reale Wirtschaftsleistung", English says "real GDP" (the measure line says BIP). Left; same meaning.
- **"Core properties"** (price and yield coverage note) is jargon. I did not add an explanation because I am not sure of the source's exact definition. Please say whether to explain it.
- **Latest-change wording on Home and KPI pages** still says "points" (`latest.change.diff`, ticket 2) because it also covers series that are not in %. Insight sentences now say "percentage points".
- **Real growth legend.** `legend_growth_real` says "the gap between the lines in the latest year is the big number" while the Methodology says the big number is the exact real growth for real office rents (known fix, ticket 8). I did not change the legend's logic; ticket 8 wording will follow your answer on the "except" question.
- **Numbers.** SVG values are identical on all 197 preview pages. Text numbers added: "100" (set to 100 in the base year), "2013" (index note, ticket 4) and, once per language on the Insights page, the example "4%, 5%, 1 percentage point". No data number changed.
- **Series title fix in ticket 4:** the loan-rate series title reads "…initial rate fixed for over 5 years" (not "fixed for over 5 years"), so the rate is not read as fixed for the whole loan. Report 04 shows the final wording of the earlier change in `manifest/series.yaml`.
