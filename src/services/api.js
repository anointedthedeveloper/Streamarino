import axios from 'axios';

const BASE_URL = 'https://anointedthedeveloper-streamarino.hf.space';
const DEJAVU_URL = 'https://dejavumov.vercel.app';

const api = axios.create({ baseURL: BASE_URL });
const dejavu = axios.create({ baseURL: DEJAVU_URL });

export const fetchHome = async () => {
  const response = await api.get('/home');
  return response.data;
};

export const searchMovies = async (query) => {
  const response = await api.get(`/search?q=${query}`);
  return response.data;
};

// Normalize a DejaVu result into the same shape as primary API items
const normalizeDejavu = (item) => ({
  slug: item.id,
  title: item.title,
  cover: item.img,
  rating: item.detail?.rating || null,
  genre: null,
  type: item.detail?.category?.toLowerCase() === 'tv show' ? 'series' : 'movie',
  _source: 'dejavu',
});

export const searchDejaVu = async (query, page = 1) => {
  const response = await dejavu.get(`/search/${encodeURIComponent(query)}?page=${page}`);
  return (response.data?.results || []).map(normalizeDejavu);
};

const DEJAVU_FEEDS = [
  '/trending-movies',
  '/trending-tv-shows',
  '/latest-movies',
  '/latest-tv-shows',
];

export const fetchMoreContent = async (page = 1) => {
  // First 10 pages: rotate through primary search queries
  const primaryQueries = ['movie', 'series', 'drama', 'action', 'comedy', 'thriller', 'romance', 'anime', 'horror', 'adventure'];
  if (page <= primaryQueries.length) {
    const query = primaryQueries[page - 1];
    const response = await api.get(`/search?q=${query}`);
    const results = response.data?.results || [];
    if (results.length > 0) return results;
  }
  // Fallback: DejaVu feeds
  const feed = DEJAVU_FEEDS[(page - 1) % DEJAVU_FEEDS.length];
  const response = await dejavu.get(feed);
  return (response.data?.results || []).map(normalizeDejavu);
};

export const fetchDetail = async (slug) => {
  const response = await api.get(`/detail?slug=${slug}`);
  return response.data;
};

export default api;
