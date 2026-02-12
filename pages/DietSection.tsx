import React, { useState } from 'react';
import { analyzeDiet } from '../services/geminiService';
import { DietAnalysisResult, Article } from '../types';
import { 
  Loader2, 
  Leaf, 
  Apple, 
  Beef, 
  Wheat, 
  Plus, 
  Heart,
  Target,
  ArrowRight,
  ShieldAlert,
  Zap,
  Bookmark,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Send
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
  articles: Article[];
  onAddToLibrary: (id: string) => void;
  onLog: (res: DietAnalysisResult) => void;
}

const DietSection: React.FC<Props> = ({ articles, onAddToLibrary, onLog }) => {
  const [foodInput, setFoodInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DietAnalysisResult | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const handleAnalyze = async () => {
    if (!foodInput.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeDiet(foodInput);
      setAnalysis(data);
      onLog(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveArticle = (id: string) => {
    if (!savedIds.includes(id)) {
      onAddToLibrary(id);
      setSavedIds(prev => [...prev, id]);
    }
  };

  const pieData = analysis ? [
    { name: 'Proteins', value: analysis.classification.proteins.length, color: '#6366f1' },
    { name: 'Carbs', value: analysis.classification.carbohydrates.length, color: '#f59e0b' },
    { name: 'Others', value: analysis.classification.others.length, color: '#10b981' },
  ] : [];

  return (
    <div className="space-y-8 animate-fadeIn font-normal">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Nutritional Laboratory</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Real-time biological analysis of caloric and nutrient intake.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
              <Apple className="w-8 h-8 text-indigo-600" />
              Meal Telemetry Input
            </h3>
            <p className="text-slate-500 text-sm mb-8 font-medium">Earn +15 XP for logging, and +10 XP bonus for AI-verified clinical healthy choices.</p>
            <div className="relative group">
              <input
                className="w-full p-6 pr-20 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-semibold text-slate-700 text-lg shadow-inner"
                placeholder="e.g., Grilled salmon with quinoa and roasted asparagus"
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading || !foodInput}
                className="absolute right-4 top-4 bottom-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-2xl disabled:opacity-50 transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Send className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {analysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slideUp">
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center group">
                <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-[0.3em] mb-10">Macro Correlation</h4>
                <div className="h-64 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={8}
                        dataKey="value"
                        animationDuration={1500}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                        itemStyle={{fontWeight: '700', fontSize: '12px'}}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontWeight: '600', fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="text-center">
                        <span className="block text-2xl font-bold text-slate-800">100%</span>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Balanced</span>
                     </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl flex flex-col justify-center relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-2xl ${analysis.isHealthy ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-rose-500 shadow-[0_0_15px_#f43f5e]'}`}>
                      {analysis.isHealthy ? <Leaf className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                    </div>
                    <h4 className="text-2xl font-bold tracking-tight">{analysis.isHealthy ? 'Bio-Verified Healthy' : 'Action Required'}</h4>
                  </div>
                  <div className="flex gap-2 mb-8">
                     <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 border border-white/10">
                       <Zap className="w-3 h-3 text-amber-400" /> +15 XP Logged
                     </span>
                     {analysis.isHealthy && (
                       <span className="bg-emerald-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 border border-emerald-500/20 text-emerald-400">
                        <Zap className="w-3 h-3 text-emerald-400" /> +10 XP Bonus
                       </span>
                     )}
                  </div>
                  <p className="text-slate-300 leading-relaxed text-base font-medium mb-10 opacity-90 border-l-2 border-indigo-500 pl-4">"{analysis.feedback}"</p>
                  
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Suggested Nutrient Optimization</p>
                    <div className="grid grid-cols-1 gap-2">
                      {analysis.alternatives.map((alt, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-semibold bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                          <ArrowRight className="w-4 h-4 text-indigo-400" /> {alt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                  <Apple className="w-64 h-64" />
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-800">
              <Beef className="w-8 h-8 text-indigo-600" />
              Nutrient Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Proteins', items: analysis?.classification.proteins || [], icon: <Beef className="text-indigo-500" />, bg: 'bg-indigo-50' },
                { label: 'Carbs', items: analysis?.classification.carbohydrates || [], icon: <Wheat className="text-amber-500" />, bg: 'bg-amber-50' },
                { label: 'Micros', items: analysis?.classification.others || [], icon: <Leaf className="text-emerald-500" />, bg: 'bg-emerald-50' }
              ].map((cat, i) => (
                <div key={i} className={`p-8 rounded-[2rem] border border-slate-100 flex flex-col group hover:shadow-xl transition-all ${cat.bg}/30`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-2xl bg-white shadow-sm text-lg`}>{cat.icon}</div>
                    <span className="font-bold text-slate-800 uppercase tracking-widest text-xs">{cat.label}</span>
                  </div>
                  <ul className="space-y-3 flex-1">
                    {cat.items.length > 0 ? cat.items.map((item, j) => (
                      <li key={j} className="text-sm font-semibold text-slate-600 flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-colors" /> {item}
                      </li>
                    )) : <li className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-10">No data detected</li>}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-8">
           <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-slate-800">
              <Target className="w-6 h-6 text-indigo-600" />
              Daily Bio-Targets
            </h3>
            <div className="space-y-8">
              {[
                { label: 'Hydration', current: 1.2, target: 2.5, unit: 'L', color: 'bg-blue-500', icon: <DropletsIcon className="w-4 h-4" /> },
                { label: 'Micro-Nutrients', current: 2, target: 5, unit: 'units', color: 'bg-orange-500', icon: <Leaf className="w-4 h-4" /> },
                { label: 'Daily Fiber', current: 18, target: 30, unit: 'g', color: 'bg-emerald-500', icon: <Wheat className="w-4 h-4" /> }
              ].map((goal, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <div className="flex items-center gap-2">
                       <span className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-indigo-600 transition-colors">{goal.icon}</span>
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{goal.label}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">{goal.current} / {goal.target} {goal.unit}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                    <div 
                      className={`h-full ${goal.color} transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.1)]`} 
                      style={{ width: `${(goal.current / goal.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-800">
              <Heart className="w-6 h-6 text-rose-500" />
              Healthy Library
            </h3>
            <div className="space-y-8">
              {articles.map(article => (
                <div key={article.id} className="group relative">
                  <div className="w-full h-40 overflow-hidden rounded-3xl mb-4 shadow-lg border border-slate-100">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                       <button onClick={() => handleSaveArticle(article.id)} className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                          <Bookmark className="w-3 h-3" /> Save for study
                       </button>
                    </div>
                  </div>
                  <div className="px-2">
                    <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">{article.category}</span>
                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight mt-2 text-lg">{article.title}</h4>
                    <div className="mt-4 flex items-center justify-between">
                       <button 
                        onClick={() => handleSaveArticle(article.id)}
                        disabled={savedIds.includes(article.id)}
                        className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${savedIds.includes(article.id) ? 'text-emerald-500' : 'text-slate-400 hover:text-indigo-600'}`}
                       >
                        {savedIds.includes(article.id) ? (
                          <><CheckCircle2 className="w-3 h-3" /> Saved in Vault</>
                        ) : (
                          <><Plus className="w-3 h-3" /> Add to library (+10 XP)</>
                        )}
                       </button>
                       <BookOpen className="w-4 h-4 text-slate-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-5 border-2 border-dashed border-slate-100 rounded-3xl text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] hover:bg-slate-50 transition-all">
              Explore Resource Hub
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const DropletsIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16.3c2.2 0 4-1.8 4-4 0-3.3-4-8-4-8s-4 4.7-4 8c0 2.2 1.8 4 4 4Z" />
    <path d="M17 21.3c1.7 0 3-1.3 3-3 0-2.4-3-6-3-6s-3 3.6-3 6c0 1.7 1.3 3 3 3Z" />
  </svg>
);

export default DietSection;