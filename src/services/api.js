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

export const fetchMoreContent = async (page = 1) => {
  // Rotate through generic queries to get varied content on each page
  const queries = ['movie', 'series', 'drama', 'action', 'comedy', 'thriller', 'romance', 'anime', 'horror', 'adventure'];
  const query = queries[(page - 1) % queries.length];
  const response = await api.get(`/search?q=${query}`);
  return response.data?.results || [];
};

export const fetchDetail = async (slug) => {
  const response = await api.get(`/detail?slug=${slug}`);
  return response.data;
};

export default api;
