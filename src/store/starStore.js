// =========================================================
// MYNVORA — STAR STORE
// Tracks stars given out (super likes sent) to profiles.
// Complementary to userStore.starsUsed / starsPurchased.
// =========================================================

import { create } from 'zustand';

const STORAGE_KEY = 'mynvora_stars';

const DEFAULT_STATE = {
  // IDs of profiles the user has super-liked (so we don't repeat)
  superLikedIds: [],

  // History of star purchases for analytics (mock)
  purchaseHistory: []
};

// ---------------------------------------------------------
// Persistence
// ---------------------------------------------------------
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

// ---------------------------------------------------------
// Store
// ---------------------------------------------------------
export const useStarStore = create((set, get) => ({
  ...load(),

  // Mark a profile as super-liked (prevents duplicates)
  markSuperLiked: (profileId) => {
    const current = get().superLikedIds || [];
    if (current.includes(profileId)) return;

    const next = {
      ...get(),
      superLikedIds: [...current, profileId]
    };
    save(next);
    set({ superLikedIds: next.superLikedIds });
  },

  hasSuperLiked: (profileId) => {
    return (get().superLikedIds || []).includes(profileId);
  },

  // Record a purchase (for UI history, if needed)
  recordPurchase: (packId, price) => {
    const entry = {
      packId,
      price,
      at: Date.now()
    };
    const next = {
      ...get(),
      purchaseHistory: [...(get().purchaseHistory || []), entry]
    };
    save(next);
    set({ purchaseHistory: next.purchaseHistory });
  },

  // Reset (debug)
  reset: () => {
    save(DEFAULT_STATE);
    set(DEFAULT_STATE);
  }
}));