// =========================================================
// MYNVORA ADMIN — FLAGGED CONTENT
// Nude / sexual / inappropriate content from:
//   - Profile photos
//   - Chat messages (images + text)
// Admin reviews and takes action.
// =========================================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore.js';
import {
  useFlaggedContentStore,
  FLAG_SOURCE,
  FLAG_CATEGORY,
  FLAG_STATUS,
  CATEGORY_LABELS,
  CONFIDENCE_LABELS
} from '../../store/flaggedContentStore.js';
import {
  useAdminActionStore,
  ACTION_TYPES
} from '../../store/adminActionStore.js';
import { MOCK_FLAGS } from '../../data/adminMockData.js';
import { hasPermission } from '../../utils/permissions.js';

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

const SOURCE_LABELS = {
  profile_photo: '📸 Profile photo',
  chat_message: '💬 Chat message',
  user_report: '🚩 User report'
};

const FILTERS = [
  { id: 'all', label: 'All', icon: 'fa-list' },
  { id: 'nudity', label: 'Nudity', icon: 'fa-eye-slash' },
  { id: 'sexual', label: 'Sexual', icon: 'fa-heart-crack' },
  { id: 'ai_generated', label: 'AI-generated', icon: 'fa-robot' },
  { id: 'deepfake', label: 'Deepfake', icon: 'fa-mask' },
  { id: 'suspicious_link', label: 'Suspicious link', icon: 'fa-link' },
  { id: 'phone_sharing', label: 'Phone shared', icon: 'fa-phone' }
];

