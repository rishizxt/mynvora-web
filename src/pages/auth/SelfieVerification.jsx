// =========================================================
// MYNVORA — SELFIE VERIFICATION
// Strong verification: take a selfie → matches your profile.
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useUserStore } from '../../store/userStore.js';

export default function SelfieVerification() {
  const navigate = useNavigate();
  const { setVerified } = useUserStore();

  const [stage, setStage] = useState('intro');   // intro | capturing | processing | done

  const startCapture = () => {
    setStage('capturing');
    // Simulate camera opening + capture
    setTimeout(() => setStage('processing'), 1800);
    // Simulate AI verification
    setTimeout(() => {
      setStage('done');
    }, 3800);
  };

  const finish = () => {
    setVerified(true);
    navigate(ROUTES.ONBOARDING_INTERESTS);
  };

  return (
    <div className="auth-page">
      <div className="auth-progress">
        <div className="auth-progress-bar" style={{ width: '40%' }} />
      </div>

      <button
        className="back-btn"
        onClick={() => navigate(ROUTES.AGE_VERIFY)}
        aria-label="Back"
      >
        <i className="fa-solid fa-arrow-left" />
      </button>

      <div className="auth-body">
        <div className="auth-step-label">Step 2 of 4</div>

        {stage === 'intro' && (
          <>
            <div className="selfie-hero">
              <div className="selfie-hero-icon">
                <i className="fa-solid fa-camera" />
              </div>
              <div className="selfie-hero-ring" />
              <div className="selfie-hero-ring ring-2" />
            </div>

            <h1 className="auth-title center-title">Verify your selfie</h1>
            <p className="auth-sub center-sub">
              Take a quick selfie — we'll compare it to your profile photos
              to confirm you're real. This helps keep Mynvora safe.
            </p>

            <div className="selfie-tips">
              <div className="selfie-tip">
                <i className="fa-solid fa-sun" />
                <span>Good lighting, no shadows</span>
              </div>
              <div className="selfie-tip">
                <i className="fa-solid fa-face-smile" />
                <span>Face straight, eyes open</span>
              </div>
              <div className="selfie-tip">
                <i className="fa-solid fa-glasses" />
                <span>Remove hats and sunglasses</span>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={startCapture}
              style={{ marginTop: 8 }}
            >
              Take selfie <i className="fa-solid fa-camera" />
            </button>
          </>
        )}

        {stage === 'capturing' && (
          <div className="selfie-capturing">
            <div className="selfie-camera-frame">
              <div className="selfie-camera-pulse" />
              <div className="selfie-face-guide" />
              <div className="selfie-camera-icon">
                <i className="fa-solid fa-camera" />
              </div>
            </div>

            <h2 className="auth-title center-title">Hold still...</h2>
            <p className="auth-sub center-sub">
              Position your face inside the circle
            </p>
          </div>
        )}

        {stage === 'processing' && (
          <div className="selfie-processing">
            <div className="selfie-spinner" />
            <h2 className="auth-title center-title">Verifying...</h2>
            <p className="auth-sub center-sub">
              Comparing your selfie with your profile photos. This takes a
              few seconds.
            </p>
          </div>
        )}

        {stage === 'done' && (
          <div className="selfie-done">
            <div className="selfie-success-icon">
              <i className="fa-solid fa-check" />
            </div>
            <h2 className="auth-title center-title">Selfie verified</h2>
            <p className="auth-sub center-sub">
              Great! You're verified. Now let's set up your profile.
            </p>

            <button
              className="btn-primary"
              onClick={finish}
              style={{ marginTop: 24 }}
            >
              Continue <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}