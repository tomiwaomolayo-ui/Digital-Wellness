
import React from 'react';
import { 
  Heart, 
  Salad, 
  BrainCircuit, 
  Activity, 
  Bell, 
  Library, 
  Trophy,
  Sparkles,
  Weight,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import { Badge } from './types';

export const NAV_ITEMS = [
  { id: 'mental', label: 'Mental Health', icon: <Heart className="w-5 h-5" /> },
  { id: 'diet', label: 'Diet & Nutrition', icon: <Salad className="w-5 h-5" /> },
  { id: 'weight', label: 'Weight Management', icon: <Weight className="w-5 h-5 text-rose-500" /> },
  { id: 'guidance', label: 'Guidance', icon: <BrainCircuit className="w-5 h-5" /> },
  { id: 'tracker', label: 'Health Tracker', icon: <Activity className="w-5 h-5" /> },
  { id: 'reminders', label: 'Reminders', icon: <Bell className="w-5 h-5" /> },
  { id: 'insights', label: 'AI Insights', icon: <Sparkles className="w-5 h-5 text-indigo-500" /> },
  { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-5 h-5 text-amber-500" /> },
  { id: 'library', label: 'My Library', icon: <Library className="w-5 h-5" /> },
];

export const AVAILABLE_BADGES: Badge[] = [
  { id: 'streak-7', name: '7-Day Streak', description: 'Log healthy meals for 7 days straight', icon: '🔥' },
  { id: 'first-session', name: 'Inner Peace', description: 'Logged your first mental health analysis', icon: '🧘' },
  { id: 'goal-crusher', name: 'Goal Crusher', description: 'Completed 5 health targets in a week', icon: '🎯' },
  { id: 'nutritionist', name: 'Expert Eater', description: 'Analyzed 20 healthy meals', icon: '🥦' },
  { id: 'weight-pioneer', name: 'Weight Pioneer', description: 'Logged your first weight entry', icon: '⚖️' },
];

export const MOCK_ARTICLES = [
  {
    id: '1',
    title: 'Understanding Anxiety in the Modern World',
    content: 'Anxiety is more than just feeling stressed. It is a biological response...',
    category: 'Mental Health',
    author: 'Dr. Sarah Jenkins',
    date: '2024-03-20',
    imageUrl: 'https://picsum.photos/seed/anxiety/800/400'
  },
  {
    id: '2',
    title: 'The Role of Protein in Longevity',
    content: 'As we age, protein intake becomes critical for muscle maintenance...',
    category: 'Diet',
    author: 'Nutritionist Mike Chen',
    date: '2024-03-21',
    imageUrl: 'https://picsum.photos/seed/protein/800/400'
  }
];
