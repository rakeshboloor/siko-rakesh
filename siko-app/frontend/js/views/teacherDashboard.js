/**
 * SIKO TEACHER DASHBOARD VIEW - PROPER CHRONOLOGICAL EDUCATOR WORKFLOW
 * Designed from the perspective of an accredited SIKO Educator after completing
 * the 5-Step Joining & Orientation Flow:
 * - Step 1: My Assigned Batches, Students & Non-Clashing Weekly Timetable
 * - Step 2: Conduct Live Interactive Class & Lecture Delivery (Unlocks Milestone M1 — 50%)
 * - Step 3: Post-Lecture Worksheets, Chapter Tests & Paper Evaluation (Unlocks Milestone M2 — 25%)
 * - Step 4: Faculty PTM Feedback Report & Milestone Escrow Wallet (Unlocks Milestone M3 — 25%)
 */

import { AppState, formatPrice } from '../state.js';
import { Icons, TeacherTierBadge, ProgressBar } from '../components.js';

window.setTeacherPortalStep = function(stepKey) {
  if (!AppState.teacherData) AppState.teacherData = {};
  const numMap = { 1: 'step1_classes', 2: 'step2_live_class', 3: 'step3_ai_queue', 4: 'step4_earnings' };
  const aliasMap = { 'step3_assessments': 'step3_ai_queue', 'step4_remuneration': 'step4_earnings' };
  AppState.teacherData.activePortalStep = numMap[stepKey] || aliasMap[stepKey] || stepKey;
  if (AppState.teacherData.activePortalStep === 'step3_ai_queue' && !AppState.teacherData.activeStep3SubTab) {
    AppState.teacherData.activeStep3SubTab = 'assessment_suite';
  }
  if (typeof window.renderApp === 'function') window.renderApp();
};
window.setTeacherDashboardStep = window.setTeacherPortalStep;

window.startEditReviewQuestion = function(itemId, qIndex) {
  AppState.editingReviewQuestion = { itemId, qIndex: Number(qIndex) };
  if (typeof window.renderApp === 'function') window.renderApp();
};

window.cancelEditReviewQuestion = function() {
  AppState.editingReviewQuestion = null;
  if (typeof window.renderApp === 'function') window.renderApp();
};

window.saveEditReviewQuestion = function(itemId, qIndex) {
  const item = (AppState.reviewQueue || []).find(x => x.id === itemId);
  const qIdx = Number(qIndex);
  if (item && item.questions && item.questions[qIdx]) {
    const textInput = document.getElementById(`edit-q-text-${itemId}-${qIdx}`);
    const ansInput = document.getElementById(`edit-q-ans-${itemId}-${qIdx}`);
    if (textInput && textInput.value) {
      item.questions[qIdx].text = textInput.value;
      item.questions[qIdx].question = textInput.value;
    }
    if (ansInput && item.questions[qIdx].options) {
      item.questions[qIdx].answer = Number(ansInput.value) || 0;
      item.questions[qIdx].correct = Number(ansInput.value) || 0;
    }
    if (typeof window.showToast === 'function') {
      window.showToast(`✓ Question #${qIdx + 1} updated successfully!`, 'success');
    }
  }
  AppState.editingReviewQuestion = null;
  if (typeof window.renderApp === 'function') window.renderApp();
};

window.swapReviewItemQuestion = function(itemId, qIndex) {
  const item = (AppState.reviewQueue || []).find(x => x.id === itemId);
  if (item && item.questions && item.questions[qIndex]) {
    const alternates = [
      { text: 'A sphere of mass M and radius R rolls down an inclined plane of angle θ without slipping. Find its linear acceleration down the incline.', options: ['(5/7) g sin θ', '(2/3) g sin θ', '(1/2) g sin θ', '(5/9) g sin θ'], answer: 0, concept: 'Rolling without slipping', difficulty: 'hard' },
      { text: 'Two masses m1 and m2 connected by a light string pass over a frictionless pulley. If m1 > m2, the acceleration of the system is:', options: ['(m1 - m2)g / (m1 + m2)', 'g', '(m1 + m2)g / (m1 - m2)', '(m1 - m2)g'], answer: 0, concept: 'Atwood Machine Dynamics', difficulty: 'medium' },
      { text: 'A force F = 20 - 4t acts on a 2 kg body initially at rest. Find the velocity of the body when the force becomes zero.', options: ['25 m/s', '50 m/s', '10 m/s', '5 m/s'], answer: 0, concept: 'Variable Force & Impulse', difficulty: 'medium' }
    ];
    const picked = alternates[Math.floor(Math.random() * alternates.length)];
    item.questions[qIndex] = { ...item.questions[qIndex], ...picked };
    if (typeof window.showToast === 'function') {
      window.showToast(`🔄 Question #${qIndex + 1} swapped with an AI curated alternate!`, 'info');
    }
  }
  if (typeof window.renderApp === 'function') window.renderApp();
};

window.deleteReviewItemQuestion = function(itemId, qIndex) {
  const item = (AppState.reviewQueue || []).find(x => x.id === itemId);
  if (item && item.questions) {
    item.questions.splice(qIndex, 1);
    if (typeof window.showToast === 'function') {
      window.showToast(`Removed question #${qIndex + 1}`, 'warning');
    }
  }
  if (typeof window.renderApp === 'function') window.renderApp();
};

window.addCustomReviewQuestion = function(itemId) {
  const item = (AppState.reviewQueue || []).find(x => x.id === itemId);
  if (item && item.questions) {
    item.questions.push({
      id: item.questions.length + 1,
      type: 'mcq',
      marks: 4,
      text: 'New teacher-created question: Calculate the normal reaction and static friction force.',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      answer: 0,
      concept: item.chapter || 'Mechanics',
      difficulty: 'medium'
    });
    if (typeof window.showToast === 'function') {
      window.showToast('➕ Custom question added! Click ✏️ to customize text.', 'success');
    }
  }
  if (typeof window.renderApp === 'function') window.renderApp();
};

