// =========================================================
// MYNVORA — PROFILE STORE (real backend data)
// =========================================================

import { create } from 'zustand';
import api from '../lib/api.js';

const STORAGE_KEY = 'mynvora_profile';

const DEFAULT_PROFILE = {
  name: null,
  age: null,
  city: null,
  country: null,
  height: null,
  job: null,
  education: null,
  bio: null,
  photos: [],
  interests: [],
  lookingFor: [],
  relationshipType: null,
  languages: [],
  zodiac: null,
  loveStyle: null,
  drinking: null,
  smoking: null,
  workout: null,
  commStyle: null,
  prompts: [],
  intentions: '',
  completeness: 0,
};

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {}
}

function normalizeProfile(p) {
  if (!p) return {};
  return {
    id: p.id,
    public_id: p.public_id || p.publicId,
    name: p.first_name || p.firstName,
    age: p.age,
    birthday: p.birthday,
    gender: p.gender,
    city: p.city,
    country: p.country,
    height: p.height,
    job: p.job,
    education: p.education || p.college,
    bio: p.bio,
    photos: (p.photos || []).map((ph) =>
      typeof ph === 'string'
        ? { url: ph }
        : { id: ph.id, url: ph.url, is_main: ph.is_main }
    ),
    interests: p.interests || [],
    lookingFor: p.looking_for ? [p.looking_for] : [],
    languages: p.languages || [],
    prompts: (p.prompts || []).map((pr) => ({
      q: pr.question || pr.q,
      a: pr.answer || pr.a,
    })),
    completeness: p.completion_pct || 0,
    verified: p.verified,
    onboardingComplete: p.onboarding_complete,
    main_photo: p.main_photo || null,
  };
}

export const useProfileStore = create((set, get) => ({
  ...loadProfile(),

  // Fetch real profile from backend
  fetchProfile: async () => {
    try {
      const { data } = await api.get('/profile/me');
      const profile = normalizeProfile(data.profile || data);
      const next = { ...get(), ...profile };
      saveProfile(next);
      set(profile);
      return profile;
    } catch (err) {
      console.warn('Failed to fetch profile:', err.message);
      return null;
    }
  },

  setField: (key, value) => {
    const next = { ...get(), [key]: value };
    saveProfile(next);
    set({ [key]: value });
  },

  updateFields: (fields) => {
    const next = { ...get(), ...fields };
    saveProfile(next);
    set(fields);
  },

  // Photos
  addPhoto: (photo) => {
    const current = get().photos || [];
    if (current.length >= 6) return;
    const entry = typeof photo === 'string' ? { url: photo } : photo;
    const next = [...current, entry];
    const profile = { ...get(), photos: next };
    saveProfile(profile);
    set({ photos: next });
  },

  removePhoto: (index) => {
    const current = get().photos || [];
    const next = current.filter((_, i) => i !== index);
    const profile = { ...get(), photos: next };
    saveProfile(profile);
    set({ photos: next });
  },

  // Interests
  toggleInterest: (interest) => {
    const current = get().interests || [];
    const next = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : current.length >= 10
      ? current
      : [...current, interest];
    const profile = { ...get(), interests: next };
    saveProfile(profile);
    set({ interests: next });
  },

  reset: () => {
    saveProfile(DEFAULT_PROFILE);
    set(DEFAULT_PROFILE);
  },
}));