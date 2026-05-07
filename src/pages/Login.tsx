import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));

    try {
      if (isRegister) {
        if (!username || !email || !password) {
          setError('All fields are required');
          setLoading(false);
          return;
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters');
          setLoading(false);
          return;
        }
        const success = register(username, email, password);
        if (success) navigate('/');
        else setError('Registration failed');
      } else {
        if (!username || !password) {
          setError('Username and password are required');
          setLoading(false);
          return;
        }
        const success = login(username, password);
        if (success) navigate('/');
        else setError('Invalid credentials');
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl shadow-2xl shadow-cyan-500/25 mb-4">
            🛡️
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isRegister ? 'Join CyberYemen' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isRegister ? 'Create your account to start training' : 'Sign in to continue your training'}
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-sm text-rose-400">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="hacker42"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all"
                required
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all"
                required
              />
              {isRegister && (
                <p className="text-[10px] text-slate-600 mt-1">Minimum 8 characters • Use a strong password</p>
              )}
            </div>

            {!isRegister && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-500">
                  <input type="checkbox" className="rounded bg-white/5 border-white/20" />
                  Remember me
                </label>
                <button type="button" className="text-xs text-cyan-400 hover:text-cyan-300">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold text-white hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                isRegister ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-[10px] text-slate-600 text-center">
              🔒 JWT-based authentication • bcrypt password hashing • Rate-limited endpoints
            </p>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400 text-center">
            🎮 <strong>Demo Mode:</strong> Enter any credentials to log in with a pre-configured admin account.
          </p>
        </div>
      </div>
    </div>
  );
}
