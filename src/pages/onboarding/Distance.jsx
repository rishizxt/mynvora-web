import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useOnboardingStore } from '../../store/onboardingStore.js';
import {
  DISTANCE_MIN,
  DISTANCE_MAX,
  DISTANCE_DEFAULT
} from '../../data/onboardingOptions.js';

export default function Distance() {
  const navigate = useNavigate();
  const store = useOnboardingStore();

  const [distance, setDistance] = useState(
    store.maxDistance || DISTANCE_DEFAULT
  );

  const handleNext = () => {
    store.set('maxDistance', distance);
    store.markStepDone('distance');
    navigate(ROUTES.ONBOARDING_LOOKING_FOR);
  };

  const percent =
    ((distance - DISTANCE_MIN) / (DISTANCE_MAX - DISTANCE_MIN)) * 100;

  return (
    <div className="ob-screen">
      <div className="ob-topbar">
        <button
          className="ob-back"
          onClick={() => navigate(ROUTES.ONBOARDING_INTERESTED_IN)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: '54%' }} />
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div className="ob-body">
        <h1 className="ob-title">Your distance preference?</h1>
        <p className="ob-subtitle">
          Use the slider to set the maximum distance you would like potential
          matches to be located.
        </p>

        <div className="ob-slider-block">
          <div className="ob-slider-head">
            <span className="ob-slider-label">Distance preference</span>
            <span className="ob-slider-value">{distance} km</span>
          </div>

          <div className="ob-slider-track">
            <div
              className="ob-slider-fill"
              style={{ width: `${percent}%` }}
            />
            <input
              type="range"
              className="ob-slider-input"
              min={DISTANCE_MIN}
              max={DISTANCE_MAX}
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
            />
          </div>

          <div className="ob-slider-minmax">
            <span>{DISTANCE_MIN} km</span>
            <span>{DISTANCE_MAX} km</span>
          </div>
        </div>
      </div>

      <div className="ob-footer">
        <p className="ob-footer-note">
          You can change preferences later in Settings
        </p>
        <button className="btn-primary" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}