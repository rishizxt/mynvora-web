// =========================================================
// MYNVORA ADMIN — VERIFICATION DETAIL
// Full review screen. Approve / Reject / Request re-verification.
// Only Verification Admin (or Super) can act — others read-only.
// =========================================================

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getVerificationById,
  MOCK_VERIFICATIONS
} from '../../data/adminMockData.js';
import { useAdminStore } from '../../store/adminStore.js';
import {
  useAdminActionStore,
  ACTION_TYPES
} from '../../store/adminActionStore.js';
import { hasPermission } from '../../utils/permissions.js';

// ---- helpers ----
function checkColor(value) {
  if (value === 'pass' || value === true) return '#35d07f';
  if (value === 'fail') return '#ff4d67';
  if (value === 'uncertain') return '#ffb020';
  return '#777789';
}

function checkLabel(value) {
  if (value === 'pass') return 'Pass';
  if (value === 'fail') return 'Fail';
  if (value === 'uncertain') return 'Review';
  return '—';
}

export default function VerificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const admin = useAdminStore();
  const actionLog = useAdminActionStore();

  const verification =
    getVerificationById(id) || MOCK_VERIFICATIONS[0];

  const canApprove = hasPermission(admin, 'verification.approve');
  const canViewDocs = hasPermission(admin, 'verification.read');

  const [actionModal, setActionModal] = useState(null); // 'approve' | 'reject' | 'reverify'
  const [reason, setReason] = useState('');
  const [preview, setPreview] = useState(null); // image URL to show in fullscreen

  // ---- submit action ----
  const submitAction = () => {
    const actionType =
      actionModal === 'approve'
        ? ACTION_TYPES.APPROVE_VERIFICATION
        : actionModal === 'reject'
        ? ACTION_TYPES.REJECT_VERIFICATION
        : ACTION_TYPES.REQUEST_REVERIFY;

    actionLog.log({
      adminId: admin.id,
      adminName: admin.name,
      adminRole: admin.role,
      actionType,
      targetType: 'verification',
      targetId: verification.id,
      targetName: verification.userName,
      reason
    });

    alert(`${actionModal} recorded for ${verification.userName} (demo)`);
    setActionModal(null);
    setReason('');
    navigate('/admin/verification');
  };

  return (
    <div className="admin-page">
      {/* Back */}
      <button
        className="admin-back-btn"
        onClick={() => navigate('/admin/verification')}
      >
        <i className="fa-solid fa-arrow-left" /> Verification queue
      </button>

      {/* Header */}
      <div className="admin-verify-header">
        <img
          className="admin-verify-photo"
          src={verification.userPhoto}
          alt={verification.userName}
        />
        <div className="admin-verify-head-info">
          <div className="admin-user-hero-name">
            {verification.userName}
          </div>
          <div className="admin-user-hero-sub">
            {verification.id} · {verification.userId} · {verification.age} ·{' '}
            {verification.country}
          </div>
          <div className="admin-user-hero-pills">
            <span className="admin-status-pill" style={{ background: 'rgba(255,176,32,0.15)', color: '#ffb020' }}>
              <i className="fa-solid fa-clock" /> Pending review
            </span>
            <span className="admin-tier-pill" style={{ background: 'rgba(79,140,255,0.15)', color: '#4f8cff' }}>
              {verification.documentType}
            </span>
          </div>
        </div>
      </div>

      {/* Reason for review banner */}
      <div className="admin-banner warn">
        <i className="fa-solid fa-circle-info" />
        <div>
          <div className="admin-banner-title">Why this needs review</div>
          <div className="admin-banner-sub">{verification.reason}</div>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="admin-verify-grid">
        {/* Left: checks */}
        <div className="admin-info-card">
          <h3 className="admin-card-title">Automated checks</h3>

          <div className="admin-check-line">
            <div className="admin-check-line-label">
              <span className="admin-check-dot" style={{ background: checkColor(verification.checks.ageCheck) }} />
              Age
            </div>
            <span
              className="admin-check-line-value"
              style={{ color: checkColor(verification.checks.ageCheck) }}
            >
              {checkLabel(verification.checks.ageCheck)}
            </span>
          </div>

          <div className="admin-check-line">
            <div className="admin-check-line-label">
              <span className="admin-check-dot" style={{ background: checkColor(verification.checks.idAuthenticity) }} />
              ID authenticity
            </div>
            <span
              className="admin-check-line-value"
              style={{ color: checkColor(verification.checks.idAuthenticity) }}
            >
              {checkLabel(verification.checks.idAuthenticity)}
            </span>
          </div>

          <div className="admin-check-line">
            <div className="admin-check-line-label">
              <span
                className="admin-check-dot"
                style={{
                  background: verification.checks.liveness.passed
                    ? '#35d07f'
                    : '#ff4d67'
                }}
              />
              Liveness
            </div>
            <span
              className="admin-check-line-value"
              style={{
                color: verification.checks.liveness.passed
                  ? '#35d07f'
                  : '#ff4d67'
              }}
            >
              {verification.checks.liveness.passed
                ? `Pass (${Math.round(verification.checks.liveness.confidence * 100)}%)`
                : 'Failed'}
            </span>
          </div>

          <div className="admin-check-line">
            <div className="admin-check-line-label">
              <span
                className="admin-check-dot"
                style={{
                  background: verification.checks.faceMatch.passed
                    ? '#35d07f'
                    : '#ffb020'
                }}
              />
              Face match
            </div>
            <span
              className="admin-check-line-value"
              style={{
                color: verification.checks.faceMatch.passed
                  ? '#35d07f'
                  : '#ffb020'
              }}
            >
              {Math.round(verification.checks.faceMatch.similarity * 100)}% similarity
            </span>
          </div>

          <div className="admin-check-line">
            <div className="admin-check-line-label">
              <span className="admin-check-dot" style={{ background: checkColor(verification.checks.duplicate) }} />
              Duplicate account
            </div>
            <span
              className="admin-check-line-value"
              style={{ color: checkColor(verification.checks.duplicate) }}
            >
              {checkLabel(verification.checks.duplicate)}
            </span>
          </div>

          <div className="admin-check-line">
            <div className="admin-check-line-label">
              <span className="admin-check-dot" style={{ background: checkColor(verification.checks.photosSafe) }} />
              Photos safe
            </div>
            <span
              className="admin-check-line-value"
              style={{ color: checkColor(verification.checks.photosSafe) }}
            >
              {checkLabel(verification.checks.photosSafe)}
            </span>
          </div>
        </div>

        {/* Right: history */}
        <div className="admin-info-card">
          <h3 className="admin-card-title">History</h3>

          <div className="admin-info-row">
            <span className="admin-info-label">Previous violations</span>
            <span className="admin-info-value">{verification.previousViolations}</span>
          </div>

          <div className="admin-info-row">
            <span className="admin-info-label">Reports against</span>
            <span className="admin-info-value">{verification.reportsAgainst}</span>
          </div>

          <div className="admin-info-row">
            <span className="admin-info-label">Prior verification</span>
            <span className="admin-info-value">None</span>
          </div>

          <div className="admin-info-row">
            <span className="admin-info-label">Account age</span>
            <span className="admin-info-value">3 months</span>
          </div>
        </div>
      </div>

      {/* Documents */}
      {canViewDocs ? (
        <div className="admin-verify-grid">
          <div className="admin-info-card">
            <h3 className="admin-card-title">ID document</h3>
            <div className="admin-doc-grid">
              <div
                className="admin-doc-thumb"
                onClick={() => setPreview(verification.documentFront)}
              >
                <img src={verification.documentFront} alt="Document front" />
                <span className="admin-doc-label">Front</span>
              </div>
              {verification.documentBack && (
                <div
                  className="admin-doc-thumb"
                  onClick={() => setPreview(verification.documentBack)}
                >
                  <img src={verification.documentBack} alt="Document back" />
                  <span className="admin-doc-label">Back</span>
                </div>
              )}
            </div>
          </div>

          <div className="admin-info-card">
            <h3 className="admin-card-title">Liveness selfie</h3>
            <div className="admin-doc-grid">
              <div
                className="admin-doc-thumb"
                onClick={() => setPreview(verification.selfieImage)}
              >
                <img src={verification.selfieImage} alt="Selfie" />
                <span className="admin-doc-label">Selfie</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="admin-banner info">
          <i className="fa-solid fa-lock" />
          <div className="admin-banner-sub">
            Identity documents are restricted to Verification Admins.
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="admin-page-section">
        <div className="admin-section-header">
          <h3>Decide</h3>
        </div>

        {canApprove ? (
          <div className="admin-action-row">
            <button
              className="admin-btn-primary success"
              onClick={() => setActionModal('approve')}
            >
              <i className="fa-solid fa-circle-check" /> Approve verification
            </button>
            <button
              className="admin-btn-primary danger"
              onClick={() => setActionModal('reject')}
            >
              <i className="fa-solid fa-circle-xmark" /> Reject
            </button>
            <button
              className="admin-btn-ghost"
              onClick={() => setActionModal('reverify')}
            >
              <i className="fa-solid fa-rotate" /> Request re-verification
            </button>
          </div>
        ) : (
          <div className="admin-banner info">
            <i className="fa-solid fa-eye" />
            <div className="admin-banner-sub">
              Read-only. Only Verification Admins can approve or reject.
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {actionModal && (
        <div className="admin-modal-scrim" onClick={() => setActionModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              {actionModal === 'approve'
                ? 'Approve this verification?'
                : actionModal === 'reject'
                ? 'Reject this verification?'
                : 'Request re-verification?'}
            </h3>
            <p>
              {actionModal === 'approve'
                ? 'A verified badge will be granted to this user.'
                : actionModal === 'reject'
                ? 'The user will be notified and cannot re-submit for 7 days.'
                : 'The user will need to upload a new document and selfie.'}
            </p>

            <label className="admin-field">
              <span>Reason (required)</span>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  actionModal === 'approve'
                    ? 'e.g. Face match 91%, liveness verified, ID authentic'
                    : actionModal === 'reject'
                    ? 'e.g. Face mismatch, document appears edited'
                    : 'e.g. Blurry document, please re-upload'
                }
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
          <img src={preview} alt="Document preview" />
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