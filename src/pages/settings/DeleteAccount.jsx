// =========================================================
// MYNVORA — DELETE ACCOUNT
// Step 1: Warning + reason
// Step 2: Type DELETE to confirm (+ password if applicable)
// Step 3: Deleting
// Step 4: Done
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore.js';
import api from '../../lib/api.js';

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
  const logout = useUserStore((s) => s.logout);

  const [step, setStep] = useState('warning');       // warning | confirm | deleting | done
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  const canConfirm = confirmText.trim().toUpperCase() === 'DELETE';

    const proceed = async () => {
    if (!canConfirm) return;
    setError('');
    setStep('deleting');

    try {
      /* 1. Delete server-side */
      await api.post('/auth/account/delete', {
        password: password || undefined,
        reason: reason || undefined,
        confirmation: 'DELETE',
      });

      /* 2. Clear local tokens WITHOUT triggering logout().
            The route guard would redirect to /welcome before
            we can show the "Account deleted" screen.
            We do the full logout on the "Back to home" button. */
      localStorage.removeItem('mynvora_user');
      localStorage.removeItem('mynvora_access');
      localStorage.removeItem('mynvora_refresh');

      /* 3. Show success screen */
      setStep('done');
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Deletion failed. Please try again.';
      setError(msg);
      setStep('confirm');
    }
  };
  // =========================================================
  // STEP 1 — Warning
  // =========================================================
  if (step === 'warning') {
    return (
      <div className="settings-screen">
        <div className="settings-page-head">
          <button className="back-btn-inline" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left" />
          </button>
          <h1>Delete Account</h1>
          <div style={{ width: 44 }} />
        </div>

        <div className="delete-hero">
          <div className="delete-hero-icon">
            <i className="fa-solid fa-triangle-exclamation" />
          </div>
          <h2>This is permanent</h2>
          <p>
            Deleting your Mynvora account will remove everything
            permanently. This cannot be undone.
          </p>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">What will be deleted</div>

          <div className="delete-list">
            <div className="delete-list-item">
              <i className="fa-solid fa-images" />
              All your photos
            </div>
            <div className="delete-list-item">
              <i className="fa-solid fa-comments" />
              All your matches and messages
            </div>
            <div className="delete-list-item">
              <i className="fa-solid fa-heart" />
              All your likes and passes
            </div>
            <div className="delete-list-item">
              <i className="fa-solid fa-id-card" />
              Your verification data
            </div>
            <div className="delete-list-item">
              <i className="fa-solid fa-crown" />
              Any active subscription (no refund)
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">
            Why are you leaving? (optional)
          </div>

          <div className="delete-reasons">
            {REASONS.map((r) => (
              <button
                key={r}
                className={`delete-reason ${reason === r ? 'active' : ''}`}
                onClick={() => setReason(reason === r ? '' : r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-save-bar">
          <button className="btn-ghost" onClick={() => navigate(-1)}>
            Keep my account
          </button>
          <button className="btn-danger" onClick={() => setStep('confirm')}>
            Continue <span>→</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // STEP 2 — Confirm
  // =========================================================
  if (step === 'confirm') {
    return (
      <div className="settings-screen">
        <div className="settings-page-head">
          <button className="back-btn-inline" onClick={() => setStep('warning')}>
            <i className="fa-solid fa-arrow-left" />
          </button>
          <h1>Confirm</h1>
          <div style={{ width: 44 }} />
        </div>

        <div className="delete-hero" style={{ paddingTop: 10 }}>
          <div className="delete-hero-icon danger">
            <i className="fa-solid fa-circle-exclamation" />
          </div>
          <h2>Type "DELETE" to confirm</h2>
          <p>
            This is your last chance. Once you tap Delete, your account
            is gone forever.
          </p>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">
            Password (only if you signed up with email)
          </div>
          <div className="field">
            <input
              type="password"
              placeholder="Your password (or leave blank for Google)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Type DELETE to confirm</div>
          <div className="field">
            <input
              type="text"
              placeholder="Type DELETE"
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
        </div>

        {error && (
          <div className="input-error" style={{ margin: '0 16px 16px' }}>
            <i className="fa-solid fa-circle-xmark" /> {error}
          </div>
        )}

        <div className="settings-save-bar">
          <button className="btn-ghost" onClick={() => setStep('warning')}>
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

  // =========================================================
  // STEP 3 — Deleting
  // =========================================================
  if (step === 'deleting') {
    return (
      <div className="settings-screen" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 30
      }}>
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

  // =========================================================
  // STEP 4 — Done
  // =========================================================
  if (step === 'done') {
    return (
      <div className="settings-screen" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 30
      }}>
        <div style={{ textAlign: 'center', maxWidth: 340 }}>
          <div className="verify-icon" style={{
            margin: '0 auto 24px',
            background: 'rgba(53,208,127,0.12)',
            color: '#35d07f'
          }}>
            <i className="fa-solid fa-check" />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
            Account deleted
          </h2>
          <p style={{ color: '#b7b7c7', fontSize: 14, lineHeight: 1.5 }}>
            We're sorry to see you go. Your data has been removed.
            <br />
            You can create a new account any time.
          </p>

          <button
            className="btn-main"
            onClick={async () => {
              try { await logout(); } catch {}
              navigate('/welcome', { replace: true });
            }}
            style={{ marginTop: 24 }}
          >
            Back to home <span>→</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}