---
en_hash: 2fce6cfa61c71515
reviewed_by: Olivier
reviewed_on: 2026-11-08
---
## Verknüpfungen

Eine Verknüpfung vergleicht eine Immobilienkennzahl mit einem Wirtschaftsindikator (einer Größe aus der Gesamtwirtschaft) über einen Zeitraum, den wir nennen. Sie zeigt, ob sich beide gemeinsam entwickelt haben. Sie zeigt nicht, dass das eine das andere verursacht. Sie ist auch keine Prognose.

Jede Verknüpfung hat drei Teile:

- **Zwei Reihen in einer Grafik.** Die Grafik zeigt die Kennzahl und den Indikator über dieselben Jahre. Die Kennzahl hat die linke Achse, der Indikator die rechte. Manche Indikatoren erscheinen häufiger als die Kennzahl, zum Beispiel monatlich, während die Kennzahl vierteljährlich erscheint. Wir bilden dann Durchschnitte, damit beide zusammenpassen (siehe Häufigkeit). Die Linie des Indikators ist also unsere eigene Berechnung. Sie ist nicht der Wert, den die Quelle veröffentlicht hat.
- **Wie eng sie zusammen laufen.** Wir vergleichen *Veränderungen*, nicht die Werte selbst. Bei jeder Reihe nehmen wir die Veränderung gegenüber dem Vorjahr. Bei Indizes (Reihen, die in einem Basisjahr auf 100 gesetzt sind) und bei Geldbeträgen ist das eine Veränderung in Prozent. Bei Zinssätzen und Stimmungssalden ist es ein Unterschied in Prozentpunkten. (Ein Prozentpunkt ist einfach der Unterschied zwischen zwei Prozentwerten.) Dann prüfen wir, ob beide eher zusammen steigen und fallen.

  Das Ergebnis ist eine Zahl zwischen −1 und +1, die Spearman-Rangkorrelation. Nahe +1 bewegen sich beide eher in dieselbe Richtung. Nahe −1 bewegen sie sich eher in entgegengesetzte Richtungen. Nahe 0 gibt es kein klares Muster.

  Wir zeigen immer *n*, die Zahl der verglichenen Zeiträume, und die Zeitspanne.

  Wir zeigen keine Signifikanztests. Ein Signifikanztest erscheint meist als *p-Wert* oder als Sterne (\*). Er soll sagen, wie wahrscheinlich es ist, dass ein so starkes Muster nur durch Zufall entstanden ist. Wir lassen ihn bewusst weg. Ein Stern kann wie ein Beweis wirken. Bei nur wenigen Jahren oder Quartalen und mehreren probierten Verschiebungen entsteht ein gut aussehendes Ergebnis leicht durch Zufall. Deshalb zeigen wir die Zahl selbst, *n* und die Zeitspanne. Wie viel Gewicht die Zahl hat, können Sie dann selbst beurteilen.
- **Kam eine Reihe zuerst?** Manchmal dreht eine Reihe zuerst, und die andere folgt. Um das zu prüfen, verschieben wir den Indikator in der Zeit nach früher oder später. Danach vergleichen wir jedes Mal neu. Bei Quartalskennzahlen verschieben wir um ganze Quartale, bis zu 8 in jede Richtung. Bei Jahreskennzahlen verschieben wir um ganze Jahre, bis zu 3 in jede Richtung.
  - Eine **positive Verschiebung** heißt: Der Indikator kam früher. Wir vergleichen die Veränderung des Indikators mit der Veränderung der Kennzahl in einer späteren Periode. Beispiel: Bei +2 Quartalen vergleichen wir die Veränderung des Indikators mit der Veränderung der Kennzahl zwei Quartale später.
  - Eine **negative Verschiebung** ist das Gegenteil: Der Indikator kam später.
  - Die Hauptzahl ist die **ohne Verschiebung**. Sie steht über der Grafik. Ihr Balken ist der in der Mitte, unter der Marke 0. Die anderen Balken zeigen, wie sich der Gleichlauf mit der Verschiebung ändert.
  - Wir markieren die Verschiebung, deren Zahl **am weitesten von null entfernt** ist: der stärkste Gleichlauf in beide Richtungen. Seien Sie vorsichtig mit dieser Markierung. Wir haben sie ausgewählt, nachdem wir die Ergebnisse gesehen hatten. Sie ist der beste von mehreren Versuchen und wirkt wahrscheinlich stärker, als sie ist. Eine Zeile unter der Grafik sagt das. Sie nennt auch, für wie viele Verschiebungen genug Daten vorlagen.
  - Wir stellen eine Verschiebung nie als Vorlaufzeit oder Frühwarnung dar. Sie beschreibt nur die Vergangenheit.

