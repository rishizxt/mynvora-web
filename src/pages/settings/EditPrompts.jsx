// =========================================================
// MYNVORA — EDIT PROMPTS (like Interests flow)
// =========================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore.js';
import PromptPicker from '../../components/PromptPicker.jsx';
import api from '../../lib/api.js';

const MAX_PROMPTS = 3;
const MIN_ANSWER = 3;

export default function EditPrompts() {
  const navigate = useNavigate();
  const profile = useProfileStore();

  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Load existing prompts
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (profile.fetchProfile) await profile.fetchProfile();
        if (cancelled) return;
        setPrompts(profile.prompts || []);
      } catch (err) {
        setError('Could not load prompts');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSelectPrompt = (question) => {
    if (editingIndex !== null) {
      const next = [...prompts];
      next[editingIndex] = { q: question, a: next[editingIndex].a || '' };
      setPrompts(next);
      setEditingIndex(null);
    } else {
      if (prompts.length >= MAX_PROMPTS) {
        setShowPicker(false);
        return;
      }
      setPrompts([...prompts, { q: question, a: '' }]);
    }
  };

  const handleAnswerChange = (index, answer) => {
    const next = [...prompts];
    next[index] = { ...next[index], a: answer };
    setPrompts(next);
  };

  const handleRemove = (index) => {
    setPrompts(prompts.filter((_, i) => i !== index));
  };

  const handleEditQuestion = (index) => {
    setEditingIndex(index);
    setShowPicker(true);
  };

  const handleAdd = () => {
    if (prompts.length >= MAX_PROMPTS) {
      alert(`Maximum ${MAX_PROMPTS} prompts allowed`);
      return;
    }
    setEditingIndex(null);
    setShowPicker(true);
  };

  const allValid =
    prompts.length > 0 &&
    prompts.every((p) => p.q && p.a && p.a.trim().length >= MIN_ANSWER);

  const handleSave = async () => {
    if (!allValid) {
      setError('Please answer all prompts (min 3 chars)');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = prompts.map((p, i) => ({
        question: p.q,
        answer: p.a.trim(),
        position: i,
      }));

      await api.post('/profile/onboarding', {
        profile: {},
        interests: [],
        prompts: payload,
      });

      if (profile.fetchProfile) await profile.fetchProfile();
      navigate(-1);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Could not save prompts'
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
          <h1>Prompts</h1>
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
        <h1>Prompts</h1>
        <div className="settings-page-head-spacer" />
      </div>

      <div className="settings-block">
        <p className="settings-block-hint">
          Answer up to {MAX_PROMPTS} prompts to show your personality.
        </p>

        {error && (
          <div className="input-error" style={{ marginBottom: 12 }}>
            <i className="fa-solid fa-circle-xmark" />
            {error}
          </div>
        )}

        <div className="prompt-list">
          {prompts.map((p, i) => (
            <div className="prompt-card" key={i}>
              <div className="prompt-card-head">
                <button
                  className="prompt-card-q"
                  onClick={() => handleEditQuestion(i)}
                  type="button"
                >
                  <i className="fa-solid fa-quote-left" />
                  <span>{p.q}</span>
                  <span className="prompt-card-edit">
                    <i className="fa-solid fa-pen" />
                  </span>
                </button>

                <button
                  className="prompt-card-remove"
                  onClick={() => handleRemove(i)}
                  aria-label="Remove"
                  type="button"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <textarea
                className="prompt-card-input"
                rows={2}
                maxLength={200}
                placeholder="Type your answer..."
                value={p.a}
                onChange={(e) => handleAnswerChange(i, e.target.value)}
              />

              <div className="prompt-card-counter">
                {p.a.length} / 200
                {p.a.length > 0 && p.a.length < MIN_ANSWER && (
                  <span className="prompt-card-warn">
                    · {MIN_ANSWER - p.a.length} more chars
                  </span>
                )}
              </div>
            </div>
          ))}

          {prompts.length < MAX_PROMPTS && (
            <button
              type="button"
              className="prompt-add"
              onClick={handleAdd}
            >
              <div className="prompt-add-icon">
                <i className="fa-solid fa-plus" />
              </div>
              <div className="prompt-add-body">
                <div className="prompt-add-title">
                  Add a prompt
                  <span className="prompt-add-count">
                    {prompts.length} / {MAX_PROMPTS}
                  </span>
                </div>
                <div className="prompt-add-sub">
                  Answer a question to show your personality
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      <div className="settings-save-bar">
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={saving || !allValid}
        >
          {saving ? 'Saving…' : 'Save prompts'}{' '}
          <i className="fa-solid fa-arrow-right" />
        </button>
      </div>

      <PromptPicker
        open={showPicker}
        onClose={() => {
          setShowPicker(false);
          setEditingIndex(null);
        }}
        onSelect={handleSelectPrompt}
      />
    </div>
  );
}