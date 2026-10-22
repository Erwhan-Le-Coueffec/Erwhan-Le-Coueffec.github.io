import { media as M } from './media'

export const de = {
  kicker: 'CentraleSupélec · Abschlussjahr Photonik & Nanosysteme · 2025–2026',
  title: 'Laborpraktika und Simulationsprojekte',
  lead: 'Was ich in meinem Spezialisierungsjahr aufgebaut, gemessen und simuliert habe: vier Versuche am optischen Tisch und fünf Projekte zur numerischen Simulation. Gruppenarbeiten sind entsprechend gekennzeichnet.',
  groups: { lab: 'Versuche am optischen Tisch', sim: 'Numerische Simulation' },
  labels: { date: 'Datum', team: 'Team', tools: 'Ausrüstung & Werkzeuge' },
  solo: 'Einzelarbeit',
  group: 'Gruppenarbeit (3 Studierende)',
  groupN: 'Gruppenarbeit',
  items: [
    {
      id: 'diode-dfb', kind: 'lab', title: 'Dynamik einer DFB-Laserdiode bei 1550 nm', date: 'Februar 2026', team: 'group',
      tools: 'DFB-Diode LasersCom 1550 nm · temperaturgeregelte Halterung und Treiber von Thorlabs · optischer Spektrumanalysator Anritsu · 12-GHz-Photodiode · HF-Spektrumanalysator Rohde & Schwarz · Oszilloskop Tektronix · per Arduino gesteuertes variables Dämpfungsglied',
      summary: 'Statische und dynamische Charakterisierung einer Telekom-Laserdiode und Untersuchung ihrer Destabilisierung durch optische Rückkopplung.',
      figures: [
        { src: M.laserSpectre, alt: 'Mit dem optischen Spektrumanalysator gemessenes Spektrum der DFB-Diode', cap: 'Optisches Spektrum bei 20 °C und 20 mA: Linie bei 1549,713 nm.' },
        { src: M.laserRelaxation, alt: 'Quadrat der Relaxationsfrequenz in Abhängigkeit vom Strom, mit linearer Regression', cap: 'Quadrat der Relaxationsoszillationsfrequenz über dem Strom: R² = 0,9961.' },
      ],
      body: [
        { ul: [
          'L-I-Kennlinie bei 20 °C (20 Punkte): Schwelle bei etwa 6,5 mA, gegenüber 7,9 mA laut Datenblatt bei 25 °C. 11 Kennlinien zwischen 15 und 25 °C zeigen, dass die Schwelle mit der Temperatur steigt.',
          'Optisches Spektrum: Hauptlinie bei 1549,713 nm (−8,93 dBm) und Seitenmodenunterdrückung von 53 dB.',
          'Abstimmbarkeit: Wellenlängenverschiebung in Abhängigkeit vom Strom (bei 20 °C) und von der Temperatur (bei 20 mA) gemessen.',
          'Relaxationsoszillationen am HF-Analysator, von etwa 1,5 bis 8,5 GHz zwischen 7 und 20 mA. Das Quadrat ihrer Frequenz steigt linear mit dem Strom (R² = 0,9961), wie von der Theorie vorhergesagt.',
          'Optische Rückkopplung bei 15 mA: Übergang von einem stationären in einen periodischen Zustand, wenn die zurückgeführte Leistung steigt (bis etwa 40 µW).',
        ]},
        { note: 'Gegenprobe: Die Gerade f² = 5,22·I − 32,8 wird bei I ≈ 6,3 mA null und trifft damit die unabhängig an der L-I-Kennlinie gemessene Schwelle (~6,5 mA).' },
      ],
    },
    {
      id: 'raman', kind: 'lab', title: 'Raman-Spektroskopie im Freistrahl', date: 'April 2026', team: 'group',
      tools: 'Fasergekoppelter grüner Laser · Interferenzfilter · Notch- und Edge-Filter · Fokussierlinse · Fasereinkopplung in ein Raman-Spektrometer',
      summary: 'Kompletter Aufbau eines Raman-Experiments in Rückstreuung und Identifizierung unbekannter Kunststoffe anhand ihrer Spektren.',
      figures: [
        { src: M.ramanMontage, alt: 'Raman-Freistrahlaufbau auf einem optischen Tisch mit eingeschaltetem grünem Laser', cap: 'Der aufgebaute Versuch mit eingeschaltetem Laser (Gruppenfoto).' },
        { src: M.ramanSpectre, alt: 'Rohes Raman-Spektrum einer Kunststoffprobe', cap: 'Rohspektrum einer Probe: Restlaserlinie bei 0 cm⁻¹, Fluoreszenzuntergrund und Raman-Banden.' },
      ],
      body: [
        'Der Aufbau entstand von der Quelle aus in etwa 1,5 Stunden, zunächst mit einer sichereren Weißlichtlampe justiert. Der Laser durchläuft einen Interferenzfilter, wird an einem Spiegel und am Filter reflektiert und auf die Probe fokussiert. Das rückgestreute Licht passiert einen Notch- oder Edge-Filter, der die Laserlinie entfernt, bevor es in die Spektrometerfaser gelangt.',
        { ul: [
          'Notch- und Edge-Filter am Spektrum einer Weißlichtquelle verglichen; das Neigen eines Filters verschiebt seine Grenzwellenlänge.',
          '8 Kunststoffproben gemessen und mit Referenzspektren verglichen: 2 als PVC, 3 als PS, 1 als PMMA, 1 als PET identifiziert, 1 nicht identifizierbar.',
          'Laserschutzregeln angewendet: wellenlängenspezifische Schutzbrille, Raumlicht während der Justage eingeschaltet.',
        ]},
        'Bekannte Einschränkung: Eine neue, noch unbekannte Erfassungssoftware lieferte verrauschte Spektren. Die Identifizierung gelang dennoch über die charakteristischen Banden, eine Basislinienkorrektur hätte die Auswertung aber verbessert.',
      ],
    },
    {
      id: 'holographie', kind: 'lab', title: 'Aufnahme eines Hologramms', date: 'Februar 2026', team: 'group',
      tools: 'Frequenzverdoppelter Nd:YAG-Laser (532 nm) · 50/50-Strahlteiler · Raumfilter (Mikroskopobjektiv + Lochblende) · Spiegel · holografische Silberhalogenidplatte · Entwicklungsbäder',
      summary: 'Aufbau, Belichtung und Entwicklung des Hologramms eines Metallteils und Rekonstruktion seines 3D-Bildes.',
      figures: [
        { src: M.hologramme, alt: 'Rekonstruiertes Bild eines Metallteils, sichtbar durch die grün beleuchtete holografische Platte', cap: 'Das erhaltene Hologramm: Das 3D-Bild des Metallteils erscheint in der mit dem 532-nm-Laser beleuchteten Platte.' },
      ],
      body: [
        { ul: [
          'Aufteilung in Referenz- und Objektstrahl; beide Strahlen werden per Raumfilter aufgeweitet und gesäubert.',
          'Referenzstrahl trifft unter etwa 45° zum Objektstrahl auf die Platte; das Objekt streut Licht zur Platte.',
          'Belichtung nach E = P × t ausgelegt, für eine Energie von 50 bis 300 µJ/cm² bei wenigen mW.',
          'Arbeit in der Dunkelkammer, ohne Vibration oder Bewegung während der Belichtung; Entwicklung (Entwickler, Stoppbad, Fixierer, Spülen, Trocknen).',
          'Rekonstruktion durch erneute Beleuchtung der Platte mit demselben Laser in derselben Ausrichtung: Das 3D-Bild des Teils erscheint mit seinen Details.',
        ]},
        'Versuchsprotokoll zu zweit verfasst, von der Strahlaufweitung bis zur Rekonstruktion.',
      ],
    },
    {
      id: 'pockels', kind: 'lab', title: 'Pockels-Effekt und elektrooptische Modulation', date: '2025–2026', team: 'groupN',
      tools: 'He-Ne-Laser 633 nm · Pockels-Zelle LiNbO₃ mit Hochspannungstreiber · Polarisatoren und λ/4-Platte · verstärkte Detektion · Oszilloskop · Lautsprecher',
      summary: 'Intensitätsmodulation eines Lasers mit einem Lithiumniobat-Kristall im Sénarmont-Aufbau, bis hin zur Übertragung eines Audiosignals.',
      body: [
        { ul: [
          'Sénarmont-Aufbau: Polarisator unter 45° zu den Kristallachsen, Viertelwellenplatte und Analysator, um Phasenmodulation in Intensitätsmodulation umzuwandeln.',
          'Halbwellenspannung Vπ auf zwei Arten gemessen: statisch (0 bis 400 V) und dynamisch, über die Frequenzverdopplung bei 1 kHz an einem Extremum der Übertragungsfunktion.',
          'Übertragung eines Audiosignals von einem Computer über den Laserstrahl zu einem Lautsprecher, im linearen Arbeitspunkt.',
          'Bestimmung des elektrooptischen Koeffizienten r₂₂ und Vergleich mit dem Tabellenwert.',
        ]},
        { table: { c: 'Ergebnisse', h: ['', 'Gemessen', 'Theorie / Tabelle'], r: [['Halbwellenspannung Vπ', '200 V', '310 V'], ['Koeffizient r₂₂', '9,95 pm/V', '6,4 pm/V']] } },
        'Die Abweichung (etwa 55 % bei r₂₂) liegt in der richtigen Größenordnung. Sie stammt vermutlich von den realen Kristallabmessungen und der Ablesegenauigkeit der Auslöschungspunkte.',
      ],
    },
    {
      id: 'photorefractif', kind: 'sim', title: 'Laserausbreitung in einem photorefraktiven Medium', date: '2025–2026', team: 'solo',
      tools: 'MATLAB / Python · finite Differenzen · implizites Runge-Kutta · Split-Step-Fourier-BPM',
      summary: 'Zwei aufeinander aufbauende Projekte: Entstehung des Raumladungsfeldes in einem Kristall (Kukhtarev-Modell) und nichtlineare Ausbreitung des Strahls.',
      body: [
        { ul: [
          'Isolierendes Medium (ein Ladungsträgertyp): Diskretisierung mit finiten Differenzen, tridiagonales System in jedem Zeitschritt gelöst, Konvergenzstudie des Gitters (von 40 × 50 bis 4 000 × 5 000 Punkte) und Einfluss von Strahlgröße, Intensität und Pulsdauer.',
          'Halbleiter InP:Fe (Elektronen und Löcher): steifes System mit implizitem Runge-Kutta gelöst und mit einer analytischen Lösung verglichen, maximale relative Abweichung 0,025 %.',
          'Brechungsindexänderung über den Pockels-Effekt, dann Ausbreitung mit der Beam Propagation Method (Beugung im Fourier-Raum, Nichtlinearität im Ortsraum): Selbstkollimation des Strahls im Kristall.',
        ]},
      ],
    },
    {
      id: 'reservoir', kind: 'sim', title: 'Photonisches neuromorphes Rechnen: Reservoir Computing mit Verzögerung', date: '2025–2026', team: 'solo',
      tools: 'Python · NumPy · SciPy',
      summary: 'Simulation eines optoelektronischen Oszillators (1550-nm-Laser, Mach-Zehnder-Modulator, Faser), der als neuronales Netz einen nichtlinearen WLAN-Kanal entzerrt.',
      body: [
        { eq: 'T·dx/dt + x = β·sin²(x(t − τ) + γ·u(t) + φ₀)      T = 250 ns, τ = 5 µs, β = 0,75, γ = 0,01, φ₀ = π/8' },
        { ul: [
          'Integration der Verzögerungsdifferentialgleichung mit einem Adams-Prädiktor-Korrektor 4. Ordnung (Schrittweite 10 ns, 500 µs), inklusive Vorgeschichte auf [−τ, 0].',
          'Vorverarbeitung: Halteglied nullter Ordnung, dann zufällige ±1-Maske mit θ = 50 ns, also 100 zeitlich gemultiplexte virtuelle Knoten.',
          'Kanalmodell: lineares Filter mit 10 Koeffizienten, kubische Nichtlinearität und weißes Gaußrauschen von 12 bis 32 dB SNR, Symbole ±1, ±3.',
          'Training der Ausgabeschicht per Moore-Penrose-Pseudoinverse (3 000 Trainings-, 10 000 Testsymbole, 100 Einschwingsymbole), Bewertung über die Symbolfehlerrate.',
        ]},
      ],
    },
    {
      id: 'monte-carlo', kind: 'sim', title: 'Monte-Carlo-Methoden', date: '2025–2026', team: 'solo',
      tools: 'Python · NumPy · Matplotlib',
      summary: 'Erzeugung von Wahrscheinlichkeitsverteilungen und statistische Schätzungen, von der Gaußverteilung bis zum Metropolis-Hastings-Verfahren.',
      body: [
        { table: { c: 'Ergebnisse aus der erneuten Ausführung meines Codes', h: ['Aufgabe', 'Methode', 'Ergebnis'], r: [
          ['Gaußverteilung', 'Box-Muller (10⁶ Ziehungen)', 'Mittelwert 0,002 · Varianz 0,998 (Theorie: 0 und 1)'],
          ['Nicht-Standardverteilung', 'Verwerfungsmethode, exponentielle Hüllkurve M = 12', 'Annahmerate 11,6 %'],
          ['Fläche des Einheitskreises', '1 000 × 10 000 Punkte', 'π geschätzt zu 3,1417 ± 0,016 · Bias 7·10⁻⁵'],
          ['Zerfallskette X → Y', 'Binomiale Ziehungen, 100 Läufe', 'stimmt mit der Lösung über die Matrixexponentialfunktion überein'],
          ['Dichte π_α (α = 1)', 'Metropolis-Hastings / Verwerfungsmethode', 'E[X] = 0,597 / 0,636 (exakt: 0,6065)'],
        ]}},
        'Metropolis-Hastings benötigte 1 500 Iterationen (davon 500 zum Einschwingen) gegenüber 2 063 Ziehungen bei der Verwerfungsmethode, für dieselbe Stichprobe von 1 000 Werten.',
      ],
    },
    {
      id: 'chua', kind: 'sim', title: 'Kohärenzresonanz im chaotischen Chua-Schaltkreis', date: '2025–2026', team: 'solo',
      tools: 'Python · NumPy · Matplotlib',
      summary: 'Vergleich deterministischer und stochastischer Integrationsverfahren an einem chaotischen System und Untersuchung rauschinduzierter Sprünge zwischen Attraktoren.',
      body: [
        { ul: [
          'Euler-, Heun- (RK2) und Runge-Kutta-Verfahren 4. Ordnung: zwei getrennte chaotische Attraktoren je nach Anfangsbedingung (±2, 0, 0), ohne Wechsel zwischen ihnen.',
          'Euler-Maruyama- und stochastisches Heun-Verfahren, zunächst ohne Rauschen validiert, dann für D² = 0,0004, 0,0064 und 0,0256: Das Rauschen löst Sprünge zwischen den Attraktoren aus.',
          'Robuste Erkennung der Übergänge mit Hysterese-Schwellen (±0,5) nach einer anfänglichen Einschwingphase.',
        ]},
      ],
    },
  ],
}
