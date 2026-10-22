import { mkdirSync, writeFileSync } from 'node:fs'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const A4 = [595.28, 841.89]
const OUT = 'public/cv'
const LEFT = 42
const RIGHT = 553
const BOTTOM = 40

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
    this.need(40); this.y -= 3
    this.text(title.toUpperCase(), LEFT, 8.4, this.f.bold, colors.cyan)
    this.page.drawLine({ start: { x: LEFT, y: this.y - 5 }, end: { x: RIGHT, y: this.y - 5 }, thickness: 0.7, color: colors.light })
    this.y -= 16
  }
  bullet(t) {
    const lines = wrap(t, this.f.regular, 7.55, RIGHT - 54)
    this.need(lines.length * 9.1)
    this.page.drawCircle({ x: 46, y: this.y + 2.2, size: 1.4, color: colors.cyan })
    for (const line of lines) { this.page.drawText(line, { x: 54, y: this.y, size: 7.55, font: this.f.regular, color: colors.text }); this.y -= 9.1 }
    this.y -= 1.8
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
  w.para(data.interests, LEFT, RIGHT - LEFT, 7.25, 9.4, f.regular, colors.muted)
  w.y -= 4
  w.para(data.references, LEFT, RIGHT - LEFT, 7.25, 9.4, f.bold, colors.navy)

  w.finish()
  mkdirSync(OUT, { recursive: true })
  writeFileSync(`${OUT}/${fileName}`, await doc.save())
}

