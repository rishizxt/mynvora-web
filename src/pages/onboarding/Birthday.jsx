// =========================================================
// MYNVORA — BIRTHDAY
// Input DD/MM/YYYY. Auto-formats as user types.
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useOnboardingStore } from '../../store/onboardingStore.js';
import {
  MIN_AGE,
  ADULT_AGE,
  MAX_AGE
} from '../../data/onboardingOptions.js';

export default function Birthday() {
  const navigate = useNavigate();
  const { birthday, set, markStepDone, update } = useOnboardingStore();

  const [input, setInput] = useState('');

  // Auto-format as DD/MM/YYYY
  const formatInput = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

  const handleChange = (e) => {
    setInput(formatInput(e.target.value));
  };

  const parseDate = () => {
    const parts = input.split('/');
    if (parts.length !== 3) return null;
    const [d, m, y] = parts;
    if (d.length !== 2 || m.length !== 2 || y.length !== 4) return null;

    const day = parseInt(d, 10);
    const month = parseInt(m, 10);
    const year = parseInt(y, 10);

    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    )
      return null;

    return { date, day, month, year };
  };

  const parsed = parseDate();
  const age = parsed ? calculateAge(parsed.date) : 0;
  const isAdult = age >= ADULT_AGE;
  const isTeen = age >= MIN_AGE && age < ADULT_AGE;
  const isTooYoung = parsed && age < MIN_AGE;
  const isTooOld = parsed && age > MAX_AGE;
  const isValid = parsed && age >= MIN_AGE && age <= MAX_AGE;

  const handleNext = () => {
    if (!isValid) return;
    const isoDate = `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`;
    update({
      birthday: isoDate,
      age
    });
    markStepDone('birthday');
    navigate(ROUTES.ONBOARDING_GENDER);
  };

  return (
    <div className="ob-screen">
      <div className="ob-topbar">
        <button
          className="ob-back"
          onClick={() => navigate(ROUTES.ONBOARDING_FIRST_NAME)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: '22%' }} />
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div className="ob-body">
        <h1 className="ob-title">Your b-day?</h1>

        <div className="ob-input-wrap">
          <input
            className="ob-input ob-input-large"
            type="tel"
            inputMode="numeric"
            placeholder="DD/MM/YYYY"
            value={input}
            onChange={handleChange}
            maxLength={10}
            autoFocus
          />
        </div>

        <p className="ob-hint">
          Your profile shows your age, not your date of birth.
        </p>

        {parsed && (
          <div
            className={`ob-age-banner ${
              isAdult ? 'ok' : isTeen ? 'warn' : 'bad'
            }`}
          >
            {isAdult && `✓ Age ${age} — Full access`}
            {isTeen && `⚠ Age ${age} — Teen mode`}
            {isTooYoung && `✕ You must be ${MIN_AGE} or older`}
            {isTooOld && `✕ Age too old`}
          </div>
        )}
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

function calculateAge(date) {
  const now = new Date();
  let age = now.getFullYear() - date.getFullYear();
  const m = now.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < date.getDate())) age--;
  return age;
}