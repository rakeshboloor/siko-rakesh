/**
 * SIKO Login View — Real JWT authentication
 * Four demo account buttons + email/password form
 */

export function renderLogin() {
  return `
<div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
  <!-- Background glow -->
  <div class="fixed inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl animate-pulse" style="animation-delay:1s"></div>
  </div>

  <div class="w-full max-w-md relative">
    <!-- Logo -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-3 mb-4">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <span class="text-3xl font-black text-white tracking-tight">SIKO</span>
      </div>
      <p class="text-blue-200/70 text-sm">Your classroom. Your teacher. Your learning journey. Anywhere.</p>
    </div>

    <!-- Card -->
    <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
      
      <!-- Demo Accounts -->
      <div class="mb-6">
        <p class="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-3 text-center">Quick Demo Access</p>
        <div class="grid grid-cols-2 gap-3">
          <button onclick="window.sikoLogin('student')"
            class="group flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/20 hover:border-violet-400/50 transition-all duration-200 cursor-pointer">
            <div class="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <span class="text-xs font-semibold text-violet-300">Student</span>
            <span class="text-[10px] text-violet-400/60">Enrolled Student</span>
          </button>

          <button onclick="window.sikoLogin('teacher')"
            class="group flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/20 hover:border-blue-400/50 transition-all duration-200 cursor-pointer">
            <div class="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <span class="text-xs font-semibold text-blue-300">Teacher</span>
            <span class="text-[10px] text-blue-400/60">Dedicated Master Faculty</span>
          </button>

          <button onclick="window.sikoLogin('parent')"
            class="group flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/20 hover:border-teal-400/50 transition-all duration-200 cursor-pointer">
            <div class="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
            </div>
            <span class="text-xs font-semibold text-teal-300">Parent</span>
            <span class="text-[10px] text-teal-400/60">Riya's Parent</span>
          </button>

          <button onclick="window.sikoLogin('admin')"
            class="group flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/20 hover:border-amber-400/50 transition-all duration-200 cursor-pointer">
            <div class="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <span class="text-xs font-semibold text-amber-300">Admin</span>
            <span class="text-[10px] text-amber-400/60">SIKO Admin</span>
          </button>
        </div>
      </div>

      <!-- Divider -->
      <div class="flex items-center gap-3 my-5">
        <div class="flex-1 h-px bg-white/10"></div>
        <span class="text-xs text-white/30">or sign in with email</span>
        <div class="flex-1 h-px bg-white/10"></div>
      </div>

      <!-- Email/Password Form -->
      <form id="loginForm" onsubmit="window.sikoEmailLogin(event)">
        <div class="space-y-3">
          <div>
            <input type="email" id="loginEmail" placeholder="Email address"
              class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-400/60 focus:bg-white/10 transition-all"
              autocomplete="email"/>
          </div>
          <div class="relative">
            <input type="password" id="loginPassword" placeholder="Password"
              class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-400/60 focus:bg-white/10 transition-all"
              autocomplete="current-password"/>
          </div>
        </div>

        <div id="loginError" class="hidden mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs"></div>

        <button type="submit" id="loginBtn"
          class="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold text-sm hover:from-blue-400 hover:to-violet-500 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5">
          Sign In
        </button>
      </form>

      <!-- Loading overlay (hidden) -->
      <div id="loginLoading" class="hidden absolute inset-0 rounded-3xl bg-slate-900/80 flex items-center justify-center">
        <div class="flex flex-col items-center gap-3">
          <div class="w-10 h-10 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
          <p class="text-blue-300 text-sm">Signing in...</p>
        </div>
      </div>
    </div>

    <p class="text-center text-white/20 text-xs mt-6">
      SIKO Education Platform &copy; 2024 &mdash; Demo Mode
    </p>
  </div>
</div>`;
}
