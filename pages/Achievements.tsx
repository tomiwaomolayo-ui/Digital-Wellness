
import React from 'react';
import { UserProfile, Badge } from '../types';
import { Trophy, Star, Target, Users, Crown, Medal } from 'lucide-react';

interface Props {
  user: UserProfile;
  availableBadges: Badge[];
}

const Achievements: React.FC<Props> = ({ user, availableBadges }) => {
  const MOCK_LEADERBOARD = [
    { name: 'Alice W.', points: 4500, avatar: '👤' },
    { name: 'You', points: user.points, avatar: '✨', isCurrent: true },
    { name: 'Robert K.', points: 3900, avatar: '👤' },
    { name: 'Sarah M.', points: 3200, avatar: '👤' },
    { name: 'Mike D.', points: 2800, avatar: '👤' },
  ].sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900">Wellness Hall of Fame</h2>
          <p className="text-slate-500">Track your milestones and compete for the top spot.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
           <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
             <Trophy className="w-6 h-6" />
           </div>
           <div>
             <p className="text-xs font-black text-slate-400 uppercase">Global Rank</p>
             <p className="text-xl font-black text-slate-800">#42nd</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-500" /> Your Badge Collection
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {availableBadges.map(badge => {
                const isEarned = user.badges.includes(badge.id);
                return (
                  <div 
                    key={badge.id} 
                    className={`p-6 rounded-[2rem] border text-center transition-all flex flex-col items-center gap-4 ${
                      isEarned 
                      ? 'bg-white border-indigo-100 shadow-md scale-105' 
                      : 'bg-slate-50 border-slate-100 opacity-40 grayscale'
                    }`}
                  >
                    <div className="text-4xl">{badge.icon}</div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{badge.name}</h4>
                      {isEarned && <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mt-1 block">EARNED</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-600" /> Lifetime Milestones
            </h3>
            <div className="space-y-8">
              {[
                { label: 'Total Healthy Meals', current: 12, target: 50, color: 'bg-emerald-500' },
                { label: 'Wellness Quizzes', current: 4, target: 10, color: 'bg-indigo-500' },
                { label: 'Exercise Hours', current: 28, target: 100, color: 'bg-orange-500' },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-700">{m.label}</span>
                    <span className="text-slate-400">{m.current} / {m.target}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} transition-all duration-1000`} style={{ width: `${(m.current / m.target) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
             <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
               <Crown className="w-6 h-6 text-amber-500" /> Leaderboard
             </h3>
             <div className="space-y-4">
               {MOCK_LEADERBOARD.map((entry, i) => (
                 <div 
                   key={i} 
                   className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                     entry.isCurrent ? 'bg-indigo-600 scale-105 shadow-lg' : 'hover:bg-white/5'
                   }`}
                 >
                   <div className="flex items-center gap-4">
                     <span className="w-6 text-center font-black text-white/40">{i + 1}</span>
                     <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-xl">{entry.avatar}</div>
                     <div>
                       <p className="font-bold text-sm">{entry.name}</p>
                       <p className="text-[10px] opacity-60 uppercase font-black tracking-widest">{entry.points} XP</p>
                     </div>
                   </div>
                   {i === 0 && <Medal className="w-5 h-5 text-amber-500" />}
                 </div>
               ))}
             </div>
             <button className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
               View Full Standings
             </button>
           </div>

           <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 text-center">
              <h4 className="font-bold text-indigo-900 mb-2">Invite Friends</h4>
              <p className="text-sm text-indigo-700 mb-6">Earn 100 XP for every friend who joins VitalityPulse.</p>
              <button className="w-full py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-sm border border-indigo-100">
                Share Referral Link
              </button>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default Achievements;
