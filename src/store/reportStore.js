// =========================================================
// MYNVORA — REPORT STORE
// Captures user reports so the Admin panel can read them.
// =========================================================

import { create } from 'zustand';

const STORAGE_KEY = 'mynvora_reports';

export const REPORT_STATUS = {
  NEW: 'new',
  INVESTIGATING: 'investigating',
  WAITING: 'waiting',
  ACTION_TAKEN: 'action_taken',
  APPEALED: 'appealed',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

export const STATUS_LABELS = {
  new: 'New',
  investigating: 'Investigating',
  waiting: 'Waiting for info',
  action_taken: 'Action taken',
  appealed: 'Appealed',
  resolved: 'Resolved',
  closed: 'Closed'
};

// ---------------------------------------------------------
// Persistence
// ---------------------------------------------------------
function loadReports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReports(reports) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch {}
}

function generateReportId() {
  const n = Math.floor(Math.random() * 90000) + 10000;
  return `RPT-${n}`;
}

// ---------------------------------------------------------
// Store
// ---------------------------------------------------------
export const useReportStore = create((set, get) => ({
  reports: loadReports(),

  addReport: (payload) => {
    const {
      reportedUserId,
      reportedUserName,
      reportedUserPhoto,
      reason,
      details = '',
      reporterId = 'me',
      reporterName = 'You',
      aiRisk = null,
      evidence = []
    } = payload;

    const report = {
      id: generateReportId(),
      reportedUserId,
      reportedUserName,
      reportedUserPhoto,
      reason,
      details,
      reporterId,
      reporterName,
      aiRisk,
      evidence,
      status: REPORT_STATUS.NEW,
      assignedAdmin: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      history: [
        { at: Date.now(), action: 'created', by: reporterName }
      ]
    };

    const next = [report, ...get().reports];
    saveReports(next);
    set({ reports: next });

    return report.id;
  },

  updateStatus: (id, status, adminName = 'Admin') => {
    const next = get().reports.map((r) =>
      r.id === id
        ? {
            ...r,
            status,
            updatedAt: Date.now(),
            history: [
              ...r.history,
              { at: Date.now(), action: `status:${status}`, by: adminName }
            ]
          }
        : r
    );
    saveReports(next);
    set({ reports: next });
  },

  assignTo: (id, adminName) => {
    const next = get().reports.map((r) =>
      r.id === id
        ? {
            ...r,
            assignedAdmin: adminName,
            updatedAt: Date.now(),
            history: [
              ...r.history,
              { at: Date.now(), action: `assigned:${adminName}`, by: 'System' }
            ]
          }
        : r
    );
    saveReports(next);
    set({ reports: next });
  },

  pendingCount: () =>
    get().reports.filter(
      (r) =>
        r.status === REPORT_STATUS.NEW ||
        r.status === REPORT_STATUS.INVESTIGATING
    ).length,

  newCount: () =>
    get().reports.filter((r) => r.status === REPORT_STATUS.NEW).length,

  clearAll: () => {
    saveReports([]);
    set({ reports: [] });
  }
}));