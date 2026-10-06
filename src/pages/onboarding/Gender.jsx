import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useOnboardingStore } from '../../store/onboardingStore.js';
import { GENDER_OPTIONS } from '../../data/onboardingOptions.js';

export default function Gender() {
  const navigate = useNavigate();
  const store = useOnboardingStore();

  const [selected, setSelected] = useState(store.gender || null);
  const [showOnProfile, setShowOnProfile] = useState(
    store.genderShowOnProfile ?? true
  );

  const handleNext = () => {
    if (!selected) return;
    store.update({
      gender: selected,
      genderShowOnProfile: showOnProfile
    });
    store.markStepDone('gender');
    navigate(ROUTES.ONBOARDING_ORIENTATION);
  };

  return (
    <div className="ob-screen">
      <div className="ob-topbar">
        <button
          className="ob-back"
          onClick={() => navigate(ROUTES.ONBOARDING_BIRTHDAY)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: '30%' }} />
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div className="ob-body">
        <h1 className="ob-title">What's your gender?</h1>
        <p className="ob-subtitle">
          Select all that describe you to help us show your profile to the
          right people.
        </p>

        <div className="ob-list">
          {GENDER_OPTIONS.map((opt) => {
            const active = selected === opt.id;
            return (
              <button
                key={opt.id}
                className={`ob-list-item ${active ? 'active' : ''}`}
                onClick={() => setSelected(opt.id)}
              >
                <span className="ob-list-label">{opt.label}</span>
                {active && <i className="fa-solid fa-check ob-list-check" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="ob-footer">
        <label className="ob-checkbox">
          <input
            type="checkbox"
            checked={showOnProfile}
            onChange={(e) => setShowOnProfile(e.target.checked)}
          />
          <span>Show gender on profile</span>
        </label>

        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={!selected}
        >
          Next
        </button>
      </div>
    </div>
  );
}