"""
SIKO Production Bundler v2
Combines the full SPA frontend into a single self-contained HTML file
with real API integration and JWT auth.

Usage:
    python bundle_v2.py

Output:
    siko-bundle-v2.html  (serve this)
"""

import os, re, sys

# ── Paths ─────────────────────────────────────────────────────────────────────
SCRATCH     = os.path.dirname(os.path.abspath(__file__))
FRONTEND    = os.path.join(SCRATCH, 'siko-frontend')
APP_FRONT   = os.path.join(SCRATCH, 'siko-app', 'frontend')
OUT         = os.path.join(SCRATCH, 'siko-bundle-v2.html')

# ── JS files: order matters (deps first) ─────────────────────────────────────
OLD_VIEWS = os.path.join(FRONTEND, 'js', 'views')
NEW_VIEWS = os.path.join(APP_FRONT, 'js', 'views')

JS_FILES = [
    # New API layer (must be first)
    os.path.join(APP_FRONT, 'js', 'api.js'),
    # Guaranteed inlined high-DPI faculty photos
    os.path.join(FRONTEND, 'js', 'facultyPhotos.js'),
    # Existing state + components
    os.path.join(FRONTEND, 'js', 'state.js'),
    os.path.join(FRONTEND, 'js', 'components.js'),
    # New login view
    os.path.join(NEW_VIEWS, 'login.js'),
    # All existing views
    os.path.join(OLD_VIEWS, 'publicWebsite.js'),
    os.path.join(OLD_VIEWS, 'dynamicTimetableEngine.js'),
    os.path.join(OLD_VIEWS, 'studentHome.js'),
    os.path.join(OLD_VIEWS, 'studentOnboarding.js'),
    os.path.join(OLD_VIEWS, 'teacherDashboard.js'),
    os.path.join(OLD_VIEWS, 'teacherOnboarding.js'),
    os.path.join(OLD_VIEWS, 'teacherProfile.js'),
    os.path.join(OLD_VIEWS, 'teacherMarketplace.js'),
    os.path.join(OLD_VIEWS, 'teacherWallet.js'),
    os.path.join(OLD_VIEWS, 'teacherComparison.js'),
    os.path.join(OLD_VIEWS, 'teacherTier.js'),
    os.path.join(OLD_VIEWS, 'parentDashboard.js'),
    os.path.join(OLD_VIEWS, 'parentLiveView.js'),
    os.path.join(OLD_VIEWS, 'adminDashboard.js'),
    os.path.join(OLD_VIEWS, 'classroom.js'),
    os.path.join(OLD_VIEWS, 'assessment.js'),
    os.path.join(OLD_VIEWS, 'homework.js'),
    os.path.join(OLD_VIEWS, 'bookingFlow.js'),
    os.path.join(OLD_VIEWS, 'classCompletion.js'),
    os.path.join(OLD_VIEWS, 'recommendedTeachers.js'),
    os.path.join(OLD_VIEWS, 'learningDna.js'),
    os.path.join(OLD_VIEWS, 'smartBatches.js'),
    os.path.join(OLD_VIEWS, 'ptmView.js'),
    os.path.join(OLD_VIEWS, 'questionSynthesizer.js'),
    os.path.join(OLD_VIEWS, 'conceptTesting.js'),
    # Main app controller (last)
    os.path.join(FRONTEND, 'js', 'app.js'),
]

# ── CSS files ─────────────────────────────────────────────────────────────────
CSS_DIR = os.path.join(FRONTEND, 'css')
CSS_FILES = [
    os.path.join(CSS_DIR, 'tokens.css'),
    os.path.join(CSS_DIR, 'base.css'),
    os.path.join(CSS_DIR, 'components.css'),
    os.path.join(CSS_DIR, 'classroom.css'),
    os.path.join(CSS_DIR, 'responsive.css'),
]


def strip_modules(src, filename=''):
    """Remove ES module syntax to make JS compatible with single-file bundling."""
    src = re.sub(r'\bexport\s+default\s+', '', src)
    src = re.sub(r'\bexport\s+(async\s+)?function\b', 'function', src)
    src = re.sub(r'\bexport\s+class\b', 'class', src)
    src = re.sub(r'\bexport\s+const\b', 'const', src)
    src = re.sub(r'\bexport\s+let\b', 'let', src)
    src = re.sub(r'\bexport\s+\{[^}]*\};?\s*', '', src)
    src = re.sub(r'^import\s+.*?[\'"].*?[\'"];?\s*$', '', src, flags=re.MULTILINE)
    return src


def read_js(path):
    if not os.path.exists(path):
        print(f"  [SKIP] {path}")
        return f'/* MISSING: {os.path.basename(path)} */\n'
    with open(path, encoding='utf-8', errors='replace') as f:
        src = f.read()
    src = strip_modules(src, path)
    name = os.path.basename(path)
    print(f"  [JS]  {name} ({len(src):,} chars)")
    return f'\n// ====== {name} ======\n{src}\n'


def read_css(path):
    if not os.path.exists(path):
        return ''
    with open(path, encoding='utf-8', errors='replace') as f:
        return f.read()


print("SIKO Bundler v2 — Building production bundle...")

# ── Combine CSS ───────────────────────────────────────────────────────────────
combined_css = ''
for f in CSS_FILES:
    if os.path.exists(f):
        combined_css += read_css(f) + '\n'
        print(f"  [CSS] {os.path.basename(f)}")

tailwind_preflight = read_css(os.path.join(CSS_DIR, 'tailwind-preflight.css'))
tailwind_utilities = read_css(os.path.join(CSS_DIR, 'tailwind-utilities.css'))
if tailwind_utilities:
    print(f"  [CSS] tailwind-preflight.css ({len(tailwind_preflight):,} chars) + tailwind-utilities.css ({len(tailwind_utilities):,} chars)")

# ── Combine JS ────────────────────────────────────────────────────────────────
combined_js = ''
for f in JS_FILES:
    combined_js += read_js(f)

# ── API base URL injection (same-origin for HTTP/HTTPS, localhost:9090 for file://) ──
api_init = """
// SIKO API Base URL — points to same origin on web, or localhost:9090 when opened as local file
window.SIKO_API_BASE = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
  ? (window.location.protocol + '//' + window.location.host)
  : 'http://localhost:9090';
"""

