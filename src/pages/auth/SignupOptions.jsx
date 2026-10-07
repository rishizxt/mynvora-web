// =========================================================
// MYNVORA — SIGNUP OPTIONS
// Clean sequence: Email / Phone → divider → Google / Apple
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import GoogleButton from '../../components/GoogleButton.jsx';

export default function SignupOptions() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  return (
    <div className="auth-page">
      {/* Back */}
      <button
        className="back-btn"
        onClick={() => navigate(ROUTES.WELCOME)}
        aria-label="Back"
      >
        <i className="fa-solid fa-arrow-left" />
      </button>

      <div className="auth-body">
        {/* Headline */}
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">
          Join Mynvora. Verified people, real connections.
        </p>

        {/* ===================== PRIMARY OPTIONS ===================== */}
        <div className="signup-options-list">
          <button
            className="signup-option"
            onClick={() => navigate(ROUTES.SIGNUP_EMAIL)}
          >
            <div className="signup-option-icon">
              <i className="fa-solid fa-envelope" />
            </div>
            <div className="signup-option-body">
              <div className="signup-option-title">Continue with email</div>
              <div className="signup-option-sub">
                Use your email address
              </div>
            </div>
            <i className="fa-solid fa-chevron-right signup-option-arrow" />
          </button>

          <button
            className="signup-option"
            onClick={() => navigate(ROUTES.SIGNUP_PHONE)}
          >
            <div className="signup-option-icon">
              <i className="fa-solid fa-mobile-screen" />
            </div>
            <div className="signup-option-body">
              <div className="signup-option-title">Continue with phone</div>
              <div className="signup-option-sub">
                Verify with SMS code
              </div>
            </div>
            <i className="fa-solid fa-chevron-right signup-option-arrow" />
          </button>
        </div>

        {/* ===================== DIVIDER ===================== */}
        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        {/* ===================== SOCIAL ===================== */}
        <div className="signup-socials">
          <GoogleButton onError={(msg) => setError(msg)} />

          <button
            type="button"
            className="signup-social"
            onClick={() => alert('Apple login coming soon')}
          >
            <i className="fa-brands fa-apple" style={{ color: '#000' }} />
            Apple
          </button>
        </div>

        {error && (
          <div className="input-error" style={{ marginTop: 8 }}>
            <i className="fa-solid fa-circle-xmark" /> {error}
          </div>
        )}

        {/* ===================== SWITCH ===================== */}
        <p className="auth-switch">
          Already have an account?
          <button onClick={() => navigate(ROUTES.LOGIN)}>Log in</button>
        </p>

        {/* ===================== TERMS ===================== */}
        <p className="auth-sub small" style={{ textAlign: 'center' }}>
          By continuing you agree to our{' '}
          <a href="/settings/legal">Terms</a> and{' '}
          <a href="/settings/legal">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}