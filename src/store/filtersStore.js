// =========================================================
// MYNVORA — FILTERS STORE
// Single source of truth for discovery filters.
// Persisted to localStorage. Read by Discovery page (writes)
// and by Swipe / CategoryGroup (reads → sends to backend).
// =========================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULTS = {
  ageMin: 18,
  ageMax: 45,
  maxDistance: 50,      // km
  verifiedOnly: false,
  gender: 'all',        // 'all' | 'male' | 'female' | 'nonbinary'
};

export const useFiltersStore = create(
  persist(
    (set, get) => ({
      ...DEFAULTS,

      setAgeRange: (min, max) =>
        set({
          ageMin: Math.max(18, Number(min) || 18),
          ageMax: Math.max(Number(min) || 18, Number(max) || 90),
        }),

      setDistance: (km) => set({ maxDistance: Math.max(1, Number(km) || 1) }),

      setVerifiedOnly: (v) => set({ verifiedOnly: !!v }),
      toggleVerifiedOnly: () => set((s) => ({ verifiedOnly: !s.verifiedOnly })),

      setGender: (g) => set({ gender: g || 'all' }),

      reset: () => set({ ...DEFAULTS }),

      // Build a URLSearchParams string for /api/profile/discover
      toQuery: () => {
        const { ageMin, ageMax, maxDistance, verifiedOnly, gender } = get();
        const p = new URLSearchParams();
        p.set('minAge', String(ageMin));
        p.set('maxAge', String(ageMax));
        p.set('maxDistance', String(maxDistance));
        p.set('verified', String(verifiedOnly));
        if (gender && gender !== 'all') p.set('gender', gender);
        return p.toString();
      },
    }),
    { name: 'mynvora-filters' }
  )
);