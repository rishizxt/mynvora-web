// =========================================================
// MYNVORA — CATEGORIES
// 26 categories including Hookups (Diamond-only).
// Counts are live / dynamic.
// =========================================================

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
    diamondOnly: true      // <-- only visible to Diamond subscribers
  }
];

// ---------------------------------------------------------
// Live counts (mock — real backend later)
// ---------------------------------------------------------
export async function fetchCategoryCounts() {
  await new Promise((r) => setTimeout(r, 600));

  const counts = {};
  CATEGORIES.forEach((c) => {
    counts[c.id] = mockCount(c.id);
  });
  return counts;
}

function mockCount(id) {
  const base = {
    coffee_date: 144,
    date_night: 334,
    thrill_seekers: 602,
    creatives: 791,
    self_care: 248,
    animal_parents: 21,
    short_term: 126,
    new_friends: 277,
    photo_verified: 399,
    wants_kids: 40,
    child_free: 20,
    travel: 212,
    gamers: 242,
    long_term: 678,
    serious: 343,
    binge: 307,
    nature: 345,
    free_tonight: 190,
    pansexual: 0,
    bisexual: 28,
    gay: 7,
    lesbian: 15,
    queer: 6,
    sporty: 213,
    foodies: 676,
    hookups: 42
  }[id] || 0;

  return base + Math.floor(Math.random() * 5);
}

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------
export function formatCount(n) {
  if (n === 0) return null;
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