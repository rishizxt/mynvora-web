// =========================================================
// MYNVORA — API CLIENT
// Axios instance with JWT auto-attach + auto-refresh
// =========================================================

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const tokens = {
  get access() {
    return localStorage.getItem('mynvora_access_token');
  },
  get refresh() {
    return localStorage.getItem('mynvora_refresh_token');
  },
  set({ accessToken, refreshToken }) {
    if (accessToken) localStorage.setItem('mynvora_access_token', accessToken);
    if (refreshToken) localStorage.setItem('mynvora_refresh_token', refreshToken);
  },
  clear() {
    localStorage.removeItem('mynvora_access_token');
    localStorage.removeItem('mynvora_refresh_token');
  },
};

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = tokens.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url.includes('/auth/refresh') &&
      tokens.refresh
    ) {
      original._retry = true;

      if (!refreshing) {
        refreshing = axios
          .post(`${API_URL}/api/auth/refresh`, { refreshToken: tokens.refresh })
          .then((res) => {
            tokens.set(res.data);
            return res.data.accessToken;
          })
          .catch((err) => {
            tokens.clear();
            throw err;
          })
          .finally(() => {
            refreshing = null;
          });
      }

      try {
        const newToken = await refreshing;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_URL };