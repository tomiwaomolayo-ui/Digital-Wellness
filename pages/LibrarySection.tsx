import React, { useState, useMemo } from 'react';
import { Article } from '../types';
import { BookOpen, Search, Bookmark, ArrowUpRight, X } from 'lucide-react';

interface Props {
  articles: Article[];
  libraryIds: string[];
}

const LibrarySection: React.FC<Props> = ({ articles, libraryIds }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const savedArticles = useMemo(() => {
    return articles
      .filter(a => libraryIds.includes(a.id))
      .filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [articles, libraryIds, searchQuery]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Health Vault</h2>
          <p className="text-slate-500 font-medium mt-1">Saved therapeutic resources and nutritional guides.</p>
        </div>
        <div className="relative group w-full md:w-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            className="w-full md:w-96 pl-14 pr-12 py-4 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all shadow-sm"
            placeholder="Search saved clinical guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
             <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600">
               <X className="w-4 h-4" />
             </button>
          )}
        </div>
      </div>

      {savedArticles.length === 0 ? (
        <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-6">
            <BookOpen className="w-12 h-12" />
          </div>
          <div className="max-w-xs mx-auto">
            <h3 className="text-2xl font-black text-slate-800">
              {searchQuery ? 'Resource not found' : 'Empty Vault'}
            </h3>
            <p className="text-slate-500 font-medium mt-3 leading-relaxed">
              {searchQuery ? 'Adjust your search query to find your saved clinical materials.' : 'Discover and save learning resources from the Mental Health and Diet sections.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedArticles.map(article => (
            <div key={article.id} className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
              <div className="h-56 overflow-hidden relative">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-6 right-6">
                  <div className="p-3 bg-white/95 backdrop-blur rounded-2xl text-indigo-600 shadow-xl">
                    <Bookmark className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 px-4 py-1.5 rounded-full shadow-lg">{article.category}</span>
                </div>
              </div>
              <div className="p-10 flex-1 flex flex-col">
                <h4 className="text-2xl font-black text-slate-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors">{article.title}</h4>
                <p className="text-slate-500 text-sm font-medium line-clamp-3 leading-relaxed mb-8 flex-1">{article.content}</p>
                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PUBLISHED</span>
                    <span className="text-xs font-bold text-slate-700">{article.date}</span>
                  </div>
                  <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg hover:translate-x-1">
                    Study Now <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibrarySection;