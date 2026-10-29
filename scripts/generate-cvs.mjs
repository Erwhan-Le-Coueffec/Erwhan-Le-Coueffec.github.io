import { mkdirSync, writeFileSync } from 'node:fs'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const A4 = [595.28, 841.89]
const OUT = 'public/cv'
const LEFT = 42
const RIGHT = 553
const BOTTOM = 36

const colors = {
  navy: rgb(0.043, 0.102, 0.141),
  cyan: rgb(0.082, 0.596, 0.788),
  text: rgb(0.102, 0.153, 0.188),
  muted: rgb(0.37, 0.427, 0.467),
  light: rgb(0.87, 0.91, 0.93),
}

// Standard PDF fonts only cover WinAnsi: map the few characters outside it.
const MAP = { '≤': '<=', '≥': '>=', '→': '->', 'λ': 'lambda', '₂': '2', '≈': '~', '·': '·', 'Δ': 'delta', 'σ': 'sigma', '−': '-' }
const clean = s => [...s].map(c => MAP[c] ?? c).join('')

function wrap(text, font, size, maxWidth) {
  const lines = []
  let line = ''
  for (const word of clean(text).split(/\s+/)) {
    const test = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(test, size) <= maxWidth) line = test
    else { if (line) lines.push(line); line = word }
  }
  if (line) lines.push(line)
  return lines
}

class Writer {
  constructor(doc, fonts, footer) { this.doc = doc; this.f = fonts; this.footer = footer; this.pages = []; this.newPage() }
  newPage() { this.page = this.doc.addPage(A4); this.pages.push(this.page); this.y = 800 }
  need(h) { if (this.y - h < BOTTOM) this.newPage() }
  text(t, x, size, font, color, dy) { this.page.drawText(clean(t), { x, y: this.y, size, font, color }); if (dy) this.y -= dy }
  right(t, size, font, color) { const s = clean(t); this.page.drawText(s, { x: RIGHT - font.widthOfTextAtSize(s, size), y: this.y, size, font, color }) }
  para(t, x, width, size, leading, font = this.f.regular, color = colors.text) {
    for (const line of wrap(t, font, size, width)) { this.need(leading); this.page.drawText(line, { x, y: this.y, size, font, color }); this.y -= leading }
  }
  section(title) {
    this.need(34); this.y -= 3
    this.text(title.toUpperCase(), LEFT, 8.4, this.f.bold, colors.cyan)
    this.page.drawLine({ start: { x: LEFT, y: this.y - 5 }, end: { x: RIGHT, y: this.y - 5 }, thickness: 0.7, color: colors.light })
    this.y -= 16
  }
  bullet(t) {
    const lines = wrap(t, this.f.regular, 7.55, RIGHT - 54)
    this.need(lines.length * 9.1)
    this.page.drawCircle({ x: 46, y: this.y + 2.2, size: 1.4, color: colors.cyan })
    for (const line of lines) { this.page.drawText(line, { x: 54, y: this.y, size: 7.55, font: this.f.regular, color: colors.text }); this.y -= 9 }
    this.y -= 1.5
  }
  finish() {
    const n = this.pages.length
    this.pages.forEach((p, i) => {
      const s = clean(`${this.footer} · ${i + 1}/${n}`)
      p.drawText(s, { x: RIGHT - this.f.regular.widthOfTextAtSize(s, 6.8), y: 28, size: 6.8, font: this.f.regular, color: colors.muted })
    })
  }
}

async function buildCv(data, fileName) {
  const doc = await PDFDocument.create()
  doc.setTitle(data.title); doc.setAuthor('Erwhan Le Couëffec'); doc.setSubject('Curriculum Vitae')
  const f = { regular: await doc.embedFont(StandardFonts.Helvetica), bold: await doc.embedFont(StandardFonts.HelveticaBold) }
  const w = new Writer(doc, f, 'Erwhan Le Couëffec')

  w.y = 792; w.text('Erwhan Le Couëffec', LEFT, 23, f.bold, colors.navy, 20)
  w.text(data.subtitle, LEFT, 10.5, f.bold, colors.cyan, 15)
  for (const line of data.contact) w.text(line, LEFT, 7.35, f.regular, colors.muted, 10)
  w.page.drawLine({ start: { x: LEFT, y: w.y + 2 }, end: { x: RIGHT, y: w.y + 2 }, thickness: 1.8, color: colors.cyan })
  w.y -= 14

  w.section(data.labels.profile)
  w.para(data.profile, LEFT, RIGHT - LEFT, 7.85, 10.1); w.y -= 4

  w.section(data.labels.experience)
  for (const item of data.experience) {
    w.need(60)
    w.text(item.role, LEFT, 9, f.bold, colors.navy); w.right(item.dates, 7.7, f.regular, colors.muted); w.y -= 11
    w.text(item.company, LEFT, 7.6, f.bold, colors.cyan, 12)
    for (const b of item.bullets) w.bullet(b)
    w.y -= 3
  }

  w.section(data.labels.education)
  for (const item of data.education) {
    w.need(40)
    w.text(item.degree, LEFT, 8.4, f.bold, colors.navy); w.right(item.dates, 7.6, f.regular, colors.muted); w.y -= 11
    w.text(item.school, LEFT, 7.6, f.bold, colors.cyan, 11)
    w.para(item.detail, LEFT, RIGHT - LEFT, 7.1, 8.6, f.regular, colors.muted); w.y -= 2
  }

  w.section(data.labels.projects)
  for (const p of data.projects) w.bullet(p)

  w.section(data.labels.skills)
  for (const [label, value] of data.skills) {
    const lines = wrap(value, f.regular, 7.05, RIGHT - 148)
    w.need(lines.length * 8.8 + 3)
    w.text(label, LEFT, 7.4, f.bold, colors.navy)
    for (const line of lines) { w.page.drawText(line, { x: 148, y: w.y, size: 7.05, font: f.regular, color: colors.text }); w.y -= 8.8 }
    w.y -= 3
  }

  w.section(data.labels.languages)
  for (const line of data.languages) w.para(line, LEFT, RIGHT - LEFT, 7.25, 9.4)
  w.y -= 2
  if (data.interests) w.para(data.interests, LEFT, RIGHT - LEFT, 7.25, 9.4, f.regular, colors.muted)
  w.y -= 4
  if (data.references) w.para(data.references, LEFT, RIGHT - LEFT, 7.25, 9.4, f.bold, colors.navy)

  w.finish()
  mkdirSync(OUT, { recursive: true })
  writeFileSync(`${OUT}/${fileName}`, await doc.save())
}

