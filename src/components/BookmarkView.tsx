import React, { useState, useMemo } from 'react';
import { hajjData, Prayer, Action, DayGuide } from '../data';
import { Star, Trash2, BookOpen, MapPin, HandHeart, Calendar, ArrowRight, CornerDownRight } from 'lucide-react';

interface BookmarkViewProps {
  bookmarkedDuas: string[];
  bookmarkedActions: string[];
  onToggleDuaBookmark: (scenario: string) => void;
  onToggleActionBookmark: (description: string) => void;
  onNavigateToGuide: () => void;
}

interface SectionedPrayer {
  prayer: Prayer;
  sectionTitle: string;
  sectionDay: string;
}

interface SectionedAction {
  action: Action;
  sectionTitle: string;
  sectionDay: string;
}

export const BookmarkView: React.FC<BookmarkViewProps> = ({
  bookmarkedDuas,
  bookmarkedActions,
  onToggleDuaBookmark,
  onToggleActionBookmark,
  onNavigateToGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'duas' | 'actions'>('duas');

  const allSections: DayGuide[] = useMemo(() => {
    return [
      hajjData.makkahArrival,
      ...hajjData.days,
      hajjData.tatawafElWida,
      hajjData.madinahZiyarat
    ];
  }, []);

  // Map all prayers with their original sections
  const sectionedPrayers = useMemo(() => {
    const list: SectionedPrayer[] = [];
    allSections.forEach(section => {
      if (section.prayers) {
        section.prayers.forEach(prayer => {
          list.push({
            prayer,
            sectionTitle: section.title,
            sectionDay: section.day
          });
        });
      }
    });
    return list;
  }, [allSections]);

  // Map all actions with their original sections
  const sectionedActions = useMemo(() => {
    const list: SectionedAction[] = [];
    allSections.forEach(section => {
      if (section.actions) {
        section.actions.forEach(action => {
          list.push({
            action,
            sectionTitle: section.title,
            sectionDay: section.day
          });
        });
      }
    });
    return list;
  }, [allSections]);

  // Filter lists to only show bookmarked ones
  const filteredPrayers = useMemo(() => {
    return sectionedPrayers.filter(sp => bookmarkedDuas.includes(sp.prayer.scenario));
  }, [sectionedPrayers, bookmarkedDuas]);

  const filteredActions = useMemo(() => {
    return sectionedActions.filter(sa => bookmarkedActions.includes(sa.action.description));
  }, [sectionedActions, bookmarkedActions]);

  const hasBookmarks = bookmarkedDuas.length > 0 || bookmarkedActions.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-20 relative z-20">
      {/* Header */}
      <div className="mb-12 border-b border-black/10 dark:border-white/10 pb-6">
        <h1 className="text-3xl md:text-5xl font-serif text-gray-900 dark:text-white mb-3">
          পছন্দসই দোয়া ও আমলসমূহ
        </h1>
        <p className="text-gray-500 dark:text-white/60 text-sm md:text-base">
          আপনার বুকমার্ক করা সকল মাসনুন দোয়া এবং হজ্জের আমলগুলো এখানে একত্রিত পাবেন, যাতে যেকোনো মুহূর্তে দ্রুত খুঁজে আমল করা যায়।
        </p>
      </div>

      {hasBookmarks ? (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Tabs & Summary stats */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 p-6 shadow-sm">
            <h2 className="font-serif text-lg text-gray-900 dark:text-white mb-6 border-b border-black/5 dark:border-white/5 pb-3">
              বুকমার্ক পরিসংখ্যান
            </h2>
            <div className="space-y-3 mb-8">
              <button
                onClick={() => setActiveTab('duas')}
                className={`w-full flex items-center justify-between p-4 border transition-all text-left ${
                  activeTab === 'duas'
                    ? 'border-[#c9a227] bg-[#c9a227]/5 text-gray-900 dark:text-white font-semibold'
                    : 'border-black/5 dark:border-white/5 bg-slate-50 dark:bg-[#161616] text-gray-600 dark:text-white/60 hover:border-[#c9a227]/35'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HandHeart className="w-5 h-5 text-[#c9a227]" />
                  <span>মাসনুন দোয়া (Duas)</span>
                </div>
                <span className="bg-[#c9a227] text-white px-2.5 py-0.5 rounded-full text-xs font-sans">
                  {bookmarkedDuas.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('actions')}
                className={`w-full flex items-center justify-between p-4 border transition-all text-left ${
                  activeTab === 'actions'
                    ? 'border-[#c9a227] bg-[#c9a227]/5 text-gray-900 dark:text-white font-semibold'
                    : 'border-black/5 dark:border-white/5 bg-slate-50 dark:bg-[#161616] text-gray-600 dark:text-white/60 hover:border-[#c9a227]/35'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#c9a227]" />
                  <span>গুরুত্বপূর্ণ আমল (Actions)</span>
                </div>
                <span className="bg-[#c9a227] text-white px-2.5 py-0.5 rounded-full text-xs font-sans">
                  {bookmarkedActions.length}
                </span>
              </button>
            </div>

            <div className="text-xs text-gray-400 dark:text-white/30 border-t border-black/5 dark:border-white/5 pt-4">
              <p className="leading-relaxed">
                * কোনো দোয়া বা আমল বুকমার্ক থেকে সরাতে ডান কোণায় থাকা আবর্জনা ফেলার আইকনে অথবা 'বুকমার্ক সরানো' বোতামে ক্লিক করুন। এই বুকমার্কগুলো ব্রাউজারে নিরাপদভাবে সংরক্ষণ করা থাকে।
              </p>
            </div>
          </div>

          {/* Bookmarked Items Render Area */}
          <div className="lg:col-span-8">
            {activeTab === 'duas' ? (
              <div>
                <div className="flex items-center justify-between mb-6 border-b border-black/5 dark:border-white/5 pb-3">
                  <h3 className="font-serif text-xl text-gray-900 dark:text-white flex items-center gap-2">
                    <HandHeart className="w-5 h-5 text-[#c9a227]" />
                    <span>প্রিয় দোয়া সমূহ ({filteredPrayers.length})</span>
                  </h3>
                </div>

                {filteredPrayers.length === 0 ? (
                  <div className="bg-slate-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 p-10 text-center">
                    <HandHeart className="w-12 h-12 text-gray-300 dark:text-white/20 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-white/55 mb-2 font-serif text-lg">কোনো দোয়া বুকমার্ক করা নেই</p>
                    <p className="text-xs text-gray-400 dark:text-white/40 mb-6">হজ্জ গাইড সেকশন থেকে আপনার প্রয়োজনীয় গুরুত্বপূর্ণ দোয়া স্মরণ রাখতে বুকমার্ক করুন।</p>
                    <button
                      onClick={onNavigateToGuide}
                      className="px-6 py-2.5 bg-[#c9a227] text-white hover:bg-[#b08b22] text-xs font-bold uppercase transition-colors inline-flex items-center gap-2"
                    >
                      <span>গাইড ব্রাউজ করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredPrayers.map((sp, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 p-6 md:p-8 hover:border-[#c9a227]/50 transition-colors relative group shadow-sm dark:shadow-none"
                      >
                        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#c9a227] opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        
                        {/* Day/Section indicator */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-black/10 dark:border-white/10 pb-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-[#c9a227] font-semibold uppercase tracking-wider mb-0.5">
                              {sp.sectionDay} • {sp.sectionTitle}
                            </span>
                            <h4 className="font-serif text-[#c9a227] text-xl font-medium">
                              {sp.prayer.scenario}
                            </h4>
                          </div>

                          <button 
                            onClick={() => onToggleDuaBookmark(sp.prayer.scenario)}
                            className="p-2 text-red-500 hover:text-red-700 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors border border-red-500/20"
                            title="বুকমার্ক থেকে মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Traditional Prayer format */}
                        <div className="space-y-5">
                          <p className="text-2xl leading-relaxed text-right font-serif text-gray-900 dark:text-[#f2f2f2] font-semibold" dir="rtl">
                            {sp.prayer.arabic}
                          </p>
                          
                          {sp.prayer.pronunciation && (
                            <div className="bg-slate-50 dark:bg-[#1a1a1a] p-5 border border-black/5 dark:border-white/5">
                              <span className="text-[10px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest mb-2 block">উচ্চারণ</span>
                              <p className="text-gray-600 dark:text-white/70 text-[15px] leading-relaxed">{sp.prayer.pronunciation}</p>
                            </div>
                          )}
                          
                          <div className="bg-slate-50 dark:bg-[#1a1a1a] p-5 border-l-2 border-[#c9a227]">
                            <span className="text-[10px] font-bold text-[#c9a227] uppercase tracking-widest mb-2 block">অর্থ</span>
                            <p className="text-gray-700 dark:text-[#f2f2f2]/80 text-[15px] leading-relaxed">{sp.prayer.meaning}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6 border-b border-black/5 dark:border-white/5 pb-3">
                  <h3 className="font-serif text-xl text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#c9a227]" />
                    <span>গুরুত্বপূর্ণ আমল ({filteredActions.length})</span>
                  </h3>
                </div>

                {filteredActions.length === 0 ? (
                  <div className="bg-slate-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 p-10 text-center">
                    <MapPin className="w-12 h-12 text-gray-300 dark:text-white/20 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-white/55 mb-2 font-serif text-lg">কোনো আমল বুকমার্ক করা নেই</p>
                    <p className="text-xs text-gray-400 dark:text-white/40 mb-6">হজ্জের জন্য প্রয়োজনীয় গুরুত্বপূর্ণ আমলসমূহ স্মরণ রাখতে বুকমার্ক করে রাখতে পারেন।</p>
                    <button
                      onClick={onNavigateToGuide}
                      className="px-6 py-2.5 bg-[#c9a227] text-white hover:bg-[#b08b22] text-xs font-bold uppercase transition-colors inline-flex items-center gap-2"
                    >
                      <span>গাইড ব্রাউজ করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredActions.map((sa, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 p-6 flex gap-4 hover:border-[#c9a227]/50 transition-colors relative group shadow-sm dark:shadow-none"
                      >
                        <div className="w-24 mt-1 flex-shrink-0 flex flex-col gap-1.5 justify-start">
                          <span className="inline-block text-center border border-[#c9a227]/40 text-[#c9a227] px-2 py-1 text-[10px] tracking-widest font-bold whitespace-nowrap">
                            {sa.action.type}
                          </span>
                          <span className="text-[9px] text-gray-400 dark:text-white/30 text-center font-sans tracking-wide">
                            {sa.sectionDay}
                          </span>
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex gap-2 items-center justify-between">
                            <span className="text-xs font-serif text-[#c9a227] font-semibold flex items-center gap-1.5">
                              <CornerDownRight className="w-3.5 h-3.5" />
                              {sa.sectionTitle}
                            </span>
                            
                            <button
                              onClick={() => onToggleActionBookmark(sa.action.description)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-500/10 p-1.5 rounded-full transition-colors"
                              title="বুকমার্ক থেকে মুছুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <p className="text-gray-700 dark:text-white/80 text-[15px] leading-relaxed">
                            {sa.action.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 p-16 text-center max-w-2xl mx-auto rounded-lg">
          <Star className="w-16 h-16 text-[#c9a227]/30 mx-auto mb-6" />
          <h2 className="font-serif text-2xl text-gray-900 dark:text-white mb-4">
            প্রিয় তালিকার ঘরটি ফাঁকা
          </h2>
          <p className="text-gray-500 dark:text-white/60 text-[15px] leading-relaxed mb-8 max-w-md mx-auto">
            আপনি যখন হজ্জ গাইড বা আমলগুলোর মধ্য দিয়ে যাবেন, তখন যেকোনো দোয়া বা আমলের পাশে থাকা স্টার ( <Star className="w-4 h-4 inline-block text-[#c9a227] fill-[#c9a227]/20" /> ) চিহ্নে স্পর্শ করে সহজেই নিজের প্রিয় তালিকা তৈরি করাল যেতে পারে।
          </p>
          <button
            onClick={onNavigateToGuide}
            className="px-8 py-4 bg-[#c9a227] text-white dark:text-[#0a0a0a] font-bold tracking-widest text-xs hover:bg-[#b08b22] dark:hover:bg-white transition-colors uppercase inline-flex items-center gap-3"
          >
            <span>গাইড ব্রাউজ শুরু করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
