export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
  ecoScore: number;
  level: number;
  achievements: Achievement[];
  createdAt?: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: Date;
}

export interface CarbonActivity {
  _id?: string;
  userId: string;
  category: 'transport' | 'energy' | 'food' | 'shopping';
  subCategory: string;
  amount: number;
  unit: string;
  date: Date;
  carbonFootprint: number;
  aiSuggestions?: string[];
}

export interface Challenge {
  _id?: string;
  title: string;
  description: string;
  category: string;
  points: number;
  duration: number; // in days
  difficulty: 'easy' | 'medium' | 'hard';
  participants: string[]; // user IDs
}

export interface Leaderboard {
  _id?: string;
  userId: string;
  username: string;
  ecoScore: number;
  level: number;
  rank?: number;
} 