**Häufigkeit.** Eine Verknüpfung folgt dem Takt der Kennzahl, vierteljährlich oder jährlich. Wir erfinden keine Zwischenwerte. Monats- und Quartalsindikatoren mitteln wir über jedes Quartal oder Kalenderjahr. Ein Quartal oder Jahr mit fehlenden Daten lassen wir weg.

**Mindestüberlappung.** Ein Vergleich über zu wenige Zeiträume kann in die Irre führen. Jede Verschiebung braucht mindestens 40 Zeiträume bei Quartalskennzahlen und 10 bei Jahreskennzahlen. Darunter lassen wir die Verschiebung leer. Wir zeigen eine Verknüpfung nur, wenn der Vergleich ohne Verschiebung dieses Minimum erreicht und insgesamt mindestens drei Verschiebungen es erreichen. Sonst steht in der Grafik „Verknüpfung nicht angezeigt“. Dazu nennen wir *n* ohne Verschiebung. Wir sagen auch, ob es zu wenige Zeiträume gab oder ob sich eine Reihe nicht verändert hat. Bei jährlichen Verknüpfungen mit weniger als 20 Zeiträumen fügen wir einen Hinweis hinzu, dass das Muster Zufall sein kann.

**Eine Verschiebung auf der Seite Verknüpfungen wählen.** Über der Tabelle können Sie eine Verschiebung wählen. Sie gilt für jedes Feld in der Tabelle. Zur Wahl stehen:

- „Gleiches Jahr“: Wir vergleichen den Indikator und die Kennzahl im selben Jahr.
- „Indikator 1 Jahr früher (N-1)“: Wir vergleichen die Kennzahl mit dem Indikator von einem Jahr davor.
- „Indikator 2 Jahre früher (N-2)“: Wir vergleichen die Kennzahl mit dem Indikator von zwei Jahren davor.

Jedes Feld zeigt dieselbe Zahl wie der passende Balken auf der Kennzahlseite. Bei einer Quartalskennzahl bedeuten N-1 und N-2: 4 und 8 Quartale früher. Hat ein Feld bei der gewählten Verschiebung zu wenige Zeiträume, steht dort „Nicht angezeigt“. Die Tabelle öffnet mit N-1. Den Grund nennen wir im nächsten Absatz. Die Seitenadresse ändert sich mit Ihrer Wahl. So können Sie sie kopieren und Ihre Ansicht teilen.

**Eine vorab gewählte Verschiebung für bewertungsbasierte Kennzahlen.** Anfangsrendite und der Preisindex für Gewerbeimmobilien beruhen großenteils auf Bewertungen (Schätzungen von Gutachtern). Bewertungen folgen den Zinsen mit Verzögerung. Wir vergleichen diese beiden Kennzahlen mit der Rendite 10-jähriger Bundesanleihen (dem Zins auf zehnjährige deutsche Staatsanleihen), dem Euribor 3 Monate und dem Kreditzins. Für diese Paare haben wir ein Jahr früher (N-1) im Voraus festgelegt. Das haben wir aus wirtschaftlichen Gründen getan, nicht anhand der Ergebnisse. Diese Felder tragen bei jeder Verschiebung die Markierung „vorab gewählte Verschiebung“. In den Verknüpfungsgrafiken hat der +1-Balken dieselbe Beschriftung, getrennt von der Markierung „stärkster“. Wer zwischen Verschiebungen wechselt und die behält, die am stärksten aussieht, überschätzt den Zusammenhang. Das ist dasselbe Problem wie bei der Markierung „stärkster“.

**Graue Felder und das Band an den Balken.** Eine Korrelation aus wenigen Jahren kann zufällig stark aussehen. Deshalb berechnen wir für jedes Feld ein Band von ±2/√(n−1). Dabei nehmen wir das eigene *n* des Feldes bei der gewählten Verschiebung. Liegt die Zahl eines Feldes innerhalb des Bandes, ist das Feld grau. Die Zahl bleibt sichtbar. Dasselbe Band ist als helle Fläche an den Balken jeder Verknüpfungsgrafik eingezeichnet. Es ist eine grobe Orientierung, kein Signifikanztest. Wir zeigen keine Sterne und keine p-Werte, aus den oben genannten Gründen. Bei Quartalskennzahlen wird jede Veränderung mit dem Vorjahr verglichen. Benachbarte Quartale überlappen sich also und sind nicht unabhängig. Das Band nutzt dann ein angepasstes *n* von *n* ÷ 4, abgerundet. Die Grafik zeigt beide Zahlen.

