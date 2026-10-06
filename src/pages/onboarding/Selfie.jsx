// =========================================================
// MYNVORA — SELFIE VERIFICATION (real webcam capture)
// =========================================================

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore, syncOnboardingToBackend } from '../../store/onboardingStore.js';
import { useUserStore } from '../../store/userStore.js';
import api from '../../lib/api.js';

export default function Selfie() {
  const navigate = useNavigate();
  const store = useOnboardingStore();
  const { setVerified } = useUserStore();

  const [stage, setStage] = useState('intro'); // intro | capturing | processing | done
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // ---------------------------------------------------------
  // Start camera
  // ---------------------------------------------------------
  const startCamera = async () => {
    setError('');
    setStage('capturing');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 720 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Could not access camera. Please allow camera permission.');
      setStage('intro');
    }
  };

  // ---------------------------------------------------------
  // Capture + upload
  // ---------------------------------------------------------
  const capture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      setStage('processing');

      try {
        const formData = new FormData();
        formData.append('selfie', blob, 'selfie.jpg');

        console.log('📤 Uploading selfie...');
        const { data } = await api.post('/verification/selfie', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('✅ Selfie verified:', data);
        setVerified(true);
        store.set('faceCheckDone', true);
        setStage('done');
      } catch (err) {
        console.error('Selfie upload failed:', err);
        const msg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Verification failed. Try again.';
        setError(msg);
        setStage('intro');
      }
    }, 'image/jpeg', 0.92);
  };

  // ---------------------------------------------------------
  // Finish onboarding
  // ---------------------------------------------------------
  const finish = async () => {
    setSaving(true);
    try {
      await syncOnboardingToBackend(store);
      store.completeOnboarding();
    } catch (err) {
      console.error('Sync failed:', err);
      store.completeOnboarding();
    } finally {
      setSaving(false);
      navigate('/discover', { replace: true });
    }
  };

  return (
    <div className="ob-screen">
      <div className="ob-topbar">
        <button
          className="ob-back"
          onClick={() => navigate('/onboarding/location')}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: '100%' }} />
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div className="ob-body ob-body-center">
        {error && (
          <div className="input-error" style={{ marginBottom: 16 }}>
            <i className="fa-solid fa-circle-xmark" />
            {error}
          </div>
        )}

        {/* ============ INTRO ============ */}
        {stage === 'intro' && (
          <>
            <div className="ob-verify-badge">
              <i className="fa-solid fa-certificate" />
            </div>
            <h1 className="ob-title ob-title-center">Let's keep it real</h1>
            <p className="ob-subtitle ob-subtitle-center">
              Take a quick selfie — we'll verify it's really you. Helps keep
              Mynvora safe from fake accounts.
            </p>
            <p className="ob-subtitle ob-subtitle-center">
              <strong>Your profile won't be visible until you complete this.</strong>
            </p>
          </>
        )}

        {/* ============ CAPTURING ============ */}
        {stage === 'capturing' && (
          <>
            <div className="ob-selfie-frame">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  transform: 'scaleX(-1)',
                }}
              />
              <div className="ob-selfie-guide" />
            </div>
            <h2 className="ob-title ob-title-center">Look at the camera</h2>
            <p className="ob-subtitle ob-subtitle-center">
              Center your face in the circle
            </p>
          </>
        )}

        {/* ============ PROCESSING ============ */}
        {stage === 'processing' && (
          <>
            <div className="ob-verify-badge loading">
              <i className="fa-solid fa-spinner fa-spin" />
            </div>
            <h2 className="ob-title ob-title-center">Verifying...</h2>
            <p className="ob-subtitle ob-subtitle-center">
              Analyzing your selfie. This takes a few seconds.
            </p>
          </>
        )}

        {/* ============ DONE ============ */}
        {stage === 'done' && (
          <>
            <div className="ob-success-icon large">
              <i className="fa-solid fa-check" />
            </div>
            <h2 className="ob-title ob-title-center">
              Verified! You're all set
            </h2>
            <p className="ob-subtitle ob-subtitle-center">
              Your profile now has a Photo Verified badge. Time to meet people.
            </p>
          </>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="ob-footer">
        {stage === 'intro' && (
          <>
            <button className="btn-primary" onClick={startCamera}>
              Take selfie <i className="fa-solid fa-camera" />
            </button>
          </>
        )}

        {stage === 'capturing' && (
          <button className="btn-primary" onClick={capture}>
            Capture <i className="fa-solid fa-camera" />
          </button>
        )}

        {stage === 'done' && (
          <button className="btn-primary" onClick={finish} disabled={saving}>
            {saving ? 'Saving…' : 'Start exploring'}
          </button>
        )}
      </div>
    </div>
  );
}