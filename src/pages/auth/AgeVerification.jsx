// =========================================================
// MYNVORA — AGE VERIFICATION
// User picks DOB → saves → moves to Selfie. No locked screen.
// =========================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useUserStore } from '../../store/userStore.js';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function AgeVerification() {
  const navigate = useNavigate();
  const { dob, dobLocked, setDob, setAgeGroup } = useUserStore();

  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [agreed, setAgreed] = useState(false);

  // If DOB already saved → skip forward silently
  useEffect(() => {
    if (dobLocked && dob) {
      navigate(ROUTES.SELFIE_VERIFY, { replace: true });
    }
  }, [dobLocked, dob, navigate]);

  const currentYear = new Date().getFullYear();

  const buildDate = () => {
    if (!day || !month || !year) return null;
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    const date = new Date(y, m - 1, d);
    if (
      date.getFullYear() !== y ||
      date.getMonth() !== m - 1 ||
      date.getDate() !== d
    )
      return null;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const builtDate = buildDate();
  const age = builtDate ? calculateAge(builtDate) : 0;
  const isAdult = age >= 18;
  const isTeen = age >= 16 && age < 18;
  const isTooYoung = builtDate && age < 16;
  const isValid = builtDate && agreed && age >= 16;

  const daysInMonth = () => {
    if (!month || !year) return 31;
    return new Date(parseInt(year), parseInt(month), 0).getDate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    // Save silently — no locked screen
    setDob(builtDate);
    setAgeGroup(isAdult ? 'adult' : 'teen');
    navigate(ROUTES.SELFIE_VERIFY);
  };

  return (
    <div className="auth-page">
      <div className="auth-progress">
        <div className="auth-progress-bar" style={{ width: '20%' }} />
      </div>

      <button
        className="back-btn"
        onClick={() => navigate(ROUTES.SIGNUP_OPTIONS)}
        aria-label="Back"
      >
        <i className="fa-solid fa-arrow-left" />
      </button>

      <div className="auth-body">
        <div className="auth-step-label">Step 1 of 4</div>
        <h1 className="auth-title">When were you born?</h1>
        <p className="auth-sub">
          You must be 16 or older. Your date of birth is saved once and
          cannot be changed.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Date of birth</label>

            <div className="dob-selects">
              <select
                className="dob-select"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                required
              >
                <option value="">Day</option>
                {Array.from({ length: daysInMonth() }, (_, i) => i + 1).map(
                  (d) => (
                    <option key={d} value={String(d).padStart(2, '0')}>
                      {String(d).padStart(2, '0')}
                    </option>
                  )
                )}
              </select>

              <select
                className="dob-select"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                required
              >
                <option value="">Month</option>
                {MONTHS.map((m, i) => (
                  <option key={m} value={String(i + 1).padStart(2, '0')}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                className="dob-select"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value="">Year</option>
                {Array.from({ length: 90 }, (_, i) => currentYear - 16 - i).map(
                  (y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {builtDate && (
            <div
              className={`age-banner ${
                isAdult ? 'ok' : isTeen ? 'warn' : 'bad'
              }`}
            >
              {isAdult && `✓ Age ${age} — Full access`}
              {isTeen && `⚠ Age ${age} — Teen mode (city-level only)`}
              {isTooYoung && `✕ Age ${age} — Must be 16 or older`}
            </div>
          )}

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              I confirm the date of birth is accurate and cannot be changed
            </span>
          </label>

          <button
            type="submit"
            className="btn-primary"
            disabled={!isValid}
            style={{ marginTop: 22 }}
          >
            Continue <i className="fa-solid fa-arrow-right" />
          </button>
        </form>
      </div>
    </div>
  );
}

function calculateAge(dob) {
  if (!dob) return 0;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}