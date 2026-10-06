// =========================================================
// MYNVORA — SETTINGS STORE
// App-wide settings: privacy, notifications, discovery.
// Persisted to localStorage.
// =========================================================

import { create } from 'zustand';

const STORAGE_KEY = 'mynvora_settings';

const DEFAULT_SETTINGS = {
  // ---- Privacy ----
  showRecentActivity: true,        // recently active status visible
  showOnlineStatus: true,          // online badge visible
  visibility: 'standard',          // 'standard' | 'incognito'
  whoCanMessage: 'matched',        // 'my_move' | 'matched'

  // ---- Notifications ----
  pushNewMatches: true,
  pushNewMessages: true,
  pushLikes: true,
  pushPromotions: false,
  emailNewMatches: true,
  emailNewMessages: false,
  emailPromotions: false,
  emailSafety: true,
  smsSecurity: true,

  // ---- Discovery ----
  ageMin: 18,
  ageMax: 35,
  maxDistance: 50,                 // km
  showFurtherIfOut: true,          // if out of profiles in range, show further
  globalMode: false,               // worldwide matching
  locationMode: 'current',         // 'current' | 'passport'
  passportCity: null,              // city if passport mode
  currentCity: 'Mumbai, India',

  // ---- Blocked contacts ----
  blockedContacts: [],             // array of emails / phones

  // ---- Web profile ----
  username: null,                  // for share link
  webProfileEnabled: false,

  // ---- Onboarding ----
  onboardingComplete: false,
  tutorialSeen: false
};

// ---------------------------------------------------------
// Persistence
// ---------------------------------------------------------
function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

// ---------------------------------------------------------
// Store
// ---------------------------------------------------------
export const useSettingsStore = create((set, get) => ({
  ...loadSettings(),

  // ---- Generic setters ----
  set: (key, value) => {
    const next = { ...get(), [key]: value };
    saveSettings(next);
    set({ [key]: value });
  },

  toggle: (key) => {
    const current = !!get()[key];
    const next = { ...get(), [key]: !current };
    saveSettings(next);
    set({ [key]: !current });
  },

  update: (fields) => {
    const next = { ...get(), ...fields };
    saveSettings(next);
    set(fields);
  },

  // ---- Privacy ----
  setVisibility: (mode) => get().set('visibility', mode),        // 'standard' | 'incognito'
  setWhoCanMessage: (mode) => get().set('whoCanMessage', mode),  // 'my_move' | 'matched'

  // ---- Discovery ----
  setAgeRange: (min, max) =>
    get().update({ ageMin: min, ageMax: max }),

  setDistance: (km) => get().set('maxDistance', km),

  setLocationMode: (mode) => get().set('locationMode', mode),

  setPassportCity: (city) =>
    get().update({ passportCity: city, locationMode: 'passport' }),

  clearPassport: () =>
    get().update({ passportCity: null, locationMode: 'current' }),

  // ---- Blocked contacts ----
  addBlockedContact: (value) => {
    const current = get().blockedContacts || [];
    if (current.includes(value)) return;
    const next = [...current, value];
    get().set('blockedContacts', next);
  },

  removeBlockedContact: (value) => {
    const current = get().blockedContacts || [];
    const next = current.filter((c) => c !== value);
    get().set('blockedContacts', next);
  },

  // ---- Web profile ----
  setUsername: (username) =>
    get().update({ username, webProfileEnabled: !!username }),

  // ---- Reset ----
  reset: () => {
    saveSettings(DEFAULT_SETTINGS);
    set(DEFAULT_SETTINGS);
  }
}));