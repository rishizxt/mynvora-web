// =========================================================
// MYNVORA — ADMIN ACTION STORE
// Immutable audit log of every sensitive admin action.
// Never edited or deleted. Only appended.
// =========================================================

import { create } from 'zustand';

const STORAGE_KEY = 'mynvora_admin_actions';

// ---------------------------------------------------------
// Action types (expanded as we add features)
// ---------------------------------------------------------
export const ACTION_TYPES = {
  // Users
  SUSPEND_USER:        'SUSPEND_USER',
  BAN_USER:            'BAN_USER',
  UNBAN_USER:          'UNBAN_USER',
  RESTORE_USER:        'RESTORE_USER',
  FORCE_VERIFY_USER:   'FORCE_VERIFY_USER',
  REQUEST_REVERIFY:    'REQUEST_REVERIFY',

  // Verification
  APPROVE_VERIFICATION: 'APPROVE_VERIFICATION',
  REJECT_VERIFICATION:  'REJECT_VERIFICATION',

  // Reports
  RESOLVE_REPORT:      'RESOLVE_REPORT',
  DISMISS_REPORT:      'DISMISS_REPORT',
  ASSIGN_REPORT:       'ASSIGN_REPORT',

  // Moderation
  APPROVE_PHOTO:       'APPROVE_PHOTO',
  REJECT_PHOTO:        'REJECT_PHOTO',
  REMOVE_PHOTO:        'REMOVE_PHOTO',

  // Flagged content
  WARN_USER:           'WARN_USER',
  DISMISS_FLAG:        'DISMISS_FLAG',
  ESCALATE_FLAG:       'ESCALATE_FLAG',

  // Finance
  ISSUE_REFUND:        'ISSUE_REFUND',

  // Notifications
  SEND_NOTIFICATION:   'SEND_NOTIFICATION',

  // Admins
  ADD_ADMIN:           'ADD_ADMIN',
  REMOVE_ADMIN:        'REMOVE_ADMIN',
  CHANGE_ROLE:         'CHANGE_ROLE',

  // Settings
  UPDATE_SETTING:      'UPDATE_SETTING'
};

// ---------------------------------------------------------
// Persistence
// ---------------------------------------------------------
function loadActions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveActions(actions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
  } catch {}
}

// Short action ID
function generateActionId() {
  const n = Math.floor(Math.random() * 900000) + 100000;
  return `ACT-${n}`;
}

// ---------------------------------------------------------
// Store
// ---------------------------------------------------------
export const useAdminActionStore = create((set, get) => ({
  actions: loadActions(),

  // -----------------------------------------------------
  // Log an action — the only way to add to the log
  // -----------------------------------------------------
  log: ({
    adminId,
    adminName,
    adminRole,
    actionType,
    targetType = null,        // 'user' | 'report' | 'photo' | 'verification' | 'flag'
    targetId = null,
    targetName = null,
    reason = '',
    previousValue = null,
    newValue = null
  }) => {
    const entry = {
      id: generateActionId(),
      at: Date.now(),
      adminId,
      adminName,
      adminRole,
      actionType,
      targetType,
      targetId,
      targetName,
      reason,
      previousValue,
      newValue
    };

    const next = [entry, ...get().actions];
    saveActions(next);
    set({ actions: next });

    return entry.id;
  },

  // -----------------------------------------------------
  // Query
  // -----------------------------------------------------
  // Actions by admin
  byAdmin: (adminId) => {
    return get().actions.filter((a) => a.adminId === adminId);
  },

  // Actions on a specific target
  byTarget: (targetId) => {
    return get().actions.filter((a) => a.targetId === targetId);
  },

  // Actions of a specific type
  byType: (actionType) => {
    return get().actions.filter((a) => a.actionType === actionType);
  },

  // Recent N actions
  recent: (n = 50) => {
    return get().actions.slice(0, n);
  },

  // -----------------------------------------------------
  // Debug
  // -----------------------------------------------------
  clearAll: () => {
    saveActions([]);
    set({ actions: [] });
  }
}));