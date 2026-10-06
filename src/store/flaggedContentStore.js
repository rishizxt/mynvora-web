// =========================================================
// MYNVORA — FLAGGED CONTENT STORE
// Captures AI-flagged content from BOTH:
//   - Profile photos (uploaded as profile pic)
//   - Chat messages (nude / sexual / inappropriate images
//     or messages sent inside conversations)
// Admin reviews and takes action.
// =========================================================

import { create } from 'zustand';

const STORAGE_KEY = 'mynvora_flagged';

// ---------------------------------------------------------
// Source — where the flagged item came from
// ---------------------------------------------------------
export const FLAG_SOURCE = {
  PROFILE_PHOTO: 'profile_photo',
  CHAT_MESSAGE:  'chat_message',
  USER_REPORT:   'user_report'
};

// ---------------------------------------------------------
// Categories — what the AI detected
// ---------------------------------------------------------
export const FLAG_CATEGORY = {
  NUDITY:            'nudity',
  SEXUAL:            'sexual',
  AI_GENERATED:      'ai_generated',
  DEEPFAKE:          'deepfake',
  FACE_MISMATCH:     'face_mismatch',
  DUPLICATE:         'duplicate',
  IMPERSONATION:     'impersonation',
  CELEBRITY:         'celebrity',
  MINOR:             'minor',
  VIOLENCE:          'violence',
  HATE:              'hate',
  SCAM:              'scam',
  SPAM:              'spam',
  SUSPICIOUS_LINK:   'suspicious_link',
  PHONE_SHARING:     'phone_sharing',
  OTHER:             'other'
};

// ---------------------------------------------------------
// Status — lifecycle of a flagged item
// ---------------------------------------------------------
export const FLAG_STATUS = {
  PENDING:      'pending',       // needs review
  IN_REVIEW:    'in_review',     // admin looking at it
  ACTION_TAKEN: 'action_taken',  // admin acted
  DISMISSED:    'dismissed',     // false positive
  ESCALATED:    'escalated'      // sent to higher team
};

// ---------------------------------------------------------
// Confidence — AI's certainty
// ---------------------------------------------------------
export const FLAG_CONFIDENCE = {
  LOW:      'low',       // 0–40%
  MEDIUM:   'medium',    // 40–70%
  HIGH:     'high',      // 70–90%
  CRITICAL: 'critical'   // 90%+
};

// Human labels for UI
export const CATEGORY_LABELS = {
  nudity:         'Nudity',
  sexual:         'Sexual content',
  ai_generated:   'AI-generated image',
  deepfake:       'Deepfake',
  face_mismatch:  'Face mismatch',
  duplicate:      'Duplicate photo',
  impersonation:  'Impersonation',
  celebrity:      'Celebrity impersonation',
  minor:          'Minor detected',
  violence:       'Violence',
  hate:           'Hate symbols',
  scam:           'Scam / bot',
  spam:           'Spam',
  suspicious_link:'Suspicious link',
  phone_sharing:  'Phone number shared',
  other:          'Other'
};

export const CONFIDENCE_LABELS = {
  low:      'Low risk',
  medium:   'Review',
  high:     'High risk',
  critical: 'Critical'
};

// ---------------------------------------------------------
// Persistence
// ---------------------------------------------------------
function loadFlags() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFlags(flags) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
  } catch {}
}

function generateFlagId() {
  const n = Math.floor(Math.random() * 90000) + 10000;
  return `FLG-${n}`;
}

// ---------------------------------------------------------
// Store
// ---------------------------------------------------------
export const useFlaggedContentStore = create((set, get) => ({
  flags: loadFlags(),

  // -----------------------------------------------------
  // Add a flag (called by AI scanner — real backend later)
  // -----------------------------------------------------
  addFlag: (payload) => {
    const {
      source,                    // FLAG_SOURCE.*
      category,                  // FLAG_CATEGORY.*
      confidence = 'medium',     // FLAG_CONFIDENCE.*
      userId,                    // user who sent / uploaded
      userName,
      userPhoto,
      // If from chat
      recipientId = null,
      recipientName = null,
      // If from profile photo
      photoUrl = null,
      // If from chat message
      messageText = null,
      messageImage = null,
      // AI info
      aiProvider = 'Mynvora AI',
      aiNotes = '',
      // Context
      violationsCount = 0
    } = payload;

    const flag = {
      id: generateFlagId(),
      source,
      category,
      confidence,
      userId,
      userName,
      userPhoto,
      recipientId,
      recipientName,
      photoUrl,
      messageText,
      messageImage,
      aiProvider,
      aiNotes,
      violationsCount,
      status: FLAG_STATUS.PENDING,
      assignedAdmin: null,
      actionTaken: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      history: [
        {
          at: Date.now(),
          action: 'flagged',
          by: aiProvider
        }
      ]
    };

    const next = [flag, ...get().flags];
    saveFlags(next);
    set({ flags: next });

    return flag.id;
  },

  // -----------------------------------------------------
  // Admin actions
  // -----------------------------------------------------
  setStatus: (id, status, adminName = 'Admin') => {
    const next = get().flags.map((f) =>
      f.id === id
        ? {
            ...f,
            status,
            updatedAt: Date.now(),
            history: [
              ...f.history,
              { at: Date.now(), action: `status:${status}`, by: adminName }
            ]
          }
        : f
    );
    saveFlags(next);
    set({ flags: next });
  },

  assignTo: (id, adminName) => {
    const next = get().flags.map((f) =>
      f.id === id
        ? {
            ...f,
            assignedAdmin: adminName,
            updatedAt: Date.now(),
            history: [
              ...f.history,
              { at: Date.now(), action: `assigned:${adminName}`, by: 'System' }
            ]
          }
        : f
    );
    saveFlags(next);
    set({ flags: next });
  },

  takeAction: (id, action, adminName = 'Admin', notes = '') => {
    const next = get().flags.map((f) =>
      f.id === id
        ? {
            ...f,
            status: FLAG_STATUS.ACTION_TAKEN,
            actionTaken: action,      // 'warn' | 'remove' | 'suspend' | 'ban'
            updatedAt: Date.now(),
            history: [
              ...f.history,
              { at: Date.now(), action: `${action}:${notes}`, by: adminName }
            ]
          }
        : f
    );
    saveFlags(next);
    set({ flags: next });
  },

  dismiss: (id, adminName = 'Admin', reason = 'False positive') => {
    const next = get().flags.map((f) =>
      f.id === id
        ? {
            ...f,
            status: FLAG_STATUS.DISMISSED,
            updatedAt: Date.now(),
            history: [
              ...f.history,
              { at: Date.now(), action: `dismissed:${reason}`, by: adminName }
            ]
          }
        : f
    );
    saveFlags(next);
    set({ flags: next });
  },

  // -----------------------------------------------------
  // Counts for badges
  // -----------------------------------------------------
  pendingCount: () =>
    get().flags.filter((f) => f.status === FLAG_STATUS.PENDING).length,

  // Filters
  bySource: (source) => get().flags.filter((f) => f.source === source),
  byCategory: (category) => get().flags.filter((f) => f.category === category),
  byStatus: (status) => get().flags.filter((f) => f.status === status),
  byUser: (userId) => get().flags.filter((f) => f.userId === userId),

  // -----------------------------------------------------
  // Debug
  // -----------------------------------------------------
  clearAll: () => {
    saveFlags([]);
    set({ flags: [] });
  }
}));