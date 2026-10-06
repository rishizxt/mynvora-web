import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useOnboardingStore } from '../../store/onboardingStore.js';
import { ORIENTATION_OPTIONS } from '../../data/onboardingOptions.js';

export default function Orientation() {
  const navigate = useNavigate();
  const store = useOnboardingStore();

  const [selected, setSelected] = useState(store.orientation || []);
  const [showOnProfile, setShowOnProfile] = useState(
    store.orientationShowOnProfile ?? true
  );

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    store.update({
      orientation: selected,
      orientationShowOnProfile: showOnProfile
    });
    store.markStepDone('orientation');
    navigate(ROUTES.ONBOARDING_INTERESTED_IN);
  };

  const handleSkip = () => {
    store.update({
      orientation: [],
      orientationShowOnProfile: false
    });
    store.markStepDone('orientation');
    navigate(ROUTES.ONBOARDING_INTERESTED_IN);
  };

  return (
    <div className="ob-screen">
      <div className="ob-topbar">
        <button
          className="ob-back"
          onClick={() => navigate(ROUTES.ONBOARDING_GENDER)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: '38%' }} />
        </div>
        <button className="ob-skip" onClick={handleSkip}>
          Skip
        </button>
      </div>

      <div className="ob-body">
        <h1 className="ob-title">What's your sexual orientation?</h1>
        <p className="ob-subtitle">
          Select all that describe you to reflect your identity.
        </p>

        <div className="ob-list">
          {ORIENTATION_OPTIONS.map((opt) => {
            const active = selected.includes(opt.id);
            return (
              <button
                key={opt.id}
                className={`ob-list-item ob-list-item-tall ${
                  active ? 'active' : ''
                }`}
                onClick={() => toggle(opt.id)}
              >
                <div className="ob-list-body">
                  <div className="ob-list-label">{opt.label}</div>
                  <div className="ob-list-desc">{opt.desc}</div>
                </div>
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
          <span>Show sexual orientation on profile</span>
        </label>

        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={selected.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}