// =========================================================
// MYNVORA ADMIN — ADMINS & ROLES
// Manage team + assign granular permissions.
// Only Super Admin can view this section.
// =========================================================

import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore.js';
import {
  useAdminActionStore,
  ACTION_TYPES
} from '../../store/adminActionStore.js';
import { ROLES, getAllRoles, PERMISSIONS } from '../../data/adminRoles.js';
import { hasPermission } from '../../utils/permissions.js';

// ---------------------------------------------------------
// Mock admin team
// ---------------------------------------------------------
const TEAM = [
  {
    id: 'ADM_1001',
    name: 'Alex Rivera',
    email: 'alex@mynvora.app',
    role: 'super_admin',
    joinedAt: '2025-12-01',
    lastActive: 'now',
    actions: 1240
  },
  {
    id: 'ADM_1002',
    name: 'Priya Sharma',
    email: 'priya@mynvora.app',
    role: 'verification_admin',
    joinedAt: '2026-01-12',
    lastActive: '18m ago',
    actions: 8420
  },
  {
    id: 'ADM_1003',
    name: 'Jordan Lee',
    email: 'jordan@mynvora.app',
    role: 'moderation_admin',
    joinedAt: '2026-02-08',
    lastActive: '5m ago',
    actions: 4210
  },
  {
    id: 'ADM_1004',
    name: 'Sam Okafor',
    email: 'sam@mynvora.app',
    role: 'safety_admin',
    joinedAt: '2026-03-14',
    lastActive: '2h ago',
    actions: 2180
  },
  {
    id: 'ADM_1005',
    name: 'Maya Singh',
    email: 'maya@mynvora.app',
    role: 'support_admin',
    joinedAt: '2026-04-22',
    lastActive: '1d ago',
    actions: 1540
  },
  {
    id: 'ADM_1006',
    name: 'Chris Wong',
    email: 'chris@mynvora.app',
    role: 'finance_admin',
    joinedAt: '2026-02-25',
    lastActive: '3h ago',
    actions: 612
  },
  {
    id: 'ADM_1007',
    name: 'Riya Patel',
    email: 'riya@mynvora.app',
    role: 'analytics_admin',
    joinedAt: '2026-05-10',
    lastActive: '6h ago',
    actions: 320
  },
  {
    id: 'ADM_1008',
    name: 'Noor Hassan',
    email: 'noor@mynvora.app',
    role: 'content_admin',
    joinedAt: '2026-06-01',
    lastActive: '2d ago',
    actions: 148
  }
];

// ---------------------------------------------------------
// Permissions grouped for the role editor
// ---------------------------------------------------------
const PERMISSION_GROUPS = [
  {
    group: 'Users',
    permissions: [
      { id: 'users.read',    label: 'View users' },
      { id: 'users.edit',    label: 'Edit profiles' },
      { id: 'users.suspend', label: 'Suspend' },
      { id: 'users.ban',     label: 'Ban' },
      { id: 'users.restore', label: 'Restore' }
    ]
  },
  {
    group: 'Verification',
    permissions: [
      { id: 'verification.read',    label: 'View verifications' },
      { id: 'verification.approve', label: 'Approve' },
      { id: 'verification.reject',  label: 'Reject' }
    ]
  },
  {
    group: 'Moderation',
    permissions: [
      { id: 'moderation.read',   label: 'View moderation' },
      { id: 'moderation.action', label: 'Take action' }
    ]
  },
  {
    group: 'Reports',
    permissions: [
      { id: 'reports.read',    label: 'View reports' },
      { id: 'reports.resolve', label: 'Resolve' }
    ]
  },
  {
    group: 'Flagged Content',
    permissions: [
      { id: 'flagged.read',   label: 'View flagged content' },
      { id: 'flagged.action', label: 'Take action' }
    ]
  },
  {
    group: 'AI Safety',
    permissions: [
      { id: 'ai.read',   label: 'View AI detections' },
      { id: 'ai.action', label: 'Take action' }
    ]
  },
  {
    group: 'Communication Safety',
    permissions: [
      { id: 'comms.read',   label: 'View comms events' },
      { id: 'comms.action', label: 'Take action' }
    ]
  },
  {
    group: 'Age Safety',
    permissions: [
      { id: 'agesafety.read',   label: 'View age data' },
      { id: 'agesafety.action', label: 'Take action' }
    ]
  },
  {
    group: 'Finance',
    permissions: [
      { id: 'subs.read',      label: 'View subscriptions' },
      { id: 'subs.manage',    label: 'Manage plans' },
      { id: 'finance.read',   label: 'View finance' },
      { id: 'refunds.manage', label: 'Issue refunds' }
    ]
  },
  {
    group: 'Platform',
    permissions: [
      { id: 'analytics.read',  label: 'View analytics' },
      { id: 'notif.read',      label: 'View notifications' },
      { id: 'notif.send',      label: 'Send notifications' },
      { id: 'audit.read',      label: 'View audit logs' },
      { id: 'admins.read',     label: 'View admins' },
      { id: 'admins.manage',   label: 'Manage admins' },
      { id: 'settings.read',   label: 'View settings' },
      { id: 'settings.manage', label: 'Edit settings' },
      { id: 'security.read',   label: 'View security' },
      { id: 'security.manage', label: 'Edit security' }
    ]
  }
];

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------
const getRoleMeta = (roleId) => ROLES[roleId] || { name: roleId, color: '#777789' };

