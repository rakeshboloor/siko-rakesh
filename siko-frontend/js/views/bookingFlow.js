/**
 * SIKO STEP-BY-STEP GUIDED ENROLMENT & BOOKING FLOW (DESKTOP & MOBILE RESPONSIVE)
 * One Selection at a Time:
 * Step 1: Academic Stream (PCM / PCB / Board) & Learning Mode (1-on-1 vs 1-to-Many)
 * Step 2: Multi-Subject Selection (Filtered by Stream + Extra Discount for 2+ Subjects)
 * Step 3: Student Learning DNA Calibration (Learning Style + AI Diagnostic Probe)
 * Step 4: Subject-Wise Faculty & Conflict-Free Timetable (Strictly Filtered by Stream)
 * Step 5: Pre-Payment Digital Refund Policy Signing (Sec 10A IT Act e-Sign)
 * Step 6: Confirmed Enrolment & Synced Schedule Certificate (Success Assured Plan)
 */

import { AppState, formatPrice, notifyStateChange } from '../state.js';
import { Icons, Stepper } from '../components.js';

function renderDigitalRefundPolicySigningBlock(quote, studentName, selBatch) {
  const bookingData = AppState.bookingData || {};
  const payMethod = bookingData.paymentMethod || 'card_upi';
  const isSigned = Boolean(bookingData.isPolicyDigitallySigned);
  const sigName = bookingData.signatoryName || bookingData.parentName || (AppState.studentOnboarding && AppState.studentOnboarding.parentName) || bookingData.digitalSignatureName || studentName || 'Parent / Legal Guardian';
  const sigStampObj = bookingData.digitalSignatureStamp;
  const sigStampText = typeof sigStampObj === 'object' && sigStampObj !== null
    ? `${sigStampObj.signedAtIST || ''} • ${sigStampObj.sigHash || 'SEC-10A-VERIFIED'}`
    : (sigStampObj || `SIGNED-${new Date().toLocaleDateString('en-IN')} • SEC-10A-VERIFIED`);

  return `
    <div class="rounded-2xl border-2 ${isSigned ? 'border-emerald-500 bg-emerald-50/25' : 'border-indigo-200 bg-white'} p-4 sm:p-6 shadow-xs transition-all" id="prePaymentDigitalRefundPolicyCard">
      <!-- Top Header -->
      <div class="flex flex-wrap items-start justify-between gap-3 pb-3.5 mb-4 border-b border-slate-200/80">
        <div>
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-3xs font-extrabold uppercase tracking-wider">
              ✍️ Step 05 • Pre-Payment Statutory Requirement
            </span>
            <span class="px-2.5 py-0.5 rounded-full ${isSigned ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-50 text-amber-800 border border-amber-200'} text-3xs font-extrabold">
              ${isSigned ? '✓ Digitally Signed & Verified' : '⚡ Digital Signature Required Before Payment'}
            </span>
          </div>
          <h3 class="text-base sm:text-lg font-black text-slate-900">
            SIKO Student Refund, Cancellation &amp; Fee Protection Policy (v1.0)
          </h3>
          <p class="text-2xs text-slate-500 mt-0.5">
            Governed by Consumer Protection Act 2019, IT Act 2000 (Sec 10A Electronic Contracts), DPDP Act 2023 &amp; POCSO Act 2012.
          </p>
        </div>
        <button type="button" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-2xs border border-slate-300 cursor-pointer transition shrink-0" onclick="window.openFullRefundPolicyModal()">
          🔍 View Full 22-Section Policy
        </button>
      </div>

      <!-- Clean 3-Pillar Policy Highlights -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 text-2xs">
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/90">
          <div class="font-extrabold text-slate-900 mb-0.5">1. Strict No-Refund Rule</div>
          <p class="text-3xs text-slate-600 leading-relaxed">Course &amp; booking fees allocate dedicated faculty slots and are non-refundable after class commencement.</p>
        </div>
        <div class="p-3 rounded-xl bg-blue-50/50 border border-blue-200/80">
          <div class="font-extrabold text-blue-950 mb-0.5">2. 24-Hr Pre-Class Cooling-Off</div>
          <p class="text-3xs text-slate-600 leading-relaxed">Eligible for cancellation within 24 hours of payment strictly prior to first live class commencement.</p>
        </div>
        <div class="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
          <div class="font-extrabold text-emerald-950 mb-0.5">3. Milestone Escrow &amp; Remedy</div>
          <p class="text-3xs text-slate-600 leading-relaxed">Faculty payouts release via verified teaching milestones (50% / 25% / 25%) with guaranteed replacement remedy.</p>
        </div>
      </div>

      <!-- Section 17: Mandatory Pre-Payment Acceptance Checkboxes -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h4 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Mandatory Pre-Payment Statutory Clauses (Sec 17)</h4>
          <button type="button" class="text-2xs font-extrabold text-indigo-700 hover:text-indigo-900 underline cursor-pointer bg-transparent border-0"
            onclick="window.acceptAllRefundCheckboxes()">
            ✓ Check All 6 Clauses
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs text-slate-700 bg-slate-50/90 p-3.5 rounded-xl border border-slate-200">
          <label class="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" id="chkRefund1" onchange="window.checkRefundCheckboxes()" class="mt-0.5 w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer shrink-0" />
            <span class="leading-snug">I/We confirm that I/We have received access to the complete SIKO Student Refund, Cancellation &amp; Fee Protection Policy before payment and have had an opportunity to read it.</span>
          </label>
          <label class="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" id="chkRefund2" onchange="window.checkRefundCheckboxes()" class="mt-0.5 w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer shrink-0" />
            <span class="leading-snug">I/We understand and accept that payment is ordinarily final and non-refundable except where this Policy expressly provides otherwise or applicable law requires a different remedy.</span>
          </label>
          <label class="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" id="chkRefund3" onchange="window.checkRefundCheckboxes()" class="mt-0.5 w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer shrink-0" />
            <span class="leading-snug">I/We understand that after the first class, entry into a live classroom, use/consumption/access of paid services or other material service use, a discretionary cash refund will ordinarily not be available.</span>
          </label>
          <label class="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" id="chkRefund4" onchange="window.checkRefundCheckboxes()" class="mt-0.5 w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer shrink-0" />
            <span class="leading-snug">I/We understand that non-attendance, change of mind, personal schedule changes, travel, relocation, timetable/exam-date changes, preference changes, teacher preference, temporary non-use or dissatisfaction do not by themselves create a refund entitlement.</span>
          </label>
          <label class="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" id="chkRefund5" onchange="window.checkRefundCheckboxes()" class="mt-0.5 w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer shrink-0" />
            <span class="leading-snug">I/We understand that mandatory legal rights that cannot lawfully be excluded remain unaffected.</span>
          </label>
          <label class="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" id="chkRefund6" onchange="window.checkRefundCheckboxes()" class="mt-0.5 w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer shrink-0" />
            <span class="leading-snug">I/We agree that this Policy forms part of the applicable order/enrolment terms and that my/our electronic acceptance will be recorded with the order.</span>
          </label>
        </div>
      </div>

      <!-- Section 18: Interactive Digital Signature Pad & Live Cursive e-Sign Preview -->
      <div class="p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 via-white to-emerald-50/40 border border-indigo-200/90 mb-4">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">✍️ Interactive Digital Signature Pad (IT Act Sec 10A)</span>
          <span class="text-3xs font-mono font-bold text-emerald-700" id="refundValidationStatus">
            ✓ Digital Signature Ready &amp; Verified (Sec 10A IT Act 2000)
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label class="block text-2xs font-bold text-slate-700 mb-1">Signatory Full Legal Name (Parent / Student) *</label>
            <input type="text" id="refundSignatoryName" placeholder="Type Full Legal Name to e-Sign"
              value="${sigName}"
              oninput="window.checkRefundCheckboxes()"
              class="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white font-bold text-slate-900 focus:border-indigo-600 outline-none" />
          </div>
          <div>
            <label class="block text-2xs font-bold text-slate-700 mb-1">Signatory Capacity / Relationship *</label>
            <select id="refundSignatoryRole" onchange="window.checkRefundCheckboxes()" class="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white font-semibold text-slate-800">
              <option value="parent">Parent / Legal Guardian (Required for Minors)</option>
              <option value="student_adult">Self (Adult Student 18+ Years)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label class="block text-2xs font-bold text-slate-700 mb-1">Parent's WhatsApp / Mobile Number *</label>
            <input type="tel" id="refundParentPhone" placeholder="+91 98201 44892"
              value="${((bookingData && bookingData.parentPhone) || (AppState.studentOnboarding && AppState.studentOnboarding.parentPhone) || '+91 98201 44892').replace(/"/g, '&quot;')}"
              oninput="window.setParentPhone(this.value)"
              class="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white font-bold text-slate-900 focus:border-indigo-600 outline-none" />
          </div>
          <div>
            <label class="block text-2xs font-bold text-slate-700 mb-1">Parent's Email Address (for Invoices &amp; Reports) *</label>
            <input type="email" id="refundParentEmail" placeholder="parent@example.com"
              value="${((bookingData && bookingData.parentEmail) || (AppState.studentOnboarding && AppState.studentOnboarding.parentEmail) || 'parent@siko.demo').replace(/"/g, '&quot;')}"
              oninput="window.setParentEmail(this.value)"
              class="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white font-bold text-slate-900 focus:border-indigo-600 outline-none" />
          </div>
        </div>

        <!-- Cursive Digital Signature Canvas Preview + 1-Click e-Sign Stamp Button -->
        <div class="p-3.5 rounded-xl bg-white border-2 border-dashed ${isSigned ? 'border-emerald-500 bg-emerald-50/30' : 'border-indigo-300'} flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span class="text-3xs font-bold uppercase tracking-wider text-slate-400 block">Electronic Signature Seal &amp; Cursive Preview:</span>
            <div id="liveCursiveSignaturePreview" class="text-xl sm:text-2xl text-indigo-950 font-bold tracking-wide mt-0.5" style="font-family: 'Georgia', 'Times New Roman', serif; font-style: italic;">
              ${sigName}
            </div>
            <div class="text-3xs font-mono text-slate-500 mt-0.5">
              ${isSigned ? `✓ Stamp: ${sigStampText}` : 'Hash: sha256-siko-refund-v1.0-e8b94a2b • Ready for Digital Seal'}
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button type="button" onclick="window.digitallySignRefundPolicy()"
              class="px-4 py-2.5 rounded-xl font-extrabold text-xs cursor-pointer border-0 shadow-xs transition ${isSigned ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}">
              ${isSigned ? '✓ Policy Digitally Signed' : '✍️ Digitally Sign Refund Policy'}
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Method + Final Protected Payment CTA -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
        <div onclick="window.selectBookingPaymentMethod('card_upi')" class="p-3 rounded-xl border-2 ${payMethod === 'card_upi' ? 'border-indigo-600 bg-indigo-50/40' : 'border-slate-200 bg-white hover:border-indigo-300'} flex items-center justify-between cursor-pointer transition-all">
          <div class="flex items-center gap-2">
            <input type="radio" ${payMethod === 'card_upi' ? 'checked' : ''} name="paymethod" id="payMethodCard" class="accent-indigo-600" />
            <label for="payMethodCard" class="text-xs font-bold text-slate-800 cursor-pointer">UPI / Card / NetBanking (Razorpay)</label>
          </div>
          <span class="text-3xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Escrow Protected</span>
        </div>

        <div onclick="window.selectBookingPaymentMethod('stripe_intl')" class="p-3 rounded-xl border-2 ${payMethod === 'stripe_intl' ? 'border-indigo-600 bg-indigo-50/40' : 'border-slate-200 bg-white hover:border-indigo-300'} flex items-center justify-between cursor-pointer transition-all">
          <div class="flex items-center gap-2">
            <input type="radio" ${payMethod === 'stripe_intl' ? 'checked' : ''} name="paymethod" id="payMethodIntl" class="accent-indigo-600" />
            <label for="payMethodIntl" class="text-xs font-bold text-slate-800 cursor-pointer">International Card / Wire (Stripe)</label>
          </div>
          <span class="text-3xs text-slate-500 font-semibold">Zero Surcharge</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full overflow-hidden">
        <button type="button" class="px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs cursor-pointer shrink-0" onclick="window.setBookingStep(4)">&larr; Back to Schedule</button>
        <button type="button" class="flex-1 min-w-0 py-3.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm shadow-md border-0 text-white text-center leading-snug break-words transition-all ${isSigned ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-50'}" id="btnContinuePayment" style="background:linear-gradient(135deg,#059669,#10B981);" ${isSigned ? '' : 'disabled'} onclick="window.submitPaymentWithRefundAcceptance()">
          🔒 Digitally Sign &amp; Pay ₹${quote.totalPayableByParent.toLocaleString('en-IN')} &rarr;
        </button>
      </div>
    </div>
  `;
}

