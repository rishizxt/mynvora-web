// =========================================================
// MYNVORA ADMIN — COMMUNICATION SAFETY
// Scam messages · spam · suspicious links · phone sharing ·
// harassment reports · call abuse reports.
// Role-based, case-based access. Every view is audit-logged.
// =========================================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore.js';
import {
  useAdminActionStore,
  ACTION_TYPES
} from '../../store/adminActionStore.js';
import { hasPermission } from '../../utils/permissions.js';

// ---------------------------------------------------------
// Mock communication safety events
// ---------------------------------------------------------
const MOCK_EVENTS = [
  {
    id: 'COM-2201',
    type: 'suspicious_link',
    risk: 'critical',
    fromUserId: 'u_2211',
    fromUserName: 'Rushi Singh',
    fromUserPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    toUserId: 'u_001',
    toUserName: 'Mia Kapoor',
    snippet: 'Hey check this out → bit.ly/crypto-deal',
    aiNotes: 'Link matches known scam pattern',
    detectedAt: Date.now() - 8 * 60 * 1000,
    status: 'pending'
  },
  {
    id: 'COM-2200',
    type: 'phone_sharing',
    risk: 'review',
    fromUserId: 'u_4422',
    fromUserName: 'Sofia Reyes',
    fromUserPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80',
    toUserId: 'u_1133',
    toUserName: 'Aisha Khan',
    snippet: 'My number is +91 98xxx 44xxx — WhatsApp me',
    aiNotes: 'Phone number detected before match completed',
    detectedAt: Date.now() - 45 * 60 * 1000,
    status: 'pending'
  },
  {
    id: 'COM-2199',
    type: 'scam_behavior',
    risk: 'critical',
    fromUserId: 'u_8821',
    fromUserName: 'Emma Roy',
    fromUserPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80',
    toUserId: 'u_7822',
    toUserName: 'Lena Müller',
    snippet: 'Send me ₹5000 and I will double it in 24 hours',
    aiNotes: 'Classic investment scam pattern',
    detectedAt: Date.now() - 2 * 60 * 60 * 1000,
    status: 'pending'
  },
  {
    id: 'COM-2198',
    type: 'spam',
    risk: 'review',
    fromUserId: 'u_9911',
    fromUserName: 'Unknown',
    fromUserPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    toUserId: 'u_001',
    toUserName: 'Mia Kapoor',
    snippet: 'Hi hi hi hi hi hi hi',
    aiNotes: '27 identical messages in 40 seconds',
    detectedAt: Date.now() - 4 * 60 * 60 * 1000,
    status: 'pending'
  },
  {
    id: 'COM-2197',
    type: 'harassment',
    risk: 'critical',
    fromUserId: 'u_8821',
    fromUserName: 'Emma Roy',
    fromUserPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80',
    toUserId: 'u_7822',
    toUserName: 'Lena Müller',
    snippet: 'You will regret unmatching me',
    aiNotes: 'Threatening language detected',
    detectedAt: Date.now() - 6 * 60 * 60 * 1000,
    status: 'investigating'
  },
  {
    id: 'COM-2196',
    type: 'call_abuse',
    risk: 'review',
    fromUserId: 'u_2211',
    fromUserName: 'Rushi Singh',
    fromUserPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    toUserId: 'u_1133',
    toUserName: 'Aisha Khan',
    snippet: '15 calls in 2 hours',
    aiNotes: 'Repeated calls after being blocked',
    detectedAt: Date.now() - 12 * 60 * 60 * 1000,
    status: 'pending'
  }
];

const TYPE_META = {
  suspicious_link:  { icon: 'fa-link',           label: 'Suspicious link' },
  phone_sharing:    { icon: 'fa-phone',          label: 'Phone sharing' },
  scam_behavior:    { icon: 'fa-handcuffs',      label: 'Scam behavior' },
  spam:             { icon: 'fa-envelope-open',  label: 'Spam' },
  harassment:       { icon: 'fa-triangle-exclamation', label: 'Harassment' },
  call_abuse:       { icon: 'fa-phone-volume',   label: 'Call abuse' }
};

