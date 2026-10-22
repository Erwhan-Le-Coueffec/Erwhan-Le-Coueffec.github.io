import { media as M } from './media'

export const fr = {
  kicker: 'CentraleSupélec · 3e année Photonique & Nano-systèmes · 2025–2026',
  title: 'Travaux pratiques et bureaux d’études',
  lead: 'Ce que j’ai monté, mesuré et simulé pendant mon année de spécialisation : quatre manipulations sur banc optique et cinq bureaux d’études de simulation numérique. Les travaux de groupe sont signalés comme tels.',
  groups: { lab: 'Manipulations sur banc optique', sim: 'Simulation numérique' },
  labels: { date: 'Date', team: 'Équipe', tools: 'Matériel & outils' },
  solo: 'Individuel',
  group: 'Travail de groupe (3 étudiants)',
  groupN: 'Travail de groupe',
  items: [
    {
      id: 'diode-dfb', kind: 'lab', title: 'Dynamique d’une diode laser DFB à 1550 nm', date: 'Février 2026', team: 'group',
      tools: 'Diode DFB LasersCom 1550 nm · monture et driver thermorégulés Thorlabs · analyseur de spectre optique Anritsu · photodiode 12 GHz · analyseur de spectre RF Rohde & Schwarz · oscilloscope Tektronix · atténuateur variable piloté par Arduino',
      summary: 'Caractérisation statique et dynamique d’une diode laser télécom, puis étude de sa déstabilisation par réinjection optique.',
      figures: [
        { src: M.laserSpectre, alt: 'Spectre optique de la diode DFB mesuré à l’analyseur de spectre optique', cap: 'Spectre optique à 20 °C et 20 mA : raie à 1549,713 nm.' },
        { src: M.laserRelaxation, alt: 'Carré de la fréquence de relaxation en fonction du courant, avec régression linéaire', cap: 'Carré de la fréquence des oscillations de relaxation en fonction du courant : R² = 0,9961.' },
      ],
      body: [
        { ul: [
          'Courbe L-I à 20 °C (20 points) : seuil d’environ 6,5 mA, contre 7,9 mA annoncés à 25 °C par la fiche technique. 11 courbes entre 15 et 25 °C montrent le seuil augmenter avec la température.',
          'Spectre optique : raie principale à 1549,713 nm (−8,93 dBm) et taux de suppression des modes secondaires de 53 dB.',
          'Accordabilité : décalage de la longueur d’onde mesuré en fonction du courant (à 20 °C) et de la température (à 20 mA).',
          'Oscillations de relaxation observées à l’analyseur RF, d’environ 1,5 à 8,5 GHz entre 7 et 20 mA. Leur fréquence au carré varie linéairement avec le courant (R² = 0,9961), comme le prévoit la théorie.',
          'Réinjection optique à 15 mA : passage d’un régime stationnaire à un régime périodique en augmentant la puissance renvoyée dans le laser (jusqu’à ~40 µW).',
        ]},
        { note: 'Vérification croisée : la droite f² = 5,22·I − 32,8 s’annule à I ≈ 6,3 mA, ce qui retrouve le seuil mesuré indépendamment sur la courbe L-I (~6,5 mA).' },
      ],
    },
    {
      id: 'raman', kind: 'lab', title: 'Spectroscopie Raman en espace libre', date: 'Avril 2026', team: 'group',
      tools: 'Laser vert fibré · filtre interférentiel · filtres Notch et Edge · lentille de focalisation · injection fibrée vers un spectromètre Raman',
      summary: 'Construction complète d’un montage Raman en rétrodiffusion, puis identification de plastiques inconnus à partir de leur spectre.',
      figures: [
        { src: M.ramanMontage, alt: 'Montage Raman en espace libre sur table optique, laser vert allumé', cap: 'Le montage réalisé, laser allumé (photo de groupe).' },
        { src: M.ramanSpectre, alt: 'Spectre Raman brut d’un échantillon de plastique', cap: 'Spectre brut d’un échantillon : raie laser résiduelle à 0 cm⁻¹, fond de fluorescence et bandes Raman.' },
      ],
      body: [
        'Le montage a été construit à partir de la source, en environ 1 h 30, d’abord avec une lampe blanche plus sûre pour l’alignement. Le laser traverse un filtre interférentiel, se réfléchit sur un miroir et sur le filtre, puis est focalisé sur l’échantillon. La lumière rétrodiffusée passe par un filtre Notch ou Edge pour éliminer la raie laser avant d’entrer dans la fibre du spectromètre.',
        { ul: [
          'Comparaison des filtres Notch et Edge sur le spectre d’une lumière blanche ; l’inclinaison d’un filtre décale sa longueur d’onde de coupure.',
          '8 échantillons de plastique mesurés et comparés à des spectres de référence : 2 identifiés comme PVC, 3 comme PS, 1 comme PMMA, 1 comme PET, 1 non identifiable.',
          'Règles de sécurité laser appliquées : lunettes adaptées à la longueur d’onde, lumière de la salle allumée pendant l’alignement.',
        ]},
        'Limite assumée : un nouveau logiciel d’acquisition, que personne ne maîtrisait encore, a donné des spectres bruités. L’identification reste possible grâce aux bandes caractéristiques, mais une soustraction de ligne de base aurait amélioré l’analyse.',
      ],
    },
    {
      id: 'holographie', kind: 'lab', title: 'Enregistrement d’un hologramme', date: 'Février 2026', team: 'group',
      tools: 'Laser Nd:YAG doublé (532 nm) · séparatrice 50/50 · filtres spatiaux (objectif de microscope + trou de filtrage) · miroirs · plaque holographique argentique · bains de développement',
      summary: 'Montage, exposition et développement de l’hologramme d’une pièce métallique, puis reconstruction de l’image en 3D.',
      figures: [
        { src: M.hologramme, alt: 'Image reconstruite d’une pièce métallique visible à travers la plaque holographique éclairée en vert', cap: 'L’hologramme obtenu : l’image 3D de la pièce métallique apparaît dans la plaque éclairée par le laser à 532 nm.' },
      ],
      body: [
        { ul: [
          'Séparation du faisceau en voie de référence et voie objet ; chaque voie est élargie et nettoyée par filtrage spatial.',
          'Faisceau de référence envoyé sur la plaque à environ 45° du faisceau objet ; l’objet diffuse la lumière vers la plaque.',
          'Exposition dimensionnée par E = P × t, avec une énergie de 50 à 300 µJ/cm² pour une puissance de quelques mW.',
          'Travail en salle noire, sans vibration ni mouvement pendant la pose ; développement (révélateur, arrêt, fixateur, rinçage, séchage).',
          'Reconstruction en rééclairant la plaque avec le même laser, dans la même orientation : l’image 3D de la pièce est restituée avec ses détails.',
        ]},
        'Protocole expérimental rédigé en binôme, de l’expansion du faisceau à la reconstruction.',
      ],
    },
    {
      id: 'pockels', kind: 'lab', title: 'Effet Pockels et modulation électro-optique', date: '2025–2026', team: 'groupN',
      tools: 'Laser He-Ne 633 nm · cellule de Pockels LiNbO₃ et générateur haute tension · polariseurs et lame λ/4 · détection amplifiée · oscilloscope · haut-parleur',
      summary: 'Modulation d’intensité d’un laser par un cristal de niobate de lithium en montage de Sénarmont, jusqu’à la transmission d’un signal audio.',
      body: [
        { ul: [
          'Montage de Sénarmont : polariseur à 45° des axes du cristal, lame quart d’onde et analyseur, pour convertir une modulation de phase en modulation d’intensité.',
          'Mesure de la tension demi-onde Vπ par deux méthodes : en continu (0 à 400 V) et en dynamique, par doublement de fréquence à 1 kHz sur un extremum de la fonction de transfert.',
          'Transmission d’un signal audio d’un ordinateur vers un haut-parleur via le faisceau laser, au point de fonctionnement linéaire.',
          'Détermination du coefficient électro-optique r₂₂ et comparaison à la valeur tabulée.',
        ]},
        { table: { c: 'Résultats', h: ['', 'Mesuré', 'Théorique / tabulé'], r: [['Tension demi-onde Vπ', '200 V', '310 V'], ['Coefficient r₂₂', '9,95 pm/V', '6,4 pm/V']] } },
        'L’écart (environ 55 % sur r₂₂) reste dans le bon ordre de grandeur. Il vient probablement des dimensions réelles du cristal et de la précision de lecture des extinctions.',
      ],
    },
    {
      id: 'photorefractif', kind: 'sim', title: 'Propagation laser dans un milieu photoréfractif', date: '2025–2026', team: 'solo',
      tools: 'MATLAB / Python · différences finies · Runge-Kutta implicite · BPM split-step Fourier',
      summary: 'Deux bureaux d’études enchaînés : formation du champ de charge d’espace dans un cristal (modèle de Kukhtarev), puis propagation non linéaire du faisceau.',
      body: [
        { ul: [
          'Milieu isolant (un seul type de porteurs) : discrétisation par différences finies, système tridiagonal résolu à chaque pas de temps, étude de convergence du maillage (de 40 × 50 à 4 000 × 5 000 points) et de l’influence de la taille du faisceau, de l’intensité et de la durée d’impulsion.',
          'Semi-conducteur InP:Fe (électrons et trous) : système raide résolu par Runge-Kutta implicite, comparé à une solution analytique avec un écart relatif maximal de 0,025 %.',
          'Variation d’indice par effet Pockels, puis propagation par méthode BPM (diffraction dans l’espace de Fourier, non-linéarité dans l’espace réel) : autocollimation du faisceau dans le cristal.',
        ]},
      ],
    },
    {
      id: 'reservoir', kind: 'sim', title: 'Calcul neuromorphique photonique : reservoir computing à retard', date: '2025–2026', team: 'solo',
      tools: 'Python · NumPy · SciPy',
      summary: 'Simulation d’un oscillateur optoélectronique (laser 1550 nm, modulateur Mach-Zehnder, fibre) utilisé comme réseau de neurones pour égaliser un canal WiFi non linéaire.',
      body: [
        { eq: 'T·dx/dt + x = β·sin²(x(t − τ) + γ·u(t) + φ₀)      T = 250 ns, τ = 5 µs, β = 0,75, γ = 0,01, φ₀ = π/8' },
        { ul: [
          'Intégration de l’équation différentielle à retard par une méthode prédicteur-correcteur d’Adams d’ordre 4 (pas de 10 ns, 500 µs), avec gestion de l’historique sur [−τ, 0].',
          'Prétraitement : maintien d’ordre zéro puis masque aléatoire ±1 de pas θ = 50 ns, soit 100 nœuds virtuels multiplexés dans le temps.',
          'Modèle de canal : filtre linéaire à 10 coefficients, non-linéarité cubique et bruit blanc gaussien de 12 à 32 dB de SNR, symboles ±1, ±3.',
          'Apprentissage de la couche de sortie par pseudo-inverse de Moore-Penrose (3 000 symboles d’apprentissage, 10 000 de test, 100 de mise en régime), évaluation par taux d’erreur symbole.',
        ]},
      ],
    },
    {
      id: 'monte-carlo', kind: 'sim', title: 'Méthodes de Monte-Carlo', date: '2025–2026', team: 'solo',
      tools: 'Python · NumPy · Matplotlib',
      summary: 'Génération de lois de probabilité et estimations statistiques, du tirage gaussien à l’échantillonnage de Metropolis-Hastings.',
      body: [
        { table: { c: 'Résultats obtenus en réexécutant mon code', h: ['Exercice', 'Méthode', 'Résultat'], r: [
          ['Loi gaussienne', 'Box-Muller (10⁶ tirages)', 'moyenne 0,002 · variance 0,998 (théorie : 0 et 1)'],
          ['Loi non standard', 'Acceptation-rejet, majorant exponentiel M = 12', 'taux d’acceptation 11,6 %'],
          ['Aire du disque unité', '1 000 × 10 000 points', 'π estimé à 3,1417 ± 0,016 · biais 7·10⁻⁵'],
          ['Désintégration X → Y', 'Tirages binomiaux, 100 réalisations', 'accord avec la solution par exponentielle de matrice'],
          ['Densité π_α (α = 1)', 'Metropolis-Hastings / acceptation-rejet', 'E[X] = 0,597 / 0,636 (exact : 0,6065)'],
        ]}},
        'Metropolis-Hastings a demandé 1 500 itérations (dont 500 de mise en régime) contre 2 063 tirages pour l’acceptation-rejet, pour le même échantillon de 1 000 valeurs.',
      ],
    },
    {
      id: 'chua', kind: 'sim', title: 'Résonance cohérente dans le circuit chaotique de Chua', date: '2025–2026', team: 'solo',
      tools: 'Python · NumPy · Matplotlib',
      summary: 'Comparaison de schémas d’intégration déterministes et stochastiques sur un système chaotique, et étude des sauts entre attracteurs induits par le bruit.',
      body: [
        { ul: [
          'Schémas d’Euler, de Heun (RK2) et de Runge-Kutta d’ordre 4 : deux attracteurs chaotiques distincts selon la condition initiale (±2, 0, 0), sans passage de l’un à l’autre.',
          'Schémas stochastiques d’Euler-Maruyama et de Heun, validés d’abord à bruit nul, puis pour D² = 0,0004, 0,0064 et 0,0256 : le bruit provoque des sauts entre attracteurs.',
          'Détection robuste des transitions par seuils à hystérésis (±0,5), avec une phase de stabilisation initiale.',
        ]},
      ],
    },
  ],
}
