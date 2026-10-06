// =========================================================
// MYNVORA — ONBOARDING PROMPTS
// Pick up to 3 prompts and answer them.
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

export default function Prompts() {
  const navigate = useNavigate();
  const store = useOnboardingStore();

  const [prompts, setPrompts] = useState(store.prompts || []);
  const [showPicker, setShowPicker] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSelectPrompt = (prompt) => {
    // Replace existing or add new
    if (editingIndex !== null) {
      const next = [...prompts];
      next[editingIndex] = { q: prompt, a: next[editingIndex].a || '' };
      setPrompts(next);
      setEditingIndex(null);
    } else {
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

  const editPrompt = (index) => {
    setEditingIndex(index);
    setShowPicker(true);
  };

  const allAnswered = prompts.every(
    (p) => p.a.trim().length >= MIN_ANSWER_LENGTH
  );
  const canContinue = prompts.length > 0 && allAnswered;

  const handleNext = () => {
    if (!canContinue) return;
    store.set('prompts', prompts);
    store.markStepDone('about-me');
    navigate('/onboarding/location');
  };

  const handleSkip = () => {
    store.set('prompts', []);
    store.markStepDone('about-me');
    navigate('/onboarding/location');
  };

  return (
    <div className="ob-screen">
      {/* Topbar */}
      <div className="ob-topbar">
        <button
          className="ob-back"
          onClick={() => navigate('/onboarding/about-me')}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: '88%' }} />
        </div>
        <button className="ob-skip" onClick={handleSkip}>
          Skip
        </button>
      </div>

      <div className="ob-body">
        <h1 className="ob-title">Show off your personality</h1>
        <p className="ob-subtitle">
          Pick up to {MAX_PROMPTS} prompts. Answers help people start
          conversations.
        </p>

        {/* Prompt cards */}
        <div className="prompt-list">
          {prompts.map((p, i) => (
            <div className="prompt-card" key={i}>
              <div className="prompt-card-head">
                <button
                  className="prompt-card-q"
                  onClick={() => editPrompt(i)}
                >
                  <i className="fa-solid fa-quote-left" />
                  <span>{p.q}</span>
                </button>
                <button
                  className="prompt-card-remove"
                  onClick={() => handleRemove(i)}
                  aria-label="Remove"
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
                {p.a.length > 0 && p.a.length < MIN_ANSWER_LENGTH && (
                  <span className="prompt-card-warn">
                    · {MIN_ANSWER_LENGTH - p.a.length} more chars
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Add prompt button */}
          {prompts.length < MAX_PROMPTS && (
            <button
              className="prompt-add"
              onClick={() => {
                setEditingIndex(null);
                setShowPicker(true);
              }}
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

      {/* Footer */}
      <div className="ob-footer">
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={!canContinue}
        >
          {prompts.length === 0
            ? 'Add 1 prompt to continue'
            : !allAnswered
            ? 'Answer all prompts'
            : 'Continue'}
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