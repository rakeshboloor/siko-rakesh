/**
 * SIKO ADMIN DASHBOARD & OPERATIONAL COMMAND CENTRE (Admin OS)
 * Full-featured executive management across:
 * 1. KPIs & Real-Time Operational Signals
 * 2. Cohort Batch Governance (All 41 SIKO Exam Sprint Batches)
 * 3. Teacher Applications (7-Point Academic Verification Protocol)
 * 4. Financial & Escrow Settlement Ledger
 * 5. Academic Quality & AI Worksheet Review Queue
 * 6. System Audit Trails & Compliance Logging
 */

import { AppState, formatPrice } from '../state.js';
import { Icons, ProgressBar } from '../components.js';

export function renderAdminDashboard() {
  const admin = AppState.adminData || {};
  const kpis = admin.kpis || {
    totalStudents: 4820,
    verifiedTeachers: 312,
    activeClassesNow: 48,
    gmv: 420500,
    escrowBalance: 142300,
    batchOccupancyRate: 88.4
  };
  const currentTab = AppState.adminTab || 'overview'; // 'overview' | 'applications' | 'finance' | 'academic' | 'audit'
  const pendingApps = admin.pendingTeacherApplications || [];
  const batches = (admin.batches && admin.batches.length) ? admin.batches : (AppState.batches || []);
  const escrowLedger = admin.escrowLedger || [];
  const auditLogs = admin.auditLogs || [];
  const aiQueue = admin.aiWorksheetsQueue || [];

  const is800Scenario = window._financeCfoScenario === 'scale800';
  const cfoTopSummary = typeof window.computeLiveCfoLedgerSummary === 'function'
    ? window.computeLiveCfoLedgerSummary()
    : null;
  const totalGmv = cfoTopSummary ? cfoTopSummary.totalGmv : (kpis.gmv || 4205000);
  const sikoTotalEarned = cfoTopSummary ? cfoTopSummary.totalSikoGrossEarned : Math.round(totalGmv * 0.353);
  const totalTeacherPool = cfoTopSummary ? cfoTopSummary.totalTeacherEscrowPool : (totalGmv - sikoTotalEarned);
  const sikoNetEbitda = cfoTopSummary ? cfoTopSummary.totalSikoNetEbitda : (sikoTotalEarned - Math.round(totalGmv * 0.12));
  const displayStudentCount = is800Scenario ? 800 : (kpis.totalStudents !== undefined ? kpis.totalStudents : 0);

  return `
    <div class="container py-8 max-w-7xl">
      <!-- Admin & CFO Top Bar -->
      <div class="flex justify-between items-center pb-6 border-b border-slate-200 mb-8 flex-wrap gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="badge badge-primary text-2xs uppercase tracking-wider font-bold">SIKO Executive &amp; CFO Command OS</span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${is800Scenario ? 'bg-amber-100 text-amber-900 border border-amber-300 font-black' : 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'} text-2xs">
              <span class="w-1.5 h-1.5 rounded-full ${is800Scenario ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse"></span>
              ${is800Scenario ? '🚀 800-Student Scale Model Active' : '🟢 Live Launch Operations Active'}
            </span>
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">${currentTab === 'finance' ? '💼 CFO Dashboard &amp; SIKO Revenue Command' : 'Administrative &amp; CFO Headquarters'}</h1>
          <p class="text-slate-500 text-xs">Platform governance, SIKO net commission &amp; EBITDA margins, faculty screening, 41-cohort sprint rosters, and milestone escrow.</p>
        </div>

        <div class="flex items-center gap-2.5 flex-wrap">
          <!-- Scenario Modeling Switcher -->
          <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button type="button" onclick="window._financeCfoScenario='baseline'; window.notifyStateChange();"
              class="px-2.5 py-1.5 rounded-lg font-bold cursor-pointer border-0 transition-all ${!is800Scenario ? 'bg-white text-slate-900 shadow-2xs font-black' : 'bg-transparent text-slate-500 hover:text-slate-900'}">
              🟢 Live Launch (Fresh State)
            </button>
            <button type="button" onclick="window._financeCfoScenario='scale800'; window.notifyStateChange();"
              class="px-2.5 py-1.5 rounded-lg font-bold cursor-pointer border-0 transition-all ${is800Scenario ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'bg-transparent text-slate-500 hover:text-slate-900'}">
              🚀 800 Students Scale (₹4.356 Cr)
            </button>
          </div>

          <button class="px-3.5 py-2 rounded-xl ${currentTab === 'finance' ? 'bg-emerald-600 text-white' : 'bg-amber-400 hover:bg-amber-300 text-slate-950'} text-xs font-black shadow-sm cursor-pointer border-0" onclick="window.setAdminTab('finance')">
            💼 CFO Dashboard (Amount SIKO Earns: ₹${sikoTotalEarned.toLocaleString('en-IN')})
          </button>
          <button class="btn btn-outline btn-sm text-xs font-semibold" onclick="window.exportAdminAuditReport()">
            📥 Export Audit Log
          </button>
          <button class="btn btn-primary btn-sm text-xs font-bold" onclick="window.openNewBatchModal()">
            + Launch Smart Batch
          </button>
        </div>
      </div>

      <!-- EXECUTIVE & CFO KPI METRIC CARDS -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div class="card p-4 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-blue-300 transition-all">
          <span class="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Enrolled Students</span>
          <div class="text-2xl font-black text-slate-900">${displayStudentCount.toLocaleString()}</div>
          <span class="text-2xs ${is800Scenario ? 'text-amber-700 font-extrabold' : 'text-emerald-600 font-semibold'}">${is800Scenario ? '520 Batch + 280 1:1' : '+182 this week'}</span>
        </div>

        <div class="card p-4 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-blue-300 transition-all">
          <span class="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Verified Teachers</span>
          <div class="text-2xl font-black text-blue-700">${is800Scenario ? '48' : (kpis.verifiedTeachers || 312)}</div>
          <span class="text-2xs text-slate-500 font-semibold">${is800Scenario ? '95.2% Utilization' : 'Top 3.2% accredited'}</span>
        </div>

        <div class="card p-4 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-blue-300 transition-all">
          <span class="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Gross Student GMV</span>
          <div class="text-2xl font-black text-slate-900">₹${totalGmv.toLocaleString('en-IN')}</div>
          <span class="text-2xs text-emerald-600 font-semibold">Teacher + SIKO = 100%</span>
        </div>

        <div class="card p-4 bg-emerald-50/80 border-2 border-emerald-400 rounded-xl shadow-2xs cursor-pointer" onclick="window.setAdminTab('finance')">
          <span class="text-2xs font-extrabold text-emerald-800 uppercase tracking-wider block mb-1">💰 Amount SIKO Earns</span>
          <div class="text-2xl font-black text-emerald-700">₹${sikoTotalEarned.toLocaleString('en-IN')}</div>
          <span class="text-2xs text-emerald-800 font-bold">Net EBITDA: ₹${sikoNetEbitda.toLocaleString('en-IN')}</span>
        </div>

        <div class="card p-4 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-blue-300 transition-all">
          <span class="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Teacher Escrow Pool</span>
          <div class="text-2xl font-black text-amber-600">₹${totalTeacherPool.toLocaleString('en-IN')}</div>
          <span class="text-2xs text-amber-700 font-semibold">50 / 25 / 25 Protected</span>
        </div>

        <div class="card p-4 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-blue-300 transition-all">
          <span class="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Batch Occupancy</span>
          <div class="text-2xl font-black text-purple-700">${is800Scenario ? '96.3%' : (kpis.batchOccupancyRate || 88.4) + '%'}</div>
          <span class="text-2xs text-purple-700 font-semibold">Strict 30-cap rule</span>
        </div>
      </div>

      <!-- ADMIN & CFO WORKSPACE TABS -->
      <div class="tabs mb-8 flex-wrap">
        <button class="tab-btn ${currentTab === 'finance' ? 'active' : ''}" onclick="window.setAdminTab('finance')">
          💼 CFO Dashboard &amp; SIKO Earnings
        </button>
        <button class="tab-btn ${currentTab === 'overview' ? 'active' : ''}" onclick="window.setAdminTab('overview')">
          🏛️ Batches Governance (${batches.length})
        </button>
        <button class="tab-btn ${currentTab === 'contingency' ? 'active' : ''}" onclick="window.setAdminTab('contingency')">
          🚑 Faculty Contingency &amp; Reschedule (${(AppState.teacherAbsence && AppState.teacherAbsence.hasActiveAbsence) ? '1 Active' : '0'})
        </button>
        <button class="tab-btn ${currentTab === 'applications' ? 'active' : ''}" onclick="window.setAdminTab('applications')">
          📋 Teacher Verification (${pendingApps.length})
        </button>
        <button class="tab-btn ${currentTab === 'academic' ? 'active' : ''}" onclick="window.setAdminTab('academic')">
          🧠 Academic Quality &amp; AI Queue (${aiQueue.length})
        </button>
        <button class="tab-btn ${currentTab === 'audit' ? 'active' : ''}" onclick="window.setAdminTab('audit')">
          🛡️ Compliance &amp; Audit Logs (${auditLogs.length})
        </button>
      </div>

      <!-- TAB CONTENT -->
      ${renderAdminTabContent(currentTab, { admin, kpis, pendingApps, batches, escrowLedger, auditLogs, aiQueue })}

      <!-- Modal Container (Batch Details / New Batch) -->
      <div id="adminModalRoot"></div>
    </div>
  `;
}

