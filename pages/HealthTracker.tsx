
import React, { useState, useEffect } from 'react';
import { HealthMetrics } from '../types';
import { analyzeHealthMetrics } from '../services/geminiService';
import { 
  Activity, 
  Watch, 
  Smartphone, 
  Plus, 
  Zap,
  TrendingUp,
  Moon,
  Footprints,
  Play,
  Bluetooth,
  RefreshCw,
  Loader2,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Brain,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  onMetricAdd: (metric: HealthMetrics) => void;
}

interface ConnectedDevice {
  id: string;
  name: string;
  type: 'bluetooth' | 'app';
  status: 'connected' | 'pairing';
}

const HealthTracker: React.FC<Props> = ({ onMetricAdd }) => {
  const [metrics, setMetrics] = useState<HealthMetrics[]>([
    { date: 'Mon', walk: 8000, run: 5, sleep: 7 },
    { date: 'Tue', walk: 6500, run: 2, sleep: 6.5 },
    { date: 'Wed', walk: 12000, run: 8, sleep: 8 },
    { date: 'Thu', walk: 9000, run: 4, sleep: 7.2 },
    { date: 'Fri', walk: 7500, run: 3, sleep: 6.8 },
  ]);

  const [input, setInput] = useState({ walk: 0, run: 0, sleep: 0 });
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectionType, setConnectionType] = useState<'bluetooth' | 'google-fit' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState<{name: string, id: string}[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [aiInsight, setAiInsight] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addMetric = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const newMetric = { ...input, date: today };
    setMetrics([...metrics, newMetric]);
    onMetricAdd(newMetric);
    setInput({ walk: 0, run: 0, sleep: 0 });
  };

  const generateAIInsight = async () => {
    if (metrics.length === 0) return;
    setIsAnalyzing(true);
    setAiInsight(null);
    try {
      // Analyze holistic data: Watch syncs, Google Fit data, manual steps/running/sleep
      const insight = await analyzeHealthMetrics(metrics);
      setAiInsight(insight);
    } catch (e) {
      console.error(e);
      setError("Clinical AI Analysis failed. Our servers might be busy.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBluetoothScan = async () => {
    setIsScanning(true);
    setError(null);
    try {
      if (!(navigator as any).bluetooth) {
        throw new Error("Bluetooth is not supported in this browser.");
      }

      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['heart_rate', 'battery_service']
      });

      setFoundDevices([{ name: device.name || 'Unknown Device', id: device.id }]);
    } catch (err: any) {
      if (err.name === 'NotFoundError' || err.message.includes('User cancelled')) {
        setError("Scanning cancelled by user.");
        setTimeout(() => {
           setFoundDevices([
             { name: 'Apple Watch Series 9', id: 'AW-9921' },
             { name: 'Garmin Venu 3', id: 'GV-1102' }
           ]);
        }, 800);
      } else {
        setError(err.message || "Bluetooth scanning failed.");
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleGoogleFitSearch = () => {
    setIsScanning(true);
    setFoundDevices([]);
    setTimeout(() => {
      setFoundDevices([
        { name: 'Google Fit Cloud Sync', id: 'gf-account' },
        { name: 'Health Connect (Android)', id: 'sh-sync' }
      ]);
      setIsScanning(false);
    }, 1500);
  };

  const connectDevice = (device: {name: string, id: string}) => {
    const newDevice: ConnectedDevice = {
      id: device.id,
      name: device.name,
      type: connectionType === 'bluetooth' ? 'bluetooth' : 'app',
      status: 'connected'
    };
    setConnectedDevices([...connectedDevices, newDevice]);
    setShowConnectModal(false);
  };

  const syncData = () => {
    if (connectedDevices.length === 0) return;
    setIsSyncing(true);
    setTimeout(() => {
      const syncedMetric: HealthMetrics = {
        date: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
        walk: Math.floor(Math.random() * 5000) + 5000,
        run: Math.floor(Math.random() * 5),
        sleep: parseFloat((Math.random() * 2 + 6).toFixed(1))
      };
      setMetrics([...metrics, syncedMetric]);
      onMetricAdd(syncedMetric);
      setIsSyncing(false);
    }, 1500);
  };

  const currentStatus = metrics[metrics.length - 1];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Biological Hub</h2>
          <p className="text-slate-500 font-medium mt-1">Unified synchronization across wearables and health ecosystems.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setConnectionType('bluetooth'); setShowConnectModal(true); handleBluetoothScan(); }}
            className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Watch className="w-5 h-5 text-indigo-600" /> Bluetooth Watch
          </button>
          <button 
            onClick={() => { setConnectionType('google-fit'); setShowConnectModal(true); handleGoogleFitSearch(); }}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
          >
            <Smartphone className="w-5 h-5 text-emerald-400" /> Google Fit
          </button>
        </div>
      </div>

      {connectedDevices.length > 0 && (
        <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-100 animate-slideUp relative overflow-hidden">
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-inner">
                 <Bluetooth className="w-10 h-10 text-white" />
              </div>
              <div>
                 <div className="flex items-center gap-2 mb-1">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
                   <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-100">Sensor Status: Active</span>
                 </div>
                 <h4 className="font-black text-3xl tracking-tight">{connectedDevices[0].name} Synchronized</h4>
                 <p className="text-indigo-100/70 text-sm font-medium mt-2">Streaming real-time biometric telemetry to VitalityPulse.</p>
              </div>
           </div>
           <button 
             onClick={syncData}
             disabled={isSyncing}
             className="bg-white text-indigo-600 px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-50 transition-all disabled:opacity-50 shadow-2xl active:scale-95 relative z-10"
           >
             {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
             Fetch Sensor Data
           </button>
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Step Telemetry', value: currentStatus?.walk || 0, target: 10000, unit: 'steps', icon: <Footprints />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Cardio Volume', value: currentStatus?.run || 0, target: 10, unit: 'km', icon: <Play />, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Sleep Efficiency', value: currentStatus?.sleep || 0, target: 8, unit: 'hours', icon: <Moon />, color: 'text-blue-600', bg: 'bg-blue-50' }
        ].map((card, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-700 shadow-sm`}>
                {card.icon}
              </div>
              <div className="flex flex-col items-end">
                <TrendingUp className="text-emerald-500 w-5 h-5 mb-1" />
                <span className="text-[10px] font-black text-emerald-600">+12%</span>
              </div>
            </div>
            <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">{card.label}</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-900 tracking-tight">{card.value.toLocaleString()}</span>
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-12">
               <h3 className="text-2xl font-black text-slate-800 flex items-center gap-4">
                <Zap className="w-8 h-8 text-indigo-600" /> Biological Trends
               </h3>
               <div className="flex gap-2">
                 <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900"><TrendingUp className="w-4 h-4" /></button>
               </div>
             </div>
             <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics}>
                  <defs>
                    <linearGradient id="colorWalkSync" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 900}} dy={15} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px'}} 
                    itemStyle={{fontWeight: '900', color: '#4f46e5'}}
                  />
                  <Area type="monotone" dataKey="walk" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorWalkSync)" animationDuration={2000} strokeLinecap="round" />
                </AreaChart>
              </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-white p-12 rounded-[3.5rem] border border-indigo-100 shadow-xl relative overflow-hidden group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 relative z-10">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-indigo-600 rounded-[2rem] text-white shadow-2xl shadow-indigo-300 transform group-hover:rotate-6 transition-transform">
                  <Brain className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Holistic AI Diagnostics</h3>
                  <p className="text-slate-500 text-base font-medium mt-1">Unified correlation across all synchronized health vectors.</p>
                </div>
              </div>
              <button 
                onClick={generateAIInsight}
                disabled={isAnalyzing}
                className="px-10 py-5 bg-indigo-600 text-white font-black rounded-3xl text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 disabled:opacity-50 flex items-center gap-3 active:scale-95"
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Analyze Biometrics
              </button>
            </div>

            {aiInsight ? (
              <div className="space-y-10 animate-slideUp relative z-10">
                <div className="p-8 bg-white rounded-[2.5rem] border border-indigo-100 shadow-lg relative">
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Clinical Holistic Summary
                  </h4>
                  <p className="text-slate-800 font-bold text-xl leading-relaxed italic pr-12">"{aiInsight.summary}"</p>
                  <div className="absolute top-8 right-8 text-indigo-100">
                    <Sparkles className="w-12 h-12" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Biological Patterns</h5>
                    {aiInsight.patterns.map((pattern: string, i: number) => (
                      <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                          <TrendingUp className="w-5 h-5 shrink-0" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 leading-snug">{pattern}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Prescriptive Wellness Tips</h5>
                    {aiInsight.tips.map((tip: string, i: number) => (
                      <div key={i} className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                          <CheckCircle2 className="w-5 h-5 shrink-0" />
                        </div>
                        <span className="text-sm font-bold text-emerald-900 leading-snug">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-slate-400 bg-white/50 rounded-[3rem] border-4 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 opacity-20" />
                </div>
                <h4 className="text-lg font-black text-slate-300 uppercase tracking-widest">Awaiting Metric Stream</h4>
                <p className="text-sm font-medium mt-2 max-w-xs mx-auto">Generate a comprehensive health report by analyzing your holistic biometric data.</p>
              </div>
            )}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
             <h3 className="text-2xl font-black text-slate-800 mb-8">Manual Telemetry</h3>
             <div className="space-y-8">
               <div className="group">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1 group-focus-within:text-indigo-600 transition-colors">Daily Steps Count</label>
                 <div className="relative">
                   <Footprints className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                   <input type="number" className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-black text-lg transition-all" value={input.walk} onChange={e => setInput({...input, walk: parseInt(e.target.value) || 0})} />
                 </div>
               </div>
               <div className="group">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1 group-focus-within:text-indigo-600 transition-colors">Running Distance (KM)</label>
                 <div className="relative">
                   <Play className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                   <input type="number" step="0.1" className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-black text-lg transition-all" value={input.run} onChange={e => setInput({...input, run: parseFloat(e.target.value) || 0})} />
                 </div>
               </div>
               <div className="group">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1 group-focus-within:text-indigo-600 transition-colors">Sleep Duration (HRS)</label>
                 <div className="relative">
                   <Moon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                   <input type="number" step="0.5" className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-black text-lg transition-all" value={input.sleep} onChange={e => setInput({...input, sleep: parseFloat(e.target.value) || 0})} />
                 </div>
               </div>
               <button onClick={addMetric} className="w-full py-6 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-3xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95">
                 <Plus className="w-6 h-6" /> Commit Entry (+10 XP)
               </button>
             </div>
          </div>
        </div>
      </div>

      {showConnectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp border border-white/20">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div className="flex items-center gap-4">
                  {connectionType === 'bluetooth' ? <Bluetooth className="w-8 h-8 text-indigo-600" /> : <Smartphone className="w-8 h-8 text-emerald-600" />}
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {connectionType === 'bluetooth' ? 'Sensor Chooser' : 'Ecosystem Link'}
                  </h3>
               </div>
               <button onClick={() => setShowConnectModal(false)} className="p-3 hover:bg-white rounded-full transition-all hover:rotate-90 active:scale-90"><X className="w-7 h-7" /></button>
            </div>

            <div className="p-10 space-y-8">
               {error && (
                 <div className="bg-rose-50 p-6 rounded-3xl flex items-start gap-4 border border-rose-100 animate-shake">
                    <AlertCircle className="w-7 h-7 text-rose-600 shrink-0" />
                    <p className="text-sm font-bold text-rose-900 leading-snug">{error}</p>
                 </div>
               )}

               <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100">
                  {isScanning ? (
                    <div className="text-center py-10">
                       <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-8 shadow-indigo-100" />
                       <p className="text-xl font-black text-slate-900 tracking-tight">Broadcasting Scan...</p>
                       <p className="text-[10px] text-slate-400 mt-3 font-black uppercase tracking-[0.3em]">Ensure visibility mode is enabled</p>
                    </div>
                  ) : foundDevices.length > 0 ? (
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center mb-8">Valid Targets Discovered</p>
                       {foundDevices.map((device, idx) => (
                         <button key={idx} onClick={() => connectDevice(device)} className="w-full p-6 bg-white rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-indigo-600 hover:shadow-2xl transition-all active:scale-[0.98]">
                            <div className="flex items-center gap-5">
                               <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner border border-slate-100"><Watch className="w-7 h-7" /></div>
                               <div className="text-left">
                                  <span className="font-black text-slate-800 text-base tracking-tight block">{device.name}</span>
                                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Signal: Excellent</span>
                               </div>
                            </div>
                            <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                         </button>
                       ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                       <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-slate-100"><Search className="w-12 h-12 text-slate-200" /></div>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Spectral Scan Idle</p>
                       <button onClick={connectionType === 'bluetooth' ? handleBluetoothScan : handleGoogleFitSearch} className="mt-10 px-12 py-5 bg-slate-950 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-95">Initiate Search</button>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTracker;
