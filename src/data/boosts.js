// =========================================================
// MYNVORA — BOOSTS
// Paid add-on — available to every tier (not part of any sub).
// Effect: matching-vibe priority. Your profile is shown to
// users whose intentions / interests match yours, faster.
// Not a top-of-stack spam. Smart matching.
// =========================================================

import { BOOSTS } from './subscriptions.js';

// ---------------------------------------------------------
// Available boost durations
// ₹149 → 24h
// ₹299 → 48h
// ---------------------------------------------------------
export function getBoostOptions() {
  return BOOSTS;
}

export function getBoostById(id) {
  return BOOSTS.find((b) => b.id === id);
}

// ---------------------------------------------------------
// Human-readable remaining time
// ---------------------------------------------------------
export function formatBoostTime(ms) {
  if (ms <= 0) return 'Expired';

  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (h >= 1) return `${h}h ${m}m left`;
  return `${m}m left`;
}

// ---------------------------------------------------------
// Modal copy for the boost purchase flow
// ---------------------------------------------------------
export const BOOST_MODAL_COPY = {
  title: 'Boost your profile',
  subtitle:
    'Boost puts your profile in front of people who match your vibe — priority matching, not spam.',
  features: [
    'Shown to matching-vibe users first',
    'Higher in the deck for relevant profiles',
    'Perfect for when you want faster matches',
    'Repeatable — buy again any time after it expires'
  ],
  footer: 'Boost activates immediately and cannot be paused.'
};

// ---------------------------------------------------------
// Active-boost badge copy
// ---------------------------------------------------------
export const BOOST_BADGE_COPY = {
  label: 'Boosted',
  tooltip: "You're boosted — priority matching active"
};