// =========================================================
// MYNVORA — SWIPE STORE
// Tracks the main 24h swipe window (main deck + category decks
// share this quota).
// Hookups are tracked separately in userStore.
// =========================================================

import { create } from 'zustand';

const STORAGE_KEY = 'mynvora_swipes';
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

// Swipe limits per user type
const LIMITS = {
  unverified: 3,
  free: 8,
  light: Infinity,
  gold: Infinity,
  diamond: Infinity
};

// ---------------------------------------------------------
// Persistence
// ---------------------------------------------------------
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, resetAt: null };
    return JSON.parse(raw);
  } catch {
    return { count: 0, resetAt: null };
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

// Auto-reset if the 24h window has passed
function maybeReset(state) {
  if (!state.resetAt) return state;
  if (Date.now() >= state.resetAt) {
    return { count: 0, resetAt: null };
  }
  return state;
}

// ---------------------------------------------------------
// Store
// ---------------------------------------------------------
export const useSwipeStore = create((set, get) => {
  const initial = maybeReset(load());

  return {
    count: initial.count,
    resetAt: initial.resetAt,

    // Pull fresh state from storage (call on mount)
    sync: () => {
      const fresh = maybeReset(load());
      set(fresh);
    },

    // Maximum swipes allowed for a given tier + verification
    getLimit: (tier, verified) => {
      if (!verified) return LIMITS.unverified;
      return LIMITS[tier] ?? LIMITS.free;
    },

    // Are we out of swipes?
    isOut: (tier, verified) => {
      const state = maybeReset(get());
      const limit = get().getLimit(tier, verified);
      return state.count >= limit;
    },

    // How many left?
    remaining: (tier, verified) => {
      const state = maybeReset(get());
      const limit = get().getLimit(tier, verified);
      if (limit === Infinity) return Infinity;
      return Math.max(0, limit - state.count);
    },

    // Consume one swipe
    increment: () => {
      const now = Date.now();
      const state = maybeReset(get());
      const next = {
        count: state.count + 1,
        resetAt: state.resetAt || now + WINDOW_MS
      };
      save(next);
      set(next);
    },

    // Reset (debug / after upgrading to unlimited)
    reset: () => {
      const next = { count: 0, resetAt: null };
      save(next);
      set(next);
    }
  };
});