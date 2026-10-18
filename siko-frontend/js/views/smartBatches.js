/**
 * SIKO SMART LEARNING BATCH DISCOVERY VIEW (1-TO-MANY SMART CIRCLE)
 * "SIKO EXAM SPRINT 2026-27 — CHAPTERWISE STUDENT-NEED BASED PRODUCT PLAN"
 * Predefined planned-lecture Smart Circle cohorts with assigned Indian faculty, strict 30-student crowd limitation,
 * multi-dimensional filtering (Board, Class, Subject, Product Type, Need), and instant enrollment.
 */

import { AppState, formatPrice } from '../state.js';
import { Icons } from '../components.js';

export function renderSmartBatches() {
  const batches = (AppState.batches && AppState.batches.length > 0) ? AppState.batches : [];
  const isGuest = AppState.currentRole === 'guest' || !AppState.isLoggedIn;

  return `
    <div class="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      <!-- Public Navigation Header for Guests -->
      ${isGuest ? `
        <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 mb-8 shadow-xs">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="#" onclick="window.navigateView('public-home')" class="flex items-center gap-2.5 text-decoration-none">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <span class="text-white font-black text-lg">S</span>
              </div>
              <span class="text-xl font-extrabold text-blue-950 tracking-tight">SIKO</span>
            </a>
            
            <div class="flex items-center gap-2 sm:gap-3">
              <button onclick="window.navigateView('public-home')" class="btn btn-outline btn-sm">
                ← Back to Home
              </button>
              <button onclick="window.navigateView('teacher-marketplace')" class="btn btn-outline btn-sm hidden sm:inline-flex">
                1:1 Teachers →
              </button>
              <button onclick="window.startStudentOnboarding()" class="btn btn-primary btn-sm">
                Start Learning →
              </button>
            </div>
          </div>
        </header>
      ` : ''}

      <div class="container max-w-7xl mx-auto px-4 sm:px-6">
        
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-xs text-slate-500 mb-6 pt-2">
          <a href="#" onclick="window.navigateView('public-home')" class="hover:text-blue-600">Home</a>
          <span>/</span>
          <span class="text-slate-800 font-bold">Smart Learning Batches (1-to-Many Smart Circles)</span>
        </div>

        <!-- Academic Plan Banner -->
        <div class="max-w-4xl mb-8">
          <span class="badge badge-warning mb-2.5 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300">
            ${Icons.sparkles} 1-TO-MANY SMART CIRCLE • PLANNED LECTURES &amp; ASSIGNED TEACHERS
          </span>
          <h1 class="text-3xl sm:text-4xl font-black text-slate-950 mb-3 tracking-tight">
            Planned Smart Circle Batches with Fixed Faculty &amp; Syllabus
          </h1>
          <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
            Pre-planned chapterwise lecture tracks with fixed senior faculty, defined subjects, and transparent pricing that you can buy directly. Every Smart Batch has a <strong>strict crowd limitation of 30 students per batch</strong> for genuine live teacher attention.
          </p>
        </div>

        <!-- Strict Cohort Cap & Escrow Guarantee Banner -->
        <div class="card p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center font-black text-xl flex-shrink-0">
              30
            </div>
            <div>
              <h4 class="text-sm sm:text-base font-bold text-white mb-0.5">Strict 30-Student Crowd Limitation • Planned Lectures &amp; Assigned Teacher</h4>
              <p class="text-xs text-blue-200">Every Smart Circle is capped at 30 students per batch so every student gets live audio, whiteboard interaction, and personal doubt resolution.</p>
            </div>
          </div>
          <div class="flex items-center gap-2 text-xs bg-white/10 px-3.5 py-2 rounded-xl border border-white/15 whitespace-nowrap">
            <span class="text-emerald-400 font-bold">✓</span> Buy &amp; Enroll Directly • Escrow Protected
          </div>
        </div>

        <!-- PRE-DECIDED 1-TO-MANY COURSE-WISE PACKAGES BY AVAILABLE TIME SLOT (COMPLETE SYLLABUS + INTEGRATED TESTING) -->
        <div class="card p-5 sm:p-6 bg-white border-2 border-indigo-200 rounded-2xl mb-8 shadow-xs space-y-4">
          <div class="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-3xs uppercase tracking-wider">
                🎯 Pre-Decided 1:Many Full-Syllabus + Testing Courses
              </span>
              <h3 class="text-base sm:text-lg font-black text-slate-900 mt-1">
                Pre-Decided Course-Wise 1-to-Many Cohorts by Available Time Slot (Complete Portion + Weekly Testing)
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                Pick your pre-decided course and available time slot below — SIKO schedules 100% of your syllabus lectures plus weekly full-pattern testing under the <strong>Success Assured Plan</strong>.
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" onclick="window.setBookingStreamFilter('PCM')" class="px-2.5 py-1 rounded-lg text-2xs font-extrabold border cursor-pointer ${(AppState.bookingFlow?.streamFilter || 'PCM') === 'PCM' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300'}">🎯 JEE (PCM Only)</button>
              <button type="button" onclick="window.setBookingStreamFilter('PCB')" class="px-2.5 py-1 rounded-lg text-2xs font-extrabold border cursor-pointer ${(AppState.bookingFlow?.streamFilter || 'PCM') === 'PCB' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300'}">🩺 NEET (PCB Only)</button>
              <button type="button" onclick="window.setBookingStreamFilter('PCMB')" class="px-2.5 py-1 rounded-lg text-2xs font-extrabold border cursor-pointer ${(AppState.bookingFlow?.streamFilter || 'PCM') === 'PCMB' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300'}">🏫 All Classes (9th–12th) &amp; Boards</button>
              <span class="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-extrabold text-2xs">
                ✓ Dedicated Subject-Wise Specialists + Weekly Testing
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            ${(typeof window.getFilteredPredecidedOneToManyCourses === 'function' ? window.getFilteredPredecidedOneToManyCourses() : (window.PREDECIDED_ONE_TO_MANY_COURSES || [])).map(course => {
              const gstFinalFee = course.priceWithGst || Math.round(course.price * 1.18);
              return `
              <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:border-indigo-400 transition flex flex-col justify-between gap-3">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                    <span class="px-2 py-0.5 rounded bg-indigo-600 text-white font-extrabold text-3xs">${course.examTrack}</span>
                    <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-3xs">${course.discountBadge}</span>
                  </div>
                  <h4 class="font-black text-sm text-slate-900 leading-snug">${course.title}</h4>
                  <div class="text-2xs text-slate-600 mt-1">
                    <strong>${course.teachingHours} Total Hrs:</strong> ${course.lectureHours}h Live Lectures (All Subjects Run Every Week) + ${course.testingAndDoubtHours}h Integrated Sunday Testing
                  </div>

                  <!-- Subject-Wise Specialist Faculty Roster -->
                  <div class="mt-2 p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-1">
                    <div class="text-3xs font-extrabold uppercase tracking-wider text-indigo-900">👩‍🏫 Dedicated Subject-Wise Specialist Faculty (Never 1 Teacher for All Subjects):</div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                      ${(course.subjectTeachersList || []).map(st => `
                        <div class="p-1.5 rounded-lg bg-white border border-indigo-100 text-3xs">
                          <div class="font-black text-indigo-800">${st.subject}</div>
                          <div class="font-bold text-slate-900">${st.teacherName}</div>
                          <div class="text-slate-500">${st.qualification || 'Subject Specialist'}</div>
                        </div>
                      `).join('')}
                    </div>
                  </div>

                  <div class="text-2xs text-indigo-800 font-semibold mt-1.5">
                    🧪 ${course.testingBlueprint}
                  </div>

                  <div class="mt-3 pt-2.5 border-t border-slate-200 space-y-1.5">
                    <span class="text-3xs font-extrabold uppercase tracking-wider text-slate-500 block">Choose Available Weekly Parallel Time Slot to Enrol:</span>
                    ${(course.availableSlots || []).map((slotObj, sIdx) => `
                      <div onclick="window.selectPredecidedOneToManyCourse('${course.id}', ${sIdx}, true)"
                           class="p-2 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 cursor-pointer text-2xs flex items-center justify-between gap-2 transition">
                        <div class="min-w-0">
                          <div class="font-extrabold text-slate-900 truncate">${slotObj.label}</div>
                          <div class="text-3xs text-indigo-700 font-semibold truncate">🗓️ ${slotObj.schedule}</div>
                        </div>
                        <span class="px-2 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-3xs shrink-0">
                          Enrol Slot &rarr;
                        </span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div class="pt-2.5 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span class="text-3xs text-slate-400 line-through block">Base: ₹${course.price.toLocaleString('en-IN')} (MRP ₹${course.originalPrice.toLocaleString('en-IN')})</span>
                    <span class="text-base font-black text-slate-900">₹${gstFinalFee.toLocaleString('en-IN')} <span class="text-3xs font-extrabold text-emerald-700">Incl. 18% GST (Default)</span></span>
                  </div>
                  <button type="button" onclick="window.selectPredecidedOneToManyCourse('${course.id}', 0, true)"
                    class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs cursor-pointer border-0">
                    Select Course &rarr;
                  </button>
                </div>
              </div>
            `;
            }).join('')}
          </div>
        </div>

        <!-- Multi-Filter Search Bar -->
        <div class="card p-5 sm:p-6 border border-slate-200 shadow-xs rounded-2xl mb-8 bg-white">
          <!-- Text Search Query -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
            <div class="relative flex-1">
              <span class="absolute left-3.5 top-3 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search by topic, chapter, product code (e.g. Electricity, Numericals, CB10SNUM, Rotational Dynamics)..." 
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none text-sm text-slate-900 bg-white"
                id="batchSearchInput"
                oninput="window.filterSmartBatches()"
              />
            </div>
            <button class="btn btn-primary px-6" onclick="window.filterSmartBatches()">
              Search Batches
            </button>
          </div>

          <!-- Dropdowns Filter Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
            <div>
              <label class="block text-slate-600 font-bold mb-1">Board / Track</label>
              <select class="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium" id="filterBatchBoard" onchange="window.filterSmartBatches()">
                <option value="">All Boards & Tracks</option>
                <option value="CBSE">CBSE</option>
                <option value="Maharashtra">Maharashtra State Board</option>
                <option value="ICSE">ICSE</option>
                <option value="JEE">JEE Main / Advanced</option>
                <option value="NEET">NEET</option>
                <option value="MHT-CET">MHT-CET</option>
              </select>
            </div>

            <div>
              <label class="block text-slate-600 font-bold mb-1">Class / Grade</label>
              <select class="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium" id="filterBatchGrade" onchange="window.filterSmartBatches()">
                <option value="">All Classes</option>
                <option value="8-9">Class 8–9 (Exam Rescue)</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
                <option value="11-12">Class 11–12 (CET)</option>
              </select>
            </div>

            <div>
              <label class="block text-slate-600 font-bold mb-1">Subject</label>
              <select class="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium" id="filterBatchSubject" onchange="window.filterSmartBatches()">
                <option value="">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science (PCB/PCM)</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            <div>
              <label class="block text-slate-600 font-bold mb-1">Product Type</label>
              <select class="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium" id="filterBatchType" onchange="window.filterSmartBatches()">
                <option value="">All Product Types</option>
                <option value="Micro Sprint">Micro Sprint</option>
                <option value="Exam Sprint">Exam Sprint</option>
                <option value="Recovery Sprint">Recovery Sprint (Backlog)</option>
                <option value="Final Sprint">Final Sprint (Last 30)</option>
                <option value="Entrance Sprint">Entrance Sprint</option>
                <option value="Exam Rescue">Exam Rescue (Gr 8-9)</option>
              </select>
            </div>

            <div class="col-span-2 sm:col-span-1">
              <label class="block text-slate-600 font-bold mb-1">Student Need</label>
              <select class="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium" id="filterBatchNeed" onchange="window.filterSmartBatches()">
                <option value="">All Student Needs</option>
                <option value="Numericals">Numericals</option>
                <option value="Reactions">Reactions & Conversions</option>
                <option value="Problem solving">Problem Solving</option>
                <option value="PYQs">PYQs & Pattern</option>
                <option value="Backlog">Backlog Recovery</option>
                <option value="Diagrams">Diagrams & Case Studies</option>
                <option value="Speed">Speed & Mocks</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Counter Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="text-sm font-bold text-slate-700" id="batchCountLabel">
            Showing ${batches.length} SIKO Exam Sprint Cohorts
          </div>
          <div class="text-xs text-slate-500">
            *Fees held in milestone escrow until academic satisfaction.
          </div>
        </div>

        <!-- Batches Responsive Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="smartBatchesGridContainer">
          ${batches.map(batch => renderSingleBatchCard(batch)).join('')}
        </div>

      </div>
    </div>
  `;
}

export function renderSingleBatchCard(batch) {
  const priceFormatted = typeof formatPrice === 'function' ? formatPrice(batch.price) : ('₹' + batch.price);
  const remaining = Math.max(0, (batch.seatsTotal || 30) - (batch.seatsOccupied || 0));
  const isFull = batch.isFull || remaining <= 0;
  const occupancyPercent = Math.min(100, Math.round(((batch.seatsOccupied || 0) / (batch.seatsTotal || 30)) * 100));

  const teacherName = batch.teacher || batch.teacher_name || 'Dedicated Master Faculty';
  const teacherTitle = batch.teacherTitle || batch.teacher_title || 'Senior Faculty';
  const teacherAvatar = batch.teacherAvatar || batch.teacher_avatar || 'assets/teachers/teacher_physics_indian.png';
  const teacherTier = batch.teacherTier || 'Master';
  const teacherRating = batch.teacherRating || 4.9;

  const productType = batch.productType || 'Micro Sprint';
  const priority = batch.priority || 'P0';
  const studentNeed = batch.studentNeed || 'Conceptual Practice';
  const chapter = batch.chapter || batch.topic || batch.subject;
  const hours = batch.teachingHours || 10;
  const schedule = batch.schedule || 'Mon, Wed, Fri 7:00 PM IST';
  const startDate = batch.startDate || '15-Nov-2026';
  const board = batch.board || 'CBSE';
  const grade = batch.grade || '10';
  const productId = batch.productId || batch.batchRef || batch.id;

  return `
    <div class="batch-card bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between" id="batch-${batch.id}">
      <div>
        <!-- Top Badges Row -->
        <div class="flex items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="px-2 py-0.5 rounded text-2xs font-extrabold bg-blue-100 text-blue-900 border border-blue-200">${productId}</span>
            <span class="px-2 py-0.5 rounded text-2xs font-extrabold bg-amber-100 text-amber-900 border border-amber-200">${priority}</span>
            <span class="badge badge-primary text-2xs">${board} Class ${grade}</span>
          </div>
          ${isFull 
            ? `<span class="badge badge-danger text-2xs font-bold whitespace-nowrap">BATCH FULL (30/30)</span>` 
            : `<span class="badge badge-warning text-2xs font-bold whitespace-nowrap">${remaining} of 30 seats left</span>`
          }
        </div>

        <!-- Product Title & Student Need -->
        <h3 class="text-base font-black text-slate-950 mb-1 leading-snug">${batch.title}</h3>
        <div class="text-xs text-blue-700 font-bold mb-2 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          <span>Focus: ${studentNeed}</span>
        </div>
        <p class="text-xs text-slate-600 mb-4 line-clamp-2">
          <strong>Planned Lectures:</strong> ${chapter}
        </p>

        <!-- Assigned Fixed Indian Faculty -->
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4 flex items-center gap-3">
          <img src="${teacherAvatar}" alt="${teacherName}" class="w-11 h-11 rounded-xl object-cover border border-slate-300 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              <h5 class="text-xs font-bold text-slate-900 truncate">${teacherName}</h5>
              <span class="text-2xs text-amber-600 font-bold flex items-center">★ ${teacherRating}</span>
            </div>
            <p class="text-2xs text-slate-500 truncate">${teacherTitle}</p>
            <span class="text-2xs text-blue-600 font-medium">${teacherTier} Teacher</span>
          </div>
        </div>

        <!-- Fixed Faculty Schedule Details -->
        <div class="space-y-1.5 text-xs text-slate-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100 mb-4">
          <div class="flex items-center gap-2">
            <span class="text-blue-600">${Icons.calendar}</span>
            <span class="font-semibold truncate">${schedule}</span>
          </div>
          <div class="flex items-center justify-between text-2xs text-slate-600 pt-1 border-t border-blue-100">
            <span><strong>Batch Starts:</strong> ${startDate}</span>
            <span class="font-bold text-blue-900">${hours} Planned Lecture Hours</span>
          </div>
        </div>

        <!-- Cohort Capacity Bar -->
        <div class="mb-4">
          <div class="flex justify-between items-center text-xs font-semibold mb-1">
            <span class="text-slate-600">Smart Circle Crowd Cap:</span>
            <span class="${isFull ? 'text-red-600 font-bold' : 'text-blue-700 font-bold'}">
              ${batch.seatsOccupied || 0} / ${batch.seatsTotal || 30} Students (Max 30)
            </span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div class="h-full rounded-full transition-all ${isFull ? 'bg-red-500' : 'bg-blue-600'}" style="width: ${occupancyPercent}%;"></div>
          </div>
        </div>
      </div>

      <!-- Footer & Action -->
      <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 mt-2">
        <div>
          <div class="text-lg font-black text-slate-950">${priceFormatted}</div>
          <div class="text-2xs text-slate-500">Planned Batch • Escrow Protected</div>
        </div>

        <div class="flex items-center gap-1.5">
          <button class="btn btn-outline btn-xs text-blue-700 border-blue-300 hover:bg-blue-50 whitespace-nowrap" onclick="window.enterLiveClassroom('${batch.id}')" title="Enter Live Jitsi Lecture for this batch">
            🎥 Live Class
          </button>
          ${isFull ? `
            <button class="btn btn-outline btn-sm whitespace-nowrap text-xs border-amber-500 text-amber-700 hover:bg-amber-50" onclick="window.joinBatchWaitlist('${batch.id}')">
              Join Waitlist
            </button>
          ` : `
            <button class="btn btn-primary btn-sm whitespace-nowrap text-xs px-3" onclick="window.joinBatchDirect('${batch.id}')">
              Join Batch →
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

// Client-side instant filter function
window.filterSmartBatches = function() {
  const search = (document.getElementById('batchSearchInput')?.value || '').toLowerCase().trim();
  const board = (document.getElementById('filterBatchBoard')?.value || '').toLowerCase();
  const grade = (document.getElementById('filterBatchGrade')?.value || '').toLowerCase();
  const subject = (document.getElementById('filterBatchSubject')?.value || '').toLowerCase();
  const type = (document.getElementById('filterBatchType')?.value || '').toLowerCase();
  const need = (document.getElementById('filterBatchNeed')?.value || '').toLowerCase();

  const allBatches = AppState.batches || [];
  const filtered = allBatches.filter(b => {
    // 1. Text search across product id, title, chapter, need, faculty
    if (search) {
      const hay = [
        b.productId, b.batchRef, b.title, b.courseName, b.chapter, b.topic,
        b.studentNeed, b.teacher, b.subject, b.board
      ].join(' ').toLowerCase();
      if (!hay.includes(search)) return false;
    }

    // 2. Board
    if (board) {
      const bBoard = (b.board || '').toLowerCase();
      const bSegment = (b.segment || '').toLowerCase();
      if (!bBoard.includes(board) && !bSegment.includes(board)) return false;
    }

    // 3. Grade / Class
    if (grade) {
      const bGrade = (b.grade || '').toLowerCase();
      if (!bGrade.includes(grade)) return false;
    }

    // 4. Subject
    if (subject) {
      const bSub = (b.subject || '').toLowerCase();
      if (!bSub.includes(subject)) return false;
    }

    // 5. Product Type
    if (type) {
      const bType = (b.productType || '').toLowerCase();
      if (!bType.includes(type)) return false;
    }

    // 6. Student Need
    if (need) {
      const bNeed = (b.studentNeed || '').toLowerCase();
      if (!bNeed.includes(need)) return false;
    }

    return true;
  });

  const container = document.getElementById('smartBatchesGridContainer');
  const countLabel = document.getElementById('batchCountLabel');

  if (countLabel) {
    countLabel.textContent = `Showing ${filtered.length} of ${allBatches.length} SIKO Exam Sprint Cohorts`;
  }

  if (container) {
    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <div class="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
            ${Icons.bookOpen}
          </div>
          <h3 class="text-xl font-black text-slate-900 mb-2">No matching smart batches found</h3>
          <p class="text-slate-600 text-sm max-w-md mx-auto mb-6">
            Try adjusting your search query, board, or subject filters to explore other chapterwise sprints.
          </p>
          <button class="btn btn-outline btn-sm" onclick="window.clearBatchFilters()">
            Clear All Filters
          </button>
        </div>
      `;
    } else {
      container.innerHTML = filtered.map(batch => renderSingleBatchCard(batch)).join('');
    }
  }
};

window.clearBatchFilters = function() {
  const inputs = ['batchSearchInput', 'filterBatchBoard', 'filterBatchGrade', 'filterBatchSubject', 'filterBatchType', 'filterBatchNeed'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  window.filterSmartBatches();
};
