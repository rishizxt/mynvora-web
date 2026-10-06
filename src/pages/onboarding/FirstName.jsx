// =========================================================
// MYNVORA — FIRST NAME
// Name cannot be changed later (like Tinder).
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useOnboardingStore } from '../../store/onboardingStore.js';

export default function FirstName() {
  const navigate = useNavigate();
  const { firstName, set, markStepDone } = useOnboardingStore();

  const [name, setName] = useState(firstName || '');

  const isValid = name.trim().length >= 2;

  const handleNext = () => {
    if (!isValid) return;
    set('firstName', name.trim());
    markStepDone('first-name');
    navigate(ROUTES.ONBOARDING_BIRTHDAY);
  };

  return (
    <div className="ob-screen">
      <div className="ob-topbar">
        <button
          className="ob-back"
          onClick={() => navigate(ROUTES.ONBOARDING_HOUSE_RULES)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: '15%' }} />
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div className="ob-body">
        <h1 className="ob-title">What's your first name?</h1>

        <div className="ob-input-wrap">
          <input
            className="ob-input"
            type="text"
            placeholder="Enter your first name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoFocus
          />
          {name && (
            <button
              className="ob-input-clear"
              onClick={() => setName('')}
              aria-label="Clear"
            >
              <i className="fa-solid fa-circle-xmark" />
            </button>
          )}
        </div>

        <p className="ob-hint">
          This is how it'll appear on your profile. Can't change it later.
        </p>
      </div>

      <div className="ob-footer">
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={!isValid}
        >
          Next
        </button>
      </div>
    </div>
  );
}