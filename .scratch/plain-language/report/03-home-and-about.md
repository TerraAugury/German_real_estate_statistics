# Ticket 3: before and after

Original = `829cccf`. Numbers, keys and identifiers unchanged.

## Interface strings, English (ticket 3 keys)

| Key | Original | New | Reason |
|---|---|---|---|
| home.segments | Browse by Segment | Browse by Segment (property type) | Adds the short plain explanation of "Segment" (allowed: one short sentence per technical term). The glossary term stays. |

## Interface strings, German (ticket 3 keys)

| Key | Original | New | Reason |
|---|---|---|---|
| home.segments | Nach Segment | Nach Segment (Immobilienart) | Adds the short plain explanation of "Segment" (allowed: one short sentence per technical term). The glossary term stays. |

## about.md, English

| Key | Original | New | Reason |
|---|---|---|---|
| about (en) #1 | This site presents public statistics on the German commercial real estate market, together with selected economic indicators, so that readers can see how they have moved over time and alongside each other. | This site shows public statistics on the German commercial real estate market. It also shows some economic indicators, such as interest rates and inflation. You can see how they changed over time and how they moved together. | Split into three short sentences; "such as interest rates and inflation" explains "economic indicators". |
| about (en) #2 | It is operated by Terra Augury Ltd, Limassol, Cyprus; see the [Legal notice](/en/legal-notice). | Terra Augury Ltd, Limassol, Cyprus, runs this site. See the [Legal notice](/en/legal-notice). | Active voice. |
| about (en) #3 | - How figures are calculated and how to read a Link: [Methodology](/en/methodology). | - How we calculate the figures, and how to read a Link (how two series moved together): [Methodology](/en/methodology). | "We" for the site; explains "Link" once. |

## about.md, German

| Key | Original | New | Reason |
|---|---|---|---|
| about (de) #1 | Diese Seite stellt öffentliche Statistiken zum deutschen Gewerbeimmobilienmarkt zusammen mit ausgewählten Wirtschaftsindikatoren dar. So lässt sich sehen, wie sie sich im Zeitverlauf und gemeinsam entwickelt haben. | Diese Seite zeigt öffentliche Statistiken zum deutschen Gewerbeimmobilienmarkt. Außerdem zeigt sie einige Wirtschaftsindikatoren, zum Beispiel Zinsen und Inflation. Sie sehen, wie sich die Werte im Zeitverlauf verändert haben und wie sie sich gemeinsam bewegt haben. | Same meaning as the English; written natively. "einige" replaces "ausgewählten" (selected). |
| about (de) #2 | Betrieben wird sie von Terra Augury Ltd, Limassol, Zypern; siehe [Impressum](/de/impressum). Sie enthält keine Werbung und verkauft nichts. | Terra Augury Ltd, Limassol, Zypern, betreibt diese Seite. Siehe [Impressum](/de/impressum). | Sentence "Sie enthält keine Werbung und verkauft nichts." removed on the owner's instruction: the English never had it, so both sides now match. |
| about (de) #3 | - Wie die Zahlen berechnet werden und wie eine Verknüpfung zu lesen ist: [Methodik](/de/methodik). | - Wie wir die Zahlen berechnen und wie Sie eine Verknüpfung lesen (wie sich zwei Reihen gemeinsam bewegt haben): [Methodik](/de/methodik). | "Wir" for the site; explains "Verknüpfung" once. |

## Coverage: strings left alone

- `home.purpose`: already plain, kept (EN and DE)
- `home.hero.more`: already plain, kept (EN and DE)

## Flags

- EN/DE difference found and resolved: the German About page said "It has no advertising and sells nothing"; the English did not. Removed from the German on the owner's instruction.
- The Home lead Insight (ticket 5) and the KPI index rows (ticket 4) are not part of this ticket.
- Terms, Privacy and Impressum: out of scope, not read in this ticket.
