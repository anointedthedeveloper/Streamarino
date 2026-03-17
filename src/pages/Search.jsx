import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { searchMovies } from '../services/api';
import MovieCard from '../components/MovieCard';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const performSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchMovies(query);
        setResults(data?.results || []);
      } catch (err) {
        console.error(err);
        setError('Search failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(performSearch, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e) => {
    setSearchParams({ q: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet>
        <title>{query ? `Search results for "${query}"` : 'Search'} - Streamarino</title>
        <meta name="description" content={`Search for your favorite movies and series on Streamarino. Results for ${query}`} />
      </Helmet>

      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Find Movies & Series</h1>
        <div className="relative group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-accent transition-colors" size={24} />
          <input 
            type="text" 
            value={query}
            onChange={handleInputChange}
            placeholder="Search by title, genre, or actor..."
            className="w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-14 pr-6 focus:border-primary-accent outline-none transition-all text-lg shadow-sm focus:shadow-md"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary-accent" size={48} />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {results.map((item, idx) => (
            <MovieCard key={`${item.slug}-${idx}`} item={item} />
          ))}
        </div>
      ) : query && (
        <div className="text-center py-20 text-gray-500">
          No results found for "{query}". Try searching for something else.
        </div>
      )}
    </div>
  );
}