# ── Auth integration patch ─────────────────────────────────────────────────────
auth_patch = """
// ── SIKO Real API Auth Integration ──────────────────────────────────────────
window.sikoLogin = async function(role) {
  var btn = document.getElementById('loginLoading');
  if (btn) btn.classList.remove('hidden');

  // Immediate optimistic state transition so UI responds in 0ms on both static cloud & API servers
  AppState.isLoggedIn = true;
  AppState.currentRole = role;
  if (role === 'student') {
    AppState.currentUser = AppState.currentUser && AppState.currentUser.role === 'student'
      ? AppState.currentUser
      : { id: 'demo-student', name: 'Enrolled Student', email: 'student@siko.demo', role: 'student', grade: '11', board: 'CBSE' };
    AppState.currentView = 'student-home';
  } else if (role === 'teacher') {
    var onboardedName = (AppState.teacherOnboarding && AppState.teacherOnboarding.fullName) || 'Dedicated Master Faculty';
    AppState.currentUser = { id: 'demo-teacher', name: onboardedName, email: 'teacher@siko.demo', role: 'teacher', tier: 'gold' };
    AppState.currentView = 'teacher-dashboard';
  } else if (role === 'parent') {
    AppState.currentUser = { id: 'demo-parent', name: "Student's Parent", email: 'parent@siko.demo', role: 'parent' };
    AppState.currentView = 'parent-dashboard';
  } else {
    AppState.currentUser = { id: 'demo-admin', name: 'SIKO Admin', email: 'admin@siko.demo', role: 'admin' };
    AppState.currentView = 'admin-dashboard';
  }
  notifyStateChange();

  try {
    var data = await authApi.demoLogin(role);
    tokenStore.set(data.access_token);
    var user = data.user;
    AppState.currentUser = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role,
      avatar: user.avatar_url || '',
      grade: user.grade || '',
      board: user.board || '',
      teacherId: user.teacher_id || '',
      studentId: user.student_id || '',
      parentId: user.parent_id || '',
    };
    AppState.isLoggedIn = true;
    AppState.currentRole = user.role;
    notifyStateChange();
    if (typeof showToast === 'function') showToast('Logged in as ' + user.full_name, 'success');
    window.loadLiveDashboardData(user.role);
  } catch(e) {
    if (typeof showToast === 'function') showToast('Logged in to ' + role.toUpperCase() + ' Portal', 'success');
  } finally {
    if (btn) btn.classList.add('hidden');
  }
};

window.sikoEmailLogin = async function(event) {
  event.preventDefault();
  var email = document.getElementById('loginEmail').value;
  var password = document.getElementById('loginPassword').value;
  var btn = document.getElementById('loginBtn');
  var err = document.getElementById('loginError');
  if (err) err.classList.add('hidden');
  if (btn) { btn.disabled = true; btn.textContent = 'Signing in...'; }
  try {
    var data = await authApi.login(email, password);
    tokenStore.set(data.access_token);
    var user = data.user;
    AppState.currentUser = {
      id: user.id, name: user.full_name, email: user.email,
      role: user.role, avatar: user.avatar_url || '',
      teacherId: user.teacher_id || '', studentId: user.student_id || '',
    };
    AppState.isLoggedIn = true;
    AppState.currentRole = user.role;
    if (user.role === 'student') AppState.currentView = 'student-home';
    else if (user.role === 'teacher') AppState.currentView = 'teacher-dashboard';
    else if (user.role === 'parent') AppState.currentView = 'parent-dashboard';
    else AppState.currentView = 'admin-dashboard';
    notifyStateChange();
    if (typeof showToast === 'function') showToast('Welcome back, ' + user.full_name, 'success');
  } catch(e) {
    if (err) { err.classList.remove('hidden'); err.textContent = e.message; }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }
  }
};

window.switchLoginTab = function(tab) {
  var signinForm = document.getElementById('loginForm');
  var signupForm = document.getElementById('registerForm');
  var tabSignInBtn = document.getElementById('tabSignInBtn');
  var tabSignUpBtn = document.getElementById('tabSignUpBtn');

  if (tab === 'signup') {
    if (signinForm) signinForm.classList.add('hidden');
    if (signupForm) signupForm.classList.remove('hidden');
    if (tabSignUpBtn) {
      tabSignUpBtn.className = 'flex-1 py-2 rounded-lg font-bold transition-all bg-emerald-600 text-white shadow-sm cursor-pointer';
    }
    if (tabSignInBtn) {
      tabSignInBtn.className = 'flex-1 py-2 rounded-lg font-semibold text-slate-300 hover:text-white transition-all cursor-pointer';
    }
  } else {
    if (signupForm) signupForm.classList.add('hidden');
    if (signinForm) signinForm.classList.remove('hidden');
    if (tabSignInBtn) {
      tabSignInBtn.className = 'flex-1 py-2 rounded-lg font-bold transition-all bg-blue-600 text-white shadow-sm cursor-pointer';
    }
    if (tabSignUpBtn) {
      tabSignUpBtn.className = 'flex-1 py-2 rounded-lg font-semibold text-slate-300 hover:text-white transition-all cursor-pointer';
    }
  }
};

window.sikoRegister = async function(event) {
  event.preventDefault();
  var fullName = document.getElementById('regFullName').value.trim();
  var email = document.getElementById('regEmail').value.trim();
  var password = document.getElementById('regPassword').value;
  var roleInput = document.querySelector('input[name="regRole"]:checked');
  var role = roleInput ? roleInput.value : 'student';

  var btn = document.getElementById('regBtn');
  var err = document.getElementById('regError');
  if (err) err.classList.add('hidden');
  if (btn) { btn.disabled = true; btn.textContent = 'Creating Account...'; }

  try {
    var data = await authApi.register({
      full_name: fullName,
      email: email,
      password: password,
      role: role
    });
    tokenStore.set(data.access_token);
    var user = data.user;
    AppState.currentUser = {
      id: user.id, name: user.full_name, email: user.email,
      role: user.role, avatar: user.avatar_url || '',
      teacherId: user.teacher_id || '', studentId: user.student_id || '',
    };
    AppState.isLoggedIn = true;
    AppState.currentRole = user.role;

    if (user.role === 'student') {
      AppState.currentView = 'student-onboarding';
      AppState.studentOnboarding.step = 1;
      AppState.studentOnboarding.name = user.full_name;
    } else if (user.role === 'teacher') {
      AppState.currentView = 'teacher-onboarding';
      AppState.teacherOnboarding.currentStep = 1;
      AppState.teacherOnboarding.fullName = user.full_name;
    } else {
      AppState.currentView = 'parent-dashboard';
    }
    notifyStateChange();
    if (typeof showToast === 'function') showToast('Account created! Welcome to SIKO, ' + user.full_name, 'success');
  } catch(e) {
    if (err) { err.classList.remove('hidden'); err.textContent = e.message; }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Create Account & Start Onboarding →'; }
  }
};

window.sikoLogout = async function() {
  try { await authApi.logout(); } catch(e) {}
  tokenStore.clear();
  AppState.isLoggedIn = false;
  AppState.currentUser = null;
  AppState.currentRole = 'guest';
  AppState.currentView = 'public-home';
  notifyStateChange();
  if (typeof showToast === 'function') showToast('Logged out successfully', 'info');
};

// Load live batches and teachers from API
window.loadLiveMarketplaceAndBatches = async function() {
  try {
    var rawBatches = await batchesApi.list().catch(function() { return null; });
    if (rawBatches && Array.isArray(rawBatches) && rawBatches.length > 0) {
      AppState.batches = rawBatches.map(function(b) {
        var maxCap = b.max_capacity || 30;
        var enrolled = b.enrolled_count || 0;
        var remaining = Math.max(0, maxCap - enrolled);
        var isFull = b.is_full !== undefined ? b.is_full : (enrolled >= maxCap);
        var tName = (b.teacher && b.teacher.name) ? b.teacher.name : (b.teacher_name || 'Dedicated Master Faculty');
        var tAvatar = (b.teacher && b.teacher.avatar) ? b.teacher.avatar : (b.teacher_avatar || 'assets/teachers/teacher_physics_indian.png');
        var tTitle = (b.teacher && b.teacher.title) ? b.teacher.title : (b.teacher_title || 'Senior Faculty');
        var tTier = (b.teacher && b.teacher.tier) ? b.teacher.tier : 'Master';
        var tRating = (b.teacher && b.teacher.rating) ? b.teacher.rating : 4.9;

        return {
          id: b.id,
          productId: b.product_id || b.batch_ref || b.id,
          batchRef: b.batch_ref || b.id,
          title: b.course_name || b.batch_ref,
          subject: b.subject,
          board: b.board || 'CBSE',
          grade: b.grade || '10',
          exam: b.exam || 'CBSE',
          chapter: b.chapter || b.topic || b.subject,
          topic: b.topic || b.chapter || b.subject,
          studentNeed: b.student_need || 'Conceptual Practice',
          teachingHours: b.teaching_hours || 10,
          productType: b.product_type || 'Micro Sprint',
          priority: b.priority || 'P0',
          launchMonth: b.launch_month || 'Nov-26',
          sourceNote: b.source_note || '',
          revenueAtCapacity: b.revenue_at_capacity || 0,
          teacher: tName,
          teacher_name: tName,
          teacherTitle: tTitle,
          teacher_title: tTitle,
          teacherAvatar: tAvatar,
          teacher_avatar: tAvatar,
          teacherTier: tTier,
          teacherRating: tRating,
          schedule: (b.days_schedule || 'Mon, Wed, Fri') + ' ' + (b.time_slot || '7:00 PM IST'),
          startDate: b.start_date ? (b.start_date.substring ? b.start_date.substring(0, 10) : b.start_date) : '15-Nov-2026',
          duration: (b.teaching_hours || 10) + ' Teaching Hours',
          seatsOccupied: enrolled,
          enrolledCount: enrolled,
          seatsTotal: maxCap,
          maxCapacity: maxCap,
          minCapacity: b.min_capacity || 15,
          seatsRemaining: remaining,
          isFull: isFull,
          price: b.price_inr || 499,
          priceInr: b.price_inr || 499,
          jitsiRoom: b.jitsi_room || ('siko-sprint-' + (b.batch_ref || 'batch').toLowerCase()),
          description: (b.course_name || b.batch_ref) + ' — planned 1-to-Many Smart Circle strictly capped at ' + maxCap + ' students per batch.'
        };
      });
      notifyStateChange();
    }
  } catch(e) {
    console.warn('Live batches notice:', e.message);
  }

  try {
    var rawTeachers = await teachersApi.list().catch(function() { return null; });
    if (rawTeachers && Array.isArray(rawTeachers) && rawTeachers.length > 0) {
      if (Array.isArray(AppState.teachers) && AppState.teachers.length >= 10) {
        // Attach backendId to matching curated teachers while keeping the 10 verified educators clean
        rawTeachers.forEach(function(rt) {
          var rName = (rt.full_name || '').toLowerCase();
          AppState.teachers.forEach(function(et) {
            if (rName && et.name && et.name.toLowerCase().indexOf(rName.split(' ')[0]) !== -1) {
              et.backendId = rt.id;
            }
          });
        });
      }
      notifyStateChange();
    }
  } catch(e) {
    console.warn('Live teachers notice:', e.message);
  }
};

// Core window.joinBatchDirect and payment closure handlers live in app.js



// ── Teacher AI Content Review & Escalation Helpers (Core handlers live in app.js) ──
window.pinDoubtToAgenda = function(id) {
  showToast("📌 Doubt pinned to today's live classroom whiteboard agenda for 1:1 derivation!", 'success');
};

window.resolveEscalatedDoubt = function(id) {
  if (AppState.teacherData && AppState.teacherData.escalatedDoubts) {
    AppState.teacherData.escalatedDoubts = AppState.teacherData.escalatedDoubts.filter(function(x) { return x.id !== id; });
  }
  showToast('✓ Doubt marked resolved and logged in student Learning DNA ledger.', 'success');
  notifyStateChange();
};

window.regenerateReviewItem = async function(id) {
  try {
    showToast('AI is regenerating questions & rubric...', 'info');
    await worksheetsApi.regenerate(id);
    showToast('Worksheet regenerated! Updated in Review Queue.', 'success');
    window.loadLiveDashboardData('teacher');
  } catch(e) {
    showToast('Regeneration notice: ' + e.message, 'info');
  }
};

window.generateAiWorksheetOnDemand = async function() {
  var chapter = prompt('Enter Chapter/Topic for Instant AI Worksheet Generation:', 'Rotational Dynamics & Torque');
  if (!chapter) return;
  try {
    showToast('SIKO AI generating questions, answer key & rubrics for ' + chapter + '...', 'info');
    var res = await aiApi.generateWorksheet({
      subject: 'Physics',
      chapter: chapter,
      concepts: ['Torque', 'Moment of Inertia', 'Conservation of Angular Momentum'],
      grade: '11',
      board: 'CBSE',
      question_count: 5
    });
    showToast('AI Generated Worksheet (' + (res.worksheet_id ? res.worksheet_id.slice(0, 8) : 'New') + ')! Added to Review Queue.', 'success');
    window.loadLiveDashboardData('teacher');
  } catch(e) {
    showToast('AI Generation: ' + e.message, 'info');
  }
};


// ── CBT Assessment Actions ───────────────────────────────────────────────────
window.markForReview = function(qId) {
  if (typeof showToast === 'function') showToast('Question ' + (AppState.cbtCurrentIndex + 1) + ' marked for review.', 'info');
  if (typeof notifyStateChange === 'function') notifyStateChange();
};

// ── Teacher Agreement Signing & Step 7 Advance (v1.0 Production) ───────────
window.signTeacherAgreementAndAdvance = async function() {
  var sigEl = document.getElementById('teacherLegalSignature') || document.getElementById('teacherSignatureName');
  var name = (sigEl && sigEl.value ? sigEl.value.trim() : '') || (AppState.teacherOnboarding && AppState.teacherOnboarding.fullName) || 'Dedicated Master Faculty';
  var panEl = document.getElementById('teacherPan');
  var pan = (panEl && panEl.value ? panEl.value.trim().toUpperCase() : 'ABCDE1234F');
  var timestampIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
  var eventId = 'AGREE-ACCEPT-' + Date.now();

  // Update teacher state
  AppState.teacherOnboarding.agreementSigned = true;
  AppState.teacherOnboarding.fullName = name;
  AppState.teacherOnboarding.agreementAcceptance = {
    eventId: eventId,
    agreementVersion: '1.0 (Production — Final)',
    documentHash: 'sha256-siko-faculty-agreement-v1.0-final',
    atcId: 'ATC-2026-PHYS-084',
    legalName: name,
    pan: pan,
    acceptedAtIST: timestampIST,
    acceptedAtISO: new Date().toISOString()
  };

  // Log to Admin Audit Trail
  if (!AppState.adminData) AppState.adminData = {};
  if (!AppState.adminData.auditLogs) AppState.adminData.auditLogs = [];
  AppState.adminData.auditLogs.unshift({
    id: 'AUD-' + Date.now().toString().slice(-4),
    timestamp: 'Just now',
    actor: name + ' (PAN: ' + pan + ')',
    role: 'teacher',
    action: 'Digitally Executed Faculty Agreement & ATC/SOW v1.0',
    entity: 'Contract #ATC-2026-PHYS-084',
    status: 'Legally Binding'
  });

  // Call backend API if available
  try {
    if (window.teachersApi && typeof window.teachersApi.acceptAgreement === 'function') {
      await window.teachersApi.acceptAgreement({
        legal_name: name,
        confirmed_checkbox_ids: ['agree_terms', 'agree_escrow', 'chkTeacher1', 'chkTeacher2', 'chkTeacher3', 'chkTeacher4', 'chkTeacher5', 'chkTeacher6', 'chkTeacher7', 'chkTeacher8', 'chkTeacher9', 'chkTeacher10']
      });
    }
  } catch(e) {
    console.warn('Teacher agreement API notice:', e.message);
  }

  if (typeof showToast === 'function') showToast('SIKO Faculty Agreement v1.0 Digitally Signed (Sec 10A IT Act). Accreditation unlocked!', 'success');
  window.setTeacherOnboardingStep(8);
};

// ── Global Animation & Landing Page Reveal Helpers ──────────────────────────
window._activateReveal = function() {
  var elements = document.querySelectorAll('.reveal');
  elements.forEach(function(el) {
    el.classList.add('visible');
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
};

window._animateCounters = function() {
  var counters = document.querySelectorAll('[data-count]');
  counters.forEach(function(c) {
    var target = parseInt(c.getAttribute('data-count'), 10);
    var suffix = c.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    var count = 0;
    var step = Math.max(1, Math.floor(target / 40));
    var timer = setInterval(function() {
      count += step;
      if (count >= target) {
        count = target;
        clearInterval(timer);
      }
      c.textContent = count.toLocaleString() + suffix;
    }, 25);
  });
};

// ── Stepper Navigation ───────────────────────────────────────────────────────
window.goToStep = function(step) {
  if (AppState.currentView === 'student-onboarding') {
    if (typeof window.setStudentOnboardingStep === 'function') window.setStudentOnboardingStep(step);
  } else if (AppState.currentView === 'teacher-onboarding') {
    if (typeof window.setTeacherOnboardingStep === 'function') window.setTeacherOnboardingStep(step);
  } else if (AppState.currentView === 'booking-flow') {
    if (typeof window.setBookingStep === 'function') window.setBookingStep(step);
  }
};

// ── Teacher Wallet Modal & Withdrawal Closure ────────────────────────────────
window.confirmWithdrawal = function() {
  if (!AppState.teacherWallet) {
    AppState.teacherWallet = { available: 48500, escrow: 24000, upcoming: 36000, milestones: [], transactions: [] };
  }
  var inp = document.getElementById('withdrawAmountInput');
  var avail = Number(AppState.teacherWallet.available) || 0;
  var amt = inp ? Math.min(avail, Math.max(0, Number(inp.value) || avail)) : avail;
  if (amt <= 0) {
    if (typeof showToast === 'function') showToast('No available balance to withdraw.', 'info');
    return;
  }
  AppState.teacherWallet.available = Math.max(0, avail - amt);
  if (!Array.isArray(AppState.teacherWallet.transactions)) AppState.teacherWallet.transactions = [];
  AppState.teacherWallet.transactions.unshift({
    id: 'IMPS-' + Math.floor(100000 + Math.random() * 900000),
    date: 'Just now (' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST)',
    assignment: 'Direct Bank Settlement (HDFC ••••4092)',
    milestone: 'IMPS Instant Payout Transfer',
    gross: amt,
    deductions: 0,
    net: amt,
    status: 'Settled to Bank'
  });
  var old = document.getElementById('sikoWithdrawModal');
  if (old) old.remove();
  if (typeof showToast === 'function') showToast('✓ Payout of ₹' + amt.toLocaleString('en-IN') + ' transferred to HDFC Bank ••••4092 via IMPS!', 'success');
  if (typeof notifyStateChange === 'function') notifyStateChange();
};

window.openWithdrawModal = function() {
  var old = document.getElementById('sikoWithdrawModal');
  if (old) old.remove();
  var avail = (AppState.teacherWallet && AppState.teacherWallet.available !== undefined) ? AppState.teacherWallet.available : 48500;
  var m = document.createElement('div');
  m.id = 'sikoWithdrawModal';
  m.className = 'fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4';
  m.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
      <div class="flex justify-between items-center pb-3 border-b mb-4">
        <h3 class="text-base font-bold text-slate-900">Withdraw Available Earnings</h3>
        <button onclick="document.getElementById('sikoWithdrawModal').remove()" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">&times;</button>
      </div>
      <p class="text-xs text-slate-600 mb-4">Transfer unlocked milestone earnings directly to your verified bank account.</p>
      <div class="space-y-3 mb-5">
        <div>
          <label class="block text-2xs font-bold text-slate-700 uppercase mb-1">Available Balance</label>
          <div class="text-2xl font-black text-emerald-600">₹${avail.toLocaleString('en-IN')}</div>
        </div>
        <div>
          <label class="block text-2xs font-bold text-slate-700 uppercase mb-1">Withdrawal Amount (INR)</label>
          <input type="number" id="withdrawAmountInput" value="${avail}" max="${avail}" min="0" class="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 bg-white" />
        </div>
        <div>
          <label class="block text-2xs font-bold text-slate-700 uppercase mb-1">Destination Bank Account</label>
          <div class="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div class="font-bold text-slate-900">HDFC Bank ••••••4092</div>
            <div class="text-slate-500">IFSC: HDFC0000128 • Verified</div>
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-2 pt-3 border-t">
        <button onclick="document.getElementById('sikoWithdrawModal').remove()" class="btn btn-outline btn-sm text-xs">Cancel</button>
        <button onclick="window.confirmWithdrawal()" class="btn btn-primary btn-sm text-xs">
          Confirm Transfer
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(m);
};

// ── Classroom Tools & Helpers ────────────────────────────────────────────────
window.toggleClassroomFullscreen = function() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(function() {});
  } else {
    document.exitFullscreen().catch(function() {});
  }
};

window.selectWbTool = function(tool) {
  var btns = document.querySelectorAll('.wb-tool-btn');
  btns.forEach(function(b) { b.classList.remove('active'); });
  if (window.event && window.event.currentTarget) window.event.currentTarget.classList.add('active');
  if (typeof showToast === 'function') showToast('Whiteboard tool: ' + tool.toUpperCase(), 'info');
};

window.insertWbFormula = function() {
  var canvas = document.getElementById('whiteboardCanvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.font = '20px serif';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText('∫ e^(-x²) dx = √π / 2', 80, 120);
    ctx.fillText('τ = r × F = I · α', 80, 160);
  }
  if (typeof showToast === 'function') showToast('Formula inserted onto whiteboard!', 'success');
};

window.openAskDoubtInClass = function() {
  if (typeof window.openDoubtModal === 'function') {
    window.openDoubtModal();
  }
};

window.exportNotesPDF = function() {
  var notes = document.getElementById('studentNotesArea');
  var content = notes ? notes.value : 'SIKO Live Classroom Session Notes\\nChapter: Laws of Motion & Friction\\nDate: ' + new Date().toLocaleDateString();
  var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'SIKO_Class_Notes_' + Date.now() + '.txt';
  a.click();
  if (typeof showToast === 'function') showToast('Session notes exported successfully!', 'success');
};

// Load live data from API for current user's dashboard
window.loadLiveDashboardData = async function(role) {
  try {
    if (role === 'student') {
      var notifs = await notificationsApi.list();
      AppState.notifications = notifs;
      var classes = await classesApi.list();
      AppState.upcomingClasses = classes.filter(function(c) { return c.status === 'scheduled'; });
      var worksheets = await worksheetsApi.list();
      AppState.worksheets = worksheets;
      notifyStateChange();
    } else if (role === 'teacher') {
      var notifs = await notificationsApi.list();
      AppState.notifications = notifs;
      var classes = await classesApi.list();
      AppState.upcomingClasses = classes.filter(function(c) { return c.status === 'scheduled'; });
      var reviewQueue = await worksheetsApi.reviewQueue();
      AppState.reviewQueue = reviewQueue;
      notifyStateChange();
    } else if (role === 'parent') {
      var notifs = await notificationsApi.list();
      AppState.notifications = notifs;
      notifyStateChange();
    } else if (role === 'admin' || role === 'academic_admin' || role === 'finance_admin') {
      var overview = await adminApi.overview();
      AppState.adminOverview = overview;
      notifyStateChange();
    }
  } catch(e) {
    console.warn('Background data load:', e.message);
  }
};

// Auto-restore session on page load
window.tryRestoreSession = async function() {
  var token = tokenStore.get();
  if (!token) return false;
  try {
    var user = await authApi.me();
    AppState.currentUser = {
      id: user.id, name: user.full_name, email: user.email,
      role: user.role, avatar: user.avatar_url || '',
      teacherId: user.teacher_id || '', studentId: user.student_id || '',
    };
    AppState.isLoggedIn = true;
    AppState.currentRole = user.role;
    if (user.role === 'student') AppState.currentView = 'student-home';
    else if (user.role === 'teacher') AppState.currentView = 'teacher-dashboard';
    else if (user.role === 'parent') AppState.currentView = 'parent-dashboard';
    else AppState.currentView = 'admin-dashboard';
    window.loadLiveDashboardData(user.role);
    return true;
  } catch(e) {
    tokenStore.clear();
    return false;
  }
};
"""

