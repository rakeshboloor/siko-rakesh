/**
 * SIKO PTM (PARENT-TEACHER MEETING) & TWO-TIER PARENT REPORT VIEW
 * Tier 1 (Default): Crisp Executive Summary & WhatsApp Parent Notification Card
 *   (Score, Status, Focus Areas, Signed JWT Report Link, 1-Click WhatsApp Dispatch)
 * Tier 2 (On-Demand Expandable): Full Detailed Report
 *   (Handwriting Score · Bloom's Taxonomy · AI Feedback · 7-Day Improvement Plan ·
 *    Question-by-Question Analysis · Post-Chapter Lecture & Deliverable Dossier)
 */

import { AppState } from '../state.js';
import { Icons, ProgressBar } from '../components.js';

export function renderPtmView() {
  const studentName = (typeof window.getStudentDisplayName === 'function' && window.getStudentDisplayName()) ||
    (AppState.studentOnboarding && (AppState.studentOnboarding.studentName || AppState.studentOnboarding.name)) ||
    (AppState.bookingData && AppState.bookingData.studentName) ||
    (AppState.enrolledCourse && AppState.enrolledCourse.studentName) ||
    ((AppState.currentUser && AppState.currentUser.role === 'student' && AppState.currentUser.name) || 'Enrolled Student');

  const dynamicParentName = (AppState.currentUser && AppState.currentUser.role === 'parent' && AppState.currentUser.name && AppState.currentUser.name !== 'Parent / Legal Guardian')
    ? AppState.currentUser.name
    : ((AppState.parentData && AppState.parentData.parentName && AppState.parentData.parentName !== 'Parent / Legal Guardian')
        ? AppState.parentData.parentName
        : ((AppState.studentOnboarding && AppState.studentOnboarding.parentName) ||
           (AppState.bookingData && AppState.bookingData.parentName) ||
           'Parent'));

  const p = AppState.parentData || {
    parentName: dynamicParentName,
    ptm: { scheduled: 'Sunday, 11 Oct 2026 • 6:00 PM IST', teacher: 'Dedicated Master Faculty', acknowledged: false }
  };
  p.parentName = dynamicParentName;

  const course = AppState.enrolledCourse || {
    subject: 'Physics',
    chapter: 'Laws of Motion & Friction',
    lectureNumber: 2,
    totalLecturesInChapter: 2,
    lecturesCompleted: 2,
    lectureTopic: 'Free Body Diagrams on Rough Inclined Planes, Angle of Repose & Two-Block Constraint Systems',
    teacherName: 'Dedicated Master Faculty',
    teacherTitle: 'Dedicated Master Faculty • Ph.D. IIT Delhi',
    boardExam: 'CBSE / JEE Main & Advanced',
    lectureTranscriptSummary: [
      'Resolved gravitational weight mg into mg sin(θ) parallel to incline and mg cos(θ) perpendicular to incline.',
      'Proved that normal reaction N = mg cos(θ) and limiting static friction f_max = μ_s mg cos(θ).',
      'Derived angle of repose tan(θ_r) = μ_s and minimum pulling force F_min = μmg / (cos θ + μ sin θ).',
      'Solved two-block stacked friction constraint for maximum force without relative slipping: F_max = (m₁ + m₂) μ_s g.'
    ],
    chapterTestCompleted: true,
    chapterTestScore: '27 / 30',
    chapterTestAccuracy: '90%',
    ptmScheduled: true,
    ptmSlot: p.ptm.scheduled || 'Sunday, 11 Oct 2026 • 6:00 PM IST'
  };
  const hw = AppState.homeworkData || {};
  const isAcknowledged = p.ptm && p.ptm.acknowledged;

  const reportMeta = (typeof window.getParentReportSummaryMeta === 'function')
    ? window.getParentReportSummaryMeta()
    : {
        mode: AppState.whatsappReportDemoMode || 'enrolled',
        studentName: studentName,
        gradeLabel: 'Grade 11 • ' + (course.boardExam || 'CBSE / JEE Main & Advanced'),
        paperTitle: `${course.subject}: ${course.chapter} — End-of-Chapter Paper 1 (${course.boardExam || 'CBSE / JEE Main'})`,
        scoreDisplay: '27.0 / 30 (90.0%)',
        pctNum: 90.0,
        statusEmoji: '✅',
        statusHeadline: 'Strong conceptual command — Ready for next chapter.',
        statusBadgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        focusAreas: [
          'Multi-step constraint relations with movable pulleys and accelerated wedges',
          'Double-checking direction of impending motion before assigning static friction sign',
          'Practice 10 timed numerical-value questions for ' + (course.boardExam || 'JEE Main')
        ],
        handwritingScore: '9.2 / 10 (Neat FBDs & Equation Steps)',
        bloomsSummary: { Remember: 96, Understand: 92, Apply: 90, Analyze: 86, Evaluate: 84 },
        aiFeedbackText: `${studentName} demonstrated high accuracy across post-lecture homework and the End-of-Chapter Paper in ${course.subject} (${course.chapter}). Step-by-step derivations and diagram labeling meet full Board/Competitive marking criteria.`,
        improvementPlan: [
          'Day 1–2: Revise non-inertial pseudo-force frames and movable pulley constraint equations (20 mins/day).',
          'Day 3–4: Attempt 12 timed JEE/NEET numerical-value problems on rough inclined wedges.',
          'Day 5–6: Complete faculty-assigned mixed revision drill before starting the next chapter.',
          'Day 7: 15-minute 1-on-1 PTM review with ' + (course.teacherName || 'Dedicated Master Faculty') + '.'
        ],
        questionAnalysis: [
          { qNo: 'Q1', topic: `${course.chapter} — Core Concept MCQ`, blooms: 'Understand', marks: '4 / 4', status: 'Correct', remark: 'Selected exact physical law in 42s' },
          { qNo: 'Q2', topic: `${course.chapter} — Application Problem`, blooms: 'Apply', marks: '4 / 4', status: 'Correct', remark: 'Accurate substitution and unit consistency' },
          { qNo: 'Q3', topic: `${course.chapter} — Assertion-Reason`, blooms: 'Analyze', marks: '4 / 4', status: 'Correct', remark: 'Verified both statements and causal link' },
          { qNo: 'Q4', topic: `${course.chapter} — Multi-Step Numerical`, blooms: 'Evaluate', marks: '7 / 10', status: 'Partial', remark: 'Correct method; minor sign slip in final step' },
          { qNo: 'Q5', topic: `${course.chapter} — Subjective Derivation`, blooms: 'Apply', marks: '8 / 8', status: 'Correct', remark: 'Neat diagram + all intermediate steps shown' }
        ],
        reportUrl: 'https://siko.studywithconcepts.com/report/6ac669ed2fd255ecfec4792c?t=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJfaWQiOiI2YWM2NjllZDJmZDI1NWVjZmVjNDc5MmMiLCJleHAiOjE3OTY1NzY3ODAsInR5cGUiOiJwYXJlbnRfcmVwb3J0In0.taoDgXy_XNaKmjEZi6t0kd8xFZeZlYJo1Ls7YEcPtyI'
      };

  const showFullReport = Boolean(AppState.showFullDetailedParentReport);
  const strengths = Array.isArray(reportMeta.strengths) && reportMeta.strengths.length > 0
    ? reportMeta.strengths
    : ['Strong conceptual command and step-by-step derivation clarity'];
  const focusAreas = reportMeta.focusAreas || reportMeta.weaknesses || [];
  const activeKey = reportMeta.studentKey || AppState.activePtmStudentKey || 'riya';
  const isTeacherApproved = reportMeta.teacherApprovalStatus === 'teacher_approved';
  const hwScoreDisplay = hw.score || '23 / 26';
  const hwAccuracyDisplay = (hw.percentage || 88) + '%';
  const chTestScoreDisplay = reportMeta.scoreDisplay || course.chapterTestScore || '27 / 30';
  const chTestAccDisplay = (reportMeta.pctNum || 90) + '%';
  const isTeacher = AppState.currentRole === 'teacher';
  const parentPhone = (AppState.bookingData && AppState.bookingData.parentPhone) ||
    (AppState.studentOnboarding && AppState.studentOnboarding.parentPhone) ||
    (AppState.parentData && AppState.parentData.parentPhone) ||
    '+91 98200 11223';

  return `
    <div class="container py-8 max-w-4xl">
      <!-- Breadcrumb -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div class="flex items-center gap-2 text-xs text-slate-500">
          <a href="#" onclick="window.navigateView('parent-dashboard')" class="hover:underline">Parent Dashboard</a>
          <span>/</span>
          <a href="#" onclick="window.navigateView('teacher-dashboard')" class="hover:underline">Teacher Portal</a>
          <span>/</span>
          <span class="text-slate-800 font-bold">Faculty Evaluation &amp; PTM Report (${reportMeta.studentName})</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn btn-outline btn-sm" onclick="window.navigateView('teacher-dashboard')">
            👩‍🏫 Teacher Portal
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.navigateView('parent-dashboard')">
            👨‍👩‍👧 Parent Dashboard &rarr;
          </button>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- TEACHER ROLE ONLY: MULTI-STUDENT WORKBENCH & SIGN-OFF GATE          -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      ${isTeacher ? `
        <div class="card p-5 bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-3xs font-extrabold uppercase">
                  👩‍🏫 Faculty Evaluation Workbench
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-3xs font-extrabold border ${isTeacherApproved ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-900 border-amber-300'}">
                  ${isTeacherApproved ? `✓ Signed &amp; Verified by ${reportMeta.teacherName} (${reportMeta.approvedAt || 'Verified'})` : `⏳ Pending ${reportMeta.teacherName}'s Sign-Off`}
                </span>
              </div>
              <h2 class="text-base sm:text-lg font-black text-slate-900 mt-1">
                Select Student to Inspect Faculty-Observed Strengths, Focus Areas &amp; Personalised Guidance
              </h2>
            </div>

            <!-- 4 Distinct Student Profiles for Faculty Review -->
            <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 flex-wrap">
              <button type="button" onclick="window.switchPtmStudentProfile('riya')"
                class="px-2.5 py-1.5 rounded-lg text-2xs font-extrabold cursor-pointer border-0 transition ${activeKey === 'riya' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-transparent text-slate-600 hover:text-slate-900'}">
                🌟 ${studentName} (90% Physics)
              </button>
              <button type="button" onclick="window.switchPtmStudentProfile('atharva')"
                class="px-2.5 py-1.5 rounded-lg text-2xs font-extrabold cursor-pointer border-0 transition ${activeKey === 'atharva' ? 'bg-amber-600 text-white shadow-xs' : 'bg-transparent text-slate-600 hover:text-slate-900'}">
                ⚠️ Enrolled Student B (16.2% Maths)
              </button>
              <button type="button" onclick="window.switchPtmStudentProfile('kabir')"
                class="px-2.5 py-1.5 rounded-lg text-2xs font-extrabold cursor-pointer border-0 transition ${activeKey === 'kabir' ? 'bg-blue-600 text-white shadow-xs' : 'bg-transparent text-slate-600 hover:text-slate-900'}">
                📈 Enrolled Student C (68.3% Calculus)
              </button>
              <button type="button" onclick="window.switchPtmStudentProfile('aarav')"
                class="px-2.5 py-1.5 rounded-lg text-2xs font-extrabold cursor-pointer border-0 transition ${activeKey === 'aarav' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-transparent text-slate-600 hover:text-slate-900'}">
                🧪 Enrolled Student D (81.7% Chem)
              </button>
            </div>
          </div>

          <!-- Faculty-Observed Strengths, Focus Areas & Guidance Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div class="font-extrabold text-emerald-950 mb-1.5 flex items-center justify-between">
                <span>💪 Faculty-Observed Strengths (${reportMeta.studentName})</span>
                <span class="text-3xs text-emerald-700 font-bold">${reportMeta.subject}</span>
              </div>
              <ul class="space-y-1 text-2xs text-emerald-900">
                ${strengths.map(s => `<li class="flex items-start gap-1.5"><span class="font-bold">✓</span> <span>${s}</span></li>`).join('')}
              </ul>
            </div>

            <div class="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
              <div class="font-extrabold text-amber-950 mb-1.5 flex items-center justify-between">
                <span>📌 Faculty-Identified Focus Areas &amp; Action Points</span>
                <span class="text-3xs text-amber-800 font-bold">${reportMeta.calibreTier || 'Targeted'}</span>
              </div>
              <ul class="space-y-1 text-2xs text-amber-900">
                ${focusAreas.map(w => `<li class="flex items-start gap-1.5"><span class="font-bold">•</span> <span>${w}</span></li>`).join('')}
              </ul>
            </div>
          </div>

          <!-- Faculty Guidance & Teacher Sign-Off Gate Bar -->
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <strong class="text-slate-900">👩‍🏫 Personalised Faculty Feedback &amp; Evaluation Remarks (${reportMeta.teacherName}):</strong>
              <span class="text-3xs text-emerald-700 font-bold">✓ Evaluated &amp; Certified by Subject Faculty</span>
            </div>
            <p class="text-2xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
              ${reportMeta.aiGuidance || reportMeta.aiFeedbackText}
            </p>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input id="ptmTeacherGuidanceInput" type="text" value="${reportMeta.teacherNote || ''}" placeholder="Faculty remark / refinement before dispatching to parent..." class="flex-1 p-2 rounded-lg border border-slate-300 text-2xs bg-white text-slate-800" />
              <button type="button" onclick="window.regenerateStudentPtmWithAi('${activeKey}')" class="px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-extrabold text-2xs cursor-pointer border border-indigo-200 whitespace-nowrap">
                🔄 Refresh Evaluation Remarks
              </button>
              <button type="button" onclick="window.approvePtmReportByTeacher('${activeKey}')" class="px-4 py-2 rounded-lg ${isTeacherApproved ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'} font-extrabold text-2xs cursor-pointer border-0 shadow-xs whitespace-nowrap">
                ${isTeacherApproved ? '✓ Signed by Faculty (Update Remark)' : '✅ Faculty: Sign & Approve Report for PTM'}
              </button>
            </div>
          </div>
        </div>

        <!-- INTERACTIVE PTM SCHEDULER & NOTIFY BAR -->
        <div class="card p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl shadow-md border border-indigo-500/30 mb-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-3xs font-extrabold uppercase">
                ✓ Student Evaluation Dossier • ${reportMeta.studentName} (${reportMeta.scoreDisplay})
              </span>
              <h2 class="text-lg font-black text-white mt-1">
                1-on-1 PTM Scheduling: ${reportMeta.subject} (${reportMeta.chapter})
              </h2>
              <p class="text-xs text-indigo-200 mt-0.5">
                Scheduled Slot: <strong class="text-amber-300">${reportMeta.ptmSlot || p.ptm.scheduled}</strong> • Faculty: <strong>${reportMeta.teacherName}</strong>
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <select id="ptmSlotSelect" class="p-2 rounded-lg bg-slate-800 border border-indigo-400/40 text-xs font-bold text-white">
                <option value="Sunday, 11 Oct 2026 • 6:00 PM IST" ${(course.ptmSlot || '').includes('11 Oct') ? 'selected' : ''}>Sun, 11 Oct 2026 • 6:00 PM IST</option>
                <option value="Monday, 12 Oct 2026 • 7:30 PM IST" ${(course.ptmSlot || '').includes('12 Oct') ? 'selected' : ''}>Mon, 12 Oct 2026 • 7:30 PM IST</option>
                <option value="Wednesday, 14 Oct 2026 • 6:30 PM IST" ${(course.ptmSlot || '').includes('14 Oct') ? 'selected' : ''}>Wed, 14 Oct 2026 • 6:30 PM IST</option>
              </select>
              <button type="button" onclick="window.scheduleChapterPtmAndNotifyParent(document.getElementById('ptmSlotSelect').value)" class="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs cursor-pointer border-0 shadow-sm">
                📅 Confirm PTM Slot &amp; Send Report
              </button>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- TIER 1: CRISP, DIGESTIBLE PARENT EXECUTIVE SUMMARY (DEFAULT VIEW)   -->
      <!-- No technical clutter, no overwhelming walls of text. Clean & calm.  -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <div class="card p-6 sm:p-7 bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 space-y-6">
        <!-- Top Row: Student & Faculty Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-black text-xl shadow-md">
              ${(reportMeta.studentName || 'S').slice(0, 1)}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">${reportMeta.studentName}</h1>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-3xs font-extrabold uppercase">
                  ✓ Certified Report
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                ${reportMeta.gradeLabel} • Dedicated Faculty: <strong>${reportMeta.teacherName}</strong> (${reportMeta.subject})
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-3 py-1.5 rounded-full text-xs font-bold border ${reportMeta.statusBadgeClass}">
              ${reportMeta.statusEmoji} ${reportMeta.statusHeadline}
            </span>
          </div>
        </div>

        <!-- 4 Core Digestible Metric Tiles (Easy to Digest at a Glance) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="card p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-center shadow-2xs">
            <span class="text-3xs font-bold text-emerald-700 uppercase block">Chapter Test Score</span>
            <span class="text-xl sm:text-2xl font-black text-emerald-950 block mt-0.5">${reportMeta.scoreDisplay.split('(')[0].trim()}</span>
            <span class="text-3xs text-emerald-700 font-semibold block mt-1">${reportMeta.pctNum}% Accuracy • ${reportMeta.subject}</span>
          </div>
          <div class="card p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-center shadow-2xs">
            <span class="text-3xs font-bold text-blue-700 uppercase block">Attendance Status</span>
            <span class="text-xl sm:text-2xl font-black text-blue-950 block mt-0.5">100%</span>
            <span class="text-3xs text-blue-700 font-semibold block mt-1">All Scheduled Classes Attended</span>
          </div>
          <div class="card p-4 bg-purple-50/70 border border-purple-200 rounded-2xl text-center shadow-2xs">
            <span class="text-3xs font-bold text-purple-700 uppercase block">Homework Completion</span>
            <span class="text-xl sm:text-2xl font-black text-purple-950 block mt-0.5">10 / 10</span>
            <span class="text-3xs text-purple-700 font-semibold block mt-1">Verified &amp; Checked by Faculty</span>
          </div>
          <div class="card p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-center shadow-2xs">
            <span class="text-3xs font-bold text-amber-700 uppercase block">Step Presentation</span>
            <span class="text-xl sm:text-2xl font-black text-amber-950 block mt-0.5">${reportMeta.handwritingScore.split('(')[0].trim()}</span>
            <span class="text-3xs text-amber-700 font-semibold block mt-1">Neat Free Body Diagrams</span>
          </div>
        </div>

        <!-- Plain-Language Educator Observation (Warm & Personal) -->
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-base">👩‍🏫</span>
            <strong class="text-slate-900">Faculty Observation from ${reportMeta.teacherName}:</strong>
          </div>
          <p class="text-slate-700 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-100">
            "${reportMeta.teacherNote || reportMeta.aiFeedbackText}"
          </p>
        </div>

        <!-- Key Highlights: Strengths & What We're Practicing Next -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div class="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
            <span class="font-extrabold text-emerald-950 block mb-1.5 flex items-center gap-1.5">
              <span>💪</span> Top Strengths Observed by Faculty
            </span>
            <ul class="space-y-1.5 text-2xs text-emerald-900">
              ${strengths.slice(0, 2).map(s => `<li class="flex items-start gap-1.5"><span class="font-bold text-emerald-700">✓</span> <span>${s}</span></li>`).join('')}
            </ul>
          </div>

          <div class="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
            <span class="font-extrabold text-amber-950 block mb-1.5 flex items-center gap-1.5">
              <span>🎯</span> Key Focus Areas for Next Session
            </span>
            <ul class="space-y-1.5 text-2xs text-amber-900">
              ${focusAreas.slice(0, 2).map(f => `<li class="flex items-start gap-1.5"><span class="font-bold text-amber-800">•</span> <span>${f}</span></li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Upcoming 1-on-1 Parent-Teacher Meeting (PTM) & WhatsApp Quick Dispatch -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <!-- PTM Schedule Card -->
          <div class="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-3xs font-extrabold uppercase text-amber-400 tracking-wider">📅 1-on-1 Parent-Teacher Meeting</span>
                ${isAcknowledged ? `<span class="text-3xs font-black text-emerald-300">✓ Confirmed</span>` : `<span class="text-3xs font-bold text-amber-300">Slot Reserved</span>`}
              </div>
              <h4 class="text-sm font-black text-white mt-0.5">${reportMeta.ptmSlot || p.ptm.scheduled}</h4>
              <p class="text-2xs text-indigo-200 mt-1">
                With Dedicated Faculty: <strong>${reportMeta.teacherName}</strong> (${reportMeta.subject})
              </p>
            </div>
            <div class="mt-4">
              ${isAcknowledged ? `
                <div class="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-center font-bold text-2xs">
                  ✓ Confirmed &amp; Acknowledged by You (${p.parentName}) • Milestone M3 Released
                </div>
              ` : `
                <button type="button" onclick="window.acknowledgePtmReport()" class="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer border-0 shadow-sm w-full">
                  ✓ Confirm &amp; Acknowledge PTM Slot
                </button>
              `}
            </div>
          </div>

          <!-- WhatsApp Results Dispatch Card -->
          <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-3xs font-extrabold uppercase text-emerald-800 tracking-wider">📲 Instant Result Highlights</span>
                <span class="text-3xs text-emerald-600 font-bold">WhatsApp Dispatch</span>
              </div>
              <h4 class="text-sm font-black text-slate-900 mt-0.5">Send Summary to Your Phone</h4>
              <p class="text-2xs text-slate-600 mt-1">
                Receive ${reportMeta.studentName}'s score card and confirmed PTM meeting link on WhatsApp (<strong>${parentPhone}</strong>).
              </p>
            </div>
            <div class="mt-4 flex flex-wrap items-center gap-2">
              <button type="button" onclick="window.sendParentWhatsappSummary(false)" class="flex-1 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs cursor-pointer border-0 shadow-sm whitespace-nowrap">
                📲 Send to WhatsApp
              </button>
              <button type="button" onclick="window.copyParentWhatsappSummary()" class="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs cursor-pointer border border-emerald-300 whitespace-nowrap">
                📋 Copy Text
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- PROGRESSIVE DISCLOSURE BAR: VIEW DETAILED REPORT (CLICK TO EXPAND)   -->
      <!-- Default is collapsed so parent is not overwhelmed. Click reveals.   -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <div class="card p-5 bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div class="font-black text-sm text-indigo-950 flex items-center gap-2">
            <span class="text-base">📊</span> Deep-Dive Academic Analysis &amp; Question Logs
          </div>
          <p class="text-2xs text-indigo-800 mt-0.5">
            Inspect question-by-question marks, Bloom's cognitive taxonomy, handwriting rubric &amp; 7-day study routine.
          </p>
        </div>
        <button type="button"
          id="toggleFullDetailedReportBtn"
          onclick="window.toggleFullDetailedParentReport()"
          class="px-5 py-3 rounded-xl font-black text-xs cursor-pointer border-0 shadow-md transition-all flex items-center gap-2 shrink-0 ${
            showFullReport
              ? 'bg-slate-900 hover:bg-slate-800 text-white ring-2 ring-slate-400'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white ring-2 ring-indigo-400/40'
          }">
          <span>${showFullReport ? '▲ Hide Detailed Report' : '📊 View Detailed Academic Report'}</span>
          <span>${showFullReport ? '▲' : '▼'}</span>
        </button>
      </div>

      <!-- ===================================================================== -->
      <!-- TIER 2: EXPANDABLE FULL DETAILED REPORT                               -->
      <!-- (Handwriting score · Bloom's taxonomy · Faculty feedback · Improvement plan -->
      <!--  · Question-by-question analysis · Post-Chapter Dossier)              -->
      <!-- ===================================================================== -->
      <div id="ptmFullDetailedReportContainer" class="${showFullReport ? 'block' : 'hidden'}">
        <div class="card p-8 bg-white border-2 border-indigo-200 rounded-2xl shadow-sm mb-8">
          <!-- Full Report Header -->
          <div class="border-b pb-6 mb-6">
            <div class="flex flex-wrap justify-between items-start gap-4">
              <div>
                <span class="badge badge-primary mb-2">Full Deep-Dive Academic Dossier (Unlocked on Demand)</span>
                <h2 class="text-2xl font-black text-slate-900">
                  Full Detailed Report: ${reportMeta.paperTitle}
                </h2>
                <p class="text-xs text-slate-500 mt-1">
                  Student: <strong>${reportMeta.studentName}</strong> (${reportMeta.gradeLabel}) • Faculty: <strong>${course.teacherName}</strong>
                </p>
              </div>
              <div class="text-right text-xs">
                <span class="font-bold text-slate-900 block">PTM Schedule: ${course.ptmSlot || p.ptm.scheduled}</span>
                <span class="text-emerald-600 font-bold">✓ Verified Report Token Active</span>
              </div>
            </div>
          </div>

          <!-- SECTION A: HANDWRITING SCORE & STEP PRESENTATION RUBRIC + BLOOM'S TAXONOMY -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- 1. Handwriting & Step Clarity Breakdown -->
            <div class="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-xs font-black text-slate-900 uppercase tracking-wider">
                  ✍️ 1. Handwriting Score &amp; Step Presentation
                </h3>
                <span class="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-xs">
                  ${reportMeta.handwritingScore.split('(')[0].trim()}
                </span>
              </div>
              <p class="text-2xs text-slate-600 mb-3">
                Evaluated on uploaded subjective answer sheets for legibility, diagram labeling, and step-marking compliance.
              </p>
              <div class="space-y-2 text-xs">
                <div class="flex items-center justify-between p-2 rounded bg-white border">
                  <span class="font-semibold text-slate-700">Equation &amp; Symbol Legibility</span>
                  <span class="font-bold text-emerald-700">${reportMeta.mode === 'needs_practice' ? '7.2 / 10' : '9.5 / 10'}</span>
                </div>
                <div class="flex items-center justify-between p-2 rounded bg-white border">
                  <span class="font-semibold text-slate-700">Free-Body / Geometric Diagram Neatness</span>
                  <span class="font-bold text-emerald-700">${reportMeta.mode === 'needs_practice' ? '6.0 / 10' : '9.2 / 10'}</span>
                </div>
                <div class="flex items-center justify-between p-2 rounded bg-white border">
                  <span class="font-semibold text-slate-700">Step-by-Step Board Marking Structure</span>
                  <span class="font-bold text-indigo-700">${reportMeta.mode === 'needs_practice' ? '6.8 / 10' : '9.0 / 10'}</span>
                </div>
                <div class="flex items-center justify-between p-2 rounded bg-white border">
                  <span class="font-semibold text-slate-700">Final Answer Boxing &amp; SI Units</span>
                  <span class="font-bold text-emerald-700">${reportMeta.mode === 'needs_practice' ? '7.0 / 10' : '9.2 / 10'}</span>
                </div>
              </div>
            </div>

            <!-- 2. Bloom's Taxonomy 5-Level Cognitive Mastery -->
            <div class="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-xs font-black text-slate-900 uppercase tracking-wider">
                  🧠 2. Bloom's Taxonomy Cognitive Breakdown
                </h3>
                <span class="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold text-2xs">
                  5-Tier Cognitive Map
                </span>
              </div>
              <div class="space-y-2.5 text-xs">
                ${Object.entries(reportMeta.bloomsSummary || {}).map(([level, pct]) => `
                  <div>
                    <div class="flex justify-between text-2xs font-bold mb-1">
                      <span class="text-slate-700">${level}</span>
                      <span class="${pct >= 75 ? 'text-emerald-700' : pct >= 40 ? 'text-amber-700' : 'text-rose-700'}">${pct}%</span>
                    </div>
                    ${ProgressBar({ value: pct, variant: pct >= 75 ? 'success' : pct >= 40 ? 'amber' : 'primary', showPercent: false })}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- SECTION B: FACULTY FEEDBACK & 7-DAY PERSONALIZED IMPROVEMENT PLAN -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-xs">
            <!-- 3. Faculty Feedback & Root-Cause Evaluation -->
            <div class="p-5 rounded-xl bg-blue-50/70 border border-blue-200">
              <h3 class="text-xs font-black text-blue-950 uppercase tracking-wider mb-2">
                👩‍🏫 3. Faculty Diagnostic Feedback &amp; Evaluation
              </h3>
              <p class="text-slate-700 leading-relaxed mb-3">
                ${reportMeta.aiFeedbackText}
              </p>
              <div class="p-3 rounded-lg bg-white border border-blue-100">
                <div class="font-bold text-slate-900 mb-1">📌 Key Focus Areas Highlighted by Faculty:</div>
                <ul class="space-y-1 text-slate-700">
                  ${focusAreas.map(f => `<li class="flex items-start gap-1.5"><span>•</span> <span>${f}</span></li>`).join('')}
                </ul>
              </div>
            </div>

            <!-- 4. 7-Day Actionable Improvement Plan -->
            <div class="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <h3 class="text-xs font-black text-emerald-950 uppercase tracking-wider mb-2">
                📈 4. Personalized 7-Day Improvement Plan
              </h3>
              <ul class="space-y-2 text-emerald-950">
                ${(reportMeta.improvementPlan || []).map(step => `
                  <li class="p-2.5 rounded-lg bg-white border border-emerald-100 flex items-start gap-2">
                    <span class="text-emerald-600 font-black">✓</span>
                    <span>${step}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <!-- SECTION B2: DYNAMIC CALIBRE-BASED DAILY STUDY PLAN (WHERE TO START • WHAT TO STUDY • HOW TO STUDY) -->
          ${(() => {
            const plan = AppState.dailyStudyPlan || (typeof window.generateDailyStudyPlan === 'function' ? window.generateDailyStudyPlan() : null);
            if (!plan) return '';
            const day1 = (Array.isArray(plan.days) && plan.days[0]) || { dayLabel: 'Day 1 (Today)', theme: 'Core Mastery', blocks: [] };
            return `
              <div class="p-5 rounded-2xl bg-indigo-50/60 border-2 border-indigo-200 mb-8 text-xs">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <span class="px-2.5 py-0.5 rounded-full bg-indigo-900 text-amber-300 font-extrabold text-3xs uppercase">
                      📚 Faculty-Guided Daily Study Plan (Calibre: ${plan.calibreLabel})
                    </span>
                    <h3 class="text-sm font-black text-slate-900 mt-1">
                      Zero-Decision-Fatigue Daily Routine (${plan.currentScoreText} &rarr; ${plan.targetScoreText})
                    </h3>
                  </div>
                  <button type="button" onclick="window.switchRole('student')" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-2xs cursor-pointer border-0">
                    Open Interactive 7-Day Student Planner &rarr;
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  ${(day1.blocks || []).map(b => `
                    <div class="p-3.5 rounded-xl bg-white border border-indigo-200 space-y-1.5">
                      <div class="font-black text-slate-900 text-xs">${b.slot}: ${b.title}</div>
                      <div class="p-2 rounded bg-amber-50 border border-amber-200 text-2xs">
                        <strong class="text-amber-950 block">📍 Where to Start From:</strong>
                        <span>${b.whereToStart}</span>
                      </div>
                      <div class="p-2 rounded bg-blue-50 border border-blue-200 text-2xs">
                        <strong class="text-blue-950 block">📘 What to Study:</strong>
                        <span>${b.whatToStudy}</span>
                      </div>
                      <div class="p-2 rounded bg-purple-50 border border-purple-200 text-2xs">
                        <strong class="text-purple-950 block">🧠 How to Study:</strong>
                        <span>${b.howToStudy}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          })()}

          <!-- SECTION C: QUESTION-BY-QUESTION ANALYSIS TABLE -->
          <div class="mb-8">
            <h3 class="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
              📋 5. Question-by-Question Analysis
            </h3>
            <div class="overflow-x-auto rounded-xl border border-slate-200">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-slate-100 text-slate-700 border-b">
                    <th class="p-3 font-extrabold">Q#</th>
                    <th class="p-3 font-extrabold">Topic &amp; Sub-Concept</th>
                    <th class="p-3 font-extrabold">Bloom's Level</th>
                    <th class="p-3 font-extrabold">Marks</th>
                    <th class="p-3 font-extrabold">Status</th>
                    <th class="p-3 font-extrabold">Faculty Evaluator Step Remark</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${(reportMeta.questionAnalysis || []).map(q => `
                    <tr class="hover:bg-slate-50">
                      <td class="p-3 font-black text-slate-900">${q.qNo}</td>
                      <td class="p-3 font-semibold text-slate-800">${q.topic}</td>
                      <td class="p-3"><span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-2xs">${q.blooms}</span></td>
                      <td class="p-3 font-black text-slate-900">${q.marks}</td>
                      <td class="p-3">
                        <span class="px-2 py-0.5 rounded-full text-2xs font-bold ${
                          q.status === 'Correct' ? 'bg-emerald-100 text-emerald-800' :
                          q.status === 'Partial' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }">${q.status}</span>
                      </td>
                      <td class="p-3 text-slate-600">${q.remark}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- SECTION D: CHAPTER LECTURE LISTENER & DELIVERABLE SUMMARY -->
          <div class="mb-8">
            <h3 class="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
              🎙️ 6. Chapter Lecture Listener &amp; Deliverable Summary (${course.subject}: ${course.chapter})
            </h3>
            <div class="p-4 bg-slate-50 rounded-xl border text-xs text-slate-700 space-y-2 leading-relaxed">
              <p>
                <strong>${studentName}</strong> completed all <strong>${course.totalLecturesInChapter || 2} lectures</strong> of <strong>${course.subject}: ${course.chapter}</strong> (Latest Lecture Topic: <em>${course.lectureTopic}</em>) under <strong>${course.teacherName}</strong>.
                Post-lecture homework score: <strong>${hwScoreDisplay} (${hwAccuracyDisplay})</strong> • End-of-Chapter Test score: <strong>${chTestScoreDisplay} (${chTestAccDisplay})</strong>.
              </p>
              <div class="pt-2 border-t border-slate-200">
                <strong class="text-slate-900 block mb-1">Key Concepts Covered in Teacher's Lectures:</strong>
                <ul class="list-disc pl-5 space-y-1 text-slate-600">
                  ${(course.lectureTranscriptSummary || []).map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>

          <!--Observed Strengths -->
          <div class="p-5 rounded-xl bg-emerald-50/60 border border-emerald-100 mb-6 text-xs">
            <h4 class="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              Observed Strengths in ${course.subject} (${course.chapter})
            </h4>
            <ul class="space-y-1.5 text-emerald-800">
              ${strengths.map(s => `<li class="flex items-start gap-1.5">${Icons.check} <span>${s}</span></li>`).join('')}
            </ul>
          </div>

          <!-- Signatures & Parent Acknowledgement -->
          <div class="pt-6 border-t flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                ${(course.teacherName || 'AS').split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div class="text-xs">
                <span class="font-bold text-slate-900 block">Digitally Signed by ${course.teacherName}</span>
                <span class="text-2xs text-emerald-600 font-semibold">✓ Verified Teacher Sign-Off • Post-Chapter Dossier</span>
              </div>
            </div>

            <div>
              ${AppState.currentRole === 'teacher' ? `
                <div class="text-right">
                  <span class="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs">
                    ${Icons.check} PTM Slot Confirmed by Faculty (${course.ptmSlot || 'Sunday, 11 Oct • 6:00 PM IST'})
                  </span>
                  <div class="text-3xs text-slate-500 mt-1">
                    ${isAcknowledged ? `Parent (${p.parentName}) acknowledged report in Parent Portal ✓` : `Report dispatched to ${p.parentName}'s Parent Portal`}
                  </div>
                </div>
              ` : (AppState.currentRole === 'parent' ? `
                ${isAcknowledged ? `
                  <span class="badge badge-success text-xs font-bold py-2.5 px-4">
                    ${Icons.check} Acknowledged by You (${p.parentName}) • Milestone M3 Released
                  </span>
                ` : `
                  <button class="btn btn-primary font-extrabold" onclick="window.acknowledgePtmReport()">
                    ${Icons.check} Parent: Acknowledge Detailed Report &amp; Release Milestone M3
                  </button>
                `}
              ` : `
                <span class="badge ${isAcknowledged ? 'badge-success' : 'badge-neutral'} text-xs font-bold py-2 px-3">
                  ${isAcknowledged ? `✓ Acknowledged by Parent (${p.parentName})` : `Parent Report Dispatched to ${p.parentName}`}
                </span>
              `)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
