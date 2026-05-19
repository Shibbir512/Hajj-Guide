import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, ChevronLeft, ChevronRight, HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';
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
  const [expandedId, setExpandedId] = useState<number | null>(0);
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
    setExpandedId(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-24 relative z-20">
      <div className="mb-10 border-b border-gray-200 dark:border-white/10 pb-8 flex items-start gap-4">
        <div className="bg-[#fcfaf2] dark:bg-[#c9a227]/10 p-3 md:p-4 rounded-full flex-shrink-0 mt-1">
          <HelpCircle className="w-8 h-8 text-[#c9a227]" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 dark:text-white mb-2">
            প্রশ্নোত্তর
          </h1>
          <p className="text-gray-500 dark:text-white/60 font-serif md:text-lg">
            জীবনঘনিষ্ঠ বিভিন্ন জিজ্ঞাসা ও তার শরয়ী সমাধান
          </p>
        </div>
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
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); setExpandedId(0); }}
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
          <div key={index} className="bg-white dark:bg-[#0c0c0c] border border-[#c9a227] rounded-xl overflow-hidden shadow-sm">
            
            {/* Question Section */}
            <div 
              className="p-6 md:p-8 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#111] transition-colors"
              onClick={() => setExpandedId(expandedId === index ? null : index)}
            >
              <div className="flex items-start gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#fcfaf2] dark:bg-[#c9a227]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#c9a227] font-serif text-lg md:text-xl font-medium">প্র</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 px-3 py-1 text-xs md:text-sm rounded-md">
                      {fatwa.Subcategory !== 'Unknown' && fatwa.Subcategory !== 'All' ? fatwa.Subcategory : fatwa.Category}
                    </span>
                    {expandedId === index ? (
                      <ChevronUp className="text-[#c9a227] w-5 h-5 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="text-[#c9a227] w-5 h-5 flex-shrink-0" />
                    )}
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-serif text-gray-900 dark:text-white leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: fatwa.Question }} />
                </div>
              </div>
            </div>

            {/* Answer Section */}
            {expandedId === index && (
              <div className="border-t border-gray-100 dark:border-white/5 p-6 md:p-8 pt-6 bg-white dark:bg-[#0c0c0c]">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-gray-500 dark:text-white/50 font-serif text-lg md:text-xl">উ</span>
                  </div>
                  
                  <div className="flex-1">
                    <div 
                      className="text-gray-700 dark:text-[#f2f2f2]/80 text-[15px] md:text-base leading-relaxed mb-6"
                      dangerouslySetInnerHTML={{ __html: fatwa.Answer }}
                    />
                    
                    <div className="border-t border-dashed border-gray-200 dark:border-white/10 pt-4 flex justify-end">
                      <a href={fatwa.Link} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-[#c9a227] dark:text-white/40 dark:hover:text-[#c9a227] transition-colors">
                        সূত্র: মাসিক আলকাউসার
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
          <button onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); setExpandedId(0); }} disabled={currentPage === 1} className="p-3 border border-black/10 dark:border-white/10 rounded-full hover:border-[#c9a227] dark:hover:border-[#c9a227] disabled:opacity-30 transition-colors text-gray-900 dark:text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-white/60">পেজ {currentPage} / {totalPages}</span>
          <button onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); setExpandedId(0); }} disabled={currentPage === totalPages} className="p-3 border border-black/10 dark:border-white/10 rounded-full hover:border-[#c9a227] dark:hover:border-[#c9a227] disabled:opacity-30 transition-colors text-gray-900 dark:text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
