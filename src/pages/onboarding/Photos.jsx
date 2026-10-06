// =========================================================
// MYNVORA — PHOTOS (reliable add / replace / remove)
// =========================================================

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useOnboardingStore } from '../../store/onboardingStore.js';
import api from '../../lib/api.js';
import {
  MIN_PHOTOS,
  RECOMMENDED_PHOTOS,
  MAX_PHOTOS
} from '../../data/onboardingOptions.js';

export default function Photos() {
  const navigate = useNavigate();
  const store = useOnboardingStore();
  const fileInputRef = useRef(null);
  const uploadSlotRef = useRef(null);

  const [photos, setPhotos] = useState(store.photos || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const getUrl = (photo) =>
    typeof photo === 'string' ? photo : photo?.url || '';

  const handleRemoveClick = async (e, index) => {
    e.stopPropagation();
    const photo = photos[index];
    if (!photo) return;

    if (photo.id) {
      try { await api.delete(`/photos/${photo.id}`); } catch {}
    }

    const next = photos.filter((_, i) => i !== index);
    setPhotos(next);
    store.set('photos', next);
  };

  const handleSlotClick = (index) => {
    if (uploading) return;
    uploadSlotRef.current = index;
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (!file.type.startsWith('image/')) {
      setError('Please pick an image file');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Image must be under 8 MB');
      return;
    }

    const slotIndex = uploadSlotRef.current;
    uploadSlotRef.current = null;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const { data } = await api.post('/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newPhoto = data.photo;
      let next;

      if (slotIndex !== null && photos[slotIndex]) {
        const old = photos[slotIndex];
        if (old.id) {
          try { await api.delete(`/photos/${old.id}`); } catch {}
        }
        next = [...photos];
        next[slotIndex] = newPhoto;
      } else {
        next = [...photos, newPhoto];
      }

      setPhotos(next);
      store.set('photos', next);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Upload failed. Try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    if (photos.length < MIN_PHOTOS) return;
    store.markStepDone('photos');
    navigate(ROUTES.ONBOARDING_ABOUT_ME);
  };

  const ready = photos.length >= MIN_PHOTOS;

  return (
    <div className="ob-screen">
      <div className="ob-topbar">
        <button
          className="ob-back"
          onClick={() => navigate(ROUTES.ONBOARDING_INTERESTS)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: '82%' }} />
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div className="ob-body">
        <h1 className="ob-title">Add your recent pics</h1>
        <p className="ob-subtitle">
          Upload {MIN_PHOTOS} photos to start. Add {RECOMMENDED_PHOTOS} or
          more to make your profile stand out.
        </p>

        <div className="ob-photo-counter">
          <div className="ob-photo-counter-bar">
            <div
              className="ob-photo-counter-fill"
              style={{ width: `${(photos.length / MAX_PHOTOS) * 100}%` }}
            />
          </div>
          <div className="ob-photo-counter-label">
            {photos.length} / {MAX_PHOTOS}
            {ready ? ' ✓' : ` · ${MIN_PHOTOS - photos.length} more needed`}
          </div>
        </div>

        {error && (
          <div className="input-error" style={{ marginBottom: 12 }}>
            <i className="fa-solid fa-circle-xmark" />
            {error}
          </div>
        )}

        <div className="ob-photo-grid">
          {Array.from({ length: MAX_PHOTOS }).map((_, i) => {
            const photo = photos[i];
            return (
              <div
                key={i}
                className={`ob-photo-slot ${photo ? 'filled' : 'empty'}`}
                onClick={() => handleSlotClick(i)}
                style={{ cursor: uploading ? 'wait' : 'pointer', position: 'relative' }}
              >
                {photo ? (
                  <>
                    <img src={getUrl(photo)} alt="" />
                    <button
                      type="button"
                      className="ob-photo-remove"
                      onClick={(e) => handleRemoveClick(e, i)}
                      aria-label="Remove photo"
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                    {i === 0 && (
                      <span className="ob-photo-main">Main</span>
                    )}
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-plus" />
                    {i === 0 && (
                      <span className="ob-photo-label">Main</span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        {uploading && (
          <div className="ob-info-box">
            <i className="fa-solid fa-spinner fa-spin" />
            <p>Uploading photo…</p>
          </div>
        )}

        <div className="ob-info-box">
          <i className="fa-solid fa-shield-halved" />
          <p>
            Tap any photo to <strong>replace</strong> it. Tap <strong>×</strong> to remove.
            All photos are AI-moderated.
          </p>
        </div>
      </div>

      <div className="ob-footer">
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={!ready || uploading}
        >
          {uploading
            ? 'Uploading…'
            : ready
            ? 'Continue'
            : `Add ${MIN_PHOTOS - photos.length} more`}
        </button>
      </div>
    </div>
  );
}