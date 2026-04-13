import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { fetchHome, fetchMoreContent } from '../services/api';
import MovieSection from '../components/MovieSection';
import MovieCard from '../components/MovieCard';
import { Loader2, Search, TrendingUp } from 'lucide-react';

export default function Home() {
  const [sections, setSections] = useState([]);
  const [moreItems, setMoreItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [heroQuery, setHeroQuery] = useState('');
  const sentinelRef = useRef(null);
  const seenSlugs = useRef(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchHome()
      .then((data) => {
        const s = Array.isArray(data) ? data : (data?.sections || []);
        setSections(s);
        s.forEach((sec) => sec.items?.forEach((item) => seenSlugs.current.add(item.slug)));
      })
      .catch(() => setError('Failed to fetch content. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const results = await fetchMoreContent(page);
      const fresh = results.filter((item) => !seenSlugs.current.has(item.slug));
      fresh.forEach((item) => seenSlugs.current.add(item.slug));
      setMoreItems((prev) => [...prev, ...fresh]);
      setPage((p) => p + 1);
    } catch { /* silent */ } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, page]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '200px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroQuery.trim()) navigate(`/search?q=${encodeURIComponent(heroQuery.trim())}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary-accent" size={44} />
        <p className="text-gray-400 text-sm font-medium">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary-accent text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-accent-hover transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <Helmet>
        <title>Streamarino - Watch Movies & Series Online Free</title>
      </Helmet>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black dark:from-black dark:via-gray-950 dark:to-gray-900 py-24 px-4">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-accent/10 border border-primary-accent/30 text-primary-accent text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            <TrendingUp size={12} /> Free Streaming
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            Watch Movies &<br />
            <span className="text-primary-accent">Series Free</span>
          </h1>
          <p className="text-gray-400 mb-8 text-base md:text-lg">
            Thousands of titles. No sign-up. Stream instantly.
          </p>

          <form onSubmit={handleHeroSearch} className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="Search a title..."
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 rounded-xl py-3 pl-9 pr-4 outline-none focus:border-primary-accent/60 focus:bg-white/15 transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-primary-accent hover:bg-primary-accent-hover text-white font-bold px-5 py-3 rounded-xl transition-colors shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Sections */}
      <div className="mt-2">
        {sections.map((section, idx) => (
          <MovieSection key={idx} title={section.title} items={section.items} />
        ))}
      </div>

      {/* Infinite scroll grid */}
      {moreItems.length > 0 && (
        <section className="px-4 md:px-8 mt-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-primary-accent rounded-full" />
            <h2 className="text-lg md:text-xl font-bold">More to Watch</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {moreItems.map((item, idx) => (
              <MovieCard key={`${item.slug}-${idx}`} item={item} />
            ))}
          </div>
        </section>
      )}

      <div ref={sentinelRef} className="flex justify-center py-10">
        {loadingMore && <Loader2 className="animate-spin text-primary-accent" size={28} />}
      </div>
    </div>
  );
}
