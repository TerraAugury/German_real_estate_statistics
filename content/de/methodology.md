---
en_hash: de3756647c04de52
reviewed_by: terra augury
reviewed_on: 2026-11-03
---
## Verknüpfungen

Eine Verknüpfung setzt eine Immobilienkennzahl und einen Wirtschaftsindikator für einen angegebenen Zeitraum in Beziehung. Sie zeigt Gleichlauf: wie sich zwei Reihen gemeinsam entwickelt haben. Das belegt keine Ursache-Wirkungs-Beziehung und ist keine Prognose.

Jede Verknüpfung hat drei Teile:

- **Die zwei Reihen in einer Grafik.** Die Kennzahl und der Indikator werden gemeinsam über denselben Zeitraum gezeigt: die Kennzahl an der linken, der Indikator an der rechten Achse. Manche Indikatoren erscheinen häufiger als die Kennzahl, zum Beispiel monatlich statt vierteljährlich. Wir mitteln sie auf die Frequenz der Kennzahl, wie unter Frequenz beschrieben. Die Linie des Indikators ist also unsere eigene Berechnung, nicht der Wert, den die Quelle veröffentlicht hat.
- **Wie eng sie zusammen laufen.** Wir vergleichen *Veränderungen*, nicht Niveaus. Bei jeder Reihe schauen wir, wie stark sie gegenüber dem Vorjahr gestiegen oder gefallen ist. Das ist eine prozentuale Veränderung bei Indizes und Geldbeträgen und eine Differenz in Punkten bei Zinssätzen und Salden. Dann fragen wir, ob beide tendenziell gemeinsam steigen und fallen.

  Die Antwort ist eine einzige Zahl zwischen −1 und +1, die Spearman-Rangkorrelation. Nahe +1 heißt: Sie laufen tendenziell in dieselbe Richtung. Nahe −1 heißt: Sie laufen tendenziell in entgegengesetzte Richtungen. Nahe 0 heißt: Es ist kein klares Muster erkennbar.

  Wir zeigen immer *n*, die Zahl der verglichenen Perioden, und den Zeitraum.

  Wir zeigen keine Signifikanztests. Ein Signifikanztest, oft als *p-Wert* oder als Sterne (\*) dargestellt, soll sagen, wie wahrscheinlich es ist, dass ein so starkes Muster allein durch Zufall entstanden ist. Wir lassen ihn bewusst weg. Ein Stern kann wie ein Beweis wirken, und bei nur wenigen Jahren oder Quartalen und mehreren probierten Verschiebungen entsteht ein gut aussehendes Ergebnis leicht durch Zufall. Deshalb zeigen wir die Zahl selbst, die Zahl der Perioden, auf denen sie beruht (*n*), und den Zeitraum. Wie viel Gewicht sie verdient, können Sie dann selbst beurteilen.
- **Lief eine Reihe der anderen voraus?** Manchmal dreht eine Reihe zuerst und die andere folgt. Um das zu prüfen, verschieben wir den Indikator in der Zeit nach hinten oder vorn und wiederholen jedes Mal den Vergleich. Wir verschieben um ganze Quartale (bis zu 8 in jede Richtung) bei Quartalskennzahlen und um ganze Jahre (bis zu 3 in jede Richtung) bei Jahreskennzahlen.
  - Eine **positive Verschiebung** heißt: Wir haben den Indikator mit der Kennzahl *einer späteren* Periode verglichen, der Indikator lief also voraus. Beispiel: Bei +2 Quartalen wird die Veränderung des Indikators der Veränderung der Kennzahl zwei Quartale später gegenübergestellt.
  - Eine **negative Verschiebung** ist das Gegenteil: Der Indikator lief nach.
  - Der Hauptwert ist der **ohne Verschiebung**. Er steht oberhalb der Grafik, und sein Balken ist der in der Mitte, unter der Marke 0. Die übrigen Balken zeigen, wie sich der Gleichlauf mit dem zeitlichen Abstand ändert.
  - Markiert ist die Verschiebung, deren Zahl **am weitesten von null entfernt** ist, also der stärkste Gleichlauf in beide Richtungen. Vorsicht bei dieser Markierung. Wir haben sie nach Ansicht der Ergebnisse aus mehreren Verschiebungen ausgewählt; sie ist also der beste von mehreren Versuchen und wirkt vermutlich stärker, als sie ist. Eine Zeile unter der Grafik sagt das und nennt die Zahl der Verschiebungen, für die genug Daten vorlagen.
  - Wir stellen eine Verschiebung nie als Vorlaufzeit oder Frühwarnung dar. Sie beschreibt nur die Vergangenheit.

