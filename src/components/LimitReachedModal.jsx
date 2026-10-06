// =========================================================
// MYNVORA — LIMIT REACHED MODAL
// Unverified user hits 3 → prompt verify.
// Verified free user hits 8 → upgrade or wait 24h.
// =========================================================

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../navigation/routes.js';
import { useSwipeStore } from '../store/swipeStore.js';

export default function LimitReachedModal({ open, onClose, verified }) {
  const navigate = useNavigate();
  const { resetAt } = useSwipeStore();

  if (!open) return null;

  // ---------- CASE 1: unverified ----------
  if (!verified) {
    return (
      <div className="modal-scrim" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-icon">
            <i className="fa-solid fa-shield-halved" />
          </div>

          <h2 className="modal-title">Verify to keep swiping</h2>
          <p className="modal-sub">
            You've used your 3 swipes as an unverified user.
            Verify in 30 seconds and unlock 8 free swipes a day.
          </p>

          <button
            className="btn-main"
            onClick={() => {
              onClose?.();
              navigate(ROUTES.AGE_VERIFY);
            }}
          >
            Verify now <span>→</span>
          </button>

          <button className="btn-ghost" onClick={onClose}>
            Later
          </button>
        </div>
      </div>
    );
  }

  // ---------- CASE 2: verified free user ----------
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <i className="fa-solid fa-hourglass-half" />
        </div>

        <h2 className="modal-title">You're out of swipes</h2>
        <p className="modal-sub">
          You've used all 8 free swipes for today.
          <br />
          Come back in <strong>{formatReset(resetAt)}</strong> — or upgrade for
          unlimited swiping.
        </p>

        <button
          className="btn-main"
          onClick={() => {
            onClose?.();
            navigate(ROUTES.SUBSCRIPTION);
          }}
        >
          See plans <span>→</span>
        </button>

        <button className="btn-ghost" onClick={onClose}>
          Come back later
        </button>
      </div>
    </div>
  );
}

function formatReset(resetAt) {
  if (!resetAt) return '24h';
  const diff = Math.max(0, resetAt - Date.now());
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}