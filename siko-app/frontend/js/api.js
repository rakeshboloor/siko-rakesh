/**
 * SIKO API Service Layer
 * All backend calls go through this module.
 * Base URL auto-detects: same origin in production, localhost:8000 in dev.
 */

const API_BASE = window.SIKO_API_BASE || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : `${window.location.protocol}//${window.location.hostname}:8000`);

// ── Token storage ─────────────────────────────────────────────────────────────
const TOKEN_KEY = 'siko_auth_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function apiFetch(path, opts = {}) {
  const token = tokenStore.get();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
    body: opts.body ? (typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body)) : undefined,
  });

  if (res.status === 401) {
    tokenStore.clear();
    window.location.reload();
    throw new Error('Session expired. Please log in again.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || data.message || `API error ${res.status}`);
  }
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    apiFetch('/api/auth/login', { method: 'POST', body: { email, password } }),

  demoLogin: (role) =>
    apiFetch('/api/auth/demo-login', { method: 'POST', body: { role } }),

  me: () => apiFetch('/api/auth/me'),

  logout: () => apiFetch('/api/auth/logout', { method: 'POST' }).finally(() => tokenStore.clear()),
};

// ── Students ──────────────────────────────────────────────────────────────────
export const studentsApi = {
  me: () => apiFetch('/api/students/me'),
  dashboard: () => apiFetch('/api/students/me/dashboard'),
  update: (data) => apiFetch('/api/students/me', { method: 'PUT', body: data }),
  completeOnboarding: () => apiFetch('/api/students/me/onboarding', { method: 'POST' }),
};

