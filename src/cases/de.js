import { ballBar as B, positionRows, cornerSigma, typeAB, targetStats, globalIntrinsics } from './data'

const P = 'Position'
const K = 'Faktor k'

export const de = {
  ui: { brief: 'Auf einen Blick', briefHeads: ['Das Problem', 'Was ich gemacht habe', 'Das Ergebnis'], toc: 'Inhalt', facts: 'Kennzahlen', limit60: 'Ziel ±60 µm', limit120: 'Kriterium ±120 µm', unit: 'Abweichung zur Referenz (µm)', source: 'Quellen: Abschlussarbeit, Projektbericht, Versuchsbericht und Präsentationsfolien (Holo3 · CentraleSupélec, 2025–2026).' },

  holo: {
    kicker: 'Holo3 · Abschlussarbeit · 2026',
    title: 'Die Kalibrierung von HoloScan bewerten und verbessern',
    brief: ['Holo3 wollte wissen, ob das Kalibrierprotokoll von HoloScan robust ist und ob sich die Messunsicherheit verringern lässt.', 'Ich habe die gesamte Kette modelliert (Kamera, Projektor, Triangulation, Unsicherheiten) und 5 Protokollvarianten an identischen Aufnahmen verglichen, validiert mit einer zertifizierten Kugelstange.', 'Protokoll als solide bestätigt: 108 von 110 Messungen innerhalb des Kriteriums von ±120 µm, Wiederholpräzision < 2 µm. Die Charakterisierung des Kalibrierziels ist der wichtigste Hebel.'],
    lead: 'Ein industrielles 3D-Messsystem mit Streifenprojektion. Ich habe die gesamte Kalibrierkette aufgearbeitet, von der optischen Theorie bis zur Unsicherheitsfortpflanzung, und anschließend fünf Protokollvarianten an identischen Aufnahmen verglichen, validiert mit einer zertifizierten Kugelstange.',
    meta: [
      ['Zeitraum', '2026, nach dem Projekt zu den Erkennungsparametern · Verteidigung am 17.09.2026'],
      ['Rolle', 'F&E-Ingenieur im dualen Studium, mit großer Eigenständigkeit'],
      ['Werkzeuge', 'MATLAB · Excel · 3D-Inspektionssoftware GOM · CalibTool · SensorPhase · Basler-Kameras · Bildmessgeräte von Mitutoyo und Hexagon'],
    ],
    facts: [
      ['2 + 1', 'Kameras + Projektor in HoloScan'],
      ['~2,3 Mio.', '3D-Punkte pro Messung, in ~1 s'],
      ['< 2 µm', 'gemessene Wiederholpräzision an der Kugelstange'],
      ['108 / 110', 'Messungen innerhalb des Kriteriums von ±120 µm, mit aktuellem Kalibrierziel'],
      ['93–155 µm', 'reale Krümmung des Kalibrierziels, von einem idealen Raster ignoriert'],
    ],
    sections: [
      { title: 'Kontext', body: [
        'Holo3 ist ein französisches Technologie-Ressourcenzentrum (CRT) für optische Messtechnik. Es überführt Messtechnologien vom Laborkonzept in die reale Anwendung (Steigerung des TRL). Ursprünglich aus der holografischen Interferometrie kommend, arbeitet das Unternehmen heute an Deflektometrie, Streifenprojektion, digitaler Bildkorrelation und interferometrischer Holografie.',
        'HoloScan ist ein berührungsloses 3D-Messsystem mit zwei Kameras und einem Projektor. Jedes Kamera-Projektor-Paar misst das Objekt per Triangulation aus zwei verschiedenen Blickwinkeln. Eine Messung dauert etwa eine Sekunde und liefert rund 2,3 Millionen Punkte (ein Punkt pro Pixel eines 1920 × 1200-Sensors). Das System vermisst Industriebauteile und erkennt Oberflächenfehler bis zu einem halben Millimeter.',
        'Jedes System wird vor Ort von einem Holo3-Mitarbeiter in etwa einer Stunde kalibriert. Die Frage: Ist das aktuelle Protokoll robust, und lässt es sich verbessern, um die Messunsicherheit und die Größe erkennbarer Fehler zu verringern?',
      ]},
      { title: 'Ziel und Abnahmekriterium', body: [
        'Eine Messung ist genau, wenn sie sowohl richtig (nahe am wahren Wert) als auch präzise (gleicher Wert bei Wiederholung) ist. Beides wurde getrennt bewertet.',
        'Referenz ist eine zertifizierte Kugelstange: 250,1097 mm zwischen den Mittelpunkten der beiden Kugeln. Das Abnahmekriterium von Holo3 hängt von der Diagonale d des gemeinsamen Sichtfelds ab (etwa 600 mm):',
        { eq: 'aktuelles Kriterium: d / 5000 = 600 mm / 5000 = ±120 µm      untersuchtes Ziel: d / 10000 = ±60 µm' },
      ]},
      { title: 'Eine Kamera kalibrieren: vom 3D-Punkt zum Pixel', body: [
        'Das Lochkameramodell (Pinhole) beschreibt den Weg eines Objektpunkts bis zum Pixel in drei Schritten:',
        { ul: [
          'Koordinatenwechsel: Rotation (als Rotationsvektor bestimmt, als Quaternion gespeichert, als Matrix angewendet), dann Translation. Das sind die extrinsischen Parameter.',
          'Projektion auf die Retinaebene, eine Einheit vom optischen Zentrum entfernt: x′ = X/Z und y′ = Y/Z.',
          'Abbildung auf den CMOS-Sensor: Brennweite (fx, fy), optisches Zentrum (Cx, Cy) und Objektivverzeichnung, radial (k₁, k₂) und tangential (p₁, p₂). Das sind die intrinsischen Parameter.',
        ]},
        { eq: 'x″ = x′(1 + k₁r² + k₂r⁴) + 2p₁x′y′ + p₂(r² + 2x′²)      mit r² = x′² + y′²' },
        'In der Praxis wird ein Schachbrett-Kalibrierziel mit 100 Kreuzungspunkten verwendet (theoretisch genügen 36). Die Kreuzungen werden subpixelgenau mit dem Harris-Algorithmus erkannt, der auf dem Grauwertgradienten beruht. Die Einstellungen bestimmen direkt die Erkennungsqualität:',
        { ul: [
          'Fokus: Schwarz-Weiß-Übergang über 1 bis 2 Pixel.',
          'Schärfentiefe: Blende so gewählt, dass der Übergang an den Rändern des Volumens ≤ 4 Pixel bleibt.',
          'Belichtung: mittlerer Weißwert um 220 von 255 Graustufen, ohne Sättigung.',
          'Aufnahme: 15 Bilder (5 Positionen × 3 Ebenen des Volumens; theoretisch würden 12 genügen), dann Optimierung mit Levenberg–Marquardt.',
          'Validierung: Rückprojektionsfehler unter 0,1 Pixel.',
        ]},
      ]},
      { title: 'Den Projektor kalibrieren: Streifenprojektion', body: [
        'Ein Projektor ist eine umgekehrte Kamera (ein DLP-Chip statt eines CMOS-Sensors), das optische Modell ist also dasselbe. Um zu bestimmen, welches Projektorpixel jede Kreuzung beleuchtet, werden sinusförmige Streifenmuster projiziert und von der kalibrierten Kamera erfasst.',
        { eq: 'Iᵢ(x,y) = I₀(x,y) · [1 + m · sin(2π/P · Φ(x,y) + φᵢ)]      φᵢ = 0, π/2, π, 3π/2' },
        { eq: 'Φ = atan2(I₁ − I₃ ; I₂ − I₄)      →      C(x) = P/2π · Φ + P/2' },
        'Jedes Muster wird mit 4 Phasenverschiebungen von π/2 projiziert. Vertikale Streifen liefern eine Koordinate, horizontale die andere, mit immer feineren Perioden (von 2048 bis 32 Pixel) für höhere Genauigkeit. Kamera und Projektor werden mit denselben Aufnahmen kalibriert, mit demselben Kriterium von < 0,1 Pixel.',
      ]},
      { title: 'Triangulation', body: [
        'Für jedes Kamerapixel liegt der Punkt O dort, wo sich Kamerastrahl und Projektorstrahl treffen. Zwei gemessene Geraden schneiden sich nie perfekt, daher wird ein Fehlerterm ε entlang ihres gemeinsamen Lots ergänzt.',
        { eq: '0 = t − k_c·v_c + k_p·(R·v_p) + ε·(v_c ∧ R·v_p) / ‖v_c ∧ v_p‖' },
        't und R sind Translation und Rotation Projektor → Kamera. Das System wird als AX = B mit X = (k_c, k_p, ε/‖v_c ∧ v_p‖) geschrieben und als X = A⁻¹B gelöst. Der gemessene Punkt ist O = k_c · (x′_c, y′_c, 1) im Kamerakoordinatensystem.',
      ]},
      { title: 'Theoretische Studie: Unsicherheitsfortpflanzung', body: [
        'Ich habe das Fortpflanzungsgesetz der Messunsicherheit auf dieses Modell angewendet, um die dominanten Parameter zu finden und die Unsicherheit eines Punkts vorherzusagen.',
        { eq: 'u(f) = √ Σ (∂f/∂xᵢ · Δxᵢ)²' },
        { ul: [
          'Rückprojektionsfehler (~0,02 bis 0,03 px) und Unsicherheit des optischen Zentrums (0,6 bis 1,5 px) von Kamera und Projektor, durch Division durch die Brennweite auf die Retinaebene übertragen.',
          'Quaternion: Δq = 10⁻¹², die Zuverlässigkeit des Rechenalgorithmus.',
          'Translation: thermische Ausdehnung der Kamera-Projektor-Halterung, Δt = D · tᵢ · ΔT.',
          'k_c, k_p und ε als ideal angenommen.',
        ]},
        { eq: 'u(x) ≈ √(k_p²(Δx′_p² + Δy′_p²) + (k_c·Δx′_c)²)      u(z) ≈ k_p · √(Δx′_p² + Δy′_p²)' },
        'Für einen realen Punkt in etwa 1,06 m Entfernung liefert das Modell eine erweiterte Unsicherheit (k = 2) von ±0,81 mm in X, ±0,75 mm in Y und ±0,14 mm in Z für ein einzelnes Pixel. Ein Kugelmittelpunkt wird jedoch aus 16 000 bis 18 500 Punkten geschätzt, sodass sich die Unsicherheit um √N verringert, auf etwa 3 µm. Diese Vorhersage wird unten mit der Messung verglichen.',
      ]},
      { title: 'Experimentelle Methode', body: [
        'Ein zentraler Vorteil der Streifenprojektion: Die 3D-Messung wird nach der Aufnahme berechnet. Ich habe die Kugelstange daher nur einmal in 5 Positionen aufgenommen (2 leicht geneigt, 2 stark geneigt, 1 beliebig) und genau dieselben Bilder mit jeder Kalibriervariante neu ausgewertet. So ändert sich jeweils nur eine Variable.',
        { ul: [
          'Kugelmittelpunkte per Kugel-Fitting in der 3D-Inspektionssoftware GOM.',
          'Maßstabskorrektur über einen Faktor k (Mittelwert der Verhältnisse Referenz/Messung), stets gleich 1 auf 10⁻⁴ genau (0,9990 bis 1,0006).',
          'Kennwert: Differenz zwischen korrigierter Länge und 250,1097 mm, für jede Position und jede Kamera.',
          'Basis: 15 Zielpositionen pro Kalibrierung, ein realistischer Kompromiss für den Industrieeinsatz.',
        ]},
      ]},
      { title: 'Studie 1 · Wo kalibrieren?', body: [
        'Zwei Ansätze wurden verglichen. Beim ersten wird nur im gemeinsamen Sichtfeld beider Kameras und des Projektors kalibriert, dieselben 15 Zielpositionen dienen beiden Kameras. Beim zweiten wird jedes Kamera-Projektor-Paar separat kalibriert (2 × 15 = 30 Aufnahmen).',
        { chart: { c: 'Abweichung an der Kugelstange je nach kalibriertem Feld', series: [['Gemeinsames Feld · Kam. 1', B.commonField.cam1], ['Gemeinsames Feld · Kam. 2', B.commonField.cam2], ['Getrennte Felder · Kam. 1', B.pairFields.cam1], ['Getrennte Felder · Kam. 2', B.pairFields.cam2]] } },
        { table: { c: 'Abweichung zur Referenz (µm)', h: ['', 'Gemeinsames Feld · Kam. 1', 'Gemeinsames Feld · Kam. 2', 'Getrennte Felder · Kam. 1', 'Getrennte Felder · Kam. 2'], r: positionRows(P, K, [['commonField', 'cam1'], ['commonField', 'cam2'], ['pairFields', 'cam1'], ['pairFields', 'cam2']]) } },
        'Die Ergebnisse sind ähnlich. Mit einer Ausnahme (−126,2 µm, getrennte Felder, Kamera 1, Position 4) bleiben alle Messungen innerhalb von ±60 µm. Diese Messung überschreitet sogar leicht das Kriterium von ±120 µm. Die Kalibrierung im gemeinsamen Feld ist die einzige Konfiguration, in der alle zehn Messungen innerhalb von ±50 µm bleiben. Fazit: Eine einzige Serie von Zielpositionen kann beide Kameras kalibrieren.',
      ]},
      { title: 'Studie 2 · Die Kenntnis des Kalibrierziels', body: [
        'Die Kalibrierung stützt sich auf eine „Zieldatei“, die die Position jeder Kreuzung beschreibt. Ich habe das Ziel PC-B (Rastermaß 20 mm) auf zwei Bildmessgeräten vermessen lassen, Mitutoyo und Hexagon, und das System dann mit jeder der beiden Dateien kalibriert.',
        'Die beiden Geräte, im Projekt „Charakterisierung der Bildmessgeräte“ ausführlich verglichen, stimmen in X und Y überein, nicht aber in Z: Das Ziel ist gekrümmt, mit einer Amplitude von 93 µm (Mitutoyo) bzw. 155 µm (Hexagon). Hier geht es um die Auswirkung dieser Abweichung auf die Kalibrierung.',
        { chart: { c: 'Abweichung je nach Zieldatei', series: [['Mitutoyo · Kam. 1', B.mitutoyo.cam1], ['Mitutoyo · Kam. 2', B.mitutoyo.cam2], ['Hexagon · Kam. 1', B.hexagon.cam1], ['Hexagon · Kam. 2', B.hexagon.cam2]] } },
        { table: { c: 'Abweichung zur Referenz (µm)', h: ['', 'Mitutoyo · Kam. 1', 'Mitutoyo · Kam. 2', 'Hexagon · Kam. 1', 'Hexagon · Kam. 2'], r: positionRows(P, K, [['mitutoyo', 'cam1'], ['mitutoyo', 'cam2'], ['hexagon', 'cam1'], ['hexagon', 'cam2']]) } },
        'Ein Wechsel der Zieldatei verschiebt das Ergebnis derselben Aufnahme um bis zu etwa 40 µm. Das Kriterium von ±120 µm bleibt erfüllt, ±60 µm wird für den Großteil der Positionen 1, 2, 3 und 5 erreicht. Position 4 (stark geneigte Stange) bleibt mit rund ±110 µm die schwierigste.',
        { note: 'Wichtigstes Ergebnis der Arbeit: Eine Kalibrierung mit veralteter Zieldatei erzeugt Abweichungen bis −217 µm (Studie 4). Die Charakterisierung des Kalibrierziels wiegt weit mehr als alle getesteten Protokollvarianten.' },
      ]},
      { title: 'Studie 3 · Mehr Bilder, mehr Wiederholbarkeit?', body: [
        'Jede der 15 Zielpositionen wird 1-, 3-, 5- oder 10-mal aufgenommen (15×N). In einer zweiten Variante werden die N Aufnahmen zu einem Bild gemittelt (15×Mn).',
        { table: { c: 'Kalibrierung mit wiederholten Aufnahmen (µm)', h: ['', '15×1 · K1', '15×1 · K2', '15×3 · K1', '15×3 · K2', '15×5 · K1', '15×5 · K2', '15×10 · K1', '15×10 · K2'], r: positionRows(P, K, [['x1', 'cam1'], ['x1', 'cam2'], ['x3', 'cam1'], ['x3', 'cam2'], ['x5', 'cam1'], ['x5', 'cam2'], ['x10', 'cam1'], ['x10', 'cam2']]) } },
        { table: { c: 'Kalibrierung mit gemittelten Bildern (µm)', h: ['', '15×1 · K1', '15×1 · K2', '15×M3 · K1', '15×M3 · K2', '15×M5 · K1', '15×M5 · K2', '15×M10 · K1', '15×M10 · K2'], r: positionRows(P, K, [['x1', 'cam1'], ['x1', 'cam2'], ['m3', 'cam1'], ['m3', 'cam2'], ['m5', 'cam1'], ['m5', 'cam2'], ['m10', 'cam1'], ['m10', 'cam2']]) } },
        'Keine klare Verbesserung. Abgesehen von zwei Einzelfällen (15×5 Kamera 1 und 15×M10 Position 5 Kamera 2) unterscheiden sich die Varianten um weniger als 15 µm. Mehr Wiederholungen bringen der Kalibrierung nichts: Das aktuelle, schnellere Protokoll bleibt die beste Wahl.',
      ]},
      { title: 'Studie 4 · Drei Arten, 150 Bilder zu nutzen', body: [
        '15 Positionen × 10 Aufnahmen, auf drei Arten an einem Kamera-Projektor-Paar ausgewertet: eine globale Kalibrierung mit allen 150 Bildern, 10 Kalibrierungen mit je 15 Bildern und gemittelten Parametern, sowie eine Kalibrierung mit 15 gemittelten Bildern.',
        { table: { c: 'Abweichung zur Referenz, Kamera 1 (µm)', h: ['', '150 Bilder', '10 Kalibrierungen', 'Gemittelte Bilder'], r: positionRows(P, K, [['all150', 'cam1'], ['tenCal', 'cam1'], ['averaged', 'cam1']]) } },
        'Die drei Ansätze unterscheiden sich um weniger als 8 µm, eine Umstellung lohnt sich also nicht. Die insgesamt größeren Abweichungen (bis −217,6 µm an Position 3) stammen von einer veralteten Zieldatei bei dieser Kalibrierung, was Studie 2 bestätigt.',
      ]},
      { title: 'Studie 5 · Nur einen Teil des Feldes kalibrieren', body: [
        'An manchen Standorten lässt sich nicht das ganze Feld kalibrieren. Ich habe daher in 1 Ecke (12 Positionen, das theoretische Minimum), 2 Ecken (24 Positionen) oder 4 Ecken (48 Positionen) kalibriert. Da die Kugelstange außerhalb des kalibrierten Bereichs liegt, dient die mittlere Standardabweichung der Zielkreuzungen als Kennwert.',
        { table: { c: 'Mittlere Standardabweichung je Kreuzung (µm)', h: ['', '1 Ecke · K1', '2 Ecken · K1', '4 Ecken · K1', '1 Ecke · K2', '2 Ecken · K2', '4 Ecken · K2'], r: cornerSigma } },
        'Abgesehen vom Fall „2 Ecken“ bei Kamera 1 liegen die Ergebnisse nahe beieinander. Der Fall mit 1 Ecke ist schwächer, weil er nur das theoretische Minimum an Positionen nutzt, weniger als bei Holo3 üblich. Es genügt, nur den Bereich zu kalibrieren, in dem das Objekt gemessen wird.',
      ]},
      { title: 'Theorie gegen Praxis', body: [
        'Die Kugelstange wird fünfmal in derselben Position gemessen (Position 5, gemeinsames Feld, Kamera 1). Die Unsicherheit Typ A, u = σ/√n, wird mit der vom Modell vorhergesagten Unsicherheit Typ B verglichen.',
        { table: { c: 'Unsicherheit der Kugelmittelpunkte (µm)', h: ['', 'Kugel 1 · Typ A', 'Kugel 1 · Typ B', 'Verhältnis B/A', 'Kugel 2 · Typ A', 'Kugel 2 · Typ B', 'Verhältnis B/A'], r: typeAB } },
        'In X und Y ist die reale Wiederholpräzision 2- bis 3-mal besser als vorhergesagt. In Z ist die Messung etwas schlechter als das Modell (Verhältnis 0,4 bis 0,7). Die Größenordnungen stimmen überein: Das Unsicherheitsmodell ist geeignet, und die Wiederholpräzision von HoloScan liegt unter 2 µm.',
      ]},
      { title: 'Fazit', body: [
        { ul: [
          'Das Kalibrierprotokoll von Holo3 ist solide: Mit aktuellem Kalibrierziel erfüllen 108 von 110 Kugelstangenmessungen das Kriterium von ±120 µm (Überschreitungen: −126,2 und −120,4 µm).',
          'Keine aufwendigere Variante (mehr Bilder, Mittelung, Wiederholungen) verbessert die Kalibrierung. Die aktuelle Kalibrierdauer ist die richtige.',
          'Die Charakterisierung des Kalibrierziels ist der wichtigste Hebel: Ein schlecht beschriebenes Ziel verursacht die größten Abweichungen.',
          'Beide Kameras lassen sich mit denselben Positionen im gemeinsamen Feld kalibrieren, und es genügt, nur den Nutzbereich zu kalibrieren.',
          'Wiederholpräzision unter 2 µm; eine Richtigkeit von ±60 µm wird in einem Teil der Fälle erreicht.',
        ]},
      ]},
      { title: 'Empfehlungen und Ausblick', body: [
        { ul: [
          'Kalibrierziele einmal pro Jahr überprüfen.',
          'Jede Kalibrierung mit einer Kugelstangenmessung kontrollieren: schlechte Kalibrierungen erkennen und ±60 µm anstreben.',
          'Den Einfluss von Temperatur und Alterung auf das Kalibrierziel untersuchen.',
          'Diese Tests auf die Kalibrierung von Deflektometriesystemen übertragen, die wesentlich empfindlicher sind.',
          'Eine einfache Offset-Korrektur funktioniert nicht, da das Messobjekt in vielen Positionen liegen kann.',
        ]},
      ]},
      { title: 'Was ich gelernt habe', body: [
        'Die gesamte optische und mathematische Kette verstehen, bevor man misst. Vergleiche so planen, dass sich nur eine Variable ändert. Ein Ergebnis „keine Verbesserung“ akzeptieren, wenn die Daten es zeigen: Auch das ist für das Unternehmen eine wertvolle Information.',
        'Zur Ethik: Eine Messung nie anpassen, um das gewünschte Ergebnis zu erhalten. Ein Kunde muss ein System erhalten, das dem Versprochenen entspricht, und eine Kontrolle mit der Kugelstange unterstützt das.',
        'Außerdem habe ich die Arbeitsweise eines kleinen Unternehmens kennengelernt, ganz anders als in einem Großkonzern wie Saint-Gobain, mit großer Nähe zwischen den Teams.',
      ]},
    ],
  },

  doe: {
    kicker: 'Holo3 · Ingenieurprojekt · Okt. 2025 – Apr. 2026',
    title: 'Welche Parameter beeinflussen die Erkennung eines Kalibrierziels?',
    brief: ['Die Erkennung der Zielkreuzungen, erster Schritt jeder Kalibrierung, hängt von vielen gekoppelten Parametern ab, die bisher einzeln getestet wurden.', 'Vorstudie an 3 Kalibrierzielen (~1 300 Messungen), dann Einführung von zwei Versuchsplänen im Team (216 → 27 und 432 → 32 Konfigurationen).', 'Die Versuchsplanung reduzierte die Zahl der Versuche und quantifizierte den Einfluss jedes Parameters: Lichtfarbe, Belichtung, Blende und Winkel. Fazit: Alle wirken auf den Schwarz-Weiß-Kontrast des Ziels.'],
    lead: 'Vor jeder Kalibrierung muss eine Kamera die Kreuzungen eines Kalibrierziels präzise erkennen. Ich habe eine Vorstudie an drei Zielen durchgeführt und dann zwei Versuchspläne im Team eingeführt, um den Einfluss von Beleuchtung, Belichtung und Blende zu quantifizieren.',
    meta: [
      ['Zeitraum', 'Okt. 2025 – Apr. 2026 · präsentiert am 28.04.2026'],
      ['Rolle', 'F&E-Ingenieur im dualen Studium · Methode vorgeschlagen und vollständig umgesetzt'],
      ['Werkzeuge', 'Kamera Basler acA1920-40gm · 16-mm-Objektiv · EFFI-FLEX-Beleuchtung · SensorPhase · CalibTool 1.5.1.4 · MATLAB · Excel · ImageJ'],
    ],
    facts: [
      ['~1 300', 'Zielmessungen in der Vorstudie'],
      ['216 → 27', 'Konfigurationen dank des ersten Versuchsplans'],
      ['432 → 32', 'Konfigurationen im zweiten Versuchsplan'],
      ['0,02 px', 'minimale Streuung der Kreuzungen'],
      ['3–5 min', 'Drift nach dem Einschalten der Kamera'],
    ],
    sections: [
      { title: 'Kontext und Fragestellung', body: [
        'Jede Kameramessung beginnt mit der Erkennung der Kreuzungen eines Schachbrett-Kalibrierziels. Die Software CalibTool kombiniert den Harris-Algorithmus mit weiterer Bildverarbeitung. Bis dahin wurden bei Holo3 jeweils nur ein oder zwei Parameter gleichzeitig variiert.',
        'Die Frage: Welche Parameter, außerhalb oder innerhalb der Kamera, beeinflussen Richtigkeit und Präzision der erkannten Position, und wie stark?',
      ]},
      { title: 'Messaufbau', body: [
        { ul: [
          'Kamera Basler acA1920-40gm: monochromer CMOS-Sensor, 1920 × 1200 px (11,33 × 7,13 mm), Pixel von 5,86 µm, sichtbares Spektrum.',
          'Objektiv Basler C11-1620-12M: Festbrennweite 16 mm, Blende f/2 bis f/16.',
          'EFFI-FLEX-Beleuchtung in Blau (465 nm) und Rot (625 nm) sowie eine weiße Lichtquelle.',
          'Optischer Tisch, schwarzes Tuch und Filz gegen Störreflexe.',
          'Aufnahme mit SensorPhase, Erkennung mit CalibTool 1.5.1.4 (Bouguet-Werkzeuge unter MATLAB), Auswertung in MATLAB und Excel.',
        ]},
      ]},
      { title: 'Phase 1 · Vorstudie an drei Kalibrierzielen', body: [
        { table: { c: 'Verwendete Kalibrierziele', h: ['Ziel', 'Schachbrett', 'Kreuzungen', 'Feldgröße'], r: [['Opal', '12 × 9 Felder', 88, '28 mm'], ['PC-B', '11 × 11 Felder', 100, '20 mm'], ['Keramik', '11 × 11 Felder', 100, '5 mm']] } },
        'Sitzung 1: Opal- und PC-B-Ziel, drei Lichtfarben und zwei Belichtungszeiten (nahe der Sättigung, dann halbiert: 1 500 bzw. 750 µs bei weißem Licht). Zwei Serien mit je 25 Messungen, im Abstand von einer Stunde.',
        { ul: [
          'Opal-Ziel: Kontrastverlust bei blauem und rotem Licht; Kreuzungen wegen Reflexen von Rahmen und Tisch nicht auffindbar.',
          'PC-B-Ziel: Standardabweichung 0,02 bis 0,03 px, Min-Max-Spanne 0,1 bis 0,2 px.',
          'Einfluss der Belichtungszeit: etwa 0,05 px, im ungünstigsten Fall 0,1 px.',
          'Systematische Verschiebung je nach Farbe: in x bei Blau, in y bei Rot.',
          'Periodische Streuspitzen unter dem am stärksten beleuchteten Bereich.',
          'Nur ein Ausreißer bei insgesamt etwa 1 300 Messungen.',
        ]},
        'Sitzung 2: schwarzes Tuch und Filz ergänzt, 5 Beleuchtungswinkel (−45°, −10°, 0°, +10°, +45°) sowie Umgebungslicht, also 32 Konfigurationen × 25 Messungen.',
        { table: { c: 'Wiederholbarkeit der Kreuzungsposition (Pixel)', h: ['', 'Opal', 'PC-B'], r: targetStats(['σ Mittelwert', 'σ Maximum', 'Δ Min-Max Mittelwert', 'Δ Min-Max Maximum']) } },
        'Das PC-B-Ziel ist am wiederholgenauesten. Sobald jedoch Konfigurationen miteinander verglichen werden, steigen die Abweichungen um den Faktor 10 (etwa 0,1 px, bis 0,25–0,3 px): Die Beleuchtung verschiebt die erkannte Position tatsächlich. Die Unsicherheit Typ A einer Position bleibt bei 0,012 px (k = 2).',
        'Sitzung 3: Das Keramikziel (5-mm-Felder) ist für CalibTool zu klein. Erkennung in MATLAB mit vordefiniertem Suchbereich: Standardabweichung von etwa 0,008 px.',
        { note: 'Drift beim Einschalten: Eine Messung pro Minute während 1 h nach dem Einschalten zeigt, dass die Kreuzungen 3 bis 5 Minuten lang in y driften und sich dann stabilisieren. Vermutete Ursache: Wärmeausdehnung der Sensorhalterung. In der Praxis sollte sich die Kamera vor dem Kalibrieren stabilisieren.' },
        'Ergebnis von Phase 1: Der Hauptfaktor ist die ungleichmäßige Beleuchtung des Ziels (Leistung, Streuung, Winkel, Auftreffbereich, Lampenform, Reflexe). Da diese Parameter gekoppelt sind, war eine Methode nötig, die sie gemeinsam testet.',
      ]},
      { title: 'Phase 2 · Erster Versuchsplan', body: [
        'Ich habe die statistische Versuchsplanung (DoE) vorgeschlagen, eine im Team neue Methode, um alle Parameter gleichzeitig zu testen und ihre Wechselwirkungen zu messen.',
        { ul: [
          '6 Faktoren: Farbe (3 Stufen), Winkel −45° / 0° / +45° (3), Belichtungszeit (3), Fremdreflexe (mit oder ohne), Glanzreflex (zentriert oder nicht), Lichtquellenform (rechteckig oder punktförmig).',
          'Vollfaktorieller Plan: 216 Konfigurationen, reduziert auf 27 Versuche.',
          'Versuchsreihenfolge randomisiert, Variablen zwischen −1 und +1 kodiert.',
          '30 Aufnahmen pro Konfiguration: Der Mittelpunkt dient der Richtigkeit (verglichen mit einer Referenzkonfiguration nahe einer Standardkalibrierung), die Extrempunkte der Präzision.',
          'Effekte in Excel berechnet, jeweils mit Fehlerbalken dargestellt. Ein Faktor gilt als vernachlässigbar, wenn sein Fehlerbalken größer als der Effekt ist.',
        ]},
        { table: { c: 'Ergebnisse des ersten Versuchsplans', h: ['', 'Richtigkeit', 'Präzision'], r: [['Einflussfaktor', 'Lichtfarbe', 'Belichtungszeit'], ['Werte (Pixel)', '−0,17 bis +0,15 (x, y) · bis 0,25 als Norm', '0,02 bis 0,09']] } },
        'Grenzen: Der symmetrische Winkel (−45° / +45°) konnte einen Effekt verdecken, und die Blende wurde nicht getestet.',
      ]},
      { title: 'Zweiter Versuchsplan', body: [
        { ul: [
          'Blende (3 Stufen) und 8- bzw. 16-Bit-Bildtiefe ergänzt.',
          'Beleuchtungswinkel von 0° bis 45°, um die Symmetrie aufzuheben.',
          'Belichtung auf konstanten Kontrast eingestellt: Weiß bei 220 in 8 Bit, bei 57 000 in 16 Bit.',
          'Vollfaktorieller Plan: 432 Konfigurationen, reduziert auf 32 Versuche.',
        ]},
        { table: { c: 'Ergebnisse des zweiten Versuchsplans', h: ['', 'Richtigkeit', 'Präzision'], r: [['Einflussfaktoren', 'Lichtfarbe', 'Blende · Beleuchtungswinkel'], ['Werte (Pixel)', '−0,17 bis +0,15', '0,02 bis 0,04']] } },
      ]},
      { title: 'Interpretation: der Schwarz-Weiß-Kontrast als roter Faden', body: [
        'Die signifikanten Faktoren haben eines gemeinsam: Sie steuern den Kontrast, den die Kamera an der Grenze zwischen schwarzen und weißen Feldern tatsächlich sieht, genau dort, wo die Kreuzung erkannt wird.',
        { ul: [
          'Die Lichtfarbe wirkt auf die Richtigkeit: Verschiebung um etwa ein Zehntel Pixel.',
          'Belichtungszeit, Blende und Beleuchtungswinkel wirken auf die Präzision, im Bereich eines Hundertstel Pixels.',
          'Bei konstantem Kontrast (zweiter Plan) sinkt die Streuung von 0,02–0,09 px auf 0,02–0,04 px.',
        ]},
        'Kurz gesagt: Die Erkennung ist sehr präzise (Hundertstel Pixel), etwas weniger richtig (Zehntel Pixel), und der Kontrast ist der Hebel, den es zu beherrschen gilt.',
      ]},
      { title: 'Phase 3 · Globale oder lokale Kalibrierung?', body: [
        'Lassen sich die intrinsischen Parameter einer Kamera bestimmen, ohne ihr ganzes Sichtfeld abzudecken? Weitfeldaufbau auf 5 Ebenen, mit Umgebungslicht. Die „globale“ Referenz nutzt 625 Bilder. Danach wird das Feld in 8 Teilbereiche mit je 15 Bildern aufgeteilt, mit leicht oder stark geneigtem Ziel, um „lokale“ intrinsische Parameter zu berechnen.',
        { table: { c: 'Globale intrinsische Referenzparameter (Pixel für f und c)', h: globalIntrinsics.head, r: [['Wert', ...globalIntrinsics.value], ['Unsicherheit', ...globalIntrinsics.unc]] } },
        'Ergebnis: Eine lokale Kalibrierung ist der globalen gleichwertig. Die Neigung liefert ähnliche Werte, aber bei stark geneigtem Ziel sind die Unsicherheiten geringer. Das wurde später an HoloScan bestätigt (Studie 5 der Abschlussarbeit).',
      ]},
      { title: 'Fazit und was ich gelernt habe', body: [
        { ul: [
          'Das Kalibrierverfahren von Holo3 ist sehr gut. Verbesserungspotenzial liegt in der Beherrschung von Beleuchtung und Kontrast.',
          'Zu überwachende Parameter: Lichtfarbe und Beleuchtungswinkel, Belichtungszeit, Blende.',
          'Die Kamera vor dem Kalibrieren einige Minuten stabilisieren lassen.',
          'Eine Kalibrierung auf einem Teil des Feldes funktioniert, vorzugsweise mit stark geneigtem Ziel.',
        ]},
        'Dieses Projekt hat mir gezeigt, wie man eine Versuchskampagne strukturiert: Variablen und Bereiche festlegen, randomisieren, kodieren und einen Effekt an seiner Unsicherheit messen statt an der Intuition. Zudem bereitete es die Abschlussarbeit zu HoloScan vor.',
      ]},
    ],
  },
  vision: {
    kicker: 'Holo3 · Parallel zum HoloScan-Projekt · 2026',
    title: 'Liefern zwei Bildmessgeräte dasselbe Ergebnis?',
    brief: ['Auf zwei Bildmessgeräten gemessen, lieferte dasselbe Kalibrierziel unterschiedliche Ergebnisse. Welchem Gerät ist zu trauen, und sind die Geräte gleichwertig?', 'Ich habe das Mitutoyo-Gerät an einem Referenzziel qualifiziert und dann beide Geräte Kreuzung für Kreuzung am PC-B-Ziel verglichen, mit dem HoloScan kalibriert wird.', 'Wiederholpräzision der Mitutoyo im Bereich eines Mikrometers. Die Geräte stimmen in X und Y überein, weichen in Z aber bei der Krümmung des Ziels ab: eine Differenz, die sich mit bis zu ~40 µm auf die HoloScan-Kalibrierung auswirkt.'],
    lead: 'Ein reines Messtechnikprojekt parallel zur HoloScan-Kalibrierung: ein Messgerät prüfen, bevor man ihm vertraut, und verstehen, woher die Abweichungen zwischen zwei Geräten kommen.',
    meta: [
      ['Zeitraum', '2026, parallel zum HoloScan-Projekt'],
      ['Rolle', 'F&E-Ingenieur im dualen Studium'],
      ['Werkzeuge', 'Bildmessgeräte von Mitutoyo und Hexagon · keramisches Referenzziel · PC-B-Ziel · MATLAB · Excel'],
    ],
    facts: [
      ['~1 µm', 'Wiederholpräzision der Mitutoyo am Referenzziel'],
      ['±20 nm', 'Toleranz des Rastermaßes des Referenzziels (7 mm)'],
      ['5 / 2 µm', 'Standardabweichung zwischen den Geräten in X / Y'],
      ['93 vs 155 µm', 'Krümmung des Ziels laut Mitutoyo / Hexagon'],
      ['~40 µm', 'maximale Auswirkung auf die HoloScan-Kalibrierung'],
    ],
    sections: [
      { title: 'Kontext und Fragestellung', body: [
        'Die Kalibrierung von HoloScan stützt sich auf eine Datei mit der tatsächlichen Position jeder Zielkreuzung. Diese Datei stammt aus einer Messung auf einem Bildmessgerät. Dasselbe Ziel lieferte jedoch auf zwei Geräten (Mitutoyo und Hexagon) unterschiedliche Ergebnisse.',
        'Die Frage: Sind die beiden Geräte gleichwertig, und welche Messung des Ziels sollte verwendet werden?',
      ]},
      { title: 'Schritt 1 · Qualifizierung des Mitutoyo-Geräts', body: [
        'Bevor man zwei Geräte vergleicht, muss man die Leistung jedes einzelnen kennen. Ich habe ein keramisches Referenzziel vermessen, dessen Rastermaß von 7 mm auf ±20 nm bekannt ist, also eine Referenz, die weit genauer ist als das Gerät selbst.',
        { ul: [
          'Kreuzungen des Referenzziels 10-mal gemessen.',
          'Wiederholpräzision für jede Achse berechnet.',
        ]},
        { table: { c: 'Wiederholunsicherheit der Mitutoyo (10 Messungen)', h: ['Achse', 'X', 'Y', 'Z'], r: [['Unsicherheit (µm)', 0.5, 0.7, 1.4]] } },
        'Das Mitutoyo-Gerät misst also mit einer Wiederholpräzision im Bereich eines Mikrometers, mehr als ausreichend, um ein Kalibrierziel zu charakterisieren.',
      ]},
      { title: 'Schritt 2 · Vergleich der beiden Geräte', body: [
        'Anschließend habe ich die Messungen des PC-B-Ziels (Rastermaß 20 mm) beider Geräte Kreuzung für Kreuzung verglichen.',
        { ul: [
          'In X und Y stimmen die Geräte überein: Standardabweichung von 5 µm in X und 2 µm in Y.',
          'In Z ist das Ziel nicht eben, sondern gekrümmt, und die Geräte messen nicht dieselbe Amplitude: 93 µm (Mitutoyo), 155 µm (Hexagon) (z_max − z_min).',
        ]},
        'In der Ebene sind die Geräte also gleichwertig; den Unterschied macht die Messung der Krümmung.',
      ]},
      { title: 'Schritt 3 · Auswirkung auf die Kalibrierung', body: [
        'Um zu prüfen, ob diese Abweichung in der Praxis zählt, habe ich HoloScan mit beiden Dateien auf denselben Aufnahmen kalibriert und das Ergebnis an der zertifizierten Kugelstange überprüft.',
        'Ein Wechsel der Datei verschiebt die Messung der Kugelstange um bis zu etwa 40 µm. Beide Kalibrierungen bleiben innerhalb des Kriteriums von ±120 µm: Die Abweichung ist real, für die Streifenprojektion aber kein Ausschlusskriterium. Die Detailergebnisse stehen in Studie 2 des HoloScan-Projekts.',
      ]},
      { title: 'Fazit und Empfehlungen', body: [
        { ul: [
          'Ein Messgerät muss an einem Normal qualifiziert werden, bevor es als Referenz dient.',
          'Die reale Geometrie des Ziels, vor allem seine Krümmung, ist der wichtigste Hebel für die Kalibrierqualität.',
          'Empfehlung: Kalibrierziele einmal pro Jahr prüfen und den Einfluss der Temperatur auf ihre Form untersuchen.',
          'Für empfindlichere Verfahren wie die Deflektometrie würde die Abweichung zwischen den Geräten entscheidend.',
        ]},
      ]},
      { title: 'Was ich gelernt habe', body: [
        'Einem Messgerät nie ohne Vergleich mit einer Referenz vertrauen und immer herausfinden, auf welcher Achse und warum zwei Messungen abweichen, bevor man Schlüsse zieht.',
      ]},
    ],
  },
}
