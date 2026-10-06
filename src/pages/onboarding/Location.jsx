// =========================================================
// MYNVORA — LOCATION
// After granting/denying → Continue → goes to Selfie.
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useOnboardingStore } from '../../store/onboardingStore.js';

export default function Location() {
  const navigate = useNavigate();
  const store = useOnboardingStore();

  const [stage, setStage] = useState('intro');

  const requestLocation = () => {
    setStage('requesting');

    if (!navigator.geolocation) {
      handleDenied('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        store.update({
          location: {
            lat: latitude,
            lng: longitude,
            city: 'Current location',
            grantedAt: Date.now()
          },
          locationGranted: true
        });
        setStage('granted');
      },
      (error) => {
        handleDenied(error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleDenied = (reason) => {
    console.error('Location denied:', reason);
    setStage('denied');
    store.update({
      location: {
        lat: null,
        lng: null,
        city: 'Mumbai, India',
        grantedAt: Date.now()
      },
      locationGranted: false
    });
  };

  const continueNext = () => {
    console.log('🎯 LOCATION → navigating to /onboarding/selfie');
    store.markStepDone('location');
    navigate('/onboarding/selfie');
  };

  return (
    <div className="ob-screen">
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
        {stage === 'intro' && (
          <>
            <h1 className="ob-title ob-title-center">
              So, are you from around here?
            </h1>
            <p className="ob-subtitle ob-subtitle-center">
              Set your location to see who's in your area or beyond.
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

        {stage === 'requesting' && (
          <>
            <h1 className="ob-title ob-title-center">
              Getting your location...
            </h1>
            <p className="ob-subtitle ob-subtitle-center">
              Please allow location access in the browser prompt.
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

        {stage === 'granted' && (
          <>
            <div className="ob-success-icon">
              <i className="fa-solid fa-check" />
            </div>
            <h1 className="ob-title ob-title-center">Location set</h1>
            <p className="ob-subtitle ob-subtitle-center">
              We found you! Now let's verify your profile.
            </p>
          </>
        )}

        {stage === 'denied' && (
          <>
            <div className="ob-warn-icon">
              <i className="fa-solid fa-location-dot" />
            </div>
            <h1 className="ob-title ob-title-center">
              Location not available
            </h1>
            <p className="ob-subtitle ob-subtitle-center">
              We couldn't access your location. You can continue with our
              best guess.
            </p>
          </>
        )}
      </div>

      <div className="ob-footer">
        {stage === 'intro' && (
          <>
            <button className="btn-primary" onClick={requestLocation}>
              Allow
            </button>
            <button
              className="ob-link"
              onClick={continueNext}
              type="button"
            >
              Skip location
            </button>
          </>
        )}

        {stage === 'requesting' && (
          <button className="btn-primary" disabled>
            <i className="fa-solid fa-spinner fa-spin" /> Getting location...
          </button>
        )}

        {(stage === 'granted' || stage === 'denied') && (
          <button className="btn-primary" onClick={continueNext}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}