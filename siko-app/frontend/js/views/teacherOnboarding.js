/**
 * SIKO COMPREHENSIVE FACULTY SELECTION, ACCREDITATION & ORIENTATION PROTOCOL
 * Authentic, uncompressed 10-Stage Educator Journey:
 * Stage 1: Educator Application & Intake (Clean/Fresh State + Fast-Fill Sample)
 * Stage 2: KYC & Academic Document Dossier (CV, Degrees, Identity Proof)
 * Stage 3: 10-Minute Video Demo Lecture & Whiteboard Derivation Check
 * Stage 4: SIKO Academic Dean Committee Evaluation & Rubric Scoring (/40)
 * Stage 5: Live Subject Academic Head Technical Interview (1-on-1 Viva)
 * Stage 6: Faculty Tier Assignment & Formal Selection Offer Letter (₹2,250/hr)
 * Stage 7: Academic Term Contract (ATC) & Escrow Milestones (50/25/25 Schedule A)
 * Stage 8: Digital Faculty Agreement & Legal e-Signature (IT Act Sec 10A)
 * Stage 9: Mandatory Faculty Orientation & Platform Training (3 Interactive Modules)
 * Stage 10: Educator Portal Live & Activated! (Accredited Badge + Live Hub)
 */

import { AppState, notifyStateChange } from '../state.js';
import { Icons } from '../components.js';

export function ensureTeacherOnboardingDefaults() {
  if (!AppState.teacherOnboarding) AppState.teacherOnboarding = {};
  const ob = AppState.teacherOnboarding;

  if (!ob.candidateId) ob.candidateId = 'SIKO-CAND-2026-' + (Math.floor(Math.random() * 8999) + 1000);
  if (ob.currentStep === undefined) ob.currentStep = 1;
  if (ob.applicantStage === undefined) ob.applicantStage = 1;

  // Clean / Plain initial state for commercial launch
  if (ob.fullName === undefined) ob.fullName = '';
  if (ob.email === undefined) ob.email = '';
  if (ob.phone === undefined) ob.phone = '';
  if (ob.city === undefined) ob.city = '';
  if (ob.highestDegree === undefined) ob.highestDegree = '';
  if (ob.institutions === undefined) ob.institutions = '';
  if (ob.experienceYears === undefined) ob.experienceYears = '';
  if (ob.primarySubject === undefined) ob.primarySubject = 'Physics';
  if (!Array.isArray(ob.teachingFormats)) ob.teachingFormats = ['1-on-1', 'smart-learning'];
  if (!Array.isArray(ob.availableDays)) ob.availableDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (!Array.isArray(ob.dailyTimingWindows)) ob.dailyTimingWindows = ['Evening Prime (5:00 PM – 9:00 PM IST)', 'Weekend Intensive (10:00 AM – 4:00 PM IST)'];
  if (ob.declaredWeeklyHours === undefined) ob.declaredWeeklyHours = 30;

  if (!Array.isArray(ob.standards)) {
    ob.standards = ['Class 11', 'Class 12'];
  }
  if (!Array.isArray(ob.academicStreams)) {
    ob.academicStreams = [
      'Class 11–12 JEE Main & Adv / MHT-CET (PCM • 1.5 Hrs/Slot)'
    ];
  }
  if (!Array.isArray(ob.subjects)) {
    ob.subjects = ['Physics'];
  }
  if (!Array.isArray(ob.boards)) {
    ob.boards = ['CBSE', 'JEE Main & Advanced', 'Maharashtra State Board'];
  }

  if (ob.expectedHourlyRate === undefined) ob.expectedHourlyRate = 1200;
  ob.expectedHourlyRate = Math.min(1200, Math.max(500, Number(ob.expectedHourlyRate) || 1200));
  if (ob.sikoFinalizedRate === undefined) ob.sikoFinalizedRate = 1200;
  ob.sikoFinalizedRate = Math.min(1200, Math.max(500, Number(ob.sikoFinalizedRate) || 1200));
  if (ob.selectedTier === undefined) ob.selectedTier = 'Master';
  if (ob.profilePhotoUrl === undefined) ob.profilePhotoUrl = 'assets/teachers/teacher_physics_indian.png';
  if (ob.profilePhotoFileName === undefined) ob.profilePhotoFileName = 'Verified_Faculty_Passport_Photo.png';
  if (ob.profilePhotoSize === undefined) ob.profilePhotoSize = '715 KB';
  if (!Array.isArray(ob.teachingFormats)) ob.teachingFormats = ['1-on-1', 'smart-learning'];
  if (!Array.isArray(ob.availableDays)) ob.availableDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (!Array.isArray(ob.dailyTimingWindows)) ob.dailyTimingWindows = ['Evening Prime (4:00 PM – 7:30 PM IST)', 'Night Focus (7:30 PM – 11:00 PM IST)'];
  if (ob.declaredWeeklyHours === undefined) ob.declaredWeeklyHours = 24;

  if (!ob.attachedDocs) {
    ob.attachedDocs = {
      cvResume: { attached: false, fileName: 'Not Uploaded', size: '—', status: 'Pending' },
      degreeCert: { attached: false, fileName: 'Not Uploaded', size: '—', status: 'Pending' },
      govtIdPan: { attached: false, fileName: 'Not Uploaded', size: '—', status: 'Pending' },
      demoVideo: { attached: false, fileName: 'Not Uploaded', size: '—', status: 'Pending' }
    };
  }

  if (!ob.demoEvaluation) {
    ob.demoEvaluation = {
      conceptRigor: 9.8,
      engagement: 9.6,
      boardWork: 9.5,
      pacing: 9.7,
      totalScore: 38.6,
      percentile: 'Top 1.2% Nationally',
      deanNotes: 'Exceptional first-principles pedagogy, crystal-clear whiteboard free body diagrams, and rapid doubt anticipation.'
    };
  }

  if (!ob.orientationModules) {
    ob.orientationModules = {
      classroomSetup: false,
      learningDnaTimetable: false,
      milestoneEscrowWorkflow: false
    };
  }

  if (!ob.activeScheduleDayTab) ob.activeScheduleDayTab = 'Mon';
  if (!ob.weeklySchedule) {
    ob.weeklySchedule = {
      Mon: [
        { id: 'slot-mon-1', day: 'Mon', timeLabel: '5:00 PM – 6:30 PM', duration: 1.5, format: '1-on-1', subject: 'Physics', stream: 'Class 11–12 JEE Main & Adv (PCM)' },
        { id: 'slot-mon-2', day: 'Mon', timeLabel: '6:45 PM – 8:15 PM', duration: 1.5, format: '1-on-1', subject: 'Physics', stream: 'Class 11–12 JEE Main & Adv (PCM)' }
      ],
      Tue: [
        { id: 'slot-tue-1', day: 'Tue', timeLabel: '5:00 PM – 6:30 PM', duration: 1.5, format: '1-on-1', subject: 'Physics', stream: 'Class 11–12 JEE Main & Adv (PCM)' },
        { id: 'slot-tue-2', day: 'Tue', timeLabel: '6:45 PM – 8:15 PM', duration: 1.5, format: '1-on-1', subject: 'Physics', stream: 'Class 11–12 JEE Main & Adv (PCM)' }
      ],
      Wed: [
        { id: 'slot-wed-1', day: 'Wed', timeLabel: '5:00 PM – 6:30 PM', duration: 1.5, format: '1-on-1', subject: 'Physics', stream: 'Class 11–12 JEE Main & Adv (PCM)' },
        { id: 'slot-wed-2', day: 'Wed', timeLabel: '6:45 PM – 8:15 PM', duration: 1.5, format: '1-on-1', subject: 'Physics', stream: 'Class 11–12 JEE Main & Adv (PCM)' }
      ],
      Thu: [
        { id: 'slot-thu-1', day: 'Thu', timeLabel: '5:00 PM – 6:30 PM', duration: 1.5, format: '1-on-1', subject: 'Physics', stream: 'Class 11–12 JEE Main & Adv (PCM)' },
        { id: 'slot-thu-2', day: 'Thu', timeLabel: '6:45 PM – 8:15 PM', duration: 1.5, format: '1-on-1', subject: 'Physics', stream: 'Class 11–12 JEE Main & Adv (PCM)' }
      ],
      Fri: [
        { id: 'slot-fri-1', day: 'Fri', timeLabel: '5:00 PM – 6:30 PM', duration: 1.5, format: '1-on-1', subject: 'Physics', stream: 'Class 11–12 JEE Main & Adv (PCM)' },
        { id: 'slot-fri-2', day: 'Fri', timeLabel: '6:45 PM – 8:15 PM', duration: 1.5, format: '1-on-1', subject: 'Physics', stream: 'Class 11–12 JEE Main & Adv (PCM)' }
      ],
      Sat: [
        { id: 'slot-sat-1', day: 'Sat', timeLabel: '10:00 AM – 11:30 AM', duration: 1.5, format: 'smart-learning', subject: 'Physics', stream: 'Smart Circles Cohort (Max 30)' },
        { id: 'slot-sat-2', day: 'Sat', timeLabel: '11:45 AM – 1:15 PM', duration: 1.5, format: 'smart-learning', subject: 'Physics', stream: 'Smart Circles Cohort (Max 30)' },
        { id: 'slot-sat-3', day: 'Sat', timeLabel: '2:00 PM – 3:30 PM', duration: 1.5, format: 'smart-learning', subject: 'Physics', stream: 'Smart Circles Cohort (Max 30)' }
      ],
      Sun: [] // STRICT: Zero slots on Sunday because Sunday is not in availableDays!
    };
  } else if (!ob.availableDays.includes('Sun')) {
    ob.weeklySchedule.Sun = []; // If Sunday is not in availableDays, ensure Sunday has 0 slots
  }

  return ob;
}

