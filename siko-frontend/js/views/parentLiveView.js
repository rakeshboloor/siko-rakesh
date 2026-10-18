/**
 * SIKO PARENT LIVE VIEW
 * "Do NOT put parent inside the Jitsi classroom by default."
 * Non-intrusive live telemetry:
 * CLASS IN PROGRESS, Teacher, Subject, Started, Attendance, Learning objective, Homework.
 */

import { AppState } from '../state.js';
import { Icons, ProgressBar } from '../components.js';

export function renderParentLiveView() {
  const p = AppState.parentData;
  const child = p.children[0];

  return `
    <div class="container py-12 max-w-3xl">
      <!-- Breadcrumb & Back -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2 text-xs text-slate-500">
          <a href="#" onclick="window.navigateView('parent-dashboard')" class="hover:underline">Parent Dashboard</a>
          <span>/</span>
          <span class="text-slate-800 font-bold">Parent Live View</span>
        </div>
        <button class="btn btn-outline btn-sm" onclick="window.navigateView('parent-dashboard')">
          &larr; Back to Dashboard
        </button>
      </div>

      <!-- MAIN TELEMETRY CARD -->
      <div class="card p-8 bg-white border rounded-2xl shadow-md mb-8">
        <!-- Live Indicator Banner -->
        <div class="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
          <div class="flex items-center gap-3">
            <span class="relative flex h-4 w-4">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
            <div>
              <span class="text-xs uppercase tracking-wider text-red-600 font-black">CLASS IN PROGRESS</span>
              <h1 class="text-2xl font-black text-slate-900">Live Classroom Telemetry</h1>
            </div>
          </div>

          <span class="badge badge-success text-xs font-bold py-1 px-3">
            ${Icons.check} ${child.name} is Present
          </span>
        </div>

        <!-- Telemetry Attributes Table -->
        <div class="space-y-4 text-sm mb-8">
          <div class="flex justify-between py-2 border-b border-slate-100">
            <span class="text-slate-500">Subject & Chapter:</span>
            <span class="font-extrabold text-slate-900">${p.nextClass.subject} • Laws of Motion & Friction</span>
          </div>

          <div class="flex justify-between py-2 border-b border-slate-100">
            <span class="text-slate-500">Teacher:</span>
            <span class="font-extrabold text-blue-700">${p.nextClass.teacher} (Expert Tier)</span>
          </div>

          <div class="flex justify-between py-2 border-b border-slate-100">
            <span class="text-slate-500">Session Started:</span>
            <span class="font-bold text-slate-800">7:01 PM IST (28 Minutes Elapsed)</span>
          </div>

          <div class="flex justify-between py-2 border-b border-slate-100">
            <span class="text-slate-500">Student Attendance:</span>
            <span class="font-bold text-emerald-600 flex items-center gap-1.5">
              ${Icons.check} Present (Joined at 7:00 PM IST)
            </span>
          </div>

          <div class="flex justify-between py-2 border-b border-slate-100">
            <span class="text-slate-500">Live Learning Objective:</span>
            <span class="font-bold text-slate-900 max-w-sm text-right">
              Free Body Diagrams & Angle of Repose Derivations
            </span>
          </div>

          <div class="flex justify-between py-2 border-b border-slate-100">
            <span class="text-slate-500">Homework Status:</span>
            <span class="font-bold text-amber-700">
              12 Questions Assigned (Due Tomorrow 6:00 PM)
            </span>
          </div>

          <div class="flex justify-between py-2">
            <span class="text-slate-500">Class Progress (38 of 60 mins):</span>
            <span class="font-bold text-blue-600">63% Completed</span>
          </div>
        </div>

        <div class="mb-6">
          ${ProgressBar({ value: 63, variant: 'primary', showPercent: false })}
        </div>

        <!-- Privacy & Pedagogy Assurance Note -->
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <strong>Why SIKO uses Parent Live Telemetry:</strong> Research indicates students learn most fearlessly when given psychological safety with their mentor. Rather than intrusive live video monitoring, SIKO provides parents real-time telemetry, attendance proof, and exact syllabus objectives.
        </div>
      </div>

      <div class="flex justify-center">
        <button class="btn btn-outline" onclick="window.navigateView('parent-dashboard')">
          Return to Parent Dashboard
        </button>
      </div>
    </div>
  `;
}
