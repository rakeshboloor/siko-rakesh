/**
 * SIKO STUDENT ONBOARDING VIEW
 * "Let's build your learning journey."
 * Multi-step discovery flow followed by an AI-calibrated calm diagnostic assessment.
 */

import { AppState } from '../state.js';
import { Icons, Stepper } from '../components.js';

export const DEFAULT_DIAGNOSTIC_BANK = {
  Mathematics: [
    {
      id: 1,
      subject: 'Mathematics',
      concept: 'Roots of Quadratic Equation & Discriminant Nature',
      cognitive_tag: 'Conceptual Foundation',
      difficulty: 'medium',
      question: 'For a quadratic equation ax² + bx + c = 0 with real coefficients (a ≠ 0), if the discriminant D = b² - 4ac < 0, what can be conclusively deduced about the roots and the parabola graph y = ax² + bx + c?',
      options: [
        'A. Two real and distinct roots; parabola intersects the x-axis at two distinct points.',
        'B. Two complex conjugate roots; parabola never intersects the real x-axis.',
        'C. Exactly one real repeated root; vertex touches the x-axis.',
        'D. Two purely imaginary roots; vertex lies at the origin.'
      ],
      correct: 'B',
      explanation: 'Since coefficients are real and D < 0, roots must occur in complex conjugate pairs u ± iv. The parabola lies entirely above (a > 0) or entirely below (a < 0) the real x-axis.'
    },
    {
      id: 2,
      subject: 'Mathematics',
      concept: 'Limits & Indeterminate Form Evaluation',
      cognitive_tag: 'Quantitative / Numerical',
      difficulty: 'medium',
      question: 'Evaluate the standard trigonometric limit: lim(x → 0) [sin(3x) / (2x)] using first principles.',
      options: [
        'A. 0',
        'B. 3/2 (1.5)',
        'C. 2/3',
        'D. Does not exist'
      ],
      correct: 'B',
      explanation: 'Rewrite as (3/2) × [sin(3x) / (3x)]. Since lim(u → 0) [sin(u)/u] = 1, the result is (3/2) × 1 = 3/2.'
    },
    {
      id: 3,
      subject: 'Mathematics',
      concept: 'Perpendicular Lines & Orthogonal Slopes',
      cognitive_tag: 'Misconception Trap',
      difficulty: 'medium',
      question: 'Two non-vertical straight lines L₁ and L₂ have slopes m₁ and m₂ respectively in the Cartesian plane. What is the necessary and sufficient condition for them to be perpendicular?',
      options: [
        'A. m₁ + m₂ = 0',
        'B. m₁ · m₂ = 1',
        'C. m₁ · m₂ = -1',
        'D. m₁ = -m₂'
      ],
      correct: 'C',
      explanation: 'If the angle between two lines is 90°, tan(90°) is undefined, meaning 1 + m₁·m₂ = 0, so m₁ · m₂ = -1.'
    },
    {
      id: 4,
      subject: 'Mathematics',
      concept: 'Definite Integrals & Fundamental Theorem of Calculus',
      cognitive_tag: 'Analytical Stepwise Problem',
      difficulty: 'hard',
      question: 'Evaluate the definite integral ∫[0 to π/2] cos(x) dx and determine the geometric area enclosed between y = cos(x) and the x-axis over [0, π/2].',
      options: [
        'A. 0',
        'B. 1',
        'C. π / 2',
        'D. 2'
      ],
      correct: 'B',
      explanation: 'The antiderivative of cos(x) is sin(x). Evaluating from 0 to π/2 gives sin(π/2) - sin(0) = 1 - 0 = 1.'
    },
    {
      id: 5,
      subject: 'Mathematics',
      concept: 'Independent Events & Conditional Probability',
      cognitive_tag: 'Applied Real-World Synthesis',
      difficulty: 'hard',
      question: 'Two independent events A and B have probabilities P(A) = 0.4 and P(B) = 0.5. What is P(A ∪ B) (the probability that at least one of the events occurs)?',
      options: [
        'A. 0.90',
        'B. 0.70',
        'C. 0.20',
        'D. 0.50'
      ],
      correct: 'B',
      explanation: 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B). Since A and B are independent, P(A ∩ B) = 0.4 × 0.5 = 0.20. Thus 0.4 + 0.5 - 0.2 = 0.70.'
    }
  ],
  Physics: [
    {
      id: 1,
      subject: 'Physics',
      concept: 'Kinematics: Velocity-Time Graph Area Interpretation',
      cognitive_tag: 'Conceptual Foundation',
      difficulty: 'medium',
      question: 'A body moves along a straight path. What does the area under its Velocity-Time (v–t) graph represent between time t₁ and t₂?',
      options: [
        'A. Displacement of the body during that time interval',
        'B. Instantaneous acceleration',
        'C. Total force acting on the body',
        'D. Rate of change of momentum'
      ],
      correct: 'A',
      explanation: 'By calculus, displacement Δs = ∫ v dt. The area under the velocity-time graph equals the definite integral of velocity with respect to time, giving net displacement.'
    },
    {
      id: 2,
      subject: 'Physics',
      concept: 'Friction on an Inclined Plane & Angle of Repose',
      cognitive_tag: 'Quantitative / Numerical',
      difficulty: 'medium',
      question: 'A block of mass m = 4 kg rests on a rough inclined plane inclined at θ = 30°. The coefficient of static friction is μ_s = 0.8. What is the magnitude of the frictional force acting on the block? (Take g = 10 m/s²)',
      options: [
        'A. 20 N upwards along the incline',
        'B. 27.7 N upwards along the incline',
        'C. 40 N horizontally',
        'D. 0 N because it is at rest'
      ],
      correct: 'A',
      explanation: 'Downhill component of gravity is mg sin(30°) = 4 × 10 × 0.5 = 20 N. Maximum static friction is μ_s mg cos(30°) ≈ 27.7 N. Since driving force (20 N) < limiting friction (27.7 N), static friction self-adjusts to exactly 20 N.'
    },
    {
      id: 3,
      subject: 'Physics',
      concept: 'Work-Energy Theorem & Spring Compression',
      cognitive_tag: 'Misconception Trap',
      difficulty: 'hard',
      question: 'A block of mass m sliding on a frictionless horizontal floor at speed v collides with a light ideal spring of stiffness constant k. What is the maximum compression x_max of the spring?',
      options: [
        'A. x_max = v · √(m / k)',
        'B. x_max = v · (m / k)',
        'C. x_max = (m · v²) / k',
        'D. x_max = √(2 · m · v / k)'
      ],
      correct: 'A',
      explanation: 'By conservation of mechanical energy: ½ m v² = ½ k (x_max)² ⇒ x_max = v · √(m / k).'
    },
    {
      id: 4,
      subject: 'Physics',
      concept: "Lenz's Law & Conservation of Energy in EMI",
      cognitive_tag: 'Analytical Stepwise Problem',
      difficulty: 'medium',
      question: 'Lenz’s law of electromagnetic induction states that the direction of induced EMF opposes the change in magnetic flux that creates it. Which fundamental conservation law does this directly reflect?',
      options: [
        'A. Conservation of Mechanical Momentum',
        'B. Conservation of Energy',
        'C. Conservation of Electric Charge',
        'D. Conservation of Angular Momentum'
      ],
      correct: 'B',
      explanation: 'If the induced current aided the flux change, it would produce self-accelerating current without external mechanical work, violating the Law of Conservation of Energy.'
    },
    {
      id: 5,
      subject: 'Physics',
      concept: 'Simple Harmonic Motion: Frequency & Spring-Mass Dynamics',
      cognitive_tag: 'Applied Real-World Synthesis',
      difficulty: 'hard',
      question: 'If a spring-mass oscillator has frequency f on Earth, what will happen to its oscillation frequency when placed in an elevator accelerating upwards at a = g?',
      options: [
        'A. Frequency doubles',
        'B. Frequency becomes zero',
        'C. Frequency remains completely unchanged',
        'D. Frequency increases by a factor of √2'
      ],
      correct: 'C',
      explanation: 'The natural frequency of a linear spring-mass system is f = (1 / 2π) · √(k / m), which depends strictly on mass m and spring stiffness k, and is independent of effective gravity.'
    }
  ],
  Chemistry: [
    {
      id: 1,
      subject: 'Chemistry',
      concept: 'Hybridization & Molecular Geometry of Phosphorus Pentachloride',
      cognitive_tag: 'Conceptual Foundation',
      difficulty: 'medium',
      question: 'What is the hybridization and molecular geometry of the central phosphorus atom in phosphorus pentachloride (PCl₅) in the vapor phase?',
      options: [
        'A. sp³ tetrahedral',
        'B. sp³d trigonal bipyramidal',
        'C. sp³d² octahedral',
        'D. dsp² square planar'
      ],
      correct: 'B',
      explanation: 'Phosphorus has 5 valence electrons forming 5 sigma bonds with 0 lone pairs. Steric number = 5, giving sp³d hybridization and trigonal bipyramidal geometry.'
    },
    {
      id: 2,
      subject: 'Chemistry',
      concept: "Le Chatelier's Principle & Exothermic Equilibria",
      cognitive_tag: 'Quantitative / Numerical',
      difficulty: 'medium',
      question: 'For the Haber process reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g) (ΔH = -92.4 kJ/mol), what combination of temperature and pressure shifts the equilibrium forward to maximize yield?',
      options: [
        'A. Low temperature and high pressure',
        'B. High temperature and low pressure',
        'C. High temperature and high pressure',
        'D. Low temperature and low pressure'
      ],
      correct: 'A',
      explanation: 'Since the forward reaction is exothermic (ΔH < 0), lowering temperature shifts it forward. Since gaseous moles decrease from 4 to 2, high pressure shifts it toward fewer moles (NH₃).'
    },
    {
      id: 3,
      subject: 'Chemistry',
      concept: 'SN2 vs SN1 Mechanism & Walden Inversion',
      cognitive_tag: 'Misconception Trap',
      difficulty: 'hard',
      question: 'When an optically active secondary alkyl halide undergoes nucleophilic substitution via a pure bimolecular SN2 mechanism, what stereochemical outcome is observed at the chiral carbon?',
      options: [
        'A. Complete retention of configuration',
        'B. Racemization (50% retention, 50% inversion)',
        'C. Complete 100% inversion of stereochemical configuration (Walden Inversion)',
        'D. Conversion to a meso compound'
      ],
      correct: 'C',
      explanation: 'In SN2, the nucleophile attacks from the backside of the leaving group in a single concerted transition state, completely inverting the stereochemical configuration.'
    },
    {
      id: 4,
      subject: 'Chemistry',
      concept: 'Galvanic Cell & Standard Reduction Potentials',
      cognitive_tag: 'Analytical Stepwise Problem',
      difficulty: 'medium',
      question: 'Given E°(Zn²⁺/Zn) = -0.76 V and E°(Cu²⁺/Cu) = +0.34 V, what is the standard electromotive force (E°_cell) of the Daniell Cell?',
      options: [
        'A. +1.10 V',
        'B. -1.10 V',
        'C. +0.42 V',
        'D. -0.42 V'
      ],
      correct: 'A',
      explanation: 'E°_cell = E°_cathode - E°_anode = E°(Cu²⁺/Cu) - E°(Zn²⁺/Zn) = (+0.34 V) - (-0.76 V) = +1.10 V.'
    },
    {
      id: 5,
      subject: 'Chemistry',
      concept: 'Ideal Gas Law Deviations & Van der Waals Parameters',
      cognitive_tag: 'Applied Real-World Synthesis',
      difficulty: 'hard',
      question: 'In the Van der Waals equation of state [P + a·n² / V²](V - n·b) = nRT, what physical phenomenon does the parameter "a" correct for?',
      options: [
        'A. Finite incompressible volume occupied by real gas molecules',
        'B. Intermolecular attractive forces between real gas molecules',
        'C. Elastic collisions against the container walls',
        'D. Kinetic energy loss at absolute zero'
      ],
      correct: 'B',
      explanation: 'Parameter "a" accounts for intermolecular attractive forces between gas molecules, while parameter "b" accounts for finite molecular volume.'
    }
  ],
  Biology: [
    {
      id: 1,
      subject: 'Biology',
      concept: 'Fluid Mosaic Model & Membrane Protein Arrangement',
      cognitive_tag: 'Conceptual Foundation',
      difficulty: 'medium',
      question: 'According to the Singer-Nicolson Fluid Mosaic Model of the plasma membrane, how are peripheral and integral proteins arranged within the phospholipid bilayer?',
      options: [
        'A. Peripheral proteins are embedded in the hydrophobic core; integral proteins float freely on the surface',
        'B. Integral proteins are partially or completely embedded in the amphipathic lipid bilayer; peripheral proteins lie on outer or inner surfaces',
        'C. Both protein classes form a rigid static sandwich covering both sides of a fluid lipid core',
        'D. Lipids form a solid monolayer through which globular enzymes tunnel'
      ],
      correct: 'B',
      explanation: 'Integral proteins span or penetrate the lipid bilayer via hydrophobic transmembrane domains, while peripheral proteins adhere to exterior polar surfaces.'
    },
    {
      id: 2,
      subject: 'Biology',
      concept: 'Glomerular Filtration Rate & Ultrafiltration Reabsorption',
      cognitive_tag: 'Quantitative / Numerical',
      difficulty: 'medium',
      question: 'In a healthy adult human, what is the normal Glomerular Filtration Rate (GFR) and the approximate total volume of daily filtrate produced compared to daily urine output?',
      options: [
        'A. GFR = 125 mL/min (~180 L/day filtrate); ~1.5 L/day urine',
        'B. GFR = 500 mL/min (~500 L/day filtrate); ~5 L/day urine',
        'C. GFR = 50 mL/min (~70 L/day filtrate); ~0.5 L/day urine',
        'D. GFR = 250 mL/min (~360 L/day filtrate); ~3 L/day urine'
      ],
      correct: 'A',
      explanation: 'Normal GFR is ~125 mL/min = 180 L/day. Since 99% of filtrate is reabsorbed along the nephron tubules, normal final urine output is ~1.5 L/day.'
    },
    {
      id: 3,
      subject: 'Biology',
      concept: 'Genetic Linkage Exception to Independent Assortment',
      cognitive_tag: 'Misconception Trap',
      difficulty: 'hard',
      question: "Why does Gregor Mendel's Law of Independent Assortment fail for certain gene pairs located on the same chromosome?",
      options: [
        'A. Due to physical genetic linkage preventing independent separation',
        'B. Due to pleiotropy',
        'C. Due to incomplete dominance',
        'D. Due to polygenic inheritance'
      ],
      correct: 'A',
      explanation: 'Genes situated close together on the same homologous chromosome belong to the same linkage group and tend to be inherited together unless separated by crossing over.'
    },
    {
      id: 4,
      subject: 'Biology',
      concept: 'Photolysis of Water & Origin of Atmospheric Oxygen',
      cognitive_tag: 'Analytical Stepwise Problem',
      difficulty: 'medium',
      question: 'During oxygenic photosynthesis in green plants, oxygen (O₂) released into the atmosphere originates directly from the photolysis of:',
      options: [
        'A. Water (H₂O)',
        'B. Carbon dioxide (CO₂)',
        'C. Phosphoglyceric acid (PGA)',
        'D. Ribulose 1,5-bisphosphate (RuBP)'
      ],
      correct: 'A',
      explanation: 'In the Oxygen-Evolving Complex of Photosystem II, water splitting (2 H₂O → 4 H⁺ + 4 e⁻ + O₂) releases oxygen. Proven by Ruben, Kamen, and Van Niel using ¹⁸O.'
    },
    {
      id: 5,
      subject: 'Biology',
      concept: 'Cardiovascular Anatomy: Ventricular Myocardium Wall Adaptation',
      cognitive_tag: 'Applied Real-World Synthesis',
      difficulty: 'medium',
      question: 'Which chamber of the human heart has the thickest muscular myocardium wall, and why is this structural adaptation essential?',
      options: [
        'A. Left Ventricle; to generate high pressure required for systemic circulation throughout the entire body',
        'B. Right Ventricle; to pump blood against pulmonary resistance in the lungs',
        'C. Left Atrium; to receive oxygenated blood from pulmonary veins',
        'D. Right Atrium; to overcome vena cava venous return resistance'
      ],
      correct: 'A',
      explanation: 'The left ventricle pumps oxygenated blood through the high-resistance systemic vascular tree (aorta), requiring a myocardial wall approximately 3 times thicker than the right ventricle.'
    }
  ]
};