**Viele Felder auf einmal.** Die Seite Verknüpfungen zeigt viele Vergleiche gleichzeitig. Darum sehen einige Felder allein durch Zufall stark aus. Genauso ergibt sich bei mehreren probierten Verschiebungen einer Verknüpfung leicht eine, die gut aussieht. Seien Sie vorsichtig mit einem einzelnen starken Feld, besonders wenn *n* klein ist.

**Nominal und real.** Nominal heißt: nicht um die Inflation bereinigt. Real heißt: um die Inflation bereinigt. Mieten und Transaktionsvolumen sind in nominalen Euro. Das gilt auch für den Verbraucherpreisindex und die Baupreise. Ihre Verknüpfungen mit diesen beiden Indikatoren zeigen deshalb zum Teil dieselbe Inflation. Das reale Bruttoinlandsprodukt (BIP, der Wert aller erzeugten Waren und Dienstleistungen) ist um die Inflation bereinigt. Eine Verknüpfung zwischen einer nominalen Kennzahl und dem realen BIP stellt also nominal gegen real. Die Zeilen Mieten und Transaktionsvolumen auf der Seite Verknüpfungen tragen dazu einen Hinweis. Ihre Verknüpfungsgrafiken zu diesen drei Indikatoren tragen ihn auch. Wir bereinigen in einer Verknüpfung keine Zahl um die Inflation.

**Zeilen und Gebiete.** Die Zeilen der Seite Verknüpfungen decken verschiedene Segmente (Immobilienarten) und Gebiete ab. Jede Zeile beginnt mit einem Hinweis auf ihr eigenes Segment und Gebiet: Gewerbe gesamt oder Büro, Deutschland oder die 7 Großstädte, bei der Anfangsrendite Büro und Einzelhandel zusammen. Jeder Indikator gilt bundesweit. Wer eine Spalte von oben nach unten liest, vergleicht daher Ungleiches. Bei einer Städtegruppe oder einem Land vergleicht die Verknüpfung den bundesweiten Indikator mit der Kennzahl für dieses Gebiet.

## Die acht Indikatoren

1. Rendite zehnjähriger Bundesanleihen (Deutsche Bundesbank), monatlich.
2. Euribor 3 Monate, Monatsdurchschnitt (Europäische Zentralbank). Das ist der Zins, zu dem sich Banken untereinander 3 Monate Geld leihen. Wir nehmen ihn stellvertretend für den Leitzins der EZB (den wichtigsten Zins der EZB).
3. Zinssatz für neue Kredite an nichtfinanzielle Unternehmen (Unternehmen außerhalb des Finanzsektors) über 1 Mio. Euro, mit einer Zinsbindung von über 5 Jahren (Deutsche Bundesbank), monatlich. Gewerbeimmobilien werden meist mit langen Festzinsen finanziert. Darum nehmen wir Kredite mit langer Zinsbindung und nicht den variablen Zins.
4. Verbraucherpreisindex (Destatis), monatlich. Er bildet die Preise eines Warenkorbs ab, den Haushalte kaufen.
5. Reales Bruttoinlandsprodukt (Deutsche Bundesbank), vierteljährlich.
6. Registrierte Arbeitslosenquote (Deutsche Bundesbank), monatlich.
7. Baupreisindex (Destatis), vierteljährlich. Für Büro-Ansichten und für den Bau von Bürogebäuden nehmen wir Bürogebäude. Für alle anderen Ansichten nehmen wir gewerbliche Betriebsgebäude.
8. OECD-Geschäftsklima (OECD), monatlich. Für Einzelhandels-Ansichten nehmen wir den Einzelhandel, für alle anderen Ansichten den Bau. Diese Reihen sind nicht saisonbereinigt. Regelmäßige Schwankungen im Jahresverlauf bleiben also enthalten. Es sind Prozentsalden, darum sind ihre Veränderungen Unterschiede in Prozentpunkten.

## Einblicke

