/**
 * SIKO ASSESSMENT EXPERIENCE (CBT Examination Interface)
 * Professional Computer-Based Testing environment:
 * Timer, Question Palette, Mark for Review, Section Navigation, and Clean Math Layout.
 */

import { AppState } from '../state.js';
import { Icons } from '../components.js';

export function renderAssessment() {
  const exam = AppState.assessmentData;
  const currentQ = exam.questions[exam.currentQuestionIndex] || exam.questions[6];

  const minutesRemaining = Math.floor(exam.remainingSeconds / 60);
  const secondsRemaining = exam.remainingSeconds % 60;
  const timerFormatted = `${minutesRemaining}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;

  return `
    <div class="cbt-exam-shell h-screen flex flex-col bg-slate-100 overflow-hidden select-none">
      <!-- CBT Exam Top Bar -->
      <header class="cbt-exam-header h-14 bg-slate-900 text-white flex items-center justify-between px-6 border-b border-slate-800 flex-shrink-0">
        <div class="flex items-center gap-3">
          <span class="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center font-black text-sm">S</span>
          <div>
            <h1 class="text-sm font-bold leading-tight">${exam.title}</h1>
            <span class="text-2xs text-slate-400">Section: Physics Mechanics • 3-Strike Tab-Switch Proctoring Active</span>
          </div>
        </div>

        <div class="cbt-exam-header-actions flex items-center gap-4">
          <!-- 3-Strike Tab-Switch Proctor Shield -->
          <div class="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
            <span id="cbtTabStrikeBadge" class="px-2 py-0.5 rounded-full text-2xs font-extrabold ${(exam.tabSwitchStrikes || 0) === 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'}">
              🛡️ Proctor: ${exam.tabSwitchStrikes || 0}/3 Tab Warnings
            </span>
            <button type="button" onclick="window.recordExamTabSwitchStrike('manual_test')" class="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/40 text-3xs font-bold cursor-pointer">
              ⚡ Simulate Tab Switch
            </button>
          </div>

          <!-- Live Countdown Timer -->
          <div class="flex items-center gap-2 bg-slate-800 px-3.5 py-1.5 rounded-lg border border-slate-700">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-amber-400">${Icons.clock}</span>
            <div id="cbtAssessmentLiveTimer" class="font-mono text-sm font-bold text-amber-300">${timerFormatted}</div>
          </div>

          <button class="btn btn-secondary btn-sm font-bold" onclick="window.confirmSubmitExam()">
            Submit Examination
          </button>
        </div>
      </header>

      <!-- Main Examination Workspace -->
      <div class="cbt-exam-workspace flex flex-1 overflow-hidden">
        <!-- Question Area (Left / Center) -->
        <main class="cbt-exam-main flex-1 flex flex-col bg-white overflow-y-auto p-8 border-r border-slate-200">
          <div class="flex flex-wrap justify-between items-center gap-2 pb-4 border-b border-slate-200 mb-6">
            <div class="flex items-center gap-3">
              <span class="text-base font-extrabold text-blue-700">Question ${currentQ.id} of ${exam.totalQuestions}</span>
              <span class="badge badge-primary text-2xs">+4 Marks • -1 Negative</span>
            </div>
            <button class="btn btn-ghost btn-sm text-xs text-amber-700 font-semibold" onclick="window.markForReview(${currentQ.id})">
              ★ Mark for Review
            </button>
          </div>

          <!-- Question Body -->
          <div class="text-sm text-slate-800 leading-relaxed font-serif mb-8 p-4 bg-slate-50/70 rounded-xl border border-slate-200">
            ${currentQ.text}
          </div>

          <!-- Answer Options -->
          <div class="space-y-3 max-w-xl mb-6">
            ${(currentQ.options || [
              'A. 0.5 mg',
              'B. 1.0 mg',
              'C. 1.5 mg',
              'D. 2.0 mg'
            ]).map((opt, idx) => `
              <label class="flex items-center gap-3 p-3.5 rounded-xl border ${currentQ.selected === idx ? 'border-blue-600 bg-blue-50/50 font-bold' : 'border-slate-200 hover:border-blue-300'} cursor-pointer text-xs">
                <input type="radio" name="cbtOption" ${currentQ.selected === idx ? 'checked' : ''} onchange="window.selectCbtOption(${idx})" />
                <span class="text-slate-800">${opt}</span>
              </label>
            `).join('')}
          </div>

          <!-- Optional Handwritten Work / Photo Attachment for Step Verification -->
          <div class="max-w-xl p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-wrap items-center justify-between gap-3 mb-6 text-xs">
            <div>
              <strong class="text-blue-950 block">📸 Attach Handwritten Rough Work / Subjective Steps (Optional)</strong>
              <span class="text-2xs text-slate-600">${currentQ.attachedPhotoName ? `Attached: ${currentQ.attachedPhotoName} (OCR Verified ✓)` : 'Snap a photo of your derivation sheet for AI step-by-step feedback'}</span>
            </div>
            <button type="button" class="btn btn-outline btn-xs font-bold shrink-0" onclick="window.attachAssessmentPhoto(${exam.currentQuestionIndex})">
              📸 Take / Attach Photo
            </button>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="mt-auto pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button class="btn btn-outline btn-sm text-slate-600" onclick="window.clearCbtResponse()">
              Clear Response
            </button>

            <div class="flex flex-wrap items-center gap-3">
              <button class="btn btn-outline btn-sm" onclick="window.markForReviewAndNext()">
                Mark for Review & Next
              </button>
              <button class="btn btn-primary btn-sm" onclick="window.saveAndNext()">
                Save & Next &rarr;
              </button>
            </div>
          </div>
        </main>

        <!-- Right Side: Question Palette & Navigation -->
        <aside class="cbt-exam-palette w-80 bg-slate-50 flex flex-col p-6 overflow-y-auto flex-shrink-0">
          <div class="mb-6">
            <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Question Palette</h4>
            <div class="grid grid-cols-2 gap-2 text-2xs mb-4">
              <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-emerald-500"></span> Answered (6)</div>
              <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-amber-500"></span> Marked (1)</div>
              <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-slate-300"></span> Not Visited (13)</div>
            </div>

            <!-- Numbers Grid -->
            <div class="cbt-palette-grid grid grid-cols-5 gap-2">
              ${Array.from({ length: 20 }).map((_, i) => {
                const qNum = i + 1;
                let bgClass = 'bg-white border-slate-300 text-slate-700';
                if (qNum <= 6) bgClass = 'bg-emerald-600 border-emerald-600 text-white font-bold';
                else if (qNum === 7) bgClass = 'bg-blue-600 border-blue-600 text-white font-bold ring-2 ring-blue-300';
                else if (qNum === 4) bgClass = 'bg-amber-500 border-amber-500 text-white font-bold';

                return `
                  <button class="w-10 h-10 rounded-lg border flex items-center justify-center text-xs ${bgClass}" onclick="window.jumpToQuestion(${i})">
                    ${qNum}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Candidate Details Mini-Card -->
          <div class="mt-auto p-4 bg-white rounded-xl border border-slate-200 text-xs">
            <div class="font-bold text-slate-900">Candidate: Enrolled Student</div>
            <div class="text-2xs text-slate-500">Roll: SIKO-2026-JEE-0914</div>
          </div>
        </aside>
      </div>
    </div>
  `;
}
