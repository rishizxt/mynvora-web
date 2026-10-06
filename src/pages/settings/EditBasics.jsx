// =========================================================
// MYNVORA — EDIT BASICS
// Zodiac · Family Plans · Pets · Workout · Drinking · Smoking · Social Media
// =========================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore.js';
import api from '../../lib/api.js';
import {
  ZODIAC,
  EDUCATION,
  LANGUAGES,
  FAMILY_PLANS,
  PETS,
  DRINKING,
  SMOKING,
  WORKOUT,
  SOCIAL_MEDIA,
} from '../../data/profileOptions.js';

export default function EditBasics() {
  const navigate = useNavigate();
  const profile = useProfileStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [zodiac, setZodiac] = useState(null);
  const [education, setEducation] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [familyPlans, setFamilyPlans] = useState(null);
  const [pets, setPets] = useState([]);
  const [drinking, setDrinking] = useState(null);
  const [smoking, setSmoking] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [socialMedia, setSocialMedia] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (profile.fetchProfile) await profile.fetchProfile();
        if (cancelled) return;
        const p = profile;
        setZodiac(p.zodiac || null);
        setEducation(p.education || null);
        setLanguages(p.languages || []);
        setFamilyPlans(p.family_plans || null);
        setPets(p.pets || []);
        setDrinking(p.drinking || null);
        setSmoking(p.smoking || null);
        setWorkout(p.workout || null);
        setSocialMedia(p.social_media || null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const toggleLanguage = (lang) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const togglePet = (pet) => {
    setPets((prev) =>
      prev.includes(pet) ? prev.filter((p) => p !== pet) : [...prev, pet]
    );
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        zodiac,
        education,
        languages,
        family_plans: familyPlans,
        pets,
        drinking,
        smoking,
        workout,
        social_media: socialMedia,
      };

      profile.updateFields(payload);
      await api.put('/profile/me', payload);

      if (profile.fetchProfile) await profile.fetchProfile();
      navigate(-1);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Could not save changes'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-screen">
        <div className="settings-page-head">
          <button className="settings-back-btn" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left" />
          </button>
          <h1>Basics & Lifestyle</h1>
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
        <button className="settings-back-btn" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Basics & Lifestyle</h1>
        <div className="settings-page-head-spacer" />
      </div>

      {error && (
        <div className="input-error" style={{ margin: '0 20px 12px' }}>
          <i className="fa-solid fa-circle-xmark" />
          {error}
        </div>
      )}

      {/* ZODIAC */}
      <div className="settings-section">
        <div className="settings-section-title">Zodiac sign</div>
        <div className="zodiac-grid">
          {ZODIAC.map((z) => {
            const active = zodiac === z.id;
            return (
              <button
                key={z.id}
                className={`zodiac-card ${active ? 'active' : ''}`}
                onClick={() => setZodiac(z.id)}
              >
                <span className="zodiac-icon">{z.icon}</span>
                <span className="zodiac-name">{z.label}</span>
                <span className="zodiac-range">{z.range}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAMILY PLANS */}
      <div className="settings-section">
        <div className="settings-section-title">Family plans</div>
        <div className="option-pill-list">
          {FAMILY_PLANS.map((f) => {
            const active = familyPlans === f.id;
            return (
              <button
                key={f.id}
                className={`option-pill ${active ? 'active' : ''}`}
                onClick={() => setFamilyPlans(f.id)}
              >
                {f.icon} {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* PETS */}
      <div className="settings-section">
        <div className="settings-section-title">
          Pets
          {pets.length > 0 && (
            <span className="settings-section-count">{pets.length} selected</span>
          )}
        </div>
        <div className="interest-category-chips">
          {PETS.map((pet) => {
            const active = pets.includes(pet);
            return (
              <button
                key={pet}
                className={`interest-chip ${active ? 'active' : ''}`}
                onClick={() => togglePet(pet)}
              >
                {pet}
              </button>
            );
          })}
        </div>
      </div>

      {/* EDUCATION */}
      <div className="settings-section">
        <div className="settings-section-title">Education</div>
        <div className="option-pill-list">
          {EDUCATION.map((e) => {
            const active = education === e.id;
            return (
              <button
                key={e.id}
                className={`option-pill ${active ? 'active' : ''}`}
                onClick={() => setEducation(e.id)}
              >
                {e.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* LANGUAGES */}
      <div className="settings-section">
        <div className="settings-section-title">
          Languages I speak
          {languages.length > 0 && (
            <span className="settings-section-count">
              {languages.length} selected
            </span>
          )}
        </div>
        <div className="interest-category-chips">
          {LANGUAGES.map((lang) => {
            const active = languages.includes(lang);
            return (
              <button
                key={lang}
                className={`interest-chip ${active ? 'active' : ''}`}
                onClick={() => toggleLanguage(lang)}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* DRINKING */}
      <div className="settings-section">
        <div className="settings-section-title">Drinking</div>
        <div className="option-pill-list">
          {DRINKING.map((d) => {
            const active = drinking === d.id;
            return (
              <button
                key={d.id}
                className={`option-pill ${active ? 'active' : ''}`}
                onClick={() => setDrinking(d.id)}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SMOKING */}
      <div className="settings-section">
        <div className="settings-section-title">Smoking</div>
        <div className="option-pill-list">
          {SMOKING.map((s) => {
            const active = smoking === s.id;
            return (
              <button
                key={s.id}
                className={`option-pill ${active ? 'active' : ''}`}
                onClick={() => setSmoking(s.id)}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* WORKOUT */}
      <div className="settings-section">
        <div className="settings-section-title">Workout</div>
        <div className="option-pill-list">
          {WORKOUT.map((w) => {
            const active = workout === w.id;
            return (
              <button
                key={w.id}
                className={`option-pill ${active ? 'active' : ''}`}
                onClick={() => setWorkout(w.id)}
              >
                {w.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SOCIAL MEDIA */}
      <div className="settings-section">
        <div className="settings-section-title">Social media</div>
        <div className="option-pill-list">
          {SOCIAL_MEDIA.map((s) => {
            const active = socialMedia === s.id;
            return (
              <button
                key={s.id}
                className={`option-pill ${active ? 'active' : ''}`}
                onClick={() => setSocialMedia(s.id)}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="settings-save-bar">
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}{' '}
          <i className="fa-solid fa-arrow-right" />
        </button>
      </div>
    </div>
  );
}