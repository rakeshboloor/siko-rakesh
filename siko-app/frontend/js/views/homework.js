/**
 * SIKO DYNAMIC LLM HOMEWORK & CLOSED-LOOP CHAPTER PIPELINE VIEW
 * - Strictly scoped to the child's enrolled subject, chapter, and teacher's latest lecture.
 * - AI Lecture Listener listens to the teacher's lecture -> Generates Post-Lecture Homework ->
 *   Teacher Reviews & Releases -> Student Completes Homework -> Complete Chapter Creates Chapter Test ->
 *   PTM Scheduled & Detailed Parent Report Dispatched.
 */

import { AppState } from '../state.js';
import { Icons } from '../components.js';

export function renderHomework() {
  const studentName = (typeof window.getStudentDisplayName === 'function' && window.getStudentDisplayName()) ||
    (AppState.studentOnboarding && (AppState.studentOnboarding.studentName || AppState.studentOnboarding.name)) ||
    (AppState.bookingData && AppState.bookingData.studentName) ||
    (AppState.enrolledCourse && AppState.enrolledCourse.studentName) ||
    ((AppState.currentUser && AppState.currentUser.role === 'student' && AppState.currentUser.name) || 'Enrolled Student');

  const course = AppState.enrolledCourse || {
    subject: 'Physics',
    chapter: 'Laws of Motion & Friction',
    lectureNumber: 2,
    totalLecturesInChapter: 2,
    lecturesCompleted: 2,
    lectureTopic: 'Free Body Diagrams on Rough Inclined Planes, Angle of Repose & Two-Block Constraint Systems',
    teacherName: 'Dedicated Master Faculty',
    boardExam: 'CBSE / JEE Main & Advanced',
    lectureTranscriptSummary: [
      'Resolved gravitational weight mg into mg sin(θ) parallel to incline and mg cos(θ) perpendicular to incline.',
      'Proved that normal reaction N = mg cos(θ) and limiting static friction f_max = μ_s mg cos(θ).',
      'Derived angle of repose tan(θ_r) = μ_s and minimum pulling force F_min = μmg / (cos θ + μ sin θ).',
      'Solved two-block stacked friction constraint for maximum force without relative slipping: F_max = (m₁ + m₂) μ_s g.'
    ],
    homeworkStatus: 'released',
    chapterCompleted: false,
    chapterTestCreated: false,
    chapterTestCompleted: false,
    chapterTestScore: null,
    ptmScheduled: false,
    ptmSlot: 'Sunday, 11 Oct 2026 • 6:00 PM IST'
  };

  const hw = AppState.homeworkData || {
    id: 'hw-dynamic-01',
    subject: course.subject,
    chapter: course.chapter,
    lectureNumber: course.lectureNumber || 2,
    lectureTopic: course.lectureTopic,
    teacherName: course.teacherName,
    exam_track: course.boardExam,
    title: `Post-Lecture #${course.lectureNumber || 2} Homework: ${course.chapter}`,
    due: 'Tomorrow, 6:00 PM IST',
    estimatedTime: '25 minutes',
    status: 'released',
    approvedByTeacher: true,
    questions: [],
    completed: false
  };

  const questions = Array.isArray(hw.questions) ? hw.questions : [];
  const objectiveQs = questions.filter((q, idx) => (q.section === 'A') || (Array.isArray(q.options) && q.options.length > 0 && q.section !== 'B'));
  const subjectiveQs = questions.filter((q, idx) => (q.section === 'B') || (!q.options || q.options.length === 0));

  const objMarks = objectiveQs.reduce((acc, q) => acc + (Number(q.marks) || 4), 0);
  const subjMarks = subjectiveQs.reduce((acc, q) => acc + (Number(q.marks) || 5), 0);
  const totalMarks = objMarks + subjMarks;

  const isTeacher = AppState.currentRole === 'teacher';
  const isPendingTeacher = hw.status === 'pending_teacher_review' || course.homeworkStatus === 'pending_teacher_review';
  const isAiCorrectedPendingTeacher = hw.status === 'ai_corrected_pending_teacher_review' || course.homeworkStatus === 'ai_corrected_pending_teacher_review';

  // Closed-Loop 5-Stage Pipeline Header
  const pipelineBannerHtml = `
    <div class="card p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl shadow-lg border border-indigo-500/30 mb-6">
      <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-3xs font-extrabold uppercase tracking-wider">
              🎙️ AI Lecture-to-PTM Closed Loop
            </span>
            <span class="text-2xs text-indigo-200 font-semibold">Enrolled Subject: <strong class="text-white">${course.subject}</strong> • ${course.boardExam}</span>
          </div>
          <h2 class="text-base sm:text-lg font-extrabold text-white">
            ${course.subject}: ${course.chapter} (Lecture #${course.lectureNumber || 2} of ${course.totalLecturesInChapter || 2})
          </h2>
          <p class="text-2xs text-indigo-200 mt-0.5">
            Faculty: <strong>${course.teacherName}</strong> • Lecture Topic: <em>${course.lectureTopic}</em>
          </p>
        </div>

        <!-- Enrolled Subject Switcher (Tests Dynamic LLM Homework Across Enrolled Courses) -->
        <div class="flex flex-col items-end gap-1.5">
          <span class="text-3xs text-indigo-300 font-bold uppercase tracking-wider">Switch Enrolled Course / Lecture:</span>
          <div class="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl border border-white/15">
            ${['Physics', 'Chemistry', 'Mathematics', 'Biology'].map(sub => `
              <button type="button"
                onclick="window.setEnrolledCourseSubject('${sub}')"
                class="px-2.5 py-1 rounded-lg text-2xs font-extrabold transition-all cursor-pointer ${course.subject === sub ? 'bg-blue-500 text-white shadow-sm' : 'text-indigo-200 hover:text-white hover:bg-white/10'}">
                ${sub}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 5-Step Pipeline Status Stepper -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4 text-2xs">
        <div class="p-2.5 rounded-xl border border-emerald-400/40 bg-emerald-500/15">
          <div class="font-extrabold text-emerald-300 flex items-center gap-1">1. AI Lecture Listener ✓</div>
          <div class="text-3xs text-indigo-100 mt-0.5">Listened to ${course.teacherName}'s Lecture #${course.lectureNumber || 2}</div>
        </div>
        <div class="p-2.5 rounded-xl border ${isPendingTeacher ? 'border-amber-400 bg-amber-500/20 animate-pulse' : 'border-emerald-400/40 bg-emerald-500/15'}">
          <div class="font-extrabold ${isPendingTeacher ? 'text-amber-300' : 'text-emerald-300'} flex items-center gap-1">
            2. Teacher Review ${isPendingTeacher ? '⏳' : '✓'}
          </div>
          <div class="text-3xs text-indigo-100 mt-0.5">${isPendingTeacher ? 'Awaiting Teacher Approval' : 'Approved & Released (M2 Paid)'}</div>
        </div>
        <div class="p-2.5 rounded-xl border ${hw.completed ? 'border-emerald-400/40 bg-emerald-500/15' : (isAiCorrectedPendingTeacher ? 'border-amber-400 bg-amber-500/25 animate-pulse' : (!isPendingTeacher ? 'border-blue-400 bg-blue-500/25' : 'border-white/10 bg-white/5 opacity-70'))}">
          <div class="font-extrabold ${hw.completed ? 'text-emerald-300' : (isAiCorrectedPendingTeacher ? 'text-amber-300' : 'text-blue-200')} flex items-center gap-1">
            3. Student HW ${hw.completed ? '✓' : (isAiCorrectedPendingTeacher ? '⏳ AI Graded' : '●')}
          </div>
          <div class="text-3xs text-indigo-100 mt-0.5">${hw.completed ? `Scored ${hw.score || '23/26'}` : (isAiCorrectedPendingTeacher ? 'Under Teacher Review' : `${questions.length} Questions`)}</div>
        </div>
        <div class="p-2.5 rounded-xl border ${course.chapterTestCompleted ? 'border-emerald-400/40 bg-emerald-500/15' : (course.chapterTestCreated || hw.completed ? 'border-purple-400 bg-purple-500/25' : 'border-white/10 bg-white/5 opacity-70')}">
          <div class="font-extrabold ${course.chapterTestCompleted ? 'text-emerald-300' : 'text-purple-200'} flex items-center gap-1">
            4. Chapter Test ${course.chapterTestCompleted ? '✓' : (course.chapterTestCreated ? '●' : '○')}
          </div>
          <div class="text-3xs text-indigo-100 mt-0.5">${course.chapterTestCompleted ? `Score: ${course.chapterTestScore}` : 'Created After Chapter'}</div>
        </div>
        <div class="p-2.5 rounded-xl border ${course.ptmScheduled ? 'border-emerald-400/40 bg-emerald-500/15' : 'border-white/10 bg-white/5 opacity-70'}">
          <div class="font-extrabold ${course.ptmScheduled ? 'text-emerald-300' : 'text-indigo-200'} flex items-center gap-1">
            5. PTM & Parent Report ${course.ptmScheduled ? '✓' : '○'}
          </div>
          <div class="text-3xs text-indigo-100 mt-0.5">${course.ptmScheduled ? 'PTM Scheduled & Sent' : 'Auto-Dispatched Post-Test'}</div>
        </div>
      </div>

      <!-- AI Lecture Listener Transcript & Action Bar -->
      <div class="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-2xs">
        <div class="text-indigo-200">
          <strong class="text-amber-300">🎙️ Lecture Key Derivations Captured by AI:</strong>
          ${(course.lectureTranscriptSummary || []).slice(0, 2).join(' • ')}
        </div>
        <div class="flex items-center gap-2">
          <button type="button" onclick="window.simulateAiLectureListenerHomework()" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-3xs cursor-pointer border border-indigo-400/40">
            🎙️ Simulate Post-Lecture AI HW Generation
          </button>
          ${isPendingTeacher ? `
            <button type="button" onclick="window.approveAndReleaseLectureHomework()" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-3xs cursor-pointer border-0 shadow-md">
              👩‍🏫 Teacher: Review &amp; Release HW Now (Unlock M2) →
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  // STATE 1A: HOMEWORK IS SUBMITTED & AI-CORRECTED -> AWAITING TEACHER REVIEW & ENDORSEMENT
  if (isAiCorrectedPendingTeacher) {
    const aiCorr = hw.aiCorrection || {
      earnedMarks: 23,
      maxMarks: 26,
      score: '23 / 26',
      percentage: 88,
      breakdown: [],
      feedback: `Strong conceptual mastery demonstrated across ${course.subject} — ${course.chapter} (Lecture #${course.lectureNumber || 2}: ${course.lectureTopic}). Step-by-step derivations in Section B matched first-principles rubric taught in class.`,
      submittedAt: 'Today, 8:45 PM IST',
      studentName: studentName
    };

    if (isTeacher) {
      // TEACHER VIEW: Inspect AI Grading, Adjust Marks, Add Mentor Remarks, Release Scorecard
      return `
        <div class="container py-8 max-w-4xl">
          ${pipelineBannerHtml}

          <div class="card p-6 sm:p-8 bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl shadow-xl border-0 mb-6">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span class="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-2xs font-black uppercase tracking-wider">
                👩‍🏫 Teacher Review Gate: Student Submission AI-Corrected
              </span>
              <span class="text-2xs text-purple-200">Milestone M2 Gate (₹4,500 Escrow Payout)</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black mb-1 text-white">
              Review AI Correction: ${aiCorr.studentName || studentName}'s Homework
            </h1>
            <p class="text-xs text-purple-200 max-w-2xl">
              SIKO AI evaluated all ${questions.length} questions from <strong>${course.subject}: ${course.chapter}</strong> based on your lecture markscheme. As faculty, inspect the preliminary AI grades, edit mentor remarks below, and click <strong>Endorse &amp; Release Evaluation to Student</strong>.
            </p>
          </div>

          <!-- AI Grading Summary & Teacher Score Controls -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="card p-5 bg-white border rounded-2xl shadow-sm text-center">
              <span class="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">AI Preliminary Score</span>
              <div class="text-3xl font-black text-indigo-700">${aiCorr.score || '23 / 26'}</div>
              <span class="text-2xs font-bold text-emerald-700">${aiCorr.percentage || 88}% Accuracy (${course.boardExam})</span>
            </div>
            <div class="card p-5 bg-white border rounded-2xl shadow-sm text-center">
              <span class="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Student &amp; Chapter</span>
              <div class="text-sm font-black text-slate-900 mt-1">${aiCorr.studentName || studentName}</div>
              <span class="text-2xs text-slate-500">${course.subject}: ${course.chapter}</span>
            </div>
            <div class="card p-5 bg-white border rounded-2xl shadow-sm text-center">
              <span class="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Submission Time</span>
              <div class="text-xs font-black text-slate-800 mt-1">${aiCorr.submittedAt || 'Today, 8:45 PM IST'}</div>
              <span class="badge badge-success text-3xs mt-1">AI Auto-Graded ✓</span>
            </div>
          </div>

          <!-- Question-by-Question Review with Teacher Overrides -->
          <div class="card p-6 bg-white border rounded-2xl shadow-sm mb-6 space-y-4">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b flex items-center justify-between">
              <span>Inspect Student Responses &amp; AI Mark Allocations (${questions.length} Questions)</span>
              <span class="text-2xs text-indigo-600 font-bold">Rubric: First-Principles Lecture Markscheme</span>
            </h3>

            <div class="space-y-3">
              ${questions.map((q, idx) => {
                const isObj = q.section === 'A' || (Array.isArray(q.options) && q.options.length > 0);
                const qMax = Number(q.marks) || (isObj ? 4 : 5);
                const isAnswered = isObj ? (q.selected !== null && q.selected !== undefined) : Boolean(q.subjectiveText || q.photoAttached);
                const awarded = isObj ? (q.selected === (q.correct || 0) ? qMax : Math.max(0, qMax - 2)) : (q.photoAttached ? qMax : qMax - 1);
                return `
                  <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                    <div class="flex items-center justify-between gap-2 flex-wrap">
                      <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-2xs flex items-center justify-center">Q${idx + 1}</span>
                        <span class="font-extrabold text-slate-900">${q.concept || course.chapter}</span>
                        <span class="px-2 py-0.5 rounded text-3xs font-mono font-bold bg-slate-200 text-slate-700">${qMax} Marks</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="badge badge-success text-3xs">AI Graded: ${awarded} / ${qMax} M</span>
                        <span class="text-3xs text-emerald-700 font-bold">✓ Verified</span>
                      </div>
                    </div>

                    <p class="text-slate-800 font-medium text-xs leading-relaxed">${q.question || q.text}</p>

                    <!-- Student's Submitted Answer -->
                    <div class="p-3 rounded-lg bg-white border border-slate-200">
                      <span class="text-3xs font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Student's Submission:</span>
                      ${isObj ? `
                        <div class="font-bold text-slate-800 text-xs">
                          ${isAnswered ? `Selected: ${(q.options && q.options[q.selected]) || 'Option A'} ✓` : 'Not Attempted'}
                        </div>
                      ` : `
                        <div class="space-y-1">
                          <p class="text-slate-800 text-xs font-mono bg-slate-50 p-2 rounded border border-slate-200">${q.subjectiveText || 'Derived using FBD: mg sin θ - f = m a, where f = μ mg cos θ. Hence acceleration a = g(sin θ - μ cos θ).'}</p>
                          ${q.photoAttached ? `<span class="badge badge-primary text-3xs">📎 Attached Notebook Photo: ${q.photoAttached}</span>` : '<span class="text-3xs text-slate-500">📎 Handwritten proof submitted digitally</span>'}
                        </div>
                      `}
                    </div>

                    <div class="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-200 text-3xs text-indigo-900 leading-relaxed">
                      <strong>SIKO AI Stepwise Evaluation:</strong> ${isObj ? (q.explanation || 'Matches first-principles governing formula.') : (q.answer_key || 'Stepwise derivation verified against Lecture #2 notes.')}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Teacher Personalized Feedback & Formal Release Bar -->
          <div class="card p-6 bg-white border-2 border-emerald-300 rounded-2xl shadow-md space-y-4 mb-6">
            <div>
              <label class="block font-bold text-slate-900 text-xs mb-1">
                ✍️ Faculty Personalized Mentor Remarks (Released to Student &amp; Parent):
              </label>
              <textarea id="teacherMentorFeedback" rows="3" class="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none bg-slate-50 font-medium">${aiCorr.feedback || `Excellent work on ${course.subject}: ${course.chapter}! You scored 23/26 (88%). Your step-by-step free body diagrams and derivation accuracy matched the lecture markscheme. Keep up the high standard!`}</textarea>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
              <div class="text-2xs text-slate-600">
                <strong class="text-emerald-800 block">✓ Faculty Academic Sign-Off Ready:</strong>
                Releasing delivers the verified scorecard to ${studentName} and unlocks your <strong>Milestone M2 Escrow Payout (₹4,500)</strong>.
              </div>
              <button type="button" class="btn btn-primary btn-lg font-extrabold whitespace-nowrap shadow-md"
                onclick="window.approveAndReleaseHomeworkEvaluation(document.getElementById('teacherMentorFeedback')?.value)">
                ✓ Endorse AI Evaluation &amp; Release to Student &rarr;
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      // STUDENT VIEW: Waiting for Dedicated Master Faculty's Review & Endorsement
      return `
        <div class="container py-8 max-w-4xl">
          ${pipelineBannerHtml}

          <div class="card p-8 bg-amber-50/90 border-2 border-amber-300 rounded-2xl shadow-sm text-center mb-6">
            <div class="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-md">
              ⏳
            </div>
            <span class="badge badge-warning mb-2 font-extrabold uppercase">Step 3: AI-Corrected • Awaiting Teacher Endorsement</span>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Your Homework Has Been Submitted &amp; AI-Corrected!
            </h1>
            <p class="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed mb-6">
              SIKO AI has evaluated your ${questions.length} answers from <strong>${course.subject}: ${course.chapter}</strong>. As per SIKO's academic quality policy, your educator <strong>${course.teacherName}</strong> is reviewing the AI correction, verifying step-by-step marks, and adding personalized mentor remarks.
            </p>

            <div class="max-w-md mx-auto p-4 rounded-xl bg-white border border-amber-200 text-xs text-left mb-6 space-y-2">
              <div class="font-extrabold text-slate-900 flex justify-between">
                <span>Evaluation Review Progress:</span>
                <span class="text-amber-700 font-bold">In Educator's Review Queue</span>
              </div>
              <div class="flex items-center gap-2 text-2xs text-slate-600">
                <span class="text-emerald-600 font-black">✓</span> 1. Student Submission Received
              </div>
              <div class="flex items-center gap-2 text-2xs text-slate-600">
                <span class="text-emerald-600 font-black">✓</span> 2. SIKO AI Multimodal Stepwise Grading Complete
              </div>
              <div class="flex items-center gap-2 text-2xs font-bold text-amber-800">
                <span class="animate-pulse">⏳</span> 3. Faculty Educator Endorsement (In Progress)
              </div>
              <div class="flex items-center gap-2 text-2xs text-slate-400">
                <span>○</span> 4. Verified Scorecard, Daily Study Plan &amp; PTM Report Released to You
              </div>
            </div>

            <!-- Helpful Demonstration Action -->
            <div class="flex flex-wrap justify-center gap-3">
              <button type="button" class="btn btn-primary font-extrabold" onclick="window.switchRole('teacher'); window.navigateView('homework')">
                👩‍🏫 Teacher Action: Open Review Gate &amp; Endorse Evaluation Now &rarr;
              </button>
              <button type="button" class="btn btn-outline" onclick="window.navigateView('student-home')">
                Return to Student Home
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  // STATE 1B: HOMEWORK IS PENDING INITIAL TEACHER RELEASE (Teacher must approve AI questions before release to student)
  if (isPendingTeacher) {
    if (isTeacher) {
      return `
        <div class="container py-8 max-w-4xl">
          ${pipelineBannerHtml}

          <div class="card p-8 bg-amber-50/90 border-2 border-amber-300 rounded-2xl shadow-sm text-center mb-8">
            <div class="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-md">
              👩‍🏫
            </div>
            <span class="badge badge-warning mb-2 font-extrabold uppercase">Gate 2: Question Approval Gate</span>
            <h1 class="text-2xl font-black text-slate-900 mb-2">
              Review AI Questions Before Releasing to Student
            </h1>
            <p class="text-xs text-slate-700 max-w-xl mx-auto leading-relaxed mb-6">
              SIKO AI listened to your lecture on <strong>${course.subject}: ${course.chapter}</strong> and drafted <strong>${questions.length} questions</strong>. Inspect, edit, or swap questions before releasing to ${studentName}.
            </p>

            <div class="flex flex-wrap justify-center gap-3">
              <button type="button" class="btn btn-primary font-extrabold" onclick="window.approveAndReleaseLectureHomework()">
                ✓ Endorse &amp; Release Worksheet to Student Now (Unlocks M2) &rarr;
              </button>
              <button type="button" class="btn btn-outline" onclick="window.setTeacherPortalStep('step3_ai_queue'); window.navigateView('teacher-dashboard')">
                Open Teacher Dashboard Step 3 &rarr;
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="container py-8 max-w-4xl">
          ${pipelineBannerHtml}

          <div class="card p-8 bg-amber-50/90 border-2 border-amber-300 rounded-2xl shadow-sm text-center mb-8">
            <div class="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-md">
              👩‍🏫
            </div>
            <span class="badge badge-warning mb-2 font-extrabold uppercase">Pending Faculty Release</span>
            <h1 class="text-2xl font-black text-slate-900 mb-2">
              Dedicated Master Faculty is Reviewing Today's Post-Lecture Questions
            </h1>
            <p class="text-xs text-slate-700 max-w-xl mx-auto leading-relaxed mb-6">
              SIKO AI synthesized questions based on Lecture #${course.lectureNumber || 2} of <strong>${course.subject}: ${course.chapter}</strong>. Your educator inspects and approves the worksheet first before it appears on your dashboard.
            </p>
            <div class="flex flex-wrap justify-center gap-3">
              <button type="button" class="btn btn-primary font-extrabold" onclick="window.switchRole('teacher'); window.approveAndReleaseLectureHomework(); window.switchRole('student');">
                ⚡ Demo: Teacher Endorse &amp; Release Worksheet Now &rarr;
              </button>
              <button type="button" class="btn btn-outline" onclick="window.navigateView('student-home')">
                Return to Student Home
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  // STATE 2: HOMEWORK COMPLETED -> TRIGGER COMPLETE CHAPTER TEST -> SCHEDULE PTM -> DETAILED PARENT REPORT
  if (hw.completed) {
    const breakdown = Array.isArray(hw.aiEvaluationBreakdown) ? hw.aiEvaluationBreakdown : [];
    return `
      <div class="container py-8 max-w-4xl">
        ${pipelineBannerHtml}

        <div class="text-center mb-6">
          <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-2xl mx-auto mb-2">
            ${Icons.check}
          </div>
          <span class="badge badge-success mb-1">LLM Evaluated • ${course.subject}</span>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 mb-1">Post-Lecture Homework Evaluated!</h1>
          <p class="text-xs text-slate-600">
            All ${questions.length} questions from <strong>${course.subject}: ${course.chapter}</strong> (${course.lectureTopic}) have been graded by SIKO AI.
          </p>
        </div>

        <div class="card p-6 sm:p-8 bg-white border rounded-2xl shadow-sm mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-b pb-6 mb-6">
            <div class="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-200">
              <span class="text-2xs font-bold text-emerald-800 uppercase block mb-1">YOUR HOMEWORK SCORE</span>
              <div class="text-4xl sm:text-5xl font-black text-emerald-700">${hw.score || `${totalMarks - 3} / ${totalMarks}`}</div>
              <span class="text-xs font-semibold text-emerald-900 mt-1 block">${hw.percentage || 88}% Accuracy • ${course.subject} (${course.boardExam})</span>
            </div>

            <div class="space-y-2.5 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-500">Enrolled Subject &amp; Chapter:</span>
                <span class="font-bold text-slate-900">${course.subject} • ${course.chapter}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Lecture Covered:</span>
                <span class="font-bold text-slate-900">Lecture #${course.lectureNumber || 2}: ${course.lectureTopic.slice(0, 42)}...</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Reviewed &amp; Released By:</span>
                <span class="font-bold text-blue-700">${course.teacherName} ✓</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Chapter Lecture Progress:</span>
                <span class="font-extrabold text-emerald-600">${course.lecturesCompleted || 2} of ${course.totalLecturesInChapter || 2} Lectures Completed (100%)</span>
              </div>
            </div>
          </div>

          <!-- Teacher & LLM Personalized Feedback -->
          <div class="mb-6">
            <h4 class="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              SIKO AI &amp; ${course.teacherName} Evaluation Summary
            </h4>
            <div class="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-800 leading-relaxed">
              ${hw.feedback || `Strong conceptual mastery demonstrated across ${course.subject} — ${course.chapter} (${course.lectureTopic}). Your step-by-step derivations in Section B matched the first-principles markscheme taught in Lecture #${course.lectureNumber || 2}. Since all ${course.totalLecturesInChapter || 2} lectures of this chapter are now complete, your End-of-Chapter Assessment is ready below!`}
            </div>
          </div>

          ${breakdown.length > 0 ? `
            <div class="mb-6">
              <h4 class="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5">Question-by-Question AI Grading Breakdown</h4>
              <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
                ${breakdown.map((b, idx) => `
                  <div class="p-3 rounded-lg border ${b.correct ? 'bg-emerald-50/50 border-emerald-200' : 'bg-amber-50/50 border-amber-200'} text-xs flex justify-between items-start gap-3">
                    <div>
                      <span class="font-bold text-slate-900">Q${idx + 1} (${b.concept || course.chapter}):</span>
                      <p class="text-slate-600 text-2xs mt-0.5">${b.comment}</p>
                    </div>
                    <span class="badge ${b.correct ? 'badge-success' : 'badge-warning'} text-2xs whitespace-nowrap">${b.awardedMarks} / ${b.maxMarks} M</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- POST-HOMEWORK AI CALIBRE-BASED DAILY STUDY PLAN (WHERE TO START • WHAT TO STUDY • HOW TO STUDY) -->
          ${(() => {
            const plan = AppState.dailyStudyPlan || (typeof window.generateDailyStudyPlan === 'function' ? window.generateDailyStudyPlan() : null);
            if (!plan) return '';
            const day1 = (Array.isArray(plan.days) && plan.days[0]) || { dayLabel: 'Day 1 (Today)', theme: 'Core Mastery', blocks: [] };
            return `
              <div class="p-5 rounded-2xl bg-emerald-50/60 border-2 border-emerald-300 mb-6 text-xs">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <span class="px-2.5 py-0.5 rounded-full bg-indigo-950 text-amber-300 font-extrabold text-3xs uppercase">
                      🧠 AI Daily Study Plan Updated for Your Calibre (${plan.calibreLabel})
                    </span>
                    <h4 class="text-sm font-black text-slate-900 mt-1">
                      Zero-Decision-Fatigue Next Steps (${plan.currentScoreText} &rarr; ${plan.targetScoreText})
                    </h4>
                  </div>
                  <button type="button" onclick="window.navigateView('student-home')" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-2xs cursor-pointer border-0">
                    Open Full 7-Day Planner &rarr;
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  ${(day1.blocks || []).slice(0, 3).map(b => `
                    <div class="p-3 rounded-xl bg-white border border-emerald-200 space-y-1">
                      <div class="font-black text-slate-900 text-xs">${b.slot}: ${b.title}</div>
                      <div class="text-2xs text-slate-700"><strong>📍 Start:</strong> ${b.whereToStart}</div>
                      <div class="text-2xs text-slate-700"><strong>📘 What:</strong> ${b.whatToStudy}</div>
                      <div class="text-2xs text-slate-700"><strong>🧠 How:</strong> ${b.howToStudy}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          })()}

          <!-- NEXT STAGE: COMPLETE CHAPTER -> CHAPTER TEST -> PTM SCHEDULING & PARENT REPORT -->
          <div class="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 text-white border border-purple-400/40 shadow-lg">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span class="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-3xs font-extrabold uppercase">
                  🏁 Chapter Completion Milestone Unlocked
                </span>
                <h3 class="text-lg font-black text-white mt-1">
                  Chapter Complete: ${course.subject} — ${course.chapter}
                </h3>
                <p class="text-xs text-indigo-200 mt-1 max-w-xl">
                  You have completed all lectures and post-lecture homework for <strong>${course.chapter}</strong>. Next step: generate &amp; complete the <strong>End-of-Chapter Test</strong>, which automatically schedules the <strong>Parent-Teacher Meeting (PTM)</strong> and dispatches your detailed academic report to your parent.
                </p>
              </div>

              <div class="flex flex-col sm:flex-row gap-2.5">
                ${!course.chapterTestCompleted ? `
                  <button type="button" class="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs cursor-pointer border-0 shadow-md" onclick="window.generateEndOfChapterTest()">
                    📝 Generate &amp; Take End-of-Chapter Test (LLM) &rarr;
                  </button>
                  <button type="button" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs cursor-pointer border-0 shadow-md" onclick="window.completeChapterTestAndSchedulePtm()">
                    ⚡ Instant Complete Chapter Test + Schedule PTM &amp; Parent Report &rarr;
                  </button>
                ` : `
                  <button type="button" class="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs cursor-pointer border-0 shadow-md" onclick="window.navigateView('ptm-view')">
                    📊 View Scheduled PTM &amp; Detailed Parent Report (${course.chapterTestScore}) &rarr;
                  </button>
                  <button type="button" class="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs cursor-pointer border border-white/20" onclick="window.switchRole('parent'); window.navigateView('parent-dashboard')">
                    👨‍👩‍👧 Open Parent Dashboard &rarr;
                  </button>
                `}
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap justify-between items-center gap-3">
          <button type="button" class="btn btn-outline btn-sm" onclick="AppState.homeworkData.completed = false; window.notifyStateChange()">
            ↺ Re-Attempt / View Questions
          </button>
          <button type="button" class="btn btn-primary btn-sm" onclick="window.navigateView('student-home')">
            Return to Student Command Centre
          </button>
        </div>
      </div>
    `;
  }

  // STATE 3: ACTIVE DYNAMIC LLM HOMEWORK
  if (isTeacher) {
    return `
      <div class="container py-8 max-w-4xl">
        ${pipelineBannerHtml}

        <div class="card p-8 bg-white border rounded-2xl shadow-sm text-center mb-6">
          <div class="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-sm">
            👩‍🏫
          </div>
          <span class="badge badge-success mb-2 font-extrabold uppercase">✓ Worksheet Released to Student</span>
          <h1 class="text-2xl font-black text-slate-900 mb-2">
            Awaiting Student Submission: ${studentName}
          </h1>
          <p class="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed mb-6">
            You have approved and released this <strong>${course.subject}: ${course.chapter}</strong> post-lecture homework (${questions.length} questions). ${studentName} is currently completing the derivations and solutions.
          </p>

          <div class="p-4 rounded-xl bg-slate-50 border max-w-md mx-auto text-xs text-left mb-6 space-y-2">
            <div class="flex justify-between font-bold text-slate-800">
              <span>Expected Next Action:</span>
              <span class="text-blue-700 font-extrabold">Student Submits Homework</span>
            </div>
            <p class="text-2xs text-slate-500">
              As soon as ${studentName} submits, SIKO AI will correct the paper and queue the evaluation in your review gate for final faculty verification.
            </p>
          </div>

          <div class="flex flex-wrap justify-center gap-3">
            <button type="button" class="btn btn-primary font-extrabold" onclick="window.switchRole('student'); window.navigateView('homework');">
              👩‍🎓 Switch to Student Persona to Solve Worksheet (Demo) &rarr;
            </button>
            <button type="button" class="btn btn-outline" onclick="window.setTeacherPortalStep('step3_ai_queue'); window.navigateView('teacher-dashboard');">
              Return to Teacher Dashboard Step 3
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="container py-8 max-w-4xl">
      ${pipelineBannerHtml}

      <!-- Breadcrumb & Teacher Approval Stamp -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div class="flex items-center gap-2 text-xs text-slate-500">
          <a href="#" onclick="window.navigateView('student-home')" class="hover:underline">Student Home</a>
          <span>/</span>
          <span class="text-slate-900 font-bold">${course.subject} Post-Lecture Homework</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="badge badge-success text-2xs">✓ Reviewed &amp; Released by ${course.teacherName}</span>
          <span class="badge badge-warning text-2xs">Due ${hw.due || 'Tomorrow, 6:00 PM'}</span>
        </div>
      </div>

      <!-- Homework Title Header -->
      <div class="card p-6 bg-white border rounded-2xl shadow-sm mb-6">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="badge badge-primary text-2xs">Enrolled Subject: ${course.subject}</span>
            <span class="badge badge-neutral text-2xs">Lecture #${course.lectureNumber || 2} Based</span>
            <span class="badge badge-neutral text-2xs">${course.boardExam}</span>
          </div>
          <button type="button" onclick="window.regenerateDynamicHomeworkWithLlm()" class="text-2xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
            ${Icons.sparkles} Regenerate Fresh LLM Questions from Lecture
          </button>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">${hw.title}</h1>
        <p class="text-xs text-slate-600">
          Strictly generated from <strong>${course.teacherName}'s</strong> lecture on <strong>${course.lectureTopic}</strong> • ${questions.length} Questions (${objectiveQs.length} Objective + ${subjectiveQs.length} Subjective) • Total Marks: <strong>${totalMarks}</strong>
        </p>
      </div>

      <!-- SECTION A: DYNAMIC OBJECTIVE QUESTIONS -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4 pb-2 border-b">
          <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span class="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold">A</span>
            Section A: Objective Questions from Lecture (${course.subject} — ${course.chapter})
          </h3>
          <span class="text-2xs font-bold text-slate-500">${objMarks} Marks Total</span>
        </div>

        ${objectiveQs.map((q, idx) => {
          const globalIndex = questions.indexOf(q);
          const qText = q.question || q.text || '';
          const opts = Array.isArray(q.options) ? q.options : [];
          return `
            <div class="card p-6 bg-white border rounded-2xl shadow-sm mb-5">
              <div class="flex flex-wrap justify-between items-center pb-3 border-b mb-4 gap-2">
                <div class="flex items-center gap-2">
                  <span class="font-extrabold text-xs text-blue-700 uppercase">Question ${idx + 1} of ${questions.length} • ${(q.type || 'MCQ').toUpperCase()} (${q.marks || 4} Marks)</span>
                  <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-3xs font-semibold">${q.concept || course.chapter}</span>
                </div>
                <span class="text-2xs text-slate-400">From ${course.teacherName}'s Lecture</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-900 font-semibold leading-relaxed mb-4 whitespace-pre-line">${qText}</p>
              <div class="space-y-2.5 text-xs">
                ${opts.map((opt, oIdx) => `
                  <div class="p-3.5 rounded-xl border transition-all ${q.selected === oIdx ? 'border-blue-600 bg-blue-50/90 font-bold text-blue-950 shadow-xs' : 'border-slate-200 hover:border-blue-400 bg-white text-slate-800'} cursor-pointer flex items-center justify-between"
                       onclick="window.selectHwOption(${globalIndex}, ${oIdx})">
                    <span>${opt}</span>
                    ${q.selected === oIdx ? '<span class="text-blue-600 font-extrabold text-2xs">✓ Selected</span>' : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- SECTION B: DYNAMIC SUBJECTIVE QUESTIONS (WITH HANDWRITTEN PHOTO UPLOAD) -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4 pb-2 border-b">
          <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span class="w-6 h-6 rounded bg-purple-600 text-white flex items-center justify-center text-xs font-extrabold">B</span>
            Section B: Subjective Derivations &amp; Analytical Problems (${course.subject})
          </h3>
          <span class="text-2xs font-bold text-slate-500">${subjMarks} Marks Total</span>
        </div>

        ${subjectiveQs.map((q, sIdx) => {
          const globalIndex = questions.indexOf(q);
          const qNum = objectiveQs.length + sIdx + 1;
          const qText = q.question || q.text || '';
          return `
            <div class="card p-6 bg-white border rounded-2xl shadow-sm mb-5">
              <div class="flex flex-wrap justify-between items-center pb-3 border-b mb-4 gap-2">
                <div class="flex items-center gap-2">
                  <span class="font-extrabold text-xs text-purple-700 uppercase">Question ${qNum} of ${questions.length} • ${(q.type || 'Subjective Derivation').replace('_', ' ').toUpperCase()} (${q.marks || 5} Marks)</span>
                  <span class="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 text-3xs font-semibold">${q.concept || course.chapter}</span>
                </div>
                <span class="text-2xs text-slate-400">Stepwise AI Rubric Evaluation</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-900 font-semibold leading-relaxed mb-3 whitespace-pre-line">${qText}</p>
              <textarea
                id="hwSubjInput_${globalIndex}"
                oninput="window.setHwSubjectiveAnswer(${globalIndex}, this.value)"
                class="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-purple-600 focus:outline-none mb-3"
                rows="3"
                placeholder="Type your step-by-step ${course.subject} derivation or solution here, or attach a photo of your notebook below...">${q.subjectiveText || ''}</textarea>

              <div class="flex flex-wrap justify-between items-center gap-2 text-2xs">
                <div class="flex items-center gap-2 flex-wrap">
                  <label class="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold cursor-pointer inline-flex items-center gap-1.5">
                    📷 Take Photo / Upload Notebook Step
                    <input type="file" accept="image/*" capture="environment" class="hidden" onchange="window.attachHwSubjectivePhoto(${globalIndex}, this)" />
                  </label>
                  ${q.photoAttached ? `<span class="badge badge-success text-3xs">📎 Attached: ${q.photoAttached}</span>` : ''}
                  <button type="button" class="btn btn-outline btn-xs text-purple-700 border-purple-300" onclick="window.showToast('💡 AI Rubric: ${(q.rubric || q.answer_key || 'Stepwise marks for governing formula and substitution').replace(/'/g, '')}', 'info')">
                    💡 View Official Scoring Rubric
                  </button>
                </div>
                <span class="text-slate-400">Evaluated by SIKO Multimodal LLM</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Submission Footer -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-white border-2 border-indigo-200 rounded-2xl shadow-sm">
        <div class="text-xs text-slate-600">
          <div class="font-bold text-slate-900">Ready to submit your ${course.subject} Post-Lecture Homework?</div>
          <div>SIKO AI will immediately correct your answers, and <strong>${course.teacherName}</strong> will review and release your verified scorecard.</div>
        </div>
        <button type="button" class="btn btn-primary btn-lg font-extrabold whitespace-nowrap" onclick="window.submitHomework()">
          Submit for AI Correction &amp; Teacher Review &rarr;
        </button>
      </div>
    </div>
  `;
}
