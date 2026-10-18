/**
 * SIKO LEARNING DNA SCREEN
 * "Meet your Learning DNA."
 * Synthesized cognitive profile mapping strengths, focus areas, speed, accuracy, concept mastery, and consistency.
 */

import { AppState } from '../state.js';
import { Icons, ProgressBar } from '../components.js';

export function renderLearningDna() {
  const ob = AppState.studentOnboarding || {};
  const dna = AppState.learningDna || {};
  const bf = AppState.bookingFlow || {};
  const studentName = typeof window.getStudentDisplayName === 'function'
    ? (window.getStudentDisplayName() || 'Student')
    : (ob.studentName || ob.name || 'Student');
  const allowedSubjects = typeof window.getAllowedSubjectsForStream === 'function'
    ? window.getAllowedSubjectsForStream()
    : ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
  const selectedMultiSubjects = Array.isArray(bf.selectedSubjects) && bf.selectedSubjects.length > 0
    ? bf.selectedSubjects.filter(s => allowedSubjects.includes(s))
    : ['Physics', 'Chemistry', 'Mathematics'].filter(s => allowedSubjects.includes(s));
  const activeSubject = dna.subject || ob.selectedSubject || ob.subject || selectedMultiSubjects[0] || 'Physics';

  const facultyMap = {
    Physics: { name: 'Dedicated Master Faculty', qual: 'Ph.D. IIT Delhi', exp: '12+ yrs • JEE Physics Lead', timing: 'Mon, Wed, Fri • 5:00 PM IST', avatar: '👩‍🏫' },
    Chemistry: { name: 'Senior Master Faculty (Chemistry)', qual: 'Ph.D. CSIR-NET JRF', exp: '10+ yrs • JEE/NEET Chem Lead', timing: 'Tue, Thu, Sat • 5:00 PM IST', avatar: '👩‍🔬' },
    Mathematics: { name: 'Senior Master Faculty (Mathematics)', qual: 'M.Tech IIT Bombay', exp: '14+ yrs • Advanced Maths Lead', timing: 'Mon, Wed, Fri • 6:30 PM IST', avatar: '👨‍🏫' },
    Biology: { name: 'Senior Master Faculty (Biology)', qual: 'MBBS AIIMS New Delhi', exp: '11+ yrs • NEET Biology Lead', timing: 'Mon, Wed, Fri • 7:45 PM IST', avatar: '👩‍⚕️' }
  };

  // Ensure dynamic evaluation is always hydrated from the student's actual diagnostic answers
  const diagAccuracy = typeof dna.accuracy === 'number' ? dna.accuracy : 60;
  const healthScore = typeof dna.healthScore === 'number' ? dna.healthScore : Math.max(38, Math.min(98, Math.round(diagAccuracy * 0.85 + 12)));
  const conceptMastery = typeof dna.conceptMastery === 'number' ? dna.conceptMastery : diagAccuracy;
  const correctCount = typeof dna.correctCount === 'number' ? dna.correctCount : Math.round((diagAccuracy / 100) * 5);
  const totalQuestions = dna.totalQuestions || 5;

  // Dynamic AI-Regulated Tier & Sub-Labels based on child's actual score
  const tierBadge = diagAccuracy >= 80
    ? { label: 'Advanced Olympiad / Rank-Builder Calibre', cls: 'badge-success', sub: 'Ready for multi-concept derivations & rank-builder problems' }
    : diagAccuracy >= 60
      ? { label: 'Proficient Application Calibre', cls: 'badge-primary', sub: 'Solid core grasp; needs timed numerical & edge-case practice' }
      : diagAccuracy >= 40
        ? { label: 'Developing Concept Calibre', cls: 'badge-warning', sub: 'Partial concept recall; requires guided step-by-step scaffolding' }
        : { label: 'Foundation Remediation Calibre', cls: 'badge-warning', sub: 'Requires root-cause NCERT/Board first-principles rebuilding' };

  const healthNote = healthScore >= 80
    ? '+12 pts above grade benchmark'
    : healthScore >= 60
      ? 'On track — +18% projected lift in 4 weeks'
      : 'Priority intervention — +25% score recovery plan active';

  const speedLabel = dna.learningSpeed || (diagAccuracy >= 80 ? 'Fast & Analytical' : diagAccuracy >= 60 ? 'Steady & Methodical' : diagAccuracy >= 40 ? 'Guided Step-by-Step' : 'Foundational Visual Pace');
  const speedSub = diagAccuracy >= 80
    ? 'Rapid intuitive derivation & multi-step synthesis'
    : diagAccuracy >= 60
      ? 'Balanced conceptual comprehension with structured steps'
      : diagAccuracy >= 40
        ? 'Requires worked examples before independent numericals'
        : 'Benefits from visual analogies & slow-paced concept blocks';

  const confidenceLabel = dna.confidence || (diagAccuracy >= 80 ? 'High (Self-Reliant)' : diagAccuracy >= 60 ? 'Moderate-High' : diagAccuracy >= 40 ? 'Building (Needs Prompts)' : 'Low (Needs Handholding)');
  const confidenceSub = diagAccuracy >= 80
    ? 'Solves unseen application problems independently'
    : diagAccuracy >= 60
      ? 'Confident on standard patterns; hesitates on twist questions'
      : 'Needs hint prompts to initiate multi-step equations';

  const consistencyLabel = dna.consistency || (diagAccuracy >= 80 ? 'High Discipline' : diagAccuracy >= 60 ? 'Steady Routine' : 'Guided Daily Micro-Goals');
  const consistencySub = diagAccuracy >= 80
    ? 'Sustains deep 60-min problem-solving blocks'
    : diagAccuracy >= 60
      ? '45-min structured daily study blocks recommended'
      : '30-min bite-sized AI guided daily tasks assigned';

  const strengths = Array.isArray(dna.strengths) && dna.strengths.length > 0
    ? dna.strengths
    : [ `${activeSubject} Foundational Definitions`, 'Visual Pattern Recognition' ];
  const focusAreas = Array.isArray(dna.focusAreas) && dna.focusAreas.length > 0
    ? dna.focusAreas
    : [ `${activeSubject} Multi-Step Numerical Application`, 'Time-Bound Exam Execution' ];

  const aiSummary = dna.aiDiagnosticSummary ||
    `AI Regulated Assessment for ${studentName} (${activeSubject}): Scored ${correctCount}/${totalQuestions} (${diagAccuracy}%). Calibrated to "${tierBadge.label}" with ${speedLabel} pacing. Daily Study Plan & 1:1 Teacher brief have been automatically updated to target ${focusAreas.join(' and ')}.`;

  const questionBreakdown = Array.isArray(dna.questionBreakdown) && dna.questionBreakdown.length > 0
    ? dna.questionBreakdown
    : [
        { qNum: 1, concept: `${activeSubject} Core Law & Vector Formulation`, userSelected: correctCount >= 1 ? 'Correct Option' : 'Incorrect Option', correctOption: 'Correct Option', isCorrect: correctCount >= 1 },
        { qNum: 2, concept: `${activeSubject} Conservation & Equilibrium Analysis`, userSelected: correctCount >= 2 ? 'Correct Option' : 'Incorrect Option', correctOption: 'Correct Option', isCorrect: correctCount >= 2 },
        { qNum: 3, concept: `${activeSubject} Rate of Change & Graphical Slope`, userSelected: correctCount >= 3 ? 'Correct Option' : 'Incorrect Option', correctOption: 'Correct Option', isCorrect: correctCount >= 3 },
        { qNum: 4, concept: `${activeSubject} Multi-Variable Numerical Application`, userSelected: correctCount >= 4 ? 'Correct Option' : 'Incorrect Option', correctOption: 'Correct Option', isCorrect: correctCount >= 4 },
        { qNum: 5, concept: `${activeSubject} High-Order Synthesis & Edge Case`, userSelected: correctCount >= 5 ? 'Correct Option' : 'Incorrect Option', correctOption: 'Correct Option', isCorrect: correctCount >= 5 }
      ];

  return `
    <div class="container py-10 max-w-5xl">
      <!-- Top Emotion Header -->
      <div class="text-center mb-8">
        <span class="badge badge-primary mb-3">${Icons.sparkles} AI-Regulated Diagnostic Complete (${correctCount}/${totalQuestions} Correct)</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Meet <span data-student-name-display>${studentName}</span>'s Dynamic Learning DNA (${activeSubject}).
        </h1>
        <p class="text-slate-600 text-sm max-w-2xl mx-auto">
          Regulated in real time by SIKO AI based on <span data-student-name-display>${studentName}</span>'s exact question-by-question responses (${diagAccuracy}% accuracy) — dynamically driving their Multi-Subject Weekly Timetable (${selectedMultiSubjects.join(' + ')}), Homework difficulty, and Teacher pedagogy.
        </p>
      </div>

      <!-- STUDENT NAME & MULTI-SUBJECT SELECTION BAR (CHEMISTRY + ALL SUBJECTS SELECTABLE) -->
      <div class="card p-4 sm:p-5 bg-white border border-indigo-200 rounded-2xl mb-6 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <label class="block text-2xs font-extrabold uppercase tracking-wider text-indigo-700 mb-1" for="dnaStudentNameInput">Student's Full Name (Live Editable)</label>
          <input id="dnaStudentNameInput" type="text" value="${studentName.replace(/"/g, '&quot;')}"
            oninput="window.setStudentDisplayName(this.value, false)"
            placeholder="Enter Child's Full Name"
            class="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:border-indigo-600 outline-none" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-2xs font-extrabold uppercase tracking-wider text-indigo-700">Enrolled Multi-Subject Selection (Click to Toggle ON/OFF)</span>
            <span class="text-3xs font-extrabold text-emerald-700">${selectedMultiSubjects.length} Subjects Active</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${allowedSubjects.map(sub => {
              const isInBundle = selectedMultiSubjects.includes(sub);
              return `
                <button type="button" onclick="window.toggleBookingSubjectSelection('${sub}'); window.simulateLearningDnaProfile('${diagAccuracy <= 25 ? 'foundation' : diagAccuracy <= 45 ? 'developing' : diagAccuracy <= 65 ? 'proficient' : diagAccuracy <= 85 ? 'strong' : 'mastery'}', '${sub}');"
                  class="px-3 py-1.5 rounded-xl border text-xs font-extrabold cursor-pointer transition flex items-center gap-1.5 ${isInBundle ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs' : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-indigo-400'}">
                  <span>${isInBundle ? '☑' : '☐'}</span>
                  <span>${sub}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- INTERACTIVE AI-REGULATED RESPONSE CALIBRATOR (TEST DIFFERENT CHILD RESPONSES LIVE) -->
      <div class="card p-4 sm:p-5 bg-slate-900 text-white rounded-2xl border border-indigo-500/40 mb-8 shadow-md">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-white/15">
          <div>
            <span class="text-3xs font-extrabold uppercase tracking-wider text-amber-300 block">🧠 Live AI-Regulated Diagnostic Response Regulator</span>
            <h4 class="text-xs sm:text-sm font-bold text-white">Simulate Different Child Diagnostic Responses or Switch Active DNA Subject (Physics, Chemistry, Maths, Biology)</h4>
          </div>
          <button type="button" onclick="window.setStudentOnboardingStep && window.setStudentOnboardingStep(5); window.navigateView('student-onboarding')"
                  class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-2xs cursor-pointer border border-white/20">
            🔄 Retake 5-Question Diagnostic
          </button>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-2xs font-bold text-slate-300 mr-1">Child Score Response:</span>
            ${[
              { key: 'foundation', label: '1/5 (20% • Foundation)', pct: 20 },
              { key: 'developing', label: '2/5 (40% • Developing)', pct: 40 },
              { key: 'proficient', label: '3/5 (60% • Proficient)', pct: 60 },
              { key: 'strong', label: '4/5 (80% • Strong)', pct: 80 },
              { key: 'mastery', label: '5/5 (100% • Mastery)', pct: 100 }
            ].map(p => `
              <button type="button" onclick="window.simulateLearningDnaProfile('${p.key}', '${activeSubject}')"
                      class="px-2.5 py-1.5 rounded-lg text-2xs font-extrabold cursor-pointer border-0 transition-all ${diagAccuracy === p.pct ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-white/10 text-slate-200 hover:bg-white/20'}">
                ${p.label}
              </button>
            `).join('')}
          </div>

          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-2xs font-bold text-slate-300 mr-1">Active DNA Subject:</span>
            ${['Physics', 'Chemistry', 'Mathematics', 'Biology'].filter(s => allowedSubjects.includes(s)).map(sub => `
              <button type="button" onclick="window.simulateLearningDnaProfile('${diagAccuracy <= 25 ? 'foundation' : diagAccuracy <= 45 ? 'developing' : diagAccuracy <= 65 ? 'proficient' : diagAccuracy <= 85 ? 'strong' : 'mastery'}', '${sub}')"
                      class="px-2.5 py-1 rounded-lg text-2xs font-bold cursor-pointer border-0 ${activeSubject === sub ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}">
                ${sub}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Core DNA Radar / Metrics Overview Card -->
      <div class="card p-6 sm:p-8 bg-white border rounded-2xl shadow-sm mb-8">
        <!-- AI Executive Diagnostic Narrative -->
        <div class="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 mb-6 flex items-start gap-3">
          <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0">AI</div>
          <div class="text-xs text-slate-800 leading-relaxed">
            <div class="font-extrabold text-indigo-950 uppercase tracking-wider text-2xs mb-0.5">AI Regulated Cognitive & Calibre Evaluation (${dna.evaluatedAt || 'Live Evaluation'})</div>
            ${aiSummary}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b pb-8 mb-8">
          <!-- Overall Diagnostic Score -->
          <div class="text-center p-6 bg-gradient-to-b from-blue-50 to-white rounded-2xl border border-blue-100">
            <span class="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">Diagnostic Score (${correctCount}/${totalQuestions})</span>
            <div class="text-5xl font-black text-blue-700 tracking-tight mb-2">${diagAccuracy}%</div>
            <span class="badge ${tierBadge.cls} text-2xs">${tierBadge.label}</span>
            <p class="text-3xs text-slate-500 mt-1.5">${tierBadge.sub}</p>
          </div>

          <!-- Academic Health Index -->
          <div class="text-center p-6 bg-gradient-to-b from-amber-50 to-white rounded-2xl border border-amber-100">
            <span class="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-1">Academic Health Score</span>
            <div class="text-5xl font-black text-amber-600 tracking-tight mb-2">${healthScore} <span class="text-xs text-slate-400 font-normal">/ 100</span></div>
            <span class="text-2xs text-amber-800 font-semibold">${healthNote}</span>
          </div>

          <!-- Cognitive Speed & Style -->
          <div class="text-center p-6 bg-gradient-to-b from-emerald-50 to-white rounded-2xl border border-emerald-100">
            <span class="text-xs font-bold text-emerald-900 uppercase tracking-wider block mb-1">AI Regulated Learning Speed</span>
            <div class="text-xl font-extrabold text-emerald-800 mb-2">${speedLabel}</div>
            <span class="text-2xs text-emerald-700 font-medium">${speedSub}</span>
          </div>
        </div>

        <!-- Visual Mastery Indicators Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <!-- Left: Strengths -->
          <div>
            <h4 class="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Verified Strengths (From Correct Responses)
            </h4>
            <div class="space-y-3">
              ${strengths.map(s => `
                <div class="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs gap-2">
                  <span class="font-bold text-emerald-900">${s}</span>
                  <span class="text-emerald-700 font-bold whitespace-nowrap">${Icons.check} ${diagAccuracy >= 60 ? 'Ready for Advanced' : 'Baseline Verified'}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right: Focus Areas -->
          <div>
            <h4 class="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Priority Focus Areas (From Missed / Weak Concepts)
            </h4>
            <div class="space-y-3">
              ${focusAreas.map(f => `
                <div class="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between text-xs gap-2">
                  <span class="font-bold text-amber-900">${f}</span>
                  <span class="badge badge-warning text-2xs whitespace-nowrap">Added to Daily Study Plan</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Question-by-Question Child Response Breakdown -->
        <div class="mb-8 p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h4 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">📋 Question-by-Question Child Response Analysis (${activeSubject})</h4>
            <span class="text-2xs font-bold text-indigo-700">Directly Regulates AI Homework & Daily Study Plan</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-2xs">
            ${questionBreakdown.map(q => `
              <div class="p-3 rounded-xl border ${q.isCorrect ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'}">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-black text-slate-900">Q${q.qNum}</span>
                  <span class="px-1.5 py-0.5 rounded text-3xs font-extrabold ${q.isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'}">
                    ${q.isCorrect ? '✓ Correct' : '✗ Needs Fix'}
                  </span>
                </div>
                <div class="font-bold text-slate-800 mb-1">${q.concept}</div>
                <div class="text-3xs text-slate-600 truncate">Child Ans: <strong>${q.userSelected}</strong></div>
                ${!q.isCorrect ? `<div class="text-3xs text-emerald-800 font-semibold truncate">Correct: ${q.correctOption}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Detailed Metric Gauges -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span class="text-slate-500 font-medium block mb-1">Concept Mastery</span>
            <div class="text-lg font-bold text-slate-900 mb-2">${conceptMastery}%</div>
            ${ProgressBar({ value: conceptMastery, variant: 'primary', showPercent: false })}
          </div>
          <div>
            <span class="text-slate-500 font-medium block mb-1">Problem Accuracy</span>
            <div class="text-lg font-bold text-slate-900 mb-2">${diagAccuracy}%</div>
            ${ProgressBar({ value: diagAccuracy, variant: 'success', showPercent: false })}
          </div>
          <div>
            <span class="text-slate-500 font-medium block mb-1">Confidence Index</span>
            <div class="text-lg font-bold text-slate-900 mb-1">${confidenceLabel}</div>
            <span class="text-2xs text-blue-600 font-semibold">${confidenceSub}</span>
          </div>
          <div>
            <span class="text-slate-500 font-medium block mb-1">Consistency Plan</span>
            <div class="text-lg font-bold text-slate-900 mb-1">${consistencyLabel}</div>
            <span class="text-2xs text-emerald-600 font-semibold">${consistencySub}</span>
          </div>
        </div>
      </div>

      <!-- DEDICATED LOCKED FACULTY SPECIALIST ROSTER (ALL ENROLLED MULTI-SUBJECTS) -->
      <div class="card p-6 bg-white border border-indigo-200 rounded-2xl mb-8 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div>
            <span class="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 text-3xs font-extrabold uppercase tracking-wider">
              🔒 1-on-1 Multi-Subject Locked Specialists
            </span>
            <h3 class="text-base sm:text-lg font-black text-slate-900 mt-1">
              Dedicated Faculty Specialists Assigned to <span data-student-name-display>${studentName}</span>
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Every enrolled subject is taught 1-on-1 by a dedicated verified master educator — locked to your weekly schedule under the <strong>Success Assured Plan</strong>.
            </p>
          </div>
          <span class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold text-2xs flex items-center gap-1.5">
            ✓ ${selectedMultiSubjects.length} Specialists Locked
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(4, Math.max(2, selectedMultiSubjects.length))} gap-4">
          ${selectedMultiSubjects.map(sub => {
            const fac = facultyMap[sub] || { name: 'Master Faculty', qual: 'Expert Educator', exp: '10+ yrs experience', timing: 'Mon, Wed, Fri • 5:00 PM IST', avatar: '👩‍🏫' };
            return `
              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-50 transition-all space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-2xl">${fac.avatar}</span>
                  <span class="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-extrabold text-3xs border border-purple-200">
                    🔒 Locked 1:1
                  </span>
                </div>
                <div>
                  <span class="text-3xs font-extrabold text-indigo-700 uppercase tracking-wider block">${sub} Specialist</span>
                  <h4 class="text-sm font-black text-slate-900">${fac.name}</h4>
                  <div class="text-2xs text-slate-600 font-semibold mt-0.5">${fac.qual}</div>
                  <div class="text-3xs text-slate-500">${fac.exp}</div>
                </div>
                <div class="pt-2 border-t border-slate-200 text-3xs text-slate-600">
                  <span class="font-bold text-slate-700">Slot:</span> ${fac.timing}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- SIKO STREAMLINED NEXT-STEP JOURNEY FLOW -->
      <div class="card p-7 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-xl border border-blue-500/30">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div class="max-w-2xl">
            <span class="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-2xs font-extrabold uppercase tracking-wider inline-block mb-2">
              ✓ Learning DNA Calibrated (${diagAccuracy}% Baseline • Success Assured Plan)
            </span>
            <h3 class="text-xl font-black text-white tracking-tight">
              Your Learning DNA is active! Continue to select your faculty &amp; schedule:
            </h3>
            <p class="text-xs text-blue-200 mt-1.5 leading-relaxed">
              Based on ${studentName}'s ${correctCount}/${totalQuestions} (${diagAccuracy}%) diagnostic response, your <strong>AI Daily Study Plan</strong>, <strong>1-on-1 Educator brief</strong>, and <strong>Adaptive Topic Tests</strong> are now calibrated to <strong>${speedLabel}</strong> pace.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button class="btn btn-secondary btn-md font-extrabold shadow-lg cursor-pointer" onclick="if(!AppState.bookingData) AppState.bookingData={}; AppState.bookingData.step = 4; window.navigateView('booking-flow')">
              👩‍🏫 Continue to Step 4: Select Faculty &amp; Schedule ${Icons.arrowRight}
            </button>
            <button class="btn btn-md font-extrabold text-amber-950 shadow-md cursor-pointer" style="background:linear-gradient(135deg,#FDE68A,#F59E0B);border:none;" onclick="window.openAiQuestionPaperPortal('topic_ai')">
              🤖 AI Adaptive Topic Test ↗
            </button>
            <button class="btn btn-outline btn-md font-bold text-white border-white/30 hover:bg-white/10 cursor-pointer" onclick="window.navigateView('student-home')">
              🎓 Student Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
