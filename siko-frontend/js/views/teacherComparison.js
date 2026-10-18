/**
 * SIKO TEACHER COMPARISON VIEW
 * Side-by-side transparent matrix comparing 2-4 teachers across credentials, topics, outcomes, tiers, and pricing.
 * Includes an inline Topic & Subject Teacher Selector bar above the matrix for instant comparison switching.
 */

import { AppState, formatPrice } from '../state.js';
import { Icons, TeacherTierBadge } from '../components.js';
import { getFilteredMarketplaceTeachers } from './teacherMarketplace.js';

export function renderTeacherComparison() {
  const allTeachers = (AppState.teachers && AppState.teachers.length > 0) ? AppState.teachers : [];
  const filteredPool = (typeof getFilteredMarketplaceTeachers === 'function')
    ? getFilteredMarketplaceTeachers()
    : allTeachers;

  let rawCompared = allTeachers.filter(t => (AppState.compareTeacherIds || []).includes(t.id));

  // If no valid IDs matched (or user cleared selection), auto-populate from filtered pool or top 3 teachers
  if (rawCompared.length === 0 && filteredPool.length > 0) {
    rawCompared = filteredPool.slice(0, 3);
    AppState.compareTeacherIds = rawCompared.map(t => t.id);
  } else if (rawCompared.length === 0 && allTeachers.length > 0) {
    rawCompared = allTeachers.slice(0, 3);
    AppState.compareTeacherIds = rawCompared.map(t => t.id);
  }

  const comparedTeachers = rawCompared.map(t => {
    const hourlyRate = t.hourlyRate || t.hourly_rate || 2000;
    return {
      id: t.id || 'default',
      name: t.name || t.full_name || 'SIKO Faculty',
      avatar: t.avatar || t.avatar_url || 'assets/teachers/teacher_physics_indian.png',
      tier: t.tier || 'Master',
      title: t.title || t.bio || 'Senior Faculty',
      rating: t.rating || 4.9,
      ratingsCount: t.ratingsCount || t.total_classes || 120,
      experienceYears: t.experienceYears || t.experience_years || 8,
      education: t.education || 'M.Sc. / Premier University',
      hourlyRate: hourlyRate,
      subjects: Array.isArray(t.subjects) && t.subjects.length > 0 ? t.subjects : ['Physics'],
      topics: Array.isArray(t.topics) && t.topics.length > 0 ? t.topics : (t.subjects || ['Physics']),
      boards: Array.isArray(t.boards) && t.boards.length > 0 ? t.boards : ['CBSE', 'ICSE'],
      exams: Array.isArray(t.exams) && t.exams.length > 0 ? t.exams : ['JEE Advanced', 'JEE Main'],
      languages: Array.isArray(t.languages) && t.languages.length > 0 ? t.languages : ['English', 'Hindi'],
      outcomes: t.outcomes || { scoreJump: '+28% Average Score Lift', targetMet: '94% Success Rate' },
      nextSlots: Array.isArray(t.nextSlots) && t.nextSlots.length > 0 ? t.nextSlots : ['Tomorrow 6:00 PM IST', 'Saturday 11:00 AM IST'],
      quote: t.quote || 'Dedicated to first-principles understanding and academic excellence.',
      teachingStyle: t.teachingStyle || 'First principles derivation followed by tiered problem solving.'
    };
  });

  const mf = AppState.marketplaceFilters || { query: '', subject: '', exam: '', tier: '', availability: '' };
  const isGuest = AppState.currentRole === 'guest' || !AppState.isLoggedIn;

  return `
    <div class="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      <!-- Public Navigation Header for Guests -->
      ${isGuest ? `
        <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 mb-6 shadow-xs">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="#" onclick="window.navigateView('public-home')" class="flex items-center gap-2.5 text-decoration-none">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <span class="text-white font-black text-lg">S</span>
              </div>
              <span class="text-xl font-extrabold text-blue-950 tracking-tight">SIKO</span>
            </a>
            
            <div class="flex items-center gap-2 sm:gap-3">
              <button onclick="window.navigateView('teacher-marketplace')" class="btn btn-outline btn-sm">
                ← Back to Marketplace
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
        <div class="flex items-center justify-between mb-6 pt-2 flex-wrap gap-2">
          <div class="flex items-center gap-2 text-xs text-slate-500">
            <a href="#" onclick="window.navigateView('teacher-marketplace')" class="hover:underline text-blue-600 font-medium">← Teacher Marketplace</a>
            <span>/</span>
            <span class="text-slate-800 font-bold">Compare Faculty Side-by-Side</span>
          </div>
          <button class="btn btn-outline btn-sm" onclick="window.navigateView('teacher-marketplace')">
            ← Back to Full Marketplace
          </button>
        </div>

        <div class="mb-6">
          <span class="badge badge-primary mb-2 inline-flex items-center gap-1.5 px-3 py-1 text-xs">
            ⚖️ Side-by-Side 1-on-1 Faculty Comparison
          </span>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-950 mb-1.5">Compare Educators Side-by-Side</h1>
          <p class="text-slate-600 text-sm">Filter by subject or topic below to load the exact teachers you want to compare across credentials, topics, student score jumps, and 1-on-1 fees.</p>
        </div>

        <!-- TOP SEARCH BY TOPIC / SUBJECT SELECTOR FOR COMPARISON -->
        <div class="card p-5 bg-white border border-slate-200 rounded-2xl shadow-xs mb-6">
          <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Filter Teachers to Compare:</span>
              ${[
                { label: 'All Subjects', val: '' },
                { label: '⚛️ Physics (3)', val: 'Physics' },
                { label: '📐 Mathematics (3)', val: 'Mathematics' },
                { label: '🧪 Chemistry (2)', val: 'Chemistry' },
                { label: '🧬 Biology (2)', val: 'Biology' }
              ].map(s => `
                <button
                  type="button"
                  onclick="window.filterComparisonBySubject('${s.val}')"
                  class="px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${(mf.subject || '') === s.val ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50'}"
                >${s.label}</button>
              `).join('')}
            </div>

            <div class="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="text"
                id="comparisonTopicInput"
                value="${(mf.query || '').replace(/"/g, '&quot;')}"
                placeholder="Search topic (e.g. Mechanics, Calculus, Organic, Genetics)..."
                class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                oninput="window.filterComparisonByTopic(this.value)"
              />
              ${(mf.query || mf.subject) ? `
                <button type="button" class="btn btn-outline btn-sm text-xs whitespace-nowrap" onclick="window.filterComparisonBySubject(''); window.filterComparisonByTopic('');">
                  Reset
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Matching Educators Toggle Strip -->
          <div>
            <div class="flex items-center justify-between mb-2.5 flex-wrap gap-2">
              <span class="text-2xs font-bold text-slate-500 uppercase tracking-wider">
                Matching Educators (${filteredPool.length}) — Click to Add / Remove in Comparison Table Below:
              </span>
              <button type="button" class="text-xs font-extrabold text-blue-700 hover:underline cursor-pointer bg-transparent border-0" onclick="window.loadAllFilteredIntoComparison()">
                ⚖️ Compare All ${Math.min(4, filteredPool.length)} Matching Teachers Now →
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              ${filteredPool.map(t => {
                const isSelected = (AppState.compareTeacherIds || []).includes(t.id);
                return `
                  <div
                    onclick="window.toggleCompareTeacher('${t.id}')"
                    class="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${isSelected ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-50/70 border-slate-200 hover:border-blue-300'}"
                  >
                    <div class="flex items-center gap-2 min-w-0">
                      <img src="${t.avatar}" alt="${t.name}" class="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
                      <div class="min-w-0">
                        <div class="text-xs font-bold text-slate-900 truncate">${t.name}</div>
                        <div class="text-2xs text-slate-500 truncate">${(t.subjects || [])[0] || 'Physics'} • ${formatPrice(t.hourlyRate || 1500)}</div>
                      </div>
                    </div>
                    <span class="text-2xs font-extrabold px-2 py-0.5 rounded shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-300'}">
                      ${isSelected ? '✓' : '+'}
                    </span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Comparison Matrix Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50">
                  <th class="p-4 sm:p-6 w-1/5 font-extrabold text-slate-900 uppercase text-xs tracking-wider">
                    Comparison Criteria
                    <div class="text-2xs font-normal text-slate-500 normal-case mt-1">Comparing ${comparedTeachers.length} Verified Educators</div>
                  </th>
                  ${comparedTeachers.map(teacher => `
                    <th class="text-center p-5 bg-white border-l border-slate-200 relative min-w-[220px]">
                      ${comparedTeachers.length > 1 ? `
                        <button
                          type="button"
                          onclick="window.toggleCompareTeacher('${teacher.id}')"
                          class="absolute top-3 right-3 text-2xs font-bold text-slate-400 hover:text-red-600 px-2 py-0.5 rounded border border-slate-200 hover:border-red-200 bg-slate-50 cursor-pointer"
                          title="Remove from comparison"
                        >✕ Remove</button>
                      ` : ''}
                      <img src="${teacher.avatar}" alt="${teacher.name}" class="w-20 h-20 rounded-full mx-auto object-cover mb-2 border-2 border-blue-200 shadow-xs" />
                      <h4 class="font-extrabold text-base text-slate-900">${teacher.name}</h4>
                      <div class="mt-1">${TeacherTierBadge({ tier: teacher.tier })}</div>
                      <div class="text-xs text-slate-500 mt-1">${teacher.title}</div>
                      <div class="mt-4 flex flex-col gap-1.5">
                        <button class="btn btn-primary btn-sm btn-full" onclick="window.startBookingFlow('${teacher.id}')">
                          Choose ${teacher.name.replace(/^(Dr\.|Prof\.)\s+/i, '').split(' ')[0]} (Book 1:1)
                        </button>
                        <button class="btn btn-outline btn-xs btn-full text-2xs" onclick="window.viewTeacherProfile('${teacher.id}')">
                          View Full Profile
                        </button>
                      </div>
                    </th>
                  `).join('')}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr>
                  <td class="font-bold text-slate-700 bg-slate-50/80 p-4">1-on-1 Session Fee</td>
                  ${comparedTeachers.map(t => `
                    <td class="text-center font-black text-slate-900 border-l border-slate-200 p-4 text-base">
                      ${formatPrice(t.hourlyRate)} <span class="text-xs font-normal text-slate-500">/ hr</span>
                    </td>
                  `).join('')}
                </tr>
                <tr>
                  <td class="font-bold text-slate-700 bg-slate-50/80 p-4">Student Rating</td>
                  ${comparedTeachers.map(t => `
                    <td class="text-center border-l border-slate-200 p-4">
                      <span class="font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded inline-flex items-center gap-1 text-xs">
                        ${Icons.star} ${t.rating} <span class="text-slate-400 font-normal">(${t.ratingsCount} reviews)</span>
                      </span>
                    </td>
                  `).join('')}
                </tr>
                <tr>
                  <td class="font-bold text-slate-700 bg-slate-50/80 p-4">Subject &amp; Exam Expertise</td>
                  ${comparedTeachers.map(t => `
                    <td class="text-center border-l border-slate-200 p-4 text-xs">
                      <div class="font-extrabold text-blue-700 mb-1">${t.subjects.join(', ')}</div>
                      <div class="text-slate-700 font-semibold">${t.exams.join(' • ')}</div>
                      <div class="text-2xs text-slate-500 mt-0.5">Boards: ${t.boards.join(', ')}</div>
                    </td>
                  `).join('')}
                </tr>
                <tr>
                  <td class="font-bold text-slate-700 bg-slate-50/80 p-4">Key Topics &amp; Chapters Specialized</td>
                  ${comparedTeachers.map(t => `
                    <td class="text-center border-l border-slate-200 p-4 text-xs">
                      <div class="flex flex-wrap justify-center gap-1">
                        ${t.topics.slice(0, 7).map(top => `
                          <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 text-2xs font-semibold">${top}</span>
                        `).join('')}
                      </div>
                    </td>
                  `).join('')}
                </tr>
                <tr>
                  <td class="font-bold text-slate-700 bg-slate-50/80 p-4">Experience &amp; Qualifications</td>
                  ${comparedTeachers.map(t => `
                    <td class="text-center border-l border-slate-200 p-4 text-xs">
                      <div class="font-bold text-slate-900">${t.experienceYears}+ Years Experience</div>
                      <div class="text-slate-600 mt-1">${t.education}</div>
                    </td>
                  `).join('')}
                </tr>
                <tr>
                  <td class="font-bold text-slate-700 bg-slate-50/80 p-4">Verified Student Outcomes</td>
                  ${comparedTeachers.map(t => `
                    <td class="text-center border-l border-slate-200 p-4 text-xs bg-emerald-50/40">
                      <div class="font-black text-emerald-800">${t.outcomes.scoreJump}</div>
                      <div class="text-emerald-700 mt-0.5">${t.outcomes.targetMet}</div>
                    </td>
                  `).join('')}
                </tr>
                <tr>
                  <td class="font-bold text-slate-700 bg-slate-50/80 p-4">Teaching Language</td>
                  ${comparedTeachers.map(t => `
                    <td class="text-center border-l border-slate-200 p-4 text-xs text-slate-700 font-medium">
                      ${t.languages.join(' & ')}
                    </td>
                  `).join('')}
                </tr>
                <tr>
                  <td class="font-bold text-slate-700 bg-slate-50/80 p-4">Upcoming Availability</td>
                  ${comparedTeachers.map(t => `
                    <td class="text-center border-l border-slate-200 p-4 text-xs">
                      <div class="flex flex-col gap-1 items-center">
                        ${t.nextSlots.map(s => `<span class="badge badge-neutral">${s}</span>`).join('')}
                      </div>
                    </td>
                  `).join('')}
                </tr>
                <tr>
                  <td class="font-bold text-slate-700 bg-slate-50/80 p-4">Teaching Pedagogy</td>
                  ${comparedTeachers.map(t => `
                    <td class="text-center border-l border-slate-200 p-4 text-xs text-slate-600">
                      <div class="font-medium text-slate-800 mb-1">${t.teachingStyle}</div>
                      <div class="italic text-slate-500">"${t.quote}"</div>
                    </td>
                  `).join('')}
                </tr>
                <tr>
                  <td class="bg-slate-50/80 p-4 font-bold text-slate-700">Book 1-on-1 Mentorship</td>
                  ${comparedTeachers.map(t => `
                    <td class="text-center border-l border-slate-200 p-4">
                      <button class="btn btn-primary btn-sm btn-full" onclick="window.startBookingFlow('${t.id}')">
                        Choose Teacher &amp; Book 1:1 →
                      </button>
                    </td>
                  `).join('')}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}
