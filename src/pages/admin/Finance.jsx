// =========================================================
// MYNVORA ADMIN — FINANCE
// Revenue · refunds · disputes · failed transactions.
// Finance Admin can issue refunds. Others read-only.
// =========================================================

import { useState, useMemo } from 'react';
import { MOCK_DASHBOARD_STATS } from '../../data/adminMockData.js';
import { useAdminStore } from '../../store/adminStore.js';
import {
  useAdminActionStore,
  ACTION_TYPES
} from '../../store/adminActionStore.js';
import { hasPermission } from '../../utils/permissions.js';

// ---------------------------------------------------------
// Revenue by day (last 7 days)
// ---------------------------------------------------------
const REVENUE_BY_DAY = [
  { day: 'Mon', value: 62800 },
  { day: 'Tue', value: 71200 },
  { day: 'Wed', value: 68400 },
  { day: 'Thu', value: 79600 },
  { day: 'Fri', value: 84210 },
  { day: 'Sat', value: 92800 },
  { day: 'Sun', value: 88100 }
];

// ---------------------------------------------------------
// Refund requests
// ---------------------------------------------------------
const REFUND_REQUESTS = [
  {
    id: 'RF-4829',
    userId: 'u_2211',
    userName: 'Rushi Singh',
    amount: 399,
    plan: 'Diamond',
    reason: 'Charged twice for same week',
    requestedAt: Date.now() - 45 * 60 * 1000,
    status: 'pending'
  },
  {
    id: 'RF-4828',
    userId: 'u_4422',
    userName: 'Sofia Reyes',
    amount: 199,
    plan: 'Gold',
    reason: 'Accidental purchase',
    requestedAt: Date.now() - 3 * 60 * 60 * 1000,
    status: 'pending'
  },
  {
    id: 'RF-4827',
    userId: 'u_1133',
    userName: 'Aisha Khan',
    amount: 99,
    plan: 'Light',
    reason: 'Feature not as described',
    requestedAt: Date.now() - 8 * 60 * 60 * 1000,
    status: 'approved'
  },
  {
    id: 'RF-4826',
    userId: 'u_8821',
    userName: 'Emma Roy',
    amount: 399,
    plan: 'Diamond',
    reason: 'Cancelled but still charged',
    requestedAt: Date.now() - 24 * 60 * 60 * 1000,
    status: 'rejected'
  }
];

// ---------------------------------------------------------
// Failed payments
// ---------------------------------------------------------
const FAILED_PAYMENTS = [
  { id: 'FP-1932', userId: 'u_9911', userName: 'Unknown',      amount: 399, plan: 'Diamond', reason: 'Card declined', at: Date.now() - 2 * 60 * 60 * 1000 },
  { id: 'FP-1931', userId: 'u_4422', userName: 'Sofia Reyes',  amount: 199, plan: 'Gold',    reason: 'Insufficient funds', at: Date.now() - 12 * 60 * 60 * 1000 },
  { id: 'FP-1930', userId: 'u_7822', userName: 'Lena Müller',  amount: 99,  plan: 'Light',   reason: 'Card expired', at: Date.now() - 24 * 60 * 60 * 1000 }
];

const STATUS_META = {
  pending:  { color: '#ffb020', label: 'Pending' },
  approved: { color: '#35d07f', label: 'Approved' },
  rejected: { color: '#ff4d67', label: 'Rejected' },
  failed:   { color: '#ff4d67', label: 'Failed' }
};

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

