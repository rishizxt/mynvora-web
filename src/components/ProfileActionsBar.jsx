// =========================================================
// MYNVORA — PROFILE ACTIONS BAR
// Sticky bottom bar for the profile detail screen.
// ✕ Nope · ★ Super Like · ♥ Like
// =========================================================

export default function ProfileActionsBar({ onNope, onSuper, onLike }) {
  return (
    <div className="pab-bar">
      {/* Nope */}
      <button
        className="pab-btn pab-nope"
        onClick={onNope}
        aria-label="Pass"
      >
        <i className="fa-solid fa-xmark" />
      </button>

      {/* Super Like */}
      <button
        className="pab-btn pab-super"
        onClick={onSuper}
        aria-label="Super Like"
      >
        <i className="fa-solid fa-star" />
      </button>

      {/* Like */}
      <button
        className="pab-btn pab-like"
        onClick={onLike}
        aria-label="Like"
      >
        <i className="fa-solid fa-heart" />
      </button>
    </div>
  );
}