// ── Teachers ──────────────────────────────────────────────────────────────────
export const teachersApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/teachers${qs ? '?' + qs : ''}`);
  },
  me: () => apiFetch('/api/teachers/me'),
  dashboard: () => apiFetch('/api/teachers/me/dashboard'),
  update: (data) => apiFetch('/api/teachers/me', { method: 'PUT', body: data }),
  myStudents: () => apiFetch('/api/teachers/me/students'),
  myJourneys: () => apiFetch('/api/teachers/me/journeys'),

  // Offer flow
  getOffer: () => apiFetch('/api/teachers/me/offer'),
  acceptOffer: (offerId) => apiFetch(`/api/teachers/me/offer/${offerId}/accept`, { method: 'POST' }),
  declineOffer: (offerId) => apiFetch(`/api/teachers/me/offer/${offerId}/decline`, { method: 'POST' }),

  // ATC
  getAtc: () => apiFetch('/api/teachers/me/atc'),

  // Agreement
  getAgreement: () => apiFetch('/api/teachers/me/agreement'),
  acceptAgreement: (data) => apiFetch('/api/teachers/me/agreement/accept', { method: 'POST', body: data }),
};

// ── Learning Journeys ─────────────────────────────────────────────────────────
export const journeysApi = {
  list: () => apiFetch('/api/journeys'),
  get: (id) => apiFetch(`/api/journeys/${id}`),
  progress: (id) => apiFetch(`/api/journeys/${id}/progress`),
};

// ── Academic Structure ────────────────────────────────────────────────────────
export const subjectsApi = {
  boards: () => apiFetch('/api/subjects/boards'),
  structure: () => apiFetch('/api/subjects/structure'),
  chapters: (subjectId) => apiFetch(`/api/subjects/chapters?subject_id=${subjectId}`),
};

// ── Classes ───────────────────────────────────────────────────────────────────
export const classesApi = {
  list: () => apiFetch('/api/classes'),
  get: (id) => apiFetch(`/api/classes/${id}`),
  create: (data) => apiFetch('/api/classes', { method: 'POST', body: data }),
  complete: (id, data) => apiFetch(`/api/classes/${id}/complete`, { method: 'PUT', body: data }),
  cancel: (id) => apiFetch(`/api/classes/${id}/cancel`, { method: 'PUT' }),
  markAttendance: (id, data) => apiFetch(`/api/classes/${id}/attendance`, { method: 'POST', body: data }),
};

// ── Worksheets ────────────────────────────────────────────────────────────────
export const worksheetsApi = {
  list: () => apiFetch('/api/worksheets'),
  get: (id) => apiFetch(`/api/worksheets/${id}`),
  reviewQueue: () => apiFetch('/api/worksheets/review-queue'),
  approve: (id) => apiFetch(`/api/worksheets/${id}/approve`, { method: 'PUT' }),
  reject: (id, notes) => apiFetch(`/api/worksheets/${id}/reject`, { method: 'PUT', body: { notes } }),
};

// ── Assessments ───────────────────────────────────────────────────────────────
export const assessmentsApi = {
  list: () => apiFetch('/api/assessments'),
  get: (id) => apiFetch(`/api/assessments/${id}`),
  approve: (id) => apiFetch(`/api/assessments/${id}/approve`, { method: 'PUT' }),
};

// ── Submissions ───────────────────────────────────────────────────────────────
export const submissionsApi = {
  mine: () => apiFetch('/api/submissions/me'),
  submit: (data) => apiFetch('/api/submissions', { method: 'POST', body: data }),
  get: (id) => apiFetch(`/api/submissions/${id}`),
  pendingReview: () => apiFetch('/api/submissions/pending-review'),
  release: (id, data) => apiFetch(`/api/submissions/${id}/release`, { method: 'PUT', body: data }),
};

// ── Payments ──────────────────────────────────────────────────────────────────
export const paymentsApi = {
  getRefundPolicy: () => apiFetch('/api/payments/refund-policy'),
  acceptRefundPolicy: (data) => apiFetch('/api/payments/refund-acceptance', { method: 'POST', body: data }),
  createOrder: (data) => apiFetch('/api/payments/create-order', { method: 'POST', body: data }),
  verifyPayment: (data) => apiFetch('/api/payments/verify', { method: 'POST', body: data }),
  getBooking: (id) => apiFetch(`/api/payments/booking/${id}`),
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationsApi = {
  list: () => apiFetch('/api/notifications'),
  markRead: (id) => apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: () => apiFetch('/api/notifications/read-all', { method: 'PUT' }),
};

// ── AI ────────────────────────────────────────────────────────────────────────
export const aiApi = {
  generateWorksheet: (data) => apiFetch('/api/ai/generate-worksheet', { method: 'POST', body: data }),
  generateAssessment: (data) => apiFetch('/api/ai/generate-assessment', { method: 'POST', body: data }),
  lessonPlan: (data) => apiFetch('/api/ai/lesson-plan', { method: 'POST', body: data }),
  askDoubt: (data) => apiFetch('/api/ai/doubt', { method: 'POST', body: data }),
};

// ── Wallet / Escrow ───────────────────────────────────────────────────────────
export const walletApi = {
  me: () => apiFetch('/api/wallet/me'),
  myEscrow: () => apiFetch('/api/escrow/me'),
};

// ── PTM ───────────────────────────────────────────────────────────────────────
export const ptmApi = {
  list: () => apiFetch('/api/ptm'),
  get: (id) => apiFetch(`/api/ptm/${id}`),
  acknowledge: (id) => apiFetch(`/api/ptm/${id}/acknowledge`, { method: 'PUT' }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  overview: () => apiFetch('/api/admin/overview'),
  teacherApplications: () => apiFetch('/api/admin/teacher-applications'),
  teacherApplicationDetail: (id) => apiFetch(`/api/admin/teacher-applications/${id}`),
  updateApplicationStatus: (id, status) =>
    apiFetch(`/api/admin/teacher-applications/${id}/status`, { method: 'PUT', body: { status } }),
  createOffer: (data) => apiFetch('/api/admin/teacher-offer', { method: 'POST', body: data }),
  contentReview: () => apiFetch('/api/admin/content-review'),
  payments: () => apiFetch('/api/admin/payments'),
  users: () => apiFetch('/api/admin/users'),
  escrowAll: () => apiFetch('/api/admin/escrow'),
  releaseEscrow: (escrowId, milestone) =>
    apiFetch(`/api/escrow/${escrowId}/release/${milestone}`, { method: 'POST' }),
};

// ── Health ────────────────────────────────────────────────────────────────────
export const health = () => apiFetch('/health');
