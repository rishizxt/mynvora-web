// =========================================================
// MYNVORA — CATEGORIES
// 26 categories including Hookups (Diamond-only).
// Counts come from the real backend.
// =========================================================

import api from '../lib/api.js';

export const CATEGORIES = [
  { id: 'coffee_date',     icon: '☕', name: 'Coffee Date' },
  { id: 'date_night',      icon: '🌙', name: 'Date Night' },
  { id: 'thrill_seekers',  icon: '🎲', name: 'Thrill Seekers' },
  { id: 'creatives',       icon: '🎨', name: 'Creatives' },
  { id: 'self_care',       icon: '🧘', name: 'Self Care' },
  { id: 'animal_parents',  icon: '🐾', name: 'Animal Parents' },
  { id: 'short_term',      icon: '🌊', name: 'Short-term fun' },
  { id: 'new_friends',     icon: '👋', name: 'New friends' },
  { id: 'photo_verified',  icon: '✓',  name: 'Photo Verified' },
  { id: 'wants_kids',      icon: '🍼', name: 'Wants Kids' },
  { id: 'child_free',      icon: '☁️', name: 'Child-Free' },
  { id: 'travel',          icon: '✈️', name: 'Travel' },
  { id: 'gamers',          icon: '🎮', name: 'Gamers' },
  { id: 'long_term',       icon: '💍', name: 'Long-term partner' },
  { id: 'serious',         icon: '💎', name: 'Serious commitment' },
  { id: 'binge',           icon: '📺', name: 'Binge Watchers' },
  { id: 'nature',          icon: '🌱', name: 'Nature Lovers' },
  { id: 'free_tonight',    icon: '🌃', name: 'Free Tonight' },
  { id: 'pansexual',       icon: '🏳️‍🌈', name: 'Pansexual' },
  { id: 'bisexual',        icon: '🏳️‍🌈', name: 'Bisexual' },
  { id: 'gay',             icon: '🏳️‍🌈', name: 'Gay' },
  { id: 'lesbian',         icon: '🏳️‍🌈', name: 'Lesbian' },
  { id: 'queer',           icon: '🏳️‍🌈', name: 'Queer' },
  { id: 'sporty',          icon: '💧', name: 'Sporty' },
  { id: 'foodies',         icon: '🍑', name: 'Foodies' },
  {
    id: 'hookups',
    icon: '🔥',
    name: 'Hookups',
    diamondOnly: true,      // only visible to Diamond subscribers
  },
];

// ---------------------------------------------------------
// Live counts — real backend
// ---------------------------------------------------------
export async function fetchCategoryCounts() {
  try {
    const { data } = await api.get('/explore/counts');
    return data?.counts || {};
  } catch (err) {
    console.warn('fetchCategoryCounts failed:', err.message);
    return {};
  }
}

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------
export function formatCount(n) {
  if (n === 0 || n == null) return null;
  if (n < 1000) return `${n}`;
  if (n < 10000) return `${(n / 1000).toFixed(1)}k`;
  if (n < 1000000) return `${Math.floor(n / 1000)}k`;
  return `${(n / 1000000).toFixed(1)}M`;
}

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

// Filter categories by tier (Hookups only for Diamond)
export function getVisibleCategories(tier) {
  return CATEGORIES.filter((c) => {
    if (c.diamondOnly && tier !== 'diamond') return false;
    return true;
  });
}