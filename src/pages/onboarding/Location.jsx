// =========================================================
// MYNVORA — LOCATION
// Tinder-style pre-permission screen.
// Fetches GPS + reverse-geocodes to real city name.
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useOnboardingStore } from '../../store/onboardingStore.js';
import {
  getCurrentCoords,
  reverseGeocode,
} from '../../lib/location.js';

export default function Location() {
  const navigate = useNavigate();
  const store = useOnboardingStore();

  const [stage, setStage] = useState('intro'); // intro | requesting | granted | denied | manual
  const [locationData, setLocationData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showWhy, setShowWhy] = useState(false);
  const [manualCity, setManualCity] = useState('');

  /* ── request location ────────────────────────────────── */
  const requestLocation = async () => {
    setStage('requesting');
    setErrorMsg('');

    try {
      const coords = await getCurrentCoords();
      const place = await reverseGeocode(coords.lat, coords.lng);

      const data = {
        lat: coords.lat,
        lng: coords.lng,
        accuracy: coords.accuracy,
        city: place?.city || 'Unknown',
        state: place?.state || '',
        country: place?.country || '',
        full: place?.full || place?.city || 'Current location',
        grantedAt: Date.now(),
      };

      setLocationData(data);
      store.update({ location: data, locationGranted: true });
      setStage('granted');
    } catch (err) {
      console.warn('[location] denied:', err.message);
      setErrorMsg(err.message || 'Could not get your location');
      setStage('denied');
    }
  };

  /* ── manual city entry (fallback) ────────────────────── */
  const submitManualCity = () => {
    const city = manualCity.trim();
    if (!city) return;

    const data = {
      lat: null,
      lng: null,
      city,
      state: '',
      country: '',
      full: city,
      grantedAt: Date.now(),
      manual: true,
    };

    setLocationData(data);
    store.update({ location: data, locationGranted: false });
    setStage('granted');
  };

  /* ── continue to next step ───────────────────────────── */
  const continueNext = () => {
    store.markStepDone('location');
    navigate(ROUTES.ONBOARDING_SELFIE);
  };

  return (
    <div className="ob-screen ob-location-screen">
      <div className="ob-topbar">
        <button
          className="ob-back"
          onClick={() => navigate(ROUTES.ONBOARDING_ABOUT_ME)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: '96%' }} />
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div className="ob-body ob-body-center">
        {/* ══════ INTRO ══════ */}
        {stage === 'intro' && (
          <>
            <h1 className="ob-title ob-title-center">
              So, are you from around here?
            </h1>
            <p className="ob-subtitle ob-subtitle-center">
              Set your location to see who's in your area or beyond.
              You won't be able to match with people otherwise.
            </p>

            <div className="ob-location-hero">
              <div className="ob-location-pulse pulse-1" />
              <div className="ob-location-pulse pulse-2" />
              <div className="ob-location-icon">
                <i className="fa-solid fa-location-dot" />
              </div>
            </div>
          </>
        )}

        {/* ══════ REQUESTING ══════ */}
        {stage === 'requesting' && (
          <>
            <h1 className="ob-title ob-title-center">
              Getting your location…
            </h1>
            <p className="ob-subtitle ob-subtitle-center">
              Please tap "Allow" in the browser prompt.
            </p>

            <div className="ob-location-hero">
              <div className="ob-location-pulse pulse-1" />
              <div className="ob-location-pulse pulse-2" />
              <div className="ob-location-icon loading">
                <i className="fa-solid fa-spinner fa-spin" />
              </div>
            </div>
          </>
        )}

        {/* ══════ GRANTED ══════ */}
        {stage === 'granted' && locationData && (
          <>
            <div className="ob-success-icon">
              <i className="fa-solid fa-check" />
            </div>
            <h1 className="ob-title ob-title-center">
              {locationData.manual ? 'Location saved' : 'Location set'}
            </h1>
            <p className="ob-subtitle ob-subtitle-center">
              {locationData.full || locationData.city}
            </p>

            {locationData.manual && (
              <p
                className="ob-subtitle ob-subtitle-center"
                style={{ marginTop: 8, fontSize: 13, opacity: 0.7 }}
              >
                You can update this anytime in Settings.
              </p>
            )}
          </>
        )}

        {/* ══════ DENIED ══════ */}
        {stage === 'denied' && (
          <>
            <div className="ob-warn-icon">
              <i className="fa-solid fa-location-dot" />
            </div>
            <h1 className="ob-title ob-title-center">
              Location not available
            </h1>
            <p className="ob-subtitle ob-subtitle-center">
              {errorMsg || "We couldn't access your location."}
            </p>
            <p
              className="ob-subtitle ob-subtitle-center"
              style={{ marginTop: 8, fontSize: 13, opacity: 0.7 }}
            >
              You can retry, or pick your city manually.
            </p>
          </>
        )}

        {/* ══════ MANUAL CITY ══════ */}
        {stage === 'manual' && (
          <>
            <h1 className="ob-title ob-title-center">Pick your city</h1>
            <p className="ob-subtitle ob-subtitle-center">
              Type the city you want to match in.
            </p>

            <input
              type="text"
              className="ob-input"
              placeholder="e.g. Mumbai, Delhi, Pune…"
              value={manualCity}
              onChange={(e) => setManualCity(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                maxWidth: 320,
                padding: '14px 18px',
                borderRadius: 12,
                border: '1.5px solid #ebebf0',
                fontSize: 15,
                fontFamily: 'inherit',
                marginTop: 20,
                textAlign: 'center',
              }}
            />
          </>
        )}
      </div>

      <div className="ob-footer">
        {/* INTRO */}
        {stage === 'intro' && (
          <>
            <button className="btn-primary" onClick={requestLocation}>
              Allow
            </button>
            <button
              className="ob-link"
              onClick={() => setShowWhy(true)}
              type="button"
            >
              How is my location used?
            </button>
          </>
        )}

        {/* REQUESTING */}
        {stage === 'requesting' && (
          <button className="btn-primary" disabled>
            <i className="fa-solid fa-spinner fa-spin" /> Getting location…
          </button>
        )}

        {/* GRANTED */}
        {stage === 'granted' && (
          <button className="btn-primary" onClick={continueNext}>
            Continue
          </button>
        )}

        {/* DENIED */}
        {stage === 'denied' && (
          <>
            <button className="btn-primary" onClick={requestLocation}>
              Try again
            </button>
            <button
              className="ob-link"
              onClick={() => setStage('manual')}
              type="button"
            >
              Pick city manually
            </button>
          </>
        )}

        {/* MANUAL */}
        {stage === 'manual' && (
          <>
            <button
              className="btn-primary"
              onClick={submitManualCity}
              disabled={!manualCity.trim()}
            >
              Save city
            </button>
            <button
              className="ob-link"
              onClick={() => setStage('denied')}
              type="button"
            >
              Back
            </button>
          </>
        )}
      </div>

      {/* ══════ "How is my location used?" MODAL ══════ */}
      {showWhy && (
        <div
          className="modal-scrim"
          onClick={() => setShowWhy(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'flex-end',
            zIndex: 9999,
          }}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              width: '100%',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '24px 22px 32px',
              animation: 'slideUp 0.3s ease',
            }}
          >
            <div
              style={{
                width: 40, height: 4, borderRadius: 4,
                background: '#e0e0e8', margin: '0 auto 20px',
              }}
            />
            <h2
              style={{
                fontSize: 18, fontWeight: 800, color: '#1a1a2e',
                marginBottom: 10, letterSpacing: -0.3,
              }}
            >
              How is my location used?
            </h2>
            <div style={{ fontSize: 14, color: '#63637a', lineHeight: 1.6 }}>
              <p style={{ marginBottom: 10 }}>
                📍 <strong>Match with people nearby.</strong> Your city is
                shown on your profile. Your exact GPS is never shared.
              </p>
              <p style={{ marginBottom: 10 }}>
                🔒 <strong>Never stored publicly.</strong> Only used to
                calculate distance between you and other users.
              </p>
              <p style={{ marginBottom: 10 }}>
                ⚙️ <strong>You control it.</strong> Turn off location
                anytime in Settings. We'll then use your last known city.
              </p>
              <p>
                🛡️ <strong>Teens safety.</strong> Users 16–17 only see
                city-level distance, never exact coordinates.
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={() => setShowWhy(false)}
              style={{ marginTop: 24, width: '100%' }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}