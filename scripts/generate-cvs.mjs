import { mkdirSync, writeFileSync } from 'node:fs'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const A4 = [595.28, 841.89]
const OUT = 'public/cv'

const colors = {
  navy: rgb(0.043, 0.102, 0.141),
  cyan: rgb(0.082, 0.596, 0.788),
  text: rgb(0.102, 0.153, 0.188),
  muted: rgb(0.37, 0.427, 0.467),
  light: rgb(0.87, 0.91, 0.93),
}

function wrap(text, font, size, maxWidth) {
  const words = text.split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      line = test
    } else {
      if (line) lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

function drawWrapped(page, text, x, y, maxWidth, font, size = 8, leading = 10, color = colors.text) {
  page.setFont(font)
  page.setFontSize(size)
  page.setFontColor(color)
  for (const line of wrap(text, font, size, maxWidth)) {
    page.drawText(line, { x, y, size, font, color })
    y -= leading
  }
  return y
}

function section(page, title, y, bold) {
  page.drawText(title.toUpperCase(), { x: 42, y, size: 8.4, font: bold, color: colors.cyan })
  page.drawLine({ start: { x: 42, y: y - 5 }, end: { x: 553, y: y - 5 }, thickness: 0.7, color: colors.light })
  return y - 18
}

function bullet(page, text, y, regular) {
  page.drawCircle({ x: 46, y: y + 2.2, size: 1.4, color: colors.cyan })
  return drawWrapped(page, text, 54, y, 499, regular, 7.55, 9.5) - 3
}

function experience(page, y, item, regular, bold) {
  page.drawText(item.company, { x: 42, y, size: 9.2, font: bold, color: colors.navy })
  const dateWidth = regular.widthOfTextAtSize(item.dates, 7.7)
  page.drawText(item.dates, { x: 553 - dateWidth, y, size: 7.7, font: regular, color: colors.muted })
  y -= 12
  page.drawText(item.role, { x: 42, y, size: 7.9, font: bold, color: colors.text })
  y -= 13
  for (const text of item.bullets) y = bullet(page, text, y, regular)
  return y - 1
}

function education(page, y, item, regular, bold) {
  page.drawText(item.school, { x: 42, y, size: 8.4, font: bold, color: colors.navy })
  const dateWidth = regular.widthOfTextAtSize(item.dates, 7.6)
  page.drawText(item.dates, { x: 553 - dateWidth, y, size: 7.6, font: regular, color: colors.muted })
  y -= 11
  page.drawText(item.degree, { x: 42, y, size: 7.7, font: bold, color: colors.text })
  y -= 10
  if (item.detail) y = drawWrapped(page, item.detail, 42, y, 511, regular, 7.1, 8.8, colors.muted)
  return y - 3
}

async function buildCv(data, fileName) {
  const doc = await PDFDocument.create()
  doc.setTitle(data.title)
  doc.setAuthor('Erwhan Le Coueffec')
  doc.setSubject('Curriculum Vitae')
  const page = doc.addPage(A4)
  const regular = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)

  page.drawText('Erwhan Le Coueffec', { x: 42, y: 790, size: 23, font: bold, color: colors.navy })
  page.drawText(data.subtitle, { x: 42, y: 771, size: 10.5, font: bold, color: colors.cyan })
  page.drawText(data.contact, { x: 42, y: 754, size: 7.35, font: regular, color: colors.muted })
  page.drawLine({ start: { x: 42, y: 743 }, end: { x: 553, y: 743 }, thickness: 1.8, color: colors.cyan })

  let y = 724
  y = section(page, data.labels.profile, y, bold)
  y = drawWrapped(page, data.profile, 42, y, 511, regular, 7.85, 10.1) - 7

  y = section(page, data.labels.experience, y, bold)
  for (const item of data.experience) y = experience(page, y, item, regular, bold)

  y = section(page, data.labels.education, y, bold)
  for (const item of data.education) y = education(page, y, item, regular, bold)

  y = section(page, data.labels.skills, y, bold)
  for (const [label, value] of data.skills) {
    page.drawText(label, { x: 42, y, size: 7.4, font: bold, color: colors.navy })
    y = drawWrapped(page, value, 148, y, 405, regular, 7.05, 8.8) - 3
  }

  y = section(page, data.labels.languages, y, bold)
  y = drawWrapped(page, data.languages, 42, y, 511, regular, 7.25, 9.0)
  y -= 4
  drawWrapped(page, data.interests, 42, y, 511, regular, 7.25, 9.0, colors.muted)

  mkdirSync(OUT, { recursive: true })
  writeFileSync(`${OUT}/${fileName}`, await doc.save())
}

