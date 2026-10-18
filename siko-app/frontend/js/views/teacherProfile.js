/**
 * SIKO TEACHER PROFILE VIEW
 * Academic professional profile with transparent SIKO recommendation rationale, verified credentials, and outcomes.
 */

import { AppState, formatPrice } from '../state.js';
import { Icons, TeacherTierBadge } from '../components.js';

export function renderTeacherProfile() {
  const MASTER_PROFILES = {
    't-kavita': {
      id: 't-kavita',
      name: 'Senior Master Faculty (Biology)',
      avatar: 'assets/teachers/teacher_biology_indian.jpg',
      tier: 'Master',
      title: 'Senior Biology Faculty • MBBS / MD AIIMS New Delhi (9+ Yrs Exp)',
      rating: 4.97,
      ratingsCount: 380,
      experienceYears: 9,
      hourlyRate: 2400,
      languages: ['English', 'Hindi', 'Marathi'],
      matchRationale: [
        'Top 1% NEET UG Biology & Human Physiology Specialist',
        'Mentored 35+ Top 100 NEET UG Rankers (Highest Bio Score: 355/360)',
        'Clinical-correlation pedagogy connecting every NCERT diagram with physiology',
        'Verified background check and pedagogical clearance'
      ],
      teachingStyle: 'Clinical case-based and NCERT line-by-line derivation linking every diagram with first-principles cellular mechanisms.',
      quote: 'Biology is the study of living machines; when you understand the physiological mechanism, NCERT questions become second nature.',
      education: 'MBBS / MD, AIIMS New Delhi',
      outcomes: {
        scoreJump: '+32% Average NEET Score Lift',
        targetMet: '96% Target Score Achievement'
      },
      reviews: [
        { author: 'Class 12 NEET Student', text: 'Achieved 355/360 in NEET Biology! Connecting every NCERT diagram directly with clinical logic transformed my preparation.' },
        { author: 'Parent of Class 12 Aspirant', text: 'Exceptional teaching. Daily NCERT assertion-reason drills completely removed my daughter’s confusion.' }
      ],
      subjects: ['Biology', 'Zoology', 'Botany'],
      exams: ['NEET UG', 'CBSE Class 11 & 12', 'Olympiad'],
      boards: ['CBSE', 'ICSE', 'Maharashtra State Board'],
      nextSlots: ['Tomorrow 7:45 PM IST', 'Friday 7:45 PM IST', 'Saturday 10:00 AM IST']
    },
    't-priya': {
      id: 't-priya',
      name: 'Senior Master Faculty (Chemistry)',
      avatar: 'assets/teachers/teacher_chemistry_indian.jpg',
      tier: 'Expert',
      title: 'Senior Chemistry Faculty • CSIR-NET JRF (11+ Yrs Exp)',
      rating: 4.95,
      ratingsCount: 290,
      experienceYears: 11,
      hourlyRate: 2300,
      languages: ['English', 'Hindi', 'Malayalam'],
      matchRationale: [
        'Top 1% Organic Reaction Mechanisms & Physical Chemistry Specialist',
        'Mentored multiple 100-percentile JEE Main & NEET Chemistry scorers',
        'First-principles electron-pushing logic over rote memorization',
        'Verified background check and pedagogical clearance'
      ],
      teachingStyle: 'Mechanism-first pedagogy where every organic reaction is broken down into nucleophile-electrophile orbital interactions.',
      quote: 'Organic reaction mechanisms stop being rote memory the moment you see the curly arrows as electrons flowing to the lowest energy orbital.',
      education: 'Ph.D. Chemistry, IISc Bangalore • CSIR-NET JRF',
      outcomes: {
        scoreJump: '+30% Average Chemistry Lift',
        targetMet: '95% Target Percentile Achievement'
      },
      reviews: [
        { author: 'Class 12 Student', text: 'Scored 99.1 percentile in Chemistry! Organic reactions make complete logical sense from first principles now.' },
        { author: 'Parent of Class 11 Aspirant', text: 'The clarity of concept delivery and milestone transparency are remarkable.' }
      ],
      subjects: ['Chemistry', 'Organic Chemistry', 'Physical Chemistry'],
      exams: ['JEE Main', 'JEE Advanced', 'NEET UG'],
      boards: ['CBSE', 'ISC', 'Maharashtra State Board'],
      nextSlots: ['Tomorrow 5:00 PM IST', 'Thursday 5:00 PM IST', 'Saturday 4:00 PM IST']
    },
    't-rajesh': {
      id: 't-rajesh',
      name: 'Senior Master Faculty (Mathematics)',
      avatar: 'assets/teachers/teacher_mathematics_indian.jpg',
      tier: 'Master',
      title: 'Senior Mathematics Faculty • M.Tech IIT Bombay (15+ Yrs Exp)',
      rating: 4.98,
      ratingsCount: 420,
      experienceYears: 15,
      hourlyRate: 2500,
      languages: ['English', 'Hindi', 'Tamil'],
      matchRationale: [
        'Top 1% Calculus, Coordinate Geometry & Algebra Specialist',
        'Mentored 60+ Top 200 JEE Advanced Rankers & Olympiad Medalists',
        'Visual geometry & algebraic symmetry proof methods',
        'Verified background check and pedagogical clearance'
      ],
      teachingStyle: 'Rigorous derivation and graphical problem solving transforming abstract calculus into concrete spatial intuition.',
      quote: 'Mathematics is not computation; it is pattern perception and structural beauty.',
      education: 'M.Tech, IIT Bombay',
      outcomes: {
        scoreJump: '+34% Average Math Score Lift',
        targetMet: '97% Target Percentile Achievement'
      },
      reviews: [
        { author: 'Class 12 JEE Student', text: 'Calculus used to feel overwhelming. Concept-first teaching made continuity and integration as intuitive as simple arithmetic.' },
        { author: 'Parent of Class 12 Aspirant', text: 'Patient guidance transformed my son’s confidence in Mathematics.' }
      ],
      subjects: ['Mathematics', 'Calculus', 'Coordinate Geometry'],
      exams: ['JEE Advanced', 'JEE Main', 'ISI Entrance', 'KVPY/Olympiad'],
      boards: ['CBSE', 'ISC', 'IB HL'],
      nextSlots: ['Tomorrow 6:30 PM IST', 'Friday 6:30 PM IST', 'Saturday 3:00 PM IST']
    },
    't-ananya': {
      id: 't-ananya',
      name: 'Dedicated Master Faculty (Physics)',
      avatar: 'assets/teachers/teacher_physics_indian.jpg',
      tier: 'Master',
      title: 'Dedicated Senior Physics Faculty • Ph.D. IIT Delhi (12+ Yrs Exp)',
      rating: 4.96,
      ratingsCount: 342,
      experienceYears: 12,
      hourlyRate: 2400,
      languages: ['English', 'Hindi'],
      matchRationale: [
        'Top 1% Mechanics & Kinematics Specialist',
        'Mentored 40+ Top 500 JEE Advanced Rankers',
        'Specialist in visual pedagogy and conceptual derivation',
        'Verified background check and pedagogical clearance'
      ],
      teachingStyle: 'Derivation-first, visual problem solving emphasizing foundational concept mastery over rote memorization.',
      quote: 'Physics is not mathematics with units; it is physical intuition formalized with first principles.',
      education: 'Ph.D. Physics • IIT Delhi',
      outcomes: {
        scoreJump: '+28% Average Score Lift',
        targetMet: '94% Target Percentile Achievement'
      },
      reviews: [
        { author: 'Parent of Class 11 Aspirant', text: 'The depth of explanation transformed my son’s approach to Physics. His score improved from 64% to 89%.' },
        { author: 'Class 11 Student', text: 'Concepts that felt impossible in school became crystal clear in just 3 sessions.' },
        { author: 'Parent of Enrolled Student', text: 'Exceptional patience and rigorous question analysis. Transparent feedback after every milestone.' }
      ],
      subjects: ['Physics', 'Mechanics', 'Electrodynamics'],
      exams: ['JEE Advanced', 'JEE Main', 'NEET UG'],
      boards: ['CBSE', 'ISC', 'IB HL'],
      nextSlots: ['Tomorrow 5:00 PM IST', 'Friday 5:00 PM IST', 'Saturday 11:00 AM IST']
    }
  };

  const selId = AppState.selectedTeacherId || 't-ananya';
  const teacher = MASTER_PROFILES[selId] ||
                  (AppState.teachers && AppState.teachers.find(t => t.id === selId || (selId && t.id && (t.id.includes(selId) || selId.includes(t.id))))) ||
                  (AppState.teachers && AppState.teachers.find(t => (
                    (selId.includes('kavita') && (t.name || '').includes('Kavita')) ||
                    (selId.includes('priya') && (t.name || '').includes('Priya') && (t.subject === 'Chemistry' || t.name.includes('Nambiar'))) ||
                    (selId.includes('rajesh') && (t.name || '').includes('Senior Master Faculty')) ||
                    (selId.includes('ananya') && (t.name || '').includes('Dedicated Master Faculty'))
                  ))) ||
                  MASTER_PROFILES['t-ananya'];

  const name = teacher.name || teacher.full_name || 'Dedicated Master Faculty';
  const avatar = teacher.avatar || teacher.avatar_url || 'assets/teachers/teacher_physics_indian.jpg';
  const tier = teacher.tier || 'Master';
  const title = teacher.title || teacher.bio || 'Dedicated Master Faculty • Ph.D. IIT Delhi';
  const rating = teacher.rating || 4.96;
  const ratingsCount = teacher.ratingsCount || teacher.total_classes || 342;
  const experienceYears = teacher.experienceYears || teacher.experience_years || 12;
  const languages = Array.isArray(teacher.languages) && teacher.languages.length > 0 ? teacher.languages : ['English', 'Hindi'];
  const hourlyRate = teacher.hourlyRate || teacher.hourly_rate || 2400;
  const priceFormatted = typeof formatPrice === 'function' ? formatPrice(hourlyRate) : ('₹' + hourlyRate);
  
  const matchRationale = Array.isArray(teacher.matchRationale) && teacher.matchRationale.length > 0 ? teacher.matchRationale : [
    'Top 1% Mechanics & Kinematics Specialist',
    'Mentored 40+ Top 500 JEE Advanced Rankers',
    'Specialist in visual pedagogy and conceptual derivation',
    'Verified background check and pedagogical clearance'
  ];

  const teachingStyle = teacher.teachingStyle || teacher.bio || 'Derivation-first, visual problem solving emphasizing foundational concept mastery over rote memorization.';
  const quote = teacher.quote || 'Physics is not mathematics with units; it is physical intuition formalized with first principles.';
  const education = teacher.education || 'Ph.D. Physics • IIT Delhi';
  const outcomes = teacher.outcomes || {
    scoreJump: '+28% Average Score Lift',
    targetMet: '94% Target Percentile Achievement'
  };

  const reviews = Array.isArray(teacher.reviews) && teacher.reviews.length > 0 ? teacher.reviews : [
    { author: 'Parent of Class 11 Aspirant', text: 'The depth of explanation transformed my son’s approach to Physics. His score improved from 64% to 89%.' },
    { author: 'Class 11 Student', text: 'Concepts that felt impossible in school became crystal clear in just 3 sessions.' },
    { author: 'Parent of Enrolled Student', text: 'Exceptional patience and rigorous question analysis. Transparent feedback after every milestone.' }
  ];

  const subjects = Array.isArray(teacher.subjects) && teacher.subjects.length > 0 ? teacher.subjects : ['Physics', 'Mathematics'];
  const exams = Array.isArray(teacher.exams) && teacher.exams.length > 0 ? teacher.exams : ['JEE Advanced', 'JEE Main', 'NEET'];
  const boards = Array.isArray(teacher.boards) && teacher.boards.length > 0 ? teacher.boards : ['CBSE', 'ISC', 'IB HL'];
  const nextSlots = Array.isArray(teacher.nextSlots) && teacher.nextSlots.length > 0 ? teacher.nextSlots : [
    'Tomorrow 5:00 PM IST',
    'Tomorrow 7:00 PM IST',
    'Friday 6:00 PM IST',
    'Saturday 11:00 AM IST'
  ];

  const isGuest = AppState.currentRole === 'guest' || !AppState.isLoggedIn;
  const teacherId = teacher.id || 't-ananya';

  return `
    <div class="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      <!-- Public Navigation Header for Guests -->
      ${isGuest ? `
        <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 mb-6 shadow-xs">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="#" onclick="window.navigateView('public-home')" class="flex items-center gap-2.5 text-decoration-none">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <span class="text-white font-black text-lg">S</span>
              </div>
              <span class="text-xl font-extrabold text-blue-950 tracking-tight">SIKO</span>
            </a>
            
            <div class="flex items-center gap-2 sm:gap-3">
              <button onclick="window.navigateView('teacher-marketplace')" class="btn btn-outline btn-sm">
                ← Back to Marketplace
              </button>
              <button onclick="window.startBookingFlow('${teacherId}')" class="btn btn-primary btn-sm">
                Book This Teacher →
              </button>
            </div>
          </div>
        </header>
      ` : ''}

      <div class="container max-w-7xl mx-auto px-4 sm:px-6">
        <!-- Breadcrumb & Back -->
        <div class="flex items-center gap-2 text-xs text-slate-500 mb-6 pt-2">
          <a href="#" onclick="window.navigateView('teacher-marketplace')" class="hover:underline text-blue-600 font-medium">← Teacher Marketplace</a>
          <span>/</span>
          <span class="text-slate-800 font-bold">${name}</span>
        </div>

        <!-- Top Header Card -->
        <div class="card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm mb-8">
          <div class="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div class="flex flex-col sm:flex-row items-start gap-6 flex-1">
              <div class="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                <img src="${avatar}" alt="${name}" class="w-full h-full rounded-2xl object-cover border-2 border-slate-100 shadow-sm" />
                <span class="verified-badge" style="width:24px; height:24px; position:absolute; bottom:-4px; right:-4px;" title="SIKO Verified Educator">${Icons.check}</span>
              </div>

              <div>
                <div class="flex flex-wrap items-center gap-3 mb-1.5">
                  <h1 class="text-2xl sm:text-3xl font-black text-slate-950">${name}</h1>
                  ${TeacherTierBadge({ tier: tier })}
                </div>
                <p class="text-sm text-slate-600 font-medium mb-3">${title}</p>

                <div class="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span class="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
                    ${Icons.star} ${rating} (${ratingsCount} verified reviews)
                  </span>
                  <span>•</span>
                  <span class="font-semibold text-slate-800">${experienceYears}+ Years Teaching Experience</span>
                  <span>•</span>
                  <span class="font-semibold text-slate-800">${languages.join(' & ')}</span>
                </div>
              </div>
            </div>

            <!-- Direct Booking Card / CTA -->
            <div class="w-full lg:w-auto bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left lg:text-right min-w-[280px]">
              <div class="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
                ${priceFormatted} <span class="text-xs text-slate-500 font-normal">/ 1:1 session</span>
              </div>
              <p class="text-xs text-emerald-700 font-bold mb-3 flex items-center lg:justify-end gap-1">
                ${Icons.shield} 100% Satisfaction Guarantee
              </p>
              <button class="btn btn-outline btn-full mb-2.5 font-bold flex items-center justify-center gap-2 text-blue-700 bg-white border-blue-200 hover:bg-blue-50" onclick="window.openTeacherDemoLectureModal('${teacherId}')">
                <span>▶ Watch Demo Lecture (10m)</span>
              </button>
              <button class="btn btn-primary btn-full btn-lg mb-2" onclick="window.startBookingFlow('${teacherId}')">
                Choose This Teacher
              </button>
              <p class="text-2xs text-slate-500 text-center">First session milestone protected in escrow</p>
            </div>
          </div>

          <!-- Section: Why SIKO Recommends This Teacher -->
          <div class="mt-8 pt-6 border-t border-slate-100 bg-blue-50/70 p-5 rounded-xl border border-blue-100">
            <div class="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
              ${Icons.sparkles} Why SIKO Recommends ${name}
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              ${matchRationale.map(item => `
                <div class="flex items-center gap-2 font-medium">
                  <span class="text-blue-600 font-bold flex-shrink-0">${Icons.check}</span>
                  <span>${item}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Main Profile Detail Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left 2 Cols: Academic Dossier -->
          <div class="lg:col-span-2 flex flex-col gap-8">
            <!-- About & Pedagogy -->
            <div class="card p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <h3 class="text-lg font-bold text-slate-900 mb-3">Teaching Philosophy & Pedagogy</h3>
              <p class="text-sm text-slate-700 leading-relaxed mb-4">
                ${teachingStyle}
              </p>
              <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 italic">
                "${quote}"
              </div>
            </div>

            <!-- Academic Qualifications & Institutional Background -->
            <div class="card p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <h3 class="text-lg font-bold text-slate-900 mb-4">Qualifications & Background</h3>
              <div class="space-y-4 text-xs">
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                    ${Icons.award}
                  </div>
                  <div>
                    <h5 class="text-sm font-bold text-slate-900">Highest Academic Credential</h5>
                    <p class="text-slate-600">${education}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
                    ${Icons.bookOpen}
                  </div>
                  <div>
                    <h5 class="text-sm font-bold text-slate-900">Prior Institutional Appointments</h5>
                    <p class="text-slate-600">Senior Faculty at Premier National Coaching Centers & International Schools</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Verified Student Outcomes & Score Jumps -->
            <div class="card p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <h3 class="text-lg font-bold text-slate-900 mb-4">Verified Student Outcomes</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div class="text-2xl font-black text-emerald-700 mb-1">${outcomes.scoreJump || '+28% Average Score Lift'}</div>
                  <p class="text-xs text-emerald-900 font-medium">Standardized benchmark improvement measured post 24 instructional hours.</p>
                </div>
                <div class="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div class="text-2xl font-black text-blue-700 mb-1">${outcomes.targetMet || '94% Success Rate'}</div>
                  <p class="text-xs text-blue-900 font-medium">Of enrolled students attained or exceeded their target percentile tier.</p>
                </div>
              </div>
            </div>

            <!-- Authentic Reviews & Student Testimonials -->
            <div class="card p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <h3 class="text-lg font-bold text-slate-900 mb-4">Parent & Student Reviews</h3>
              <div class="space-y-4">
                ${reviews.map(rev => `
                  <div class="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-xs font-bold text-slate-900">${rev.author || 'Parent / Student'}</span>
                      <span class="flex items-center text-xs text-amber-500 font-bold">${Icons.star} 5.0</span>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed">"${rev.text}"</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right Col: Syllabus Coverage & Weekly Calendar Availability -->
          <div class="flex flex-col gap-6">
            <!-- Curricular Coverage -->
            <div class="card p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <h4 class="text-sm font-bold text-slate-900 mb-3">Subjects & Exams</h4>
              <div class="mb-3">
                <span class="text-xs text-slate-500 font-bold block mb-1.5">SUBJECTS:</span>
                <div class="flex flex-wrap gap-1.5">
                  ${subjects.map(s => `<span class="badge badge-primary">${s}</span>`).join('')}
                </div>
              </div>
              <div class="mb-3">
                <span class="text-xs text-slate-500 font-bold block mb-1.5">EXAMS:</span>
                <div class="flex flex-wrap gap-1.5">
                  ${exams.map(e => `<span class="badge badge-warning">${e}</span>`).join('')}
                </div>
              </div>
              <div>
                <span class="text-xs text-slate-500 font-bold block mb-1.5">BOARDS:</span>
                <div class="flex flex-wrap gap-1.5">
                  ${boards.map(b => `<span class="badge badge-neutral">${b}</span>`).join('')}
                </div>
              </div>
            </div>

            <!-- Weekly Availability Slot Picker -->
            <div class="card p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <h4 class="text-sm font-bold text-slate-900 mb-3">Live Availability Grid</h4>
              <p class="text-xs text-slate-500 mb-4">Select an open slot to begin your 1:1 journey:</p>

              <div class="space-y-2">
                ${nextSlots.map(slot => `
                  <div class="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors" onclick="window.selectSlotAndBook('${teacherId}', '${slot}')">
                    <span class="text-xs font-semibold text-slate-800">${slot}</span>
                    <span class="text-xs text-blue-600 font-bold">Select &rarr;</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
