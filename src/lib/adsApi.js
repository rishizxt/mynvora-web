// =========================================================
// MYNVORA — ADS API (user app)
// Fetches active ad campaigns for the current user.
// =========================================================
import api from './api.js';

/* ── fetch active ads ──────────────────────────────────── */
export async function fetchAds({ tier = null, ageGroup = null, limit = 5 } = {}) {
  const params = {};
  if (tier)     params.tier     = tier;
  if (ageGroup) params.ageGroup = ageGroup;
  if (limit)    params.limit    = limit;

  const { data } = await api.get('/ads', { params });
  return data.ads || [];
}

/* ── fire-and-forget impression ────────────────────────── */
export function recordImpression(adId) {
  api.post(`/ads/${adId}/impression`).catch(() => {});
}

/* ── fire-and-forget click ─────────────────────────────── */
export function recordClick(adId) {
  api.post(`/ads/${adId}/click`).catch(() => {});
}

export default { fetchAds, recordImpression, recordClick };