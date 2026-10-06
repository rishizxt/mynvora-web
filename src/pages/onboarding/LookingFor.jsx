import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useOnboardingStore } from '../../store/onboardingStore.js';
import { LOOKING_FOR_OPTIONS } from '../../data/onboardingOptions.js';

export default function LookingFor() {
  const navigate = useNavigate();
  const store = useOnboardingStore();

  const [selected, setSelected] = useState(store.lookingFor || null);

  const handleNext = () => {
    if (!selected) return;
    store.set('lookingFor', selected);
    store.markStepDone('looking-for');
    navigate(ROUTES.ONBOARDING_COLLEGE);
  };

  return (
    <div className="ob-screen">
      <div className="ob-topbar">
        <button
          className="ob-back"
          onClick={() => navigate(ROUTES.ONBOARDING_DISTANCE)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: '62%' }} />
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div className="ob-body">
        <h1 className="ob-title">What are you looking for?</h1>
        <p className="ob-subtitle">
          All good if it changes. There's something for everyone.
        </p>

        <div className="ob-grid-2">
          {LOOKING_FOR_OPTIONS.map((opt) => {
            const active = selected === opt.id;
            return (
              <button
                key={opt.id}
                className={`ob-tile ${active ? 'active' : ''}`}
                onClick={() => setSelected(opt.id)}
              >
                <span className="ob-tile-icon">{opt.icon}</span>
                <span className="ob-tile-label">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="ob-footer">
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