// =========================================================
// MYNVORA ADMIN — AUDIT LOGS
// Every sensitive admin action recorded. Search + filter.
// Read-only. Cannot be edited or deleted.
// =========================================================

import { useState, useMemo } from 'react';
import { useAdminActionStore, ACTION_TYPES } from '../../store/adminActionStore.js';
import { useAdminStore } from '../../store/adminStore.js';
import { hasPermission } from '../../utils/permissions.js';

// ---------------------------------------------------------
// Mock seed log (shows when store is empty)
// ---------------------------------------------------------
const MOCK_LOGS = [
  {
    id: 'ACT-482911',
    at: Date.now() - 3 * 60 * 1000,
    adminId: 'ADM_1001',
    adminName: 'Alex Rivera',
    adminRole: 'super_admin',
    actionType: 'APPROVE_VERIFICATION',
    targetType: 'verification',
    targetId: 'VR-82931',
    targetName: 'Mia Kapoor',
    reason: 'Face match 91%, liveness verified, ID authentic'
  },
  {
    id: 'ACT-482910',
    at: Date.now() - 12 * 60 * 1000,
    adminId: 'ADM_1003',
    adminName: 'Jordan Lee',
    adminRole: 'moderation_admin',
    actionType: 'SUSPEND_USER',
    targetType: 'user',
    targetId: 'u_8821',
    targetName: 'Emma Roy',
    reason: 'Repeated fake-photo violations (3 strikes)'
  },
  {
    id: 'ACT-482909',
    at: Date.now() - 45 * 60 * 1000,
    adminId: 'ADM_1001',
    adminName: 'Alex Rivera',
    adminRole: 'super_admin',
    actionType: 'BAN_USER',
    targetType: 'user',
    targetId: 'u_9911',
    targetName: 'Unknown',
    reason: 'Deepfake detection (96%) + impersonation'
  },
  {
    id: 'ACT-482908',
    at: Date.now() - 2 * 60 * 60 * 1000,
    adminId: 'ADM_1002',
    adminName: 'Priya Sharma',
    adminRole: 'verification_admin',
    actionType: 'REJECT_VERIFICATION',
    targetType: 'verification',
    targetId: 'VR-82930',
    targetName: 'Sofia Reyes',
    reason: 'Document tampering detected'
  },
  {
    id: 'ACT-482907',
    at: Date.now() - 4 * 60 * 60 * 1000,
    adminId: 'ADM_1004',
    adminName: 'Sam Okafor',
    adminRole: 'safety_admin',
    actionType: 'RESOLVE_REPORT',
    targetType: 'report',
    targetId: 'RPT-22909',
    targetName: 'Rushi Singh',
    reason: 'Legitimate profile confirmed, no action needed'
  },
  {
    id: 'ACT-482906',
    at: Date.now() - 6 * 60 * 60 * 1000,
    adminId: 'ADM_1006',
    adminName: 'Chris Wong',
    adminRole: 'finance_admin',
    actionType: 'ISSUE_REFUND',
    targetType: 'refund',
    targetId: 'RF-4827',
    targetName: 'Aisha Khan',
    reason: 'Approved: duplicate charge verified'
  },
  {
    id: 'ACT-482905',
    at: Date.now() - 8 * 60 * 60 * 1000,
    adminId: 'ADM_1001',
    adminName: 'Alex Rivera',
    adminRole: 'super_admin',
    actionType: 'SEND_NOTIFICATION',
    targetType: 'audience',
    targetId: 'all',
    targetName: 'All users',
    reason: 'Safety update: new block tools live'
  },
  {
    id: 'ACT-482904',
    at: Date.now() - 12 * 60 * 60 * 1000,
    adminId: 'ADM_1003',
    adminName: 'Jordan Lee',
    adminRole: 'moderation_admin',
    actionType: 'REMOVE_PHOTO',
    targetType: 'photo',
    targetId: 'ph_998',
    targetName: 'Rushi Singh',
    reason: 'Nudity 94% + user reports'
  },
  {
    id: 'ACT-482903',
    at: Date.now() - 24 * 60 * 60 * 1000,
    adminId: 'ADM_1004',
    adminName: 'Sam Okafor',
    adminRole: 'safety_admin',
    actionType: 'WARN_USER',
    targetType: 'user',
    targetId: 'u_4422',
    targetName: 'Sofia Reyes',
    reason: 'Suspicious links in chat (first warning)'
  },
  {
    id: 'ACT-482902',
    at: Date.now() - 30 * 60 * 60 * 1000,
    adminId: 'ADM_1005',
    adminName: 'Maya Singh',
    adminRole: 'support_admin',
    actionType: 'ASSIGN_REPORT',
    targetType: 'report',
    targetId: 'RPT-22908',
    targetName: 'Sofia Reyes',
    reason: 'Assigned to self for investigation'
  }
];

