/**
 * SIKO TEACHER MARKETPLACE & DISCOVERY VIEW
 * "Find a teacher who fits the way you learn."
 * Full responsive discovery with topic search, multi-criteria filtering, interactive comparison table, and verified faculty cards.
 */

import { AppState, formatPrice } from '../state.js';
import { Icons, TeacherCard, TeacherTierBadge } from '../components.js';

export function getFilteredMarketplaceTeachers() {
  const allTeachers = (AppState.teachers && AppState.teachers.length > 0) ? AppState.teachers : [];
  const mf = AppState.marketplaceFilters || { query: '', subject: '', exam: '', tier: '', availability: '' };
  const q = (mf.query || '').toLowerCase().trim();
  const sub = (mf.subject || '').toLowerCase().trim();
  const exam = (mf.exam || '').toLowerCase().trim();
  const tier = (mf.tier || '').toLowerCase().trim();
  const avail = (mf.availability || '').toLowerCase().trim();

  return allTeachers.filter(t => {
    if (sub) {
      const hasSub = (t.subjects || []).some(s => s.toLowerCase().includes(sub)) ||
                     (t.topics || []).some(top => top.toLowerCase().includes(sub));
      if (!hasSub) return false;
    }
    if (exam) {
      const hasExam = (t.exams || []).some(e => e.toLowerCase().includes(exam)) ||
                      (t.boards || []).some(b => b.toLowerCase().includes(exam));
      if (!hasExam) return false;
    }
    if (tier) {
      const tTier = (t.tier || '').toLowerCase();
      if (tier === 'master' && !['master', 'platinum', 'gold'].includes(tTier)) return false;
      if (tier === 'expert' && !['expert', 'lead', 'gold'].includes(tTier)) return false;
      if (tier === 'senior' && tTier !== 'senior') return false;
    }
    if (avail) {
      const hasAvail = (t.availabilityWindows || []).some(w => w.toLowerCase().includes(avail)) ||
                       (t.nextSlots || []).some(s => s.toLowerCase().includes(avail)) ||
                       (avail === 'evening' && (t.nextSlots || []).some(s => s.includes('PM'))) ||
                       (avail === 'morning' && (t.nextSlots || []).some(s => s.includes('AM'))) ||
                       (avail === 'weekend' && (t.nextSlots || []).some(s => s.includes('Sat') || s.includes('Sun')));
      if (!hasAvail) return false;
    }
    if (q) {
      const haystack = [
        t.name || '',
        t.title || '',
        ...(t.subjects || []),
        ...(t.topics || []),
        ...(t.exams || []),
        ...(t.boards || [])
      ].join(' ').toLowerCase();
      // Support multi-word topic search where all tokens or phrase match
      const tokens = q.split(/\s+/).filter(Boolean);
      const matchesAllTokens = tokens.every(tok => haystack.includes(tok));
      if (!haystack.includes(q) && !matchesAllTokens) return false;
    }
    return true;
  });
}

