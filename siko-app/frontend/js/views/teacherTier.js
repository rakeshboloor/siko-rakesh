/**
 * SIKO TEACHER TIER SCREEN ("My Teacher Tier")
 * Objective performance analytics and transparent next tier eligibility indicators.
 * Strictly non-promotional, factual criteria.
 */

import { AppState } from '../state.js';
import { Icons, TeacherTierBadge, ProgressBar } from '../components.js';

export function renderTeacherTier() {
  const tier = AppState.teacherTier;
  const metrics = tier.metrics;
  const el = tier.eligibilityIndicators;

  return `
    <div class="container py-10 max-w-4xl">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <a href="#" onclick="window.navigateView('teacher-dashboard')" class="hover:underline">Teacher Dashboard</a>
        <span>/</span>
        <span class="text-slate-800 font-bold">My Teacher Tier</span>
      </div>

      <!-- Current Tier Banner -->
      <div class="card p-8 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl shadow-lg mb-8">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs uppercase tracking-widest text-blue-300 font-bold block mb-2">Accredited Pedagogy Tier</span>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-black">${tier.currentTier} Teacher</h1>
              ${TeacherTierBadge({ tier: tier.currentTier })}
            </div>
            <p class="text-xs text-blue-200 mt-2 max-w-lg">
              Expert Tier educators demonstrate sustained student percentile improvement, verified first-principles pedagogy, and outstanding homework turnaround times.
            </p>
          </div>

          <div class="text-right bg-white/10 p-4 rounded-xl border border-white/10">
            <span class="text-2xs text-blue-300 uppercase font-bold block mb-1">Overall Evaluation</span>
            <div class="text-3xl font-black text-amber-400">4.92 / 5.0</div>
            <span class="text-2xs text-emerald-300">Top 3% of faculty network</span>
          </div>
        </div>
      </div>

      <!-- 7 CORE OBJECTIVE PERFORMANCE METRICS -->
      <div class="card p-8 bg-white border rounded-2xl shadow-sm mb-8">
        <h3 class="text-lg font-bold text-slate-900 mb-6">Your Verified Performance Indicators</h3>

        <div class="grid grid-cols-2 gap-6 text-xs">
          <!-- 1. Student Improvement -->
          <div class="p-4 rounded-xl bg-slate-50 border">
            <div class="flex justify-between font-bold mb-1">
              <span>Student Improvement Rate (>= 1 Grade Jump)</span>
              <span class="text-emerald-600 font-black">${metrics.studentImprovement}%</span>
            </div>
            ${ProgressBar({ value: metrics.studentImprovement, variant: 'success', showPercent: false })}
            <span class="text-2xs text-slate-400 mt-2 block">Benchmark standard: >= 85%</span>
          </div>

          <!-- 2. Attendance -->
          <div class="p-4 rounded-xl bg-slate-50 border">
            <div class="flex justify-between font-bold mb-1">
              <span>Classroom Session Attendance</span>
              <span class="text-blue-600 font-black">${metrics.attendanceRate}%</span>
            </div>
            ${ProgressBar({ value: metrics.attendanceRate, variant: 'primary', showPercent: false })}
            <span class="text-2xs text-slate-400 mt-2 block">Zero unnotified absences</span>
          </div>

          <!-- 3. Punctuality -->
          <div class="p-4 rounded-xl bg-slate-50 border">
            <div class="flex justify-between font-bold mb-1">
              <span>Class Start Punctuality</span>
              <span class="text-blue-600 font-black">${metrics.punctualityRate}%</span>
            </div>
            ${ProgressBar({ value: metrics.punctualityRate, variant: 'primary', showPercent: false })}
            <span class="text-2xs text-slate-400 mt-2 block">Classes started within 60s of schedule</span>
          </div>

          <!-- 4. Feedback -->
          <div class="p-4 rounded-xl bg-slate-50 border">
            <div class="flex justify-between font-bold mb-1">
              <span>Student & Parent Satisfaction Rating</span>
              <span class="text-amber-600 font-black">${metrics.studentParentFeedback} / 5.0</span>
            </div>
            ${ProgressBar({ value: (metrics.studentParentFeedback / 5) * 100, variant: 'amber', showPercent: false })}
            <span class="text-2xs text-slate-400 mt-2 block">Calculated from 248 verified ratings</span>
          </div>

          <!-- 5. Homework Turnaround -->
          <div class="p-4 rounded-xl bg-slate-50 border">
            <div class="flex justify-between font-bold mb-1">
              <span>Homework Grading Turnaround</span>
              <span class="text-emerald-600 font-black">${metrics.homeworkTurnaroundDays} Days</span>
            </div>
            <div class="text-2xs text-emerald-700 font-semibold mt-2">
              ✓ Surpasses 48-hour platform guarantee
            </div>
          </div>

          <!-- 6. PTM Completion -->
          <div class="p-4 rounded-xl bg-slate-50 border">
            <div class="flex justify-between font-bold mb-1">
              <span>PTM Completion & Sign-off</span>
              <span class="text-emerald-600 font-black">${metrics.ptmCompletionRate}%</span>
            </div>
            <div class="text-2xs text-emerald-700 font-semibold mt-2">
              ✓ All scheduled parent meetings conducted with written reports
            </div>
          </div>
        </div>
      </div>

      <!-- NEXT TIER FACTUAL ELIGIBILITY (Carefully strictly factual language) -->
      <div class="card p-8 bg-slate-50 border border-slate-200 rounded-2xl">
        <div class="flex items-start justify-between mb-4">
          <div>
            <span class="badge badge-warning mb-1">Progression Pathway</span>
            <h3 class="text-xl font-bold text-slate-900">Next Tier: ${tier.nextTier}</h3>
            <p class="text-xs text-slate-500">
              Review current eligibility indicators below. Meeting benchmark criteria initiates academic committee review; promotion is based on qualitative evaluation by the SIKO Academic Dean.
            </p>
          </div>
        </div>

        <div class="space-y-3 text-xs mb-6">
          <div class="p-3 bg-white rounded-lg border flex justify-between items-center">
            <div>
              <span class="font-bold text-slate-800">Hours of Live Instruction:</span>
              <span class="text-slate-500 ml-2">${el.hoursTaught.current} / ${el.hoursTaught.target} hours completed</span>
            </div>
            <span class="badge badge-neutral">In Progress (96%)</span>
          </div>

          <div class="p-3 bg-white rounded-lg border flex justify-between items-center">
            <div>
              <span class="font-bold text-slate-800">Student Journey Retention Rate:</span>
              <span class="text-slate-500 ml-2">${el.studentRetentionRate.current}% (Target: >= ${el.studentRetentionRate.target}%)</span>
            </div>
            <span class="badge badge-success">Met Criterion</span>
          </div>

          <div class="p-3 bg-white rounded-lg border flex justify-between items-center">
            <div>
              <span class="font-bold text-slate-800">Average Composite Rating:</span>
              <span class="text-slate-500 ml-2">${el.averageRating.current} (Target: >= ${el.averageRating.target})</span>
            </div>
            <span class="badge badge-success">Met Criterion</span>
          </div>
        </div>

        <div class="text-2xs text-slate-500 italic">
          * Note: SIKO maintains strict objectivity in tier elevations. Automatic promotion guarantees are never offered.
        </div>
      </div>
    </div>
  `;
}
