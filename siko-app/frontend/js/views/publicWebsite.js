/**
 * SIKO PUBLIC WEBSITE VIEW — CALM INTERNATIONAL STANDARD EDITION
 * "Great learning should feel personal, inspiring, and effortless."
 * Designed for students, parents, and educators: uncluttered, self-guiding, high-trust.
 */

import { AppState, formatPrice } from '../state.js';
import { Icons, TeacherCard, BatchCard } from '../components.js';

export function renderPublicWebsite() {
  const featuredTeachers = (AppState.teachers || []).slice(0, 2);
  const featuredBatches  = (AppState.batches || []).slice(0, 2);

  setTimeout(() => {
    if (typeof window._activateReveal === 'function') window._activateReveal();
    if (typeof window._animateCounters === 'function') window._animateCounters();
    _startTypingEffect();
    _initHeroParallax();
  }, 80);

  const selectedSubject = (AppState.filoConnect && AppState.filoConnect.subject) || 'Physics';

  return `
    <!-- ═══════════════════════════════════════════
         CALM & AIRY HEADER — Apple / Stripe Glass Standard
    ═══════════════════════════════════════════ -->
    <header class="public-header" id="siko-nav" style="
      position: relative; z-index: 10;
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(226, 232, 240, 0.85);
      padding: 0.65rem 1.75rem;
      min-height: 60px;
      height: auto;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      transition: all 0.25s ease;
    ">
      <div style="max-width: 80rem; margin: 0 auto; width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: nowrap;">
        <!-- Logo -->
        <a href="#" onclick="window.navigateView('public-home'); return false;" style="display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0;">
          <div style="
            width: 36px; height: 36px; border-radius: 10px;
            background: linear-gradient(135deg, var(--siko-blue-700) 0%, var(--siko-blue-600) 100%);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
            flex-shrink: 0;
          ">
            <span style="color: white; font-weight: 900; font-size: 1.15rem; font-family: 'Plus Jakarta Sans', sans-serif;">S</span>
          </div>
          <span style="font-size: 1.3rem; font-weight: 900; color: #0F172A; letter-spacing: -0.03em; white-space: nowrap;">SIKO</span>
        </a>

        <!-- Clean, Uncluttered Nav Links (Desktop Only) -->
        <nav class="hidden lg:flex items-center gap-2 shrink-0">
          <a href="#marketplace" onclick="window.navigateView('teacher-marketplace'); return false;" style="
            padding: 0.5rem 1rem; border-radius: 999px; font-size: 0.86rem; font-weight: 700;
            color: #334155; text-decoration: none; white-space: nowrap; transition: all 0.2s ease;
            display: inline-flex; align-items: center; gap: 6px;
          " onmouseover="this.style.color='#1D4ED8'; this.style.background='#EFF6FF';" onmouseout="this.style.color='#334155'; this.style.background='transparent';">
            <span>👩‍🏫</span> Find Master Faculty
          </a>
          <a href="#batches" onclick="window.navigateView('smart-batches'); return false;" style="
            padding: 0.5rem 1rem; border-radius: 999px; font-size: 0.86rem; font-weight: 700;
            color: #334155; text-decoration: none; white-space: nowrap; transition: all 0.2s ease;
            display: inline-flex; align-items: center; gap: 6px;
          " onmouseover="this.style.color='#B45309'; this.style.background='#FFFBEB';" onmouseout="this.style.color='#334155'; this.style.background='transparent';">
            <span>👥</span> Smart Circles (Max 30)
          </a>
          <a href="#" onclick="window.navigateView('concept-testing'); return false;" style="
            padding: 0.5rem 1rem; border-radius: 999px; font-size: 0.86rem; font-weight: 700;
            color: #334155; text-decoration: none; white-space: nowrap; transition: all 0.2s ease;
            display: inline-flex; align-items: center; gap: 6px;
          " onmouseover="this.style.color='#4F46E5'; this.style.background='#EEF2FF';" onmouseout="this.style.color='#334155'; this.style.background='transparent';">
            <span>🧠</span> AI Practice &amp; Papers
          </a>
          <a href="#" onclick="window.switchRole('parent'); return false;" style="
            padding: 0.5rem 1rem; border-radius: 999px; font-size: 0.86rem; font-weight: 700;
            color: #059669; text-decoration: none; white-space: nowrap; transition: all 0.2s ease;
            display: inline-flex; align-items: center; gap: 6px;
          " onmouseover="this.style.background='#ECFDF5';" onmouseout="this.style.background='transparent';">
            <span>🔒</span> Parent Portal
          </a>
        </nav>

        <!-- Direct Friendly Actions -->
        <div style="display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; white-space: nowrap;">
          <button onclick="window.startTeacherOnboarding()" class="hidden sm:inline-flex" style="
            padding: 0.48rem 1rem; border-radius: 999px; font-size: 0.8rem; font-weight: 800;
            color: #0F172A; border: none; background: #FBBF24; cursor: pointer;
            box-shadow: 0 2px 10px rgba(251, 191, 36, 0.4);
            white-space: nowrap; transition: all 0.2s ease; align-items: center; gap: 5px;
          " onmouseover="this.style.background='#F59E0B';" onmouseout="this.style.background='#FBBF24';">
            <span>👨‍🏫</span> <span>Apply to Teach</span>
          </button>
          <button onclick="window.startStudentOnboarding()" style="
            padding: 0.48rem 1.1rem; border-radius: 999px; font-size: 0.82rem; font-weight: 800;
            color: white; background: linear-gradient(135deg, var(--siko-blue-700), var(--siko-blue-600)); border: none;
            cursor: pointer; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25); white-space: nowrap; transition: all 0.2s ease;
          " onmouseover="this.style.transform='translateY(-1px)';" onmouseout="this.style.transform='none';">
            Get Started &rarr;
          </button>
          <button onclick="window.openLoginModal()" style="
            padding: 0.45rem 0.75rem; border-radius: 999px; font-size: 0.78rem; font-weight: 800;
            color: #1E3A8A; background: #EFF6FF; border: 1px solid #BFDBFE; cursor: pointer;
            display: inline-flex; align-items: center; gap: 4px;
          " title="Switch User Persona">
            <span>👤</span> <span class="hidden sm:inline">Persona</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ═══════════════════════════════════════════
         SERENE HERO SECTION — International Standard, Spacious & Uncluttered
    ═══════════════════════════════════════════ -->
    <section class="relative overflow-hidden" style="
      background: radial-gradient(circle at 50% 10%, #F8FAFC 0%, #EFF6FF 100%);
      padding: 3.5rem 1.5rem 4.5rem;
      border-bottom: 1px solid #E2E8F0;
    ">
      <!-- Ambient subtle glow -->
      <div style="position: absolute; top: -100px; right: -80px; width: 450px; height: 450px; background: radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%); border-radius: 50%; pointer-events: none;"></div>
      <div style="position: absolute; bottom: -80px; left: -80px; width: 450px; height: 450px; background: radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%); border-radius: 50%; pointer-events: none;"></div>

      <div style="max-width: 78rem; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 3.5rem; align-items: center;">

        <!-- LEFT COLUMN: Calm, Welcoming Value Proposition -->
        <div>
          <!-- Encouraging pill -->
          <div style="
            display: inline-flex; align-items: center; gap: 8px;
            background: white; border: 1px solid #DBEAFE; border-radius: 999px;
            padding: 0.35rem 0.95rem; font-size: 0.75rem; font-weight: 700; color: #1E3A8A;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.06); margin-bottom: 1.25rem;
          ">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #10B981; display: inline-block;"></span>
            <span>Admissions Open • JEE 2026/27 • NEET UG • Class 8–10 Foundations</span>
          </div>

          <!-- Confident Headline -->
          <h1 style="
            font-size: clamp(2.2rem, 3.8vw, 3.4rem); font-weight: 800; line-height: 1.15;
            letter-spacing: -0.03em; color: #0F172A; margin-bottom: 1rem;
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          ">
            Great learning feels<br>
            <span style="
              background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #059669 100%);
              -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            " id="hero-typed-word">effortless.</span>
          </h1>

          <!-- Gentle, reassuring paragraph -->
          <p style="
            font-size: 1.05rem; color: #475569; line-height: 1.65; margin-bottom: 2rem;
            max-width: 580px; font-weight: 450;
          ">
            No crowded halls. No fear of falling behind. Learn 1-on-1 with India’s top 1% subject specialists or in small circles of 30, with an AI study plan that adapts to how your mind works.
          </p>

          <!-- Simple, Self-Moving Discovery Box (Clean & non-frightening) -->
          <div style="
            background: white; border: 1px solid #E2E8F0; border-radius: 18px;
            padding: 1.25rem; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
            margin-bottom: 1.75rem;
          ">
            <!-- Subject Pills -->
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; margin-bottom: 0.85rem;">
              <span style="font-size: 0.72rem; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em;">Choose Subject:</span>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                ${['Physics', 'Chemistry', 'Mathematics', 'Biology'].map(s => `
                  <button type="button" onclick="window.setHeroFacultySubject('${s}');" style="
                    padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700;
                    cursor: pointer; transition: all 0.15s ease;
                    border: 1.5px solid ${selectedSubject === s ? '#2563EB' : '#E2E8F0'};
                    background: ${selectedSubject === s ? '#EFF6FF' : '#F8FAFC'};
                    color: ${selectedSubject === s ? '#1D4ED8' : '#475569'};
                  ">${s === 'Physics' ? '⚛️ ' : s === 'Chemistry' ? '🧪 ' : s === 'Mathematics' ? '📐 ' : '🧬 '}${s}</button>
                `).join('')}
              </div>
            </div>

            <!-- Single Friendly Action Row -->
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button onclick="window.navigateView('teacher-marketplace')" style="
                flex: 1; min-width: 200px; padding: 0.75rem 1.2rem; border-radius: 12px;
                font-size: 0.88rem; font-weight: 700; color: white;
                background: linear-gradient(135deg, var(--siko-blue-700) 0%, var(--siko-blue-600) 100%);
                border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
                box-shadow: 0 4px 14px rgba(37,99,235,0.25);
              ">
                <span>Find Master Teachers in ${selectedSubject}</span>
                <span>→</span>
              </button>
              <button onclick="window.navigateView('smart-batches')" style="
                padding: 0.75rem 1.2rem; border-radius: 12px; font-size: 0.84rem; font-weight: 700;
                color: #B45309; background: #FFFBEB; border: 1.5px solid #FDE68A; cursor: pointer;
              ">
                View Smart Batches (Max 30)
              </button>
            </div>
          </div>

          <!-- Trust Badges (Clean, reassurance) -->
          <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; color: #334155;">
              <span style="color: #10B981; font-size: 1rem;">✓</span> Top 1% Verified Faculty
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; color: #334155;">
              <span style="color: #10B981; font-size: 1rem;">✓</span> Guaranteed Locked Timetables
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; color: #334155;">
              <span style="color: #10B981; font-size: 1rem;">✓</span> 100% Satisfaction Guarantee
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Multi-Faculty Interactive Showcase for GenZ Students -->
        ${(() => {
          const facultyCatalog = {
            Physics: {
              id: 't-physics',
              subject: 'Physics',
              emoji: '⚛️',
              name: 'Dedicated Master Faculty',
              photo: (typeof window !== 'undefined' && window.getFacultyPhoto && window.getFacultyPhoto('Physics')) || 'assets/teachers/teacher_physics_indian.png',
              title: 'Ph.D. Physics • IIT Delhi (12+ Yrs Exp)',
              tag: 'JEE Advanced AIR Top 50 Co-Mentor',
              specialty: 'Mechanics, Friction & Electrodynamics',
              rating: '★ 4.96 / 5.0 (340+ Reviews)',
              slotsBadge: 'Verified Active Faculty • Booking Open',
              slotTime: 'Mon, Wed, Fri • 5:00 PM – 6:30 PM IST',
              studentName: 'Enrolled Student • Class 11 JEE',
              studentJump: '+28% Score Jump',
              quote: '"The concept breakdown for Rotational Motion & Free Body Diagrams was so intuitive that my national mock score jumped from 42 to 78."'
            },
            Mathematics: {
              id: 't-mathematics',
              subject: 'Mathematics',
              emoji: '📐',
              name: 'Senior Master Faculty',
              photo: (typeof window !== 'undefined' && window.getFacultyPhoto && window.getFacultyPhoto('Mathematics')) || 'assets/teachers/teacher_mathematics_indian.png',
              title: 'M.Tech • IIT Bombay (15+ Yrs Exp)',
              tag: 'ISI & JEE Olympiad Lead Faculty',
              specialty: 'Differential Calculus & Coordinate Geometry',
              rating: '★ 4.98 / 5.0 (420+ Reviews)',
              slotsBadge: 'Verified Active Faculty • Booking Open',
              slotTime: 'Mon, Wed, Fri • 6:30 PM – 7:30 PM IST',
              studentName: 'Enrolled Student • Class 12 JEE',
              studentJump: '+34% Accuracy Gain',
              quote: '"Calculus used to feel overwhelming. Concept-first teaching made continuity and integration feel completely natural."'
            },
            Chemistry: {
              id: 't-chemistry',
              subject: 'Chemistry',
              emoji: '🧪',
              name: 'Senior Master Faculty',
              photo: (typeof window !== 'undefined' && window.getFacultyPhoto && window.getFacultyPhoto('Chemistry')) || 'assets/teachers/teacher_chemistry_indian.png',
              title: 'Ph.D. Chemistry • CSIR-NET JRF (11+ Yrs)',
              tag: 'NEET & JEE 100-Percentile Chemistry Mentor',
              specialty: 'Organic Mechanisms & Physical Equilibrium',
              rating: '★ 4.95 / 5.0 (290+ Reviews)',
              slotsBadge: 'Verified Active Faculty • Booking Open',
              slotTime: 'Tue, Thu, Sat • 5:00 PM – 6:00 PM IST',
              studentName: 'Enrolled Student • Class 12 NEET',
              studentJump: '99.1 Percentile in Chem',
              quote: '"Organic reaction mechanisms stopped being rote memory and started making complete logical sense from first principles."'
            },
            Biology: {
              id: 't-biology',
              subject: 'Biology',
              emoji: '🧬',
              name: 'Senior Master Faculty',
              photo: (typeof window !== 'undefined' && window.getFacultyPhoto && window.getFacultyPhoto('Biology')) || 'assets/teachers/teacher_biology_indian.png',
              title: 'MBBS / MD • AIIMS New Delhi (9+ Yrs Exp)',
              tag: 'NEET UG Top 100 Rankers Mentor',
              specialty: 'Human Physiology, Genetics & Cell Biology',
              rating: '★ 4.97 / 5.0 (380+ Reviews)',
              slotsBadge: 'Verified Active Faculty • Booking Open',
              slotTime: 'Mon, Wed, Fri • 7:45 PM – 9:00 PM IST',
              studentName: 'Enrolled Student • Class 12 NEET',
              studentJump: '355 / 360 in NEET Bio',
              quote: '"Connecting every NCERT biological diagram directly with clinical applications enabled me to achieve 355/360 in NEET Biology!"'
            }
          };

          const currentFac = facultyCatalog[selectedSubject] || facultyCatalog.Physics;
          const currentPhoto = (typeof window !== 'undefined' && window.getFacultyPhoto && window.getFacultyPhoto(currentFac.subject)) || currentFac.photo;

          return `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.85rem; width: 100%; max-width: 460px; margin: 0 auto;">
              <!-- Multi-Faculty Quick Switcher Bar -->
              <div style="
                display: flex; gap: 6px; width: 100%; background: rgba(255,255,255,0.85);
                backdrop-filter: blur(12px); padding: 5px; border-radius: 16px;
                border: 1px solid rgba(226,232,240,0.9); box-shadow: 0 4px 12px rgba(15,23,42,0.03);
              ">
                ${Object.keys(facultyCatalog).map(sub => {
                  const f = facultyCatalog[sub];
                  const isActive = selectedSubject === sub;
                  return `
                    <button type="button" onclick="window.setHeroFacultySubject('${sub}')" style="
                      flex: 1; padding: 8px 4px; border-radius: 12px; font-size: 0.74rem; font-weight: 800;
                      cursor: pointer; transition: all 0.2s ease; border: none; text-align: center; min-height: 40px;
                      background: ${isActive ? '#0F172A' : 'transparent'};
                      color: ${isActive ? 'white' : '#475569'};
                      box-shadow: ${isActive ? '0 4px 10px rgba(15,23,42,0.15)' : 'none'};
                    ">
                      <span>${f.emoji}</span>
                      <span style="margin-left: 2px;">${sub}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- Main Faculty Card -->
              <div style="
                width: 100%; background: white; border-radius: 20px;
                border: 1px solid rgba(226,232,240,0.9);
                box-shadow: 0 12px 30px rgba(15,23,42,0.06); overflow: hidden;
              ">
                <!-- Card Top Header -->
                <div style="background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%); padding: 1.25rem; color: white;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem;">
                    <span style="background: rgba(255,255,255,0.18); border-radius: 999px; padding: 0.25rem 0.65rem; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.04em;">
                      ${currentFac.emoji} ${currentFac.subject.toUpperCase()} MASTER FACULTY
                    </span>
                    <span style="color: #FCD34D; font-size: 0.78rem; font-weight: 800;">${currentFac.rating}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${currentPhoto}"
                         onerror="if(window.getFacultyPhoto) this.src=window.getFacultyPhoto('${currentFac.subject}');"
                         alt="${currentFac.name}" style="
                      width: 64px; height: 64px; border-radius: 16px; object-fit: cover;
                      border: 2px solid rgba(255,255,255,0.85); box-shadow: 0 4px 12px rgba(0,0,0,0.25); flex-shrink: 0;
                    " />
                    <div style="min-width: 0; flex: 1;">
                      <h3 style="font-size: 1.1rem; font-weight: 800; line-height: 1.2; margin: 0 0 2px 0; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${currentFac.name}</h3>
                      <div style="font-size: 0.75rem; opacity: 0.9; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${currentFac.title}</div>
                      <div style="font-size: 0.7rem; color: #93C5FD; font-weight: 700; margin-top: 3px;">${currentFac.tag}</div>
                    </div>
                  </div>
                </div>

                <!-- Card Body -->
                <div style="padding: 1.2rem;">
                  <!-- Student Growth Snapshot -->
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 0.85rem; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                      <span style="font-size: 0.68rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Verified Student Result</span>
                      <span style="font-size: 0.68rem; font-weight: 800; color: #059669; background: #ECFDF5; padding: 2px 8px; border-radius: 999px;">${currentFac.studentJump}</span>
                    </div>
                    <div style="font-size: 0.82rem; font-weight: 700; color: #0F172A; margin-bottom: 2px;">
                      ${currentFac.studentName}
                    </div>
                    <p style="font-size: 0.75rem; color: #475569; line-height: 1.45; font-style: italic; margin: 0;">
                      ${currentFac.quote}
                    </p>
                  </div>

                  <!-- Verified Faculty Status (Zero ambiguity) -->
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; background: #F0FDF4; padding: 0.65rem 0.85rem; border-radius: 12px; border: 1px solid #BBF7D0;">
                    <div style="width: 28px; height: 28px; border-radius: 8px; background: #DCFCE7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <span style="color: #16A34A; font-size: 0.9rem;">✓</span>
                    </div>
                    <div>
                      <div style="font-size: 0.78rem; font-weight: 800; color: #166534;">${currentFac.slotsBadge}</div>
                      <div style="font-size: 0.72rem; color: #4B5563;">Timetable: ${currentFac.slotTime}</div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div style="display: flex; gap: 8px;">
                    <button type="button" onclick="window.viewTeacherProfile ? window.viewTeacherProfile('${currentFac.id}') : window.navigateView('teacher-marketplace')" style="
                      flex: 1; padding: 0.65rem; border-radius: 10px; font-size: 0.8rem; font-weight: 700;
                      color: #1E3A8A; background: #EFF6FF; border: 1.5px solid #BFDBFE; cursor: pointer;
                      display: flex; align-items: center; justify-content: center; gap: 6px; min-height: 44px;
                    ">
                      <span>👤 Profile</span>
                    </button>
                    <button type="button" onclick="window.bookTeacherTrial ? window.bookTeacherTrial('${currentFac.id}') : (window.navigateView('teacher-marketplace'))" style="
                      flex: 1.3; padding: 0.65rem; border-radius: 10px; font-size: 0.8rem; font-weight: 800;
                      color: white; background: var(--siko-blue-600); border: none; cursor: pointer; min-height: 44px;
                    ">
                      Book 1:1 Session →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        })()}

      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         3 PILLARS OF CALM EXCELLENCE (No scary text, high clarity)
    ═══════════════════════════════════════════ -->
    <section style="padding: 4.5rem 1.5rem; background: white; border-bottom: 1px solid #E2E8F0;">
      <div style="max-width: 78rem; margin: 0 auto;">
        <div style="text-align: center; max-width: 600px; margin: 0 auto 3.5rem;">
          <h2 style="font-size: 2rem; font-weight: 800; color: #0F172A; letter-spacing: -0.025em; margin-bottom: 0.5rem;">
            Why students &amp; teachers love SIKO
          </h2>
          <p style="color: #64748B; font-size: 0.95rem; line-height: 1.6;">
            We removed the chaos, crowded batches, and uncertain faculty so you can focus 100% on genuine understanding.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
          <!-- Pillar 1 -->
          <div style="
            padding: 2rem; border-radius: 20px; background: #F8FAFC;
            border: 1px solid #E2E8F0; transition: transform 0.2s ease;
          " onmouseover="this.style.transform='translateY(-4px)';" onmouseout="this.style.transform='none';">
            <div style="
              width: 48px; height: 48px; border-radius: 12px; background: #EFF6FF;
              display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
              margin-bottom: 1.25rem; border: 1px solid #BFDBFE;
            ">👨‍🏫</div>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: #0F172A; margin-bottom: 0.5rem;">Top 1% Vetted Faculty</h3>
            <p style="font-size: 0.88rem; color: #475569; line-height: 1.65; margin: 0;">
              Only 1 in 80 applicant teachers pass our rigorous 9-stage screening. Every educator is verified for concept depth, empathetic communication, and board pedigree.
            </p>
          </div>

          <!-- Pillar 2 -->
          <div style="
            padding: 2rem; border-radius: 20px; background: #F8FAFC;
            border: 1px solid #E2E8F0; transition: transform 0.2s ease;
          " onmouseover="this.style.transform='translateY(-4px)';" onmouseout="this.style.transform='none';">
            <div style="
              width: 48px; height: 48px; border-radius: 12px; background: #EEF2FF;
              display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
              margin-bottom: 1.25rem; border: 1px solid #C7D2FE;
            ">🧠</div>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: #0F172A; margin-bottom: 0.5rem;">AI Concept Mastery Radar</h3>
            <p style="font-size: 0.88rem; color: #475569; line-height: 1.65; margin: 0;">
              Our AI analyzes test answers down to the sub-topic level. It builds a daily 3-block study routine targeting only the concepts you need to conquer next.
            </p>
          </div>

          <!-- Pillar 3 -->
          <div style="
            padding: 2rem; border-radius: 20px; background: #F8FAFC;
            border: 1px solid #E2E8F0; transition: transform 0.2s ease;
          " onmouseover="this.style.transform='translateY(-4px)';" onmouseout="this.style.transform='none';">
            <div style="
              width: 48px; height: 48px; border-radius: 12px; background: #ECFDF5;
              display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
              margin-bottom: 1.25rem; border: 1px solid #A7F3D0;
            ">🔒</div>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: #0F172A; margin-bottom: 0.5rem;">Guaranteed Locked Timetable</h3>
            <p style="font-size: 0.88rem; color: #475569; line-height: 1.65; margin: 0;">
              Once enrolled, your chosen faculty and timetable are locked under our Academic Term Contract (ATC). No arbitrary cancellations or surprise teacher substitutes.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         CHOOSE YOUR PATHWAY: 1-on-1 vs Smart Circles
    ═══════════════════════════════════════════ -->
    <section style="padding: 4.5rem 1.5rem; background: #F8FAFC;">
      <div style="max-width: 78rem; margin: 0 auto;">
        <div style="text-align: center; max-width: 600px; margin: 0 auto 3rem;">
          <h2 style="font-size: 2rem; font-weight: 800; color: #0F172A; letter-spacing: -0.025em; margin-bottom: 0.5rem;">
            Two flexible ways to learn
          </h2>
          <p style="color: #64748B; font-size: 0.95rem;">
            Pick what works best for your schedule, focus level, and budget.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
          <!-- Format 1: 1-on-1 Dedicated Mentorship -->
          <div style="
            background: white; border: 2px solid #BFDBFE; border-radius: 24px;
            padding: 2.25rem; box-shadow: 0 10px 30px rgba(37,99,235,0.08);
            display: flex; flex-direction: column; justify-content: space-between;
          ">
            <div>
              <div style="display: inline-block; background: #EFF6FF; color: #1D4ED8; font-size: 0.72rem; font-weight: 700; padding: 0.3rem 0.85rem; border-radius: 999px; margin-bottom: 1rem;">
                ULTRA-PERSONALIZED
              </div>
              <h3 style="font-size: 1.5rem; font-weight: 800; color: #0F172A; margin-bottom: 0.75rem;">1-on-1 Master Mentorship</h3>
              <p style="font-size: 0.9rem; color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
                Select your own dedicated teacher per subject. Custom pacing, instant doubt solving, and up to 30% discount on multi-subject combinations.
              </p>
              <ul style="list-style: none; padding: 0; margin: 0 0 2rem; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem; color: #334155;">
                <li style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✓</span> 100% individual student attention in every lecture</li>
                <li style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✓</span> Flexible time slots adapted to your school calendar</li>
                <li style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✓</span> Teacher releases customized post-lecture worksheets</li>
                <li style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✓</span> Monthly 1-on-1 PTM with comprehensive telemetry</li>
              </ul>
            </div>
            <button onclick="window.navigateView('teacher-marketplace')" style="
              width: 100%; padding: 0.85rem; border-radius: 12px; font-size: 0.88rem; font-weight: 700;
              color: white; background: linear-gradient(135deg, var(--siko-blue-700), var(--siko-blue-600)); border: none;
              cursor: pointer; box-shadow: 0 4px 14px rgba(37,99,235,0.25);
            ">
              Select 1:1 Teacher →
            </button>
          </div>

          <!-- Format 2: Smart Circles (Max 30 Students) -->
          <div style="
            background: white; border: 2px solid #FDE68A; border-radius: 24px;
            padding: 2.25rem; box-shadow: 0 10px 30px rgba(217,119,6,0.08);
            display: flex; flex-direction: column; justify-content: space-between;
          ">
            <div>
              <div style="display: inline-block; background: #FFFBEB; color: #B45309; font-size: 0.72rem; font-weight: 700; padding: 0.3rem 0.85rem; border-radius: 999px; margin-bottom: 1rem;">
                COHORT EXCELLENCE
              </div>
              <h3 style="font-size: 1.5rem; font-weight: 800; color: #0F172A; margin-bottom: 0.75rem;">Smart Circles (Max 30)</h3>
              <p style="font-size: 0.9rem; color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
                High-achieving peer cohorts with a hard limit of 30 students. Structured curriculum tracks, live group problem solving, and Sunday test series.
              </p>
              <ul style="list-style: none; padding: 0; margin: 0 0 2rem; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem; color: #334155;">
                <li style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✓</span> Strict 30-student cap prevents crowded mass-classrooms</li>
                <li style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✓</span> Different specialist faculty assigned for each subject</li>
                <li style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✓</span> Weekly NTA / IIT standard CBT mock tests included</li>
                <li style="display: flex; align-items: center; gap: 8px;"><span style="color: #10B981;">✓</span> 50% more economical than traditional coaching packages</li>
              </ul>
            </div>
            <button onclick="window.navigateView('smart-batches')" style="
              width: 100%; padding: 0.85rem; border-radius: 12px; font-size: 0.88rem; font-weight: 700;
              color: #92400E; background: linear-gradient(135deg, #FEF3C7, #FDE68A); border: 1.5px solid #F59E0B;
              cursor: pointer;
            ">
              Explore Smart Circles →
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         CALM & REASSURING FOOTER
    ═══════════════════════════════════════════ -->
    <footer style="background: #0F172A; color: white; padding: 3.5rem 1.5rem 2rem;">
      <div style="max-width: 78rem; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2.5rem; margin-bottom: 3rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 0.75rem;">
              <div style="width: 28px; height: 28px; border-radius: 8px; background: var(--siko-blue-600); display: flex; align-items: center; justify-content: center; font-weight: 900; color: white;">S</div>
              <span style="font-size: 1.15rem; font-weight: 800;">joinsiko.com</span>
            </div>
            <p style="font-size: 0.8rem; color: #94A3B8; line-height: 1.6; margin-bottom: 0.5rem;">
              "Your classroom. Your teacher. Your learning journey. Anywhere."
            </p>
            <p style="font-size: 0.75rem; color: #94A3B8; margin-bottom: 0.5rem;">
              Contact: <a href="mailto:admissions@joinsiko.com" style="color:#60A5FA; text-decoration:none;">admissions@joinsiko.com</a> • <a href="mailto:faculty@joinsiko.com" style="color:#60A5FA; text-decoration:none;">faculty@joinsiko.com</a>
            </p>
            <p style="font-size: 0.72rem; color: #64748B;">
              © 2026 joinsiko.com • SIKO Eduventures Inc. All rights reserved.
            </p>
          </div>

          <div>
            <h4 style="font-size: 0.75rem; font-weight: 700; color: #CBD5E1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.85rem;">For Students</h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.82rem;">
              <li><a href="#" onclick="window.navigateView('teacher-marketplace'); return false;" style="color: #94A3B8; text-decoration: none;">Find 1:1 Teacher</a></li>
              <li><a href="#" onclick="window.navigateView('smart-batches'); return false;" style="color: #94A3B8; text-decoration: none;">Join Smart Circle</a></li>
              <li><a href="#" onclick="window.navigateView('concept-testing'); return false;" style="color: #94A3B8; text-decoration: none;">AI Exam Practice</a></li>
              <li><a href="#" onclick="window.startStudentOnboarding(); return false;" style="color: #94A3B8; text-decoration: none;">Student Diagnostic</a></li>
            </ul>
          </div>

          <div>
            <h4 style="font-size: 0.75rem; font-weight: 700; color: #CBD5E1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.85rem;">For Educators</h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.82rem;">
              <li><a href="#" onclick="window.startTeacherOnboarding(); return false;" style="color: #94A3B8; text-decoration: none;">Apply as Faculty</a></li>
              <li><a href="#" onclick="window.switchRole('teacher'); return false;" style="color: #94A3B8; text-decoration: none;">Faculty Dashboard</a></li>
              <li><a href="#" onclick="window.switchRole('teacher'); window.setTeacherDashboardTab('step3_ai_queue'); return false;" style="color: #94A3B8; text-decoration: none;">Post-Lecture Review Gate</a></li>
            </ul>
          </div>

          <div>
            <h4 style="font-size: 0.75rem; font-weight: 700; color: #CBD5E1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.85rem;">Parent Assurance</h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.82rem;">
              <li><a href="#" onclick="window.switchRole('parent'); return false;" style="color: #94A3B8; text-decoration: none;">Parent Progress Dashboard</a></li>
              <li><a href="#" onclick="window.navigateView('ptm-view'); return false;" style="color: #94A3B8; text-decoration: none;">Monthly PTM Telemetry</a></li>
              <li><a href="#" onclick="window.navigateView('parent-live-view'); return false;" style="color: #94A3B8; text-decoration: none;">Live Classroom Observation</a></li>
              <li><a href="#" onclick="window.switchRole('admin'); return false;" style="color: #475569; text-decoration: none;">Staff Console</a></li>
            </ul>
          </div>
        </div>

        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: #64748B; flex-wrap: wrap; gap: 10px;">
          <span>100% Academic Continuity Guarantee • Secured by Escrow &amp; Academic Term Contract</span>
          <div style="display: flex; gap: 1rem;">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Academic Guidelines</span>
          </div>
        </div>
      </div>
    </footer>

    <!-- ═══════════════════════════════════════════
         STICKY THUMB-FRIENDLY MOBILE BOTTOM BAR (Clean Mobile App Experience)
    ═══════════════════════════════════════════ -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 flex items-center justify-around" style="min-height: 56px; box-shadow: 0 -4px 16px rgba(15,23,42,0.06);">
      <button type="button" onclick="window.navigateView('public-home')" class="flex flex-col items-center justify-center p-1.5 text-blue-600 font-bold text-center cursor-pointer border-none bg-transparent" style="min-width: 58px;">
        <span style="font-size: 1.15rem;">🏠</span>
        <span style="font-size: 0.68rem; line-height: 1.1; margin-top: 2px;">Home</span>
      </button>
      <button type="button" onclick="window.navigateView('teacher-marketplace')" class="flex flex-col items-center justify-center p-1.5 text-slate-600 hover:text-blue-600 font-semibold text-center cursor-pointer border-none bg-transparent" style="min-width: 58px;">
        <span style="font-size: 1.15rem;">👩‍🏫</span>
        <span style="font-size: 0.68rem; line-height: 1.1; margin-top: 2px;">Faculty</span>
      </button>
      <button type="button" onclick="window.navigateView('smart-batches')" class="flex flex-col items-center justify-center p-1.5 text-slate-600 hover:text-blue-600 font-semibold text-center cursor-pointer border-none bg-transparent" style="min-width: 58px;">
        <span style="font-size: 1.15rem;">👥</span>
        <span style="font-size: 0.68rem; line-height: 1.1; margin-top: 2px;">Batches</span>
      </button>
      <button type="button" onclick="window.startStudentOnboarding()" class="flex flex-col items-center justify-center p-1.5 text-slate-600 hover:text-blue-600 font-semibold text-center cursor-pointer border-none bg-transparent" style="min-width: 58px;">
        <span style="font-size: 1.15rem;">🎯</span>
        <span style="font-size: 0.68rem; line-height: 1.1; margin-top: 2px;">AI Match</span>
      </button>
      <button type="button" onclick="window.openLoginModal()" class="flex flex-col items-center justify-center p-1.5 text-slate-600 hover:text-blue-600 font-semibold text-center cursor-pointer border-none bg-transparent" style="min-width: 58px;">
        <span style="font-size: 1.15rem;">👤</span>
        <span style="font-size: 0.68rem; line-height: 1.1; margin-top: 2px;">Persona</span>
      </button>
    </nav>
  `;
}

window.setHeroFacultySubject = function(subject) {
  if (!AppState.filoConnect) AppState.filoConnect = {};
  AppState.filoConnect.subject = subject;
  AppState.heroShowcaseSubject = subject;
  if (typeof window.renderApp === 'function') {
    window.renderApp();
  }
};

/* ───── Internal animations ──────────────────────────── */

function _startTypingEffect() {
  const words = ['effortless.', 'personal.', 'inspiring.', 'rigorous.'];
  let idx = 0;
  const el = document.getElementById('hero-typed-word');
  if (!el) return;

  setInterval(() => {
    idx = (idx + 1) % words.length;
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    el.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    setTimeout(() => {
      el.textContent = words[idx];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 260);
  }, 3200);
}

function _initHeroParallax() {
  // Graceful passive scroll
  const handleScroll = () => {
    const nav = document.getElementById('siko-nav');
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.08)';
    } else {
      nav.style.boxShadow = 'none';
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
}