export function renderTeacherMarketplace() {
  const allTeachers = (AppState.teachers && AppState.teachers.length > 0) ? AppState.teachers : [];
  const filteredTeachers = getFilteredMarketplaceTeachers();
  const mf = AppState.marketplaceFilters || { query: '', subject: '', exam: '', tier: '', availability: '' };
  const compareIds = AppState.compareTeacherIds || [];
  const selectedTeachers = allTeachers.filter(t => compareIds.includes(t.id));
  const compareCount = selectedTeachers.length;
  const isGuest = AppState.currentRole === 'guest' || !AppState.isLoggedIn;

  const quickTopics = [
    { label: 'All Topics', query: '', subject: '' },
    { label: '⚛️ Mechanics & Rotation', query: 'Mechanics', subject: 'Physics' },
    { label: '⚡ Electricity & Magnetism', query: 'Electricity', subject: 'Physics' },
    { label: '🔭 Optics & Waves', query: 'Optics', subject: 'Physics' },
    { label: '📐 Calculus & Integration', query: 'Calculus', subject: 'Mathematics' },
    { label: '📊 Algebra & Coordinate Geom', query: 'Algebra', subject: 'Mathematics' },
    { label: '📐 Trigonometry', query: 'Trigonometry', subject: 'Mathematics' },
    { label: '🧪 Organic Chemistry', query: 'Organic', subject: 'Chemistry' },
    { label: '⚗️ Mole Concept & Physical Chem', query: 'Physical Chemistry', subject: 'Chemistry' },
    { label: '🧬 Genetics & Human Physiology', query: 'Genetics', subject: 'Biology' },
    { label: '🌿 Botany & Cell Biology', query: 'Cell Biology', subject: 'Biology' }
  ];

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
              <button onclick="window.navigateView('teacher-comparison')" class="btn btn-secondary btn-sm">
                ⚖️ Compare Table (${compareCount})
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
        <div class="flex items-center gap-2 text-xs text-slate-500 mb-6 pt-4">
          <a href="#" onclick="window.navigateView('public-home')" class="hover:text-blue-600">Home</a>
          <span>/</span>
          <span class="text-slate-800 font-bold">1-on-1 Teacher Discovery &amp; Comparison</span>
        </div>

        <!-- Header Banner -->
        <div class="max-w-3xl mb-8">
          <span class="badge badge-primary mb-2.5 inline-flex items-center gap-1.5 px-3 py-1 text-xs">
            ${Icons.sparkles} Verified SIKO 1-on-1 Faculty Network (${allTeachers.length} Educators)
          </span>
          <h1 class="text-3xl sm:text-4xl font-black text-slate-950 mb-3 tracking-tight">
            Find a teacher who fits the way you learn.
          </h1>
          <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
            Search by topic, subject, exam, or tier below. Select any 2–4 teachers in the table or cards to compare teaching styles, score jumps, and session fees side-by-side.
          </p>
        </div>

        <!-- Top Search & Multi-Filter Bar -->
        <div class="card p-5 sm:p-6 border border-slate-200 shadow-xs rounded-2xl mb-6 bg-white">
          <!-- Main Search Query -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
            <div class="relative flex-1">
              <span class="absolute left-3.5 top-3 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input 
                type="text" 
                value="${(mf.query || '').replace(/"/g, '&quot;')}"
                placeholder="Search by topic, chapter, or teacher name (e.g. Mechanics, Calculus, Organic Chemistry, Genetics, Electricity)" 
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none text-sm text-slate-900 bg-white"
                id="marketplaceSearchInput"
                oninput="window.filterTeachers(false)"
                onkeydown="if(event.key==='Enter') window.filterTeachers(true)"
              />
            </div>
            <button type="button" class="btn btn-primary px-6" onclick="window.filterTeachers(true)">
              Search Teachers
            </button>
            <button type="button" class="btn btn-outline px-4" onclick="window.resetTeacherFilters()">
              Reset Filters
            </button>
          </div>

          <!-- Quick Topic Filter Chips -->
          <div class="mb-4 pb-4 border-b border-slate-100">
            <span class="text-2xs font-extrabold uppercase tracking-wider text-slate-500 block mb-2">Quick Topic &amp; Chapter Filter:</span>
            <div class="flex flex-wrap gap-1.5">
              ${quickTopics.map(qt => {
                const isActive = (mf.query || '').toLowerCase() === qt.query.toLowerCase() && (mf.subject || '') === qt.subject;
                return `
                  <button
                    type="button"
                    onclick="window.selectQuickTopicFilter('${qt.query}', '${qt.subject}')"
                    class="text-xs px-3 py-1.5 rounded-full font-bold border transition-all cursor-pointer ${isActive ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300'}"
                  >${qt.label}</button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Filter Dropdowns Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label class="block text-slate-600 font-bold mb-1">Subject</label>
              <select class="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium" id="filterSubject" onchange="window.filterTeachers(true)">
                <option value="" ${!mf.subject ? 'selected' : ''}>All Subjects</option>
                <option value="Physics" ${mf.subject === 'Physics' ? 'selected' : ''}>Physics (3 Educators)</option>
                <option value="Mathematics" ${mf.subject === 'Mathematics' ? 'selected' : ''}>Mathematics (3 Educators)</option>
                <option value="Chemistry" ${mf.subject === 'Chemistry' ? 'selected' : ''}>Chemistry (2 Educators)</option>
                <option value="Biology" ${mf.subject === 'Biology' ? 'selected' : ''}>Biology (2 Educators)</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-600 font-bold mb-1">Exam / Board Target</label>
              <select class="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium" id="filterExam" onchange="window.filterTeachers(true)">
                <option value="" ${!mf.exam ? 'selected' : ''}>All Exams &amp; Boards</option>
                <option value="JEE Advanced" ${mf.exam === 'JEE Advanced' ? 'selected' : ''}>JEE Advanced</option>
                <option value="JEE Main" ${mf.exam === 'JEE Main' ? 'selected' : ''}>JEE Main</option>
                <option value="NEET" ${mf.exam === 'NEET' ? 'selected' : ''}>NEET Medical UG</option>
                <option value="CBSE" ${mf.exam === 'CBSE' ? 'selected' : ''}>CBSE Board Exam</option>
                <option value="Maharashtra" ${mf.exam === 'Maharashtra' ? 'selected' : ''}>Maharashtra Board / MHT-CET</option>
                <option value="IB DP" ${mf.exam === 'IB DP' ? 'selected' : ''}>IB DP / Cambridge</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-600 font-bold mb-1">Teacher Tier</label>
              <select class="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium" id="filterTier" onchange="window.filterTeachers(true)">
                <option value="" ${!mf.tier ? 'selected' : ''}>All Tiers</option>
                <option value="Master" ${mf.tier === 'Master' ? 'selected' : ''}>Master Teacher (12–18+ yrs)</option>
                <option value="Expert" ${mf.tier === 'Expert' ? 'selected' : ''}>Expert Teacher (9–12 yrs)</option>
                <option value="Senior" ${mf.tier === 'Senior' ? 'selected' : ''}>Senior Teacher (6–9 yrs)</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-600 font-bold mb-1">Availability</label>
              <select class="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium" id="filterAvailability" onchange="window.filterTeachers(true)">
                <option value="" ${!mf.availability ? 'selected' : ''}>Any Time</option>
                <option value="Evening" ${mf.availability === 'Evening' ? 'selected' : ''}>Evenings (6:00 PM - 9:00 PM)</option>
                <option value="Weekend" ${mf.availability === 'Weekend' ? 'selected' : ''}>Weekends (Sat &amp; Sun)</option>
                <option value="Morning" ${mf.availability === 'Morning' ? 'selected' : ''}>Mornings (7:00 AM - 11:00 AM)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Comparison Dock Floating Banner -->
        <div id="marketplaceCompareBanner" class="bg-blue-50 border-2 border-blue-300 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xs">
          <div class="flex items-start sm:items-center gap-3 flex-wrap">
            <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-xs shrink-0" id="compareCountBadge">
              ${compareCount}
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm font-extrabold text-blue-950">Compare Selected Teachers Side-by-Side</span>
                <span class="badge badge-primary text-2xs">${filteredTeachers.length} Matching Your Search</span>
              </div>
              <p class="text-xs text-blue-800 mt-0.5">
                ${selectedTeachers.length > 0
                  ? 'Currently comparing: <strong>' + selectedTeachers.map(t => t.name).join(' vs. ') + '</strong>'
                  : 'Click "⚖️ + Compare" on any teacher below or click "Compare Matching Teachers" to compare side-by-side.'}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            ${filteredTeachers.length >= 2 ? `
              <button type="button" class="btn btn-secondary btn-sm whitespace-nowrap font-extrabold" onclick="window.compareFilteredTeachers()">
                ⚖️ Compare Matching Teachers (${Math.min(4, filteredTeachers.length)})
              </button>
            ` : ''}
            <button type="button" class="btn btn-primary btn-sm whitespace-nowrap font-extrabold" onclick="window.navigateView('teacher-comparison')">
              Open Comparison Table (${compareCount}) ${Icons.arrowRight}
            </button>
            ${compareCount > 0 ? `
              <button type="button" class="btn btn-outline btn-sm text-xs" onclick="window.clearCompareTeachers()">
                Clear
              </button>
            ` : ''}
          </div>
        </div>

        <!-- INTERACTIVE TOPIC SEARCH & TEACHER COMPARISON TABLE -->
        <div id="teacherSearchSummaryTableContainer" class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-8">
          ${renderTeacherSearchSummaryTable(filteredTeachers)}
        </div>

        <!-- Detailed Teacher Cards Grid -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-extrabold text-slate-900">Detailed Educator Profiles (${filteredTeachers.length})</h2>
          <span class="text-xs text-slate-500">Click <strong>⚖️ + Compare</strong> on any card to add/remove from comparison</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="teacherGridContainer">
          ${filteredTeachers.length > 0
            ? filteredTeachers.map(teacher => TeacherCard({ teacher })).join('')
            : `<div class="col-span-2 text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">
                 <p class="text-base font-bold text-slate-800">No teachers found matching your filter criteria</p>
                 <p class="text-xs text-slate-500 mt-1 mb-4">Try clearing filters or searching for Physics, Mathematics, Chemistry, Biology, Mechanics, or Calculus.</p>
                 <button type="button" class="btn btn-primary btn-sm" onclick="window.resetTeacherFilters()">Reset All Filters</button>
               </div>`
          }
        </div>

      </div>
    </div>
  `;
}

export function renderTeacherSearchSummaryTable(teachersList) {
  const list = teachersList || [];
  const compareIds = AppState.compareTeacherIds || [];

  if (list.length === 0) {
    return `
      <div class="p-6 text-center text-slate-500 text-xs">
        No matching educators for this topic/filter combination. Click <strong>Reset Filters</strong> above to view all 10 verified educators.
      </div>
    `;
  }

  return `
    <div class="px-5 py-3.5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <span class="text-xs font-extrabold tracking-wider text-blue-300">📋 Matching Teachers Comparison Table (${list.length} Educators Found)</span>
        <p class="text-2xs text-slate-300">Tick any teachers below to compare them side-by-side or book your 1-on-1 session directly.</p>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" onclick="window.compareFilteredTeachers()" class="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs cursor-pointer border-0">
          ⚖️ Compare Top ${Math.min(4, list.length)} Matching Side-by-Side →
        </button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-2xs tracking-wider">
            <th class="p-3.5 text-center w-24">Compare</th>
            <th class="p-3.5">Educator &amp; Credentials</th>
            <th class="p-3.5">Subject &amp; Key Topics</th>
            <th class="p-3.5">Exams &amp; Boards</th>
            <th class="p-3.5">Tier &amp; Rating</th>
            <th class="p-3.5">Verified Outcome</th>
            <th class="p-3.5">1:1 Fee</th>
            <th class="p-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          ${list.map(t => {
            const isComp = compareIds.includes(t.id);
            const subjects = (t.subjects || ['Physics']).join(', ');
            const topics = (t.topics || t.subjects || []).slice(0, 4).join(', ');
            const exams = (t.exams || ['JEE', 'CBSE']).slice(0, 3).join(' · ');
            const boards = (t.boards || ['CBSE']).slice(0, 2).join(', ');
            const rate = formatPrice(t.hourlyRate || t.hourly_rate || 1500);
            const outcome = (t.outcomes && t.outcomes.scoreJump) || '+28% Score Lift';
            return `
              <tr class="hover:bg-blue-50/40 transition-colors ${isComp ? 'bg-blue-50/70' : 'bg-white'}">
                <td class="p-3.5 text-center">
                  <button
                    type="button"
                    onclick="window.toggleCompareTeacher('${t.id}')"
                    class="px-2.5 py-1 rounded-md font-extrabold text-2xs border cursor-pointer transition-all ${isComp ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:border-blue-500'}"
                  >
                    ${isComp ? '✓ Selected' : '+ Compare'}
                  </button>
                </td>
                <td class="p-3.5">
                  <div class="flex items-center gap-2.5">
                    <img src="${t.avatar}" alt="${t.name}" class="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" />
                    <div>
                      <div class="font-extrabold text-slate-900 text-xs cursor-pointer hover:text-blue-600" onclick="window.viewTeacherProfile('${t.id}')">${t.name}</div>
                      <div class="text-2xs text-slate-500">${t.education || t.title}</div>
                    </div>
                  </div>
                </td>
                <td class="p-3.5">
                  <div class="font-bold text-blue-800">${subjects}</div>
                  <div class="text-2xs text-slate-600 max-w-xs">${topics}</div>
                </td>
                <td class="p-3.5">
                  <div class="font-semibold text-slate-800">${exams}</div>
                  <div class="text-2xs text-slate-500">${boards}</div>
                </td>
                <td class="p-3.5">
                  <div class="font-bold text-slate-900">${t.tier || 'Master'} (${t.experienceYears || 10}y)</div>
                  <div class="text-amber-600 font-bold text-2xs">★ ${t.rating || 4.9} (${t.ratingsCount || 200})</div>
                </td>
                <td class="p-3.5">
                  <span class="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-2xs">${outcome}</span>
                </td>
                <td class="p-3.5 font-black text-slate-900 whitespace-nowrap">
                  ${rate}<span class="text-2xs text-slate-400 font-normal">/hr</span>
                </td>
                <td class="p-3.5 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <button type="button" class="btn btn-outline btn-xs text-2xs text-blue-700 bg-blue-50/70 border-blue-200 hover:bg-blue-100" onclick="window.openTeacherDemoLectureModal('${t.id}')" title="Watch 10-Minute Demo Lecture">▶ Demo</button>
                    <button type="button" class="btn btn-outline btn-xs text-2xs" onclick="window.viewTeacherProfile('${t.id}')">Profile</button>
                    <button type="button" class="btn btn-primary btn-xs text-2xs" onclick="window.startBookingFlow('${t.id}')">Select 1:1 →</button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}
