// =========================================================
// MYNVORA — WELCOME
// Premium animated onboarding. Matches Tinder/Bumble feel.
// =========================================================

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-screen">
      {/* Floating hearts background */}
      <div className="welcome-bg">
        <span className="welcome-heart h1">❤️</span>
        <span className="welcome-heart h2">💕</span>
        <span className="welcome-heart h3">💖</span>
        <span className="welcome-heart h4">🌸</span>
        <span className="welcome-heart h5">✨</span>
        <span className="welcome-heart h6">💫</span>
        <span className="welcome-heart h7">🔥</span>
        <span className="welcome-heart h8">💗</span>
      </div>

      {/* Content */}
      <div className="welcome-content">
        {/* Logo */}
        <div className="welcome-logo">
          <div className="welcome-logo-ring ring-1" />
          <div className="welcome-logo-ring ring-2" />
          <div className="welcome-logo-ring ring-3" />
          <div className="welcome-logo-inner">
            <i className="fa-solid fa-heart" />
          </div>
        </div>

        {/* Brand */}
        <h1 className="welcome-brand">MYNVORA</h1>
        <p className="welcome-tagline">Where hearts find their rhythm.</p>

        <p className="welcome-desc">
          Meet real people nearby. Verified profiles, real vibes, real
          connections.
        </p>

        {/* Benefits */}
        <div className="welcome-benefits">
          <div className="welcome-benefit">
            <span className="welcome-benefit-icon">✓</span>
            <span>Verified profiles</span>
          </div>
          <div className="welcome-benefit">
            <span className="welcome-benefit-icon">✓</span>
            <span>AI-powered safety</span>
          </div>
          <div className="welcome-benefit">
            <span className="welcome-benefit-icon">✓</span>
            <span>Real connections</span>
          </div>
        </div>

        {/* CTAs */}
        <button
          className="btn-primary welcome-cta"
          onClick={() => navigate(ROUTES.SIGNUP_OPTIONS)}
        >
          Get Started <i className="fa-solid fa-arrow-right" />
        </button>

        <button
          className="btn-ghost welcome-cta-2"
          onClick={() => navigate(ROUTES.LOGIN)}
        >
          I already have an account
        </button>

        {/* Footer */}
        <p className="welcome-footer">
          By continuing you agree to our{' '}
          <a href="/settings/legal">Terms</a> and{' '}
          <a href="/settings/legal">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}