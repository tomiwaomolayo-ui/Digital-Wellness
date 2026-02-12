
import React, { useState, useEffect, useRef } from 'react';
import { analyzeMentalHealth, searchNearbyWellness } from '../services/geminiService';
import { MentalHealthResult, Article, Activity, UserProfile, ChatMessage } from '../types';
import { 
  Send, 
  Loader2, 
  ShieldAlert, 
  CheckCircle, 
  Plus, 
  MessageCircle,
  BarChart3,
  Moon,
  MapPin,
  ExternalLink,
  X,
  UserCircle,
  Info,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  articles: Article[];
  onAddToLibrary: (id: string) => void;
  onAnalyze: (res: MentalHealthResult) => void;
  onActivityComplete: () => void;
  onNavigate: (view: any) => void;
  user: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  persistentResult: MentalHealthResult | null;
}

const MentalHealth: React.FC<Props> = ({ articles, onAddToLibrary, onAnalyze, onActivityComplete, onNavigate, user, messages, onSendMessage, persistentResult }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MentalHealthResult | null>(persistentResult);
  const [activities, setActivities] = useState<Activity[]>([]);
  
  useEffect(() => {
    if (persistentResult) {
      setResult(persistentResult);
      if (persistentResult.recommendations) {
        setActivities(persistentResult.recommendations.map((rec: string, i: number) => ({
          id: `act-${Date.now()}-${i}`, title: rec, completed: false, type: 'Mental Health', score: 0
        })));
      }
    }
  }, [persistentResult]);

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeMentalHealth(description);
      setResult(data);
      onAnalyze(data);
      setActivities(data.recommendations.map((rec: string, i: number) => ({
        id: `act-${Date.now()}-${i}`, title: rec, completed: false, type: 'Mental Health', score: 0
      })));
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const toggleActivity = (id: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id === id && !act.completed) {
        onActivityComplete(); // XP integration with App.tsx points
        return { ...act, completed: true, score: 100 };
      }
      return act;
    }));
  };

  return (
    <div className="space-y-8 animate-fadeIn relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-600" /> Mental Wellness AI
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Immediate analysis and clinical therapeutic guidance.</p>
        </div>
        <div className="relative group">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-blue-200 shadow-sm z-10">
            Available for Premium
          </div>
          <button 
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-full text-sm font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all cursor-not-allowed active:scale-95"
            disabled
          >
            <MessageCircle className="w-5 h-5" /> CHAT WITH PRACTITIONER
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              How are you feeling?
            </h3>
            <p className="text-slate-500 text-sm mb-6">Our clinical AI provides an assessment and suggests actionable wellness steps to improve your mental state.</p>
            <textarea
              className="w-full h-40 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none font-medium text-slate-700"
              placeholder="e.g., I've been feeling unusually tired and anxious for the past few days..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !description}
              className="mt-6 w-full py-4 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-slate-200"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
              Generate Clinical Assessment
            </button>
          </div>

          {result && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl animate-slideUp">
               <div className="flex justify-between items-start mb-8">
                  <div className="flex flex-col">
                    <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">AI DIAGNOSTIC SUMMARY</span>
                    <h3 className="text-3xl font-black text-slate-900 leading-tight">{result.diagnosis}</h3>
                  </div>
                  <div className="bg-indigo-50 px-4 py-2 rounded-2xl text-indigo-600 font-bold text-xs border border-indigo-100">
                    ID: VP-{Date.now().toString().slice(-4)}
                  </div>
               </div>
              <p className="text-slate-600 leading-relaxed font-medium mb-10 text-lg opacity-90 border-l-4 border-indigo-500 pl-6 bg-slate-50 py-4 rounded-r-2xl">{result.moodAnalysis}</p>
              
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" /> Actionable Wellness Tasks (Earn Achievements)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activities.map((act) => (
                    <button 
                      key={act.id} 
                      onClick={() => toggleActivity(act.id)}
                      disabled={act.completed}
                      className={`p-5 rounded-[2rem] border-2 flex items-start gap-4 transition-all text-left group ${
                        act.completed 
                        ? 'bg-emerald-50 border-emerald-100 opacity-80 cursor-default' 
                        : 'bg-white border-slate-100 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1'
                      }`}
                    >
                      <div className={`p-3 rounded-2xl shrink-0 transition-colors ${act.completed ? 'bg-emerald-500 text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                        {act.completed ? <CheckCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm font-bold leading-tight block mb-1 ${act.completed ? 'text-emerald-800' : 'text-slate-800'}`}>
                          {act.title}
                        </span>
                        {act.completed ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-100/50 px-2 py-0.5 rounded-full">
                            Achievement Unlocked +20 XP
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Complete to earn XP</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <aside className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Goal Completion
              </h3>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            {activities.length > 0 ? (
               <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Progress</span>
                      <span className="text-xs font-black text-indigo-600">
                        {Math.round((activities.filter(a => a.completed).length / activities.length) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div 
                        className="h-full bg-indigo-600 transition-all duration-1000 shadow-[0_0_8px_rgba(79,70,229,0.4)]" 
                        style={{ width: `${(activities.filter(a => a.completed).length / activities.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3 mt-8">
                    {activities.map(act => (
                      <div key={act.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100/50">
                         <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${act.completed ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                           <span className={`text-[11px] font-bold ${act.completed ? 'text-emerald-700' : 'text-slate-500'}`}>
                             {act.title}
                           </span>
                         </div>
                         {act.completed && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                      </div>
                    ))}
                  </div>
               </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-4">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                    <Moon className="w-8 h-8 opacity-20" />
                 </div>
                 <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Unlock Clinical Pathway</p>
                 <p className="text-[11px] font-medium leading-relaxed px-4">Complete your first check-in to generate personalized therapeutic tasks.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MentalHealth;
