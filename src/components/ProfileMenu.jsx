// =========================================================
// MYNVORA — PROFILE MENU (bottom sheet)
// Clean rows: icon | label | arrow
// =========================================================

import { useState } from 'react';
import { useReportStore } from '../store/reportStore.js';

const REPORT_REASONS = [
  { id: 'fake',       icon: 'fa-user-slash',       label: 'Fake profile' },
  { id: 'harass',     icon: 'fa-triangle-exclamation', label: 'Harassment' },
  { id: 'scam',       icon: 'fa-handcuffs',        label: 'Scam / spam' },
  { id: 'imposter',   icon: 'fa-mask',             label: 'Impersonation' },
  { id: 'photo',      icon: 'fa-image',            label: 'Inappropriate photo' },
  { id: 'underage',   icon: 'fa-baby',             label: 'Underage' },
  { id: 'other',      icon: 'fa-ellipsis',         label: 'Other' }
];

export default function ProfileMenu({ open, onClose, profile }) {
  const addReport = useReportStore((s) => s.addReport);
  const [view, setView] = useState('main');
  const [reason, setReason] = useState(null);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const reset = () => {
    setView('main');
    setReason(null);
    setDetails('');
    setSubmitted(false);
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const handleSubmitReport = () => {
    if (!reason || !profile) return;

    addReport({
      reportedUserId: profile.id,
      reportedUserName: profile.name,
      reportedUserPhoto: profile.photos?.[0] || null,
      reason: reason.label,
      details: details.trim(),
      reporterId: 'me',
      reporterName: 'You',
      aiRisk: 'review',
      evidence: []
    });

    setSubmitted(true);
    setTimeout(() => handleClose(), 1400);
  };

  return (
    <div className="pm-scrim" onClick={handleClose}>
      <div className="pm-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Handle bar */}
        <div className="pm-handle" />

        {/* =============================================
            MAIN MENU
            ============================================= */}
        {view === 'main' && (
          <>
            {/* User card */}
            <div className="pm-user">
              <div className="pm-user-avatar">
                {profile?.photos?.[0] ? (
                  <img src={profile.photos[0]} alt={profile.name} />
                ) : (
                  <i className="fa-solid fa-user" />
                )}
              </div>
              <div className="pm-user-info">
                <div className="pm-user-name">{profile?.name}</div>
                <div className="pm-user-sub">
                  {profile?.age} · {profile?.city || 'Nearby'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pm-list">
              <button
                className="pm-row"
                onClick={() => setView('report')}
              >
                <div className="pm-row-icon">
                  <i className="fa-solid fa-flag" />
                </div>
                <span className="pm-row-label">
                  Report {profile?.name}
                </span>
                <i className="fa-solid fa-chevron-right pm-row-arrow" />
              </button>

              <button
                className="pm-row pm-row-danger"
                onClick={() => setView('block')}
              >
                <div className="pm-row-icon pm-row-icon-danger">
                  <i className="fa-solid fa-ban" />
                </div>
                <span className="pm-row-label">
                  Block {profile?.name}
                </span>
                <i className="fa-solid fa-chevron-right pm-row-arrow" />
              </button>

              <button className="pm-row" onClick={handleClose}>
                <div className="pm-row-icon">
                  <i className="fa-solid fa-heart-crack" />
                </div>
                <span className="pm-row-label">Unmatch</span>
                <i className="fa-solid fa-chevron-right pm-row-arrow" />
              </button>

              <button className="pm-row" onClick={handleClose}>
                <div className="pm-row-icon">
                  <i className="fa-solid fa-share-nodes" />
                </div>
                <span className="pm-row-label">Share profile</span>
                <i className="fa-solid fa-chevron-right pm-row-arrow" />
              </button>
            </div>

            {/* Cancel */}
            <button className="pm-cancel" onClick={handleClose}>
              Cancel
            </button>
          </>
        )}

        {/* =============================================
            REPORT VIEW
            ============================================= */}
        {view === 'report' && !submitted && (
          <>
            <div className="pm-subhead">
              <button
                className="pm-back"
                onClick={() => setView('main')}
                aria-label="Back"
              >
                <i className="fa-solid fa-arrow-left" />
              </button>
              <h2 className="pm-subhead-title">Why are you reporting?</h2>
              <div style={{ width: 40 }} />
            </div>

            <div className="pm-list">
              {REPORT_REASONS.map((r) => {
                const active = reason?.id === r.id;
                return (
                  <button
                    key={r.id}
                    className={`pm-row ${active ? 'pm-row-active' : ''}`}
                    onClick={() => setReason(r)}
                  >
                    <div className="pm-row-icon">
                      <i className={`fa-solid ${r.icon}`} />
                    </div>
                    <span className="pm-row-label">{r.label}</span>
                    {active && (
                      <i className="fa-solid fa-circle-check pm-row-check" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pm-details">
              <label>Additional details (optional)</label>
              <textarea
                rows={3}
                placeholder="Tell us more about what happened..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <div className="pm-actions">
              <button
                className="pm-btn pm-btn-primary"
                onClick={handleSubmitReport}
                disabled={!reason}
              >
                Submit report
              </button>
              <button className="pm-btn pm-btn-ghost" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </>
        )}

        {/* =============================================
            SUCCESS
            ============================================= */}
        {view === 'report' && submitted && (
          <div className="pm-success">
            <div className="pm-success-icon">
              <i className="fa-solid fa-check" />
            </div>
            <h2 className="pm-success-title">Report submitted</h2>
            <p className="pm-success-text">
              Thanks for helping keep Mynvora safe. Our team will review
              this shortly.
            </p>
          </div>
        )}

        {/* =============================================
            BLOCK CONFIRM
            ============================================= */}
        {view === 'block' && (
          <>
            <div className="pm-confirm">
              <div className="pm-confirm-icon">
                <i className="fa-solid fa-ban" />
              </div>
              <h2 className="pm-confirm-title">Block {profile?.name}?</h2>
              <p className="pm-confirm-text">
                You won't see each other again. They won't be able to message
                or match with you.
              </p>
            </div>

            <div className="pm-actions pm-actions-two">
              <button
                className="pm-btn pm-btn-ghost"
                onClick={() => setView('main')}
              >
                Cancel
              </button>
              <button
                className="pm-btn pm-btn-danger"
                onClick={() => {
                  alert(`Blocked ${profile?.name} (demo)`);
                  handleClose();
                }}
              >
                Block
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}