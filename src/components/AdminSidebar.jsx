// =========================================================
// MYNVORA ADMIN — SIDEBAR
// Left navigation with 17 sections + badges.
// Items appear based on the current admin's role.
// =========================================================

import { NavLink } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore.js';
import { useReportStore } from '../store/reportStore.js';
import { useFlaggedContentStore } from '../store/flaggedContentStore.js';
import { getRoleColor, getRoleName } from '../utils/permissions.js';
import { canAccessSection } from '../utils/permissions.js';

// Section definitions — in the order they appear
const SECTIONS = [
  { key: 'dashboard',      path: '/admin/dashboard',      icon: 'fa-chart-line',     label: 'Dashboard' },
  { key: 'users',          path: '/admin/users',          icon: 'fa-users',          label: 'Users' },
  { key: 'verification',   path: '/admin/verification',   icon: 'fa-id-card',        label: 'Verification', badge: 'verification' },
  { key: 'aiSafety',       path: '/admin/ai-safety',      icon: 'fa-robot',          label: 'AI Safety' },
  { key: 'photos',         path: '/admin/photos',         icon: 'fa-image',          label: 'Photos', badge: 'photos' },
  { key: 'flagged',        path: '/admin/flagged',        icon: 'fa-fire',           label: 'Flagged Content', badge: 'flagged', badgeType: 'danger' },
  { key: 'reports',        path: '/admin/reports',        icon: 'fa-flag',           label: 'Reports', badge: 'reports' },
  { key: 'comms',          path: '/admin/comms',          icon: 'fa-comment-dots',   label: 'Comms Safety' },
  { key: 'ageSafety',      path: '/admin/age-safety',     icon: 'fa-cake-candles',   label: 'Age Safety' },
  { key: 'subscriptions',  path: '/admin/subscriptions',  icon: 'fa-crown',          label: 'Subscriptions' },
  { key: 'finance',        path: '/admin/finance',        icon: 'fa-coins',          label: 'Finance' },
  { key: 'analytics',      path: '/admin/analytics',      icon: 'fa-chart-pie',      label: 'Analytics' },
  { key: 'notifications',  path: '/admin/notifications',  icon: 'fa-bullhorn',       label: 'Notifications' },
  { key: 'auditLogs',      path: '/admin/audit-logs',     icon: 'fa-clipboard-list', label: 'Audit Logs' },
  { key: 'adminsRoles',    path: '/admin/admins-roles',   icon: 'fa-user-shield',    label: 'Admins & Roles' },
  { key: 'settings',       path: '/admin/settings',       icon: 'fa-gear',           label: 'Settings' },
  { key: 'security',       path: '/admin/security',       icon: 'fa-lock',           label: 'Security' }
];

export default function AdminSidebar() {
  const admin = useAdminStore();
  const { logout } = useAdminStore();
  const reports = useReportStore();
  const flags = useFlaggedContentStore();

  // Live badge counts
  const badgeCounts = {
    verification: 12,        // mock — from verifications store later
    photos: 102,             // mock — from photo queue later
    flagged: flags.pendingCount(),
    reports: reports.pendingCount()
  };

  // Fallback when counts are 0 for demo
  if (badgeCounts.flagged === 0) badgeCounts.flagged = 8;
  if (badgeCounts.reports === 0) badgeCounts.reports = 3;

  const roleColor = getRoleColor(admin.role);

  return (
    <aside className="admin-sidebar">
      {/* Brand */}
      <div className="admin-side-brand">
        <div className="admin-side-brand-icon">
          <i className="fa-solid fa-shield-halved" />
        </div>
        <div className="admin-side-brand-text">
          MYNVORA
          <small>ADMIN</small>
        </div>
      </div>

      {/* Nav */}
      <nav className="admin-side-nav">
        {SECTIONS.map((sec) => {
          const accessible = canAccessSection(admin, sec.key);
          if (!accessible) return null;

          const badgeValue = sec.badge ? badgeCounts[sec.badge] : 0;

          return (
            <NavLink
              key={sec.key}
              to={sec.path}
              className={({ isActive }) =>
                `admin-side-item ${isActive ? 'active' : ''}`
              }
            >
              <i className={`fa-solid ${sec.icon}`} />
              <span>{sec.label}</span>

              {badgeValue > 0 && (
                <span className={`admin-side-badge ${sec.badgeType || ''}`}>
                  {badgeValue > 99 ? '99+' : badgeValue}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="admin-side-user">
        <div className="admin-side-user-card">
          <div
            className="admin-side-avatar"
            style={{
              background: `linear-gradient(135deg, ${roleColor}, #8b5cf6)`
            }}
          >
            {admin.name?.charAt(0) || 'A'}
          </div>

          <div className="admin-side-user-info">
            <div className="admin-side-user-name">{admin.name || 'Admin'}</div>
            <div
              className="admin-side-user-role"
              style={{ color: roleColor }}
            >
              {getRoleName(admin.role)}
            </div>
          </div>

          <button
            className="admin-side-logout"
            onClick={() => {
              logout();
              window.location.href = '/admin';
            }}
            aria-label="Logout"
          >
            <i className="fa-solid fa-right-from-bracket" />
          </button>
        </div>
      </div>
    </aside>
  );
}