import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CHALLENGES, SOLVED_CHALLENGES, FLAG_MAP } from '../data/mockData';
import { CATEGORY_META, DIFFICULTY_META } from '../types';
import { InstanceLauncher } from '../components/InstanceLauncher';
import { useNotify } from '../context/NotificationContext';

export function ChallengeDetail() {
  const { id } = useParams();
  const { notify } = useNotify();
  const challenge = CHALLENGES.find((c) => c.id === id);
  const [flag, setFlag] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'already'>('idle');
  const [showHints, setShowHints] = useState(false);
  const [attempts, setAttempts] = useState(0);

  if (!challenge) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <span className="text-5xl block mb-4">❓</span>
        <h2 className="text-xl font-bold text-white">Challenge Not Found</h2>
        <Link to="/challenges" className="text-sm text-cyan-400 mt-2 inline-block hover:text-cyan-300">← Back to Challenges</Link>
      </div>
    );
  }

  const catMeta = CATEGORY_META[challenge.category];
  const diffMeta = DIFFICULTY_META[challenge.difficulty];
  const solved = SOLVED_CHALLENGES.includes(challenge.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;

    const correctFlag = FLAG_MAP[challenge.id];
    if (SOLVED_CHALLENGES.includes(challenge.id)) {
      setStatus('already');
      return;
    }
    if (flag.trim() === correctFlag) {
      SOLVED_CHALLENGES.push(challenge.id);
      setStatus('correct');
      notify('success', 'Challenge Solved!', `You earned ${challenge.points} points for "${challenge.title}"`);
    } else {
      setStatus('wrong');
      setAttempts((a) => a + 1);
      notify('error', 'Incorrect Flag', 'The flag you submitted is incorrect. Try again!');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
        <Link to="/challenges" className="hover:text-cyan-400 transition-colors">Challenges</Link>
        <span>/</span>
        <span className="text-slate-400">{catMeta.label}</span>
        <span>/</span>
        <span className="text-white">{challenge.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${catMeta.color}`} />
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${catMeta.color} flex items-center justify-center text-2xl sm:text-3xl shadow-lg shrink-0`}>
                  {catMeta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">{challenge.title}</h1>
                    {solved && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ✅ Solved
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${diffMeta.bg} ${diffMeta.color}`}>
                      {diffMeta.label}
                    </span>
                    <span className="text-xs text-slate-500">{challenge.points} points</span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-500">{challenge.solves} solves</span>
                    {challenge.dynamicPoints && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Dynamic</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                    <span>by {challenge.author}</span>
                    <span>•</span>
                    <span>{challenge.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 prose prose-invert prose-sm max-w-none">
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {challenge.description.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-white mt-4 mb-2">{line.replace('## ', '')}</h2>;
                    if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold text-white mt-3 mb-1">{line.replace('### ', '')}</h3>;
                    if (line.startsWith('- ')) return <li key={i} className="text-slate-400 ml-4">{line.replace('- ', '')}</li>;
                    if (line.startsWith('```')) return null;
                    if (line.startsWith('`') && line.endsWith('`')) return <code key={i} className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-400 text-xs">{line.replace(/`/g, '')}</code>;
                    if (line.trim() === '') return <br key={i} />;
                    return <p key={i} className="text-slate-400">{line}</p>;
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Instance Launcher for Web/Reversing/Network */}
          {(challenge.category === 'web' || challenge.category === 'reversing' || challenge.category === 'network') && (
            <InstanceLauncher challengeId={challenge.id} />
          )}

          {/* Files */}
          {challenge.files.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-white mb-3">📎 Challenge Files</h3>
              <div className="space-y-2">
                {challenge.files.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all">
                    <span className="text-lg">📦</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{file.size}</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-all">
                      ⬇ Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flag Submission */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-white mb-3">🚩 Submit Flag</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={flag}
                  onChange={(e) => { setFlag(e.target.value); setStatus('idle'); }}
                  placeholder="CY{your_flag_here}"
                  disabled={solved && status !== 'wrong'}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all disabled:opacity-50 font-mono"
                />
                <button
                  type="submit"
                  disabled={solved || !flag.trim()}
                  className="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold text-white hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  Submit
                </button>
              </div>

              {/* Status Messages */}
              {status === 'correct' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 animate-[fadeInUp_0.3s_ease]">
                  <span className="text-xl">🎉</span>
                  <div>
                    <p className="text-sm font-semibold text-emerald-400">Correct! +{challenge.points} points</p>
                    <p className="text-xs text-emerald-400/60">Great job! You earned points for this challenge.</p>
                  </div>
                </div>
              )}
              {status === 'wrong' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 animate-[fadeInUp_0.3s_ease]">
                  <span className="text-xl">❌</span>
                  <div>
                    <p className="text-sm font-semibold text-rose-400">Incorrect flag</p>
                    <p className="text-xs text-rose-400/60">Attempt #{attempts}. Try again!</p>
                  </div>
                </div>
              )}
              {status === 'already' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <span className="text-xl">⚠️</span>
                  <p className="text-sm text-amber-400">You have already solved this challenge!</p>
                </div>
              )}

              <p className="text-[10px] text-slate-600">
                Attempts: {attempts} • Flag format: CY{'{'}...{'}'}
              </p>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Info Card */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-3">ℹ️ Challenge Info</h3>
            <div className="space-y-2">
              {[
                { label: 'Category', value: `${catMeta.icon} ${catMeta.label}` },
                { label: 'Difficulty', value: `${'⭐'.repeat(diffMeta.stars)} ${diffMeta.label}` },
                { label: 'Points', value: `${challenge.points}` },
                { label: 'Solves', value: `${challenge.solves} users` },
                { label: 'Author', value: challenge.author },
                { label: 'Status', value: solved ? '✅ Solved' : '🔓 Unsolved' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="text-white font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-3">🏷️ Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {challenge.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Hints */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <button
              onClick={() => setShowHints(!showHints)}
              className="w-full flex items-center justify-between text-sm font-semibold text-white"
            >
              <span>💡 Hints ({challenge.hints.length})</span>
              <span className="text-slate-500">{showHints ? '▲' : '▼'}</span>
            </button>
            {showHints && (
              <div className="mt-3 space-y-2">
                {challenge.hints.map((hint, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400/80">
                    <span className="font-medium">Hint {i + 1}:</span> {hint}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-3">📊 Solve Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Solve Rate</span>
                <span className="text-xs text-white">{Math.round((challenge.solves / 1247) * 100)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${catMeta.color}`}
                  style={{ width: `${Math.min(100, (challenge.solves / 1247) * 100 * 5)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Back */}
          <Link
            to="/challenges"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Challenges
          </Link>
        </div>
      </div>
    </div>
  );
}
