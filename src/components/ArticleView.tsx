import React from 'react';
import { BookOpen } from 'lucide-react';
import { articles } from '../articles';

export const ArticleView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-32 relative z-20 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-12 border-b border-black/10 dark:border-white/10 pb-6">
        <div className="p-3 bg-[#c9a227]/10 rounded-full">
          <BookOpen className="w-6 h-6 text-[#c9a227]" />
        </div>
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">প্রবন্ধ ও নিবন্ধ</h2>
          <p className="text-gray-500 dark:text-white/60 text-sm mt-1">Articles & Essays</p>
        </div>
      </div>

      <div className="space-y-12">
        {articles.map((article) => (
          <article key={article.id} className="bg-white dark:bg-[#0c0c0c] p-8 md:p-12 rounded-xl border border-black/10 dark:border-white/10 shadow-sm dark:shadow-none relative overflow-hidden group">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-[#c9a227]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <header className="mb-8 border-b border-black/5 dark:border-white/5 pb-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 dark:text-[#f2f2f2] leading-tight mb-4">{article.title}</h1>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#c9a227]">
                {article.author && <span>{article.author}</span>}
                {article.author && article.date && <span className="text-gray-300 dark:text-white/20">•</span>}
                {article.date && <span>{article.date}</span>}
              </div>
            </header>
            
            <div className="text-gray-700 dark:text-white/70 leading-relaxed font-sans text-base md:text-lg">
              {article.content.map((text, idx) => {
                // Determine if the text is a heading (short, no fullstop, doesn't end in colon)
                const isHeading = text.length < 120 && !text.includes('।') && !text.includes('?') && !text.trim().endsWith(':');
                
                if (isHeading) {
                  return (
                    <h3 key={idx} className={`text-xl md:text-2xl font-serif font-bold text-gray-900 dark:text-[#f2f2f2] mb-4 ${idx > 0 ? 'mt-12' : ''}`}>
                      {text}
                    </h3>
                  );
                }

                // Check if it has a prefix like "Title: description"
                const match = text.match(/^([^:]+:\s)(.*)$/);
                if (match) {
                  return (
                    <p key={idx} className="mb-5 last:mb-0">
                      <strong className="font-semibold text-gray-900 dark:text-[#f2f2f2]">{match[1]}</strong>
                      {match[2]}
                    </p>
                  );
                }

                return <p key={idx} className="mb-5 last:mb-0">{text}</p>;
              })}
            </div>
          </article>
        ))}
        {articles.length === 0 && (
          <div className="text-center text-gray-500 py-12">
             কোনো প্রবন্ধ পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
};
