// =========================================================
// MYNVORA — HOOKUP UPGRADE MODAL
// Shown when a Diamond user runs out of 10 free hookup swipes.
// Offers ₹99 to unlock unlimited hookups (one-time, permanent).
// =========================================================

import { useState } from 'react';
import { useHookupLimit } from '../features/swipe/useHookupLimit.js';
import { HOOKUPS } from '../data/subscriptions.js';

export default function HookupUpgradeModal({ open, onClose }) {
  const { purchaseUnlimited } = useHookupLimit();
  const [buying, setBuying] = useState(false);

  if (!open) return null;

  const handleBuy = () => {
    setBuying(true);
    // Demo — in production, trigger payment flow
    setTimeout(() => {
      purchaseUnlimited();
      setBuying(false);
      onClose?.();
      alert('Unlimited Hookups unlocked (demo)');
    }, 400);
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon hookup-icon">
          <i className="fa-solid fa-fire" />
        </div>

        <h2 className="modal-title">Hookups is unlimited</h2>
        <p className="modal-sub">
          You've used all {HOOKUPS.freeSwipes} free hookup swipes.
          <br />
          Unlock unlimited hookups forever for just{' '}
          <strong>₹{HOOKUPS.unlimitedPrice}</strong>.
        </p>

        <ul className="hookup-benefits">
          <li>
            <i className="fa-solid fa-check" /> Unlimited swipes in Hookups
          </li>
          <li>
            <i className="fa-solid fa-check" /> Never expires — one-time unlock
          </li>
          <li>
            <i className="fa-solid fa-check" /> Works alongside your Diamond plan
          </li>
          <li>
            <i className="fa-solid fa-check" /> All AI safety features still active
          </li>
        </ul>

        <button
          className="btn-main"
          onClick={handleBuy}
          disabled={buying}
        >
          {buying ? 'Processing…' : `Unlock for ₹${HOOKUPS.unlimitedPrice}`}
          {!buying && <span>→</span>}
        </button>

        <button className="btn-ghost" onClick={onClose}>
          Not now
        </button>
      </div>
    </div>
  );
}