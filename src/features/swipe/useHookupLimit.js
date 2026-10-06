// =========================================================
// MYNVORA — HOOKUP LIMIT HOOK
// Hookups are Diamond-only.
// After Diamond purchase: 10 free swipes in the Hookups group.
// After 10 → ₹99 unlocks unlimited hookup swipes (permanent).
// =========================================================

import { useCallback } from 'react';
import { useUserStore } from '../../store/userStore.js';
import { HOOKUPS } from '../../data/subscriptions.js';

export function useHookupLimit() {
  const {
    tier,
    hookupSwipesUsed,
    hookupsUnlimited,
    incrementHookupSwipe,
    unlockHookups,
    resetHookups
  } = useUserStore();

  const isDiamond = tier === 'diamond';
  const freeLimit = HOOKUPS.freeSwipes;               // 10
  const remaining = hookupsUnlimited
    ? Infinity
    : Math.max(0, freeLimit - hookupSwipesUsed);

  const isOut = isDiamond && !hookupsUnlimited && remaining <= 0;
  const isUnlimited = hookupsUnlimited;

  const consume = useCallback(() => {
    if (!isDiamond) return false;
    if (hookupsUnlimited) return true;
    if (hookupSwipesUsed >= freeLimit) return false;
    incrementHookupSwipe();
    return true;
  }, [isDiamond, hookupsUnlimited, hookupSwipesUsed, freeLimit, incrementHookupSwipe]);

  const purchaseUnlimited = useCallback(() => {
    unlockHookups();
  }, [unlockHookups]);

  const reset = useCallback(() => {
    resetHookups();
  }, [resetHookups]);

  return {
    isDiamond,
    isUnlimited,
    isOut,
    remaining,
    freeLimit,
    used: hookupSwipesUsed,
    consume,
    purchaseUnlimited,
    reset
  };
}