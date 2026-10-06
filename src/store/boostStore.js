// =========================================================
// MYNVORA — BOOST STORE
// Tracks active boost + purchase history.
// Boosts are repeatable — buy again any time after expiry.
// =========================================================

import { create } from 'zustand';

const STORAGE_KEY = 'mynvora_boost';

const DEFAULT_STATE = {
  // Timestamp (ms) when the current boost ends. null = no boost.
  activeUntil: null,

  // Purchase history (mock analytics)
  history: []
};

// ---------------------------------------------------------
// Persistence
// ---------------------------------------------------------
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;

    const parsed = { ...DEFAULT_STATE, ...JSON.parse(raw) };

    // Auto-clear expired boosts on load
    if (parsed.activeUntil && Date.now() >= parsed.activeUntil) {
      parsed.activeUntil = null;
      save(parsed);
    }

    return parsed;
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
export const useBoostStore = create((set, get) => ({
  ...load(),

  // Is a boost currently active?
  isActive: () => {
    const until = get().activeUntil;
    if (!until) return false;
    if (Date.now() >= until) {
      // auto-clear
      const next = { ...get(), activeUntil: null };
      save(next);
      set({ activeUntil: null });
      return false;
    }
    return true;
  },

  // Milliseconds remaining (or 0)
  remainingMs: () => {
    const until = get().activeUntil;
    if (!until) return 0;
    return Math.max(0, until - Date.now());
  },

  // Activate a boost for N hours
  activate: (hours) => {
    const durationMs = hours * 60 * 60 * 1000;
    const activeUntil = Date.now() + durationMs;

    const history = [
      ...(get().history || []),
      { hours, at: Date.now(), price: hours === 24 ? 149 : 299 }
    ];

    const next = { activeUntil, history };
    save(next);
    set(next);
  },

  // Cancel / clear (debug)
  clear: () => {
    const next = { ...get(), activeUntil: null };
    save(next);
    set({ activeUntil: null });
  },

  // Reset everything
  reset: () => {
    save(DEFAULT_STATE);
    set(DEFAULT_STATE);
  }
}));