Ein Einblick zeigt mehrere Reihen in einer Grafik über einen Zeitraum, den wir nennen. Dazu gibt es eine feste Erklärung in einem Satz. Wie eine Verknüpfung beschreibt er nur, was die Linien zeigen. Er zeigt keine Ursache und ist keine Prognose. Anders als eine Verknüpfung hat er keine Korrelation und probiert keine Verschiebungen aus. (Ein Einblick vergleicht mit einem früheren Jahr, das wir vorab festgelegt haben. Siehe Verschiebung weiter unten.)

- **Ein Wert pro Jahr.** Ein Einblick nutzt Jahreswerte. Monats- und Quartalsreihen mitteln wir über jedes Kalenderjahr. Fehlt in einem Jahr ein Monat oder Quartal, lassen wir das Jahr weg. Wir mitteln dann nicht nur einen Teil.
- **Zeitraum.** Der Zeitraum umfasst die Jahre, die alle Reihen abdecken. Für den Durchschnitt und die übliche Schwankung (die Standardabweichung: wie stark die Werte üblicherweise schwanken) nutzen wir alle diese Jahre. Ein Einblick braucht mindestens 10 Jahre. Bei weniger zeigt die Seite „Einblick nicht angezeigt“ und nennt die Zahl der Jahre. Bei weniger als 20 Jahren warnt ein Hinweis, dass der Durchschnitt auf wenigen Daten beruht.
- **„Stand“.** Jede Kachel auf der Seite Einblicke und jede große Zahl nennt „Stand“ und ein Jahr. Das ist das letzte Jahr des Zeitraums. Die große Zahl ist der Wert für dieses Jahr.
- **Große Zahl.** Die große Zahl ist eine von diesen:
  - der Abstand zwischen der Hauptlinie (der Kennzahl) und der Vergleichslinie (der Vergleichsreihe), in Prozentpunkten;
  - die Kennzahl geteilt durch die Vergleichsreihe (zwei Indizes mit verschiedenen Basisjahren setzen wir vorher im selben Jahr auf 100);
  - der Abstand zwischen den prozentualen Veränderungen beider Reihen gegenüber dem Vorjahr;
  - die prozentuale Veränderung einer einzelnen Reihe gegenüber dem Vorjahr.

  Zahlen, die auf Veränderungen beruhen, verlieren das erste Jahr. Abstände und Wachstumsraten zeigen eine Nachkommastelle, Verhältnisse zwei.
