// =========================================================
// MYNVORA — BOOST MODAL
// Buy a boost: ₹149 / 24h · ₹299 / 48h
// Matching-vibe priority (not spam).
// Shows live countdown if a boost is already running.
// =========================================================

import { useState } from 'react';
import { useBoost } from '../features/boost/useBoost.js';
import { getBoostOptions, BOOST_MODAL_COPY } from '../data/boosts.js';

export default function BoostModal({ open, onClose }) {
  const { isActive, remainingLabel, buyBoost } = useBoost();
  const [buying, setBuying] = useState(null);
  const options = getBoostOptions();

  if (!open) return null;

  const handleBuy = (id) => {
    setBuying(id);
    // Demo — real payment later
    setTimeout(() => {
      buyBoost(id);
      setBuying(null);
      onClose?.();
      alert('Boost activated (demo)');
    }, 400);
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon boost-icon">
          <i className="fa-solid fa-bolt" />
        </div>

        <h2 className="modal-title">{BOOST_MODAL_COPY.title}</h2>
        <p className="modal-sub">{BOOST_MODAL_COPY.subtitle}</p>

        {/* Active boost banner */}
        {isActive && (
          <div className="boost-active-banner">
            <i className="fa-solid fa-circle" />
            <span>Boost active · {remainingLabel}</span>
          </div>
        )}

        <ul className="boost-features">
          {BOOST_MODAL_COPY.features.map((f, i) => (
            <li key={i}>
              <i className="fa-solid fa-check" /> {f}
            </li>
          ))}
        </ul>

        <div className="boost-options">
          {options.map((b) => (
            <button
              key={b.id}
              className="boost-option"
              onClick={() => handleBuy(b.id)}
              disabled={buying === b.id}
            >
              <div className="boost-option-left">
                <div className="boost-option-hours">{b.hours}h</div>
                <div className="boost-option-label">{b.label}</div>
              </div>
              <div className="boost-option-price">₹{b.price}</div>
            </button>
          ))}
        </div>

        <p className="boost-footer">{BOOST_MODAL_COPY.footer}</p>

        <button className="btn-ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}