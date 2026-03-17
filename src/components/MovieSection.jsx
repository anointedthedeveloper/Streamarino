import React from 'react';
import { ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function MovieSection({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-6 px-4 md:px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold border-l-4 border-primary-accent pl-4">
          {title}
        </h2>
        <button className="text-primary-accent hover:underline flex items-center gap-1 text-sm font-semibold">
          View all
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
        {items.map((item, idx) => (
          <div key={`${item.slug}-${idx}`} className="snap-start">
            <MovieCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
