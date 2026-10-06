// =========================================================
// MYNVORA ADMIN — USER DETAIL
// View + act on a single user. Buttons gated by role.
// =========================================================

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, MOCK_USERS } from '../../data/adminMockData.js';
import { useAdminStore } from '../../store/adminStore.js';
import { useAdminActionStore, ACTION_TYPES } from '../../store/adminActionStore.js';
import { useReportStore } from '../../store/reportStore.js';
import { useFlaggedContentStore } from '../../store/flaggedContentStore.js';
import {
  canBanUser,
  canSuspendUser,
  canApproveVerification
} from '../../utils/permissions.js';

const TIER_COLORS = {
  free:    '#777789',
  light:   '#4f8cff',
  gold:    '#ffb020',
  diamond: '#8b5cf6'
};

const STATUS_COLORS = {
  active:    '#35d07f',
  suspended: '#ffb020',
  banned:    '#ff4d67'
};

const TABS = ['Overview', 'Verification', 'Reports', 'Flagged', 'Activity'];

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const admin = useAdminStore();
  const actionLog = useAdminActionStore();
  const reports = useReportStore();
  const flags = useFlaggedContentStore();

  const user = getUserById(id) || MOCK_USERS[0];

  const [tab, setTab] = useState('Overview');
  const [actionModal, setActionModal] = useState(null);   // 'ban' | 'suspend' | 'warn' | ...
  const [reason, setReason] = useState('');

  const userReports = reports.reports.filter(
    (r) => r.reportedUserId === user.id
  );
  const userFlags = flags.flags.filter((f) => f.userId === user.id);

  // ---------- take action ----------
  const takeAction = (action) => {
    actionLog.log({
      adminId: admin.id,
      adminName: admin.name,
      adminRole: admin.role,
      actionType:
        action === 'ban'
          ? ACTION_TYPES.BAN_USER
          : action === 'suspend'
          ? ACTION_TYPES.SUSPEND_USER
          : action === 'warn'
          ? ACTION_TYPES.WARN_USER
          : action === 'restore'
          ? ACTION_TYPES.RESTORE_USER
          : ACTION_TYPES.FORCE_VERIFY_USER,
      targetType: 'user',
      targetId: user.id,
      targetName: user.name,
      reason
    });

    alert(`${action} applied to ${user.name} (demo)`);
    setActionModal(null);
    setReason('');
  };

  return (
    <div className="admin-page">
      {/* Back */}
      <button className="admin-back-btn" onClick={() => navigate('/admin/users')}>
        <i className="fa-solid fa-arrow-left" /> All users
      </button>

      {/* Profile card */}
      <div className="admin-user-hero">
        <img className="admin-user-hero-photo" src={user.photo} alt={user.name} />
        <div className="admin-user-hero-info">
          <div className="admin-user-hero-name">
            {user.name}
            {user.verified && (
              <i className="fa-solid fa-circle-check admin-user-verified" />
            )}
          </div>
          <div className="admin-user-hero-sub">
            {user.id} · {user.age} · {user.city}, {user.country}
          </div>

          <div className="admin-user-hero-pills">
            <span
              className="admin-tier-pill"
              style={{
                background: `${TIER_COLORS[user.tier]}22`,
                color: TIER_COLORS[user.tier]
              }}
            >
              <i className="fa-solid fa-crown" /> {user.tier}
            </span>
            <span
              className="admin-status-pill"
              style={{
                background: `${STATUS_COLORS[user.status]}22`,
                color: STATUS_COLORS[user.status]
              }}
            >
              {user.status}
            </span>
            {userReports.length > 0 && (
              <span className="admin-alert-pill">
                <i className="fa-solid fa-flag" /> {userReports.length} reports
              </span>
            )}
            {userFlags.length > 0 && (
              <span className="admin-alert-pill danger">
                <i className="fa-solid fa-fire" /> {userFlags.length} flags
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`admin-tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
            {t === 'Reports' && userReports.length > 0 && (
              <span className="admin-tab-badge">{userReports.length}</span>
            )}
            {t === 'Flagged' && userFlags.length > 0 && (
              <span className="admin-tab-badge danger">{userFlags.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="admin-tab-body">
        {tab === 'Overview' && (
          <div className="admin-grid-2">
            <div className="admin-info-card">
              <div className="admin-info-row">
                <span className="admin-info-label">Email</span>
                <span className="admin-info-value">{user.email}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Phone</span>
                <span className="admin-info-value">{user.phone}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Joined</span>
                <span className="admin-info-value">{user.joinedAt}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Last active</span>
                <span className="admin-info-value">{user.lastActive}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Age group</span>
                <span className="admin-info-value">
                  {user.ageGroup === 'adult' ? '18+' : '16–17'}
                </span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Verified</span>
                <span className="admin-info-value">
                  {user.verified ? '✅ Yes' : '❌ No'}
                </span>
              </div>
            </div>

            <div className="admin-info-card">
              <div className="admin-info-row">
                <span className="admin-info-label">Reports against</span>
                <span className="admin-info-value">{user.reportsAgainst}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Flagged content</span>
                <span className="admin-info-value">{user.flagsAgainst}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Account status</span>
                <span className="admin-info-value">{user.status}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Subscription</span>
                <span className="admin-info-value">{user.tier}</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'Verification' && (
          <div className="admin-info-card">
            <div className="admin-info-row">
              <span className="admin-info-label">Status</span>
              <span className="admin-info-value">
                {user.verified ? 'Verified' : 'Not verified'}
              </span>
            </div>
            <div className="admin-info-row">
              <span className="admin-info-label">Method</span>
              <span className="admin-info-value">
                Passport · Liveness · Face match
              </span>
            </div>
            <div className="admin-info-row">
              <span className="admin-info-label">Last verification</span>
              <span className="admin-info-value">2026-01-14 · Approved</span>
            </div>
          </div>
        )}

        {tab === 'Reports' && (
          <div className="admin-list-simple">
            {userReports.length === 0 ? (
              <div className="admin-empty-small">No reports against this user</div>
            ) : (
              userReports.map((r) => (
                <div
                  className="admin-list-row"
                  key={r.id}
                  onClick={() => navigate(`/admin/reports/${r.id}`)}
                >
                  <div className="admin-list-row-icon danger">
                    <i className="fa-solid fa-flag" />
                  </div>
                  <div className="admin-list-row-body">
                    <div className="admin-list-row-title">{r.reason}</div>
                    <div className="admin-list-row-sub">
                      {r.id} · by {r.reporterName}
                    </div>
                  </div>
                  <span className={`admin-risk ${r.aiRisk}`}>{r.aiRisk}</span>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'Flagged' && (
          <div className="admin-list-simple">
            {userFlags.length === 0 ? (
              <div className="admin-empty-small">No flagged content for this user</div>
            ) : (
              userFlags.map((f) => (
                <div className="admin-list-row" key={f.id}>
                  <div className="admin-list-row-icon danger">
                    <i className="fa-solid fa-fire" />
                  </div>
                  <div className="admin-list-row-body">
                    <div className="admin-list-row-title">
                      {f.category} · {f.source.replace('_', ' ')}
                    </div>
                    <div className="admin-list-row-sub">{f.id}</div>
                  </div>
                  <span className={`admin-risk ${f.confidence}`}>
                    {f.confidence}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'Activity' && (
          <div className="admin-list-simple">
            <div className="admin-list-row">
              <div className="admin-list-row-icon">
                <i className="fa-solid fa-right-to-bracket" />
              </div>
              <div className="admin-list-row-body">
                <div className="admin-list-row-title">Last login</div>
                <div className="admin-list-row-sub">{user.lastActive}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions — gated by role */}
      <div className="admin-page-section">
        <div className="admin-section-header">
          <h3>Actions</h3>
          <span className="admin-section-sub">
            Available to your role · {admin.role.replace('_', ' ')}
          </span>
        </div>

        <div className="admin-action-grid">
          <button
            className="admin-action-card"
            onClick={() => setActionModal('warn')}
          >
            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#ffb020' }} />
            <div>
              <div className="admin-action-title">Warn user</div>
              <div className="admin-action-sub">Send a warning + add note</div>
            </div>
          </button>

          {canSuspendUser(admin) && (
            <button
              className="admin-action-card"
              onClick={() => setActionModal('suspend')}
            >
              <i className="fa-solid fa-clock" style={{ color: '#ffb020' }} />
              <div>
                <div className="admin-action-title">Suspend</div>
                <div className="admin-action-sub">Temporary (7 days)</div>
              </div>
            </button>
          )}

          {canBanUser(admin) && (
            <button
              className="admin-action-card danger"
              onClick={() => setActionModal('ban')}
            >
              <i className="fa-solid fa-ban" style={{ color: '#ff4d67' }} />
              <div>
                <div className="admin-action-title">Ban permanently</div>
                <div className="admin-action-sub">Blocks all access</div>
              </div>
            </button>
          )}

          <button
            className="admin-action-card"
            onClick={() => setActionModal('restore')}
          >
            <i className="fa-solid fa-circle-check" style={{ color: '#35d07f' }} />
            <div>
              <div className="admin-action-title">Restore account</div>
              <div className="admin-action-sub">Lift suspension or ban</div>
            </div>
          </button>

          {canApproveVerification(admin) && (
            <button
              className="admin-action-card"
              onClick={() => setActionModal('reverify')}
            >
              <i className="fa-solid fa-rotate" style={{ color: '#4f8cff' }} />
              <div>
                <div className="admin-action-title">Force re-verification</div>
                <div className="admin-action-sub">Require new ID + selfie</div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Action modal */}
      {actionModal && (
        <div className="admin-modal-scrim" onClick={() => setActionModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm action</h3>
            <p>
              You're about to <strong>{actionModal}</strong> {user.name}.
              This will be logged in the audit trail.
            </p>

            <label className="admin-field">
              <span>Reason (required)</span>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why..."
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
                onClick={() => takeAction(actionModal)}
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