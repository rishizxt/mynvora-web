// =========================================================
// MYNVORA ADMIN — PROTECTED ROUTE
// Checks if admin is logged in.
//   Logged in  → renders the admin page
//   Not logged in → redirects to /admin (login)
// Also enforces section-level permission (optional).
// =========================================================

import { Navigate, useLocation } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore.js';
import { canAccessSection } from '../../utils/permissions.js';

export default function ProtectedAdminRoute({ children, section = null }) {
  const location = useLocation();
  const admin = useAdminStore();

  // ---- 1. Must be logged in ----
  if (!admin.loggedIn) {
    // Kick back to admin login, remember where they wanted to go
    return (
      <Navigate
        to="/admin"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // ---- 2. If section specified → check permission ----
  if (section && !canAccessSection(admin, section)) {
    // Logged in but role doesn't allow this section
    return (
      <Navigate
        to="/admin/dashboard"
        state={{ denied: section }}
        replace
      />
    );
  }

  // ---- 3. All good → render ----
  return children;
}