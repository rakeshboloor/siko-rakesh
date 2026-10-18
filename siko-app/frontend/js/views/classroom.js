/**
 * SIKO DIGITAL CLASSROOM — JITSI MEET POWERED
 * Real-time live lectures via Jitsi Meet embedded SDK.
 * Teacher + Student roles, whiteboard overlay, quiz layer,
 * academic toolbar (calculator, formulas, notes, timer).
 */

import { AppState } from '../state.js';
import { Icons } from '../components.js';

/* ── Jitsi room name generator ───────────────────────────────────────────── */
function jitsiRoomName(session) {
  return 'SIKO-' + session.replace(/[^a-zA-Z0-9]/g, '-');
}

export function renderClassroom() {
  const c = AppState.classroom;
  const isTeacher = AppState.currentRole === 'teacher';
  const role = AppState.currentRole;

  const currentBatch = c.currentBatch;
  const courseTitle = (currentBatch && (currentBatch.title || currentBatch.courseName)) || c.courseTitle || 'JEE Physics: Mechanics Cohort JP-01';
  const chapterTitle = (currentBatch && (currentBatch.chapter || currentBatch.topic)) || c.chapterTitle || "Newton's Laws & Friction on Incline Planes";
  const facultyName = (currentBatch && (currentBatch.teacher || currentBatch.teacher_name)) || c.facultyName || 'Dedicated Master Faculty';
  const studentName = (AppState.currentUser && AppState.currentUser.name) || 'Enrolled Student';

  const progressPercent = Math.round((c.classElapsedTimeSeconds / c.classTotalSeconds) * 100);
  const minutesElapsed  = Math.floor(c.classElapsedTimeSeconds / 60);
  const secondsElapsed  = c.classElapsedTimeSeconds % 60;
  const timeFormatted   = `${minutesElapsed}:${secondsElapsed < 10 ? '0' : ''}${secondsElapsed}`;

  const displayName = isTeacher ? `${facultyName} (Teacher)` : `${studentName} (Student)`;
  const rawRoom = (currentBatch && (currentBatch.jitsiRoom || currentBatch.productId || currentBatch.batchRef)) || c.sessionName || 'JEE-Physics-Mechanics-JP01';
  const roomName    = jitsiRoomName(rawRoom);

  /* On mobile screens, default sidepanel to collapsed on initial entry so live video stage is immediately visible */
  if (typeof window !== 'undefined' && window.innerWidth <= 768 && !c._mobileSidePanelInitialized) {
    c.sidePanelCollapsed = true;
    c._mobileSidePanelInitialized = true;
  }

  /* Register global helper to re-mount Jitsi when requested */
  window._mountJitsiHelper = () => _mountJitsi(roomName, displayName, isTeacher);

  /* Kick off Jitsi after DOM mounts if in jitsi mode */
  if (!c.mode || c.mode === 'jitsi') {
    setTimeout(() => _mountJitsi(roomName, displayName, isTeacher), 150);
  }

  return `
    <div class="classroom-container" id="sikoClassroomRoot">

      <!-- ═══ TOP BAR ═══ -->
      <header class="classroom-topbar">
        <div class="classroom-brand-info">
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
            <span style="width:28px;height:28px;border-radius:6px;background:linear-gradient(135deg,#1E3A8A,#2563EB);display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:0.85rem;">S</span>
            <span style="font-weight:700;color:white;font-size:0.95rem;letter-spacing:-0.01em;">SIKO Classroom</span>
          </div>
          <span class="classroom-badge-live">
            <span class="live-dot"></span> LIVE
          </span>
          <div class="classroom-meta-titles">
            <span class="classroom-course-title">${courseTitle}</span>
            <span class="classroom-chapter-title">Chapter: ${chapterTitle}</span>
          </div>
          <div class="classroom-ai-pill flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-950/70 border border-violet-500/30 text-violet-200 text-2xs font-semibold">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🎙️ AI Listener: Mapping Lecture to Student Learning DNA</span>
          </div>
        </div>

        <div class="classroom-progress-info">
          <div style="text-align:right;">
            <div style="font-family:var(--font-mono);font-size:0.75rem;color:white;">${timeFormatted} / 60:00</div>
            <div style="font-size:0.6rem;color:#94A3B8;">${c.participants.length} Active Students</div>
          </div>
          <div class="classroom-progress-track">
            <div class="classroom-progress-bar" style="width:${progressPercent}%;"></div>
          </div>
        </div>

        <div class="classroom-top-actions">
          <button class="mode-toggle-btn ${(!c.mode || c.mode === 'jitsi') ? 'active' : ''}"
            onclick="window.setClassroomMode('jitsi')">
            🎥 Live Video
          </button>
          <button class="mode-toggle-btn ${c.mode === 'whiteboard' ? 'active' : ''}"
            onclick="window.setClassroomMode('whiteboard')">
            ✏️ Whiteboard
          </button>
          <button class="mode-toggle-btn ${c.mode === 'quiz' ? 'active' : ''}"
            onclick="window.setClassroomMode('quiz')">
            ⚡ Live Quiz
          </button>
          <button id="btnTopbarChatToggle" class="mode-toggle-btn ${!c.sidePanelCollapsed ? 'active' : ''}"
            onclick="window.toggleSidePanel()" title="Toggle Chat & Q&A">
            💬 Chat (${c.chatMessages.length})
          </button>
          <button class="mode-toggle-btn" onclick="window.toggleClassroomFullscreen()" title="Fullscreen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- ═══ MAIN BODY ═══ -->
      <div class="classroom-body">

        <!-- Central Stage -->
        <main class="classroom-stage" id="classroomStage">
          ${_renderStage(c, isTeacher, roomName, displayName)}
        </main>

        <!-- Right Side Panel (Desktop) / Bottom Split-Screen Panel (Mobile — Never Overlays Video) -->
        <aside class="classroom-sidepanel ${c.sidePanelCollapsed ? 'collapsed' : ''}" id="classroomSidepanel">
          ${_renderSidePanelFull(c)}
        </aside>
      </div>

      <!-- ═══ ACADEMIC TOOLBAR ═══ -->
      <div class="academic-toolbar-dock">
        <button class="academic-tool-item ${c.activeTool === 'formula' ? 'active' : ''}" onclick="window.toggleAcademicTool('formula')">
          ${Icons.bookOpen} Formula Sheet
        </button>
        <button class="academic-tool-item ${c.activeTool === 'calculator' ? 'active' : ''}" onclick="window.toggleAcademicTool('calculator')">
          ${Icons.tool} Calculator
        </button>
        <button class="academic-tool-item ${c.activeTool === 'notes' ? 'active' : ''}" onclick="window.toggleAcademicTool('notes')">
          ✏️ My Notes
        </button>
        <button class="academic-tool-item ${c.activeTool === 'timer' ? 'active' : ''}" onclick="window.toggleAcademicTool('timer')">
          ${Icons.clock} Focus Timer
        </button>
        <button class="academic-tool-item" onclick="window.showToast('Resources: Friction & Free Body Diagrams.pdf', 'info')">
          📄 Resources
        </button>
        ${isTeacher ? `
          <button class="academic-tool-item" onclick="window.openJitsiShareLink('${roomName}')" style="color:#34D399;border-color:rgba(52,211,153,0.3);">
            🔗 Share Room Link
          </button>
        ` : ''}
      </div>

      <!-- Floating Tool Windows -->
      ${_renderFloatingTools(c)}

      <!-- ═══ BOTTOM BAR ═══ -->
      <footer class="classroom-bottombar">
        <div class="classroom-controls-group classroom-controls-media">
          <button class="classroom-ctrl-btn ${c.isMicOn ? 'active' : 'muted'}"
            onclick="window.toggleMic()" title="${c.isMicOn ? 'Mute' : 'Unmute'}">
            ${c.isMicOn ? Icons.mic : Icons.micOff}
            <span style="font-size:0.55rem;display:block;margin-top:2px;">${c.isMicOn ? 'Mute' : 'Unmute'}</span>
          </button>
          <button class="classroom-ctrl-btn ${c.isCamOn ? 'active' : 'muted'}"
            onclick="window.toggleCamera()" title="Camera">
            ${Icons.video}
            <span style="font-size:0.55rem;display:block;margin-top:2px;">Camera</span>
          </button>
          <button class="classroom-ctrl-btn ${c.isScreenSharing ? 'active' : ''}"
            onclick="window.toggleScreenShare()" title="Share Screen">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <span style="font-size:0.55rem;display:block;margin-top:2px;">Screen</span>
          </button>
          <button class="classroom-ctrl-btn ${c.isHandRaised ? 'active' : ''}"
            onclick="window.toggleRaiseHand()" title="Raise Hand">
            ${Icons.hand}
            <span style="font-size:0.55rem;display:block;margin-top:2px;">Hand</span>
          </button>
          <button id="btnBottombarChatToggle" class="classroom-ctrl-btn ${!c.sidePanelCollapsed ? 'active' : ''}" onclick="window.toggleSidePanel()" title="Chat">
            ${Icons.chat}
            <span style="font-size:0.55rem;display:block;margin-top:2px;">Chat</span>
          </button>
        </div>

        <div class="classroom-controls-group classroom-controls-role">
          ${isTeacher ? `
            <button class="btn btn-outline btn-sm text-blue-300 border-blue-500/40" onclick="window.openTeacherAttendanceModal()">
              ${Icons.users} Attendance
            </button>
            <button class="btn btn-outline btn-sm text-amber-300 border-amber-500/40" onclick="window.launchClassroomQuiz()">
              ${Icons.sparkles} Launch Quiz
            </button>
            <button class="btn btn-outline btn-sm text-emerald-300 border-emerald-500/40" onclick="window.assignClassroomHomework()">
              ${Icons.bookOpen} Assign HW
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.completeClassroomSession()">
              ${Icons.check} End Class
            </button>
          ` : `
            <span class="classroom-connected-label" style="font-size:0.75rem;color:#94A3B8;">
              Connected · <strong style="color:white;">${facultyName}</strong>
            </span>
            <button class="btn btn-outline btn-sm text-amber-400 border-amber-400/30"
              onclick="window.switchRole('teacher'); window.showToast('Switched to Teacher View', 'info')">
              Switch to Teacher View
            </button>
          `}
        </div>

        <div class="classroom-controls-leave">
          <button class="classroom-leave-btn" onclick="window.confirmLeaveClassroom()">
            Leave Classroom
          </button>
        </div>
      </footer>
    </div>
  `;
}