**Frequenz.** Eine Verknüpfung folgt der Frequenz der Kennzahl, vierteljährlich oder jährlich. Wir erfinden keine Zwischenwerte. Monats- und Quartalsindikatoren werden über jedes Quartal oder Kalenderjahr gemittelt. Ein Quartal oder Jahr mit fehlenden Daten entfällt.

**Mindestüberlappung.** Ein Vergleich über zu wenige Perioden kann in die Irre führen. Jede Verschiebung braucht mindestens 40 Perioden bei Quartalskennzahlen oder 10 bei Jahreskennzahlen. Darunter bleibt sie leer. Eine Verknüpfung wird nur gezeigt, wenn der Vergleich ohne Verschiebung und insgesamt mindestens drei Verschiebungen dieses Minimum erreichen. Sonst steht im Feld „Verknüpfung nicht angezeigt“ mit der Zahl der Paare ohne Verschiebung. Bei jährlichen Verknüpfungen mit weniger als 20 Paaren fügen wir einen Hinweis hinzu, dass das Muster zufällig sein kann.

**Geografie.** Jeder Indikator ist bundesweit. Bei einer Städtegruppe oder einem Land vergleicht die Verknüpfung den bundesweiten Indikator mit der Kennzahl dieser Geografie.

## Die acht Indikatoren

1. Rendite zehnjähriger Bundesanleihen (Deutsche Bundesbank), monatlich.
2. Euribor 3 Monate, Monatsdurchschnitt (Europäische Zentralbank), stellvertretend für den Leitzins der EZB.
3. Zinssatz für neue Kredite an nichtfinanzielle Unternehmen über 1 Mio. Euro (Deutsche Bundesbank), monatlich.
4. Verbraucherpreisindex (Destatis), monatlich.
5. Reales Bruttoinlandsprodukt (Deutsche Bundesbank), vierteljährlich.
6. Registrierte Arbeitslosenquote (Deutsche Bundesbank), monatlich.
7. Baupreisindex (Destatis), vierteljährlich: Bürogebäude für Büro-Ansichten und für die Bautätigkeit bei Bürogebäuden, gewerbliche Betriebsgebäude für alle übrigen.
8. OECD-Geschäftsklima (OECD), monatlich: Einzelhandel für Einzelhandels-Ansichten, Bau für alle übrigen. Diese Reihen sind nicht saisonbereinigt und Prozentsalden, daher sind ihre Veränderungen Differenzen in Punkten.

## Einblicke

Ein Einblick stellt mehrere Reihen über einen genannten Zeitraum auf einer Achse dar, mit einer festen Lesehilfe in einem Satz. Wie eine Verknüpfung beschreibt er, was die Linien zeigen: Er belegt keine Ursache und ist keine Prognose. Anders als eine Verknüpfung enthält er weder eine Korrelation noch eine Verschiebung.

