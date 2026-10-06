// =========================================================
// MYNVORA — EDIT INTENTIONS
// Looking for (multi) + Relationship type (single).
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore.js';
import {
  LOOKING_FOR,
  RELATIONSHIP_TYPE
} from '../../data/profileOptions.js';

export default function EditIntentions() {
  const navigate = useNavigate();
  const profile = useProfileStore();

  const [lookingFor, setLookingFor] = useState(profile.lookingFor || []);
  const [relationshipType, setRelationshipType] = useState(
    profile.relationshipType || null
  );

  const toggleLooking = (id) => {
    setLookingFor((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const save = () => {
    profile.updateFields({
      lookingFor,
      relationshipType
    });
    navigate(-1);
  };

  return (
    <div className="settings-screen">
      {/* Header */}
      <div className="settings-page-head">
        <button className="back-btn-inline" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Looking For</h1>
        <div style={{ width: 44 }} />
      </div>

      {/* Looking for */}
      <div className="settings-section">
        <div className="settings-section-title">
          What are you looking for?
        </div>
        <p className="settings-section-desc">
          Pick as many as you like. This helps us match you with people who
          want the same thing.
        </p>

        <div className="intentions-grid">
          {LOOKING_FOR.map((item) => {
            const active = lookingFor.includes(item.id);
            return (
              <button
                key={item.id}
                className={`intention-card ${active ? 'active' : ''}`}
                onClick={() => toggleLooking(item.id)}
              >
                <span className="intention-icon">{item.icon}</span>
                <span className="intention-label">{item.label}</span>
                {active && (
                  <i className="fa-solid fa-circle-check intention-check" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Relationship type */}
      <div className="settings-section">
        <div className="settings-section-title">
          Relationship type
        </div>
        <p className="settings-section-desc">
          Choose what kind of relationship you're open to.
        </p>

        <div className="relationship-list">
          {RELATIONSHIP_TYPE.map((r) => {
            const active = relationshipType === r.id;
            return (
              <button
                key={r.id}
                className={`relationship-item ${active ? 'active' : ''}`}
                onClick={() => setRelationshipType(r.id)}
              >
                <span className="relationship-icon">{r.icon}</span>
                <span className="relationship-label">{r.label}</span>
                <span className="relationship-radio">
                  {active && <span className="relationship-radio-dot" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Save bar */}
      <div className="settings-save-bar">
        <button
          className="btn-main"
          onClick={save}
          disabled={lookingFor.length === 0}
        >
          Save preferences <span>→</span>
        </button>
      </div>
    </div>
  );
}