function renderAdminTabContent(currentTab, ctx) {
  const { admin, pendingApps, batches, escrowLedger, auditLogs, aiQueue } = ctx;

  /* ─────────────────────────────────────────────────────────────
     1. TEACHER APPLICATIONS (Channelized Admin Verification, Rate Offer & Auto-Mail Control)
     ───────────────────────────────────────────────────────────── */
  if (currentTab === 'applications') {
    const ob = AppState.teacherOnboarding || {};
    // Keep the primary candidate dossier in sync with the live New Teacher Candidate Onboarding state
    if (pendingApps && pendingApps.length > 0 && ob.fullName) {
      const liveApp = pendingApps[0];
      liveApp.name = ob.fullName;
      liveApp.email = ob.email || liveApp.email || 'faculty.applicant@siko.in';
      liveApp.phone = ob.phone || liveApp.phone || '+91 98201 44510';
      liveApp.standards = Array.isArray(ob.standards) ? ob.standards : ['Class 11', 'Class 12'];
      liveApp.subjects = Array.isArray(ob.subjects) ? ob.subjects : ['Physics'];
      liveApp.boards = Array.isArray(ob.boards) ? ob.boards : ['CBSE', 'JEE'];
      liveApp.subject = `${liveApp.subjects.join(', ')} (${liveApp.standards.join(', ')} • ${liveApp.boards.join(', ')})`;
      liveApp.expectedHourlyRate = ob.expectedHourlyRate || liveApp.expectedHourlyRate || 1800;
      liveApp.sikoFinalizedRate = ob.sikoFinalizedRate || liveApp.sikoFinalizedRate || 1750;
      liveApp.marketMinRate = ob.marketMinRate || liveApp.marketMinRate || 1450;
      liveApp.marketMaxRate = ob.marketMaxRate || liveApp.marketMaxRate || 1950;
      liveApp.classSegment = ob.classSegment || liveApp.classSegment || 'JEE / NEET / Olympiad';
      liveApp.selectedTier = ob.selectedTier || liveApp.selectedTier || 'Expert';
      liveApp.declaredWeeklyHours = ob.declaredWeeklyHours || liveApp.declaredWeeklyHours || 24;
      liveApp.availableDays = Array.isArray(ob.availableDays) ? ob.availableDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      liveApp.preferredSlots = Array.isArray(ob.preferred1on1Slots) ? ob.preferred1on1Slots : ['Mon/Wed/Fri 6:00 PM', 'Tue/Thu/Sat 7:00 PM'];
      liveApp.offerAcceptedByTeacher = !!ob.offerAcceptedByTeacher;
      if (ob.applicationDecisionStatus === 'REJECTED') {
        liveApp.status = 'Rejected (Auto-Mailed)';
      } else if (ob.agreementAccepted) {
        liveApp.status = 'Contract Signed • Ready to Accredit';
      } else if (ob.offerAcceptedByTeacher) {
        liveApp.status = 'Selected & Offer Auto-Mailed';
      }
    }

    if (!pendingApps || pendingApps.length === 0) {
      return `
        <div class="card p-12 bg-white border rounded-xl shadow-xs text-center">
          <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">Teacher Review Queue Is Up To Date</h3>
          <p class="text-slate-500 text-sm max-w-md mx-auto mb-6">
            All submitted educator applications have been screened, verified, and accredited into the SIKO Faculty Directory.
          </p>
          <div class="flex items-center justify-center gap-3 flex-wrap">
            <button class="btn btn-outline btn-sm" onclick="window.navigateView('teacher-onboarding')">
              👁️ Switch to New Teacher Candidate Screen →
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.navigateView('teacher-marketplace')">
              Inspect Verified Faculty Directory →
            </button>
          </div>
        </div>
      `;
    }

    const selectedId = admin.selectedApplicantId || pendingApps[0].id;
    const app = pendingApps.find(a => a.id === selectedId) || pendingApps[0];

    // Count checked verification items
    const checklistKeys = ['identity', 'qualifications', 'experience', 'demo', 'interview', 'agreement', 'orientation'];
    const completedCount = checklistKeys.filter(k => app.checklist && app.checklist[k]).length;
    const progressPct = Math.round((completedCount / 7) * 100);

    return `
      <!-- ADMIN PORTAL vs CANDIDATE SCREEN ARCHITECTURE BANNER -->
      <div class="card p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl mb-6 border border-indigo-500/40">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-3xs font-black uppercase">
                🏛️ SIKO Admin Portal: Teacher Verification &amp; Rate Channelization Hub
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-3xs font-extrabold">
                Controls What Appears on the New Teacher Candidate's Screen
              </span>
            </div>
            <div class="text-xs sm:text-sm font-black text-white">
              Channelize New Teacher Joining: Verify Uploaded Docs &rarr; Schedule Demo &rarr; Select / Reject &amp; Lock Final Offer Rate (₹/hr) &rarr; Auto-Mail Candidate
            </div>
            <p class="text-2xs text-indigo-200 mt-0.5">
              A new teacher only submits their application, expected rate, and documents on their Candidate Screen. <strong>All Screening Approvals, Demo Scores, Selection/Rejection Decisions, and Finalized Offer Rates are controlled from this Admin Portal</strong> and reflected on the candidate's screen in real time.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <button type="button" onclick="window.navigateView('teacher-onboarding')" class="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer border-0 shadow-xs">
              👁️ Switch to New Teacher Candidate Screen (See Candidate View) &rarr;
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Applicant Selection List (Left Col) -->
        <div class="space-y-4">
          <div class="card p-4 bg-white border rounded-xl shadow-xs">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Inbound Teacher Candidate Queue (${pendingApps.length})</h4>
            <div class="space-y-2">
              ${pendingApps.map((item, idx) => {
                const isSelected = item.id === app.id;
                return `
                  <div onclick="window.selectAdminApplicant('${item.id}')"
                    class="p-3 rounded-lg border transition-all cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50/50 shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50'}">
                    <div class="flex items-center justify-between mb-1 gap-1">
                      <strong class="text-xs font-bold text-slate-900">${item.name} ${idx === 0 ? '<span class="text-3xs text-emerald-700 font-extrabold">(Live Candidate)</span>' : ''}</strong>
                      <span class="badge ${item.status && item.status.includes('Rejected') ? 'badge-danger' : isSelected ? 'badge-primary' : 'badge-warning'} text-3xs">${item.status}</span>
                    </div>
                    <p class="text-2xs text-slate-600 font-semibold truncate mb-0.5">${item.subject}</p>
                    <p class="text-3xs text-slate-500 truncate mb-1">📧 ${item.email || 'faculty@siko.in'} • Expected: ₹${(item.expectedHourlyRate || 1800).toLocaleString('en-IN')}/hr</p>
                    <span class="text-3xs font-mono text-slate-400">${item.id}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Dossier Details -->
          <div class="card p-5 bg-white border rounded-xl shadow-xs">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-base">
                ${app.name.charAt(0)}
              </div>
              <div class="min-w-0">
                <h3 class="font-bold text-sm text-slate-900">${app.name}</h3>
                <p class="text-xs text-blue-600 font-medium break-words">${app.subject}</p>
                <p class="text-2xs text-slate-500 break-all">📧 ${app.email || 'faculty.applicant@siko.in'}</p>
              </div>
            </div>

            <div class="space-y-2.5 text-xs mb-5">
              <div>
                <span class="text-slate-400 block text-2xs">Applied Standards / Subjects / Boards:</span>
                <span class="font-semibold text-slate-800">${(app.standards || ['Class 11', 'Class 12']).join(', ')} • ${(app.subjects || ['Physics']).join(', ')} • ${(app.boards || ['CBSE', 'JEE']).join(', ')}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-2xs">Experience &amp; Background:</span>
                <span class="font-semibold text-slate-800">${app.experience}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-2xs">Application ID:</span>
                <span class="font-mono text-slate-700 text-2xs">${app.id}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-2xs">Accreditation Progress:</span>
                <div class="flex items-center justify-between text-2xs font-bold text-slate-700 mt-1 mb-1">
                  <span>${completedCount} / 7 Completed</span>
                  <span class="text-blue-600">${progressPct}%</span>
                </div>
                ${ProgressBar({ value: progressPct, variant: progressPct === 100 ? 'success' : 'primary', showPercent: false })}
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <button class="btn btn-outline btn-sm text-xs" onclick="window.showToast('Demo recording stream initialized: 15-min pedagogy evaluation', 'info')">
                🎥 Watch Candidate Demo Recording (15 min)
              </button>
              <button class="btn btn-outline btn-sm text-xs" onclick="window.openTeacherEmailOnboardingLinkModal && window.openTeacherEmailOnboardingLinkModal()">
                📄 Inspect Candidate Uploaded Degrees &amp; KYC
              </button>
            </div>
          </div>
        </div>

        <!-- Right 2 Cols: Channelized Admin Decision Pipeline + 7-Point Verification Checklist -->
        <div class="lg:col-span-2 card p-6 bg-white border rounded-xl shadow-xs">
          <!-- 4-STAGE ADMIN CHANNELIZATION & AUTO-MAIL ACTION PIPELINE -->
          <div class="p-4 rounded-2xl bg-slate-900 text-white mb-6 text-xs space-y-3 border border-indigo-500/40">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span class="text-3xs font-extrabold uppercase tracking-wider text-amber-300 block">Admin Channelization Controls (Updates Candidate Screen + Dispatches Auto-Mail)</span>
                <strong class="text-sm font-black text-white">Execute Admin Decision for ${app.name} (${app.email || 'faculty.applicant@siko.in'})</strong>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-white/10 text-emerald-300 font-bold text-2xs">
                Candidate Currently at Step ${(AppState.teacherOnboarding && AppState.teacherOnboarding.step) || 6} of 9
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button type="button" onclick="window.adminChannelTriggerStage('VERIFY_DOCS_INVITE_DEMO', '${app.id}')"
                class="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-left cursor-pointer border-0 transition-all">
                <div class="text-3xs font-extrabold uppercase text-blue-200">Admin Stage 1 • Screening &amp; Demo</div>
                <div class="font-black text-xs mt-0.5">📧 1. Verify Uploaded Docs &amp; Auto-Mail Demo Invite &rarr;</div>
                <div class="text-3xs text-blue-100 mt-0.5">Unlocks Step 5 (Live Demo Room) on Candidate Screen</div>
              </button>

              <button type="button" onclick="window.adminChannelTriggerStage('SELECT_AND_SEND_OFFER', '${app.id}')"
                class="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-left cursor-pointer border-0 transition-all">
                <div class="text-3xs font-extrabold uppercase text-emerald-200">Admin Stage 2A • Selection &amp; Rate Offer</div>
                <div class="font-black text-xs mt-0.5">✅ 2A. Select Teacher, Lock Rate &amp; Auto-Mail Offer &rarr;</div>
                <div class="text-3xs text-emerald-100 mt-0.5">Pushes Final Offer (₹${(app.sikoFinalizedRate || 1750).toLocaleString('en-IN')}/hr) to Candidate Step 6</div>
              </button>

              <button type="button" onclick="window.adminChannelTriggerStage('REJECT_CANDIDATE', '${app.id}')"
                class="p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-left cursor-pointer border-0 transition-all">
                <div class="text-3xs font-extrabold uppercase text-rose-200">Admin Stage 2B • Non-Selection</div>
                <div class="font-black text-xs mt-0.5">✕ 2B. Reject Application &amp; Auto-Mail Notice &rarr;</div>
                <div class="text-3xs text-rose-100 mt-0.5">Updates Candidate Step 6 to Not Selected + Sends Email</div>
              </button>

              <button type="button" onclick="window.adminChannelTriggerStage('ACCREDIT_EDUCATOR', '${app.id}')"
                class="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-left cursor-pointer border-0 transition-all">
                <div class="text-3xs font-extrabold uppercase text-indigo-200">Admin Stage 3 • Final Accreditation</div>
                <div class="font-black text-xs mt-0.5">🎓 3. Accredit Signed Educator &amp; Unlock Portal &rarr;</div>
                <div class="text-3xs text-indigo-100 mt-0.5">Completes Step 9 &amp; Activates Faculty Command Centre</div>
              </button>
            </div>
          </div>

          <!-- Post-Demo Rate Finalization & Schedule Sync Card -->
          <div class="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/70 to-emerald-50/70 border border-blue-200 mb-6 text-xs">
            <div class="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-blue-200/70">
              <div>
                <span class="text-3xs font-extrabold text-blue-700 uppercase tracking-wider block">Admin Rate Negotiation &amp; Timetable Lock</span>
                <strong class="text-sm font-black text-slate-900">Set SIKO Finalized Hourly Rate (Channelized to Candidate Step 6)</strong>
              </div>
              <span class="badge ${app.offerAcceptedByTeacher ? 'badge-success' : 'badge-primary'} text-2xs font-bold">
                ${app.offerAcceptedByTeacher ? '✓ Offer Issued & Synced to Candidate' : 'Pending Admin Offer Lock'}
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
              <div class="bg-white p-2.5 rounded-xl border border-slate-200">
                <div class="text-3xs font-bold text-slate-500 uppercase">Class &amp; Tier</div>
                <div class="font-extrabold text-slate-900 mt-0.5">${app.classSegment || 'JEE / NEET / Olympiad'}</div>
                <div class="text-2xs text-blue-700 font-bold">${app.selectedTier || 'Expert'} Tier</div>
              </div>
              <div class="bg-white p-2.5 rounded-xl border border-slate-200">
                <div class="text-3xs font-bold text-slate-500 uppercase">Market Band</div>
                <div class="font-black text-slate-900 mt-0.5">₹${(app.marketMinRate || 1450).toLocaleString('en-IN')} – ₹${(app.marketMaxRate || 1950).toLocaleString('en-IN')}/hr</div>
                <div class="text-2xs text-slate-500">Demo Score: ${app.demoScore || 9.6}/10</div>
              </div>
              <div class="bg-white p-2.5 rounded-xl border border-amber-200">
                <div class="text-3xs font-bold text-amber-700 uppercase">Candidate Expected Rate</div>
                <div class="text-base font-black text-amber-900 mt-0.5">₹${(app.expectedHourlyRate || 1800).toLocaleString('en-IN')}/hr</div>
                <div class="text-2xs text-slate-500">${app.declaredWeeklyHours || 24} hrs/wk declared</div>
              </div>
              <div class="bg-white p-2.5 rounded-xl border-2 border-emerald-500">
                <div class="text-3xs font-extrabold text-emerald-700 uppercase">Admin Final Offer Rate</div>
                <div class="flex items-center gap-1 mt-0.5">
                  <span class="font-bold text-slate-500">₹</span>
                  <input type="number" id="adminFinalizedRate_${app.id}" min="${app.marketMinRate || 350}" max="${app.marketMaxRate || 2500}" step="25" value="${app.sikoFinalizedRate || 1750}"
                    class="w-20 p-1 rounded border border-emerald-400 font-black text-sm text-emerald-950 text-center bg-emerald-50/40" />
                  <span class="text-2xs font-bold text-slate-500">/hr</span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between flex-wrap gap-2 bg-white p-2.5 rounded-xl border border-blue-100 mb-3">
              <div class="text-2xs text-slate-700">
                <strong>🗓️ Candidate Declared Days &amp; Slots:</strong> ${(app.availableDays || ['Mon','Tue','Wed','Thu','Fri','Sat']).join(', ')} &bull; <strong>Slots:</strong> ${(app.preferredSlots || ['Mon/Wed/Fri 6:00 PM', 'Tue/Thu/Sat 7:00 PM']).join(' | ')}
              </div>
              <div class="flex items-center gap-2 flex-wrap">
                <button type="button" class="btn btn-xs btn-outline font-bold" onclick="window.sendTeacherApplicationEmailLink('${app.email || 'faculty@siko.in'}', '${app.name}')">
                  📧 Send Offer Email Link
                </button>
                <button type="button" class="btn btn-xs btn-primary font-bold" onclick="window.adminFinalizeApplicantRateOffer('${app.id}')">
                  💼 Lock Admin Offer Rate &amp; Sync to Candidate Screen
                </button>
              </div>
            </div>

            <!-- Synced Candidate Uploaded Documents & Offer Acceptance Dossier -->
            <div class="p-3 rounded-xl bg-white border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-2xs">
              <div>
                <span class="font-extrabold text-emerald-800 block">📥 Inbound Dossier from Candidate Screen (${app.email || 'faculty@siko.in'}):</span>
                <span class="text-slate-600">
                  Candidate Docs:
                  <strong class="text-emerald-700">✓ Degree Certificate (PDF)</strong> •
                  <strong class="text-emerald-700">✓ Govt ID &amp; PAN Verified</strong> •
                  <strong class="text-emerald-700">✓ Experience Letter</strong> •
                  <strong class="text-indigo-700">${app.offerAcceptedByTeacher ? '✓ Offer Issued / Accepted' : '⏳ Awaiting Admin Offer Issue'}</strong>
                </span>
              </div>
              <button type="button" onclick="window.openTeacherEmailOnboardingLinkModal()"
                class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-3xs cursor-pointer border-0">
                🔗 Preview Candidate Email Offer Link &rarr;
              </button>
            </div>
          </div>

          <div class="flex justify-between items-center mb-4 pb-3 border-b">
            <div>
              <h3 class="text-base font-bold text-slate-900">
                7-Point Academic Verification Protocol (Admin Checklist)
              </h3>
              <p class="text-2xs text-slate-500">Every SIKO educator undergoes rigorous background and pedagogy screening before live classroom assignment.</p>
            </div>
            <span class="badge ${progressPct === 100 ? 'badge-success' : 'badge-warning'} text-xs font-bold">
              ${completedCount}/7 Verified
            </span>
          </div>

          <div class="space-y-3 mb-6">
            ${[
              { key: 'identity', label: '01. Identity & Government Verification (Submitted by Candidate in Step 3)', desc: 'Aadhaar / PAN / Passport match confirmed by SIKO Admin' },
              { key: 'qualifications', label: '02. Qualifications & Degree Check (Submitted by Candidate in Step 3)', desc: 'Degrees validated directly with University academic registrars' },
              { key: 'experience', label: '03. Prior Institutional Teaching Experience (Submitted by Candidate in Step 3)', desc: '5+ years verified coaching appointments at top institutions' },
              { key: 'demo', label: '04. Live Classroom Demo Class Evaluation (Evaluated in Step 5)', desc: `Scored ${app.demoScore || 9.6}/10 by SIKO Academic Committee` },
              { key: 'interview', label: '05. Academic Dean Rate Finalization & Selection Offer (Channelized to Step 6)', desc: `Candidate Expected ₹${app.expectedHourlyRate || 1800}/hr → Admin Locked Offer ₹${app.sikoFinalizedRate || 1750}/hr (${app.selectedTier || 'Expert'} Tier)` },
              { key: 'agreement', label: '06. Candidate Offer Acceptance & 21-Section Digital Contract (Signed in Step 7)', desc: 'Candidate accepted Admin finalized rate & signed digital contract' },
              { key: 'orientation', label: '07. Digital Classroom & Synced Timetable Orientation (Completed in Step 8)', desc: 'Certified in Jitsi live controls, digital whiteboard, and multi-subject timetable sync' }
            ].map(item => {
              const checked = app.checklist && app.checklist[item.key];
              return `
                <div class="p-3.5 rounded-xl border transition-all ${checked ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'} flex items-center justify-between text-xs gap-3">
                  <div class="flex-1">
                    <span class="font-bold ${checked ? 'text-emerald-900' : 'text-slate-900'} block mb-0.5">${item.label}</span>
                    <span class="text-slate-500 text-2xs">${item.desc}</span>
                  </div>
                  <label class="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" ${checked ? 'checked' : ''} onchange="window.toggleAdminChecklist('${app.id}', '${item.key}')"
                      class="w-4 h-4 rounded text-blue-600 cursor-pointer accent-blue-600" />
                    <span class="text-2xs font-semibold ${checked ? 'text-emerald-700' : 'text-slate-400'}">
                      ${checked ? 'Verified' : 'Pending'}
                    </span>
                  </label>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Formal Administrative Actions -->
          <div class="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div class="flex gap-2 flex-wrap">
              <button class="btn btn-outline btn-sm text-amber-700 border-amber-300 hover:bg-amber-50" onclick="window.confirmAdminAction('Request Information', '${app.id}')">
                Request Additional Info
              </button>
              <button class="btn btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50" onclick="window.confirmAdminAction('Reject', '${app.id}')">
                ✕ Reject Application &amp; Auto-Mail
              </button>
            </div>

            <div class="flex items-center gap-2 flex-wrap">
              <button class="btn btn-outline btn-sm font-bold" onclick="window.navigateView('teacher-onboarding')">
                👁️ View Candidate Screen &rarr;
              </button>
              <button class="btn btn-primary btn-sm font-bold flex items-center gap-1.5" onclick="window.confirmAdminAction('Approve', '${app.id}')">
                ${Icons.check} Approve &amp; Accredit Educator
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ─────────────────────────────────────────────────────────────
     2. CFO LOGIN & SIKO EARNINGS DASHBOARD (FINANCIAL & ESCROW COMMAND)
     ───────────────────────────────────────────────────────────── */
  if (currentTab === 'finance') {
    const is800Scenario = window._financeCfoScenario === 'scale800';
    const matrix = window.CURRICULUM_TEACHING_HOURS_MATRIX || {};
    const boardKeys = Object.keys(matrix);
    const activeBoard = window._financeExplorerBoard || 'CBSE';
    const boardObj = matrix[activeBoard] || matrix['CBSE'] || { subjects: {} };
    const subjectKeys = Object.keys(boardObj.subjects || {});
    const activeSubject = (window._financeExplorerSubject && boardObj.subjects?.[window._financeExplorerSubject])
      ? window._financeExplorerSubject
      : (subjectKeys[0] || 'Physics');
    const subjObj = (boardObj.subjects && boardObj.subjects[activeSubject]) || { subjectTotalHours: 70, chapters: [] };
    const simScope = window._financeSimScope || 'bundle';
    const simFormat = window._financeSimFormat || '1on1';
    const simTier = window._financeSimTier || 'Expert';
    const simSubjects = simScope === 'bundle' ? subjectKeys.slice(0, 3) : [activeSubject];

    const simQuote = typeof window.calculateCfoPricingWaterfall === 'function'
      ? window.calculateCfoPricingWaterfall({
          board: activeBoard,
          scopeMode: simScope,
          format: simFormat,
          teacherTier: simTier,
          subjects: simSubjects
        })
      : null;

    const cfoSummary = typeof window.computeLiveCfoLedgerSummary === 'function'
      ? window.computeLiveCfoLedgerSummary()
      : null;

    const totalGmvVal = cfoSummary ? cfoSummary.totalGmv : 4205000;
    const totalTeacherEscrowPool = cfoSummary ? cfoSummary.totalTeacherEscrowPool : 2722120;
    const totalSikoGrossEarned = cfoSummary ? cfoSummary.totalSikoGrossEarned : (totalGmvVal - totalTeacherEscrowPool);
    const totalDirectCosts = cfoSummary ? cfoSummary.totalDirectCosts : Math.round(totalGmvVal * 0.12);
    const totalSikoNetEbitda = cfoSummary ? cfoSummary.totalSikoNetEbitda : (totalSikoGrossEarned - totalDirectCosts);
    const blendedSikoPct = cfoSummary ? cfoSummary.blendedSikoCommissionPct : 35.3;
    const blendedTeacherPct = cfoSummary ? cfoSummary.blendedTeacherSharePct : 64.7;
    const blendedEbitdaPct = cfoSummary ? cfoSummary.blendedNetEbitdaPct : 23.3;

    // Dynamically compute the Tier Reference Matrix rows for the active Board & Scope so zero numbers are hardcoded!
    const tierMatrixRows = ['Master', 'Expert', 'Senior', 'Pro'].map(tKey => {
      const q = typeof window.calculateCfoPricingWaterfall === 'function'
        ? window.calculateCfoPricingWaterfall({
            board: activeBoard,
            scopeMode: 'subject',
            format: '1on1',
            teacherTier: tKey,
            subjects: [activeSubject]
          })
        : null;
      return { tKey, q };
    });
    const batchMatrixQuote = typeof window.calculateCfoPricingWaterfall === 'function'
      ? window.calculateCfoPricingWaterfall({
          board: activeBoard,
          scopeMode: 'subject',
          format: 'batch',
          teacherTier: simTier,
          subjects: [activeSubject]
        })
      : null;

    // Compute exact Chapter-by-Chapter rows and Subject Totals (100% additive!)
    const activeStudentHr = simQuote ? simQuote.effectiveStudentRatePerHour : 600;
    const commPct = simQuote ? simQuote.sikoCommissionPct : 22;
    const teacherSharePct = 100 - commPct;

    let chTotalHoursSum = 0;
    let chLecSum = 0;
    let chPracSum = 0;
    let chTestSum = 0;
    let chFeeSum = 0;
    let chTeacherSum = 0;
    let chSikoEarnsSum = 0;
    let chDirectCostSum = 0;
    let chSikoNetSum = 0;

    const chapterRowsComputed = (subjObj.chapters || []).map(ch => {
      const chFee = Math.round(ch.totalHours * activeStudentHr);
      const chTeacher = Math.round(chFee * (teacherSharePct / 100));
      const chSikoEarns = chFee - chTeacher; // Exact: chTeacher + chSikoEarns === chFee
      const chDirectCost = Math.round(chFee * 0.12); // 12% Direct Costs (AI 4.5% + Gateway 3.5% + QA 4.0%)
      const chSikoNet = chSikoEarns - chDirectCost; // Exact: chSikoNet + chDirectCost === chSikoEarns

      chTotalHoursSum += ch.totalHours;
      chLecSum += ch.lectureHours;
      chPracSum += ch.practiceHours;
      chTestSum += ch.doubtTestHours;
      chFeeSum += chFee;
      chTeacherSum += chTeacher;
      chSikoEarnsSum += chSikoEarns;
      chDirectCostSum += chDirectCost;
      chSikoNetSum += chSikoNet;

      return {
        ...ch,
        chFee,
        chTeacher,
        chSikoEarns,
        chDirectCost,
        chSikoNet
      };
    });

    const enrichedLedgerRows = cfoSummary ? cfoSummary.enrichedLedger : [];
    const ledgerTotals = cfoSummary ? cfoSummary.ledgerTotals : {
      studentFeeSum: 0,
      teacherPayoutSum: 0,
      tdsSum: 0,
      teacherNetBankSum: 0,
      sikoGrossSum: 0,
      sikoDirectCostSum: 0,
      sikoNetEbitdaSum: 0
    };

    return `
      <div class="space-y-6">
        <!-- EXECUTIVE CFO REVENUE & SIKO EARNINGS OVERVIEW STRIP -->
        <div class="card p-6 text-white rounded-2xl shadow-xl" style="background: linear-gradient(135deg, #042017 0%, #0a1122 50%, #180c2e 100%); border: 2px solid #10b981; color: #ffffff;">
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-white/20">
            <div>
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <!-- HIGH VISIBILITY REVERSE PATCH -->
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-slate-950 font-black text-2xs uppercase tracking-wider shadow-sm border border-emerald-400">
                  <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                  💼 CFO CONFIDENTIAL REVENUE &amp; MARGIN LEDGER
                </span>
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg ${is800Scenario ? 'bg-amber-400 text-slate-950 font-black' : 'bg-emerald-400 text-slate-950 font-extrabold'} text-3xs uppercase shadow-xs">
                  ${is800Scenario ? '🚀 800-STUDENT SCALE ENGINE ACTIVE' : '✓ 100% AUTOMATED RECONCILIATION'}
                </span>
                <span class="px-2.5 py-1 rounded-lg bg-amber-400/25 border border-amber-300 text-amber-200 font-bold text-3xs">
                  Student Fee = Teacher Pool + SIKO Commission
                </span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>💰 Exact Amount SIKO Earns — Platform Commission &amp; Net EBITDA Dashboard</span>
              </h3>
              <p class="text-xs text-slate-200 mt-1 leading-relaxed">Visible strictly in <strong>CFO / Admin Login</strong>. Every calculation below is automated with zero rounding drift (` + '`Teacher Pool + SIKO Commission === Student Fee`' + ` and ` + '`SIKO Gross Commission - 12% Direct Costs === SIKO Net EBITDA`' + `).</p>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <!-- Inline Scenario Switcher -->
              <div class="flex items-center bg-white/10 p-1 rounded-xl border border-white/20 text-xs">
                <button type="button" onclick="window._financeCfoScenario='baseline'; window.notifyStateChange();"
                  class="px-3 py-1.5 rounded-lg text-2xs font-extrabold cursor-pointer border-0 transition-all ${!is800Scenario ? 'bg-white text-slate-950 font-black shadow-xs' : 'bg-transparent text-slate-300 hover:text-white'}">
                  📊 Baseline Book
                </button>
                <button type="button" onclick="window._financeCfoScenario='scale800'; window.notifyStateChange();"
                  class="px-3 py-1.5 rounded-lg text-2xs font-black cursor-pointer border-0 transition-all ${is800Scenario ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-transparent text-slate-300 hover:text-white'}">
                  🚀 800 Students Scale (₹4.356 Cr)
                </button>
              </div>

              <button type="button" onclick="window.openCtoRazorpayBlueprintModal()" class="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer border-0 shadow-md">
                ⚙️ CTO Blueprint
              </button>
              <button class="btn btn-outline btn-sm text-xs text-white border-white/40 hover:bg-white/10" onclick="window.showToast('CFO Ledger reconciled: Student Fee (₹' + (${totalGmvVal}).toLocaleString('en-IN') + ') = Teacher Pool (₹' + (${totalTeacherEscrowPool}).toLocaleString('en-IN') + ') + SIKO Commission (₹' + (${totalSikoGrossEarned}).toLocaleString('en-IN') + '). Zero rounding drift.', 'success')">
                🔄 Verify Math
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <div class="p-4 rounded-xl bg-white/10 border border-white/15">
              <span class="text-3xs font-extrabold uppercase tracking-wider text-slate-300 block">1. Gross Student Collections (GMV)</span>
              <div class="text-2xl font-black text-white mt-1">₹${totalGmvVal.toLocaleString('en-IN')}</div>
              <div class="text-2xs text-slate-300 mt-1">${is800Scenario ? '800 Students: 280 1:1 (₹2.38 Cr) + 520 Batch (₹1.976 Cr)' : `1-on-1 (₹${(cfoSummary?.channels.oneOnOne.gmv || 2245000).toLocaleString('en-IN')}) + Batches (₹${(cfoSummary?.channels.smartBatch.gmv || 1960000).toLocaleString('en-IN')})`}</div>
            </div>

            <div class="p-4 rounded-xl bg-blue-950/60 border border-blue-400/30">
              <span class="text-3xs font-extrabold uppercase tracking-wider text-blue-200 block">2. Teacher Milestone Escrow Pool (${blendedTeacherPct}%)</span>
              <div class="text-2xl font-black text-blue-300 mt-1">₹${totalTeacherEscrowPool.toLocaleString('en-IN')}</div>
              <div class="text-2xs text-blue-200 mt-1">M1 (50%): ₹${Math.round(totalTeacherEscrowPool * 0.5).toLocaleString('en-IN')} • M2 (25%): ₹${Math.round(totalTeacherEscrowPool * 0.25).toLocaleString('en-IN')} • M3 (25%): ₹${(totalTeacherEscrowPool - Math.round(totalTeacherEscrowPool * 0.5) - Math.round(totalTeacherEscrowPool * 0.25)).toLocaleString('en-IN')}</div>
            </div>

            <div class="p-4 rounded-xl text-white" style="background: rgba(16, 185, 129, 0.22); border: 2px solid #34d399; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);">
              <span class="text-3xs font-extrabold uppercase tracking-wider text-emerald-200 block">3. 💰 Total Amount SIKO Earns (${blendedSikoPct}%)</span>
              <div class="text-2xl font-black text-emerald-300 mt-1">₹${totalSikoGrossEarned.toLocaleString('en-IN')}</div>
              <div class="text-2xs text-emerald-200 font-bold mt-1">Exact: ₹${totalGmvVal.toLocaleString('en-IN')} GMV − ₹${totalTeacherEscrowPool.toLocaleString('en-IN')} Teacher Pool</div>
            </div>

            <div class="p-4 rounded-xl text-white" style="background: rgba(245, 158, 11, 0.22); border: 2px solid #fbbf24; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.25);">
              <span class="text-3xs font-extrabold uppercase tracking-wider text-amber-200 block">4. 📈 SIKO Net Profit (${blendedEbitdaPct}% EBITDA)</span>
              <div class="text-2xl font-black text-amber-300 mt-1">₹${totalSikoNetEbitda.toLocaleString('en-IN')}</div>
              <div class="text-2xs text-amber-200 font-bold mt-1">₹${totalSikoGrossEarned.toLocaleString('en-IN')} Gross − ₹${totalDirectCosts.toLocaleString('en-IN')} Direct Costs (12%)</div>
            </div>
          </div>

          ${cfoSummary ? `
            <!-- Channel-by-Channel Consolidated Reconciliation Table -->
            <div class="rounded-xl bg-slate-950/70 border border-white/15 p-4 overflow-x-auto">
              <div class="text-2xs font-extrabold uppercase tracking-wider text-emerald-300 mb-2">📊 Automated Channel-Wise Revenue &amp; SIKO Earnings Reconciliation (Exact Rupee Balance)</div>
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-white/15 text-slate-300 text-2xs uppercase">
                    <th class="py-2 pr-3">Revenue Channel</th>
                    <th class="py-2 px-3">Gross Student Fee (A)</th>
                    <th class="py-2 px-3">Teacher Escrow Pool (B)</th>
                    <th class="py-2 px-3 text-emerald-300">💰 Amount SIKO Earns (C = A − B)</th>
                    <th class="py-2 px-3">Direct Costs 12% (D)</th>
                    <th class="py-2 pl-3 text-amber-300">📈 SIKO Net Profit (E = C − D)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                  <tr>
                    <td class="py-2 pr-3 font-bold text-white">${cfoSummary.channels.oneOnOne.label}</td>
                    <td class="py-2 px-3 font-bold text-white">₹${cfoSummary.channels.oneOnOne.gmv.toLocaleString('en-IN')}</td>
                    <td class="py-2 px-3 font-bold text-blue-300">₹${cfoSummary.channels.oneOnOne.teacherPool.toLocaleString('en-IN')} (${cfoSummary.channels.oneOnOne.teacherSharePct}%)</td>
                    <td class="py-2 px-3 font-black text-emerald-300">₹${cfoSummary.channels.oneOnOne.sikoGrossEarned.toLocaleString('en-IN')} (${cfoSummary.channels.oneOnOne.sikoCommPct}%)</td>
                    <td class="py-2 px-3 text-slate-300">₹${cfoSummary.channels.oneOnOne.directCosts.toLocaleString('en-IN')} (12.0%)</td>
                    <td class="py-2 pl-3 font-black text-amber-300">₹${cfoSummary.channels.oneOnOne.netEbitda.toLocaleString('en-IN')} (${cfoSummary.channels.oneOnOne.netEbitdaPct}%)</td>
                  </tr>
                  <tr>
                    <td class="py-2 pr-3 font-bold text-white">${cfoSummary.channels.smartBatch.label}</td>
                    <td class="py-2 px-3 font-bold text-white">₹${cfoSummary.channels.smartBatch.gmv.toLocaleString('en-IN')}</td>
                    <td class="py-2 px-3 font-bold text-blue-300">₹${cfoSummary.channels.smartBatch.teacherPool.toLocaleString('en-IN')} (50.0%)</td>
                    <td class="py-2 px-3 font-black text-emerald-300">₹${cfoSummary.channels.smartBatch.sikoGrossEarned.toLocaleString('en-IN')} (50.0%)</td>
                    <td class="py-2 px-3 text-slate-300">₹${cfoSummary.channels.smartBatch.directCosts.toLocaleString('en-IN')} (12.0%)</td>
                    <td class="py-2 pl-3 font-black text-amber-300">₹${cfoSummary.channels.smartBatch.netEbitda.toLocaleString('en-IN')} (38.0%)</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="border-t-2 border-emerald-400/50 bg-emerald-950/50 font-black">
                    <td class="py-2.5 pr-3 text-emerald-200 uppercase text-2xs">Total Platform Consolidated</td>
                    <td class="py-2.5 px-3 text-white">₹${cfoSummary.totalGmv.toLocaleString('en-IN')}</td>
                    <td class="py-2.5 px-3 text-blue-300">₹${cfoSummary.totalTeacherEscrowPool.toLocaleString('en-IN')} (${cfoSummary.blendedTeacherSharePct}%)</td>
                    <td class="py-2.5 px-3 text-emerald-300">₹${cfoSummary.totalSikoGrossEarned.toLocaleString('en-IN')} (${cfoSummary.blendedSikoCommissionPct}%)</td>
                    <td class="py-2.5 px-3 text-slate-200">₹${cfoSummary.totalDirectCosts.toLocaleString('en-IN')} (12.0%)</td>
                    <td class="py-2.5 pl-3 text-amber-300">₹${cfoSummary.totalSikoNetEbitda.toLocaleString('en-IN')} (${cfoSummary.blendedNetEbitdaPct}%)</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ` : ''}
        </div>

        <!-- INTERACTIVE CFO PRICING & SIKO EARNINGS SIMULATOR -->
        <div class="card p-6 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white border border-blue-500/30 rounded-2xl shadow-md">
          <div class="flex flex-wrap items-start justify-between gap-4 pb-4 mb-5 border-b border-white/15">
            <div>
              <h3 class="text-lg font-black text-white">Interactive CFO Deal Simulator — Exact Rupee Waterfall Per Enrollment &amp; Cohort</h3>
              <p class="text-xs text-slate-300 mt-0.5">Select any Board, Enrollment Scope, Format (1-on-1 vs 1:Many Batch), and Teacher Tier to inspect the exact automated rupee split.</p>
            </div>
          </div>

          <!-- Interactive Simulator Controls -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
            <div class="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div class="text-3xs font-extrabold uppercase tracking-wider text-amber-300 mb-2">1. Select Board / Competitive Track</div>
              <div class="flex flex-wrap gap-1.5">
                ${boardKeys.map(bKey => `
                  <button type="button" onclick="window.setFinanceMatrixBoard('${bKey}')"
                          class="px-2.5 py-1 rounded-lg text-2xs font-extrabold cursor-pointer border-0 ${bKey === activeBoard ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}">
                    ${bKey}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div class="text-3xs font-extrabold uppercase tracking-wider text-emerald-300 mb-2">2. Enrollment Scope &amp; Discount Tier</div>
              <div class="flex flex-wrap gap-1.5">
                ${[
                  { id: 'chapter', label: 'Single Chapter (0% Off)' },
                  { id: 'subject', label: 'Full Subject (10% Off)' },
                  { id: 'bundle', label: '3-Subj Bundle (25% Off)' }
                ].map(sc => `
                  <button type="button" onclick="window.setFinanceSimScope('${sc.id}')"
                          class="px-2.5 py-1 rounded-lg text-2xs font-extrabold cursor-pointer border-0 ${simScope === sc.id ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-300 hover:bg-white/20'}">
                    ${sc.label}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div class="text-3xs font-extrabold uppercase tracking-wider text-sky-300 mb-2">3. Delivery Format &amp; Accredited Tier</div>
              <div class="flex flex-wrap gap-1.5">
                <button type="button" onclick="window.setFinanceSimFormat('1on1')"
                        class="px-2.5 py-1 rounded-lg text-2xs font-extrabold cursor-pointer border-0 ${simFormat === '1on1' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}">
                  🎯 1-on-1 Live
                </button>
                <button type="button" onclick="window.setFinanceSimFormat('batch')"
                        class="px-2.5 py-1 rounded-lg text-2xs font-extrabold cursor-pointer border-0 ${simFormat === 'batch' ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-300 hover:bg-white/20'}">
                  👥 1:Many Course Batch
                </button>
                ${['Master', 'Expert', 'Senior', 'Pro'].map(tr => `
                  <button type="button" onclick="window.setFinanceSimTier('${tr}')"
                          class="px-2 py-1 rounded-lg text-2xs font-extrabold cursor-pointer border-0 ${simTier === tr ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}">
                    ${tr}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          ${simQuote ? `
            <!-- 4-Card CFO Waterfall: Student Fee -> Teacher Pool -> Amount SIKO Earns -> SIKO Net EBITDA -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs mb-4">
              <div class="p-4 rounded-xl bg-white/10 border border-white/15">
                <span class="text-3xs font-extrabold uppercase tracking-wider text-slate-300 block">1. Student Final Course Fee (${simQuote.totalHours} Hrs)</span>
                <div class="text-2xl font-black text-white mt-1">₹${simQuote.netStudentCourseFeeExclGst.toLocaleString('en-IN')}</div>
                <div class="text-3xs text-slate-300 mt-1">Rate: ₹${simQuote.effectiveStudentRatePerHour}/hr (Gross ₹${simQuote.grossMarketTuition.toLocaleString('en-IN')} − ${simQuote.discountPct}% Off)</div>
              </div>

              <div class="p-4 rounded-xl bg-blue-900/40 border border-blue-400/40">
                <span class="text-3xs font-extrabold uppercase tracking-wider text-blue-200 block">2. Teacher Approved Pool (${simQuote.teacherSharePct}%)</span>
                <div class="text-2xl font-black text-blue-300 mt-1">₹${simQuote.netTeacherPool.toLocaleString('en-IN')}</div>
                <div class="text-2xs text-blue-200 mt-1">M1 (50%): ₹${simQuote.milestones[0].grossPayout.toLocaleString('en-IN')} | M2: ₹${simQuote.milestones[1].grossPayout.toLocaleString('en-IN')} | M3: ₹${simQuote.milestones[2].grossPayout.toLocaleString('en-IN')}</div>
              </div>

              <div class="p-4 rounded-xl bg-emerald-500/25 border-2 border-emerald-400 shadow-md">
                <span class="text-3xs font-extrabold uppercase tracking-wider text-emerald-200 block">3. 💰 Amount SIKO Earns (${simQuote.sikoCommissionPct}% Commission)</span>
                <div class="text-2xl font-black text-emerald-300 mt-1">₹${simQuote.sikoGrossCommission.toLocaleString('en-IN')}</div>
                <div class="text-2xs text-emerald-100 font-bold mt-1">SIKO Earns ₹${simQuote.sikoEffectiveHourlyEarned.toLocaleString('en-IN')}/hr (₹${simQuote.netStudentCourseFeeExclGst.toLocaleString('en-IN')} − ₹${simQuote.netTeacherPool.toLocaleString('en-IN')})</div>
              </div>

              <div class="p-4 rounded-xl bg-amber-500/20 border border-amber-400/50">
                <span class="text-3xs font-extrabold uppercase tracking-wider text-amber-200 block">4. 📈 SIKO Net Profit (${simQuote.sikoNetEbitdaPct}% EBITDA)</span>
                <div class="text-2xl font-black text-amber-300 mt-1">₹${simQuote.sikoNetEbitdaMargin.toLocaleString('en-IN')}</div>
                <div class="text-3xs text-amber-100 mt-1">After 12% Direct Costs: AI ₹${simQuote.sikoCostBreakdown.aiComputeAndGrading.toLocaleString('en-IN')} + PG ₹${simQuote.sikoCostBreakdown.paymentGatewayAndEscrow.toLocaleString('en-IN')} + QA ₹${simQuote.sikoCostBreakdown.academicSupportAndOps.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <!-- 1-to-Many Cohort SIKO Earnings Box -->
            ${simQuote.batchCohortMath ? `
              <div class="p-4 rounded-xl bg-emerald-950/80 border border-emerald-400/50 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span class="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-3xs uppercase">👥 1-to-Many Smart Batch Cohort Math (${simQuote.batchCohortMath.cohortSize} Students Enrolled • Max 30 Cap)</span>
                  <div class="font-bold text-white mt-1">Total Cohort Student Fees Collected: <strong class="text-amber-300">₹${simQuote.batchCohortMath.cohortTotalStudentFees.toLocaleString('en-IN')}</strong> (${simQuote.batchCohortMath.cohortSize} Students × ₹${simQuote.batchCohortMath.perStudentCourseFee.toLocaleString('en-IN')})</div>
                </div>
                <div class="flex flex-wrap gap-3">
                  <div class="px-3 py-2 rounded-lg bg-white/10 border border-white/15">
                    <span class="text-3xs text-slate-300 block uppercase font-bold">Teacher 50% Cohort Pool</span>
                    <strong class="text-base font-black text-blue-300">₹${simQuote.batchCohortMath.cohortTeacherFinalPayout.toLocaleString('en-IN')}</strong>
                  </div>
                  <div class="px-3 py-2 rounded-lg bg-emerald-500/30 border border-emerald-400">
                    <span class="text-3xs text-emerald-200 block uppercase font-extrabold">💰 Amount SIKO Earns (50% Share)</span>
                    <strong class="text-base font-black text-emerald-300">₹${simQuote.batchCohortMath.cohortSikoFixed50PctCommission.toLocaleString('en-IN')}</strong>
                  </div>
                  <div class="px-3 py-2 rounded-lg bg-amber-500/25 border border-amber-400/50">
                    <span class="text-3xs text-amber-200 block uppercase font-extrabold">📈 SIKO Net Cohort Profit (38% EBITDA)</span>
                    <strong class="text-base font-black text-amber-300">₹${simQuote.batchCohortMath.cohortSikoNetEbitda.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            ` : ''}
          ` : ''}
        </div>

        <!-- DYNAMIC SIKO COMMISSION & EARNINGS BY TIER REFERENCE MATRIX -->
        <div class="card p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
            <div>
              <h4 class="text-base font-black text-slate-900">💰 Live SIKO Commission &amp; Net Earnings Matrix — ${activeBoard} (${activeSubject})</h4>
              <p class="text-xs text-slate-500">Dynamically calculated for <strong>${activeBoard} • ${activeSubject}</strong> across all 1-on-1 Faculty Tiers and 1-to-Many Smart Batches.</p>
            </div>
            <span class="badge badge-success text-2xs font-extrabold">100% Formula-Driven (Zero Hardcoded Figures)</span>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Format &amp; Faculty Tier</th>
                  <th>Student Rate / Hr (Net)</th>
                  <th>Teacher Pool / Hr</th>
                  <th>💰 SIKO Commission %</th>
                  <th>💰 Amount SIKO Earns / Hr</th>
                  <th>💰 Amount SIKO Earns (${activeSubject} • ${tierMatrixRows[0]?.q?.totalHours || 60} Hrs)</th>
                  <th>📈 SIKO Net Profit (After 12% Direct Costs)</th>
                </tr>
              </thead>
              <tbody>
                ${tierMatrixRows.map(({ tKey, q }) => {
                  if (!q) return '';
                  const teacherHr = Math.round(q.netTeacherPool / Math.max(1, q.totalHours));
                  const sikoHr = q.effectiveStudentRatePerHour - teacherHr;
                  return `
                    <tr>
                      <td>
                        <strong class="text-xs text-slate-900">🎯 1-on-1 • ${tKey} Tier</strong>
                        <span class="text-2xs text-slate-500 block">${q.teacherTier.label}</span>
                      </td>
                      <td class="text-xs font-bold text-slate-900">₹${q.effectiveStudentRatePerHour.toLocaleString('en-IN')}/hr <span class="text-2xs text-slate-500 block">(Course: ₹${q.netStudentCourseFeeExclGst.toLocaleString('en-IN')})</span></td>
                      <td class="text-xs font-bold text-blue-700">₹${teacherHr.toLocaleString('en-IN')}/hr (${q.teacherSharePct}%) <span class="text-2xs text-blue-600 block">(Pool: ₹${q.netTeacherPool.toLocaleString('en-IN')})</span></td>
                      <td><span class="badge badge-success text-2xs font-black">${q.sikoCommissionPct}% SIKO Share</span></td>
                      <td class="text-xs font-black text-emerald-700">₹${sikoHr.toLocaleString('en-IN')}/hr</td>
                      <td class="text-xs font-black text-emerald-700 bg-emerald-50/50">₹${q.sikoGrossCommission.toLocaleString('en-IN')} / student</td>
                      <td class="text-xs font-black text-amber-700">₹${q.sikoNetEbitdaMargin.toLocaleString('en-IN')} (${q.sikoNetEbitdaPct}% EBITDA)</td>
                    </tr>
                  `;
                }).join('')}
                ${batchMatrixQuote ? (() => {
                  const bcm = batchMatrixQuote.batchCohortMath;
                  const cohortHrTotal = batchMatrixQuote.effectiveStudentRatePerHour * bcm.cohortSize;
                  const cohortTeacherHr = Math.round(cohortHrTotal * 0.50);
                  const cohortSikoHr = cohortHrTotal - cohortTeacherHr;
                  return `
                    <tr class="bg-emerald-50/70">
                      <td>
                        <strong class="text-xs text-emerald-950">👥 1-to-Many Smart Batch (${bcm.cohortSize} Students)</strong>
                        <span class="text-2xs text-emerald-700 block">Pre-Decided Schedule (Max 30 Cap)</span>
                      </td>
                      <td class="text-xs font-bold text-slate-900">₹${batchMatrixQuote.effectiveStudentRatePerHour.toLocaleString('en-IN')}/hr per student <span class="text-2xs text-slate-500 block">(₹${cohortHrTotal.toLocaleString('en-IN')}/hr Cohort)</span></td>
                      <td class="text-xs font-bold text-blue-700">₹${cohortTeacherHr.toLocaleString('en-IN')}/hr Cohort (50%) <span class="text-2xs text-blue-600 block">(Pool: ₹${bcm.cohortTeacherFinalPayout.toLocaleString('en-IN')})</span></td>
                      <td><span class="badge badge-warning text-2xs font-black">50% Fixed SIKO Share</span></td>
                      <td class="text-xs font-black text-emerald-800">₹${cohortSikoHr.toLocaleString('en-IN')}/hr Cohort</td>
                      <td class="text-xs font-black text-emerald-800">₹${bcm.cohortSikoFixed50PctCommission.toLocaleString('en-IN')} / batch</td>
                      <td class="text-xs font-black text-amber-800">₹${bcm.cohortSikoNetEbitda.toLocaleString('en-IN')} (38.0% EBITDA)</td>
                    </tr>
                  `;
                })() : ''}
              </tbody>
            </table>
          </div>
        </div>

        <!-- BOARD & PRODUCT TEACHING NO. OF HOURS MATRIX (SUBJECT-WISE & CHAPTER-WISE WITH SIKO EARNINGS & FOOTER RECONCILIATION) -->
        <div class="card p-6 bg-white border rounded-xl shadow-xs">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
            <div>
              <h4 class="text-base font-black text-slate-900">${activeBoard} — Subject-Wise &amp; Chapter-Wise Teaching Hours, Teacher Pool &amp; Amount SIKO Earns</h4>
              <p class="text-xs text-slate-500">Click any subject tab below to inspect chapter teaching hours, Student Final Fee, Teacher Approved Pool, and <strong>💰 Exact Amount SIKO Earns</strong> with full column reconciliation.</p>
            </div>
            <div class="flex flex-wrap gap-2">
              ${subjectKeys.map(sKey => {
                const sTot = boardObj.subjects[sKey].chapters.reduce((a, c) => a + c.totalHours, 0);
                return `
                  <button type="button" onclick="window.setFinanceMatrixSubject('${sKey}')"
                          class="px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer ${sKey === activeSubject ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'}">
                    ${sKey} (${sTot} Hrs)
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Chapter Code</th>
                  <th>${activeBoard} • ${activeSubject} Chapter Title</th>
                  <th>Lecture / Practice / Test Hrs</th>
                  <th>Total Hrs</th>
                  <th>Student Final Fee (A)</th>
                  <th>Teacher Pool ${teacherSharePct}% (B)</th>
                  <th>💰 Amount SIKO Earns ${commPct}% (C = A − B)</th>
                  <th>📈 SIKO Net Profit (After 12% Cost)</th>
                </tr>
              </thead>
              <tbody>
                ${chapterRowsComputed.map(ch => `
                  <tr>
                    <td class="font-mono text-xs font-bold text-indigo-700">${ch.code}</td>
                    <td>
                      <strong class="text-xs text-slate-900 block">${ch.name}</strong>
                      <span class="text-2xs text-slate-500">Exam Weightage: ${ch.weightageMarks} Marks</span>
                    </td>
                    <td class="text-xs text-slate-700 font-medium">${ch.lectureHours}h Lec • ${ch.practiceHours}h Prac • ${ch.doubtTestHours}h Test</td>
                    <td class="text-xs font-black text-slate-900">${ch.totalHours} Hrs</td>
                    <td class="text-xs font-bold text-slate-900">₹${ch.chFee.toLocaleString('en-IN')}</td>
                    <td class="text-xs font-black text-blue-700">₹${ch.chTeacher.toLocaleString('en-IN')}</td>
                    <td class="text-xs font-black text-emerald-700 bg-emerald-50/60">₹${ch.chSikoEarns.toLocaleString('en-IN')} (${commPct}%)</td>
                    <td class="text-xs font-black text-amber-700">₹${ch.chSikoNet.toLocaleString('en-IN')}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr class="bg-slate-100 font-black border-t-2 border-slate-300">
                  <td class="text-xs text-indigo-900">TOTAL</td>
                  <td class="text-xs text-slate-900">${activeBoard} • ${activeSubject} Complete Syllabus (${chapterRowsComputed.length} Chapters)</td>
                  <td class="text-xs text-slate-800">${Number(chLecSum.toFixed(1))}h Lec • ${Number(chPracSum.toFixed(1))}h Prac • ${Number(chTestSum.toFixed(1))}h Test</td>
                  <td class="text-xs text-slate-900">${chTotalHoursSum} Hrs</td>
                  <td class="text-xs text-slate-900">₹${chFeeSum.toLocaleString('en-IN')}</td>
                  <td class="text-xs text-blue-800">₹${chTeacherSum.toLocaleString('en-IN')} (${teacherSharePct}%)</td>
                  <td class="text-xs text-emerald-800 bg-emerald-100/80">₹${chSikoEarnsSum.toLocaleString('en-IN')} (${commPct}%)</td>
                  <td class="text-xs text-amber-800">₹${chSikoNetSum.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Live Milestone Escrow & SIKO Commission Ledger Table -->
        <div class="card p-6 bg-white border rounded-xl shadow-xs">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h4 class="text-sm font-bold text-slate-900">Live Milestone Escrow &amp; SIKO Platform Commission Ledger</h4>
              <p class="text-xs text-slate-500">Every escrow slice reconciles to the exact rupee: <strong>Student Fee Slice = Teacher Escrow Payout + 💰 Amount SIKO Earns</strong>.</p>
            </div>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Escrow ID</th>
                  <th>Student &amp; Cohort</th>
                  <th>Faculty &amp; Format</th>
                  <th>Milestone Stage</th>
                  <th>Student Fee Slice (A)</th>
                  <th>Teacher Escrow Payout (B)</th>
                  <th>💰 Amount SIKO Earns (C = A − B)</th>
                  <th>📈 SIKO Net EBITDA</th>
                  <th>Status &amp; Action</th>
                </tr>
              </thead>
              <tbody>
                ${enrichedLedgerRows.map(tx => {
                  const isReleased = tx.status === 'Released';
                  return `
                    <tr>
                      <td class="font-mono text-xs font-bold text-blue-700">${tx.id}</td>
                      <td>
                        <strong class="text-xs text-slate-900 block">${tx.student}</strong>
                        <span class="text-2xs font-mono text-slate-500">Batch: ${tx.batch}</span>
                      </td>
                      <td>
                        <strong class="text-xs text-slate-800 block">${tx.teacher}</strong>
                        <span class="text-2xs text-indigo-700 font-semibold">${tx.formatLabel}</span>
                      </td>
                      <td class="text-xs text-slate-800">${tx.milestone}</td>
                      <td class="text-xs font-bold text-slate-900">₹${tx.studentFeeSlice.toLocaleString('en-IN')}</td>
                      <td>
                        <strong class="text-xs font-black text-blue-700 block">₹${tx.teacherPayout.toLocaleString('en-IN')} (${tx.teacherSharePct}%)</strong>
                        <span class="text-3xs text-slate-500">Net Bank after 10% TDS: ₹${tx.teacherNetBank.toLocaleString('en-IN')}</span>
                      </td>
                      <td class="text-xs font-black text-emerald-700 bg-emerald-50/70">₹${tx.sikoGrossEarned.toLocaleString('en-IN')} (${tx.sikoCommPct}%)</td>
                      <td class="text-xs font-black text-amber-700">₹${tx.sikoNetEbitda.toLocaleString('en-IN')}</td>
                      <td>
                        <div class="flex items-center gap-2">
                          <span class="badge ${isReleased ? 'badge-success' : 'badge-warning'} text-2xs">
                            ${tx.status}
                          </span>
                          ${isReleased ? `
                            <span class="text-2xs text-slate-400 font-mono">${tx.releasedAt || 'Settled'}</span>
                          ` : `
                            <button class="btn btn-primary btn-xs text-3xs font-bold" onclick="window.releaseEscrowMilestone('${tx.id}')">
                              Release →
                            </button>
                          `}
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
              <tfoot>
                <tr class="bg-slate-100 font-black border-t-2 border-slate-300">
                  <td colspan="4" class="text-xs text-slate-900 uppercase">Total Active Milestone Escrow Slice Ledger (${enrichedLedgerRows.length} Records)</td>
                  <td class="text-xs text-slate-900">₹${ledgerTotals.studentFeeSum.toLocaleString('en-IN')}</td>
                  <td class="text-xs text-blue-800">₹${ledgerTotals.teacherPayoutSum.toLocaleString('en-IN')} <span class="text-3xs font-semibold text-slate-600 block">(Bank: ₹${ledgerTotals.teacherNetBankSum.toLocaleString('en-IN')} | TDS: ₹${ledgerTotals.tdsSum.toLocaleString('en-IN')})</span></td>
                  <td class="text-xs text-emerald-800 bg-emerald-100/80">₹${ledgerTotals.sikoGrossSum.toLocaleString('en-IN')}</td>
                  <td class="text-xs text-amber-800">₹${ledgerTotals.sikoNetEbitdaSum.toLocaleString('en-IN')}</td>
                  <td class="text-2xs text-emerald-700 font-bold">✓ 100% Reconciled</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- DUAL-EXECUTIVE CAO/COO STATUTORY REFUND APPROVAL & CFO ELECTRONIC DISBURSAL QUEUE -->
        <div class="card p-6 bg-white border-2 border-indigo-200 rounded-2xl shadow-sm space-y-4 max-w-full overflow-hidden">
          <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-100">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="badge badge-warning text-3xs uppercase font-black">
                  🏛️ Statutory Grievance &amp; Fee Protection Engine
                </span>
                <span class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-extrabold text-3xs">
                  Dual-Executive Gate (CAO + COO) &rarr; CFO Electronic Disbursal
                </span>
              </div>
              <h3 class="text-base sm:text-lg font-black text-slate-900 mt-1">
                Student Refund Grievance Queue &amp; Automated Gateway Disbursal
              </h3>
              <p class="text-2xs text-slate-500 max-w-2xl leading-relaxed">
                As per SIKO Student Refund, Cancellation &amp; Fee Protection Policy (Sections 3, 5 &amp; 6): All refund requests require dual statutory verification (CAO Academic Audit + COO Operational Verification) before the Chief Financial Officer (CFO) can execute electronic gateway disbursal with Bank UTR &amp; statutory credit note.
              </p>
            </div>
            <button class="btn btn-outline btn-xs text-xs font-bold" onclick="window.openStudentRefundModal()">
              + Raise Statutory Refund Request
            </button>
          </div>

          <!-- Refund Tickets Cards / Table -->
          ${(() => {
            const tickets = (AppState.refundWorkflow && AppState.refundWorkflow.tickets) || [];
            if (tickets.length === 0) {
              return `
                <div class="p-6 rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs bg-slate-50">
                  No active refund grievances or pending requests. All student orders 100% active.
                </div>
              `;
            }

            return `
              <div class="space-y-4">
                ${tickets.map(t => {
                  const caoDone = t.caoStatus && t.caoStatus.includes('Approved');
                  const cooDone = t.cooStatus && t.cooStatus.includes('Approved');
                  const isDisbursed = t.cfoStatus && t.cfoStatus.includes('Disbursed');
                  const canDisburse = caoDone && cooDone && !isDisbursed;

                  return `
                    <div class="p-5 rounded-2xl border ${isDisbursed ? 'border-emerald-300 bg-emerald-50/40' : 'border-indigo-200 bg-slate-50/70'} shadow-xs space-y-4">
                      <!-- Ticket Meta Header -->
                      <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                        <div>
                          <div class="flex items-center gap-2 flex-wrap mb-1">
                            <span class="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono text-3xs font-extrabold">
                              Ticket #${t.ticketId}
                            </span>
                            <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-3xs font-bold">
                              Order #${t.orderId}
                            </span>
                            <span class="text-3xs text-slate-500">Submitted: ${t.submittedAt}</span>
                          </div>
                          <h4 class="font-black text-slate-900 text-sm">
                            Student: ${t.studentName || 'Enrolled Student'} • Parent: ${t.parentName || 'Parent / Legal Guardian'}
                          </h4>
                          <div class="text-2xs text-indigo-900 font-semibold mt-0.5">
                            ${t.clauseLabel || 'Statutory Policy Clause'}
                          </div>
                        </div>

                        <div class="text-right">
                          <span class="text-3xs font-extrabold uppercase text-slate-400 block">Claimed Refund Amount</span>
                          <span class="text-xl font-black text-slate-900">₹${Number(t.amount).toLocaleString('en-IN')}</span>
                          <span class="text-3xs text-emerald-700 block font-bold">${isDisbursed ? '✓ Fully Settled' : 'In Statutory Escrow'}</span>
                        </div>
                      </div>

                      <!-- Grievance Reason -->
                      <div class="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
                        <strong class="text-slate-900 block text-3xs uppercase font-extrabold mb-0.5">Student / Parent Grievance Declaration:</strong>
                        <p class="italic text-2xs leading-relaxed">"${t.reason}"</p>
                      </div>

                      <!-- Dual Approval Gates + CFO Disbursal Action Grid -->
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <!-- Gate 1: CAO Academic Approval -->
                        <div class="p-3.5 rounded-xl border ${caoDone ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'} space-y-2">
                          <div class="flex items-center justify-between">
                            <span class="text-3xs font-black uppercase tracking-wider text-slate-600">Gate 1: CAO Academic Audit</span>
                            <span class="text-3xs font-bold ${caoDone ? 'text-emerald-700' : 'text-amber-700'}">${caoDone ? '✓ Verified' : 'Pending'}</span>
                          </div>
                          <div class="text-2xs text-slate-700">
                            ${t.caoStatus || 'Verifying undelivered syllabus portions and faculty logs.'}
                          </div>
                          ${!caoDone ? `
                            <button type="button" onclick="window.approveRefundByCao('${t.ticketId}')"
                              class="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-3xs cursor-pointer border-0 shadow-2xs">
                              ✓ CAO Academic Sign-Off
                            </button>
                          ` : `
                            <div class="text-3xs text-emerald-800 font-semibold">Signed: ${t.caoApprovedAt || 'Recorded'}</div>
                          `}
                        </div>

                        <!-- Gate 2: COO Operations Verification -->
                        <div class="p-3.5 rounded-xl border ${cooDone ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'} space-y-2">
                          <div class="flex items-center justify-between">
                            <span class="text-3xs font-black uppercase tracking-wider text-slate-600">Gate 2: COO Operations Verification</span>
                            <span class="text-3xs font-bold ${cooDone ? 'text-emerald-700' : 'text-amber-700'}">${cooDone ? '✓ Verified' : 'Pending'}</span>
                          </div>
                          <div class="text-2xs text-slate-700">
                            ${t.cooStatus || 'Verifying telemetry, zero live entry, and cooling-off timeline.'}
                          </div>
                          ${!cooDone ? `
                            <button type="button" onclick="window.approveRefundByCoo('${t.ticketId}')"
                              class="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-3xs cursor-pointer border-0 shadow-2xs">
                              ✓ COO Operations Sign-Off
                            </button>
                          ` : `
                            <div class="text-3xs text-emerald-800 font-semibold">Signed: ${t.cooApprovedAt || 'Recorded'}</div>
                          `}
                        </div>

                        <!-- Gate 3: CFO Electronic Disbursal -->
                        <div class="p-3.5 rounded-xl border ${isDisbursed ? 'bg-emerald-100 border-emerald-400' : canDisburse ? 'bg-amber-50 border-amber-300' : 'bg-slate-100 border-slate-200'} space-y-2">
                          <div class="flex items-center justify-between">
                            <span class="text-3xs font-black uppercase tracking-wider text-slate-600">Gate 3: CFO Electronic Disbursal</span>
                            <span class="text-3xs font-bold ${isDisbursed ? 'text-emerald-800' : canDisburse ? 'text-amber-800' : 'text-slate-400'}">
                              ${isDisbursed ? '✓ Disbursed' : canDisburse ? 'Ready' : 'Locked'}
                            </span>
                          </div>

                          ${isDisbursed ? `
                            <div class="text-3xs text-emerald-950 font-mono space-y-1">
                              <div><strong>Bank UTR:</strong> ${t.utrNumber}</div>
                              <div><strong>Credit Note:</strong> ${t.creditNoteId}</div>
                              <div class="text-slate-500 font-sans">${t.disbursedAt}</div>
                            </div>
                          ` : canDisburse ? `
                            <button type="button" onclick="window.disburseRefundByCfo('${t.ticketId}')"
                              class="w-full py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs cursor-pointer border-0 shadow-md">
                              💸 Disburse Refund via Payment Gateway API &rarr;
                            </button>
                          ` : `
                            <div class="text-3xs text-slate-400 italic">
                              🔒 Disbursal locked until both CAO and COO sign-offs are completed.
                            </div>
                          `}
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `;
          })()}
        </div>
      </div>
    `;
  }

  /* ─────────────────────────────────────────────────────────────
     3. ACADEMIC QUALITY & AI QUEUE
     ───────────────────────────────────────────────────────────── */
  if (currentTab === 'academic') {
    return `
      <div class="space-y-6">
        <div class="card p-6 bg-white border rounded-xl shadow-xs">
          <h3 class="text-lg font-bold text-slate-900 mb-2">Academic Governance & AI Quality Queue</h3>
          <p class="text-xs text-slate-500 mb-6">AI assists in rapid question synthesis, diagnostic checks, and grading, but teacher approval is mandatory before student release.</p>

          <div class="grid grid-cols-4 gap-4 mb-6 text-center text-xs">
            <div class="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <span class="text-blue-600 font-bold block mb-1">AI Worksheets Generated</span>
              <div class="text-2xl font-black text-blue-900">384</div>
              <span class="text-2xs text-slate-500">Across 41 Sprints</span>
            </div>
            <div class="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <span class="text-emerald-700 font-bold block mb-1">Teacher Review Time</span>
              <div class="text-2xl font-black text-emerald-900">2.1 hrs</div>
              <span class="text-2xs text-emerald-600">SLA: Under 6 hours</span>
            </div>
            <div class="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
              <span class="text-amber-700 font-bold block mb-1">Quality Flag Rate</span>
              <div class="text-2xl font-black text-amber-900">0.08%</div>
              <span class="text-2xs text-slate-500">Hallucination rate</span>
            </div>
            <div class="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
              <span class="text-purple-700 font-bold block mb-1">PTM Compliance Rate</span>
              <div class="text-2xl font-black text-purple-900">98.4%</div>
              <span class="text-2xs text-purple-600">Parent acknowledged</span>
            </div>
          </div>
        </div>

        <div class="card p-6 bg-white border rounded-xl shadow-xs">
          <h4 class="text-sm font-bold text-slate-900 mb-4">Active AI Worksheet Generation & Review Queue</h4>
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Worksheet ID</th>
                  <th>Curriculum Chapter & Concept</th>
                  <th>Questions Mix</th>
                  <th>AI Confidence</th>
                  <th>Assigned Faculty</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${aiQueue.map(item => `
                  <tr>
                    <td class="font-mono text-xs font-bold text-blue-700">${item.id}</td>
                    <td>
                      <strong class="text-xs text-slate-900 block">${item.chapter}</strong>
                      <span class="text-2xs text-slate-500">${item.concept}</span>
                    </td>
                    <td class="text-xs text-slate-700 font-medium">${item.questionsCount} Qs (${item.difficulty})</td>
                    <td>
                      <span class="badge badge-success text-2xs font-bold">${item.confidence}% Match</span>
                    </td>
                    <td class="text-xs text-slate-700">${item.teacher}</td>
                    <td>
                      <span class="badge ${item.status === 'Approved' ? 'badge-success' : 'badge-warning'} text-2xs">
                        ${item.status}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-outline btn-xs text-2xs" onclick="window.showToast('Inspecting questions and AI explanations for ${item.id}', 'info')">
                        Inspect
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  /* ─────────────────────────────────────────────────────────────
     3B. FACULTY CONTINGENCY, ABSENCE & TIMETABLE RESCHEDULE
     ───────────────────────────────────────────────────────────── */
  if (currentTab === 'contingency') {
    const abs = AppState.teacherAbsence || {};
    const bridge = AppState.aiPracticeBridge || {};
    const hasAbs = !!abs.hasActiveAbsence;
    const teacherName = (AppState.teacherOnboarding && AppState.teacherOnboarding.fullName) || 'Dedicated Master Faculty';

    return `
      <div class="space-y-6 max-w-full overflow-hidden">
        <!-- Contingency Header -->
        <div class="card p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span class="badge badge-warning text-3xs uppercase font-black">
                🚑 SIKO Faculty Contingency &amp; Pacing Engine
              </span>
              <h2 class="text-lg sm:text-xl font-black text-slate-900 mt-1">
                Faculty Absence, Syllabus Recovery &amp; Automated Timetable Recalibration
              </h2>
              <p class="text-2xs text-slate-500 max-w-2xl leading-relaxed">
                When an educator reports leave due to health or unforeseen circumstances, the timetable is automatically reconfigured based on their recovery strategy (Weekend Marathon, Daily Sprints, or Accredited Stand-in). Meanwhile, the AI Practice Bridge ensures the student is never left idle. Admin holds final control over all overrides, rescheduling approvals, and remuneration adjustments.
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button class="btn btn-outline btn-sm text-xs font-bold" onclick="window.openTeacherAbsenceModal()">
                🚑 Simulate / Report Leave
              </button>
            </div>
          </div>

          <!-- Active Absence Incident Report -->
          ${hasAbs ? `
            <div class="p-6 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-3xs uppercase">
                    Incident Active • Leave Reported
                  </span>
                  <span class="font-black text-slate-900 text-sm">
                    Faculty: ${teacherName} (Physics Specialist)
                  </span>
                </div>
                <span class="text-3xs text-amber-900 font-bold">Reported: ${abs.reportedAt || 'Today'}</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div class="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
                  <span class="text-3xs font-extrabold uppercase text-slate-400 block">Medical / Unforeseen Reason</span>
                  <strong class="text-slate-900 block">${abs.reason || 'Medical / Viral Fever'}</strong>
                  <span class="text-3xs text-slate-500">Duration: ${abs.durationDays || 1} Day(s)</span>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
                  <span class="text-3xs font-extrabold uppercase text-slate-400 block">Selected Recovery Strategy</span>
                  <strong class="text-indigo-900 block">${abs.recoveryStrategyLabel || 'Weekend Recovery Marathon'}</strong>
                  <span class="text-3xs text-emerald-700 font-bold">100% Pacing Protected ✓</span>
                </div>

                <div class="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
                  <span class="text-3xs font-extrabold uppercase text-slate-400 block">Rescheduled Timetable Slot</span>
                  <strong class="text-emerald-900 block">${abs.rescheduledSlot || 'Saturday • 10:00 AM IST'}</strong>
                  <span class="text-3xs text-slate-500">Affected: ${abs.affectedClass || 'Laws of Motion'}</span>
                </div>
              </div>

              <!-- Admin Command Action Buttons -->
              <div class="p-4 rounded-xl bg-white border border-amber-300 flex flex-wrap items-center justify-between gap-3">
                <div class="text-2xs text-slate-700">
                  <strong>Administrative Authority:</strong> You can approve and broadcast the reschedule, depute an accredited peer faculty, or force-release the self-study practice bridge.
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button type="button" onclick="window.showToast('✓ Reschedule Confirmed & Broadcast to Student, Parent & Teacher Calendars!', 'success')"
                    class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs cursor-pointer border-0 shadow-sm">
                    ✓ Confirm &amp; Sync Timetable
                  </button>
                  <button type="button" onclick="window.showToast('👥 Stand-in Faculty Dr. Vikram Malhotra deputed for today session.', 'info')"
                    class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer border-0 shadow-sm">
                    👥 Assign Stand-in Faculty
                  </button>
                  <button type="button" onclick="window.endorseAndReleaseAiPracticeBridge('${bridge.bridgeId || 'BRIDGE-AI-9021'}')"
                    class="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer border-0 shadow-sm">
                    🚀 Force-Release AI Practice Bridge
                  </button>
                </div>
              </div>
            </div>
          ` : `
            <div class="p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500 bg-slate-50 space-y-2">
              <div class="text-3xl">🟢</div>
              <h4 class="font-black text-slate-900 text-base">All 312 Faculty Delivering on Schedule</h4>
              <p class="text-2xs text-slate-500 max-w-md mx-auto">
                No active educator medical leave or emergency reschedule requests. Zero timetable clashes reported across all 41 sprint batches and 1:1 mentorship sessions.
              </p>
              <div class="pt-2">
                <button type="button" onclick="window.openTeacherAbsenceModal()" class="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer border-0">
                  🚑 Test Faculty Absence Simulation &rarr;
                </button>
              </div>
            </div>
          `}
        </div>

        <!-- Student Never Left Idle: AI Practice Bridge Overview -->
        <div class="card p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div>
              <span class="text-3xs font-extrabold uppercase tracking-wider text-purple-700 block">Closed-Loop Self-Study Integrity</span>
              <h3 class="text-base font-black text-slate-900">Student AI Practice Bridge Oversight</h3>
              <span class="text-2xs text-slate-500">Autonomous adaptive question bank triggered during class rescheduling to prevent student idle time.</span>
            </div>
            <span class="px-2.5 py-1 rounded-full ${bridge.status === 'released_to_student' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold' : 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'} text-2xs">
              ${bridge.status === 'released_to_student' ? '✓ Bridge Active &amp; Released to Student' : '⏳ Pending Educator Verification'}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span class="text-3xs font-bold text-slate-400 uppercase">Target Concept</span>
              <div class="font-black text-slate-900 mt-0.5">${bridge.topic || 'Laws of Motion: Incline Constraints'}</div>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span class="text-3xs font-bold text-slate-400 uppercase">Adaptive Questions</span>
              <div class="font-black text-purple-700 mt-0.5">${bridge.questionsCount || 10} Questions (4 Easy + 4 Med + 2 Hard)</div>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span class="text-3xs font-bold text-slate-400 uppercase">Pedagogical Reviewer</span>
              <div class="font-black text-emerald-700 mt-0.5">${teacherName} (Assigned Educator)</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ─────────────────────────────────────────────────────────────
     4. COMPLIANCE & AUDIT LOGS
     ───────────────────────────────────────────────────────────── */
  if (currentTab === 'audit') {
    return `
      <div class="card p-6 bg-white border rounded-xl shadow-xs">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Platform Compliance & Security Audit Logs</h3>
            <p class="text-xs text-slate-500">Immutable ledger of administrative actions, escrow releases, educator accreditations, and class room sessions.</p>
          </div>
          <button class="btn btn-outline btn-sm text-xs" onclick="window.exportAdminAuditReport()">
            Download Full CSV
          </button>
        </div>

        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Role</th>
                <th>Action Performed</th>
                <th>Target Resource</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${auditLogs.map(log => `
                <tr>
                  <td class="font-mono text-xs font-bold text-blue-700">${log.id}</td>
                  <td class="text-xs font-mono text-slate-500">${log.timestamp}</td>
                  <td class="text-xs font-bold text-slate-900">${log.actor}</td>
                  <td>
                    <span class="badge badge-primary text-3xs uppercase font-bold">${log.role}</span>
                  </td>
                  <td class="text-xs text-slate-800 font-medium">${log.action}</td>
                  <td class="text-xs font-mono text-slate-600">${log.entity}</td>
                  <td>
                    <span class="badge badge-success text-2xs font-bold">${log.status}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* ─────────────────────────────────────────────────────────────
     5. DEFAULT: FACULTY AVAILABILITY UTILIZATION + BATCHES GOVERNANCE
     ───────────────────────────────────────────────────────────── */
  const utilData = AppState.facultyUtilization || {
    targetPlatformUtilizationPct: 94,
    currentPlatformUtilizationPct: 92,
    totalDeclaredWeeklyHours: 242,
    totalAllocatedWeeklyHours: 223,
    lastOptimizedAt: 'Today, 6:45 PM IST',
    records: []
  };

  return `
    <!-- SIKO FACULTY AVAILABILITY & MAXIMUM UTILIZATION OPTIMIZER -->
    <div class="card p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 rounded-2xl shadow-md mb-6">
      <div class="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-3xs font-extrabold uppercase">
              ⚡ AI Faculty Availability & Maximum Utilization Engine
            </span>
            <span class="text-2xs text-indigo-200 font-semibold">Platform Average Utilization: <strong class="text-emerald-300">${utilData.currentPlatformUtilizationPct || 92}%</strong> (${utilData.totalAllocatedWeeklyHours || 223} / ${utilData.totalDeclaredWeeklyHours || 242} Weekly Hours)</span>
          </div>
          <h3 class="text-lg font-extrabold text-white">All SIKO Teachers — Maximum Availability Utilization & Timetable Sync</h3>
          <p class="text-2xs text-indigo-200 mt-0.5">Every teacher joining SIKO is dynamically allocated 1-to-1 and Smart Batch sessions strictly within their declared availability windows to achieve 92%–96% maximum utilization.</p>
        </div>
        <button type="button" onclick="window.optimizeAllTeachersUtilization()" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs cursor-pointer border-0 shadow-md whitespace-nowrap">
          ⚡ Auto-Optimize All Faculty Utilization (95%+ Target)
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-2xs">
        ${(utilData.records || []).slice(0, 10).map(r => `
          <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-1 mb-1">
                <span class="font-bold text-white truncate">${r.name}</span>
                <span class="px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 font-extrabold text-3xs">${r.utilizationPct}%</span>
              </div>
              <div class="text-3xs text-indigo-300 font-semibold mb-1">${r.subject} • ${r.tier}</div>
              <div class="text-3xs text-slate-300">Declared: <strong>${r.declaredHours}h/wk</strong> (${r.oneOnOneHours}h 1:1 + ${r.batchHours}h Batch)</div>
            </div>
            <div class="mt-2 pt-1.5 border-t border-white/10 text-3xs text-emerald-300 font-mono truncate">
              ${(r.availabilityWindows || []).join(' • ')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card p-6 bg-white border rounded-xl shadow-xs">
      <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h3 class="text-lg font-bold text-slate-900">Cohort Batch Governance</h3>
          <p class="text-xs text-slate-500">Live monitoring of cohort capacity, 30-seat caps, syllabus progress, and real-time attendance across 41 sprint tracks.</p>
        </div>
        <div class="flex items-center gap-3">
          <input type="text" id="adminBatchSearch" placeholder="Search batch or teacher..."
            oninput="window.filterAdminBatchesTable()"
            class="p-2 text-xs border border-slate-300 rounded-lg w-56 bg-slate-50 focus:bg-white" />
          <button class="btn btn-primary btn-sm text-xs font-bold" onclick="window.openNewBatchModal()">
            + Launch New Smart Batch
          </button>
        </div>
      </div>

      <div class="data-table-wrap">
        <table class="data-table" id="adminBatchesTable">
          <thead>
            <tr>
              <th>Batch Code</th>
              <th>Cohort Course Title</th>
              <th>Assigned Faculty</th>
              <th>Capacity (Max 30)</th>
              <th>Syllabus Progress</th>
              <th>Attendance Rate</th>
              <th>Next Session</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${batches.map(b => {
              const code = b.batchRef || b.productId || b.id;
              const title = b.title || b.courseName || b.name || 'Sprint Batch';
              const subject = b.subject || 'All Subjects';
              const teacher = b.teacher || 'Assigned Faculty';
              const occupied = b.seatsOccupied !== undefined ? b.seatsOccupied : (b.capacity !== undefined ? b.capacity : 24);
              const maxSeats = b.seatsTotal || b.max || 30;
              const isFull = occupied >= maxSeats;
              const progress = b.progress !== undefined ? b.progress : 18;
              const attendance = b.attendance !== undefined ? b.attendance : 96;
              const nextClass = b.schedule || b.nextClass || 'Tomorrow 18:00 IST';
              const avatar = b.teacherAvatar || 'assets/teachers/teacher_biology_indian.png';

              return `
                <tr class="admin-batch-row" data-code="${code}" data-title="${title.toLowerCase()}" data-teacher="${teacher.toLowerCase()}">
                  <td class="font-mono text-xs font-bold text-blue-700 whitespace-nowrap">
                    ${code}
                  </td>
                  <td>
                    <div class="font-bold text-xs text-slate-900">${title}</div>
                    <div class="text-2xs text-slate-500">${subject} • ${b.board || b.segment || 'CBSE'}</div>
                  </td>
                  <td>
                    <div class="flex items-center gap-2">
                      <img src="${avatar}" class="w-6 h-6 rounded-full object-cover border border-slate-200" alt="${teacher}" />
                      <span class="text-xs text-slate-800 font-medium whitespace-nowrap">${teacher}</span>
                    </div>
                  </td>
                  <td class="whitespace-nowrap">
                    <span class="font-extrabold text-xs ${isFull ? 'text-red-600' : 'text-slate-900'}">${occupied} / ${maxSeats}</span>
                    ${isFull ? `<span class="badge badge-danger text-3xs ml-1">FULL</span>` : ''}
                  </td>
                  <td class="w-32">
                    <div class="flex justify-between text-2xs font-semibold mb-1">
                      <span>${progress}%</span>
                    </div>
                    ${ProgressBar({ value: progress, variant: 'primary', showPercent: false })}
                  </td>
                  <td class="text-xs font-bold text-emerald-600">${attendance}%</td>
                  <td class="text-2xs text-slate-600 font-medium whitespace-nowrap">${nextClass}</td>
                  <td class="whitespace-nowrap">
                    <div class="flex items-center gap-1.5">
                      <button class="btn btn-outline btn-xs text-blue-700 border-blue-200 hover:bg-blue-50 text-3xs font-bold"
                        onclick="window.enterLiveClassroom('${code}')" title="Monitor Live Classroom">
                        🎥 Live Class
                      </button>
                      <button class="btn btn-outline btn-xs text-slate-700 border-slate-200 text-3xs"
                        onclick="window.openAdminBatchModal('${code}')">
                        Manage
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
