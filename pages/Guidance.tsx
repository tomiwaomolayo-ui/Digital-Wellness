
import React, { useState } from 'react';
import { analyzeGuidance } from '../services/geminiService';
import { 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  Target, 
  Star,
  Frown,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface Props {
  onGoalSet: () => void;
}

const Guidance: React.FC<Props> = ({ onGoalSet }) => {
  const [struggles, setStruggles] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!struggles.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeGuidance(struggles);
      setResult(data);
    } catch (error) {
      console.error(error);
      setError("We encountered an issue analyzing your request. Please try again with different keywords.");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimGoal = (idx: number) => {
    onGoalSet();
    // Simple visual feedback: remove goal or mark it
    if (result) {
      const newGoals = [...result.goals];
      newGoals.splice(idx, 1);
      setResult({ ...result, goals: newGoals });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex p-4 bg-indigo-50 rounded-3xl text-indigo-600 mb-2">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-black text-slate-900">AI Counseling & Life Coach</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">Share your life struggles or career challenges, and let our AI provide strategic feedback on your strengths and areas for growth.</p>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-6">Tell us what you're struggling with...</h3>
        <textarea
          className="w-full h-48 p-8 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all resize-none text-lg"
          placeholder="e.g., I'm feeling overwhelmed at work and I'm struggling with time management and public speaking..."
          value={struggles}
          onChange={(e) => setStruggles(e.target.value)}
        />
        
        {error && (
          <div className="mt-4 p-4 bg-rose-50 text-rose-600 rounded-2xl flex items-center gap-2 text-sm font-medium border border-rose-100">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading || !struggles.trim()}
          className="mt-8 w-full py-6 bg-slate-900 hover:bg-black text-white text-xl font-black rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
          Get AI Guidance
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slideUp">
          <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
            <h4 className="text-xl font-black text-emerald-900 mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-emerald-600" /> Your Strengths
            </h4>
            <ul className="space-y-4">
              {result.strengths.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-3 bg-white/60 p-4 rounded-2xl shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-bold text-emerald-900 text-sm">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50 p-8 rounded-[2rem] border border-rose-100">
            <h4 className="text-xl font-black text-rose-900 mb-6 flex items-center gap-2">
              <Frown className="w-6 h-6 text-rose-600" /> Growth Areas
            </h4>
            <ul className="space-y-4">
              {result.weaknesses.map((w: string, i: number) => (
                <li key={i} className="flex items-start gap-3 bg-white/60 p-4 rounded-2xl shadow-sm">
                  <div className="w-5 h-5 rounded-full border-2 border-rose-600 shrink-0 mt-0.5" />
                  <span className="font-bold text-rose-900 text-sm">{w}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
               <h4 className="text-3xl font-black mb-8 flex items-center gap-3">
                <Target className="w-10 h-10" /> Targeted Achievement Goals
               </h4>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {result.goals.length > 0 ? result.goals.map((goal: any, i: number) => (
                   <div key={i} className="bg-indigo-500/30 p-8 rounded-3xl border border-white/20 hover:bg-indigo-500/50 transition-colors flex flex-col">
                     <span className="inline-block px-4 py-1 bg-white text-indigo-600 text-[10px] font-black rounded-full mb-4 uppercase w-fit">AI GOAL {i+1}</span>
                     <h5 className="text-xl font-bold mb-3">{goal.title}</h5>
                     <p className="text-indigo-100 text-sm leading-relaxed mb-6 flex-1">{goal.action}</p>
                     <button 
                       onClick={() => handleClaimGoal(i)}
                       className="mt-auto w-full py-3 bg-white text-indigo-600 font-bold text-xs uppercase rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                     >
                       I'll achieve this <ArrowRight className="w-4 h-4" />
                     </button>
                   </div>
                 )) : (
                   <div className="lg:col-span-3 text-center py-10 opacity-60 italic">
                     All goals completed! Great job.
                   </div>
                 )}
               </div>
             </div>
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <Target className="w-64 h-64" />
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guidance;
