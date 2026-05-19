import { BookOpen, Calendar, HandHeart, Info, MapPin, Moon, Sun, Map as MapIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { hajjData, DayGuide, Prayer, Action } from './data';
import { HajjMap } from './components/HajjMap';
import { ArticleView } from './components/ArticleView';
import { FatwaView } from './components/FatwaView';

const SectionHeader: React.FC<{ title: string, icon: any }> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-3 mb-8">
    <div className="text-[#c9a227]">
      <Icon className="w-5 h-5" />
    </div>
    <h2 className="text-lg font-serif text-gray-900 dark:text-[#f2f2f2] tracking-widest">{title}</h2>
  </div>
);

const PrayerCard: React.FC<{ prayer: Prayer }> = ({ prayer }) => (
  <div className="bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 p-6 mb-6 group hover:border-[#c9a227]/50 transition-colors relative overflow-hidden shadow-sm dark:shadow-none">
    <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#c9a227] opacity-0 group-hover:opacity-20 transition-opacity"></div>
    <div className="flex items-start justify-between mb-5 border-b border-black/10 dark:border-white/10 pb-4">
      <h3 className="font-serif text-[#c9a227] flex items-center gap-3 text-xl">
        <HandHeart className="w-5 h-5 opacity-80" />
        <span className="leading-snug">{prayer.scenario}</span>
      </h3>
    </div>
    
    <div className="space-y-5">
      <p className="text-2xl leading-relaxed text-right font-serif text-gray-900 dark:text-[#f2f2f2] font-semibold" dir="rtl">
        {prayer.arabic}
      </p>
      
      {prayer.pronunciation && (
        <div className="bg-slate-50 dark:bg-[#1a1a1a] p-5 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest mb-2 block">উচ্চারণ</span>
          <p className="text-gray-600 dark:text-white/70 text-[15px] leading-relaxed">{prayer.pronunciation}</p>
        </div>
      )}
      
      <div className="bg-slate-50 dark:bg-[#1a1a1a] p-5 border-l-2 border-[#c9a227]">
        <span className="text-[10px] font-bold text-[#c9a227] uppercase tracking-widest mb-2 block">অর্থ</span>
        <p className="text-gray-700 dark:text-[#f2f2f2]/80 text-[15px] leading-relaxed">{prayer.meaning}</p>
      </div>
    </div>
  </div>
);

const ActionItem: React.FC<{ action: Action }> = ({ action }) => (
  <div className="flex gap-4 mb-5 items-start">
    <div className="mt-1">
      <span className="inline-block border border-[#c9a227]/40 text-[#c9a227] px-2 py-1 text-[10px] tracking-widest font-bold whitespace-nowrap">
        {action.type}
      </span>
    </div>
    <p className="text-gray-600 dark:text-white/70 text-[15px] leading-relaxed">{action.description}</p>
  </div>
);