- **Reale Werte.** Eine reale Miete ist der Mietindex geteilt durch den Verbraucherpreisindex. Danach nehmen wir ihre Veränderung gegenüber dem Vorjahr. Miete wird über das ganze Jahr gezahlt. Darum nehmen wir den Jahresdurchschnitt des Verbraucherpreisindex. „Abstand des realen Büromietwachstums zum Wachstum des realen BIP“ vergleicht dieses reale Mietwachstum mit dem Wachstum des realen BIP. So sind beide Seiten um die Inflation bereinigt.
- **Reale Baukosten.** Der Baupreisindex (Bürogebäude) erscheint vierteljährlich, der Verbraucherpreisindex monatlich. Wir mitteln beide über das Kalenderjahr. Ein Jahr mit fehlendem Quartal oder Monat lassen wir weg. Die große Zahl ist das reale Wachstum der Baupreise in Prozent: (1 + Baupreiswachstum) / (1 + Inflation) − 1. Der Durchschnitt, die Einordnung und die Hintergrundfarbe folgen dieser Zahl. Niedriger ist besser. Die erste Grafik bei diesem Einblick ist der reale Baukostenindex. Er setzt beide Indizes auf 1992 = 100 und schreibt jeden Index Jahr für Jahr fort (die Veränderung jedes Jahres baut auf dem Vorjahr auf). Dann teilt er den Baupreisindex durch den Verbraucherpreisindex. Er zeigt die gesamte reale Veränderung seit 1992 und die jährliche Rate. Er hat keine Einordnung und keine Hintergrundfarbe, weil sein Niveau vom gewählten Basisjahr abhängt. Die Baupreise gelten für Bürogebäude. Der Verbraucherpreisindex gilt für einen Warenkorb privater Haushalte.
- **Einordnung.** Das Etikett vergleicht den letzten Wert mit dem Durchschnitt des ganzen Zeitraums, das letzte Jahr eingeschlossen. Es lautet „im Einklang mit“, wenn der letzte Wert höchstens eine halbe übliche Schwankung vom Durchschnitt entfernt liegt (wir nehmen die Version für den ganzen Zeitraum, nicht für eine Stichprobe). Sonst lautet es „höher als“ oder „niedriger als“. Das graue Band in der Grafik reicht vom Durchschnitt minus bis plus eine halbe übliche Schwankung. Die Einordnung sagt nur, wo der letzte Wert im Vergleich zur Vergangenheit liegt. Sie heißt nicht, dass die Werte zum Durchschnitt zurückkehren. Sie ist weder eine Ursache noch eine Prognose.
- **Besser und schlechter.** Manche Einblicke sind zusätzlich hellgrün (besser) oder hellrosa (schlechter) hinterlegt. Screenreader erhalten die Wörter. Das ist unsere eigene Lesart, aus Sicht von Anlegern in Büroimmobilien. Sie ist keine Tatsache über den Markt und weder eine Ursache noch eine Prognose. Für jeden Einblick legen wir fest, welche Richtung als besser gilt. Der Hintergrund ist grün, wenn der letzte Wert auf der besseren Seite des Durchschnitts liegt, so wie die Einordnung es beurteilt. Er ist rosa, wenn der Wert auf der anderen Seite liegt. Er bleibt ohne Farbe, wenn die Einordnung „im Einklang mit“ lautet oder keine Seite besser ist. Das Vorzeichen der Zahl entscheidet nicht. Ein Rückgang der realen Baupreise ist eine negative Veränderung und besser. Ein Abstand von -0,3 Prozentpunkten ist höher als ein Durchschnitt von -2,0 Prozentpunkten. Wo die bessere Richtung eine knappe Entscheidung ist, sagt es die Tabelle.
- **Wachstumsgrafiken.** Manche große Zahlen sind eine Veränderung gegenüber dem Vorjahr oder der Abstand zweier solcher Veränderungen. Dafür zeigt die kleine Grafik die Veränderungen als zwei Linien auf einer Achse, in Prozent. Das betrifft drei Gruppen: reale Büromieten gegen reales BIP; Büromieten gegen Baupreise; sowie reale Büromieten und reale Baukosten gegen die Inflation. In der letzten Gruppe zeigen wir das nominale Wachstum gegen die Inflation der Verbraucherpreise. Das reale Wachstum ist (1 + Mietwachstum) / (1 + Inflation) − 1, bei den Baupreisen (1 + Baupreiswachstum) / (1 + Inflation) − 1. Es weicht daher leicht vom Abstand der beiden Linien ab. Der Abstand der beiden Linien im letzten Jahr ist die große Zahl, außer bei den realen Büromieten und den realen Baukosten. Bei diesen beiden ist die große Zahl das reale Wachstum. Die Schattierung zwischen den Linien ist blau, wo die Hauptlinie über der Vergleichslinie liegt, und rot, wo sie darunter liegt.
- **Basisjahr.** Die übrigen kleinen Grafiken zeigen Werte. Haben die beiden Reihen verschiedene Einheiten oder Basen, zeigen wir beide als Index mit dem Basisjahr auf 100. Das gilt für zwei Grafiken: „Verhältnis der Büropreise zu den Büromieten“ (zwei Indizes mit verschiedenem Basisjahr, als Verhältnis verglichen) und „Verhältnis der Büro-Fertigstellungen zu den Baugenehmigungen zwei Jahre zuvor“ (Nutzfläche, ein Verhältnis zweier Mengen). Das Basisjahr ist 2015, oder das erste gemeinsame Jahr, wenn eine Reihe für 2015 keinen Wert hat. 2015 ist nur ein Bezugspunkt (das Jahr, in dem die EZB mit den Anleihekäufen begann). Wir behaupten nicht, dass die Käufe der EZB etwas verursacht haben. Die einzige Ausnahme ist der reale Baukostenindex, der bei 1992 = 100 beginnt. Die Größe der schattierten Fläche zwischen zwei Linien, die auf 100 gesetzt sind, hängt vom gewählten Basisjahr ab. Reihen in Prozent oder Prozentpunkten (Leerstandsquoten, Renditen, Zinssätze) setzen wir nie auf 100.
- **Verschiebung.** Wir vergleichen Fertigstellungen mit den Baugenehmigungen von zwei Jahren zuvor, weil eine Genehmigung etwa zwei Jahre bis zur Fertigstellung braucht. Wir verschieben die Genehmigungsreihe um zwei Jahre nach vorn und benennen sie entsprechend.

