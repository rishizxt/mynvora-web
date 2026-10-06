// =========================================================
// MYNVORA — STAR UPGRADE MODAL
// Shown when the user runs out of stars (Super Likes).
// Offers ₹99 = 6 stars · ₹199 = 14 stars
// =========================================================

import { useState } from 'react';
import { useStarLimit } from '../features/swipe/useStarLimit.js';
import { STAR_PACKS, STAR_UPGRADE_MODAL_COPY } from '../data/stars.js';

export default function StarUpgradeModal({ open, onClose }) {
  const { purchasePack, starsRemaining } = useStarLimit();
  const [buying, setBuying] = useState(null);

  if (!open) return null;

  const handleBuy = (pack) => {
    setBuying(pack.id);
    // Demo — in production, trigger payment flow
    setTimeout(() => {
      purchasePack(pack);
      setBuying(null);
      onClose?.();
      alert(`Added ${pack.stars} stars (demo)`);
    }, 400);
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <i className="fa-solid fa-star" />
        </div>

        <h2 className="modal-title">{STAR_UPGRADE_MODAL_COPY.title}</h2>
        <p className="modal-sub">{STAR_UPGRADE_MODAL_COPY.subtitle}</p>

        <div className="star-packs">
          {STAR_PACKS.map((p) => (
            <button
              key={p.id}
              className="star-pack"
              onClick={() => handleBuy(p)}
              disabled={buying === p.id}
            >
              <div className="star-pack-top">
                <span className="star-pack-count">
                  <i className="fa-solid fa-star" /> {p.stars}
                </span>
                <span className="star-pack-price">₹{p.price}</span>
              </div>
              <span className="star-pack-label">{p.label}</span>
            </button>
          ))}
        </div>

        <div className="star-current">
          Current balance: <strong>{starsRemaining}</strong> stars
        </div>

        <button className="btn-ghost" onClick={onClose}>
          Not now
        </button>
      </div>
    </div>
  );
}