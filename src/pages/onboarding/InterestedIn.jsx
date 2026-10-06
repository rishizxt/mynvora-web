// =========================================================
// MYNVORA — INTERESTED IN
// Who do you want to see?
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useOnboardingStore } from '../../store/onboardingStore.js';
import { INTERESTED_IN_OPTIONS } from '../../data/onboardingOptions.js';

export default function InterestedIn() {
  const navigate = useNavigate();
  const { interestedIn, update, markStepDone } = useOnboardingStore();

  const [selected, setSelected] = useState(interestedIn || []);

  const toggle = (id) => {
    if (id === 'everyone') {
      // 'everyone' is exclusive
      setSelected(['everyone']);
      return;
    }
    // If 'everyone' is currently selected and user clicks another, remove everyone
    let next = selected.filter((x) => x !== 'everyone');
    if (next.includes(id)) {
      next = next.filter((x) => x !== id);
    } else {
      next = [...next, id];
    }
    setSelected(next);
  };

  const handleNext = () => {
    if (selected.length === 0) return;
    update({ interestedIn: selected });
    markStepDone('interested-in');
    navigate(ROUTES.ONBOARDING_DISTANCE);
  };

  return (
    <div className="ob-screen">
      <div className="ob-topbar">
        <button
          className="ob-back"
          onClick={() => navigate(ROUTES.ONBOARDING_ORIENTATION)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: '46%' }} />
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div className="ob-body">
        <h1 className="ob-title">Who are you interested in seeing?</h1>
        <p className="ob-subtitle">
          Select all that apply to help us recommend the right people for you.
        </p>

        <div className="ob-list">
          {INTERESTED_IN_OPTIONS.map((opt) => {
            const active = selected.includes(opt.id);
            return (
              <button
                key={opt.id}
                className={`ob-list-item ${active ? 'active' : ''}`}
                onClick={() => toggle(opt.id)}
              >
                <span className="ob-list-label">{opt.label}</span>
                {active && (
                  <i className="fa-solid fa-check ob-list-check" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="ob-footer">
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