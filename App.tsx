import React, { useState, useEffect } from 'react';
import { UserProfile, View, Article, Reminder, HealthMetrics, WeightRecord, ChatMessage, MentalHealthResult, DietAnalysisResult } from './types';
import { NAV_ITEMS, MOCK_ARTICLES, AVAILABLE_BADGES } from './constants';
import Registration from './components/Registration';
import MentalHealth from './pages/MentalHealth';
import DietSection from './pages/DietSection';
import Guidance from './pages/Guidance';
import HealthTracker from './pages/HealthTracker';
import WeightManagement from './pages/WeightManagement';
import Reminders from './pages/Reminders';
import AdminSection from './pages/AdminSection';
import LibrarySection from './pages/LibrarySection';
import Achievements from './pages/Achievements';
import AIInsights from './pages/AIInsights';
import { 
  Menu, 
  X, 
  UserCircle, 
  ShieldCheck, 
  LogOut,
  Settings,
  Trophy,
  Zap,
  BellRing
} from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('vitality_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [view, setView] = useState<View>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [myLibrary, setMyLibrary] = useState<string[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isAlarmActive, setIsAlarmActive] = useState<string | null>(null);

  // Persistent search/session state across views
  const [latestMental, setLatestMental] = useState<MentalHealthResult | null>(null);
  const [latestDiet, setLatestDiet] = useState<DietAnalysisResult | null>(null);
  const [dietLogs, setDietLogs] = useState<any[]>([]);
  const [healthLogs, setHealthLogs] = useState<HealthMetrics[]>([]);
  const [weightLogs, setWeightLogs] = useState<WeightRecord[]>(() => {
    const saved = localStorage.getItem('vitality_weight');
    return saved ? JSON.parse(saved) : [];
  });
  const [allMessages, setAllMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('vitality_chats');
    return saved ? JSON.parse(saved) : [];
  });

  // Audio for beeping
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      setTimeout(() => oscillator.stop(), 500);
    } catch (e) {
      console.warn("Audio beep failed: ", e);
    }
  };

  // Background check for Reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12;
      const currentTimeStr = `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      const currentDateStr = now.toISOString().split('T')[0];

      setReminders(prev => {
        let changed = false;
        const next = prev.map(r => {
          if (r.active && r.date === currentDateStr && r.time === currentTimeStr && !r.isTriggered) {
            setIsAlarmActive(r.title);
            playBeep();
            changed = true;
            return { ...r, isTriggered: true };
          }
          return r;
        });
        return changed ? next : prev;
      });
    }, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('vitality_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vitality_weight', JSON.stringify(weightLogs));
  }, [weightLogs]);

  useEffect(() => {
    localStorage.setItem('vitality_chats', JSON.stringify(allMessages));
  }, [allMessages]);

  const addPoints = (amount: number) => {
    if (!user) return;
    const newPoints = user.points + amount;
    const newLevel = Math.floor(newPoints / 500) + 1;
    setUser({ ...user, points: newPoints, level: newLevel });
  };

  const handleRegister = (profile: UserProfile) => {
    setUser({ ...profile, points: 0, badges: [], level: 1 });
    setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vitality_user');
    localStorage.removeItem('vitality_weight');
    localStorage.removeItem('vitality_chats');
  };

  const addToLibrary = (id: string) => {
    if (!myLibrary.includes(id)) {
      setMyLibrary([...myLibrary, id]);
      addPoints(10);
    }
  };

  const sendMessage = (text: string, sender: 'user' | 'practitioner', userId: string) => {
    const newMessage: ChatMessage = { id: Date.now().toString(), sender, text, timestamp: Date.now(), userId };
    setAllMessages(prev => [...prev, newMessage]);
  };

  if (!user) {
    return <Registration onRegister={handleRegister} />;
  }

  const renderContent = () => {
    switch (view) {
      case 'mental': 
        return <MentalHealth 
          articles={articles.filter(a => a.category === 'Mental Health')} 
          onAddToLibrary={addToLibrary} 
          onAnalyze={(res) => {
            setLatestMental(res);
            addPoints(50);
          }}
          onActivityComplete={() => addPoints(20)}
          onNavigate={setView}
          user={user}
          messages={allMessages.filter(m => m.userId === user.email)}
          onSendMessage={(txt) => sendMessage(txt, 'user', user.email)}
          persistentResult={latestMental}
        />;
      case 'diet': 
        return <DietSection 
          articles={articles.filter(a => a.category === 'Diet')} 
          onAddToLibrary={addToLibrary} 
          onLog={(res) => {
            setLatestDiet(res);
            setDietLogs(prev => [res, ...prev]);
            addPoints(15);
          }}
          persistentAnalysis={latestDiet}
        />;
      case 'weight':
        return <WeightManagement 
          user={user}
          updateTargetWeight={(w) => setUser({...user, targetWeight: w})}
          logs={weightLogs}
          onLog={(record) => {
            setWeightLogs(prev => [...prev, record]);
            addPoints(20);
          }}
        />;
      case 'guidance': 
        return <Guidance onGoalSet={() => addPoints(30)} />;
      case 'tracker': 
        return <HealthTracker 
          onMetricAdd={(metric) => {
            setHealthLogs(prev => [metric, ...prev]);
            addPoints(10);
          }}
        />;
      case 'reminders': 
        return <Reminders 
          reminders={reminders} 
          setReminders={setReminders} 
          onReminderSet={() => addPoints(5)} 
        />;
      case 'library': return <LibrarySection articles={articles} libraryIds={myLibrary} />;
      case 'insights': 
        return <AIInsights 
          mentalStatus={latestMental}
          dietLogs={dietLogs}
          exerciseLogs={healthLogs}
          weightLogs={weightLogs}
        />;
      case 'achievements': 
        return <Achievements user={user} availableBadges={AVAILABLE_BADGES} />;
      case 'admin': 
        return <AdminSection 
          onAddArticle={(a) => setArticles([a, ...articles])} 
          allMessages={allMessages}
          onReply={(userId, txt) => sendMessage(txt, 'practitioner', userId)}
        />;
      default: return (
        <div className="space-y-8 animate-fadeIn">
          {isAlarmActive && (
            <div className="bg-rose-600 text-white p-6 rounded-3xl flex items-center justify-between shadow-2xl animate-pulse">
              <div className="flex items-center gap-3">
                <BellRing className="w-8 h-8" />
                <div>
                  <h4 className="font-black text-xl">Alert!</h4>
                  <p className="font-medium">{isAlarmActive}</p>
                </div>
              </div>
              <button onClick={() => setIsAlarmActive(null)} className="px-6 py-2 bg-white text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition-colors">Dismiss</button>
            </div>
          )}
          <header className="py-12 px-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-500 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase flex items-center gap-2">
                  Level {user.level}
                </span>
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase flex items-center gap-2">
                  {user.points} Points
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-4">Hi, {user.name.split(' ')[0]}</h1>
              <p className="text-blue-100 text-lg max-w-2xl font-medium">Your current goals: {user.goals.join(', ')}</p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="w-64 h-64" />
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as View)}
                className="group p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col items-start gap-4"
              >
                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{item.label}</h3>
                  <p className="text-slate-400 text-sm mt-1">Smart tracking & AI support.</p>
                </div>
              </button>
            ))}
          </section>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="md:hidden glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <h2 className="font-bold text-xl text-indigo-600">VitalityPulse</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-8">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              VitalityPulse
            </h1>
          </div>

          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            <button
              onClick={() => { setView('home'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${view === 'home' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <UserCircle className="w-5 h-5" /> Home
            </button>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { setView(item.id as View); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${view === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
             <button
              onClick={() => { setView('admin'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-2 ${view === 'admin' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Settings className="w-5 h-5" /> Admin Console
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;