import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/challenges', label: 'Challenges', icon: '⚔️' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

const ADMIN_ITEMS = [
  { path: '/admin', label: 'Admin Panel', icon: '🛡️' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0e1a]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-base sm:text-lg shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-shadow">
              🛡️
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                CyberYemen
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-500 -mt-0.5 hidden sm:block">CTF Training Platform</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user?.role === 'admin' && ADMIN_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <span className="text-lg">{user?.avatar}</span>
                  <span className="text-sm font-medium text-white hidden sm:inline">{user?.username}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">
                    #{user?.rank}
                  </span>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0f1628] border border-white/10 shadow-2xl shadow-black/50 z-50 overflow-hidden">
                      <div className="p-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white">{user?.username}</p>
                        <p className="text-xs text-slate-400">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                            {user?.role}
                          </span>
                          <span className="text-xs text-slate-500">{user?.totalScore} pts</span>
                        </div>
                      </div>
                      <div className="p-1">
                        <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg">
                          👤 Profile
                        </Link>
                        <Link to="/challenges" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg">
                          ⚔️ Challenges
                        </Link>
                        <Link to="/leaderboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg">
                          🏆 Leaderboard
                        </Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-cyan-400 hover:bg-cyan-500/10 rounded-lg">
                            🛡️ Admin Panel
                          </Link>
                        )}
                        <hr className="my-1 border-white/10" />
                        <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg">
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold text-white hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0a0e1a]/98 backdrop-blur-xl">
            <nav className="p-2 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === item.path
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              {user?.role === 'admin' && ADMIN_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-cyan-400 hover:bg-cyan-500/10"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#060a14]/80">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🛡️</span>
                <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">CyberYemen</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Educational cybersecurity training platform. Learn ethical hacking through hands-on challenges.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Platform</h4>
              <div className="space-y-1.5">
                <Link to="/challenges" className="block text-xs text-slate-500 hover:text-slate-300">Challenges</Link>
                <Link to="/leaderboard" className="block text-xs text-slate-500 hover:text-slate-300">Leaderboard</Link>
                <Link to="/profile" className="block text-xs text-slate-500 hover:text-slate-300">Profile</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Categories</h4>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">🌐 Web Exploitation</p>
                <p className="text-xs text-slate-500">🔐 Cryptography</p>
                <p className="text-xs text-slate-500">🔬 Forensics</p>
                <p className="text-xs text-slate-500">⚙️ Reverse Engineering</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Legal</h4>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Terms of Service</p>
                <p className="text-xs text-slate-500">Privacy Policy</p>
                <p className="text-xs text-slate-500">Ethical Guidelines</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-[10px] text-slate-600">© 2024 CyberYemen. Educational purposes only. All challenges run in isolated environments.</p>
            <p className="text-[10px] text-slate-600">⚡ Built with React + Django REST Framework</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
