/**
 * SIKO DESIGN SYSTEM - REUSABLE COMPONENT GENERATORS
 * Standardized, accessible, responsive component generators matching SIKO design system tokens.
 */

import { AppState, formatPrice } from './state.js';

// SVG Icons helper for crisp zero-latency rendering
export const Icons = {
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  star: `<svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  verified: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
  video: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
  calendar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  clock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  users: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  bookOpen: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
  shield: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  mic: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,
  micOff: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,
  hand: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v5"></path><path d="M14 10V4a2 2 0 0 0-4 0v6"></path><path d="M10 10.5V6a2 2 0 0 0-4 0v8"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path></svg>`,
  chat: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  tool: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
  helpCircle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  award: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,
  wallet: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>`,
  sparkles: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>`
};

// 1. Button Generator
export function Button({ label, variant = 'primary', size = 'md', icon = null, full = false, onclick = '', extraClasses = '', id = '' }) {
  const iconHtml = icon ? `<span class="btn-icon-wrap">${icon}</span>` : '';
  const fullClass = full ? 'btn-full' : '';
  const idAttr = id ? `id="${id}"` : '';
  return `
    <button class="btn btn-${variant} btn-${size} ${fullClass} ${extraClasses}" ${idAttr} onclick="${onclick}">
      ${iconHtml}
      <span>${label}</span>
    </button>
  `;
}

// 2. Card Generator
export function Card({ title = '', subtitle = '', content = '', actions = '', extraClasses = '', interactive = false }) {
  const intClass = interactive ? 'card-interactive' : '';
  return `
    <div class="card ${intClass} ${extraClasses}">
      ${title ? `<div class="card-header"><h4 class="card-title">${title}</h4>${subtitle ? `<p class="text-muted text-sm">${subtitle}</p>` : ''}</div>` : ''}
      <div class="card-content">${content}</div>
      ${actions ? `<div class="card-footer mt-4 pt-3 border-t">${actions}</div>` : ''}
    </div>
  `;
}

// 3. Teacher Tier Badge
export function TeacherTierBadge({ tier }) {
  const t = (tier || 'Expert').toLowerCase();
  return `
    <span class="tier-badge tier-badge-${t}">
      ${Icons.award}
      <span>${tier} Teacher</span>
    </span>
  `;
}