export default function AdminsRoles() {
  const admin = useAdminStore();
  const actionLog = useAdminActionStore();

  const canManage = hasPermission(admin, 'admins.manage');

  const [tab, setTab] = useState('team');
  const [editAdmin, setEditAdmin] = useState(null);

  if (!canManage && !hasPermission(admin, 'admins.read')) {
    return (
      <div className="admin-page">
        <div className="admin-banner info">
          <i className="fa-solid fa-lock" />
          <div className="admin-banner-sub">
            Only Super Admins can view this section.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === 'team' ? 'active' : ''}`}
          onClick={() => setTab('team')}
        >
          <i className="fa-solid fa-user-shield" /> Team ({TEAM.length})
        </button>
        <button
          className={`admin-tab ${tab === 'roles' ? 'active' : ''}`}
          onClick={() => setTab('roles')}
        >
          <i className="fa-solid fa-key" /> Roles ({getAllRoles().length})
        </button>
      </div>

      {/* ===================== TEAM ===================== */}
      {tab === 'team' && (
        <>
          {!canManage && (
            <div className="admin-banner info">
              <i className="fa-solid fa-eye" />
              <div className="admin-banner-sub">
                Read-only. Only Super Admins can manage team members.
              </div>
            </div>
          )}

          <div className="admin-table">
            <div className="admin-table-head">
              <div className="admin-tcol-user">Admin</div>
              <div className="admin-tcol-tier">Role</div>
              <div className="admin-tcol-status">Joined</div>
              <div className="admin-tcol-reports">Actions</div>
              <div className="admin-tcol-active">Last active</div>
              {canManage && <div className="admin-tcol-action" />}
            </div>

            {TEAM.map((a) => {
              const meta = getRoleMeta(a.role);

              return (
                <div className="admin-table-row" key={a.id}>
                  <div className="admin-tcol-user">
                    <div
                      className="admin-user-photo"
                      style={{
                        background: `linear-gradient(135deg, ${meta.color}, #8b5cf6)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 18
                      }}
                    >
                      {a.name.charAt(0)}
                    </div>
                    <div className="admin-user-info">
                      <div className="admin-user-name">{a.name}</div>
                      <div className="admin-user-sub">
                        {a.id} · {a.email}
                      </div>
                    </div>
                  </div>

                  <div className="admin-tcol-tier">
                    <span
                      className="admin-tier-pill"
                      style={{
                        background: `${meta.color}22`,
                        color: meta.color
                      }}
                    >
                      {meta.name}
                    </span>
                  </div>

                  <div className="admin-tcol-status">
                    <span className="admin-muted">{a.joinedAt}</span>
                  </div>

                  <div className="admin-tcol-reports">
                    <span className="admin-muted">
                      {a.actions.toLocaleString()}
                    </span>
                  </div>

                  <div className="admin-tcol-active">
                    <span className="admin-muted">{a.lastActive}</span>
                  </div>

                  {canManage && (
                    <div className="admin-tcol-action">
                      <button
                        className="admin-btn-ghost small"
                        onClick={() => setEditAdmin(a)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ===================== ROLES ===================== */}
      {tab === 'roles' && (
        <>
          <div className="admin-banner info">
            <i className="fa-solid fa-circle-info" />
            <div className="admin-banner-sub">
              Roles grant granular permissions. Never grant blanket access —
              use the smallest set of permissions a role needs.
            </div>
          </div>

          <div className="admin-role-grid-large">
            {getAllRoles().map((r) => (
              <div className="admin-role-card" key={r.id}>
                <div
                  className="admin-role-card-header"
                  style={{
                    background: `linear-gradient(135deg, ${r.color}22, transparent)`
                  }}
                >
                  <div
                    className="admin-role-card-icon"
                    style={{ background: `${r.color}22`, color: r.color }}
                  >
                    <i className="fa-solid fa-user-shield" />
                  </div>
                  <div>
                    <div className="admin-role-card-name">{r.name}</div>
                    <div className="admin-role-card-sub">{r.description}</div>
                  </div>
                </div>

                <div className="admin-role-card-body">
                  <div className="admin-role-permissions">
                    {r.permissions.includes('*') ? (
                      <span
                        className="admin-role-perm"
                        style={{
                          background: `${r.color}22`,
                          color: r.color
                        }}
                      >
                        <i className="fa-solid fa-star" /> All permissions
                      </span>
                    ) : (
                      r.permissions.slice(0, 6).map((p) => (
                        <span
                          key={p}
                          className="admin-role-perm"
                          style={{
                            background: `${r.color}15`,
                            color: r.color
                          }}
                        >
                          {p}
                        </span>
                      ))
                    )}
                    {!r.permissions.includes('*') &&
                      r.permissions.length > 6 && (
                        <span className="admin-role-perm muted">
                          +{r.permissions.length - 6} more
                        </span>
                      )}
                  </div>

                  <div className="admin-role-card-count">
                    {r.permissions.includes('*')
                      ? 'Full access'
                      : `${r.permissions.length} permissions`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit admin modal */}
      {editAdmin && (
        <div className="admin-modal-scrim" onClick={() => setEditAdmin(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit admin</h3>

            <div className="admin-modal-info">
              <div className="admin-info-row">
                <span className="admin-info-label">Name</span>
                <span className="admin-info-value">{editAdmin.name}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Email</span>
                <span className="admin-info-value">{editAdmin.email}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">ID</span>
                <span className="admin-info-value">{editAdmin.id}</span>
              </div>
            </div>

            <label className="admin-field">
              <span>Role</span>
              <select
                className="admin-select wide"
                defaultValue={editAdmin.role}
              >
                {getAllRoles().map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-field">
              <span>Reason for change (required)</span>
              <textarea
                className="admin-textarea"
                rows={3}
                placeholder="e.g. Promoted to moderation admin"
              />
            </label>

            <div className="admin-modal-actions">
              <button
                className="admin-btn-ghost"
                onClick={() => setEditAdmin(null)}
              >
                Cancel
              </button>
              <button
                className="admin-btn-primary"
                onClick={() => {
                  actionLog.log({
                    adminId: admin.id,
                    adminName: admin.name,
                    adminRole: admin.role,
                    actionType: ACTION_TYPES.CHANGE_ROLE,
                    targetType: 'admin',
                    targetId: editAdmin.id,
                    targetName: editAdmin.name,
                    reason: 'Role updated'
                  });
                  alert(`Role updated for ${editAdmin.name} (demo)`);
                  setEditAdmin(null);
                }}
              >
                Save role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}