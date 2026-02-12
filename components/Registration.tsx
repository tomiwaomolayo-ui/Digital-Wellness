import React, { useState } from 'react';
import { UserProfile } from '../types';
import { HeartPulse, CheckCircle2, UserPlus, LogIn, Target, ArrowRight, ChevronLeft } from 'lucide-react';

interface Props {
  onRegister: (profile: UserProfile) => void;
}

const Registration: React.FC<Props> = ({ onRegister }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const wellnessGoals = [
    "Improve Mental Health",
    "Reduce Stress & Anxiety",
    "Lose Weight",
    "Balanced Nutrition",
    "Better Sleep Habits",
    "Daily Fitness Tracking",
    "Professional Guidance"
  ];

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleNextStep = () => {
    if (formData.name && formData.email) setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onRegister({ 
        name: 'Demo User', 
        email: formData.email || 'demo@vitality.com', 
        phone: '555-0100', 
        registered: true, 
        points: 450, 
        badges: ['first-session'], 
        level: 1,
        goals: ['Improve Mental Health']
      });
    } else {
      onRegister({ ...formData, registered: true, points: 0, badges: [], level: 1, goals: selectedGoals.length ? selectedGoals : ['General Wellness'] });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden">
        
        <div className="relative z-10 text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
            <HeartPulse className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">VitalityPulse</h1>
          <p className="text-slate-500 mt-2 font-medium">
            {mode === 'login' ? 'Continue your wellness journey' : 'Start your personalized health path'}
          </p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 border border-slate-200/50">
          <button 
            onClick={() => { setMode('login'); setStep(1); }}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${mode === 'login' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/30' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LogIn className="w-4 h-4" /> Log In
          </button>
          <button 
            onClick={() => { setMode('signup'); setStep(1); }}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${mode === 'signup' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/30' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <UserPlus className="w-4 h-4" /> Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'login' ? (
            <>
              <div className="space-y-4">
                <input
                  type="email" required placeholder="Email Address"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="password" required placeholder="Password"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                />
              </div>
              <button className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                Enter Dashboard
              </button>
            </>
          ) : step === 1 ? (
            <>
              <div className="space-y-4">
                <input
                  type="text" required placeholder="Full Name"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="email" required placeholder="Email Address"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <button type="button" onClick={handleNextStep} className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all">
                Select Your Goals <ArrowRight className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="animate-fadeIn">
              <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-slate-400 font-semibold text-xs uppercase mb-6 hover:text-slate-600">
                <ChevronLeft className="w-4 h-4" /> Back to details
              </button>
              <div className="space-y-3 mb-8">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-indigo-600" /> What are your achievements goals?
                </h3>
                <div className="grid grid-cols-1 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {wellnessGoals.map(goal => (
                    <button
                      key={goal} type="button" onClick={() => toggleGoal(goal)}
                      className={`text-left px-5 py-3.5 rounded-2xl text-sm font-semibold border transition-all flex justify-between items-center ${selectedGoals.includes(goal) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-indigo-200'}`}
                    >
                      {goal}
                      {selectedGoals.includes(goal) && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
              <button className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">
                Create Account <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Registration;