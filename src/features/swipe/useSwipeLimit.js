// =========================================================
// MYNVORA — SWIPE LIMIT HOOK
// DEV MODE: Unlimited swipes (disabled for testing)
// =========================================================

import { useSwipeStore } from '../../store/swipeStore.js';
import { useUserStore } from '../../store/userStore.js';

const DEV_UNLIMITED = true; // 👈 set to false before Play Store launch

export function useSwipeLimit() {
  const { count, resetAt, increment, reset } = useSwipeStore();
  const { tier, verified } = useUserStore();

  if (DEV_UNLIMITED) {
    return {
      count: 0,
      limit: Infinity,
      isUnlimited: true,
      isOut: false,
      remaining: Infinity,
      consume: () => increment(),
      reset,
      resetAt: null,
    };
  }

  const limit = !verified ? 3 : tier === 'free' ? 8 : Infinity;
  const isUnlimited = limit === Infinity;
  const isOut = count >= limit;
  const remaining = isUnlimited ? Infinity : Math.max(0, limit - count);

  return { count, limit, isUnlimited, isOut, remaining, consume: increment, reset, resetAt };
}