// =========================================================
// MYNVORA ADMIN — NOTIFICATIONS
// Send push / email / safety announcements.
// Targeting by segment, plan, verified status.
// Sensitive targeting is not exposed to unauthorized roles.
// =========================================================

import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore.js';
import {
  useAdminActionStore,
  ACTION_TYPES
} from '../../store/adminActionStore.js';
import { hasPermission } from '../../utils/permissions.js';

// ---------------------------------------------------------
// Notification types
// ---------------------------------------------------------
const TYPES = [
  { id: 'push',  label: 'Push notification', icon: 'fa-mobile-screen', color: '#4f8cff' },
  { id: 'email', label: 'Email',             icon: 'fa-envelope',      color: '#8b5cf6' },
  { id: 'safety',label: 'Safety announcement',icon: 'fa-shield-halved',color: '#ff4d67' },
  { id: 'maintenance', label: 'Maintenance',  icon: 'fa-wrench',        color: '#ffb020' },
  { id: 'verification', label: 'Verification reminder', icon: 'fa-id-card', color: '#4f8cff' },
  { id: 'subscription', label: 'Subscription promo', icon: 'fa-crown', color: '#ff3b81' }
];

// ---------------------------------------------------------
// Audience segments
// ---------------------------------------------------------
const SEGMENTS = [
  { id: 'all',         label: 'All users',       count: 184203 },
  { id: 'verified',    label: 'Verified users',  count: 42891  },
  { id: 'unverified',  label: 'Unverified',      count: 141312 },
  { id: 'teen',        label: '16–17 users',     count: 12340  },
  { id: 'adult',       label: '18+ users',       count: 171863 },
  { id: 'free',        label: 'Free tier',       count: 171714 },
  { id: 'light',       label: 'Light',           count: 6201   },
  { id: 'gold',        label: 'Gold',            count: 4102   },
  { id: 'diamond',     label: 'Diamond',         count: 2186   }
];

// ---------------------------------------------------------
// Recent notifications sent
// ---------------------------------------------------------
const RECENT = [
  {
    id: 'NTF-2041',
    type: 'safety',
    title: 'Safety update: new block tools live',
    audience: 'all',
    recipients: 184203,
    sentAt: Date.now() - 2 * 60 * 60 * 1000,
    by: 'Alex Rivera'
  },
  {
    id: 'NTF-2040',
    type: 'subscription',
    title: 'This weekend — 20% off Diamond',
    audience: 'free',
    recipients: 171714,
    sentAt: Date.now() - 28 * 60 * 60 * 1000,
    by: 'Chris Wong'
  },
  {
    id: 'NTF-2039',
    type: 'verification',
    title: 'Complete your verification today',
    audience: 'unverified',
    recipients: 141312,
    sentAt: Date.now() - 72 * 60 * 60 * 1000,
    by: 'Priya Sharma'
  },
  {
    id: 'NTF-2038',
    type: 'maintenance',
    title: 'Scheduled maintenance Sunday 2am IST',
    audience: 'all',
    recipients: 184203,
    sentAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    by: 'Alex Rivera'
  }
];

const TYPE_META = Object.fromEntries(TYPES.map((t) => [t.id, t]));

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