/* ── Stage renderer ──────────────────────────────────────────────────────── */
function _renderStage(c, isTeacher, roomName, displayName) {
  const activeDoubt = c.activeInstantDoubt || null;
  const teacherName = (c.currentBatch && (c.currentBatch.teacher || c.currentBatch.teacher_name)) || c.facultyName || 'Dedicated Master Faculty';
  const teacherAvatar = c.facultyAvatar || 'assets/teachers/teacher_physics_indian.png';

  /* JITSI live video (default mode) */
  if (!c.mode || c.mode === 'jitsi') {
    return `
      <div style="position:relative;width:100%;height:100%;flex:1;min-height:0;display:flex;flex-direction:column;background:#020617;overflow:hidden;">
        ${activeDoubt ? `
          <div class="classroom-pinned-doubt-bar" style="background:rgba(6,78,59,0.9);border-bottom:1px solid rgba(16,185,129,0.4);padding:8px 14px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;z-index:20;">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:0.74rem;color:#ECFDF5;">
              <span style="background:#10B981;color:#022C22;font-weight:800;padding:2px 8px;border-radius:99px;font-size:0.63rem;white-space:nowrap;">⚡ 1:1 LIVE DOUBT PINNED</span>
              <span><strong>${activeDoubt.subject}:</strong> ${activeDoubt.question}</span>
            </div>
            <button onclick="window.setClassroomMode('whiteboard')" style="background:#10B981;color:#022C22;border:none;border-radius:6px;padding:4px 10px;font-size:0.68rem;font-weight:800;cursor:pointer;white-space:nowrap;">
              Open Live Whiteboard Derivation →
            </button>
          </div>
        ` : ''}
        <!-- Jitsi iframe container -->
        <div id="jitsi-container" style="width:100%;height:100%;flex:1;min-height:0;display:flex;position:relative;background:#020617;"></div>

        <!-- Non-blocking quick overlay shown briefly during handshake -->
        <div id="jitsi-loading" style="
          position:absolute;inset:0;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          background:rgba(2,6,23,0.92);z-index:10;
          gap:12px;padding:16px;text-align:center;
          transition:opacity 0.3s ease;
        ">
          <div style="
            width:48px;height:48px;border-radius:50%;
            border:3px solid rgba(37,99,235,0.2);
            border-top-color:#2563EB;
            animation:spin 1s linear infinite;
          "></div>
          <div>
            <div style="color:white;font-weight:800;font-size:0.95rem;margin-bottom:4px;">
              Connecting to SIKO Live Classroom...
            </div>
            <div style="color:#94A3B8;font-size:0.78rem;">
              Room: <span style="color:#60A5FA;font-family:monospace;font-weight:700;">${roomName}</span>
            </div>
            <div style="color:#64748B;font-size:0.72rem;margin-top:4px;">
              Joining as <strong style="color:#E2E8F0;">${displayName}</strong> · Educator: <strong style="color:#34D399;">${teacherName}</strong>
            </div>
          </div>
          <div style="
            background:rgba(37,99,235,0.1);border:1px solid rgba(37,99,235,0.2);
            border-radius:10px;padding:10px 14px;text-align:center;max-width:320px;
          ">
            <div style="color:#60A5FA;font-size:0.73rem;font-weight:600;margin-bottom:4px;">
              📋 Allow camera & microphone access when prompted
            </div>
            <div style="color:#64748B;font-size:0.66rem;line-height:1.45;">
              Encrypted live interactive digital classroom powered by Jitsi Meet.
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:4px;">
            <button onclick="window.dismissJitsiLoader()" class="btn btn-primary btn-sm px-4">
              Enter Live Stream →
            </button>
            <button onclick="window.setClassroomMode('whiteboard')" class="btn btn-outline btn-sm text-emerald-300 border-emerald-500/40">
              ✏️ Open Live Whiteboard
            </button>
            <a href="https://meet.jit.si/${roomName}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm text-blue-300 border-blue-500/40">
              Open Full Tab ↗
            </a>
          </div>
        </div>
      </div>
      <style>
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
    `;
  }

  /* WHITEBOARD mode */
  if (c.mode === 'whiteboard') {
    const wbHeader = activeDoubt
      ? `⚡ 1:1 Live Doubt (${activeDoubt.subject}) — ${teacherName}`
      : 'Laws of Motion — Incline Plane';
    const wbBody = activeDoubt
      ? `<div style="color:#FDE68A;font-weight:700;margin-bottom:4px;">Q: ${activeDoubt.question}</div><div style="white-space:pre-line;">${activeDoubt.derivation || '1. Identify Fundamental Law & Conservation Principle\n2. Formulate First-Principles Equations\n3. Solve for Target Variable & Verify Limiting Case'}</div>`
      : `1. N = mg · cos(θ)<br>2. F<sub style="font-size:0.6em;">down</sub> = mg · sin(θ)<br>3. f<sub style="font-size:0.6em;">s(max)</sub> = μ<sub style="font-size:0.6em;">s</sub> · N<br><span style="color:#34D399;font-weight:700;">&rArr; Motion iff: tan(θ) &gt; μ<sub style="font-size:0.6em;">s</sub></span>`;

    return `
      <div class="whiteboard-stage">
        <div class="whiteboard-toolbar">
          <button class="wb-tool-btn active" title="Pen" onclick="window.selectWbTool('pen')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
            </svg>
          </button>
          <button class="wb-tool-btn" title="Highlighter" onclick="window.selectWbTool('highlighter')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l-6 6v3h3l6-6"/><path d="M22 2l-7 7 4 4 7-7z"/>
            </svg>
          </button>
          <button class="wb-tool-btn" title="Shapes" onclick="window.selectWbTool('shape')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
            </svg>
          </button>
          <button class="wb-tool-btn" title="Formula" onclick="window.insertWbFormula()">
            <span style="font-family:serif;font-weight:bold;font-size:0.75rem;">&radic;x</span>
          </button>
          <button class="wb-tool-btn" title="Clear" onclick="window.clearWhiteboard()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
          <div style="width:1px;height:16px;background:#334155;margin:0 6px;flex-shrink:0;"></div>
          <span class="wb-sync-badge" style="font-size:0.6rem;color:#34D399;font-weight:700;white-space:nowrap;">✓ Collaborative Sync Active · AI Lecture Listener Recording</span>
          <div style="margin-left:auto;flex-shrink:0;">
            <button class="wb-tool-btn" title="Return to Video" onclick="window.setClassroomMode('jitsi')" style="color:#34D399;font-size:0.65rem;padding:4px 8px;width:auto;white-space:nowrap;">
              🎥 Back to Video
            </button>
          </div>
        </div>
        <div class="whiteboard-canvas-area" id="wbCanvasWrap">
          <canvas id="whiteboardCanvas"></canvas>
          <div class="wb-derivation-card" style="position:absolute;top:16px;left:16px;padding:12px 16px;border-radius:12px;background:rgba(15,23,42,0.92);border:1px solid rgba(51,65,85,0.85);max-width:440px;pointer-events:none;">
            <div style="color:#FBBF24;font-weight:700;font-size:0.7rem;margin-bottom:6px;font-family:'Plus Jakarta Sans',sans-serif;text-transform:uppercase;letter-spacing:0.05em;">
              ${wbHeader}
            </div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:#93C5FD;line-height:1.7;">
              ${wbBody}
            </div>
          </div>
          <div class="teacher-pip">
            <img src="${teacherAvatar}"
                 style="width:100%;height:100%;object-fit:cover;" />
            <div style="position:absolute;bottom:4px;left:4px;background:rgba(0,0,0,0.75);padding:2px 8px;border-radius:4px;font-size:0.6rem;color:white;font-weight:700;display:flex;align-items:center;gap:4px;">
              <span style="width:5px;height:5px;border-radius:50%;background:#34D399;display:inline-block;"></span> ${teacherName}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* QUIZ mode */
  if (c.mode === 'quiz') {
    const q = c.activeQuiz;
    return `
      <div style="position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#020617;padding:24px;">
        <div class="quiz-overlay">
          <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1px solid #1E293B;margin-bottom:16px;">
            <span class="badge badge-warning">⚡ Live Pop Quiz</span>
            <span style="font-size:0.72rem;color:#94A3B8;font-family:monospace;">Time remaining: <strong style="color:#FCD34D;">42s</strong></span>
          </div>
          <h3 style="font-size:0.875rem;font-weight:700;color:white;margin-bottom:16px;line-height:1.6;">${q.questionText}</h3>
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px;">
            ${q.options.map((opt, idx) => `
              <div class="quiz-option ${q.userSelected === idx ? 'selected' : ''}" onclick="window.selectQuizOption(${idx})">
                <span style="width:20px;height:20px;border-radius:50%;border:1.5px solid ${q.userSelected === idx ? '#2563EB' : '#475569'};display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;background:${q.userSelected === idx ? '#2563EB' : 'transparent'};color:${q.userSelected === idx ? 'white' : '#94A3B8'};flex-shrink:0;">${idx + 1}</span>
                <span style="font-size:0.82rem;color:#E2E8F0;">${opt}</span>
              </div>
            `).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:0.65rem;color:#64748B;">11 of 12 students answered</span>
            <button class="btn btn-primary btn-sm" onclick="window.submitClassroomQuiz()">Submit Answer</button>
          </div>
        </div>
      </div>
    `;
  }

  return '';
}

/* ── Full side panel renderer & in-place DOM sync (prevents video reload) ── */
function _renderSidePanelFull(c) {
  return `
    <div class="sidepanel-header-tabs">
      <button class="sidepanel-tab ${c.sidePanelTab === 'chat' ? 'active' : ''}" onclick="window.setSidePanelTab('chat')">
        💬 Chat (${c.chatMessages.length})
      </button>
      <button class="sidepanel-tab ${c.sidePanelTab === 'doubts' ? 'active' : ''}" onclick="window.setSidePanelTab('doubts')">
        ❓ Q&amp;A (${c.doubts.length})
      </button>
      <button class="sidepanel-tab ${c.sidePanelTab === 'participants' ? 'active' : ''}" onclick="window.setSidePanelTab('participants')">
        👥 People (${c.participants.length})
      </button>
      <button class="sidepanel-tab" onclick="window.toggleSidePanel()" style="flex:0 0 auto;padding:0.45rem 0.7rem;color:#F87171;font-weight:800;background:rgba(239,68,68,0.12);" title="Hide Chat Panel">
        ✕ Hide
      </button>
    </div>
    <div class="sidepanel-body" id="sidepanelBody">
      ${_renderSidePanel(c)}
    </div>
    ${c.sidePanelTab === 'chat' ? `
      <div class="chat-input-row">
        <input type="text" class="chat-input-field" placeholder="Ask in classroom..."
          id="classroomChatInput"
          onkeydown="if(event.key==='Enter') window.sendClassroomMessage()" />
        <button class="btn btn-primary btn-sm" onclick="window.sendClassroomMessage()">Send</button>
      </div>
    ` : ''}
  `;
}

window.syncClassroomSidePanelDOM = () => {
  const panel = document.getElementById('classroomSidepanel');
  if (!panel) return false;
  const c = AppState.classroom;
  if (c.sidePanelCollapsed) {
    panel.classList.add('collapsed');
  } else {
    panel.classList.remove('collapsed');
    panel.innerHTML = _renderSidePanelFull(c);
    const body = document.getElementById('sidepanelBody');
    if (body && c.sidePanelTab === 'chat') {
      body.scrollTop = body.scrollHeight;
    }
  }
  const topBtn = document.getElementById('btnTopbarChatToggle');
  if (topBtn) {
    topBtn.classList.toggle('active', !c.sidePanelCollapsed);
    topBtn.innerHTML = `💬 Chat (${c.chatMessages.length})`;
  }
  const botBtn = document.getElementById('btnBottombarChatToggle');
  if (botBtn) {
    botBtn.classList.toggle('active', !c.sidePanelCollapsed);
  }
  return true;
};

/* ── Side panel body ─────────────────────────────────────────────────────── */
function _renderSidePanel(c) {
  if (c.sidePanelTab === 'chat') {
    return c.chatMessages.map(msg => `
      <div class="chat-bubble">
        <div class="chat-bubble-author">
          <span>${msg.sender}</span>
          <span style="font-size:0.6rem;color:#475569;">${msg.time}</span>
        </div>
        <p style="color:#CBD5E1;line-height:1.5;font-size:0.8rem;">${msg.text}</p>
      </div>
    `).join('');
  }

  if (c.sidePanelTab === 'doubts') {
    return `
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button class="btn btn-outline btn-sm" style="width:100%;color:#60A5FA;border-color:rgba(96,165,250,0.3);" onclick="window.openAskDoubtInClass()">
          + Post Doubt
        </button>
        ${c.doubts.map(d => `
          <div style="padding:10px 12px;border-radius:10px;background:#0F172A;border:1px solid #1E293B;font-size:0.78rem;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
              <span style="font-weight:700;color:#CBD5E1;">${d.student}</span>
              <button style="font-size:0.65rem;color:#FBBF24;font-weight:700;background:none;border:none;cursor:pointer;" onclick="window.upvoteDoubt('${d.id}')">▲ ${d.upvotes}</button>
            </div>
            <p style="color:#94A3B8;margin-bottom:6px;line-height:1.5;">${d.text}</p>
            ${d.answered
              ? `<span class="badge badge-success" style="font-size:0.6rem;">✓ Answered</span>`
              : `<span class="badge badge-neutral" style="font-size:0.6rem;">Queued</span>`
            }
          </div>
        `).join('')}
      </div>
    `;
  }

  return `
    <div style="display:flex;flex-direction:column;gap:6px;">
      ${c.participants.map(p => `
        <div style="padding:8px 10px;border-radius:8px;background:#0F172A;border:1px solid #1E293B;display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:24px;height:24px;border-radius:50%;background:#1E293B;color:#94A3B8;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.65rem;">${p.name.charAt(0)}</span>
            <span style="color:#E2E8F0;font-size:0.78rem;font-weight:500;">${p.name}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;color:#64748B;">
            ${p.handRaised ? `<span style="color:#FBBF24;" title="Hand Raised">${Icons.hand}</span>` : ''}
            <span>${p.isSpeaking ? Icons.mic : Icons.micOff}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ── Floating tool modals ────────────────────────────────────────────────── */
function _renderFloatingTools(c) {
  return `
    <!-- Calculator -->
    <div class="academic-modal-box ${c.activeTool === 'calculator' ? 'open' : ''}" id="modalCalculator">
      <div class="academic-modal-header">
        <span>Scientific Calculator</span>
        <button style="color:#64748B;" onclick="window.toggleAcademicTool(null)">&times;</button>
      </div>
      <div style="padding:12px;">
        <input type="text" id="calcDisplay" style="width:100%;background:#0F172A;color:white;font-family:monospace;text-align:right;padding:10px 12px;border-radius:6px;font-size:1rem;margin-bottom:10px;border:1px solid #334155;" value="0" readonly />
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;font-size:0.72rem;font-family:monospace;font-weight:700;">
          ${[['sin(','cos(','tan(','C'],['7','8','9','/'],['4','5','6','*'],['1','2','3','-'],['0','.','=','+']].map(row =>
            row.map(k => `
              <button style="padding:8px 4px;border-radius:6px;background:#1E293B;color:${['sin(','cos(','tan('].includes(k)?'#60A5FA':k==='C'?'#F87171':['/','+','-','*'].includes(k)?'#FBBF24':k==='='?'#2563EB':'#E2E8F0'};border:none;cursor:pointer;transition:background 0.15s;"
              onmouseover="this.style.background='#334155'" onmouseout="this.style.background='${k==='='?'#2563EB':'#1E293B'}'"
              onclick="${k==='='?'window.calcEvaluate()':k==='C'?'window.calcClear()':`window.calcInput('${k}')`}">${k}</button>
            `).join('')
          ).join('')}
        </div>
      </div>
    </div>

    <!-- Formula Sheet -->
    <div class="academic-modal-box ${c.activeTool === 'formula' ? 'open' : ''}" id="modalFormula">
      <div class="academic-modal-header">
        <span>Mechanics Formula Reference</span>
        <button style="color:#64748B;" onclick="window.toggleAcademicTool(null)">&times;</button>
      </div>
      <div style="padding:12px;font-family:monospace;font-size:0.72rem;color:#93C5FD;display:flex;flex-direction:column;gap:8px;max-height:260px;overflow-y:auto;">
        ${[
          ['Newton\'s 2nd Law', '&Sigma;F = m&middot;a = dp/dt'],
          ['Friction Force', 'f_s &le; &mu;_s&middot;N &nbsp;|&nbsp; f_k = &mu;_k&middot;N'],
          ['Work-Energy Theorem', 'W_net = &Delta;K = &frac12;mv&sup2; - &frac12;mu&sup2;'],
          ['Momentum', 'p = mv &nbsp;|&nbsp; J = &Delta;p = F&middot;t'],
          ['Circular Motion', 'a_c = v&sup2;/r = &omega;&sup2;r'],
          ['Torque', '&tau; = r &times; F = I&alpha;'],
        ].map(([title, formula]) => `
          <div style="background:#0F172A;border:1px solid #1E293B;border-radius:6px;padding:8px 10px;">
            <div style="color:#FBBF24;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.65rem;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.05em;">${title}</div>
            <div>${formula}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Class Notes -->
    <div class="academic-modal-box ${c.activeTool === 'notes' ? 'open' : ''}" id="modalNotes">
      <div class="academic-modal-header">
        <span>Personal Class Notes</span>
        <button style="color:#64748B;" onclick="window.toggleAcademicTool(null)">&times;</button>
      </div>
      <div style="padding:12px;">
        <textarea style="width:100%;height:160px;background:#0F172A;color:#CBD5E1;font-size:0.75rem;padding:10px;border-radius:6px;border:1px solid #334155;resize:none;outline:none;line-height:1.6;"
          id="studentNotesArea">${c.studentNotes || '// My class notes...\n// Session: JEE Physics — Newton\'s Laws'}</textarea>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
          <span style="font-size:0.65rem;color:#34D399;">✓ Auto-saved</span>
          <button class="btn btn-outline btn-sm" style="font-size:0.7rem;" onclick="window.exportNotesPDF()">Export PDF</button>
        </div>
      </div>
    </div>

    <!-- Focus Timer -->
    <div class="academic-modal-box ${c.activeTool === 'timer' ? 'open' : ''}" id="modalTimer" style="width:220px;">
      <div class="academic-modal-header">
        <span>Deep Focus Timer</span>
        <button style="color:#64748B;" onclick="window.toggleAcademicTool(null)">&times;</button>
      </div>
      <div style="padding:16px;text-align:center;">
        <div style="font-family:monospace;font-size:2.5rem;font-weight:900;color:white;letter-spacing:-0.02em;margin-bottom:4px;" id="focusTimerDisplay">15:00</div>
        <p style="font-size:0.65rem;color:#64748B;margin-bottom:12px;">Problem sprint timer</p>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-primary btn-sm" style="flex:1;" onclick="window.startFocusTimer()">Start</button>
          <button class="btn btn-outline btn-sm" style="flex:1;" onclick="window.resetFocusTimer()">Reset</button>
        </div>
      </div>
    </div>

    <!-- Jitsi Share Link Modal -->
    <div id="jitsiShareModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:1000;align-items:center;justify-content:center;">
      <div style="background:#1E293B;border-radius:16px;padding:24px;max-width:400px;width:90%;border:1px solid #334155;">
        <h3 style="color:white;font-weight:700;margin-bottom:8px;">Share Classroom Link</h3>
        <p style="color:#94A3B8;font-size:0.8rem;margin-bottom:16px;">Students can join directly via this Jitsi Meet link:</p>
        <div style="background:#0F172A;border-radius:8px;padding:12px;font-family:monospace;font-size:0.72rem;color:#60A5FA;word-break:break-all;margin-bottom:16px;border:1px solid #334155;" id="jitsiShareUrl"></div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-primary btn-sm" style="flex:1;" onclick="window.copyJitsiLink()">Copy Link</button>
          <button class="btn btn-outline btn-sm" style="flex:1;" onclick="document.getElementById('jitsiShareModal').style.display='none'">Close</button>
        </div>
      </div>
    </div>
  `;
}

/* ── Jitsi initialiser (called after DOM mount) ──────────────────────────── */
function _mountJitsi(roomName, displayName, isTeacher) {
  const container = document.getElementById('jitsi-container');
  if (!container) return;

  // Auto-dismiss the loader after 1.5 seconds so user is never locked out
  setTimeout(() => {
    const l = document.getElementById('jitsi-loading');
    if (l) {
      l.style.opacity = '0';
      l.style.pointerEvents = 'none';
      setTimeout(() => { if (l) l.style.display = 'none'; }, 300);
    }
  }, 1500);

  /* If Jitsi external API already exists on window, start meeting */
  if (window.JitsiMeetExternalAPI) {
    _startJitsiMeeting(roomName, displayName, isTeacher);
    return;
  }

  /* Load Jitsi External API script */
  let scriptLoaded = false;
  const script = document.createElement('script');
  script.src = 'https://meet.jit.si/external_api.js';
  script.async = true;
  script.onload = () => {
    scriptLoaded = true;
    _startJitsiMeeting(roomName, displayName, isTeacher);
  };
  script.onerror = () => {
    console.warn('Jitsi script error, falling back to direct iframe embed.');
    _mountDirectJitsiIframe(container, roomName, displayName, isTeacher);
  };
  document.head.appendChild(script);

  // Fallback timer: if Jitsi script doesn't initialize within 2.5s, embed direct iframe
  setTimeout(() => {
    if (!scriptLoaded && !window._sikoJitsiApi) {
      const c = document.getElementById('jitsi-container');
      if (c && !c.querySelector('iframe')) {
        console.log('Mounting direct Jitsi iframe for instant video connection...');
        _mountDirectJitsiIframe(c, roomName, displayName, isTeacher);
      }
    }
  }, 2500);
}

function _mountDirectJitsiIframe(container, roomName, displayName, isTeacher) {
  if (!container) return;
  const encodedName = encodeURIComponent(displayName);
  const src = `https://meet.jit.si/${roomName}#userInfo.displayName="${encodedName}"&config.prejoinPageEnabled=false&config.startWithAudioMuted=${!isTeacher}&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.TOOLBAR_ALWAYS_VISIBLE=true`;
  container.innerHTML = `
    <iframe 
      id="siko-jitsi-iframe"
      src="${src}" 
      allow="camera *; microphone *; display-capture *; autoplay *; clipboard-run *; screen-wake-lock *; fullscreen *" 
      allowfullscreen="true"
      style="width:100%;height:100%;min-height:100%;border:0;display:block;background:#020617;"
    ></iframe>
  `;
  const l = document.getElementById('jitsi-loading');
  if (l) l.style.display = 'none';
}

function _startJitsiMeeting(roomName, displayName, isTeacher) {
  const container = document.getElementById('jitsi-container');
  const loader    = document.getElementById('jitsi-loading');
  if (!container) return;

  if (!window.JitsiMeetExternalAPI) {
    _mountDirectJitsiIframe(container, roomName, displayName, isTeacher);
    return;
  }

  /* Destroy existing instance if re-mounting */
  if (window._sikoJitsiApi) {
    try { window._sikoJitsiApi.dispose(); } catch (e) {}
    window._sikoJitsiApi = null;
  }

  container.innerHTML = '';

  try {
    const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
      roomName,
      width: '100%',
      height: '100%',
      parentNode: container,

      configOverwrite: {
        startWithAudioMuted: !isTeacher,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        enableNoisyMicDetection: true,
        enableClosePage: false,
        toolbarButtons: [
          'microphone', 'camera', 'desktop',
          'raisehand', 'tileview', 'fullscreen', 'hangup',
        ],
        hideConferenceSubject: false,
        subject: `SIKO • ${roomName}`,
      },

      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        BRAND_WATERMARK_LINK: '',
        SHOW_POWERED_BY: false,
        DEFAULT_BACKGROUND: '#020617',
        DEFAULT_LOCAL_DISPLAY_NAME: displayName,
        TOOLBAR_ALWAYS_VISIBLE: true,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
        MOBILE_APP_PROMO: false,
      },

      userInfo: {
        displayName,
        email: isTeacher ? 'teacher@siko.demo' : 'student@siko.demo',
      },
    });

    window._sikoJitsiApi = api;

    // Ensure iframe fills 100% and has camera/mic permissions
    setTimeout(() => {
      const iframe = container.querySelector('iframe');
      if (iframe) {
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = '0';
        iframe.setAttribute('allow', 'camera *; microphone *; display-capture *; autoplay *; clipboard-run *; screen-wake-lock *; fullscreen *');
        iframe.setAttribute('allowfullscreen', 'true');
      }
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => { if (loader) loader.style.display = 'none'; }, 300);
      }
    }, 500);

    /* Hide loader when video conference is ready */
    api.addEventListener('videoConferenceJoined', () => {
      if (loader) loader.style.display = 'none';
      if (isTeacher) {
        api.executeCommand('subject', `SIKO • ${roomName}`);
      }
    });

    api.addEventListener('readyToClose', () => {
      window.confirmLeaveClassroom();
    });

    api.addEventListener('participantJoined', ({ id, displayName: name }) => {
      window.showToast(`${name} joined the classroom`, 'info');
    });

    api.addEventListener('participantLeft', ({ id }) => {
      window.showToast('A student left the classroom', 'info');
    });

    api.addEventListener('audioMuteStatusChanged', ({ muted }) => {
      AppState.classroom.isMicOn = !muted;
    });

    api.addEventListener('videoMuteStatusChanged', ({ muted }) => {
      AppState.classroom.isCamOn = !muted;
    });
  } catch (err) {
    console.warn('Error starting JitsiMeetExternalAPI, falling back to direct iframe:', err);
    _mountDirectJitsiIframe(container, roomName, displayName, isTeacher);
  }
}

/* ── Window globals for Jitsi controls ───────────────────────────────────── */
window.dismissJitsiLoader = () => {
  const l = document.getElementById('jitsi-loading');
  if (l) {
    l.style.opacity = '0';
    l.style.pointerEvents = 'none';
    l.style.display = 'none';
  }
};

window.toggleClassroomFullscreen = () => {
  const root = document.getElementById('sikoClassroomRoot');
  if (!root) return;
  if (!document.fullscreenElement) {
    if (root.requestFullscreen) {
      root.requestFullscreen();
    } else if (root.webkitRequestFullscreen) {
      root.webkitRequestFullscreen();
    }
    root.classList.add('fullscreen');
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    root.classList.remove('fullscreen');
  }
};

window.openJitsiShareLink = (roomName) => {
  const url = `https://meet.jit.si/${roomName}`;
  const el  = document.getElementById('jitsiShareUrl');
  const modal = document.getElementById('jitsiShareModal');
  if (el) el.textContent = url;
  if (modal) modal.style.display = 'flex';
};

window.copyJitsiLink = () => {
  const el = document.getElementById('jitsiShareUrl');
  if (el) {
    navigator.clipboard.writeText(el.textContent)
      .then(() => window.showToast('Classroom link copied!', 'success'))
      .catch(() => window.showToast('Copy link: ' + el.textContent, 'info'));
  }
};

window.startFocusTimer = () => {
  let secs = 15 * 60;
  const el = document.getElementById('focusTimerDisplay');
  if (!el) return;
  clearInterval(window._sikoFocusTimer);
  window._sikoFocusTimer = setInterval(() => {
    secs--;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    el.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
    if (secs <= 0) {
      clearInterval(window._sikoFocusTimer);
      window.showToast('⏱️ Focus sprint complete! Great work.', 'success');
    }
  }, 1000);
  window.showToast('15-minute focus sprint started!', 'info');
};

window.resetFocusTimer = () => {
  clearInterval(window._sikoFocusTimer);
  const el = document.getElementById('focusTimerDisplay');
  if (el) el.textContent = '15:00';
};
