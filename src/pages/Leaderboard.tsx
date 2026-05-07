import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEADERBOARD } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export function Leaderboard() {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');

  const entries = LEADERBOARD;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">🏆 Leaderboard</h1>
          <p className="text-sm text-slate-400 mt-1">Top cybersecurity trainees ranked by score</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white/5 rounded-lg p-1 border border-white/10">
          {(['all', 'week', 'month'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setTimeFilter(opt)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                timeFilter === opt ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'
              }`}
            >
              {opt === 'all' ? 'All Time' : opt === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
        {[1, 0, 2].map((idx) => {
          const entry = entries[idx];
          if (!entry) return null;
          const isFirst = idx === 0;
          return (
            <div
              key={entry.userId}
              className={`relative rounded-2xl border p-3 sm:p-5 text-center transition-all ${
                isFirst
                  ? 'bg-gradient-to-br from-amber-500/10 to-yellow-600/5 border-amber-500/30 sm:-mt-4'
                  : 'bg-white/[0.02] border-white/10'
              } ${entry.userId === user?.id ? 'ring-2 ring-cyan-500/40' : ''}`}
            >
              <div className="text-2xl sm:text-3xl mb-1">
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
              </div>
              <div className="text-2xl sm:text-4xl mb-1">{entry.avatar}</div>
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">{entry.username}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">{entry.team}</p>
              <p className="text-base sm:text-xl font-bold text-cyan-400 mt-1">{entry.totalScore.toLocaleString()}</p>
              <p className="text-[10px] text-slate-600">points</p>
              <p className="text-[10px] text-slate-500 mt-1">{entry.solvedCount} solved</p>
              {entry.userId === user?.id && (
                <span className="absolute top-1 right-1 text-[8px] px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-400">You</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Full Table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-white/10 text-xs text-slate-500 font-medium">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5 sm:col-span-4">Player</div>
          <div className="col-span-2 text-center hidden sm:block">Team</div>
          <div className="col-span-3 sm:col-span-3 text-center">Solved</div>
          <div className="col-span-3 sm:col-span-2 text-right">Score</div>
        </div>

        {/* Rows */}
        {entries.map((entry) => {
          const isCurrentUser = entry.userId === user?.id;
          return (
            <div
              key={entry.userId}
              className={`grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-white/5 last:border-0 transition-all hover:bg-white/[0.03] ${
                isCurrentUser ? 'bg-cyan-500/5 border-l-2 border-l-cyan-500' : ''
              }`}
            >
              <div className="col-span-1 text-center">
                <span className={`text-sm font-bold ${entry.rank <= 3 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {entry.rank}
                </span>
              </div>
              <div className="col-span-5 sm:col-span-4 flex items-center gap-2 min-w-0">
                <span className="text-xl shrink-0">{entry.avatar}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{entry.username}</p>
                  <p className="text-[10px] text-slate-600">{entry.country}</p>
                </div>
                {isCurrentUser && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 shrink-0">You</span>
                )}
              </div>
              <div className="col-span-2 text-center text-xs text-slate-500 hidden sm:block truncate">
                {entry.team}
              </div>
              <div className="col-span-3 sm:col-span-3 text-center">
                <span className="text-sm text-slate-300">{entry.solvedCount}</span>
                <span className="text-[10px] text-slate-600 ml-1">challenges</span>
              </div>
              <div className="col-span-3 sm:col-span-2 text-right">
                <span className="text-sm font-bold text-cyan-400">{entry.totalScore.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Your Position */}
      {user && (
        <div className="mt-4 p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{user.avatar}</span>
              <div>
                <p className="text-sm font-semibold text-white">{user.username} (You)</p>
                <p className="text-xs text-slate-500">Rank #{user.rank} • {user.totalScore} points • {user.solvedCount} solved</p>
              </div>
            </div>
            <Link to="/profile" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              View Profile →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