- **Frequenz.** Ein Einblick läuft in der gröbsten Frequenz seiner Reihen, das ist jährlich. Monats- und Quartalsreihen werden über jedes Kalenderjahr gemittelt; ein Jahr mit fehlenden Monaten oder Quartalen entfällt und wird nie teilweise gemittelt.
- **Gemeinsamer Zeitraum.** Der gemeinsame Zeitraum umfasst die Jahre, die jede Reihe abdeckt; Durchschnitt und Standardabweichung verwenden ihn vollständig. Ein Einblick braucht mindestens 10 Jahreswerte; bei weniger zeigt die Seite „Einblick nicht angezeigt“ und nennt die Zahl der Werte. Bei weniger als 20 weist ein Hinweis darauf hin, dass der Durchschnitt auf wenigen Daten beruht.
- **Kennzahl.** Die große Zahl ist ein Abstand (die Kennzahl minus die Vergleichsreihe, in Prozentpunkten), ein Verhältnis (die Kennzahl geteilt durch die Vergleichsreihe; bei zwei Indizes mit verschiedenen Basisjahren, nachdem beide auf dasselbe Jahr umbasiert wurden), ein Abstand der prozentualen Veränderungen gegenüber dem Vorjahr oder die prozentuale Veränderung einer einzelnen Reihe gegenüber dem Vorjahr. Auf Veränderungen beruhende Kennzahlen verlieren das erste Jahr. Abstände und Wachstumsraten erscheinen mit einer Nachkommastelle, Verhältnisse mit zwei.
- **Reale Werte.** Eine reale Miete ist der Mietindex geteilt durch den Verbraucherpreisindex, anschließend gegenüber dem Vorjahr verglichen. Mieten sind eine Stromgröße über das Jahr und werden daher mit dem Jahresdurchschnitt des Verbraucherpreisindex deflationiert; ein Preis zu einem Zeitpunkt, etwa ein Immobilienpreis, würde mit dem Dezemberindex deflationiert.
- **Leerstand und Beschäftigung.** Der Einblick zu Büroleerstand und Bürobeschäftigung zeigt die Veränderung des Leerstands gegenüber dem Vorjahr in Prozentpunkten und das Wachstum der bundesweiten Beschäftigung in Finanzierung, Immobilien und Unternehmensdienstleistungen gegenüber dem Vorjahr in Prozent auf einer Achse. Nur die Veränderung des Leerstands erhält eine Einordnung. Die Beschäftigungsreihe ist bundesweit, weil keine Quelle sie für eine Städtegruppe veröffentlicht, und sie nähert die Bürobeschäftigung nur an.
- **Einordnung.** Das Etikett vergleicht den letzten Wert mit dem Durchschnitt des gesamten gemeinsamen Zeitraums, einschließlich des letzten Werts. Es lautet „im Einklang mit“, wenn der letzte Wert höchstens eine halbe Standardabweichung (Standardabweichung der Grundgesamtheit) vom Durchschnitt entfernt liegt, sonst „höher als“ oder „niedriger als“. Das graue Band in der Grafik ist der Durchschnitt plus/minus eine halbe Standardabweichung. Die Einordnung sagt, wo der letzte Wert im Vergleich zur Vergangenheit liegt; sie unterstellt keine Rückkehr zum Durchschnitt und ist weder eine Ursache noch eine Prognose.
- **Besser und schlechter.** Neben der Einordnung sind manche Einblicke hellgrün (besser) oder hellrosa (schlechter) getönt; Screenreader erhalten die Wörter. Das ist unsere redaktionelle Lesart aus Sicht von Anlegern in Büroimmobilien, keine Tatsache über den Markt, und weder eine Ursache noch eine Prognose. Für jeden Einblick legen wir fest, welche Richtung als besser gilt. Die Fläche ist grün getönt, wenn der letzte Wert auf dieser Seite des Durchschnitts liegt (so, wie die Einordnung ihn beurteilt), rosa, wenn er auf der anderen Seite liegt, und bleibt ungefärbt, wenn die Einordnung „im Einklang mit“ lautet oder keine Seite besser ist. Das Vorzeichen der Zahl entscheidet nicht: Ein sinkender Leerstand ist eine negative Veränderung und besser, und ein Abstand von -0,3 Punkten ist höher als ein Durchschnitt von -2,0 Punkten. Wo die Richtung eine knappere Entscheidung ist, sagt es die Tabelle.
- **Umbasierung.** Die kleinen Grafiken zeigen beide Reihen als Index, dessen Basisjahr 100 ist: 2015, oder das erste gemeinsame Jahr, wenn eine Reihe für 2015 keinen Wert hat. 2015 ist nur ein Bezugspunkt (das Jahr der Anleihekäufe der EZB); die Seite behauptet nicht, dass es etwas verursacht hat. Die Schattierung zwischen den beiden Linien ist blau, wo die Kennzahl über der Vergleichsreihe liegt, und rot, wo sie darunter liegt.
- **Verschiebung.** Fertigstellungen werden mit den zwei Jahre zuvor erteilten Baugenehmigungen verglichen, weil eine Genehmigung etwa zwei Jahre bis zur Fertigstellung braucht. Die Genehmigungsreihe wird um zwei Jahre nach vorn verschoben und entsprechend benannt.

