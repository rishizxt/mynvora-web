// =========================================================
// MYNVORA — BOOST HOOK
// Reads + controls the active boost.
// Auto-clears on expiry, exposes a live countdown,
// and handles purchases.
// =========================================================

import { useEffect, useState, useCallback } from 'react';
import { useBoostStore } from '../../store/boostStore.js';
import { getBoostById, formatBoostTime } from '../../data/boosts.js';

export function useBoost() {
  const {
    activeUntil,
    activate,
    clear,
    remainingMs: getRemainingMs,
    isActive: checkActive
  } = useBoostStore();

  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!activeUntil) return;

    const interval = setInterval(() => {
      setTick((t) => t + 1);
      if (Date.now() >= activeUntil) {
        clear();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [activeUntil, clear]);

  const isActive = checkActive();
  const remainingMs = getRemainingMs();
  const remainingLabel = isActive ? formatBoostTime(remainingMs) : '';

  const buyBoost = useCallback(
    (boostId) => {
      const boost = getBoostById(boostId);
      if (!boost) return false;
      activate(boost.hours);
      return true;
    },
    [activate]
  );

  return {
    isActive,
    activeUntil,
    remainingMs,
    remainingLabel,
    tick,
    buyBoost,
    clear
  };
}