import { Link } from 'react-router-dom';
import { CHALLENGES, SOLVED_CHALLENGES } from '../data/mockData';
import { CATEGORY_META, DIFFICULTY_META, type Category } from '../types';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export function Home() {
  const { user, isAuthenticated } = useAuth();
  const totalChallenges = CHALLENGES.filter(c => c.isActive).length;
  const totalPoints = CHALLENGES.reduce((sum, c) => sum + c.points, 0);
  const categories = Object.keys(CATEGORY_META) as Category[];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />
        <div className="scanline" />
        
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
                🚀 Now Live — Season 1
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight glitch-text">
              Master <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Cybersecurity</span>
              <br />
              Through Hands-On Challenges
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              CyberYemen is a free, educational platform where you learn ethical hacking and cybersecurity skills through interactive Capture The Flag challenges.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
              <Link
                to="/challenges"
                className="px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm sm:text-base font-semibold text-white hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
              >
                ⚔️ Start Hacking
              </Link>
              <Link
                to="/leaderboard"
                className="px-6 sm:px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-sm sm:text-base font-medium text-white hover:bg-white/10 transition-all"
              >
                🏆 Leaderboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Active Challenges', value: totalChallenges.toString(), icon: '⚔️', color: 'text-cyan-400' },
              { label: 'Total Points', value: totalPoints.toLocaleString(), icon: '💰', color: 'text-amber-400' },
              { label: 'Players', value: '1,247', icon: '👥', color: 'text-emerald-400' },
              { label: 'Total Solves', value: '8,432', icon: '✅', color: 'text-violet-400' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center sm:text-left"
              >
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-xl">{stat.icon}</span>
                  <span className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Dashboard Quick View */}
      {isAuthenticated && user && (
        <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Welcome Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-2 rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 p-5 sm:p-6 glass"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg">
                  {user.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Welcome back, {user.username}!</h2>
                  <p className="text-sm text-slate-400">Rank #{user.rank} • {user.totalScore} points • 🔥 {user.streak}-day streak</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-cyan-400">{user.solvedCount}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500">Solved</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-emerald-400">{SOLVED_CHALLENGES.length}/{totalChallenges}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500">Progress</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-amber-400">{user.badges.length}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500">Badges</p>
                </div>
              </div>
            </motion.div>

            {/* Badges */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 glass">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">🏅 Recent Badges</h3>
              <div className="grid grid-cols-2 gap-2">
                {user.badges.map((badge) => (
                  <div key={badge.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-lg">{badge.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-white">{badge.name}</p>
                      <p className="text-[9px] text-slate-500">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Challenge Categories</h2>
          <Link to="/challenges" className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat, i) => {
            const meta = CATEGORY_META[cat];
            const count = CHALLENGES.filter(c => c.category === cat && c.isActive).length;
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/challenges?category=${cat}`}
                  className="group block p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-cyan-500/30 transition-all text-center glass"
                >
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {meta.icon}
                  </div>
                  <h3 className="mt-2 text-xs sm:text-sm font-semibold text-white">{meta.label}</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{count} challenges</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Challenges */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">🔥 Featured Challenges</h2>
          <Link to="/challenges" className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {CHALLENGES.slice(0, 6).map((ch) => {
            const catMeta = CATEGORY_META[ch.category];
            const diffMeta = DIFFICULTY_META[ch.difficulty];
            const solved = SOLVED_CHALLENGES.includes(ch.id);
            return (
              <Link
                key={ch.id}
                to={`/challenges/${ch.id}`}
                className={`group p-4 sm:p-5 rounded-xl border bg-white/[0.02] hover:bg-white/[0.06] transition-all glass ${
                  solved ? 'border-emerald-500/30' : 'border-white/10 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${catMeta.color} flex items-center justify-center text-lg shadow-lg`}>
                    {catMeta.icon}
                  </div>
                  {solved ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">✓ Solved</span>
                  ) : (
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${diffMeta.bg} ${diffMeta.color}`}>
                      {diffMeta.label}
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">{ch.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{ch.points} pts • {ch.solves} solves</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {ch.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* About / Ethical Notice */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12 border-t border-white/10">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 p-6 sm:p-8 glass"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">🛡️</span>
            <div>
              <h3 className="text-lg font-bold text-white mb-2 text-glow">Ethical Learning Environment</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                CyberYemen is strictly educational. All challenges run in isolated, sandboxed environments. 
                No real systems are targeted. Participants must follow our ethical guidelines and applicable laws.
                Learn responsibly. Hack to learn, don't learn to hack.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
