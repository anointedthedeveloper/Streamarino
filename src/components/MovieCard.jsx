import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function MovieCard({ item }) {
  const { title, cover, slug, rating, genre, type } = item;

  return (
    <Link 
      to={`/detail/${slug}`}
      className="group relative flex flex-col gap-2 min-w-[160px] md:min-w-[200px] hover:scale-105 transition-transform duration-300"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800">
        <img 
          src={cover} 
          alt={title} 
          className="h-full w-full object-cover group-hover:opacity-80 transition-opacity"
          loading="lazy"
        />
        {rating && (
          <div className="absolute top-2 left-2 bg-primary-accent text-white px-2 py-0.5 rounded text-xs flex items-center gap-1 font-bold">
            <Star size={12} fill="currentColor" />
            <span>{rating}</span>
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
          {type}
        </div>
      </div>
      <div className="flex flex-col">
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary-accent transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-1">{genre}</p>
      </div>
    </Link>
  );
}
