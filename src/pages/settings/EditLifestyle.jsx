// =========================================================
// MYNVORA — EDIT LIFESTYLE
// Love style + Communication style
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore.js';
import { LOVE_STYLE, COMM_STYLE } from '../../data/profileOptions.js';

export default function EditLifestyle() {
  const navigate = useNavigate();
  const profile = useProfileStore();

  const [loveStyle, setLoveStyle] = useState(profile.loveStyle || null);
  const [commStyle, setCommStyle] = useState(profile.commStyle || null);

  const save = () => {
    profile.updateFields({ loveStyle, commStyle });
    navigate(-1);
  };

  return (
    <div className="settings-screen">
      {/* Header */}
      <div className="settings-page-head">
        <button className="back-btn-inline" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Love & Communication</h1>
        <div style={{ width: 44 }} />
      </div>

      {/* Love style */}
      <div className="settings-section">
        <div className="settings-section-title">
          How I show love
        </div>
        <p className="settings-section-desc">
          Pick the way you most naturally express affection.
        </p>

        <div className="lifestyle-grid">
          {LOVE_STYLE.map((l) => {
            const active = loveStyle === l.id;
            return (
              <button
                key={l.id}
                className={`lifestyle-card ${active ? 'active' : ''}`}
                onClick={() => setLoveStyle(l.id)}
              >
                <span className="lifestyle-icon">{l.icon}</span>
                <span className="lifestyle-label">{l.label}</span>
                {active && (
                  <i className="fa-solid fa-circle-check lifestyle-check" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Communication style */}
      <div className="settings-section">
        <div className="settings-section-title">
          Communication style
        </div>
        <p className="settings-section-desc">
          This helps people know what to expect from you.
        </p>

        <div className="lifestyle-grid">
          {COMM_STYLE.map((c) => {
            const active = commStyle === c.id;
            return (
              <button
                key={c.id}
                className={`lifestyle-card ${active ? 'active' : ''}`}
                onClick={() => setCommStyle(c.id)}
              >
                <span className="lifestyle-icon">{c.icon}</span>
                <span className="lifestyle-label">{c.label}</span>
                {active && (
                  <i className="fa-solid fa-circle-check lifestyle-check" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save bar */}
      <div className="settings-save-bar">
        <button className="btn-main" onClick={save}>
          Save changes <span>→</span>
        </button>
      </div>
    </div>
  );
}