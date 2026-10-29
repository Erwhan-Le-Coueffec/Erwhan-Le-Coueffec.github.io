import { ballBar as B, positionRows, cornerSigma, typeAB, targetStats, globalIntrinsics } from './data'

const P = 'Position'
const K = 'k factor'

export const en = {
  ui: { brief: 'At a glance', briefHeads: ['The problem', 'What I did', 'The result'], toc: 'Contents', facts: 'Key figures', limit60: '±60 µm target', limit120: '±120 µm criterion', unit: 'Deviation from reference (µm)', source: 'Sources: master’s thesis, project report, test report and defence slides (Holo3 · CentraleSupélec, 2025–2026).' },

  holo: {
    kicker: 'Holo3 · Master’s thesis project · 2026',
    title: 'Assessing and improving the calibration of HoloScan',
    brief: ['Holo3 wanted to know whether its HoloScan calibration protocol was robust, and whether measurement uncertainty could be reduced.', 'I modelled the full chain (camera, projector, triangulation, uncertainties), then compared 5 protocol variants on identical acquisitions, validated on a certified ball bar.', 'Protocol confirmed as solid: 108 of 110 measurements within the ±120 µm criterion, repeatability < 2 µm. Target characterisation emerged as the main lever for improvement.'],
    lead: 'An industrial fringe-projection 3D measurement system. I worked through the full calibration chain, from optical theory to uncertainty propagation, then compared five protocol variants on identical acquisitions, validated on a certified ball bar.',
    meta: [
      ['Period', '2026, after the detection-parameter project · defended on 17 Sep. 2026'],
      ['Role', 'R&D engineer apprentice, working with a high degree of autonomy'],
      ['Tools', 'MATLAB · Excel · GOM 3D inspection software · CalibTool · SensorPhase · Basler cameras · Mitutoyo and Hexagon vision machines'],
    ],
    facts: [
      ['2 + 1', 'cameras + projector in HoloScan'],
      ['~2.3 M', '3D points per measurement, in ~1 s'],
      ['< 2 µm', 'measured repeatability on the ball bar'],
      ['108 / 110', 'measurements within the ±120 µm criterion, with an up-to-date target'],
      ['93–155 µm', 'real curvature of the target, ignored by an ideal grid'],
    ],
    sections: [
      { title: 'Context', body: [
        'Holo3 is a French Technology Resource Centre (CRT) specialised in optical metrology. It takes measurement technologies from laboratory concept to real-world application (raising their TRL). Having started with holographic interferometry, the company now works on deflectometry, fringe projection, digital image correlation and interferometric holography.',
        'HoloScan is a non-contact 3D measurement system with two cameras and one projector. Each camera-projector pair measures the object by triangulation, from two different angles. A measurement takes about one second and produces a cloud of about 2.3 million points (one point per pixel of a 1920 × 1200 sensor). The system maps industrial parts and detects surface defects down to half a millimetre.',
        'Each system is calibrated on site by a Holo3 employee in about an hour. The question: is the current protocol robust, and can it be improved to reduce measurement uncertainty and the size of detectable defects?',
      ]},
      { title: 'Goal and acceptance criterion', body: [
        'A measurement is accurate when it is both true (close to the real value) and precise (the same value when repeated). Both were assessed separately.',
        'The reference is a certified ball bar: 250.1097 mm between the centres of its two spheres. Holo3’s acceptance criterion depends on the diagonal d of the common field of view (about 600 mm):',
        { eq: 'current criterion: d / 5000 = 600 mm / 5000 = ±120 µm      explored target: d / 10000 = ±60 µm' },
      ]},
      { title: 'Calibrating a camera: from 3D point to pixel', body: [
        'The pinhole model describes the path from a point on the object to a pixel in three steps:',
        { ul: [
          'Change of reference frame: rotation (computed as a rotation vector, stored as a quaternion, applied as a matrix), then translation. These are the extrinsic parameters.',
          'Projection onto the retinal plane, one unit from the optical centre: x′ = X/Z and y′ = Y/Z.',
          'Mapping to the CMOS sensor: focal length (fx, fy), optical centre (Cx, Cy) and lens distortion, radial (k₁, k₂) and tangential (p₁, p₂). These are the intrinsic parameters.',
        ]},
        { eq: 'x″ = x′(1 + k₁r² + k₂r⁴) + 2p₁x′y′ + p₂(r² + 2x′²)      with r² = x′² + y′²' },
        'In practice, a 100-intersection checkerboard target is used (36 points are enough in theory). Intersections are detected with sub-pixel resolution by the Harris algorithm, which relies on the grey-level gradient. The settings directly drive detection quality:',
        { ul: [
          'Focus: black/white transition over 1 to 2 pixels.',
          'Depth of field: aperture set so the transition stays ≤ 4 pixels at the ends of the volume.',
          'Exposure: mean white level around 220 out of 255 grey levels, without saturation.',
          'Acquisition: 15 images (5 positions × 3 levels of the volume; 12 would be enough in theory), then Levenberg–Marquardt optimisation.',
          'Validation: reprojection error below 0.1 pixel.',
        ]},
      ]},
      { title: 'Calibrating the projector: fringe projection', body: [
        'A projector is an inverted camera (a DLP chip instead of a CMOS sensor), so the optical model is the same. To find which projector pixel lights each target intersection, sinusoidal fringe patterns are projected and observed by the calibrated camera.',
        { eq: 'Iᵢ(x,y) = I₀(x,y) · [1 + m · sin(2π/P · Φ(x,y) + φᵢ)]      φᵢ = 0, π/2, π, 3π/2' },
        { eq: 'Φ = atan2(I₁ − I₃ ; I₂ − I₄)      →      C(x) = P/2π · Φ + P/2' },
        'Each pattern is projected with 4 phase shifts of π/2. Vertical fringes give one coordinate, horizontal fringes the other, with increasingly fine periods (from 2048 down to 32 pixels) for accuracy. Camera and projector are calibrated from the same acquisitions, with the same reprojection criterion of < 0.1 pixel.',
      ]},
      { title: 'Triangulation', body: [
        'For each camera pixel, the point O lies where the camera ray meets the projector ray. Two measured lines never intersect perfectly, so an error term ε is added along their common perpendicular.',
        { eq: '0 = t − k_c·v_c + k_p·(R·v_p) + ε·(v_c ∧ R·v_p) / ‖v_c ∧ v_p‖' },
        't and R are the projector → camera translation and rotation. The system is rewritten as AX = B with X = (k_c, k_p, ε/‖v_c ∧ v_p‖) and solved as X = A⁻¹B. The measured point is O = k_c · (x′_c, y′_c, 1) in the camera frame.',
      ]},
      { title: 'Theoretical study: uncertainty propagation', body: [
        'I applied the law of propagation of uncertainty to this model to find the dominant parameters and predict the uncertainty of a point.',
        { eq: 'u(f) = √ Σ (∂f/∂xᵢ · Δxᵢ)²' },
        { ul: [
          'Reprojection error (~0.02 to 0.03 px) and optical-centre uncertainty (0.6 to 1.5 px) of camera and projector, mapped to the retinal plane by dividing by the focal length.',
          'Quaternion: Δq = 10⁻¹², the reliability of the computing algorithm.',
          'Translation: thermal expansion of the camera-projector mount, Δt = D · tᵢ · ΔT.',
          'k_c, k_p and ε treated as ideal.',
        ]},
        { eq: 'u(x) ≈ √(k_p²(Δx′_p² + Δy′_p²) + (k_c·Δx′_c)²)      u(z) ≈ k_p · √(Δx′_p² + Δy′_p²)' },
        'For a real point about 1.06 m away, the model gives an expanded uncertainty (k = 2) of ±0.81 mm in X, ±0.75 mm in Y and ±0.14 mm in Z for a single pixel. But a sphere centre is estimated from 16,000 to 18,500 points, so the uncertainty on the centre is divided by √N, giving about 3 µm. This prediction is checked against measurement below.',
      ]},
      { title: 'Experimental method', body: [
        'A key advantage of fringe projection: the 3D measurement is computed after acquisition. I therefore acquired the ball bar only once, in 5 positions (2 slightly tilted, 2 strongly tilted, 1 arbitrary), then reprocessed the very same images with each calibration variant. Only one variable changes at a time.',
        { ul: [
          'Sphere centres obtained by sphere fitting in GOM 3D inspection software.',
          'Scale correction by a factor k (mean of reference/measurement ratios), always equal to 1 within 10⁻⁴ (0.9990 to 1.0006).',
          'Indicator: difference between the corrected length and 250.1097 mm, for each position and each camera.',
          'Baseline: 15 target positions per calibration, a realistic compromise for industrial use.',
        ]},
      ]},
      { title: 'Study 1 · Where to calibrate?', body: [
        'Two approaches were compared. In the first, calibration covers only the field shared by both cameras and the projector, so the same 15 target positions serve both cameras. In the second, each camera-projector pair is calibrated separately (2 × 15 = 30 acquisitions).',
        { chart: { c: 'Ball-bar deviation by calibrated field', series: [['Common field · cam. 1', B.commonField.cam1], ['Common field · cam. 2', B.commonField.cam2], ['Separate fields · cam. 1', B.pairFields.cam1], ['Separate fields · cam. 2', B.pairFields.cam2]] } },
        { table: { c: 'Deviation from reference (µm)', h: ['', 'Common field · cam. 1', 'Common field · cam. 2', 'Separate fields · cam. 1', 'Separate fields · cam. 2'], r: positionRows(P, K, [['commonField', 'cam1'], ['commonField', 'cam2'], ['pairFields', 'cam1'], ['pairFields', 'cam2']]) } },
        'Results are similar. With one exception (−126.2 µm, separate fields, camera 1, position 4), every measurement stays within ±60 µm. That measurement even slightly exceeds the ±120 µm criterion. Calibration in the common field is the only configuration where all ten measurements stay within ±50 µm. Conclusion: a single set of target positions can calibrate both cameras.',
      ]},
      { title: 'Study 2 · Knowing the calibration target', body: [
        'Calibration relies on a “target file” that describes the position of every intersection. I had the PC-B target (20 mm pitch) measured on two vision machines, Mitutoyo and Hexagon, then calibrated the system with each file.',
        'The two machines, compared in detail in the “Vision-machine characterisation” project, agree in X and Y but not in Z: the target is curved, with an amplitude of 93 µm on the Mitutoyo and 155 µm on the Hexagon. The question here is how that gap affects calibration.',
        { chart: { c: 'Deviation by target file', series: [['Mitutoyo · cam. 1', B.mitutoyo.cam1], ['Mitutoyo · cam. 2', B.mitutoyo.cam2], ['Hexagon · cam. 1', B.hexagon.cam1], ['Hexagon · cam. 2', B.hexagon.cam2]] } },
        { table: { c: 'Deviation from reference (µm)', h: ['', 'Mitutoyo · cam. 1', 'Mitutoyo · cam. 2', 'Hexagon · cam. 1', 'Hexagon · cam. 2'], r: positionRows(P, K, [['mitutoyo', 'cam1'], ['mitutoyo', 'cam2'], ['hexagon', 'cam1'], ['hexagon', 'cam2']]) } },
        'Switching target files shifts the result of the same acquisition by up to about 40 µm. The ±120 µm criterion is still met, and ±60 µm is met for most of positions 1, 2, 3 and 5. Position 4 (strongly tilted bar) remains the hardest, around ±110 µm.',
        { note: 'The key finding of the project: a calibration using an outdated target file produces deviations of up to −217 µm (study 4). Target characterisation matters far more than any of the protocol variants tested.' },
      ]},
      { title: 'Study 3 · More images, more repeatability?', body: [
        'Each of the 15 target positions is acquired 1, 3, 5 or 10 times (15×N). In a second variant, the N acquisitions are averaged into a single image (15×Mn).',
        { table: { c: 'Calibration with repeated acquisitions (µm)', h: ['', '15×1 · c1', '15×1 · c2', '15×3 · c1', '15×3 · c2', '15×5 · c1', '15×5 · c2', '15×10 · c1', '15×10 · c2'], r: positionRows(P, K, [['x1', 'cam1'], ['x1', 'cam2'], ['x3', 'cam1'], ['x3', 'cam2'], ['x5', 'cam1'], ['x5', 'cam2'], ['x10', 'cam1'], ['x10', 'cam2']]) } },
        { table: { c: 'Calibration with averaged images (µm)', h: ['', '15×1 · c1', '15×1 · c2', '15×M3 · c1', '15×M3 · c2', '15×M5 · c1', '15×M5 · c2', '15×M10 · c1', '15×M10 · c2'], r: positionRows(P, K, [['x1', 'cam1'], ['x1', 'cam2'], ['m3', 'cam1'], ['m3', 'cam2'], ['m5', 'cam1'], ['m5', 'cam2'], ['m10', 'cam1'], ['m10', 'cam2']]) } },
        'No clear improvement. Apart from two isolated cases (15×5 camera 1, and 15×M10 position 5 camera 2), the variants differ by less than 15 µm. Adding repeatability to calibration brings nothing: the current, faster protocol remains the best choice.',
      ]},
      { title: 'Study 4 · Three ways to use 150 images', body: [
        '15 positions × 10 acquisitions, processed in three ways on one camera-projector pair: one global calibration with all 150 images, 10 calibrations of 15 images with averaged parameters, and one calibration on 15 averaged images.',
        { table: { c: 'Deviation from reference, camera 1 (µm)', h: ['', '150 images', '10 calibrations', 'Averaged images'], r: positionRows(P, K, [['all150', 'cam1'], ['tenCal', 'cam1'], ['averaged', 'cam1']]) } },
        'The three approaches differ by less than 8 µm, so there is no point in adopting them. The generally larger deviations (down to −217.6 µm at position 3) come from an outdated target file used for this calibration, which confirms study 2.',
      ]},
      { title: 'Study 5 · Calibrating only part of the field', body: [
        'On some sites the full field cannot be calibrated. I therefore calibrated in 1 corner (12 positions, the theoretical minimum), 2 corners (24 positions) or 4 corners (48 positions). Since the ball bar lies outside the calibrated area, the indicator is the mean standard deviation of the target intersections.',
        { table: { c: 'Mean standard deviation per intersection (µm)', h: ['', '1 corner · c1', '2 corners · c1', '4 corners · c1', '1 corner · c2', '2 corners · c2', '4 corners · c2'], r: cornerSigma } },
        'Apart from the “2 corners” case on camera 1, results are close. The 1-corner case is weaker because it uses only the theoretical minimum of positions, fewer than Holo3’s usual practice. Calibrating only the area where the object will be measured is sufficient.',
      ]},
      { title: 'Theory versus practice', body: [
        'The ball bar is measured 5 times in the same position (position 5, common field, camera 1). The Type A uncertainty, u = σ/√n, is compared with the Type B uncertainty predicted by the model.',
        { table: { c: 'Uncertainty on sphere-centre position (µm)', h: ['', 'Sphere 1 · Type A', 'Sphere 1 · Type B', 'B/A ratio', 'Sphere 2 · Type A', 'Sphere 2 · Type B', 'B/A ratio'], r: typeAB } },
        'In X and Y, real repeatability is 2 to 3 times better than predicted. In Z, the measurement is slightly worse than the model (ratio 0.4 to 0.7). The orders of magnitude agree: the uncertainty model is appropriate, and HoloScan’s repeatability is below 2 µm.',
      ]},
      { title: 'Conclusions', body: [
        { ul: [
          'Holo3’s calibration protocol is solid: with an up-to-date target, 108 of 110 ball-bar measurements meet the ±120 µm criterion (exceedances: −126.2 and −120.4 µm).',
          'No costlier variant (more images, averaging, repetitions) improves calibration. The current calibration time is the right one.',
          'Target characterisation is the main lever: a poorly described target causes the largest deviations.',
          'Both cameras can be calibrated with the same positions in the common field, and only the useful area needs calibrating.',
          'Repeatability below 2 µm; ±60 µm trueness is reached in part of the cases.',
        ]},
      ]},
      { title: 'Recommendations and next steps', body: [
        { ul: [
          'Check calibration targets once a year.',
          'Add a ball-bar measurement to verify every calibration: catch poor calibrations and aim for ±60 µm.',
          'Study the effect of temperature and ageing on the target.',
          'Apply these tests to the calibration of deflectometry systems, which are far more sensitive.',
          'A simple offset correction does not work: the measured object can sit in many positions.',
        ]},
      ]},
      { title: 'What I learned', body: [
        'Understand the full optical and mathematical chain before measuring. Design comparisons where only one variable changes. Accept a “no improvement” result when the data says so: it is valuable information for the company too.',
        'On ethics: never adjust a measurement to get the desired result. A customer must receive a system that matches what was promised, and a ball-bar check supports that.',
        'I also discovered how a small organisation works, very differently from a large group like Saint-Gobain, with close ties between teams.',
      ]},
    ],
  },

  doe: {
    kicker: 'Holo3 · Engineering project · Oct. 2025 – Apr. 2026',
    title: 'Which parameters affect calibration-target detection?',
    brief: ['Detecting calibration-target intersections, the first step of any calibration, depends on many coupled parameters, previously tested one or two at a time.', 'Preliminary study on 3 targets (~1,300 measurements), then introduced two Designs of Experiments to the team (216 → 27 and 432 → 32 configurations).', 'Design of Experiments cut the number of trials and quantified the influence of each parameter: light colour, exposure, aperture and angle. The conclusion: they all act on the target’s black/white contrast.'],
    lead: 'Before any calibration, a camera must precisely detect the intersections of a target. I ran a preliminary study on three targets, then introduced two Designs of Experiments to the team to quantify the effect of lighting, exposure and aperture.',
    meta: [
      ['Period', 'Oct. 2025 – Apr. 2026 · presented on 28 Apr. 2026'],
      ['Role', 'R&D engineer apprentice · proposed the method and ran it end to end'],
      ['Tools', 'Basler acA1920-40gm camera · 16 mm lens · EFFI-FLEX lighting · SensorPhase · CalibTool 1.5.1.4 · MATLAB · Excel · ImageJ'],
    ],
    facts: [
      ['~1,300', 'target measurements in the preliminary study'],
      ['216 → 27', 'configurations with the first Design of Experiments'],
      ['432 → 32', 'configurations in the second design'],
      ['0.02 px', 'minimum intersection scatter'],
      ['3–5 min', 'of drift after the camera is switched on'],
    ],
    sections: [
      { title: 'Context and question', body: [
        'Every camera measurement starts with detecting the intersections of a checkerboard target. The CalibTool software combines the Harris algorithm with further image processing. Until then, tests at Holo3 varied one or two parameters at a time.',
        'The question: which parameters, external or internal to the camera, affect the trueness and precision of the detected position, and by how much?',
      ]},
      { title: 'Test bench', body: [
        { ul: [
          'Basler acA1920-40gm camera: monochrome CMOS sensor, 1920 × 1200 px (11.33 × 7.13 mm), 5.86 µm pixels, visible spectrum.',
          'Basler C11-1620-12M lens: 16 mm fixed focal length, aperture f/2 to f/16.',
          'EFFI-FLEX blue (465 nm) and red (625 nm) lights, plus a white light.',
          'Optical table, black cloth and felt to suppress stray reflections.',
          'Acquisition with SensorPhase, detection with CalibTool 1.5.1.4 (Bouguet tools in MATLAB), processing in MATLAB and Excel.',
        ]},
      ]},
      { title: 'Phase 1 · Preliminary study on three targets', body: [
        { table: { c: 'Targets used', h: ['Target', 'Checkerboard', 'Intersections', 'Square size'], r: [['Opaline', '12 × 9 squares', 88, '28 mm'], ['PC-B', '11 × 11 squares', 100, '20 mm'], ['Ceramic', '11 × 11 squares', 100, '5 mm']] } },
        'Session 1: opaline and PC-B targets, three light colours and two exposure times (close to saturation, then halved: 1,500 then 750 µs under white light). Two series of 25 measurements, one hour apart.',
        { ul: [
          'Opaline target: loss of contrast under blue and red light; intersections not found because of reflections from the frame and the table.',
          'PC-B target: standard deviation of 0.02 to 0.03 px, min-max spread of 0.1 to 0.2 px.',
          'Effect of exposure time: about 0.05 px, 0.1 px at worst.',
          'Systematic shift depending on colour: along x for blue, along y for red.',
          'Periodic scatter peaks under the area most strongly lit by the lamp.',
          'Only one outlier in about 1,300 measurements overall.',
        ]},
        'Session 2: black cloth and felt added, 5 lighting angles (−45°, −10°, 0°, +10°, +45°) plus ambient light, i.e. 32 configurations × 25 measurements.',
        { table: { c: 'Repeatability of intersection position (pixels)', h: ['', 'Opaline', 'PC-B'], r: targetStats(['mean σ', 'max σ', 'mean min-max Δ', 'max min-max Δ']) } },
        'The PC-B target is the most repeatable. But as soon as configurations are compared with one another, deviations grow tenfold (about 0.1 px, up to 0.25–0.3 px): lighting really moves the detected position. The Type A uncertainty on a position remains 0.012 px (k = 2).',
        'Session 3: the ceramic target (5 mm squares) is too small for CalibTool. Detection in MATLAB with a predefined search area: standard deviation of about 0.008 px.',
        { note: 'Start-up drift: one measurement per minute for 1 h after switching on shows the intersections drifting along y for 3 to 5 minutes before stabilising. Likely cause: thermal expansion of the sensor mount. In practice, let the camera settle before calibrating.' },
        'Phase 1 outcome: the main factor is uneven lighting of the target (power, diffusion, angle, impact area, lamp shape, reflections). Because these parameters are coupled, a method able to test them together was needed.',
      ]},
      { title: 'Phase 2 · First Design of Experiments', body: [
        'I proposed Design of Experiments, a method new to the team, to test all parameters at once and measure their interactions.',
        { ul: [
          '6 factors: colour (3 levels), angle −45° / 0° / +45° (3), exposure time (3), external reflections (with or without), specular reflection (centred or not), source shape (rectangular or point).',
          'Full factorial: 216 configurations, reduced to 27 runs.',
          'Run order randomised, variables coded between −1 and +1.',
          '30 acquisitions per configuration: the mean point gives trueness (compared with a reference configuration close to a standard calibration), the extreme points give precision.',
          'Effects computed in Excel, each plotted with its error bar. A factor is considered negligible if its error bar exceeds the effect.',
        ]},
        { table: { c: 'First design results', h: ['', 'Trueness', 'Precision'], r: [['Influential factor', 'Light colour', 'Exposure time'], ['Values (pixels)', '−0.17 to +0.15 (x, y) · up to 0.25 in norm', '0.02 to 0.09']] } },
        'Limitations: the symmetric angle (−45° / +45°) could hide an effect, and aperture was not tested.',
      ]},
      { title: 'Second Design of Experiments', body: [
        { ul: [
          'Added aperture (3 levels) and 8-bit versus 16-bit image depth.',
          'Lighting angle from 0° to 45° to remove the symmetry.',
          'Exposure set for constant contrast: white at 220 in 8-bit, at 57,000 in 16-bit.',
          'Full factorial: 432 configurations, reduced to 32 runs.',
        ]},
        { table: { c: 'Second design results', h: ['', 'Trueness', 'Precision'], r: [['Influential factors', 'Light colour', 'Aperture · lighting angle'], ['Values (pixels)', '−0.17 to +0.15', '0.02 to 0.04']] } },
      ]},
      { title: 'Reading the results: black/white contrast as the common thread', body: [
        'The significant factors share one thing: they control the contrast the camera actually sees at the border between black and white squares, exactly where the intersection is detected.',
        { ul: [
          'Light colour affects trueness: a shift of about a tenth of a pixel.',
          'Exposure time, aperture and lighting angle affect precision, at the hundredth-of-a-pixel level.',
          'With contrast held constant (second design), scatter drops from 0.02–0.09 px to 0.02–0.04 px.',
        ]},
        'In short: detection is highly precise (hundredth of a pixel), slightly less true (tenth of a pixel), and contrast is the lever to control.',
      ]},
      { title: 'Phase 3 · Global or local calibration?', body: [
        'Can a camera’s intrinsics be computed without covering its whole field of view? Wide-field setup on 5 levels, lit by ambient light. The “global” reference uses 625 images. The field is then split into 8 sub-areas of 15 images each, with a slightly or strongly tilted target, to compute “local” intrinsics.',
        { table: { c: 'Global reference intrinsics (pixels for f and c)', h: globalIntrinsics.head, r: [['Value', ...globalIntrinsics.value], ['Uncertainty', ...globalIntrinsics.unc]] } },
        'Result: a local calibration is equivalent to the global one. Tilt gives similar values, but uncertainties are lower with a strongly tilted target. This was later confirmed on HoloScan (study 5 of the master’s thesis).',
      ]},
      { title: 'Conclusions and what I learned', body: [
        { ul: [
          'Holo3’s calibration procedure is very good. Room for improvement lies in controlling lighting and contrast.',
          'Parameters to watch: light colour and angle, exposure time, aperture.',
          'Let the camera settle for a few minutes before calibrating.',
          'Calibrating on part of the field works, preferably with a strongly tilted target.',
        ]},
        'This project taught me to structure a test campaign: define variables and their ranges, randomise, code, and judge an effect against its uncertainty rather than by intuition. It also laid the groundwork for the HoloScan master’s thesis.',
      ]},
    ],
  },
  vision: {
    kicker: 'Holo3 · Run alongside the HoloScan project · 2026',
    title: 'Do two vision machines give the same measurement?',
    brief: ['Measured on two vision machines, the same calibration target gave different results. Which one to trust, and are the machines equivalent?', 'I qualified the Mitutoyo machine on a reference target, then compared both machines intersection by intersection on the PC-B target used to calibrate HoloScan.', 'Mitutoyo repeatability around one micrometre. The machines agree in X and Y but differ in Z on the target’s curvature, a gap that carries over to the HoloScan calibration by up to ~40 µm.'],
    lead: 'A pure metrology project, run alongside the HoloScan calibration: check a measuring instrument before trusting it, then understand where the differences between two instruments come from.',
    meta: [
      ['Period', '2026, alongside the HoloScan project'],
      ['Role', 'R&D engineer apprentice'],
      ['Tools', 'Mitutoyo and Hexagon vision measuring machines · ceramic reference target · PC-B target · MATLAB · Excel'],
    ],
    facts: [
      ['~1 µm', 'Mitutoyo repeatability on a reference target'],
      ['±20 nm', 'pitch tolerance of the reference target (7 mm)'],
      ['5 / 2 µm', 'standard deviation between machines in X / Y'],
      ['93 vs 155 µm', 'target curvature per Mitutoyo / Hexagon'],
      ['~40 µm', 'maximum effect on the HoloScan calibration'],
    ],
    sections: [
      { title: 'Context and question', body: [
        'HoloScan’s calibration relies on a file describing the real position of every target intersection. That file comes from a measurement on a vision machine. Yet the same target, measured on two machines (Mitutoyo and Hexagon), gave different results.',
        'The question: are the two machines equivalent, and which target measurement should be used?',
      ]},
      { title: 'Step 1 · Qualifying the Mitutoyo machine', body: [
        'Before comparing two instruments, you need to know how each performs. I measured a ceramic reference target whose 7 mm pitch is known to ±20 nm, a reference far more precise than the machine itself.',
        { ul: [
          'Intersections of the reference target measured 10 times.',
          'Repeatability computed on each axis.',
        ]},
        { table: { c: 'Mitutoyo repeatability uncertainty (10 measurements)', h: ['Axis', 'X', 'Y', 'Z'], r: [['Uncertainty (µm)', 0.5, 0.7, 1.4]] } },
        'The Mitutoyo machine therefore measures with a repeatability of around one micrometre, more than enough to characterise a calibration target.',
      ]},
      { title: 'Step 2 · Comparing the two machines', body: [
        'I then compared, intersection by intersection, the measurements of the PC-B target (20 mm pitch) made on both machines.',
        { ul: [
          'In X and Y the machines agree: standard deviation of 5 µm in X and 2 µm in Y.',
          'In Z the target is not flat but curved, and the machines do not measure the same amplitude: 93 µm on the Mitutoyo, 155 µm on the Hexagon (z_max − z_min).',
        ]},
        'The machines are therefore equivalent in-plane; the curvature measurement is what makes the difference.',
      ]},
      { title: 'Step 3 · Measuring the effect on calibration', body: [
        'To see whether this gap matters in practice, I calibrated HoloScan with each of the two files, on the same acquisitions, then checked the result on the certified ball bar.',
        'Switching files shifts the ball-bar measurement by up to about 40 µm. Both calibrations stay within the ±120 µm criterion: the gap is real but not a deal-breaker for fringe projection. Detailed results are in study 2 of the HoloScan project.',
      ]},
      { title: 'Conclusions and recommendations', body: [
        { ul: [
          'A measuring machine must be qualified on a reference standard before it serves as a reference.',
          'The real geometry of the target, especially its curvature, is the main lever for calibration quality.',
          'Recommendation: check targets once a year and study how temperature affects their shape.',
          'For more sensitive methods such as deflectometry, the gap between machines would become decisive.',
        ]},
      ]},
      { title: 'What I learned', body: [
        'Never trust an instrument before comparing it with a reference, and always find on which axis, and why, two measurements disagree before drawing conclusions.',
      ]},
    ],
  },
}