// ─────────────────────────────────────────────────────────────────────────────
// FAST-FILL SAMPLE CREDENTIALS (IIT DELHI FACULTY CANDIDATE)
// ─────────────────────────────────────────────────────────────────────────────
window.fastFillTeacherSample = function() {
  const ob = ensureTeacherOnboardingDefaults();
  ob.candidateId = 'SIKO-CAND-2026-8419';
  ob.fullName = 'Dedicated Master Faculty Candidate';
  ob.email = 'faculty.applicant@iitd.ac.in';
  ob.phone = '+91 98201 44510';
  ob.city = 'New Delhi / IIT Delhi Campus';
  ob.highestDegree = 'Ph.D. in Physics (IIT Delhi) • M.Sc. Physics (Gold Medalist)';
  ob.institutions = 'Ex-Senior Faculty FIITJEE South Delhi & Allen Kota';
  ob.experienceYears = 12;
  ob.primarySubject = 'Physics';
  ob.subjects = ['Physics'];
  ob.standards = ['Class 9', 'Class 10', 'Class 11', 'Class 12'];
  ob.academicStreams = [
    'Class 8–10 School Boards (CBSE/ICSE/State • 1.0 Hr/Slot)',
    'Class 11–12 JEE Main & Adv / MHT-CET (PCM • 1.5 Hrs/Slot)'
  ];
  ob.boards = ['CBSE', 'ICSE', 'Maharashtra State Board', 'JEE Main & Advanced', 'MHT-CET'];
  ob.expectedHourlyRate = 2300;
  ob.sikoFinalizedRate = 2250;
  ob.selectedTier = 'Master';

  ob.attachedDocs = {
    cvResume: { attached: true, fileName: 'Faculty_IITD_Physics_CV.pdf', size: '1.4 MB', status: '✓ Verified' },
    degreeCert: { attached: true, fileName: 'PhD_IIT_Delhi_Physics_Degree.pdf', size: '2.1 MB', status: '✓ Verified' },
    govtIdPan: { attached: true, fileName: 'Aadhaar_PAN_KYC_Dossier.pdf', size: '940 KB', status: '✓ Verified' },
    demoVideo: { attached: true, fileName: '10Min_Whiteboard_Demo_Rotational_Dynamics.mp4', size: '48.5 MB', status: '✓ Verified' }
  };

  ob.demoEvaluation = {
    conceptRigor: 9.8,
    engagement: 9.6,
    boardWork: 9.5,
    pacing: 9.7,
    totalScore: 38.6,
    percentile: 'Top 1.2% Nationally',
    deanNotes: 'Exceptional first-principles pedagogy, crystal-clear whiteboard free body diagrams, and rapid doubt anticipation.'
  };

  ob.applicationDecisionStatus = 'SELECTED';
  ob.offerAcceptedByTeacher = true;
  ob.agreementSigned = true;
  ob.orientationModules = {
    classroomSetup: true,
    learningDnaTimetable: true,
    milestoneEscrowWorkflow: true
  };

  if (typeof window.showToast === 'function') {
    window.showToast('⚡ IIT Delhi Faculty credentials fast-filled! All stages populated for verification.', 'success');
  }
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

window.resetTeacherFormToFresh = function() {
  const ob = ensureTeacherOnboardingDefaults();
  ob.fullName = '';
  ob.email = '';
  ob.phone = '';
  ob.city = '';
  ob.highestDegree = '';
  ob.institutions = '';
  ob.experienceYears = '';
  ob.currentStep = 1;
  ob.applicantStage = 1;
  ob.attachedDocs = {
    cvResume: { attached: false, fileName: 'Not Uploaded', size: '—', status: 'Pending' },
    degreeCert: { attached: false, fileName: 'Not Uploaded', size: '—', status: 'Pending' },
    govtIdPan: { attached: false, fileName: 'Not Uploaded', size: '—', status: 'Pending' },
    demoVideo: { attached: false, fileName: 'Not Uploaded', size: '—', status: 'Pending' }
  };
  ob.applicationDecisionStatus = 'DRAFT';
  ob.offerAcceptedByTeacher = false;
  ob.agreementSigned = false;
  ob.orientationModules = { classroomSetup: false, learningDnaTimetable: false, milestoneEscrowWorkflow: false };

  if (typeof window.showToast === 'function') {
    window.showToast('↺ Form reset to plain fresh commercial state. Ready for fresh teacher application.', 'info');
  }
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP / STAGE CONTROLLER (1 TO 10)
// ─────────────────────────────────────────────────────────────────────────────
window.setTeacherOnboardingStep = function(stepNum) {
  const ob = ensureTeacherOnboardingDefaults();
  const st = Math.max(1, Math.min(10, Number(stepNum) || 1));
  ob.currentStep = st;
  ob.applicantStage = st;
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

window.setTeacherApplicantStage = function(stageNum) {
  window.setTeacherOnboardingStep(stageNum);
};

window.updateTeacherIntakeField = function(field, value, shouldRender = false) {
  const ob = ensureTeacherOnboardingDefaults();
  if (field === 'expectedHourlyRate') {
    let num = Number(value) || 2200;
    if (num > 2500) {
      num = 2500;
      if (typeof window.showToast === 'function') {
        window.showToast('ℹ️ Expected hourly honorarium calibrated to faculty credentials.', 'info');
      }
    }
    if (num < 500) num = 500;
    value = num;
    ob.expectedHourlyRate = num;
    ob.sikoFinalizedRate = Math.min(2500, Math.max(500, ob.sikoFinalizedRate || num));
  } else if (field === 'declaredWeeklyHours') {
    ob.declaredWeeklyHours = Number(value) || 24;
  } else {
    ob[field] = value;
  }
  if (field === 'fullName') {
    if (!AppState.currentUser) AppState.currentUser = { role: 'teacher' };
    AppState.currentUser.name = value ? value.trim() : 'Faculty Candidate';
    AppState.currentUser.role = 'teacher';
    const welcomeEl = document.getElementById('teacher-stage-welcome-name');
    if (welcomeEl) {
      welcomeEl.textContent = value && value.trim() ? `Welcome, ${value.trim()}` : 'SIKO Educator Joining & Accreditation Protocol';
    }
  }
  if (shouldRender) {
    if (typeof window.renderApp === 'function') window.renderApp();
    else notifyStateChange();
  }
};

window.setTeacherScheduleDayTab = function(day) {
  const ob = ensureTeacherOnboardingDefaults();
  ob.activeScheduleDayTab = day;
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

window.addTeacherScheduleSlot = function(day, timeLabel, format = '1-on-1', duration = null) {
  const ob = ensureTeacherOnboardingDefaults();
  if (!Array.isArray(ob.availableDays)) ob.availableDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Check if day is active in faculty's declared availability
  if (!ob.availableDays.includes(day)) {
    if (typeof window.showToast === 'function') {
      window.showToast(`⚠️ Cannot add slot: ${day} is not in your Available Teaching Days. Click "+ ${day}" above to enable it first.`, 'warning');
    }
    return;
  }

  // Section check: School vs College
  const isSchool = (ob.academicStreams || []).some(s => s.includes('Class 8–10')) ||
                   (ob.standards || []).some(st => ['Class 8', 'Class 9', 'Class 10'].includes(st));
  const isCollege = (ob.academicStreams || []).some(s => s.includes('Class 11–12') || s.includes('JEE') || s.includes('NEET') || s.includes('MHT-CET')) ||
                    (ob.standards || []).some(st => ['Class 11', 'Class 12'].includes(st));
  const isSchoolOnly = isSchool && !isCollege;
  const slotDur = duration !== null ? Number(duration) : (isSchoolOnly ? 1.0 : 1.5);

  if (!ob.weeklySchedule) ob.weeklySchedule = {};
  if (!Array.isArray(ob.weeklySchedule[day])) ob.weeklySchedule[day] = [];

  // Prevent duplicate/overlapping time slot on same day
  const existing = ob.weeklySchedule[day];
  if (existing.some(s => s.timeLabel === timeLabel)) {
    if (typeof window.showToast === 'function') {
      window.showToast(`⚠️ Time slot clash: ${timeLabel} is already occupied on ${day}!`, 'warning');
    }
    return;
  }

  const newId = `slot-${day.toLowerCase()}-${Date.now().toString(36)}`;
  ob.weeklySchedule[day].push({
    id: newId,
    day: day,
    timeLabel: timeLabel || (isSchoolOnly ? '4:00 PM – 5:00 PM' : '5:00 PM – 6:30 PM'),
    duration: slotDur,
    format: format,
    subject: (ob.subjects && ob.subjects[0]) || 'Physics',
    stream: isSchoolOnly
      ? 'Class 8–10 School Boards (CBSE/ICSE/State • 1.0 Hr/Slot)'
      : (format === '1-on-1' ? 'Class 11–12 JEE Main & Adv (PCM • 1.5 Hrs/Slot)' : 'Smart Circles Cohort (Max 30)'),
    status: 'Zero-Clash Verified ✓'
  });

  if (typeof window.showToast === 'function') {
    window.showToast(`✓ Added ${timeLabel} (${slotDur}h) slot for ${day}`, 'success');
  }
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

window.removeTeacherScheduleSlot = function(day, slotId) {
  const ob = ensureTeacherOnboardingDefaults();
  if (ob.weeklySchedule && Array.isArray(ob.weeklySchedule[day])) {
    ob.weeklySchedule[day] = ob.weeklySchedule[day].filter(s => s.id !== slotId);
    if (typeof window.showToast === 'function') {
      window.showToast(`Removed slot from ${day}`, 'info');
    }
  }
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

window.populateTeacherAiZeroClashSchedule = function() {
  const ob = ensureTeacherOnboardingDefaults();
  const activeDays = Array.isArray(ob.availableDays) ? ob.availableDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Stream & Standard Analysis
  const isSchool = (ob.academicStreams || []).some(s => s.includes('Class 8–10')) ||
                   (ob.standards || []).some(st => ['Class 8', 'Class 9', 'Class 10'].includes(st));
  const isCollege = (ob.academicStreams || []).some(s => s.includes('Class 11–12') || s.includes('JEE') || s.includes('NEET') || s.includes('MHT-CET')) ||
                    (ob.standards || []).some(st => ['Class 11', 'Class 12'].includes(st));
  const isSchoolOnly = isSchool && !isCollege;
  const slotDuration = isSchoolOnly ? 1.0 : 1.5;
  const slotSubject = (ob.subjects && ob.subjects[0]) || 'Physics';

  const formats = Array.isArray(ob.teachingFormats) && ob.teachingFormats.length > 0 ? ob.teachingFormats : ['1-on-1', 'smart-learning'];
  const has1on1 = formats.includes('1-on-1');
  const hasCohort = formats.includes('smart-learning');

  // Declared Weekly Target Workload
  const targetWeeklyHours = Number(ob.declaredWeeklyHours) || 24;
  const targetTotalSlots = Math.max(activeDays.length, Math.round(targetWeeklyHours / slotDuration));

  // Time slot templates strictly aligned to Section Rules:
  // - School Section: Batches start strictly between 4:00 PM and 11:00 PM (1.0h slots)
  // - College Section: Morning (7-11 AM), Afternoon (11:30 AM-3:30 PM), or Evening/Night (4:00 PM-11:00 PM) (1.5h slots)
  const schoolSlotPool = [
    { timeLabel: '4:00 PM – 5:00 PM', duration: 1.0, window: 'Evening Prime' },
    { timeLabel: '5:15 PM – 6:15 PM', duration: 1.0, window: 'Evening Prime' },
    { timeLabel: '6:30 PM – 7:30 PM', duration: 1.0, window: 'Evening Prime' },
    { timeLabel: '7:45 PM – 8:45 PM', duration: 1.0, window: 'Night Focus' },
    { timeLabel: '9:00 PM – 10:00 PM', duration: 1.0, window: 'Night Focus' },
    { timeLabel: '10:00 PM – 11:00 PM', duration: 1.0, window: 'Night Focus' }
  ];

  const collegeSlotPool = [
    // Morning (College / Droppers)
    { timeLabel: '7:00 AM – 8:30 AM', duration: 1.5, window: 'Morning Peak' },
    { timeLabel: '8:45 AM – 10:15 AM', duration: 1.5, window: 'Morning Peak' },
    // Afternoon (College / Droppers)
    { timeLabel: '11:30 AM – 1:00 PM', duration: 1.5, window: 'Afternoon Focus' },
    { timeLabel: '2:00 PM – 3:30 PM', duration: 1.5, window: 'Afternoon Focus' },
    // Evening & Night (4:00 PM to 11:00 PM)
    { timeLabel: '4:00 PM – 5:30 PM', duration: 1.5, window: 'Evening Prime' },
    { timeLabel: '5:45 PM – 7:15 PM', duration: 1.5, window: 'Evening Prime' },
    { timeLabel: '7:30 PM – 9:00 PM', duration: 1.5, window: 'Night Focus' },
    { timeLabel: '9:15 PM – 10:45 PM', duration: 1.5, window: 'Night Focus' }
  ];

  const activeWindows = Array.isArray(ob.dailyTimingWindows) && ob.dailyTimingWindows.length > 0
    ? ob.dailyTimingWindows
    : ['Evening Prime (4:00 PM – 7:30 PM IST)', 'Night Focus (7:30 PM – 11:00 PM IST)'];

  const candidatePool = isSchoolOnly ? schoolSlotPool : collegeSlotPool;
  let filteredPool = candidatePool.filter(sp => {
    return activeWindows.some(aw => {
      if (aw.includes('Morning') && sp.window === 'Morning Peak') return true;
      if (aw.includes('Afternoon') && sp.window === 'Afternoon Focus') return true;
      if (aw.includes('Evening') && sp.window === 'Evening Prime') return true;
      if (aw.includes('Night') && sp.window === 'Night Focus') return true;
      if (aw.includes('Weekend') && (sp.window === 'Morning Peak' || sp.window === 'Afternoon Focus')) return true;
      return false;
    });
  });
  if (filteredPool.length < 2) filteredPool = candidatePool; // Fallback to safe compliant pool

  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const newSchedule = {};

  allDays.forEach(day => {
    // STRICT RULE: If day is NOT in activeDays (e.g. Sunday is unselected), schedule 0 slots!
    newSchedule[day] = [];
  });

  // Distribute slots across active days ONLY
  let slotsAssigned = 0;
  const maxSlotsPerDay = Math.min(filteredPool.length, Math.ceil(targetTotalSlots / Math.max(1, activeDays.length)));

  activeDays.forEach((day, dayIdx) => {
    const slotsForThisDay = Math.min(filteredPool.length, Math.max(1, Math.min(maxSlotsPerDay, targetTotalSlots - slotsAssigned)));
    for (let i = 0; i < slotsForThisDay && i < filteredPool.length; i++) {
      const slotDef = filteredPool[i];
      let assignedFormat = '1-on-1';
      if (has1on1 && hasCohort) {
        assignedFormat = (i % 2 === 0) ? '1-on-1' : 'smart-learning';
      } else if (hasCohort) {
        assignedFormat = 'smart-learning';
      }

      const streamName = isSchoolOnly
        ? 'Class 8–10 School Boards (CBSE/ICSE/State • 1.0 Hr/Slot)'
        : (assignedFormat === '1-on-1' ? 'Class 11–12 JEE Main & Adv (PCM • 1.5 Hrs/Slot)' : 'Smart Circles Cohort (Max 30)');

      newSchedule[day].push({
        id: `slot-${day.toLowerCase()}-${i + 1}-${Date.now().toString(36)}`,
        day: day,
        timeLabel: slotDef.timeLabel,
        duration: slotDef.duration,
        format: assignedFormat,
        subject: slotSubject,
        stream: streamName,
        window: slotDef.window,
        status: 'Zero-Clash Verified ✓'
      });
      slotsAssigned++;
    }
  });

  // Re-verify that Sun has NO slots if not in activeDays
  if (!activeDays.includes('Sun')) {
    newSchedule.Sun = [];
  }

  ob.weeklySchedule = newSchedule;

  let totalScheduledHours = 0;
  activeDays.forEach(d => {
    (newSchedule[d] || []).forEach(s => totalScheduledHours += s.duration);
  });

  const sunStatusMsg = activeDays.includes('Sun') ? 'including Sunday' : 'Sunday strictly OFF (0 slots)';
  if (typeof window.showToast === 'function') {
    window.showToast(`✨ AI Zero-Clash Timetable Generated: ${totalScheduledHours}h/week across ${activeDays.length} active days (${sunStatusMsg})!`, 'success');
  }
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

window.setTeacherFormatPreset = function(presetKey) {
  const ob = ensureTeacherOnboardingDefaults();
  if (presetKey === 'both') {
    ob.teachingFormats = ['1-on-1', 'smart-learning'];
    if (typeof window.showToast === 'function') window.showToast('✓ Enabled BOTH 1-on-1 Personal Mentorship & Smart Circles (Max 30) Cohort Batches!', 'success');
  } else if (presetKey === '1-on-1') {
    ob.teachingFormats = ['1-on-1'];
    if (typeof window.showToast === 'function') window.showToast('Selected 1-on-1 Personal Mentorship Format Only.', 'info');
  } else if (presetKey === 'smart-learning') {
    ob.teachingFormats = ['smart-learning'];
    if (typeof window.showToast === 'function') window.showToast('Selected Smart Circles (Cohort Batches) Only.', 'info');
  }
  notifyStateChange();
};

window.toggleTeacherAvailableDay = function(day) {
  const ob = ensureTeacherOnboardingDefaults();
  if (!Array.isArray(ob.availableDays)) ob.availableDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const idx = ob.availableDays.indexOf(day);
  if (idx >= 0) {
    if (ob.availableDays.length > 1) {
      ob.availableDays.splice(idx, 1);
      // Immediately clear all slots on this day so unselected day has 0 slots!
      if (!ob.weeklySchedule) ob.weeklySchedule = {};
      ob.weeklySchedule[day] = [];
      if (ob.activeScheduleDayTab === day) {
        ob.activeScheduleDayTab = ob.availableDays[0] || 'Mon';
      }
      if (typeof window.showToast === 'function') {
        window.showToast(`✓ Removed ${day} from availability. All ${day} slots cleared (0 slots).`, 'info');
      }
    } else if (typeof window.showToast === 'function') {
      window.showToast('At least one available day required.', 'warning');
    }
  } else {
    ob.availableDays.push(day);
    if (!ob.weeklySchedule) ob.weeklySchedule = {};
    if (!ob.weeklySchedule[day]) ob.weeklySchedule[day] = [];
    if (typeof window.showToast === 'function') {
      window.showToast(`✓ Added ${day} to teaching availability!`, 'success');
    }
  }
  notifyStateChange();
};

window.toggleTeacherTimingWindow = function(win) {
  const ob = ensureTeacherOnboardingDefaults();
  if (!Array.isArray(ob.dailyTimingWindows)) ob.dailyTimingWindows = [];
  const idx = ob.dailyTimingWindows.indexOf(win);
  if (idx >= 0) {
    if (ob.dailyTimingWindows.length > 1) ob.dailyTimingWindows.splice(idx, 1);
    else if (typeof window.showToast === 'function') window.showToast('At least one timing window required.', 'warning');
  } else {
    ob.dailyTimingWindows.push(win);
  }
  notifyStateChange();
};

window.toggleTeacherFormat = function(formatKey) {
  const ob = ensureTeacherOnboardingDefaults();
  if (!Array.isArray(ob.teachingFormats)) ob.teachingFormats = ['1-on-1', 'smart-learning'];
  const idx = ob.teachingFormats.indexOf(formatKey);
  if (idx >= 0) {
    if (ob.teachingFormats.length > 1) {
      ob.teachingFormats.splice(idx, 1);
    } else {
      if (typeof window.showToast === 'function') window.showToast('At least one teaching format must remain selected. You can select both!', 'warning');
      return;
    }
  } else {
    ob.teachingFormats.push(formatKey);
  }
  if (typeof window.showToast === 'function') {
    const isBoth = ob.teachingFormats.includes('1-on-1') && ob.teachingFormats.includes('smart-learning');
    window.showToast(isBoth ? '✓ Both 1-on-1 & Smart Circles Cohort Batches Active!' : `Updated Teaching Format: ${ob.teachingFormats.join(', ')}`, 'success');
  }
  notifyStateChange();
};

window.toggleTeacherStream = function(streamLabel) {
  const ob = ensureTeacherOnboardingDefaults();
  if (!Array.isArray(ob.academicStreams)) ob.academicStreams = [];
  const idx = ob.academicStreams.indexOf(streamLabel);
  if (idx >= 0) ob.academicStreams.splice(idx, 1);
  else ob.academicStreams.push(streamLabel);
  notifyStateChange();
};

window.toggleTeacherSubject = function(subjectName) {
  const ob = ensureTeacherOnboardingDefaults();
  if (!Array.isArray(ob.subjects)) ob.subjects = [];
  const idx = ob.subjects.indexOf(subjectName);
  if (idx >= 0) ob.subjects.splice(idx, 1);
  else ob.subjects.push(subjectName);
  notifyStateChange();
};

window.toggleTeacherBoard = function(boardName) {
  const ob = ensureTeacherOnboardingDefaults();
  if (!Array.isArray(ob.boards)) ob.boards = [];
  const idx = ob.boards.indexOf(boardName);
  if (idx >= 0) ob.boards.splice(idx, 1);
  else ob.boards.push(boardName);
  notifyStateChange();
};

// Submit Stage 1 and Push Live to Admin Review Queue
window.submitCandidateApplicationToPortal = function() {
  const ob = ensureTeacherOnboardingDefaults();
  const name = (ob.fullName || '').trim() || 'Faculty Applicant';
  const email = (ob.email || '').trim() || 'applicant@joinsiko.com';

  if (!ob.fullName) {
    ob.fullName = name;
    ob.email = email;
    ob.phone = '+91 98201 44510';
  }

  // Push into live Admin Panel review queue
  if (!AppState.adminData) AppState.adminData = {};
  if (!Array.isArray(AppState.adminData.pendingTeacherApplications)) {
    AppState.adminData.pendingTeacherApplications = [];
  }

  const appRecord = {
    id: 'app-' + (ob.candidateId || 'new'),
    candidateId: ob.candidateId,
    name: ob.fullName,
    email: ob.email,
    phone: ob.phone,
    city: ob.city || 'New Delhi',
    highestDegree: ob.highestDegree || 'Post-Graduate / Ph.D.',
    experienceYears: ob.experienceYears || '10+ years',
    subject: (ob.subjects || ['Physics']).join(', ') + ' (' + (ob.boards || ['CBSE']).join(', ') + ')',
    tier: ob.selectedTier || 'Master',
    expectedHourlyRate: ob.expectedHourlyRate || 2200,
    sikoFinalizedRate: ob.sikoFinalizedRate || 2250,
    status: 'Intake Submitted • Awaiting Dean Review',
    submittedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
  };

  const existingIdx = AppState.adminData.pendingTeacherApplications.findIndex(a => a.candidateId === ob.candidateId || a.name === ob.fullName);
  if (existingIdx >= 0) {
    AppState.adminData.pendingTeacherApplications[existingIdx] = { ...AppState.adminData.pendingTeacherApplications[existingIdx], ...appRecord };
  } else {
    AppState.adminData.pendingTeacherApplications.unshift(appRecord);
  }

  ob.currentStep = 2;
  ob.applicantStage = 2;

  if (typeof window.showToast === 'function') {
    window.showToast(`✅ Stage 1 Submitted! Record live in Admin Review Queue. Advancing to Stage 2: KYC Dossier...`, 'success');
  }
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

window.attachCandidateDocumentInPortal = function(docKey) {
  const ob = ensureTeacherOnboardingDefaults();
  if (!ob.attachedDocs) ob.attachedDocs = {};

  const map = {
    cvResume: { fileName: `${(ob.fullName || 'Educator').replace(/[^a-zA-Z]/g, '_')}_Academic_CV.pdf`, size: '1.4 MB' },
    degreeCert: { fileName: 'Doctoral_PostGraduate_Degree_Transcripts.pdf', size: '2.3 MB' },
    govtIdPan: { fileName: 'Aadhaar_PAN_KYC_Verified.pdf', size: '890 KB' },
    demoVideo: { fileName: '10Min_Whiteboard_Derivation_Demo.mp4', size: '52.4 MB' }
  };

  const sample = map[docKey] || { fileName: 'Document_Uploaded.pdf', size: '1.2 MB' };
  ob.attachedDocs[docKey] = {
    attached: true,
    fileName: sample.fileName,
    size: sample.size,
    status: '✓ Attached in Portal'
  };

  if (typeof window.showToast === 'function') {
    window.showToast(`📎 ${sample.fileName} successfully attached to candidate profile.`, 'success');
  }
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

window.handleTeacherPhotoUpload = function(event) {
  const file = event.target && event.target.files && event.target.files[0];
  if (!file) return;
  const ob = ensureTeacherOnboardingDefaults();
  const reader = new FileReader();
  reader.onload = function(e) {
    ob.profilePhotoUrl = e.target.result;
    ob.profilePhotoFileName = file.name;
    ob.profilePhotoSize = (file.size / 1024).toFixed(1) + ' KB';
    ob.profilePhotoUploadedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';

    // Synchronize into AppState.teachers and faculty roster so student selection uses this exact photo!
    if (AppState.teachers && Array.isArray(AppState.teachers)) {
      const match = AppState.teachers.find(t => t.id === ob.candidateId || t.name === ob.fullName);
      if (match) match.avatar = ob.profilePhotoUrl;
    }

    if (typeof window.showToast === 'function') {
      window.showToast(`📸 Official Faculty Photo uploaded: ${file.name} (${ob.profilePhotoSize})`, 'success');
    }
    if (typeof window.renderApp === 'function') window.renderApp();
    else notifyStateChange();
  };
  reader.readAsDataURL(file);
};

window.setTeacherSamplePhoto = function() {
  const ob = ensureTeacherOnboardingDefaults();
  const primarySubj = (ob.subjects && ob.subjects[0]) || ob.primarySubject || 'Physics';
  const subjKey = String(primarySubj).toLowerCase();
  const sampleMap = {
    physics: 'assets/teachers/teacher_physics_indian.png',
    chemistry: 'assets/teachers/teacher_chemistry_indian.png',
    mathematics: 'assets/teachers/teacher_mathematics_indian.png',
    biology: 'assets/teachers/teacher_biology_indian.png'
  };
  const chosenSample = sampleMap[subjKey] || 'assets/teachers/teacher_physics_indian.png';
  ob.profilePhotoUrl = chosenSample;
  ob.profilePhotoFileName = `Verified_${primarySubj}_Faculty_Profile.png`;
  ob.profilePhotoSize = '715 KB';
  ob.profilePhotoUploadedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';

  if (typeof window.showToast === 'function') {
    window.showToast(`✨ Verified Indian Faculty Hero Photo set for ${primarySubj}!`, 'success');
  }
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

window.removeTeacherPhoto = function() {
  const ob = ensureTeacherOnboardingDefaults();
  ob.profilePhotoUrl = null;
  ob.profilePhotoFileName = null;
  ob.profilePhotoSize = null;
  if (typeof window.showToast === 'function') {
    window.showToast('🗑️ Photo removed from candidate profile.', 'info');
  }
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

window.triggerPostSelectionOfferEmailToCandidate = function() {
  const ob = ensureTeacherOnboardingDefaults();
  ob.applicationDecisionStatus = 'SELECTED';
  ob.selectionEmailTriggered = true;
  ob.selectionEmailTriggeredAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  ob.currentStep = 6;
  ob.applicantStage = 6;

  if (typeof window.showToast === 'function') {
    window.showToast(`🎉 Formal Selection Offer Letter unlocked at ₹${ob.sikoFinalizedRate.toLocaleString('en-IN')}/hr!`, 'success');
  }
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

window.affirmPostSelectionEmailAndReturnToPortal = function() {
  const ob = ensureTeacherOnboardingDefaults();
  ob.offerAcceptedByTeacher = true;
  ob.offerAcceptedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  ob.offerAcceptanceId = 'OFR-ACCEPT-' + (ob.candidateId || '8419');
  ob.currentStep = 7;
  ob.applicantStage = 7;

  if (typeof window.showToast === 'function') {
    window.showToast(`✅ Selection Offer Accepted! Advancing to Stage 7: Academic Term Contract & Escrow Milestones.`, 'success');
  }
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

window.signTeacherAgreementAndAdvance = function() {
  const ob = ensureTeacherOnboardingDefaults();
  ob.agreementSigned = true;
  ob.agreementSignedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  ob.agreementEventId = 'AGR-E-SIGN-2026-' + (Math.floor(Math.random() * 8999) + 1000);
  ob.currentStep = 9;
  ob.applicantStage = 9;

  if (typeof window.showToast === 'function') {
    window.showToast(`✍️ Digital Faculty Agreement Signed under IT Act Sec 10A! Advancing to Stage 9: Mandatory Orientation.`, 'success');
  }
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

window.toggleTeacherOrientationModule = function(modKey) {
  const ob = ensureTeacherOnboardingDefaults();
  if (!ob.orientationModules) ob.orientationModules = {};
  ob.orientationModules[modKey] = !ob.orientationModules[modKey];
  notifyStateChange();
};

window.completeTeacherOrientationAndLaunchPortal = function() {
  const ob = ensureTeacherOnboardingDefaults();
  ob.orientationDone = true;
  ob.currentStep = 10;
  ob.applicantStage = 10;

  if (typeof window.showToast === 'function') {
    window.showToast(`🎓 Orientation complete! SIKO Accredited Badge Issued. Stage 10 Live Hub Activated!`, 'success');
  }
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

window.launchLiveEducatorDashboard = function() {
  AppState.currentRole = 'teacher';
  if (!AppState.currentUser) {
    AppState.isLoggedIn = true;
    AppState.currentUser = {
      id: 'teacher-physics',
      name: 'Dedicated Master Faculty',
      role: 'teacher',
      email: 'faculty@joinsiko.com',
      avatar: 'assets/teachers/teacher_physics_indian.jpg',
      badge: 'Dedicated Master Faculty • Ph.D. IIT Delhi'
    };
  }
  window.navigateView('teacher-dashboard');
  if (typeof window.showToast === 'function') {
    window.showToast('🚀 Live Educator Command Hub Launched! Viewing Assigned Batches & Smart Circles.', 'success');
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN VIEW RENDERER
// ─────────────────────────────────────────────────────────────────────────────
export function renderTeacherOnboarding() {
  const ob = ensureTeacherOnboardingDefaults();
  const step = Number(ob.currentStep) || 1;

  const stepsList = [
    { num: 1, label: 'Intake', sub: 'Profile & Streams', icon: '📝' },
    { num: 2, label: 'KYC Dossier', sub: 'Degrees & ID', icon: '📄' },
    { num: 3, label: 'Video Demo', sub: '10-Min Whiteboard', icon: '🎥' },
    { num: 4, label: 'Dean Rubric', sub: 'Scoring /40', icon: '📊' },
    { num: 5, label: 'Tech Viva', sub: 'Subject Head Viva', icon: '🎙️' },
    { num: 6, label: 'Formal Offer', sub: 'Honorarium Lock', icon: '📜' },
    { num: 7, label: 'ATC Escrow', sub: '50/25/25 Milestones', icon: '💼' },
    { num: 8, label: 'Legal e-Sign', sub: '21-Sec Agreement', icon: '✍️' },
    { num: 9, label: 'Orientation', sub: '3 Setup Modules', icon: '🎓' },
    { num: 10, label: 'Live Hub', sub: 'Accredited Portal', icon: '🚀' }
  ];

  return `
    <div class="container py-6 max-w-7xl">
      <!-- TOP ACTION BAR & TESTING CONTROLS -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
        <div class="flex items-center gap-2 flex-wrap">
          <button type="button" onclick="window.fastFillTeacherSample()"
            class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs cursor-pointer border-0 shadow-sm flex items-center gap-1.5">
            <span>⚡ Fast-Fill Sample (Faculty Candidate • IIT Delhi)</span>
          </button>
          <button type="button" onclick="window.resetTeacherFormToFresh()"
            class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border border-slate-300">
            ↺ Reset to Plain Fresh State
          </button>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <button type="button" onclick="window.switchRole('admin'); window.setAdminTab('applications');"
            class="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-extrabold text-2xs cursor-pointer">
            🏛️ View in Admin Review Queue &rarr;
          </button>
          <button type="button" onclick="window.launchLiveEducatorDashboard()"
            class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-2xs cursor-pointer border-0">
            🚀 Open Live Educator Hub &rarr;
          </button>
        </div>
      </div>

      <!-- MAIN BANNER & STEPPER CONTAINER -->
      <div class="card p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-2xl mb-6 border border-indigo-500/30 shadow-lg">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 flex-wrap mb-2">
              <span class="px-3 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-2xs uppercase tracking-wider">
                SIKO Faculty Selection &amp; Accreditation Protocol
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 border border-white/15 font-mono text-2xs">
                Candidate ID: ${ob.candidateId || 'SIKO-CAND-2026-8419'}
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-2xs">
                Stage ${step} of 10
              </span>
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight">
              ${ob.fullName ? `Welcome, ${ob.fullName}` : 'SIKO Educator Joining & Accreditation Protocol'}
            </h1>
            <p class="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Complete the comprehensive 9-stage faculty induction process: Academic Intake &rarr; KYC Dossier &rarr; 10-Min Video Demo &rarr; Dean Rubric &rarr; Tech Viva &rarr; Formal Offer &rarr; ATC Escrow &rarr; Legal e-Sign &rarr; Platform Orientation &rarr; Live Hub Activation.
            </p>
          </div>
        </div>

        <!-- AUTHENTIC 10-STEP INTERACTIVE STEPPER -->
        <div class="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mt-6 pt-5 border-t border-white/15 text-xs">
          ${stepsList.map(st => {
            const isActive = step === st.num;
            const isDone = step > st.num;
            return `
              <button type="button" onclick="window.setTeacherOnboardingStep(${st.num})"
                class="p-2 rounded-xl text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-500/30 border-2 border-emerald-400 text-white shadow-xs'
                    : isDone
                      ? 'bg-white/10 border-emerald-400/40 text-emerald-200 hover:bg-white/15'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-3xs font-black ${isActive ? 'text-emerald-300' : isDone ? 'text-emerald-300' : 'text-slate-400'}">${st.icon} ${st.num}</span>
                  <span class="w-4 h-4 rounded-full flex items-center justify-center text-3xs font-bold ${isActive || isDone ? 'bg-emerald-400 text-slate-950' : 'bg-white/10 text-slate-400'}">
                    ${isDone ? '✓' : st.num}
                  </span>
                </div>
                <div class="font-extrabold text-2xs leading-tight ${isActive ? 'text-white' : 'text-slate-200'}">${st.label}</div>
                <div class="text-3xs text-slate-400 truncate mt-0.5">${st.sub}</div>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- MAIN STAGE RENDER CARD -->
      <div class="card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
        ${renderTeacherOnboardingStepContent(step, ob)}
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP CONTENT SWITCHER (1 TO 10)
// ─────────────────────────────────────────────────────────────────────────────
function renderTeacherOnboardingStepContent(step, ob) {
  switch (step) {
    case 1: return renderStage1Intake(ob);
    case 2: return renderStage2KycDossier(ob);
    case 3: return renderStage3VideoDemo(ob);
    case 4: return renderStage4DeanRubric(ob);
    case 5: return renderStage5TechnicalViva(ob);
    case 6: return renderStage6FormalOffer(ob);
    case 7: return renderStage7AtcEscrow(ob);
    case 8: return renderStage8LegalESign(ob);
    case 9: return renderStage9Orientation(ob);
    case 10: return renderStage10LivePortal(ob);
    default: return renderStage1Intake(ob);
  }
}

// ─── STAGE 1: EDUCATOR APPLICATION & STREAM INTAKE ───
function renderStage1Intake(ob) {
  const separateAcademicStreams = [
    { label: 'Class 8–10 School Boards (CBSE/ICSE/State • 1.0 Hr/Slot)', badge: '1.0 Hr / Lecture Slot', group: 'Class 8th–10th' },
    { label: 'Class 8–10 Competitive Olympiads (IMO/NSO/IOQM/NTSE • 1.5 Hrs/Slot)', badge: '1.5 Hrs / Lecture Slot', group: 'Class 8th–10th' },
    { label: 'Class 11–12 JEE Main & Adv / MHT-CET (PCM • 1.5 Hrs/Slot)', badge: '1.5 Hrs / Lecture Slot', group: 'Class 11th–12th' },
    { label: 'Class 11–12 NEET UG Medical (PCB • 1.5 Hrs/Slot)', badge: '1.5 Hrs / Lecture Slot', group: 'Class 11th–12th' },
    { label: 'Class 11–12 Senior School Boards (CBSE/ISC/HSC • 1.5 Hrs/Slot)', badge: '1.5 Hrs / Lecture Slot', group: 'Class 11th–12th' }
  ];
  const allSubjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Computer Science'];
  const allBoards = ['CBSE', 'ICSE / ISC', 'Maharashtra State Board', 'JEE Main & Advanced', 'NEET UG', 'MHT-CET', 'National Olympiads'];

  return `
    <div class="space-y-6">
      <div class="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
        <div>
          <span class="text-2xs font-extrabold uppercase tracking-wider text-blue-700 block">Stage 1 of 10 • Educator Application &amp; Academic Intake</span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Faculty Intake &amp; Teaching Domain Preferences</h2>
          <p class="text-xs text-slate-500 mt-1">
            Provide your academic background, select your teaching streams (1.0h vs 1.5h slot rules), expected honorarium, and weekly availability.
          </p>
        </div>
        <button type="button" onclick="window.fastFillTeacherSample()" class="btn btn-secondary btn-xs font-bold">
          ⚡ Fast-Fill Sample (Faculty Candidate)
        </button>
      </div>

      <!-- PERSONAL & ACADEMIC CREDENTIALS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Full Legal Name *</label>
          <input id="teacher-full-name" type="text" class="w-full p-2.5 rounded-lg border border-slate-300 font-semibold bg-white"
            placeholder="Enter Your Full Legal Name" value="${ob.fullName || ''}"
            oninput="window.updateTeacherIntakeField('fullName', this.value, false)"
            onblur="window.updateTeacherIntakeField('fullName', this.value, true)" />
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Official / Institutional Email *</label>
          <input id="teacher-email" type="email" class="w-full p-2.5 rounded-lg border border-slate-300 font-semibold bg-white"
            placeholder="Enter Official Email (e.g. yourname@joinsiko.com)" value="${ob.email || ''}"
            oninput="window.updateTeacherIntakeField('email', this.value, false)"
            onblur="window.updateTeacherIntakeField('email', this.value, true)" />
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Mobile Phone (WhatsApp Active) *</label>
          <input id="teacher-phone" type="tel" class="w-full p-2.5 rounded-lg border border-slate-300 font-semibold bg-white"
            placeholder="e.g. +91 98201 44510" value="${ob.phone || ''}"
            oninput="window.updateTeacherIntakeField('phone', this.value, false)"
            onblur="window.updateTeacherIntakeField('phone', this.value, true)" />
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Current Base City &amp; State</label>
          <input id="teacher-city" type="text" class="w-full p-2.5 rounded-lg border border-slate-300 font-semibold bg-white"
            placeholder="e.g. New Delhi / IIT Delhi Campus" value="${ob.city || ''}"
            oninput="window.updateTeacherIntakeField('city', this.value, false)"
            onblur="window.updateTeacherIntakeField('city', this.value, true)" />
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Highest Academic Qualification</label>
          <input id="teacher-highest-degree" type="text" class="w-full p-2.5 rounded-lg border border-slate-300 font-semibold bg-white"
            placeholder="e.g. Ph.D. Physics (IIT Delhi), M.Sc." value="${ob.highestDegree || ''}"
            oninput="window.updateTeacherIntakeField('highestDegree', this.value, false)"
            onblur="window.updateTeacherIntakeField('highestDegree', this.value, true)" />
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Prior Institutional Affiliations</label>
          <input id="teacher-institutions" type="text" class="w-full p-2.5 rounded-lg border border-slate-300 font-semibold bg-white"
            placeholder="e.g. Ex-Allen Kota, FIITJEE South Delhi" value="${ob.institutions || ''}"
            oninput="window.updateTeacherIntakeField('institutions', this.value, false)"
            onblur="window.updateTeacherIntakeField('institutions', this.value, true)" />
        </div>
      </div>

      <!-- SEPARATE TEACHING FORMAT SELECTION (SELECT ONE OR BOTH) -->
      <div class="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-blue-50/70 to-slate-50 border-2 border-indigo-300/80 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div class="flex items-center gap-2">
              <strong class="text-sm font-black text-indigo-950">Select Teaching Formats You Wish to Teach:</strong>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-3xs font-black tracking-wide uppercase">
                Both Supported in Parallel
              </span>
            </div>
            <p class="text-xs text-slate-600 mt-0.5">
              SIKO educators can lead <strong>1-on-1 Personal Mentorship</strong>, <strong>Smart Circles (Cohort Batches, strictly max 30 students)</strong>, or <strong>BOTH simultaneously</strong> for maximum time utilization and highest earnings.
            </p>
          </div>

          <!-- 1-Click Fast Format Presets -->
          <div class="flex items-center gap-1.5 flex-wrap shrink-0">
            <button type="button" onclick="window.setTeacherFormatPreset('both')"
              class="px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition border ${
                Array.isArray(ob.teachingFormats) && ob.teachingFormats.includes('1-on-1') && ob.teachingFormats.includes('smart-learning')
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-indigo-900 border-indigo-300 hover:bg-indigo-50'
              }">
              ⚡ Teach BOTH Formats
            </button>
            <button type="button" onclick="window.setTeacherFormatPreset('1-on-1')"
              class="px-2.5 py-1.5 rounded-xl text-2xs font-extrabold cursor-pointer transition border ${
                Array.isArray(ob.teachingFormats) && ob.teachingFormats.length === 1 && ob.teachingFormats[0] === '1-on-1'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }">
              1-on-1 Only
            </button>
            <button type="button" onclick="window.setTeacherFormatPreset('smart-learning')"
              class="px-2.5 py-1.5 rounded-xl text-2xs font-extrabold cursor-pointer transition border ${
                Array.isArray(ob.teachingFormats) && ob.teachingFormats.length === 1 && ob.teachingFormats[0] === 'smart-learning'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }">
              Cohort Batches Only
            </button>
          </div>
        </div>

        <!-- TWO INTERACTIVE FORMAT CARDS -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2">
          <!-- CARD 1: 1-on-1 Mentorship -->
          ${(() => {
            const has1on1 = Array.isArray(ob.teachingFormats) && ob.teachingFormats.includes('1-on-1');
            return `
              <div class="p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                has1on1 ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-500/30' : 'bg-slate-50 border-slate-200 text-slate-500'
              }">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-1.5">
                    <div class="flex items-center gap-2">
                      <span class="text-base">👤</span>
                      <strong class="text-sm ${has1on1 ? 'text-indigo-950 font-black' : 'text-slate-700 font-bold'}">1-on-1 Personal Mentorship</strong>
                    </div>
                    <span class="px-2 py-0.5 rounded text-3xs font-extrabold ${has1on1 ? 'bg-indigo-100 text-indigo-900 border border-indigo-300' : 'bg-slate-200 text-slate-600'}">
                      ${has1on1 ? '✓ Active' : 'Disabled'}
                    </span>
                  </div>
                  <p class="text-2xs ${has1on1 ? 'text-slate-600' : 'text-slate-400'} leading-relaxed mb-3">
                    Individual student pacing, personalized derivations, deep diagnostic reviews, and 100% focused attention.
                  </p>
                </div>
                <button type="button" onclick="window.toggleTeacherFormat('1-on-1')"
                  class="w-full py-2 px-3 rounded-lg text-xs font-black cursor-pointer transition border flex items-center justify-center gap-1.5 ${
                    has1on1
                      ? 'bg-indigo-50 text-indigo-900 border-indigo-400 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                      : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 shadow-xs'
                  }">
                  <span>${has1on1 ? '☑ 1-on-1 Enabled (Click to Toggle)' : '+ Enable 1-on-1 Mentorship'}</span>
                </button>
              </div>
            `;
          })()}

          <!-- CARD 2: Smart Circles (Max 30 Cohort Batches) -->
          ${(() => {
            const hasBatch = Array.isArray(ob.teachingFormats) && ob.teachingFormats.includes('smart-learning');
            return `
              <div class="p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                hasBatch ? 'bg-white border-emerald-600 shadow-sm ring-1 ring-emerald-500/30' : 'bg-slate-50 border-slate-200 text-slate-500'
              }">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-1.5">
                    <div class="flex items-center gap-2">
                      <span class="text-base">👥</span>
                      <strong class="text-sm ${hasBatch ? 'text-emerald-950 font-black' : 'text-slate-700 font-bold'}">Smart Circles (Max 30 Cohort Batches)</strong>
                    </div>
                    <span class="px-2 py-0.5 rounded text-3xs font-extrabold ${hasBatch ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-200 text-slate-600'}">
                      ${hasBatch ? '✓ Active' : 'Disabled'}
                    </span>
                  </div>
                  <p class="text-2xs ${hasBatch ? 'text-slate-600' : 'text-slate-400'} leading-relaxed mb-3">
                    High-energy cohort batches capped strictly at 30 students. Structured curriculum sprints, peer problem solving, and group derivations.
                  </p>
                </div>
                <button type="button" onclick="window.toggleTeacherFormat('smart-learning')"
                  class="w-full py-2 px-3 rounded-lg text-xs font-black cursor-pointer transition border flex items-center justify-center gap-1.5 ${
                    hasBatch
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-400 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                      : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-xs'
                  }">
                  <span>${hasBatch ? '☑ Smart Circles Enabled (Click to Toggle)' : '+ Enable Smart Circles (Max 30)'}</span>
                </button>
              </div>
            `;
          })()}
        </div>

        <!-- Format Status Callout Banner -->
        <div class="mt-3.5 p-3 rounded-xl ${
          Array.isArray(ob.teachingFormats) && ob.teachingFormats.includes('1-on-1') && ob.teachingFormats.includes('smart-learning')
            ? 'bg-emerald-50 border border-emerald-300 text-emerald-950'
            : 'bg-blue-50 border border-blue-200 text-blue-950'
        } text-2xs flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="text-sm">🎯</span>
            <div>
              <strong>Active Teaching Format:</strong>
              ${
                Array.isArray(ob.teachingFormats) && ob.teachingFormats.includes('1-on-1') && ob.teachingFormats.includes('smart-learning')
                  ? '<strong>DUAL FORMAT ENABLED</strong> (Leading both 1-on-1 Personal Mentorship &amp; Smart Circles). AI Timetable balances 60% 1-on-1 + 40% Smart Circles.'
                  : ob.teachingFormats.includes('1-on-1')
                    ? '<strong>1-on-1 Mentorship Only</strong> (100% of available hours scheduled for dedicated 1-on-1 students).'
                    : '<strong>Smart Circles Only</strong> (100% of available hours scheduled for group cohort batches max 30 students).'
              }
            </div>
          </div>
          <span class="font-extrabold ${ob.teachingFormats?.length > 1 ? 'text-emerald-700' : 'text-blue-700'}">
            ${ob.teachingFormats?.length || 2} Format(s) Selected
          </span>
        </div>
      </div>

      <!-- SEPARATE ACADEMIC STREAM SELECTION -->
      <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div class="flex items-center justify-between mb-2">
          <strong class="text-xs text-slate-900">Select Academic Streams You Are Qualified &amp; Available to Teach:</strong>
          <span class="badge badge-primary text-3xs">Strict Slot Rules Enforced</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-2">
          ${separateAcademicStreams.map(st => {
            const isChecked = Array.isArray(ob.academicStreams) && ob.academicStreams.includes(st.label);
            return `
              <label class="p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                isChecked ? 'bg-blue-50/80 border-blue-500 font-bold text-blue-950' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }">
                <div class="flex items-center gap-2.5">
                  <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="window.toggleTeacherStream('${st.label}')" />
                  <span>${st.label}</span>
                </div>
                <span class="badge ${isChecked ? 'badge-primary' : 'badge-neutral'} text-3xs">${st.badge}</span>
              </label>
            `;
          }).join('')}
        </div>
      </div>

      <!-- SUBJECTS & BOARDS -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <strong class="text-xs text-slate-900 block mb-2">Teaching Subjects:</strong>
          <div class="flex flex-wrap gap-2">
            ${allSubjects.map(sub => {
              const isChecked = Array.isArray(ob.subjects) && ob.subjects.includes(sub);
              return `
                <button type="button" onclick="window.toggleTeacherSubject('${sub}')"
                  class="px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition ${
                    isChecked ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300'
                  }">
                  ${isChecked ? '✓ ' : '+ '}${sub}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <strong class="text-xs text-slate-900 block mb-2">Target Boards &amp; Competitive Exams:</strong>
          <div class="flex flex-wrap gap-2">
            ${allBoards.map(bd => {
              const isChecked = Array.isArray(ob.boards) && ob.boards.includes(bd);
              return `
                <button type="button" onclick="window.toggleTeacherBoard('${bd}')"
                  class="px-2.5 py-1.5 rounded-lg border text-2xs font-bold cursor-pointer transition ${
                    isChecked ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300'
                  }">
                  ${isChecked ? '✓ ' : '+ '}${bd}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- AVAILABLE DAYS & TIMINGS + AI MAXIMUM TIME UTILIZATION ENGINE -->
      <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white border-2 border-emerald-500/50 shadow-md space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/15">
          <div>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-3xs font-extrabold uppercase tracking-wider">
              🤖 SIKO AI Faculty Timetable &amp; Maximum Utilization Engine
            </span>
            <h3 class="text-base sm:text-lg font-black text-white mt-1">
              Weekly Teaching Availability, Days &amp; AI Schedule Optimizer
            </h3>
            <p class="text-2xs text-slate-300 mt-0.5">
              Declare your available teaching days, daily timing windows, and weekly hours. SIKO's AI engine automatically designs your timetable to ensure <strong>100% of your declared time is utilized</strong> with zero idle gaps or student clashes.
            </p>
          </div>
          <span class="badge badge-success text-2xs font-extrabold">⚡ 100% Target Utilization</span>
        </div>

        <!-- 1. Available Teaching Days Selector -->
        <div>
          <label class="block text-2xs font-extrabold text-emerald-300 uppercase tracking-wider mb-2">
            1. Select Your Available Teaching Days:
          </label>
          <div class="flex flex-wrap gap-2">
            ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
              const days = Array.isArray(ob.availableDays) ? ob.availableDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const isSel = days.includes(day);
              return `
                <button type="button" onclick="window.toggleTeacherAvailableDay('${day}')"
                  class="px-3 py-1.5 rounded-lg border text-xs font-black cursor-pointer transition ${
                    isSel ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs' : 'bg-white/10 text-slate-300 border-white/20 hover:border-white/40'
                  }">
                  ${isSel ? '✓ ' : '+ '}${day}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2. Available Daily Timing Windows with Section Rules -->
        <div>
          ${(() => {
            const isSchool = (ob.academicStreams || []).some(s => s.includes('Class 8–10')) ||
                             (ob.standards || []).some(st => ['Class 8', 'Class 9', 'Class 10'].includes(st));
            const isCollege = (ob.academicStreams || []).some(s => s.includes('Class 11–12') || s.includes('JEE') || s.includes('NEET') || s.includes('MHT-CET')) ||
                              (ob.standards || []).some(st => ['Class 11', 'Class 12'].includes(st));
            const isSchoolOnly = isSchool && !isCollege;

            const timingOptions = isSchoolOnly ? [
              { key: 'Evening Prime (4:00 PM – 7:30 PM IST)', label: 'Evening Prime', time: '4:00 PM – 7:30 PM IST', badge: 'School Section Standard (1.0h)' },
              { key: 'Night Focus (7:30 PM – 11:00 PM IST)', label: 'Night Focus', time: '7:30 PM – 11:00 PM IST', badge: 'Homework & Problem Solving (1.0h)' }
            ] : [
              { key: 'Morning Peak (7:00 AM – 11:00 AM IST)', label: 'Morning Peak', time: '7:00 AM – 11:00 AM IST', badge: 'College / Droppers / Integrated' },
              { key: 'Afternoon Focus (11:30 AM – 3:30 PM IST)', label: 'Afternoon Focus', time: '11:30 AM – 3:30 PM IST', badge: 'College Sprints & Doubts' },
              { key: 'Evening Prime (4:00 PM – 7:30 PM IST)', label: 'Evening Prime', time: '4:00 PM – 7:30 PM IST', badge: 'Peak Student Demand (1.5h)' },
              { key: 'Night Focus (7:30 PM – 11:00 PM IST)', label: 'Night Focus', time: '7:30 PM – 11:00 PM IST', badge: 'Advanced PYQ Marathon (1.5h)' }
            ];

            return `
              <div class="flex items-center justify-between flex-wrap gap-2 mb-2">
                <label class="block text-2xs font-extrabold text-emerald-300 uppercase tracking-wider">
                  2. Select Available Timing Windows:
                </label>
                <span class="text-3xs px-2 py-0.5 rounded font-extrabold ${isSchoolOnly ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'}">
                  ${isSchoolOnly ? '🏫 School Section: Strictly 4:00 PM to 11:00 PM Night' : '🎓 College Section: Morning, Afternoon & 4–11 PM Evening/Night'}
                </span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${timingOptions.length} gap-2.5 text-xs">
                ${timingOptions.map(w => {
                  const wins = Array.isArray(ob.dailyTimingWindows) ? ob.dailyTimingWindows : ['Evening Prime (4:00 PM – 7:30 PM IST)', 'Night Focus (7:30 PM – 11:00 PM IST)'];
                  const isSel = wins.some(win => win.includes(w.label) || win === w.key);
                  return `
                    <label class="p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSel ? 'bg-white/15 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }">
                      <div class="flex items-center justify-between">
                        <span class="font-black text-xs ${isSel ? 'text-white' : 'text-slate-300'}">${w.label}</span>
                        <input type="checkbox" class="accent-emerald-500 w-4 h-4 cursor-pointer" ${isSel ? 'checked' : ''} onchange="window.toggleTeacherTimingWindow('${w.key}')" />
                      </div>
                      <div class="text-3xs font-mono text-emerald-300">${w.time}</div>
                      <span class="badge ${isSel ? 'badge-success' : 'badge-neutral'} text-3xs">${w.badge}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            `;
          })()}
        </div>

        <!-- 3. Declared Weekly Hours & Accurate AI Monthly Honorarium Breakdown -->
        ${(() => {
          let weeklyScheduledHours = 0;
          if (ob.weeklySchedule) {
            (ob.availableDays || []).forEach(d => {
              if (Array.isArray(ob.weeklySchedule[d])) {
                ob.weeklySchedule[d].forEach(s => {
                  weeklyScheduledHours += Number(s.duration) || 1.5;
                });
              }
            });
          }
          const effectiveWeeklyHours = weeklyScheduledHours > 0 ? weeklyScheduledHours : (Number(ob.declaredWeeklyHours) || 24);
          const monthlyTeachingHours = Math.round(effectiveWeeklyHours * 4); // Standard 4-week academic cycle
          const effectiveHourlyRate = Math.min(2500, Math.max(500, Number(ob.expectedHourlyRate) || 2200));
          const projectedMonthlyHonorarium = monthlyTeachingHours * effectiveHourlyRate;
          const m1Escrow = Math.round(projectedMonthlyHonorarium * 0.50);
          const m2Escrow = Math.round(projectedMonthlyHonorarium * 0.25);
          const m3Escrow = projectedMonthlyHonorarium - m1Escrow - m2Escrow;

          return `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div class="p-3.5 rounded-xl bg-white/10 border border-white/15">
                <label class="block font-extrabold text-emerald-300 text-2xs uppercase mb-1">Declared Weekly Teaching Workload</label>
                <select class="w-full p-2.5 rounded-lg border border-emerald-400 font-black bg-slate-900 text-white text-xs"
                  onchange="window.updateTeacherIntakeField('declaredWeeklyHours', Number(this.value))">
                  ${[12, 16, 20, 24, 28, 30, 32, 36].map(h => `
                    <option value="${h}" ${(ob.declaredWeeklyHours || 24) === h ? 'selected' : ''}>${h} Hours / Week (${h * 4} Hrs / Month)</option>
                  `).join('')}
                </select>
                <span class="text-3xs text-slate-300 mt-1 block">Scheduled: <strong>${effectiveWeeklyHours}h/wk</strong> (${monthlyTeachingHours}h/mo over 4 weeks)</span>
              </div>

              <div class="p-3.5 rounded-xl bg-white/10 border border-white/15">
                <div class="flex items-center justify-between mb-1">
                  <label class="font-extrabold text-emerald-300 text-2xs uppercase">Expected Hourly Honorarium</label>
                  <span class="text-3xs px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">Accredited Faculty Tier</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="font-black text-emerald-400 text-sm">₹</span>
                  <input type="number" class="w-full p-2 rounded-lg border border-emerald-400 font-black text-white bg-slate-900 text-xs"
                    value="${effectiveHourlyRate}" step="50" min="500" max="2500"
                    oninput="window.updateTeacherIntakeField('expectedHourlyRate', Number(this.value))" />
                </div>
                <span class="text-3xs text-slate-400 mt-1 block">SIKO Faculty Honorarium: Calibrated to Tier & Track</span>
              </div>

              <div class="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-3xs font-extrabold text-emerald-300 uppercase">AI Projected Monthly Honorarium</span>
                    <span class="text-3xs text-emerald-300 font-bold font-mono">4-Week Cycle</span>
                  </div>
                  <div class="text-xl font-black text-white mt-0.5">
                    ₹${projectedMonthlyHonorarium.toLocaleString('en-IN')} <span class="text-xs font-normal text-slate-300">/ month</span>
                  </div>
                  <span class="text-3xs text-emerald-200 mt-0.5 block font-semibold">
                    ${monthlyTeachingHours} Teaching Hours (${effectiveWeeklyHours}h/wk × 4 Wks) @ ₹${effectiveHourlyRate.toLocaleString('en-IN')}/hr
                  </span>
                </div>
                <div class="text-3xs text-emerald-100 mt-2 pt-1.5 border-t border-emerald-400/30 space-y-0.5">
                  <div class="flex justify-between"><span>M1 (50% Live Classes):</span><strong>₹${m1Escrow.toLocaleString('en-IN')}</strong></div>
                  <div class="flex justify-between"><span>M2 (25% Tests &amp; Worksheets):</span><strong>₹${m2Escrow.toLocaleString('en-IN')}</strong></div>
                  <div class="flex justify-between"><span>M3 (25% PTM &amp; Completion):</span><strong>₹${m3Escrow.toLocaleString('en-IN')}</strong></div>
                </div>
              </div>
            </div>
          `;
        })()}

        <!-- 4. Interactive 7-Day Tabbed Schedule Inspector & Slot Controller -->
        <div class="p-4 rounded-2xl bg-slate-900 border border-emerald-400/40 text-xs space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div>
              <strong class="text-white text-sm font-black flex items-center gap-2">
                <span>🗓️ Interactive Weekly Schedule &amp; Slot Inspector</span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-3xs border border-emerald-400/30">Faculty Control Center</span>
              </strong>
              <p class="text-3xs text-slate-400 mt-0.5">
                Inspect, add, or remove teaching slots across days. If a day (e.g. Sunday) is unselected, zero slots are scheduled on that day.
              </p>
            </div>
            <button type="button" onclick="window.populateTeacherAiZeroClashSchedule()" class="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-2xs cursor-pointer border-0 flex items-center gap-1 shadow-sm transition">
              <span>✨ Auto-Generate AI Zero-Clash Timetable</span>
            </button>
          </div>

          <!-- 7 DAY TABS (Mon to Sun with ON/OFF Badges) -->
          <div class="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-white/5 border border-white/10">
            ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
              const activeDay = ob.activeScheduleDayTab || 'Mon';
              const isTabActive = activeDay === day;
              const isDayEnabled = Array.isArray(ob.availableDays) && ob.availableDays.includes(day);
              const slotsCount = (isDayEnabled && ob.weeklySchedule && Array.isArray(ob.weeklySchedule[day])) ? ob.weeklySchedule[day].length : 0;
              return `
                <button type="button" onclick="window.setTeacherScheduleDayTab('${day}')"
                  class="flex-1 min-w-[70px] py-2 px-2 rounded-lg font-bold text-xs cursor-pointer transition flex flex-col items-center gap-1 border ${
                    isTabActive
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                      : isDayEnabled
                        ? 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                        : 'bg-rose-950/20 hover:bg-rose-950/40 text-slate-400 border-rose-500/20'
                  }">
                  <span class="font-black text-xs">${day}</span>
                  <span class="text-3xs px-1.5 py-0.2 rounded-full ${
                    isTabActive
                      ? 'bg-slate-950/20 text-slate-950 font-black'
                      : isDayEnabled
                        ? 'bg-white/10 text-emerald-300 font-semibold'
                        : 'bg-rose-500/20 text-rose-300 font-extrabold'
                  }">
                    ${isDayEnabled ? `${slotsCount} ${slotsCount === 1 ? 'Slot' : 'Slots'}` : 'OFF (0)'}
                  </span>
                </button>
              `;
            }).join('')}
          </div>

          <!-- ACTIVE DAY SLOTS INSPECTOR -->
          ${(() => {
            const curDay = ob.activeScheduleDayTab || 'Mon';
            const isDayEnabled = Array.isArray(ob.availableDays) && ob.availableDays.includes(curDay);
            const slotsForDay = (isDayEnabled && ob.weeklySchedule && Array.isArray(ob.weeklySchedule[curDay])) ? ob.weeklySchedule[curDay] : [];

            const isSchool = (ob.academicStreams || []).some(s => s.includes('Class 8–10')) ||
                             (ob.standards || []).some(st => ['Class 8', 'Class 9', 'Class 10'].includes(st));
            const isCollege = (ob.academicStreams || []).some(s => s.includes('Class 11–12') || s.includes('JEE') || s.includes('NEET') || s.includes('MHT-CET')) ||
                              (ob.standards || []).some(st => ['Class 11', 'Class 12'].includes(st));
            const isSchoolOnly = isSchool && !isCollege;

            if (!isDayEnabled) {
              return `
                <div class="py-6 px-4 text-center border-2 border-dashed border-amber-400/40 bg-amber-950/30 rounded-xl space-y-2">
                  <div class="text-amber-300 font-black text-sm">⏸️ ${curDay} is Toggled OFF (Unavailable / Rest Day)</div>
                  <p class="text-3xs text-slate-300 max-w-md mx-auto">
                    ${curDay === 'Sun'
                      ? 'You have not selected Sunday in your Available Teaching Days above. SIKO strictly respects faculty rest days and zero slots are scheduled on Sunday.'
                      : `${curDay} is currently not in your Available Teaching Days.`}
                  </p>
                  <button type="button" onclick="window.toggleTeacherAvailableDay('${curDay}')"
                    class="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-2xs cursor-pointer shadow-sm">
                    + Enable ${curDay} Teaching Availability
                  </button>
                </div>
              `;
            }

            return `
              <div class="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2.5">
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <div class="text-xs font-black text-emerald-300 flex items-center gap-2">
                    <span>Active Day: <strong>${curDay}</strong> (${slotsForDay.length} Scheduled Slots)</span>
                    <span class="text-3xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
                      ${isSchoolOnly ? 'School Section: 4 PM – 11 PM (1.0h)' : 'College Section: Morning / Afternoon / Evening (1.5h)'}
                    </span>
                  </div>
                  <!-- Quick Add Slot Buttons Aligned to Section Rules -->
                  <div class="flex items-center gap-1.5 flex-wrap">
                    ${isSchoolOnly ? `
                      <button type="button" onclick="window.addTeacherScheduleSlot('${curDay}', '4:00 PM – 5:00 PM', '1-on-1', 1.0)"
                        class="px-2.5 py-1 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/30 text-3xs font-extrabold cursor-pointer">
                        + 4:00–5:00 PM (1h 1:1)
                      </button>
                      <button type="button" onclick="window.addTeacherScheduleSlot('${curDay}', '5:15 PM – 6:15 PM', 'smart-learning', 1.0)"
                        class="px-2.5 py-1 rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-400/30 text-3xs font-extrabold cursor-pointer">
                        + 5:15–6:15 PM (1h Cohort)
                      </button>
                      <button type="button" onclick="window.addTeacherScheduleSlot('${curDay}', '6:30 PM – 7:30 PM', '1-on-1', 1.0)"
                        class="px-2.5 py-1 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/30 text-3xs font-extrabold cursor-pointer">
                        + 6:30–7:30 PM (1h 1:1)
                      </button>
                      <button type="button" onclick="window.addTeacherScheduleSlot('${curDay}', '7:45 PM – 8:45 PM', 'smart-learning', 1.0)"
                        class="px-2.5 py-1 rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-400/30 text-3xs font-extrabold cursor-pointer">
                        + 7:45–8:45 PM (1h Cohort)
                      </button>
                      <button type="button" onclick="window.addTeacherScheduleSlot('${curDay}', '9:00 PM – 10:00 PM', 'smart-learning', 1.0)"
                        class="px-2.5 py-1 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/30 text-3xs font-extrabold cursor-pointer">
                        + 9:00–10:00 PM (1h Sprint)
                      </button>
                    ` : `
                      <button type="button" onclick="window.addTeacherScheduleSlot('${curDay}', '7:00 AM – 8:30 AM', '1-on-1', 1.5)"
                        class="px-2 py-1 rounded bg-teal-600/30 hover:bg-teal-600/50 text-teal-200 border border-teal-400/30 text-3xs font-extrabold cursor-pointer">
                        + Morning (7:00–8:30 AM)
                      </button>
                      <button type="button" onclick="window.addTeacherScheduleSlot('${curDay}', '2:00 PM – 3:30 PM', 'smart-learning', 1.5)"
                        class="px-2 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-400/30 text-3xs font-extrabold cursor-pointer">
                        + Afternoon (2:00–3:30 PM)
                      </button>
                      <button type="button" onclick="window.addTeacherScheduleSlot('${curDay}', '4:00 PM – 5:30 PM', '1-on-1', 1.5)"
                        class="px-2 py-1 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/30 text-3xs font-extrabold cursor-pointer">
                        + Evening (4:00–5:30 PM)
                      </button>
                      <button type="button" onclick="window.addTeacherScheduleSlot('${curDay}', '5:45 PM – 7:15 PM', '1-on-1', 1.5)"
                        class="px-2 py-1 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/30 text-3xs font-extrabold cursor-pointer">
                        + Prime (5:45–7:15 PM)
                      </button>
                      <button type="button" onclick="window.addTeacherScheduleSlot('${curDay}', '7:30 PM – 9:00 PM', 'smart-learning', 1.5)"
                        class="px-2 py-1 rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-400/30 text-3xs font-extrabold cursor-pointer">
                        + Cohort (7:30–9:00 PM)
                      </button>
                      <button type="button" onclick="window.addTeacherScheduleSlot('${curDay}', '9:15 PM – 10:45 PM', 'smart-learning', 1.5)"
                        class="px-2 py-1 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/30 text-3xs font-extrabold cursor-pointer">
                        + Night (9:15–10:45 PM)
                      </button>
                    `}
                  </div>
                </div>

                ${slotsForDay.length === 0 ? `
                  <div class="py-6 text-center text-slate-400 text-xs border border-dashed border-white/10 rounded-lg">
                    No teaching slots added for ${curDay} yet. Click a quick add button above or auto-populate AI schedule.
                  </div>
                ` : `
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    ${slotsForDay.map(slot => `
                      <div class="p-3 rounded-xl bg-white/5 border border-white/15 flex items-center justify-between gap-3">
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="font-black text-white text-xs">⏰ ${slot.timeLabel}</span>
                            <span class="px-2 py-0.5 rounded text-3xs font-black ${
                              slot.format === '1-on-1' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                            }">
                              ${slot.format === '1-on-1' ? '1-on-1 Personal' : 'Smart Circle (Cohort)'}
                            </span>
                          </div>
                          <div class="text-3xs text-slate-400 mt-1">
                            ${slot.subject || 'Physics'} • ${slot.stream || 'Class 11–12 JEE Main'} (${slot.duration || 1.5}h)
                          </div>
                        </div>
                        <button type="button" onclick="window.removeTeacherScheduleSlot('${curDay}', '${slot.id}')"
                          class="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-400/30 text-3xs font-bold cursor-pointer transition"
                          title="Remove this slot">
                          🗑️ Remove
                        </button>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>
            `;
          })()}
        </div>
      </div>

      <div class="pt-4 border-t flex justify-between items-center flex-wrap gap-3">
        <span class="text-2xs text-slate-500">All data secured under SIKO Academic Privacy Standards.</span>
        <button type="button" onclick="window.submitCandidateApplicationToPortal()"
          class="btn btn-primary btn-md font-black flex items-center gap-2">
          Save &amp; Submit Intake &rarr; Advance to Stage 2 (KYC Dossier)
        </button>
      </div>
    </div>
  `;
}

// ─── STAGE 2: KYC & ACADEMIC DOCUMENT DOSSIER ───
function renderStage2KycDossier(ob) {
  const docs = ob.attachedDocs || {};
  const docCards = [
    { key: 'cvResume', title: 'Comprehensive Academic CV / Resume', desc: 'Detailed publication history, coaching credentials & track record.', sample: 'Faculty_Academic_CV.pdf', size: '1.4 MB' },
    { key: 'degreeCert', title: 'Ph.D. / Post-Graduate Degree Certificate', desc: 'Doctoral or Masters degree transcript from recognized university.', sample: 'PhD_Physics_IIT_Delhi_Degree.pdf', size: '2.1 MB' },
    { key: 'govtIdPan', title: 'Aadhaar / Passport & PAN Card (KYC)', desc: 'Government verified ID for IT Act e-Sign & TDS tax compliance.', sample: 'Aadhaar_PAN_KYC_Dossier.pdf', size: '940 KB' },
    { key: 'demoVideo', title: 'Prior Teaching Record / Reference Letter', desc: 'Recommendation letter or student performance verification.', sample: 'FIITJEE_Dean_Recommendation_Letter.pdf', size: '1.1 MB' }
  ];

  return `
    <div class="space-y-6">
      <div class="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
        <div>
          <span class="text-2xs font-extrabold uppercase tracking-wider text-blue-700 block">Stage 2 of 10 • KYC &amp; Academic Credentials Dossier</span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Upload Academic Credentials, Verification Documents &amp; Passport Photo</h2>
          <p class="text-xs text-slate-500 mt-1">
            Attach verified credentials, government ID, and upload your official passport photo used for student and parent discovery.
          </p>
        </div>
        <span class="badge badge-success text-xs font-mono">Candidate ID: ${ob.candidateId}</span>
      </div>

      <!-- DEDICATED FACULTY PROFILE PHOTO UPLOAD ZONE -->
      <div class="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white border-2 border-indigo-400 shadow-md">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="relative shrink-0">
              <img id="teacher-photo-preview" src="${ob.profilePhotoUrl || 'assets/teachers/teacher_physics_indian.png'}" 
                alt="${ob.fullName || 'Faculty'}" 
                class="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-lg bg-slate-800" />
              ${ob.profilePhotoUrl ? `
                <span class="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-4xs uppercase tracking-wider shadow">
                  ✓ Verified
                </span>
              ` : `
                <span class="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-4xs uppercase tracking-wider shadow">
                  Upload Req.
                </span>
              `}
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base font-black text-white">Official Faculty Passport Photograph</h3>
                <span class="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-3xs font-bold">
                  IT Act &amp; NTA Compliant
                </span>
              </div>
              <p class="text-2xs text-slate-300 mt-1 max-w-lg">
                Upload your official front-facing photograph. This verified photo will be featured in the <strong>Student &amp; Parent Course Selection Directory</strong>, your <strong>Verified Faculty Hero Badge</strong>, and your <strong>Legal Service Agreement</strong>.
              </p>
              ${ob.profilePhotoFileName ? `
                <div class="mt-2 text-3xs text-emerald-300 font-mono flex items-center gap-2">
                  <span>📸 ${ob.profilePhotoFileName} (${ob.profilePhotoSize || '715 KB'})</span>
                  ${ob.profilePhotoUploadedAt ? `<span class="text-slate-400">• Uploaded ${ob.profilePhotoUploadedAt}</span>` : ''}
                </div>
              ` : ''}
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <label class="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-sm transition flex items-center gap-1.5">
              <span>📷 Upload Photo</span>
              <input type="file" id="teacher-photo-input" accept="image/*" class="hidden" onchange="window.handleTeacherPhotoUpload(event)" />
            </label>
            <button type="button" onclick="window.setTeacherSamplePhoto()" 
              class="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs cursor-pointer transition">
              ⚡ Set Indian Hero Photo
            </button>
            ${ob.profilePhotoUrl ? `
              <button type="button" onclick="window.removeTeacherPhoto()" 
                class="px-2.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 font-bold text-xs cursor-pointer transition"
                title="Remove Photo">
                🗑️
              </button>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${docCards.map(d => {
          const item = docs[d.key] || {};
          const isAtt = item.attached;
          return `
            <div class="p-5 rounded-2xl border transition-all ${isAtt ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'}">
              <div class="flex items-start justify-between gap-2 mb-2">
                <strong class="text-sm font-bold text-slate-900">${d.title}</strong>
                <span class="badge ${isAtt ? 'badge-success' : 'badge-neutral'} text-3xs">${isAtt ? '✓ Attached' : 'Pending'}</span>
              </div>
              <p class="text-2xs text-slate-600 mb-3">${d.desc}</p>
              ${isAtt ? `
                <div class="p-2.5 rounded-xl bg-white border border-emerald-200 text-xs flex items-center justify-between mb-3 font-mono">
                  <span class="truncate font-bold text-emerald-950">📄 ${item.fileName}</span>
                  <span class="text-3xs text-slate-500 shrink-0 ml-2">${item.size}</span>
                </div>
              ` : ''}
              <div class="flex items-center gap-2">
                <button type="button" onclick="window.attachCandidateDocumentInPortal('${d.key}')"
                  class="btn btn-secondary btn-xs font-bold">
                  ⚡ ${isAtt ? 'Re-Attach Sample PDF' : 'Attach Sample PDF'}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="pt-4 border-t flex justify-between items-center flex-wrap gap-3">
        <button type="button" onclick="window.setTeacherOnboardingStep(1)" class="btn btn-outline btn-sm text-xs">
          &larr; Back to Stage 1
        </button>
        <button type="button" onclick="window.setTeacherOnboardingStep(3)" class="btn btn-primary btn-md font-black">
          Proceed to Stage 3: 10-Minute Video Demo Lecture &rarr;
        </button>
      </div>
    </div>
  `;
}

// ─── STAGE 3: 10-MINUTE VIDEO DEMO LECTURE & WHITEBOARD DERIVATION ───
function renderStage3VideoDemo(ob) {
  const teacherName = ob.fullName || 'Faculty Candidate';
  const subject = (ob.subjects || ['Physics'])[0];

  return `
    <div class="space-y-6">
      <div class="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
        <div>
          <span class="text-2xs font-extrabold uppercase tracking-wider text-blue-700 block">Stage 3 of 10 • 10-Minute Video Demo Lecture &amp; Whiteboard Derivation</span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Whiteboard Derivation &amp; Live Teaching Demonstration</h2>
          <p class="text-xs text-slate-500 mt-1">
            Every SIKO Educator delivers a 10-minute conceptual derivation on digital whiteboard to demonstrate mathematical rigor, handwriting clarity, and pedagogical pacing.
          </p>
        </div>
        <span class="badge badge-primary text-xs font-mono">Whiteboard Check • 1080p HD</span>
      </div>

      <!-- VIDEO DEMO PREVIEW PLAYER & DERIVATION BENCHMARKS -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-4">
          <div class="aspect-video bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 relative flex items-center justify-center text-center p-6 text-white shadow-md">
            <div class="space-y-3 max-w-md">
              <div class="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-2xl mx-auto shadow-lg">
                ▶
              </div>
              <h4 class="text-base font-black text-white">
                ${teacherName} — 10-Min Video Demo Lecture
              </h4>
              <p class="text-xs text-slate-300 font-mono">
                Topic: Rotational Dynamics &amp; Rolling Constraints (FBD, Angular Momentum, Energy Balance)
              </p>
              <div class="flex items-center justify-center gap-2 pt-2">
                <span class="badge badge-success text-3xs">✓ 1080p Stylus Whiteboard</span>
                <span class="badge badge-neutral text-3xs">Duration: 10:24</span>
                <span class="badge badge-warning text-3xs">Noise Floor: -42dB Studio</span>
              </div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
            <div>
              <strong class="text-slate-900 block font-bold">Derivation Topic Chosen:</strong>
              <span class="text-slate-600">Pure Rolling without Slipping down an Incline &amp; Acceleration Formula a = g sinθ / (1 + I/mR²)</span>
            </div>
            <button type="button" class="btn btn-secondary btn-xs font-bold" onclick="window.attachCandidateDocumentInPortal('demoVideo')">
              ⚡ Reload Demo Video File
            </button>
          </div>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
            <strong class="text-xs font-black text-blue-950 block">SIKO Dean Whiteboard Checklist:</strong>
            <div class="space-y-1.5 text-2xs text-blue-900 font-medium">
              <div>✓ High-contrast digital tablet stylus writing (no mouse scribbles)</div>
              <div>✓ Orthogonal coordinate axes labeled explicitly</div>
              <div>✓ Complete Free Body Diagram with normal, friction &amp; torque</div>
              <div>✓ First-principles derivation without formula memorization leaps</div>
              <div>✓ Clear voice articulation &amp; engaging conversational cadence</div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span class="text-3xs font-extrabold text-slate-500 uppercase block mb-1">Review Protocol:</span>
            <p class="text-2xs text-slate-600 leading-relaxed">
              Upon submission, this recording is independently evaluated by 3 SIKO Academic Council Deans against a standardized 40-point rubric.
            </p>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t flex justify-between items-center flex-wrap gap-3">
        <button type="button" onclick="window.setTeacherOnboardingStep(2)" class="btn btn-outline btn-sm text-xs">
          &larr; Back to Stage 2
        </button>
        <button type="button" onclick="window.setTeacherOnboardingStep(4)" class="btn btn-primary btn-md font-black">
          Submit Demo &rarr; View Academic Dean Committee Rubric (Stage 4)
        </button>
      </div>
    </div>
  `;
}

// ─── STAGE 4: SIKO ACADEMIC DEAN COMMITTEE EVALUATION & RUBRIC SCORING ───
function renderStage4DeanRubric(ob) {
  const teacherName = ob.fullName || 'Faculty Candidate';
  const rubric = ob.demoEvaluation || { conceptRigor: 9.8, engagement: 9.6, boardWork: 9.5, pacing: 9.7, totalScore: 38.6 };

  return `
    <div class="space-y-6">
      <div class="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
        <div>
          <span class="text-2xs font-extrabold uppercase tracking-wider text-emerald-700 block">Stage 4 of 10 • SIKO Academic Dean Committee Evaluation</span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Standardized 4-Factor Rubric Scoring &amp; Dean Review</h2>
          <p class="text-xs text-slate-500 mt-1">
            Independent evaluation by SIKO Senior Academic Council across 4 critical pillars: Conceptual Rigor, Engagement, Board Work, and Pacing.
          </p>
        </div>
        <div class="text-right">
          <div class="text-2xl font-black text-emerald-700 font-mono">${rubric.totalScore} / 40</div>
          <span class="badge badge-success text-3xs font-bold">Top 1.2% Percentile Nationally</span>
        </div>
      </div>

      <!-- 4 RUBRIC FACTOR CARDS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-3xs font-black uppercase text-slate-500">Pillar 1</span>
            <span class="text-sm font-black text-blue-700 font-mono">${rubric.conceptRigor} / 10</span>
          </div>
          <strong class="text-xs font-bold text-slate-900 block">Conceptual Rigor</strong>
          <p class="text-3xs text-slate-600 leading-relaxed">
            Depth of first-principles physics grounding, avoidance of memorization formulas, and mathematical precision.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-3xs font-black uppercase text-slate-500">Pillar 2</span>
            <span class="text-sm font-black text-emerald-700 font-mono">${rubric.engagement} / 10</span>
          </div>
          <strong class="text-xs font-bold text-slate-900 block">Student Engagement</strong>
          <p class="text-3xs text-slate-600 leading-relaxed">
            Voice modulation, pedagogical warmth, conversational storytelling, and inquiry-led question pauses.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-3xs font-black uppercase text-slate-500">Pillar 3</span>
            <span class="text-sm font-black text-indigo-700 font-mono">${rubric.boardWork} / 10</span>
          </div>
          <strong class="text-xs font-bold text-slate-900 block">Whiteboard Work</strong>
          <p class="text-3xs text-slate-600 leading-relaxed">
            Vector diagram accuracy, neat handwriting, clean color-coded derivations, and high digital readability.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-3xs font-black uppercase text-slate-500">Pillar 4</span>
            <span class="text-sm font-black text-amber-700 font-mono">${rubric.pacing} / 10</span>
          </div>
          <strong class="text-xs font-bold text-slate-900 block">Pacing &amp; Doubts</strong>
          <p class="text-3xs text-slate-600 leading-relaxed">
            Time allocation per concept step, anticipation of student mental traps, and clear summary takeaway.
          </p>
        </div>
      </div>

      <!-- OFFICIAL DEAN COUNCIL REMARKS -->
      <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 space-y-2">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="text-lg">🏛️</span>
            <strong class="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">SIKO Academic Dean Committee Evaluation Remarks</strong>
          </div>
          <span class="badge badge-success text-2xs font-extrabold">✓ APPROVED FOR TECHNICAL VIVA</span>
        </div>
        <p class="text-xs text-emerald-900 font-medium leading-relaxed italic">
          &ldquo;${teacherName} demonstrated flawless command over rotational physics and rolling constraint mechanics. The transition from torque formulation to angular momentum conservation was mathematically pristine. Recommended with highest distinction for Subject Head Viva.&rdquo;
        </p>
        <div class="text-3xs text-emerald-800 font-mono pt-1">
          Signed: Prof. K. R. Ramanathan, Dean of Academic Standards • Council Resolution #DEC-2026-902
        </div>
      </div>

      <div class="pt-4 border-t flex justify-between items-center flex-wrap gap-3">
        <button type="button" onclick="window.setTeacherOnboardingStep(3)" class="btn btn-outline btn-sm text-xs">
          &larr; Back to Stage 3
        </button>
        <button type="button" onclick="window.setTeacherOnboardingStep(5)" class="btn btn-primary btn-md font-black">
          Proceed to Stage 5: Subject Academic Head Technical Viva &rarr;
        </button>
      </div>
    </div>
  `;
}

// ─── STAGE 5: LIVE SUBJECT ACADEMIC HEAD TECHNICAL INTERVIEW ───
function renderStage5TechnicalViva(ob) {
  const teacherName = ob.fullName || 'Faculty Candidate';

  return `
    <div class="space-y-6">
      <div class="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
        <div>
          <span class="text-2xs font-extrabold uppercase tracking-wider text-blue-700 block">Stage 5 of 10 • Subject Academic Head Technical Interview</span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">1-on-1 Conceptual Viva &amp; Edge-Case Problem Solving</h2>
          <p class="text-xs text-slate-500 mt-1">
            Technical rigor interview conducted by Senior Academic Head to assess live problem defense and handling of high-difficulty JEE Advanced / NEET edge cases.
          </p>
        </div>
        <span class="badge badge-success text-xs font-mono">Viva Cleared • 100% Score</span>
      </div>

      <!-- INTERVIEWER & TRANSCRIPT CARD -->
      <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200 flex-wrap gap-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center font-black text-base">
              VR
            </div>
            <div>
              <strong class="text-xs font-bold text-slate-900">Senior Academic Panel Lead</strong>
              <div class="text-3xs text-slate-500">HOD Physics • Ex-Allen Kota &amp; IIT Delhi Alumnus</div>
            </div>
          </div>
          <span class="badge badge-success text-2xs font-bold">Clearance: Recommended for Master Tier</span>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
            <strong class="text-2xs text-blue-900 block font-bold">Challenge 1: Non-Inertial Pseudo Force in Rolling Constraints</strong>
            <p class="text-3xs text-slate-600 leading-relaxed">
              <strong>Question:</strong> How do you resolve friction direction on a sphere when the incline itself is accelerating rightwards with a_0?<br/>
              <strong>Candidate Defense:</strong> Transformed to accelerating wedge frame; proved friction direction depends on whether a_0 exceeds g tanθ; established self-adjusting static constraint condition.
            </p>
          </div>

          <div class="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
            <strong class="text-2xs text-blue-900 block font-bold">Challenge 2: Pedagogical Remediation for Weak Students</strong>
            <p class="text-3xs text-slate-600 leading-relaxed">
              <strong>Question:</strong> How do you remedy a student confusing static vs kinetic friction coefficients?<br/>
              <strong>Candidate Defense:</strong> Utilized microscopic interlocking ridge visual model followed by step-by-step angle of repose sliding transition.
            </p>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t flex justify-between items-center flex-wrap gap-3">
        <button type="button" onclick="window.setTeacherOnboardingStep(4)" class="btn btn-outline btn-sm text-xs">
          &larr; Back to Stage 4
        </button>
        <button type="button" onclick="window.triggerPostSelectionOfferEmailToCandidate()" class="btn btn-primary btn-md font-black">
          Clear Viva &rarr; View Formal Selection Offer Letter (Stage 6)
        </button>
      </div>
    </div>
  `;
}

// ─── STAGE 6: FACULTY TIER ASSIGNMENT & FORMAL SELECTION OFFER LETTER ───
function renderStage6FormalOffer(ob) {
  const teacherName = ob.fullName || 'Faculty Candidate';
  const finalizedRate = Math.min(2500, ob.sikoFinalizedRate || 2250);
  const isAccepted = ob.offerAcceptedByTeacher;

  let weeklyScheduledHours = 0;
  if (ob.weeklySchedule) {
    (ob.availableDays || []).forEach(d => {
      if (Array.isArray(ob.weeklySchedule[d])) {
        ob.weeklySchedule[d].forEach(s => {
          weeklyScheduledHours += Number(s.duration) || 1.5;
        });
      }
    });
  }
  const effectiveWeeklyHours = weeklyScheduledHours > 0 ? weeklyScheduledHours : (Number(ob.declaredWeeklyHours) || 24);
  const allottedHours = Math.round(effectiveWeeklyHours * 4); // 4-week standard academic cycle
  const expectedMonthlyPayout = allottedHours * finalizedRate;

  return `
    <div class="space-y-6">
      <div class="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
        <div>
          <span class="text-2xs font-extrabold uppercase tracking-wider text-emerald-700 block">Stage 6 of 10 • Faculty Tier Assignment &amp; Formal Offer Letter</span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Formal SIKO Faculty Selection &amp; Honorarium Offer</h2>
          <p class="text-xs text-slate-500 mt-1">
            Review your assigned Faculty Tier, approved honorarium rate, and monthly teaching allocation.
          </p>
        </div>
        <span class="badge ${isAccepted ? 'badge-success' : 'badge-warning'} text-xs font-mono">
          ${isAccepted ? '✓ Offer Accepted by Faculty' : 'Pending Affirmation'}
        </span>
      </div>

      <!-- FORMAL SIKO LETTERHEAD CARD -->
      <div class="p-6 sm:p-8 rounded-2xl bg-white border-2 border-emerald-400 shadow-md space-y-6">
        <div class="flex items-center justify-between border-b pb-4 flex-wrap gap-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-slate-900 text-amber-300 font-black flex items-center justify-center text-lg">
              S
            </div>
            <div>
              <strong class="text-base font-black text-slate-900">SIKO EDUVENTURES PVT. LTD.</strong>
              <div class="text-3xs text-slate-500">Academic Selection &amp; Faculty Accreditation Committee</div>
            </div>
          </div>
          <div class="text-right font-mono text-2xs text-slate-500">
            Offer Ref: <strong>OFFER-SIKO-2026-084</strong><br/>
            Date: <strong>14 Oct 2026</strong>
          </div>
        <div class="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <img src="${ob.profilePhotoUrl || 'assets/teachers/teacher_physics_indian.png'}" alt="${teacherName}" class="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm shrink-0" />
          <div class="min-w-0">
            <div class="font-black text-sm text-slate-900">${teacherName}</div>
            <div class="text-3xs text-slate-500">Candidate ID: ${ob.candidateId || 'SIKO-CAND-2026-8419'} • Verified KYC &amp; Academic Dossier</div>
            <span class="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-3xs font-black">
              ✓ Verified Portrait Featured in Student &amp; Parent Selection Directory
            </span>
          </div>
        </div>

        <div class="space-y-3 text-xs leading-relaxed text-slate-800">
          <p>
            Dear <strong>${teacherName}</strong>,
          </p>
          <p>
            On behalf of the SIKO Academic Dean Council and Executive Directorate, we are pleased to offer you appointment as an <strong>Accredited Master Educator (Tier 1)</strong> in the Faculty of Physics at SIKO Eduventures.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <div class="p-3 bg-white rounded-lg border border-emerald-200">
              <span class="text-3xs font-extrabold text-slate-500 uppercase">Assigned Faculty Tier</span>
              <div class="text-base font-black text-slate-900 mt-0.5">Master Educator (Tier 1)</div>
            </div>
            <div class="p-3 bg-white rounded-lg border border-emerald-200">
              <span class="text-3xs font-extrabold text-slate-500 uppercase">Finalized Faculty Fee</span>
              <div class="text-lg font-black text-emerald-700 mt-0.5">₹${finalizedRate.toLocaleString('en-IN')} / hr</div>
              <span class="text-3xs text-emerald-800 font-bold">Approved Master Rate ₹${finalizedRate.toLocaleString('en-IN')}/hr</span>
            </div>
            <div class="p-3 bg-white rounded-lg border border-emerald-200">
              <span class="text-3xs font-extrabold text-slate-500 uppercase">Expected Monthly Payout</span>
              <div class="text-base font-black text-slate-900 mt-0.5">₹${expectedMonthlyPayout.toLocaleString('en-IN')} / mo</div>
              <span class="text-3xs text-slate-500">${allottedHours} Hours Monthly Allotment (${effectiveWeeklyHours}h/wk)</span>
            </div>
          </div>

          <p class="text-2xs text-slate-600">
            This appointment entitles you to lead 1-on-1 Specialist Journeys and strictly capped Smart Circles (max 30 students) across CBSE, ICSE, Maharashtra State Board, and JEE Main/Advanced.
          </p>
        </div>

        <div class="pt-4 border-t flex flex-wrap items-center justify-between gap-3">
          ${isAccepted ? `
            <div class="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <span>✓</span> Offer Affirmed &amp; Accepted on ${ob.offerAcceptedAt || '14 Oct 2026, 6:50 PM IST'} (Ref: ${ob.offerAcceptanceId || 'OFR-ACCEPT-8419'})
            </div>
            <button type="button" onclick="window.setTeacherOnboardingStep(7)" class="btn btn-primary btn-md font-black">
              Proceed to Stage 7: Academic Term Contract (ATC) &rarr;
            </button>
          ` : `
            <span class="text-2xs text-slate-500">Click below to affirm and accept your formal offer.</span>
            <button type="button" onclick="window.affirmPostSelectionEmailAndReturnToPortal()" class="btn btn-primary btn-md font-black">
              ✅ Affirm &amp; Accept SIKO Faculty Offer &rarr;
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

// ─── STAGE 7: ACADEMIC TERM CONTRACT (ATC) & ESCROW MILESTONES ───
function renderStage7AtcEscrow(ob) {
  const teacherName = ob.fullName || 'Faculty Candidate';
  const finalizedRate = Math.min(2500, ob.sikoFinalizedRate || 2250);
  let weeklyScheduledHours = 0;
  if (ob.weeklySchedule) {
    (ob.availableDays || []).forEach(d => {
      if (Array.isArray(ob.weeklySchedule[d])) {
        ob.weeklySchedule[d].forEach(s => {
          weeklyScheduledHours += Number(s.duration) || 1.5;
        });
      }
    });
  }
  const effectiveWeeklyHours = weeklyScheduledHours > 0 ? weeklyScheduledHours : (Number(ob.declaredWeeklyHours) || 24);
  const allottedHours = Math.round(effectiveWeeklyHours * 4);
  const totalAmount = finalizedRate * allottedHours;
  const m1 = Math.round(totalAmount * 0.50);
  const m2 = Math.round(totalAmount * 0.25);
  const m3 = totalAmount - m1 - m2;

  return `
    <div class="space-y-6">
      <div class="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
        <div>
          <span class="text-2xs font-extrabold uppercase tracking-wider text-emerald-700 block">Stage 7 of 10 • Academic Term Contract (ATC) &amp; Escrow Schedule</span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Schedule A: Milestone Escrow &amp; Payout Terms</h2>
          <p class="text-xs text-slate-500 mt-1">
            SIKO guarantees 100% of your faculty honorarium deposited into bank escrow prior to lecture commencement and released transparently.
          </p>
        </div>
        <span class="badge badge-success text-xs font-mono">100% Escrow Protected</span>
      </div>

      <!-- 3-MILESTONE ESCROW CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div class="p-5 rounded-2xl bg-white border border-emerald-300 shadow-2xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-3xs uppercase">Milestone 1 (50%)</span>
            <strong class="text-base font-black text-emerald-700 font-mono">₹${m1.toLocaleString('en-IN')}</strong>
          </div>
          <strong class="text-xs font-bold text-slate-900 block">Teaching Sessions &amp; Diagnostic Test</strong>
          <p class="text-3xs text-slate-600 leading-relaxed">
            Released automatically upon completing first 50% of scheduled syllabus hours and conducting first student concept test.
          </p>
          <div class="text-3xs font-semibold text-emerald-800 pt-1">Trigger: Auto-Verified on Lecture Completion</div>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-blue-300 shadow-2xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-extrabold text-3xs uppercase">Milestone 2 (25%)</span>
            <strong class="text-base font-black text-blue-700 font-mono">₹${m2.toLocaleString('en-IN')}</strong>
          </div>
          <strong class="text-xs font-bold text-slate-900 block">Worksheet &amp; Assessment Release</strong>
          <p class="text-3xs text-slate-600 leading-relaxed">
            Released upon teacher approval and release of AI-generated homework worksheets and subjective handwritten grading.
          </p>
          <div class="text-3xs font-semibold text-blue-800 pt-1">Trigger: 1-Click Approval in Review Queue</div>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-indigo-300 shadow-2xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-extrabold text-3xs uppercase">Milestone 3 (25%)</span>
            <strong class="text-base font-black text-indigo-700 font-mono">₹${m3.toLocaleString('en-IN')}</strong>
          </div>
          <strong class="text-xs font-bold text-slate-900 block">Parent-Teacher Meeting (PTM)</strong>
          <p class="text-3xs text-slate-600 leading-relaxed">
            Released upon completion of monthly 15-minute PTM and parent acknowledgement of AI Learning DNA diagnostic report.
          </p>
          <div class="text-3xs font-semibold text-indigo-800 pt-1">Trigger: Parent Feedback Acknowledged</div>
        </div>
      </div>

      <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between flex-wrap gap-2">
        <div>
          <strong class="text-slate-900 block font-bold">Total Guaranteed Escrow Contract Sum:</strong>
          <span class="text-slate-500">₹${totalAmount.toLocaleString('en-IN')} (${allottedHours} hours @ ₹${finalizedRate}/hr)</span>
        </div>
        <span class="badge badge-success text-2xs font-bold">100% Guaranteed Honorarium Payout</span>
      </div>

      <div class="pt-4 border-t flex justify-between items-center flex-wrap gap-3">
        <button type="button" onclick="window.setTeacherOnboardingStep(6)" class="btn btn-outline btn-sm text-xs">
          &larr; Back to Stage 6
        </button>
        <button type="button" onclick="window.setTeacherOnboardingStep(8)" class="btn btn-primary btn-md font-black">
          Proceed to Stage 8: Digital Faculty Agreement &amp; Legal e-Signature &rarr;
        </button>
      </div>
    </div>
  `;
}

// ─── STAGE 8: DIGITAL FACULTY AGREEMENT & LEGAL e-SIGNATURE ───
function renderStage8LegalESign(ob) {
  const teacherName = ob.fullName || 'Faculty Candidate';
  const isSigned = ob.agreementSigned;

  return `
    <div class="space-y-6">
      <div class="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
        <div>
          <span class="text-2xs font-extrabold uppercase tracking-wider text-emerald-700 block">Stage 8 of 10 • Digital Faculty Agreement &amp; Legal e-Signature</span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Master Faculty Service Agreement (21 Sections)</h2>
          <p class="text-xs text-slate-500 mt-1">
            Executed electronically under Section 10A of the Information Technology Act, 2000. Legally binding across India.
          </p>
        </div>
        <span class="badge ${isSigned ? 'badge-success' : 'badge-warning'} text-xs font-mono">
          ${isSigned ? '✓ Agreement Digitally Signed' : 'Pending Signature'}
        </span>
      </div>

      <!-- SCROLLABLE 21-SECTION LEGAL CLAUSES VIEWER -->
      <div class="p-5 rounded-2xl bg-slate-50 border border-slate-300 max-h-72 overflow-y-auto text-xs space-y-3 leading-relaxed text-slate-700">
        <h4 class="font-black text-slate-900 text-sm">SIKO MASTER FACULTY SERVICES &amp; CODE OF CONDUCT AGREEMENT</h4>
        <p><strong>Section 1 (Definitions &amp; Scope):</strong> This Agreement governs the provision of professional tutoring services by the Educator on the SIKO platform.</p>
        <p><strong>Section 2 (Appointment &amp; Non-Exclusivity):</strong> The Educator is appointed as an independent professional contractor with full academic freedom to author lesson plans.</p>
        <p><strong>Section 3 (1-to-1 and 1-to-Many Cohort Caps):</strong> The Educator agrees that Smart Circle cohorts shall be capped strictly at a maximum of 30 students to maintain pedagogical intimacy.</p>
        <p><strong>Section 4 (Slot Discipline &amp; Lecture Standards):</strong> School Board slots are 1.0 hour; Olympiad and JEE/NEET competitive slots are 1.5 hours. All sessions must utilize digital whiteboard stylus.</p>
        <p><strong>Section 5 (Escrow &amp; Honorarium Guarantee):</strong> 100% of the agreed honorarium is secured in escrow and paid out in accordance with Schedule A (50/25/25 milestones).</p>
        <p><strong>Section 6 (Intellectual Property):</strong> Curriculum content, lesson recordings, and synthesized diagnostic questions remain protected under SIKO and Educator mutual license.</p>
        <p><strong>Section 7 (Student Safeguarding &amp; Privacy):</strong> Strictly zero private off-platform communication with students. All interactions occur on recorded SIKO portals.</p>
        <p><strong>Section 8 (Jurisdiction &amp; Dispute Resolution):</strong> Governed by the laws of India, subject to exclusive arbitration jurisdiction in New Delhi / Mumbai.</p>
      </div>

      <!-- LEGAL e-SIGNATURE PANEL -->
      <div class="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-300 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <strong class="text-xs font-black text-emerald-950 uppercase tracking-wider">Digital e-Signature Verification Panel</strong>
          <span class="badge badge-success text-3xs">IT Act 2000 Sec 10A</span>
        </div>

        <div class="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-emerald-300">
          <img src="${ob.profilePhotoUrl || 'assets/teachers/teacher_physics_indian.png'}" alt="${teacherName}" class="w-12 h-12 rounded-xl object-cover border border-emerald-400 shadow-2xs shrink-0" />
          <div class="min-w-0">
            <span class="text-3xs font-extrabold uppercase tracking-wider text-emerald-800 block">Verified Signatory Identity &amp; Portrait</span>
            <div class="text-xs font-black text-slate-900 truncate">${teacherName}</div>
            <span class="text-3xs text-slate-500">Cross-verified against Aadhaar &amp; PAN KYC Dossier</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Full Legal Name (as on PAN) *</label>
            <input type="text" class="w-full p-2.5 rounded-lg border border-slate-300 font-bold bg-white"
              value="${teacherName}" id="legalNameInput" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Income Tax Permanent Account Number (PAN) *</label>
            <input type="text" class="w-full p-2.5 rounded-lg border border-slate-300 font-bold bg-white uppercase font-mono"
              placeholder="e.g. AAAPS1234F" value="AAAPS1234F" id="panInput" />
          </div>
        </div>

        <div class="p-3 bg-white rounded-xl border border-emerald-200 text-2xs text-slate-600 flex items-center justify-between">
          <span>Digital Signature Token: <strong>SHA-256 Hash Generated on Submission</strong></span>
          <span class="font-mono text-emerald-800">IP: 14.139.58.12 (IIT Delhi)</span>
        </div>
      </div>

      <div class="pt-4 border-t flex justify-between items-center flex-wrap gap-3">
        <button type="button" onclick="window.setTeacherOnboardingStep(7)" class="btn btn-outline btn-sm text-xs">
          &larr; Back to Stage 7
        </button>
        ${isSigned ? `
          <div class="flex items-center gap-2 text-xs font-bold text-emerald-800">
            <span>✓</span> Signed on ${ob.agreementSignedAt || '14 Oct 2026, 7:00 PM IST'} (Ref: ${ob.agreementEventId || 'AGR-E-SIGN-2026-8419'})
          </div>
          <button type="button" onclick="window.setTeacherOnboardingStep(9)" class="btn btn-primary btn-md font-black">
            Proceed to Stage 9: Mandatory Faculty Orientation &rarr;
          </button>
        ` : `
          <button type="button" onclick="window.signTeacherAgreementAndAdvance()" class="btn btn-primary btn-md font-black">
            ✍️ Digitally Sign Faculty Agreement &rarr; Stage 9
          </button>
        `}
      </div>
    </div>
  `;
}

// ─── STAGE 9: MANDATORY FACULTY ORIENTATION & PLATFORM TRAINING ───
function renderStage9Orientation(ob) {
  const mods = ob.orientationModules || {};
  const isAllDone = mods.classroomSetup && mods.learningDnaTimetable && mods.milestoneEscrowWorkflow;

  const modulesList = [
    {
      key: 'classroomSetup',
      title: 'Module 1: Live Digital Classroom Setup & Whiteboard Stylus Protocol',
      desc: 'Setting up high-contrast stylus whiteboard, managing audio noise suppression, and enforcing 1.0h (School) vs 1.5h (Competitive) slot discipline.'
    },
    {
      key: 'learningDnaTimetable',
      title: 'Module 2: Student Learning DNA & Personalized Lesson Trajectory',
      desc: 'Reading student diagnostic radar charts, pace adaptation, and structuring step-by-step derivations to cure specific conceptual misconceptions.'
    },
    {
      key: 'milestoneEscrowWorkflow',
      title: 'Module 3: 50/25/25 Milestone Escrow & Monthly PTM Reporting Protocol',
      desc: 'Reviewing AI-generated post-lecture worksheets, 1-click approval for student release, and conducting 15-minute diagnostic parent conferences.'
    }
  ];

  return `
    <div class="space-y-6">
      <div class="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
        <div>
          <span class="text-2xs font-extrabold uppercase tracking-wider text-emerald-700 block">Stage 9 of 10 • Mandatory Faculty Orientation</span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Mandatory Platform Readiness &amp; Pedagogical Training</h2>
          <p class="text-xs text-slate-500 mt-1">
            Complete the 3 interactive orientation modules below to certify your classroom readiness before launching your Live Educator Portal.
          </p>
        </div>
        <span class="badge ${isAllDone ? 'badge-success' : 'badge-warning'} text-xs font-mono">
          ${isAllDone ? '✓ All 3 Modules Completed' : 'Orientation In Progress'}
        </span>
      </div>

      <!-- 3 ORIENTATION MODULE CARDS -->
      <div class="space-y-3">
        ${modulesList.map((m, idx) => {
          const isDone = Boolean(mods[m.key]);
          return `
            <div class="p-5 rounded-2xl border transition-all ${isDone ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'}">
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="badge ${isDone ? 'badge-success' : 'badge-neutral'} text-3xs font-bold">Module ${idx + 1}</span>
                    <strong class="text-sm font-bold text-slate-900">${m.title}</strong>
                  </div>
                  <p class="text-2xs text-slate-600 max-w-3xl leading-relaxed">${m.desc}</p>
                </div>
                <button type="button" onclick="window.toggleTeacherOrientationModule('${m.key}')"
                  class="btn ${isDone ? 'btn-success' : 'btn-outline'} btn-xs font-bold shrink-0">
                  ${isDone ? '✓ Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="pt-4 border-t flex justify-between items-center flex-wrap gap-3">
        <button type="button" onclick="window.setTeacherOnboardingStep(8)" class="btn btn-outline btn-sm text-xs">
          &larr; Back to Stage 8
        </button>
        <button type="button" onclick="window.completeTeacherOrientationAndLaunchPortal()" class="btn btn-primary btn-md font-black">
          Complete Orientation &rarr; Activate Live Educator Portal (Stage 10)
        </button>
      </div>
    </div>
  `;
}

// ─── STAGE 10: EDUCATOR PORTAL LIVE & ACTIVATED! ───
function renderStage10LivePortal(ob) {
  const teacherName = ob.fullName || 'Faculty Candidate';
  const finalizedRate = ob.sikoFinalizedRate || 2250;

  return `
    <div class="space-y-6">
      <div class="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-900 text-white border-2 border-emerald-400 shadow-xl space-y-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <img src="${ob.profilePhotoUrl || 'assets/teachers/teacher_physics_indian.png'}" alt="${teacherName}" class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl shrink-0" />
            <div class="space-y-1.5">
              <span class="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-2xs uppercase tracking-wider inline-block">
                ✓ SIKO FACULTY ACCREDITATION COMPLETE • PORTAL ACTIVATED
              </span>
              <h1 class="text-2xl sm:text-3xl font-black text-white">
                Congratulations, ${teacherName}!
              </h1>
              <p class="text-xs text-slate-300 max-w-2xl leading-relaxed">
                You are now an officially accredited SIKO Master Faculty. Your Educator Command Hub is fully unlocked with assigned batches, interactive whiteboard classroom, and milestone escrow wallet.
              </p>
            </div>
          </div>
          <div class="p-4 rounded-2xl bg-white/10 border border-white/20 text-center shrink-0">
            <span class="text-3xs uppercase font-extrabold text-emerald-300 block">Faculty Honorarium</span>
            <div class="text-xl font-black text-white font-mono mt-0.5">₹${finalizedRate.toLocaleString('en-IN')} / hr</div>
            <span class="text-3xs text-slate-300">100% Escrow Backed</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <strong class="text-white block font-bold">Accredited ID:</strong>
            <span class="text-emerald-300 font-mono text-2xs">#SIKO-FAC-2026-8419</span>
          </div>
          <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <strong class="text-white block font-bold">Approved Streams:</strong>
            <span class="text-slate-200 text-2xs">Class 11–12 JEE &amp; Senior Boards</span>
          </div>
          <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <strong class="text-white block font-bold">Escrow Guarantee:</strong>
            <span class="text-slate-200 text-2xs">50% M1 / 25% M2 / 25% M3</span>
          </div>
        </div>

        <div class="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onclick="window.setTeacherOnboardingStep(1)" class="btn btn-outline btn-sm text-xs text-slate-300 border-white/20 hover:bg-white/10">
            &larr; Review 9-Stage Dossier
          </button>
          <button type="button" onclick="window.launchLiveEducatorDashboard()"
            class="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-sm cursor-pointer border-0 shadow-lg flex items-center gap-2">
            <span>🚀 Enter Live Educator Command Hub (teacher-dashboard) &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  `;
}


// Backwards-compatible lifecycle helper called by Admin Dashboard
window.triggerTeacherLifecycleAutoMail = function(stageKey, nextStepNum = null) {
  const ob = ensureTeacherOnboardingDefaults();
  if (stageKey === 'SELECTION_OFFER_LETTER' || stageKey === 'CONTRACT_SIGNED_WELCOME') {
    ob.applicationDecisionStatus = 'SELECTED';
    ob.selectionEmailTriggered = true;
    ob.selectionEmailTriggeredAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  } else if (stageKey === 'APPLICATION_REJECTED') {
    ob.applicationDecisionStatus = 'REJECTED';
  } else if (stageKey === 'SCREENING_DEMO_INVITE') {
    ob.applicationDecisionStatus = 'SCREENING_APPROVED_DEMO_INVITED';
  }
  if (typeof nextStepNum === 'number') {
    ob.currentStep = nextStepNum;
    ob.applicantStage = nextStepNum;
  }
  if (typeof window.renderApp === 'function') window.renderApp();
  else notifyStateChange();
};

window.openTeacherEmailOnboardingLinkModal = function() {
  const ob = ensureTeacherOnboardingDefaults();
  const teacherName = ob.fullName || 'Faculty Candidate';
  const teacherEmail = ob.email || 'faculty@joinsiko.com';
  const finalizedRate = ob.sikoFinalizedRate || 2250;
  const allottedHours = 70;
  const totalTeacherAmount = finalizedRate * allottedHours;
  const m1Amt = Math.round(totalTeacherAmount * 0.50);
  const m2Amt = Math.round(totalTeacherAmount * 0.25);
  const m3Amt = totalTeacherAmount - m1Amt - m2Amt;

  let existing = document.getElementById('teacherEmailPortalModalOverlay');
  if (existing) existing.remove();

  const modalHtml = `
    <div id="teacherEmailPortalModalOverlay" style="position:fixed;inset:0;background:rgba(15,23,42,0.82);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px);">
      <div style="background:white;border-radius:20px;max-width:640px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 25px 50px -12px rgba(0,0,0,0.35);border:2px solid #10B981;padding:24px;">
        <div class="flex items-start justify-between gap-3 pb-4 border-b border-slate-200 mb-4">
          <div class="min-w-0">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-3xs uppercase tracking-wider">
              📧 Selection Offer Email Preview • Candidate ID: ${ob.candidateId || 'SIKO-CAND-2026-8419'}
            </span>
            <h3 class="text-lg font-black text-slate-900 mt-1">
              SIKO Faculty Selection Offer &amp; Honorarium Lock
            </h3>
            <p class="text-2xs text-slate-500 font-mono mt-0.5 break-all">
              To: <strong>${teacherEmail}</strong> • Streams: <strong>${(ob.standards || []).join(', ')}</strong> • Subject: <strong>${(ob.subjects || []).join(', ')}</strong>
            </p>
          </div>
          <button type="button" onclick="document.getElementById('teacherEmailPortalModalOverlay').remove()" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border-0 shrink-0">
            ✕
          </button>
        </div>

        <div class="p-4 rounded-2xl bg-emerald-50/80 border-2 border-emerald-400 mb-5 text-xs space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span class="text-3xs font-extrabold uppercase tracking-wider text-emerald-800 block">Official Approved Faculty Fee &amp; Milestone Escrow Schedule</span>
              <strong class="text-sm font-black text-slate-900">${teacherName} • ${(ob.subjects || ['Physics']).join(', ')} Specialist</strong>
            </div>
            <span class="px-3 py-1 rounded-full bg-emerald-700 text-white font-black text-xs">
              Finalized Faculty Fee: ₹${finalizedRate.toLocaleString('en-IN')} / hr
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-center">
            <div class="p-3 rounded-xl bg-white border border-emerald-200">
              <div class="text-3xs font-bold text-slate-500 uppercase">100% Faculty Payout</div>
              <div class="text-base font-black text-slate-900 mt-0.5">₹${totalTeacherAmount.toLocaleString('en-IN')}</div>
              <div class="text-3xs text-emerald-700 font-semibold">${allottedHours} Hrs @ ₹${finalizedRate}/hr</div>
            </div>
            <div class="p-3 rounded-xl bg-white border border-emerald-300">
              <div class="text-3xs font-extrabold text-emerald-800 uppercase">Milestone M1 (50%)</div>
              <div class="text-base font-black text-emerald-700 mt-0.5">₹${m1Amt.toLocaleString('en-IN')}</div>
              <div class="text-3xs text-slate-500">Teaching Completion</div>
            </div>
            <div class="p-3 rounded-xl bg-white border border-blue-200">
              <div class="text-3xs font-extrabold text-blue-800 uppercase">Milestone M2 (25%)</div>
              <div class="text-base font-black text-blue-700 mt-0.5">₹${m2Amt.toLocaleString('en-IN')}</div>
              <div class="text-3xs text-slate-500">Worksheet &amp; Quiz Gate</div>
            </div>
            <div class="p-3 rounded-xl bg-white border border-indigo-200">
              <div class="text-3xs font-extrabold text-indigo-800 uppercase">Milestone M3 (25%)</div>
              <div class="text-base font-black text-indigo-700 mt-0.5">₹${m3Amt.toLocaleString('en-IN')}</div>
              <div class="text-3xs text-slate-500">Monthly PTM Review</div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t">
          <button type="button" onclick="document.getElementById('teacherEmailPortalModalOverlay').remove()" class="btn btn-outline btn-sm text-xs">
            Close Preview
          </button>
          <button type="button" onclick="document.getElementById('teacherEmailPortalModalOverlay').remove(); window.setTeacherOnboardingStep(6);" class="btn btn-primary btn-sm font-black">
            Affirm Offer in Portal (Stage 6) &rarr;
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
};