Welche Richtung als besser gilt, für jeden Einblick:

| Einblick | Besser, wenn der Wert | Begründung |
|---|---|---|
| Abstand der Anfangsrendite zur Rendite 10-jähriger Bundesanleihen, nach Städtegruppe | höher | mehr Einnahmen je Preiseinheit, als eine Bundesanleihe zahlt |
| Abstand der Anfangsrendite zum Unternehmenskreditzins | höher | mehr Einnahmen je Preiseinheit, als der Unternehmenskreditzins kostet |
| Verhältnis der Büropreise zu den Büromieten | keines von beiden | Die Zahl ist ein Verhältnis von Preis zu Miete, gezeigt als Index (2015 = 100). Ist sie hoch, zahlt ein Käufer mehr je Mieteinheit, und ein Eigentümer hält mehr Wert. Es kommt also auf den Standpunkt an. |
| Reales Wachstum der Büromieten | höher | Mieten wachsen schneller als die Preise insgesamt |
| Abstand des Büromietwachstums zum Baupreisanstieg | höher | Mieten wachsen schneller als die Baukosten |
| Abstand des realen Büromietwachstums zum Wachstum des realen BIP | höher | Reale Mieten wachsen schneller als die reale Wirtschaft. Das ist ein Grenzfall: Es heißt auch, dass die Kostenbelastung für Nutzer steigt. Es ist eine redaktionelle Einschätzung. |
| Verhältnis der Büro-Fertigstellungen zu den Baugenehmigungen zwei Jahre zuvor | keines von beiden | Weniger Fertigstellungen je Genehmigung bedeuten weniger neues Angebot für Eigentümer, aber weniger Projekte für Entwickler. Es kommt auf den Standpunkt an. |
| Reales Wachstum der Baupreise | niedriger | Bau- und Sanierungskosten, die schneller steigen als die Preise insgesamt, machen neue Investitionen teurer. Das ist eine redaktionelle Einschätzung. |
| Abstand des Büroleerstands in den 7 Großstädten zu den 127 Städten | niedriger | Ein positiver Abstand heißt: In den 7 Großstädten steht mehr leer als in den 127 Städten. Das ist schlechter. Ein negativer Abstand ist besser. |

Die Zahlen der Einblicke sind unsere eigene Berechnung. Das gilt für Abstände, Verhältnisse, Durchschnitte und Reihen, die im Basisjahr auf 100 gesetzt sind. Wir kennzeichnen sie in den Quellenzeilen als solche.

## So lesen Sie diese Zahlen

- Wir rufen jede Reihe entweder direkt beim Herausgeber ab oder über DBnomics, eine Seite, die amtliche Quellen sammelt. Die Quellenzeile nennt den Weg. Die Herausgeber sind für diese Seite nicht verantwortlich.
- Bei direkt abgerufenen Reihen nennt die Quellenzeile das Datum, an dem wir zuletzt neue Daten abgerufen haben. Sie nennt auch die Originaleinheit des Herausgebers, bei der Bundesbank auch den Originaltitel. Unsere eigenen Titel, Zahlenformate und Rundungen stammen nicht vom Herausgeber.
- Deutschland-Summen beim Bau, Einheitenumrechnungen, Veränderungen gegenüber dem Vorjahr und Verknüpfungen sind unsere eigene Berechnung. Wir kennzeichnen sie als solche.
- Die Seite zeigt nur die zuletzt veröffentlichte Fassung jeder Reihe. Frühere Fassungen halten wir nicht fest. Ändert ein Herausgeber frühere Werte, sagt das ein Hinweis, 90 Tage nachdem wir es bemerkt haben.
- Hinweise unter einer Grafik sagen auch, wenn eine Reihe nicht mehr aktuell ist, wenn wir sie nicht aktualisieren konnten und wenn der Herausgeber sie nicht mehr anbietet. Sie weisen auf eine kurze Zeitreihe hin. Sie sagen auch, was eine Zahl abdeckt, zum Beispiel eine gemeinsame Zahl für eine Städtegruppe.
- Die Gewerbeimmobilienreihen der Deutschen Bundesbank beruhen auf Daten anderer Stellen (bulwiengesa, vdp).
- Herausgeber, Reihen-ID und Lizenz jeder Reihe stehen unter [Quellen und Lizenzen](/de/quellen).
