// =========================================================
// MYNVORA — SUBSCRIPTION PLANS + ADD-ONS
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIER_INFO } from '../../data/subscriptions.js';
import { useUserStore } from '../../store/userStore.js';

const PLANS = [
  {
    id: 'light',
    name: 'Light',
    price: '₹99',
    period: '/week',
    tagline: 'Everything you need to start',
    features: [
      'See Who Liked You',
      'Unlimited Likes',
      'Profile Customization',
      'Hobbies & Interests',
      'Music / Movies',
      'Relationship Intentions',
      'Basic Discovery',
      'Chat',
      'Safety Tools',
      'All AI Safety Features',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '₹199',
    period: '/week',
    highlighted: true,
    tagline: 'The most popular choice',
    features: [
      'Everything in Light',
      'See Who Viewed Your Profile',
      'Voice Calls',
      'Read Receipts',
      'Read Receipt Toggle',
      'Rewind',
      'Super Likes',
      'Better Discovery',
    ],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: '₹399',
    period: '/week',
    tagline: 'Ultimate Mynvora experience',
    features: [
      'Everything in Gold',
      'Unlimited Swiping',
      'Video Calls',
      'Travel Mode',
      'Incognito Mode',
      'Hookup Access',
      'Advanced Filters',
      'Online-Now Discovery',
      'Social Sharing',
      'Advanced Intent Matching',
    ],
  },
];

const ADDONS = [
  {
    id: 'stars_6',
    icon: 'fa-star',
    color: '#ffb020',
    title: '6 Stars',
    price: 99,
    subtitle: 'Send 6 Super Likes',
  },
  {
    id: 'stars_14',
    icon: 'fa-star',
    color: '#ffb020',
    title: '14 Stars',
    price: 199,
    subtitle: 'Best value · 14 Super Likes',
    highlighted: true,
  },
  {
    id: 'boost_24',
    icon: 'fa-bolt',
    color: '#ff6b9d',
    title: 'Boost · 24h',
    price: 149,
    subtitle: 'Priority matching for 24 hours',
  },
  {
    id: 'boost_48',
    icon: 'fa-bolt',
    color: '#ff6b9d',
    title: 'Boost · 48h',
    price: 299,
    subtitle: 'Extended priority matching',
  },
  {
    id: 'hookups',
    icon: 'fa-fire',
    color: '#ff3b81',
    title: 'Unlimited Hookups',
    price: 99,
    subtitle: 'One-time · Diamond only',
    diamondOnly: true,
  },
];

export default function Plans() {
  const navigate = useNavigate();
  const { tier, setTier } = useUserStore();

  const [purchasing, setPurchasing] = useState(null);
  const [confirmAddon, setConfirmAddon] = useState(null);

  const choosePlan = (planId) => {
    setTier(planId);
    alert(`Subscribed to ${TIER_INFO[planId].name} (demo mode)`);
    navigate('/profile');
  };

  const buyAddon = (addon) => {
    setPurchasing(addon.id);
    setTimeout(() => {
      setPurchasing(null);
      setConfirmAddon(null);
      alert(`${addon.title} purchased (demo)`);
    }, 600);
  };

  return (
    <div className="plans-screen">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ←
      </button>

      <div className="plans-head">
        <h1>Upgrade Mynvora</h1>
        <p>Choose the plan that fits you. Cancel anytime.</p>
      </div>

      {/* ===================== SUBSCRIPTIONS ===================== */}
      <div className="plans-list">
        {PLANS.map((p) => {
          const isCurrent = tier === p.id;

          return (
            <div
              key={p.id}
              className={`plan-card ${p.highlighted ? 'highlighted' : ''} ${
                isCurrent ? 'current' : ''
              }`}
            >
              {p.highlighted && !isCurrent && (
                <div className="plan-badge">Most popular</div>
              )}
              {isCurrent && (
                <div className="plan-badge current-badge">Current plan</div>
              )}

              <div className="plan-top">
                <div>
                  <div className="plan-name">{p.name}</div>
                  <div className="plan-tagline">{p.tagline}</div>
                </div>

                <div className="plan-price">
                  <strong>{p.price}</strong>
                  <span>{p.period}</span>
                </div>
              </div>

              <ul className="plan-features">
                {p.features.map((f) => (
                  <li key={f}>
                    <i className="fa-solid fa-check" /> {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button className="btn-ghost" disabled>
                  Current plan
                </button>
              ) : (
                <button
                  className={p.highlighted ? 'btn-main' : 'btn-primary'}
                  onClick={() => choosePlan(p.id)}
                  style={{ width: '100%' }}
                >
                  Get {p.name} <i className="fa-solid fa-arrow-right" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ===================== ADD-ONS ===================== */}
      <div
        style={{
          marginTop: 30,
          padding: '0 20px',
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#1a1a2e',
            marginBottom: 6,
            letterSpacing: -0.4,
          }}
        >
          Add-ons
        </h2>
        <p
          style={{
            fontSize: 13,
            color: '#63637a',
            marginBottom: 16,
          }}
        >
          Buy what you need — one-time purchases
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          {ADDONS.map((addon) => {
            const locked = addon.diamondOnly && tier !== 'diamond';

            return (
              <div
                key={addon.id}
                style={{
                  position: 'relative',
                  padding: 16,
                  borderRadius: 16,
                  background: '#fff',
                  border: addon.highlighted
                    ? `1.5px solid ${addon.color}`
                    : '1px solid #ebebf0',
                  boxShadow: addon.highlighted
                    ? `0 8px 24px ${addon.color}22`
                    : '0 2px 8px rgba(26,26,46,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {addon.highlighted && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -10,
                      left: 12,
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: addon.color,
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: 0.3,
                    }}
                  >
                    BEST VALUE
                  </div>
                )}

                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: `${addon.color}22`,
                    color: addon.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                  }}
                >
                  <i className={`fa-solid ${addon.icon}`} />
                </div>

                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#1a1a2e',
                    letterSpacing: -0.2,
                  }}
                >
                  {addon.title}
                </div>

                <div
                  style={{
                    fontSize: 11.5,
                    color: '#777789',
                    lineHeight: 1.4,
                    flex: 1,
                  }}
                >
                  {addon.subtitle}
                </div>

                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#1a1a2e',
                    marginTop: 4,
                  }}
                >
                  ₹{addon.price}
                </div>

                <button
                  onClick={() => setConfirmAddon(addon)}
                  disabled={locked}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 999,
                    background: locked
                      ? '#f0f0f5'
                      : `linear-gradient(135deg, ${addon.color}, #8b5cf6)`,
                    color: locked ? '#9e9eb3' : '#fff',
                    fontWeight: 800,
                    fontSize: 12.5,
                    border: 'none',
                    cursor: locked ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {locked ? 'Diamond only' : 'Buy'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================== SAFETY NOTE ===================== */}
      <div className="safety-note-plans" style={{ marginTop: 24 }}>
        <i className="fa-solid fa-shield-halved" />
        <p>
          <strong>All AI safety features</strong> are free for every tier — fake
          profile detection, deepfake detection, face verification, and more.{' '}
          <strong>Subscriptions never bypass age or safety rules.</strong>
        </p>
      </div>

      {/* ===================== CONFIRM MODAL ===================== */}
      {confirmAddon && (
        <div
          className="modal-scrim"
          onClick={() => !purchasing && setConfirmAddon(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-icon"
              style={{
                background: `linear-gradient(135deg, ${confirmAddon.color}, #8b5cf6)`,
              }}
            >
              <i className={`fa-solid ${confirmAddon.icon}`} />
            </div>

            <h2 className="modal-title">{confirmAddon.title}</h2>
            <p className="modal-sub">
              {confirmAddon.subtitle}
              <br />
              <br />
              <strong style={{ fontSize: 20 }}>
                ₹{confirmAddon.price}
              </strong>
            </p>

            <button
              className="btn-primary"
              onClick={() => buyAddon(confirmAddon)}
              disabled={!!purchasing}
            >
              {purchasing === confirmAddon.id
                ? 'Processing…'
                : `Confirm ₹${confirmAddon.price}`}
            </button>

            <button
              className="btn-ghost"
              onClick={() => setConfirmAddon(null)}
              disabled={!!purchasing}
              style={{ marginTop: 10 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}