const fr = {
  title: 'CV Erwhan Le Coueffec - FR',
  subtitle: 'Ingenieur R&D generaliste - Photonique & systemes optiques',
  contact: 'Mulhouse area, France | +33 6 22 29 11 29 | erwhan43@gmail.com | Permis B',
  labels: { profile: 'Profil', experience: 'Experience', education: 'Formation', skills: 'Competences', languages: 'Langues & interets' },
  profile: "Eleve-ingenieur a CentraleSupelec, specialise en photonique, avec une experience terrain en metrologie optique, calibrage, instrumentation et demarche experimentale. Recherche un poste R&D en Suisse avec une forte composante manipulation.",
  experience: [
    { company: 'Holo3', role: 'Ingenieur R&D en apprentissage', dates: 'Oct. 2025 - Sept. 2026', bullets: [
      "Amelioration du calibrage de HoloScan : comparaison de calibrages sur les memes acquisitions et validation avec une barre a boules certifiee de 250,1097 mm ; erreur maximale inferieure a 60 um sur toutes les positions testees, contre environ 120 um auparavant.",
      "Introduction d'un plan d'experience d'environ 30 essais couvrant 7-8 facteurs camera/eclairage ; analyse par regression lineaire multiple et identification du contraste noir/blanc comme facteur dominant.",
      "Caracterisation d'une machine de vision interne : justesse, repetabilite et incertitude.",
    ]},
    { company: 'Placoplatre', role: 'Ingenieur WCM / amelioration continue en apprentissage', dates: 'Oct. 2023 - Juin 2025', bullets: [
      "Maintenance autonome, 5S, identification de risques industriels et creation d'un support visuel OK/NOK pour simplifier le controle de viscosite du platre.",
    ]},
    { company: 'Wilo France', role: 'Apprenti mesures / industrialisation', dates: 'Sept. 2021 - Aout 2022', bullets: [
      "Reduction de 16 modeles HomeBooster a 3 programmes de test d'etancheite ATEQ, avec parametrage direct des programmes.",
      "Definition, mesure et deploiement d'une zone EPA certifiee sur la ligne Plavis.",
    ]},
  ],
  education: [
    { school: 'CentraleSupelec - Metz', dates: '2023 - 2026', degree: 'Formation ingenieur generaliste par apprentissage (FISA)', detail: "3e annee : Physique & Nanotechnologies - Photonics and Nano-systems Engineering. Validation des exigences du diplome attendue d'ici janvier 2027." },
    { school: 'Lycee Joliot-Curie - Rennes', dates: '2022 - 2023', degree: 'Classe preparatoire ATS', detail: '' },
    { school: 'Universite du Mans', dates: '2020 - 2022', degree: 'DUT Mesures Physiques', detail: 'Deuxieme annee en apprentissage chez Wilo France ; parcours mixte materiaux et systemes de mesure.' },
  ],
  skills: [
    ['Metrologie / R&D', "Metrologie optique, instrumentation, plan d'experience, analyse d'incertitudes, cameras industrielles"],
    ['Optique / labo', 'Bancs optiques, lasers, objectifs, polariseurs, lames demi/quart d onde, spectrometre, oscilloscope, generateur de fonctions'],
    ['Donnees / logiciels', 'MATLAB, Excel avance (Solver, regression, formules), LTspice, LabVIEW (experience anterieure), Python/VBA (notions), SolidWorks (experience anterieure)'],
  ],
  languages: 'Francais - langue maternelle | Anglais - B1/B2 | Allemand - debutant',
  interests: 'Handball - 5 ans, niveau amateur/departemental | Escalade de bloc - 5C a 6A',
}

