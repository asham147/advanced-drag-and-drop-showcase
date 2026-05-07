import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CHALLENGES, SOLVED_CHALLENGES } from '../data/mockData';
import { CATEGORY_META, DIFFICULTY_META, type Category, type Difficulty } from '../types';

export function Challenges() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(
    (searchParams.get('category') as Category) || 'all'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [showSolved, setShowSolved] = useState<'all' | 'solved' | 'unsolved'>('all');

  const filtered = useMemo(() => {
    return CHALLENGES.filter((ch) => {
      if (!ch.isActive) return false;
      if (selectedCategory !== 'all' && ch.category !== selectedCategory) return false;
      if (selectedDifficulty !== 'all' && ch.difficulty !== selectedDifficulty) return false;
      if (showSolved === 'solved' && !SOLVED_CHALLENGES.includes(ch.id)) return false;
      if (showSolved === 'unsolved' && SOLVED_CHALLENGES.includes(ch.id)) return false;
      if (search) {
        const q = search.toLowerCase();
        return ch.title.toLowerCase().includes(q) ||
               ch.tags.some(t => t.toLowerCase().includes(q)) ||
               ch.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedCategory, selectedDifficulty, showSolved, search]);

  const totalPoints = filtered.reduce((sum, ch) => sum + ch.points, 0);
  const solvedCount = filtered.filter(ch => SOLVED_CHALLENGES.includes(ch.id)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">⚔️ Challenges</h1>
          <p className="text-sm text-slate-400 mt-1">
            {filtered.length} challenges • {totalPoints.toLocaleString()} total points • {solvedCount} solved by you
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            ✅ {SOLVED_CHALLENGES.length} solved
          </span>
          <span className="text-xs px-2 py-1 rounded bg-white/5 text-slate-400 border border-white/10">
            {CHALLENGES.length - SOLVED_CHALLENGES.length} remaining
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          <input
            type="text"
            placeholder="Search challenges by name, tag, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === 'all' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              All
            </button>
            {(Object.keys(CATEGORY_META) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {CATEGORY_META[cat].icon} {CATEGORY_META[cat].label}
              </button>
            ))}
          </div>

          <div className="w-px bg-white/10 mx-1 hidden sm:block" />

          {/* Difficulty Filters */}
          <div className="flex gap-1.5">
            {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDifficulty === diff
                    ? diff === 'easy' ? 'bg-emerald-500/20 text-emerald-400'
                      : diff === 'medium' ? 'bg-amber-500/20 text-amber-400'
                      : diff === 'hard' ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-white/10 text-white'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {diff === 'all' ? 'All Levels' : DIFFICULTY_META[diff].label}
              </button>
            ))}
          </div>

          <div className="w-px bg-white/10 mx-1 hidden sm:block" />

          {/* Solved Filter */}
          <div className="flex gap-1.5">
            {(['all', 'unsolved', 'solved'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setShowSolved(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  showSolved === opt ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {opt === 'all' ? 'All' : opt === 'solved' ? '✅ Solved' : '🔓 Unsolved'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenge Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-4xl mb-4 block">🔍</span>
          <h3 className="text-lg font-semibold text-white">No challenges found</h3>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((ch) => {
            const catMeta = CATEGORY_META[ch.category];
            const diffMeta = DIFFICULTY_META[ch.difficulty];
            const solved = SOLVED_CHALLENGES.includes(ch.id);
            return (
              <Link
                key={ch.id}
                to={`/challenges/${ch.id}`}
                className={`group relative p-4 sm:p-5 rounded-xl border transition-all hover:scale-[1.02] ${
                  solved
                    ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                {solved && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">
                    ✅
                  </div>
                )}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${catMeta.color} flex items-center justify-center text-lg sm:text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {catMeta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                      {ch.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded border ${diffMeta.bg} ${diffMeta.color}`}>
                        {'⭐'.repeat(diffMeta.stars)} {diffMeta.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{ch.points} pts</span>
                  <span>{ch.solves} solves</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {ch.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
                {ch.files.length > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-600">
                    📎 {ch.files.length} file{ch.files.length > 1 ? 's' : ''}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