Welche Richtung als besser gilt, je Einblick:

| Einblick | Besser, wenn der Wert | Begründung |
|---|---|---|
| Renditeabstand der Anfangsrendite zur 10-jährigen Bundesanleihe, nach Städtegruppe | höher | mehr Einnahmen je Preiseinheit, als eine Bundesanleihe zahlt |
| Renditeabstand der Anfangsrendite zum Unternehmenskreditzins | höher | mehr Einnahmen je Preiseinheit, als der Unternehmenskreditzins kostet |
| Büropreise und Büromieten | keines von beiden | die Zahl ist ein indexiertes Verhältnis von Preis zu Miete (2015 = 100): ein Käufer zahlt bei hohem Wert mehr je Mieteinheit, ein Eigentümer hält mehr Wert, es kommt also auf den Standpunkt an |
| Reale Büromieten | höher | Mieten wachsen schneller als die Preise insgesamt |
| Büromieten und Baupreise | höher | Mieten wachsen schneller als die Baukosten |
| Büromieten und Wirtschaftsleistung | höher | Mieten wachsen schneller als die Wirtschaft. Redaktionelles Urteil. |
| Büro-Fertigstellungen und Baugenehmigungen zwei Jahre zuvor | keines von beiden | weniger Fertigstellungen je Genehmigung bedeuten weniger neues Angebot für Eigentümer, aber weniger Projekte für Entwickler: es kommt auf den Standpunkt an |
| Baupreise und Inflation | niedriger | Bau- und Sanierungskosten, die schneller steigen als die Preise insgesamt, verteuern neue Investitionen. Redaktionelles Urteil. |
| Büroleerstand: A-Städte und 127 Städte | niedriger | ein positiver Abstand heißt, die 7 Großstädte stehen leerer da als die 127 Städte, das ist schlechter; ein negativer Abstand ist besser |
| Büroleerstand und Bürobeschäftigung | niedriger | ein Anstieg des Leerstands ist schlechter und ein Rückgang besser, also ist eine negative Veränderung besser |

Die Zahlen der Einblicke, darunter Abstände, Verhältnisse, Durchschnitte und umbasierte Reihen, sind eigene Berechnung und in den Quellenzeilen als solche gekennzeichnet.

## So lesen Sie diese Zahlen

- Jede Reihe wird entweder direkt beim Herausgeber oder über DBnomics abgerufen, das amtliche Quellen bündelt; die Quellenzeile nennt den Weg. Die Herausgeber sind für diese Seite nicht verantwortlich.
- Bei direkt abgerufenen Reihen nennt die Quellenzeile das Datum, an dem zuletzt neue Daten abgerufen wurden, sowie die Originaleinheit (bei der Bundesbank auch den Originaltitel) des Herausgebers. Unsere eigenen Titel, Zahlenformate und Rundungen stammen nicht vom Herausgeber.
- Deutschland-Summen der Bautätigkeit, Einheitenumrechnungen, Veränderungen gegenüber dem Vorjahr und Verknüpfungen sind eigene Berechnung und als solche gekennzeichnet.
- Die Seite zeigt nur die zuletzt veröffentlichte Fassung jeder Reihe und führt keine Revisionshistorie.
- Die Gewerbeimmobilienreihen der Deutschen Bundesbank beruhen auf Daten Dritter (bulwiengesa, vdp).
- Herausgeber, Reihen-ID und Lizenz jeder Reihe stehen unter [Quellen und Lizenzen](/de/quellen).
