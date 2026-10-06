// =========================================================
// MYNVORA ADMIN — USERS LIST
// Search + filter users. Tap a row → UserDetail.
// =========================================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../../data/adminMockData.js';
import { useAdminStore } from '../../store/adminStore.js';
import { hasPermission, PERMISSIONS_FALLBACK } from '../../utils/permissions.js';

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

export default function Users() {
  const navigate = useNavigate();
  const admin = useAdminStore();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  // ---------- filter + sort ----------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return MOCK_USERS.filter((u) => {
      // Search
      if (q) {
        const matches =
          u.name.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;

      // Tier filter
      if (tierFilter !== 'all' && u.tier !== tierFilter) return false;

      return true;
    }).sort((a, b) => b.reportsAgainst - a.reportsAgainst);
  }, [query, statusFilter, tierFilter]);

  // ---------- render row ----------
  const openUser = (id) => {
    navigate(`/admin/users/${id}`);
  };

  return (
    <div className="admin-page">
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Search by name, ID, email, city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="admin-search-clear"
              onClick={() => setQuery('')}
              aria-label="Clear"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        <div className="admin-filter-row">
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>

          <select
            className="admin-select"
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
          >
            <option value="all">All tiers</option>
            <option value="free">Free</option>
            <option value="light">Light</option>
            <option value="gold">Gold</option>
            <option value="diamond">Diamond</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <div className="admin-list-count">
        {filtered.length} user{filtered.length !== 1 ? 's' : ''}
        {query && ` matching "${query}"`}
      </div>

      {/* List */}
      <div className="admin-table">
        {/* Header */}
        <div className="admin-table-head">
          <div className="admin-tcol-user">User</div>
          <div className="admin-tcol-tier">Tier</div>
          <div className="admin-tcol-status">Status</div>
          <div className="admin-tcol-reports">Reports</div>
          <div className="admin-tcol-active">Last active</div>
          <div className="admin-tcol-action" />
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-regular fa-face-frown" />
            <p>No users match your filters</p>
          </div>
        ) : (
          filtered.map((u) => (
            <div
              className="admin-table-row"
              key={u.id}
              onClick={() => openUser(u.id)}
            >
              {/* User */}
              <div className="admin-tcol-user">
                <img className="admin-user-photo" src={u.photo} alt={u.name} />
                <div className="admin-user-info">
                  <div className="admin-user-name">
                    {u.name}
                    {u.verified && (
                      <i className="fa-solid fa-circle-check admin-user-verified" />
                    )}
                  </div>
                  <div className="admin-user-sub">
                    {u.id} · {u.age} · {u.city}
                  </div>
                </div>
              </div>

              {/* Tier */}
              <div className="admin-tcol-tier">
                <span
                  className="admin-tier-pill"
                  style={{
                    background: `${TIER_COLORS[u.tier]}22`,
                    color: TIER_COLORS[u.tier]
                  }}
                >
                  {u.tier}
                </span>
              </div>

              {/* Status */}
              <div className="admin-tcol-status">
                <span
                  className="admin-status-pill"
                  style={{
                    background: `${STATUS_COLORS[u.status]}22`,
                    color: STATUS_COLORS[u.status]
                  }}
                >
                  {u.status}
                </span>
              </div>

              {/* Reports */}
              <div className="admin-tcol-reports">
                {u.reportsAgainst > 0 ? (
                  <span className="admin-reports-badge">
                    <i className="fa-solid fa-flag" />
                    {u.reportsAgainst}
                  </span>
                ) : (
                  <span className="admin-muted">—</span>
                )}
              </div>

              {/* Last active */}
              <div className="admin-tcol-active">
                <span className="admin-muted">{u.lastActive}</span>
              </div>

              {/* Arrow */}
              <div className="admin-tcol-action">
                <i className="fa-solid fa-chevron-right" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}