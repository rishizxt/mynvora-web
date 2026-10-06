// =========================================================
// MYNVORA — DELETE ACCOUNT
// Instagram-style: OTP required before DELETE.
// Also shows deactivate option as alternative.
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore.js';
import { useProfileStore } from '../../store/profileStore.js';
import { useSettingsStore } from '../../store/settingsStore.js';
import OTPInput from '../../components/OTPInput.jsx';

const REASONS = [
  'Found someone',
  'Taking a break',
  'Not enough matches',
  'Privacy concerns',
  'Too expensive',
  'Bad experience',
  'Other'
];

export default function DeleteAccount() {
  const navigate = useNavigate();
  const user = useUserStore();
  const profile = useProfileStore();
  const settings = useSettingsStore();

  const [step, setStep] = useState('choose');    // 'choose' | 'reason' | 'otp' | 'confirm' | 'deleting' | 'done'
  const [action, setAction] = useState('delete');  // 'delete' | 'deactivate'
  const [reason, setReason] = useState('');
  const [method, setMethod] = useState('email');  // 'email' | 'phone'
  const [code, setCode] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [seconds, setSeconds] = useState(60);

  const email = user.email || 'you@example.com';
  const phone = user.phone || '+91 *** 3210';

  // Cooldown check
  const cooldownUntil = user.deleteCooldownUntil;
  const inCooldown = cooldownUntil && Date.now() < cooldownUntil;

  if (inCooldown && step !== 'done') {
    const daysLeft = Math.ceil(
      (cooldownUntil - Date.now()) / (1000 * 60 * 60 * 24)
    );
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
          <h1>Account</h1>
          <div className="settings-page-head-spacer" />
        </div>

        <div className="settings-block" style={{ textAlign: 'center', paddingTop: 40 }}>
          <div
            className="verify-icon"
            style={{
              margin: '0 auto 20px',
              background: '#fff3e0',
              color: '#ffb020'
            }}
          >
            <i className="fa-solid fa-clock" />
          </div>

          <h1 className="auth-title center-title" style={{ textAlign: 'center' }}>
            Please wait
          </h1>

          <p className="auth-sub center-sub">
            You can delete or deactivate again in{' '}
            <strong>{daysLeft} day{daysLeft !== 1 ? 's' : ''}</strong>.
            <br />
            This 7-day cooldown protects your account.
          </p>

          <button
            className="btn-primary"
            onClick={() => navigate(-1)}
            style={{ marginTop: 24 }}
          >
            OK <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      </div>
    );
  }

  // Countdown
  if (step === 'otp' && seconds > 0) {
    setTimeout(() => setSeconds((s) => s - 1), 1000);
  }

  if (step === 'otp' && code.length === 6 && seconds > 0) {
    setTimeout(() => setStep('confirm'), 400);
  }

  // ===================== STEP 1: CHOOSE =====================
  if (step === 'choose') {
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
          <h1>Manage Account</h1>
          <div className="settings-page-head-spacer" />
        </div>

        <div className="choose-hero">
          <h2>What would you like to do?</h2>
          <p>Choose how you want to pause or remove your account.</p>
        </div>

        {/* Deactivate option */}
        <button
          className="account-choice-card"
          onClick={() => {
            setAction('deactivate');
            setStep('reason');
          }}
        >
          <div className="account-choice-icon purple">
            <i className="fa-solid fa-moon" />
          </div>
          <div className="account-choice-body">
            <div className="account-choice-title">
              Deactivate for a while
              <span className="account-choice-badge">Recommended</span>
            </div>
            <div className="account-choice-desc">
              Your profile is hidden. Come back any time. Your matches and
              messages are preserved.
            </div>
          </div>
          <i className="fa-solid fa-chevron-right account-choice-arrow" />
        </button>

        {/* Delete option */}
        <button
          className="account-choice-card danger"
          onClick={() => {
            setAction('delete');
            setStep('reason');
          }}
        >
          <div className="account-choice-icon red">
            <i className="fa-solid fa-trash" />
          </div>
          <div className="account-choice-body">
            <div className="account-choice-title">
              Delete my account permanently
            </div>
            <div className="account-choice-desc">
              All photos, matches, and messages are gone forever. This cannot
              be undone.
            </div>
          </div>
          <i className="fa-solid fa-chevron-right account-choice-arrow" />
        </button>

        <div className="cooldown-notice">
          <i className="fa-solid fa-circle-info" />
          <p>
            After deactivating or deleting, you must wait{' '}
            <strong>7 days</strong> before you can do it again. This protects
            your account from accidental changes.
          </p>
        </div>
      </div>
    );
  }

  // ===================== STEP 2: REASON =====================
  if (step === 'reason') {
    return (
      <div className="settings-screen">
        <div className="settings-page-head">
          <button
            className="settings-back-btn"
            onClick={() => setStep('choose')}
            aria-label="Back"
          >
            <i className="fa-solid fa-arrow-left" />
          </button>
          <h1>Why are you leaving?</h1>
          <div className="settings-page-head-spacer" />
        </div>

        <div className="settings-block">
          <p className="settings-block-hint">
            This helps us improve Mynvora. Optional.
          </p>

          <div className="reason-list">
            {REASONS.map((r) => (
              <button
                key={r}
                className={`reason-item ${
                  reason === r ? 'active' : ''
                }`}
                onClick={() => setReason(reason === r ? '' : r)}
              >
                <span>{r}</span>
                <span className="reason-radio">
                  {reason === r && <span className="reason-radio-dot" />}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-save-bar">
          <button className="btn-ghost" onClick={() => setStep('choose')}>
            Back
          </button>
          <button className="btn-primary" onClick={() => setStep('otp')}>
            Continue <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      </div>
    );
  }

  // ===================== STEP 3: OTP =====================
  if (step === 'otp') {
    return (
      <div className="settings-screen">
        <div className="settings-page-head">
          <button
            className="settings-back-btn"
            onClick={() => setStep('reason')}
            aria-label="Back"
          >
            <i className="fa-solid fa-arrow-left" />
          </button>
          <h1>Verify it's you</h1>
          <div className="settings-page-head-spacer" />
        </div>

        <div className="settings-block">
          <div className="settings-block-head">
            <h2 className="settings-block-title">
              Choose OTP method
            </h2>
          </div>

          <div className="method-tabs">
            <button
              type="button"
              className={`method-tab ${method === 'email' ? 'active' : ''}`}
              onClick={() => {
                setMethod('email');
                setCode('');
                setSeconds(60);
              }}
            >
              📧 Email
            </button>
            <button
              type="button"
              className={`method-tab ${method === 'phone' ? 'active' : ''}`}
              onClick={() => {
                setMethod('phone');
                setCode('');
                setSeconds(60);
              }}
            >
              📱 Phone
            </button>
          </div>

          <p className="settings-block-hint" style={{ marginTop: 16 }}>
            We sent a code to{' '}
            <strong>{method === 'email' ? email : phone}</strong>
          </p>

          <OTPInput value={code} onChange={setCode} length={6} />

          <p className="resend-line">
            {seconds > 0 ? (
              <>Resend in 0:{seconds.toString().padStart(2, '0')}</>
            ) : (
              <button
                className="resend-btn"
                onClick={() => {
                  setCode('');
                  setSeconds(60);
                }}
              >
                Resend code
              </button>
            )}
          </p>
        </div>
      </div>
    );
  }

  // ===================== STEP 4: TYPE DELETE =====================
  if (step === 'confirm') {
    const canConfirm = confirmText.trim().toUpperCase() === 'DELETE';

    const proceed = () => {
      setStep('deleting');
      setTimeout(() => {
        // Clear everything
        profile.reset?.();
        settings.reset?.();
        user.markDeleteRequest?.(7);
        localStorage.removeItem('mynvora_profile');
        localStorage.removeItem('mynvora_settings');
        localStorage.removeItem('mynvora_user');
        localStorage.removeItem('mynvora_reports');
        localStorage.removeItem('mynvora_swipes');
        setStep('done');
      }, 1500);
    };

    return (
      <div className="settings-screen">
        <div className="settings-page-head">
          <button
            className="settings-back-btn"
            onClick={() => setStep('otp')}
            aria-label="Back"
          >
            <i className="fa-solid fa-arrow-left" />
          </button>
          <h1>Final confirmation</h1>
          <div className="settings-page-head-spacer" />
        </div>

        <div className="delete-hero" style={{ paddingTop: 10 }}>
          <div className="delete-hero-icon danger">
            <i className="fa-solid fa-triangle-exclamation" />
          </div>
          <h2>Type "DELETE" to confirm</h2>
          <p>
            This is your last chance. Once you tap Delete, your account is
            gone forever.
          </p>
        </div>

        <div className="settings-block">
          <input
            className="settings-input"
            type="text"
            placeholder="DELETE"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            autoFocus
            style={{
              textAlign: 'center',
              fontSize: 20,
              letterSpacing: 4,
              fontWeight: 800,
              textTransform: 'uppercase'
            }}
          />
        </div>

        <div className="settings-save-bar">
          <button className="btn-ghost" onClick={() => setStep('otp')}>
            Cancel
          </button>
          <button
            className="btn-danger"
            onClick={proceed}
            disabled={!canConfirm}
          >
            Delete my account
          </button>
        </div>
      </div>
    );
  }

  // ===================== STEP 5: DELETING =====================
  if (step === 'deleting') {
    return (
      <div
        className="settings-screen"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: 30
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div className="delete-spinner" />
          <h2 style={{ marginTop: 20, fontSize: 20, fontWeight: 800 }}>
            Deleting your account...
          </h2>
          <p style={{ color: '#777789', marginTop: 8, fontSize: 13 }}>
            This only takes a moment
          </p>
        </div>
      </div>
    );
  }

  // ===================== STEP 6: DONE =====================
  return (
    <div
      className="settings-screen"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 30
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 340 }}>
        <div
          className="verify-icon"
          style={{
            margin: '0 auto 24px',
            background: '#e8fff3',
            color: '#35d07f'
          }}
        >
          <i className="fa-solid fa-check" />
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
          Account deleted
        </h2>
        <p style={{ color: '#63637a', fontSize: 14, lineHeight: 1.5 }}>
          We're sorry to see you go. Your data has been removed.
          <br />
          You can create a new account any time.
        </p>

        <button
          className="btn-primary"
          onClick={() => navigate('/')}
          style={{ marginTop: 24 }}
        >
          Back to home <i className="fa-solid fa-arrow-right" />
        </button>
      </div>
    </div>
  );
}