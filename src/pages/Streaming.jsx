import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchDetail } from '../services/api';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const PLAY_API = 'https://123movienow.cc/wefeed-h5api-bff/subject/play';
const STREAM_API = 'https://anointedthedeveloper-streamarino.hf.space/stream';

async function fetchPlayData({ subjectId, detailPath, se, ep }) {
  const seNum = parseInt(se) || 0;
  const epNum = parseInt(ep) || 0;
  const url = `${PLAY_API}?subjectId=${subjectId}&se=${seNum}&ep=${epNum}&detailPath=${detailPath}`;
  const res = await fetch(url, {
    headers: { 'x-client-info': '{"timezone":"America/New_York"}' },
  });
  const json = await res.json();
  if (json.code !== 0) throw new Error(json.message || 'Play API error');
  return json.data;
}

async function fetchPlayerUrl({ slug, se, ep }) {
  const params = new URLSearchParams({ slug });
  if (se) params.append('se', se);
  if (ep) params.append('ep', ep);
  const res = await fetch(`${STREAM_API}?${params}`);
  const json = await res.json();
  return json.playerUrl || null;
}

export default function Streaming() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const se = searchParams.get('se') || '';
  const ep = searchParams.get('ep') || '';
  const dubSlug = searchParams.get('dubSlug') || slug;
  const quality = searchParams.get('quality') || '';

  const [detail, setDetail] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [playerUrl, setPlayerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDetail(slug).then(setDetail).catch(() => {});
  }, [slug]);

  const load = useCallback(async () => {
    if (!detail) return;
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setPlayerUrl(null);
    try {
      const dubs = detail.availableDubs || [];
      const activeDub = dubs.find((d) => d.slug === dubSlug) || dubs[0];
      const subjectId = activeDub?.subjectId || detail.subjectId;

      // Try direct play API first (works from browser IP)
      const playData = await fetchPlayData({ subjectId, detailPath: dubSlug, se, ep });
      const streams = playData?.streams || [];

      if (streams.length > 0) {
        const picked = quality
          ? (streams.find((s) => String(s.quality) === quality) || streams[0])
          : streams[0];
        setVideoUrl(picked.url);
      } else {
        // streams[] empty — fall back to playerUrl from our API
        const pUrl = await fetchPlayerUrl({ slug: dubSlug, se, ep });
        if (pUrl) {
          setPlayerUrl(pUrl);
        } else {
          setError('No stream available for this title.');
        }
      }
    } catch (err) {
      console.error(err);
      // On any error also try playerUrl fallback
      try {
        const pUrl = await fetchPlayerUrl({ slug: dubSlug, se, ep });
        if (pUrl) {
          setPlayerUrl(pUrl);
        } else {
          setError(`Stream error: ${err.message}`);
        }
      } catch {
        setError(`Stream error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [detail, dubSlug, se, ep, quality]);

  useEffect(() => { load(); }, [load]);

  const update = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v !== undefined && v !== null) next.set(k, v);
      else next.delete(k);
    });
    setSearchParams(next);
  };

  const epNum = parseInt(ep) || 1;
  const seNum = parseInt(se) || 1;

  const seasons = detail?.seasons || [];
  const dubs = detail?.availableDubs || [];
  const currentSeason = seasons.find((s) => s.season === seNum);
  const totalEps = currentSeason?.totalEpisodes || 0;
  const resolutions = currentSeason?.resolutions || [];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <Helmet>
        <title>
          {detail?.title
            ? `${detail.title}${se ? ` S${se}E${ep}` : ''} - Streamarino`
            : 'Streaming - Streamarino'}
        </title>
      </Helmet>

      <Link
        to={`/detail/${slug}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-accent mb-4 transition-colors"
      >
        <ChevronLeft size={16} /> Back to details
      </Link>

      {detail?.title && (
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 leading-tight">
          {detail.title}
          {se && ep && (
            <span className="ml-2 text-primary-accent text-base sm:text-lg font-bold">
              S{se} E{ep}
            </span>
          )}
        </h1>
      )}

      {/* Controls */}
      {(dubs.length > 1 || resolutions.length > 1) && (
        <div className="flex flex-wrap gap-2 mb-3">
          {dubs.length > 1 && (
            <select
              value={dubSlug}
              onChange={(e) => update({ dubSlug: e.target.value })}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm font-semibold outline-none cursor-pointer"
            >
              {dubs.map((d) => (
                <option key={d.slug} value={d.slug}>{d.name}</option>
              ))}
            </select>
          )}
          {resolutions.length > 1 && (
            <select
              value={quality || String(resolutions[resolutions.length - 1])}
              onChange={(e) => update({ quality: e.target.value })}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm font-semibold outline-none cursor-pointer"
            >
              {resolutions.map((r) => (
                <option key={r} value={String(r)}>{r}p</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Player */}
      <div className="relative w-full aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-primary-accent" size={40} />
            <p className="text-gray-400 text-sm">Loading stream...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-red-400 font-semibold text-sm">{error}</p>
            <button
              onClick={load}
              className="bg-primary-accent text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-primary-accent-hover transition-colors"
            >
              Retry
            </button>
          </div>
        ) : videoUrl ? (
          <video
            key={videoUrl}
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full"
          />
        ) : playerUrl ? (
          <iframe
            key={playerUrl}
            src={playerUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            title={detail?.title || 'Stream'}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400 text-sm">No stream available.</p>
          </div>
        )}
      </div>

      {/* Prev / Next */}
      {se && ep && (
        <div className="flex items-center justify-between mt-4">
          {epNum > 1 ? (
            <button
              onClick={() => update({ ep: epNum - 1 })}
              className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-primary-accent hover:text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
            >
              <ChevronLeft size={15} /> Prev
            </button>
          ) : <div />}
          {epNum < totalEps && (
            <button
              onClick={() => update({ ep: epNum + 1 })}
              className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-primary-accent hover:text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
            >
              Next <ChevronRight size={15} />
            </button>
          )}
        </div>
      )}

      {/* Season tabs + episode grid */}
      {seasons.length > 0 && (
        <div className="mt-8">
          {/* Season switcher — horizontal scroll on mobile */}
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
            {seasons.map((s) => (
              <button
                key={s.season}
                onClick={() => update({ se: s.season, ep: 1 })}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                  s.season === seNum
                    ? 'bg-primary-accent text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-primary-accent hover:text-white'
                }`}
              >
                S{s.season}
              </button>
            ))}
          </div>

          {currentSeason && (
            <>
              <h2 className="text-base font-bold mb-3">
                Season {seNum} — {totalEps} Episodes
              </h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {currentSeason.episodes.map((e) => {
                  const active = e.episode === epNum;
                  return (
                    <button
                      key={e.episode}
                      onClick={() => update({ ep: e.episode })}
                      className={`py-2 rounded-lg text-sm font-semibold transition-colors ${
                        active
                          ? 'bg-primary-accent text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-primary-accent hover:text-white'
                      }`}
                    >
                      E{e.episode}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