export default function FlaggedContent() {
  const navigate = useNavigate();
  const admin = useAdminStore();
  const store = useFlaggedContentStore();
  const actionLog = useAdminActionStore();

  const canModerate = hasPermission(admin, 'flagged.action');

  // Live store or fallback to mock
  const allFlags = store.flags.length > 0 ? store.flags : MOCK_FLAGS;

  const [filter, setFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [actionModal, setActionModal] = useState(null); // { flag, action }
  const [reason, setReason] = useState('');
  const [revealed, setRevealed] = useState({});        // { [flagId]: true }
  const [preview, setPreview] = useState(null);

  // ---- filter ----
  const filtered = useMemo(() => {
    return allFlags.filter((f) => {
      if (filter !== 'all' && f.category !== filter) return false;
      if (sourceFilter !== 'all' && f.source !== sourceFilter) return false;
      return true;
    }).sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      const aO = order[a.confidence] ?? 9;
      const bO = order[b.confidence] ?? 9;
      if (aO !== bO) return aO - bO;
      return b.createdAt - a.createdAt;
    });
  }, [allFlags, filter, sourceFilter]);

  // ---- stats ----
  const stats = {
    total: allFlags.length,
    nudity: allFlags.filter((f) => f.category === 'nudity').length,
    sexual: allFlags.filter((f) => f.category === 'sexual').length,
    chat: allFlags.filter((f) => f.source === 'chat_message').length,
    profile: allFlags.filter((f) => f.source === 'profile_photo').length
  };

  // ---- toggle reveal ----
  const toggleReveal = (id) => {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ---- submit action ----
  const submitAction = () => {
    const actionMap = {
      warn: ACTION_TYPES.WARN_USER,
      remove: ACTION_TYPES.REMOVE_PHOTO,
      suspend: ACTION_TYPES.SUSPEND_USER,
      ban: ACTION_TYPES.BAN_USER,
      dismiss: ACTION_TYPES.DISMISS_FLAG
    };

    actionLog.log({
      adminId: admin.id,
      adminName: admin.name,
      adminRole: admin.role,
      actionType: actionMap[actionModal.action] || ACTION_TYPES.WARN_USER,
      targetType: 'flag',
      targetId: actionModal.flag.id,
      targetName: actionModal.flag.userName,
      reason
    });

    // Update store if it's a live flag
    if (store.flags.find((f) => f.id === actionModal.flag.id)) {
      if (actionModal.action === 'dismiss') {
        store.dismiss(actionModal.flag.id, admin.name, reason);
      } else {
        store.takeAction(
          actionModal.flag.id,
          actionModal.action,
          admin.name,
          reason
        );
      }
    }

    alert(`${actionModal.action} recorded for ${actionModal.flag.id} (demo)`);
    setActionModal(null);
    setReason('');
  };

  return (
    <div className="admin-page">
      {/* Alert banner */}
      <div className="admin-banner danger">
        <i className="fa-solid fa-fire" />
        <div>
          <div className="admin-banner-title">
            {stats.total} flagged item{stats.total !== 1 ? 's' : ''} need review
          </div>
          <div className="admin-banner-sub">
            🔞 {stats.nudity} nudity · 🚩 {stats.sexual} sexual · 💬{' '}
            {stats.chat} in chat · 📸 {stats.profile} in profile photos
          </div>
        </div>
      </div>

      {/* Category chips */}
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

      {/* Source filter */}
      <div className="admin-filter-row">
        <select
          className="admin-select"
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
        >
          <option value="all">All sources</option>
          <option value="profile_photo">Profile photos</option>
          <option value="chat_message">Chat messages</option>
          <option value="user_report">User reports</option>
        </select>
      </div>

      {/* Count */}
      <div className="admin-list-count">
        {filtered.length} item{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* List */}
      <div className="admin-flagged-list">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-regular fa-face-smile" />
            <p>No flagged content in this filter</p>
          </div>
        ) : (
          filtered.map((f) => {
            const isSensitive =
              f.category === 'nudity' || f.category === 'sexual';
            const isRevealed = revealed[f.id];

            return (
              <div className="admin-flagged-card" key={f.id}>
                {/* Left: image/preview */}
                <div
                  className={`admin-flagged-thumb ${
                    isSensitive && !isRevealed ? 'blurred' : ''
                  }`}
                  onClick={() => {
                    if (isSensitive && !isRevealed) {
                      toggleReveal(f.id);
                    } else if (f.photoUrl || f.messageImage) {
                      setPreview(f.photoUrl || f.messageImage);
                    }
                  }}
                >
                  <div className="admin-flagged-placeholder">
                    {isSensitive && !isRevealed ? (
                      <>
                        <i className="fa-solid fa-eye-slash" />
                        <span>Click to reveal</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-image" />
                        <span>Preview</span>
                      </>
                    )}
                  </div>

                  <div className="admin-flagged-overlay">
                    <span className={`admin-risk ${f.confidence}`}>
                      {CONFIDENCE_LABELS[f.confidence] || f.confidence}
                    </span>
                  </div>
                </div>

                {/* Middle: info */}
                <div className="admin-flagged-body">
                  <div className="admin-flagged-top">
                    <span className="admin-report-id">{f.id}</span>
                    <span className="admin-flagged-source">
                      {SOURCE_LABELS[f.source] || f.source}
                    </span>
                    <span className="admin-flagged-category">
                      {CATEGORY_LABELS[f.category] || f.category}
                    </span>
                  </div>

                  <div className="admin-flagged-users">
                    <div className="admin-flagged-user">
                      <img src={f.userPhoto} alt={f.userName} />
                      <div>
                        <div className="admin-flagged-user-name">
                          {f.userName}
                        </div>
                        <div className="admin-flagged-user-sub">
                          {f.userId}
                        </div>
                      </div>
                    </div>

                    {f.recipientName && (
                      <>
                        <i className="fa-solid fa-arrow-right admin-flagged-arrow" />
                        <div className="admin-flagged-user">
                          <div>
                            <div className="admin-flagged-user-name">
                              {f.recipientName}
                            </div>
                            <div className="admin-flagged-user-sub">
                              {f.recipientId}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {f.messageText && (
                    <div className="admin-flagged-message">
                      <i className="fa-solid fa-quote-left" /> {f.messageText}
                    </div>
                  )}

                  <div className="admin-flagged-notes">
                    <i className="fa-solid fa-robot" /> {f.aiNotes}
                  </div>

                  <div className="admin-flagged-meta">
                    <span>
                      <i className="fa-solid fa-clock" />{' '}
                      {timeAgo(f.createdAt)}
                    </span>
                    {f.violationsCount > 0 && (
                      <span className="admin-flagged-violations">
                        <i className="fa-solid fa-triangle-exclamation" />{' '}
                        {f.violationsCount} prior violations
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: actions */}
                <div className="admin-flagged-actions">
                  {canModerate ? (
                    <>
                      <button
                        className="admin-flag-action warn"
                        onClick={() =>
                          setActionModal({ flag: f, action: 'warn' })
                        }
                      >
                        <i className="fa-solid fa-triangle-exclamation" /> Warn
                      </button>

                      <button
                        className="admin-flag-action remove"
                        onClick={() =>
                          setActionModal({ flag: f, action: 'remove' })
                        }
                      >
                        <i className="fa-solid fa-trash" /> Remove
                      </button>

                      <button
                        className="admin-flag-action suspend"
                        onClick={() =>
                          setActionModal({ flag: f, action: 'suspend' })
                        }
                      >
                        <i className="fa-solid fa-clock" /> Suspend
                      </button>

                      <button
                        className="admin-flag-action ban"
                        onClick={() =>
                          setActionModal({ flag: f, action: 'ban' })
                        }
                      >
                        <i className="fa-solid fa-ban" /> Ban
                      </button>

                      <button
                        className="admin-flag-action ghost"
                        onClick={() =>
                          setActionModal({ flag: f, action: 'dismiss' })
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
                : actionModal.action === 'remove'
                ? 'Remove this content?'
                : actionModal.action === 'suspend'
                ? 'Suspend this user?'
                : actionModal.action === 'ban'
                ? 'Ban this user?'
                : 'Dismiss this flag?'}
            </h3>
            <p>
              {actionModal.action === 'warn'
                ? 'A warning will be sent. A strike will be added to their record.'
                : actionModal.action === 'remove'
                ? 'The content will be removed from the app and the user notified.'
                : actionModal.action === 'suspend'
                ? 'The user will lose access for 7 days.'
                : actionModal.action === 'ban'
                ? 'The user will be permanently banned. This is irreversible.'
                : 'Mark this as a false positive and close the case.'}
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

      {/* Fullscreen preview */}
      {preview && (
        <div className="admin-preview-scrim" onClick={() => setPreview(null)}>
          <img src={preview} alt="Preview" />
          <button
            className="admin-preview-close"
            onClick={(e) => {
              e.stopPropagation();
              setPreview(null);
            }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}
    </div>
  );
}