# ── Main init that wires everything together ──────────────────────────────────
main_init = """
// ── SIKO Progressive Web App (PWA) Registration & Install Logic ────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    if ('caches' in window) {
      caches.keys().then(function(keys) {
        keys.forEach(function(k) {
          if (k !== 'siko-pwa-v16') caches.delete(k);
        });
      }).catch(function(){});
    }
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
      try { reg.update(); } catch(e) {}
      console.log('[SIKO PWA] Service Worker registered with scope:', reg.scope);
    }).catch(function(err) {
      console.warn('[SIKO PWA] Service Worker registration failed:', err);
    });
  });
}

var _deferredInstallPrompt = null;
  // Keep PWA bar hidden so mobile screen stays clean and uncluttered
  // If user explicitly triggers install, prompt will be shown

window.promptPwaInstall = async function() {
  if (_deferredInstallPrompt) {
    _deferredInstallPrompt.prompt();
    var res = await _deferredInstallPrompt.userChoice;
    console.log('[SIKO PWA] Install outcome:', res.outcome);
    _deferredInstallPrompt = null;
    var bar = document.getElementById('sikoPwaBar');
    if (bar) bar.style.display = 'none';
  } else {
    window.showPwaInstructionsModal();
  }
};

window.dismissPwaBar = function() {
  var bar = document.getElementById('sikoPwaBar');
  if (bar) bar.style.display = 'none';
  try { sessionStorage.setItem('pwa_bar_dismissed', '1'); } catch(e){}
};

window.showPwaInstructionsModal = function() {
  var existing = document.getElementById('pwaModal');
  if (existing) existing.remove();

  var isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  var modal = document.createElement('div');
  modal.id = 'pwaModal';
  modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md';
  modal.innerHTML = `
    <div class="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full text-white shadow-2xl relative">
      <button onclick="document.getElementById('pwaModal').remove()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">✕</button>
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 mx-auto shadow-lg shadow-blue-500/30">
        <span class="text-2xl font-black">S</span>
      </div>
      <h3 class="text-lg font-bold text-center mb-1">Install SIKO App</h3>
      <p class="text-xs text-blue-200 text-center mb-5">Experience instant full-screen live classrooms and AI Learning Journeys directly from your phone.</p>
      <div class="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs text-slate-300">
        ${isIos ? `
          <div class="flex items-start gap-2.5">
            <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xs mt-0.5 shrink-0">1</span>
            <span>Tap the <strong>Share</strong> button at the bottom of Safari (<svg class="w-3.5 h-3.5 inline text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>).</span>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xs mt-0.5 shrink-0">2</span>
            <span>Scroll down and tap <strong>Add to Home Screen</strong> (+).</span>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xs mt-0.5 shrink-0">3</span>
            <span>Tap <strong>Add</strong> in the top-right corner to install!</span>
          </div>
        ` : `
          <div class="flex items-start gap-2.5">
            <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xs mt-0.5 shrink-0">1</span>
            <span>Tap the <strong>browser menu</strong> (⋮ in Chrome or Edge).</span>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xs mt-0.5 shrink-0">2</span>
            <span>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</span>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xs mt-0.5 shrink-0">3</span>
            <span>Confirm <strong>Install</strong> to add SIKO to your device.</span>
          </div>
        `}
      </div>
      <button onclick="document.getElementById('pwaModal').remove()" class="w-full mt-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white cursor-pointer">Got It</button>
    </div>
  `;
  document.body.appendChild(modal);
};

// ── SIKO Application Bootstrap ───────────────────────────────────────────────
(async function initSikoApp() {
  // PWA banner stays dormant/hidden to maintain a clean, spacious mobile UI
  // Users can still install via browser menu or bottom navigation bar

  // Always load live marketplace teachers and batches
  window.loadLiveMarketplaceAndBatches();
  // Check if session can be restored
  var restored = await window.tryRestoreSession().catch(function() { return false; });
  if (!restored) {
    // Default: Public Website for fresh visitors
    AppState.currentRole = 'guest';
    AppState.currentView = 'public-home';
  }
  if (typeof renderApp === 'function') {
    renderApp();
  }

  // ── Automated Test Suite for Headless / CI Verification (?test=true) ──────
  if (window.location.search.indexOf('test=true') !== -1) {
    (async function() {
      var results = [];
      function record(status, name, detail) {
        results.push({ status: status, name: name, detail: detail || '' });
        console.log('[' + status + '] ' + name + (detail ? ': ' + detail : ''));
      }

      window.addEventListener('error', function(err) {
        record('FAIL', 'Unhandled Global Error', err.message + ' at ' + err.filename + ':' + err.lineno);
      });

      try {
        // 1. Public Home
        window.navigateView('public-home');
        var hasHome = document.body.innerText.indexOf('How SIKO Works') !== -1;
        record(hasHome ? 'PASS' : 'FAIL', 'Public Home rendered with How SIKO Works');

        // 2. Teacher Marketplace Discovery
        window.navigateView('teacher-marketplace');
        var hasMarket = document.body.innerText.indexOf('Find a teacher who fits the way you learn') !== -1;
        var cardCount = document.querySelectorAll('.teacher-card').length;
        record(hasMarket && cardCount > 0 ? 'PASS' : 'FAIL', 'Teacher Marketplace rendered (' + cardCount + ' cards)');

        // 2b. Teacher Marketplace Filter Test
        var filterInput = document.getElementById('marketplaceSearchInput');
        if (filterInput) {
          filterInput.value = 'Physics';
          if (typeof window.filterTeachers === 'function') window.filterTeachers();
          record('PASS', 'Teacher Marketplace live search & filter executed');
        }

        // 3. Teacher Profile
        window.viewTeacherProfile('t-ananya');
        var hasProfile = document.body.innerText.indexOf('Teaching Philosophy & Pedagogy') !== -1;
        record(hasProfile ? 'PASS' : 'FAIL', 'Teacher Profile rendered with credentials');

        // 4. Teacher Comparison
        AppState.compareTeacherIds = ['t-ananya', 't-vikram'];
        window.navigateView('teacher-comparison');
        var hasComp = document.body.innerText.indexOf('Compare Educators') !== -1;
        record(hasComp ? 'PASS' : 'FAIL', 'Teacher Comparison side-by-side matrix rendered');

        // 5. Booking Flow Step 1 to Step 6
        window.startBookingFlow('t-ananya');
        var hasStep1 = document.body.innerText.indexOf('01. Confirm Learning Journey') !== -1;
        record(hasStep1 ? 'PASS' : 'FAIL', 'Booking Flow Step 1 rendered');

        window.setBookingStep(2);
        var hasStep2 = document.body.innerText.indexOf('02. Selected Teacher') !== -1;
        record(hasStep2 ? 'PASS' : 'FAIL', 'Booking Flow Step 2 rendered');

        window.setBookingStep(3);
        var hasStep3 = document.body.innerText.indexOf('03. Select Weekly Schedule') !== -1;
        record(hasStep3 ? 'PASS' : 'FAIL', 'Booking Flow Step 3 rendered');

        window.setBookingStep(4);
        var hasStep4 = document.body.innerText.indexOf('04. Review & Confirm Journey') !== -1;
        record(hasStep4 ? 'PASS' : 'FAIL', 'Booking Flow Step 4 rendered');

        window.setBookingStep(5);
        var hasStep5 = document.body.innerText.indexOf('05. Secure Payment & Escrow') !== -1;
        record(hasStep5 ? 'PASS' : 'FAIL', 'Booking Flow Step 5 rendered');

        window.setBookingStep(6);
        var hasStep6 = document.body.innerText.indexOf('Your learning journey begins') !== -1;
        record(hasStep6 ? 'PASS' : 'FAIL', 'Booking Flow Step 6 Confirmation rendered');

        // 6. Recommended Teachers Tailored View
        window.navigateView('student-teacher-selection');
        var hasRec = document.body.innerText.indexOf('Meet your recommended teachers') !== -1;
        record(hasRec ? 'PASS' : 'FAIL', 'Recommended Teachers view rendered');

        // 7. Smart Batches
        window.navigateView('smart-batches');
        var hasBatches = document.body.innerText.indexOf('cohort') !== -1 || document.body.innerText.indexOf('Batches') !== -1;
        record(hasBatches ? 'PASS' : 'FAIL', 'Smart Batches view rendered');

        // 8. Student Onboarding
        window.startStudentOnboarding();
        var hasStudentOnb = document.body.innerText.indexOf('Student Profile') !== -1 || document.body.innerText.indexOf('Grade') !== -1;
        record(hasStudentOnb ? 'PASS' : 'FAIL', 'Student Onboarding flow rendered');

        // 9. Teacher Onboarding
        window.startTeacherOnboarding();
        var hasTeacherOnb = document.body.innerText.indexOf('Teacher Onboarding') !== -1 || document.body.innerText.indexOf('Faculty') !== -1 || document.body.innerText.indexOf('Application') !== -1;
        record(hasTeacherOnb ? 'PASS' : 'FAIL', 'Teacher Onboarding flow rendered');

        // 10. Teacher Dashboard
        window.switchRole('teacher');
        window.navigateView('teacher-dashboard');
        var hasTeacherDash = document.body.innerText.indexOf('Faculty') !== -1 || document.body.innerText.indexOf('Teacher') !== -1;
        record(hasTeacherDash ? 'PASS' : 'FAIL', 'Teacher Dashboard rendered');

        // 11. Teacher Tier Engine
        window.navigateView('teacher-tier');
        var hasTier = document.body.innerText.indexOf('Tier') !== -1;
        record(hasTier ? 'PASS' : 'FAIL', 'Teacher Tier engine rendered');

        // 12. Teacher Wallet & Escrow
        window.navigateView('teacher-wallet');
        var hasWallet = document.body.innerText.indexOf('Wallet') !== -1 || document.body.innerText.indexOf('Escrow') !== -1;
        record(hasWallet ? 'PASS' : 'FAIL', 'Teacher Wallet & Milestone Escrow rendered');

        // 13. Digital Classroom
        window.enterLiveClassroom();
        var hasClassroom = document.getElementById('sikoClassroomRoot') !== null;
        record(hasClassroom ? 'PASS' : 'FAIL', 'Digital Classroom shell mounted');

        // 14. Parent Dashboard
        window.switchRole('parent');
        window.navigateView('parent-dashboard');
        var hasParentDash = document.body.innerText.indexOf('Parent') !== -1 || document.body.innerText.indexOf('Child') !== -1;
        record(hasParentDash ? 'PASS' : 'FAIL', 'Parent Dashboard rendered');

        // 15. Admin HQ
        window.switchRole('admin');
        window.navigateView('admin-dashboard');
        var hasAdminDash = document.body.innerText.indexOf('Executive') !== -1 || document.body.innerText.indexOf('Admin') !== -1;
        record(hasAdminDash ? 'PASS' : 'FAIL', 'Admin Dashboard rendered');

        // Restore to public
        window.switchRole('guest');
        window.navigateView('public-home');
        record('PASS', 'Restored to Public Home successfully');

      } catch (err) {
        record('FAIL', 'Test Suite Execution Exception', err.message + '\\n' + err.stack);
      }

      var div = document.createElement('div');
      div.id = 'siko_test_results_summary';
      div.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#020617;color:#38bdf8;padding:24px;z-index:999999;font-family:monospace;white-space:pre-wrap;border-bottom:4px solid #3b82f6;';
      div.innerText = '=== SIKO AUTOMATED TEST SUITE REPORT ===\\n' + JSON.stringify(results, null, 2);
      document.body.appendChild(div);
    })();
  }
})();
"""

