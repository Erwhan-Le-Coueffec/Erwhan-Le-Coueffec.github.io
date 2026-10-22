import { ballBar as B, positionRows, cornerSigma, typeAB, targetStats, globalIntrinsics } from './data'

const P = 'Position'
const K = 'Facteur k'

export const fr = {
  ui: { brief: 'En bref', briefHeads: ['Le problème', 'Ce que j’ai fait', 'Le résultat'], toc: 'Sommaire', facts: 'Chiffres clés', limit60: 'objectif ±60 µm', limit120: 'critère ±120 µm', unit: 'Écart à la référence (µm)', source: 'Sources : rapport de fin d’études, rapport de mission projet, compte rendu d’essais et supports de soutenance (Holo3 · CentraleSupélec, 2025–2026).' },

  holo: {
    kicker: 'Holo3 · Mission de fin d’études · 2026',
    title: 'Évaluer et améliorer le calibrage de HoloScan',
    brief: ['Holo3 voulait savoir si son protocole de calibrage HoloScan était robuste, et s’il pouvait réduire l’incertitude de mesure.', 'J’ai modélisé toute la chaîne (caméra, projecteur, triangulation, incertitudes), puis comparé 5 variantes de protocole sur les mêmes acquisitions, validées sur une barre à boules certifiée.', 'Protocole confirmé solide : 108 mesures sur 110 dans le critère de ±120 µm, fidélité < 2 µm. La caractérisation de la mire ressort comme le principal levier d’amélioration.'],
    lead: 'Un système industriel de mesure 3D par projection de franges : j’ai repris toute la chaîne de calibrage, de la théorie optique à la propagation des incertitudes, puis comparé cinq variantes de protocole sur les mêmes acquisitions, validées sur une barre à boules certifiée.',
    meta: [
      ['Période', 'Oct. 2025 – sept. 2026 · soutenance le 17/09/2026'],
      ['Rôle', 'Ingénieur R&D en apprentissage, en grande autonomie'],
      ['Outils', 'MATLAB · Excel · logiciel d’inspection 3D GOM · CalibTool · SensorPhase · caméras Basler · machines de vision Mitutoyo et Hexagon'],
    ],
    facts: [
      ['2 + 1', 'caméras + projecteur dans HoloScan'],
      ['~2,3 M', 'points 3D par mesure, en ~1 s'],
      ['< 2 µm', 'fidélité mesurée sur la barre à boules'],
      ['108 / 110', 'mesures dans le critère de ±120 µm, avec une mire à jour'],
      ['93–155 µm', 'courbure réelle de la mire, ignorée par une grille idéale'],
    ],
    sections: [
      { title: 'Contexte', body: [
        'Holo3 est un Centre de Ressources Technologiques (CRT) spécialisé en métrologie optique. Son rôle : faire passer des technologies de mesure du concept de laboratoire à l’application en conditions réelles (montée en TRL). Partie des interférences holographiques, l’entreprise travaille aujourd’hui sur la déflectométrie, la projection de franges, la corrélation d’images et l’holographie interférentielle.',
        'HoloScan est un système de mesure 3D sans contact composé de deux caméras et d’un projecteur. Chaque couple caméra-projecteur mesure l’objet par triangulation, sous deux angles différents. Une mesure dure environ une seconde et produit un nuage d’environ 2,3 millions de points (un point par pixel d’un capteur 1920 × 1200). Le système cartographie des pièces industrielles et détecte des défauts de surface jusqu’au demi-millimètre.',
        'Chaque système est calibré sur site par un employé de Holo3, en une heure environ. La question posée : le protocole actuel est-il robuste, et peut-on l’améliorer pour réduire l’incertitude de mesure et la taille des défauts détectables ?',
      ]},
      { title: 'Objectif et critère de validation', body: [
        'Une mesure est exacte si elle est à la fois juste (proche de la valeur vraie) et fidèle (la même valeur quand on répète la mesure). Les deux ont été évaluées séparément.',
        'La référence est une barre à boules certifiée : 250,1097 mm entre les centres des deux boules. Le critère de vérification de Holo3 dépend de la diagonale d du champ commun (environ 600 mm) :',
        { eq: 'critère actuel : d / 5000 = 600 mm / 5000 = ±120 µm      objectif exploré : d / 10000 = ±60 µm' },
      ]},
      { title: 'Calibrer une caméra : du point 3D au pixel', body: [
        'Le modèle sténopé (pinhole) décrit le trajet d’un point de l’objet jusqu’au pixel en trois étapes :',
        { ul: [
          'Changement de repère : rotation (déterminée comme vecteur de rotation, stockée en quaternion, appliquée en matrice) puis translation. Ce sont les paramètres extrinsèques.',
          'Projection sur le plan rétinien, à une unité du centre optique : x′ = X/Z et y′ = Y/Z.',
          'Passage au capteur CMOS : focale (fx, fy), centre optique (Cx, Cy) et distorsions de l’objectif, radiale (k₁, k₂) et tangentielle (p₁, p₂). Ce sont les paramètres intrinsèques.',
        ]},
        { eq: 'x″ = x′(1 + k₁r² + k₂r⁴) + 2p₁x′y′ + p₂(r² + 2x′²)      avec r² = x′² + y′²' },
        'En pratique, on utilise une mire en damier de 100 intersections (36 points suffisent en théorie). Les intersections sont détectées en sub-pixel par l’algorithme de Harris, qui repose sur le gradient de niveaux de gris. Les réglages conditionnent directement la qualité de cette détection :',
        { ul: [
          'Mise au point : transition noir/blanc sur 1 à 2 pixels.',
          'Profondeur de champ : ouverture réglée pour que la transition reste ≤ 4 pixels aux extrémités du volume.',
          'Exposition : blanc moyen autour de 220 niveaux de gris sur 255, sans saturation.',
          'Acquisition : 15 images (5 positions × 3 niveaux du volume ; 12 suffiraient en théorie), puis optimisation par Levenberg–Marquardt.',
          'Validation : erreur de reprojection inférieure à 0,1 pixel.',
        ]},
      ]},
      { title: 'Calibrer le projecteur : la projection de franges', body: [
        'Un projecteur est une caméra inversée (une matrice DLP au lieu d’un capteur CMOS) : le modèle optique est le même. Pour savoir quel pixel projecteur éclaire chaque intersection de la mire, on projette des réseaux de franges sinusoïdaux, observés par la caméra calibrée.',
        { eq: 'Iᵢ(x,y) = I₀(x,y) · [1 + m · sin(2π/P · Φ(x,y) + φᵢ)]      φᵢ = 0, π/2, π, 3π/2' },
        { eq: 'Φ = atan2(I₁ − I₃ ; I₂ − I₄)      →      C(x) = P/2π · Φ + P/2' },
        'Chaque réseau est projeté avec 4 déphasages de π/2. Des franges verticales donnent une coordonnée, des franges horizontales donnent l’autre, avec des périodes de plus en plus fines (de 2048 à 32 pixels) pour gagner en exactitude. Caméra et projecteur sont calibrés avec les mêmes acquisitions, avec le même critère de reprojection < 0,1 pixel.',
      ]},
      { title: 'Triangulation', body: [
        'Pour chaque pixel caméra, on cherche le point O à l’intersection du rayon caméra et du rayon projecteur. Deux droites mesurées ne se coupent jamais parfaitement : on ajoute un terme d’écart ε porté par leur perpendiculaire commune.',
        { eq: '0 = t − k_c·v_c + k_p·(R·v_p) + ε·(v_c ∧ R·v_p) / ‖v_c ∧ v_p‖' },
        't et R sont la translation et la rotation projecteur → caméra. Le système est mis sous la forme AX = B avec X = (k_c, k_p, ε/‖v_c ∧ v_p‖), puis résolu par X = A⁻¹B. Le point mesuré vaut O = k_c · (x′_c, y′_c, 1) dans le repère caméra.',
      ]},
      { title: 'Étude théorique : propagation des incertitudes', body: [
        'J’ai appliqué la loi de propagation des incertitudes à ce modèle pour identifier les paramètres dominants et prédire l’incertitude d’un point.',
        { eq: 'u(f) = √ Σ (∂f/∂xᵢ · Δxᵢ)²' },
        { ul: [
          'Erreur de reprojection (~0,02 à 0,03 px) et incertitude du centre optique (0,6 à 1,5 px) de la caméra et du projecteur, ramenées au plan rétinien en divisant par la focale.',
          'Quaternion : Δq = 10⁻¹², la fiabilité de l’algorithme de calcul.',
          'Translation : dilatation thermique du support caméra-projecteur, Δt = D · tᵢ · ΔT.',
          'k_c, k_p et ε considérés comme idéaux.',
        ]},
        { eq: 'u(x) ≈ √(k_p²(Δx′_p² + Δy′_p²) + (k_c·Δx′_c)²)      u(z) ≈ k_p · √(Δx′_p² + Δy′_p²)' },
        'Appliqué à un point réel situé à environ 1,06 m, le modèle donne une incertitude élargie (k = 2) de ±0,81 mm en X, ±0,75 mm en Y et ±0,14 mm en Z pour un pixel isolé. Mais le centre d’une boule est estimé à partir de 16 000 à 18 500 points : l’incertitude sur le centre est divisée par √N, soit environ 3 µm. Cette prédiction est confrontée à la mesure plus bas.',
      ]},
      { title: 'Méthode expérimentale', body: [
        'Atout clé de la projection de franges : la mesure 3D est calculée après l’acquisition. J’ai donc acquis une seule fois la barre à boules dans 5 positions (2 peu inclinées, 2 très inclinées, 1 quelconque), puis retraité ces mêmes images avec chaque variante de calibrage. Une seule variable change à la fois.',
        { ul: [
          'Centres des boules obtenus par ajustement de sphère dans le logiciel d’inspection 3D GOM.',
          'Correction d’échelle par un facteur k (moyenne des ratios référence/mesure), toujours égal à 1 à 10⁻⁴ près (0,9990 à 1,0006).',
          'Indicateur : écart entre la longueur corrigée et 250,1097 mm, pour chaque position et chaque caméra.',
          'Base : 15 positions de mire par calibrage, un compromis réaliste en milieu industriel.',
        ]},
      ]},
      { title: 'Étude 1 · Où calibrer ?', body: [
        'Comparaison entre deux approches. Dans la première, on calibre uniquement dans le champ commun aux deux caméras et au projecteur : les mêmes 15 positions de mire servent aux deux caméras. Dans la seconde, on calibre chaque couple caméra-projecteur séparément (2 × 15 = 30 acquisitions).',
        { chart: { c: 'Écarts à la barre à boules selon la zone calibrée', series: [['Champ commun · cam. 1', B.commonField.cam1], ['Champ commun · cam. 2', B.commonField.cam2], ['Champs séparés · cam. 1', B.pairFields.cam1], ['Champs séparés · cam. 2', B.pairFields.cam2]] } },
        { table: { c: 'Écart à la référence (µm)', h: ['', 'Champ commun · cam. 1', 'Champ commun · cam. 2', 'Champs séparés · cam. 1', 'Champs séparés · cam. 2'], r: positionRows(P, K, [['commonField', 'cam1'], ['commonField', 'cam2'], ['pairFields', 'cam1'], ['pairFields', 'cam2']]) } },
        'Les résultats sont similaires. À une exception près (−126,2 µm, champs séparés, caméra 1, position 4), toutes les mesures restent sous ±60 µm. Cette mesure dépasse même légèrement le critère de ±120 µm. Le calibrage dans le champ commun est la seule configuration où les dix mesures restent sous ±50 µm. Conclusion : une seule série de positions de mire peut calibrer les deux caméras.',
      ]},
      { title: 'Étude 2 · La connaissance de la mire', body: [
        'Le calibrage s’appuie sur un « fichier mire » qui décrit la position de chaque intersection. J’ai fait mesurer la mire PC-B (pas de 20 mm) sur deux machines de vision, Mitutoyo et Hexagon, puis calibré le système avec chacun des deux fichiers.',
        { ul: [
          'Qualification préalable de la machine Mitutoyo sur une mire céramique : 0,5 µm en X, 0,7 µm en Y, 1,4 µm en Z.',
          'En X et Y, les deux machines concordent : écart-type de 5 µm en X et 2 µm en Y.',
          'En Z, la mire n’est pas plane mais incurvée : amplitude z_max − z_min de 93 µm selon la Mitutoyo et de 155 µm selon l’Hexagon.',
        ]},
        { chart: { c: 'Écarts selon le fichier mire utilisé', series: [['Mitutoyo · cam. 1', B.mitutoyo.cam1], ['Mitutoyo · cam. 2', B.mitutoyo.cam2], ['Hexagon · cam. 1', B.hexagon.cam1], ['Hexagon · cam. 2', B.hexagon.cam2]] } },
        { table: { c: 'Écart à la référence (µm)', h: ['', 'Mitutoyo · cam. 1', 'Mitutoyo · cam. 2', 'Hexagon · cam. 1', 'Hexagon · cam. 2'], r: positionRows(P, K, [['mitutoyo', 'cam1'], ['mitutoyo', 'cam2'], ['hexagon', 'cam1'], ['hexagon', 'cam2']]) } },
        'Changer de fichier mire décale le résultat d’une même acquisition jusqu’à environ 40 µm. Le critère de ±120 µm reste respecté, et ±60 µm l’est pour l’essentiel des positions 1, 2, 3 et 5. La position 4 (barre très inclinée) reste la plus difficile, autour de ±110 µm.',
        { note: 'Résultat le plus marquant de la mission : un calibrage fait avec un fichier mire non mis à jour produit des écarts jusqu’à −217 µm (étude 4). La caractérisation de la mire pèse bien plus que toutes les variantes de protocole testées.' },
      ]},
      { title: 'Étude 3 · Plus d’images, plus de répétabilité ?', body: [
        'Chacune des 15 positions de mire est acquise 1, 3, 5 ou 10 fois (notation 15×N). Dans une seconde variante, les N acquisitions sont moyennées en une seule image (notation 15×Mn).',
        { table: { c: 'Calibrage avec répétitions (µm)', h: ['', '15×1 · c1', '15×1 · c2', '15×3 · c1', '15×3 · c2', '15×5 · c1', '15×5 · c2', '15×10 · c1', '15×10 · c2'], r: positionRows(P, K, [['x1', 'cam1'], ['x1', 'cam2'], ['x3', 'cam1'], ['x3', 'cam2'], ['x5', 'cam1'], ['x5', 'cam2'], ['x10', 'cam1'], ['x10', 'cam2']]) } },
        { table: { c: 'Calibrage avec images moyennées (µm)', h: ['', '15×1 · c1', '15×1 · c2', '15×M3 · c1', '15×M3 · c2', '15×M5 · c1', '15×M5 · c2', '15×M10 · c1', '15×M10 · c2'], r: positionRows(P, K, [['x1', 'cam1'], ['x1', 'cam2'], ['m3', 'cam1'], ['m3', 'cam2'], ['m5', 'cam1'], ['m5', 'cam2'], ['m10', 'cam1'], ['m10', 'cam2']]) } },
        'Aucune amélioration claire. Hors deux cas isolés (15×5 caméra 1, et 15×M10 position 5 caméra 2), les variantes diffèrent de moins de 15 µm. Ajouter de la répétabilité au calibrage n’apporte rien : le protocole actuel, plus rapide, reste le meilleur choix.',
      ]},
      { title: 'Étude 4 · Trois façons d’exploiter 150 images', body: [
        '15 positions × 10 acquisitions, traitées de trois façons sur un couple caméra-projecteur : un calibrage global avec les 150 images, 10 calibrages de 15 images dont on moyenne les paramètres, et un calibrage sur 15 images moyennées.',
        { table: { c: 'Écart à la référence, caméra 1 (µm)', h: ['', '150 images', '10 calibrages', 'Images moyennées'], r: positionRows(P, K, [['all150', 'cam1'], ['tenCal', 'cam1'], ['averaged', 'cam1']]) } },
        'Les trois traitements diffèrent de moins de 8 µm : aucun intérêt à les adopter. Les écarts globalement plus élevés (jusqu’à −217,6 µm en position 3) viennent d’un fichier mire non mis à jour lors de ce calibrage, ce qui confirme l’étude 2.',
      ]},
      { title: 'Étude 5 · Calibrer seulement une partie du champ', body: [
        'Sur certains sites, on ne peut pas calibrer tout le champ. J’ai donc calibré dans 1 coin (12 positions, le minimum théorique), 2 coins (24 positions) ou 4 coins (48 positions). La barre à boules étant hors de la zone calibrée, l’indicateur est l’écart-type moyen de position des intersections de la mire.',
        { table: { c: 'Écart-type moyen par intersection (µm)', h: ['', '1 coin · c1', '2 coins · c1', '4 coins · c1', '1 coin · c2', '2 coins · c2', '4 coins · c2'], r: cornerSigma } },
        'Hors le cas « 2 coins » de la caméra 1, les résultats sont proches. Le cas 1 coin est moins bon car il n’utilise que le minimum théorique de positions, moins que la pratique habituelle de Holo3. Calibrer uniquement la zone où l’objet sera mesuré est suffisant.',
      ]},
      { title: 'Théorie contre pratique', body: [
        'La barre à boules est mesurée 5 fois dans la même position (position 5, champ commun, caméra 1). L’incertitude de type A, u = σ/√n, est comparée à l’incertitude de type B prédite par le modèle.',
        { table: { c: 'Incertitudes sur la position des centres (µm)', h: ['', 'Boule 1 · type A', 'Boule 1 · type B', 'Ratio B/A', 'Boule 2 · type A', 'Boule 2 · type B', 'Ratio B/A'], r: typeAB } },
        'En X et Y, la répétabilité réelle est 2 à 3 fois meilleure que la prédiction. En Z, la mesure est un peu moins bonne que le modèle (ratio de 0,4 à 0,7). Les ordres de grandeur concordent : le modèle d’incertitude est adapté, et la fidélité de HoloScan est inférieure à 2 µm.',
      ]},
      { title: 'Conclusions', body: [
        { ul: [
          'Le protocole de calibrage de Holo3 est solide : avec une mire à jour, 108 des 110 mesures de barre à boules respectent le critère de ±120 µm (dépassements : −126,2 et −120,4 µm).',
          'Aucune variante plus coûteuse (plus d’images, moyennes, répétitions) n’améliore le calibrage. Le temps de calibrage actuel est le bon.',
          'La caractérisation de la mire est le principal levier : une mire mal décrite génère les plus gros écarts.',
          'Les deux caméras peuvent être calibrées avec les mêmes positions dans le champ commun, et l’on peut ne calibrer que la zone utile.',
          'Fidélité inférieure à 2 µm ; une justesse de ±60 µm est atteinte dans une partie des cas.',
        ]},
      ]},
      { title: 'Recommandations et perspectives', body: [
        { ul: [
          'Vérifier les mires une fois par an.',
          'Ajouter une mesure de barre à boules pour contrôler chaque calibrage : détecter un mauvais calibrage et viser ±60 µm.',
          'Étudier l’influence de la température et du vieillissement sur la mire.',
          'Transposer ces tests au calibrage des systèmes de déflectométrie, beaucoup plus sensibles.',
          'Une simple correction d’offset n’est pas applicable : l’objet mesuré peut se trouver dans plusieurs positions.',
        ]},
      ]},
      { title: 'Ce que j’en retiens', body: [
        'Comprendre toute la chaîne optique et mathématique avant de mesurer. Concevoir des comparaisons où une seule variable change. Accepter un résultat « pas d’amélioration » quand les données le disent : c’est aussi une information précieuse pour l’entreprise.',
        'Côté éthique : ne jamais ajuster une mesure pour obtenir le résultat souhaité. Un client doit recevoir un système conforme à ce qui est annoncé, et un contrôle par barre à boules va dans ce sens.',
        'J’ai aussi découvert le fonctionnement d’une petite structure, très différent d’un grand groupe comme Saint-Gobain, avec une grande proximité entre les équipes.',
      ]},
    ],
  },

  doe: {
    kicker: 'Holo3 · Mission projet · oct. 2025 – avr. 2026',
    title: 'Quels paramètres influencent la détection d’une mire ?',
    brief: ['La détection des intersections de mire, première étape de tout calibrage, dépend de nombreux paramètres couplés, jusque-là testés un ou deux à la fois.', 'Étude préliminaire sur 3 mires (~1 300 mesures), puis introduction de deux plans d’expérience dans l’équipe (216 → 27 et 432 → 32 configurations).', 'Couleur d’éclairage → justesse (~0,1 px) ; exposition, ouverture et angle → fidélité (~0,01 px), tous liés au contraste noir/blanc. Calibrer une partie du champ suffit.'],
    lead: 'Avant tout calibrage, une caméra doit détecter précisément les intersections d’une mire. J’ai mené une étude préliminaire sur trois mires, puis introduit dans l’équipe deux plans d’expérience pour quantifier l’effet de l’éclairage, de l’exposition et de l’ouverture.',
    meta: [
      ['Période', 'Oct. 2025 – avr. 2026 · présentation le 28/04/2026'],
      ['Rôle', 'Ingénieur R&D en apprentissage · méthode proposée et menée de bout en bout'],
      ['Outils', 'Caméra Basler acA1920-40gm · objectif 16 mm · éclairages EFFI-FLEX · SensorPhase · CalibTool 1.5.1.4 · MATLAB · Excel · ImageJ'],
    ],
    facts: [
      ['~1 300', 'mesures de mires dans l’étude préliminaire'],
      ['216 → 27', 'configurations grâce au premier plan d’expérience'],
      ['432 → 32', 'configurations dans le second plan'],
      ['0,02 px', 'dispersion minimale des intersections'],
      ['3–5 min', 'de dérive au démarrage de la caméra'],
    ],
    sections: [
      { title: 'Contexte et question', body: [
        'Toute mesure par caméra commence par la détection des intersections d’une mire en damier. Le logiciel CalibTool combine l’algorithme de Harris à d’autres traitements d’image. Jusque-là, les essais menés à Holo3 faisaient varier un ou deux paramètres à la fois.',
        'Question : quels paramètres, extérieurs à la caméra ou internes, influencent la justesse et la fidélité de la position détectée, et de combien ?',
      ]},
      { title: 'Banc de mesure', body: [
        { ul: [
          'Caméra Basler acA1920-40gm : capteur CMOS monochrome 1920 × 1200 px (11,33 × 7,13 mm), pixels de 5,86 µm, spectre visible.',
          'Objectif Basler C11-1620-12M : focale fixe de 16 mm, ouverture de f/2 à f/16.',
          'Éclairages EFFI-FLEX bleu (465 nm) et rouge (625 nm), et un éclairage blanc.',
          'Table optique, drap noir et feutrine pour supprimer les reflets parasites.',
          'Acquisition avec SensorPhase, détection avec CalibTool 1.5.1.4 (outils de Bouguet sous MATLAB), traitement sous MATLAB et Excel.',
        ]},
      ]},
      { title: 'Phase 1 · Étude préliminaire sur trois mires', body: [
        { table: { c: 'Mires utilisées', h: ['Mire', 'Damier', 'Intersections', 'Taille des cases'], r: [['Opaline', '12 × 9 cases', 88, '28 mm'], ['PC-B', '11 × 11 cases', 100, '20 mm'], ['Céramique', '11 × 11 cases', 100, '5 mm']] } },
        'Session 1 : mires opaline et PC-B, trois couleurs de lumière et deux temps d’exposition (proche de la saturation, puis divisé par deux : 1 500 puis 750 µs en lumière blanche). Deux séries de 25 mesures, séparées d’une heure.',
        { ul: [
          'Mire opaline : perte de contraste en bleu et en rouge, intersections introuvables à cause des reflets du cadre et de la table.',
          'Mire PC-B : écart-type de 0,02 à 0,03 px, écart min-max de 0,1 à 0,2 px.',
          'Effet du temps d’exposition : environ 0,05 px, 0,1 px au pire.',
          'Décalage systématique selon la couleur : selon x pour le bleu, selon y pour le rouge.',
          'Pics de dispersion périodiques sous la zone la plus éclairée par la lampe.',
          'Un seul point aberrant sur environ 1 300 mesures au total.',
        ]},
        'Session 2 : ajout du drap noir et de la feutrine, 5 angles d’éclairage (−45°, −10°, 0°, +10°, +45°) et un éclairage par la lumière ambiante, soit 32 configurations × 25 mesures.',
        { table: { c: 'Répétabilité de la position des intersections (pixels)', h: ['', 'Opaline', 'PC-B'], r: targetStats(['σ moyen', 'σ max', 'Δ min-max moyen', 'Δ min-max max']) } },
        'La mire PC-B est la plus répétable. Mais dès qu’on compare des configurations entre elles, les écarts augmentent d’un facteur 10 (environ 0,1 px, jusqu’à 0,25–0,3 px) : l’éclairage déplace réellement la position détectée. L’incertitude de type A sur une position reste de 0,012 px (k = 2).',
        'Session 3 : la mire céramique (cases de 5 mm) est trop petite pour CalibTool. Détection sous MATLAB, avec une zone de recherche prédéfinie : écart-type d’environ 0,008 px.',
        { note: 'Dérive au démarrage : une mesure par minute pendant 1 h après l’allumage montre que les intersections dérivent selon y pendant 3 à 5 minutes, puis se stabilisent. Hypothèse : dilatation du support du capteur. En pratique, il faut laisser la caméra se stabiliser avant de calibrer.' },
        'Bilan de la phase 1 : le facteur principal est l’hétérogénéité d’éclairage de la mire (puissance, diffusion, angle, zone d’impact, forme de la lampe, reflets). Ces paramètres étant couplés, il fallait une méthode capable de les tester ensemble.',
      ]},
      { title: 'Phase 2 · Premier plan d’expérience', body: [
        'J’ai proposé le plan d’expérience, une méthode nouvelle dans l’équipe, pour tester tous les paramètres en même temps et mesurer leurs interactions.',
        { ul: [
          '6 facteurs : couleur (3 niveaux), angle −45° / 0° / +45° (3), temps d’exposition (3), réflexions extérieures (avec ou sans), spéculaire (centré ou non), forme de la source (rectangle ou ponctuelle).',
          'Plan complet : 216 configurations, ramenées à 27 essais.',
          'Ordre des essais randomisé, variables codées entre −1 et +1.',
          '30 acquisitions par configuration : le point moyen sert à la justesse (comparé à une configuration de référence proche d’un calibrage standard), les points extrêmes servent à la fidélité.',
          'Effets calculés sous Excel, chacun tracé avec sa barre d’erreur. Un facteur est jugé négligeable si sa barre d’erreur dépasse l’effet.',
        ]},
        { table: { c: 'Résultats du premier plan', h: ['', 'Justesse', 'Fidélité'], r: [['Facteur influent', 'Couleur de l’éclairage', 'Temps d’exposition'], ['Valeurs (pixels)', '−0,17 à +0,15 (x, y) · jusqu’à 0,25 en norme', '0,02 à 0,09']] } },
        'Limites identifiées : l’angle symétrique (−45° / +45°) pouvait masquer un effet, et l’ouverture n’était pas testée.',
      ]},
      { title: 'Second plan d’expérience', body: [
        { ul: [
          'Ajout de l’ouverture (3 niveaux) et du codage de l’image en 8 ou 16 bits.',
          'Angle d’éclairage de 0° à 45°, pour supprimer la symétrie.',
          'Temps d’exposition réglé pour un contraste constant : blanc à 220 en 8 bits, à 57 000 en 16 bits.',
          'Plan complet : 432 configurations, ramenées à 32 essais.',
        ]},
        { table: { c: 'Résultats du second plan', h: ['', 'Justesse', 'Fidélité'], r: [['Facteurs influents', 'Couleur de l’éclairage', 'Ouverture · angle d’éclairage'], ['Valeurs (pixels)', '−0,17 à +0,15', '0,02 à 0,04']] } },
      ]},
      { title: 'Lecture : le contraste noir/blanc comme fil conducteur', body: [
        'Les facteurs qui ressortent ont un point commun : ils pilotent le contraste réellement vu par la caméra à la frontière entre cases noires et blanches, là où l’intersection est détectée.',
        { ul: [
          'La couleur de l’éclairage agit sur la justesse : décalage de l’ordre du dixième de pixel.',
          'Le temps d’exposition, l’ouverture et l’angle d’éclairage agissent sur la fidélité, de l’ordre du centième de pixel.',
          'À contraste fixé (second plan), la dispersion passe de 0,02–0,09 px à 0,02–0,04 px.',
        ]},
        'En résumé : la détection est très fidèle (centième de pixel), un peu moins juste (dixième de pixel), et le contraste est le levier à maîtriser.',
      ]},
      { title: 'Phase 3 · Calibrage global ou local ?', body: [
        'Peut-on calculer les intrinsèques d’une caméra sans couvrir tout son champ ? Montage grand champ sur 5 niveaux, éclairé par la lumière ambiante. La référence « globale » utilise 625 images. Le champ est ensuite divisé en 8 sous-zones de 15 images chacune, avec une mire peu ou très inclinée, pour calculer des intrinsèques « locaux ».',
        { table: { c: 'Intrinsèques globaux de référence (pixels pour f et c)', h: globalIntrinsics.head, r: [['Valeur', ...globalIntrinsics.value], ['Incertitude', ...globalIntrinsics.unc]] } },
        'Résultat : un calibrage local est équivalent au calibrage global. L’inclinaison donne des valeurs similaires, mais les incertitudes sont plus faibles avec une mire fortement inclinée. Ce résultat a ensuite été confirmé sur HoloScan (étude 5 de la mission de fin d’études).',
      ]},
      { title: 'Conclusions et ce que j’en retiens', body: [
        { ul: [
          'La procédure de calibrage de Holo3 est très bonne. Les pistes d’amélioration portent sur la maîtrise de l’éclairage et du contraste.',
          'Paramètres à surveiller : couleur et angle d’éclairage, temps d’exposition, ouverture.',
          'Laisser la caméra se stabiliser quelques minutes avant de calibrer.',
          'Calibrer sur une partie du champ est possible, avec une mire de préférence très inclinée.',
        ]},
        'Ce projet m’a appris à structurer une campagne d’essais : définir les variables et leurs intervalles, randomiser, coder, puis juger un effet à l’aune de son incertitude plutôt qu’à l’intuition. Il a aussi préparé le terrain de la mission de fin d’études sur HoloScan.',
      ]},
    ],
  },
}
