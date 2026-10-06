// =========================================================
// MYNVORA — USER STORE (auth + socket)
// =========================================================

import { create } from 'zustand';
import api, { tokens } from '../lib/api.js';
import { connectSocket, disconnectSocket } from '../lib/socket.js';

const STORAGE_KEY = 'mynvora_user';

const DEFAULT_USER = {
  id: null,
  publicId: null,
  name: null,
  email: null,
  phone: null,
  dob: null,
  dobLocked: false,
  ageGroup: null,
  verified: false,
  tier: 'free',
  onboardingComplete: false,
  starsPurchased: 0,
  starsUsed: 0,
  hookupSwipesUsed: 0,
  hookupsUnlimited: false,
  boostExpiresAt: null,
  deactivated: false,
  deactivatedUntil: null,
  lastDeleteRequest: null,
  deleteCooldownUntil: null,
};

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER;
    return { ...DEFAULT_USER, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER;
  }
}

function saveUser(user) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {}
}

function normalizeUser(u) {
  if (!u) return {};
  return {
    id: u.id,
    publicId: u.publicId || u.public_id,
    email: u.email,
    phone: u.phone,
    name: u.firstName || u.first_name,
    dob: u.birthday,
    verified: u.verified,
    tier: u.tier || 'free',
    ageGroup: u.ageGroup || u.age_group,
    onboardingComplete: u.onboardingComplete || u.onboarding_complete,
  };
}

export const useUserStore = create((set, get) => ({
  ...loadUser(),

  signup: async ({ email, password }) => {
    const { data } = await api.post('/auth/signup/email', { email, password });
    return data;
  },

  verifyOtp: async ({ identifier, purpose, code }) => {
    const { data } = await api.post('/auth/otp/verify', {
      identifier,
      purpose,
      code,
    });

    if (data.accessToken && data.refreshToken) {
      tokens.set(data);
      const user = normalizeUser(data.user);
      const next = { ...get(), ...user };
      saveUser(next);
      set(user);
      setTimeout(() => connectSocket(), 300);
    }
    return data;
  },

  login: async ({ identifier, password }) => {
    const { data } = await api.post('/auth/login', { identifier, password });

    if (data.accessToken && data.refreshToken) {
      tokens.set(data);
      const user = normalizeUser(data.user);
      const next = { ...get(), ...user };
      saveUser(next);
      set(user);
      setTimeout(() => connectSocket(), 300);
    }
    return data;
  },

  logout: async () => {
    try {
      if (tokens.refresh) {
        await api.post('/auth/logout', { refreshToken: tokens.refresh });
      }
    } catch {}
    disconnectSocket();
    tokens.clear();
    saveUser(DEFAULT_USER);
    set(DEFAULT_USER);
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      const user = normalizeUser(data);
      const next = { ...get(), ...user };
      saveUser(next);
      set(user);
      setTimeout(() => connectSocket(), 300);
      return user;
    } catch {
      return null;
    }
  },

  setDob: (dob) => {
    if (get().dobLocked) return;
    const next = { ...get(), dob, dobLocked: true };
    saveUser(next);
    set({ dob, dobLocked: true });
  },

  setAgeGroup: (ageGroup) => {
    const next = { ...get(), ageGroup };
    saveUser(next);
    set({ ageGroup });
  },

  setVerified: (verified) => {
    const next = { ...get(), verified };
    saveUser(next);
    set({ verified });
  },

  setTier: (tier) => {
    const next = { ...get(), tier };
    saveUser(next);
    set({ tier });
  },

  setEmail: (email) => {
    const next = { ...get(), email };
    saveUser(next);
    set({ email });
  },

  setPhone: (phone) => {
    const next = { ...get(), phone };
    saveUser(next);
    set({ phone });
  },

  addPurchasedStars: (amount) => {
    const next = { ...get(), starsPurchased: get().starsPurchased + amount };
    saveUser(next);
    set({ starsPurchased: next.starsPurchased });
  },

  consumeStar: () => {
    const next = { ...get(), starsUsed: get().starsUsed + 1 };
    saveUser(next);
    set({ starsUsed: next.starsUsed });
  },

  resetStars: () => {
    const next = { ...get(), starsPurchased: 0, starsUsed: 0 };
    saveUser(next);
    set({ starsPurchased: 0, starsUsed: 0 });
  },

  incrementHookupSwipe: () => {
    const next = { ...get(), hookupSwipesUsed: get().hookupSwipesUsed + 1 };
    saveUser(next);
    set({ hookupSwipesUsed: next.hookupSwipesUsed });
  },

  unlockHookups: () => {
    const next = { ...get(), hookupsUnlimited: true };
    saveUser(next);
    set({ hookupsUnlimited: true });
  },

  resetHookups: () => {
    const next = { ...get(), hookupSwipesUsed: 0, hookupsUnlimited: false };
    saveUser(next);
    set({ hookupSwipesUsed: 0, hookupsUnlimited: false });
  },

  activateBoost: (hours) => {
    const expiresAt = Date.now() + hours * 60 * 60 * 1000;
    const next = { ...get(), boostExpiresAt: expiresAt };
    saveUser(next);
    set({ boostExpiresAt: expiresAt });
  },

  clearBoost: () => {
    const next = { ...get(), boostExpiresAt: null };
    saveUser(next);
    set({ boostExpiresAt: null });
  },

  deactivate: (days = 7) => {
    const now = Date.now();
    const until = now + days * 24 * 60 * 60 * 1000;
    const next = {
      ...get(),
      deactivated: true,
      deactivatedUntil: until,
      lastDeleteRequest: now,
      deleteCooldownUntil: until,
    };
    saveUser(next);
    set({
      deactivated: true,
      deactivatedUntil: until,
      lastDeleteRequest: now,
      deleteCooldownUntil: until,
    });
  },

  reactivate: () => {
    const next = { ...get(), deactivated: false, deactivatedUntil: null };
    saveUser(next);
    set({ deactivated: false, deactivatedUntil: null });
  },

  markDeleteRequest: (days = 7) => {
    const now = Date.now();
    const until = now + days * 24 * 60 * 60 * 1000;
    const next = { ...get(), lastDeleteRequest: now, deleteCooldownUntil: until };
    saveUser(next);
    set({ lastDeleteRequest: now, deleteCooldownUntil: until });
  },

  reset: () => {
    disconnectSocket();
    tokens.clear();
    saveUser(DEFAULT_USER);
    set(DEFAULT_USER);
  },

  canReactivate: () => {
    const until = get().deactivatedUntil;
    if (!until) return true;
    return Date.now() >= until;
  },

  canDeleteNow: () => {
    const until = get().deleteCooldownUntil;
    if (!until) return true;
    return Date.now() >= until;
  },
}));