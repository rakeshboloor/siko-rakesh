/**
 * SIKO TEACHER WALLET VIEW
 * Transparent milestone-backed financial architecture.
 * Available, Escrow, Upcoming balances with chapter-level milestone release timelines and transaction ledger.
 */

import { AppState, formatPrice } from '../state.js';
import { Icons, MilestoneTimeline } from '../components.js';

export function renderTeacherWallet() {
  const wallet = AppState.teacherWallet;
  const matrix = window.CURRICULUM_TEACHING_HOURS_MATRIX || {};
  const boardKeys = Object.keys(matrix);
  const activeBoard = window._financeExplorerBoard || 'CBSE';
  const boardObj = matrix[activeBoard] || matrix['CBSE'] || { subjects: {} };
  const subjectKeys = Object.keys(boardObj.subjects || {});
  const activeSubject = (window._financeExplorerSubject && boardObj.subjects?.[window._financeExplorerSubject])
    ? window._financeExplorerSubject
    : (subjectKeys[0] || 'Physics');
  const subjObj = (boardObj.subjects && boardObj.subjects[activeSubject]) || { subjectTotalHours: 70, chapters: [] };
  const simScope = window._financeSimScope || 'subject';
  const simFormat = window._financeSimFormat || '1on1';
  const simTier = window._financeSimTier || 'Expert';

  const simQuote = typeof window.calculateCfoPricingWaterfall === 'function'
    ? window.calculateCfoPricingWaterfall({
        board: activeBoard,
        scopeMode: simScope,
        format: simFormat,
        teacherTier: simTier,
        subjects: simScope === 'bundle' ? subjectKeys.slice(0, 3) : [activeSubject]
      })
    : null;

  return `
    <div class="container py-8 max-w-6xl">
      <!-- Top Header & Actions -->
      <div class="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <span class="badge badge-primary mb-2">${Icons.wallet} Financial Command &amp; Allotted Teaching Hours</span>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">
            Teacher Wallet &amp; Curriculum Hours Allocation
          </h1>
          <p class="text-slate-600 text-sm mt-1">Allotted Teaching No. of Hours (Board &amp; Competitive), Your SIKO Finalized Hourly Rate Payouts, and Milestone Escrow (M1 50% • M2 25% • M3 25%).</p>
        </div>

        <div class="flex items-center gap-2.5 flex-wrap">
          <button class="btn btn-primary" onclick="window.openWithdrawModal()">
            Withdraw Available Funds &rarr;
          </button>
        </div>
      </div>

      <!-- 3 BALANCE CARDS (Wallet Card) -->
      ${(() => {
        const hasAllottedStudents = true; // Certified educator with enrolled students
        const finalizedRate = (AppState.teacherOnboarding && AppState.teacherOnboarding.sikoFinalizedRate) || 1750;
        const billingCycle = window._teacherBillingMonth || 'october_2026';

        if (!hasAllottedStudents) {
          return `
            <div class="card p-8 bg-slate-900 border-2 border-amber-500/50 rounded-2xl text-white text-center space-y-4 mb-10">
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

        const monthlyLedger = {
          october_2026: {
            label: 'October 2026 (Active Billing Cycle)',
            payoutDate: '01 Nov 2026',
            items: [
              { name: '1:1 Mentorship Student #1', track: 'Class 11 JEE Physics', slots: 'Mon, Wed, Fri • 5:00–6:30 PM (4.5h/w)', hoursDelivered: 18.0, hourlyPayout: 18.0 * finalizedRate, milestone: 'Milestone M1 Released (+₹17,500)', milestoneAmt: 17500 },
              { name: '1:1 Mentorship Student #2', track: 'Class 12 CBSE Board Physics', slots: 'Tue, Thu, Sat • 5:00–6:30 PM (4.5h/w)', hoursDelivered: 18.0, hourlyPayout: 18.0 * finalizedRate, milestone: 'Milestone M2 Released (+₹8,750)', milestoneAmt: 8750 },
              { name: '1:1 Mentorship Student #3', track: 'Class 11 MHT-CET Physics', slots: 'Mon, Wed, Fri • 6:30–8:00 PM (4.5h/w)', hoursDelivered: 18.0, hourlyPayout: 18.0 * finalizedRate, milestone: 'In Progress (M1 Pending)', milestoneAmt: 0 },
              { name: '1:1 Mentorship Student #4', track: 'Class 10 Foundation & IOQM Physics', slots: 'Tue, Thu, Sat • 6:30–8:00 PM (4.5h/w)', hoursDelivered: 18.0, hourlyPayout: 18.0 * finalizedRate, milestone: 'In Progress (M1 Pending)', milestoneAmt: 0 },
              { name: 'Cohort Alpha (1:Many Subject Batch)', track: 'Mechanics Foundation (25 Students)', slots: 'Sat & Sun • 10:00 AM–1:00 PM (6.0h/w)', hoursDelivered: 24.0, hourlyPayout: 24.0 * finalizedRate, milestone: 'Milestone M1 Released (+₹21,000)', milestoneAmt: 21000 },
              { name: 'Cohort Beta (1:Many Problem Sprint)', track: 'Rotational Dynamics (20 Students)', slots: 'Sat & Sun • 2:00 PM–5:00 PM (6.0h/w)', hoursDelivered: 16.0, hourlyPayout: 16.0 * finalizedRate, milestone: 'In Progress', milestoneAmt: 0 }
            ]
          },
          september_2026: {
            label: 'September 2026 (Settled & Disbursed)',
            payoutDate: '01 Oct 2026',
            items: [
              { name: '1:1 Mentorship Student #1', track: 'Class 11 JEE Physics', slots: 'Mon, Wed, Fri (4.5h/w)', hoursDelivered: 18.0, hourlyPayout: 18.0 * finalizedRate, milestone: 'Milestone M1 Released (+₹17,500)', milestoneAmt: 17500 },
              { name: '1:1 Mentorship Student #2', track: 'Class 12 CBSE Physics', slots: 'Tue, Thu, Sat (4.5h/w)', hoursDelivered: 18.0, hourlyPayout: 18.0 * finalizedRate, milestone: 'Milestone M1 Released (+₹17,500)', milestoneAmt: 17500 },
              { name: 'Cohort Alpha (1:Many Subject Batch)', track: 'Kinematics Foundation', slots: 'Sat & Sun (6.0h/w)', hoursDelivered: 24.0, hourlyPayout: 24.0 * finalizedRate, milestone: 'Milestone M1 Released (+₹21,000)', milestoneAmt: 21000 }
            ]
          }
        };

        const curCycle = monthlyLedger[billingCycle] || monthlyLedger.october_2026;
        const totalDeliveredHours = curCycle.items.reduce((acc, it) => acc + it.hoursDelivered, 0);
        const totalHourlyPayout = curCycle.items.reduce((acc, it) => acc + it.hourlyPayout, 0);
        const totalMilestonesReleased = curCycle.items.reduce((acc, it) => acc + it.milestoneAmt, 0);
        const totalGrossPayout = totalHourlyPayout + totalMilestonesReleased;
        const tdsDeduction = Math.round(totalGrossPayout * 0.10); // 10% statutory TDS
        const netBankTakeHome = totalGrossPayout - tdsDeduction;

        return `
          <!-- Wallet Balance Card -->
          <div class="wallet-card mb-8">
            <div class="flex justify-between items-center pb-4 border-b border-white/10">
              <div>
                <span class="text-xs uppercase tracking-widest text-blue-200 font-bold">Total Earnings Account</span>
                <div class="text-3xl font-black mt-1 text-white">Dedicated Master Faculty • ${simTier} Faculty</div>
              </div>
              <span class="badge badge-success text-xs">Direct Milestone Payouts Active</span>
            </div>

            <div class="wallet-balances-grid">
              <!-- Available Balance -->
              <div class="wallet-balance-box">
                <div class="wallet-balance-label">AVAILABLE FOR WITHDRAWAL</div>
                <div class="wallet-balance-value text-emerald-400">₹${netBankTakeHome.toLocaleString('en-IN')}</div>
                <p class="text-2xs text-slate-300 mt-2">Based on your SIKO Finalized Hourly Rate (less statutory 10% TDS u/s 194J). Ready for bank settlement.</p>
              </div>

              <!-- Escrow Balance -->
              <div class="wallet-balance-box">
                <div class="wallet-balance-label">SECURED IN ESCROW</div>
                <div class="wallet-balance-value text-amber-300">₹85,000</div>
                <p class="text-2xs text-slate-300 mt-2">Locked safely; auto-released as allotted teaching hours &amp; tests complete.</p>
              </div>

              <!-- Upcoming Projected -->
              <div class="wallet-balance-box">
                <div class="wallet-balance-label">UPCOMING SCHEDULED</div>
                <div class="wallet-balance-value text-blue-200">₹2,10,000</div>
                <p class="text-2xs text-slate-300 mt-2">Scheduled classes and recurring cohort installments for next 30 days.</p>
              </div>
            </div>
          </div>

          <!-- Monthly Remuneration Calculation by Hours Taken & Milestones Completed -->
          <div class="card p-6 sm:p-8 bg-white border-2 border-indigo-200 rounded-2xl shadow-sm mb-10 space-y-5">
            <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <span class="text-2xs font-extrabold uppercase tracking-wider text-indigo-700 block">📊 Transparent Monthly Payout Engine</span>
                <h3 class="text-xl font-black text-slate-900">Monthly Remuneration: Hours Delivered &amp; Completed Milestones</h3>
                <p class="text-xs text-slate-600 mt-0.5">Calculated dynamically for every assigned 1:1 student and 1:Many batch as per logged class hours and milestone releases.</p>
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

            <!-- Itemized Table -->
            <div class="overflow-x-auto rounded-xl border border-slate-200">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-slate-900 text-white text-3xs uppercase">
                    <th class="py-2.5 px-3">Student / Batch</th>
                    <th class="py-2.5 px-3">Track &amp; Slots</th>
                    <th class="py-2.5 px-3 text-center">Hours Delivered</th>
                    <th class="py-2.5 px-3 text-right">Agreed Rate</th>
                    <th class="py-2.5 px-3 text-right">Hours Remuneration</th>
                    <th class="py-2.5 px-3">Milestone Completed</th>
                    <th class="py-2.5 px-3 text-right">Total Earnings</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white">
                  ${curCycle.items.map(it => {
                    const gross = it.hourlyPayout + it.milestoneAmt;
                    return `
                      <tr class="hover:bg-slate-50">
                        <td class="py-2.5 px-3 font-bold text-slate-900">${it.name}</td>
                        <td class="py-2.5 px-3 text-2xs text-slate-600">${it.track}<div class="text-3xs text-slate-400">${it.slots}</div></td>
                        <td class="py-2.5 px-3 text-center font-mono font-bold text-slate-900">${it.hoursDelivered.toFixed(1)} hrs</td>
                        <td class="py-2.5 px-3 text-right font-mono text-slate-600">₹${finalizedRate}/hr</td>
                        <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">₹${it.hourlyPayout.toLocaleString('en-IN')}</td>
                        <td class="py-2.5 px-3">
                          <span class="px-2 py-0.5 rounded text-3xs font-extrabold ${it.milestoneAmt > 0 ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-600'}">
                            ${it.milestone}
                          </span>
                        </td>
                        <td class="py-2.5 px-3 text-right font-mono font-black text-emerald-700 text-sm">₹${gross.toLocaleString('en-IN')}</td>
                      </tr>
                    `;
                  }).join('')}
                  <tr class="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-900">
                    <td colspan="2" class="py-3 px-3">Total Monthly Gross Remuneration</td>
                    <td class="py-3 px-3 text-center font-mono">${totalDeliveredHours.toFixed(1)} hrs</td>
                    <td colspan="3" class="py-3 px-3 text-right text-2xs text-slate-500">Less 10% TDS (Sec 194J): -₹${tdsDeduction.toLocaleString('en-IN')}</td>
                    <td class="py-3 px-3 text-right font-mono text-base text-emerald-800">₹${netBankTakeHome.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Capacity & Syllabus Completion Assurance -->
            <div class="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <strong class="text-emerald-950 font-bold block">✓ 100% Time Capacity Utilized (30/30 Weekly Hrs) • Guaranteed 30-Day Pre-Exam Completion</strong>
                <p class="text-2xs text-emerald-800 mt-0.5">AI schedule pacing ensures the student finishes full syllabus strictly 1 month before target exam. 2 extra Sunday booster turns scheduled.</p>
              </div>
              <button type="button" onclick="window.showToast('📄 Monthly Pay Slip PDF exported!', 'success')"
                class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-2xs cursor-pointer border-0 shadow-xs shrink-0">
                📥 Export Monthly Pay Slip (PDF)
              </button>
            </div>
          </div>
        `;
      })()}

      <!-- CURRICULUM TEACHING NO. OF HOURS MATRIX & TEACHER AGREED RATE / MILESTONE SIMULATOR -->
      <div class="card p-6 sm:p-8 bg-white border-2 border-indigo-200 rounded-2xl shadow-sm mb-10">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200">
          <div>
            <span class="text-2xs font-extrabold uppercase tracking-wider text-indigo-700 block">📊 Standardized Academic &amp; Faculty Payout Matrix</span>
            <h3 class="text-xl font-black text-slate-900">Subject-Wise &amp; Chapter-Wise Teaching No. of Hours Allotted to Teachers</h3>
            <p class="text-xs text-slate-600 mt-0.5">Select any Board / Product below to inspect exact Teaching No. of Hours (Lecture + Numericals + Doubt/Test) and your guaranteed Teacher Payout at your SIKO Finalized Hourly Rate.</p>
          </div>
          <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold">
            60% Lecture • 25% Practice • 15% Doubt/Test
          </span>
        </div>

        <!-- Board Selector Tabs -->
        <div class="flex flex-wrap gap-2 mb-4">
          ${boardKeys.map(bKey => `
            <button type="button" onclick="window.setFinanceMatrixBoard('${bKey}')"
                    class="px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${bKey === activeBoard ? 'bg-blue-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'}">
              ${bKey}
            </button>
          `).join('')}
        </div>

        <!-- Subject Selector Cards with Total Subject Teaching Hours -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          ${subjectKeys.map(sKey => {
            const sData = boardObj.subjects[sKey];
            const totH = sData.chapters.reduce((a, c) => a + c.totalHours, 0);
            const lecH = sData.chapters.reduce((a, c) => a + c.lectureHours, 0).toFixed(1);
            const pracH = sData.chapters.reduce((a, c) => a + c.practiceHours, 0).toFixed(1);
            const dbtH = sData.chapters.reduce((a, c) => a + c.doubtTestHours, 0).toFixed(1);
            const isSel = sKey === activeSubject;
            return `
              <div onclick="window.setFinanceMatrixSubject('${sKey}')"
                   class="p-3.5 rounded-xl border-2 ${isSel ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/15' : 'border-slate-200 bg-slate-50 hover:border-indigo-300'} cursor-pointer">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-extrabold text-sm text-slate-900">${sKey}</span>
                  <span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-black text-2xs">${totH} Hrs</span>
                </div>
                <div class="text-2xs text-slate-600">${sData.chapters.length} Chapters Allotted</div>
                <div class="text-3xs text-slate-500 mt-1">Lec: ${lecH}h • Prac: ${pracH}h • Test: ${dbtH}h</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Chapter-Wise Teaching Hours Table -->
        <div class="overflow-x-auto rounded-xl border border-slate-200 mb-6">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-900 text-white text-2xs uppercase">
                <th class="py-3 px-3">Code</th>
                <th class="py-3 px-3">${activeBoard} • ${activeSubject} Chapter / Unit</th>
                <th class="py-3 px-3 text-center">Lecture Hrs (60%)</th>
                <th class="py-3 px-3 text-center">Practice/Numerical Hrs (25%)</th>
                <th class="py-3 px-3 text-center">Doubt &amp; Test Hrs (15%)</th>
                <th class="py-3 px-3 text-center">Total Teaching Hrs</th>
                <th class="py-3 px-3 text-right">Teacher Payout (@ ₹${simQuote ? simQuote.teacherEffectiveHourlyNet : 507}/hr Agreed Rate)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">
              ${subjObj.chapters.map(ch => {
                const netPerHr = simQuote ? simQuote.teacherEffectiveHourlyNet : 507;
                const chTeacherNet = Math.round(ch.totalHours * netPerHr);
                return `
                  <tr class="hover:bg-slate-50">
                    <td class="py-2.5 px-3 font-mono font-bold text-indigo-700">${ch.code}</td>
                    <td class="py-2.5 px-3 font-bold text-slate-900">${ch.name} <span class="text-2xs text-slate-400">(${ch.weightageMarks} Marks)</span></td>
                    <td class="py-2.5 px-3 text-center font-semibold text-blue-700">${ch.lectureHours} hrs</td>
                    <td class="py-2.5 px-3 text-center font-semibold text-emerald-700">${ch.practiceHours} hrs</td>
                    <td class="py-2.5 px-3 text-center font-semibold text-amber-700">${ch.doubtTestHours} hrs</td>
                    <td class="py-2.5 px-3 text-center font-black text-slate-900 bg-slate-50">${ch.totalHours} Hrs</td>
                    <td class="py-2.5 px-3 text-right font-extrabold text-emerald-700">₹${chTeacherNet.toLocaleString('en-IN')}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Teacher Agreed Rate & Milestone Escrow Payout Calculator (No Commission Displayed) -->
        ${simQuote ? `
          <div class="p-5 rounded-2xl bg-slate-900 text-white">
            <div class="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/15">
              <div>
                <span class="text-3xs font-extrabold uppercase tracking-wider text-amber-300 block">🧮 Faculty Agreed Rate &amp; Milestone Payout Calculator</span>
                <h4 class="text-base font-black text-white">${simQuote.boardKey} (${simQuote.selectedSubjects.join(' + ')}) — ${simQuote.totalHours} Total Allotted Teaching Hours</h4>
              </div>
              <div class="flex flex-wrap gap-1.5">
                ${['chapter', 'subject', 'bundle'].map(sc => `
                  <button type="button" onclick="window.setFinanceSimScope('${sc}')"
                          class="px-2.5 py-1 rounded-lg text-2xs font-extrabold cursor-pointer border-0 ${simScope === sc ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-200 hover:bg-white/20'}">
                    ${sc === 'chapter' ? 'Single Chapter' : sc === 'subject' ? 'Single Subject' : 'Multi-Subject Course'}
                  </button>
                `).join('')}
                ${['Master', 'Expert', 'Senior', 'Pro'].map(tr => `
                  <button type="button" onclick="window.setFinanceSimTier('${tr}')"
                          class="px-2.5 py-1 rounded-lg text-2xs font-extrabold cursor-pointer border-0 ${simTier === tr ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}">
                    ${tr} Tier
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div class="p-3.5 rounded-xl bg-white/10 border border-white/10">
                <div class="text-3xs uppercase font-bold text-slate-300">1. SIKO Finalized Rate</div>
                <div class="text-xl font-black text-white mt-1">₹${simQuote.teacherEffectiveHourlyNet.toLocaleString('en-IN')}<span class="text-xs font-semibold text-slate-300">/hr</span></div>
                <div class="text-2xs text-slate-300 mt-1">${simTier} Tier Agreed Faculty Rate</div>
              </div>

              <div class="p-3.5 rounded-xl bg-blue-950/80 border border-blue-400/30">
                <div class="text-3xs uppercase font-bold text-blue-300">2. Allotted Teaching Hours</div>
                <div class="text-xl font-black text-blue-200 mt-1">${simQuote.totalHours} Hrs</div>
                <div class="text-3xs text-blue-300 mt-1">Lec: ${simQuote.lectureHours}h • Prac: ${simQuote.practiceHours}h • Test: ${simQuote.doubtTestHours}h</div>
              </div>

              <div class="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-400/40">
                <div class="text-3xs uppercase font-bold text-emerald-300">3. Total Agreed Payout</div>
                <div class="text-xl font-black text-emerald-300 mt-1">₹${simQuote.netTeacherPool.toLocaleString('en-IN')}</div>
                <div class="text-2xs text-emerald-200 mt-1">After 10% TDS u/s 194J: ₹${simQuote.netBankTakeHomeAfterTds.toLocaleString('en-IN')}</div>
              </div>

              <div class="p-3.5 rounded-xl bg-white/10 border border-amber-400/40">
                <div class="text-3xs uppercase font-bold text-amber-300">4. Milestone Release (M1/M2/M3)</div>
                <div class="space-y-1 mt-1.5 text-2xs">
                  <div class="flex justify-between"><span>M1 (50% @ ${simQuote.milestones[0].triggerHours}h):</span><strong class="text-emerald-300">₹${simQuote.milestones[0].grossPayout.toLocaleString('en-IN')}</strong></div>
                  <div class="flex justify-between"><span>M2 (25% @ ${simQuote.milestones[1].triggerHours}h):</span><strong class="text-amber-300">₹${simQuote.milestones[1].grossPayout.toLocaleString('en-IN')}</strong></div>
                  <div class="flex justify-between"><span>M3 (25% @ ${simQuote.milestones[2].triggerHours}h):</span><strong class="text-sky-300">₹${simQuote.milestones[2].grossPayout.toLocaleString('en-IN')}</strong></div>
                </div>
              </div>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- CHAPTER MILESTONE TIMELINE VISUALIZATION -->
      <div class="card p-8 bg-white border rounded-2xl shadow-sm mb-10">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Active Chapter Milestones</h3>
            <p class="text-xs text-slate-500">Based on your agreed finalized hourly rate, SIKO releases 50% (M1) at 25% hours, 25% (M2) at 60% hours, and 25% (M3) on 100% hours + PTM completion.</p>
          </div>
          <span class="badge badge-primary">Milestone Contract Model</span>
        </div>

        <div class="space-y-8">
          ${wallet.milestones.map(m => `
            <div class="border-b pb-6 last:border-b-0 last:pb-0">
              <h4 class="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                CHAPTER: ${m.chapter}
              </h4>
              ${MilestoneTimeline({ milestones: m.stages })}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- TRANSACTION HISTORY LEDGER -->
      <div class="card p-8 bg-white border rounded-2xl shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Financial Ledger &amp; Disbursement History</h3>
            <p class="text-xs text-slate-500">Every released milestone with itemized agreed contract payout, statutory TDS (Sec 194J), and net bank deposit.</p>
          </div>
          <button class="btn btn-outline btn-sm" onclick="window.showToast('Exporting transaction statement PDF', 'info')">
            Export Statement
          </button>
        </div>

        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Assignment / Cohort</th>
                <th>Milestone</th>
                <th>Agreed Payout</th>
                <th>Statutory TDS</th>
                <th>Net Credited</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${wallet.transactions.map(tx => `
                <tr>
                  <td class="text-xs font-semibold text-slate-600">${tx.date}</td>
                  <td class="text-xs font-bold text-slate-900">${tx.assignment}</td>
                  <td class="text-xs text-slate-600">${tx.milestone}</td>
                  <td class="text-xs font-semibold text-slate-700">${formatPrice(tx.gross)}</td>
                  <td class="text-xs text-slate-400">-${formatPrice(tx.deductions)}</td>
                  <td class="text-xs font-black text-emerald-600">${formatPrice(tx.net)}</td>
                  <td>
                    <span class="badge badge-success">${tx.status}</span>
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
