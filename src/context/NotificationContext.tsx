import { useState, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

interface NotificationContextType {
  notify: (type: NotificationType, title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((type: NotificationType, title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-xl flex gap-3 ${
                n.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                n.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                n.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
              }`}
            >
              <div className="text-xl">
                {n.type === 'success' ? '✅' : n.type === 'error' ? '❌' : n.type === 'warning' ? '⚠️' : 'ℹ️'}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold">{n.title}</h4>
                <p className="text-xs opacity-80 mt-0.5">{n.message}</p>
              </div>
              <button 
                onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))}
                className="text-xs opacity-50 hover:opacity-100"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotify must be used within NotificationProvider');
  return ctx;
}
