import React, { useState, useMemo } from 'react';
import { Article, ChatMessage } from '../types';
import { suggestAdminResources, practitionerResearch } from '../services/geminiService';
import { 
  Layout, 
  Upload, 
  CheckCircle,
  Image as ImageIcon,
  MessageSquare,
  UserCheck,
  Search,
  Send,
  UserCircle,
  FileUp,
  Sparkles,
  Loader2,
  BookOpen,
  BrainCircuit,
  Settings2,
  Lock,
  SearchCode
} from 'lucide-react';

interface Props {
  onAddArticle: (article: Article) => void;
  allMessages: ChatMessage[];
  onReply: (userId: string, text: string) => void;
}

const AdminSection: React.FC<Props> = ({ onAddArticle, allMessages, onReply }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'chat'>('content');
  const [isPractitionerLoggedIn, setIsPractitionerLoggedIn] = useState(false);
  const [practitionerKey, setPractitionerKey] = useState('');
  
  const [formData, setFormData] = useState({
    title: '', content: '', category: 'Mental Health' as Article['category'], author: '', imageUrl: '', file: null as File | null
  });
  const [success, setSuccess] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Practitioner Search Tool
  const [researchQuery, setResearchQuery] = useState('');
  const [researchResult, setResearchResult] = useState<any>(null);
  const [loadingResearch, setLoadingResearch] = useState(false);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');

  const chatUsers = useMemo(() => {
    const users = new Map<string, ChatMessage>();
    allMessages.forEach(m => {
      const existing = users.get(m.userId);
      if (!existing || m.timestamp > existing.timestamp) users.set(m.userId, m);
    });
    return Array.from(users.values()).sort((a, b) => b.timestamp - a.timestamp);
  }, [allMessages]);

  const activeMessages = useMemo(() => allMessages.filter(m => m.userId === selectedUser), [allMessages, selectedUser]);

  const fetchAISuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await suggestAdminResources(formData.category);
      setAiSuggestions(res);
    } catch (e) { console.error(e); } finally { setLoadingSuggestions(false); }
  };

  const publishSuggested = (suggested: any) => {
    const newArt: Article = {
      id: Date.now().toString(),
      title: suggested.title,
      content: suggested.content,
      category: formData.category,
      author: suggested.author,
      date: new Date().toISOString().split('T')[0],
      imageUrl: `https://picsum.photos/seed/${Math.random()}/800/400`
    };
    onAddArticle(newArt);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleResearch = async () => {
    if (!researchQuery.trim()) return;
    setLoadingResearch(true);
    try {
      const res = await practitionerResearch(researchQuery);
      setResearchResult(res);
    } catch (e) { console.error(e); } finally { setLoadingResearch(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newArticle: Article = {
      id: Date.now().toString(),
      ...formData,
      date: new Date().toISOString().split('T')[0],
      imageUrl: formData.imageUrl || `https://picsum.photos/seed/${Math.random()}/800/400`,
      fileUrl: formData.file ? URL.createObjectURL(formData.file) : undefined
    };
    onAddArticle(newArticle);
    setSuccess(true);
    setFormData({ title: '', content: '', category: 'Mental Health', author: '', imageUrl: '', file: null });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-lg"><Settings2 className="w-8 h-8" /></div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Admin Console</h2>
            <p className="text-slate-500 font-medium">Global resource management and clinical research portal.</p>
          </div>
        </div>
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200">
          <button onClick={() => setActiveTab('content')} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-white text-slate-900 shadow-md border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}>Content Hub</button>
          <button onClick={() => setActiveTab('chat')} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Practitioner Portal</button>
        </div>
      </div>

      {activeTab === 'content' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {success && <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-emerald-800 flex items-center gap-3 animate-slideUp font-bold"><CheckCircle className="w-5 h-5" /> Learning Resource Published!</div>}
            
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Resource Headline</label>
                  <input required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold text-slate-800" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Resource Category</label>
                  <select className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Diet">Diet & Nutrition</option>
                    <option value="General">General Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Author / Source</label>
                  <input required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                </div>
              </div>

              <div>
                 <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Learning Document (PDF/Docx)</label>
                 <div className="relative border-4 border-dashed border-slate-50 rounded-[2rem] p-10 text-center hover:bg-slate-50 transition-all cursor-pointer group">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFormData({...formData, file: e.target.files?.[0] || null})} />
                    <FileUp className="w-12 h-12 text-slate-300 mx-auto mb-4 group-hover:text-indigo-400 group-hover:-translate-y-1 transition-all" />
                    <p className="text-sm font-bold text-slate-600 mb-1">{formData.file ? formData.file.name : 'Drag and drop or click to upload learning materials'}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Max file size: 20MB</p>
                 </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Article Body</label>
                <textarea required rows={8} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-100 leading-relaxed text-slate-700" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
              </div>

              <button type="submit" className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-3">
                <Upload className="w-6 h-6" /> Deploy Learning Resource
              </button>
            </form>
          </div>

          <aside className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-fit">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><Sparkles className="w-6 h-6 text-amber-500" /> AI Suggestions Hub</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">The AI engine can generate high-quality learning resources ready for immediate publishing across all sections.</p>
            <button onClick={fetchAISuggestions} disabled={loadingSuggestions} className="w-full py-4 bg-amber-50 text-amber-700 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-amber-100 disabled:opacity-50 transition-all mb-8 border border-amber-200">
              {loadingSuggestions ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Scan AI Library for Assets'}
            </button>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {aiSuggestions.map((s, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group">
                  <h4 className="font-bold text-slate-900 mb-2 leading-tight">{s.title}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-3 mb-4 font-medium leading-relaxed">{s.content}</p>
                  <button onClick={() => publishSuggested(s)} className="w-full py-2.5 bg-white border border-slate-200 text-[10px] font-black text-indigo-600 uppercase tracking-widest rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">Review & Publish</button>
                </div>
              ))}
            </div>
          </aside>
        </div>
      ) : (
        <div className="space-y-8 animate-fadeIn">
          {!isPractitionerLoggedIn ? (
            <div className="max-w-md mx-auto bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-8 shadow-inner"><Lock className="w-10 h-10" /></div>
              <h3 className="text-2xl font-black text-slate-900">Clinical Authorization</h3>
              <p className="text-sm text-slate-500 mt-2 mb-10 font-medium leading-relaxed">Access the practitioner-exclusive research tool and patient inbox. (Use Key: admin123)</p>
              <form onSubmit={e => { e.preventDefault(); if (practitionerKey === 'admin123') setIsPractitionerLoggedIn(true); }} className="space-y-4">
                <input type="password" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-center text-xl tracking-[0.5em] outline-none focus:ring-4 focus:ring-indigo-100" placeholder="••••••••" value={practitionerKey} onChange={e => setPractitionerKey(e.target.value)} />
                <button className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Authenticate Portal</button>
              </form>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[750px]">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                   <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none" placeholder="Search interactions..." />
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {chatUsers.length > 0 ? chatUsers.map(user => (
                    <button key={user.userId} onClick={() => setSelectedUser(user.userId)} className={`w-full p-6 text-left border-b border-slate-50 transition-all ${selectedUser === user.userId ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-slate-50'}`}>
                      <h4 className="font-black text-slate-900 truncate mb-1">{user.userId}</h4>
                      <p className="text-xs text-slate-500 truncate font-medium">{user.text}</p>
                    </button>
                  )) : (
                    <div className="py-20 text-center opacity-30 italic text-sm">No active interactions</div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8 flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar">
                 <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl p-10 relative overflow-hidden shrink-0">
                    <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3 relative z-10"><BrainCircuit className="w-8 h-8 text-indigo-400" /> AI Clinical Learning Box</h3>
                    <p className="text-indigo-200/70 text-sm mb-8 relative z-10 max-w-xl leading-relaxed">The practitioner tool provides rapid access to clinical advice, treatment methodologies, and research-backed therapeutic tools.</p>
                    <div className="flex gap-4 mb-8 relative z-10">
                       <input 
                         className="flex-1 p-5 bg-white/10 border border-white/20 rounded-2xl text-white outline-none focus:ring-4 focus:ring-indigo-500/30 font-medium" 
                         placeholder="Inquiry treatment tools, advice..." 
                         value={researchQuery} onChange={e => setResearchQuery(e.target.value)}
                         onKeyPress={e => e.key === 'Enter' && handleResearch()}
                       />
                       <button onClick={handleResearch} disabled={loadingResearch} className="p-5 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-900/50 hover:bg-indigo-500 transition-all">
                          {loadingResearch ? <Loader2 className="animate-spin w-6 h-6" /> : <SearchCode className="w-6 h-6" />}
                       </button>
                    </div>
                    {researchResult && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp relative z-10">
                         <div className="p-6 bg-white/5 backdrop-blur rounded-3xl border border-white/10">
                            <h4 className="font-black text-[10px] text-indigo-400 uppercase tracking-widest mb-4">Therapeutic Methodology</h4>
                            <ul className="text-xs space-y-3 text-indigo-50">{researchResult.tools.map((t:any,i:number)=><li key={i} className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" /> {t}</li>)}</ul>
                         </div>
                         <div className="p-6 bg-white/5 backdrop-blur rounded-3xl border border-white/10">
                            <h4 className="font-black text-[10px] text-indigo-400 uppercase tracking-widest mb-4">Practitioner Guidance</h4>
                            <p className="text-xs text-white/80 leading-relaxed font-medium">{researchResult.advice}</p>
                         </div>
                      </div>
                    )}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                 </div>

                 {selectedUser && (
                   <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col flex-1 max-h-[400px]">
                      <div className="p-6 border-b border-slate-100 font-black text-slate-800 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><UserCircle className="w-6 h-6" /></div>
                            <span className="text-sm">Inquiry from: {selectedUser}</span>
                         </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-slate-50/50">
                        {activeMessages.map(m => (
                          <div key={m.id} className={`flex ${m.sender === 'practitioner' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-4 rounded-2xl text-sm font-medium max-w-[80%] ${m.sender === 'practitioner' ? 'bg-slate-900 text-white shadow-lg rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-none'}`}>{m.text}</div>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 border-t border-slate-100 flex gap-4 bg-white">
                        <input className="flex-1 bg-slate-50 p-4 border border-slate-100 rounded-2xl outline-none font-medium" placeholder="Clinical consultation response..." value={replyInput} onChange={e => setReplyInput(e.target.value)} />
                        <button onClick={() => { onReply(selectedUser, replyInput); setReplyInput(''); }} className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"><Send className="w-6 h-6" /></button>
                      </div>
                   </div>
                 )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSection;