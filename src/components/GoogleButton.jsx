// =========================================================
// MYNVORA — GOOGLE BUTTON
// Uses Google Identity Services (modern GIS, no redirect).
// =========================================================

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore.js';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleButton({ onError }) {
  const navigate = useNavigate();
  const googleLogin = useUserStore((s) => s.googleLogin);

  const btnRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.google?.accounts?.id) {
      setScriptReady(true);
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => setScriptReady(true);
    s.onerror = () => onError?.('Failed to load Google sign-in');
    document.head.appendChild(s);
  }, [onError]);

  useEffect(() => {
    if (!scriptReady || !CLIENT_ID || !btnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: async (response) => {
        if (!response?.credential) return;
        setLoading(true);
        try {
          const data = await googleLogin({ idToken: response.credential });
          if (data?.user?.onboardingComplete) {
            navigate('/discover', { replace: true });
          } else {
            navigate('/onboarding/house-rules', { replace: true });
          }
        } catch (err) {
          const msg =
            err.response?.data?.error ||
            err.response?.data?.message ||
            'Google sign-in failed';
          onError?.(msg);
        } finally {
          setLoading(false);
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.renderButton(btnRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: 320,
    });
  }, [scriptReady, googleLogin, navigate, onError]);

  if (!CLIENT_ID) {
    return (
      <button
        type="button"
        className="login-social"
        onClick={() => onError?.('Google login not configured')}
      >
        <i className="fa-brands fa-google" style={{ color: '#ea4335' }} />
        Google
      </button>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div ref={btnRef} style={{ width: '100%' }} />
      {loading && (
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)', borderRadius: 8,
            color: '#fff', fontSize: 13,
          }}
        >
          Signing in...
        </div>
      )}
    </div>
  );
}