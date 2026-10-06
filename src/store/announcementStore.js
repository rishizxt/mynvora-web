// =========================================================
// MYNVORA — ANNOUNCEMENT STORE (user app)
// Fetches Team Mynvora broadcasts from the backend.
// Tracks which ones the user has read (localStorage).
// =========================================================
import { create } from 'zustand';
import api from '../lib/api.js';

const READ_KEY = 'mynvora_announcements_read';

function loadReadIds() {
  try {
    const raw = localStorage.getItem(READ_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReadIds(ids) {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify(ids));
  } catch {}
}

/* Backend returns ISO string; AdminChatRow expects ms. */
function toMs(t) {
  if (!t) return Date.now();
  if (typeof t === 'number') return t;
  const parsed = new Date(t).getTime();
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

export const useAnnouncementStore = create((set, get) => ({
  announcements: [],
  readIds: loadReadIds(),
  loading: false,
  fetched: false,
  error: null,

  /* ── fetch list from backend ──────────────────────── */
  fetchAnnouncements: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/announcements');
      const readIds = get().readIds;
      const list = (data?.announcements || []).map((a) => ({
        id:        a.id,
        title:     a.title,
        body:      a.body,
        icon:      a.icon  || 'fa-bullhorn',
        color:     a.color || '#ff3b81',
        pinned:    !!a.pinned,
        createdAt: toMs(a.createdAt),
        read:      readIds.includes(a.id),
      }));
      set({ announcements: list, loading: false, fetched: true });
      return list;
    } catch (err) {
      set({
        loading: false,
        fetched: true,
        error: err?.response?.data?.error || err?.message || 'Failed to load',
      });
      return [];
    }
  },

  /* ── derived ──────────────────────────────────────── */
  latest: () => {
    const list = get().announcements || [];
    if (list.length === 0) return null;
    const pinned = list.find((a) => a.pinned);
    return pinned || list[0];
  },

  unreadCount: () => (get().announcements || []).filter((a) => !a.read).length,

  hasUnread: () => get().unreadCount() > 0,

  /* ── read tracking ────────────────────────────────── */
  markAllRead: () => {
    const ids = (get().announcements || []).map((a) => a.id);
    saveReadIds(ids);
    const next = (get().announcements || []).map((a) => ({ ...a, read: true }));
    set({ announcements: next, readIds: ids });
  },

  markRead: (id) => {
    if (get().readIds.includes(id)) return;
    const ids = [...get().readIds, id];
    saveReadIds(ids);
    const next = (get().announcements || []).map((a) =>
      a.id === id ? { ...a, read: true } : a
    );
    set({ announcements: next, readIds: ids });
  },

  /* ── backward-compat ──────────────────────────────── */
  add: (announcement) => {
    const entry = {
      id:        `ann_${Date.now()}`,
      icon:      'fa-bullhorn',
      color:     '#ff3b81',
      createdAt: Date.now(),
      pinned:    false,
      ...announcement,
    };
    set({ announcements: [entry, ...(get().announcements || [])] });
    return entry.id;
  },

  reset: () => {
    saveReadIds([]);
    set({ announcements: [], readIds: [] });
  },
}));