/**
 * SIKO RECOMMENDED TEACHERS VIEW
 * "Meet your recommended teachers."
 * Filtered by student goals, subject, availability, and Learning DNA profile.
 */

import { AppState } from '../state.js';
import { Icons, TeacherCard } from '../components.js';

export function renderRecommendedTeachers() {
  const allTeachers = (AppState.teachers && AppState.teachers.length > 0) ? AppState.teachers : [];
  const activeSubject = (AppState.marketplaceFilters && AppState.marketplaceFilters.subject) || (AppState.studentOnboarding && AppState.studentOnboarding.selectedSubject) || '';
  const teachers = activeSubject
    ? allTeachers.filter(t => (t.subjects || []).some(s => s.toLowerCase().includes(activeSubject.toLowerCase())))
    : allTeachers;
  const displayTeachers = teachers.length > 0 ? teachers : allTeachers;
  const compareIds = Array.isArray(AppState.compareTeacherIds) ? AppState.compareTeacherIds : [];
  const compareCount = compareIds.filter(id => allTeachers.some(t => t.id === id)).length;
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
                ← Explore All Faculty
              </button>
              <button onclick="window.navigateView('learning-dna')" class="btn btn-primary btn-sm">
                View Learning DNA →
              </button>
            </div>
          </div>
        </header>
      ` : ''}

      <div class="container max-w-7xl mx-auto px-4 sm:px-6">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-xs text-slate-500 mb-6 pt-2">
          <a href="#" onclick="window.navigateView('student-home')" class="hover:underline text-blue-600 font-medium">Home</a>
          <span>/</span>
          <span class="text-slate-800 font-bold">Recommended Faculty</span>
        </div>

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div class="max-w-3xl">
            <span class="badge badge-primary mb-2.5 inline-flex items-center gap-1.5 px-3 py-1 text-xs">
              ${Icons.sparkles} Tailored By Learning DNA ${activeSubject ? `· ${activeSubject}` : ''}
            </span>
            <h1 class="text-3xl sm:text-4xl font-black text-slate-950 mb-3 tracking-tight">
              Meet your recommended teachers.
            </h1>
            <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
              Based on your learning goals, subject, evening availability, and preferred derivation-first style. SIKO never promotes sponsors: every recommendation is algorithmic, transparent, and factual.
            </p>
          </div>
          <!-- Subject Filter Pills -->
          <div class="flex items-center gap-1.5 flex-wrap">
            ${['', 'Physics', 'Mathematics', 'Chemistry', 'Biology'].map(sub => {
              const isAct = (activeSubject || '') === sub;
              return `
                <button type="button" onclick="if(!AppState.marketplaceFilters) AppState.marketplaceFilters={}; AppState.marketplaceFilters.subject='${sub}'; if(AppState.studentOnboarding && '${sub}') AppState.studentOnboarding.selectedSubject='${sub}'; window.filterComparisonBySubject('${sub}')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isAct ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-400'}">
                  ${sub || 'All Subjects'}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Comparison Banner -->
        <div class="p-4 sm:p-5 rounded-2xl bg-blue-50 border border-blue-200 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="text-xs text-blue-900">
            <strong>Compare before you commit:</strong> Click <strong>⚖️ + Compare</strong> on any educator card below, or compare all ${displayTeachers.length} recommended ${activeSubject || ''} teachers side-by-side.
          </div>
          <div class="flex items-center gap-2">
            <button class="btn btn-primary btn-sm whitespace-nowrap font-bold" onclick="AppState.compareTeacherIds = [${displayTeachers.slice(0, 4).map(t => `'${t.id}'`).join(',')}]; window.navigateView('teacher-comparison')">
              ⚖️ Compare Recommended (${Math.min(4, displayTeachers.length)}) &rarr;
            </button>
            ${compareCount > 0 ? `
              <button class="btn btn-outline btn-sm whitespace-nowrap font-bold" onclick="window.navigateView('teacher-comparison')">
                View Selected (${compareCount})
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Recommended Teachers Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${displayTeachers.map(teacher => TeacherCard({ teacher, showSelect: true, showCompare: true })).join('')}
        </div>
      </div>
    </div>
  `;
}
