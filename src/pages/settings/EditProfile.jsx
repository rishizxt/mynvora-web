// =========================================================
// MYNVORA — EDIT PROFILE (real photo upload + real data)
// =========================================================

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore.js';
import api from '../../lib/api.js';

export default function EditProfile() {
  const navigate = useNavigate();
  const profile = useProfileStore();
  const fileInputRef = useRef(null);
  const uploadSlotRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [draft, setDraft] = useState({
    name: '',
    age: '',
    city: '',
    country: '',
    job: '',
    education: '',
    height: '',
    bio: '',
  });

  // Load real profile on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (profile.fetchProfile) await profile.fetchProfile();
      } finally {
        if (cancelled) return;
        const p = profile;
        setDraft({
          name: p.name || '',
          age: p.age || '',
          city: p.city || '',
          country: p.country || '',
          job: p.job || '',
          education: p.education || '',
          height: p.height || '',
          bio: p.bio || '',
        });
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const photos = profile.photos || [];
  const getUrl = (ph) => (typeof ph === 'string' ? ph : ph?.url || '');

  // --- Photo upload ---
  const handlePhotoClick = (index) => {
    if (uploading) return;
    uploadSlotRef.current = index;
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = async (e, index) => {
    e.stopPropagation();
    const photo = photos[index];
    if (!photo) return;
    if (photo.id) {
      try { await api.delete(`/photos/${photo.id}`); } catch {}
    }
    const next = photos.filter((_, i) => i !== index);
    profile.updateFields({ photos: next });
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
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newPhoto = data.photo;
      let next;

      if (slotIndex !== null && photos[slotIndex]) {
        // Replace
        const old = photos[slotIndex];
        if (old.id) {
          try { await api.delete(`/photos/${old.id}`); } catch {}
        }
        next = [...photos];
        next[slotIndex] = newPhoto;
      } else {
        // Add
        next = [...photos, newPhoto];
      }

      profile.updateFields({ photos: next });
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

  // --- Save profile fields ---
  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      // Save locally
      profile.updateFields(draft);

      // Save to backend
      await api.put('/profile/me', {
        first_name: draft.name || null,
        age: draft.age ? Number(draft.age) : null,
        city: draft.city || null,
        country: draft.country || null,
        job: draft.job || null,
        education: draft.education || null,
        height: draft.height || null,
        bio: draft.bio || null,
      });

      // Reload
      if (profile.fetchProfile) await profile.fetchProfile();
      navigate(-1);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Could not save profile'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-screen">
        <div className="settings-page-head">
          <button
            className="settings-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <i className="fa-solid fa-arrow-left" />
          </button>
          <h1>Edit Profile</h1>
          <div className="settings-page-head-spacer" />
        </div>
        <div style={{ textAlign: 'center', padding: 40, color: '#9e9eb3' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 22 }} />
          <p style={{ marginTop: 12 }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-screen">
      <div className="settings-page-head">
        <button
          className="settings-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Edit Profile</h1>
        <div className="settings-page-head-spacer" />
      </div>

      {/* ===================== PHOTOS ===================== */}
      <div className="settings-block">
        <div className="settings-block-head">
          <h2 className="settings-block-title">Photos</h2>
          <span className="settings-block-count">{photos.length}/6</span>
        </div>
        <p className="settings-block-hint">
          Add 4–6 clear photos. Tap to replace, tap ✕ to remove.
        </p>

        {error && (
          <div className="input-error" style={{ marginBottom: 12 }}>
            <i className="fa-solid fa-circle-xmark" />
            {error}
          </div>
        )}

        <div className="photo-upload-grid">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const photo = photos[i];
            return (
              <div
                key={i}
                className={`photo-upload-slot ${photo ? 'filled' : 'empty'}`}
                onClick={() => handlePhotoClick(i)}
                style={{
                  cursor: uploading ? 'wait' : 'pointer',
                  position: 'relative',
                }}
              >
                {photo ? (
                  <>
                    <img src={getUrl(photo)} alt="" />
                    <button
                      type="button"
                      className="photo-upload-remove"
                      onClick={(e) => handleRemovePhoto(e, i)}
                      aria-label="Remove photo"
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-plus" />
                    <span className="photo-upload-label">
                      {i === 0 ? 'Main' : `Photo ${i + 1}`}
                    </span>
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
          <div style={{
            textAlign: 'center',
            padding: 12,
            color: '#ff3b81',
            fontSize: 13,
          }}>
            <i className="fa-solid fa-spinner fa-spin" /> Uploading…
          </div>
        )}
      </div>

      {/* ===================== ABOUT ME ===================== */}
      <div className="settings-block">
        <div className="settings-block-head">
          <h2 className="settings-block-title">About me</h2>
        </div>
        <textarea
          className="settings-textarea"
          rows={4}
          maxLength={500}
          placeholder="Write a short bio..."
          value={draft.bio}
          onChange={(e) => set('bio', e.target.value)}
        />
        <div className="settings-counter">{draft.bio.length} / 500</div>
      </div>

      {/* ===================== BASICS ===================== */}
      <div className="settings-block">
        <div className="settings-block-head">
          <h2 className="settings-block-title">Basics</h2>
        </div>

        <div className="settings-input-group">
          <label className="settings-input-label">Name</label>
          <input
            className="settings-input"
            type="text"
            placeholder="Your first name"
            value={draft.name}
            onChange={(e) => set('name', e.target.value)}
          />
        </div>

        <div className="settings-input-group">
          <label className="settings-input-label">Age</label>
          <input
            className="settings-input"
            type="number"
            placeholder="24"
            min={18}
            max={90}
            value={draft.age}
            onChange={(e) => set('age', e.target.value)}
          />
        </div>

        <div className="settings-input-row">
          <div className="settings-input-group">
            <label className="settings-input-label">City</label>
            <input
              className="settings-input"
              type="text"
              placeholder="Mumbai"
              value={draft.city}
              onChange={(e) => set('city', e.target.value)}
            />
          </div>
          <div className="settings-input-group">
            <label className="settings-input-label">Country</label>
            <input
              className="settings-input"
              type="text"
              placeholder="India"
              value={draft.country}
              onChange={(e) => set('country', e.target.value)}
            />
          </div>
        </div>

        <div className="settings-input-group">
          <label className="settings-input-label">Height</label>
          <input
            className="settings-input"
            type="text"
            placeholder='5&apos;10"'
            value={draft.height}
            onChange={(e) => set('height', e.target.value)}
          />
        </div>

        <div className="settings-input-group">
          <label className="settings-input-label">Job title</label>
          <input
            className="settings-input"
            type="text"
            placeholder="Product Designer"
            value={draft.job}
            onChange={(e) => set('job', e.target.value)}
          />
        </div>

        <div className="settings-input-group">
          <label className="settings-input-label">Education</label>
          <input
            className="settings-input"
            type="text"
            placeholder="IIT Bombay"
            value={draft.education}
            onChange={(e) => set('education', e.target.value)}
          />
        </div>
      </div>

      <div className="settings-save-bar">
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save changes'}{' '}
          <i className="fa-solid fa-arrow-right" />
        </button>
      </div>
    </div>
  );
}