
import React, { useState, useMemo } from 'react';
import { analyzeWeightGoals } from '../services/geminiService';
import { WeightRecord, UserProfile } from '../types';
import { 
  Weight, 
  Target, 
  TrendingUp, 
  Plus, 
  Loader2, 
  CheckCircle, 
  Activity,
  HeartPulse,
  Scale,
  Calendar,
  Zap,
  ChevronRight
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface Props {
  user: UserProfile;
  updateTargetWeight: (w: number) => void;
  logs: WeightRecord[];
  onLog: (record: WeightRecord) => void;
}

const WeightManagement: React.FC<Props> = ({ user, updateTargetWeight, logs, onLog }) => {
  const [currentInput, setCurrentInput] = useState('');
  const [targetInput, setTargetInput] = useState(user.targetWeight?.toString() || '');
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly'>('daily');

  const filteredLogs = useMemo(() => {
    if (timeframe === 'daily') return logs;
    return logs.filter((_, i) => i % 7 === 0);
  }, [logs, timeframe]);

  const handleLogWeight = () => {
    const w = parseFloat(currentInput);
    if (!isNaN(w)) {
      onLog({ date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), weight: w });
      setCurrentInput('');
    }
  };

  const currentWeight = logs.length > 0 ? logs[logs.length - 1].weight : 0;
  const progressPercent = (user.targetWeight && logs.length > 0) 
    ? Math.min(100, Math.max(0, Math.round(Math.abs((logs[0].weight - currentWeight) / (logs[0].weight - user.targetWeight)) * 100))) 
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Biological Mass Index</h2>
          <p className="text-slate-500 font-medium mt-1">Digital synchronization of body metrics and goals.</p>
        </div>
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200 shadow-sm">
           <button onClick={() => setTimeframe('daily')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${timeframe === 'daily' ? 'bg-white text-rose-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Daily</button>
           <button onClick={() => setTimeframe('weekly')} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${timeframe === 'weekly' ? 'bg-white text-rose-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Weekly</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-950 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden">
            <div className="flex justify-between items-center mb-10 relative z-10">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-900/40">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-white tracking-wide uppercase">Sensor Signal Stream</h3>
               </div>
               <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" /> Mass (kg)</span>
               </div>
            </div>
            
            <div className="h-80 w-full relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={filteredLogs}>
                   <defs>
                     <linearGradient id="digitalGlow" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                       <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#1e293b" />
                   <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 900}} dy={10} />
                   <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                   <Tooltip 
                     contentStyle={{borderRadius: '20px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '12px', fontWeight: 'bold'}}
                     itemStyle={{color: '#fb7185'}}
                     cursor={{stroke: '#f43f5e', strokeWidth: 2}}
                   />
                   <Area 
                     type="monotone" 
                     dataKey="weight" 
                     stroke="#f43f5e" 
                     strokeWidth={5} 
                     fillOpacity={1} 
                     fill="url(#digitalGlow)" 
                     animationDuration={2000}
                     dot={{fill: '#f43f5e', r: 4, strokeWidth: 2, stroke: '#0f172a'}}
                     activeDot={{r: 8, strokeWidth: 0, fill: '#fff'}}
                   />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/5 rounded-full blur-[100px] pointer-events-none" />
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h4 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
               <Target className="w-6 h-6 text-rose-500" /> Overall Strategy
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-8 bg-rose-50 rounded-[2rem] border border-rose-100">
                 <h5 className="font-black text-rose-900 text-lg mb-2 uppercase tracking-tight">Metabolic Focus</h5>
                 <p className="text-sm text-rose-700 leading-relaxed font-bold opacity-80">Consistent mass telemetry helps VitalityPulse AI identify metabolic fluctuations. Tracking daily mass correlates with 40% higher goal success rates.</p>
               </div>
               <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                 <h5 className="font-black text-emerald-900 text-lg mb-2 uppercase tracking-tight">Ecosystem Health</h5>
                 <p className="text-sm text-emerald-700 leading-relaxed font-bold opacity-80">Trajectory analysis suggests a positive bio-trend. Maintain high hydration levels to support your goal of {user.targetWeight}kg.</p>
               </div>
            </div>
          </div>
        </div>

        <aside className="space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
              <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <Plus className="w-5 h-5 text-rose-500" /> Log Session
              </h3>
              <div className="space-y-6">
                 <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Current Body Mass (kg)</label>
                    <div className="flex gap-2">
                       <input 
                         type="number" 
                         className="flex-1 min-w-0 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-rose-100 font-bold text-base text-slate-700 transition-all" 
                         placeholder="0.0"
                         value={currentInput} 
                         onChange={e => setCurrentInput(e.target.value)}
                       />
                       <button onClick={handleLogWeight} className="p-4 bg-rose-600 text-white rounded-2xl shadow-xl shadow-rose-100 hover:scale-105 transition-all shrink-0"><Plus className="w-5 h-5" /></button>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-slate-50">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Update bio-target (kg)</label>
                    <div className="flex gap-2">
                       <input 
                         type="number" 
                         className="flex-1 min-w-0 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-slate-700 font-bold text-base transition-all focus:ring-4 focus:ring-slate-100" 
                         placeholder="0.0"
                         value={targetInput} 
                         onChange={e => setTargetInput(e.target.value)}
                       />
                       <button onClick={() => updateTargetWeight(parseFloat(targetInput))} className="px-5 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shrink-0">Apply</button>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-8 uppercase tracking-widest">Goal Status</h4>
                <div className="flex items-center justify-between mb-3">
                   <span className="text-[10px] font-black opacity-70 uppercase tracking-[0.2em]">Efficiency to Target</span>
                   <span className="text-3xl font-black">{progressPercent}%</span>
                </div>
                <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden mb-10 border border-white/10 shadow-inner">
                   <div className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all duration-2000 ease-out" style={{ width: `${progressPercent}%` }} />
                </div>
                <button className="w-full py-4 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white/20 transition-all border border-white/10 active:scale-95">
                  Analytical Deep Dive <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <Scale className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
           </div>
        </aside>
      </div>
    </div>
  );
};

export default WeightManagement;