const DaySection: React.FC<{ data: DayGuide }> = ({ data }) => (
  <div className="bg-slate-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 overflow-hidden mb-12 relative">
    <div className="bg-white dark:bg-[#0c0c0c] p-8 md:p-10 border-b border-black/10 dark:border-white/10 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-[#0a0a0a] via-transparent to-transparent opacity-60 pointer-events-none"></div>
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
         <div className="w-full h-full bg-[repeating-linear-gradient(45deg,rgba(0,0,0,1)_0,rgba(0,0,0,1)_1px,transparent_0,transparent_50%)] dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,1)_0,rgba(255,255,255,1)_1px,transparent_0,transparent_50%)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="relative z-10 text-center sm:text-left">
        <div className="text-xs uppercase tracking-[0.3em] text-[#c9a227] mb-3">{data.day}</div>
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 dark:text-[#f2f2f2] leading-tight">{data.title}</h2>
      </div>
    </div>
    
    <div className="p-8 md:p-12">
      <div className="border-l-2 border-[#c9a227]/50 pl-6 mb-12 text-gray-600 dark:text-white/60 leading-relaxed text-base md:text-lg max-w-4xl font-serif italic">
        <p>{data.intro}</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
          <SectionHeader title="আমলসমূহ (Actions & Rites)" icon={MapPin} />
          <div className="space-y-2">
            {data.actions.map((action, idx) => (
              <ActionItem key={idx} action={action} />
            ))}
          </div>
        </div>
        
        <div>
          <SectionHeader title="মাসনুন দোয়া (Prayers)" icon={BookOpen} />
          <div>
            {data.prayers.map((prayer, idx) => (
              <PrayerCard key={idx} prayer={prayer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [blessingVisible, setBlessingVisible] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeView, setActiveView] = useState<'guide' | 'articles' | 'fatwa'>('guide');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-gray-900 dark:text-[#f2f2f2] font-sans selection:bg-[#c9a227]/30 selection:text-[#c9a227] pb-24 overflow-x-hidden transition-colors duration-300">
      {/* Navigation */}
      <nav className="flex flex-col sm:flex-row items-center justify-between px-8 md:px-12 py-6 border-b border-black/10 dark:border-white/10 gap-6 fixed top-0 w-full z-50 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-[#c9a227] rounded-sm flex items-center justify-center rotate-45">
            <div className="w-2 h-2 bg-white dark:bg-[#0a0a0a] rounded-sm transition-colors duration-300"></div>
          </div>
          <span className="text-lg font-semibold tracking-widest uppercase text-gray-900 dark:text-[#f2f2f2]">Hajj Guide</span>
        </div>
        <div className="flex items-center justify-center gap-4 sm:gap-6 font-bold uppercase tracking-wider text-sm md:text-base">
          <button 
            onClick={() => { setActiveView('guide'); window.scrollTo(0,0); }} 
            className={`${activeView === 'guide' ? 'bg-[#c9a227] text-white shadow-md' : 'text-gray-500 dark:text-white/50 hover:text-[#c9a227] hover:bg-[#c9a227]/10'} px-6 py-2.5 rounded-full transition-all cursor-pointer border ${activeView === 'guide' ? 'border-[#c9a227]' : 'border-transparent'}`}
          >
            Guide
          </button>
          <button 
            onClick={() => { setActiveView('articles'); window.scrollTo(0,0); }} 
            className={`${activeView === 'articles' ? 'bg-[#c9a227] text-white shadow-md' : 'text-gray-500 dark:text-white/50 hover:text-[#c9a227] hover:bg-[#c9a227]/10'} px-6 py-2.5 rounded-full transition-all cursor-pointer border ${activeView === 'articles' ? 'border-[#c9a227]' : 'border-transparent'}`}
          >
            Articles (প্রবন্ধ)
          </button>
          <button 
            onClick={() => { setActiveView('fatwa'); window.scrollTo(0,0); }} 
            className={`${activeView === 'fatwa' ? 'bg-[#c9a227] text-white shadow-md' : 'text-gray-500 dark:text-white/50 hover:text-[#c9a227] hover:bg-[#c9a227]/10'} px-6 py-2.5 rounded-full transition-all cursor-pointer border ${activeView === 'fatwa' ? 'border-[#c9a227]' : 'border-transparent'}`}
          >
            Fatwa (ফতোয়া)
          </button>
          
          <button 
            onClick={() => setIsDark(!isDark)} 
            className="p-3 border border-black/10 dark:border-white/10 rounded-full hover:border-[#c9a227] transition-colors text-gray-900 dark:text-white ml-2 sm:ml-4"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {activeView === 'guide' ? (
        <>
          {/* Hero Section */}
          <div id="overview" className="relative border-b border-black/10 dark:border-white/10 pt-24 md:pt-32">  
        <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7">
              <h2 className="text-[#c9a227] font-serif italic text-xl md:text-2xl mb-6 flex items-center gap-3">
                <Calendar className="w-5 h-5 opacity-70" />
                ৮-১৩ জিলহজ (8th - 13th Dhul Hijjah)
              </h2>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight mb-8 text-gray-900 dark:text-white">
                {hajjData.title.split(' (')[0]} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-white/40 italic text-2xl md:text-3xl lg:text-4xl mt-3 block">
                  {hajjData.subtitle}
                </span>
              </h1>
              <div className="flex gap-4 sm:gap-6 mt-10">
                <a href="#rites" className="inline-block px-8 py-4 bg-[#c9a227] text-white dark:text-[#0a0a0a] font-bold tracking-widest text-[10px] md:text-xs hover:bg-[#b08b22] dark:hover:bg-white transition-colors uppercase text-center">
                  গাইড শুরু করুন
                </a>
                <button 
                  onClick={() => {
                    alert('হজ্জ মাবরুর! (May your Hajj be accepted!)');
                    setBlessingVisible(!blessingVisible);
                  }}
                  className="px-8 py-4 border border-black/20 dark:border-white/20 text-gray-900 dark:text-white font-bold tracking-widest text-[10px] md:text-xs hover:bg-black/5 dark:hover:bg-white/10 transition-colors uppercase">
                  {blessingVisible ? "Hide Blessing" : "Show Blessing"}
                </button>
              </div>
              {blessingVisible && (
                <div className="mt-6 p-4 border-l-2 border-[#c9a227] bg-slate-50 dark:bg-[#1a1a1a] max-w-md animate-in fade-in slide-in-from-top-2">
                  <p className="text-[#c9a227] font-serif italic text-lg leading-relaxed">
                    "হজ্জ মাবরুর, যাম্বুন মাগফুর, সা'য়ুন মাশকুরা"<br />
                    <span className="text-gray-500 dark:text-white/60 text-sm block mt-2 font-sans not-italic">May your Hajj be accepted, your sins forgiven, and your efforts rewarded.</span>
                  </p>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-5 relative hidden md:block mt-8 lg:mt-0">
              <div className="aspect-[4/5] bg-slate-50 dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 overflow-hidden relative group p-10 flex flex-col justify-end">
                <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] dark:from-[#0a0a0a] via-[#fafafa]/60 dark:via-[#0a0a0a]/60 to-transparent z-10 opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.03)_0,rgba(0,0,0,0.03)_1px,transparent_0,transparent_50%)] dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.02)_1px,transparent_0,transparent_50%)] bg-[length:20px_20px]"></div>
                </div>
                <div className="relative z-20">
                   <div className="text-[10px] uppercase tracking-[0.3em] text-[#c9a227] mb-4">Introduction</div>
                   <div className="space-y-4">
                     {hajjData.intro.map((p, i) => (
                       <p key={i} className="text-gray-600 dark:text-white/60 text-[15px] font-sans leading-relaxed">{p}</p>
                     ))}
                   </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-24 h-24 border-t border-r border-[#c9a227] opacity-40"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b border-l border-[#c9a227] opacity-40"></div>
            </div>

            {/* Mobile intro fallback */}
            <div className="md:hidden space-y-4 border-l-2 pl-5 border-[#c9a227]/40 mt-8">
              {hajjData.intro.map((p, i) => (
                 <p key={i} className="text-gray-600 dark:text-white/60 text-sm font-sans leading-relaxed">{p}</p>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <main id="rites" className="max-w-7xl mx-auto px-4 md:px-12 py-16 md:py-24 relative z-20 scroll-mt-24">
        
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#c9a227]/10 rounded-full">
              <MapIcon className="w-6 h-6 text-[#c9a227]" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Interactive Hajj Map</h2>
              <p className="text-gray-500 dark:text-white/60 text-sm mt-1">Tap on locations to view integrated actions and prayers</p>
            </div>
          </div>
          <HajjMap locations={[
            { id: '1', name: 'Masjid al-Haram (Kaaba)', coord: [21.4225, 39.8262], dataRef: hajjData.makkahArrival },
            { id: '2', name: 'Safa and Marwa', coord: [21.4227, 39.8280], dataRef: hajjData.makkahArrival },
            { id: '3', name: 'Mina', coord: [21.4133, 39.8933], dataRef: hajjData.days[0] }, // Day 1 details
            { id: '4', name: 'Mount Arafat', coord: [21.3549, 39.9841], dataRef: hajjData.days[1] }, // Day 2 details
            { id: '5', name: 'Muzdalifah', coord: [21.3879, 39.9079], dataRef: hajjData.days[2] } // Muzdalifah is eve of 10th (included in Day 2 night or Day 3)
          ]} />
        </div>

        <div className="space-y-8">
          <DaySection data={hajjData.makkahArrival} />
          {hajjData.days.map((day, idx) => (
            <DaySection key={idx} data={day} />
          ))}
          
          <div id="post-hajj" className="py-16 flex items-center justify-center relative scroll-mt-24">
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/20 to-transparent"></div>
            <div className="bg-[#fafafa] dark:bg-[#0a0a0a] px-8 relative z-10 flex flex-col items-center">
               <div className="w-4 h-4 border border-[#c9a227] rotate-45 mb-4 bg-white dark:bg-transparent"></div>
               <h2 className="text-[10px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-[0.3em] text-center">হজ্জ পরবর্তী আমল<br/><span className="mt-1 block text-gray-400 dark:text-white/20">Post-Hajj Observances</span></h2>
            </div>
          </div>
          
          <DaySection data={hajjData.tatawafElWida} />
          <DaySection data={hajjData.madinahZiyarat} />
          
        </div>
      </main>
      </>
      ) : activeView === 'articles' ? (
        <ArticleView />
      ) : (
        <FatwaView />
      )}

      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 px-8 md:px-12 py-16 bg-white dark:bg-[#0c0c0c] max-w-7xl mx-auto transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div>
            <div className="text-4xl font-serif text-[#c9a227] mb-3">5</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/40 font-bold leading-relaxed">Days of<br/>Rites</div>
          </div>
          <div>
            <div className="text-4xl font-serif text-[#c9a227] mb-3">15+</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/40 font-bold leading-relaxed">Key<br/>Prayers</div>
          </div>
          <div className="hidden md:block">
             <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center mb-3 text-gray-400 dark:text-white/40">
               <BookOpen className="w-4 h-4" />
             </div>
             <div className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/40 font-bold">Complete Guide</div>
          </div>
          <div className="flex flex-col items-start md:items-end justify-center">
            <span className="text-[10px] uppercase tracking-widest text-gray-600 dark:text-white/60 mb-5 font-bold">Pilgrimage</span>
            <div className="flex gap-4 text-[#c9a227]/50">
              <MapPin className="w-5 h-5 hover:text-[#c9a227] transition-colors cursor-pointer" />
              <Info className="w-5 h-5 hover:text-[#c9a227] transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
