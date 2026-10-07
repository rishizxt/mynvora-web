// =========================================================
// MYNVORA — LOCATION HELPERS
// 1. Get user's GPS coords (browser API)
// 2. Reverse-geocode to city/state/country (Nominatim, free)
// =========================================================

/* ── get coords from browser ──────────────────────────── */
export function getCurrentCoords({
  timeout = 12000,
  highAccuracy = true,
} = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported on this device'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        // Map error codes to readable messages
        const messages = {
          1: 'Location permission denied',
          2: 'Location unavailable — check your GPS or network',
          3: 'Location request timed out',
        };
        reject(new Error(messages[error.code] || error.message));
      },
      {
        enableHighAccuracy: highAccuracy,
        timeout,
        maximumAge: 60000, // accept up to 1-min-old cached coords
      }
    );
  });
}

/* ── reverse-geocode via Nominatim (free, no key) ─────── */
export async function reverseGeocode(lat, lng) {
  if (lat == null || lng == null) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1&accept-language=en`;

    const res = await fetch(url, {
      headers: {
        // Nominatim requires a User-Agent identifying your app
        'User-Agent': 'Mynvora/1.0 (contact: admin@mynvora.app)',
      },
    });

    if (!res.ok) throw new Error(`Geocoder HTTP ${res.status}`);

    const data = await res.json();
    const a = data.address || {};

    const city =
      a.city ||
      a.town ||
      a.village ||
      a.suburb ||
      a.county ||
      a.state_district ||
      a.state ||
      'Unknown';

    const state = a.state || '';
    const country = a.country || '';

    return {
      city,
      state,
      country,
      full: [city, state, country].filter(Boolean).join(', '),
    };
  } catch (err) {
    console.warn('[geocode] failed:', err.message);
    return {
      city: 'Unknown',
      state: '',
      country: '',
      full: 'Location set',
    };
  }
}

/* ── combined helper ──────────────────────────────────── */
export async function getCurrentLocationWithCity() {
  const coords = await getCurrentCoords();
  const place = await reverseGeocode(coords.lat, coords.lng);
  return {
    lat: coords.lat,
    lng: coords.lng,
    accuracy: coords.accuracy,
    city: place?.city || null,
    state: place?.state || null,
    country: place?.country || null,
    full: place?.full || null,
    grantedAt: Date.now(),
  };
}

/* ── Haversine distance (km) — for client-side display ── */
export function distanceKm(lat1, lng1, lat2, lng2) {
  if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/* ── format distance for display ──────────────────────── */
export function formatDistance(km) {
  if (km == null) return null;
  if (km < 1) {
    const meters = Math.max(100, Math.round((km * 1000) / 100) * 100);
    return `${meters} m away`;
  }
  if (km < 10) return `${km} km away`;
  return `${Math.round(km)} km away`;
}

export default {
  getCurrentCoords,
  reverseGeocode,
  getCurrentLocationWithCity,
  distanceKm,
  formatDistance,
};