export default function Finance() {
  const admin = useAdminStore();
  const actionLog = useAdminActionStore();
  const s = MOCK_DASHBOARD_STATS;

  const canRefund = hasPermission(admin, 'refunds.manage');
  const [tab, setTab] = useState('overview');
  const [refundModal, setRefundModal] = useState(null);
  const [reason, setReason] = useState('');

  // ---- computed totals ----
  const weekTotal = useMemo(
    () => REVENUE_BY_DAY.reduce((sum, d) => sum + d.value, 0),
    []
  );
  const maxDay = Math.max(...REVENUE_BY_DAY.map((d) => d.value));

  // ---- stats ----
  const stats = [
    {
      icon: 'fa-indian-rupee-sign',
      color: '#35d07f',
      value: `₹${s.revenueToday.toLocaleString()}`,
      label: 'Revenue today'
    },
    {
      icon: 'fa-calendar-week',
      color: '#4f8cff',
      value: `₹${weekTotal.toLocaleString()}`,
      label: 'Revenue this week'
    },
    {
      icon: 'fa-rotate-left',
      color: '#ffb020',
      value: `₹${s.refundsToday.toLocaleString()}`,
      label: 'Refunds today'
    },
    {
      icon: 'fa-triangle-exclamation',
      color: '#ff4d67',
      value: s.failedPayments,
      label: 'Failed payments'
    },
    {
      icon: 'fa-scale-balanced',
      color: '#8b5cf6',
      value: '3',
      label: 'Open disputes'
    },
    {
      icon: 'fa-chart-line',
      color: '#ff3b81',
      value: '+11.4%',
      label: 'vs. yesterday'
    }
  ];

  const submitRefund = (decision) => {
    actionLog.log({
      adminId: admin.id,
      adminName: admin.name,
      adminRole: admin.role,
      actionType: ACTION_TYPES.ISSUE_REFUND,
      targetType: 'refund',
      targetId: refundModal.id,
      targetName: refundModal.userName,
      reason: `${decision}: ${reason}`
    });

    alert(`Refund ${decision} for ${refundModal.id} (demo)`);
    setRefundModal(null);
    setReason('');
  };

  return (
    <div className="admin-page">
      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === 'overview' ? 'active' : ''}`}
          onClick={() => setTab('overview')}
        >
          Overview
        </button>
        <button
          className={`admin-tab ${tab === 'refunds' ? 'active' : ''}`}
          onClick={() => setTab('refunds')}
        >
          Refunds ({REFUND_REQUESTS.filter((r) => r.status === 'pending').length})
        </button>
        <button
          className={`admin-tab ${tab === 'failed' ? 'active' : ''}`}
          onClick={() => setTab('failed')}
        >
          Failed payments ({FAILED_PAYMENTS.length})
        </button>
      </div>

      {/* ===================== OVERVIEW ===================== */}
      {tab === 'overview' && (
        <>
          <div className="admin-stat-grid">
            {stats.map((st, i) => (
              <div className="admin-stat-card static" key={i}>
                <div className="admin-stat-head">
                  <div
                    className="admin-stat-icon"
                    style={{ background: `${st.color}22`, color: st.color }}
                  >
                    <i className={`fa-solid ${st.icon}`} />
                  </div>
                </div>
                <div className="admin-stat-value">{st.value}</div>
                <div className="admin-stat-label">{st.label}</div>
              </div>
            ))}
          </div>

          {/* Revenue chart */}
          <div className="admin-info-card" style={{ marginTop: 24 }}>
            <h3 className="admin-card-title">Revenue — last 7 days</h3>

            <div className="admin-chart">
              {REVENUE_BY_DAY.map((d) => (
                <div className="admin-chart-col" key={d.day}>
                  <div className="admin-chart-value">
                    ₹{(d.value / 1000).toFixed(1)}k
                  </div>
                  <div className="admin-chart-bar-wrap">
                    <div
                      className="admin-chart-bar"
                      style={{
                        height: `${(d.value / maxDay) * 100}%`
                      }}
                    />
                  </div>
                  <div className="admin-chart-label">{d.day}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ===================== REFUNDS ===================== */}
      {tab === 'refunds' && (
        <>
          <div className="admin-list-count">
            {REFUND_REQUESTS.length} refund request
            {REFUND_REQUESTS.length !== 1 ? 's' : ''}
          </div>

          <div className="admin-list-simple">
            {REFUND_REQUESTS.map((r) => {
              const meta = STATUS_META[r.status];
              return (
                <div className="admin-list-row" key={r.id}>
                  <div
                    className="admin-list-row-icon"
                    style={{ background: `${meta.color}22`, color: meta.color }}
                  >
                    <i className="fa-solid fa-rotate-left" />
                  </div>

                  <div className="admin-list-row-body">
                    <div className="admin-list-row-title">
                      <b>{r.id}</b> · {r.userName} ({r.userId})
                    </div>
                    <div className="admin-list-row-sub">
                      ₹{r.amount} · {r.plan} · {r.reason}
                    </div>
                  </div>

                  <span
                    className="admin-status-pill"
                    style={{
                      background: `${meta.color}22`,
                      color: meta.color
                    }}
                  >
                    {meta.label}
                  </span>

                  {r.status === 'pending' && canRefund && (
                    <button
                      className="admin-btn-primary small"
                      onClick={() => setRefundModal(r)}
                    >
                      Review
                    </button>
                  )}

                  <span className="admin-muted">{timeAgo(r.requestedAt)}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ===================== FAILED ===================== */}
      {tab === 'failed' && (
        <div className="admin-list-simple">
          {FAILED_PAYMENTS.map((f) => (
            <div className="admin-list-row" key={f.id}>
              <div className="admin-list-row-icon danger">
                <i className="fa-solid fa-triangle-exclamation" />
              </div>

              <div className="admin-list-row-body">
                <div className="admin-list-row-title">
                  <b>{f.id}</b> · {f.userName} ({f.userId})
                </div>
                <div className="admin-list-row-sub">
                  ₹{f.amount} · {f.plan} · {f.reason}
                </div>
              </div>

              <span className="admin-status-pill danger">Failed</span>

              <span className="admin-muted">{timeAgo(f.at)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Refund modal */}
      {refundModal && (
        <div
          className="admin-modal-scrim"
          onClick={() => setRefundModal(null)}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Review refund request</h3>

            <div className="admin-modal-info">
              <div className="admin-info-row">
                <span className="admin-info-label">Request ID</span>
                <span className="admin-info-value">{refundModal.id}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">User</span>
                <span className="admin-info-value">{refundModal.userName}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Amount</span>
                <span className="admin-info-value">₹{refundModal.amount}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Plan</span>
                <span className="admin-info-value">{refundModal.plan}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">Reason</span>
                <span className="admin-info-value">{refundModal.reason}</span>
              </div>
            </div>

            <label className="admin-field">
              <span>Notes (required)</span>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Add reason for your decision..."
              />
            </label>

            <div className="admin-modal-actions">
              <button
                className="admin-btn-ghost"
                onClick={() => setRefundModal(null)}
              >
                Cancel
              </button>
              <button
                className="admin-btn-primary danger"
                disabled={!reason.trim()}
                onClick={() => submitRefund('rejected')}
              >
                Reject
              </button>
              <button
                className="admin-btn-primary success"
                disabled={!reason.trim()}
                onClick={() => submitRefund('approved')}
              >
                Approve refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}