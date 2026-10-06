// =========================================================
// MYNVORA — HOUSE RULES
// First onboarding screen. Matches Tinder's flow.
// =========================================================

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useOnboardingStore } from '../../store/onboardingStore.js';

const RULES = [
  {
    id: 'be-yourself',
    title: 'Be yourself.',
    body: 'Make sure your photos, age, and bio are true to who you are.'
  },
  {
    id: 'stay-safe',
    title: 'Stay safe.',
    body: 'Don\'t be too quick to give out personal information.',
    link: 'Date Safely'
  },
  {
    id: 'play-cool',
    title: 'Play it cool.',
    body: 'Respect others and treat them as you would like to be treated.'
  },
  {
    id: 'be-proactive',
    title: 'Be proactive.',
    body: 'Always report bad behavior.'
  }
];

export default function HouseRules() {
  const navigate = useNavigate();
  const { set, markStepDone } = useOnboardingStore();

  const accept = () => {
    set('houseRulesAccepted', true);
    markStepDone('house-rules');
    navigate(ROUTES.ONBOARDING_FIRST_NAME);
  };

  return (
    <div className="ob-screen">
      {/* Top bar with progress */}
      <div className="ob-topbar">
        <button
          className="ob-back"
          onClick={() => navigate(ROUTES.WELCOME)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: '8%' }} />
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div className="ob-body">
        {/* Logo */}
        <div className="ob-brand-icon">
          <i className="fa-solid fa-fire" />
        </div>

        <h1 className="ob-title">Welcome to Mynvora.</h1>
        <p className="ob-subtitle">Please follow these House Rules.</p>

        {/* Rules list */}
        <div className="ob-rules">
          {RULES.map((rule) => (
            <div className="ob-rule" key={rule.id}>
              <h3 className="ob-rule-title">{rule.title}</h3>
              <p className="ob-rule-body">
                {rule.body}{' '}
                {rule.link && (
                  <a href="#" className="ob-rule-link">
                    {rule.link}
                  </a>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="ob-footer">
        <button className="btn-primary" onClick={accept}>
          I agree
        </button>
      </div>
    </div>
  );
}