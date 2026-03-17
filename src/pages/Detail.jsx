import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchDetail } from '../services/api';
import { Loader2, Star, Play, Calendar, Clock, Globe } from 'lucide-react';

export default function Detail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchDetail(slug);
        setData(result);
      } catch (err) {
        console.error(err);
        setError('Failed to load details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary-accent" size={48} />
        <p className="text-gray-500 font-medium">Loading details...</p>
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

  if (!data) return null;

  const {
    title, cover, trailer, imdbRating, genre, type,
    description, releaseDate, duration, country,
    seasons, availableDubs, availableSubs,
  } = data;

  const isSeries = type?.toLowerCase() === 'series' || seasons?.length > 0;
  const firstSeason = seasons?.[0];
  const watchLink = isSeries
    ? `/stream/${slug}?se=${firstSeason?.season ?? 1}&ep=1`
    : `/stream/${slug}`;
  const year = releaseDate?.slice(0, 4);

  return (
    <>
      <Helmet>
        <title>{title} - Streamarino</title>
        <meta name="description" content={description?.slice(0, 160)} />
      </Helmet>

      {/* Backdrop */}
      <div className="relative h-[45vh] md:h-[55vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary-light dark:from-primary-dark via-black/40 to-black/20 z-10" />
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-32 relative z-20 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-40 md:w-56 shrink-0 mx-auto md:mx-0">
            <img
              src={cover}
              alt={title}
              className="w-full rounded-2xl shadow-2xl aspect-[2/3] object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 flex-1">
            <h1 className="text-3xl md:text-4xl font-black">{title}</h1>

            {/* Meta row */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
              {imdbRating && (
                <span className="flex items-center gap-1 text-primary-accent font-bold">
                  <Star size={14} fill="currentColor" /> {imdbRating}
                </span>
              )}
              {year && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {year}
                </span>
              )}
              {duration && (
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {duration}
                </span>
              )}
              {country && (
                <span className="flex items-center gap-1">
                  <Globe size={14} /> {country}
                </span>
              )}
            </div>

            {/* Genres */}
            {genre && (
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(genre) ? genre : genre.split(',')).map((g, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 dark:bg-gray-800 text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {g.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                {description}
              </p>
            )}

            {/* Watch button */}
            <Link
              to={watchLink}
              className="inline-flex items-center gap-2 bg-primary-accent hover:bg-primary-accent-hover text-white font-bold px-8 py-3 rounded-xl transition-colors w-fit text-lg"
            >
              <Play size={20} fill="currentColor" />
              Watch Now
            </Link>
          </div>
        </div>

        {/* Dubs / Subs info */}
        {(availableDubs?.length > 1 || availableSubs?.length > 0) && (
          <div className="mt-8 flex flex-wrap gap-2">
            {availableDubs?.map((d) => (
              <span key={d.slug} className="bg-gray-100 dark:bg-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                🎙 {d.name}
              </span>
            ))}
            {availableSubs?.map((s) => (
              <span key={s.slug} className="bg-gray-100 dark:bg-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                💬 {s.name}
              </span>
            ))}
          </div>
        )}

        {/* Seasons & episodes */}
        {isSeries && seasons?.length > 0 && (
          <div className="mt-12">
            {seasons.map((season) => (
              <div key={season.season} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold">Season {season.season}</h2>
                  <span className="text-sm text-gray-500">{season.totalEpisodes} episodes</span>
                  {season.resolutions?.length > 0 && (
                    <span className="text-xs text-primary-accent font-semibold">
                      up to {Math.max(...season.resolutions)}p
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {season.episodes?.map((ep) => (
                    <Link
                      key={ep.episode}
                      to={`/stream/${slug}?se=${season.season}&ep=${ep.episode}`}
                      className="bg-gray-100 dark:bg-gray-800 hover:bg-primary-accent hover:text-white rounded-xl py-2 text-sm font-semibold transition-colors text-center"
                    >
                      E{ep.episode}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