const fr = {
  title: 'CV Erwhan Le Couëffec - FR',
  subtitle: 'Ingénieur R&D — Photonique, métrologie optique & instrumentation',
  contact: [
    'Riedisheim (FR), à 30 min de Bâle  |  +33 6 22 29 11 29  |  erwhan43@gmail.com  |  erwhan-le-coueffec.github.io',
    'Nationalité française (UE, libre circulation des personnes)  |  Permis B  |  Disponibilité immédiate',
  ],
  labels: { profile: 'Profil', experience: 'Expérience professionnelle', education: 'Formation', projects: 'Projets académiques (sélection)', skills: 'Compétences', languages: 'Langues & centres d’intérêt' },
  profile: 'Ingénieur généraliste CentraleSupélec spécialisé en photonique, avec 4 ans d’apprentissage dans l’industrie et la R&D : métrologie optique, mesure 3D, calibrage et instrumentation. J’aime comprendre un système en profondeur, le mesurer et l’améliorer par une démarche expérimentale rigoureuse. Je recherche un poste d’ingénieur R&D à forte composante expérimentale, en priorité dans la région de Bâle.',
  experience: [
    { role: 'Ingénieur R&D en apprentissage', company: 'Holo3 — Saint-Louis (FR), région de Bâle · métrologie optique', dates: '10.2025 – 09.2026', bullets: [
      'Mission 1 · Détection des intersections de mire : étude préliminaire sur 3 mires (~1 300 mesures), puis introduction des plans d’expérience dans l’équipe, à mon initiative (216 → 27, puis 432 → 32 configurations) : couleur d’éclairage, exposition, ouverture et angle identifiés comme facteurs influents.',
      'Mission 2 · Calibrage du système 3D HoloScan (mémoire) : théorie et propagation des incertitudes, puis 5 études comparatives (projection de franges, 2 caméras + 1 projecteur), validées sur barre à boules certifiée de 250,1097 mm : critère de ±120 µm respecté pour 108 mesures sur 110, fidélité < 2 µm.',
      'Mission 3 · Machines de mesure par vision, en parallèle : qualification de la Mitutoyo sur mire étalon (répétabilité ~1 µm), comparaison avec une Hexagon (courbure de mire de 93 vs 155 µm) ; caractérisation de la mire identifiée comme principal levier de qualité du calibrage.',
    ]},
    { role: 'Ingénieur WCM / amélioration continue en apprentissage', company: 'Placoplatre (groupe Saint-Gobain) — Chambéry (FR) · production de plaques de plâtre', dates: '10.2023 – 06.2025', bullets: [
      'Déploiement de standards World Class Manufacturing : maintenance autonome et 5S.',
      'Identification et analyse de risques industriels sur les lignes de production.',
      'Conception d’un support visuel OK/NOK simplifiant le contrôle de viscosité du plâtre par les opérateurs.',
      'Travail transverse avec les équipes production, maintenance et qualité.',
    ]},
    { role: 'Apprenti mesures / industrialisation', company: 'Wilo France — Laval (FR) · pompes pour systèmes sanitaires et incendie', dates: '09.2021 – 08.2022', bullets: [
      'Rationalisation des tests d’étanchéité de 16 modèles de surpresseurs HomeBooster en 3 programmes ATEQ paramétrés (test de 1 min 30, critère de fuite ≤ 6 cm³/min), soit un gain d’environ 30 s par test.',
      'Définition, mesure et déploiement d’une zone EPA certifiée (protection contre les décharges électrostatiques) sur la ligne Plavis.',
    ]},
  ],
  education: [
    { degree: 'Ingénieur CentraleSupélec — formation généraliste par apprentissage (FISA)', school: 'CentraleSupélec, Metz (FR)', dates: '2023 – 2026', detail: 'Grade de Master (niveau 7 du cadre européen). 3e année : Photonics and Nano-systems Engineering. Mémoire : amélioration du calibrage du système HoloScan. Diplôme en cours de validation administrative (janvier 2027).' },
    { degree: 'Classe préparatoire ATS', school: 'Lycée Joliot-Curie, Rennes (FR)', dates: '2022 – 2023', detail: 'Année intensive en mathématiques et physique. Classé dans les 10 premiers de la promotion.' },
    { degree: 'DUT Mesures Physiques', school: 'Université du Mans (FR)', dates: '2020 – 2022', detail: '120 ECTS, matériaux et systèmes de mesure ; 2e année en apprentissage chez Wilo France. Classé dans les 15 premiers de la promotion.' },
  ],
  projects: [
    'Diode laser DFB à 1550 nm : courbe L-I, spectre optique (suppression des modes secondaires de 53 dB), oscillations de relaxation jusqu’à 8,5 GHz et réinjection optique.',
    'Spectroscopie Raman en espace libre : montage en rétrodiffusion construit de A à Z, identification de 8 plastiques inconnus.',
    'Holographie : enregistrement et reconstruction de l’hologramme 3D d’une pièce métallique à 532 nm.',
    'Simulation photonique : propagation d’un faisceau dans un cristal photoréfractif (modèle de Kukhtarev, méthode BPM), reservoir computing optoélectronique, Monte-Carlo.',
  ],
  skills: [
    ['Métrologie & R&D', 'Métrologie optique, mesure 3D par projection de franges, calibrage, plans d’expérience, analyse d’incertitudes, caractérisation (justesse, fidélité), caméras industrielles'],
    ['Optique & laboratoire', 'Bancs optiques, lasers (DFB, He-Ne, Nd:YAG), spectroscopie Raman, analyseurs de spectre optique et RF, polariseurs, lames demi et quart d’onde, oscilloscope'],
    ['Industrie & qualité', 'Tests d’étanchéité (ATEQ), zones EPA, 5S, maintenance autonome, analyse de risques'],
    ['Logiciels', 'MATLAB, Python (NumPy, SciPy, Matplotlib), Excel avancé, LTspice, GOM Inspect, SensorPhase, CalibTool ; antérieurement LabVIEW, SolidWorks'],
  ],
  languages: ['Français : langue maternelle  |  Anglais : intermédiaire (B1/B2)  |  Allemand : débutant (A1), en cours d’apprentissage'],
  interests: 'Handball (5 ans en club, niveau départemental)  |  Escalade de bloc (5C à 6A)',
  references: 'Références professionnelles disponibles sur demande.',
}

