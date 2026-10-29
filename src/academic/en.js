import { media as M } from './media'

export const en = {
  kicker: 'CentraleSupélec · Final year, Photonics & Nano-systems · 2025–2026',
  title: 'Lab work and design projects',
  lead: 'What I built, measured and simulated during my specialisation year: four optical-bench experiments and four numerical-simulation projects. Group work is marked as such.',
  groups: { lab: 'Optical-bench experiments', sim: 'Numerical simulation' },
  labels: { date: 'Date', team: 'Team', tools: 'Equipment & tools' },
  solo: 'Individual',
  group: 'Group work (3 students)',
  groupN: 'Group work',
  items: [
    {
      id: 'diode-dfb', kind: 'lab', title: 'Dynamics of a 1550 nm DFB laser diode', date: 'February 2026', team: 'group',
      tools: 'LasersCom 1550 nm DFB diode · Thorlabs temperature-controlled mount and driver · Anritsu optical spectrum analyser · 12 GHz photodiode · Rohde & Schwarz RF spectrum analyser · Tektronix oscilloscope · Arduino-controlled variable attenuator',
      summary: 'Static and dynamic characterisation of a telecom laser diode, then study of its destabilisation by optical feedback.',
      figures: [
        { src: M.laserSpectre, alt: 'Optical spectrum of the DFB diode measured on the optical spectrum analyser', cap: 'Optical spectrum at 20 °C and 20 mA: line at 1549.713 nm.' },
        { src: M.laserRelaxation, alt: 'Squared relaxation frequency versus current, with linear fit', cap: 'Squared relaxation-oscillation frequency versus current: R² = 0.9961.' },
      ],
      body: [
        { ul: [
          'L-I curve at 20 °C (20 points): threshold around 6.5 mA, versus 7.9 mA stated at 25 °C in the datasheet. 11 curves from 15 to 25 °C show the threshold rising with temperature.',
          'Optical spectrum: main line at 1549.713 nm (−8.93 dBm) and a side-mode suppression ratio of 53 dB.',
          'Tunability: wavelength shift measured versus current (at 20 °C) and temperature (at 20 mA).',
          'Relaxation oscillations seen on the RF analyser, from about 1.5 to 8.5 GHz between 7 and 20 mA. Their squared frequency grows linearly with current (R² = 0.9961), as theory predicts.',
          'Optical feedback at 15 mA: transition from a steady state to a periodic regime as the power sent back into the laser increases (up to ~40 µW).',
        ]},
        { note: 'Cross-check: the line f² = 5.22·I − 32.8 reaches zero at I ≈ 6.3 mA, matching the threshold measured independently on the L-I curve (~6.5 mA).' },
      ],
    },
    {
      id: 'raman', kind: 'lab', title: 'Free-space Raman spectroscopy', date: 'April 2026', team: 'group',
      tools: 'Fibre-coupled green laser · interference filter · Notch and Edge filters · focusing lens · fibre coupling to a Raman spectrometer',
      summary: 'Building a backscattering Raman setup from scratch, then identifying unknown plastics from their spectra.',
      figures: [
        { src: M.ramanMontage, alt: 'Free-space Raman setup on an optical table, green laser on', cap: 'The setup we built, laser on (group photo).' },
        { src: M.ramanSpectre, alt: 'Raw Raman spectrum of a plastic sample', cap: 'Raw spectrum of one sample: residual laser line at 0 cm⁻¹, fluorescence background and Raman bands.' },
      ],
      body: [
        'The setup was built starting from the source, in about 1.5 hours, first aligned with a safer white lamp. The laser goes through an interference filter, reflects off a mirror and the filter, then is focused on the sample. Backscattered light passes a Notch or Edge filter to remove the laser line before entering the spectrometer fibre.',
        { ul: [
          'Notch and Edge filters compared on a white-light spectrum; tilting a filter shifts its cut-off wavelength.',
          '8 plastic samples measured and compared with reference spectra: 2 identified as PVC, 3 as PS, 1 as PMMA, 1 as PET, 1 unidentifiable.',
          'Laser-safety rules applied: wavelength-specific goggles, room lights on during alignment.',
        ]},
        'Acknowledged limitation: a new acquisition software nobody knew yet produced noisy spectra. Identification still worked from the characteristic bands, but baseline subtraction would have improved the analysis.',
      ],
    },
    {
      id: 'holographie', kind: 'lab', title: 'Recording a hologram', date: 'February 2026', team: 'group',
      tools: 'Frequency-doubled Nd:YAG laser (532 nm) · 50/50 beam splitter · spatial filters (microscope objective + pinhole) · mirrors · silver-halide holographic plate · developing baths',
      summary: 'Setup, exposure and development of the hologram of a metal part, then reconstruction of its 3D image.',
      figures: [
        { src: M.hologramme, alt: 'Reconstructed image of a metal part visible through the holographic plate lit in green', cap: 'The hologram we obtained: the 3D image of the metal part appears in the plate lit by the 532 nm laser.' },
      ],
      body: [
        { ul: [
          'Beam split into a reference arm and an object arm; each arm expanded and cleaned by spatial filtering.',
          'Reference beam sent to the plate at about 45° to the object beam; the object scatters light towards the plate.',
          'Exposure sized with E = P × t, for an energy of 50 to 300 µJ/cm² at a few mW.',
          'Darkroom work, no vibration or movement during exposure; development (developer, stop bath, fixer, rinse, drying).',
          'Reconstruction by re-illuminating the plate with the same laser, in the same orientation: the 3D image of the part is restored with its details.',
        ]},
        'Experimental protocol written as a group, from beam expansion to reconstruction.',
      ],
    },
    {
      id: 'pockels', kind: 'lab', title: 'Pockels effect and electro-optic modulation', date: '2025–2026', team: 'groupN',
      tools: '633 nm He-Ne laser · LiNbO₃ Pockels cell and high-voltage driver · polarisers and λ/4 plate · amplified detection · oscilloscope · loudspeaker',
      summary: 'Intensity modulation of a laser with a lithium niobate crystal in a Sénarmont setup, up to transmitting an audio signal.',
      body: [
        { ul: [
          'Sénarmont setup: polariser at 45° to the crystal axes, quarter-wave plate and analyser, turning phase modulation into intensity modulation.',
          'Half-wave voltage Vπ measured two ways: DC (0 to 400 V) and dynamically, through frequency doubling at 1 kHz on an extremum of the transfer function.',
          'Audio signal sent from a computer to a loudspeaker over the laser beam, at the linear operating point.',
          'Electro-optic coefficient r₂₂ derived and compared with the tabulated value.',
        ]},
        { table: { c: 'Results', h: ['', 'Measured', 'Theoretical / tabulated'], r: [['Half-wave voltage Vπ', '200 V', '310 V'], ['Coefficient r₂₂', '9.95 pm/V', '6.4 pm/V']] } },
        'The gap (about 55% on r₂₂) stays within the right order of magnitude. It most likely comes from the actual crystal dimensions and how precisely the extinction points could be read.',
      ],
    },
    {
      id: 'photorefractif', kind: 'sim', title: 'Laser propagation in a photorefractive medium', date: '2025–2026', team: 'solo',
      tools: 'MATLAB / Python · finite differences · implicit Runge-Kutta · split-step Fourier BPM',
      summary: 'Two linked projects: formation of the space-charge field in a crystal (Kukhtarev model), then nonlinear propagation of the beam.',
      body: [
        { ul: [
          'Insulating medium (single carrier type): finite-difference discretisation, tridiagonal system solved at each time step, mesh convergence study (from 40 × 50 to 4,000 × 5,000 points) and influence of beam size, intensity and pulse length.',
          'InP:Fe semiconductor (electrons and holes): stiff system solved with implicit Runge-Kutta, compared with an analytical solution, maximum relative deviation 0.025%.',
          'Refractive-index change through the Pockels effect, then propagation with the beam propagation method (diffraction in Fourier space, nonlinearity in real space): self-collimation of the beam in the crystal.',
        ]},
      ],
    },
    {
      id: 'reservoir', kind: 'sim', title: 'Photonic neuromorphic computing: time-delay reservoir computing', date: '2025–2026', team: 'solo',
      tools: 'Python · NumPy · SciPy',
      summary: 'Simulation of an optoelectronic oscillator (1550 nm laser, Mach-Zehnder modulator, fibre) used as a neural network to equalise a nonlinear WiFi channel.',
      body: [
        { eq: 'T·dx/dt + x = β·sin²(x(t − τ) + γ·u(t) + φ₀)      T = 250 ns, τ = 5 µs, β = 0.75, γ = 0.01, φ₀ = π/8' },
        { ul: [
          'Delay differential equation integrated with a 4th-order Adams predictor-corrector (10 ns step, 500 µs), handling the history on [−τ, 0].',
          'Pre-processing: zero-order hold then a random ±1 mask with θ = 50 ns steps, i.e. 100 time-multiplexed virtual nodes.',
          'Channel model: 10-tap linear filter, cubic nonlinearity and white Gaussian noise from 12 to 32 dB SNR, symbols ±1, ±3.',
          'Output layer trained by Moore-Penrose pseudo-inverse (3,000 training symbols, 10,000 test symbols, 100 washout), assessed by symbol error rate.',
        ]},
      ],
    },
    {
      id: 'monte-carlo', kind: 'sim', title: 'Monte Carlo methods', date: '2025–2026', team: 'solo',
      tools: 'Python · NumPy · Matplotlib',
      summary: 'Generating probability distributions and statistical estimates, from Gaussian sampling to Metropolis-Hastings.',
      body: [
        { table: { c: 'Results obtained by re-running my code', h: ['Exercise', 'Method', 'Result'], r: [
          ['Gaussian distribution', 'Box-Muller (10⁶ draws)', 'mean 0.002 · variance 0.998 (theory: 0 and 1)'],
          ['Non-standard distribution', 'Acceptance-rejection, exponential envelope M = 12', 'acceptance rate 11.6%'],
          ['Area of the unit disc', '1,000 × 10,000 points', 'π estimated at 3.1417 ± 0.016 · bias 7·10⁻⁵'],
          ['Decay chain X → Y', 'Binomial draws, 100 runs', 'agrees with the matrix-exponential solution'],
          ['Density π_α (α = 1)', 'Metropolis-Hastings / acceptance-rejection', 'E[X] = 0.597 / 0.636 (exact: 0.6065)'],
        ]}},
        'Metropolis-Hastings needed 1,500 iterations (500 of them burn-in) versus 2,063 draws for acceptance-rejection, for the same sample of 1,000 values.',
      ],
    },
    {
      id: 'chua', kind: 'sim', title: 'Coherence resonance in Chua’s chaotic circuit', date: '2025–2026', team: 'solo',
      tools: 'Python · NumPy · Matplotlib',
      summary: 'Comparison of deterministic and stochastic integration schemes on a chaotic system, and study of noise-induced jumps between attractors.',
      body: [
        { ul: [
          'Euler, Heun (RK2) and 4th-order Runge-Kutta schemes: two distinct chaotic attractors depending on the initial condition (±2, 0, 0), with no switching between them.',
          'Euler-Maruyama and stochastic Heun schemes, first validated at zero noise, then for D² = 0.0004, 0.0064 and 0.0256: noise triggers jumps between attractors.',
          'Robust transition detection with hysteresis thresholds (±0.5) after an initial settling phase.',
        ]},
      ],
    },
  ],
}
