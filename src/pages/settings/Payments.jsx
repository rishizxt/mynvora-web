// =========================================================
// MYNVORA — PAYMENTS & SUBSCRIPTIONS
// Manage plan, payment methods, restore purchases.
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore.js';
import { TIER_INFO } from '../../data/subscriptions.js';

const PAYMENT_METHODS = [
  {
    id: 'upi',
    icon: 'fa-mobile-screen',
    label: 'UPI',
    sub: 'Google Pay · PhonePe · Paytm'
  },
  {
    id: 'card',
    icon: 'fa-credit-card',
    label: 'Credit / Debit card',
    sub: 'Visa · Mastercard · Amex'
  },
  {
    id: 'play',
    icon: 'fa-google-play',
    label: 'Google Play',
    sub: 'Billed through Play Store'
  },
  {
    id: 'apple',
    icon: 'fa-apple',
    label: 'Apple Pay',
    sub: 'Billed through App Store'
  }
];

export default function Payments() {
  const navigate = useNavigate();
  const { tier } = useUserStore();

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showRestore, setShowRestore] = useState(false);

  const currentTier = TIER_INFO[tier] || TIER_INFO.free;

  return (
    <div className="settings-screen">
      {/* Header */}
      <div className="settings-page-head">
        <button className="back-btn-inline" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Payments</h1>
        <div style={{ width: 44 }} />
      </div>

      {/* Current plan */}
      <div className="settings-section">
        <div className="settings-section-title">Current plan</div>

        <div className={`current-plan-card tier-${tier}`}>
          <div className="current-plan-top">
            <div className="current-plan-icon">
              {tier === 'diamond' && '💎'}
              {tier === 'gold' && '👑'}
              {tier === 'light' && '✨'}
              {tier === 'free' && '🆓'}
            </div>
            <div className="current-plan-info">
              <div className="current-plan-name">
                Mynvora {currentTier.name}
              </div>
              <div className="current-plan-sub">
                {currentTier.priceLabel}
              </div>
            </div>
          </div>

          {tier !== 'free' && (
            <div className="current-plan-meta">
              Renews on 8 Oct 2026
            </div>
          )}

          {tier === 'free' ? (
            <button
              className="btn-main"
              onClick={() => navigate('/subscription')}
              style={{ marginTop: 14 }}
            >
              Upgrade plan <span>→</span>
            </button>
          ) : (
            <button
              className="btn-ghost"
              onClick={() => navigate('/subscription')}
              style={{ marginTop: 14 }}
            >
              Manage or upgrade
            </button>
          )}
        </div>
      </div>

      {/* Payment methods */}
      <div className="settings-section">
        <div className="settings-section-title">Payment methods</div>

        <div className="payment-methods-list">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              className={`payment-method ${
                selectedMethod === m.id ? 'active' : ''
              }`}
              onClick={() => setSelectedMethod(m.id)}
            >
              <div className="payment-method-icon">
                <i className={`fa-brands ${m.icon}`} />
                {!m.icon.startsWith('fa-') && (
                  <i className={`fa-solid ${m.icon}`} />
                )}
              </div>
              <div className="payment-method-body">
                <div className="payment-method-label">{m.label}</div>
                <div className="payment-method-sub">{m.sub}</div>
              </div>
              <span className="payment-method-radio">
                {selectedMethod === m.id && (
                  <span className="payment-method-radio-dot" />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Manage */}
      <div className="settings-section">
        <div className="settings-section-title">Manage</div>

        <div className="settings-card">
          <button
            className="settings-section-item"
            onClick={() => setShowRestore(true)}
          >
            <div className="settings-section-icon">
              <i className="fa-solid fa-rotate" />
            </div>
            <div className="settings-section-body">
              <div className="settings-section-label">
                Restore purchases
              </div>
              <div className="settings-section-sub">
                Recover subscriptions from Google Play / App Store
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-section-arrow" />
          </button>

          <button
            className="settings-section-item"
            onClick={() => navigate('/settings/help')}
          >
            <div className="settings-section-icon">
              <i className="fa-solid fa-file-invoice" />
            </div>
            <div className="settings-section-body">
              <div className="settings-section-label">
                Billing history
              </div>
              <div className="settings-section-sub">
                View past payments and invoices
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-section-arrow" />
          </button>

          <button
            className="settings-section-item danger"
            onClick={() => {
              if (confirm('Cancel your subscription? (demo)')) {
                alert('Subscription cancelled (demo)');
              }
            }}
          >
            <div className="settings-section-icon danger">
              <i className="fa-solid fa-xmark" />
            </div>
            <div className="settings-section-body">
              <div className="settings-section-label">
                Cancel subscription
              </div>
              <div className="settings-section-sub">
                You'll keep access until end of billing period
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-section-arrow" />
          </button>
        </div>
      </div>

      {/* Restore modal */}
      {showRestore && (
        <div className="modal-scrim" onClick={() => setShowRestore(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <i className="fa-solid fa-rotate" />
            </div>
            <h2 className="modal-title">Restore purchases?</h2>
            <p className="modal-sub">
              We'll check Google Play / App Store for any active subscriptions
              linked to this device.
            </p>

            <button
              className="btn-main"
              onClick={() => {
                alert('Searching for purchases... (demo)');
                setShowRestore(false);
              }}
            >
              Restore now <span>→</span>
            </button>

            <button
              className="btn-ghost"
              onClick={() => setShowRestore(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}