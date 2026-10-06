// =========================================================
// MYNVORA — ONBOARDING STORE
// =========================================================

import { create } from 'zustand';
import api from '../lib/api.js';

const STORAGE_KEY = 'mynvora_onboarding';

const DEFAULT_STATE = {
  houseRulesAccepted: false,
  firstName: null,
  birthday: null,
  age: null,
  gender: null,
  genderShowOnProfile: true,
  orientation: [],
  orientationShowOnProfile: true,
  interestedIn: [],
  maxDistance: 80,
  lookingFor: null,
  college: null,
  interests: [],
  photos: [],
  bio: null,
  prompts: [],
  location: null,
  locationGranted: false,
  faceCheckDone: false,
  faceCheckSkipped: false,
  tutorialSeen: false,
  onboardingComplete: false,
  swipeCount: 0,
  faceCheckNudgeShown: false,
  currentStep: 0,
  totalSwipes: 0,
  lastFeedbackAt: 0,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export const useOnboardingStore = create((set, get) => ({
  ...loadState(),

  set: (key, value) => {
    const next = { ...get(), [key]: value };
    saveState(next);
    set({ [key]: value });
  },

  update: (fields) => {
    const next = { ...get(), ...fields };
    saveState(next);
    set(fields);
  },

  markStepDone: (key) => {
    const steps = [
      'house-rules', 'first-name', 'birthday', 'gender', 'orientation',
      'interested-in', 'distance', 'looking-for', 'college', 'interests',
      'photos', 'about-me', 'location', 'face-check'
    ];
    const idx = steps.indexOf(key);
    if (idx >= get().currentStep) {
      const next = { ...get(), currentStep: idx + 1 };
      saveState(next);
      set({ currentStep: idx + 1 });
    }
  },

  completeOnboarding: () => {
    const next = { ...get(), onboardingComplete: true };
    saveState(next);
    set({ onboardingComplete: true });
  },

  completeness: () => {
    const o = get();
    let score = 0;
    let total = 0;
    const checks = [
      { ok: !!o.firstName, weight: 10 },
      { ok: !!o.birthday, weight: 10 },
      { ok: !!o.gender, weight: 10 },
      { ok: !!o.lookingFor, weight: 10 },
      { ok: o.interests && o.interests.length >= 3, weight: 15 },
      { ok: o.photos && o.photos.length >= 4, weight: 20 },
      { ok: o.photos && o.photos.length >= 6, weight: 5 },
      { ok: o.bio && o.bio.length >= 20, weight: 15 },
      { ok: !!o.locationGranted, weight: 5 }
    ];
    checks.forEach((c) => {
      total += c.weight;
      if (c.ok) score += c.weight;
    });
    return Math.round((score / total) * 100);
  },

  missingFields: () => {
    const o = get();
    const missing = [];
    if (!o.firstName) missing.push('name');
    if (!o.birthday) missing.push('birthday');
    if (!o.gender) missing.push('gender');
    if (!o.lookingFor) missing.push('looking for');
    if (!o.interests || o.interests.length < 3) missing.push('at least 3 interests');
    if (!o.photos || o.photos.length < 4) missing.push('4+ photos');
    if (!o.bio || o.bio.length < 20) missing.push('a bio');
    if (!o.locationGranted) missing.push('location');
    return missing;
  },

  incrementSwipe: () => {
    const next = {
      ...get(),
      swipeCount: (get().swipeCount || 0) + 1,
      totalSwipes: (get().totalSwipes || 0) + 1
    };
    saveState(next);
    set({ swipeCount: next.swipeCount, totalSwipes: next.totalSwipes });
    return next.swipeCount;
  },

  resetSwipeCount: () => {
    const next = { ...get(), swipeCount: 0 };
    saveState(next);
    set({ swipeCount: 0 });
  },

  markFeedbackShown: () => {
    const next = { ...get(), lastFeedbackAt: Date.now() };
    saveState(next);
    set({ lastFeedbackAt: Date.now() });
  },

  shouldShowFeedback: () => {
    const o = get();
    if (!o.totalSwipes || o.totalSwipes % 10 !== 0) return false;
    if (Date.now() - (o.lastFeedbackAt || 0) < 60000) return false;
    return true;
  },

  reset: () => {
    saveState(DEFAULT_STATE);
    set(DEFAULT_STATE);
  },
}));

// =========================================================
// Sync onboarding to backend
// =========================================================
export async function syncOnboardingToBackend(o) {
  const profile = {
    first_name: o.firstName || null,
    age: o.age || null,
    birthday: o.birthday || null,
    gender: o.gender || null,
    gender_show: o.genderShowOnProfile ?? true,
    orientation: o.orientation || [],
    orientation_show: o.orientationShowOnProfile ?? true,
    interested_in: o.interestedIn || [],
    bio: o.bio || null,
    city: o.location?.city || null,
    looking_for: o.lookingFor || null,
    max_distance_km: o.maxDistance || 80,
    location_lat: o.location?.lat ?? null,
    location_lng: o.location?.lng ?? null,
    college: o.college || null,
  };

  const interests = Array.isArray(o.interests)
    ? o.interests.filter((x) => typeof x === 'number')
    : [];

  const prompts = (o.prompts || []).map((p, i) => ({
    question: p.q,
    answer: p.a,
    position: i,
  }));

  const { data } = await api.post('/profile/onboarding', {
    profile,
    interests,
    prompts,
  });

  return data;
}