import React, { useState } from 'react';
import { BookOpen, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { articles } from '../articles';

const renderTextWithLinks = (text: string) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <a key={lastIndex} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-[#c9a227] hover:underline font-medium">
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
};

export const ArticleView: React.FC = () => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  const articlesPerPage = 10;
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

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

      {!selectedArticle ? (
        <div className="space-y-6">
          {currentArticles.map((article) => (
            <article 
              key={article.id} 
              onClick={() => { setSelectedArticleId(article.id); window.scrollTo(0, 0); }}
              className="bg-white dark:bg-[#0c0c0c] p-6 md:p-8 rounded-xl border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md dark:shadow-none cursor-pointer relative overflow-hidden group transition-all duration-300 hover:border-[#c9a227]/30"
            >
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-[#c9a227]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <h1 className="text-xl md:text-2xl font-serif text-gray-900 dark:text-[#f2f2f2] leading-tight mb-3 group-hover:text-[#c9a227] transition-colors">{article.title}</h1>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-white/40">
                {article.author && <span>{article.author}</span>}
                {article.author && article.date && <span className="text-gray-300 dark:text-white/20">•</span>}
                {article.date && <span>{article.date}</span>}
              </div>
            </article>
          ))}
          {articles.length === 0 && (
            <div className="text-center text-gray-500 py-12">
               কোনো প্রবন্ধ পাওয়া যায়নি।
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-black/10 dark:border-white/10">
              <button
                onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo(0, 0); }}
                disabled={currentPage === 1}
                className="p-2 rounded-full border border-black/10 dark:border-white/10 text-gray-500 hover:text-[#c9a227] hover:border-[#c9a227] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-500 dark:text-white/60">
                পৃষ্ঠা {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo(0, 0); }}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full border border-black/10 dark:border-white/10 text-gray-500 hover:text-[#c9a227] hover:border-[#c9a227] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={() => { setSelectedArticleId(null); window.scrollTo(0, 0); }}
            className="mb-8 flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-gray-500 hover:text-[#c9a227] dark:text-white/60 dark:hover:text-[#c9a227] transition-colors border max-w-fit px-4 py-2 rounded-full border-black/10 dark:border-white/10"
          >
            <ArrowLeft className="w-4 h-4" /> ফিরে যান
          </button>

          <article className="bg-white dark:bg-[#0c0c0c] p-8 md:p-12 rounded-xl border border-black/10 dark:border-white/10 shadow-sm dark:shadow-none relative overflow-hidden group">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-[#c9a227]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <header className="mb-8 border-b border-black/5 dark:border-white/5 pb-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 dark:text-[#f2f2f2] leading-tight mb-4">{selectedArticle.title}</h1>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#c9a227]">
                {selectedArticle.author && <span>{selectedArticle.author}</span>}
                {selectedArticle.author && selectedArticle.date && <span className="text-gray-300 dark:text-white/20">•</span>}
                {selectedArticle.date && <span>{selectedArticle.date}</span>}
              </div>
            </header>
            
            <div className="text-gray-700 dark:text-white/70 leading-relaxed font-sans text-base md:text-lg">
              {selectedArticle.content.map((text, idx) => {
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
                      {renderTextWithLinks(match[2])}
                    </p>
                  );
                }

                return <p key={idx} className="mb-5 last:mb-0">{renderTextWithLinks(text)}</p>;
              })}
              {selectedArticle.url && (
                <div className="mt-8">
                  <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center transition-all bg-[#c9a227] hover:bg-[#b08e22] text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md">
                    পুরো প্রবন্ধটি পড়তে এখানে ক্লিক করুন
                  </a>
                </div>
              )}
            </div>
          </article>
        </div>
      )}
    </div>
  );
};