const en = {
  title: 'CV Erwhan Le Coueffec - EN',
  subtitle: 'Generalist R&D Engineer - Photonics & Optical Systems',
  contact: 'Mulhouse area, France | +33 6 22 29 11 29 | erwhan43@gmail.com | Driving licence B',
  labels: { profile: 'Profile', experience: 'Experience', education: 'Education', skills: 'Technical skills', languages: 'Languages & interests' },
  profile: 'CentraleSupelec engineering student specializing in photonics, with hands-on experience in optical metrology, calibration, instrumentation and experimental design. Seeking an R&D position in Switzerland with a strong experimental component.',
  experience: [
    { company: 'Holo3', role: 'R&D Engineer Apprentice', dates: 'Oct. 2025 - Sep. 2026', bullets: [
      'Improved HoloScan calibration by comparing calibration strategies on identical acquisitions and validating with a certified 250.1097 mm ball bar; maximum error remained below 60 um at every tested position, versus roughly 120 um previously.',
      'Introduced a Design of Experiments approach with around 30 trials across 7-8 camera/lighting factors; used multiple linear regression and identified black/white target contrast as the dominant factor.',
      'Characterized an internal vision measurement machine for accuracy, repeatability and uncertainty.',
    ]},
    { company: 'Placoplatre', role: 'WCM / Continuous Improvement Engineer Apprentice', dates: 'Oct. 2023 - Jun. 2025', bullets: [
      'Worked on autonomous maintenance, 5S, industrial risk identification and a visual OK/NOK support to simplify plaster-viscosity control.',
    ]},
    { company: 'Wilo France', role: 'Measurement / Industrialization Apprentice', dates: 'Sep. 2021 - Aug. 2022', bullets: [
      'Reduced leak-test complexity for 16 HomeBooster pump models to 3 ATEQ test programs and configured the programs directly.',
      'Defined, measured and deployed a certified Electrostatic Protected Area (EPA) on the Plavis production line.',
    ]},
  ],
  education: [
    { school: 'CentraleSupelec - Metz', dates: '2023 - 2026', degree: 'Generalist Engineering Program - Apprenticeship (FISA)', detail: 'Third-year focus: Physics & Nanotechnology - Photonics and Nano-systems Engineering. Engineering degree requirements expected to be completed by January 2027.' },
    { school: 'Lycee Joliot-Curie - Rennes', dates: '2022 - 2023', degree: 'Classe preparatoire ATS', detail: 'Post-technical-degree preparation for engineering-school admission.' },
    { school: 'Universite du Mans', dates: '2020 - 2022', degree: 'DUT Mesures Physiques', detail: 'Second year completed as an apprentice at Wilo France; mixed focus on materials and measurement systems.' },
  ],
  skills: [
    ['Metrology / R&D', 'Optical metrology, instrumentation, experimental design, uncertainty analysis, industrial cameras'],
    ['Optics / lab', 'Optical benches, lasers, objectives, polarizers, half/quarter-wave plates, spectrometer, oscilloscope, function generator'],
    ['Data / software', 'MATLAB, advanced Excel (Solver, regression, formulas), LTspice, LabVIEW (previous experience), Python/VBA (basic), SolidWorks (previous experience)'],
  ],
  languages: 'French - Native | English - B1/B2 | German - Beginner',
  interests: 'Handball - 5 years, amateur/departmental level | Bouldering - 5C to 6A',
}

await buildCv(fr, 'Erwhan_Le_Coueffec_CV_FR.pdf')
await buildCv(en, 'Erwhan_Le_Coueffec_CV_EN.pdf')
console.log('Generated CV PDFs in public/cv')