export default function Notifications() {
  const admin = useAdminStore();
  const actionLog = useAdminActionStore();

  const canSend = hasPermission(admin, 'notif.send');

  const [type, setType] = useState('push');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState('all');
  const [scheduled, setScheduled] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);

  const selectedSegment = SEGMENTS.find((s) => s.id === audience) || SEGMENTS[0];
  const isValid = title.trim().length > 0 && body.trim().length > 0;

  // ---- send ----
  const doSend = () => {
    actionLog.log({
      adminId: admin.id,
      adminName: admin.name,
      adminRole: admin.role,
      actionType: ACTION_TYPES.SEND_NOTIFICATION,
      targetType: 'audience',
      targetId: audience,
      targetName: selectedSegment.label,
      reason: `${type} · ${title}`
    });

    alert(
      `Sent to ${selectedSegment.label} · ${selectedSegment.count.toLocaleString()} recipients (demo)`
    );

    // Reset form
    setTitle('');
    setBody('');
    setScheduled('');
    setConfirmModal(false);
  };

  return (
    <div className="admin-page">
      {/* Read-only warning */}
      {!canSend && (
        <div className="admin-banner info">
          <i className="fa-solid fa-eye" />
          <div className="admin-banner-sub">
            Read-only. Only admins with the <code>notif.send</code> permission
            can send notifications.
          </div>
        </div>
      )}

      <div className="admin-notif-grid">
        {/* ===================== COMPOSER ===================== */}
        <div className="admin-info-card">
          <h3 className="admin-card-title">
            <i className="fa-solid fa-paper-plane" /> Compose
          </h3>

          {/* Type */}
          <label className="admin-field">
            <span>Type</span>
            <div className="admin-notif-types">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`admin-notif-type ${
                    type === t.id ? 'active' : ''
                  }`}
                  style={
                    type === t.id
                      ? {
                          borderColor: t.color,
                          background: `${t.color}18`,
                          color: '#fff'
                        }
                      : {}
                  }
                  onClick={() => setType(t.id)}
                >
                  <i className={`fa-solid ${t.icon}`} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </label>

          {/* Title */}
          <label className="admin-field">
            <span>Title (required)</span>
            <input
              className="admin-input"
              type="text"
              placeholder="e.g. New safety tools are live"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!canSend}
            />
          </label>

          {/* Body */}
          <label className="admin-field">
            <span>Message (required)</span>
            <textarea
              className="admin-textarea"
              rows={4}
              placeholder="Write the notification body..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={!canSend}
            />
          </label>

          {/* Audience */}
          <label className="admin-field">
            <span>Audience</span>
            <select
              className="admin-select wide"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              disabled={!canSend}
            >
              {SEGMENTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} · {s.count.toLocaleString()}
                </option>
              ))}
            </select>
          </label>

          {/* Scheduled */}
          <label className="admin-field">
            <span>Schedule (optional)</span>
            <input
              className="admin-input"
              type="datetime-local"
              value={scheduled}
              onChange={(e) => setScheduled(e.target.value)}
              disabled={!canSend}
            />
          </label>

          {/* Send button */}
          <button
            className="admin-btn-primary block"
            disabled={!isValid || !canSend}
            onClick={() => setConfirmModal(true)}
          >
            <i className="fa-solid fa-paper-plane" />{' '}
            {scheduled ? 'Schedule' : 'Send now'}
          </button>
        </div>

        {/* ===================== PREVIEW + RECENT ===================== */}
        <div>
          {/* Preview */}
          <div className="admin-info-card" style={{ marginBottom: 24 }}>
            <h3 className="admin-card-title">
              <i className="fa-solid fa-eye" /> Preview
            </h3>

            <div className="admin-notif-preview">
              <div
                className="admin-notif-preview-icon"
                style={{
                  background: `${TYPE_META[type].color}22`,
                  color: TYPE_META[type].color
                }}
              >
                <i className={`fa-solid ${TYPE_META[type].icon}`} />
              </div>
              <div className="admin-notif-preview-body">
                <div className="admin-notif-preview-title">
                  {title || 'Notification title'}
                </div>
                <div className="admin-notif-preview-text">
                  {body || 'Notification message goes here.'}
                </div>
                <div className="admin-notif-preview-meta">
                  <i className="fa-solid fa-user-group" />{' '}
                  {selectedSegment.label} ·{' '}
                  {selectedSegment.count.toLocaleString()} recipients
                </div>
              </div>
            </div>
          </div>

          {/* Recent */}
          <div className="admin-info-card">
            <h3 className="admin-card-title">
              <i className="fa-solid fa-clock-rotate-left" /> Recently sent
            </h3>

            <div className="admin-list-simple">
              {RECENT.map((r) => {
                const meta = TYPE_META[r.type] || TYPE_META.push;
                return (
                  <div className="admin-list-row" key={r.id}>
                    <div
                      className="admin-list-row-icon"
                      style={{
                        background: `${meta.color}22`,
                        color: meta.color
                      }}
                    >
                      <i className={`fa-solid ${meta.icon}`} />
                    </div>

                    <div className="admin-list-row-body">
                      <div className="admin-list-row-title">{r.title}</div>
                      <div className="admin-list-row-sub">
                        {r.audience} · {r.recipients.toLocaleString()}{' '}
                        recipients · by {r.by}
                      </div>
                    </div>

                    <span className="admin-muted">{timeAgo(r.sentAt)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {confirmModal && (
        <div
          className="admin-modal-scrim"
          onClick={() => setConfirmModal(false)}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              {scheduled
                ? 'Schedule this notification?'
                : 'Send this notification now?'}
            </h3>
            <p>
              You're about to send to{' '}
              <strong>{selectedSegment.label}</strong> —{' '}
              <strong>{selectedSegment.count.toLocaleString()}</strong>{' '}
              recipients. This action is logged.
            </p>

            <div className="admin-modal-info">
              <div className="admin-info-row">
                <span className="admin-info-label">Type</span>
                <span className="admin-info-value">
                  {TYPE_META[type].label}
                </span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Title</span>
                <span className="admin-info-value">{title}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Body</span>
                <span className="admin-info-value">{body}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Audience</span>
                <span className="admin-info-value">
                  {selectedSegment.label}
                </span>
              </div>
              {scheduled && (
                <div className="admin-info-row">
                  <span className="admin-info-label">Schedule</span>
                  <span className="admin-info-value">{scheduled}</span>
                </div>
              )}
            </div>

            <div className="admin-modal-actions">
              <button
                className="admin-btn-ghost"
                onClick={() => setConfirmModal(false)}
              >
                Cancel
              </button>
              <button className="admin-btn-primary" onClick={doSend}>
                {scheduled ? 'Schedule' : 'Send now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}