const fr = {
  title: 'CV Erwhan Le Couëffec - FR',
  subtitle: 'Ingénieur R&D spécialisé en photonique — je confronte toujours la théorie à la mesure',
  contact: [
    'Riedisheim (FR), à 30 min de Bâle  |  +33 6 22 29 11 29  |  erwhan43@gmail.com  |  erwhan-le-coueffec.github.io',
    'Nationalité française (UE, libre circulation des personnes)  |  Permis B  |  Disponibilité immédiate',
  ],
  labels: { profile: 'Profil', experience: 'Expérience professionnelle', education: 'Formation', projects: 'Projets académiques (sélection)', skills: 'Compétences', languages: 'Langues & centres d’intérêt' },
  profile: 'Formé à CentraleSupélec (cursus ingénieur généraliste achevé en 2026), spécialisé en photonique, avec 4 ans d’apprentissage dans l’industrie et la R&D : métrologie optique, mesure 3D, calibrage et instrumentation. J’aime comprendre un système en profondeur, le mesurer et l’améliorer par une démarche expérimentale rigoureuse. Je recherche un poste d’ingénieur R&D à forte composante expérimentale, en priorité dans la région de Bâle.',
  experience: [
    { role: 'Ingénieur R&D en apprentissage', company: 'Holo3 — Saint-Louis (FR), région de Bâle · métrologie optique', dates: '10.2025 – 09.2026', bullets: [
      'Mission 1 · Détection des intersections de mire : étude préliminaire sur 3 mires (~1 300 mesures), puis introduction des plans d’expérience dans l’équipe, à mon initiative (216 → 27, puis 432 → 32 configurations), pour réduire le nombre d’essais et quantifier l’influence de chaque paramètre : tous agissent sur le contraste noir/blanc.',
      'Mission 2 · Calibrage du système 3D HoloScan (mémoire) : théorie et propagation des incertitudes, puis 5 études comparatives (projection de franges, 2 caméras + 1 projecteur), validées sur barre à boules certifiée de 250,1097 mm : critère de ±120 µm respecté pour 108 mesures sur 110, fidélité < 2 µm.',
      'Mission 3 · Machines de mesure par vision, en parallèle : qualification de la Mitutoyo sur mire étalon (répétabilité ~1 µm), comparaison avec une Hexagon (courbure de mire de 93 vs 155 µm) ; caractérisation de la mire identifiée comme principal levier de qualité du calibrage.',
    ]},
    { role: 'Ingénieur WCM / amélioration continue en apprentissage', company: 'Placoplatre (groupe Saint-Gobain) — Chambéry (FR) · production de plaques de plâtre', dates: '10.2023 – 06.2025', bullets: [
      'Contrôle de viscosité du plâtre : conception d’un support OK/NOK qui fixe la position du mètre pour mesurer la tache d’étalement. Une mesure jusque-là aléatoire selon l’opérateur devient reproductible.',
      'Maintenance autonome sur toute la chaîne plaque : cartographie de toutes les machines avec une note de zone à risque (criticité de la machine × propreté de la zone × facilité d’accès) pour prioriser les actions.',
      'Analyse des risques industriels : cotation risque × probabilité d’accident, évaluée sans puis avec EPI, pour chiffrer le gain de chaque amélioration (par exemple une barrière de sécurité rehaussée contre le basculement).',
      'Chantier 5S dans la zone de rangement des outils de production ; travail transverse avec la production, la maintenance et la qualité.',
    ]},
    { role: 'Apprenti mesures / industrialisation', company: 'Wilo France — Laval (FR) · pompes pour systèmes sanitaires et incendie', dates: '09.2021 – 08.2022', bullets: [
      'Création des tests d’étanchéité de la nouvelle ligne HomeBooster (16 modèles) en 3 programmes ATEQ paramétrés (1 min 30, fuite ≤ 6 cm³/min) : choix simplifié pour les opérateurs, ~30 s gagnées par test.',
      'Zone EPA (décharges électrostatiques) sur la ligne Plavis : définition, mesure de la résistivité et de la mise à la terre ; ligne inspectée par un organisme externe pour la certification du site.',
      'Protocole de contrôle du sertissage des câbles électriques ; récapitulatif des paramètres de soudage de toutes les machines.',
    ]},
  ],
  education: [
    { degree: 'Cursus ingénieur généraliste CentraleSupélec, par apprentissage (FISA)', school: 'CentraleSupélec, Metz (FR)', dates: '2023 – 2026', detail: '3e année : Photonics and Nano-systems Engineering. Mémoire : calibrage du système HoloScan. Cursus achevé ; diplôme (grade de Master, niveau 7 européen) délivré après validation de la certification d’anglais C1 exigée.' },
    { degree: 'Classe préparatoire ATS', school: 'Lycée Joliot-Curie, Rennes (FR)', dates: '2022 – 2023', detail: 'Année intensive en mathématiques et physique (~30 élèves) : 2e au 1er semestre, 1er en mathématiques et en physique ; dans les 10 premiers sur l’année.' },
    { degree: 'DUT Mesures Physiques', school: 'Université du Mans (FR)', dates: '2020 – 2022', detail: '120 ECTS, matériaux et systèmes de mesure. 1re année : dans les 15 premiers sur ~80. 2e année en apprentissage chez Wilo France : dans les 3 premiers des ~12 alternants.' },
  ],
  projects: [
    'Diode laser DFB à 1550 nm : courbe L-I, spectre optique (suppression des modes secondaires de 53 dB), oscillations de relaxation jusqu’à 8,5 GHz et réinjection optique.',
    'Spectroscopie Raman en espace libre : montage en rétrodiffusion construit de A à Z, identification de 8 plastiques inconnus.',
    'Holographie : hologramme 3D d’une pièce métallique à 532 nm, du montage à la reconstruction.',
    'Simulation : propagation dans un cristal photoréfractif (Kukhtarev, BPM), reservoir computing optoélectronique, Monte-Carlo.',
  ],
  skills: [
    ['Métrologie & R&D', 'Métrologie optique, mesure 3D par projection de franges, calibrage, plans d’expérience, analyse d’incertitudes, caractérisation (justesse, fidélité), caméras industrielles'],
    ['Optique & laboratoire', 'Bancs optiques, caméras et projecteurs, lasers (DFB, He-Ne, Nd:YAG), spectroscopie Raman, analyseurs de spectre optique et RF, polariseurs, lames demi et quart d’onde, oscilloscope'],
    ['Industrie & qualité', 'Tests d’étanchéité (ATEQ), zones EPA, 5S, maintenance autonome, analyse de risques'],
    ['Logiciels', 'MATLAB, Excel avancé, Python (notions : scripts de simulation et de traitement de données), LTspice, GOM Inspect, SensorPhase, CalibTool ; antérieurement LabVIEW, SolidWorks'],
  ],
  languages: ['Français : maternelle  |  Anglais : B1/B2  |  Allemand : A1, cours prévus  |  Chinois : A1/A2  |  Handball, escalade, basket NBA  |  Références sur demande'],
  interests: '',
  references: '',
}