const en = {
  title: 'CV Erwhan Le Couëffec - EN',
  subtitle: 'R&D Engineer — Photonics, Optical Metrology & Instrumentation',
  contact: [
    'Riedisheim (FR), 30 min from Basel  |  +33 6 22 29 11 29  |  erwhan43@gmail.com  |  erwhan-le-coueffec.github.io',
    'French national (EU free movement, no sponsorship needed)  |  Driving licence B  |  Available immediately',
  ],
  labels: { profile: 'Profile', experience: 'Professional experience', education: 'Education', projects: 'Academic projects (selection)', skills: 'Skills', languages: 'Languages & interests' },
  profile: 'Generalist engineer from CentraleSupélec specialised in photonics, with 4 years of apprenticeship experience in industry and R&D: optical metrology, 3D measurement, calibration and instrumentation. I enjoy understanding a system in depth, measuring it and improving it through rigorous experimental work. I am looking for an R&D engineering role with a strong hands-on component, preferably in the Basel area.',
  experience: [
    { role: 'R&D Engineer (apprenticeship)', company: 'Holo3 — Saint-Louis (FR), Basel area · optical metrology', dates: '10.2025 – 09.2026', bullets: [
      'Mission 1 · Calibration-target detection: preliminary study on 3 targets (~1,300 measurements), then introduced Design of Experiments to the team on my own initiative (216 → 27, then 432 → 32 configurations): light colour, exposure, aperture and angle identified as influential factors.',
      'Mission 2 · HoloScan 3D system calibration (thesis): theory and uncertainty propagation, then 5 comparative studies (fringe projection, 2 cameras + 1 projector), validated on a certified 250.1097 mm ball bar: ±120 µm criterion met in 108 of 110 measurements, repeatability < 2 µm.',
      'Mission 3 · Vision measuring machines, in parallel: Mitutoyo qualified on a reference target (repeatability ~1 µm), compared with a Hexagon (target curvature 93 vs 155 µm); target characterisation identified as the main lever for calibration quality.',
    ]},
    { role: 'WCM / Continuous Improvement Engineer (apprenticeship)', company: 'Placoplatre (Saint-Gobain group) — Chambéry (FR) · plasterboard manufacturing', dates: '10.2023 – 06.2025', bullets: [
      'Deployed World Class Manufacturing standards: autonomous maintenance and 5S.',
      'Identified and analysed industrial risks on the production lines.',
      'Designed a visual OK/NOK aid simplifying plaster viscosity checks for operators.',
      'Cross-functional work with production, maintenance and quality teams.',
    ]},
    { role: 'Measurement / Industrialisation Apprentice', company: 'Wilo France — Laval (FR) · pumps for sanitary and fire-protection systems', dates: '09.2021 – 08.2022', bullets: [
      'Streamlined leak testing of 16 HomeBooster booster-pump models into 3 parameterised ATEQ programs (1 min 30 s test, leak criterion ≤ 6 cm³/min), saving about 30 s per test.',
      'Defined, measured and deployed a certified EPA (Electrostatic Protected Area) on the Plavis production line.',
    ]},
  ],
  education: [
    { degree: 'CentraleSupélec Engineering Degree — generalist programme, apprenticeship track', school: 'CentraleSupélec, Metz (FR)', dates: '2023 – 2026', detail: 'Master’s level (EQF level 7). Final year: Photonics and Nano-systems Engineering. Thesis: improving the calibration of the HoloScan system. Degree being formally awarded (January 2027).' },
    { degree: 'Classe préparatoire ATS (intensive maths & physics year)', school: 'Lycée Joliot-Curie, Rennes (FR)', dates: '2022 – 2023', detail: 'Preparation for engineering-school entrance exams. Ranked in the top 10 of the class.' },
    { degree: 'DUT Mesures Physiques (2-year technical degree, 120 ECTS)', school: 'Université du Mans (FR)', dates: '2020 – 2022', detail: 'Materials and measurement systems; second year as an apprentice at Wilo France. Ranked in the top 15 of the class.' },
  ],
  projects: [
    '1550 nm DFB laser diode: L-I curve, optical spectrum (53 dB side-mode suppression), relaxation oscillations up to 8.5 GHz and optical feedback.',
    'Free-space Raman spectroscopy: backscattering setup built from scratch, identification of 8 unknown plastics.',
    'Holography: recording and reconstructing the 3D hologram of a metal part at 532 nm.',
    'Photonics simulation: beam propagation in a photorefractive crystal (Kukhtarev model, BPM), optoelectronic reservoir computing, Monte Carlo methods.',
  ],
  skills: [
    ['Metrology & R&D', 'Optical metrology, fringe-projection 3D measurement, calibration, design of experiments, uncertainty analysis, characterisation (trueness, precision), industrial cameras'],
    ['Optics & lab', 'Optical benches, lasers (DFB, He-Ne, Nd:YAG), Raman spectroscopy, optical and RF spectrum analysers, polarisers, half- and quarter-wave plates, oscilloscope'],
    ['Industry & quality', 'Leak testing (ATEQ), EPA zones, 5S, autonomous maintenance, risk analysis'],
    ['Software', 'MATLAB, Python (NumPy, SciPy, Matplotlib), advanced Excel, LTspice, GOM Inspect, SensorPhase, CalibTool; previously LabVIEW, SolidWorks'],
  ],
  languages: ['French: native  |  English: intermediate (B1/B2)  |  German: beginner (A1), currently learning'],
  interests: 'Handball (5 years in a club, regional level)  |  Bouldering (5C to 6A)',
  references: 'Professional references available on request.',
}

await buildCv(fr, 'Erwhan_Le_Coueffec_CV_FR.pdf')
await buildCv(en, 'Erwhan_Le_Coueffec_CV_EN.pdf')
