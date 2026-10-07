// =========================================================
// MYNVORA — useLocationRefresh
// Refreshes the user's GPS + city automatically on app open.
// Silent — never shows a prompt. Only calls the API if
// location permission is already granted by the browser.
// =========================================================

import { useEffect } from 'react';
import api from '../../lib/api.js';
import { tokens } from '../../lib/api.js';
import {
  getCurrentCoords,
  reverseGeocode,
  distanceKm,
} from '../../lib/location.js';

const LAST_REFRESH_KEY = 'mynvora_location_lastRefresh';
const COORDS_KEY       = 'mynvora_location_coords';
const MIN_REFRESH_MS   = 1000 * 60 * 30; // 30 min between auto-refreshes

/* ── read cached coords ───────────────────────────────── */
export function getCachedCoords() {
  try {
    const raw = localStorage.getItem(COORDS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCachedCoords(coords) {
  try {
    localStorage.setItem(COORDS_KEY, JSON.stringify(coords));
  } catch {}
}

/* ── check if permission already granted (best effort) ─ */
async function hasPermission() {
  if (!navigator.permissions) return true; // older browsers — try anyway
  try {
    const status = await navigator.permissions.query({ name: 'geolocation' });
    return status.state === 'granted';
  } catch {
    return true;
  }
}

/* ── main hook ────────────────────────────────────────── */
export default function useLocationRefresh() {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Only run if logged in
      if (!tokens?.access) return;

      // Don't spam — cap to once per 30 min
      const last = Number(localStorage.getItem(LAST_REFRESH_KEY) || 0);
      if (Date.now() - last < MIN_REFRESH_MS) return;

      // Silent — only if permission is already granted
      const granted = await hasPermission();
      if (!granted || cancelled) return;

      try {
        const coords = await getCurrentCoords({
          timeout: 8000,
          highAccuracy: false, // faster for background refresh
        });

        if (cancelled) return;

        const place = await reverseGeocode(coords.lat, coords.lng);

        const data = {
          lat: coords.lat,
          lng: coords.lng,
          accuracy: coords.accuracy,
          city: place?.city || null,
          state: place?.state || null,
          country: place?.country || null,
          full: place?.full || null,
          refreshedAt: Date.now(),
        };

        // Cache locally for instant access
        saveCachedCoords(data);
        localStorage.setItem(LAST_REFRESH_KEY, String(Date.now()));

        // Sync to backend silently
        try {
          await api.put('/profile/me', {
            location_lat: coords.lat,
            location_lng: coords.lng,
            city: place?.city || null,
            country: place?.country || null,
          });
          console.log('[location] refreshed:', data.city, data.country);
        } catch (err) {
          console.warn('[location] backend sync failed:', err.message);
        }
      } catch (err) {
        console.warn('[location] silent refresh skipped:', err.message);
      }
    })();

    return () => { cancelled = true; };
  }, []);
}

/* ── helper: compute distance from current user ───────── */
export function computeDistanceTo(targetLat, targetLng) {
  const me = getCachedCoords();
  if (!me?.lat || !me?.lng) return null;
  return distanceKm(me.lat, me.lng, targetLat, targetLng);
}

export const locationUtils = {
  getCachedCoords,
  computeDistanceTo,
};