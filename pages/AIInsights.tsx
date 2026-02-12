
import React, { useState } from 'react';
import { analyzeHolisticHealth } from '../services/geminiService';
import { HolisticInsight, WeightRecord } from '../types';
import { 
  Sparkles, 
  Loader2, 
  Brain, 
  ArrowRight, 
  Zap, 
  Activity, 
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Weight
} from 'lucide-react';

interface Props {
  mentalStatus?: any;
  dietLogs?: any[];
  exerciseLogs?: any[];
  weightLogs?: WeightRecord[];
}

const AIInsights: React.FC<Props> = ({ mentalStatus, dietLogs, exerciseLogs, weightLogs }) => {
  const [insight, setInsight] = useState<HolisticInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    try {
      const data = await analyzeHolisticHealth({
        mentalStatus,
        dietLogs,
        exerciseLogs,
        weightLogs
      });
      setInsight(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const hasData = mentalStatus || dietLogs?.length || exerciseLogs?.length || weightLogs?.length;

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex p-4 bg-indigo-50 rounded-3xl text-indigo-600 mb-2">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-black text-slate-900">Personalization Engine</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">Our AI connects the dots across your diet, weight trends, sleep, and mental wellness to reveal hidden patterns and actionable holistic advice.</p>
      </div>

      {!insight && (
        <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-100 text-center">
          {!hasData ? (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Insufficient Data</h3>
                <p className="text-slate-500 mt-2">Log some food, mental symptoms, weight or activity to enable AI analysis.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-wrap justify-center gap-4">
                {mentalStatus && <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">Mental History Found</span>}
                {dietLogs?.length && <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">{dietLogs.length} Meals Logged</span>}
                {exerciseLogs?.length && <span className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-xs font-bold">{exerciseLogs.length} Health Logs Found</span>}
                {weightLogs?.length && <span className="px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-bold">{weightLogs.length} Weight Records</span>}
              </div>
              <button
                onClick={generateInsight}
                disabled={loading}
                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-black rounded-3xl flex items-center justify-center gap-3 mx-auto transition-all shadow-xl shadow-indigo-100"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Brain className="w-6 h-6" />}
                Analyze My Holistic State
              </button>
            </div>
          )}
        </div>
      )}

      {insight && (
        <div className="space-y-8 animate-slideUp">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" /> Holistic Summary
              </h3>
              <p className="text-lg leading-relaxed text-indigo-50 italic opacity-90">"{insight.summary}"</p>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-10">
               <Brain className="w-64 h-64" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" /> Key Connections
              </h4>
              {insight.connections.map((conn, i) => (
                <div key={i} className={`p-6 bg-white rounded-3xl border shadow-sm transition-all hover:-translate-y-1 ${
                  conn.impact === 'Positive' ? 'border-emerald-100 bg-emerald-50/10' :
                  conn.impact === 'Negative' ? 'border-rose-100 bg-rose-50/10' :
                  'border-slate-100'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-bold text-slate-800">{conn.title}</h5>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                      conn.impact === 'Positive' ? 'bg-emerald-100 text-emerald-600' :
                      conn.impact === 'Negative' ? 'bg-rose-100 text-rose-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {conn.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{conn.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
                <Activity className="w-6 h-6 text-indigo-600" /> Holistic Action Plan
              </h4>
              <div className="space-y-6">
                {insight.actionItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-sm shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <button
                 onClick={() => setInsight(null)}
                 className="mt-12 w-full py-4 border-2 border-slate-100 text-slate-400 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                Refresh Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