// 4. Teacher Card (Premium)
export function TeacherCard({ teacher = {}, showSelect = true, showCompare = true, isCompact = false }) {
  const t = teacher || {};
  const hourlyRate = t.hourlyRate || t.hourly_rate || 2000;
  const priceFormatted = typeof formatPrice === 'function' ? formatPrice(hourlyRate) : ('₹' + hourlyRate);
  const name = t.name || t.full_name || 'SIKO Faculty';
  const subjects = Array.isArray(t.subjects) && t.subjects.length > 0 ? t.subjects : ['Physics'];
  const primarySubject = subjects[0] || t.subject || 'Physics';
  const avatar = (typeof window !== 'undefined' && window.getFacultyPhoto && window.getFacultyPhoto(primarySubject)) || t.avatar || t.avatar_url || 'assets/teachers/teacher_physics_indian.png';
  const tier = t.tier || 'Master';
  const title = t.title || (tier ? (tier.charAt(0).toUpperCase() + tier.slice(1) + ' Specialist Faculty') : 'Master Faculty');
  const exp = t.experienceYears || t.experience_years || 8;
  const rating = t.rating || 4.9;
  const ratingsCount = t.ratingsCount || t.ratings_count || 120;
  const topics = Array.isArray(t.topics) && t.topics.length > 0 ? t.topics : subjects;
  const exams = Array.isArray(t.exams) && t.exams.length > 0 ? t.exams : ['JEE Main', 'CBSE'];
  const boards = Array.isArray(t.boards) && t.boards.length > 0 ? t.boards : ['CBSE', 'ICSE'];
  const languages = Array.isArray(t.languages) && t.languages.length > 0 ? t.languages : ['English', 'Hindi'];
  const quote = t.quote || t.bio || 'Dedicated to conceptual clarity and academic mastery through first principles.';
  const rationale = (Array.isArray(t.matchRationale) && t.matchRationale.length > 0)
    ? t.matchRationale[0]
    : ((Array.isArray(t.specialties) && t.specialties[0]) ? t.specialties[0] + ' Specialist' : 'Verified subject specialist with proven track record');
  const nextSlots = (Array.isArray(t.nextSlots) && t.nextSlots.length > 0)
    ? t.nextSlots
    : ['Tue 7:00 PM IST', 'Thu 6:00 PM IST', 'Sat 11:00 AM IST'];
  const isCompared = Array.isArray(AppState.compareTeacherIds) && AppState.compareTeacherIds.includes(t.id);

  return `
    <div class="teacher-card ${isCompared ? 'ring-2 ring-blue-600 border-blue-500' : ''}" id="teacher-${t.id || 'default'}">
      <div class="teacher-card-header">
        <div class="teacher-avatar-wrap">
          <img src="${avatar}" onerror="if(window.getFacultyPhoto) this.src=window.getFacultyPhoto('${primarySubject}');" alt="${name}" class="teacher-avatar" loading="lazy" />
          <span class="verified-badge" title="SIKO Verified Educator">${Icons.check}</span>
        </div>
        <div class="flex-1">
          <div class="teacher-meta-title flex items-center justify-between gap-2">
            <span>${name}</span>
            ${showCompare ? `
              <button
                type="button"
                onclick="window.toggleCompareTeacher('${t.id}')"
                class="text-2xs font-extrabold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${isCompared ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 text-blue-700 border-blue-200 hover:bg-blue-50'}"
                title="Add or remove educator from side-by-side comparison"
              >
                ${isCompared ? '✓ Comparing' : '⚖️ + Compare'}
              </button>
            ` : ''}
          </div>
          <div class="teacher-specialty">${title}</div>
          <div class="flex items-center gap-2 mt-1 flex-wrap">
            ${TeacherTierBadge({ tier: tier })}
            <span class="text-xs text-muted font-medium">${exp}+ years exp</span>
            <span class="badge badge-primary text-2xs">${subjects.join(', ')}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2.5 text-xs mb-2.5 flex-wrap">
        <span class="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
          ${Icons.star} ${rating} <span class="text-muted font-normal">(${ratingsCount})</span>
        </span>
        <span class="text-muted">•</span>
        <span class="text-slate-700 font-semibold">${exams.slice(0, 3).join(' · ')}</span>
        <span class="text-muted">•</span>
        <span class="text-muted font-medium">${boards.slice(0, 2).join(' | ')}</span>
        <span class="text-muted">•</span>
        <span class="text-muted font-medium">${languages.join(', ')}</span>
      </div>

      <!-- Topics Covered Pills -->
      <div class="mb-3">
        <span class="text-2xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Key Topics & Chapters:</span>
        <div class="flex flex-wrap gap-1">
          ${topics.slice(0, 6).map(top => `
            <span
              onclick="if(window.setMarketplaceTopic) window.setMarketplaceTopic('${top.replace(/'/g, "\\'")}')"
              class="text-2xs px-2 py-0.5 rounded-md bg-blue-50/80 text-blue-900 border border-blue-200/80 font-semibold cursor-pointer hover:bg-blue-100"
              title="Filter teachers by ${top}"
            >${top}</span>
          `).join('')}
        </div>
      </div>

      <div class="teacher-quote">
        "${quote}"
      </div>

      <div class="teacher-match-badge">
        ${Icons.check} <strong>Why SIKO recommends:</strong> ${rationale}
      </div>

      <div class="teacher-slots">
        <span class="text-muted font-semibold block mb-1">Upcoming availability:</span>
        <div class="flex flex-wrap gap-1">
          ${nextSlots.map(slot => `<span class="badge badge-neutral">${slot}</span>`).join('')}
        </div>
      </div>

      <div class="teacher-card-footer">
        <div class="teacher-price">
          ${priceFormatted} <span>/ session</span>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <button type="button" class="btn btn-outline btn-sm font-bold text-blue-700 bg-blue-50/70 border-blue-200 hover:bg-blue-100" onclick="window.openTeacherDemoLectureModal('${t.id}')" title="Watch 10-Minute Verified Demo Lecture & Whiteboard">
            ▶ Demo (10m)
          </button>
          ${showCompare ? `
            <button type="button" class="btn ${isCompared ? 'btn-secondary' : 'btn-outline'} btn-sm" onclick="window.toggleCompareTeacher('${t.id}')">
              ${isCompared ? '✓ In Compare' : '⚖️ Compare'}
            </button>
          ` : ''}
          <button type="button" class="btn btn-outline btn-sm" onclick="window.viewTeacherProfile('${t.id}')">
            View Profile
          </button>
          ${showSelect ? `
            <button type="button" class="btn btn-primary btn-sm" onclick="window.startBookingFlow('${t.id}')">
              Choose Teacher
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// 5. Batch Card (Smart Learning)
export function BatchCard({ batch }) {
  const priceFormatted = formatPrice(batch.price);
  const remaining = batch.seatsTotal - batch.seatsOccupied;
  const isFull = batch.isFull || remaining <= 0;
  const occupancyPercent = Math.round((batch.seatsOccupied / batch.seatsTotal) * 100);

  return `
    <div class="batch-card" id="batch-${batch.id}">
      <div class="flex items-start justify-between gap-3 mb-2">
        <span class="badge badge-primary">${batch.subject}</span>
        ${isFull 
          ? `<span class="badge badge-danger">BATCH FULL</span>` 
          : `<span class="badge badge-warning">${remaining} seats remaining</span>`
        }
      </div>

      <h3 class="text-lg font-bold mb-1">${batch.title}</h3>
      <p class="text-xs text-muted mb-4">${batch.description}</p>

      <div class="card card-subtle p-3 rounded-md mb-4 text-xs">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="font-bold text-slate-700">Teacher:</span>
          <span>${batch.teacher}</span>
        </div>
        <div class="flex items-center gap-2 mb-1.5">
          <span class="font-bold text-slate-700">Schedule:</span>
          <span>${batch.schedule}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-bold text-slate-700">Starts:</span>
          <span>${batch.startDate} (${batch.duration})</span>
        </div>
      </div>

      <div class="batch-capacity">
        <div class="batch-capacity-text">
          <span>Cohort Capacity:</span>
          <span class="${isFull ? 'text-danger' : 'text-primary'}">${batch.seatsOccupied} / ${batch.seatsTotal} Students</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill ${isFull ? 'bg-danger' : ''}" style="width: ${occupancyPercent}%;"></div>
        </div>
      </div>

      <div class="flex items-center justify-between mt-4 pt-3 border-t">
        <div class="text-base font-extrabold text-slate-900">
          ${priceFormatted} <span class="text-xs text-muted font-normal">full course</span>
        </div>
        ${isFull ? `
          <button class="btn btn-secondary btn-sm" onclick="window.joinBatchWaitlist('${batch.id}')">
            Join Waitlist
          </button>
        ` : `
          <button class="btn btn-primary btn-sm" onclick="window.joinBatchDirect('${batch.id}')">
            Join This Batch
          </button>
        `}
      </div>
    </div>
  `;
}

