
import React, { useState } from 'react';
import { Reminder } from '../types';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Pill, 
  Calendar, 
  Clock,
  Volume2,
  CalendarDays,
  Zap
} from 'lucide-react';

interface Props {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  onReminderSet: () => void;
}

const Reminders: React.FC<Props> = ({ reminders, setReminders, onReminderSet }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newHour, setNewHour] = useState('12');
  const [newMinute, setNewMinute] = useState('00');
  const [newAmPm, setNewAmPm] = useState('AM');
  const [newType, setNewType] = useState<'Medication' | 'Appointment' | 'General'>('General');

  const addReminder = () => {
    if (newTitle && newDate) {
      const timeStr = `${newHour}:${newMinute} ${newAmPm}`;
      const reminder: Reminder = {
        id: Date.now().toString(),
        title: newTitle,
        date: newDate,
        time: timeStr,
        type: newType,
        active: true
      };
      setReminders([...reminders, reminder]);
      onReminderSet();
      setNewTitle('');
    }
  };

  const setQuickTime = (hour: string, ampm: 'AM' | 'PM') => {
    setNewHour(hour.padStart(2, '0'));
    setNewMinute('00');
    setNewAmPm(ampm);
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const quickTimes: { h: string, label: string, ampm: 'AM' | 'PM' }[] = [
    { h: '8', label: '8 AM', ampm: 'AM' },
    { h: '10', label: '10 AM', ampm: 'AM' },
    { h: '12', label: '12 PM', ampm: 'PM' },
    { h: '2', label: '2 PM', ampm: 'PM' },
    { h: '4', label: '4 PM', ampm: 'PM' },
    { h: '6', label: '6 PM', ampm: 'PM' },
    { h: '8', label: '8 PM', ampm: 'PM' },
    { h: '10', label: '10 PM', ampm: 'PM' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900">Health Reminders</h2>
        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
           <Plus className="w-5 h-5 text-indigo-600" /> Create New Reminder
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Reminder Title</label>
            <input 
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="e.g., Vitamin D Supplement"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Select Date</label>
            <input 
              type="date"
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-100"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Category</label>
            <select 
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-100"
              value={newType}
              onChange={e => setNewType(e.target.value as any)}
            >
              <option value="Medication">Medication</option>
              <option value="Appointment">Appointment</option>
              <option value="General">General</option>
            </select>
          </div>
          
          <div className="lg:col-span-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Quick Select Time (2-hour intervals)</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {quickTimes.map((qt, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuickTime(qt.h, qt.ampm)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    newHour === qt.h.padStart(2, '0') && newAmPm === qt.ampm
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-200'
                  }`}
                >
                  {qt.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 text-center">Hour</label>
                 <select 
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-100 text-center"
                  value={newHour}
                  onChange={e => setNewHour(e.target.value)}
                 >
                   {hours.map(h => <option key={h} value={h}>{h}</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 text-center">Minute</label>
                 <select 
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-100 text-center"
                  value={newMinute}
                  onChange={e => setNewMinute(e.target.value)}
                 >
                   {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 text-center">AM/PM</label>
                 <select 
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-100 text-center"
                  value={newAmPm}
                  onChange={e => setNewAmPm(e.target.value)}
                 >
                   <option value="AM">AM</option>
                   <option value="PM">PM</option>
                 </select>
               </div>
            </div>
          </div>
        </div>
        <button
          onClick={addReminder}
          className="mt-8 w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
        >
           <Bell className="w-5 h-5" /> Set Smart Alarm
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">Scheduled Notifications</h3>
        {reminders.length === 0 ? (
          <div className="p-12 text-center bg-slate-100/50 rounded-[2rem] border border-dashed border-slate-200 text-slate-400">
            <Volume2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">No reminders scheduled yet</p>
          </div>
        ) : (
          reminders.map(reminder => (
            <div 
              key={reminder.id}
              className={`p-6 bg-white rounded-3xl border transition-all flex items-center justify-between group ${reminder.active ? 'border-indigo-100' : 'opacity-60 grayscale border-slate-200'}`}
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl ${
                  reminder.type === 'Medication' ? 'bg-rose-50 text-rose-600' :
                  reminder.type === 'Appointment' ? 'bg-indigo-50 text-indigo-600' :
                  'bg-slate-50 text-slate-600'
                }`}>
                  {reminder.type === 'Medication' ? <Pill className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800">{reminder.title}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                      <CalendarDays className="w-4 h-4" /> {reminder.date}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                      <Clock className="w-4 h-4" /> {reminder.time}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-100 rounded text-slate-500">
                      {reminder.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => toggleReminder(reminder.id)}
                  className={`p-3 rounded-xl transition-colors ${reminder.active ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}
                >
                  <Bell className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => deleteReminder(reminder.id)}
                  className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reminders;