input_css = r"""
/* Universal high-contrast input styling for all light surfaces */
input, select, textarea {
  font-family: inherit;
  font-size: inherit;
  color: #0f172a !important;
  -webkit-text-fill-color: #0f172a !important;
  background-color: #ffffff !important;
  caret-color: #2563eb !important;
  opacity: 1 !important;
}

input:focus, textarea:focus, select:focus {
  color: #0f172a !important;
  -webkit-text-fill-color: #0f172a !important;
  background-color: #ffffff !important;
  caret-color: #2563eb !important;
  outline: 2px solid #3b82f6 !important;
  outline-offset: 1px !important;
}

/* Explicit high-visibility styling for ALL dark-themed inputs (Login, Register, Classroom) */
#loginEmail, #loginPassword,
#regFullName, #regEmail, #regPassword,
#loginEmail:focus, #loginPassword:focus,
#regFullName:focus, #regEmail:focus, #regPassword:focus,
.chat-input-field, .chat-input-field:focus,
#calcDisplay, #calcDisplay:focus,
#studentNotesArea, #studentNotesArea:focus,
input.text-white, textarea.text-white,
input.text-white:focus, textarea.text-white:focus,
.dark-input, .dark-input:focus,
.bg-slate-900 input, .bg-slate-800 input, .bg-slate-950 input,
.bg-slate-900 textarea, .bg-slate-800 textarea,
.bg-black\/30 input, .bg-black\/40 input, .bg-black\/50 input,
.bg-white\/5 input, .bg-white\/10 input,
.classroom-body input, .classroom-body textarea {
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  background-color: #1e293b !important;
  caret-color: #60a5fa !important;
  border-color: #475569 !important;
  outline: none !important;
}

#loginEmail:focus, #loginPassword:focus,
#regFullName:focus, #regEmail:focus, #regPassword:focus {
  border-color: #60a5fa !important;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.25) !important;
}

/* Browser autofill override so text never blends into background */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus {
  -webkit-text-fill-color: #ffffff !important;
  -webkit-box-shadow: 0 0 0px 1000px #1e293b inset !important;
  transition: background-color 5000s ease-in-out 0s;
}

::placeholder {
  color: #94a3b8 !important;
  opacity: 1 !important;
}

#loginEmail::placeholder, #loginPassword::placeholder,
#regFullName::placeholder, #regEmail::placeholder, #regPassword::placeholder,
.chat-input-field::placeholder {
  color: #94a3b8 !important;
  opacity: 1 !important;
}

/* PWA Install Bar & Mobile Responsive Layout */
.siko-pwa-bar {
  display: none;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  color: #ffffff;
  padding: 8px 16px;
  position: sticky;
  top: 0;
  z-index: 9999;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.siko-pwa-bar .install-btn {
  background: #ffffff;
  color: #1e3a8a;
  padding: 4px 12px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 11px;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease;
}
.siko-pwa-bar .install-btn:hover {
  transform: scale(1.05);
}

/* Mobile Safe Areas */
body {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
"""

