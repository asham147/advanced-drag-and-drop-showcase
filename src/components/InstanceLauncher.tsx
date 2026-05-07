import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InstanceLauncherProps {
  challengeId: string;
}

export function InstanceLauncher({ challengeId }: InstanceLauncherProps) {
  const [status, setStatus] = useState<'idle' | 'starting' | 'running' | 'expired'>('idle');
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [connectionString, setConnectionString] = useState('');

  useEffect(() => {
    let timer: number;
    if (status === 'running' && timeLeft > 0) {
      timer = window.setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setStatus('expired');
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const handleStart = () => {
    setStatus('starting');
    setTimeout(() => {
      setStatus('running');
      setConnectionString(`ssh trainee@challenge-${challengeId.toLowerCase()}.cyberyemen.com -p ${Math.floor(Math.random() * 10000 + 20000)}`);
    }, 3000);
  };

  const handleStop = () => {
    setStatus('idle');
    setTimeLeft(3600);
    setConnectionString('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          Dynamic Instance
        </h3>
        <span className="text-[10px] text-cyan-400 font-mono">DOCKER-V2.4</span>
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-4"
          >
            <p className="text-xs text-slate-400 mb-4">This challenge requires a private instance to explore the target.</p>
            <button
              onClick={handleStart}
              className="px-6 py-2 rounded-lg bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
            >
              🚀 Launch Instance
            </button>
          </motion.div>
        )}

        {status === 'starting' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4 space-y-3"
          >
            <div className="flex justify-center">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-xs text-cyan-400 animate-pulse font-mono">SPAWNING CONTAINER...</p>
          </motion.div>
        )}

        {status === 'running' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono text-emerald-400">STATUS: ACTIVE</div>
              <div className="text-xs font-mono text-amber-400">EXPIRES IN: {formatTime(timeLeft)}</div>
            </div>

            <div className="p-3 rounded-lg bg-black/50 border border-white/10 font-mono text-[11px] relative group">
              <div className="text-slate-500 mb-1">Connection Details:</div>
              <div className="text-cyan-400 break-all">{connectionString}</div>
              <button 
                onClick={() => navigator.clipboard.writeText(connectionString)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
              >
                📋
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setTimeLeft(t => t + 1800)}
                className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[10px] font-bold hover:bg-white/10 transition-all"
              >
                ➕ Extend
              </button>
              <button
                onClick={handleStop}
                className="flex-1 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-bold hover:bg-rose-500/30 transition-all"
              >
                🛑 Terminate
              </button>
            </div>
          </motion.div>
        )}

        {status === 'expired' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4"
          >
            <p className="text-xs text-rose-400 mb-4">Instance has expired.</p>
            <button
              onClick={handleStart}
              className="px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-bold"
            >
              Restart Instance
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
