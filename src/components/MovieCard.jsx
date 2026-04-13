import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';

export default function MovieCard({ item }) {
  const { title, cover, slug, rating, type } = item;
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link
      to={`/detail/${slug}`}
      className="group relative flex flex-col gap-2 min-w-[150px] md:min-w-[180px]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800">
        {/* Skeleton shimmer */}
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton rounded-xl" />
        )}

        <img
          src={cover}
          alt={title}
          onLoad={() => setImgLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 bg-primary-accent rounded-full p-3 shadow-lg">
            <Play size={20} className="fill-white text-white" />
          </div>
        </div>

        {/* Rating badge */}
        {rating && (
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-xs flex items-center gap-1 font-bold">
            <Star size={10} fill="currentColor" className="text-yellow-400" />
            <span>{rating}</span>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute bottom-2 right-2 bg-primary-accent/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider">
          {type === 'series' ? 'TV' : type || 'movie'}
        </div>
      </div>

      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary-accent transition-colors leading-snug">
        {title}
      </h3>
    </Link>
  );
}
