// =========================================================
// MYNVORA ADMIN — SETTINGS
// Platform configuration. Critical changes need 2nd admin.
// =========================================================

import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore.js';
import { hasPermission } from '../../utils/permissions.js';

// ---------------------------------------------------------
// Setting groups
// ---------------------------------------------------------
const GROUPS = [
  { id: 'verification', label: 'Verification rules',    icon: 'fa-id-card',    color: '#4f8cff' },
  { id: 'photos',       label: 'Photo limits',          icon: 'fa-image',      color: '#8b5cf6' },
  { id: 'age',          label: 'Age rules',             icon: 'fa-cake-candles', color: '#ffb020' },
  { id: 'safety',       label: 'Safety rules',          icon: 'fa-shield-halved', color: '#ff4d67' },
  { id: 'subscription', label: 'Subscription plans',    icon: 'fa-crown',      color: '#ff3b81' },
  { id: 'swipe',        label: 'Swipe limits',          icon: 'fa-fire',       color: '#ff6b9d' },
  { id: 'reports',      label: 'Report categories',     icon: 'fa-flag',       color: '#35d07f' },
  { id: 'ai',           label: 'AI thresholds',         icon: 'fa-robot',      color: '#4f8cff' },
  { id: 'notifications',label: 'Notification templates',icon: 'fa-bullhorn',   color: '#8b5cf6' },
  { id: 'moderation',   label: 'Moderation policies',   icon: 'fa-gavel',      color: '#ff4d67' },
  { id: 'features',     label: 'Feature flags',         icon: 'fa-toggle-on',  color: '#35d07f' },
  { id: 'maintenance',  label: 'Maintenance mode',      icon: 'fa-wrench',     color: '#ffb020' }
];

// ---------------------------------------------------------
// Defaults
// ---------------------------------------------------------
const DEFAULTS = {
  // Verification
  requiredPhotos: 4,
  maxPhotos: 6,
  autoApproveFaceMatch: 0.85,
  requireLiveness: true,
  requireIdDoc: true,
  // Age
  minAge: 16,
  adultAge: 18,
  teenCityLevelOnly: true,
  teenSexualFeaturesDisabled: true,
  // Swipe
  unverifiedSwipes: 3,
  freeSwipes: 8,
  swipeResetHours: 24,
  // AI
  nudityThreshold: 0.7,
  deepfakeThreshold: 0.85,
  scamDetectionEnabled: true,
  duplicatePhotoDetectionEnabled: true,
  // Photos
  nudityAutoBlock: true,
  manualReviewNudity: true,
  // Safety
  crossAgeCommBlocked: true,
  subscriptionCannotBypassAge: true,
  // Maintenance
  maintenanceMode: false,
  // Feature flags
  hookupsEnabled: true,
  travelModeEnabled: true,
  incognitoEnabled: true,
  boostEnabled: true,
  voiceCallsEnabled: true,
  videoCallsEnabled: true
};

