// =========================================================
// MYNVORA ADMIN — PHOTO MODERATION
// AI-flagged + user-reported photos.
// Actions: Approve · Reject · Request replacement · Flag.
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
// Mock photo queue
// ---------------------------------------------------------
const PHOTO_QUEUE = [
  {
    id: 'ph_998',
    userId: 'u_2211',
    userName: 'Rushi Singh',
    userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80',
    reason: 'AI nudity detection',
    category: 'nudity',
    risk: 'critical',
    confidence: 0.94,
    reportCount: 0,
    submittedAt: Date.now() - 4 * 60 * 1000,
    aiNotes: 'Explicit content detected in profile photo.'
  },
  {
    id: 'ph_997',
    userId: 'u_4422',
    userName: 'Sofia Reyes',
    userPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80',
    reason: 'AI-generated image',
    category: 'ai_generated',
    risk: 'high',
    confidence: 0.78,
    reportCount: 1,
    submittedAt: Date.now() - 45 * 60 * 1000,
    aiNotes: 'Image likely AI-generated (78% confidence).'
  },
  {
    id: 'ph_996',
    userId: 'u_9911',
    userName: 'Unknown',
    userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    reason: 'Deepfake detection',
    category: 'deepfake',
    risk: 'critical',
    confidence: 0.96,
    reportCount: 3,
    submittedAt: Date.now() - 2 * 60 * 60 * 1000,
    aiNotes: 'Face-swap artifacts detected across multiple angles.'
  },
  {
    id: 'ph_995',
    userId: 'u_8821',
    userName: 'Emma Roy',
    userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80',
    reason: 'User reported',
    category: 'other',
    risk: 'review',
    confidence: 0.55,
    reportCount: 2,
    submittedAt: Date.now() - 3 * 60 * 60 * 1000,
    aiNotes: 'User flagged as inappropriate. AI confidence low.'
  },
  {
    id: 'ph_994',
    userId: 'u_1133',
    userName: 'Aisha Khan',
    userPhoto: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80',
    reason: 'Duplicate photo',
    category: 'duplicate',
    risk: 'review',
    confidence: 0.68,
    reportCount: 0,
    submittedAt: Date.now() - 6 * 60 * 60 * 1000,
    aiNotes: 'Photo matches existing user in database.'
  }
];

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------
const CATEGORY_LABELS = {
  nudity: 'Nudity',
  sexual: 'Sexual content',
  ai_generated: 'AI-generated',
  deepfake: 'Deepfake',
  duplicate: 'Duplicate photo',
  other_person: "Someone else's photo",
  celebrity: 'Celebrity photo',
  screenshot: 'Screenshot',
  manipulated: 'Manipulated',
  other: 'Other'
};

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

