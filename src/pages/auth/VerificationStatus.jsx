// =========================================================
// MYNVORA — VERIFICATION STATUS
// Clean checklist with icons, staggered animation,
// and clear CTA to continue.
// =========================================================

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';

const STEPS = [
  {
    id: 'email',
    icon: 'fa-envelope',
    label: 'Email verified',
    sub: 'Your email address is confirmed',
    status: 'done'
  },
  {
    id: 'phone',
    icon: 'fa-mobile-screen',
    label: 'Phone verified',
    sub: 'Your phone number is confirmed',
    status: 'done'
  },
  {
    id: 'age',
    icon: 'fa-cake-candles',
    label: 'Age confirmed',
    sub: 'You meet the age requirement',
    status: 'done'
  },
  {
    id: 'identity',
    icon: 'fa-id-card',
    label: 'Identity review',
    sub: 'Our team is reviewing your ID — usually a few minutes',
    status: 'pending'
  }
];

export default function VerificationStatus() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-body">
        {/* Hero icon */}
        <div className="verify-hero">
          <div className="verify-hero-icon">
            <i className="fa-solid fa-shield-halved" />
          </div>

          <div className="verify-hero-pulse" />
          <div className="verify-hero-pulse pulse-2" />
        </div>

        {/* Headline */}
        <h1 className="auth-title center-title">
          Verification in progress
        </h1>

        <p className="auth-sub center-sub">
          We're reviewing your information. This usually takes just a few
          minutes.
        </p>

        {/* Checklist */}
        <div className="verify-list">
          {STEPS.map((step, i) => (
            <div
              className={`verify-item ${
                step.status === 'done' ? 'done' : 'pending'
              }`}
              key={step.id}
              style={{ animationDelay: `${0.05 + i * 0.1}s` }}
            >
              {/* Icon circle */}
              <div className="verify-item-icon">
                {step.status === 'done' ? (
                  <i className="fa-solid fa-check" />
                ) : (
                  <i className="fa-solid fa-clock" />
                )}
              </div>

              {/* Body */}
              <div className="verify-item-body">
                <div className="verify-item-label">{step.label}</div>
                <div className="verify-item-sub">{step.sub}</div>
              </div>

              {/* Status badge */}
              {step.status === 'done' ? (
                <span className="verify-item-badge done">Done</span>
              ) : (
                <span className="verify-item-badge pending">
                  <span className="verify-item-spinner" />
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Info banner */}
        <div className="verify-info-banner">
          <i className="fa-solid fa-circle-info" />
          <p>
            You can start exploring now — we'll notify you when identity
            review is complete.
          </p>
        </div>

        {/* CTA */}
        <button
          className="btn-primary"
          onClick={() => navigate(ROUTES.DISCOVER)}
          style={{ marginTop: 8 }}
        >
          Start exploring <i className="fa-solid fa-arrow-right" />
        </button>

        {/* Footnote */}
        <p className="auth-sub small" style={{ textAlign: 'center' }}>
          Need help? Contact{' '}
          <a href="mailto:support@mynvora.app">support@mynvora.app</a>
        </p>
      </div>
    </div>
  );
}