import { useState } from 'react';
import { CHALLENGES, USERS, MOCK_SUBMISSIONS, EVENTS } from '../data/mockData';
import { CATEGORY_META, DIFFICULTY_META, type Category, type Difficulty } from '../types';

type AdminTab = 'overview' | 'challenges' | 'users' | 'submissions' | 'events';

export function Admin() {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [showNewChallenge, setShowNewChallenge] = useState(false);

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'challenges', label: 'Challenges', icon: '⚔️' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'submissions', label: 'Submissions', icon: '🚩' },
    { id: 'events', label: 'Events', icon: '📡' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">🛡️ Admin Panel</h1>
          <p className="text-sm text-slate-400 mt-1">Manage platform, challenges, users, and events</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> System Online
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto mb-6 pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Total Challenges', value: CHALLENGES.length, icon: '⚔️', color: 'text-cyan-400', change: '+3 this week' },
              { label: 'Registered Users', value: 1247, icon: '👥', color: 'text-emerald-400', change: '+28 this week' },
              { label: 'Total Submissions', value: 8432, icon: '🚩', color: 'text-amber-400', change: '+142 today' },
              { label: 'Active Events', value: EVENTS.filter(e => e.status === 'active').length, icon: '📡', color: 'text-violet-400', change: '1 upcoming' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 sm:p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl sm:text-2xl">{stat.icon}</span>
                  <span className="text-[10px] text-emerald-400/60">{stat.change}</span>
                </div>
                <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Solves by Category */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Solves by Category</h3>
              <div className="space-y-3">
                {(Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][]).map(([cat, meta]) => {
                  const chs = CHALLENGES.filter(c => c.category === cat);
                  const totalSolves = chs.reduce((s, c) => s + c.solves, 0);
                  const maxSolves = 500;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">{meta.icon} {meta.label}</span>
                        <span className="text-slate-500">{totalSolves} solves</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${meta.color}`} style={{ width: `${(totalSolves / maxSolves) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Distribution */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Difficulty Distribution</h3>
              <div className="space-y-3">
                {(Object.entries(DIFFICULTY_META) as [Difficulty, typeof DIFFICULTY_META[Difficulty]][]).map(([diff, meta]) => {
                  const chs = CHALLENGES.filter(c => c.difficulty === diff);
                  return (
                    <div key={diff} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                      <span className={`text-2xl font-bold ${meta.color}`}>{chs.length}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{meta.label}</p>
                        <p className="text-[10px] text-slate-500">{chs.reduce((s, c) => s + c.points, 0)} total points</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">{chs.reduce((s, c) => s + c.solves, 0)} solves</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Recent Submissions</h3>
            <div className="space-y-2">
              {MOCK_SUBMISSIONS.slice(0, 5).map((sub) => {
                const ch = CHALLENGES.find(c => c.id === sub.challengeId);
                return (
                  <div key={sub.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <span>{sub.correct ? '✅' : '❌'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white">{ch?.title}</p>
                      <p className="text-[10px] text-slate-600">{sub.submittedAt}</p>
                    </div>
                    <code className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-500 font-mono">{sub.flag}</code>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {tab === 'challenges' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{CHALLENGES.length} challenges</p>
            <button
              onClick={() => setShowNewChallenge(!showNewChallenge)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold text-white hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              + New Challenge
            </button>
          </div>

          {/* New Challenge Form */}
          {showNewChallenge && (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Create New Challenge</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input placeholder="Challenge Title" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50" />
                <select className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-400 focus:outline-none">
                  {(Object.keys(CATEGORY_META) as Category[]).map(c => <option key={c} value={c}>{CATEGORY_META[c].label}</option>)}
                </select>
                <select className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-400 focus:outline-none">
                  {(Object.keys(DIFFICULTY_META) as Difficulty[]).map(d => <option key={d} value={d}>{DIFFICULTY_META[d].label}</option>)}
                </select>
                <input placeholder="Points" type="number" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50" />
                <input placeholder="Flag (CY{...})" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 font-mono focus:outline-none focus:border-cyan-500/50" />
                <input placeholder="Docker Image (optional)" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50" />
              </div>
              <textarea placeholder="Description (Markdown supported)" rows={4} className="w-full mt-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 resize-none" />
              <div className="flex gap-2 mt-3">
                <button className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-all">Create Challenge</button>
                <button onClick={() => setShowNewChallenge(false)} className="px-4 py-2 rounded-lg bg-white/5 text-slate-400 text-xs hover:bg-white/10 transition-all">Cancel</button>
              </div>
            </div>
          )}

          {/* Challenge Table */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">Title</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium hidden sm:table-cell">Category</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">Difficulty</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">Points</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium hidden sm:table-cell">Solves</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">Status</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {CHALLENGES.map((ch) => {
                    const catMeta = CATEGORY_META[ch.category];
                    const diffMeta = DIFFICULTY_META[ch.difficulty];
                    return (
                      <tr key={ch.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-all">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{catMeta.icon}</span>
                            <span className="text-white font-medium">{ch.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">{catMeta.label}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] ${diffMeta.bg} ${diffMeta.color}`}>{diffMeta.label}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-white font-mono">{ch.points}</td>
                        <td className="px-4 py-3 text-center text-slate-400 hidden sm:table-cell">{ch.solves}</td>
                        <td className="px-4 py-3 text-center">
                          {ch.isActive ? (
                            <span className="text-emerald-400">● Active</span>
                          ) : (
                            <span className="text-slate-600">● Inactive</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="px-2 py-1 rounded text-[10px] text-slate-500 hover:text-white hover:bg-white/5">Edit</button>
                            <button className="px-2 py-1 rounded text-[10px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{USERS.length} users shown (1,247 total)</p>
            <div className="flex items-center gap-2">
              <input placeholder="Search users..." className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50" />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">User</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium hidden sm:table-cell">Email</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">Role</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">Score</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium hidden sm:table-cell">Solved</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {USERS.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{u.avatar}</span>
                          <div>
                            <p className="text-white font-medium">{u.username}</p>
                            <p className="text-[10px] text-slate-600">{u.team}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">{u.email}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          u.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : u.role === 'moderator' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-white/5 text-slate-400 border-white/10'
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-cyan-400 font-mono">{u.totalScore}</td>
                      <td className="px-4 py-3 text-center text-slate-400 hidden sm:table-cell">{u.solvedCount}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="px-2 py-1 rounded text-[10px] text-slate-500 hover:text-white hover:bg-white/5">Edit</button>
                          <button className="px-2 py-1 rounded text-[10px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">Ban</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Tab */}
      {tab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{MOCK_SUBMISSIONS.length} recent submissions</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400">{MOCK_SUBMISSIONS.filter(s => s.correct).length} correct</span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-rose-400">{MOCK_SUBMISSIONS.filter(s => !s.correct).length} incorrect</span>
            </div>
          </div>

          <div className="space-y-2">
            {MOCK_SUBMISSIONS.map((sub) => {
              const ch = CHALLENGES.find(c => c.id === sub.challengeId);
              const user = USERS.find(u => u.id === sub.userId);
              return (
                <div key={sub.id} className={`flex items-center gap-3 p-3 rounded-xl border ${
                  sub.correct ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
                }`}>
                  <span className="text-lg">{sub.correct ? '✅' : '❌'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white">{user?.username}</span>
                      <span className="text-xs text-slate-600">→</span>
                      <span className="text-sm text-white">{ch?.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <code className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 font-mono">{sub.flag}</code>
                      <span className="text-[10px] text-slate-600">{sub.submittedAt}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    sub.correct ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {sub.correct ? 'Correct' : 'Wrong'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Events Tab */}
      {tab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{EVENTS.length} events</p>
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold text-white hover:from-cyan-400 hover:to-blue-500 transition-all">
              + New Event
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EVENTS.map((evt) => (
              <div key={evt.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    evt.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : evt.status === 'upcoming' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                  }`}>
                    {evt.status === 'active' ? '🟢 Live' : evt.status === 'upcoming' ? '🟡 Upcoming' : '⚫ Ended'}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white">{evt.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{evt.description}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                  <span>👥 {evt.participants}</span>
                  <span>⚔️ {evt.challenges}</span>
                  <span>💰 {evt.prizePool}</span>
                </div>
                <p className="text-[10px] text-slate-600 mt-2">{evt.startDate} → {evt.endDate}</p>
                <div className="flex gap-1 mt-3">
                  <button className="px-3 py-1 rounded text-[10px] text-slate-500 hover:text-white hover:bg-white/5">Edit</button>
                  <button className="px-3 py-1 rounded text-[10px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">End</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Docker Status */}
      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-white mb-3">🐳 Docker Container Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
            <p className="text-xl font-bold text-emerald-400">3</p>
            <p className="text-[10px] text-slate-500">Running Containers</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
            <p className="text-xl font-bold text-amber-400">12</p>
            <p className="text-[10px] text-slate-500">Challenge Images</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
            <p className="text-xl font-bold text-cyan-400">128MB</p>
            <p className="text-[10px] text-slate-500">Avg Memory Usage</p>
          </div>
        </div>
      </div>
    </div>
  );
}