export default function PhotoModeration() {
  const navigate = useNavigate();
  const admin = useAdminStore();
  const actionLog = useAdminActionStore();

  const canModerate = hasPermission(admin, 'moderation.action');

  const [category, setCategory] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [actionModal, setActionModal] = useState(null); // { item, action }
  const [reason, setReason] = useState('');
  const [zoom, setZoom] = useState(null);

  const filtered = useMemo(() => {
    return PHOTO_QUEUE.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (riskFilter !== 'all' && p.risk !== riskFilter) return false;
      return true;
    }).sort((a, b) => {
      const order = { critical: 0, high: 1, review: 2, low: 3 };
      const aO = order[a.risk] ?? 9;
      const bO = order[b.risk] ?? 9;
      if (aO !== bO) return aO - bO;
      return b.submittedAt - a.submittedAt;
    });
  }, [category, riskFilter]);

  const submitAction = () => {
    actionLog.log({
      adminId: admin.id,
      adminName: admin.name,
      adminRole: admin.role,
      actionType:
        actionModal.action === 'approve'
          ? ACTION_TYPES.APPROVE_PHOTO
          : actionModal.action === 'reject'
          ? ACTION_TYPES.REJECT_PHOTO
          : ACTION_TYPES.REMOVE_PHOTO,
      targetType: 'photo',
      targetId: actionModal.item.id,
      targetName: actionModal.item.userName,
      reason
    });

    alert(
      `${actionModal.action} applied to ${actionModal.item.id} (demo)`
    );
    setActionModal(null);
    setReason('');
  };

  return (
    <div className="admin-page">
      {/* Alert banner */}
      <div className="admin-banner danger">
        <i className="fa-solid fa-triangle-exclamation" />
        <div>
          <div className="admin-banner-title">
            {PHOTO_QUEUE.length} photos need review
          </div>
          <div className="admin-banner-sub">
            Includes AI-detected nudity, deepfakes, AI-generated, and
            user-reported content.
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-toolbar">
        <div className="admin-filter-row">
          <select
            className="admin-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All categories</option>
            <option value="nudity">Nudity</option>
            <option value="sexual">Sexual content</option>
            <option value="ai_generated">AI-generated</option>
            <option value="deepfake">Deepfake</option>
            <option value="duplicate">Duplicate</option>
            <option value="other">Other</option>
          </select>

          <select
            className="admin-select"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="all">All risk</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="review">🟡 Review</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <div className="admin-list-count">
        {filtered.length} photo{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="admin-empty">
          <i className="fa-regular fa-face-smile" />
          <p>No photos match your filters</p>
        </div>
      ) : (
        <div className="admin-photo-grid">
          {filtered.map((p) => (
            <div className="admin-photo-card" key={p.id}>
              {/* Photo (blurred if nudity/critical) */}
              <div
                className={`admin-photo-thumb ${
                  p.category === 'nudity' || p.category === 'sexual'
                    ? 'blurred'
                    : ''
                }`}
                onClick={() => setZoom(p.photoUrl)}
              >
                <img src={p.photoUrl} alt={p.id} />

                <div className="admin-photo-overlay">
                  <span className={`admin-risk ${p.risk}`}>
                    {p.risk === 'critical'
                      ? 'CRITICAL'
                      : p.risk === 'high'
                      ? 'HIGH'
                      : p.risk === 'review'
                      ? 'REVIEW'
                      : 'LOW'}
                  </span>
                  {p.confidence && (
                    <span className="admin-photo-confidence">
                      {Math.round(p.confidence * 100)}%
                    </span>
                  )}
                </div>

                {(p.category === 'nudity' || p.category === 'sexual') && (
                  <div className="admin-photo-blur-label">
                    <i className="fa-solid fa-eye-slash" /> Click to reveal
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="admin-photo-body">
                <div className="admin-photo-id">{p.id}</div>

                <div className="admin-photo-user">
                  <img src={p.userPhoto} alt={p.userName} />
                  <span>{p.userName}</span>
                </div>

                <div className="admin-photo-category">
                  <i className="fa-solid fa-tag" />{' '}
                  {CATEGORY_LABELS[p.category] || p.category}
                </div>

                <div className="admin-photo-reason">{p.reason}</div>

                {p.reportCount > 0 && (
                  <div className="admin-photo-reports">
                    <i className="fa-solid fa-flag" /> {p.reportCount} user
                    reports
                  </div>
                )}

                <div className="admin-photo-time">
                  {timeAgo(p.submittedAt)}
                </div>

                {/* Actions */}
                {canModerate ? (
                  <div className="admin-photo-actions">
                    <button
                      className="admin-photo-btn approve"
                      onClick={() =>
                        setActionModal({ item: p, action: 'approve' })
                      }
                      title="Approve"
                    >
                      <i className="fa-solid fa-check" />
                    </button>
                    <button
                      className="admin-photo-btn reject"
                      onClick={() =>
                        setActionModal({ item: p, action: 'reject' })
                      }
                      title="Reject"
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                    <button
                      className="admin-photo-btn danger"
                      onClick={() =>
                        setActionModal({ item: p, action: 'remove' })
                      }
                      title="Remove + strike"
                    >
                      <i className="fa-solid fa-ban" />
                    </button>
                  </div>
                ) : (
                  <div className="admin-photo-readonly">
                    <i className="fa-solid fa-eye" /> Read-only
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action modal */}
      {actionModal && (
        <div
          className="admin-modal-scrim"
          onClick={() => setActionModal(null)}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              {actionModal.action === 'approve'
                ? 'Approve this photo?'
                : actionModal.action === 'reject'
                ? 'Reject this photo?'
                : 'Remove + issue strike?'}
            </h3>
            <p>
              {actionModal.action === 'approve'
                ? 'This photo will be published on their profile.'
                : actionModal.action === 'reject'
                ? 'The user will be asked to upload a different photo.'
                : 'The photo will be removed and a strike will be issued. Repeat violations may trigger suspension or ban.'}
            </p>

            <label className="admin-field">
              <span>Reason (required)</span>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the decision..."
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

      {/* Fullscreen zoom */}
      {zoom && (
        <div className="admin-preview-scrim" onClick={() => setZoom(null)}>
          <img src={zoom} alt="Photo preview" />
          <button
            className="admin-preview-close"
            onClick={(e) => {
              e.stopPropagation();
              setZoom(null);
            }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}
    </div>
  );
}