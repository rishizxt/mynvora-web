// =========================================================
// MYNVORA — STARS (Super Likes)
// Tier-based free allocation + purchasable packs.
// =========================================================

import { FREE_STARS, STAR_PACKS } from './subscriptions.js';

// Re-export so consumers can import directly from stars.js
export { STAR_PACKS };

// ---------------------------------------------------------
// Star allocation per tier
// Free     → 2 stars
// Light    → 4 stars
// Gold     → 8 stars
// Diamond  → 8 stars
// After free allocation is used, users buy packs.
// ---------------------------------------------------------
export function getFreeStarsForTier(tier) {
  return FREE_STARS[tier] ?? FREE_STARS.free;
}

// ---------------------------------------------------------
// Star packs (purchasable)
// ---------------------------------------------------------
export function getStarPacks() {
  return STAR_PACKS;
}

export function getStarPackById(id) {
  return STAR_PACKS.find((p) => p.id === id);
}

// ---------------------------------------------------------
// Format star balance for display
// ---------------------------------------------------------
export function formatStarCount(n) {
  if (n === 0) return '0';
  if (n === Infinity) return '∞';
  if (n < 1000) return `${n}`;
  if (n < 1000000) return `${Math.floor(n / 1000)}k`;
  return `${(n / 1000000).toFixed(1)}M`;
}

// ---------------------------------------------------------
// Star upgrade modal copy
// ---------------------------------------------------------
export const STAR_UPGRADE_MODAL_COPY = {
  title: "You're out of stars",
  subtitle:
    'Super Likes put you at the top of their stack — 3× more likely to match. Get more stars to keep going.',
  ctaText: 'Buy Stars',
  footer: 'Stars never expire'
};