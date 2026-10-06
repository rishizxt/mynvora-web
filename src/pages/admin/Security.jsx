// =========================================================
// MYNVORA ADMIN — SECURITY
// Access rules · recent access events · sensitive actions.
// =========================================================

import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore.js';
import { hasPermission } from '../../utils/permissions.js';

// ---------------------------------------------------------
// Security policies
// ---------------------------------------------------------
const POLICIES = [
  {
    id: 'mfa',
    icon: 'fa-mobile-screen',
    color: '#4f8cff',
    title: 'Two-factor authentication',
    description: 'TOTP required for every admin login',
    value: 'Required for all admins',
    status: 'enforced'
  },
  {
    id: 'ip',
    icon: 'fa-network-wired',
    color: '#8b5cf6',
    title: 'IP allowlist',
    description: 'Restrict admin access to approved networks',
    value: 'Super Admin + Verification Admin',
    status: 'enforced'
  },
  {
    id: 'session',
    icon: 'fa-clock',
    color: '#ffb020',
    title: 'Session timeout',
    description: 'Auto-logout after inactivity',
    value: '15 minutes',
    status: 'enforced'
  },
  {
    id: 'reauth',
    icon: 'fa-key',
    color: '#35d07f',
    title: 'Re-authentication',
    description: 'Required for destructive actions',
    value: 'Ban · Refund · Settings change',
    status: 'enforced'
  },
  {
    id: 'dual',
    icon: 'fa-users-line',
    color: '#ff3b81',
    title: 'Dual approval',
    description: 'Sensitive actions require 2nd admin',
    value: 'Bans > 30 days · Refunds > ₹5,000 · Safety rules',
    status: 'enforced'
  },
  {
    id: 'breakglass',
    icon: 'fa-triangle-exclamation',
    color: '#ff4d67',
    title: 'Break-glass alerts',
    description: 'Super Admin actions trigger alerts',
    value: 'Slack · Email · SMS to leadership',
    status: 'enforced'
  }
];

// ---------------------------------------------------------
// Recent access events
// ---------------------------------------------------------
const ACCESS_EVENTS = [
  {
    id: 'SEC-1042',
    at: Date.now() - 8 * 60 * 1000,
    adminId: 'ADM_1002',
    adminName: 'Priya Sharma',
    adminRole: 'verification_admin',
    action: 'viewed_id_document',
    detail: 'VR-82931 · Mia Kapoor',
    risk: 'normal',
    ip: '203.0.113.42',
    device: 'Chrome on Windows'
  },
  {
    id: 'SEC-1041',
    at: Date.now() - 32 * 60 * 1000,
    adminId: 'ADM_1001',
    adminName: 'Alex Rivera',
    adminRole: 'super_admin',
    action: 'breakglass_action',
    detail: 'Banned u_9911 (deepfake)',
    risk: 'high',
    ip: '203.0.113.10',
    device: 'Chrome on macOS'
  },
  {
    id: 'SEC-1040',
    at: Date.now() - 2 * 60 * 60 * 1000,
    adminId: 'ADM_1003',
    adminName: 'Jordan Lee',
    adminRole: 'moderation_admin',
    action: 'viewed_flagged_content',
    detail: 'FLG-48291 · Rushi Singh → Mia Kapoor',
    risk: 'normal',
    ip: '198.51.100.24',
    device: 'Firefox on Linux'
  },
  {
    id: 'SEC-1039',
    at: Date.now() - 5 * 60 * 60 * 1000,
    adminId: 'ADM_1005',
    adminName: 'Maya Singh',
    adminRole: 'support_admin',
    action: 'access_denied',
    detail: 'Attempted: ban user u_4422',
    risk: 'high',
    ip: '198.51.100.88',
    device: 'Chrome on Windows'
  },
  {
    id: 'SEC-1038',
    at: Date.now() - 8 * 60 * 60 * 1000,
    adminId: 'ADM_1006',
    adminName: 'Chris Wong',
    adminRole: 'finance_admin',
    action: 'issue_refund',
    detail: 'RF-4827 · Aisha Khan · ₹99',
    risk: 'normal',
    ip: '203.0.113.55',
    device: 'Safari on macOS'
  },
  {
    id: 'SEC-1037',
    at: Date.now() - 18 * 60 * 60 * 1000,
    adminId: 'ADM_1004',
    adminName: 'Sam Okafor',
    adminRole: 'safety_admin',
    action: 'viewed_private_chat',
    detail: 'COM-2198 · spam flag',
    risk: 'normal',
    ip: '198.51.100.12',
    device: 'Chrome on Windows'
  },
  {
    id: 'SEC-1036',
    at: Date.now() - 24 * 60 * 60 * 1000,
    adminId: 'UNKNOWN',
    adminName: 'Unknown',
    adminRole: 'unknown',
    action: 'login_attempt_failed',
    detail: 'Wrong password × 3 from new IP',
    risk: 'critical',
    ip: '45.142.120.99',
    device: 'Unknown'
  }
];