export function renderStudentOnboarding() {
  const step = AppState.studentOnboarding.step;
  const stepsList = ['Profile', 'Target Exam', 'Subject Goals', 'Learning Style', 'Diagnostic Test'];

  return `
    <div class="container py-10 max-w-3xl">
      <div class="text-center mb-8">
        <span class="badge badge-primary mb-2">${Icons.sparkles} Step 01 to 05</span>
        <h1 class="text-3xl font-extrabold text-slate-900 mb-2">Let's build your learning journey.</h1>
        <p class="text-slate-600 text-sm">Tell us your targets and take our calm diagnostic so we can map your unique Learning DNA.</p>
      </div>

      <div class="mb-8">
        ${Stepper({
          steps: stepsList,
          currentStep: step,
          onStepClick: 'window.setStudentOnboardingStep'
        })}
      </div>

      <div class="card p-8 bg-white border rounded-2xl shadow-sm">
        ${renderStudentStepContent(step)}
      </div>
    </div>
  `;
}

function renderStudentStepContent(step) {
  if (step === 1) {
    const studentNameVal = typeof window.getStudentDisplayName === 'function'
      ? window.getStudentDisplayName()
      : (AppState.studentOnboarding.studentName || AppState.studentOnboarding.name || '');
    return `
      <div>
        <h3 class="text-xl font-bold text-slate-900 mb-1">Who are you?</h3>
        <p class="text-xs text-slate-500 mb-6">Enter your name, standard (Class 8–12), and board so we can personalize your learning journey across all selected subjects.</p>

        <div class="space-y-4 mb-8">
          <!-- Student Full Name -->
          <div>
            <label class="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between" for="studentNameInput">
              <span>Student's Full Name <span class="text-blue-600">*</span></span>
              <span class="text-2xs text-slate-400 font-normal">Updates live across your Learning DNA &amp; Portal</span>
            </label>
            <input type="text" id="studentNameInput" 
                   class="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all" 
                   style="background-color:#ffffff !important; color:#0f172a !important; -webkit-text-fill-color:#0f172a !important;" 
                   value="${studentNameVal.replace(/"/g, '&quot;')}" 
                   oninput="window.setStudentDisplayName(this.value, false)" 
                   placeholder="Enter Student's Full Name" />
          </div>

          <!-- Parent / Guardian Full Name, WhatsApp & Email (Captured for Parent Login & WhatsApp Reports) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between" for="parentNameInput">
                <span>Parent / Guardian's Full Name <span class="text-indigo-600">*</span></span>
              </label>
              <input type="text" id="parentNameInput" 
                     class="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all" 
                     style="background-color:#ffffff !important; color:#0f172a !important; -webkit-text-fill-color:#0f172a !important;" 
                     value="${((AppState.studentOnboarding && AppState.studentOnboarding.parentName) || (AppState.bookingData && AppState.bookingData.parentName) || '').replace(/"/g, '&quot;')}" 
                     oninput="window.setParentDisplayName && window.setParentDisplayName(this.value)" 
                     placeholder="e.g. Ramesh Sharma" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between" for="parentPhoneInput">
                <span>Parent's WhatsApp / Phone <span class="text-emerald-600">*</span></span>
              </label>
              <input type="tel" id="parentPhoneInput" 
                     class="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all" 
                     style="background-color:#ffffff !important; color:#0f172a !important; -webkit-text-fill-color:#0f172a !important;" 
                     value="${((AppState.studentOnboarding && AppState.studentOnboarding.parentPhone) || (AppState.bookingData && AppState.bookingData.parentPhone) || '+91 98201 44892').replace(/"/g, '&quot;')}" 
                     oninput="window.setParentPhone && window.setParentPhone(this.value)" 
                     placeholder="+91 98201 44892" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between" for="parentEmailInput">
                <span>Parent's Email Address <span class="text-indigo-600">*</span></span>
              </label>
              <input type="email" id="parentEmailInput" 
                     class="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all" 
                     style="background-color:#ffffff !important; color:#0f172a !important; -webkit-text-fill-color:#0f172a !important;" 
                     value="${((AppState.studentOnboarding && AppState.studentOnboarding.parentEmail) || (AppState.bookingData && AppState.bookingData.parentEmail) || 'parent@siko.demo').replace(/"/g, '&quot;')}" 
                     oninput="window.setParentEmail && window.setParentEmail(this.value)" 
                     placeholder="parent@example.com" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">Current Standard / Class (8th–10th vs 11th–12th)</label>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
              ${['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(g => {
                const gNum = parseInt(g.replace('Grade ', ''), 10);
                const is8to10 = gNum <= 10;
                return `
                  <button type="button" class="p-2.5 rounded-lg border ${g === (AppState.studentOnboarding.grade || 'Grade 10') ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold' : 'border-slate-200 text-slate-700'} text-xs cursor-pointer" onclick="window.updateStudentProfileField('grade', '${g}'); window.setJoiningGradeForExamPlan('${gNum}');">
                    <div>Class ${gNum}</div>
                    <div class="text-3xs font-semibold ${g === (AppState.studentOnboarding.grade || 'Grade 10') ? 'text-blue-700' : 'text-slate-400'} mt-0.5">
                      ${is8to10 ? 'Boards (1h) / Olympiad (1.5h)' : 'JEE / NEET / Boards (1.5h)'}
                    </div>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">School Board (CBSE, ICSE, Maharashtra State Board, IB)</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              ${['CBSE', 'ICSE', 'Maharashtra State Board', 'IB'].map(b => `
                <button type="button" class="p-3 rounded-lg border ${b === (AppState.studentOnboarding.board || 'CBSE') ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold' : 'border-slate-200 text-slate-700'} text-xs cursor-pointer" onclick="window.updateStudentProfileField('board', '${b}'); if(window.setEnrollmentSchoolBoard) window.setEnrollmentSchoolBoard('${b}');">
                  ${b}
                </button>
              `).join('')}
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">Country &amp; Timezone</label>
            <select class="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900" onchange="AppState.studentOnboarding.country = this.value">
              <option>India (IST - UTC+5:30)</option>
              <option>United Kingdom (GMT - UTC+0:00)</option>
              <option>United Arab Emirates (GST - UTC+4:00)</option>
              <option>United States (EST - UTC-5:00)</option>
              <option>Singapore (SGT - UTC+8:00)</option>
            </select>
          </div>
        </div>

        <button class="btn btn-primary btn-full btn-lg" onclick="window.validateStudentStep1AndAdvance()">
          Continue to Step 2: Target Course &amp; Stream ${Icons.arrowRight}
        </button>
      </div>
    `;
  }

  if (step === 2) {
    const curStream = (AppState.bookingFlow && AppState.bookingFlow.streamFilter) || 'PCM';
    return `
      <div>
        <h3 class="text-xl font-bold text-slate-900 mb-1">Select Your Exact Course &amp; Academic Stream</h3>
        <p class="text-xs text-slate-500 mb-4">We keep <strong>Class 8th–10th School Boards (1 Hr/Slot)</strong> and <strong>Class 8th–10th Olympiads (1.5 Hrs/Slot)</strong> separate from <strong>Class 11th–12th JEE / MHT-CET, NEET &amp; Senior Boards (1.5 Hrs/Slot)</strong>.</p>

        <!-- Group A: Class 8th to 10th Separate School Boards vs Olympiads -->
        <div class="mb-4">
          <div class="text-2xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">🎒 Group A: Class 8th, 9th &amp; 10th Separate Tracks</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${[
              { id: 'Board_8_10', courseCode: 'cbse_8_10', stream: 'BOARD_8_10', slot: '1.0 Hr / Slot', title: '📘 Class 8–10 School Boards (CBSE / ICSE / State Board)', desc: 'Complete Class 8, 9 & 10 school board syllabus with 1 Hour per lecture slot, NCERT/ICSE competency tests & step grading.' },
              { id: 'Olympiad_8_10', courseCode: 'olympiad_class_10', stream: 'OLYMPIAD_8_10', slot: '1.5 Hrs / Slot', title: '🏆 Class 8–10 Olympiads (SOF IMO/NSO • IAPT NSEJS • HBCSE IOQM)', desc: 'Higher-order thinking skills (HOTS), non-routine problem solving & IOQM integer math (00–99) with 1.5 Hours per slot.' }
            ].map(ex => {
              const isSel = curStream === ex.stream;
              return `
                <div class="p-4 rounded-xl border-2 ${isSel ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-blue-400'} cursor-pointer transition-colors"
                     onclick="AppState.studentOnboarding.exam = '${ex.id}'; AppState.studentOnboarding.courseCode = '${ex.courseCode}'; AppState.selectedCourseCode = '${ex.courseCode}'; if(window.setBookingStreamFilter) window.setBookingStreamFilter('${ex.stream}'); window.setStudentOnboardingStep(3)">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-bold text-xs sm:text-sm text-slate-900">${ex.title}</span>
                    ${isSel ? `<span class="text-blue-600 font-bold">${Icons.check}</span>` : ''}
                  </div>
                  <p class="text-2xs text-slate-500">${ex.desc}</p>
                  <div class="mt-2 pt-2 border-t border-slate-200/70 flex items-center justify-between text-3xs font-extrabold text-indigo-800">
                    <span>⏱️ ${ex.slot}</span>
                    <span class="text-emerald-700">✓ Class 8–10 Track</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Group B: Class 11th & 12th Separate JEE / MHT-CET vs NEET vs Senior Boards -->
        <div class="mb-6">
          <div class="text-2xs font-extrabold uppercase tracking-wider text-indigo-700 mb-2">🎓 Group B: Class 11th &amp; 12th Entrance &amp; Senior Boards (1.5 Hrs / Slot)</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            ${[
              { id: 'JEE_Adv', courseCode: 'jee_main_advanced', stream: 'PCM', slot: '1.5 Hrs / Slot', title: '🏛️ JEE Main + Advanced', auth: 'IIT-JAB & NTA Pattern', desc: 'Single & multi-correct MCQs (+3/-1), non-negative integer values (+4/0) & subjective derivations.' },
              { id: 'JEE_Main', courseCode: 'jee_main', stream: 'PCM', slot: '1.5 Hrs / Slot', title: '🎯 JEE (Main) NTA CBT', auth: 'NTA Official 300M', desc: '75 Questions: 20 MCQs (+4/-1) + 5 Numerical Value Questions (+4/-1) per subject.' },
              { id: 'NEET', courseCode: 'neet_ug', stream: 'PCB', slot: '1.5 Hrs / Slot', title: '🩺 NEET (UG) Medical', auth: 'NTA & NMC 720M', desc: '200 Questions across Physics, Chemistry, Botany & Zoology (+4/-1) grounded 100% in NCERT.' },
              { id: 'MHTCET', courseCode: 'mht_cet', stream: 'PCM', slot: '1.5 Hrs / Slot', title: '⚡ MHT-CET (PCM / PCB)', auth: 'Maharashtra CET Cell 200M', desc: 'Mathematics (2M), Physics & Chemistry (1M) • Zero negative marking • 80% XII + 20% XI weightage.' },
              { id: 'Board_11_12', courseCode: 'cbse_11_12', stream: 'BOARD_11_12', slot: '1.5 Hrs / Slot', title: '🎓 11th & 12th Senior Boards', auth: 'CBSE / ISC / MSBSHSE', desc: 'Sections A to E, activity sheets, derivations and case studies with step-by-step rubrics.' }
            ].map(ex => {
              const isSel = (AppState.studentOnboarding.courseCode === ex.courseCode) || (curStream === ex.stream && !AppState.studentOnboarding.courseCode);
              return `
                <div class="p-4 rounded-xl border-2 ${isSel ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white hover:border-indigo-400'} cursor-pointer transition-colors"
                     onclick="AppState.studentOnboarding.exam = '${ex.id}'; AppState.studentOnboarding.courseCode = '${ex.courseCode}'; AppState.selectedCourseCode = '${ex.courseCode}'; if(window.setBookingStreamFilter) window.setBookingStreamFilter('${ex.stream}'); window.setStudentOnboardingStep(3)">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-bold text-xs sm:text-sm text-slate-900">${ex.title}</span>
                    ${isSel ? `<span class="text-indigo-600 font-bold">${Icons.check}</span>` : ''}
                  </div>
                  <span class="text-3xs font-extrabold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md inline-block mb-1">${ex.auth}</span>
                  <p class="text-2xs text-slate-500">${ex.desc}</p>
                  <div class="mt-2 pt-2 border-t border-slate-200/70 flex items-center justify-between text-3xs font-extrabold text-indigo-800">
                    <span>⏱️ ${ex.slot}</span>
                    <span class="text-emerald-700">✓ Class 11–12</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="flex gap-3">
          <button class="btn btn-outline" onclick="window.setStudentOnboardingStep(1)">&larr; Back</button>
          <button class="btn btn-primary flex-1 btn-lg" onclick="window.setStudentOnboardingStep(3)">Continue to Subject Selection &rarr;</button>
        </div>
      </div>
    `;
  }

  if (step === 3) {
    const allowedSubjects = typeof window.getAllowedSubjectsForStream === 'function'
      ? window.getAllowedSubjectsForStream()
      : ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
    const selectedSubjs = (AppState.bookingFlow && Array.isArray(AppState.bookingFlow.selectedSubjects) && AppState.bookingFlow.selectedSubjects.length > 0)
      ? AppState.bookingFlow.selectedSubjects.filter(s => allowedSubjects.includes(s))
      : [allowedSubjects[0] || 'Physics'];
    const activeSubject = selectedSubjs[0] || allowedSubjects[0] || 'Physics';
    AppState.studentOnboarding.selectedSubject = activeSubject;
    AppState.studentOnboarding.subjects = selectedSubjs;

    const allSubjectCards = [
      { id: 'Physics', title: 'Physics', desc: 'Mechanics, Electromagnetism, Optics & Modern Physics', icon: '⚡' },
      { id: 'Chemistry', title: 'Chemistry', desc: 'Physical Chemistry, Organic Mechanisms & Bonding', icon: '🧪' },
      { id: 'Mathematics', title: 'Mathematics', desc: 'Calculus, Algebra, Coordinate Geometry & Vectors', icon: '📐' },
      { id: 'Biology', title: 'Biology', desc: 'Cell Biology, Genetics, Human Physiology & Botany', icon: '🧬' }
    ].filter(s => allowedSubjects.includes(s.id));

    const discPct = selectedSubjs.length >= 4 ? 30 : (selectedSubjs.length === 3 ? 25 : (selectedSubjs.length === 2 ? 20 : 10));

    return `
      <div>
        <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
          <h3 class="text-xl font-bold text-slate-900">Select 1 or Multiple Subjects</h3>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-2xs font-extrabold">
            ${selectedSubjs.length} Subject${selectedSubjs.length > 1 ? 's' : ''} Selected (${discPct}% Off)
          </span>
        </div>
        <p class="text-xs text-slate-500 mb-4">Click any subject card below to toggle it <strong>ON or OFF</strong>. Select 2 or more subjects for extra multi-subject discount!</p>

        <!-- Quick Multi-Subject Bundle Buttons -->
        <div class="flex items-center justify-between gap-2 flex-wrap mb-4 p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/80">
          <span class="text-2xs font-extrabold text-indigo-950">🎁 Extra Discount for 2+ Subjects:</span>
          <div class="flex items-center gap-1.5 flex-wrap">
            ${allowedSubjects.includes('Mathematics') ? `
              <button type="button" onclick="window.selectBookingPresetBundle('PCM', false)"
                class="px-2.5 py-1 rounded-lg text-3xs font-extrabold cursor-pointer border ${selectedSubjs.length === 3 && selectedSubjs.includes('Mathematics') ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-900 border-indigo-200'}">
                ⚡ Select All 3 PCM (25% Off)
              </button>
            ` : ''}
            ${allowedSubjects.includes('Biology') ? `
              <button type="button" onclick="window.selectBookingPresetBundle('PCB', false)"
                class="px-2.5 py-1 rounded-lg text-3xs font-extrabold cursor-pointer border ${selectedSubjs.length === 3 && selectedSubjs.includes('Biology') ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-900 border-emerald-200'}">
                🩺 Select All 3 PCB (25% Off)
              </button>
            ` : ''}
            <button type="button" onclick="window.setBookingScopeMode('subject')"
              class="px-2.5 py-1 rounded-lg text-3xs font-extrabold cursor-pointer border ${selectedSubjs.length === 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'}">
              📘 1 Subject (10% Off)
            </button>
          </div>
        </div>

        <!-- Stream-Filtered Multi-Select Subject Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          ${allSubjectCards.map(sub => {
            const isSelected = selectedSubjs.includes(sub.id);
            return `
              <div class="p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-300'}"
                   onclick="window.toggleBookingSubjectSelection('${sub.id}')">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span class="text-base">${sub.icon}</span> ${sub.title}
                  </span>
                  <span class="px-2 py-0.5 rounded-full text-3xs font-extrabold ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}">
                    ${isSelected ? '✓ Selected' : '+ Add Subject'}
                  </span>
                </div>
                <p class="text-2xs text-slate-500 leading-relaxed">${sub.desc}</p>
                <div class="mt-2.5 flex items-center justify-between">
                  <span class="text-3xs font-semibold ${isSelected ? 'text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded' : 'text-slate-400'}">
                    ${isSelected ? 'Included in Your Plan' : 'Click to toggle'}
                  </span>
                  <span class="text-3xs font-bold text-emerald-700">${discPct}% Off</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="mb-6">
          <label class="block text-xs font-bold text-slate-700 mb-1">Your Personal Goal / Target in ${selectedSubjs.join(' + ')}</label>
          <input type="text" id="studentGoalsInput" class="w-full p-3 rounded-lg border border-slate-300 text-xs font-medium" 
                 style="background-color:#ffffff !important; color:#0f172a !important; -webkit-text-fill-color:#0f172a !important;" 
                 value="${AppState.studentOnboarding.goals || `Master ${selectedSubjs.join(' + ')} & score 99+ percentile`}" 
                 oninput="AppState.studentOnboarding.goals = this.value" 
                 placeholder="e.g. Master ${selectedSubjs.join(' + ')} and build deep problem-solving intuition" />
        </div>

        <div class="flex gap-3">
          <button class="btn btn-outline" onclick="window.setStudentOnboardingStep(2)">&larr; Back</button>
          <button class="btn btn-primary flex-1 btn-lg" onclick="window.setStudentOnboardingStep(4)">
            Continue with ${selectedSubjs.join(' + ')} &rarr;
          </button>
        </div>
      </div>
    `;
  }

  if (step === 4) {
    const curStyle = AppState.studentOnboarding.learningStyle || 'Visual & First-Principles Derivation';
    return `
      <div>
        <h3 class="text-xl font-bold text-slate-900 mb-2">How do you like to learn?</h3>
        <p class="text-xs text-slate-500 mb-6">Every student grasps concepts differently. Tell us your preference.</p>

        <div class="space-y-3 mb-8">
          <div class="p-4 rounded-xl border-2 ${curStyle.indexOf('Visual') !== -1 ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white'} flex items-center justify-between cursor-pointer"
               onclick="AppState.studentOnboarding.learningStyle = 'Visual & First-Principles Derivation'; window.setStudentOnboardingStep(5);">
            <div>
              <div class="font-bold text-sm text-slate-900">Visual & First-Principles Derivation</div>
              <p class="text-2xs text-slate-500">I learn best when equations are derived visually with real-world intuition.</p>
            </div>
            ${curStyle.indexOf('Visual') !== -1 ? `<span class="text-blue-600 font-bold">${Icons.check}</span>` : ''}
          </div>

          <div class="p-4 rounded-xl border-2 ${curStyle.indexOf('Intense') !== -1 ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white'} flex items-center justify-between cursor-pointer"
               onclick="AppState.studentOnboarding.learningStyle = 'Intense Problem Practice & Shortcuts'; window.setStudentOnboardingStep(5);">
            <div>
              <div class="font-bold text-sm text-slate-900">Intense Problem Practice & Shortcuts</div>
              <p class="text-2xs text-slate-500">I know the theory but need speed drills and test-taking exam psychology.</p>
            </div>
            ${curStyle.indexOf('Intense') !== -1 ? `<span class="text-blue-600 font-bold">${Icons.check}</span>` : ''}
          </div>
        </div>

        <div class="flex gap-3">
          <button class="btn btn-outline" onclick="window.setStudentOnboardingStep(3)">&larr; Back</button>
          <button class="btn btn-primary flex-1 btn-lg" onclick="window.setStudentOnboardingStep(5)">
            Start Calm Diagnostic in ${AppState.studentOnboarding.selectedSubject || 'Mathematics'} &rarr;
          </button>
        </div>
      </div>
    `;
  }

  // Step 5: Calm Diagnostic Test (Subject-Specific AI Assessment)
  const allowedDiagSubjects = typeof window.getAllowedSubjectsForStream === 'function'
    ? window.getAllowedSubjectsForStream()
    : ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
  const currentSubject = AppState.studentOnboarding.selectedSubject || allowedDiagSubjects[0] || 'Physics';
  
  // Resolve questions for the active subject
  let qList = AppState.studentOnboarding.diagnosticQuestions;
  if (!qList || qList.length === 0 || AppState.studentOnboarding.diagnosticSubjectLoaded !== currentSubject) {
    qList = DEFAULT_DIAGNOSTIC_BANK[currentSubject] || DEFAULT_DIAGNOSTIC_BANK['Physics'];
    AppState.studentOnboarding.diagnosticQuestions = qList;
    AppState.studentOnboarding.diagnosticSubjectLoaded = currentSubject;
  }

  const curIdx = Math.min(AppState.studentOnboarding.diagnosticCurrentIndex || 0, qList.length - 1);
  const curQ = qList[curIdx] || qList[0];
  const userAnswers = AppState.studentOnboarding.diagnosticAnswers || {};
  const currentAnswer = userAnswers[curIdx] || userAnswers[String(curIdx)] || '';
  const totalQuestions = qList.length;

  return `
    <div>
      <div class="flex flex-wrap justify-between items-center gap-3 pb-4 border-b mb-4">
        <div>
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="badge badge-warning">Calm Diagnostic</span>
            <span class="text-2xs font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">${currentSubject} AI Track</span>
          </div>
          <h3 class="text-xl font-bold text-slate-900">Let's understand how you think in ${currentSubject}.</h3>
          <p class="text-2xs text-slate-500">5 Diagnostic Probes • No negative marking • Calibrated for your Learning DNA</p>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold text-slate-400">QUESTION</span>
          <div class="text-lg font-black text-blue-600">${curIdx + 1} of ${totalQuestions}</div>
        </div>
      </div>

      <!-- Subject Switcher Pills inside Diagnostic (Physics, Chemistry, Mathematics, Biology) -->
      <div class="flex items-center gap-2 flex-wrap mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
        <span class="text-2xs font-extrabold text-slate-700">Switch Diagnostic Subject:</span>
        ${allowedDiagSubjects.map(sub => `
          <button type="button" onclick="window.selectOnboardingSubject('${sub}')"
            class="px-3 py-1 rounded-lg text-2xs font-extrabold cursor-pointer border transition ${currentSubject === sub ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'}">
            ${sub}
          </button>
        `).join('')}
      </div>

      <!-- Question Progress Bar -->
      <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-6">
        <div class="bg-blue-600 h-full transition-all duration-300" style="width: ${((curIdx + 1) / totalQuestions) * 100}%"></div>
      </div>

      <!-- Subject-Calibrated Diagnostic Question Box -->
      <div class="p-6 rounded-xl bg-slate-50 border border-slate-200 mb-6" id="diagnosticQuestionCard">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            ${curQ.cognitive_tag || 'Conceptual Foundation'}
          </span>
          <span class="text-2xs text-slate-400 font-semibold uppercase">
            Topic: ${curQ.concept || currentSubject}
          </span>
        </div>

        <p class="text-sm font-semibold text-slate-800 leading-relaxed mb-5" style="color:#0f172a !important;">
          ${window.cleanMathForStudent ? window.cleanMathForStudent(curQ.question || curQ.question_text || '') : (curQ.question || curQ.question_text || '')}
        </p>

        <div class="space-y-2.5 text-xs">
          ${(curQ.options || []).map((opt) => {
            const cleanOpt = window.cleanMathForStudent ? window.cleanMathForStudent(opt) : opt;
            const letterMatch = cleanOpt.match(/^([A-D])[\.:\)]/i);
            const letter = letterMatch ? letterMatch[1].toUpperCase() : cleanOpt.charAt(0).toUpperCase();
            const isChecked = currentAnswer.toUpperCase() === letter;

            return `
              <div class="p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                isChecked
                  ? 'border-blue-600 bg-blue-50 font-bold text-blue-900 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-blue-400'
              }" onclick="window.selectOnboardingDiagnosticOption(${curIdx}, '${letter}')">
                <span class="leading-snug">${cleanOpt}</span>
                ${isChecked ? `<span class="text-blue-600 font-black ml-2">${Icons.check}</span>` : '<span class="w-4 h-4 rounded-full border border-slate-300 shrink-0"></span>'}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="flex justify-between items-center pt-2">
        <div>
          ${curIdx > 0 ? `
            <button class="btn btn-outline btn-sm" onclick="window.prevOnboardingDiagnosticQuestion()">
              &larr; Previous
            </button>
          ` : `
            <span class="text-2xs text-slate-400">Diagnosing: Cognitive speed, algebraic derivation & concept mastery</span>
          `}
        </div>

        <div class="flex items-center gap-3">
          ${curIdx < totalQuestions - 1 ? `
            <button class="btn btn-secondary" onclick="window.nextOnboardingDiagnosticQuestion()">
              Next Question &rarr;
            </button>
          ` : ''}

          <button class="btn btn-primary btn-lg" onclick="window.finishDiagnostic()">
            Submit & Generate Learning DNA ${Icons.sparkles}
          </button>
        </div>
      </div>
    </div>
  `;
}
