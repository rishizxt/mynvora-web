// =========================================================
// MYNVORA — CHANGE PHONE (wired to backend, OTP verified)
// =========================================================
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore.js';
import OTPInput from '../../components/OTPInput.jsx';
import api from '../../lib/api.js';

const COUNTRY_CODES = [
  { code: '+91', flag: 'IN', country: 'India' },
  { code: '+1', flag: 'US', country: 'USA' },
  { code: '+44', flag: 'GB', country: 'UK' },
  { code: '+61', flag: 'AU', country: 'Australia' },
  { code: '+81', flag: 'JP', country: 'Japan' },
  { code: '+971', flag: 'AE', country: 'UAE' },
  { code: '+65', flag: 'SG', country: 'Singapore' }
];

export default function ChangePhone() {
  const navigate = useNavigate();
  const user = useUserStore();

  const [step, setStep] = useState('input');
  const [country, setCountry] = useState('+91');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submittingRef = useRef(false);

  const currentPhone = user.phone || '+91 *** 3210';
  const cleanPhone = phone.replace(/\D/g, '');
  const isValidPhone = cleanPhone.length >= 10;

  useEffect(() => {
    if (step !== 'otp' || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, seconds]);

  const submitPhone = async (e) => {
    if (e) e.preventDefault();
    if (!isValidPhone) return;
    setLoading(true);
    setError('');
    try {
      const fullPhone = country + cleanPhone;
      await api.post('/auth/change-phone/request', { newPhone: fullPhone });
      setStep('otp');
      setSeconds(60);
      setCode('');
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Could not send code'
      );
    } finally {
      setLoading(false);
    }
  };

  const verify = async (enteredCode) => {
    if (enteredCode.length !== 6 || submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    setError('');
    try {
      const fullPhone = country + cleanPhone;
      await api.post('/auth/change/confirm', {
        type: 'phone',
        newValue: fullPhone,
        code: enteredCode,
      });
      user.setPhone?.(fullPhone);
      setStep('success');
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Invalid code'
      );
      setCode('');
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  useEffect(() => {
    if (step === 'otp' && code.length === 6) verify(code);
  }, [code, step]);

  return (
    <div className="settings-screen">
      <div className="settings-page-head">
        <button
          className="settings-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Change Phone</h1>
        <div className="settings-page-head-spacer" />
      </div>

      {step === 'input' && (
        <>
          <div className="settings-block">
            <div className="settings-block-head">
              <h2 className="settings-block-title">Current phone</h2>
            </div>
            <div className="account-info-card">
              <div className="account-info-icon">
                <i className="fa-solid fa-phone" />
              </div>
              <div className="account-info-body">
                <div className="account-info-label">Registered phone</div>
                <div className="account-info-value">{currentPhone}</div>
              </div>
              <div className="account-info-badge">
                <i className="fa-solid fa-check" /> Verified
              </div>
            </div>
          </div>

          <div className="settings-block">
            <div className="settings-block-head">
              <h2 className="settings-block-title">New phone number</h2>
            </div>
            <form onSubmit={submitPhone}>
              <div className="phone-input-row">
                <select
                  className="phone-country-select"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  className="settings-input"
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/[^\d ]/g, ''))
                  }
                  autoFocus
                  required
                />
              </div>

              {phone && !isValidPhone && (
                <div className="input-error">
                  <i className="fa-solid fa-circle-xmark" />
                  Enter a valid 10-digit number
                </div>
              )}
              {isValidPhone && (
                <div className="input-success">
                  <i className="fa-solid fa-circle-check" />
                  Looks good
                </div>
              )}
              {error && (
                <div className="input-error" style={{ marginTop: 8 }}>
                  <i className="fa-solid fa-circle-xmark" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={!isValidPhone || loading}
                style={{ marginTop: 18 }}
              >
                {loading ? 'Sending...' : 'Send SMS code'}{' '}
                <i className="fa-solid fa-arrow-right" />
              </button>
            </form>
            <p className="settings-block-hint" style={{ marginTop: 20 }}>
              We'll text a 6-digit code to your new number to confirm.
            </p>
          </div>
        </>
      )}

      {step === 'otp' && (
        <div className="settings-block">
          <div className="settings-block-head">
            <h2 className="settings-block-title">Enter the code</h2>
          </div>
          <p className="settings-block-hint">
            We sent an SMS to{' '}
            <strong>
              {country} {phone}
            </strong>
          </p>
          <OTPInput value={code} onChange={setCode} length={6} />
          {loading && (
            <p className="resend-line" style={{ color: '#ff3b81' }}>
              <i className="fa-solid fa-spinner fa-spin" /> Verifying…
            </p>
          )}
          {error && <p className="otp-error">{error}</p>}
          {!loading && (
            <p className="resend-line">
              {seconds > 0 ? (
                <>Resend in 0:{seconds.toString().padStart(2, '0')}</>
              ) : (
                <button className="resend-btn" onClick={submitPhone}>
                  Resend code
                </button>
              )}
            </p>
          )}
          <button
            className="btn-ghost"
            onClick={() => setStep('input')}
            style={{ marginTop: 12 }}
          >
            Change number
          </button>
        </div>
      )}

      {step === 'success' && (
        <div
          className="settings-block"
          style={{ textAlign: 'center', paddingTop: 40 }}
        >
          <div
            className="verify-icon"
            style={{
              margin: '0 auto 20px',
              background: '#e8fff3',
              color: '#35d07f',
            }}
          >
            <i className="fa-solid fa-circle-check" />
          </div>
          <h1 className="auth-title center-title" style={{ textAlign: 'center' }}>
            Phone updated
          </h1>
          <p className="auth-sub center-sub">
            Your new number is{' '}
            <strong>
              {country} {phone}
            </strong>
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate(-1)}
            style={{
              marginTop: 24,
              maxWidth: 300,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Done <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      )}
    </div>
  );
}
