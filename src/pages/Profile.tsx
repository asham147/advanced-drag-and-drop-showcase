import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CHALLENGES, SOLVED_CHALLENGES, MOCK_SUBMISSIONS } from '../data/mockData';
import { CATEGORY_META, DIFFICULTY_META } from '../types';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip
} from 'recharts';

export function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  const solvedChallenges = CHALLENGES.filter((c) => SOLVED_CHALLENGES.includes(c.id));
  const totalChallenges = CHALLENGES.length;
  const progress = Math.round((solvedChallenges.length / totalChallenges) * 100);

  // Category breakdown
  const categoryStats = Object.entries(CATEGORY_META).map(([cat, meta]) => {
    const total = CHALLENGES.filter((c) => c.category === cat).length;
    const solved = solvedChallenges.filter((c) => c.category === cat).length;
    return { cat, meta, total, solved };
  });

  // Difficulty breakdown
  const difficultyStats = Object.entries(DIFFICULTY_META).map(([diff, meta]) => {
    const total = CHALLENGES.filter((c) => c.difficulty === diff).length;
    const solved = solvedChallenges.filter((c) => c.difficulty === diff).length;
    return { diff, meta, total, solved };
  });

  const radarData = categoryStats.map(s => ({
    subject: s.meta.label,
    A: s.solved,
    fullMark: s.total
  }));

  const activityData = [
    { day: 'Mon', score: 100 },
    { day: 'Tue', score: 250 },
    { day: 'Wed', score: 180 },
    { day: 'Thu', score: 450 },
    { day: 'Fri', score: 320 },
    { day: 'Sat', score: 600 },
    { day: 'Sun', score: 850 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Profile Header */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 overflow-hidden mb-6">
        <div className="h-24 sm:h-32 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-violet-600/20" />
        <div className="px-5 sm:px-8 pb-5 sm:pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-8 sm:-mt-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl sm:text-4xl shadow-2xl border-4 border-[#0a0e1a]">
              {user.avatar}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{user.username}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">{user.role}</span>
                  <span className="text-xs text-slate-500">{user.country}</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 mt-1">{user.bio}</p>
              <p className="text-xs text-slate-600 mt-1">Team: {user.team} • Joined {user.joinedAt}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400">#{user.rank}</p>
                <p className="text-[10px] text-slate-600">Rank</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">{user.totalScore.toLocaleString()}</p>
                <p className="text-[10px] text-slate-600">Points</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Score', value: user.totalScore.toLocaleString(), icon: '💰', color: 'text-amber-400' },
              { label: 'Challenges Solved', value: user.solvedCount.toString(), icon: '✅', color: 'text-emerald-400' },
              { label: 'Current Streak', value: `${user.streak} days`, icon: '🔥', color: 'text-rose-400' },
              { label: 'Global Rank', value: `#${user.rank}`, icon: '🏆', color: 'text-cyan-400' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] text-center">
                <span className="text-2xl block mb-1">{stat.icon}</span>
                <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Score Chart */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Score Progression</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                    itemStyle={{ color: '#06b6d4', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Overall Progress</h3>
              <span className="text-xs text-slate-400">{solvedChallenges.length}/{totalChallenges} challenges ({progress}%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Category Progress */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Category Progress</h3>
            <div className="space-y-3">
              {categoryStats.map(({ cat, meta, total, solved }) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">
                      {meta.icon} {meta.label}
                    </span>
                    <span className="text-xs text-slate-500">{solved}/{total}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${meta.color}`}
                      style={{ width: total > 0 ? `${(solved / total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Difficulty Breakdown</h3>
            <div className="grid grid-cols-3 gap-3">
              {difficultyStats.map(({ diff, meta, total, solved }) => (
                <div key={diff} className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className={`text-2xl font-bold ${meta.color}`}>{solved}</span>
                  <span className="text-xs text-slate-600">/{total}</span>
                  <p className="text-xs text-slate-500 mt-1">{meta.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">📋 Recent Activity</h3>
            <div className="space-y-2">
              {MOCK_SUBMISSIONS.map((sub) => {
                const ch = CHALLENGES.find((c) => c.id === sub.challengeId);
                return (
                  <div key={sub.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <span className="text-lg">{sub.correct ? '✅' : '❌'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">
                        {sub.correct ? 'Solved' : 'Attempted'}: {ch?.title || sub.challengeId}
                      </p>
                      <p className="text-[10px] text-slate-600">{sub.submittedAt}</p>
                    </div>
                    <code className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-500 font-mono max-w-[120px] truncate">
                      {sub.flag}
                    </code>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Skill Radar */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Skill Radar</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Badges */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">🏅 Badges ({user.badges.length})</h3>
            <div className="space-y-2">
              {user.badges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-white">{badge.name}</p>
                    <p className="text-[10px] text-slate-500">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solved Challenges */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">✅ Solved Challenges</h3>
            <div className="space-y-1.5">
              {solvedChallenges.map((ch) => {
                const catMeta = CATEGORY_META[ch.category];
                return (
                  <Link
                    key={ch.id}
                    to={`/challenges/${ch.id}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <span className="text-sm">{catMeta.icon}</span>
                    <span className="text-xs text-white flex-1 truncate">{ch.title}</span>
                    <span className="text-[10px] text-slate-600">{ch.points}pts</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
