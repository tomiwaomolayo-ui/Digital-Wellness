export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  registered: boolean;
  points: number;
  badges: string[];
  level: number;
  targetWeight?: number;
  goals: string[]; // Selected during signup
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface WeightRecord {
  date: string;
  weight: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'practitioner';
  text: string;
  timestamp: number;
  userId: string;
}

export interface HolisticInsight {
  summary: string;
  connections: {
    title: string;
    description: string;
    impact: 'Positive' | 'Negative' | 'Neutral';
  }[];
  actionItems: string[];
}

export interface MentalHealthResult {
  diagnosis: string;
  classification: 'Normal' | 'Depression' | 'Social Anxiety' | 'Stress' | 'Other';
  moodAnalysis: string;
  recommendations: string[];
  nearbyResults?: any;
}

export interface DietAnalysisResult {
  isHealthy: boolean;
  classification: {
    proteins: string[];
    carbohydrates: string[];
    others: string[];
  };
  alternatives: string[];
  feedback: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  category: 'Mental Health' | 'Diet' | 'General';
  author: string;
  date: string;
  imageUrl?: string;
  fileUrl?: string; // For uploaded documents
}

export interface Activity {
  id: string;
  title: string;
  completed: boolean;
  type: string;
  score: number;
}

export interface HealthMetrics {
  walk: number;
  run: number;
  sleep: number;
  date: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'Medication' | 'Appointment' | 'General';
  active: boolean;
  isTriggered?: boolean;
}

export type View = 'home' | 'mental' | 'diet' | 'guidance' | 'tracker' | 'reminders' | 'admin' | 'library' | 'insights' | 'achievements' | 'weight';