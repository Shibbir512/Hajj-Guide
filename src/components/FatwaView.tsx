import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, BookOpen, ChevronLeft, ChevronRight, HelpCircle, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';

interface Fatwa {
  Year: number;
  Month: string | number;
  Question: string;
  Answer: string;
  Category: string;
  Subcategory: string;
  Link: string;
}

export const FatwaView: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(0);
  const [isPending, startTransition] = React.useTransition();
  const itemsPerPage = 10;

  const [fatwas, setFatwas] = useState<Fatwa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import('../data/fatwas_data.json')
      .then((m) => {
        setFatwas(m.default as Fatwa[]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load fatwas data:', err);
        setIsLoading(false);
      });
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(fatwas.filter(f => f.Category).map(f => f.Category));
    return ['All', ...Array.from(cats)];
  }, [fatwas]);

  // Get unique subcategories based on selected category
  const subcategories = useMemo(() => {
    if (selectedCategory === 'All') return ['All'];
    const subcats = new Set(
      fatwas.filter(f => f.Category === selectedCategory && f.Subcategory).map(f => f.Subcategory)
    );
    return ['All', ...Array.from(subcats)];
  }, [selectedCategory, fatwas]);

  // Filtered data
  const filteredFatwas = useMemo(() => {
    let baseResults: (Fatwa & { searchScore?: number })[] = fatwas;
    const searchLower = searchTerm.trim().toLowerCase();

    if (searchLower) {
      const BENGALI_STOP_WORDS = new Set([
        'কি', 'কী', 'হলে', 'সময়', 'করা', 'যাবে', 'করলে', 'হয়', 'হবে', 'না', 'এবং', 'ও', 
        'জন্য', 'থেকে', 'তে', 'দিয়ে', 'করে', 'বা', 'কোন', 'কোনো', 'পর', 'মধ্যে', 'থাকে', 
        'যদি', 'তবে', 'একটি', 'এই', 'সেই', 'তার', 'কাছে', 'সে', 'তারা', 'তিনি', 'সব', 
        'সবাই', 'করার', 'করেছেন', 'বলছেন', 'বলা', 'হল', 'হলো', 'ছিল', 'ছিলো', 'গেল', 
        'গেলে', 'মাধ্যমে', 'বিষয়ে', 'ব্যাপারে', 'সাথে', 'সঙ্গে', 'উচিত', 'নিয়ম', 'বিধান'
      ]);

      // Remove punctuation from the search string for matching
      const cleanedSearchTerm = searchLower.replace(/[?!,;।\-\.]/g, ' ').replace(/\s+/g, ' ').trim();
      
      // Split into keywords
      const rawKeywords = cleanedSearchTerm.split(/\s+/).filter(Boolean);
      const keywords = rawKeywords.map(kw => kw.trim()).filter(Boolean);

      // Separate into non-stop and stop words
      const nonStopKeywords = keywords.filter(kw => !BENGALI_STOP_WORDS.has(kw));
      const stopKeywords = keywords.filter(kw => BENGALI_STOP_WORDS.has(kw));

      const scoredFatwas = [];

      for (let i = 0; i < fatwas.length; i++) {
        const fatwa = fatwas[i];
        const q = fatwa.Question ? fatwa.Question.toLowerCase() : '';
        const a = fatwa.Answer ? fatwa.Answer.toLowerCase() : '';

        // Clean punctuation from texts for word checks
        const cleanQ = q.replace(/[?!,;।\-\.]/g, ' ');
        const cleanA = a.replace(/[?!,;।\-\.]/g, ' ');

        let score = 0;
        let nonStopMatchedCount = 0;
        let stopMatchedCount = 0;

        // 1. Exact full phrase match gets the absolute highest priority
        if (cleanQ.includes(cleanedSearchTerm)) {
          score += 1000;
        } else if (cleanA.includes(cleanedSearchTerm)) {
          score += 350;
        }

        // 2. Score non-stop keywords
        for (let k = 0; k < nonStopKeywords.length; k++) {
          const kw = nonStopKeywords[k];
          let matched = false;

          // Question match
          if (cleanQ.includes(kw)) {
            matched = true;
            score += 100; // high base score for question matches
            
            // Exact word match bonus (using simple space check)
            if (cleanQ.split(/\s+/).includes(kw)) {
              score += 40;
            }
          }
          // Answer match
          if (cleanA.includes(kw)) {
            matched = true;
            score += 25; // solid score for answer match
            
            if (cleanA.split(/\s+/).includes(kw)) {
              score += 10;
            }
          }

          if (matched) {
            nonStopMatchedCount++;
          }
        }

        // 3. Score stop keywords (extremely low priority to prevent filling up with junk)
        for (let s = 0; s < stopKeywords.length; s++) {
          const kw = stopKeywords[s];
          let matched = false;

          if (cleanQ.includes(kw)) {
            matched = true;
            score += 3;
          }
          if (cleanA.includes(kw)) {
            matched = true;
            score += 0.5;
          }

          if (matched) {
            stopMatchedCount++;
          }
        }

        // 4. Require a match criteria to be included in the search results:
        // - If non-stop keywords exist, at least ONE non-stop keyword MUST match.
        // - If ONLY stop keywords were searched, let's allow matching stop keywords.
        const passesFilter = nonStopKeywords.length > 0 
          ? (nonStopMatchedCount > 0)
          : (stopMatchedCount > 0);

        if (passesFilter) {
          // Boost if multiple non-stop keywords are matched
          if (nonStopKeywords.length > 1 && nonStopMatchedCount > 1) {
            const matchRatio = nonStopMatchedCount / nonStopKeywords.length;
            score += Math.round(matchRatio * 150);
            
            if (nonStopMatchedCount === nonStopKeywords.length) {
              score += 100; // Perfect match of all keywords bonus
            }
          }

          // Check consecutive sequence of two non-stop keywords for semantic flow
          for (let k = 0; k < nonStopKeywords.length - 1; k++) {
            const pair = nonStopKeywords[k] + " " + nonStopKeywords[k+1];
            if (cleanQ.includes(pair)) {
              score += 80;
            } else if (cleanA.includes(pair)) {
              score += 30;
            }
          }

          scoredFatwas.push({ 
            item: { ...fatwa, searchScore: score }, 
            score 
          });
        }
      }

      // Sort by score in descending order
      scoredFatwas.sort((a, b) => b.score - a.score);
      baseResults = scoredFatwas.map(res => res.item);
    }

    return baseResults.filter(fatwa => {
      const matchesCat = selectedCategory === 'All' || fatwa.Category === selectedCategory;
      const matchesSubCat = selectedSubcategory === 'All' || fatwa.Subcategory === selectedSubcategory;
      
      return matchesCat && matchesSubCat;
    });
  }, [searchTerm, selectedCategory, selectedSubcategory, fatwas]);

  // Get active max score for rating match percentages rank-relatively
  const maxSearchScore = useMemo(() => {
    return Math.max(...filteredFatwas.map(f => f.searchScore || 0));
  }, [filteredFatwas]);


  // Pagination
  const totalPages = Math.ceil(filteredFatwas.length / itemsPerPage);
  const currentFatwas = filteredFatwas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory('All');
    setCurrentPage(1);
    setExpandedId(0);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-32 relative z-20 flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
        <Loader2 className="w-10 h-10 text-[#c9a227] animate-spin mb-4" />
        <p className="text-gray-500 dark:text-white/60 font-serif text-lg">ফতোয়া ডাটাবেজ লোড করা হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-20 relative z-20">
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
        <div className="relative flex-1 flex">
          <input 
            type="text" 
            placeholder="ফতোয়া খুঁজুন বা প্রশ্ন লিখুন... (যেমন: নামায, ওযু)" 
            className="w-full pl-4 pr-[4.5rem] py-3 bg-slate-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 focus:border-[#c9a227] dark:focus:border-[#c9a227] outline-none text-gray-900 dark:text-white transition-colors"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                startTransition(() => {
                  setSearchTerm(searchInput);
                  setCurrentPage(1);
                  setExpandedId(0);
                });
              }
            }}
          />
          <button 
            onClick={() => {
              startTransition(() => {
                setSearchTerm(searchInput);
                setCurrentPage(1);
                setExpandedId(0);
              });
            }}
            className="absolute right-1 top-1 bottom-1 px-4 bg-[#c9a227] hover:bg-[#b39022] text-white flex items-center justify-center transition-colors"
            title="সার্চ করুন"
          >
            <Search className="w-5 h-5" />
          </button>
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
                    <div className="flex flex-wrap items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(fatwa.Category);
                          setSelectedSubcategory(
                            fatwa.Subcategory !== 'Unknown' && fatwa.Subcategory !== 'All' 
                              ? fatwa.Subcategory 
                              : 'All'
                          );
                          setCurrentPage(1);
                          setExpandedId(0);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-gray-100 hover:bg-[#c9a227]/20 dark:bg-white/5 dark:hover:bg-[#c9a227]/20 text-gray-600 hover:text-[#c9a227] dark:text-white/60 dark:hover:text-[#c9a227] px-3 py-1 text-xs md:text-sm rounded-md transition-colors cursor-pointer text-left"
                        title={`${fatwa.Category} ক্যাটাগরিতে ফিল্টার করুন`}
                      >
                        {fatwa.Subcategory !== 'Unknown' && fatwa.Subcategory !== 'All' ? fatwa.Subcategory : fatwa.Category}
                      </button>

                      {searchTerm && fatwa.searchScore !== undefined && (
                        <span className={`text-[11px] md:text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1 ${
                          fatwa.searchScore >= 250 
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' 
                            : fatwa.searchScore >= 100
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                        } border`}>
                          <span>মিল সম্ভাবনা:</span>
                          <span>{Math.max(15, Math.min(100, Math.round((fatwa.searchScore / Math.max(1, maxSearchScore)) * 100)))}%</span>
                        </span>
                      )}
                    </div>
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