const ACTION_META = {
  viewed_id_document:    { color: '#4f8cff', label: 'Viewed ID document' },
  breakglass_action:     { color: '#ff4d67', label: 'Break-glass action' },
  viewed_flagged_content:{ color: '#ffb020', label: 'Viewed flagged content' },
  access_denied:         { color: '#ff4d67', label: 'Access denied' },
  issue_refund:          { color: '#35d07f', label: 'Issued refund' },
  viewed_private_chat:   { color: '#8b5cf6', label: 'Viewed private chat' },
  login_attempt_failed:  { color: '#ff4d67', label: 'Failed login' }
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

export default function Security() {
  const admin = useAdminStore();
  const canView = hasPermission(admin, 'security.read');

  const [tab, setTab] = useState('policies');
  const [riskFilter, setRiskFilter] = useState('all');

  if (!canView) {
    return (
      <div className="admin-page">
        <div className="admin-banner info">
          <i className="fa-solid fa-lock" />
          <div className="admin-banner-sub">
            You don't have access to the security console.
          </div>
        </div>
      </div>
    );
  }

  const filteredEvents =
    riskFilter === 'all'
      ? ACCESS_EVENTS
      : ACCESS_EVENTS.filter((e) => e.risk === riskFilter);

  const criticalCount = ACCESS_EVENTS.filter((e) => e.risk === 'critical').length;
  const highCount = ACCESS_EVENTS.filter((e) => e.risk === 'high').length;

  return (
    <div className="admin-page">
      {/* Warning banner if there are active alerts */}
      {(criticalCount > 0 || highCount > 0) && (
        <div className="admin-banner danger">
          <i className="fa-solid fa-triangle-exclamation" />
          <div>
            <div className="admin-banner-title">
              {criticalCount} critical · {highCount} high-risk event
              {criticalCount + highCount !== 1 ? 's' : ''} detected
            </div>
            <div className="admin-banner-sub">
              Review recent access logs below. High-risk events are also
              auto-alerted to leadership.
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === 'policies' ? 'active' : ''}`}
          onClick={() => setTab('policies')}
        >
          <i className="fa-solid fa-shield-halved" /> Policies
        </button>
        <button
          className={`admin-tab ${tab === 'events' ? 'active' : ''}`}
          onClick={() => setTab('events')}
        >
          <i className="fa-solid fa-list" /> Access events (
          {ACCESS_EVENTS.length})
        </button>
      </div>

      {/* ===================== POLICIES ===================== */}
      {tab === 'policies' && (
        <>
          <div className="admin-security-grid">
            {POLICIES.map((p) => (
              <div className="admin-security-card" key={p.id}>
                <div className="admin-security-head">
                  <div
                    className="admin-security-icon"
                    style={{ background: `${p.color}22`, color: p.color }}
                  >
                    <i className={`fa-solid ${p.icon}`} />
                  </div>
                  <span
                    className="admin-status-pill"
                    style={{
                      background: 'rgba(53,208,127,0.15)',
                      color: '#35d07f'
                    }}
                  >
                    <i className="fa-solid fa-check" /> {p.status}
                  </span>
                </div>

                <div className="admin-security-title">{p.title}</div>
                <div className="admin-security-desc">{p.description}</div>

                <div className="admin-security-value">
                  <i className="fa-solid fa-circle-info" /> {p.value}
                </div>
              </div>
            ))}
          </div>

          {/* Role summary */}
          <div className="admin-info-card" style={{ marginTop: 24 }}>
            <h3 className="admin-card-title">
              <i className="fa-solid fa-shield-halved" /> Sensitive data access
            </h3>

            <div className="admin-info-row">
              <span className="admin-info-label">Government IDs</span>
              <span className="admin-info-value">
                Only Verification Admins (audit-logged on every view)
              </span>
            </div>

            <div className="admin-info-row">
              <span className="admin-info-label">Flagged nude/sexual content</span>
              <span className="admin-info-value">
                Only Moderation / Safety Admins (audit-logged)
              </span>
            </div>

            <div className="admin-info-row">
              <span className="admin-info-label">Private chat messages</span>
              <span className="admin-info-value">
                Case-based only — flagged or reported
              </span>
            </div>

            <div className="admin-info-row">
              <span className="admin-info-label">Payment details</span>
              <span className="admin-info-value">
                Only Finance Admin (audit-logged)
              </span>
            </div>

            <div className="admin-info-row">
              <span className="admin-info-label">Analytics with PII</span>
              <span className="admin-info-value">
                Never — only aggregated
              </span>
            </div>
          </div>
        </>
      )}

      {/* ===================== EVENTS ===================== */}
      {tab === 'events' && (
        <>
          <div className="admin-toolbar">
            <div className="admin-filter-row">
              <select
                className="admin-select"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="all">All risk levels</option>
                <option value="critical">🔴 Critical</option>
                <option value="high">🟠 High</option>
                <option value="normal">🟢 Normal</option>
              </select>
            </div>
          </div>

          <div className="admin-list-count">
            {filteredEvents.length} event
            {filteredEvents.length !== 1 ? 's' : ''}
          </div>

          <div className="admin-list-simple">
            {filteredEvents.map((e) => {
              const meta = ACTION_META[e.action] || {
                color: '#777789',
                label: e.action
              };

              return (
                <div className="admin-list-row" key={e.id}>
                  <div
                    className="admin-list-row-icon"
                    style={{
                      background: `${meta.color}22`,
                      color: meta.color
                    }}
                  >
                    <i className="fa-solid fa-user-shield" />
                  </div>

                  <div className="admin-list-row-body">
                    <div className="admin-list-row-title">
                      <b>{e.adminName}</b> · {meta.label}
                    </div>
                    <div className="admin-list-row-sub">
                      {e.detail} · {e.device} · IP {e.ip}
                    </div>
                  </div>

                  {e.risk !== 'normal' && (
                    <span
                      className={`admin-risk ${
                        e.risk === 'critical' ? 'critical' : 'high'
                      }`}
                    >
                      {e.risk === 'critical' ? 'CRITICAL' : 'HIGH'}
                    </span>
                  )}

                  <span className="admin-muted">{timeAgo(e.at)}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}