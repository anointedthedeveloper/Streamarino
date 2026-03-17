import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchHome } from '../services/api';
import MovieSection from '../components/MovieSection';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchHome();
        setData(result);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

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

  // Assuming data is an array of sections or an object with sections
  // Based on the prompt: Sections include Popular Series, Popular Movies, Hot Short TV, Anime[English Dubbed], etc.
  const sections = Array.isArray(data) ? data : (data?.sections || []);

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
          <div className="flex gap-4">
            <button className="bg-primary-accent text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-primary-accent-hover transition-all flex items-center gap-2">
              Get Started
            </button>
          </div>
        </div>
      </div>

      <div className="-mt-16 relative z-30">
        {sections.map((section, idx) => (
          <MovieSection 
            key={idx} 
            title={section.title} 
            items={section.items} 
          />
        ))}
      </div>
    </div>
  );
}
