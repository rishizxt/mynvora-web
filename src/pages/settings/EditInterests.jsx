// =========================================================
// MYNVORA — EDIT INTERESTS (real data from backend)
// =========================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore.js';
import api from '../../lib/api.js';

const MAX_INTERESTS = 10;

export default function EditInterests() {
  const navigate = useNavigate();
  const profile = useProfileStore();

  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  // Load interests from backend + current user's selection
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        // Fetch all interests
        const res = await api.get('/interests');
        if (cancelled) return;
        setGrouped(res.data.grouped || {});

        // Fetch current user's interests
        const me = await api.get('/profile/me');
        if (cancelled) return;

        const myInterests = me.data.profile?.interests || [];
        // Each is {id, name, category}
        const ids = myInterests
          .map((i) => (typeof i === 'object' ? i.id : i))
          .filter((x) => typeof x === 'number');
        setSelectedIds(ids);
      } catch (err) {
        console.warn('Failed to load interests:', err.message);
        setError('Could not load interests');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const isAtMax = selectedIds.length >= MAX_INTERESTS;

  const toggle = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
      return;
    }
    if (isAtMax) return;
    setSelectedIds([...selectedIds, id]);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      // Save via onboarding endpoint (it accepts interests)
      await api.post('/profile/onboarding', {
        profile: {},
        interests: selectedIds,
        prompts: [],
      });

      // Reload profile in store
      if (profile.fetchProfile) await profile.fetchProfile();
      navigate(-1);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Could not save interests'
      );
    } finally {
      setSaving(false);
    }
  };

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
        <h1>Interests</h1>
        <div className="settings-page-head-spacer" />
      </div>

      <div className="interests-counter-wrap">
        <div className="interests-counter">
          <span className={`interests-count ${isAtMax ? 'at-max' : ''}`}>
            {selectedIds.length}
          </span>
          <span className="interests-count-sub">of {MAX_INTERESTS}</span>
        </div>
        <div className="interests-counter-hint">
          {isAtMax
            ? "You've selected the maximum — deselect one to choose another"
            : `Pick up to ${MAX_INTERESTS} interests`}
        </div>
      </div>

      {error && (
        <div className="input-error" style={{ margin: '0 20px 12px' }}>
          <i className="fa-solid fa-circle-xmark" />
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: 40, color: '#9e9eb3' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 22 }} />
          <p style={{ marginTop: 12 }}>Loading interests…</p>
        </div>
      )}

      {!loading && (
        <div className="interests-categories">
          {Object.entries(grouped).map(([category, items]) => (
            <div className="interest-category" key={category}>
              <div className="interest-category-title">{category}</div>
              <div className="interest-category-chips">
                {items.map((interest) => {
                  const active = selectedIds.includes(interest.id);
                  const disabled = isAtMax && !active;

                  return (
                    <button
                      key={interest.id}
                      type="button"
                      className={`interest-chip ${
                        active ? 'active' : ''
                      } ${disabled ? 'disabled' : ''}`}
                      onClick={() => toggle(interest.id)}
                      disabled={disabled}
                    >
                      {interest.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="settings-save-bar">
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={saving || loading}
        >
          {saving
            ? 'Saving…'
            : `Save ${selectedIds.length} interest${
                selectedIds.length === 1 ? '' : 's'
              }`}{' '}
          <i className="fa-solid fa-arrow-right" />
        </button>
      </div>
    </div>
  );
}