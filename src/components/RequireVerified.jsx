// =========================================================
// MYNVORA — REQUIRE VERIFIED
// Blocks unverified users from main app routes
// =========================================================

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore.js';
import { tokens } from '../lib/api.js';

export default function RequireVerified({ children }) {
  const { verified, onboardingComplete, fetchMe } = useUserStore();
  const [checking, setChecking] = useState(true);

  // On mount: if we have a token but don't know verification status yet → fetch /me
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!tokens.access) {
        if (!cancelled) setChecking(false);
        return;
      }
      try {
        await fetchMe();
      } catch {}
      if (!cancelled) setChecking(false);
    })();
    return () => { cancelled = true; };
  }, []);

  // Not logged in → login
  if (!tokens.access) {
    return <Navigate to="/login" replace />;
  }

  // Still checking
  if (checking) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9e9eb3',
          fontSize: 14,
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 24 }} />
        <div>Checking verification…</div>
      </div>
    );
  }

  // Onboarding incomplete → go finish it
  if (!onboardingComplete) {
    return <Navigate to="/onboarding/house-rules" replace />;
  }

  // Not verified → send to selfie step
  if (!verified) {
    return <Navigate to="/onboarding/selfie" replace />;
  }

  // All good
  return children;
}