/**
 * SIKO CLASS COMPLETION VIEW
 * "Class complete. Great work!"
 * Summarizes topic covered, attendance record, duration, and AI-generated post-lecture worksheet.
 */

import { AppState } from '../state.js';
import { Icons, HomeworkCard } from '../components.js';

export function renderClassCompletion() {
  const isTeacher = AppState.currentRole === 'teacher';
  const dossier = AppState.latestSessionDossier || (AppState.reviewQueue && AppState.reviewQueue[0]) || {
    chapter: "Newton's Laws & Friction",
    difficulty_tier: "Advanced",
    questions_count: 8,
    objective_count: 4,
    subjective_count: 4,
    payout_linked_amount: 4500,
    lecture_topics_covered: ["FBD on Incline", "Normal Reaction", "Static vs Kinetic Limiting Friction", "Angle of Repose"]
  };

  return `
    <div class="container py-12 max-w-3xl">
      <!-- Success Icon & Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-2xl mx-auto mb-4">
          ${Icons.check}
        </div>
        <span class="badge badge-success mb-2">Session Concluded</span>
        <h1 class="text-3xl font-extrabold text-slate-900 mb-1">
          ${isTeacher ? 'Class Completed Successfully' : 'Class Complete! Great Work Today.'}
        </h1>
        <p class="text-slate-600 text-sm">
          ${isTeacher 
            ? 'Attendance registered in academic ledger. AI Lecture Listener generated post-lecture worksheet and queued for your review.'
            : 'Your attendance and active engagement has been credited to your Academic Health score.'
          }
        </p>
      </div>

      <!-- Class Session Ledger Card -->
      <div class="card p-8 bg-white border rounded-2xl shadow-sm mb-8">
        <div class="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 class="text-base font-bold text-slate-900">
            Session Dossier
          </h3>
          <span class="badge badge-primary text-2xs">Live Transcribed</span>
        </div>

        <div class="space-y-3 text-xs mb-6">
          <div class="flex justify-between py-1.5 border-b border-slate-100">
            <span class="text-slate-500">Course & Chapter:</span>
            <span class="font-bold text-slate-900">JEE Physics • ${dossier.chapter || "Newton's Laws & Friction"}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-slate-100">
            <span class="text-slate-500">Topics Mastered in Lecture:</span>
            <span class="font-bold text-slate-900">${(dossier.lecture_topics_covered || ["FBD on Incline", "Normal Reaction", "Static vs Kinetic Friction"]).join(', ')}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-slate-100">
            <span class="text-slate-500">Class Duration:</span>
            <span class="font-bold text-slate-900">60 Minutes Full Instruction</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-slate-100">
            <span class="text-slate-500">Attendance Status:</span>
            <span class="font-bold text-emerald-600">Present (100% Session Time)</span>
          </div>
          <div class="flex justify-between py-1.5">
            <span class="text-slate-500">Session Recording & Whiteboard:</span>
            <span class="font-bold text-blue-600">Saved to Notes Archive</span>
          </div>
        </div>

        <!-- AI Post-Lecture Automated Worksheet Card -->
        <div class="p-5 rounded-xl bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-purple-50/50 border border-indigo-200/80 mb-6">
          <div class="flex justify-between items-start mb-3 flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                🎙️
              </span>
              <div>
                <h4 class="font-bold text-sm text-indigo-950">AI Lecture Listener: Post-Lecture Official Question Paper</h4>
                <p class="text-2xs text-indigo-700">Synthesized dynamically from faculty lecture in <strong>${dossier.exam_track || 'Official Board / Competitive Exam'}</strong> format</p>
              </div>
            </div>
            ${dossier.status === 'released' ? `
              <span class="badge badge-success text-2xs uppercase font-extrabold">✓ Approved &amp; Released (M2 Paid)</span>
            ` : `
              <span class="badge badge-warning text-2xs uppercase font-bold">Pending Faculty Review</span>
            `}
          </div>

          <div class="grid grid-cols-3 gap-3 text-2xs mb-4">
            <div class="p-2.5 rounded-lg bg-white/80 border border-indigo-100">
              <span class="text-slate-500 block mb-0.5">Section A: Objective</span>
              <strong class="text-slate-900 text-xs">${dossier.objective_count || 4} Questions</strong>
              <span class="text-slate-400 block text-3xs">MCQ, Numerical, Assertion-Reason</span>
            </div>
            <div class="p-2.5 rounded-lg bg-white/80 border border-indigo-100">
              <span class="text-slate-500 block mb-0.5">Section B: Subjective</span>
              <strong class="text-slate-900 text-xs">${dossier.subjective_count || 4} Questions</strong>
              <span class="text-slate-400 block text-3xs">Derivation, FBD, Case Study + Photo</span>
            </div>
            <div class="p-2.5 rounded-lg bg-white/80 border border-indigo-100">
              <span class="text-slate-500 block mb-0.5">Escrow Milestone M2</span>
              <strong class="text-emerald-700 text-xs">₹${dossier.payout_linked_amount || 4500} (${dossier.status === 'released' ? 'Released ✓' : 'In Escrow'})</strong>
              <span class="text-slate-400 block text-3xs">Auto-released on faculty approval</span>
            </div>
          </div>

          <div class="p-3 rounded-lg bg-indigo-950 text-indigo-200 text-2xs flex flex-wrap items-center justify-between gap-2">
            <span>🧬 <strong>Student Learning DNA Alignment:</strong> Calibrated for ${(AppState.learningDna && AppState.learningDna.difficultyTier) || 'Advanced'} Tier &amp; First-Principles</span>
            <div class="flex items-center gap-2">
              ${dossier.status !== 'released' ? `
                ${isTeacher ? `
                  <button class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-2xs cursor-pointer border-0 shadow-xs" onclick="window.approveReviewItem('worksheet', '${dossier.id || ''}')">
                    ✓ Teacher: Approve &amp; Release Homework + Unlock M2 (₹4,500)
                  </button>
                ` : `
                  <span class="badge badge-warning text-2xs">Pending Dedicated Master Faculty's Endorsement</span>
                `}
              ` : `
                ${isTeacher ? `
                  <button class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-2xs cursor-pointer border-0 shadow-xs" onclick="window.setTeacherPortalStep('step3_ai_queue'); window.navigateView('teacher-dashboard')">
                    👩‍🏫 Step 3: Post-Lecture Review &amp; Evaluation Gate &rarr;
                  </button>
                ` : `
                  <button class="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-2xs cursor-pointer border-0 shadow-xs" onclick="window.navigateView('homework')">
                    📘 Open Released Practice Homework &rarr;
                  </button>
                  <button class="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-2xs cursor-pointer border-0 shadow-xs" onclick="window.startAssignedStudentTest()">
                    ⏱️ Open Released Chapter Test &rarr;
                  </button>
                `}
              `}
            </div>
          </div>
        </div>

        <!-- Assigned Homework Callout -->
        <div>
          <h4 class="text-sm font-bold text-slate-900 mb-3">Assigned Practice Homework &amp; Post-Lecture Paper</h4>
          ${HomeworkCard({ homework: AppState.homeworkData })}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap items-center justify-center gap-4">
        <button class="btn btn-outline" onclick="window.navigateView('${isTeacher ? 'teacher-dashboard' : 'student-home'}')">
          Return to Dashboard
        </button>
        ${dossier.status !== 'released' ? `
          ${isTeacher ? `
            <button class="btn btn-primary" onclick="window.approveReviewItem('worksheet', '${dossier.id || ''}')">
              ✓ Teacher Approve &amp; Release Homework + M2 Payout (₹4,500) &rarr;
            </button>
          ` : `
            <button class="btn btn-primary" onclick="window.navigateView('homework')">
              View Homework Status &rarr;
            </button>
          `}
        ` : `
          ${isTeacher ? `
            <button class="btn btn-primary" onclick="window.setTeacherPortalStep('step3_ai_queue'); window.navigateView('teacher-dashboard')">
              👩‍🏫 Open Step 3: Homework &amp; Evaluation Gate &rarr;
            </button>
          ` : `
            <button class="btn btn-primary" onclick="window.navigateView('homework')">
              📘 Open Practice Homework &rarr;
            </button>
            <button class="btn btn-outline" onclick="window.startAssignedStudentTest()">
              ⏱️ Open Post-Lecture Test &rarr;
            </button>
          `}
        `}
      </div>
    </div>
  `;
}