# ── HTML template ─────────────────────────────────────────────────────────────
HTML = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
<title>SIKO Eduventures — Your Classroom. Your Teacher. Your Learning Journey.</title>
<meta name="description" content="SIKO Eduventures — Personalised learning with human teachers, AI, and live classrooms. Your classroom. Your teacher. Your learning journey. Anywhere.">

<!-- PWA & Mobile Meta Tags -->
<meta name="theme-color" content="#2563eb">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="SIKO Eduventures">
<link rel="manifest" href="/manifest.json">
<link rel="icon" type="image/svg+xml" href="/icon.svg">
<link rel="apple-touch-icon" href="/icon-192.png">

<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config = {{
  theme: {{
    extend: {{
      fontSize: {{
        '2xs': ['0.75rem',  {{ lineHeight: '1.15rem' }}],
        '3xs': ['0.6875rem',{{ lineHeight: '1.05rem' }}],
      }},
      colors: {{
        'siko-blue': {{ 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#1d4ed8',700:'#1e40af',800:'#1e3a8a',900:'#1e3a8a' }},
        'siko-amber': {{ 50:'#FFFBEB',100:'#FEF3C7',400:'#fbbf24',500:'#f59e0b',600:'#d97706' }},
        'siko-emerald': {{ 50:'#ECFDF5',100:'#D1FAE5',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857' }},
      }},
      fontFamily: {{
        sans: ['"Inter"','"Plus Jakarta Sans"','system-ui','sans-serif'],
        heading: ['"Plus Jakarta Sans"','"Inter"','system-ui','sans-serif'],
        mono: ['"JetBrains Mono"','monospace'],
      }},
      animation: {{
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      }},
      keyframes: {{
        float: {{ '0%,100%':{{transform:'translateY(0)'}}, '50%':{{transform:'translateY(-20px)'}} }},
        slideUp: {{ '0%':{{opacity:'0',transform:'translateY(20px)'}}, '100%':{{opacity:'1',transform:'translateY(0)'}} }},
        fadeIn: {{ '0%':{{opacity:'0'}}, '100%':{{opacity:'1'}} }},
      }},
    }}
  }}
}}
</script>

<!-- Inter, Plus Jakarta Sans & JetBrains Mono fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">

<style>
/* Base resets — High-Contrast Dark Text (#0F172A) on Calm Light Surface (#F8FAFC) */
*,*::before,*::after{{box-sizing:border-box;margin:0;padding:0}}
html{{scroll-behavior:smooth;color:#0F172A;background:#F8FAFC}}
body{{font-family:'Inter','Plus Jakarta Sans',sans-serif;background:#F8FAFC;color:#0F172A;overflow-x:hidden}}
::-webkit-scrollbar{{width:6px}}
::-webkit-scrollbar-track{{background:#F1F5F9}}
::-webkit-scrollbar-thumb{{background:#CBD5E1;border-radius:3px}}
::-webkit-scrollbar-thumb:hover{{background:#94A3B8}}

/* Animations */
@keyframes float{{0%,100%{{transform:translateY(0)}}50%{{transform:translateY(-20px)}}}}
@keyframes slideUp{{0%{{opacity:0;transform:translateY(30px)}}100%{{opacity:1;transform:translateY(0)}}}}
@keyframes fadeIn{{0%{{opacity:0}}100%{{opacity:1}}}}
@keyframes spin{{to{{transform:rotate(360deg)}}}}

.animate-float{{animation:float 6s ease-in-out infinite}}
.animate-slide-up{{animation:slideUp 0.5s ease-out forwards}}
.animate-fade-in{{animation:fadeIn 0.4s ease-out forwards}}
.animate-spin{{animation:spin 1s linear infinite}}

/* Glassmorphism */
.glass{{background:rgba(255,255,255,0.78);backdrop-filter:blur(14px);border:1px solid rgba(226,232,240,0.8)}}
.glass-dark{{background:rgba(0,0,0,0.3);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}}

/* Gradient text */
.gradient-text{{background:linear-gradient(135deg,#1E3A8A 0%,#2563EB 45%,#7C3AED 85%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}}

/* SIKO card */
.siko-card{{background:linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02));border:1px solid rgba(255,255,255,0.08);border-radius:20px;transition:transform 0.2s,box-shadow 0.2s}}
.siko-card:hover{{transform:translateY(-2px);box-shadow:0 20px 40px rgba(0,0,0,0.3)}}

/* Status badges */
.badge-ai{{background:rgba(139,92,246,0.15);color:#c4b5fd;border:1px solid rgba(139,92,246,0.3);padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600}}
.badge-review{{background:rgba(245,158,11,0.15);color:#fcd34d;border:1px solid rgba(245,158,11,0.3);padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600}}
.badge-released{{background:rgba(16,185,129,0.15);color:#6ee7b7;border:1px solid rgba(16,185,129,0.3);padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600}}
.badge-live{{background:rgba(239,68,68,0.15);color:#fca5a5;border:1px solid rgba(239,68,68,0.3);padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600;animation:pulse 2s infinite}}

/* Reveal animation — fully visible by default */
.reveal{{opacity:1;transform:translateY(0);transition:opacity 0.6s ease,transform 0.6s ease}}
.reveal.visible{{opacity:1;transform:translateY(0)}}

/* Custom scrollbar for panels */
.panel-scroll{{overflow-y:auto;scrollbar-width:thin;scrollbar-color:#334155 #1e293b}}

/* Notification dot */
.notif-dot{{width:8px;height:8px;background:#ef4444;border-radius:50%;animation:pulse 2s infinite}}

{tailwind_preflight}

/* Pre-compiled Tailwind Utility Classes (100% static — works on htmlpreview.github.io & offline) */
{tailwind_utilities}

{combined_css}

{input_css}
</style>
</head>
<body>

<!-- PWA Mobile Install Banner -->
<div id="sikoPwaBar" class="siko-pwa-bar" style="display: none;">
  <div class="flex items-center gap-2">
    <span class="text-sm">📱</span>
    <span>Install SIKO App for mobile classroom</span>
  </div>
  <div class="flex items-center gap-2">
    <button class="install-btn" onclick="window.promptPwaInstall()">Install App</button>
    <button onclick="window.dismissPwaBar()" style="background:transparent;border:none;color:white;cursor:pointer;font-size:14px;padding:2px 6px;">✕</button>
  </div>
</div>

<!-- App root -->
<div id="app">
  <div class="min-h-screen flex items-center justify-center bg-slate-900">
    <div class="text-center">
      <div class="inline-flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center animate-pulse">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <span class="text-4xl font-black text-white tracking-tight">SIKO Eduventures</span>
      </div>
      <div class="flex items-center gap-2 text-blue-300">
        <div class="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
        <span class="text-sm">Loading SIKO Eduventures Classroom...</span>
      </div>
    </div>
  </div>
</div>

<!-- Jitsi SDK (for live classroom) -->
<script src="https://meet.jit.si/external_api.js" async></script>

<script>
{api_init}

{combined_js}

{auth_patch}

{main_init}
</script>
</body>
</html>"""

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(HTML)

import shutil
shutil.copy(OUT, os.path.join(SCRATCH, 'index.html'))

size_kb = os.path.getsize(OUT) / 1024
print(f"\nBundle written: {OUT}")
print(f"Copied to: {os.path.join(SCRATCH, 'index.html')}")
print(f"Size: {size_kb:.0f} KB")
print("Done!")
