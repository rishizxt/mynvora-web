// =========================================================
// MYNVORA ADMIN — DASHBOARD
// Overview of everything: users, safety, revenue, activity.
// =========================================================

import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore.js';
import { useReportStore } from '../../store/reportStore.js';
import { useFlaggedContentStore } from '../../store/flaggedContentStore.js';
import {
  MOCK_DASHBOARD_STATS,
  MOCK_ACTIVITY
} from '../../data/adminMockData.js';

function formatTimeAgo(ms) {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const admin = useAdminStore();
  const reports = useReportStore();
  const flags = useFlaggedContentStore();

  const s = MOCK_DASHBOARD_STATS;

  // Live counts from stores (override mock when we have real data)
  const liveReports = reports.pendingCount() || s.openReports;
  const liveFlags = flags.pendingCount() || s.aiDeepfakeDetections;

  const stats = [
    {
      icon: 'fa-users',
      color: '#4f8cff',
      trend: '+2.4%',
      trendUp: true,
      value: s.totalUsers.toLocaleString(),
      label: 'Total users',
      path: '/admin/users'
    },
    {
      icon: 'fa-user-plus',
      color: '#35d07f',
      trend: '+8.1%',
      trendUp: true,
      value: s.newToday.toLocaleString(),
      label: 'New today',
      path: '/admin/users'
    },
    {
      icon: 'fa-flag',
      color: '#ff3b81',
      trend: '+12%',
      trendUp: false,
      value: liveReports,
      label: 'Open reports',
      path: '/admin/reports'
    },
    {
      icon: 'fa-image',
      color: '#ffb020',
      trend: '+5%',
      trendUp: false,
      value: '102',
      label: 'Photo queue',
      path: '/admin/photos'
    },
    {
      icon: 'fa-crown',
      color: '#8b5cf6',
      trend: '+3.2%',
      trendUp: true,
      value: s.activeSubscriptions.toLocaleString(),
      label: 'Active subs',
      path: '/admin/subscriptions'
    },
    {
      icon: 'fa-indian-rupee-sign',
      color: '#ff3b81',
      trend: '+11.4%',
      trendUp: true,
      value: `₹${s.revenueToday.toLocaleString()}`,
      label: 'Revenue today',
      path: '/admin/finance'
    }
  ];

  // Secondary stats
  const secondary = [
    { icon: 'fa-circle-check', color: '#35d07f', value: s.verifiedUsers.toLocaleString(), label: 'Verified users' },
    { icon: 'fa-id-card', color: '#4f8cff', value: s.pendingVerification, label: 'Pending verification' },
    { icon: 'fa-cake-candles', color: '#ffb020', value: s.teenUsers.toLocaleString(), label: '16–17 users' },
    { icon: 'fa-user', color: '#4f8cff', value: s.adultUsers.toLocaleString(), label: '18+ users' },
    { icon: 'fa-robot', color: '#8b5cf6', value: s.fakeProfileDetections, label: 'Fake profiles' },
    { icon: 'fa-mask', color: '#ff4d67', value: liveFlags, label: 'AI / deepfake flags' },
    { icon: 'fa-user-slash', color: '#ff4d67', value: s.suspendedAccounts, label: 'Suspended' },
    { icon: 'fa-ban', color: '#ff4d67', value: s.bannedAccounts, label: 'Banned' }
  ];

  // Activity icons
  const activityIcons = {
    verification: { icon: 'fa-id-card', color: '#4f8cff' },
    report: { icon: 'fa-flag', color: '#ff3b81' },
    flag: { icon: 'fa-fire', color: '#ff4d67' },
    subscription: { icon: 'fa-crown', color: '#8b5cf6' },
    ban: { icon: 'fa-ban', color: '#ff4d67' }
  };

  return (
    <div className="admin-page">
      {/* Welcome */}
      <div className="admin-welcome">
        <h2>Welcome back, {admin.name?.split(' ')[0] || 'Admin'}</h2>
        <p>Here's what's happening on Mynvora today.</p>
      </div>

      {/* Primary stats */}
      <div className="admin-stat-grid">
        {stats.map((st) => (
          <button
            key={st.label}
            className="admin-stat-card"
            onClick={() => navigate(st.path)}
          >
            <div className="admin-stat-head">
              <div
                className="admin-stat-icon"
                style={{ background: `${st.color}22`, color: st.color }}
              >
                <i className={`fa-solid ${st.icon}`} />
              </div>
              <span
                className={`admin-stat-trend ${st.trendUp ? '' : 'down'}`}
              >
                {st.trend}
              </span>
            </div>
            <div className="admin-stat-value">{st.value}</div>
            <div className="admin-stat-label">{st.label}</div>
          </button>
        ))}
      </div>

      {/* Secondary stats — compact grid */}
      <div className="admin-page-section">
        <div className="admin-section-header">
          <h3>Quick stats</h3>
        </div>
        <div className="admin-quick-grid">
          {secondary.map((sec) => (
            <div key={sec.label} className="admin-quick-card">
              <div
                className="admin-quick-icon"
                style={{ background: `${sec.color}22`, color: sec.color }}
              >
                <i className={`fa-solid ${sec.icon}`} />
              </div>
              <div className="admin-quick-body">
                <div className="admin-quick-value">{sec.value}</div>
                <div className="admin-quick-label">{sec.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity feed */}
      <div className="admin-page-section">
        <div className="admin-section-header">
          <h3>Recent activity</h3>
        </div>

        <div className="admin-activity-list">
          {MOCK_ACTIVITY.map((a) => {
            const conf = activityIcons[a.type] || activityIcons.report;
            return (
              <div className="admin-activity-item" key={a.id}>
                <div
                  className="admin-activity-icon"
                  style={{ background: `${conf.color}22`, color: conf.color }}
                >
                  <i className={`fa-solid ${conf.icon}`} />
                </div>
                <div className="admin-activity-text">{a.text}</div>
                <div className="admin-activity-time">
                  {formatTimeAgo(a.at)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}