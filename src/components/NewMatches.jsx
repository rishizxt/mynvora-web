// =========================================================
// MYNVORA — NEW MATCHES
// Horizontal scroll of recent matches (with no messages yet).
// =========================================================

import { useNavigate } from 'react-router-dom';
import { PROFILES } from '../data/profiles.js';

export default function NewMatches() {
  const navigate = useNavigate();

  // Mock — first 6 profiles as new matches
  const matches = PROFILES.slice(0, 6);

  if (matches.length === 0) return null;

  return (
    <div className="nm-section">
      <div className="nm-head">
        <h3 className="nm-title">New Matches</h3>
        <button
          className="nm-see-all"
          onClick={() => navigate('/likes')}
        >
          See all
        </button>
      </div>

      <div className="nm-scroll">
        {matches.map((m) => (
          <button
            key={m.id}
            className="nm-item"
            onClick={() => navigate(`/chat/${m.id}`)}
          >
            <div className="nm-avatar-wrap">
              <img className="nm-avatar" src={m.photos[0]} alt={m.name} />
              {m.online && <span className="nm-online" />}
            </div>
            <div className="nm-name">{m.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}