// 6. Progress Bar
export function ProgressBar({ value, max = 100, label = '', variant = 'primary', showPercent = true }) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return `
    <div class="progress-component">
      ${label || showPercent ? `
        <div class="flex justify-between text-xs font-semibold mb-1">
          <span>${label}</span>
          <span>${percent}%</span>
        </div>
      ` : ''}
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill progress-bar-${variant}" style="width: ${percent}%;"></div>
      </div>
    </div>
  `;
}

// 7. Stepper Generator
export function Stepper({ steps, currentStep, onStepClick = 'window.goToStep' }) {
  return `
    <div class="stepper" role="progressbar" aria-valuemin="1" aria-valuemax="${steps.length}" aria-valuenow="${currentStep}">
      ${steps.map((st, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        const statusClass = isActive ? 'active' : (isCompleted ? 'completed' : '');
        return `
          <div class="stepper-item ${statusClass}" onclick="${onStepClick}(${stepNum})">
            <div class="stepper-circle">
              ${isCompleted ? Icons.check : (stepNum < 10 ? '0' + stepNum : stepNum)}
            </div>
            <span class="stepper-title">${st}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// 8. Milestone Timeline (for Teacher Wallet & Journey)
export function MilestoneTimeline({ milestones }) {
  return `
    <div class="milestone-timeline">
      ${milestones.map(m => {
        const isReleased = m.status === 'Released';
        return `
          <div class="milestone-item">
            <div class="milestone-node ${isReleased ? 'milestone-released' : 'milestone-pending'}">
              ${isReleased ? Icons.check : '○'}
            </div>
            <div class="flex-1 bg-white p-3 rounded-lg border shadow-xs">
              <div class="flex justify-between items-start">
                <div>
                  <h5 class="text-sm font-bold">${m.name}</h5>
                  <p class="text-xs text-muted">${m.date}</p>
                </div>
                <div class="text-right">
                  <span class="font-extrabold text-sm ${isReleased ? 'text-success' : 'text-muted'}">${formatPrice(m.amount)}</span>
                  <div class="text-xs ${isReleased ? 'text-success' : 'text-amber-600'} font-semibold">${m.status} (${m.percentage}%)</div>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// 9. Homework Card
export function HomeworkCard({ homework }) {
  return `
    <div class="card card-interactive p-4 border rounded-xl">
      <div class="flex justify-between items-start mb-2">
        <span class="badge badge-warning">Due ${homework.due}</span>
        <span class="text-xs text-muted font-medium">${homework.estimatedTime}</span>
      </div>
      <h4 class="font-bold text-base mb-1">${homework.title}</h4>
      <p class="text-xs text-muted mb-4">${homework.totalQuestions} Questions • Physics Laws of Motion</p>
      <div class="flex justify-between items-center">
        <span class="text-xs font-semibold text-slate-700">Topic: Friction & Newton’s 2nd Law</span>
        <button class="btn btn-primary btn-sm" onclick="window.startHomework('${homework.id}')">
          Start Homework ${Icons.arrowRight}
        </button>
      </div>
    </div>
  `;
}

// 10. Assessment CBT Card
export function AssessmentCard({ assessment }) {
  return `
    <div class="card p-5 border rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div class="flex justify-between items-center mb-3">
        <span class="badge badge-primary">Computer Based Exam</span>
        <span class="text-xs font-bold text-blue-700 flex items-center gap-1">${Icons.clock} 60 Minutes</span>
      </div>
      <h3 class="text-lg font-bold text-slate-900 mb-1">${assessment.title}</h3>
      <p class="text-xs text-muted mb-4">${assessment.totalQuestions} Questions • Single Correct + Numerical Type (JEE Pattern)</p>
      <button class="btn btn-primary btn-full" onclick="window.startAssessment('${assessment.id}')">
        Enter Examination Hall
      </button>
    </div>
  `;
}

// 11. Empty State
export function EmptyState({ title, description, actionLabel, actionClick, icon = Icons.bookOpen }) {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">${icon}</div>
      <h3 class="empty-state-title">${title}</h3>
      <p class="empty-state-desc">${description}</p>
      ${actionLabel ? `
        <button class="btn btn-primary btn-sm" onclick="${actionClick}">
          ${actionLabel}
        </button>
      ` : ''}
    </div>
  `;
}

// 12. Skeleton Loader
export function Skeleton({ lines = 3, height = '20px', className = '' }) {
  return `
    <div class="flex flex-col gap-2 ${className}">
      ${Array.from({ length: lines }).map((_, i) => `
        <div class="skeleton" style="height: ${height}; width: ${100 - i * 15}%;"></div>
      `).join('')}
    </div>
  `;
}
