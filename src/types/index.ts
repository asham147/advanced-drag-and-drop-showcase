export type Category = 'web' | 'crypto' | 'forensics' | 'reversing' | 'network' | 'misc';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type UserRole = 'user' | 'moderator' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio: string;
  team: string;
  country: string;
  joinedAt: string;
  totalScore: number;
  solvedCount: number;
  rank: number;
  streak: number;
  badges: Badge[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  points: number;
  dynamicPoints: boolean;
  solves: number;
  author: string;
  files: ChallengeFile[];
  hints: string[];
  isPrereleased: boolean;
  isActive: boolean;
  createdAt: string;
  tags: string[];
}

export interface ChallengeFile {
  id: string;
  name: string;
  url: string;
  size: string;
}

export interface Submission {
  id: string;
  userId: string;
  challengeId: string;
  flag: string;
  correct: boolean;
  submittedAt: string;
}

export interface Solve {
  userId: string;
  challengeId: string;
  solvedAt: string;
  points: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  totalScore: number;
  solvedCount: number;
  lastSolveAt: string;
  team: string;
  country: string;
}

export interface CTFEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'ended';
  participants: number;
  challenges: number;
  prizePool: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const CATEGORY_META: Record<Category, { label: string; icon: string; color: string; glow: string }> = {
  web: { label: 'Web Exploitation', icon: '🌐', color: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/20' },
  crypto: { label: 'Cryptography', icon: '🔐', color: 'from-purple-500 to-violet-500', glow: 'shadow-purple-500/20' },
  forensics: { label: 'Forensics', icon: '🔬', color: 'from-emerald-500 to-green-500', glow: 'shadow-emerald-500/20' },
  reversing: { label: 'Reverse Engineering', icon: '⚙️', color: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/20' },
  network: { label: 'Network Analysis', icon: '📡', color: 'from-rose-500 to-pink-500', glow: 'shadow-rose-500/20' },
  misc: { label: 'Miscellaneous', icon: '🧩', color: 'from-teal-500 to-cyan-500', glow: 'shadow-teal-500/20' },
};

export const DIFFICULTY_META: Record<Difficulty, { label: string; color: string; bg: string; stars: number }> = {
  easy: { label: 'Easy', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', stars: 1 },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', stars: 2 },
  hard: { label: 'Hard', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', stars: 3 },
};
