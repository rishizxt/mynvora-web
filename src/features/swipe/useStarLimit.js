// =========================================================
// MYNVORA — STAR LIMIT HOOK
// Combines userStore (star counts) + starStore (super-liked IDs)
// + subscriptions.js (free allocation per tier).
// =========================================================

import { useEffect, useCallback } from 'react';
import { useUserStore } from '../../store/userStore.js';
import { useStarStore } from '../../store/starStore.js';
import { getFreeStarsForTier } from '../../data/stars.js';

export function useStarLimit() {
  const {
    tier,
    starsPurchased,
    starsUsed,
    addPurchasedStars,
    consumeStar,
    resetStars
  } = useUserStore();

  const { hasSuperLiked, markSuperLiked, recordPurchase } = useStarStore();

  // -------- derived numbers --------
  const freeStars = getFreeStarsForTier(tier);
  const totalStars = freeStars + starsPurchased;
  const starsRemaining = Math.max(0, totalStars - starsUsed);
  const isOut = starsRemaining <= 0;

  // -------- actions --------

  // Send a super like to a profile.
  // Returns true if successful, false if no stars remain.
  const sendSuperLike = useCallback(
    (profileId) => {
      if (isOut) return false;
      if (hasSuperLiked(profileId)) return false;

      consumeStar();
      markSuperLiked(profileId);
      return true;
    },
    [isOut, consumeStar, hasSuperLiked, markSuperLiked]
  );

  // After a purchase — add stars and log the transaction
  const purchasePack = useCallback(
    (pack) => {
      if (!pack) return;
      addPurchasedStars(pack.stars);
      recordPurchase(pack.id, pack.price);
    },
    [addPurchasedStars, recordPurchase]
  );

  // Debug: wipe star state for this user
  const reset = useCallback(() => {
    resetStars();
  }, [resetStars]);

  // Safety: ensure hooks are synced on mount
  useEffect(() => {
    // no-op — hooks are pure derived
  }, []);

  return {
    // state
    freeStars,
    totalStars,
    starsRemaining,
    starsUsed,
    isOut,

    // actions
    sendSuperLike,
    purchasePack,
    hasSuperLiked,
    reset
  };
}