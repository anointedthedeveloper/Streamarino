import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search as SearchIcon, Loader2, Film } from 'lucide-react';
import { searchMovies, searchDejaVu } from '../services/api';
import MovieCard from '../components/MovieCard';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [source, setSource] = useState('primary');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchMovies(query);
        const primary = data?.results || [];
        if (primary.length > 0) {
          setResults(primary); setSource('primary');
        } else {
          const fallback = await searchDejaVu(query);
          setResults(fallback); setSource('dejavu');
        }
      } catch {
        try {
          const fallback = await searchDejaVu(query);
          setResults(fallback); setSource('dejavu');
        } catch {
          setError('Search failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(run, 400);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Helmet>
        <title>{query ? `"${query}" — Search` : 'Search'} · Streamarino</title>
      </Helmet>

      {/* Search bar */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="relative">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setSearchParams(e.target.value ? { q: e.target.value } : {})}
            placeholder="Search movies, series, anime..."
            autoFocus
            className="w-full bg-gray-100 dark:bg-gray-900 border-2 border-transparent focus:border-primary-accent rounded-2xl py-3.5 pl-12 pr-5 outline-none transition-all text-base"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-primary-accent" size={40} />
        </div>
      ) : error ? (
        <div className="text-center py-24 text-red-500 font-medium">{error}</div>
      ) : results.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">
              {results.length} result{results.length !== 1 ? 's' : ''} for <span className="font-semibold text-gray-700 dark:text-gray-300">"{query}"</span>
              {source === 'dejavu' && <span className="ml-2 text-xs text-gray-400">(fallback source)</span>}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {results.map((item, idx) => (
              <MovieCard key={`${item.slug}-${idx}`} item={item} />
            ))}
          </div>
        </>
      ) : query ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
          <Film size={48} strokeWidth={1} />
          <p className="font-medium">No results for "{query}"</p>
          <p className="text-sm">Try a different title or check the spelling.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
          <SearchIcon size={48} strokeWidth={1} />
          <p className="font-medium">Search for anything</p>
          <p className="text-sm">Movies, series, anime, K-drama and more.</p>
        </div>
      )}
    </div>
  );
}
