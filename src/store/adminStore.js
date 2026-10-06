// =========================================================
// MYNVORA — ADMIN STORE
// Holds the currently-logged-in admin + their role.
// Role determines which permissions they have.
// =========================================================

import { create } from 'zustand';
import { ROLES } from '../data/adminRoles.js';

const STORAGE_KEY = 'mynvora_admin';

const DEFAULT_ADMIN = {
  id: 'ADM_1001',
  name: 'Alex Rivera',
  email: 'alex@mynvora.app',
  role: 'super_admin',       // default demo role
  avatar: null,
  loggedIn: false,           // demo — set to true on login
  lastLoginAt: null
};

// ---------------------------------------------------------
// Persistence
// ---------------------------------------------------------
function loadAdmin() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ADMIN;
    return { ...DEFAULT_ADMIN, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ADMIN;
  }
}

function saveAdmin(admin) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
  } catch {}
}

// ---------------------------------------------------------
// Store
// ---------------------------------------------------------
export const useAdminStore = create((set, get) => ({
  ...loadAdmin(),

  // Demo login — sets role and marks admin as logged in
  login: (roleId = 'super_admin') => {
    const role = ROLES[roleId] || ROLES.super_admin;
    const admin = {
      ...get(),
      role: roleId,
      name: role.demoName || 'Admin',
      loggedIn: true,
      lastLoginAt: Date.now()
    };
    saveAdmin(admin);
    set(admin);
  },

  // Logout — clears login flag (keeps preferences)
  logout: () => {
    const admin = { ...get(), loggedIn: false };
    saveAdmin(admin);
    set({ loggedIn: false });
  },

  // Switch role on the fly (for testing)
  setRole: (roleId) => {
    const role = ROLES[roleId];
    if (!role) return;
    const admin = { ...get(), role: roleId, name: role.demoName || 'Admin' };
    saveAdmin(admin);
    set({ role: roleId, name: admin.name });
  },

  // Get current role object
  getRole: () => {
    return ROLES[get().role] || ROLES.super_admin;
  },

  // Reset for demo
  reset: () => {
    saveAdmin(DEFAULT_ADMIN);
    set(DEFAULT_ADMIN);
  }
}));