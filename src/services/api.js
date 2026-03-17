import axios from 'axios';

const BASE_URL = 'https://anointedthedeveloper-streamarino.hf.space';

const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchHome = async () => {
  const response = await api.get('/home');
  return response.data;
};

export const searchMovies = async (query) => {
  const response = await api.get(`/search?q=${query}`);
  return response.data;
};

export const fetchDetail = async (slug) => {
  const response = await api.get(`/detail?slug=${slug}`);
  return response.data;
};

export const fetchStream = async ({ slug, se, ep, lang, quality }) => {
  const params = new URLSearchParams({ slug });
  if (se) params.append('se', se);
  if (ep) params.append('ep', ep);
  if (lang) params.append('lang', lang);
  if (quality) params.append('quality', quality);
  
  const response = await api.get(`/stream?${params.toString()}`);
  return response.data;
};

export default api;
