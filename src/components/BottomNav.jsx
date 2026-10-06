// =========================================================
// MYNVORA — BOTTOM NAVIGATION
// Shows a swipe-remaining badge on the Swipe tab for free users.
// =========================================================

import { NavLink } from 'react-router-dom';
import { ROUTES } from '../navigation/routes.js';
import { useSwipeLimit } from '../features/swipe/useSwipeLimit.js';

export default function BottomNav() {
  const { isUnlimited, remaining } = useSwipeLimit();

  return (
    <nav className="bottom-nav">
      {/* ---- Swipe ---- */}
      <NavLink
        to={ROUTES.DISCOVER}
        className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`}
      >
        <div className="bn-icon-wrap">
          <i className="fa-solid fa-fire" />
          {!isUnlimited && remaining < 100 && (
            <span className="bn-badge">{remaining}</span>
          )}
        </div>
        <span>Swipe</span>
      </NavLink>

      {/* ---- Explore ---- */}
      <NavLink
        to={ROUTES.EXPLORE}
        className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`}
      >
        <i className="fa-solid fa-compass" />
        <span>Explore</span>
      </NavLink>

      {/* ---- Likes ---- */}
      <NavLink
        to={ROUTES.LIKES}
        className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`}
      >
        <i className="fa-solid fa-heart" />
        <span>Likes</span>
      </NavLink>

      {/* ---- Chat ---- */}
      <NavLink
        to={ROUTES.CHAT}
        className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`}
      >
        <i className="fa-solid fa-comment" />
        <span>Chat</span>
      </NavLink>

      {/* ---- Profile ---- */}
      <NavLink
        to={ROUTES.PROFILE}
        className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`}
      >
        <i className="fa-solid fa-user" />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}