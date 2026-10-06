// =========================================================
// MYNVORA — ABOUT ME + PROMPTS
// One screen: bio + prompts (add/edit/remove) → Location
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboardingStore.js';
import PromptPicker from '../../components/PromptPicker.jsx';
import {
  MAX_PROMPTS,
  MIN_ANSWER_LENGTH,
  MAX_ANSWER_LENGTH
} from '../../data/promptOptions.js';

export default function AboutMe() {
  const navigate = useNavigate();
  const store = useOnboardingStore();

  // Bio state
  const [bio, setBio] = useState(store.bio || '');

  // Prompts state
  const [prompts, setPrompts] = useState(store.prompts || []);
  const [showPicker, setShowPicker] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // ---------- Prompt handlers ----------
  const handleSelectPrompt = (prompt) => {
    if (editingIndex !== null) {
      // Change existing prompt
      const next = [...prompts];
      next[editingIndex] = {
        q: prompt,
        a: next[editingIndex].a || ''
      };
      setPrompts(next);
      setEditingIndex(null);
    } else {
      // Add new prompt
      if (prompts.length >= MAX_PROMPTS) return;
      setPrompts([...prompts, { q: prompt, a: '' }]);
    }
  };

  const handleAnswerChange = (index, answer) => {
    const next = [...prompts];
    next[index] = { ...next[index], a: answer };
    setPrompts(next);
  };

  const handleRemove = (index) => {
    if (!confirm('Remove this prompt?')) return;
    setPrompts(prompts.filter((_, i) => i !== index));
  };

  const handleEditPrompt = (index) => {
    setEditingIndex(index);
    setShowPicker(true);
  };

  const handleAddPrompt = () => {
    setEditingIndex(null);
    setShowPicker(true);
  };

  // ---------- Save / Continue ----------
  const handleContinue = () => {
    // Save bio + prompts to store
    store.update({
      bio: bio.trim() || null,
      prompts: prompts
    });
    store.markStepDone('about-me');

    // Go to Location next
    navigate('/onboarding/location');
  };

  const handleSkip = () => {
    store.update({ bio: null, prompts: [] });
    store.markStepDone('about-me');
    navigate('/onboarding/location');
  };

  // ---------- Computed ----------
  const bioValid = bio.length === 0 || bio.length >= 20; // optional but if filled must be 20+
  const allAnswersFilled =
    prompts.length === 0 ||
    prompts.every((p) => p.a.trim().length >= MIN_ANSWER_LENGTH);

  const canContinue = bioValid && allAnswersFilled;

  return (
    <div className="ob-screen">
      {/* Topbar */}
      <div className="ob-topbar">
        <button
          className="ob-back"
          onClick={() => navigate('/onboarding/photos')}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: '92%' }} />
        </div>
        <button className="ob-skip" onClick={handleSkip}>
          Skip
        </button>
      </div>

      <div className="ob-body">
        <h1 className="ob-title">Share more about yourself</h1>
        <p className="ob-subtitle">
          Add a bio and a few prompts. These help others start conversations
          with you.
        </p>

        {/* ===================== BIO ===================== */}
        <div className="about-block">
          <div className="about-block-head">
            <div>
              <div className="about-block-title">About me</div>
              <div className="about-block-sub">
                Introduce yourself in a few lines
              </div>
            </div>
          </div>

          <textarea
            className="about-textarea"
            rows={4}
            maxLength={500}
            placeholder="Write something about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <div className="about-counter">
            {bio.length} / 500
            {bio.length > 0 && bio.length < 20 && (
              <span className="about-warn">
                · {20 - bio.length} more chars for a strong bio
              </span>
            )}
          </div>
        </div>

        {/* ===================== PROMPTS ===================== */}
        <div className="about-block">
          <div className="about-block-head">
            <div>
              <div className="about-block-title">Prompts</div>
              <div className="about-block-sub">
                Answer up to {MAX_PROMPTS} questions
              </div>
            </div>
            <div className="about-block-count">
              {prompts.length} / {MAX_PROMPTS}
            </div>
          </div>

          {/* Existing prompts */}
          {prompts.length > 0 && (
            <div className="prompt-list">
              {prompts.map((p, i) => (
                <div className="prompt-card" key={i}>
                  <div className="prompt-card-head">
                    <button
                      className="prompt-card-q"
                      onClick={() => handleEditPrompt(i)}
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
                      aria-label="Remove prompt"
                      type="button"
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </div>

                  <textarea
                    className="prompt-card-input"
                    rows={2}
                    maxLength={MAX_ANSWER_LENGTH}
                    placeholder="Type your answer..."
                    value={p.a}
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                  />

                  <div className="prompt-card-counter">
                    {p.a.length} / {MAX_ANSWER_LENGTH}
                    {p.a.length > 0 &&
                      p.a.length < MIN_ANSWER_LENGTH && (
                        <span className="prompt-card-warn">
                          · {MIN_ANSWER_LENGTH - p.a.length} more chars
                        </span>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add prompt button */}
          {prompts.length < MAX_PROMPTS && (
            <button
              className="prompt-add"
              onClick={handleAddPrompt}
              type="button"
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

          {prompts.length >= MAX_PROMPTS && (
            <div className="prompt-full-note">
              <i className="fa-solid fa-circle-info" />
              You've added the maximum {MAX_PROMPTS} prompts
            </div>
          )}
        </div>

        {/* ===================== TIP ===================== */}
        <div className="ob-info-box warm">
          <i className="fa-solid fa-lightbulb" />
          <p>
            Profiles with a bio + prompts get{' '}
            <strong>3× more messages</strong>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="ob-footer">
        <button
          className="btn-primary"
          onClick={handleContinue}
          disabled={!canContinue}
        >
          Continue <i className="fa-solid fa-arrow-right" />
        </button>
      </div>

      {/* Prompt picker sheet */}
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