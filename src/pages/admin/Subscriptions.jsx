// =========================================================
// MYNVORA ADMIN — SUBSCRIPTIONS
// Plan distribution, active subs, renewals, cancellations,
// failed payments. Finance/Support read, Finance manage.
// =========================================================

import { useState } from 'react';
import { MOCK_DASHBOARD_STATS } from '../../data/adminMockData.js';
import { useAdminStore } from '../../store/adminStore.js';
import { hasPermission } from '../../utils/permissions.js';

// ---------------------------------------------------------
// Plan tiers
// ---------------------------------------------------------
const PLANS = [
  {
    id: 'light',
    name: 'Light',
    price: 99,
    color: '#4f8cff',
    icon: 'fa-star',
    subs: 6201,
    revenue: 613899,
    features: [
      'Unlimited Likes',
      'Profile Customization',
      'Hobbies & Interests',
      'Chat',
      'Safety Tools'
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 199,
    color: '#ffb020',
    icon: 'fa-crown',
    subs: 4102,
    revenue: 816298,
    features: [
      'Everything in Light',
      'See Who Likes You',
      'Voice Calls',
      'Read Receipts',
      'Rewind',
      'Super Likes'
    ]
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: 399,
    color: '#8b5cf6',
    icon: 'fa-gem',
    subs: 2186,
    revenue: 872214,
    features: [
      'Everything in Gold',
      'Unlimited Swiping',
      'Video Calls',
      'Travel Mode',
      'Incognito',
      'Hookups Access',
      'Advanced Filters'
    ]
  }
];

// ---------------------------------------------------------
// Recent subscription activity
// ---------------------------------------------------------
const RECENT = [
  { id: 'sub_a1', type: 'new',       user: 'u_2190', plan: 'diamond', at: Date.now() - 2 * 60 * 1000, amount: 399 },
  { id: 'sub_a2', type: 'renewal',   user: 'u_4412', plan: 'gold',    at: Date.now() - 18 * 60 * 1000, amount: 199 },
  { id: 'sub_a3', type: 'cancelled', user: 'u_7822', plan: 'light',   at: Date.now() - 1 * 60 * 60 * 1000, amount: 0 },
  { id: 'sub_a4', type: 'new',       user: 'u_1133', plan: 'gold',    at: Date.now() - 2 * 60 * 60 * 1000, amount: 199 },
  { id: 'sub_a5', type: 'failed',    user: 'u_9911', plan: 'diamond', at: Date.now() - 3 * 60 * 60 * 1000, amount: 399 },
  { id: 'sub_a6', type: 'new',       user: 'u_2211', plan: 'light',   at: Date.now() - 5 * 60 * 60 * 1000, amount: 99 }
];

const ACTIVITY_META = {
  new:       { icon: 'fa-plus',           color: '#35d07f', label: 'New subscription' },
  renewal:   { icon: 'fa-rotate',         color: '#4f8cff', label: 'Renewal' },
  cancelled: { icon: 'fa-xmark',          color: '#ffb020', label: 'Cancelled' },
  failed:    { icon: 'fa-triangle-exclamation', color: '#ff4d67', label: 'Failed payment' }
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

export default function Subscriptions() {
  const admin = useAdminStore();
  const s = MOCK_DASHBOARD_STATS;

  const canManage = hasPermission(admin, 'subs.manage');
  const [tab, setTab] = useState('overview');

  // ---- stats ----
  const stats = [
    {
      icon: 'fa-crown',
      color: '#ffb020',
      value: s.activeSubscriptions.toLocaleString(),
      label: 'Active subscriptions'
    },
    {
      icon: 'fa-indian-rupee-sign',
      color: '#35d07f',
      value: `₹${(s.revenueToday).toLocaleString()}`,
      label: 'Revenue today'
    },
    {
      icon: 'fa-rotate',
      color: '#4f8cff',
      value: '3,204',
      label: 'Renewals this week'
    },
    {
      icon: 'fa-xmark',
      color: '#ff4d67',
      value: '412',
      label: 'Cancelled this week'
    },
    {
      icon: 'fa-triangle-exclamation',
      color: '#ff4d67',
      value: s.failedPayments,
      label: 'Failed payments'
    },
    {
      icon: 'fa-arrow-up',
      color: '#8b5cf6',
      value: '+3.2%',
      label: 'Week-over-week'
    }
  ];

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
          className={`admin-tab ${tab === 'plans' ? 'active' : ''}`}
          onClick={() => setTab('plans')}
        >
          Plans
        </button>
        <button
          className={`admin-tab ${tab === 'activity' ? 'active' : ''}`}
          onClick={() => setTab('activity')}
        >
          Recent activity
        </button>
        {canManage && (
          <button
            className={`admin-tab ${tab === 'config' ? 'active' : ''}`}
            onClick={() => setTab('config')}
          >
            Configuration
          </button>
        )}
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

          {/* Distribution bar */}
          <div className="admin-info-card" style={{ marginTop: 24 }}>
            <h3 className="admin-card-title">Plan distribution</h3>

            <div className="admin-dist-bar">
              <div
                className="admin-dist-segment"
                style={{
                  width: `${(s.lightSubscribers / s.activeSubscriptions) * 100}%`,
                  background: '#4f8cff'
                }}
              />
              <div
                className="admin-dist-segment"
                style={{
                  width: `${(s.goldSubscribers / s.activeSubscriptions) * 100}%`,
                  background: '#ffb020'
                }}
              />
              <div
                className="admin-dist-segment"
                style={{
                  width: `${(s.diamondSubscribers / s.activeSubscriptions) * 100}%`,
                  background: '#8b5cf6'
                }}
              />
            </div>

            <div className="admin-dist-legend">
              <span>
                <span className="admin-dist-dot" style={{ background: '#4f8cff' }} />
                Light · {s.lightSubscribers.toLocaleString()} (
                {Math.round((s.lightSubscribers / s.activeSubscriptions) * 100)}%)
              </span>
              <span>
                <span className="admin-dist-dot" style={{ background: '#ffb020' }} />
                Gold · {s.goldSubscribers.toLocaleString()} (
                {Math.round((s.goldSubscribers / s.activeSubscriptions) * 100)}%)
              </span>
              <span>
                <span className="admin-dist-dot" style={{ background: '#8b5cf6' }} />
                Diamond · {s.diamondSubscribers.toLocaleString()} (
                {Math.round((s.diamondSubscribers / s.activeSubscriptions) * 100)}%)
              </span>
            </div>
          </div>
        </>
      )}

      {/* ===================== PLANS ===================== */}
      {tab === 'plans' && (
        <div className="admin-plan-grid">
          {PLANS.map((p) => (
            <div className="admin-plan-card" key={p.id}>
              <div
                className="admin-plan-header"
                style={{
                  background: `linear-gradient(135deg, ${p.color}22, transparent)`
                }}
              >
                <div
                  className="admin-plan-icon"
                  style={{ background: `${p.color}22`, color: p.color }}
                >
                  <i className={`fa-solid ${p.icon}`} />
                </div>
                <div>
                  <div className="admin-plan-name">{p.name}</div>
                  <div className="admin-plan-price">
                    ₹{p.price}
                    <span>/week</span>
                  </div>
                </div>
              </div>

              <div className="admin-plan-body">
                <div className="admin-plan-row">
                  <span className="admin-info-label">Active subs</span>
                  <span className="admin-info-value">
                    {p.subs.toLocaleString()}
                  </span>
                </div>
                <div className="admin-plan-row">
                  <span className="admin-info-label">Weekly revenue</span>
                  <span className="admin-info-value">
                    ₹{p.revenue.toLocaleString()}
                  </span>
                </div>

                <div className="admin-plan-features-title">
                  Features
                </div>
                <ul className="admin-plan-features">
                  {p.features.map((f) => (
                    <li key={f}>
                      <i className="fa-solid fa-check" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== ACTIVITY ===================== */}
      {tab === 'activity' && (
        <div className="admin-list-simple">
          {RECENT.map((r) => {
            const meta = ACTIVITY_META[r.type];
            return (
              <div className="admin-list-row" key={r.id}>
                <div
                  className="admin-list-row-icon"
                  style={{ background: `${meta.color}22`, color: meta.color }}
                >
                  <i className={`fa-solid ${meta.icon}`} />
                </div>
                <div className="admin-list-row-body">
                  <div className="admin-list-row-title">
                    {meta.label} · <b>{r.user}</b>
                  </div>
                  <div className="admin-list-row-sub">
                    {r.plan.toUpperCase()} · {r.amount > 0 ? `₹${r.amount}` : '—'}
                  </div>
                </div>
                <span className="admin-muted">{timeAgo(r.at)}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================== CONFIG (finance manage) ===================== */}
      {tab === 'config' && canManage && (
        <>
          <div className="admin-banner warn">
            <i className="fa-solid fa-triangle-exclamation" />
            <div>
              <div className="admin-banner-title">
                Changes require second admin approval
              </div>
              <div className="admin-banner-sub">
                Pricing and feature changes are audit-logged and require a
                second Finance or Super Admin to confirm.
              </div>
            </div>
          </div>

          <div className="admin-info-card">
            <h3 className="admin-card-title">Plan pricing</h3>

            {PLANS.map((p) => (
              <div className="admin-config-row" key={p.id}>
                <div className="admin-config-left">
                  <i
                    className={`fa-solid ${p.icon}`}
                    style={{ color: p.color }}
                  />
                  <span>{p.name}</span>
                </div>
                <div className="admin-config-right">
                  <input
                    className="admin-input"
                    type="number"
                    defaultValue={p.price}
                  />
                  <span className="admin-config-unit">₹/week</span>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-info-card">
            <h3 className="admin-card-title">Promotional campaigns</h3>
            <div className="admin-config-row">
              <div className="admin-config-left">
                <i className="fa-solid fa-gift" style={{ color: '#ff3b81' }} />
                <span>First-week discount</span>
              </div>
              <div className="admin-config-right">
                <input
                  className="admin-input"
                  type="number"
                  defaultValue={20}
                />
                <span className="admin-config-unit">%</span>
              </div>
            </div>

            <div className="admin-config-row">
              <div className="admin-config-left">
                <i className="fa-solid fa-clock" style={{ color: '#ffb020' }} />
                <span>Free trial</span>
              </div>
              <div className="admin-config-right">
                <input
                  className="admin-input"
                  type="number"
                  defaultValue={3}
                />
                <span className="admin-config-unit">days</span>
              </div>
            </div>
          </div>

          <div className="admin-action-row">
            <button className="admin-btn-primary success">
              <i className="fa-solid fa-check" /> Request approval
            </button>
            <button className="admin-btn-ghost">Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}