export function renderBookingFlow() {
  const teacherObj = (AppState.teachers && AppState.teachers.find(t => t.id === AppState.bookingData?.teacherId)) ||
                     (AppState.teachers && AppState.teachers[0]) || {};

  const quote = typeof window.syncBookingFlowWithCfoEngine === 'function'
    ? window.syncBookingFlowWithCfoEngine()
    : {
        boardKey: 'JEE',
        boardLabel: 'JEE Main & Advanced',
        scopeMode: 'bundle',
        formatMode: '1on1',
        teacherTier: { tier: 'Expert', label: 'Expert Faculty' },
        selectedSubjects: ['Physics', 'Chemistry', 'Mathematics'],
        lineItems: [{ subject: 'Physics', scope: 'Full Subject Syllabus', title: 'Physics Complete Syllabus', totalHours: 70, lectureHours: 42, practiceHours: 17.5, doubtTestHours: 10.5 }],
        totalHours: 210,
        lectureHours: 126,
        practiceHours: 52.5,
        doubtTestHours: 31.5,
        recommendedTotalSessions: 210,
        effectiveHourlyRate: 650,
        effectiveStudentRatePerHour: 520,
        grossMarketTuition: 136500,
        discountPct: 25,
        discountLabel: 'Multi-Subject Bundle Discount (25% Off)',
        discountAmount: 34125,
        netStudentCourseFeeExclGst: 102375,
        includeGst: true,
        gstAmount: 18428,
        totalPayableByParent: 120803
      };

  const hourlyRate = quote.effectiveHourlyRate;
  const teacher = {
    id: teacherObj.id || 't-ananya',
    name: teacherObj.name || teacherObj.full_name || 'Dedicated Master Faculty',
    avatar: teacherObj.avatar || teacherObj.avatar_url || 'assets/teachers/teacher_physics_indian.png',
    title: teacherObj.title || teacherObj.bio || 'Senior Physics Faculty • IIT Delhi',
    tier: quote.teacherTier?.tier || teacherObj.tier || 'Expert',
    experienceYears: teacherObj.experienceYears || teacherObj.experience_years || 12,
    hourlyRate: hourlyRate,
    outcomes: teacherObj.outcomes || { scoreJump: '+28% Average Score Lift', targetMet: '94% Success Rate' },
    nextSlots: Array.isArray(teacherObj.nextSlots) && teacherObj.nextSlots.length > 0
      ? teacherObj.nextSlots
      : ['Mon, Wed, Fri • 6:00 PM – 7:00 PM IST', 'Tue, Thu, Sat • 7:00 PM – 8:00 PM IST']
  };

  const bookingData = AppState.bookingData || {};
  const journeyType = bookingData.journeyType || (quote.formatMode === 'batch' ? 'smart-learning' : '1-on-1');
  const selectedSmartBatch = quote.selectedBatch || AppState.bookingFlow?.selectedBatch || null;
  const step = Math.max(1, Math.min(6, Number(bookingData.step) || 1));
  const isMultiSubjectSummary = Array.isArray(quote.selectedSubjects) && quote.selectedSubjects.length > 1;
  const stepsList = [
    '1. Stream & Mode',
    '2. Select Subjects',
    '3. Learning DNA',
    '4. Faculty & Schedule',
    '5. Sign Policy & Pay',
    '6. Confirmed'
  ];

  const monthsLeftForSummary = Number(bookingData.monthsLeftForExam || 6);
  const summaryCountdownPlan = typeof window.calculateAiExamCountdownSchedule === 'function'
    ? window.calculateAiExamCountdownSchedule({ monthsLeft: monthsLeftForSummary, totalHours: quote.totalHours })
    : { monthsLeft: 6, specialistAllocations: [] };
  // Both 1-on-1 and 1-to-Many Smart Batches use distinct subject-wise specialist teachers (never 1 teacher for all subjects!)
  const activeSpecialists = summaryCountdownPlan.specialistAllocations || [];

  const subtotal = quote.grossMarketTuition;
  const discount = quote.discountAmount;
  const tax = quote.gstAmount;
  const total = quote.totalPayableByParent;
  const scheduleSlot = activeSpecialists.length > 1
    ? activeSpecialists.map(sa => `${sa.subject} (${sa.teacherName}): ${sa.assigned1on1Slot}`).join(' | ')
    : ((activeSpecialists[0] && activeSpecialists[0].assigned1on1Slot) || bookingData.scheduleSlot || teacher.nextSlots[0] || 'Mon, Wed, Fri • 6:00 PM – 7:00 PM IST');
  const isPolicySigned = Boolean(bookingData.isPolicyDigitallySigned);

  return `
    <div class="min-h-screen bg-slate-50/90 text-slate-900 pb-20">
      <div class="container max-w-7xl mx-auto px-3 sm:px-6 pt-4">
        <!-- Step-by-Step Progress Bar (Click any step to navigate) -->
        <div class="max-w-4xl mx-auto mb-5 sm:mb-7 overflow-x-auto">
          ${Stepper({
            steps: stepsList,
            currentStep: step,
            onStepClick: 'window.setBookingStep'
          })}
        </div>

        <!-- Main Layout: Left Focused Single-Step Card (2 Cols) + Right Live Synced Summary (1 Col) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start max-w-6xl mx-auto">
          <!-- Left 2 Columns: Strictly ONE Step Shown at a Time -->
          <div class="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-7 shadow-xs">
            ${renderBookingFlowStepContent(step, teacher, scheduleSlot, { subtotal, discount, tax, total, quote })}
          </div>

          <!-- Right 1 Column: Live Synced Summary Card -->
          <div class="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 lg:sticky lg:top-20 space-y-4 shadow-xs">
            ${(() => {
              const prof = typeof window.getEnrollmentProfileSummary === 'function'
                ? window.getEnrollmentProfileSummary()
                : { gradeDisplay: 'Class 11', schoolBoard: 'CBSE', courseTitle: quote.boardLabel || 'JEE Main & Adv (PCM)', slotDurationHrs: 1.5, slotDurationLabel: '1.5 Hours / Lecture Slot' };
              return `
                <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span class="text-3xs font-extrabold uppercase tracking-wider text-indigo-600 block">
                      Live Synced Summary • ${quote.formatMode === 'batch' ? '👥 1-to-Many Smart Batch' : '🎯 1-on-1 Personalised'} • Step ${step} of 6
                    </span>
                    <h4 class="text-sm font-black text-slate-900">
                      ${quote.selectedSubjects.length > 1
                        ? `${quote.formatMode === 'batch' ? '👥 1:Many' : '🎓 1-on-1'} ${quote.selectedSubjects.length}-Subject Plan (${quote.selectedSubjects.join(' + ')})`
                        : `${quote.formatMode === 'batch' ? '👥 1:Many' : '📘 1-on-1'} Single Subject (${quote.selectedSubjects[0] || 'Physics'})`}
                    </h4>
                    <div class="text-3xs font-bold text-slate-600 mt-0.5">
                      🎓 ${prof.gradeDisplay} • ${prof.schoolBoard} • ${prof.courseTitle}
                    </div>
                  </div>
                  <span class="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-3xs font-extrabold shrink-0">⏱️ ${prof.slotDurationHrs === 1.0 ? '1 Hr/Slot' : '1.5 Hrs/Slot'}</span>
                </div>
              `;
            })()}

            <!-- SUBJECT-WISE TEACHER, TIMETABLE & RATE CHART BREAKDOWN (100% Synced with Left Selection) -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-3xs font-extrabold uppercase tracking-wider text-slate-700">
                  👩‍🏫 Selected Subjects &amp; Fee Breakdown (${activeSpecialists.length})
                </span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-3xs font-extrabold">✓ Zero Clash • Synced</span>
              </div>
              <div class="space-y-2">
                ${activeSpecialists.map(sa => {
                  const rc = (quote.subjectRateChart && quote.subjectRateChart[sa.subject]) || null;
                  const li = (quote.lineItems || []).find(item => item.subject === sa.subject) || null;
                  const subjHours = (li && li.totalHours) || (rc && rc.allottedHours) || sa.studentCourseHours || 70;
                  const subjGross = (li && li.grossSubjectFee) || (rc && rc.grossSubjectFee) || Math.round(subjHours * (quote.effectiveHourlyRate || 520));
                  const subjNet = (li && li.netSubjectFee) || (rc && rc.netSubjectFee) || Math.round(subjHours * (quote.effectiveStudentRatePerHour || 520));
                  const slotDurHrs = summaryCountdownPlan.slotDurationHrs || 1.5;
                  const totalSubjSlots = Math.max(1, Math.ceil(subjHours / slotDurHrs));
                  return `
                    <div class="p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/90 flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2.5 min-w-0">
                        <img src="${sa.avatar || teacher.avatar}" alt="${sa.teacherName}" class="w-9 h-9 rounded-full object-cover border border-indigo-200 shrink-0" />
                        <div class="min-w-0">
                          <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-900 font-extrabold text-3xs">${sa.subject}</span>
                            <span class="font-extrabold text-xs text-slate-900 truncate">${sa.teacherName}</span>
                          </div>
                          <div class="text-3xs font-semibold text-indigo-700 truncate mt-0.5">🗓️ ${sa.assigned1on1Slot}</div>
                        </div>
                      </div>
                      <div class="text-right shrink-0">
                        ${quote.discountPct > 0 ? `<span class="text-3xs text-slate-400 line-through block">₹${subjGross.toLocaleString('en-IN')}</span>` : ''}
                        <span class="text-xs font-black text-slate-900 block">₹${subjNet.toLocaleString('en-IN')}</span>
                        <span class="text-3xs text-slate-500 font-semibold">${subjHours} Hrs (${totalSubjSlots} Slots • ${slotDurHrs === 1.0 ? '1 Hr/Slot' : '1.5 Hrs/Slot'})</span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Learning DNA Summary Pill -->
            <div class="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between gap-2">
              <div>
                <span class="text-3xs font-extrabold uppercase tracking-wider text-indigo-700 block">Student Learning DNA</span>
                <span class="text-xs font-extrabold text-slate-900">🧬 ${(AppState.learningDna && AppState.learningDna.difficultyTier) || 'Adaptive Calibrated'} (${(AppState.learningDna && AppState.learningDna.accuracy) || 76}%)</span>
              </div>
              <button type="button" onclick="window.setBookingStep(3)" class="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-800 font-extrabold text-3xs cursor-pointer">
                Step 3
              </button>
            </div>

            <!-- ITEMIZED FEE BREAKDOWN SYNCED WITH RATE CHART & ZERO OUT-OF-POCKET ENGINE -->
            <div class="space-y-2 text-xs pt-1 border-t border-slate-100">
              <div class="flex justify-between text-slate-600">
                <span>Catalogue Tuition (Gross):</span>
                <span class="font-semibold text-slate-500 line-through">₹${quote.grossMarketTuition.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between text-emerald-700 font-bold">
                <span>${quote.discountPct > 0 ? `${quote.selectedSubjects.length > 1 ? `${quote.selectedSubjects.length}-Subject Bundle` : 'Course'} Discount (${quote.discountPct}% Off):` : 'Tuition Rate:'}</span>
                <span>-₹${quote.discountAmount.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between text-slate-900 font-black pt-1 border-t border-slate-100 text-sm">
                <span>Net Tuition (${quote.selectedSubjects.join(' + ')}):</span>
                <span>₹${quote.netStudentCourseFeeExclGst.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex items-center justify-between text-2xs text-slate-600 pt-0.5">
                <label class="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" ${quote.includeGst ? 'checked' : ''} onchange="window.toggleBookingGst()" class="accent-indigo-600 cursor-pointer" />
                  <span>Include 18% GST Invoice (Default)</span>
                </label>
                <span>₹${quote.gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between items-baseline text-base font-black text-slate-900 pt-2.5 border-t border-slate-200">
                <span>Final Amount (Incl. GST):</span>
                <span class="text-xl text-indigo-950">₹${quote.totalPayableByParent.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <!-- Context-Aware Step Action Button -->
            ${step < 5 ? `
              <button type="button" onclick="window.setBookingStep(${step + 1})"
                class="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white shadow-sm cursor-pointer border-0 transition"
                style="background:linear-gradient(135deg,#4F46E5,#2563EB);">
                Continue to Step ${step + 1}: ${stepsList[step]} &rarr;
              </button>
            ` : step === 5 ? `
              <button type="button" onclick="window.submitPaymentWithRefundAcceptance()"
                class="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white shadow-sm cursor-pointer border-0 transition"
                style="background:linear-gradient(135deg,#059669,#10B981);">
                🔒 Digitally Sign &amp; Pay ₹${quote.totalPayableByParent.toLocaleString('en-IN')} &rarr;
              </button>
            ` : `
              <button type="button" onclick="window.switchRole('student')"
                class="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white shadow-sm cursor-pointer border-0 transition"
                style="background:linear-gradient(135deg,#4F46E5,#2563EB);">
                🎓 Open Student Portal &rarr;
              </button>
            `}
          </div>
        </div>
      </div>

      <!-- Policy Full Screen Modal Container -->
      <div id="refundPolicyModalRoot"></div>
    </div>
  `;
}

function renderBookingFlowStepContent(step, teacher, scheduleSlot, pricing) {
  const bookingData = AppState.bookingData || {};
  const bf = AppState.bookingFlow || {};
  const quote = pricing?.quote || (typeof window.syncBookingFlowWithCfoEngine === 'function' ? window.syncBookingFlowWithCfoEngine() : {});
  const journeyType = bookingData.journeyType || '1-on-1';
  const monthsLeft = Number(bookingData.monthsLeftForExam || 6);
  const countdownPlan = typeof window.calculateAiExamCountdownSchedule === 'function'
    ? window.calculateAiExamCountdownSchedule({ monthsLeft, totalHours: quote.totalHours })
    : { monthsLeft: 6, totalWeeks: 24, weeklyHoursRequired: 4.5, sessionsPerWeek: 3, slotDurationHrs: 1.5, slotDurationLabel: '1.5 Hours / Lecture Slot', specialistAllocations: [], monthRoadmap: [] };
  const specialistAllocations = countdownPlan.specialistAllocations || [];
  const selectedSubjectsList = quote.selectedSubjects || countdownPlan.selectedSubjects || ['Physics'];
  const isMultiSubject = selectedSubjectsList.length > 1;
  const studentName = typeof window.getStudentDisplayName === 'function'
    ? window.getStudentDisplayName()
    : ((AppState.studentOnboarding && (AppState.studentOnboarding.studentName || AppState.studentOnboarding.name)) || '');

  const slotDurationHrs = countdownPlan.slotDurationHrs || (typeof window.getSlotDurationHoursForCurrentEnrollment === 'function' ? window.getSlotDurationHoursForCurrentEnrollment() : 1.5);
  const nonClashingFallbackTimePool = slotDurationHrs === 1.0
    ? [
        '5:00 PM – 6:00 PM IST (1 Hr)',
        '6:15 PM – 7:15 PM IST (1 Hr)',
        '7:30 PM – 8:30 PM IST (1 Hr)',
        '4:00 PM – 5:00 PM IST (1 Hr)'
      ]
    : [
        '5:00 PM – 6:30 PM IST (1.5 Hrs)',
        '6:45 PM – 8:15 PM IST (1.5 Hrs)',
        '8:30 PM – 10:00 PM IST (1.5 Hrs)',
        '3:15 PM – 4:45 PM IST (1.5 Hrs)'
      ];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const buildDayScheduleItems = (dayShort, dayIdx = 0) => {
    const items = [];
    const usedTimesOnThisDay = new Set();
    if (dayShort === 'Sun') {
      items.push({
        subject: `🧪 Weekly Test (${selectedSubjectsList.join(' + ')})`,
        teacherName: specialistAllocations.map(s => s.teacherName.split(' ').slice(0, 2).join(' ')).join(' • '),
        timeSlot: '10:00 AM – 1:00 PM IST',
        isWeeklyTest: true
      });
      return items;
    }
    specialistAllocations.forEach((sa, sIdx) => {
      const slotStr = String(sa.assigned1on1Slot || '');
      if (slotStr.includes(dayShort) || slotStr.toLowerCase().includes('daily') || slotStr.includes('Mon–Sat')) {
        let timePart = slotStr.includes('•') ? slotStr.split('•')[1].trim() : slotStr;
        if (usedTimesOnThisDay.has(timePart)) {
          timePart = nonClashingFallbackTimePool.find(tp => !usedTimesOnThisDay.has(tp)) || nonClashingFallbackTimePool[sIdx % nonClashingFallbackTimePool.length];
        }
        usedTimesOnThisDay.add(timePart);
        items.push({
          subject: sa.subject,
          teacherName: sa.teacherName,
          timeSlot: timePart,
          avatar: sa.avatar
        });
      }
    });
    if (items.length === 0 && specialistAllocations.length > 0) {
      const saPrimary = specialistAllocations[dayIdx % specialistAllocations.length];
      const fallbackSlotStr = String(saPrimary.assigned1on1Slot || '');
      const fallbackTime = fallbackSlotStr.includes('•') ? fallbackSlotStr.split('•')[1].trim() : nonClashingFallbackTimePool[dayIdx % nonClashingFallbackTimePool.length];
      items.push({
        subject: saPrimary.subject,
        teacherName: saPrimary.teacherName,
        timeSlot: fallbackTime,
        avatar: saPrimary.avatar
      });
    }
    return items;
  };

  const curStream = bf.streamFilter || (quote.boardKey === 'JEE' ? 'PCM' : quote.boardKey === 'NEET' ? 'PCB' : 'BOARD_8_10');
  const enrollmentProfile = typeof window.getEnrollmentProfileSummary === 'function'
    ? window.getEnrollmentProfileSummary()
    : {
        gradeNum: 11,
        gradeDisplay: 'Class 11',
        schoolBoard: 'CBSE',
        streamKey: curStream,
        courseTitle: 'Class 11–12 JEE Main & Adv / CET (PCM)',
        slotDurationHrs,
        slotDurationLabel: slotDurationHrs === 1.0 ? '1.0 Hour / Lecture Slot' : '1.5 Hours / Lecture Slot',
        fullSummaryText: `Class 11 • CBSE Board • JEE Main & Adv (PCM) • 1.5 Hours / Lecture Slot`
      };

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 1: STUDENT PROFILE, SEPARATE CLASS 8–10 (BOARDS vs OLYMPIADS) & CLASS 11–12 (JEE vs NEET vs BOARDS)
  // ═══════════════════════════════════════════════════════════════════════════
  if (step === 1) {
    const curGrade = (AppState.studentOnboarding && AppState.studentOnboarding.grade) || `Grade ${enrollmentProfile.gradeNum || 11}`;
    const curBoard = bf.schoolBoard || bf.boardTrack || (AppState.studentOnboarding && AppState.studentOnboarding.board) || 'CBSE';
    return `
      <div class="space-y-6">
        <div class="border-b border-slate-100 pb-4">
          <div class="flex items-center justify-between gap-2 flex-wrap mb-1.5">
            <span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-3xs font-extrabold uppercase tracking-wider">
              Step 01 of 06 • Standard, School Board, Separate Course Stream &amp; Slot Duration
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-3xs">
              ⏱️ ${enrollmentProfile.slotDurationLabel}
            </span>
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            1. Select Standard (Class 8–12), Board &amp; Exact Course Stream
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            We keep <strong>Class 8th–10th School Boards (1 Hr/Slot)</strong> and <strong>Class 8th–10th Competitive Olympiads (1.5 Hrs/Slot)</strong> separate from <strong>Class 11th–12th JEE / NEET / Senior Boards (1.5 Hrs/Slot)</strong> so we know the exact Standard, Board, and Course your child is enrolling for.
          </p>
        </div>

        <!-- Live Enrollment Identification Banner -->
        <div class="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white flex flex-wrap items-center justify-between gap-3">
          <div>
            <span class="text-3xs font-extrabold uppercase tracking-wider text-amber-300 block">📌 Active Student Enrolment Identification</span>
            <div class="text-xs sm:text-sm font-black text-white mt-0.5">
              ${studentName} • ${enrollmentProfile.gradeDisplay} • ${enrollmentProfile.schoolBoard} • ${enrollmentProfile.courseTitle}
            </div>
          </div>
          <span class="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-2xs font-extrabold">
            ⏱️ Scheduled Slot: ${enrollmentProfile.slotDurationLabel}
          </span>
        </div>

        <!-- Student Name & Grade (Class 8, 9, 10 vs Class 11, 12) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-extrabold text-slate-800 mb-1.5" for="bookingStudentNameInput">Student's Full Name *</label>
            <input id="bookingStudentNameInput" type="text" value="${studentName.replace(/"/g, '&quot;')}"
              oninput="window.setStudentDisplayName(this.value, false)"
              placeholder="Enter Student's Full Name"
              class="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:border-indigo-600 outline-none" />
          </div>
          <div>
            <label class="block text-xs font-extrabold text-slate-800 mb-1.5">Select Standard / Class (8th–10th vs 11th–12th) *</label>
            <div class="grid grid-cols-5 gap-1.5">
              ${['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(g => {
                const gNum = parseInt(g.replace('Grade ', ''), 10);
                return `
                  <button type="button"
                    onclick="window.updateStudentProfileField('grade', '${g}'); window.setJoiningGradeForExamPlan('${gNum}');"
                    class="py-2.5 px-1.5 rounded-xl border text-2xs font-extrabold cursor-pointer transition ${curGrade === g ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'}">
                    Class ${gNum}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Parent / Guardian Information (Mandatory for Student Communications & Reports) -->
        <div class="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-base">👨‍👩‍👧</span>
            <div>
              <span class="text-xs font-black text-slate-900 block">Parent / Legal Guardian Information *</span>
              <span class="text-3xs text-slate-500">Official monthly progress reports, WhatsApp schedule reminders, and fee receipts will be delivered to these details.</span>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-2xs font-extrabold text-slate-700 mb-1" for="bookingParentNameInput">Parent / Guardian Full Name *</label>
              <input id="bookingParentNameInput" type="text"
                value="${((AppState.bookingData && AppState.bookingData.parentName) || (AppState.studentOnboarding && AppState.studentOnboarding.parentName) || (AppState.parentData && AppState.parentData.parentName !== 'Parent / Legal Guardian' && AppState.parentData.parentName) || '').replace(/"/g, '&quot;')}"
                oninput="window.setParentDisplayName(this.value, false)"
                placeholder="e.g. Ramesh Sharma"
                class="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:border-indigo-600 outline-none" />
            </div>
            <div>
              <label class="block text-2xs font-extrabold text-slate-700 mb-1" for="bookingParentPhoneInput">Parent WhatsApp / Mobile Number *</label>
              <input id="bookingParentPhoneInput" type="tel"
                value="${((AppState.bookingData && AppState.bookingData.parentPhone) || (AppState.studentOnboarding && AppState.studentOnboarding.parentPhone) || '+91 98201 44892').replace(/"/g, '&quot;')}"
                oninput="window.setParentPhone(this.value)"
                placeholder="+91 98201 44892"
                class="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:border-indigo-600 outline-none" />
            </div>
            <div>
              <label class="block text-2xs font-extrabold text-slate-700 mb-1" for="bookingParentEmailInput">Parent Email Address (for Invoices) *</label>
              <input id="bookingParentEmailInput" type="email"
                value="${((AppState.bookingData && AppState.bookingData.parentEmail) || (AppState.studentOnboarding && AppState.studentOnboarding.parentEmail) || 'parent@siko.demo').replace(/"/g, '&quot;')}"
                oninput="window.setParentEmail(this.value)"
                placeholder="parent@example.com"
                class="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:border-indigo-600 outline-none" />
            </div>
          </div>
        </div>

        <!-- Select School Board (CBSE, ICSE, State Board, IB) -->
        <div>
          <label class="block text-xs font-extrabold text-slate-800 mb-1.5">Select School Board (Recorded alongside Competitive / Board Course) *</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            ${[
              { key: 'CBSE', label: '📘 CBSE Board (NCERT)' },
              { key: 'ICSE', label: '📗 ICSE / ISC (CISCE)' },
              { key: 'Maharashtra State Board', label: '📙 State Board (SSC / HSC)' },
              { key: 'IB', label: '🌍 IB / IGCSE Global' }
            ].map(b => `
              <button type="button"
                onclick="window.setEnrollmentSchoolBoard ? window.setEnrollmentSchoolBoard('${b.key}') : (AppState.bookingFlow.boardTrack='${b.key}', window.notifyStateChange())"
                class="p-2.5 rounded-xl border text-2xs font-extrabold cursor-pointer transition ${curBoard === b.key ? 'bg-blue-600 text-white border-blue-600 shadow-2xs' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}">
                ${b.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- SEPARATE ACADEMIC STREAMS: GROUP A (CLASS 8th–10th) vs GROUP B (CLASS 11th–12th) -->
        <div class="space-y-4">
          <!-- Group A: Class 8th to 10th Separate School Boards vs Competitive Olympiads -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <span class="text-xs font-black text-slate-900 uppercase tracking-wider">🎒 Group A: Class 8th, 9th &amp; 10th Courses (School Boards vs. Separate Olympiads)</span>
              <span class="text-3xs font-extrabold text-indigo-700">Auto-Selects Class 8–10 Standard</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- 1. Class 8-10 School Boards (1.0 Hr/Slot) -->
              <div onclick="window.setBookingStreamFilter('BOARD_8_10')"
                   class="p-4 rounded-2xl border-2 cursor-pointer transition-all ${curStream === 'BOARD_8_10' ? 'border-blue-600 bg-blue-50/50 shadow-xs' : 'border-slate-200 bg-white hover:border-blue-300'}">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-3xs font-extrabold">⏱️ 1.0 Hr / Lecture Slot</span>
                  <span class="px-2 py-0.5 rounded-full text-3xs font-extrabold ${curStream === 'BOARD_8_10' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}">
                    ${curStream === 'BOARD_8_10' ? '✓ Selected' : 'Select 8th–10th Board'}
                  </span>
                </div>
                <div class="font-black text-sm text-slate-900">📘 Class 8th–10th School Boards (CBSE / ICSE / State Board)</div>
                <p class="text-2xs text-slate-600 mt-1">Complete school syllabus mastery for Class 8, 9 &amp; 10 with <strong>1 Hour per lecture slot</strong> &amp; weekly subjective board tests.</p>
              </div>

              <!-- 2. Class 8-10 Competitive Olympiads & Foundation (1.5 Hrs/Slot) -->
              <div onclick="window.setBookingStreamFilter('OLYMPIAD_8_10')"
                   class="p-4 rounded-2xl border-2 cursor-pointer transition-all ${curStream === 'OLYMPIAD_8_10' ? 'border-amber-600 bg-amber-50/50 shadow-xs' : 'border-slate-200 bg-white hover:border-amber-400'}">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-3xs font-extrabold">⏱️ 1.5 Hrs / Lecture Slot</span>
                  <span class="px-2 py-0.5 rounded-full text-3xs font-extrabold ${curStream === 'OLYMPIAD_8_10' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'}">
                    ${curStream === 'OLYMPIAD_8_10' ? '✓ Selected' : 'Select 8th–10th Olympiad'}
                  </span>
                </div>
                <div class="font-black text-sm text-slate-900">🏆 Class 8th–10th Competitive Olympiads (IMO / NSO / IOQM / NSEJS / NTSE)</div>
                <p class="text-2xs text-slate-600 mt-1">Separate competitive Olympiad &amp; IIT/Medical Foundation track for Class 8–10 with <strong>1.5 Hours per lecture slot</strong>.</p>
              </div>
            </div>
          </div>

          <!-- Group B: Class 11th & 12th Separate JEE / NEET / Senior School Boards -->
          <div class="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200/80 space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <span class="text-xs font-black text-indigo-950 uppercase tracking-wider">🎓 Group B: Class 11th &amp; 12th Courses (Separate JEE vs. NEET vs. Senior Boards)</span>
              <span class="text-3xs font-extrabold text-indigo-700">⏱️ All 11th–12th Tracks: 1.5 Hours / Lecture Slot</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <!-- 3. Class 11-12 JEE Main & Adv / MHT-CET (PCM) (1.5 Hrs/Slot) -->
              <div onclick="window.setBookingStreamFilter('PCM')"
                   class="p-4 rounded-2xl border-2 cursor-pointer transition-all ${curStream === 'PCM' ? 'border-indigo-600 bg-indigo-50/70 shadow-xs' : 'border-slate-200 bg-white hover:border-indigo-300'}">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 text-3xs font-extrabold">⏱️ 1.5 Hrs / Slot</span>
                  <span class="px-2 py-0.5 rounded-full text-3xs font-extrabold ${curStream === 'PCM' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}">
                    ${curStream === 'PCM' ? '✓ Selected' : 'Select 11–12 JEE/CET'}
                  </span>
                </div>
                <div class="font-black text-sm text-slate-900">⚡ Class 11–12 JEE Main &amp; Adv / MHT-CET (PCM)</div>
                <p class="text-2xs text-slate-600 mt-1">Physics, Chemistry &amp; Mathematics with <strong>1.5 Hours per lecture slot</strong> + Sunday 300-Mark CBT Test.</p>
              </div>

              <!-- 4. Class 11-12 NEET UG Medical (PCB) (1.5 Hrs/Slot) -->
              <div onclick="window.setBookingStreamFilter('PCB')"
                   class="p-4 rounded-2xl border-2 cursor-pointer transition-all ${curStream === 'PCB' ? 'border-emerald-600 bg-emerald-50/70 shadow-xs' : 'border-slate-200 bg-white hover:border-emerald-300'}">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-3xs font-extrabold">⏱️ 1.5 Hrs / Slot</span>
                  <span class="px-2 py-0.5 rounded-full text-3xs font-extrabold ${curStream === 'PCB' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}">
                    ${curStream === 'PCB' ? '✓ Selected' : 'Select 11–12 NEET'}
                  </span>
                </div>
                <div class="font-black text-sm text-slate-900">🩺 Class 11–12 NEET UG Medical (PCB)</div>
                <p class="text-2xs text-slate-600 mt-1">Physics, Chemistry &amp; Biology with <strong>1.5 Hours per lecture slot</strong> + Sunday 720-Mark NEET OMR/CBT Test.</p>
              </div>

              <!-- 5. Class 11-12 Senior School Boards (CBSE / ISC / HSC / IB) (1.5 Hrs/Slot) -->
              <div onclick="window.setBookingStreamFilter('BOARD_11_12')"
                   class="p-4 rounded-2xl border-2 cursor-pointer transition-all ${curStream === 'BOARD_11_12' ? 'border-purple-600 bg-purple-50/60 shadow-xs' : 'border-slate-200 bg-white hover:border-purple-300'}">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="px-2 py-0.5 rounded bg-purple-100 text-purple-900 text-3xs font-extrabold">⏱️ 1.5 Hrs / Slot</span>
                  <span class="px-2 py-0.5 rounded-full text-3xs font-extrabold ${curStream === 'BOARD_11_12' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}">
                    ${curStream === 'BOARD_11_12' ? '✓ Selected' : 'Select 11–12 Boards'}
                  </span>
                </div>
                <div class="font-black text-sm text-slate-900">🎓 Class 11–12 Senior Boards (CBSE / ISC / HSC)</div>
                <p class="text-2xs text-slate-600 mt-1">Dedicated Class 11 &amp; 12 Board subjective &amp; derivation mastery with <strong>1.5 Hours per lecture slot</strong>.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Select Delivery Mode (1-on-1 vs 1-to-Many Smart Batches) -->
        <div>
          <label class="block text-xs font-extrabold text-slate-800 mb-2">Choose Learning Format (Both 1-on-1 &amp; 1-to-Many Smart Batches Available) *</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div onclick="window.setBookingJourneyMode('1-on-1')"
                 class="p-4 rounded-2xl border-2 cursor-pointer transition-all ${journeyType === '1-on-1' ? 'border-indigo-600 bg-indigo-50/40 shadow-xs' : 'border-slate-200 bg-white hover:border-indigo-300'}">
              <div class="flex items-center justify-between mb-1">
                <span class="font-black text-sm text-slate-900">🎯 1-on-1 Personalised Mentorship</span>
                <span class="px-2 py-0.5 rounded-full text-3xs font-extrabold ${journeyType === '1-on-1' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}">
                  ${journeyType === '1-on-1' ? '✓ Active' : 'Select 1-on-1'}
                </span>
              </div>
              <p class="text-2xs text-slate-600">Dedicated 1-on-1 specialist teacher per subject + Extra Multi-Subject Discount (20% to 30% Off for 2+ subjects).</p>
            </div>

            <div onclick="window.setBookingJourneyMode('smart-learning')"
                 class="p-4 rounded-2xl border-2 cursor-pointer transition-all ${journeyType === 'smart-learning' ? 'border-emerald-600 bg-emerald-50/40 shadow-xs' : 'border-slate-200 bg-white hover:border-emerald-300'}">
              <div class="flex items-center justify-between mb-1">
                <span class="font-black text-sm text-slate-900">👥 1-to-Many Smart Batch (Max 30)</span>
                <span class="px-2 py-0.5 rounded-full text-3xs font-extrabold ${journeyType === 'smart-learning' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}">
                  ${journeyType === 'smart-learning' ? '✓ Active' : 'Select Smart Batch'}
                </span>
              </div>
              <p class="text-2xs text-slate-600">Pre-decided complete course packages with different subject-wise specialist teachers + weekly Sunday testing.</p>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-end">
          <button type="button" onclick="window.setBookingStep(2)"
            class="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm cursor-pointer border-0 shadow-sm">
            Continue to Step 2: Multi-Subject Selection &rarr;
          </button>
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 2: MULTI-SUBJECT SELECTION (STRICTLY FILTERED BY STREAM + EXTRA DISCOUNT)
  // ═══════════════════════════════════════════════════════════════════════════
  if (step === 2) {
    const matrix = window.CURRICULUM_TEACHING_HOURS_MATRIX || {};
    const activeBoard = quote.boardKey || bf.boardTrack || 'JEE';
    const boardObj = matrix[activeBoard] || matrix['CBSE'] || { subjects: {} };
    const availableSubjects = typeof window.getAllowedSubjectsForStream === 'function'
      ? window.getAllowedSubjectsForStream()
      : Object.keys(boardObj.subjects || {});
    const selectedSubjects = quote.selectedSubjects || ['Physics'];

    const subjectAccentMap = {
      Physics: { bg: 'bg-blue-50/70', border: 'border-blue-600', badge: 'bg-blue-600 text-white', icon: '⚡', desc: 'Mechanics, Electrodynamics, Optics & Modern Physics' },
      Chemistry: { bg: 'bg-emerald-50/70', border: 'border-emerald-600', badge: 'bg-emerald-600 text-white', icon: '🧪', desc: 'Physical, Organic Mechanisms & Inorganic Bonding' },
      Mathematics: { bg: 'bg-indigo-50/70', border: 'border-indigo-600', badge: 'bg-indigo-600 text-white', icon: '📐', desc: 'Calculus, Algebra, Coordinate Geometry & Vectors' },
      Biology: { bg: 'bg-rose-50/70', border: 'border-rose-600', badge: 'bg-rose-600 text-white', icon: '🧬', desc: 'Cell Biology, Genetics, Human & Plant Physiology' }
    };

    return `
      <div class="space-y-6">
        <div class="border-b border-slate-100 pb-4">
          <div class="flex items-center justify-between gap-2 flex-wrap mb-1.5">
            <span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-3xs font-extrabold uppercase tracking-wider">
              Step 02 of 06 • ${enrollmentProfile.gradeDisplay} • ${enrollmentProfile.schoolBoard} • ${enrollmentProfile.courseTitle}
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-3xs">
              ${selectedSubjects.length} Subject${selectedSubjects.length > 1 ? 's' : ''} Selected (${quote.discountPct}% Off) • ⏱️ ${enrollmentProfile.slotDurationLabel}
            </span>
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            2. Select 1 or Multiple Subjects (${availableSubjects.join(', ')})
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            Click any subject card below to toggle it <strong>ON or OFF</strong>. Selecting <strong>2 or more subjects</strong> automatically unlocks higher multi-subject savings!
          </p>
        </div>

        <!-- PROGRESSIVE MULTI-SUBJECT EXTRA DISCOUNT LADDER BANNER -->
        <div class="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 via-blue-50/70 to-emerald-50/70 border border-indigo-200/80 flex flex-wrap items-center justify-between gap-2 text-2xs">
          <div class="font-extrabold text-indigo-950 flex items-center gap-1.5">
            <span>🎁</span>
            <span>${quote.formatMode === 'batch' ? '1-to-Many Smart Batch' : '1-on-1 Personalised'} Multi-Subject Discount Ladder:</span>
          </div>
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="px-2.5 py-1 rounded-lg border font-extrabold text-3xs ${selectedSubjects.length === 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'}">1 Subject: 10% Off</span>
            <span class="px-2.5 py-1 rounded-lg border font-extrabold text-3xs ${selectedSubjects.length === 2 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-800 border-indigo-200'}">2 Subjects: 20% Off (Extra!)</span>
            <span class="px-2.5 py-1 rounded-lg border font-extrabold text-3xs ${selectedSubjects.length === 3 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-800 border-emerald-200'}">3 Subjects (${curStream === 'PCB' ? 'PCB' : 'PCM'}): 25% Off (Extra!)</span>
            ${availableSubjects.length >= 4 ? `
              <span class="px-2.5 py-1 rounded-lg border font-extrabold text-3xs ${selectedSubjects.length >= 4 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-amber-900 border-amber-300'}">4 Subjects: 30% Off (Max!)</span>
            ` : ''}
          </div>
        </div>

        <!-- Quick Preset Buttons Filtered by Stream -->
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <span class="text-xs font-extrabold text-slate-700">Quick Select:</span>
          <div class="flex items-center gap-2 flex-wrap">
            ${availableSubjects.includes('Mathematics') ? `
              <button type="button" onclick="window.selectBookingPresetBundle('PCM', false)"
                class="px-3 py-1.5 rounded-xl text-2xs font-extrabold cursor-pointer border transition ${selectedSubjects.length === 3 && selectedSubjects.includes('Mathematics') ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-900 border-indigo-200 hover:bg-indigo-50'}">
                ⚡ Select All 3 PCM Subjects (25% Off)
              </button>
            ` : ''}
            ${availableSubjects.includes('Biology') ? `
              <button type="button" onclick="window.selectBookingPresetBundle('PCB', false)"
                class="px-3 py-1.5 rounded-xl text-2xs font-extrabold cursor-pointer border transition ${selectedSubjects.length === 3 && selectedSubjects.includes('Biology') ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-50'}">
                🩺 Select All 3 PCB Subjects (25% Off)
              </button>
            ` : ''}
            <button type="button" onclick="window.setBookingScopeMode('subject')"
              class="px-3 py-1.5 rounded-xl text-2xs font-extrabold cursor-pointer border transition ${selectedSubjects.length === 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50'}">
              📘 1 Subject Only (10% Off)
            </button>
          </div>
        </div>

        <!-- Stream-Filtered Multi-Select Subject Cards with Screening Demos & Zero Out-of-Pocket Faculty Freezing -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          ${availableSubjects.map(subjName => {
            const sObj = boardObj.subjects[subjName] || { chapters: [{ totalHours: 70 }] };
            const isSelected = selectedSubjects.includes(subjName);
            const rc = (quote.subjectRateChart && quote.subjectRateChart[subjName]) || null;
            const totHrs = (rc && rc.allottedHours) || sObj.chapters.reduce((a, c) => a + c.totalHours, 0);
            const totSlots = Math.max(1, Math.ceil(totHrs / slotDurationHrs));
            const specInfo = (window.SUBJECT_SPECIALIST_FACULTY_ROSTER && window.SUBJECT_SPECIALIST_FACULTY_ROSTER[subjName]) || {};
            const chosenTeacherId = bf.selectedTeachersBySubject?.[subjName] || specInfo.teacherId;
            const candObj = (specInfo.candidates || []).find(c => c.teacherId === chosenTeacherId) || specInfo;
            const assignedSlot = bf.selectedSlotsBySubject?.[subjName] || candObj.defaultSlot || specInfo.defaultSlot || 'Mon, Wed, Fri • 5:00 PM – 6:30 PM IST';
            const modeDiscPct = quote.discountPct || (selectedSubjects.length >= 4 ? 30 : (selectedSubjects.length === 3 ? 25 : (selectedSubjects.length === 2 ? 20 : 10)));
            const isSubjFrozen = Boolean(rc && rc.isFrozen);
            const subjGrossPrice = (rc && rc.grossSubjectFee) || Math.round(totHrs * (quote.effectiveHourlyRate || 520));
            const subjNetPrice = (rc && rc.netSubjectFee) || Math.round(totHrs * (quote.effectiveStudentRatePerHour || 520));
            const acc = subjectAccentMap[subjName] || subjectAccentMap.Physics;

            return `
              <div onclick="window.toggleBookingSubjectSelection('${subjName}')"
                   class="p-4 rounded-2xl border-2 ${isSelected ? `${acc.border} ${acc.bg} shadow-xs` : 'border-slate-200 bg-white hover:border-indigo-300'} cursor-pointer transition-all flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-1.5">
                    <span class="font-black text-base text-slate-900 flex items-center gap-1.5">
                      <span>${acc.icon}</span> <span>${subjName}</span>
                    </span>
                    <div class="flex items-center gap-1.5">
                      ${isSubjFrozen ? `
                        <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-3xs font-black">🔒 Frozen</span>
                      ` : `
                        <span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-3xs font-extrabold">Demo Ready</span>
                      `}
                      <span class="px-2.5 py-0.5 rounded-full ${isSelected ? acc.badge : 'bg-slate-100 text-slate-600'} text-3xs font-extrabold">
                        ${isSelected ? '✓ Selected' : '+ Click to Select'}
                      </span>
                    </div>
                  </div>
                  <p class="text-2xs text-slate-600 mb-2">${acc.desc}</p>
                  
                  <div class="flex items-baseline justify-between gap-1 my-1">
                    <span class="text-xs font-extrabold text-slate-700">${totHrs} Hrs (${totSlots} Lecture Slots • ${sObj.chapters.length} Chapters)</span>
                    <div class="text-right">
                      <span class="text-3xs text-slate-400 line-through mr-1">₹${subjGrossPrice.toLocaleString('en-IN')}</span>
                      <span class="text-base font-black text-slate-900">₹${subjNetPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between text-3xs font-bold text-emerald-700">
                    <span>${modeDiscPct}% ${selectedSubjects.length > 1 ? 'Multi-Subject' : 'Course'} Discount Applied</span>
                    <span>⏱️ ₹${(rc && rc.activeEffectiveRatePerHr) || 520}/hr Net Tuition</span>
                  </div>
                </div>

                <div class="mt-2.5 pt-2 border-t border-slate-200/70 text-3xs flex items-center justify-between flex-wrap gap-2">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="font-bold text-slate-800 truncate">👩‍🏫 ${candObj.name || 'Specialist Faculty'}</span>
                    <span class="text-slate-500 font-semibold truncate">(Agreed: ₹${(rc && rc.agreedRate) || 1200}/hr)</span>
                  </div>
                  <div class="flex items-center gap-1.5" onclick="event.stopPropagation();">
                    <button type="button" onclick="window.openTeacherScreeningDemo('${subjName}', '${chosenTeacherId}')"
                      class="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-3xs border border-indigo-200 transition cursor-pointer">
                      ▶ Watch Demo
                    </button>
                    ${isSubjFrozen ? `
                      <button type="button" onclick="window.unfreezeTeacherForSubject('${subjName}')"
                        class="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-black text-3xs border border-emerald-300 transition cursor-pointer">
                        🔒 Frozen ✓
                      </button>
                    ` : `
                      <button type="button" onclick="window.freezeTeacherForSubject('${subjName}', '${chosenTeacherId}')"
                        class="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-3xs border-0 shadow-2xs transition cursor-pointer">
                        🔒 Freeze Faculty
                      </button>
                    `}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- LIVE SUBJECT-WISE COURSE FEE BREAKDOWN TABLE (1-on-1 & 1:Many Hourly Rates Kept Strictly in Backend Only) -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span class="text-3xs font-extrabold uppercase tracking-wider text-indigo-700 block">📊 Official Subject-Wise Course Fee Schedule (${enrollmentProfile.gradeDisplay} • ${enrollmentProfile.schoolBoard} • ${quote.formatMode === 'batch' ? '1-to-Many Smart Batch' : '1-on-1 Personalised'})</span>
              <h4 class="text-xs sm:text-sm font-black text-slate-900">Live Synced Subject Fee Breakdown (${selectedSubjects.length} Subject${selectedSubjects.length > 1 ? 's' : ''}: ${selectedSubjects.join(' + ')})</h4>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-3xs font-extrabold">
              ✓ Left Selection = Right Summary (₹${quote.netStudentCourseFeeExclGst.toLocaleString('en-IN')} Net + 18% GST = ₹${quote.totalPayableByParent.toLocaleString('en-IN')})
            </span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-2xs">
              <thead>
                <tr class="border-b border-slate-200 text-slate-500 font-extrabold uppercase text-3xs">
                  <th class="py-1.5 pr-2">Subject &amp; Status</th>
                  <th class="py-1.5 px-2">Specialist Teacher &amp; Screening Demo</th>
                  <th class="py-1.5 px-2">Hours &amp; Slots</th>
                  <th class="py-1.5 px-2">Faculty Agreed Honorarium</th>
                  <th class="py-1.5 px-2">Catalogue Rate (Gross)</th>
                  <th class="py-1.5 pl-2 text-right">Active Net Fee (${quote.discountPct}% Off)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200/60">
                ${availableSubjects.map(subjName => {
                  const rc = (quote.subjectRateChart && quote.subjectRateChart[subjName]) || {};
                  const isSel = selectedSubjects.includes(subjName);
                  const specInfo = (window.SUBJECT_SPECIALIST_FACULTY_ROSTER && window.SUBJECT_SPECIALIST_FACULTY_ROSTER[subjName]) || {};
                  const subjHrs = rc.allottedHours || 70;
                  const subjSlots = Math.max(1, Math.ceil(subjHrs / slotDurationHrs));
                  const isSubjFrozen = Boolean(rc.isFrozen);
                  const chosenTeacherId = bf.selectedTeachersBySubject?.[subjName] || specInfo.teacherId;

                  return `
                    <tr class="${isSel ? 'bg-indigo-50/60 font-bold text-slate-900' : 'text-slate-500'}">
                      <td class="py-2 pr-2 font-extrabold">
                        ${isSel ? '✓ ' : ''}${subjName}
                        ${isSubjFrozen ? '<span class="ml-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-3xs font-black">🔒 Frozen</span>' : '<span class="ml-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-3xs font-extrabold">Pre-Freeze</span>'}
                      </td>
                      <td class="py-2 px-2">
                        <div class="flex items-center gap-1.5">
                          <span>${rc.chosenTeacherName || specInfo.name || 'Specialist Faculty'}</span>
                          <button type="button" onclick="event.stopPropagation(); window.openTeacherScreeningDemo('${subjName}', '${chosenTeacherId}')"
                            class="px-1.5 py-0.5 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-3xs font-extrabold border border-indigo-200">
                            ▶ Demo
                          </button>
                        </div>
                      </td>
                      <td class="py-2 px-2">${subjHrs} Hrs (${subjSlots} Slots)</td>
                      <td class="py-2 px-2 font-bold text-indigo-900">₹${(rc.agreedRate || 1200).toLocaleString('en-IN')}/hr <span class="text-3xs text-slate-500 font-normal">(${quote.formatMode === 'batch' ? '50% Pool' : '75% Payout'})</span></td>
                      <td class="py-2 px-2 text-slate-400 line-through">₹${(rc.grossSubjectFee || 0).toLocaleString('en-IN')} (₹${rc.activeBaseRatePerHr}/hr)</td>
                      <td class="py-2 pl-2 text-right font-black ${isSel ? 'text-indigo-950' : 'text-slate-400'}">
                        ₹${(rc.netSubjectFee || 0).toLocaleString('en-IN')} (₹${rc.activeEffectiveRatePerHr}/hr)
                        ${isSel ? '<span class="block text-3xs text-emerald-700 font-bold">Selected ✓</span>' : '<span class="block text-3xs text-slate-400">(Not Selected)</span>'}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
              <tfoot>
                <tr class="border-t-2 border-slate-300 bg-white font-black text-xs text-slate-900">
                  <td colspan="2" class="py-2 pr-2">Total (${selectedSubjects.length} Subj: ${selectedSubjects.join(' + ')})</td>
                  <td class="py-2 px-2">${quote.totalHours} Hrs (${Math.max(1, Math.ceil(quote.totalHours / slotDurationHrs))} Slots)</td>
                  <td class="py-2 px-2 text-indigo-800 font-extrabold">Full Syllabus Track</td>
                  <td class="py-2 px-2 text-emerald-700">${quote.discountPct}% Discount (-₹${quote.discountAmount.toLocaleString('en-IN')})</td>
                  <td class="py-2 pl-2 text-right text-indigo-950">₹${quote.netStudentCourseFeeExclGst.toLocaleString('en-IN')} <span class="text-3xs text-slate-500 font-bold">(+18% GST = ₹${quote.totalPayableByParent.toLocaleString('en-IN')})</span></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button type="button" class="btn btn-outline" onclick="window.setBookingStep(1)">&larr; Back to Stream &amp; Mode</button>
          <button type="button" onclick="window.setBookingStep(3)"
            class="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm cursor-pointer border-0 shadow-sm">
            Continue to Step 3: Student Learning DNA &rarr;
          </button>
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 3: STUDENT LEARNING DNA (NEVER MISSED IN THE FLOW!)
  // ═══════════════════════════════════════════════════════════════════════════
  if (step === 3) {
    const ob = AppState.studentOnboarding || {};
    const dna = AppState.learningDna || {};
    const curStyle = ob.learningStyle || 'Visual & First-Principles Derivation';
    const diagAccuracy = typeof dna.accuracy === 'number' ? dna.accuracy : 80;
    const examSpec = typeof window.getExamFormatSpecFromLearningDna === 'function'
      ? window.getExamFormatSpecFromLearningDna()
      : { code: curStream === 'PCB' ? 'NEET' : 'JEE', badge: '⚡ JEE Main & Advanced CBT Format', markingScheme: '+4 / -1' };
    const activeDnaSubject = selectedSubjectsList.includes(dna.subject) ? dna.subject : (selectedSubjectsList[0] || 'Physics');

    return `
      <div class="space-y-6">
        <div class="border-b border-slate-100 pb-4">
          <div class="flex items-center justify-between gap-2 flex-wrap mb-1.5">
            <span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-3xs font-extrabold uppercase tracking-wider">
              Step 03 of 06 • Student Learning DNA Calibration
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-3xs">
              🧬 ${examSpec.badge}
            </span>
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            3. Calibrate ${studentName}'s Learning DNA (${selectedSubjectsList.join(' + ')})
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            Your Learning DNA regulates your teacher's pedagogy, daily study plan, and AI adaptive topic tests under the <strong>Success Assured Plan</strong>.
          </p>
        </div>

        <!-- 1. Preferred Learning Style -->
        <div>
          <label class="block text-xs font-extrabold text-slate-800 mb-2">1. How does ${studentName} learn best?</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div onclick="AppState.studentOnboarding.learningStyle='Visual & First-Principles Derivation'; window.notifyStateChange();"
                 class="p-3.5 rounded-2xl border-2 cursor-pointer transition ${curStyle.includes('Visual') ? 'border-indigo-600 bg-indigo-50/40 shadow-2xs' : 'border-slate-200 bg-white hover:border-indigo-300'}">
              <div class="flex items-center justify-between mb-1">
                <span class="font-extrabold text-xs text-slate-900">🔬 Visual &amp; First-Principles Derivation</span>
                <span class="text-3xs font-extrabold ${curStyle.includes('Visual') ? 'text-indigo-700' : 'text-slate-400'}">${curStyle.includes('Visual') ? '✓ Selected' : 'Select'}</span>
              </div>
              <p class="text-2xs text-slate-600">Step-by-step visual concept derivations with real-world physical intuition.</p>
            </div>

            <div onclick="AppState.studentOnboarding.learningStyle='Intense Problem Practice & Exam Speed'; window.notifyStateChange();"
                 class="p-3.5 rounded-2xl border-2 cursor-pointer transition ${curStyle.includes('Intense') ? 'border-indigo-600 bg-indigo-50/40 shadow-2xs' : 'border-slate-200 bg-white hover:border-indigo-300'}">
              <div class="flex items-center justify-between mb-1">
                <span class="font-extrabold text-xs text-slate-900">⚡ Intense Problem Practice &amp; Shortcuts</span>
                <span class="text-3xs font-extrabold ${curStyle.includes('Intense') ? 'text-indigo-700' : 'text-slate-400'}">${curStyle.includes('Intense') ? '✓ Selected' : 'Select'}</span>
              </div>
              <p class="text-2xs text-slate-600">High-speed numerical drills, PYQ trap elimination &amp; timed exam execution.</p>
            </div>
          </div>
        </div>

        <!-- 2. Calibrate Diagnostic Baseline for Selected Subjects -->
        <div class="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span class="text-3xs font-extrabold uppercase tracking-wider text-amber-300 block">🧠 AI Diagnostic Baseline &amp; Subject Focus</span>
              <h4 class="text-xs sm:text-sm font-bold text-white">Select Current Baseline or Take the 5-Question Calm Diagnostic</h4>
            </div>
            <button type="button" onclick="window.setStudentOnboardingStep(5); window.navigateView('student-onboarding')"
              class="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-2xs cursor-pointer border-0">
              🧪 Take 5-Q Diagnostic Test &rarr;
            </button>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-2xs font-bold text-slate-300">Diagnostic Level:</span>
              ${[
                { key: 'developing', label: 'Developing (40%)', pct: 40 },
                { key: 'proficient', label: 'Proficient (60%)', pct: 60 },
                { key: 'strong', label: 'Strong (80%)', pct: 80 },
                { key: 'mastery', label: 'Rank-Builder (100%)', pct: 100 }
              ].map(p => `
                <button type="button" onclick="window.simulateLearningDnaProfile('${p.key}', '${activeDnaSubject}')"
                  class="px-2.5 py-1 rounded-lg text-3xs font-extrabold cursor-pointer border-0 transition ${diagAccuracy === p.pct ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-200 hover:bg-white/20'}">
                  ${p.label}
                </button>
              `).join('')}
            </div>

            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-2xs font-bold text-slate-300">Subject:</span>
              ${selectedSubjectsList.map(sub => `
                <button type="button" onclick="window.simulateLearningDnaProfile('${diagAccuracy <= 45 ? 'developing' : diagAccuracy <= 65 ? 'proficient' : diagAccuracy <= 85 ? 'strong' : 'mastery'}', '${sub}')"
                  class="px-2.5 py-1 rounded-lg text-3xs font-bold cursor-pointer border-0 ${activeDnaSubject === sub ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}">
                  ${sub}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 3. Synthesized Student Learning DNA Snapshot -->
        <div class="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span class="text-3xs font-extrabold uppercase tracking-wider text-indigo-700 block">Active Student Learning DNA Profile</span>
              <h4 class="text-sm font-black text-slate-900">${studentName} • ${dna.difficultyTier || 'Rank-Builder Calibre'} (${diagAccuracy}% Accuracy)</h4>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-white border border-indigo-200 text-indigo-900 font-extrabold text-3xs">
              Exam Format: ${examSpec.code} (${examSpec.markingScheme})
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-2xs">
            <div class="p-3 rounded-xl bg-white border border-slate-200">
              <span class="text-3xs text-slate-500 font-bold uppercase block">Learning Style</span>
              <strong class="text-slate-900">${curStyle}</strong>
            </div>
            <div class="p-3 rounded-xl bg-white border border-slate-200">
              <span class="text-3xs text-slate-500 font-bold uppercase block">Verified Strength</span>
              <strong class="text-emerald-700">${(dna.strengths && dna.strengths[0]) || `${activeDnaSubject} Core Laws`}</strong>
            </div>
            <div class="p-3 rounded-xl bg-white border border-slate-200">
              <span class="text-3xs text-slate-500 font-bold uppercase block">Priority Focus Area</span>
              <strong class="text-amber-700">${(dna.focusAreas && dna.focusAreas[0]) || `${activeDnaSubject} Timed Numericals`}</strong>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button type="button" class="btn btn-outline" onclick="window.setBookingStep(2)">&larr; Back to Subjects</button>
          <button type="button" onclick="window.setBookingStep(4)"
            class="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm cursor-pointer border-0 shadow-sm">
            Continue to Step 4: Faculty &amp; Synced Schedule &rarr;
          </button>
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 4: SUBJECT-WISE FACULTY & CONFLICT-FREE SCHEDULE (STRICTLY FILTERED BY STREAM!)
  // ═══════════════════════════════════════════════════════════════════════════
  if (step === 4) {
    const filteredOneToManyCourses = typeof window.getFilteredPredecidedOneToManyCourses === 'function'
      ? window.getFilteredPredecidedOneToManyCourses()
      : (window.PREDECIDED_ONE_TO_MANY_COURSES || []);

    return `
      <div class="space-y-6">
        <div class="border-b border-slate-100 pb-4">
          <div class="flex items-center justify-between gap-2 flex-wrap mb-1.5">
            <span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-3xs font-extrabold uppercase tracking-wider">
              Step 04 of 06 • ${journeyType === 'smart-learning' ? '1-to-Many Course-Wise Slot' : 'Subject-Wise Specialist Faculty & Back-Calculated Schedule'}
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-3xs">
              ✓ Portion Completed Strictly 1 Month Before Exam • Zero Slot Clash
            </span>
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            4. ${journeyType === 'smart-learning'
              ? `Select Your ${curStream === 'PCM' ? 'JEE (PCM)' : curStream === 'PCB' ? 'NEET (PCB)' : 'Board'} Course Time Slot &amp; Start-to-End Schedule (${selectedSubjectsList.join(' + ')})`
              : `Select Specialist Teacher, Time Slot &amp; Back-Calculated Schedule (${selectedSubjectsList.join(' + ')})`}
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            Back-calculated from your <strong>Date of Joining (Start Date)</strong> so the entire syllabus across <strong>all ${selectedSubjectsList.length} selected subject${selectedSubjectsList.length > 1 ? 's' : ''} (${selectedSubjectsList.join(', ')})</strong> is completed <strong>1 month before the exam (End Date)</strong> with zero schedule clashes.
          </p>
        </div>

        <!-- BACK-CALCULATION SCHEDULE ENGINE: START DATE (JOINING) -> 1 MONTH BEFORE EXAM (PORTION COMPLETION END DATE) -> EXAM DATE -->
        <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/15">
            <div>
              <span class="text-3xs font-extrabold uppercase tracking-wider text-amber-300 block">📐 Automated Back-Calculation Schedule Engine (Success Assured Plan)</span>
              <h4 class="text-sm sm:text-base font-black text-white">Start Date &rarr; Portion Completed 1 Month Before Exam &rarr; Final 30-Day Mock Testing</h4>
            </div>
            <div class="flex items-center gap-1.5 flex-wrap">
              ${[
                { m: 4, label: '4M Fast-Track' },
                { m: 6, label: '6M Exam Track' },
                { m: 9, label: '9M Accelerated' },
                { m: 12, label: '12M Full Year' },
                { m: 24, label: '24M 2-Year' }
              ].map(p => `
                <button type="button" onclick="window.setMonthsLeftForExam(${p.m})"
                  class="px-2.5 py-1 rounded-lg text-3xs font-extrabold cursor-pointer border-0 transition ${monthsLeft === p.m ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-200 hover:bg-white/20'}">
                  ${p.label}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Interactive Start Date (Date of Joining) & Target Exam Date Pickers + Back-Calculated Milestones -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-white/10 border border-white/15">
              <label class="text-3xs font-extrabold uppercase tracking-wider text-sky-300 block mb-1">1. Start Date (Date of Joining)</label>
              <input type="date" value="${bookingData.joiningDateISO || '2026-10-08'}"
                onchange="window.setJoiningDateForExamPlan(this.value)"
                class="w-full p-1.5 rounded-lg bg-slate-950 text-white border border-white/20 text-xs font-bold" />
              <span class="text-3xs text-slate-300 mt-1 block">Course Starts: <strong>${countdownPlan.joiningDateFormatted || '08 Oct 2026'}</strong></span>
            </div>

            <div class="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40">
              <span class="text-3xs font-extrabold uppercase tracking-wider text-emerald-300 block mb-1">2. Portion End Date (1M Before Exam)</span>
              <div class="text-sm sm:text-base font-black text-white">${countdownPlan.syllabusCompletionDateFormatted || '08 Mar 2027'}</div>
              <span class="text-3xs text-emerald-200 mt-1 block">✓ 100% Syllabus Done in <strong>${countdownPlan.syllabusCompletionMonths || (monthsLeft - 1)} Months (${countdownPlan.syllabusWeeks || ((monthsLeft - 1) * 4)} Wks)</strong></span>
            </div>

            <div class="p-3 rounded-xl bg-white/10 border border-white/15">
              <label class="text-3xs font-extrabold uppercase tracking-wider text-amber-300 block mb-1">3. Target Final Exam Date</label>
              <input type="date" value="${bookingData.targetExamDateISO || '2027-04-08'}"
                onchange="window.setTargetExamDateForPlan(this.value)"
                class="w-full p-1.5 rounded-lg bg-slate-950 text-white border border-white/20 text-xs font-bold" />
              <span class="text-3xs text-amber-200 mt-1 block">Final 30 Days: Full-Length Mock Papers</span>
            </div>

            <div class="p-3 rounded-xl bg-indigo-500/25 border border-indigo-400/40">
              <span class="text-3xs font-extrabold uppercase tracking-wider text-indigo-200 block mb-1">4. Adjusted Course &amp; Faculty Hrs</span>
              <div class="text-sm sm:text-base font-black text-white">${quote.totalHours} Hrs Allotted</div>
              <span class="text-3xs text-indigo-200 mt-1 block">⚡ Faculty Scheduled: <strong>${countdownPlan.weeklyHoursRequired} Hrs/Wk</strong> (${countdownPlan.sessionsPerWeek} sessions/wk)</span>
            </div>
          </div>
        </div>

        ${journeyType === 'smart-learning' ? `
          <!-- 1-TO-MANY PRE-DECIDED COURSE-WISE PACKAGES WITH SUBJECT-WISE SPECIALIST TEACHERS (100% SYNCED WITH RATE CHART & SELECTED SUBJECTS) -->
          <div class="space-y-4">
            ${filteredOneToManyCourses.map(course => {
              const isCourseActive = bf.selectedPredecidedCourseId === course.id || filteredOneToManyCourses.length === 1;
              const activeSlotIdx = bf.selectedPredecidedSlotIdx || 0;
              // Sync displayed course price & subjects with the CFO Rate Chart and selectedSubjectsList when active!
              const syncedGrossPrice = isCourseActive ? quote.grossMarketTuition : (course.originalPrice || 54000);
              const syncedNetPrice = isCourseActive ? quote.netStudentCourseFeeExclGst : (course.price || 34999);
              const finalWithGst = isCourseActive ? quote.totalPayableByParent : Math.round(syncedNetPrice * 1.18);
              const syncedDiscountPct = isCourseActive ? quote.discountPct : (course.discountPct || 25);

              return `
                <div class="p-4 sm:p-5 rounded-2xl border-2 ${isCourseActive ? 'border-emerald-600 bg-emerald-50/25 shadow-xs' : 'border-slate-200 bg-white'} space-y-3">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-extrabold text-3xs">${course.examTrack} • ${selectedSubjectsList.length} Subject${selectedSubjectsList.length > 1 ? 's' : ''} (${selectedSubjectsList.join(' + ')})</span>
                      <h4 class="font-black text-sm sm:text-base text-slate-900 mt-1">${course.title}</h4>
                      <p class="text-2xs text-emerald-800 font-bold mt-0.5">✓ Different Specialist Teacher per Subject • Zero Schedule Clash • Synced with Rate Chart (${quote.totalHours} Hrs)</p>
                    </div>
                    <div class="text-right">
                      <span class="text-3xs text-slate-400 line-through block">Gross Rate: ₹${syncedGrossPrice.toLocaleString('en-IN')}</span>
                      <span class="text-lg font-black text-emerald-800">₹${finalWithGst.toLocaleString('en-IN')} <span class="text-3xs font-extrabold text-emerald-700">(Incl. 18% GST)</span></span>
                      <span class="block text-3xs font-semibold text-slate-600">Net Course (${selectedSubjectsList.join(' + ')}): ₹${syncedNetPrice.toLocaleString('en-IN')} + 18% GST • ${syncedDiscountPct}% Off</span>
                    </div>
                  </div>

                  <!-- Subject-Wise Specialist Faculty Grid with Screening Demos & Zero Out-of-Pocket Freeze State -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    ${specialistAllocations.map(sa => {
                      const rc = (quote.subjectRateChart && quote.subjectRateChart[sa.subject]) || null;
                      const li = (quote.lineItems || []).find(item => item.subject === sa.subject) || null;
                      const subjHours = (li && li.totalHours) || (rc && rc.allottedHours) || sa.studentCourseHours || 70;
                      const subjNet = (li && li.netSubjectFee) || (rc && rc.netSubjectFee) || Math.round(subjHours * ((rc && rc.activeEffectiveRatePerHr) || 280));
                      const isSubjFrozen = Boolean(rc && rc.isFrozen);
                      return `
                        <div class="p-2.5 rounded-xl bg-white border ${isSubjFrozen ? 'border-emerald-500 bg-emerald-50/20' : 'border-indigo-200'} flex flex-col justify-between gap-1.5">
                          <div class="flex items-center justify-between gap-1">
                            <span class="px-2 py-0.5 rounded bg-indigo-600 text-white font-extrabold text-3xs uppercase">${sa.subject}</span>
                            <span class="text-3xs font-black text-slate-900">₹${subjNet.toLocaleString('en-IN')} (${subjHours}h)</span>
                          </div>
                          <div class="font-extrabold text-xs text-slate-900 mt-0.5 flex items-center justify-between">
                            <span>👩‍🏫 ${sa.teacherName}</span>
                            ${isSubjFrozen ? '<span class="text-3xs text-emerald-700 font-black">🔒 Frozen</span>' : ''}
                          </div>
                          <div class="text-3xs text-indigo-700 font-semibold">🗓️ ${sa.assigned1on1Slot}</div>
                          <div class="text-3xs text-slate-500">Batch Rate: ₹${(rc && rc.agreedRate) || 250}/hr per student</div>
                          
                          <div class="flex items-center justify-between gap-1 pt-1 border-t border-slate-100">
                            <button type="button" onclick="window.openTeacherScreeningDemo('${sa.subject}', '${sa.teacherId}')"
                              class="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-3xs font-extrabold border border-indigo-200 cursor-pointer">
                              ▶ Demo
                            </button>
                            ${isSubjFrozen ? `
                              <button type="button" onclick="window.unfreezeTeacherForSubject('${sa.subject}')"
                                class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-3xs font-black border border-emerald-300 cursor-pointer">
                                🔒 Frozen ✓
                              </button>
                            ` : `
                              <button type="button" onclick="window.freezeTeacherForSubject('${sa.subject}', '${sa.teacherId}')"
                                class="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-3xs font-extrabold cursor-pointer border-0 shadow-2xs">
                                🔒 Freeze
                              </button>
                            `}
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>

                  <div class="text-2xs text-indigo-900 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
                    <strong>🧪 Weekly Sunday Testing:</strong> ${course.testingBlueprint}
                  </div>

                  <div class="space-y-2 pt-1">
                    <span class="text-2xs font-extrabold uppercase tracking-wider text-slate-600 block">Select Available Time Slot:</span>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      ${(course.availableSlots || []).map((slotObj, sIdx) => {
                        const isThisSlotPicked = isCourseActive && activeSlotIdx === sIdx;
                        return `
                          <div onclick="window.selectPredecidedOneToManyCourse('${course.id}', ${sIdx}, false)"
                               class="p-3 rounded-xl border-2 ${isThisSlotPicked ? 'border-emerald-600 bg-white font-extrabold text-emerald-950 shadow-2xs' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-400'} cursor-pointer text-2xs flex flex-col justify-between gap-1.5">
                            <div>
                              <div class="font-extrabold text-slate-900">${slotObj.label}</div>
                              <div class="text-3xs text-indigo-700 font-bold mt-0.5">🗓️ ${slotObj.schedule}</div>
                            </div>
                            <div class="flex items-center justify-between pt-1.5 border-t border-slate-100">
                              <span class="text-3xs text-slate-500">${slotObj.seatsLeft} seats left</span>
                              <span class="px-2 py-0.5 rounded text-3xs font-extrabold ${isThisSlotPicked ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}">
                                ${isThisSlotPicked ? 'Selected ✓' : 'Select Slot'}
                              </span>
                            </div>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <!-- 1-ON-1 SUBJECT-WISE SPECIALIST TEACHER SELECTION, SCREENING DEMOS & FREEZE STATE -->
          <div class="space-y-4">
            ${(() => {
              const obDna = AppState.studentOnboarding || {};
              const dna = AppState.learningDna || {};
              const curStyle = obDna.learningStyle || 'Visual & First-Principles Derivation';
              const examSpec = typeof window.getExamFormatSpecFromLearningDna === 'function'
                ? window.getExamFormatSpecFromLearningDna()
                : { code: curStream === 'PCB' ? 'NEET' : 'JEE', badge: '⚡ JEE Main & Advanced CBT Format', markingScheme: '+4 / -1' };

              return specialistAllocations.map(spec => {
                const rc = (quote.subjectRateChart && quote.subjectRateChart[spec.subject]) || null;
                const li = (quote.lineItems || []).find(item => item.subject === spec.subject) || null;
                const subjHours = (li && li.totalHours) || (rc && rc.allottedHours) || spec.studentCourseHours || 70;
                const isSubjFrozen = Boolean(rc && rc.isFrozen);
                const subjFee = (li && li.netSubjectFee) || (rc && rc.netSubjectFee) || Math.round(subjHours * ((rc && rc.activeEffectiveRatePerHr) || 520));
                const candObj = (spec.candidates || []).find(c => c.teacherId === spec.teacherId) || spec;
                const activeMode = (AppState.bookingFlow?.facultySelectionModes?.[spec.subject]) || (AppState.bookingFlow?.facultySelectionMode) || 'ai_match';
                const heroPhotoUrl = candObj.avatar || spec.avatar || `assets/teachers/teacher_${spec.subject.toLowerCase()}_indian.png`;

                return `
                  <div class="p-4 rounded-2xl border ${isSubjFrozen ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 bg-slate-50/60'} space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <div class="flex items-center gap-3">
                        <img src="${heroPhotoUrl}" alt="${candObj.name || spec.teacherName}" class="w-12 h-12 rounded-2xl object-cover border-2 ${isSubjFrozen ? 'border-emerald-500' : 'border-indigo-500'} shadow-sm shrink-0 bg-slate-800" />
                        <div>
                          <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-extrabold text-3xs uppercase">${spec.subject}</span>
                            <h4 class="font-black text-sm text-slate-900">${candObj.name || spec.teacherName}</h4>
                            <span class="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-3xs font-bold">${candObj.rating || spec.rating || '4.9 ★'}</span>
                            ${isSubjFrozen ? `
                              <span class="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-3xs font-black">🔒 Faculty Frozen</span>
                            ` : `
                              <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-3xs font-extrabold">⚠️ Selection Pending Freeze</span>
                            `}
                          </div>
                          <p class="text-2xs text-slate-600 mt-0.5">${candObj.qualification || spec.qualification}</p>
                        </div>
                      </div>
                      <div class="text-left sm:text-right">
                        <span class="text-xs font-black text-indigo-950 block">${subjHours} Allotted Hrs (${spec.studentWeeklyHours || 3.5} hrs/wk) • ₹${subjFee.toLocaleString('en-IN')}</span>
                        <span class="text-3xs text-emerald-700 font-bold">🗓️ ${spec.assigned1on1Slot} (Zero Clash ✓)</span>
                      </div>
                    </div>

                    <!-- DUAL FACULTY SELECTION MODE SWITCHER (AI LEARNING DNA MATCH vs VERIFIED LIST) -->
                    <div class="flex items-center justify-between flex-wrap gap-2 p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="text-3xs font-extrabold uppercase tracking-wider text-slate-500 mr-1">Selection Mode:</span>
                        <button type="button" onclick="window.setFacultySelectionMode('ai_match', '${spec.subject}')"
                          class="px-2.5 py-1.5 rounded-lg text-3xs sm:text-2xs font-black cursor-pointer transition flex items-center gap-1 ${
                            activeMode === 'ai_match'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 text-indigo-950 hover:bg-indigo-50 border border-slate-200'
                          }">
                          <span>🤖 AI Learning DNA Match (Recommended)</span>
                        </button>
                        <button type="button" onclick="window.setFacultySelectionMode('manual_list', '${spec.subject}')"
                          class="px-2.5 py-1.5 rounded-lg text-3xs sm:text-2xs font-black cursor-pointer transition flex items-center gap-1 ${
                            activeMode === 'manual_list'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 text-indigo-950 hover:bg-indigo-50 border border-slate-200'
                          }">
                          <span>📋 Choose from Verified Faculty List (${(spec.candidates || []).length})</span>
                        </button>
                      </div>
                      <span class="text-3xs text-emerald-800 font-extrabold">✓ SIKO Faculty Tier Rate Capped</span>
                    </div>

                    <!-- OPTION A: 🤖 AI LEARNING DNA MATCH CARD -->
                    ${activeMode === 'ai_match' ? `
                      <div class="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white border-2 border-indigo-400 shadow-md space-y-3">
                        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div class="flex items-center gap-3.5">
                            <img src="${heroPhotoUrl}" 
                                 alt="${candObj.name}" 
                                 class="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-lg shrink-0 bg-slate-800" />
                            <div>
                              <div class="flex items-center gap-1.5 flex-wrap">
                                <span class="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-3xs uppercase tracking-wider">
                                  🧬 AI Learning DNA Top Match
                                </span>
                                <span class="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-3xs font-extrabold">
                                  98.6% Fit
                                </span>
                                <h4 class="font-black text-base text-white">${candObj.name}</h4>
                                <span class="text-amber-300 font-bold text-xs">${candObj.rating || '4.9 ★'}</span>
                              </div>
                              <p class="text-2xs text-slate-300 mt-0.5">${candObj.qualification}</p>
                              <div class="flex items-center gap-2 mt-1 text-3xs flex-wrap">
                                <span class="px-2 py-0.2 rounded bg-white/10 text-emerald-300 font-mono font-bold">
                                  ${candObj.tier || 'Master'} Tier Cap: ₹${((window.SIKO_FACULTY_TIER_POLICY && window.SIKO_FACULTY_TIER_POLICY[candObj.tier]?.oneOnOneHourlyCap) || 1200)}/hr
                                </span>
                                <span class="text-slate-300">Faculty Agreed: <strong class="text-white">₹${(candObj.agreedRate1on1 || 1200).toLocaleString('en-IN')}/hr</strong></span>
                              </div>
                            </div>
                          </div>

                          <div class="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                            <button type="button" onclick="window.openTeacherScreeningDemo('${spec.subject}', '${candObj.teacherId}')"
                              class="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition">
                              <span>▶ Watch Screening Demo</span>
                            </button>
                            <button type="button" onclick="window.freezeTeacherForSubject('${spec.subject}', '${candObj.teacherId}')"
                              class="px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition ${isSubjFrozen ? 'bg-emerald-500 text-slate-950' : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md'}">
                              <span>${isSubjFrozen ? '🔒 AI Matched Faculty Frozen ✓' : '✨ Accept AI Match & Freeze'}</span>
                            </button>
                          </div>
                        </div>

                        <!-- AI Learning DNA Pedagogical Alignment Badges -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10 text-2xs">
                          <div class="p-2.5 rounded-xl bg-white/5 border border-white/10">
                            <span class="text-amber-300 font-bold block text-3xs uppercase tracking-wider">🧠 Cognitive Pace Alignment</span>
                            <span class="text-slate-200 mt-0.5 block leading-relaxed">
                              Matches student's <strong>${curStyle || 'First-Principles Derivation'}</strong> pace with zero cognitive fatigue.
                            </span>
                          </div>
                          <div class="p-2.5 rounded-xl bg-white/5 border border-white/10">
                            <span class="text-emerald-300 font-bold block text-3xs uppercase tracking-wider">🎯 Derivation Rigor</span>
                            <span class="text-slate-200 mt-0.5 block leading-relaxed">
                              Step-by-step whiteboard proofs with physical intuition &amp; zero formula memorization.
                            </span>
                          </div>
                          <div class="p-2.5 rounded-xl bg-white/5 border border-white/10">
                            <span class="text-sky-300 font-bold block text-3xs uppercase tracking-wider">🏆 Exam Track Record</span>
                            <span class="text-slate-200 mt-0.5 block leading-relaxed">
                              Screening score <strong>98/100</strong> • 94%+ students qualifying ${examSpec.code || 'JEE/NEET'}.
                            </span>
                          </div>
                        </div>
                      </div>
                    ` : `
                      <!-- OPTION B: 📋 CHOOSE FROM VERIFIED FACULTY DIRECTORY -->
                      <div>
                        <span class="text-3xs font-extrabold uppercase tracking-wider text-slate-500 block mb-1.5">Browse All Verified ${spec.subject} Candidates, Watch Screening Demos &amp; Freeze:</span>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          ${(spec.candidates || [spec]).map(cand => {
                            const isCurrentCand = cand.teacherId === spec.teacherId;
                            const candAgreedRate = cand.agreedRate1on1 || (cand.tier === 'Master' ? 1200 : 900);
                            const tierCap = (window.SIKO_FACULTY_TIER_POLICY && window.SIKO_FACULTY_TIER_POLICY[cand.tier]?.oneOnOneHourlyCap) || 1200;
                            const candPhoto = cand.avatar || `assets/teachers/teacher_${spec.subject.toLowerCase()}_indian.png`;
                            return `
                              <div class="p-3 rounded-xl border-2 ${isCurrentCand ? 'border-indigo-600 bg-white shadow-2xs' : 'border-slate-200 bg-white/80 hover:border-indigo-300'} flex flex-col justify-between gap-2 transition">
                                <div class="flex items-center justify-between gap-2">
                                  <div class="flex items-center gap-2.5 min-w-0">
                                    <img src="${candPhoto}" alt="${cand.name}" class="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0 bg-slate-800" />
                                    <div class="min-w-0">
                                      <div class="font-extrabold text-xs text-slate-900 truncate">${cand.name} <span class="text-3xs text-amber-600 font-bold">${cand.rating || '4.9 ★'}</span></div>
                                      <div class="text-3xs text-slate-500 truncate">${cand.qualification}</div>
                                      <div class="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                        <span class="px-2 py-0.2 rounded-full text-3xs font-black bg-indigo-100 text-indigo-900">${cand.tier || 'Master'} (Cap: ₹${tierCap}/hr)</span>
                                        <span class="text-3xs text-indigo-700 font-bold">Agreed: ₹${candAgreedRate.toLocaleString('en-IN')}/hr</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div class="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-100">
                                  <button type="button" onclick="window.openTeacherScreeningDemo('${spec.subject}', '${cand.teacherId}')"
                                    class="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-3xs font-extrabold flex items-center gap-1 cursor-pointer transition">
                                    <span>▶ Watch Demo</span>
                                  </button>
                                  
                                  <button type="button" onclick="window.freezeTeacherForSubject('${spec.subject}', '${cand.teacherId}')"
                                    class="px-3 py-1 rounded-lg text-3xs font-black flex items-center gap-1 cursor-pointer transition ${isCurrentCand && isSubjFrozen ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-emerald-600'}">
                                    <span>${isCurrentCand && isSubjFrozen ? '🔒 Frozen ✓' : '🔒 Freeze Faculty'}</span>
                                  </button>
                                </div>
                              </div>
                            `;
                          }).join('')}
                        </div>
                      </div>
                    `}

                  <!-- Post-Freeze Dynamic Hourly Tuition Card (Zero Money Out of SIKO's Pocket Guarantee) -->
                  ${isSubjFrozen ? `
                    <div class="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                      <div class="flex items-center justify-between flex-wrap gap-1">
                        <span class="text-3xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                          <span>🔒 Official Hourly Tuition Fee Generated for ${spec.subject} (${candObj.name})</span>
                        </span>
                        <div class="flex items-center gap-2">
                          <span class="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-3xs font-black">Verified &amp; Locked ✓</span>
                          <button type="button" onclick="window.unfreezeTeacherForSubject('${spec.subject}')" class="text-3xs text-indigo-700 hover:text-indigo-900 font-bold underline cursor-pointer">
                            Change / Unfreeze
                          </button>
                        </div>
                      </div>
                      
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-2xs pt-1">
                        <div>
                          <span class="text-slate-500 block text-3xs">Catalogue Rate (Gross):</span>
                          <span class="text-slate-400 line-through font-bold text-xs">₹${rc.activeBaseRatePerHr}/hr</span>
                        </div>
                        <div>
                          <span class="text-slate-500 block text-3xs">Bundle Discount (${quote.discountPct}%):</span>
                          <span class="text-emerald-700 font-black text-xs">-₹${rc.activeBaseRatePerHr - rc.activeEffectiveRatePerHr}/hr</span>
                        </div>
                        <div>
                          <span class="text-slate-500 block text-3xs">Net Hourly Tuition:</span>
                          <span class="text-slate-900 font-black text-xs">₹${rc.activeEffectiveRatePerHr}/hr</span>
                        </div>
                        <div>
                          <span class="text-slate-500 block text-3xs">Course Tuition (${subjHours}h):</span>
                          <span class="text-indigo-950 font-black text-xs">₹${subjFee.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div class="pt-2 border-t border-emerald-200/60 text-3xs text-emerald-900 font-bold flex items-center justify-between flex-wrap gap-2">
                        <span>👨‍🏫 Vetted Specialist: ${candObj.name}</span>
                        <span>⏱️ ${subjHours} Hours Dedicated Tuition</span>
                        <span class="text-emerald-700 font-extrabold">✓ Dedicated Schedule Locked</span>
                      </div>
                    </div>
                  ` : `
                    <div class="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-2xs text-amber-900 flex items-center justify-between flex-wrap gap-2">
                      <div class="flex items-center gap-2">
                        <span class="text-base">⚠️</span>
                        <div>
                          <strong class="font-bold">Pending Faculty Freeze for ${spec.subject}:</strong>
                          <span class="block text-3xs text-amber-800">Watch the screening demo lectures above and click "Freeze Faculty" to calculate and lock your final hourly tuition fee.</span>
                        </div>
                      </div>
                      <button type="button" onclick="window.openTeacherScreeningDemo('${spec.subject}', '${spec.teacherId}')"
                        class="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-3xs cursor-pointer shadow-2xs">
                        ▶ Watch Demo First
                      </button>
                    </div>
                  `}

                  <!-- Time Slot Picker -->
                  <div>
                    <span class="text-3xs font-extrabold uppercase tracking-wider text-slate-500 block mb-1.5">Select Non-Clashing Weekly Time Slot for ${spec.subject}:</span>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      ${(spec.availableSlots || [spec.assigned1on1Slot]).map(slotOpt => {
                        const isSlotSel = slotOpt === spec.assigned1on1Slot;
                        return `
                          <div onclick="window.selectBookingSlotForSubject('${spec.subject}', '${slotOpt}')"
                               class="p-2 rounded-xl border ${isSlotSel ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold shadow-2xs' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'} cursor-pointer text-2xs flex items-center justify-between gap-1 transition">
                            <span class="truncate">🗓️ ${slotOpt}</span>
                            <span class="text-3xs font-extrabold shrink-0 ${isSlotSel ? 'text-emerald-700' : 'text-slate-400'}">${isSlotSel ? 'Synced ✓' : 'Pick'}</span>
                          </div>
                        `;
                      }).join('')}
                    </div>
                </div>
              `;
            }).join('');
          })()}
          </div>
        `}

        <!-- Synced Weekly Mon–Sun Parallel Timetable Grid (All Selected Subjects Every Week + Zero Clash + Sunday Test) -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="text-xs font-extrabold text-slate-900">🗓️ Conflict-Free Weekly Parallel Timetable (Mon–Sat All ${selectedSubjectsList.length} Subjects + Sun Weekly Test)</span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-3xs">✓ Zero Time Clash Across ${selectedSubjectsList.join(' + ')}</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            ${weekDays.map((dayName, dIdx) => {
              const dayItems = buildDayScheduleItems(dayName, dIdx);
              const isSunday = dayName === 'Sun';
              return `
                <div class="p-2.5 rounded-xl border ${isSunday ? 'border-amber-300 bg-amber-50/70' : dayItems.length > 0 ? 'border-indigo-200 bg-white' : 'border-slate-200 bg-slate-100/60'} flex flex-col justify-between min-h-[104px]">
                  <div class="flex items-center justify-between border-b border-slate-100 pb-1 mb-1">
                    <span class="font-black text-xs ${isSunday ? 'text-amber-900' : 'text-slate-900'}">${dayName}</span>
                    <span class="text-3xs font-bold ${isSunday ? 'text-amber-800' : dayItems.length > 0 ? 'text-emerald-700' : 'text-slate-400'}">${isSunday ? 'Weekly Test' : `${dayItems.length} Class${dayItems.length > 1 ? 'es' : ''}`}</span>
                  </div>
                  ${dayItems.map(di => `
                    <div class="p-1.5 rounded-lg ${di.isWeeklyTest ? 'bg-amber-100/80 border border-amber-300' : 'bg-indigo-50/50 border border-indigo-100'} mb-1">
                      <div class="font-extrabold text-3xs ${di.isWeeklyTest ? 'text-amber-950' : 'text-indigo-900'} truncate">${di.subject}</div>
                      <div class="text-3xs text-slate-600 truncate">${di.teacherName}</div>
                      <div class="text-3xs ${di.isWeeklyTest ? 'text-amber-800' : 'text-emerald-700'} font-bold truncate">${di.timeSlot}</div>
                    </div>
                  `).join('')}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- COMPLETE START-TO-END COURSE SCHEDULE FOR ALL SELECTED SUBJECTS (Not Just 1 Subject!) -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white border-2 border-indigo-200/90 space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
            <div>
              <span class="text-3xs font-extrabold uppercase tracking-wider text-indigo-700 block">
                Complete Start-to-End Multi-Subject Course Schedule (${countdownPlan.joiningDateFormatted} &rarr; ${countdownPlan.targetExamDateFormatted})
              </span>
              <h4 class="text-sm sm:text-base font-black text-slate-900">
                All ${selectedSubjectsList.length} Selected Subjects (${selectedSubjectsList.join(' + ')}) — Complete Course Faculty &amp; Syllabus Schedule (${quote.totalHours} Hrs)
              </h4>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-3xs">
              ✓ Portion Done: ${countdownPlan.syllabusCompletionDateFormatted} (1M Before Exam)
            </span>
          </div>

          <!-- 1. Subject-Wise Complete Course Master Schedule Table (All Selected Subjects Side-by-Side) -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-2xs">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50 text-slate-600 font-extrabold uppercase text-3xs">
                  <th class="py-2 px-2.5">Subject</th>
                  <th class="py-2 px-2.5">Dedicated Specialist Faculty</th>
                  <th class="py-2 px-2.5">Non-Clashing Weekly Schedule</th>
                  <th class="py-2 px-2.5">Course Hours</th>
                  <th class="py-2 px-2.5">Start &rarr; Portion End Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200/70">
                ${specialistAllocations.map(sa => {
                  const rc = (quote.subjectRateChart && quote.subjectRateChart[sa.subject]) || null;
                  const li = (quote.lineItems || []).find(item => item.subject === sa.subject) || null;
                  const subjHours = (li && li.totalHours) || (rc && rc.allottedHours) || sa.studentCourseHours || 70;
                  return `
                    <tr class="bg-white hover:bg-indigo-50/30">
                      <td class="py-2.5 px-2.5 font-black text-indigo-950">
                        <span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 text-3xs font-extrabold">${sa.subject}</span>
                      </td>
                      <td class="py-2.5 px-2.5 font-extrabold text-slate-900">👩‍🏫 ${sa.teacherName} <span class="text-3xs text-slate-500 font-normal block">${sa.qualification || ''}</span></td>
                      <td class="py-2.5 px-2.5 font-bold text-emerald-800">🗓️ ${sa.assigned1on1Slot}</td>
                      <td class="py-2.5 px-2.5 font-extrabold text-slate-900">${subjHours} Hrs (${sa.studentWeeklyHours || 3.5}h/wk)</td>
                      <td class="py-2.5 px-2.5 text-3xs font-bold text-slate-700">${countdownPlan.joiningDateFormatted} &rarr; ${countdownPlan.syllabusCompletionDateFormatted}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- 2. Month-by-Month All-Subject Breakdown Cards (Every Selected Subject Shown in Every Month!) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${(countdownPlan.monthRoadmap || []).map(mr => {
              const perSubjRows = Array.isArray(mr.perSubjectSchedules) && mr.perSubjectSchedules.length > 0
                ? mr.perSubjectSchedules
                : specialistAllocations.map(sa => ({
                    subject: sa.subject,
                    teacherName: sa.teacherName,
                    assignedSlot: sa.assigned1on1Slot,
                    monthlyHours: Math.round((sa.studentCourseHours || 60) / Math.max(1, monthsLeft)),
                    topicTitle: mr.isPreExamAdaptiveWindow ? `Full-Syllabus ${sa.subject} Mock Tests & Revision` : `${sa.subject} Core Syllabus & PYQ Practice`
                  }));
              return `
                <div class="p-3 rounded-xl border ${mr.isPreExamAdaptiveWindow ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200 bg-slate-50/70'} text-2xs space-y-2">
                  <div class="flex items-center justify-between gap-1 pb-1.5 border-b border-slate-200/70">
                    <strong class="text-slate-900 text-xs">${mr.monthTitle} <span class="text-3xs text-slate-500 font-semibold">(${mr.dateWindow || ''})</span></strong>
                    <span class="px-1.5 py-0.5 rounded text-3xs font-extrabold ${mr.isPreExamAdaptiveWindow ? 'bg-amber-200 text-amber-950' : 'bg-indigo-100 text-indigo-900'}">${mr.lectureRange}</span>
                  </div>
                  <div class="space-y-1.5">
                    ${perSubjRows.map(psr => `
                      <div class="p-1.5 rounded-lg bg-white border border-slate-200/80 flex flex-col gap-0.5">
                        <div class="flex items-center justify-between gap-1">
                          <span class="font-extrabold text-3xs text-indigo-900">📘 ${psr.subject} • ${psr.teacherName}</span>
                          <span class="text-3xs font-bold text-emerald-700">${psr.monthlyHours}h</span>
                        </div>
                        <div class="text-3xs text-slate-700 font-semibold">${psr.topicTitle}</div>
                        <div class="text-3xs text-slate-500">🗓️ ${psr.assignedSlot}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button type="button" class="btn btn-outline" onclick="window.setBookingStep(3)">&larr; Back to Learning DNA</button>
          <button type="button" onclick="window.setBookingStep(5)"
            class="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm cursor-pointer border-0 shadow-sm">
            Continue to Step 5: Digital Refund Policy Signing &rarr;
          </button>
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 5: PRE-PAYMENT DIGITAL REFUND POLICY SIGNING & PROTECTED CHECKOUT
  // ═══════════════════════════════════════════════════════════════════════════
  if (step === 5) {
    const selBatchStep5 = (journeyType === 'smart-learning' && bf.selectedBatch) ? bf.selectedBatch : null;
    return `
      <div class="space-y-4">
        ${renderDigitalRefundPolicySigningBlock(quote, studentName, selBatchStep5)}
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 6: ENROLMENT & LEGAL CONTRACT CONFIRMATION (SUCCESS ASSURED PLAN)
  // ═══════════════════════════════════════════════════════════════════════════
  const acc = AppState.bookingData?.refundAcceptance || {
    eventId: 'REF-ACCEPT-9021',
    policyVersion: '1.0 (Production — Final)',
    policyHash: 'sha256-siko-refund-v1.0-e8b94a2b',
    signatoryName: (AppState.currentUser && AppState.currentUser.name) || 'Enrolled Student',
    signatoryRole: 'Parent / Legal Guardian',
    acceptedAtIST: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    orderId: 'ORD-729401'
  };

  const selBatchFinal = (journeyType === 'smart-learning' && bf.selectedBatch) ? bf.selectedBatch : null;

  return `
    <div class="text-center py-6">
      <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-2xl mx-auto mb-4">
        ${Icons.check}
      </div>
      <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
        ${selBatchFinal ? `1-to-Many Course (${selBatchFinal.productId || selBatchFinal.id}) Enrolled!` : isMultiSubject ? 'Multi-Subject Plan Enrolled & Timetable Synced!' : `${selectedSubjectsList[0]} Plan Enrolled & Timetable Synced!`}
      </h2>
      <p class="text-sm text-slate-600 max-w-lg mx-auto mb-6">
        Congratulations! You are officially enrolled in <strong>${selectedSubjectsList.join(' + ')}</strong> (${quote.totalHours} Hrs • ₹${quote.totalPayableByParent.toLocaleString('en-IN')}) under the <strong>Success Assured Plan</strong>.
      </p>

      <div class="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 max-w-lg mx-auto text-left mb-6 text-xs space-y-2">
        <div class="flex items-center justify-between border-b border-indigo-200 pb-2 mb-2">
          <span class="font-extrabold text-indigo-950 text-sm">SIKO Digital Contract &amp; Start-to-End Schedule Certificate</span>
          <span class="badge badge-success text-3xs font-mono">ENROLLED &amp; SIGNED</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Order Reference:</span>
          <span class="font-mono font-bold text-indigo-900">${acc.orderId}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Digitally Signed By:</span>
          <span class="font-bold text-slate-800">${acc.signatoryName} (${acc.signatoryRole})</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Parent / Guardian Contact:</span>
          <span class="font-bold text-slate-800">${(AppState.bookingData && AppState.bookingData.parentName) || acc.signatoryName} • ${(AppState.bookingData && AppState.bookingData.parentPhone) || (AppState.studentOnboarding && AppState.studentOnboarding.parentPhone) || '+91 98201 44892'}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Enrolled Subject(s) &amp; Final Fee:</span>
          <span class="font-bold text-indigo-900">${selectedSubjectsList.join(' + ')} (${quote.totalHours} Allotted Hrs • ₹${quote.totalPayableByParent.toLocaleString('en-IN')})</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Start Date &rarr; Portion End (1M Before Exam):</span>
          <span class="font-bold text-emerald-700">${countdownPlan.joiningDateFormatted} &rarr; ${countdownPlan.syllabusCompletionDateFormatted}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Target Exam Date (After 30-Day Mock Window):</span>
          <span class="font-bold text-amber-800">${countdownPlan.targetExamDateFormatted} (${countdownPlan.weeklyHoursRequired} Faculty Hrs/Wk)</span>
        </div>
        <div class="pt-1 border-t border-indigo-100">
          <span class="text-slate-500 block mb-1">Synced Subject-Wise Faculty &amp; Timetable:</span>
          ${specialistAllocations.map(sa => `
            <div class="flex justify-between text-2xs py-0.5">
              <span class="font-bold text-slate-800">${sa.subject} (${sa.studentCourseHours}h) — ${sa.teacherName}:</span>
              <span class="font-bold text-indigo-900">${sa.assigned1on1Slot}</span>
            </div>
          `).join('')}
        </div>
        <div class="flex justify-between pt-1 border-t border-indigo-100">
          <span class="text-slate-500">Digital Signature Timestamp:</span>
          <span class="font-mono text-2xs text-emerald-700 font-bold">${acc.acceptedAtIST}</span>
        </div>
      </div>

      <div class="flex items-center justify-center gap-3 flex-wrap">
        <button class="btn btn-outline" onclick="window.openAiQuestionPaperPortal('topic_ai')">
          🤖 Open AI Paper &amp; Topic Practice Portal ↗
        </button>
        <button class="btn btn-outline" onclick="window.enterLiveClassroom('${selBatchFinal ? selBatchFinal.id : 'CB10SNUM'}')">
          🎥 Enter Live Classroom
        </button>
        <button class="btn btn-primary font-bold" onclick="window.switchRole('student')">
          Go to Student Portal ${Icons.arrowRight}
        </button>
      </div>
    </div>
  `;
}

window.setFacultySelectionMode = function(mode, subject = null) {
  if (!AppState.bookingFlow) AppState.bookingFlow = {};
  if (!AppState.bookingFlow.facultySelectionModes) AppState.bookingFlow.facultySelectionModes = {};
  if (subject) {
    AppState.bookingFlow.facultySelectionModes[subject] = mode;
  }
  AppState.bookingFlow.facultySelectionMode = mode;
  if (typeof window.showToast === 'function') {
    const label = mode === 'ai_match' ? '🤖 Switched to AI Learning DNA Match' : '📋 Switched to Verified Faculty Directory';
    window.showToast(label, 'info');
  }
  if (typeof window.renderApp === 'function') window.renderApp();
  else if (typeof notifyStateChange === 'function') notifyStateChange();
};

