import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Filter, BookOpen, ChevronLeft, ChevronRight, HelpCircle, ChevronUp, ChevronDown, Loader2, RotateCcw, LayoutGrid, CheckCircle2, Sparkles } from 'lucide-react';

interface Fatwa {
  Year: number;
  Month: string | number;
  Question: string;
  Answer: string;
  Category: string;
  Subcategory: string;
  Link: string;
}

interface CategoryMeta {
  icon: string;
  title: string;
  description: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  'নামায': { icon: '🕌', title: 'নামায', description: 'ফরজ, জামাত, কসর, মুসাফির ও জানাযা' },
  'ব্যবসা ও লেনদেন': { icon: '💼', title: 'ব্যবসা ও লেনদেন', description: 'বেচাকেনা, চুক্তি, চাকরি ও ঋণ' },
  'বিবাহ ও তালাক': { icon: '💍', title: 'বিবাহ ও তালাক', description: 'নিকাহ, দেনমোহর, ভরণপোষণ ও দাম্পত্য' },
  'রোজা': { icon: '🌙', title: 'রোজা', description: 'সিয়াম, সেহরি, ইফতার ও তারাবীহ' },
  'যাকাত ও দান': { icon: '💰', title: 'যাকাত ও দান', description: 'নিসাব, সদকাতুল ফিতর ও নফল সদকা' },
  'পবিত্রতা': { icon: '💧', title: 'পবিত্রতা', description: 'ওযু, গোসল, তায়াম্মুম ও তাহারাত' },
  'হজ্ব ও ওমরাহ': { icon: '🕋', title: 'হজ্ব ও ওমরাহ', description: 'ইহরাম, তাওয়াফ, সায়ী ও যিয়ারত' },
  'কুরবানী ও আকীকা': { icon: '🐑', title: 'কুরবানী ও আকীকা', description: 'পশু নির্বাচন, জবাই ও গোশত বণ্টন' },
  'মিরাস ও বণ্টন': { icon: '📜', title: 'মিরাস ও বণ্টন', description: 'উত্তরাধিকার সম্পত্তি ও ফারায়েজ' },
  'আদব ও আখলাক': { icon: '🌸', title: 'আদব ও আখলাক', description: 'দৈনন্দিন শিষ্টাচার, সালাম ও চরিত্র' },
  'হালাল-হারাম ও অন্যান্য': { icon: '⚖️', title: 'হালাল-হারাম', description: 'খাবার, পোশাক ও হালাল উপার্জন' },
  'দোয়া ও আমল': { icon: '🤲', title: 'দোয়া ও আমল', description: 'মাসনূন দোয়া, জিকির ও ফজিলত' },
  'বিবিধ (অন্যান্য)': { icon: '📚', title: 'বিবিধ (অন্যান্য)', description: 'সমসাময়িক বিষয় ও বিবিধ জিজ্ঞাসা' },
  'ইতিহাস ও সীরাত': { icon: '📖', title: 'ইতিহাস ও সীরাত', description: 'নবী-রাসূল ও ঐতিহাসিক ঘটনা' },
};

const toBengaliNumber = (num: number): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(d => bnDigits[parseInt(d, 10)] ?? d).join('');
};

const normalizeCategory = (cat: string): string => {
  if (cat === 'দোয়া ও আমল' || cat === 'দোয়া ও আমল') return 'দোয়া ও আমল';
  return cat;
};

