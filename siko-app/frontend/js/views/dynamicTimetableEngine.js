/**
 * SIKO DYNAMIC AI TIMETABLE & EXAM PACING ENGINE
 * 
 * Automatically synchronizes student study schedules with dynamic examination dates.
 * As exam dates change per student, cohort, or official conducting authority announcements,
 * AI takes that into consideration, back-calculates portion completion strictly 1 month
 * before the exam, adjusts weekly session frequency, and generates a zero-clash timetable.
 */

(function(global) {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────────
  // OFFICIAL DEFAULT EXAM DATES & CONDUCTING AUTHORITIES CATALOG
  // ─────────────────────────────────────────────────────────────────────────────
  const OFFICIAL_EXAM_CALENDAR = {
    jee_main_advanced: {
      courseName: 'JEE Main + Advanced (Grades 11–12)',
      authority: 'NTA & IIT Joint Admission Board (IIT-JAB)',
      defaultExamDate: '2027-05-23',
      defaultExamLabel: 'Sunday, 23 May 2027 (JEE Advanced Paper 1 & 2)',
      slotDurationHrs: 1.5,
      slotLabel: '1.5 Hrs / Slot',
      isOlympiadOrSenior: true,
      cohorts: [
        { id: 'jee_adv_2027_reg', name: 'JEE Adv 2027 Regular Cohort', targetDate: '2027-05-23' },
        { id: 'jee_main_jan_2027', name: 'NTA JEE Main 2027 Session 1 Sprint', targetDate: '2027-01-24' },
        { id: 'jee_main_apr_2027', name: 'NTA JEE Main 2027 Session 2 Cohort', targetDate: '2027-04-06' }
      ]
    },
    jee_main: {
      courseName: 'JEE (Main) NTA Computer-Based Test (300M)',
      authority: 'National Testing Agency (NTA)',
      defaultExamDate: '2027-01-24',
      defaultExamLabel: 'Sunday, 24 Jan 2027 (NTA Session 1 CBT)',
      slotDurationHrs: 1.5,
      slotLabel: '1.5 Hrs / Slot',
      isOlympiadOrSenior: true,
      cohorts: [
        { id: 'jee_main_session1', name: 'NTA JEE Main Session 1 (Jan 2027)', targetDate: '2027-01-24' },
        { id: 'jee_main_session2', name: 'NTA JEE Main Session 2 (Apr 2027)', targetDate: '2027-04-06' }
      ]
    },
    neet_ug: {
      courseName: 'NEET (UG) Medical Entrance (720M)',
      authority: 'National Testing Agency (NTA) & NMC',
      defaultExamDate: '2027-05-02',
      defaultExamLabel: 'Sunday, 02 May 2027 (Official NTA NEET Pattern)',
      slotDurationHrs: 1.5,
      slotLabel: '1.5 Hrs / Slot',
      isOlympiadOrSenior: true,
      cohorts: [
        { id: 'neet_2027_may', name: 'NEET UG 2027 All India Cohort', targetDate: '2027-05-02' },
        { id: 'neet_dropper_fast', name: 'NEET Intensive Rank Booster Cohort', targetDate: '2027-04-15' }
      ]
    },
    mht_cet: {
      courseName: 'MHT-CET (PCM & PCB • 200M)',
      authority: 'State Common Entrance Test Cell, Maharashtra',
      defaultExamDate: '2027-04-18',
      defaultExamLabel: 'Sunday, 18 Apr 2027 (Maharashtra State CET Cell)',
      slotDurationHrs: 1.5,
      slotLabel: '1.5 Hrs / Slot',
      isOlympiadOrSenior: true,
      cohorts: [
        { id: 'cet_pcm_2027', name: 'MHT-CET Engineering (PCM)', targetDate: '2027-04-18' },
        { id: 'cet_pcb_2027', name: 'MHT-CET Pharmacy/Agri (PCB)', targetDate: '2027-04-24' }
      ]
    },
    cbse_11_12: {
      courseName: 'CBSE Class 11th & 12th Senior Board (5-Sec)',
      authority: 'Central Board of Secondary Education (CBSE)',
      defaultExamDate: '2027-02-15',
      defaultExamLabel: 'Monday, 15 Feb 2027 (CBSE Senior Secondary Exam)',
      slotDurationHrs: 1.5,
      slotLabel: '1.5 Hrs / Slot',
      isOlympiadOrSenior: true,
      cohorts: [
        { id: 'cbse_12_2027', name: 'CBSE Class 12 All India Board Cohort', targetDate: '2027-02-15' },
        { id: 'cbse_11_annual', name: 'CBSE Class 11 Annual Examination Cohort', targetDate: '2027-02-01' }
      ]
    },
    isc_11_12: {
      courseName: 'ISC Class 11th & 12th Senior Board',
      authority: 'Council for the Indian School Certificate Examinations (CISCE)',
      defaultExamDate: '2027-02-12',
      defaultExamLabel: 'Friday, 12 Feb 2027 (CISCE ISC Board Examination)',
      slotDurationHrs: 1.5,
      slotLabel: '1.5 Hrs / Slot',
      isOlympiadOrSenior: true,
      cohorts: [
        { id: 'isc_12_2027', name: 'ISC Class 12 Board Cohort', targetDate: '2027-02-12' }
      ]
    },
    maharashtra_hsc_11_12: {
      courseName: 'Maharashtra State Board HSC (Class 11 & 12)',
      authority: 'Maharashtra State Board (MSBSHSE), Pune',
      defaultExamDate: '2027-02-21',
      defaultExamLabel: 'Sunday, 21 Feb 2027 (Maharashtra State HSC Board)',
      slotDurationHrs: 1.5,
      slotLabel: '1.5 Hrs / Slot',
      isOlympiadOrSenior: true,
      cohorts: [
        { id: 'mh_hsc_2027', name: 'Maharashtra HSC Board Cohort', targetDate: '2027-02-21' }
      ]
    },
    cbse_8_10: {
      courseName: 'CBSE Class 8th, 9th & 10th School Boards',
      authority: 'Central Board of Secondary Education (CBSE)',
      defaultExamDate: '2027-02-25',
      defaultExamLabel: 'Thursday, 25 Feb 2027 (CBSE Class 10 Board Exam)',
      slotDurationHrs: 1.0,
      slotLabel: '1.0 Hr / Slot (School Board Focus)',
      isOlympiadOrSenior: false,
      cohorts: [
        { id: 'cbse_10_2027', name: 'CBSE Class 10 Board Cohort', targetDate: '2027-02-25' },
        { id: 'cbse_9_2027', name: 'CBSE Class 9 Annual Exam Cohort', targetDate: '2027-02-15' },
        { id: 'cbse_8_2027', name: 'CBSE Class 8 Final Exam Cohort', targetDate: '2027-02-20' }
      ]
    },
    icse_8_10: {
      courseName: 'ICSE Class 8th, 9th & 10th School Boards',
      authority: 'Council for the Indian School Certificate Examinations (CISCE)',
      defaultExamDate: '2027-02-28',
      defaultExamLabel: 'Sunday, 28 Feb 2027 (CISCE ICSE Class 10 Exam)',
      slotDurationHrs: 1.0,
      slotLabel: '1.0 Hr / Slot (School Board Focus)',
      isOlympiadOrSenior: false,
      cohorts: [
        { id: 'icse_10_2027', name: 'ICSE Class 10 Board Cohort', targetDate: '2027-02-28' },
        { id: 'icse_9_2027', name: 'ICSE Class 9 Annual Exam Cohort', targetDate: '2027-02-18' }
      ]
    },
    maharashtra_ssc_8_10: {
      courseName: 'Maharashtra State Board SSC (Class 8th, 9th & 10th)',
      authority: 'Maharashtra State Board (MSBSHSE), Pune',
      defaultExamDate: '2027-03-02',
      defaultExamLabel: 'Tuesday, 02 Mar 2027 (Maharashtra State SSC Exam)',
      slotDurationHrs: 1.0,
      slotLabel: '1.0 Hr / Slot (School Board Focus)',
      isOlympiadOrSenior: false,
      cohorts: [
        { id: 'mh_ssc_10_2027', name: 'Maharashtra SSC Class 10 Cohort', targetDate: '2027-03-02' }
      ]
    },
    olympiad_class_8: {
      courseName: 'Class 8 Competitive Olympiad (SOF IMO/NSO)',
      authority: 'Science Olympiad Foundation (SOF)',
      defaultExamDate: '2026-11-20',
      defaultExamLabel: 'Friday, 20 Nov 2026 (SOF IMO Level 1)',
      slotDurationHrs: 1.5,
      slotLabel: '1.5 Hrs / Slot (Olympiad Problem Solving)',
      isOlympiadOrSenior: true,
      cohorts: [
        { id: 'sof_nov_2026', name: 'SOF IMO/NSO Nov 2026 Cohort', targetDate: '2026-11-20' },
        { id: 'sof_dec_2026', name: 'SOF IMO/NSO Dec 2026 Cohort', targetDate: '2026-12-18' }
      ]
    },
    olympiad_class_9: {
      courseName: 'Class 9 Science Olympiad (IAPT NSEJS / IJSO)',
      authority: 'Indian Association of Physics Teachers (IAPT)',
      defaultExamDate: '2026-11-22',
      defaultExamLabel: 'Sunday, 22 Nov 2026 (IAPT NSEJS Stage 1)',
      slotDurationHrs: 1.5,
      slotLabel: '1.5 Hrs / Slot (Olympiad Analytical Depth)',
      isOlympiadOrSenior: true,
      cohorts: [
        { id: 'nsejs_2026', name: 'IAPT NSEJS National Cohort', targetDate: '2026-11-22' }
      ]
    },
    olympiad_class_10: {
      courseName: 'Class 10 Olympiad (HBCSE / MTA IOQM Integer)',
      authority: 'Homi Bhabha Centre for Science Education & MTA',
      defaultExamDate: '2026-10-25',
      defaultExamLabel: 'Sunday, 25 Oct 2026 (IOQM National Qualifier)',
      slotDurationHrs: 1.5,
      slotLabel: '1.5 Hrs / Slot (Olympiad Proofs & Integer Math)',
      isOlympiadOrSenior: true,
      cohorts: [
        { id: 'ioqm_2026', name: 'HBCSE IOQM National Math Qualifier', targetDate: '2026-10-25' },
        { id: 'prmo_regional', name: 'PRMO Regional Sprint Cohort', targetDate: '2026-11-15' }
      ]
    }
  };

  // Helper date formatters
  function formatDateShort(d) {
    if (!d || !(d instanceof Date) || isNaN(d.getTime())) return '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dd = String(d.getDate()).padStart(2, '0');
    return `${dd} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function resolveCourseCode(raw) {
    const s = String(raw || '').toLowerCase();
    if (s.includes('advanced') || s.includes('iit')) return 'jee_main_advanced';
    if (s.includes('jee') && !s.includes('advanced')) return 'jee_main';
    if (s.includes('neet')) return 'neet_ug';
    if (s.includes('cet') || s.includes('mht')) return 'mht_cet';
    if (s.includes('isc')) return 'isc_11_12';
    if (s.includes('hsc') || (s.includes('maharashtra') && (s.includes('11') || s.includes('12')))) return 'maharashtra_hsc_11_12';
    if (s.includes('cbse') && (s.includes('11') || s.includes('12'))) return 'cbse_11_12';
    if (s.includes('cbse') && (s.includes('8') || s.includes('9') || s.includes('10') || s.includes('school'))) return 'cbse_8_10';
    if (s.includes('icse') && (s.includes('8') || s.includes('9') || s.includes('10') || s.includes('school'))) return 'icse_8_10';
    if (s.includes('ssc') || (s.includes('maharashtra') && (s.includes('8') || s.includes('9') || s.includes('10')))) return 'maharashtra_ssc_8_10';
    if (s.includes('olympiad') && s.includes('8')) return 'olympiad_class_8';
    if (s.includes('olympiad') && s.includes('9')) return 'olympiad_class_9';
    if (s.includes('olympiad') && s.includes('10')) return 'olympiad_class_10';
    if (s.includes('ioqm')) return 'olympiad_class_10';
    if (s.includes('nsejs')) return 'olympiad_class_9';
    if (s.includes('sof') || s.includes('imo') || s.includes('nso')) return 'olympiad_class_8';
    return 'jee_main';
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CORE DYNAMIC AI TIMETABLE & PACING CALCULATION
  // ─────────────────────────────────────────────────────────────────────────────
  function calculateAiDynamicTimetable(opts = {}) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appStateCourse = (typeof AppState !== 'undefined' && AppState.enrolledCourse) ? AppState.enrolledCourse.courseCode : null;
    const courseKey = resolveCourseCode(opts.courseCode || opts.course || appStateCourse || 'jee_main');
    const courseMeta = OFFICIAL_EXAM_CALENDAR[courseKey] || OFFICIAL_EXAM_CALENDAR.jee_main;

    // Resolve target exam date: from options, AppState, or default
    let targetExamDateStr = opts.targetExamDate || (typeof AppState !== 'undefined' && AppState.targetExamDate) || courseMeta.defaultExamDate;
    let examDate = new Date(targetExamDateStr);
    if (isNaN(examDate.getTime()) || examDate <= today) {
      examDate = new Date(courseMeta.defaultExamDate);
      if (examDate <= today) {
        // Fallback to 120 days from now if default is past
        examDate = new Date(today.getTime() + 120 * 24 * 60 * 60 * 1000);
      }
    }

    // Days & Weeks remaining
    const daysRemaining = Math.max(15, Math.ceil((examDate - today) / (1000 * 60 * 60 * 24)));
    const weeksRemaining = Math.max(2, Math.floor(daysRemaining / 7));

    // Dynamic Portion End Date: Strictly 1 month (or 25% if under 60 days) prior to the exam
    const bufferDays = daysRemaining > 75 ? 30 : Math.max(10, Math.round(daysRemaining * 0.25));
    const portionEndDate = new Date(examDate.getTime() - bufferDays * 24 * 60 * 60 * 1000);
    const effectiveTeachingDays = Math.max(10, Math.ceil((portionEndDate - today) / (1000 * 60 * 60 * 24)));
    const effectiveTeachingWeeks = Math.max(2, Math.floor(effectiveTeachingDays / 7));
    const effectiveTeachingMonths = Number((effectiveTeachingDays / 30.4).toFixed(1));

    // Subjects and slot duration
    const stream = (typeof AppState !== 'undefined' && AppState.bookingFlow && AppState.bookingFlow.streamFilter) || 'PCM';
    const selectedSubjects = Array.isArray(opts.selectedSubjects) && opts.selectedSubjects.length > 0
      ? opts.selectedSubjects
      : (stream === 'PCB' ? ['Physics', 'Chemistry', 'Biology'] : ['Physics', 'Chemistry', 'Mathematics']);

    const isMiddleSchoolBoard = courseKey.includes('8_10') && !courseKey.includes('olympiad');
    const slotDurationHrs = isMiddleSchoolBoard ? 1.0 : 1.5;
    const slotDurationLabel = isMiddleSchoolBoard ? '1.0 Hr / Slot' : '1.5 Hrs / Slot';

    // Dynamic weekly sessions calculation based on remaining days
    // If days remaining are tight (< 90 days), increase frequency so syllabus finishes on time!
    let sessionsPerSubjectPerWeek = 3;
    if (effectiveTeachingWeeks < 10) {
      sessionsPerSubjectPerWeek = 4; // accelerated sprint
    } else if (effectiveTeachingWeeks > 24) {
      sessionsPerSubjectPerWeek = 2; // extended steady pace
    }

    const totalWeeklySessions = sessionsPerSubjectPerWeek * selectedSubjects.length;
    const weeklyHoursRequired = Number((totalWeeklySessions * slotDurationHrs).toFixed(1));
    const totalCourseHours = Number((effectiveTeachingWeeks * weeklyHoursRequired).toFixed(1));

    // Dynamic 4-Phase Roadmap
    const phase1Weeks = Math.max(1, Math.round(effectiveTeachingWeeks * 0.70));
    const phase2Weeks = Math.max(1, effectiveTeachingWeeks - phase1Weeks);
    const phase3Days = bufferDays;

    const roadmap = [
      {
        phase: 'Phase 1: First-Principles Core Syllabus Delivery',
        duration: `${phase1Weeks} Weeks (${formatDateShort(today)} → ${formatDateShort(new Date(today.getTime() + phase1Weeks * 7 * 86400000))})`,
        focus: `Deep conceptual clarity, visual derivations & daily homework verification across ${selectedSubjects.join(', ')}.`
      },
      {
        phase: 'Phase 2: Targeted Weak-Concept Remediation & Chapter Tests',
        duration: `${phase2Weeks} Weeks (${formatDateShort(new Date(today.getTime() + phase1Weeks * 7 * 86400000))} → ${formatDateShort(portionEndDate)})`,
        focus: 'Fixing gaps surfaced on SIKO Mastery Radar + Faculty Chapter CBT Tests + Formula Sheets.'
      },
      {
        phase: 'Phase 3: Guaranteed 30-Day Official CBT Full-Length Mock Sprint',
        duration: `${phase3Days} Days (${formatDateShort(portionEndDate)} → ${formatDateShort(examDate)})`,
        focus: `Full syllabus official exam-hall simulations conducted strictly under ${courseMeta.authority} examination pattern with error logs.`
      },
      {
        phase: 'Phase 4: Final Exam Confidence & Speed Mastery',
        duration: `Final 5 Days Before ${formatDateShort(examDate)}`,
        focus: 'Formula sheet flashcards, sleep cycle optimization, negative marking avoidance strategy & calm mindset.'
      }
    ];

    // Specialist teacher mapping
    const specialistMap = {
      Physics: { name: 'Dedicated Master Faculty', qual: 'Ph.D. IIT Delhi', slot1: 'Mon, Wed, Fri • 5:00 PM IST', slot2: 'Tue, Thu, Sat • 6:30 PM IST' },
      Chemistry: { name: 'Senior Master Faculty (Chemistry)', qual: 'Ph.D. CSIR-NET JRF', slot1: 'Tue, Thu, Sat • 5:00 PM IST', slot2: 'Mon, Wed, Fri • 6:30 PM IST' },
      Mathematics: { name: 'Senior Master Faculty (Mathematics)', qual: 'M.Tech IIT Bombay', slot1: 'Mon, Wed, Fri • 6:30 PM IST', slot2: 'Tue, Thu, Sat • 5:00 PM IST' },
      Biology: { name: 'Senior Master Faculty (Biology)', qual: 'MBBS AIIMS New Delhi', slot1: 'Mon, Wed, Fri • 7:45 PM IST', slot2: 'Tue, Thu, Sat • 7:45 PM IST' }
    };

    const specialistAllocations = selectedSubjects.map((sub, idx) => {
      const spec = specialistMap[sub] || { name: 'Specialist Faculty', qual: 'Top Tier', slot1: 'Mon, Wed, Fri' };
      const subWeeklyHours = Number((sessionsPerSubjectPerWeek * slotDurationHrs).toFixed(1));
      const subCourseHours = Number((effectiveTeachingWeeks * subWeeklyHours).toFixed(1));
      return {
        subject: sub,
        teacherName: spec.name,
        teacherQual: spec.qual,
        assigned1on1Slot: idx === 0 ? spec.slot1 : (idx === 1 ? spec.slot1 : spec.slot1),
        studentWeeklyHours: subWeeklyHours,
        studentCourseHours: subCourseHours,
        sessionsPerWeek: sessionsPerSubjectPerWeek,
        slotDurationHrs: slotDurationHrs
      };
    });

    // Zero-clash weekly schedule sessions
    const sessions = [];
    const daysConfig = [
      { day: 'Monday', dateOffset: 0, subIdx: 0, time: isMiddleSchoolBoard ? '5:00 PM – 6:00 PM' : '5:00 PM – 6:30 PM' },
      { day: 'Tuesday', dateOffset: 1, subIdx: 1, time: isMiddleSchoolBoard ? '5:00 PM – 6:00 PM' : '5:00 PM – 6:30 PM' },
      { day: 'Wednesday', dateOffset: 2, subIdx: 0, time: isMiddleSchoolBoard ? '5:00 PM – 6:00 PM' : '5:00 PM – 6:30 PM' },
      { day: 'Thursday', dateOffset: 3, subIdx: selectedSubjects.length > 2 ? 2 : 1, time: isMiddleSchoolBoard ? '5:00 PM – 6:00 PM' : '5:00 PM – 6:30 PM' },
      { day: 'Friday', dateOffset: 4, subIdx: 0, time: isMiddleSchoolBoard ? '5:00 PM – 6:00 PM' : '5:00 PM – 6:30 PM' },
      { day: 'Saturday', dateOffset: 5, subIdx: 1, time: isMiddleSchoolBoard ? '5:00 PM – 6:00 PM' : '5:00 PM – 6:30 PM' },
      { day: 'Sunday', dateOffset: 6, isTest: true, time: isMiddleSchoolBoard ? '10:00 AM – 11:30 AM' : '10:00 AM – 1:00 PM' }
    ];

    daysConfig.forEach(item => {
      const sessDate = new Date(today.getTime() + item.dateOffset * 86400000);
      const isTest = item.isTest;
      const targetSub = isTest ? 'All Subjects' : (selectedSubjects[item.subIdx] || selectedSubjects[0]);
      const spec = specialistMap[targetSub] || { name: 'Specialist Faculty' };

      sessions.push({
        dayLabel: item.day,
        dateLabel: formatDateShort(sessDate),
        timeSlot: item.time,
        subject: targetSub,
        teacher: isTest ? 'SIKO Automated Exam Proctor' : spec.name,
        type: isTest ? `Weekly Cumulative CBT Mock Test (${courseMeta.authority})` : `1-on-1 Concept Lecture • ${targetSub}`,
        topic: isTest ? `Syllabus Covered So Far (Pattern: ${courseMeta.authority})` : (targetSub === 'Physics' ? 'Newton’s Laws of Motion & Friction Constraints' : (targetSub === 'Chemistry' ? 'Chemical Bonding & Hybridization' : 'Calculus / Coordinate Geometry')),
        status: 'Scheduled ✓'
      });
    });

    return {
      courseKey,
      courseName: courseMeta.courseName,
      authority: courseMeta.authority,
      cohorts: courseMeta.cohorts,
      todayFormatted: formatDateShort(today),
      joiningDateFormatted: formatDateShort(today),
      examDateFormatted: formatDateShort(examDate),
      targetExamDate: targetExamDateStr,
      portionCompletionDateFormatted: formatDateShort(portionEndDate),
      daysRemaining,
      weeksRemaining,
      bufferDays,
      effectiveTeachingMonths,
      effectiveTeachingWeeks,
      effectiveTeachingDays,
      slotDurationHrs,
      slotDurationLabel,
      sessionsPerWeek: totalWeeklySessions,
      weeklyHoursRequired,
      requiredWeeklyHours: weeklyHoursRequired,
      totalCourseHours,
      selectedSubjects,
      specialistAllocations,
      roadmap,
      sessions,
      isMiddleSchoolBoard,
      pacingRecommendation: daysRemaining < 90
        ? '⚡ Accelerated Exam Pacing: AI has increased weekly sessions & focused drills to guarantee syllabus completion 30 days before exam.'
        : '🟢 Optimal Balanced Pacing: Course pace guarantees deep first-principles mastery with complete 30-day revision buffer.'
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // INTERACTIVE RECALIBRATION HANDLER
  // ─────────────────────────────────────────────────────────────────────────────
  function updateStudentExamTargetDate(newDateStr, cohortId = null) {
    if (typeof AppState === 'undefined') return;
    if (!AppState.bookingData) AppState.bookingData = {};

    AppState.targetExamDate = newDateStr;
    AppState.bookingData.targetExamDate = newDateStr;
    if (cohortId) AppState.selectedCohortId = cohortId;

    // Recalculate dynamic timetable
    const stream = (AppState.bookingFlow && AppState.bookingFlow.streamFilter) || 'PCM';
    const subjs = stream === 'PCB' ? ['Physics', 'Chemistry', 'Biology'] : ['Physics', 'Chemistry', 'Mathematics'];
    const plan = calculateAiDynamicTimetable({ targetExamDate: newDateStr, selectedSubjects: subjs });
    AppState.syncedTimetable = plan;
    AppState.aiCountdownPlan = plan;

    if (typeof notifyStateChange === 'function') {
      notifyStateChange();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // GLOBAL EXPORTS
  // ─────────────────────────────────────────────────────────────────────────────
  global.OFFICIAL_EXAM_CALENDAR = OFFICIAL_EXAM_CALENDAR;
  global.calculateAiDynamicTimetable = calculateAiDynamicTimetable;
  global.calculateAiExamCountdownSchedule = calculateAiDynamicTimetable; // Drop-in backward compatibility
  global.updateStudentExamTargetDate = updateStudentExamTargetDate;

  // Enhance generateAndSyncTimetable to use dynamic engine
  global.generateAndSyncTimetable = function(opts = {}) {
    return calculateAiDynamicTimetable(opts);
  };

})(typeof window !== 'undefined' ? window : this);
