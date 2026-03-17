import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchHome, fetchMoreContent } from '../services/api';
import MovieSection from '../components/MovieSection';
import MovieCard from '../components/MovieCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [sections, setSections] = useState([]);
  const [moreItems, setMoreItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const sentinelRef = useRef(null);
  const seenSlugs = useRef(new Set());

  useEffect(() => {
    fetchHome()
      .then((data) => {
        const s = Array.isArray(data) ? data : (data?.sections || []);
        setSections(s);
        // Track slugs from initial sections
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
    } catch {
      // silently fail
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, page]);

  // IntersectionObserver on sentinel
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '200px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary-accent" size={48} />
        <p className="text-gray-500 font-medium">Loading amazing content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary-accent text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-accent-hover transition-colors"
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
        <meta name="description" content="Watch movie online for free at Streamarino. Best place to watch movies, online movie watcher, free movie watcher, online movies, and movies." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Streamarino",
            "url": "https://streamarino.vercel.app/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://streamarino.vercel.app/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      {/* Hero */}
      <div className="relative h-[60vh] md:h-[80vh] overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-primary-light dark:from-primary-dark via-transparent to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
          alt="Hero"
          className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute bottom-12 left-4 md:left-12 z-20 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg mb-4">
            Unlimited Movies & TV Shows
          </h1>
          <p className="text-lg text-gray-200 drop-shadow-md mb-6">
            Watch anywhere. Cancel anytime. Start streaming your favorite content for free now!
          </p>
        </div>
      </div>

      {/* Initial sections */}
      <div className="-mt-16 relative z-30">
        {sections.map((section, idx) => (
          <MovieSection key={idx} title={section.title} items={section.items} />
        ))}
      </div>

      {/* Infinite scroll grid */}
      {moreItems.length > 0 && (
        <section className="px-4 md:px-8 mt-4">
          <h2 className="text-xl md:text-2xl font-bold border-l-4 border-primary-accent pl-4 mb-6">
            More to Watch
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {moreItems.map((item, idx) => (
              <MovieCard key={`${item.slug}-${idx}`} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Sentinel (auto) + Load More button */}
      <div ref={sentinelRef} className="flex flex-col items-center gap-4 py-8">
        {loadingMore
          ? <Loader2 className="animate-spin text-primary-accent" size={32} />
          : <button
              onClick={loadMore}
              className="bg-primary-accent hover:bg-primary-accent-hover text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Load More
            </button>
        }
      </div>
    </div>
  );
}