export const FatwaView: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(0);
  const [isPending, startTransition] = React.useTransition();
  const itemsPerPage = 10;

  const resultsRef = useRef<HTMLDivElement>(null);

  const [fatwas, setFatwas] = useState<Fatwa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import('../data/fatwas_data.json')
      .then((m) => {
        const rawData = m.default as Fatwa[];
        const normalized = rawData.map(f => ({
          ...f,
          Category: normalizeCategory(f.Category || 'বিবিধ (অন্যান্য)')
        }));
        setFatwas(normalized);
        setIsLoading(false);

        // Check if URL hash has a category (e.g. #category-নামায)
        if (typeof window !== 'undefined' && window.location.hash) {
          const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
          if (hash.startsWith('category-')) {
            const catFromHash = hash.replace('category-', '');
            setSelectedCategory(catFromHash);
          } else if (hash.startsWith('cat-')) {
            const catFromHash = hash.replace('cat-', '');
            setSelectedCategory(catFromHash);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load fatwas data:', err);
        setIsLoading(false);
      });
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    fatwas.forEach(f => {
      const cat = f.Category;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [fatwas]);

  // Unique sorted categories
  const categories = useMemo(() => {
    const cats = Object.keys(categoryCounts).sort((a, b) => (categoryCounts[b] || 0) - (categoryCounts[a] || 0));
    return ['All', ...cats];
  }, [categoryCounts]);

  // Subcategory counts for selected category
  const subcategoryCounts = useMemo(() => {
    if (selectedCategory === 'All') return {};
    const counts: Record<string, number> = {};
    fatwas
      .filter(f => f.Category === selectedCategory)
      .forEach(f => {
        const sub = f.Subcategory && f.Subcategory !== 'Unknown' ? f.Subcategory : 'সাধারণ';
        counts[sub] = (counts[sub] || 0) + 1;
      });
    return counts;
  }, [selectedCategory, fatwas]);

  // Subcategories array
  const subcategories = useMemo(() => {
    if (selectedCategory === 'All') return ['All'];
    const subs = Object.keys(subcategoryCounts).sort((a, b) => (subcategoryCounts[b] || 0) - (subcategoryCounts[a] || 0));
    return ['All', ...subs];
  }, [selectedCategory, subcategoryCounts]);

  // Filtered data with fuzzy keyword ranking
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

      const cleanedSearchTerm = searchLower.replace(/[?!,;।\-\.]/g, ' ').replace(/\s+/g, ' ').trim();
      const rawKeywords = cleanedSearchTerm.split(/\s+/).filter(Boolean);
      const keywords = rawKeywords.map(kw => kw.trim()).filter(Boolean);

      const nonStopKeywords = keywords.filter(kw => !BENGALI_STOP_WORDS.has(kw));
      const stopKeywords = keywords.filter(kw => BENGALI_STOP_WORDS.has(kw));

      const scoredFatwas = [];

      for (let i = 0; i < fatwas.length; i++) {
        const fatwa = fatwas[i];
        const q = fatwa.Question ? fatwa.Question.toLowerCase() : '';
        const a = fatwa.Answer ? fatwa.Answer.toLowerCase() : '';

        const cleanQ = q.replace(/[?!,;।\-\.]/g, ' ');
        const cleanA = a.replace(/[?!,;।\-\.]/g, ' ');

        let score = 0;
        let nonStopMatchedCount = 0;
        let stopMatchedCount = 0;

        if (cleanQ.includes(cleanedSearchTerm)) {
          score += 1000;
        } else if (cleanA.includes(cleanedSearchTerm)) {
          score += 350;
        }

        for (const kw of nonStopKeywords) {
          if (cleanQ.includes(kw)) {
            score += 120;
            nonStopMatchedCount++;
          } else if (cleanA.includes(kw)) {
            score += 40;
            nonStopMatchedCount++;
          }
        }

        for (const kw of stopKeywords) {
          if (cleanQ.includes(kw)) {
            score += 15;
            stopMatchedCount++;
          } else if (cleanA.includes(kw)) {
            score += 5;
            stopMatchedCount++;
          }
        }

        const passesFilter = nonStopKeywords.length > 0 
          ? (nonStopMatchedCount > 0)
          : (stopMatchedCount > 0);

        if (passesFilter) {
          if (nonStopKeywords.length > 1 && nonStopMatchedCount > 1) {
            const matchRatio = nonStopMatchedCount / nonStopKeywords.length;
            score += Math.round(matchRatio * 150);
            if (nonStopMatchedCount === nonStopKeywords.length) {
              score += 100;
            }
          }

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

      scoredFatwas.sort((a, b) => b.score - a.score);
      baseResults = scoredFatwas.map(res => res.item);
    }

    return baseResults.filter(fatwa => {
      const matchesCat = selectedCategory === 'All' || fatwa.Category === selectedCategory;
      const matchesSubCat = selectedSubcategory === 'All' 
        || fatwa.Subcategory === selectedSubcategory
        || (selectedSubcategory === 'সাধারণ' && (!fatwa.Subcategory || fatwa.Subcategory === 'Unknown'));
      
      return matchesCat && matchesSubCat;
    });
  }, [searchTerm, selectedCategory, selectedSubcategory, fatwas]);

  const maxSearchScore = useMemo(() => {
    return Math.max(...filteredFatwas.map(f => f.searchScore || 0));
  }, [filteredFatwas]);

  // Pagination
  const totalPages = Math.ceil(filteredFatwas.length / itemsPerPage);
  const currentFatwas = filteredFatwas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory('All');
    setCurrentPage(1);
    setExpandedId(0);

    // Update URL hash for direct bookmarking and search index visibility
    if (typeof window !== 'undefined') {
      if (cat === 'All') {
        history.replaceState(null, '', window.location.pathname);
      } else {
        history.replaceState(null, '', `#category-${encodeURIComponent(cat)}`);
      }
    }

    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const resetAllFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setCurrentPage(1);
    setExpandedId(0);
    if (typeof window !== 'undefined') {
      history.replaceState(null, '', window.location.pathname);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-32 relative z-20 flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
        <Loader2 className="w-10 h-10 text-[#c9a227] animate-spin mb-4" />
        <p className="text-gray-600 dark:text-white/70 font-serif text-lg">মাসিক আল কাউসারের ফতোয়া ডাটাবেজ লোড করা হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-14 relative z-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-500/10 via-white dark:via-[#0c0c0c] to-amber-500/5 dark:from-[#c9a227]/15 dark:to-[#0a0a0a] border border-[#c9a227]/30 rounded-2xl p-6 sm:p-10 mb-10 shadow-sm relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-[#c9a227]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-[#c9a227] to-[#e5be49] rounded-2xl flex items-center justify-center text-white shadow-md shadow-[#c9a227]/20 flex-shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9a227]/15 text-[#c9a227] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>প্রামাণ্য শরয়ী সমাধান</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-950 dark:text-white leading-tight">
                মাসিক আল কাউসারের ফতোয়া
              </h1>
              <p className="text-gray-600 dark:text-white/70 text-sm sm:text-base font-serif mt-1 max-w-2xl">
                জীবনঘনিষ্ঠ বিভিন্ন জিজ্ঞাসা ও তার প্রামাণ্য শরয়ী সমাধান। বিষয়ভিত্তিক ক্যাটাগরি ও উপ-ক্যাটাগরির আলোকে সাজানো হয়েছে।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto bg-white/80 dark:bg-black/40 backdrop-blur-sm border border-black/5 dark:border-white/10 px-4 py-3 rounded-xl">
            <div className="text-right">
              <span className="block text-2xl font-bold font-serif text-[#c9a227] leading-none">
                {toBengaliNumber(fatwas.length)}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-white/50 font-medium">সর্বমোট ফতোয়া</span>
            </div>
            <div className="w-px h-8 bg-black/10 dark:bg-white/10 mx-1"></div>
            <div>
              <span className="block text-2xl font-bold font-serif text-gray-800 dark:text-white leading-none">
                {toBengaliNumber(categories.length - 1)}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-white/50 font-medium">ক্যাটাগরি</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Section: ক্যাটাগরি হিসেবে বিন্যাস */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-[#c9a227]" />
            <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-900 dark:text-white tracking-wide">
              বিষয়ভিত্তিক ক্যাটাগরি
            </h2>
          </div>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => selectCategory('All')}
              className="text-xs text-[#c9a227] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>সকল ক্যাটাগরি দেখুন</span>
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          
          {/* All Categories Button */}
          <button
            onClick={() => selectCategory('All')}
            className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              selectedCategory === 'All'
                ? 'bg-[#c9a227] text-white border-[#c9a227] shadow-md shadow-[#c9a227]/20 scale-[1.02]'
                : 'bg-white dark:bg-[#0e0e0e] border-black/10 dark:border-white/10 hover:border-[#c9a227]/60 hover:bg-amber-50/50 dark:hover:bg-[#161616]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📚</span>
              {selectedCategory === 'All' && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h3 className={`font-serif font-bold text-sm sm:text-base leading-tight ${selectedCategory === 'All' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                সকল ফতোয়া
              </h3>
              <p className={`text-[11px] mt-1 font-medium ${selectedCategory === 'All' ? 'text-white/80' : 'text-gray-500 dark:text-white/50'}`}>
                {toBengaliNumber(fatwas.length)} টি ফতোয়া
              </p>
            </div>
          </button>

          {/* Individual Category Cards */}
          {categories.filter(c => c !== 'All').map(cat => {
            const meta = CATEGORY_META[cat] || { icon: '📌', title: cat, description: '' };
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-[#c9a227] text-white border-[#c9a227] shadow-md shadow-[#c9a227]/20 scale-[1.02]'
                    : 'bg-white dark:bg-[#0e0e0e] border-black/10 dark:border-white/10 hover:border-[#c9a227]/60 hover:bg-amber-50/50 dark:hover:bg-[#161616]'
                }`}
                title={meta.description}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{meta.icon}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <h3 className={`font-serif font-bold text-sm sm:text-base leading-tight group-hover:text-[#c9a227] ${
                    isSelected ? 'text-white group-hover:text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {cat}
                  </h3>
                  <p className={`text-[11px] mt-1 font-medium ${
                    isSelected ? 'text-white/80' : 'text-gray-500 dark:text-white/50'
                  }`}>
                    {toBengaliNumber(count)} টি ফতোয়া
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Category Subcategories Chips */}
        {selectedCategory !== 'All' && subcategories.length > 1 && (
          <div className="mt-5 p-4 bg-amber-50/60 dark:bg-[#141414] border border-[#c9a227]/20 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-[#c9a227] uppercase tracking-wider">
                🏷️ {selectedCategory} এর উপ-বিভাগসমূহ:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {subcategories.map(sub => {
                const isSubSelected = selectedSubcategory === sub;
                const subCount = sub === 'All' 
                  ? (categoryCounts[selectedCategory] || 0) 
                  : (subcategoryCounts[sub] || 0);

                return (
                  <button
                    key={sub}
                    onClick={() => {
                      setSelectedSubcategory(sub);
                      setCurrentPage(1);
                      setExpandedId(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSubSelected
                        ? 'bg-[#c9a227] text-white shadow-sm font-bold'
                        : 'bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-white/80 border border-black/10 dark:border-white/10 hover:border-[#c9a227]/40'
                    }`}
                  >
                    <span>{sub === 'All' ? `সকল ${selectedCategory}` : sub}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSubSelected ? 'bg-black/20 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/50'
                    }`}>
                      {toBengaliNumber(subCount)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Search and Filter Section */}
      <div ref={resultsRef} className="scroll-mt-20">
        <div className="bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 p-4 sm:p-6 mb-8 rounded-xl shadow-sm flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 flex">
            <input 
              type="text" 
              placeholder="ফতোয়া বা মাসআলা অনুসন্ধান করুন... (যেমন: নামাযে ভুল, ওযু, সেহরি, কসর)" 
              className="w-full pl-4 pr-14 py-3 bg-slate-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-lg focus:border-[#c9a227] dark:focus:border-[#c9a227] outline-none text-gray-900 dark:text-white transition-colors"
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
              className="absolute right-1 top-1 bottom-1 px-4 bg-[#c9a227] hover:bg-[#b39022] text-white rounded-md flex items-center justify-center transition-colors cursor-pointer"
              title="অনুসন্ধান করুন"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Category Dropdown Filter */}
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c9a227] w-4 h-4 pointer-events-none" />
              <select 
                className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-lg focus:border-[#c9a227] outline-none text-gray-900 dark:text-white appearance-none cursor-pointer text-sm"
                value={selectedCategory}
                onChange={(e) => selectCategory(e.target.value)}
              >
                <option value="All">সব ক্যাটাগরি ({toBengaliNumber(fatwas.length)})</option>
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({toBengaliNumber(categoryCounts[cat] || 0)})
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Dropdown if Category is selected */}
            {selectedCategory !== 'All' && subcategories.length > 1 && (
              <div className="relative w-full sm:w-48">
                <select 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-lg focus:border-[#c9a227] outline-none text-gray-900 dark:text-white appearance-none cursor-pointer text-sm"
                  value={selectedSubcategory}
                  onChange={(e) => { 
                    setSelectedSubcategory(e.target.value); 
                    setCurrentPage(1); 
                    setExpandedId(0);
                  }}
                >
                  <option value="All">সব উপ-বিভাগ</option>
                  {subcategories.filter(s => s !== 'All').map(sub => (
                    <option key={sub} value={sub}>
                      {sub} ({toBengaliNumber(subcategoryCounts[sub] || 0)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(selectedCategory !== 'All' || selectedSubcategory !== 'All' || searchTerm) && (
              <button
                onClick={resetAllFilters}
                className="px-4 py-3 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                title="ফিল্টার ক্লিয়ার করুন"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিসেট</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Count & Current Active Filters Summary */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="text-gray-600 dark:text-white/60 font-medium">
            সর্বমোট <strong className="text-[#c9a227] font-bold">{toBengaliNumber(filteredFatwas.length)}</strong> টি ফতোয়া পাওয়া গেছে
            {selectedCategory !== 'All' && (
              <span className="ml-2 inline-flex items-center gap-1 bg-[#c9a227]/10 text-[#c9a227] px-2.5 py-0.5 rounded-full text-xs font-semibold">
                ক্যাটাগরি: {selectedCategory}
              </span>
            )}
            {selectedSubcategory !== 'All' && (
              <span className="ml-1 inline-flex items-center gap-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                উপ-বিভাগ: {selectedSubcategory}
              </span>
            )}
            {searchTerm && (
              <span className="ml-1 inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full text-xs">
                অনুসন্ধান: "{searchTerm}"
              </span>
            )}
          </div>

          {totalPages > 1 && (
            <div className="text-xs text-gray-400 dark:text-white/40 font-bold uppercase tracking-widest">
              পৃষ্ঠা {toBengaliNumber(currentPage)} / {toBengaliNumber(totalPages)}
            </div>
          )}
        </div>

        {/* Fatwa List */}
        <div className="space-y-5">
          {currentFatwas.map((fatwa, index) => {
            const isExpanded = expandedId === index;
            const meta = CATEGORY_META[fatwa.Category];

            return (
              <div 
                key={index} 
                className="bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 hover:border-[#c9a227]/60 rounded-xl overflow-hidden shadow-sm transition-all duration-200"
              >
                {/* Question Section */}
                <div 
                  className="p-5 sm:p-7 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-[#111] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : index)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-amber-500/10 text-[#c9a227] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 font-serif font-bold text-lg">
                      প্র
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              selectCategory(fatwa.Category);
                            }}
                            className="bg-[#c9a227]/10 hover:bg-[#c9a227]/20 text-[#c9a227] px-2.5 py-1 text-xs rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>{meta?.icon || '📌'}</span>
                            <span>{fatwa.Category}</span>
                          </button>

                          {fatwa.Subcategory && fatwa.Subcategory !== 'Unknown' && (
                            <span className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 px-2.5 py-1 text-xs rounded-md">
                              {fatwa.Subcategory}
                            </span>
                          )}

                          {searchTerm && fatwa.searchScore !== undefined && (
                            <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20">
                              মিল: {toBengaliNumber(Math.max(15, Math.min(100, Math.round((fatwa.searchScore / Math.max(1, maxSearchScore)) * 100))))}%
                            </span>
                          )}
                        </div>

                        {isExpanded ? (
                          <ChevronUp className="text-[#c9a227] w-5 h-5 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="text-gray-400 dark:text-white/40 group-hover:text-[#c9a227] w-5 h-5 flex-shrink-0" />
                        )}
                      </div>
                      
                      <h3 
                        className="text-base sm:text-lg font-serif text-gray-900 dark:text-white leading-relaxed font-medium" 
                        dangerouslySetInnerHTML={{ __html: fatwa.Question }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Answer Section */}
                {isExpanded && (
                  <div className="border-t border-black/5 dark:border-white/5 p-5 sm:p-8 bg-slate-50/50 dark:bg-[#111111]">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 font-serif font-bold text-lg">
                        উ
                      </div>
                      
                      <div className="flex-1">
                        <div 
                          className="text-gray-800 dark:text-[#f2f2f2]/90 text-[15px] sm:text-base leading-relaxed mb-6 font-serif"
                          dangerouslySetInnerHTML={{ __html: fatwa.Answer }}
                        />
                        
                        <div className="border-t border-dashed border-gray-200 dark:border-white/10 pt-4 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-xs text-gray-400 dark:text-white/40">
                            মাসিক আল কাউসার প্রশ্নোত্তর ও ফতোয়া বিভাগ
                          </span>
                          {fatwa.Link && (
                            <a 
                              href={fatwa.Link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs text-[#c9a227] hover:underline font-medium flex items-center gap-1"
                            >
                              <span>মূল সংখ্যা দেখুন</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {currentFatwas.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 rounded-xl">
              <BookOpen className="w-12 h-12 text-gray-300 dark:text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-gray-700 dark:text-white/70 mb-2">কোনো ফতোয়া পাওয়া যায়নি</h3>
              <p className="text-sm text-gray-500 dark:text-white/50 max-w-sm mx-auto mb-4">
                আপনার অনুসন্ধানের সাথে মিলে এমন কোনো ফতোয়া পাওয়া যায়নি। অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন।
              </p>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 bg-[#c9a227] text-white rounded-lg text-xs font-bold hover:bg-[#b39022] transition-colors cursor-pointer"
              >
                সব ফতোয়া দেখুন
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button 
              onClick={() => { 
                setCurrentPage(p => Math.max(1, p - 1)); 
                setExpandedId(0);
                if (resultsRef.current) resultsRef.current.scrollIntoView({ behavior: 'smooth' });
              }} 
              disabled={currentPage === 1} 
              className="p-2.5 border border-black/10 dark:border-white/10 rounded-lg hover:border-[#c9a227] dark:hover:border-[#c9a227] disabled:opacity-30 transition-colors text-gray-900 dark:text-white cursor-pointer disabled:cursor-not-allowed"
              title="পূর্ববর্তী পৃষ্ঠা"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold tracking-widest uppercase text-gray-600 dark:text-white/60 px-3">
              পৃষ্ঠা {toBengaliNumber(currentPage)} / {toBengaliNumber(totalPages)}
            </span>

            <button 
              onClick={() => { 
                setCurrentPage(p => Math.min(totalPages, p + 1)); 
                setExpandedId(0);
                if (resultsRef.current) resultsRef.current.scrollIntoView({ behavior: 'smooth' });
              }} 
              disabled={currentPage === totalPages} 
              className="p-2.5 border border-black/10 dark:border-white/10 rounded-lg hover:border-[#c9a227] dark:hover:border-[#c9a227] disabled:opacity-30 transition-colors text-gray-900 dark:text-white cursor-pointer disabled:cursor-not-allowed"
              title="পরবর্তী পৃষ্ঠা"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