const en = {
  title: 'CV Erwhan Le Couëffec - EN',
  subtitle: 'R&D Engineer specialised in photonics — I always test theory against measurement',
  contact: [
    'Riedisheim (FR), 30 min from Basel  |  +33 6 22 29 11 29  |  erwhan43@gmail.com  |  erwhan-le-coueffec.github.io',
    'French national (EU free movement, no sponsorship needed)  |  Driving licence B  |  Available immediately',
  ],
  labels: { profile: 'Profile', experience: 'Professional experience', education: 'Education', projects: 'Academic projects (selection)', skills: 'Skills', languages: 'Languages & interests' },
  profile: 'Trained at CentraleSupélec (generalist engineering programme completed in 2026), specialised in photonics, with 4 years of apprenticeship experience in industry and R&D: optical metrology, 3D measurement, calibration and instrumentation. I enjoy understanding a system in depth, measuring it and improving it through rigorous experimental work. I am looking for an R&D engineering role with a strong hands-on component, preferably in the Basel area.',
  experience: [
    { role: 'R&D Engineer (apprenticeship)', company: 'Holo3 — Saint-Louis (FR), Basel area · optical metrology', dates: '10.2025 – 09.2026', bullets: [
      'Mission 1 · Calibration-target detection: preliminary study on 3 targets (~1,300 measurements), then introduced Design of Experiments to the team on my own initiative (216 → 27, then 432 → 32 configurations), cutting the number of trials and quantifying each parameter’s influence: all act on black/white contrast.',
      'Mission 2 · HoloScan 3D system calibration (thesis): theory and uncertainty propagation, then 5 comparative studies (fringe projection, 2 cameras + 1 projector), validated on a certified 250.1097 mm ball bar: ±120 µm criterion met in 108 of 110 measurements, repeatability < 2 µm.',
      'Mission 3 · Vision measuring machines, in parallel: Mitutoyo qualified on a reference target (repeatability ~1 µm), compared with a Hexagon (target curvature 93 vs 155 µm); target characterisation identified as the main lever for calibration quality.',
    ]},
    { role: 'WCM / Continuous Improvement Engineer (apprenticeship)', company: 'Placoplatre (Saint-Gobain group) — Chambéry (FR) · plasterboard manufacturing', dates: '10.2023 – 06.2025', bullets: [
      'Plaster viscosity check: designed an OK/NOK fixture that sets the position of the ruler used to measure the spread diameter, turning an operator-dependent measurement into a repeatable one.',
      'Autonomous maintenance across the whole plasterboard line: mapped every machine with a risk-zone score (machine criticality × area cleanliness × ease of access) to prioritise actions.',
      'Industrial risk analysis: risk × accident-probability scoring, assessed without and with PPE, to quantify the gain of each improvement (e.g. a raised safety barrier preventing tipping).',
      '5S project in the production tool storage area; cross-functional work with production, maintenance and quality.',
    ]},
    { role: 'Measurement / Industrialisation Apprentice', company: 'Wilo France — Laval (FR) · pumps for sanitary and fire-protection systems', dates: '09.2021 – 08.2022', bullets: [
      'Created leak testing, previously non-existent, for 16 HomeBooster booster-pump models, grouped into 3 parameterised ATEQ programs (1 min 30 s test, leak criterion ≤ 6 cm³/min): simpler choice for operators, about 30 s saved per test.',
      'EPA zone (Electrostatic Protected Area) on the Plavis line: defined the zone, measured the resistivity and grounding of its elements; line inspected by an external body as part of the site certification.',
      'Inspection protocol for electrical cable crimping; compiled the welding parameters of all machines.',
    ]},
  ],
  education: [
    { degree: 'CentraleSupélec generalist engineering programme, apprenticeship track', school: 'CentraleSupélec, Metz (FR)', dates: '2023 – 2026', detail: 'Final year: Photonics and Nano-systems Engineering. Thesis: HoloScan system calibration. Programme completed; the degree (Master’s level, EQF 7) is awarded once the required C1 English certification is validated.' },
    { degree: 'Classe préparatoire ATS (intensive maths & physics year)', school: 'Lycée Joliot-Curie, Rennes (FR)', dates: '2022 – 2023', detail: 'Intensive maths & physics year (~30 students): 2nd in the first semester, 1st in maths and physics; top 10 over the year.' },
    { degree: 'DUT Mesures Physiques (2-year technical degree, 120 ECTS)', school: 'Université du Mans (FR)', dates: '2020 – 2022', detail: 'Materials and measurement systems. Year 1: top 15 of ~80. Year 2 as an apprentice at Wilo France: top 3 of ~12 apprentices.' },
  ],
  projects: [
    '1550 nm DFB laser diode: L-I curve, optical spectrum (53 dB side-mode suppression), relaxation oscillations up to 8.5 GHz and optical feedback.',
    'Free-space Raman spectroscopy: backscattering setup built from scratch, identification of 8 unknown plastics.',
    'Holography: recording and reconstructing the 3D hologram of a metal part at 532 nm.',
    'Photonics simulation: beam propagation in a photorefractive crystal (Kukhtarev model, BPM), optoelectronic reservoir computing, Monte Carlo methods.',
  ],
  skills: [
    ['Metrology & R&D', 'Optical metrology, fringe-projection 3D measurement, calibration, design of experiments, uncertainty analysis, characterisation (trueness, precision), industrial cameras'],
    ['Optics & lab', 'Optical benches, cameras and projectors, lasers (DFB, He-Ne, Nd:YAG), Raman spectroscopy, optical and RF spectrum analysers, polarisers, half- and quarter-wave plates, oscilloscope'],
    ['Industry & quality', 'Leak testing (ATEQ), EPA zones, 5S, autonomous maintenance, risk analysis'],
    ['Software', 'MATLAB, advanced Excel, Python (basic: simulation and data-processing scripts), LTspice, GOM Inspect, SensorPhase, CalibTool; previously LabVIEW, SolidWorks'],
  ],
  languages: ['French: native  |  English: B1/B2  |  German: beginner (A1), lessons planned  |  Chinese: basic (A1/A2)'],
  interests: 'Handball, bouldering, following sport (especially NBA basketball)  |  References available on request',
  references: '',
}

await buildCv(fr, 'Erwhan_Le_Coueffec_CV_FR.pdf')
await buildCv(en, 'Erwhan_Le_Coueffec_CV_EN.pdf')