export function renderTeacherDashboard() {
  const studentName = (typeof window.getStudentDisplayName === 'function' && window.getStudentDisplayName()) ||
    (AppState.studentOnboarding && (AppState.studentOnboarding.studentName || AppState.studentOnboarding.name)) ||
    (AppState.bookingData && AppState.bookingData.studentName) ||
    (AppState.enrolledCourse && AppState.enrolledCourse.studentName) ||
    'Enrolled Student';

  const wallet = AppState.teacherWallet || { available: 42500, escrow: 31000, upcoming: 18500 };
  const tier = AppState.teacherTier || { currentTier: 'Gold', metrics: { studentImprovement: 92, punctualityRate: 98 } };
  if (!AppState.teacherData) AppState.teacherData = {};
  const rawStep = AppState.teacherData.activePortalStep || 'step1_classes';
  // Normalize legacy step keys if needed
  const activeStep = ['step1_classes', 'step2_live_class', 'step3_ai_queue', 'step4_earnings'].includes(rawStep)
    ? rawStep
    : (rawStep === 'step2_ai_queue' || rawStep === 'step3_evaluations' ? 'step3_ai_queue' : rawStep === 'step3_workload' ? 'step1_classes' : 'step1_classes');

  const ob = AppState.teacherOnboarding || {};
  const teacherName = ob.fullName || (AppState.currentUser && AppState.currentUser.name) || 'Faculty Member';
  const teacherEmail = ob.email || (AppState.currentUser && AppState.currentUser.email) || 'faculty@joinsiko.com';
  const candidateId = ob.candidateId || 'SIKO-CAND-2026-8419';

  const teacherSteps = [
    { key: 'step1_classes', num: '1', label: '1. Assigned Batches & Timetable', sub: 'Students, Learning DNA & Weekly Slots' },
    { key: 'step2_live_class', num: '2', label: '2. Conduct Live Class (M1 — 50%)', sub: 'HD Classroom, Whiteboard & 90% Duration' },
    { key: 'step3_ai_queue', num: '3', label: '3. Post-Class Homework & Tests (M2 — 25%)', sub: 'Worksheets, Doubts & Paper Evaluation' },
    { key: 'step4_earnings', num: '4', label: '4. Faculty PTM & Escrow Wallet (M3 — 25%)', sub: 'Parent Feedback & 50/25/25 Bank Payouts' }
  ];

  return `
    <div class="container py-6 sm:py-8 max-w-5xl mx-auto overflow-hidden">
      <!-- TOP MODE SWITCHER: TEACHER JOINING & ORIENTATION FLOW vs LIVE EDUCATOR PORTAL -->
      <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-100 border border-slate-200 mb-5">
        <div class="flex items-center gap-2 flex-wrap">
          <button type="button" onclick="window.navigateView('teacher-onboarding')"
            class="px-4 py-2 rounded-xl bg-white hover:bg-indigo-50 text-slate-800 border border-slate-300 font-extrabold text-xs cursor-pointer">
            1️⃣ View Teacher Joining &amp; Orientation Flow (5 Steps)
          </button>
          <button type="button" onclick="window.navigateView('teacher-dashboard')"
            class="px-4 py-2 rounded-xl bg-slate-900 text-white font-black text-xs cursor-pointer border-0 shadow-xs">
            2️⃣ Live Educator Portal (Post-Orientation Command Centre)
          </button>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-extrabold text-2xs">
            ✓ Orientation Certified (${candidateId})
          </span>
        </div>
      </div>

      <!-- Greeting Header (Clean Faculty Header — No Immediate AI Grade Paper Button) -->
      <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="badge badge-primary">SIKO Accredited Faculty Portal</span>
            ${TeacherTierBadge({ tier: tier.currentTier })}
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-3xs font-extrabold">
              ✓ ${(ob.subjects || ['Physics']).join(', ')} • ${(ob.standards || ['Class 9–12']).join(', ')} • ${(ob.boards || ['CBSE / ICSE / State / JEE / MHT-CET']).join(', ')}
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight break-words">
            Welcome, ${teacherName} 👩‍🏫
          </h1>
          <p class="text-slate-600 text-xs sm:text-sm mt-0.5 break-all">
            Faculty ID: <strong>${candidateId}</strong> (${teacherEmail}) — Follow your 4-step teaching workflow below from Assigned Schedule &rarr; Live Class &rarr; Post-Class Assessment &rarr; PTM &amp; Wallet.
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <button type="button" class="btn btn-outline btn-sm font-bold border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer" onclick="window.openTeacherAbsenceModal()">
            <span>🚑</span> Report Medical Leave / Absence
          </button>
          <button type="button" class="btn btn-outline btn-sm font-bold border-indigo-300 text-indigo-900 bg-indigo-50 hover:bg-indigo-100 flex items-center gap-1.5 cursor-pointer" onclick="window.setTeacherPortalStep('step3_ai_queue'); window.setTeacherStep3SubTab && window.setTeacherStep3SubTab('assessment_suite');">
            <span>📝</span> Educator Assessment Suite
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.setTeacherPortalStep('step4_earnings')">
            ${Icons.wallet} Wallet (${formatPrice(wallet.available)})
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.enterLiveClassroom()">
            ${Icons.video} Start Live Class
          </button>
        </div>
      </div>

      <!-- 4-STEP CHRONOLOGICAL TEACHING WORKFLOW BAR -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
        ${teacherSteps.map(st => {
          const isActive = activeStep === st.key;
          return `
            <button type="button"
              onclick="window.setTeacherPortalStep('${st.key}')"
              class="p-3.5 rounded-2xl border text-left transition-all cursor-pointer min-w-0 overflow-hidden ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
              }">
              <div class="flex items-center justify-between gap-2 mb-1">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-2xs font-black shrink-0 ${isActive ? 'bg-emerald-400 text-slate-950' : 'bg-slate-100 text-slate-700'}">${st.num}</span>
                <span class="text-3xs font-extrabold uppercase tracking-wider truncate ${isActive ? 'text-emerald-300' : 'text-slate-400'}">${isActive ? '● Active Step' : 'Open Step'}</span>
              </div>
              <div class="font-extrabold text-xs sm:text-sm break-words ${isActive ? 'text-white' : 'text-slate-900'}">${st.label}</div>
              <div class="text-3xs ${isActive ? 'text-slate-300' : 'text-slate-500'} mt-0.5 truncate">${st.sub}</div>
            </button>
          `;
        }).join('')}
      </div>

      <!-- ===================================================================== -->
      <!-- STEP 1: MY ASSIGNED BATCHES, STUDENTS & NON-CLASHING WEEKLY TIMETABLE -->
      <!-- ===================================================================== -->
      ${activeStep === 'step1_classes' ? (() => {
        const utilRecords = (AppState.facultyUtilization && AppState.facultyUtilization.records) || [];
        const myUtil = utilRecords[0] || {
          teacherId: 't-physics',
          name: 'Dedicated Master Faculty',
          declaredHours: 30,
          oneOnOneHours: 18,
          batchHours: 12,
          allocatedHours: 30,
          utilizationPct: 100
        };
        const spec = (window.SUBJECT_SPECIALIST_FACULTY_ROSTER && window.SUBJECT_SPECIALIST_FACULTY_ROSTER.Physics) || {
          yearRound1ToManyBatches: [
            { quarter: 'Q1 (Apr–Jun)', type: '1:Many Subject Batch', title: 'Mechanics & Kinematics Foundation', schedule: 'Mon, Wed, Fri • 4:00–5:30 PM', weeklyHrs: 4.5 },
            { quarter: 'Q2 (Jul–Sep)', type: '1:Many Chapter Batch', title: 'Rotational Motion & Gravitation', schedule: 'Tue, Thu, Sat • 4:00–5:00 PM', weeklyHrs: 3.0 },
            { quarter: 'Q3 (Oct–Dec)', type: '1:Many Subject Batch', title: 'Electrostatics & Current Electricity', schedule: 'Mon, Wed, Fri • 7:30–9:00 PM', weeklyHrs: 4.5 },
            { quarter: 'Q4 (Jan–Mar)', type: '1:Many Exam Sprint', title: 'Board + JEE/NEET PYQ Marathon', schedule: 'Sat & Sun • 10:00 AM–1:00 PM', weeklyHrs: 6.0 }
          ]
        };
        return `
          <div class="space-y-6">
            <!-- Assigned Students, Learning DNA & Today's Synced Timetable -->
            <div class="card p-6 bg-white border rounded-2xl shadow-sm">
              ${(AppState.teacherAbsence && AppState.teacherAbsence.hasActiveAbsence) ? `
                <div class="p-4 rounded-xl border-2 border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-950 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div class="flex items-start gap-3">
                    <span class="text-2xl shrink-0">🚑</span>
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <strong class="text-xs font-black">Medical Absence / Leave Logged: ${AppState.teacherAbsence.reason}</strong>
                        <span class="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-3xs font-extrabold uppercase">Syllabus Recovery Strategy Active</span>
                      </div>
                      <p class="text-2xs text-amber-900 mt-1">
                        Affected Lecture: <strong>${AppState.teacherAbsence.affectedLecture}</strong> • Configured Recovery: <strong>${AppState.teacherAbsence.recoveryStrategy === 'weekend_marathon' ? `Weekend Recovery Marathon (${AppState.teacherAbsence.rescheduledSlot})` : AppState.teacherAbsence.rescheduledSlot}</strong>.
                        Student dashboard &amp; AI Practice Bridge synchronized. Timetable zero-clash protected.
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <button type="button" onclick="window.openTeacherAbsenceModal()" class="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-extrabold text-2xs hover:bg-amber-100 cursor-pointer shadow-xs">
                      ⚙️ Modify Strategy
                    </button>
                  </div>
                </div>
              ` : ''}

              <div class="flex flex-wrap justify-between items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                <div>
                  <span class="text-2xs font-extrabold uppercase tracking-wider text-blue-700 block">Step 1 of 4 • Post-Orientation Roster &amp; Schedule</span>
                  <h3 class="text-base sm:text-lg font-black text-slate-900">Your Assigned 1-on-1 Students, Smart Batches &amp; Weekly Timetable</h3>
                  <p class="text-2xs text-emerald-700 font-semibold">✓ Zero-Clash Synced Timetable • 1.0 Hr/Slot for Class 8–10 School Boards • 1.5 Hrs/Slot for Olympiads &amp; Class 11–12</p>
                </div>
                <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold">
                  ${myUtil.allocatedHours} / ${myUtil.declaredHours} Weekly Hrs Allocated (100%)
                </span>
              </div>

              <div class="space-y-3">
                <div class="p-4 rounded-xl border-2 border-blue-500 bg-blue-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div class="flex items-center gap-4">
                    <div class="text-center font-bold min-w-[85px] p-2 rounded-lg bg-blue-600 text-white">
                      <div class="text-xs">5:00 PM</div>
                      <div class="text-3xs text-blue-100">1.5 Hrs / Slot</div>
                    </div>
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-extrabold text-3xs uppercase">1-on-1 Assigned Student</span>
                        <span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-bold text-3xs">🧬 Learning DNA: 84% (Advanced Tier)</span>
                      </div>
                      <div class="font-black text-sm text-slate-900 mt-1">${(AppState.syncedTimetable && AppState.syncedTimetable.studentName) || studentName} • Class 11 JEE Main &amp; Adv / MHT-CET</div>
                      <p class="text-xs text-slate-600">Physics: Laws of Motion &amp; Friction • Slot: <strong>Mon, Wed, Fri • 5:00 PM – 6:30 PM IST (1.5 Hrs/Slot)</strong></p>
                    </div>
                  </div>
                  <button class="btn btn-primary btn-sm shrink-0" onclick="window.setTeacherPortalStep('step2_live_class')">
                    Proceed to Step 2: Live Class &rarr;
                  </button>
                </div>

                <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div class="flex items-center gap-4">
                    <div class="text-center font-bold min-w-[85px] p-2 rounded-lg bg-slate-200 text-slate-800">
                      <div class="text-xs">7:00 PM</div>
                      <div class="text-3xs text-slate-600">1.0 Hr / Slot</div>
                    </div>
                    <div>
                      <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-extrabold text-3xs uppercase">Class 8–10 School Board Batch</span>
                      <h4 class="font-bold text-sm text-slate-900 mt-1">Class 10 CBSE Science (Physics) • Light: Reflection &amp; Refraction</h4>
                      <p class="text-xs text-slate-500">Slot: <strong>Tue, Thu, Sat • 7:00 PM – 8:00 PM IST (1.0 Hr/Slot)</strong> • 24 / 30 Students</p>
                    </div>
                  </div>
                  <span class="badge badge-success">Scheduled ✓</span>
                </div>

                <div class="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div class="flex items-center gap-4">
                    <div class="text-center font-bold min-w-[85px] p-2 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200">
                      <div class="text-xs">8:15 PM</div>
                      <div class="text-3xs text-indigo-700">1.5 Hrs / Slot</div>
                    </div>
                    <div>
                      <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-3xs uppercase">Class 11–12 1:Many Smart Batch</span>
                      <h4 class="font-bold text-sm text-slate-900 mt-1">JEE / MHT-CET Physics Cohort • Rotational Dynamics &amp; Moment of Inertia</h4>
                      <p class="text-xs text-slate-500">Slot: <strong>Mon, Wed, Fri • 8:15 PM – 9:45 PM IST (1.5 Hrs/Slot)</strong> • 22 / 30 Students</p>
                    </div>
                  </div>
                  <span class="badge badge-neutral">Scheduled ✓</span>
                </div>
              </div>
            </div>

            <!-- 100% Full-Workload Allocation Summary -->
            <div class="card p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-md border border-indigo-500/30 space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-3xs font-extrabold uppercase">
                    ⚡ 100% Full-Workload Specialist Allocation
                  </span>
                  <h3 class="text-base sm:text-lg font-extrabold text-white mt-1">
                    ${myUtil.oneOnOneHours}h 1-on-1 Mentorship + ${myUtil.batchHours}h 1:Many Smart Batches (${myUtil.declaredHours} hrs/week)
                  </h3>
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                  <button type="button" onclick="window.updateTeacherDeclaredAvailability(${myUtil.declaredHours + 2}, 'Morning (7–9 AM)')" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-2xs cursor-pointer border border-white/20">
                    + Add Weekly Availability (+2h)
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-2xs">
                ${(spec.yearRound1ToManyBatches || []).map(b => `
                  <div class="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-3xs uppercase font-extrabold text-amber-300">${b.quarter}</span>
                      <span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-3xs font-bold">${b.weeklyHrs}h/wk</span>
                    </div>
                    <div class="font-bold text-white text-xs">${b.title}</div>
                    <div class="text-3xs text-indigo-200 mt-1">${b.type} • ${b.schedule}</div>
                  </div>
                `).join('')}
              </div>

              <div class="flex items-center justify-end pt-3 border-t border-white/10">
                <button type="button" onclick="window.setTeacherPortalStep('step2_live_class')" class="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs cursor-pointer border-0">
                  Next Step: 2. Conduct Live Class (Milestone M1 Gate) &rarr;
                </button>
              </div>
            </div>
          </div>
        `;
      })() : ''}

      <!-- ===================================================================== -->
      <!-- STEP 2: CONDUCT LIVE INTERACTIVE CLASS (MILESTONE M1 — 50% GATE)      -->
      <!-- ===================================================================== -->
      ${activeStep === 'step2_live_class' ? `
        <div class="space-y-6">
          <div class="card p-6 sm:p-8 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl shadow-xl border-0">
            <div class="flex flex-col md:flex-row items-start justify-between gap-6">
              <div>
                <div class="flex items-center gap-2 mb-3 flex-wrap">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold uppercase">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> STEP 2 OF 4 • MILESTONE M1 (50% PAYOUT GATE)
                  </span>
                  <span class="text-xs text-blue-200">Slot Duration: 1.5 Hrs (Class 11–12 JEE / MHT-CET)</span>
                </div>

                <h2 class="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
                  Live Classroom: Laws of Motion &amp; Inclined Plane Friction
                </h2>
                <p class="text-blue-200 text-xs sm:text-sm mb-6 max-w-xl">
                  Student: <strong>${studentName} (Class 11 • CBSE • JEE PCM)</strong> • Delivering ≥90% of scheduled slot duration automatically verifies lecture completion for your <strong>50% Milestone M1 Escrow Payout</strong>.
                </p>

                <div class="flex items-center gap-3 flex-wrap">
                  <button class="btn btn-secondary btn-lg font-extrabold shadow-lg" onclick="window.enterLiveClassroom()">
                    ${Icons.video} Launch HD Live Classroom &amp; Whiteboard &rarr;
                  </button>
                  <button class="btn btn-outline text-white border-white/30 hover:bg-white/10 btn-lg" onclick="window.showToast('Lecture slides, FBD templates and live concept polls staged in classroom.', 'success')">
                    ${Icons.tool} Load Whiteboard Slides
                  </button>
                </div>
              </div>

              <div class="bg-black/30 border border-white/15 p-5 rounded-xl text-xs w-full md:w-72 text-blue-100 shrink-0">
                <h4 class="font-bold text-white mb-2">Live Session Readiness</h4>
                <ul class="space-y-2 text-2xs text-blue-200">
                  <li class="flex items-center gap-1.5">${Icons.check} Student Learning DNA Loaded (84%)</li>
                  <li class="flex items-center gap-1.5">${Icons.check} FBD Whiteboard Canvas Calibrated</li>
                  <li class="flex items-center gap-1.5">${Icons.check} 90% Slot Duration Tracker Active</li>
                  <li class="flex items-center gap-1.5">${Icons.check} Post-Lecture Homework Ready for Step 3</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="card p-5 bg-white border rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <button type="button" onclick="window.setTeacherPortalStep('step1_classes')" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border-0">
              &larr; Previous: 1. Assigned Batches &amp; Timetable
            </button>
            <button type="button" onclick="window.setTeacherPortalStep('step3_ai_queue')" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs cursor-pointer border-0">
              Next Step (After Class): 3. Release Homework &amp; Evaluate Tests (M2 Gate) &rarr;
            </button>
          </div>
        </div>
      ` : ''}

      <!-- ===================================================================== -->
      <!-- STEP 3: POST-CLASS HOMEWORK, DOUBTS & TEST EVALUATION (M2 — 25% GATE) -->
      <!-- ===================================================================== -->
      <!-- STEP 3: POST-CLASS HOMEWORK, DOUBTS & TEST EVALUATION (M2 — 25% GATE) -->
      <!-- ===================================================================== -->
      ${activeStep === 'step3_ai_queue' ? (() => {
        const subTab = (AppState.teacherData && AppState.teacherData.activeStep3SubTab) || 'assessment_suite';
        const reviewList = (AppState.reviewQueue || []);
        const doubtsList = ((AppState.teacherData && AppState.teacherData.escalatedDoubts) || []);
        const isAbsenceActive = !!(AppState.teacherAbsence && AppState.teacherAbsence.hasActiveAbsence);
        const bridge = AppState.aiPracticeBridge || null;

        return `
        <div class="card p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6 max-w-full overflow-hidden">
          <!-- Step 3 Header -->
          <div class="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-100">
            <div>
              <span class="text-2xs font-extrabold uppercase tracking-wider text-purple-700 block">Step 3 of 4 • Post-Lecture Academic Gate (Unlocks 25% Milestone M2)</span>
              <h3 class="text-base sm:text-lg font-black text-slate-900">Educator Assessment Suite, Post-Lecture Worksheets &amp; Doubts</h3>
              <span class="text-2xs text-slate-500">Assign chapter tests, evaluate custom full-length papers strictly as per syllabus completed, review AI worksheets, and resolve student doubts.</span>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button class="btn btn-outline btn-sm text-xs font-bold text-amber-900 border-amber-300 bg-amber-50 hover:bg-amber-100" onclick="window.openTeacherAbsenceModal()">
                🚑 Report Leave / Reschedule
              </button>
              <button class="btn btn-primary btn-sm text-xs" onclick="window.generateAiWorksheetOnDemand()">
                ⚡ + Create Post-Lecture Worksheet
              </button>
            </div>
          </div>

          <!-- SUB-TAB NAVIGATION STRIP (Educator Assessment Suite • Worksheets • Doubts) -->
          <div class="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto w-full max-w-full">
            <button type="button" onclick="window.setTeacherStep3SubTab('assessment_suite')"
              class="flex-1 py-2.5 px-3 rounded-xl text-xs font-black cursor-pointer border-0 transition-all text-center whitespace-nowrap ${subTab === 'assessment_suite' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-transparent text-slate-600 hover:text-slate-900'}">
              📝 1. Educator Assessment Suite (Chapter &amp; Full-Length Tests)
            </button>
            <button type="button" onclick="window.setTeacherStep3SubTab('worksheets')"
              class="flex-1 py-2.5 px-3 rounded-xl text-xs font-black cursor-pointer border-0 transition-all text-center whitespace-nowrap ${subTab === 'worksheets' ? 'bg-purple-600 text-white shadow-sm' : 'bg-transparent text-slate-600 hover:text-slate-900'}">
              📑 2. Post-Lecture Worksheets Queue (${reviewList.length})
            </button>
            <button type="button" onclick="window.setTeacherStep3SubTab('doubts')"
              class="flex-1 py-2.5 px-3 rounded-xl text-xs font-black cursor-pointer border-0 transition-all text-center whitespace-nowrap ${subTab === 'doubts' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-transparent text-slate-600 hover:text-slate-900'}">
              📌 3. Student Doubts (${doubtsList.length})
            </button>
          </div>

          <!-- ================================================================= -->
          <!-- SUBTAB 1: EDUCATOR ASSESSMENT SUITE (Light, Clean, High-Contrast)   -->
          <!-- ================================================================= -->
          ${subTab === 'assessment_suite' ? `
            <div class="p-6 rounded-2xl bg-white border-2 border-indigo-200 shadow-sm space-y-6 max-w-full overflow-hidden">
              <!-- Banner Header with Launchers -->
              <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-indigo-100">
                <div>
                  <span class="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 font-extrabold text-3xs uppercase tracking-wider">
                    📝 SIKO Educator Assessment Suite • Outcome-Defined
                  </span>
                  <h3 class="text-base sm:text-lg font-black text-slate-900 mt-1">
                    Assign Chapter Tests &amp; Full-Length Custom Exam Papers
                  </h3>
                  <p class="text-2xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                    Assign 45-min post-lecture chapter tests or generate custom full-length papers strictly calibrated to syllabus portions completed (35%, 50%, 75%, 100%). Tests automatically sync to student dashboards.
                  </p>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <button type="button" onclick="window.openAiQuestionPaperPortal ? window.openAiQuestionPaperPortal('generator') : window.navigateView('concept-testing')"
                    class="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer border-0 shadow-sm flex items-center gap-1.5 transition">
                    <span>⚡</span> Launch AI Question Paper Generator &rarr;
                  </button>
                  <button type="button" onclick="window.openAiQuestionPaperPortal ? window.openAiQuestionPaperPortal('grader') : (window.navigateView('concept-testing'), window.setConceptTestingTab('grader'))"
                    class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer border-0 shadow-sm flex items-center gap-1.5 transition">
                    <span>✍️</span> 60s Paper Grader
                  </button>
                </div>
              </div>

              <!-- AI PRACTICE BRIDGE ENDORSEMENT CARD (If Teacher Reported Medical Leave / Absence) -->
              ${(isAbsenceActive && bridge) ? `
                <div class="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 shadow-xs space-y-3">
                  <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-200">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="badge badge-warning text-3xs uppercase font-black">
                        🚑 Teacher Absence Contingency • Student Never Left Idle
                      </span>
                      <span class="text-xs font-black text-amber-950">
                        AI Practice Bridge Drill: ${bridge.topic || 'Laws of Motion: Inclined Planes & Constraints'}
                      </span>
                    </div>
                    <span class="px-2 py-0.5 rounded text-3xs font-extrabold ${bridge.status === 'released_to_student' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}">
                      ${bridge.status === 'released_to_student' ? '✓ Endorsed & Active on Student Dashboard' : '⏳ Awaiting Teacher Verification & Release'}
                    </span>
                  </div>

                  <p class="text-2xs text-amber-900 leading-relaxed">
                    Because your lecture was rescheduled under the <strong>${(AppState.teacherAbsence && AppState.teacherAbsence.recoveryStrategyLabel) || 'Recovery Strategy'}</strong>, SIKO AI auto-generated <strong>${bridge.questionsCount || 10} adaptive practice questions</strong> covering today's topic so the student is never left idle. Please review and release below.
                  </p>

                  <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div class="text-3xs text-amber-800 font-bold">
                      Coverage: 4 Foundational + 4 JEE Standard + 2 Advanced • Max Marks: 40
                    </div>
                    ${bridge.status === 'released_to_student' ? `
                      <button type="button" class="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 cursor-default" disabled>
                        ✓ Endorsed &amp; Released to Student Dashboard
                      </button>
                    ` : `
                      <button type="button" onclick="window.endorseAndReleaseAiPracticeBridge('${bridge.bridgeId || 'BRIDGE-AI-9021'}')"
                        class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs cursor-pointer border-0 shadow-md">
                        ✓ Verify &amp; Release AI Practice Bridge to Student &rarr;
                      </button>
                    `}
                  </div>
                </div>
              ` : ''}

              <!-- 2-COLUMN TEST ASSIGNMENT GRID (Chapter Test vs Full-Length Custom Test) -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <!-- 1. Chapter Test Assignment Box -->
                <div class="p-5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="font-black text-slate-900 text-sm flex items-center gap-2">
                      <span class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
                      <span>Assign Chapter Test (Post-Lecture)</span>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-extrabold text-3xs border border-blue-200">
                      45 Mins • 30 Marks
                    </span>
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 text-3xs mb-1">Select Completed Chapter:</label>
                    <select id="teacherAssignChapterSelect" class="w-full max-w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs shadow-2xs">
                      <option value="Laws of Motion &amp; Friction" selected>Physics: Laws of Motion &amp; Friction (Class 11)</option>
                      <option value="Kinematics &amp; 2D Projectiles">Physics: Kinematics &amp; 2D Projectiles (Class 11)</option>
                      <option value="Electrostatics &amp; Gauss Law">Physics: Electrostatics &amp; Gauss Law (Class 12)</option>
                      <option value="Chemical Bonding &amp; VSEPR">Chemistry: Chemical Bonding &amp; VSEPR (Class 11)</option>
                      <option value="Calculus: Limits &amp; Derivatives">Mathematics: Limits &amp; Derivatives (Class 11)</option>
                    </select>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label class="block font-bold text-slate-700 text-3xs mb-1">Scheduled Test Time:</label>
                      <select id="teacherAssignChapterSlot" class="w-full max-w-full p-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs shadow-2xs">
                        <option value="Today • 7:00 PM IST" selected>Today • 7:00 PM IST</option>
                        <option value="Tomorrow • 6:00 PM IST">Tomorrow • 6:00 PM IST</option>
                        <option value="Saturday • 5:00 PM IST">Saturday • 5:00 PM IST</option>
                        <option value="Sunday • 10:00 AM IST">Sunday • 10:00 AM IST</option>
                      </select>
                    </div>
                    <div>
                      <label class="block font-bold text-slate-700 text-3xs mb-1">Target Student / Batch:</label>
                      <select id="teacherAssignChapterTarget" class="w-full max-w-full p-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs shadow-2xs">
                        <option value="Enrolled Student 1 (1:1 JEE)">${studentName} (1:1 Mentorship)</option>
                        <option value="Enrolled Student 2 (1:1 CBSE)">Enrolled Student 2 (1:1 CBSE)</option>
                        <option value="Cohort Alpha (1:Many)">Cohort Alpha (25 Students)</option>
                      </select>
                    </div>
                  </div>

                  <button type="button"
                    onclick="window.assignChapterTestToStudent(document.getElementById('teacherAssignChapterSelect').value, document.getElementById('teacherAssignChapterSlot').value, 45)"
                    class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs cursor-pointer border-0 shadow-sm transition">
                    🚀 Assign Chapter Test to Student &rarr;
                  </button>
                </div>

                <!-- 2. Full-Length Custom Test Assignment Box -->
                <div class="p-5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="font-black text-slate-900 text-sm flex items-center gap-2">
                      <span class="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">2</span>
                      <span>Assign Full-Length Custom Test</span>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-3xs border border-amber-200">
                      180 Mins • 300 Marks
                    </span>
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 text-3xs mb-1">Select Syllabus Portion Completed:</label>
                    <select id="teacherAssignFullLengthPortion" class="w-full max-w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs shadow-2xs">
                      <option value="Chapters 1–5: Mechanics &amp; Kinematics (35% Portion Completed)" selected>Chapters 1–5: Mechanics &amp; Kinematics (35% Portion Completed)</option>
                      <option value="Mid-Term Mock: Chapters 1–8 (50% Portion Completed)">Mid-Term Mock: Chapters 1–8 (50% Portion Completed)</option>
                      <option value="Pre-Exam Revision Full-Length Mock (75% Portion Completed)">Pre-Exam Revision Mock (75% Portion Completed)</option>
                      <option value="Full Syllabus Official Exam Hall Simulation (100% Completed)">Full Syllabus Official Simulation (100% Completed)</option>
                    </select>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label class="block font-bold text-slate-700 text-3xs mb-1">Scheduled Test Time:</label>
                      <select id="teacherAssignFullLengthSlot" class="w-full max-w-full p-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs shadow-2xs">
                        <option value="Sunday • 10:00 AM – 1:00 PM IST" selected>Sunday • 10:00 AM – 1:00 PM IST</option>
                        <option value="Saturday • 2:00 PM – 5:00 PM IST">Saturday • 2:00 PM – 5:00 PM IST</option>
                        <option value="Wednesday • 5:00 PM – 8:00 PM IST">Wednesday • 5:00 PM – 8:00 PM IST</option>
                      </select>
                    </div>
                    <div>
                      <label class="block font-bold text-slate-700 text-3xs mb-1">Exam Duration &amp; Marks:</label>
                      <select id="teacherAssignFullLengthDuration" class="w-full max-w-full p-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs shadow-2xs">
                        <option value="180">180 Mins • 300 Marks (JEE Main)</option>
                        <option value="200">200 Mins • 720 Marks (NEET UG)</option>
                        <option value="180_cbse">180 Mins • 80 Marks (CBSE Board)</option>
                        <option value="120">120 Mins • 180 Marks (Sprint)</option>
                      </select>
                    </div>
                  </div>

                  <button type="button"
                    onclick="window.assignFullLengthCustomTest(document.getElementById('teacherAssignFullLengthPortion').value, document.getElementById('teacherAssignFullLengthSlot').value, 180, 300)"
                    class="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs cursor-pointer border-0 shadow-sm transition">
                    🎯 Assign Custom Full-Length Test &rarr;
                  </button>
                </div>
              </div>

              <!-- Active Assigned Tests Ledger (Light, High-Contrast) -->
              <div class="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div class="flex items-center justify-between text-2xs flex-wrap gap-2">
                  <span class="font-black text-slate-900 uppercase tracking-wider">📋 Currently Assigned Tests Sync Ledger</span>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-3xs border border-emerald-200">✓ Live Synced to Student Dashboards</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-2xs">
                  <div class="p-3.5 rounded-xl bg-white border border-indigo-200 shadow-2xs">
                    <div class="flex justify-between items-center font-bold text-indigo-900 mb-1">
                      <span>Chapter Test: ${(AppState.assignedChapterTest && AppState.assignedChapterTest.chapter) || 'Laws of Motion & Friction'}</span>
                      <span class="text-3xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">45 Mins • 30M</span>
                    </div>
                    <div class="text-slate-600 mt-0.5">Assigned to: <strong>${studentName} (1:1)</strong> • Scheduled: <strong>${(AppState.assignedChapterTest && AppState.assignedChapterTest.scheduledTime) || 'Today • 7:00 PM IST'}</strong></div>
                    <div class="text-3xs text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
                      <span>✓</span> Status: Ready for Student Launch on Scheduled Time
                    </div>
                  </div>

                  <div class="p-3.5 rounded-xl bg-white border border-sky-200 shadow-2xs">
                    <div class="flex justify-between items-center font-bold text-sky-900 mb-1">
                      <span>Full-Length: ${(AppState.assignedFullLengthTest && AppState.assignedFullLengthTest.title) || 'Mechanics & Kinematics (35% Syllabus Covered)'}</span>
                      <span class="text-3xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">180 Mins • 300M</span>
                    </div>
                    <div class="text-slate-600 mt-0.5">Assigned to: <strong>${studentName} + Cohort Alpha</strong> • Scheduled: <strong>${(AppState.assignedFullLengthTest && AppState.assignedFullLengthTest.scheduledTime) || 'Sunday • 10:00 AM IST'}</strong></div>
                    <div class="text-3xs text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
                      <span>✓</span> Status: Scheduled &amp; Awaiting Student Launch
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- ================================================================= -->
          <!-- SUBTAB 2: POST-LECTURE WORKSHEETS QUEUE                           -->
          <!-- ================================================================= -->
          ${subTab === 'worksheets' ? `
            <div class="space-y-4">
              <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
                <div class="font-extrabold text-slate-800 uppercase text-xs tracking-wider flex items-center gap-2">
                  <span>📝 Post-Lecture Worksheet &amp; Homework Review Gate</span>
                  <span class="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-3xs border border-purple-200">Teacher Review Required Before Release</span>
                </div>
                <span class="text-3xs text-slate-500 font-medium">Student receives worksheet ONLY after your explicit endorsement &amp; release.</span>
              </div>

              ${(reviewList.length > 0) ? reviewList.map(item => {
                const qs = Array.isArray(item.questions) ? item.questions : [];
                const editing = AppState.editingReviewQuestion;

                if (item.type === 'homework_evaluation') {
                  return `
                    <div class="p-5 rounded-2xl border-2 border-purple-300 bg-purple-50/70 shadow-sm space-y-4">
                      <!-- Header -->
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-200">
                        <div>
                          <div class="flex items-center gap-2 flex-wrap mb-1">
                            <span class="badge badge-warning text-3xs uppercase font-black">
                              Student Submission AI-Graded • Verification Required
                            </span>
                            <span class="badge badge-success text-3xs font-bold">
                              Unlocks M2 Escrow: ₹${item.payout_linked_amount || 4500}
                            </span>
                            <span class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-bold text-3xs">
                              Student: ${item.studentName || studentName || 'Enrolled Student'} (Class 11 CBSE / JEE)
                            </span>
                          </div>
                          <h4 class="font-black text-slate-900 text-base">
                            ${item.title || `Student Homework: ${item.subject || 'Physics'} — ${item.chapter || 'Laws of Motion'}`}
                          </h4>
                          <div class="text-3xs text-purple-900 mt-0.5 font-bold">
                            AI Preliminary Score: <span class="text-indigo-700 text-xs font-black">${item.aiScore || '23 / 26'} (${item.aiPercentage || 88}%)</span> • Submitted: ${item.submittedAt || 'Today'}
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <button type="button" onclick="window.navigateView('homework')"
                            class="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs cursor-pointer border-0 shadow-xs">
                            🔍 Inspect Full Submissions &rarr;
                          </button>
                        </div>
                      </div>

                      <!-- Question Breakdown with Student's Answers & AI Marks -->
                      <div class="space-y-2.5">
                        <div class="text-2xs font-extrabold text-slate-700 uppercase tracking-wide">
                          Student Answers &amp; AI Stepwise Marksheets (${qs.length} Questions):
                        </div>
                        ${qs.slice(0, 3).map((q, qIdx) => {
                          const isObj = q.section === 'A' || (Array.isArray(q.options) && q.options.length > 0);
                          return `
                            <div class="p-3 rounded-xl bg-white border border-purple-200 text-xs space-y-1">
                              <div class="flex items-center justify-between">
                                <span class="font-bold text-slate-900">Q${qIdx + 1}: ${q.concept || 'Mechanics'}</span>
                                <span class="badge badge-success text-3xs">AI Graded: ${isObj ? '4/4' : '4/5'} M</span>
                              </div>
                              <p class="text-2xs text-slate-700 line-clamp-2">${q.question || q.text}</p>
                              <div class="text-3xs text-slate-500 font-medium">
                                <strong>Student:</strong> ${isObj ? 'Selected Option A ✓' : (q.subjectiveText || 'Derived from FBD with handwritten proof')}
                              </div>
                            </div>
                          `;
                        }).join('')}
                        ${qs.length > 3 ? `<div class="text-3xs text-center text-purple-800 font-bold">+ ${qs.length - 3} more questions evaluated</div>` : ''}
                      </div>

                      <!-- Teacher Mentor Remarks & Endorse Button -->
                      <div class="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div>
                          <div class="font-black text-emerald-950 text-xs flex items-center gap-1.5">
                            <span>🛡️ Faculty Endorsement Gate: Release Verified Scorecard</span>
                          </div>
                          <div class="text-3xs text-emerald-800 mt-0.5">
                            Clicking below finalizes marks, adds mentor feedback, delivers report to ${studentName || 'student'} and disburses Milestone M2 (₹4,500).
                          </div>
                        </div>
                        <button type="button" onclick="window.approveAndReleaseHomeworkEvaluation()"
                          class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer border-0 shadow-md flex items-center gap-1.5 shrink-0">
                          <span>✓ Endorse AI Evaluation &amp; Release to Student &rarr;</span>
                        </button>
                      </div>
                    </div>
                  `;
                }

                return `
                  <div class="p-5 rounded-2xl border-2 border-indigo-200 bg-slate-50/90 shadow-sm space-y-4">
                    <!-- Worksheet Meta Header -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <div>
                        <div class="flex items-center gap-2 flex-wrap mb-1">
                          <span class="badge ${item.type === 'worksheet' ? 'badge-primary' : 'badge-warning'} text-3xs uppercase font-black">
                            ${item.type} • Status: ${item.status || 'teacher_review'}
                          </span>
                          <span class="badge badge-success text-3xs font-bold">
                            Unlocks M2 Escrow: ₹${item.payout_linked_amount || 4500}
                          </span>
                          <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-3xs">
                            Assigned Student: ${studentName || 'Enrolled Student'} (Class 11 CBSE / JEE)
                          </span>
                        </div>
                        <h4 class="font-black text-slate-900 text-base">${item.title || item.chapter}</h4>
                        <div class="text-3xs text-slate-600 mt-0.5">
                          ${qs.length} AI-Generated Questions • Rigor: 30% Foundational, 50% Standard JEE, 20% Advanced
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <button type="button" onclick="window.addCustomReviewQuestion('${item.id}')"
                          class="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-2xs cursor-pointer flex items-center gap-1 shadow-xs">
                          <span>➕ Add Custom Question</span>
                        </button>
                      </div>
                    </div>

                    <!-- FULL DETAILED QUESTION LIST -->
                    <div class="space-y-3">
                      <div class="text-2xs font-bold text-slate-700 uppercase tracking-wide">
                        Inspect All Questions (Edit, Swap, or Reorder Before Releasing to Student):
                      </div>

                      ${qs.length === 0 ? `
                        <div class="p-4 rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">
                          No questions in this worksheet. Click "+ Add Custom Question" above.
                        </div>
                      ` : qs.map((q, qIdx) => {
                        const isEditingThis = editing && editing.itemId === item.id && Number(editing.qIndex) === Number(qIdx);
                        const diffBadge = q.difficulty === 'hard' ? 'bg-rose-100 text-rose-800 border-rose-200' : q.difficulty === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200';
                        return `
                          <div class="p-4 rounded-xl border ${isEditingThis ? 'border-2 border-indigo-500 bg-indigo-50/40' : 'border-slate-200 bg-white'} shadow-xs space-y-2">
                            <div class="flex items-start justify-between gap-2 flex-wrap">
                              <div class="flex items-center gap-2 flex-wrap">
                                <span class="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-2xs flex items-center justify-center">Q${qIdx + 1}</span>
                                <span class="px-2 py-0.5 rounded text-3xs font-extrabold border ${diffBadge} uppercase">${q.difficulty || 'medium'}</span>
                                <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-3xs font-bold">${q.marks || 4} Marks</span>
                                <span class="text-3xs text-blue-700 font-bold">${q.concept || 'Laws of Motion'}</span>
                              </div>
                              <div class="flex items-center gap-1.5">
                                ${!isEditingThis ? `
                                  <button type="button" onclick="window.startEditReviewQuestion('${item.id}', ${qIdx})"
                                    class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-3xs cursor-pointer">
                                    ✏️ Edit
                                  </button>
                                  <button type="button" onclick="window.swapReviewItemQuestion('${item.id}', ${qIdx})"
                                    class="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-3xs cursor-pointer"
                                    title="Swap with an AI-generated alternate question">
                                    🔄 AI Swap
                                  </button>
                                  <button type="button" onclick="window.deleteReviewItemQuestion('${item.id}', ${qIdx})"
                                    class="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-3xs cursor-pointer"
                                    title="Delete question">
                                    🗑️
                                  </button>
                                ` : `
                                  <button type="button" onclick="window.saveEditReviewQuestion('${item.id}', ${qIdx})"
                                    class="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-3xs cursor-pointer">
                                    ✓ Save Changes
                                  </button>
                                  <button type="button" onclick="window.cancelEditReviewQuestion()"
                                    class="px-2 py-1 rounded bg-slate-200 text-slate-700 font-bold text-3xs cursor-pointer">
                                    Cancel
                                  </button>
                                `}
                              </div>
                            </div>

                            <!-- QUESTION BODY -->
                            ${!isEditingThis ? `
                              <div class="text-xs text-slate-900 font-semibold leading-relaxed">
                                ${q.text || q.question || 'Calculate the normal force on the block.'}
                              </div>

                              <!-- OPTIONS LIST -->
                              ${Array.isArray(q.options) && q.options.length > 0 ? `
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-2xs">
                                  ${q.options.map((opt, oIdx) => {
                                    const isCorrect = q.answer === oIdx || q.correct === oIdx;
                                    return `
                                      <div class="p-2 rounded-lg border font-medium flex items-center justify-between ${
                                        isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                                      }">
                                        <span>${opt}</span>
                                        ${isCorrect ? '<span class="text-3xs text-emerald-700 font-black">✓ Correct Key</span>' : ''}
                                      </div>
                                    `;
                                  }).join('')}
                                </div>
                              ` : ''}

                              ${q.explanation || q.rubric ? `
                                <div class="p-2 rounded-lg bg-amber-50/70 border border-amber-200 text-3xs text-amber-900 leading-normal">
                                  <strong>AI Explanation / Solution:</strong> ${q.explanation || q.rubric}
                                </div>
                              ` : ''}
                            ` : `
                              <!-- INLINE EDITING FORM -->
                              <div class="space-y-2 pt-1 text-xs">
                                <div>
                                  <label class="block font-bold text-slate-700 text-3xs mb-1">Edit Question Statement:</label>
                                  <textarea id="edit-q-text-${item.id}-${qIdx}" rows="3"
                                    class="w-full p-2.5 rounded-lg border border-indigo-400 font-medium text-slate-900 bg-white text-xs">${q.text || q.question || ''}</textarea>
                                </div>
                                ${Array.isArray(q.options) && q.options.length > 0 ? `
                                  <div>
                                    <label class="block font-bold text-slate-700 text-3xs mb-1">Correct Option Answer Key:</label>
                                    <select id="edit-q-ans-${item.id}-${qIdx}" class="p-1.5 rounded border border-slate-300 font-bold text-xs bg-white">
                                      ${q.options.map((opt, oIdx) => `
                                        <option value="${oIdx}" ${(q.answer === oIdx || q.correct === oIdx) ? 'selected' : ''}>
                                          Option ${String.fromCharCode(65 + oIdx)}: ${opt.substring(0, 30)}...
                                        </option>
                                      `).join('')}
                                    </select>
                                  </div>
                                ` : ''}
                              </div>
                            `}
                          </div>
                        `;
                      }).join('')}
                    </div>

                    <!-- TEACHER APPROVAL & RELEASE GATE (POST-REVIEW) -->
                    <div class="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <div class="font-black text-emerald-950 text-xs flex items-center gap-1.5">
                          <span>🛡️ Verified by Educator: All ${qs.length} Questions Reviewed</span>
                        </div>
                        <div class="text-3xs text-emerald-800 mt-0.5">
                          Clicking approve will formally release this homework to ${studentName || 'student'}'s dashboard and trigger Milestone M2 payout.
                        </div>
                      </div>
                      <button type="button" onclick="window.approveReviewItem('${item.type}', '${item.id}')"
                        class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs cursor-pointer border-0 shadow-md flex items-center gap-1.5 shrink-0">
                        <span>✓ Endorse &amp; Release Worksheet to Student &rarr;</span>
                      </button>
                    </div>
                  </div>
                `;
              }).join('') : `
                <div class="p-6 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500 text-xs bg-slate-50">
                  <div class="text-2xl mb-1">🎉</div>
                  <strong class="text-slate-800 text-sm block">All Post-Lecture Worksheets Endorsed &amp; Released!</strong>
                  <p class="text-2xs text-slate-500 mt-1 max-w-md mx-auto">
                    No worksheets currently pending review. Homework has been dispatched to student dashboards.
                  </p>
                </div>
              `}
            </div>
          ` : ''}

          <!-- ================================================================= -->
          <!-- SUBTAB 3: ESCALATED STUDENT DOUBTS                                -->
          <!-- ================================================================= -->
          ${subTab === 'doubts' ? `
            <div class="p-5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-4">
              <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-xs text-amber-950">📌 Escalated Student Doubts (${doubtsList.length})</span>
                <span class="badge badge-warning text-3xs font-black">Priority 1:1</span>
              </div>
              ${(doubtsList.length > 0) ? doubtsList.map(d => `
                <div class="p-3.5 rounded-xl bg-white border border-amber-200 text-2xs space-y-2 shadow-2xs">
                  <div class="flex justify-between font-bold text-slate-900">
                    <span>${d.studentName || studentName || 'Enrolled Student'}</span>
                    <span class="text-amber-700 text-3xs font-normal">${d.escalatedAt || 'Today'}</span>
                  </div>
                  <p class="text-slate-700 italic">"${d.question}"</p>
                  <div class="flex gap-2 pt-1">
                    <button class="btn btn-outline btn-xs flex-1 text-3xs text-blue-700 border-blue-300" onclick="window.pinDoubtToAgenda('${d.id}')">
                      📌 Pin to Live Class
                    </button>
                    <button class="btn btn-primary btn-xs flex-1 text-3xs" onclick="window.resolveEscalatedDoubt('${d.id}')">
                      ✓ Mark Solved
                    </button>
                  </div>
                </div>
              `).join('') : `
                <p class="text-2xs text-amber-800/80">All incoming student doubts resolved.</p>
              `}
            </div>
          ` : ''}

          <!-- Bottom Navigation Buttons -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-100">
            <button type="button" onclick="window.setTeacherPortalStep('step2_live_class')" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border-0">
              &larr; Previous: 2. Conduct Live Class
            </button>
            <button type="button" onclick="window.setTeacherPortalStep('step4_earnings')" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs cursor-pointer border-0">
              Next Step: 4. Faculty PTM Feedback &amp; Escrow Wallet (M3 Gate) &rarr;
            </button>
          </div>
        </div>
        `;
      })() : ''}

      <!-- ===================================================================== -->
      <!-- STEP 4: MONTHLY REMUNERATION, HOURS TAKEN & MILESTONE WALLET (M3)      -->
      <!-- ===================================================================== -->
      ${activeStep === 'step4_earnings' ? (() => {
        const finalizedRate = ob.sikoFinalizedRate || 1750;
        const declaredHours = 30;
        const allocatedHours = 30; // 100% utilized
        const hasAllottedStudents = true; // Set to true for certified educator

        // Multi-Student & Multi-Cohort Monthly Breakdown
        const billingCycle = window._teacherBillingMonth || 'october_2026';

        const monthlyData = {
          october_2026: {
            monthLabel: 'October 2026 (Active Billing Cycle)',
            isCurrent: true,
            payoutDate: '01 Nov 2026',
            status: 'Accruing Daily • Verified Logs ✓',
            items: [
              { name: `${studentName} (1-on-1 Mentorship)`, track: 'Class 11 JEE Physics', slots: 'Mon, Wed, Fri • 5:00–6:30 PM (4.5h/w)', hoursDelivered: 18.0, hourlyPayout: 18.0 * finalizedRate, milestoneReleased: 'Milestone M1 (50% Lecture Delivery Released)', milestoneAmt: 17500 },
              { name: '1:1 Mentorship Student #2', track: 'Class 12 CBSE Board Physics', slots: 'Tue, Thu, Sat • 5:00–6:30 PM (4.5h/w)', hoursDelivered: 18.0, hourlyPayout: 18.0 * finalizedRate, milestoneReleased: 'Milestone M2 (25% Post-Class Review Released)', milestoneAmt: 8750 },
              { name: '1:1 Mentorship Student #3', track: 'Class 11 MHT-CET Physics', slots: 'Mon, Wed, Fri • 6:30–8:00 PM (4.5h/w)', hoursDelivered: 18.0, hourlyPayout: 18.0 * finalizedRate, milestoneReleased: 'In Progress (M1 Pending)', milestoneAmt: 0 },
              { name: '1:1 Mentorship Student #4', track: 'Class 10 Foundation & IOQM Physics', slots: 'Tue, Thu, Sat • 6:30–8:00 PM (4.5h/w)', hoursDelivered: 18.0, hourlyPayout: 18.0 * finalizedRate, milestoneReleased: 'In Progress (M1 Pending)', milestoneAmt: 0 },
              { name: 'Cohort Alpha (1:Many Subject Batch)', track: 'Mechanics Foundation (25 Students)', slots: 'Sat & Sun • 10:00 AM–1:00 PM (6.0h/w)', hoursDelivered: 24.0, hourlyPayout: 24.0 * finalizedRate, milestoneReleased: 'Milestone M1 (50% Lecture Delivery Released)', milestoneAmt: 21000 },
              { name: 'Cohort Beta (1:Many Problem Sprint)', track: 'Rotational Dynamics (20 Students)', slots: 'Sat & Sun • 2:00 PM–5:00 PM (6.0h/w)', hoursDelivered: 16.0, hourlyPayout: 16.0 * finalizedRate, milestoneReleased: 'In Progress', milestoneAmt: 0 }
            ]
          },
          september_2026: {
            monthLabel: 'September 2026 (Settled & Disbursed)',
            isCurrent: false,
            payoutDate: '01 Oct 2026',
            status: 'Settled & Transferred via IMPS (UTR: HDFC90218841) ✓',
            items: [
              { name: `${studentName} (1-on-1 Mentorship)`, track: 'Class 11 JEE Physics', slots: 'Mon, Wed, Fri (4.5h/w)', hoursDelivered: 18.0, hourlyPayout: 18.0 * finalizedRate, milestoneReleased: 'Milestone M1 (50%)', milestoneAmt: 17500 },
              { name: '1:1 Mentorship Student #2', track: 'Class 12 CBSE Physics', slots: 'Tue, Thu, Sat (4.5h/w)', hoursDelivered: 18.0, hourlyPayout: 18.0 * finalizedRate, milestoneReleased: 'Milestone M1 (50%)', milestoneAmt: 17500 },
              { name: 'Cohort Alpha (1:Many Subject Batch)', track: 'Kinematics Foundation', slots: 'Sat & Sun (6.0h/w)', hoursDelivered: 24.0, hourlyPayout: 24.0 * finalizedRate, milestoneReleased: 'Milestone M1 (50%)', milestoneAmt: 21000 }
            ]
          }
        };

        const activeCycle = monthlyData[billingCycle] || monthlyData.october_2026;
        const totalDeliveredHours = activeCycle.items.reduce((acc, it) => acc + it.hoursDelivered, 0);
        const totalHourlyPayout = activeCycle.items.reduce((acc, it) => acc + it.hourlyPayout, 0);
        const totalMilestonesReleased = activeCycle.items.reduce((acc, it) => acc + it.milestoneAmt, 0);
        const totalGrossPayout = totalHourlyPayout + totalMilestonesReleased;

        // Faculty Absence & Contingency Hours Adjustment
        const hasAbsence = !!(AppState.teacherAbsence && AppState.teacherAbsence.hasActiveAbsence);
        const abs = AppState.teacherAbsence || {};
        const isUncompensated = hasAbsence && abs.recoveryStrategy === 'strategy_d';
        const absenceHoursDeducted = (isUncompensated && billingCycle === 'october_2026') ? 1.5 : 0;
        const adjustedDeliveredHours = Math.max(0, totalDeliveredHours - absenceHoursDeducted);
        const absenceDeductionAmt = (isUncompensated && billingCycle === 'october_2026') ? Math.round(1.5 * finalizedRate) : 0;
        const finalGrossPayout = Math.max(0, totalGrossPayout - absenceDeductionAmt);
        const tdsDeduction = Math.round(finalGrossPayout * 0.10); // 10% statutory TDS u/s 194J
        const netBankTakeHome = finalGrossPayout - tdsDeduction;

        if (!hasAllottedStudents) {
          return `
            <div class="card p-8 bg-slate-900 border-2 border-amber-500/50 rounded-2xl text-white text-center space-y-4">
              <div class="text-4xl">🔒</div>
              <h3 class="text-xl font-black text-amber-300">Awaiting Student &amp; Batch Allocation</h3>
              <p class="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                Remuneration and monthly payout calculations unlock strictly once enrolled students &amp; batches are matched and your weekly time capacity (30 hrs/week) is scheduled by AI.
              </p>
              <div class="p-3 rounded-xl bg-white/5 border border-white/10 max-w-md mx-auto text-2xs text-slate-400">
                Available Wallet Balance: ₹0 • Escrow: ₹0 • Payout: ₹0
              </div>
            </div>
          `;
        }

        return `
        <div class="space-y-6">
          <!-- Month Selector & Payout Cycle Bar -->
          <div class="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div>
              <span class="text-3xs font-extrabold uppercase tracking-wider text-slate-400 block">Faculty Monthly Remuneration Ledger</span>
              <h3 class="text-base font-black text-slate-900 mt-0.5">Payment Calculated by Hours Taken &amp; Completed Milestones</h3>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" onclick="window._teacherBillingMonth='october_2026'; window.renderApp();"
                class="px-3.5 py-1.5 rounded-xl text-xs font-black cursor-pointer border transition ${billingCycle === 'october_2026' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}">
                🗓️ October 2026 (Active)
              </button>
              <button type="button" onclick="window._teacherBillingMonth='september_2026'; window.renderApp();"
                class="px-3.5 py-1.5 rounded-xl text-xs font-black cursor-pointer border transition ${billingCycle === 'september_2026' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}">
                ✓ September 2026 (Settled)
              </button>
            </div>
          </div>

          <!-- CONTINGENCY & MEDICAL LEAVE REMUNERATION AUDIT BANNER -->
          ${hasAbsence ? `
            <div class="p-4 rounded-2xl ${isUncompensated ? 'bg-rose-50 border-2 border-rose-300 text-rose-950' : 'bg-emerald-50 border-2 border-emerald-300 text-emerald-950'} shadow-xs space-y-1.5">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <span class="font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span>${isUncompensated ? '⚠️' : '✓'}</span>
                  <span>Medical Leave &amp; Hours Pacing Audit: ${abs.recoveryStrategyLabel || 'Recovery Strategy'}</span>
                </span>
                <span class="px-2.5 py-0.5 rounded-full font-extrabold text-3xs ${isUncompensated ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'}">
                  ${isUncompensated ? `Deduction Applied: -₹${absenceDeductionAmt.toLocaleString('en-IN')}` : 'Full Remuneration Protected (₹0 Deduction)'}
                </span>
              </div>
              <p class="text-2xs leading-relaxed">
                ${isUncompensated
                  ? `Lecture on <strong>${abs.affectedClass || 'Laws of Motion'}</strong> was cancelled under <strong>Uncompensated Cancellation</strong> (-1.5 hrs). Monthly delivered hours adjusted from ${totalDeliveredHours.toFixed(1)}h to <strong>${adjustedDeliveredHours.toFixed(1)}h</strong>. A pro-rata reduction of ₹${absenceDeductionAmt.toLocaleString('en-IN')} has been applied to this month's gross earnings as per SIKO Faculty Policy.`
                  : `Your leave on <strong>${abs.affectedClass || 'Laws of Motion'}</strong> was rescheduled under <strong>${abs.recoveryStrategyLabel}</strong> to <strong>${abs.rescheduledSlot}</strong>. Because all declared monthly syllabus hours (30.0h) are being delivered via the make-up sprint, <strong>100% of your agreed monthly honorarium is preserved</strong> without penalty.`
                }
              </p>
            </div>
          ` : ''}

          <!-- Monthly High-Level Summary Card -->
          <div class="card p-6 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl shadow-md border border-emerald-500/40 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/15">
              <div>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-3xs font-extrabold uppercase">
                  💳 Verified Faculty Monthly Payout • ${activeCycle.monthLabel}
                </span>
                <h3 class="text-lg sm:text-xl font-black text-white mt-1">
                  Net Bank Take-Home: ₹${netBankTakeHome.toLocaleString('en-IN')} (Paid on ${activeCycle.payoutDate})
                </h3>
                <p class="text-2xs text-emerald-200">
                  Agreed Rate: <strong>₹${finalizedRate.toLocaleString('en-IN')}/hr</strong> • 100% Paid Directly to Educator • Less 10% Statutory TDS (Sec 194J)
                </p>
              </div>

              <div class="flex items-center gap-2">
                <button type="button" onclick="window.showToast('📄 Monthly Pay Slip PDF exported successfully!', 'success')"
                  class="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs cursor-pointer border-0 shadow-sm flex items-center gap-1.5">
                  <span>📥</span> Download Pay Slip (PDF)
                </button>
              </div>
            </div>

            <!-- Key Metric Boxes -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
              <div class="p-3 rounded-xl bg-white/10 border border-white/15">
                <div class="text-3xs font-bold text-slate-300 uppercase">Delivered Hours</div>
                <div class="text-xl font-black text-white mt-0.5">${adjustedDeliveredHours.toFixed(1)} Hrs</div>
                <div class="text-3xs text-slate-300 mt-0.5">${isUncompensated ? '(1.5h Uncompensated Leave)' : 'Across 1:1 &amp; Batches'}</div>
              </div>
              <div class="p-3 rounded-xl bg-white/10 border border-white/15">
                <div class="text-3xs font-bold text-emerald-300 uppercase">Hourly Remuneration</div>
                <div class="text-xl font-black text-emerald-200 mt-0.5">₹${(Math.round(adjustedDeliveredHours * finalizedRate)).toLocaleString('en-IN')}</div>
                <div class="text-3xs text-emerald-200/80 mt-0.5">@ ₹${finalizedRate}/hr rate</div>
              </div>
              <div class="p-3 rounded-xl bg-white/10 border border-white/15">
                <div class="text-3xs font-bold text-amber-300 uppercase">Milestones Released</div>
                <div class="text-xl font-black text-amber-200 mt-0.5">+₹${totalMilestonesReleased.toLocaleString('en-IN')}</div>
                <div class="text-3xs text-amber-200/80 mt-0.5">M1/M2/M3 Completed</div>
              </div>
              <div class="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40">
                <div class="text-3xs font-extrabold text-emerald-300 uppercase">Net Disbursed to Bank</div>
                <div class="text-xl font-black text-emerald-300 mt-0.5">₹${netBankTakeHome.toLocaleString('en-IN')}</div>
                <div class="text-3xs text-emerald-200 mt-0.5">After 10% TDS (₹${tdsDeduction.toLocaleString('en-IN')})</div>
              </div>
            </div>
          </div>

          <!-- Itemized Breakdown Across All Assigned 1:1 Students & Batches -->
          <div class="card p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span class="text-2xs font-extrabold uppercase text-blue-700 block">Itemized Student &amp; Batch Remuneration Table</span>
                <h4 class="text-base font-black text-slate-900 mt-0.5">Breakdown by Hours Taken &amp; Milestone Milestones in ${activeCycle.monthLabel}</h4>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 font-extrabold text-2xs">
                Capacity: 30/30 Hrs/Week Utilized (100%)
              </span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 text-3xs font-black uppercase tracking-wider text-slate-500 bg-slate-50">
                    <th class="py-2.5 px-3">Student / Cohort Name</th>
                    <th class="py-2.5 px-3">Academic Program &amp; Slots</th>
                    <th class="py-2.5 px-3 text-center">Hours Delivered</th>
                    <th class="py-2.5 px-3 text-right">Agreed Rate</th>
                    <th class="py-2.5 px-3 text-right">Hours Remuneration</th>
                    <th class="py-2.5 px-3">Milestone Completed</th>
                    <th class="py-2.5 px-3 text-right">Total Earnings</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  ${activeCycle.items.map(it => {
                    const gross = it.hourlyPayout + it.milestoneAmt;
                    return `
                      <tr class="hover:bg-slate-50">
                        <td class="py-3 px-3 font-bold text-slate-900">${it.name}</td>
                        <td class="py-3 px-3">
                          <div class="font-semibold text-indigo-700">${it.track}</div>
                          <div class="text-3xs text-slate-400">${it.slots}</div>
                        </td>
                        <td class="py-3 px-3 text-center font-mono font-bold text-slate-800">${it.hoursDelivered.toFixed(1)} hrs</td>
                        <td class="py-3 px-3 text-right font-mono text-slate-600">₹${finalizedRate}/hr</td>
                        <td class="py-3 px-3 text-right font-mono font-bold text-slate-900">₹${it.hourlyPayout.toLocaleString('en-IN')}</td>
                        <td class="py-3 px-3">
                          <span class="px-2 py-0.5 rounded text-3xs font-extrabold ${it.milestoneAmt > 0 ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-600'}">
                            ${it.milestoneReleased} ${it.milestoneAmt > 0 ? `(+₹${it.milestoneAmt.toLocaleString('en-IN')})` : ''}
                          </span>
                        </td>
                        <td class="py-3 px-3 text-right font-mono font-black text-emerald-700 text-sm">₹${gross.toLocaleString('en-IN')}</td>
                      </tr>
                    `;
                  }).join('')}
                  <tr class="border-t-2 border-slate-900 bg-slate-50 font-black text-slate-900">
                    <td colspan="2" class="py-3 px-3 text-sm">Total Monthly Gross Remuneration</td>
                    <td class="py-3 px-3 text-center font-mono text-sm">${totalDeliveredHours.toFixed(1)} hrs</td>
                    <td colspan="3" class="py-3 px-3 text-right text-xs text-slate-500">Less 10% Statutory TDS (Sec 194J): -₹${tdsDeduction.toLocaleString('en-IN')}</td>
                    <td class="py-3 px-3 text-right font-mono text-base text-emerald-800">₹${netBankTakeHome.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Pacing & Extra Turns / Extra Days Assurance -->
          <div class="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div class="space-y-0.5">
              <strong class="text-blue-950 font-black flex items-center gap-1.5">
                <span>⚡</span> AI Pacing &amp; Extra Turns Optimization: Syllabus Guaranteed 30 Days Before Exam
              </strong>
              <p class="text-2xs text-blue-800">
                Your 30 hours/week are 100% scheduled. To complete student portion 30 days before exam, AI has scheduled <strong>2 Extra Revision Booster Turns</strong> on Sunday mornings. Extra days requested from faculty: <strong>0 (On-Track)</strong>.
              </p>
            </div>
            <button type="button" onclick="window.navigateView('teacher-wallet')" class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-2xs cursor-pointer border-0 shrink-0">
              Open Full Wallet &rarr;
            </button>
          </div>

          <!-- Faculty PTM Report Card (Unlocks M3 — 25% Payout) -->
          <div class="card p-5 bg-purple-50/70 border-2 border-purple-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span class="px-2.5 py-0.5 rounded-full bg-purple-700 text-white font-black text-3xs uppercase">
                👨‍👩‍👧 Parent-Teacher Meeting (PTM) Evaluation Gate (Milestone M3)
              </span>
              <h3 class="text-base font-black text-slate-900 mt-1">
                Submit &amp; Review Personalised Faculty Feedback for Parents
              </h3>
              <p class="text-xs text-slate-600 mt-0.5">
                Share your faculty-observed strengths, focus areas, and action plan with the parent to complete Milestone M3.
              </p>
            </div>
            <button type="button" class="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs cursor-pointer border-0 shrink-0" onclick="window.navigateView('ptm-view')">
              📋 Open Faculty PTM Report Dossier &rarr;
            </button>
          </div>

          <div class="flex items-center justify-between pt-2">
            <button type="button" onclick="window.setTeacherPortalStep('step3_ai_queue')" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border-0">
              &larr; Previous: 3. Post-Class Homework &amp; Tests
            </button>
            <button type="button" onclick="window.setTeacherPortalStep('step1_classes')" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs cursor-pointer border-0">
              Back to Step 1: Assigned Batches &amp; Timetable &rarr;
            </button>
          </div>
        </div>
        `;
      })() : ''}
    </div>
  `;
}
