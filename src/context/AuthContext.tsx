import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, email: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(CURRENT_USER);

  const login = useCallback((_username: string, _password: string) => {
    setUser(CURRENT_USER);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const register = useCallback((_username: string, _email: string, _password: string) => {
    setUser(CURRENT_USER);
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
