// =========================================================
// MYNVORA ADMIN — REPORT DETAIL
// Read a single report + take action.
// Actions gated by role. Every action logged to audit trail.
// =========================================================

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useReportStore,
  REPORT_STATUS,
  STATUS_LABELS
} from '../../store/reportStore.js';
import { MOCK_REPORTS } from '../../data/adminMockData.js';
import { useAdminStore } from '../../store/adminStore.js';
import {
  useAdminActionStore,
  ACTION_TYPES
} from '../../store/adminActionStore.js';
import {
  canBanUser,
  canSuspendUser,
  hasPermission
} from '../../utils/permissions.js';

const RISK_LABELS = {
  low: 'Low',
  review: 'Review',
  high: 'High',
  critical: 'Critical'
};

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const admin = useAdminStore();
  const store = useReportStore();
  const actionLog = useAdminActionStore();

  // Use live store if present, else fallback to mock
  const report =
    store.reports.find((r) => r.id === id) ||
    MOCK_REPORTS.find((r) => r.id === id) ||
    MOCK_REPORTS[0];

  const canResolve = hasPermission(admin, 'reports.resolve');
  const canBan = canBanUser(admin);
  const canSuspend = canSuspendUser(admin);

  const [actionModal, setActionModal] = useState(null);
  const [reason, setReason] = useState('');

  const submitAction = () => {
    const actionMap = {
      dismiss: ACTION_TYPES.DISMISS_REPORT,
      warn: ACTION_TYPES.WARN_USER,
      suspend: ACTION_TYPES.SUSPEND_USER,
      ban: ACTION_TYPES.BAN_USER,
      resolve: ACTION_TYPES.RESOLVE_REPORT
    };

    actionLog.log({
      adminId: admin.id,
      adminName: admin.name,
      adminRole: admin.role,
      actionType: actionMap[actionModal] || ACTION_TYPES.RESOLVE_REPORT,
      targetType: 'report',
      targetId: report.id,
      targetName: report.reportedUserName,
      reason
    });

    // Update live store if this report exists there
    if (store.reports.find((r) => r.id === report.id)) {
      store.updateStatus(
        report.id,
        actionModal === 'dismiss'
          ? REPORT_STATUS.CLOSED
          : actionModal === 'resolve'
          ? REPORT_STATUS.RESOLVED
          : REPORT_STATUS.ACTION_TAKEN,
        admin.name
      );
    }

    alert(`${actionModal} recorded for ${report.id} (demo)`);
    setActionModal(null);
    setReason('');
    navigate('/admin/reports');
  };

  return (
    <div className="admin-page">
      {/* Back */}
      <button
        className="admin-back-btn"
        onClick={() => navigate('/admin/reports')}
      >
        <i className="fa-solid fa-arrow-left" /> All reports
      </button>

      {/* Header */}
      <div className="admin-report-header">
        <div className="admin-report-header-left">
          <div className="admin-report-id-large">{report.id}</div>

          <div className="admin-report-pills">
            <span className={`admin-risk ${report.aiRisk}`}>
              {RISK_LABELS[report.aiRisk] || 'Review'}
            </span>
            <span className={`admin-status-tag ${report.status}`}>
              {STATUS_LABELS[report.status] || report.status}
            </span>
          </div>
        </div>

        <div className="admin-report-header-right">
          <div className="admin-muted">
            Submitted {new Date(report.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="admin-report-detail-grid">
        {/* Reported user */}
        <div className="admin-info-card">
          <h3 className="admin-card-title">
            <i className="fa-solid fa-user-slash" /> Reported user
          </h3>

          <div className="admin-user-mini">
            <img
              className="admin-user-mini-photo"
              src={report.reportedUserPhoto}
              alt={report.reportedUserName}
            />
            <div className="admin-user-mini-info">
              <div className="admin-user-mini-name">
                {report.reportedUserName}
              </div>
              <div className="admin-user-mini-sub">{report.reportedUserId}</div>
            </div>
            <button
              className="admin-btn-ghost small"
              onClick={() =>
                navigate(`/admin/users/${report.reportedUserId}`)
              }
            >
              View profile
            </button>
          </div>

          <div className="admin-info-row">
            <span className="admin-info-label">Previous reports</span>
            <span
              className={`admin-info-value ${
                report.previousReports > 0 ? 'danger' : ''
              }`}
            >
              {report.previousReports || 0}
            </span>
          </div>
        </div>

        {/* Reporter */}
        <div className="admin-info-card">
          <h3 className="admin-card-title">
            <i className="fa-solid fa-user-secret" /> Reported by
          </h3>

          <div className="admin-info-row">
            <span className="admin-info-label">Reporter</span>
            <span className="admin-info-value">{report.reporterName}</span>
          </div>

          <div className="admin-info-row">
            <span className="admin-info-label">User ID</span>
            <span className="admin-info-value">{report.reporterId}</span>
          </div>
        </div>
      </div>

      {/* Reason + details */}
      <div className="admin-info-card">
        <h3 className="admin-card-title">
          <i className="fa-solid fa-flag" /> Report details
        </h3>

        <div className="admin-info-row">
          <span className="admin-info-label">Reason</span>
          <span className="admin-info-value">{report.reason}</span>
        </div>

        <div className="admin-report-details-text">
          {report.details || 'No additional details provided.'}
        </div>

        {report.evidence && report.evidence.length > 0 && (
          <div className="admin-evidence-grid">
            {report.evidence.map((e, i) => (
              <div className="admin-evidence-thumb" key={i}>
                <i className="fa-solid fa-image" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI signals */}
      <div className="admin-info-card">
        <h3 className="admin-card-title">
          <i className="fa-solid fa-robot" /> AI risk signals
        </h3>

        <div className="admin-info-row">
          <span className="admin-info-label">Overall risk</span>
          <span className={`admin-risk ${report.aiRisk}`}>
            {RISK_LABELS[report.aiRisk] || 'Review'}
          </span>
        </div>

        <div className="admin-info-row">
          <span className="admin-info-label">Prior reports</span>
          <span className="admin-info-value">
            {report.previousReports || 0}
          </span>
        </div>

        <div className="admin-info-row">
          <span className="admin-info-label">Auto-scan</span>
          <span className="admin-info-value">
            {report.aiRisk === 'critical' || report.aiRisk === 'high'
              ? 'Flagged content pattern match'
              : 'No high-risk pattern'}
          </span>
        </div>
      </div>

      {/* Actions — gated */}
      <div className="admin-page-section">
        <div className="admin-section-header">
          <h3>Take action</h3>
          <span className="admin-section-sub">
            Available to your role · {admin.role.replace('_', ' ')}
          </span>
        </div>

        {canResolve ? (
          <div className="admin-action-grid">
            <button
              className="admin-action-card"
              onClick={() => setActionModal('dismiss')}
            >
              <i
                className="fa-solid fa-circle-xmark"
                style={{ color: '#777789' }}
              />
              <div>
                <div className="admin-action-title">Dismiss</div>
                <div className="admin-action-sub">
                  No violation — close this report
                </div>
              </div>
            </button>

            <button
              className="admin-action-card"
              onClick={() => setActionModal('warn')}
            >
              <i
                className="fa-solid fa-triangle-exclamation"
                style={{ color: '#ffb020' }}
              />
              <div>
                <div className="admin-action-title">Warn user</div>
                <div className="admin-action-sub">
                  Send warning, add strike
                </div>
              </div>
            </button>

            {canSuspend && (
              <button
                className="admin-action-card"
                onClick={() => setActionModal('suspend')}
              >
                <i
                  className="fa-solid fa-clock"
                  style={{ color: '#ffb020' }}
                />
                <div>
                  <div className="admin-action-title">Suspend</div>
                  <div className="admin-action-sub">Temporary (7 days)</div>
                </div>
              </button>
            )}

            {canBan && (
              <button
                className="admin-action-card danger"
                onClick={() => setActionModal('ban')}
              >
                <i
                  className="fa-solid fa-ban"
                  style={{ color: '#ff4d67' }}
                />
                <div>
                  <div className="admin-action-title">Ban permanently</div>
                  <div className="admin-action-sub">Blocks all access</div>
                </div>
              </button>
            )}

            <button
              className="admin-action-card"
              onClick={() => setActionModal('resolve')}
            >
              <i
                className="fa-solid fa-circle-check"
                style={{ color: '#35d07f' }}
              />
              <div>
                <div className="admin-action-title">Mark resolved</div>
                <div className="admin-action-sub">
                  No further action needed
                </div>
              </div>
            </button>
          </div>
        ) : (
          <div className="admin-banner info">
            <i className="fa-solid fa-eye" />
            <div className="admin-banner-sub">
              You have read-only access to reports. Only Safety or Moderation
              Admins can resolve.
            </div>
          </div>
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
              {actionModal === 'dismiss'
                ? 'Dismiss this report?'
                : actionModal === 'warn'
                ? 'Warn the reported user?'
                : actionModal === 'suspend'
                ? 'Suspend the reported user?'
                : actionModal === 'ban'
                ? 'Ban the reported user?'
                : 'Mark this report as resolved?'}
            </h3>
            <p>
              This action will be logged in the audit trail with your reason.
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