export default function Settings() {
  const admin = useAdminStore();
  const canManage = hasPermission(admin, 'settings.manage');

  const [activeGroup, setActiveGroup] = useState('verification');
  const [settings, setSettings] = useState(DEFAULTS);
  const [confirmModal, setConfirmModal] = useState(null);
  const [reason, setReason] = useState('');

  const set = (key, value) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  // CRITICAL flag keys — changing these requires 2nd admin
  const CRITICAL = [
    'crossAgeCommBlocked',
    'subscriptionCannotBypassAge',
    'nudityAutoBlock',
    'teenSexualFeaturesDisabled',
    'teenCityLevelOnly'
  ];

  const attemptChange = (key, value) => {
    if (CRITICAL.includes(key) && value === false) {
      setConfirmModal({ key, value });
      return;
    }
    set(key, value);
  };

  // ---- render helpers ----
  const Row = ({ label, description, children }) => (
    <div className="admin-config-row">
      <div className="admin-config-left-block">
        <span className="admin-config-label">{label}</span>
        {description && (
          <span className="admin-config-desc">{description}</span>
        )}
      </div>
      <div className="admin-config-right">{children}</div>
    </div>
  );

  const Toggle = ({ value, onChange, disabled }) => (
    <label
      className={`admin-switch ${value ? 'on' : ''} ${
        disabled ? 'disabled' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled || !canManage}
      />
      <span className="admin-switch-knob" />
    </label>
  );

  const NumberInput = ({ value, onChange, unit }) => (
    <div className="admin-input-unit">
      <input
        className="admin-input"
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={!canManage}
      />
      {unit && <span className="admin-config-unit">{unit}</span>}
    </div>
  );

  return (
    <div className="admin-page">
      {/* Warning */}
      <div className="admin-banner warn">
        <i className="fa-solid fa-triangle-exclamation" />
        <div>
          <div className="admin-banner-title">
            Critical rules need 2nd admin approval
          </div>
          <div className="admin-banner-sub">
            Age boundaries, safety rules, and subscription overrides cannot be
            disabled by a single admin. All changes are audit logged.
          </div>
        </div>
      </div>

      {!canManage && (
        <div className="admin-banner info">
          <i className="fa-solid fa-eye" />
          <div className="admin-banner-sub">
            Read-only. Only Content Admin or Super Admin can edit settings.
          </div>
        </div>
      )}

      <div className="admin-settings-grid">
        {/* Sidebar */}
        <aside className="admin-settings-sidebar">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              className={`admin-settings-tab ${
                activeGroup === g.id ? 'active' : ''
              }`}
              onClick={() => setActiveGroup(g.id)}
            >
              <i
                className={`fa-solid ${g.icon}`}
                style={{ color: g.color }}
              />
              <span>{g.label}</span>
            </button>
          ))}
        </aside>

        {/* Panel */}
        <div className="admin-settings-panel">
          {/* ===================== VERIFICATION ===================== */}
          {activeGroup === 'verification' && (
            <div className="admin-info-card">
              <h3 className="admin-card-title">Verification rules</h3>

              <Row
                label="Required photos"
                description="Minimum photos a user must upload"
              >
                <NumberInput
                  value={settings.requiredPhotos}
                  onChange={(v) => set('requiredPhotos', v)}
                  unit="photos"
                />
              </Row>

              <Row
                label="Maximum photos"
                description="Hard cap on photos per profile"
              >
                <NumberInput
                  value={settings.maxPhotos}
                  onChange={(v) => set('maxPhotos', v)}
                  unit="photos"
                />
              </Row>

              <Row
                label="Auto-approve face-match threshold"
                description="Above this similarity → auto-approve (0.0–1.0)"
              >
                <NumberInput
                  value={settings.autoApproveFaceMatch}
                  onChange={(v) => set('autoApproveFaceMatch', v)}
                />
              </Row>

              <Row
                label="Require liveness check"
                description="Selfie video + motion detection"
              >
                <Toggle
                  value={settings.requireLiveness}
                  onChange={(v) => set('requireLiveness', v)}
                />
              </Row>

              <Row
                label="Require ID document"
                description="Passport / driver's license / national ID"
              >
                <Toggle
                  value={settings.requireIdDoc}
                  onChange={(v) => set('requireIdDoc', v)}
                />
              </Row>
            </div>
          )}

          {/* ===================== PHOTOS ===================== */}
          {activeGroup === 'photos' && (
            <div className="admin-info-card">
              <h3 className="admin-card-title">Photo moderation</h3>

              <Row
                label="Auto-block on nudity detection"
                description="Block publishing immediately when AI detects nudity"
              >
                <Toggle
                  value={settings.nudityAutoBlock}
                  onChange={(v) => attemptChange('nudityAutoBlock', v)}
                />
              </Row>

              <Row
                label="Manual review for nudity"
                description="Always require a human to review before removing"
              >
                <Toggle
                  value={settings.manualReviewNudity}
                  onChange={(v) => set('manualReviewNudity', v)}
                />
              </Row>
            </div>
          )}

          {/* ===================== AGE ===================== */}
          {activeGroup === 'age' && (
            <div className="admin-info-card">
              <h3 className="admin-card-title">Age boundaries</h3>

              <Row label="Minimum age">
                <NumberInput
                  value={settings.minAge}
                  onChange={(v) => set('minAge', v)}
                  unit="years"
                />
              </Row>

              <Row label="Adult age">
                <NumberInput
                  value={settings.adultAge}
                  onChange={(v) => set('adultAge', v)}
                  unit="years"
                />
              </Row>

              <Row
                label="Teen location = city level only"
                description="Never show distance to 16–17 users"
              >
                <Toggle
                  value={settings.teenCityLevelOnly}
                  onChange={(v) => attemptChange('teenCityLevelOnly', v)}
                />
              </Row>

              <Row
                label="Teen sexual features disabled"
                description="Hookups and sexual categories blocked for 16–17"
              >
                <Toggle
                  value={settings.teenSexualFeaturesDisabled}
                  onChange={(v) =>
                    attemptChange('teenSexualFeaturesDisabled', v)
                  }
                />
              </Row>
            </div>
          )}

          {/* ===================== SAFETY ===================== */}
          {activeGroup === 'safety' && (
            <div className="admin-info-card">
              <h3 className="admin-card-title">Safety rules</h3>

              <Row
                label="Block cross-age communication"
                description="16–17 ↔ 18+ messaging permanently blocked"
              >
                <Toggle
                  value={settings.crossAgeCommBlocked}
                  onChange={(v) => attemptChange('crossAgeCommBlocked', v)}
                />
              </Row>

              <Row
                label="Subscription cannot bypass age"
                description="Diamond and all paid tiers still respect age rules"
              >
                <Toggle
                  value={settings.subscriptionCannotBypassAge}
                  onChange={(v) =>
                    attemptChange('subscriptionCannotBypassAge', v)
                  }
                />
              </Row>
            </div>
          )}

          {/* ===================== SUBSCRIPTION ===================== */}
          {activeGroup === 'subscription' && (
            <div className="admin-info-card">
              <h3 className="admin-card-title">Subscription plans</h3>

              <Row label="Light plan price">
                <NumberInput value={99} onChange={() => {}} unit="₹/week" />
              </Row>

              <Row label="Gold plan price">
                <NumberInput value={199} onChange={() => {}} unit="₹/week" />
              </Row>

              <Row label="Diamond plan price">
                <NumberInput value={399} onChange={() => {}} unit="₹/week" />
              </Row>

              <Row
                label="Free trial"
                description="Days a new user gets full access for free"
              >
                <NumberInput value={0} onChange={() => {}} unit="days" />
              </Row>
            </div>
          )}

          {/* ===================== SWIPE ===================== */}
          {activeGroup === 'swipe' && (
            <div className="admin-info-card">
              <h3 className="admin-card-title">Swipe limits</h3>

              <Row
                label="Swipes for unverified users"
                description="Then verification is required"
              >
                <NumberInput
                  value={settings.unverifiedSwipes}
                  onChange={(v) => set('unverifiedSwipes', v)}
                  unit="swipes"
                />
              </Row>

              <Row
                label="Swipes for verified free users"
                description="Resets on a rolling window"
              >
                <NumberInput
                  value={settings.freeSwipes}
                  onChange={(v) => set('freeSwipes', v)}
                  unit="swipes"
                />
              </Row>

              <Row label="Swipe reset window">
                <NumberInput
                  value={settings.swipeResetHours}
                  onChange={(v) => set('swipeResetHours', v)}
                  unit="hours"
                />
              </Row>
            </div>
          )}

          {/* ===================== REPORTS ===================== */}
          {activeGroup === 'reports' && (
            <div className="admin-info-card">
              <h3 className="admin-card-title">Report categories</h3>
              <p className="admin-config-desc" style={{ marginBottom: 14 }}>
                Active report reasons users can select when reporting a profile.
              </p>

              <div className="admin-tag-list">
                {[
                  'Fake profile',
                  'Harassment',
                  'Scam / spam',
                  'Impersonation',
                  'Inappropriate photo',
                  'Underage',
                  'Threatening behavior',
                  'Suspicious activity',
                  'Age-related violation',
                  'Other'
                ].map((tag) => (
                  <span key={tag} className="admin-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ===================== AI ===================== */}
          {activeGroup === 'ai' && (
            <div className="admin-info-card">
              <h3 className="admin-card-title">AI thresholds</h3>

              <Row
                label="Nudity detection threshold"
                description="0.0–1.0. Higher = fewer false positives"
              >
                <NumberInput
                  value={settings.nudityThreshold}
                  onChange={(v) => set('nudityThreshold', v)}
                />
              </Row>

              <Row
                label="Deepfake detection threshold"
                description="0.0–1.0"
              >
                <NumberInput
                  value={settings.deepfakeThreshold}
                  onChange={(v) => set('deepfakeThreshold', v)}
                />
              </Row>

              <Row label="Scam / bot detection">
                <Toggle
                  value={settings.scamDetectionEnabled}
                  onChange={(v) => set('scamDetectionEnabled', v)}
                />
              </Row>

              <Row label="Duplicate photo detection">
                <Toggle
                  value={settings.duplicatePhotoDetectionEnabled}
                  onChange={(v) =>
                    set('duplicatePhotoDetectionEnabled', v)
                  }
                />
              </Row>
            </div>
          )}

          {/* ===================== NOTIFICATIONS ===================== */}
          {activeGroup === 'notifications' && (
            <div className="admin-info-card">
              <h3 className="admin-card-title">Notification templates</h3>

              <Row label="Match notification">
                <input
                  className="admin-input"
                  defaultValue="You and {{name}} liked each other!"
                  disabled={!canManage}
                />
              </Row>

              <Row label="New message">
                <input
                  className="admin-input"
                  defaultValue="New message from {{name}}"
                  disabled={!canManage}
                />
              </Row>

              <Row label="Verification approved">
                <input
                  className="admin-input"
                  defaultValue="You're verified ✓"
                  disabled={!canManage}
                />
              </Row>
            </div>
          )}

          {/* ===================== MODERATION ===================== */}
          {activeGroup === 'moderation' && (
            <div className="admin-info-card">
              <h3 className="admin-card-title">Moderation policies</h3>

              <Row
                label="Warning before suspension"
                description="Strikes allowed before an automatic suspension"
              >
                <NumberInput value={2} onChange={() => {}} unit="strikes" />
              </Row>

              <Row
                label="Suspension duration"
                description="Length of a standard temporary suspension"
              >
                <NumberInput value={7} onChange={() => {}} unit="days" />
              </Row>

              <Row
                label="Auto-ban after repeated violations"
                description="Ban automatically after this many suspensions"
              >
                <NumberInput value={3} onChange={() => {}} unit="times" />
              </Row>
            </div>
          )}

          {/* ===================== FEATURES ===================== */}
          {activeGroup === 'features' && (
            <div className="admin-info-card">
              <h3 className="admin-card-title">Feature flags</h3>

              <Row label="Hookups category">
                <Toggle
                  value={settings.hookupsEnabled}
                  onChange={(v) => set('hookupsEnabled', v)}
                />
              </Row>

              <Row label="Travel Mode">
                <Toggle
                  value={settings.travelModeEnabled}
                  onChange={(v) => set('travelModeEnabled', v)}
                />
              </Row>

              <Row label="Incognito Mode">
                <Toggle
                  value={settings.incognitoEnabled}
                  onChange={(v) => set('incognitoEnabled', v)}
                />
              </Row>

              <Row label="Boost">
                <Toggle
                  value={settings.boostEnabled}
                  onChange={(v) => set('boostEnabled', v)}
                />
              </Row>

              <Row label="Voice calls">
                <Toggle
                  value={settings.voiceCallsEnabled}
                  onChange={(v) => set('voiceCallsEnabled', v)}
                />
              </Row>

              <Row label="Video calls">
                <Toggle
                  value={settings.videoCallsEnabled}
                  onChange={(v) => set('videoCallsEnabled', v)}
                />
              </Row>
            </div>
          )}

          {/* ===================== MAINTENANCE ===================== */}
          {activeGroup === 'maintenance' && (
            <div className="admin-info-card">
              <h3 className="admin-card-title">Maintenance mode</h3>

              <Row
                label="Enable maintenance mode"
                description="Users see a maintenance screen instead of the app"
              >
                <Toggle
                  value={settings.maintenanceMode}
                  onChange={(v) => set('maintenanceMode', v)}
                />
              </Row>

              {settings.maintenanceMode && (
                <div className="admin-banner warn" style={{ marginTop: 12 }}>
                  <i className="fa-solid fa-triangle-exclamation" />
                  <div className="admin-banner-sub">
                    Enabling maintenance logs out active sessions. New logins
                    will see a maintenance page.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Save bar */}
          {canManage && (
            <div className="admin-action-row" style={{ marginTop: 20 }}>
              <button className="admin-btn-primary success">
                <i className="fa-solid fa-check" /> Save changes
              </button>
              <button className="admin-btn-ghost">Discard</button>
            </div>
          )}
        </div>
      </div>

      {/* Critical change modal */}
      {confirmModal && (
        <div
          className="admin-modal-scrim"
          onClick={() => setConfirmModal(null)}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Second approval required</h3>
            <p>
              You're trying to disable a critical safety rule. A second admin
              must confirm. Every change is logged.
            </p>

            <div className="admin-modal-info">
              <div className="admin-info-row">
                <span className="admin-info-label">Setting</span>
                <span className="admin-info-value">{confirmModal.key}</span>
              </div>
              <div className="admin-info-row">
                <span className="admin-info-label">New value</span>
                <span className="admin-info-value danger">
                  {String(confirmModal.value)}
                </span>
              </div>
            </div>

            <label className="admin-field">
              <span>Reason (required)</span>
              <textarea
                className="admin-textarea"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why is this being changed?"
              />
            </label>

            <div className="admin-modal-actions">
              <button
                className="admin-btn-ghost"
                onClick={() => setConfirmModal(null)}
              >
                Cancel
              </button>
              <button
                className="admin-btn-primary danger"
                disabled={!reason.trim()}
                onClick={() => {
                  alert(
                    `Critical change requested — awaiting 2nd admin approval (demo)`
                  );
                  setConfirmModal(null);
                  setReason('');
                }}
              >
                Request approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}