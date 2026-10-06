// =========================================================
// MYNVORA — INTERESTS (real data from backend)
// =========================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useOnboardingStore } from '../../store/onboardingStore.js';
import api from '../../lib/api.js';

const MAX_INTERESTS = 10;
const MIN_INTERESTS = 3;

export default function Interests() {
  const navigate = useNavigate();
  const store = useOnboardingStore();

  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(store.interests || []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/interests');
        if (cancelled) return;
        setGrouped(data.grouped || {});
      } catch (err) {
        if (cancelled) return;
        setError('Could not load interests. Try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const isAtMax = selected.length >= MAX_INTERESTS;

  const toggle = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
      return;
    }
    if (isAtMax) return;
    setSelected([...selected, id]);
  };

  const handleNext = () => {
    store.set('interests', selected);
    store.markStepDone('interests');
    navigate(ROUTES.ONBOARDING_PHOTOS);
  };

  const handleSkip = () => {
    store.set('interests', []);
    store.markStepDone('interests');
    navigate(ROUTES.ONBOARDING_PHOTOS);
  };

  return (
    <div className="ob-screen">
      <div className="ob-topbar">
        <button
          className="ob-back"
          onClick={() => navigate(ROUTES.ONBOARDING_COLLEGE)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: '78%' }} />
        </div>
        <button className="ob-skip" onClick={handleSkip}>
          Skip
        </button>
      </div>

      <div className="ob-body">
        <h1 className="ob-title">What are you into?</h1>

        <div className="ob-counter">
          <span className={`ob-counter-value ${isAtMax ? 'at-max' : ''}`}>
            {selected.length}
          </span>
          <span className="ob-counter-sep">/</span>
          <span className="ob-counter-max">{MAX_INTERESTS}</span>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: '#b7b7c7' }}>
            <i className="fa-solid fa-spinner fa-spin" /> Loading interests…
          </div>
        )}

        {error && (
          <div className="input-error" style={{ marginBottom: 12 }}>
            <i className="fa-solid fa-circle-xmark" />
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="ob-categories">
            {Object.entries(grouped).map(([category, items]) => (
              <div className="ob-category" key={category}>
                <div className="ob-category-title">{category}</div>
                <div className="ob-category-chips">
                  {items.map((interest) => {
                    const active = selected.includes(interest.id);
                    const disabled = isAtMax && !active;
                    return (
                      <button
                        key={interest.id}
                        className={`ob-chip ${active ? 'active' : ''} ${
                          disabled ? 'disabled' : ''
                        }`}
                        onClick={() => toggle(interest.id)}
                        disabled={disabled}
                      >
                        {interest.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="ob-footer">
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={selected.length < MIN_INTERESTS}
        >
          {selected.length >= MIN_INTERESTS
            ? `Continue (${selected.length} selected)`
            : `Pick ${MIN_INTERESTS - selected.length} more`}
        </button>
      </div>
    </div>
  );
}