const FILTERS = [
  { id: 'all',             label: 'All',            icon: 'fa-list' },
  { id: 'suspicious_link', label: 'Links',          icon: 'fa-link' },
  { id: 'phone_sharing',   label: 'Phone sharing',  icon: 'fa-phone' },
  { id: 'scam_behavior',   label: 'Scams',          icon: 'fa-handcuffs' },
  { id: 'spam',            label: 'Spam',           icon: 'fa-envelope-open' },
  { id: 'harassment',      label: 'Harassment',     icon: 'fa-triangle-exclamation' },
  { id: 'call_abuse',      label: 'Call abuse',     icon: 'fa-phone-volume' }
];

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

export default function CommunicationSafety() {
  const navigate = useNavigate();
  const admin = useAdminStore();
  const actionLog = useAdminActionStore();

  const canAct = hasPermission(admin, 'comms.action');

  const [filter, setFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [actionModal, setActionModal] = useState(null);
  const [reason, setReason] = useState('');

  const filtered = useMemo(() => {
    return MOCK_EVENTS.filter((e) => {
      if (filter !== 'all' && e.type !== filter) return false;
      if (riskFilter !== 'all' && e.risk !== riskFilter) return false;
      return true;
    }).sort((a, b) => {
      const order = { critical: 0, high: 1, review: 2, low: 3 };
      const aO = order[a.risk] ?? 9;
      const bO = order[b.risk] ?? 9;
      if (aO !== bO) return aO - bO;
      return b.detectedAt - a.detectedAt;
    });
  }, [filter, riskFilter]);

  const stats = {
    total: MOCK_EVENTS.length,
    critical: MOCK_EVENTS.filter((e) => e.risk === 'critical').length,
    review: MOCK_EVENTS.filter((e) => e.risk === 'review').length,
    pending: MOCK_EVENTS.filter((e) => e.status === 'pending').length
  };

  const submitAction = () => {
    const actionMap = {
      warn: ACTION_TYPES.WARN_USER,
      suspend: ACTION_TYPES.SUSPEND_USER,
      ban: ACTION_TYPES.BAN_USER,
      dismiss: ACTION_TYPES.DISMISS_FLAG
    };

    actionLog.log({
      adminId: admin.id,
      adminName: admin.name,
      adminRole: admin.role,
      actionType: actionMap[actionModal.action] || ACTION_TYPES.WARN_USER,
      targetType: 'comms_event',
      targetId: actionModal.event.id,
      targetName: actionModal.event.fromUserName,
      reason
    });

    alert(`${actionModal.action} recorded for ${actionModal.event.id} (demo)`);
    setActionModal(null);
    setReason('');
  };

  return (
    <div className="admin-page">
      {/* Stat cards */}
      <div className="admin-stat-grid four">
        <div className="admin-stat-card static">
          <div className="admin-stat-head">
            <div
              className="admin-stat-icon"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#b7b7c7' }}
            >
              <i className="fa-solid fa-comment-dots" />
            </div>
          </div>
          <div className="admin-stat-value">{stats.total}</div>
          <div className="admin-stat-label">Total events</div>
        </div>

        <div className="admin-stat-card static">
          <div className="admin-stat-head">
            <div
              className="admin-stat-icon"
              style={{ background: 'rgba(255,77,103,0.15)', color: '#ff4d67' }}
            >
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
          </div>
          <div className="admin-stat-value">{stats.critical}</div>
          <div className="admin-stat-label">Critical</div>
        </div>

        <div className="admin-stat-card static">
          <div className="admin-stat-head">
            <div
              className="admin-stat-icon"
              style={{ background: 'rgba(255,176,32,0.15)', color: '#ffb020' }}
            >
              <i className="fa-solid fa-eye" />
            </div>
          </div>
          <div className="admin-stat-value">{stats.review}</div>
          <div className="admin-stat-label">Review</div>
        </div>

        <div className="admin-stat-card static">
          <div className="admin-stat-head">
            <div
              className="admin-stat-icon"
              style={{ background: 'rgba(53,208,127,0.15)', color: '#35d07f' }}
            >
              <i className="fa-solid fa-clock" />
            </div>
          </div>
          <div className="admin-stat-value">{stats.pending}</div>
          <div className="admin-stat-label">Pending</div>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="admin-banner info">
        <i className="fa-solid fa-shield-halved" />
        <div>
          <div className="admin-banner-title">
            Case-based access only
          </div>
          <div className="admin-banner-sub">
            You can only see messages flagged by AI or reported by users.
            Every view is audit-logged. Ordinary admins cannot browse private
            conversations.
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="admin-filter-chips">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`admin-chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            <i className={`fa-solid ${f.icon}`} /> {f.label}
          </button>
        ))}
      </div>

      {/* Risk dropdown */}
      <div className="admin-toolbar">
        <div className="admin-filter-row">
          <select
            className="admin-select"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="all">All risk</option>
            <option value="critical">🔴 Critical</option>
            <option value="review">🟡 Review</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <div className="admin-list-count">
        {filtered.length} event{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* List */}
      <div className="admin-comms-list">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-regular fa-face-smile" />
            <p>No events match your filters</p>
          </div>
        ) : (
          filtered.map((e) => {
            const meta = TYPE_META[e.type] || TYPE_META.spam;

            return (
              <div className="admin-comms-card" key={e.id}>
                <div
                  className={`admin-comms-bar ${
                    e.risk === 'critical' ? 'critical' : 'review'
                  }`}
                />

                <div className="admin-comms-icon">
                  <i className={`fa-solid ${meta.icon}`} />
                </div>

                <div className="admin-comms-body">
                  <div className="admin-comms-top">
                    <span className="admin-report-id">{e.id}</span>
                    <span className="admin-flagged-category">
                      {meta.label}
                    </span>
                    <span className={`admin-risk ${e.risk}`}>
                      {e.risk === 'critical' ? 'Critical' : 'Review'}
                    </span>
                    <span className={`admin-status-tag ${e.status}`}>
                      {e.status}
                    </span>
                  </div>

                  <div className="admin-comms-users">
                    <div className="admin-flagged-user">
                      <img src={e.fromUserPhoto} alt={e.fromUserName} />
                      <div>
                        <div className="admin-flagged-user-name">
                          {e.fromUserName}
                        </div>
                        <div className="admin-flagged-user-sub">
                          {e.fromUserId}
                        </div>
                      </div>
                    </div>

                    <i className="fa-solid fa-arrow-right admin-flagged-arrow" />

                    <div className="admin-flagged-user">
                      <div>
                        <div className="admin-flagged-user-name">
                          {e.toUserName}
                        </div>
                        <div className="admin-flagged-user-sub">
                          {e.toUserId}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="admin-comms-snippet">
                    <i className="fa-solid fa-quote-left" />
                    {e.snippet}
                  </div>

                  <div className="admin-comms-meta">
                    <span>
                      <i className="fa-solid fa-robot" /> {e.aiNotes}
                    </span>
                    <span>
                      <i className="fa-solid fa-clock" /> {timeAgo(e.detectedAt)}
                    </span>
                  </div>
                </div>

                <div className="admin-comms-actions">
                  {canAct ? (
                    <>
                      <button
                        className="admin-flag-action warn"
                        onClick={() =>
                          setActionModal({ event: e, action: 'warn' })
                        }
                      >
                        Warn
                      </button>
                      <button
                        className="admin-flag-action suspend"
                        onClick={() =>
                          setActionModal({ event: e, action: 'suspend' })
                        }
                      >
                        Suspend
                      </button>
                      <button
                        className="admin-flag-action ban"
                        onClick={() =>
                          setActionModal({ event: e, action: 'ban' })
                        }
                      >
                        Ban
                      </button>
                      <button
                        className="admin-flag-action ghost"
                        onClick={() =>
                          setActionModal({ event: e, action: 'dismiss' })
                        }
                      >
                        Dismiss
                      </button>
                    </>
                  ) : (
                    <div className="admin-flagged-readonly">
                      <i className="fa-solid fa-eye" />
                      Read-only
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action modal */}
      {actionModal && (
        <div
          className="admin-modal-scrim"
          onClick={() => setActionModal(null)}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              {actionModal.action === 'warn'
                ? 'Warn this user?'
                : actionModal.action === 'suspend'
                ? 'Suspend this user?'
                : actionModal.action === 'ban'
                ? 'Ban this user?'
                : 'Dismiss this event?'}
            </h3>
            <p>
              This decision will be logged with the admin, the reason, and the
              timestamp.
            </p>

            <label className="admin-field">
              <span>Reason (required)</span>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain your decision..."
              />
            </label>

            <div className="admin-modal-actions">
              <button
                className="admin-btn-ghost"
                onClick={() => setActionModal(null)}
              >
                Cancel
              </button>
              <button
                className="admin-btn-primary"
                disabled={!reason.trim()}
                onClick={submitAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}