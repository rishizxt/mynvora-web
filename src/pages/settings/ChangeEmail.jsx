// =========================================================
// MYNVORA — CHANGE EMAIL (wired to backend, OTP verified)
// =========================================================
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore.js';
import OTPInput from '../../components/OTPInput.jsx';
import api from '../../lib/api.js';

export default function ChangeEmail() {
  const navigate = useNavigate();
  const user = useUserStore();

  const [step, setStep] = useState('input');
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submittingRef = useRef(false);

  const currentEmail = user.email || 'you@example.com';
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
  const isDifferent = newEmail.toLowerCase() !== currentEmail.toLowerCase();

  useEffect(() => {
    if (step !== 'otp' || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, seconds]);

  const submitEmail = async (e) => {
    e.preventDefault();
    if (!isValidEmail || !isDifferent) return;
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/change-email/request', {
        newEmail: newEmail.trim().toLowerCase(),
      });
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
      await api.post('/auth/change/confirm', {
        type: 'email',
        newValue: newEmail.trim().toLowerCase(),
        code: enteredCode,
      });
      user.setEmail?.(newEmail.trim().toLowerCase());
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
        <h1>Change Email</h1>
        <div className="settings-page-head-spacer" />
      </div>

      {step === 'input' && (
        <>
          <div className="settings-block">
            <div className="settings-block-head">
              <h2 className="settings-block-title">Current email</h2>
            </div>
            <div className="account-info-card">
              <div className="account-info-icon">
                <i className="fa-solid fa-envelope" />
              </div>
              <div className="account-info-body">
                <div className="account-info-label">Registered email</div>
                <div className="account-info-value">{currentEmail}</div>
              </div>
              <div className="account-info-badge">
                <i className="fa-solid fa-check" /> Verified
              </div>
            </div>
          </div>

          <div className="settings-block">
            <div className="settings-block-head">
              <h2 className="settings-block-title">New email</h2>
            </div>
            <form onSubmit={submitEmail}>
              <div className="settings-input-group">
                <input
                  className="settings-input"
                  type="email"
                  placeholder="new@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              {newEmail && !isValidEmail && (
                <div className="input-error">
                  <i className="fa-solid fa-circle-xmark" />
                  Please enter a valid email
                </div>
              )}
              {newEmail && isValidEmail && !isDifferent && (
                <div className="input-error">
                  <i className="fa-solid fa-circle-xmark" />
                  This is your current email
                </div>
              )}
              {newEmail && isValidEmail && isDifferent && (
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
                disabled={!isValidEmail || !isDifferent || loading}
                style={{ marginTop: 18 }}
              >
                {loading ? 'Sending...' : 'Send code'}{' '}
                <i className="fa-solid fa-arrow-right" />
              </button>
            </form>
            <p className="settings-block-hint" style={{ marginTop: 20 }}>
              We'll send a 6-digit code to your new email.
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
            We sent a 6-digit code to <strong>{newEmail}</strong>
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
                <button
                  className="resend-btn"
                  onClick={submitEmail}
                >
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
            Change email
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
            Email updated
          </h1>
          <p className="auth-sub center-sub">
            Your new email is <strong>{newEmail}</strong>
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
