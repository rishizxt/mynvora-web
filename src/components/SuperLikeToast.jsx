// =========================================================
// MYNVORA — SUPER LIKE TOAST
// Small popup shown after tapping ★ — "Super Like sent to Mia".
// Auto-dismisses after 2 seconds.
// =========================================================

import { useEffect } from 'react';

export default function SuperLikeToast({ open, name, onClose, duration = 2000 }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className="slt-wrap">
      <div className="slt-card">
        <div className="slt-icon">
          <i className="fa-solid fa-star" />
        </div>

        <div className="slt-text">
          <div className="slt-title">Super Like sent</div>
          <div className="slt-sub">
            {name ? `You starred ${name}` : 'They\u2019ll see you at the top'}
          </div>
        </div>
      </div>
    </div>
  );
}