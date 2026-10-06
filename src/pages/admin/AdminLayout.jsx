// =========================================================
// MYNVORA ADMIN — LAYOUT
// Shell with sidebar + top bar + content area.
// Wraps every /admin/* page.
// =========================================================

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar.jsx';
import { useAdminStore } from '../../store/adminStore.js';

// Section titles — first match wins
const SECTION_TITLES = {
  '/admin/dashboard':      { title: 'Dashboard',             subtitle: 'Overview of Mynvora operations' },
  '/admin/users':          { title: 'Users',                 subtitle: 'Search and manage user accounts' },
  '/admin/verification':   { title: 'Verification Queue',    subtitle: 'Review pending identity verifications' },
  '/admin/ai-safety':      { title: 'AI Safety',             subtitle: 'Fake profiles · deepfakes · bots' },
  '/admin/photos':         { title: 'Photo Moderation',      subtitle: 'AI-flagged and reported photos' },
  '/admin/flagged':        { title: 'Flagged Content',       subtitle: 'Nudity · sexual · inappropriate' },
  '/admin/reports':        { title: 'Reports',               subtitle: 'User reports and safety cases' },
  '/admin/comms':          { title: 'Communication Safety',  subtitle: 'Scams · spam · suspicious links' },
  '/admin/age-safety':     { title: 'Age Safety',            subtitle: '16–17 vs 18+ environments' },
  '/admin/subscriptions':  { title: 'Subscriptions',         subtitle: 'Plan distribution and management' },
  '/admin/finance':        { title: 'Finance',               subtitle: 'Revenue · refunds · disputes' },
  '/admin/analytics':      { title: 'Analytics',             subtitle: 'Users · dating · safety metrics' },
  '/admin/notifications':  { title: 'Notifications',         subtitle: 'Push · email · announcements' },
  '/admin/audit-logs':     { title: 'Audit Logs',            subtitle: 'Every sensitive admin action' },
  '/admin/admins-roles':   { title: 'Admins & Roles',        subtitle: 'Manage admin team and permissions' },
  '/admin/settings':       { title: 'Settings',              subtitle: 'Platform configuration' },
  '/admin/security':       { title: 'Security',              subtitle: 'Rules · access · logging' }
};

function getSectionInfo(pathname) {
  // Try exact match first
  if (SECTION_TITLES[pathname]) return SECTION_TITLES[pathname];

  // Then prefix match (e.g. /admin/users/u_001 → /admin/users)
  for (const key of Object.keys(SECTION_TITLES)) {
    if (pathname.startsWith(key)) return SECTION_TITLES[key];
  }

  return { title: 'Admin', subtitle: 'Mynvora staff portal' };
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedIn } = useAdminStore();

  // Gate: if not logged in → go to /admin (login page)
  useEffect(() => {
    if (!loggedIn && location.pathname !== '/admin') {
      navigate('/admin', { replace: true });
    }
  }, [loggedIn, location.pathname, navigate]);

  const section = getSectionInfo(location.pathname);

  return (
    <div className="admin-shell">
      <AdminSidebar />

      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <h1>{section.title}</h1>
            <p>{section.subtitle}</p>
          </div>

          <div className="admin-topbar-actions">
            <button className="admin-icon-btn" aria-label="Notifications">
              <i className="fa-solid fa-bell" />
              <span className="admin-icon-badge" />
            </button>

            <button className="admin-icon-btn" aria-label="Settings">
              <i className="fa-solid fa-gear" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}