import React, { useState } from 'react';
import { ChevronRight, ChevronUp } from 'lucide-react';
import MovieCard from './MovieCard';

export default function MovieSection({ title, items }) {
  const [expanded, setExpanded] = useState(false);

  if (!items || items.length === 0) return null;

  return (
    <section className="py-6 px-4 md:px-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-primary-accent rounded-full" />
          <h2 className="text-lg md:text-xl font-bold">{title}</h2>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-primary-accent transition-colors"
        >
          {expanded ? <><ChevronUp size={14} /> Less</> : <>All <ChevronRight size={14} /></>}
        </button>
      </div>

      {expanded ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item, idx) => (
            <MovieCard key={`${item.slug}-${idx}`} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
          {items.map((item, idx) => (
            <div key={`${item.slug}-${idx}`} className="snap-start shrink-0">
              <MovieCard item={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