// ---------------------------------------------------------
// Action type metadata
// ---------------------------------------------------------
const ACTION_META = {
  SUSPEND_USER:         { color: '#ffb020', label: 'Suspend user' },
  BAN_USER:             { color: '#ff4d67', label: 'Ban user' },
  UNBAN_USER:           { color: '#35d07f', label: 'Unban user' },
  RESTORE_USER:         { color: '#35d07f', label: 'Restore user' },
  FORCE_VERIFY_USER:    { color: '#4f8cff', label: 'Force verify' },
  REQUEST_REVERIFY:     { color: '#4f8cff', label: 'Request re-verification' },
  APPROVE_VERIFICATION: { color: '#35d07f', label: 'Approve verification' },
  REJECT_VERIFICATION:  { color: '#ff4d67', label: 'Reject verification' },
  RESOLVE_REPORT:       { color: '#35d07f', label: 'Resolve report' },
  DISMISS_REPORT:       { color: '#777789', label: 'Dismiss report' },
  ASSIGN_REPORT:        { color: '#4f8cff', label: 'Assign report' },
  APPROVE_PHOTO:        { color: '#35d07f', label: 'Approve photo' },
  REJECT_PHOTO:         { color: '#ffb020', label: 'Reject photo' },
  REMOVE_PHOTO:         { color: '#ff4d67', label: 'Remove photo' },
  WARN_USER:            { color: '#ffb020', label: 'Warn user' },
  DISMISS_FLAG:         { color: '#777789', label: 'Dismiss flag' },
  ESCALATE_FLAG:        { color: '#ff4d67', label: 'Escalate flag' },
  ISSUE_REFUND:         { color: '#35d07f', label: 'Issue refund' },
  SEND_NOTIFICATION:    { color: '#4f8cff', label: 'Send notification' },
  ADD_ADMIN:            { color: '#8b5cf6', label: 'Add admin' },
  REMOVE_ADMIN:         { color: '#ff4d67', label: 'Remove admin' },
  CHANGE_ROLE:          { color: '#8b5cf6', label: 'Change role' },
  UPDATE_SETTING:       { color: '#ffb020', label: 'Update setting' }
};

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------
function timeAgo(ms) {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDate(ms) {
  return new Date(ms).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function AuditLogs() {
  const admin = useAdminStore();
  const store = useAdminActionStore();

  const canView = hasPermission(admin, 'audit.read');

  // Live store if present, else mock
  const allLogs = store.actions.length > 0 ? store.actions : MOCK_LOGS;

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [adminFilter, setAdminFilter] = useState('all');

  // ---- filter ----
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return allLogs.filter((l) => {
      if (typeFilter !== 'all' && l.actionType !== typeFilter) return false;
      if (adminFilter !== 'all' && l.adminId !== adminFilter) return false;

      if (q) {
        const match =
          l.id?.toLowerCase().includes(q) ||
          l.adminName?.toLowerCase().includes(q) ||
          l.targetName?.toLowerCase().includes(q) ||
          l.targetId?.toLowerCase().includes(q) ||
          l.reason?.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => b.at - a.at);
  }, [allLogs, query, typeFilter, adminFilter]);

  // ---- unique admins for filter ----
  const admins = useMemo(() => {
    const map = new Map();
    allLogs.forEach((l) => {
      if (l.adminId) map.set(l.adminId, l.adminName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [allLogs]);

  if (!canView) {
    return (
      <div className="admin-page">
        <div className="admin-banner info">
          <i className="fa-solid fa-lock" />
          <div className="admin-banner-sub">
            You don't have access to the audit log.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Policy banner */}
      <div className="admin-banner info">
        <i className="fa-solid fa-lock" />
        <div>
          <div className="admin-banner-title">
            Append-only · tamper-proof · retained 2 years
          </div>
          <div className="admin-banner-sub">
            Every sensitive action is recorded here. Entries cannot be edited
            or deleted. All reads are also logged.
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Search by ID, admin, target, reason..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="admin-search-clear"
              onClick={() => setQuery('')}
              aria-label="Clear"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        <div className="admin-filter-row">
          <select
            className="admin-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All actions</option>
            {Object.keys(ACTION_META).map((k) => (
              <option key={k} value={k}>
                {ACTION_META[k].label}
              </option>
            ))}
          </select>

          <select
            className="admin-select"
            value={adminFilter}
            onChange={(e) => setAdminFilter(e.target.value)}
          >
            <option value="all">All admins</option>
            {admins.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Count */}
      <div className="admin-list-count">
        {filtered.length} entr{filtered.length === 1 ? 'y' : 'ies'}
      </div>

      {/* Logs list */}
      <div className="admin-audit-list">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-regular fa-face-smile" />
            <p>No log entries match your filters</p>
          </div>
        ) : (
          filtered.map((l) => {
            const meta = ACTION_META[l.actionType] || {
              color: '#777789',
              label: l.actionType
            };

            return (
              <div className="admin-audit-row" key={l.id}>
                <div
                  className="admin-audit-bar"
                  style={{ background: meta.color }}
                />

                <div className="admin-audit-main">
                  {/* Top: ID + action + target */}
                  <div className="admin-audit-top">
                    <span className="admin-report-id">{l.id}</span>
                    <span
                      className="admin-audit-action"
                      style={{
                        background: `${meta.color}22`,
                        color: meta.color
                      }}
                    >
                      {meta.label}
                    </span>
                    {l.targetType && (
                      <span className="admin-audit-target-type">
                        {l.targetType}
                      </span>
                    )}
                  </div>

                  {/* Middle: admin → target */}
                  <div className="admin-audit-flow">
                    <span className="admin-audit-admin">
                      <i className="fa-solid fa-user-shield" /> {l.adminName}
                      <span className="admin-audit-role">
                        ({l.adminRole?.replace('_', ' ')})
                      </span>
                    </span>

                    <i className="fa-solid fa-arrow-right admin-audit-arrow" />

                    <span className="admin-audit-target">
                      {l.targetName || '—'}{' '}
                      {l.targetId && (
                        <span className="admin-audit-target-id">
                          · {l.targetId}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Reason */}
                  {l.reason && (
                    <div className="admin-audit-reason">
                      <i className="fa-solid fa-quote-left" /> {l.reason}
                    </div>
                  )}
                </div>

                {/* Right: timestamp */}
                <div className="admin-audit-time">
                  <div className="admin-audit-time-ago">{timeAgo(l.at)}</div>
                  <div className="admin-audit-time-abs">
                    {formatDate(l.at)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}