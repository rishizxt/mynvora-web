// =========================================================
// MYNVORA — PROMPT PICKER
// Bottom sheet to select a prompt from the list.
// =========================================================

import { useState } from 'react';
import { PROMPT_OPTIONS } from '../data/promptOptions.js';

export default function PromptPicker({ open, onClose, onSelect }) {
  const [query, setQuery] = useState('');

  if (!open) return null;

  const filtered = query.trim()
    ? PROMPT_OPTIONS.filter((p) =>
        p.toLowerCase().includes(query.trim().toLowerCase())
      )
    : PROMPT_OPTIONS;

  const handleSelect = (prompt) => {
    onSelect?.(prompt);
    setQuery('');
    onClose?.();
  };

  return (
    <div className="pp-scrim" onClick={onClose}>
      <div className="pp-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Handle */}
        <div className="pp-handle" />

        {/* Header */}
        <div className="pp-head">
          <button
            className="pp-back"
            onClick={onClose}
            aria-label="Back"
          >
            <i className="fa-solid fa-arrow-left" />
          </button>
          <h2 className="pp-title">Select a prompt</h2>
          <div style={{ width: 40 }} />
        </div>

        {/* Search */}
        <div className="pp-search-wrap">
          <i className="fa-solid fa-magnifying-glass pp-search-icon" />
          <input
            className="pp-search"
            type="text"
            placeholder="Search prompts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              className="pp-search-clear"
              onClick={() => setQuery('')}
              aria-label="Clear"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        {/* List */}
        <div className="pp-list">
          {filtered.length === 0 ? (
            <div className="pp-empty">
              <i className="fa-regular fa-face-frown" />
              <p>No prompts found</p>
            </div>
          ) : (
            filtered.map((prompt) => (
              <button
                key={prompt}
                className="pp-item"
                onClick={() => handleSelect(prompt)}
              >
                <span className="pp-item-text">{prompt}</span>
                <i className="fa-solid fa-chevron-right pp-item-arrow" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}