// =========================================================
// MYNVORA — COLLEGE / UNIVERSITY
// Optional. Skip available.
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useOnboardingStore } from '../../store/onboardingStore.js';

const POPULAR = [
  'IIT Bombay',
  'IIT Delhi',
  'NIT Trichy',
  'BITS Pilani',
  'Delhi University',
  'Mumbai University',
  'NIFT Delhi',
  'AIIMS Delhi'
];

export default function College() {
  const navigate = useNavigate();
  const store = useOnboardingStore();

  const [value, setValue] = useState(store.college || '');

  const handleNext = () => {
    store.set('college', value.trim() || null);
    store.markStepDone('college');
    navigate(ROUTES.ONBOARDING_INTERESTS);
  };

  const handleSkip = () => {
    store.set('college', null);
    store.markStepDone('college');
    navigate(ROUTES.ONBOARDING_INTERESTS);
  };

  return (
    <div className="ob-screen">
      <div className="ob-topbar">
        <button
          className="ob-back"
          onClick={() => navigate(ROUTES.ONBOARDING_LOOKING_FOR)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: '70%' }} />
        </div>
        <button className="ob-skip" onClick={handleSkip}>
          Skip
        </button>
      </div>

      <div className="ob-body">
        <h1 className="ob-title">If studying is your thing…</h1>

        <div className="ob-input-wrap">
          <input
            className="ob-input"
            type="text"
            placeholder="Enter college/university name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={60}
            autoFocus
          />
          {value && (
            <button
              className="ob-input-clear"
              onClick={() => setValue('')}
              aria-label="Clear"
            >
              <i className="fa-solid fa-circle-xmark" />
            </button>
          )}
        </div>

        <p className="ob-hint">
          This is how it'll appear on your profile.
        </p>

        <div className="ob-suggestions">
          <div className="ob-suggestions-title">Popular</div>
          <div className="ob-suggestions-list">
            {POPULAR.map((c) => (
              <button
                key={c}
                className={`ob-chip ${value === c ? 'active' : ''}`}
                onClick={() => setValue(c)}
                type="button"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ob-footer">
        <button className="btn-primary" onClick={handleNext}>
          {value.trim() ? 'Next' : 'Skip for now'}
        </button>
      </div>
    </div>
  );
}