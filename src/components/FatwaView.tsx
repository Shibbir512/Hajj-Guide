import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import fatwasData from '../data/fatwas_data.json';

interface Fatwa {
  Year: number;
  Month: string;
  Question: string;
  Answer: string;
  Category: string;
  Subcategory: string;
  Link: string;
}

export const FatwaView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fatwas = fatwasData as Fatwa[];

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(fatwas.map(f => f.Category));
    return ['All', ...Array.from(cats)];
  }, [fatwas]);

  // Get unique subcategories based on selected category
  const subcategories = useMemo(() => {
    if (selectedCategory === 'All') return ['All'];
    const subcats = new Set(fatwas.filter(f => f.Category === selectedCategory).map(f => f.Subcategory));
    return ['All', ...Array.from(subcats)];
  }, [selectedCategory, fatwas]);

  // Filtered data
  const filteredFatwas = useMemo(() => {
    return fatwas.filter(fatwa => {
      const matchesSearch = fatwa.Question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            fatwa.Answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'All' || fatwa.Category === selectedCategory;
      const matchesSubCat = selectedSubcategory === 'All' || fatwa.Subcategory === selectedSubcategory;
      
      return matchesSearch && matchesCat && matchesSubCat;
    });
  }, [searchTerm, selectedCategory, selectedSubcategory, fatwas]);

  // Pagination
  const totalPages = Math.ceil(filteredFatwas.length / itemsPerPage);
  const currentFatwas = filteredFatwas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory('All');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-24 relative z-20">
      <div className="mb-12">
        <h2 className="text-[#c9a227] font-serif italic text-xl md:text-2xl mb-4 flex items-center gap-3">
          <BookOpen className="w-6 h-6" />
          ইসলামী ফতোয়া ও মাসআলা
        </h2>
        <h1 className="text-3xl md:text-5xl font-serif leading-tight text-gray-900 dark:text-white mb-6">
          যেকোনো বিষয়ে <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-white/40 italic">সঠিক সমাধান খুঁজুন</span>
        </h1>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 p-6 mb-10 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ফতোয়া খুঁজুন... (যেমন: নামায, ওযু)" 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 focus:border-[#c9a227] dark:focus:border-[#c9a227] outline-none text-gray-900 dark:text-white transition-colors"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c9a227] w-4 h-4" />
            <select 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 focus:border-[#c9a227] outline-none text-gray-900 dark:text-white appearance-none cursor-pointer"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'সব ক্যাটাগরি' : cat}</option>)}
            </select>
          </div>

          {selectedCategory !== 'All' && (
            <div className="relative w-full md:w-48">
              <select 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 focus:border-[#c9a227] outline-none text-gray-900 dark:text-white appearance-none cursor-pointer"
                value={selectedSubcategory}
                onChange={(e) => { setSelectedSubcategory(e.target.value); setCurrentPage(1); }}
              >
                {subcategories.map(sub => <option key={sub} value={sub}>{sub === 'All' ? 'সব সাব-ক্যাটাগরি' : sub}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 text-sm text-gray-500 dark:text-white/50 font-bold uppercase tracking-widest">
        সর্বমোট {filteredFatwas.length} টি ফতোয়া পাওয়া গেছে
      </div>

      {/* Fatwa Cards */}
      <div className="space-y-6">
        {currentFatwas.map((fatwa, index) => (
          <div key={index} className="bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 p-6 md:p-8 group hover:border-[#c9a227]/50 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#c9a227] opacity-0 group-hover:opacity-20 transition-opacity"></div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block border border-[#c9a227]/40 text-[#c9a227] px-3 py-1 text-[10px] tracking-widest font-bold whitespace-nowrap bg-[#c9a227]/5">
                {fatwa.Category}
              </span>
              <span className="inline-block border border-gray-300 dark:border-white/20 text-gray-600 dark:text-white/60 px-3 py-1 text-[10px] tracking-widest font-bold whitespace-nowrap">
                {fatwa.Subcategory}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-serif text-gray-900 dark:text-white mb-6 leading-relaxed flex items-start gap-3">
              <MessageCircle className="w-6 h-6 text-[#c9a227] flex-shrink-0 mt-1" />
              <span dangerouslySetInnerHTML={{ __html: fatwa.Question }} />
            </h3>
            
            <div className="bg-slate-50 dark:bg-[#1a1a1a] p-6 md:p-8 border-l-2 border-[#c9a227]">
              <span className="text-[10px] font-bold text-[#c9a227] uppercase tracking-widest mb-4 block">উত্তর</span>
              <div 
                className="text-gray-700 dark:text-[#f2f2f2]/80 text-[15px] md:text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: fatwa.Answer }}
              />
            </div>
            
            <div className="mt-6 flex justify-end">
               <a href={fatwa.Link} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-[#c9a227] dark:text-white/40 dark:hover:text-[#c9a227] transition-colors">
                 উৎস দেখুন →
               </a>
            </div>
          </div>
        ))}
        
        {currentFatwas.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10">
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-gray-500 dark:text-white/50">কোনো ফতোয়া পাওয়া যায়নি</h3>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3 border border-black/10 dark:border-white/10 rounded-full hover:border-[#c9a227] dark:hover:border-[#c9a227] disabled:opacity-30 transition-colors text-gray-900 dark:text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-white/60">পেজ {currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-3 border border-black/10 dark:border-white/10 rounded-full hover:border-[#c9a227] dark:hover:border-[#c9a227] disabled:opacity-30 transition-colors text-gray-900 dark:text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
