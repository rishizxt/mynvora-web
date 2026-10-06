// =========================================================
// MYNVORA ADMIN — REPORTS QUEUE
// All reports from users (harassment, scam, fake profile, etc.)
// Tap a report → ReportDetail.
// =========================================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReportStore, STATUS_LABELS } from '../../store/reportStore.js';
import { MOCK_REPORTS } from '../../data/adminMockData.js';

// ---- helpers ----
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

const RISK_LABELS = {
  low: 'Low',
  review: 'Review',
  high: 'High',
  critical: 'Critical'
};

export default function Reports() {
  const navigate = useNavigate();
  const store = useReportStore();

  // Use live store if it has reports, otherwise fallback to mock
  const allReports = store.reports.length > 0 ? store.reports : MOCK_REPORTS;

  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [query, setQuery] = useState('');

  // ---- filter ----
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return allReports.filter((r) => {
      // Status
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;

      // Risk
      if (riskFilter !== 'all' && r.aiRisk !== riskFilter) return false;

      // Search
      if (q) {
        const match =
          r.id.toLowerCase().includes(q) ||
          r.reportedUserName?.toLowerCase().includes(q) ||
          r.reason?.toLowerCase().includes(q) ||
          r.reporterName?.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => {
      // Critical first, then high, then by recency
      const order = { critical: 0, high: 1, review: 2, low: 3 };
      const aO = order[a.aiRisk] ?? 9;
      const bO = order[b.aiRisk] ?? 9;
      if (aO !== bO) return aO - bO;
      return b.createdAt - a.createdAt;
    });
  }, [allReports, statusFilter, riskFilter, query]);

  // ---- filter chip counts ----
  const statusCounts = {
    all: allReports.length,
    new: allReports.filter((r) => r.status === 'new').length,
    investigating: allReports.filter((r) => r.status === 'investigating').length,
    resolved: allReports.filter((r) =>
      ['resolved', 'closed', 'action_taken'].includes(r.status)
    ).length
  };

  return (
    <div className="admin-page">
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Search report ID, user, reason..."
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
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="all">All risk levels</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="review">🟡 Review</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
      </div>

      {/* Status filter chips */}
      <div className="admin-filter-chips">
        {[
          { id: 'all', label: 'All', count: statusCounts.all },
          { id: 'new', label: 'New', count: statusCounts.new },
          {
            id: 'investigating',
            label: 'Investigating',
            count: statusCounts.investigating
          },
          { id: 'resolved', label: 'Resolved', count: statusCounts.resolved }
        ].map((c) => (
          <button
            key={c.id}
            className={`admin-chip ${statusFilter === c.id ? 'active' : ''}`}
            onClick={() => setStatusFilter(c.id)}
          >
            {c.label}
            <span className="admin-chip-count">{c.count}</span>
          </button>
        ))}
      </div>

      {/* Count line */}
      <div className="admin-list-count">
        {filtered.length} report{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* List */}
      <div className="admin-report-list">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-regular fa-face-smile" />
            <p>No reports match your filters</p>
          </div>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className="admin-report-row"
              onClick={() => navigate(`/admin/reports/${r.id}`)}
            >
              {/* Risk bar */}
              <div className={`admin-report-risk-bar ${r.aiRisk}`} />

              {/* Reporter → Reported user */}
              <div className="admin-report-avatars">
                <img
                  className="admin-report-avatar"
                  src={r.reportedUserPhoto}
                  alt={r.reportedUserName}
                />
                <span className="admin-report-arrow">
                  <i className="fa-solid fa-arrow-right" />
                </span>
              </div>

              {/* Main info */}
              <div className="admin-report-info">
                <div className="admin-report-top">
                  <span className="admin-report-id">{r.id}</span>
                  <span className={`admin-risk ${r.aiRisk}`}>
                    {RISK_LABELS[r.aiRisk] || 'Review'}
                  </span>
                  <span className={`admin-status-tag ${r.status}`}>
                    {STATUS_LABELS[r.status] || r.status}
                  </span>
                </div>

                <div className="admin-report-reason">{r.reason}</div>

                <div className="admin-report-meta">
                  <span>
                    <i className="fa-solid fa-user" /> Reported:{' '}
                    <strong>{r.reportedUserName}</strong>
                  </span>
                  <span>
                    <i className="fa-solid fa-user-secret" /> By:{' '}
                    {r.reporterName}
                  </span>
                  {r.previousReports > 0 && (
                    <span className="admin-report-flag">
                      <i className="fa-solid fa-triangle-exclamation" />{' '}
                      {r.previousReports} prior
                    </span>
                  )}
                </div>
              </div>

              {/* Time + arrow */}
              <div className="admin-report-time">
                {timeAgo(r.createdAt)}
              </div>

              <i className="fa-solid fa-chevron-right admin-report-arrow" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}