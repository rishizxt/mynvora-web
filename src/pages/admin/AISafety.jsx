// =========================================================
// MYNVORA ADMIN — AI SAFETY
// Fake profiles · AI-generated photos · deepfakes ·
// impersonation · bots · scams.
// =========================================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS, MOCK_FLAGS } from '../../data/adminMockData.js';

// ---- helpers ----
const RISK_COLORS = {
  low: '#35d07f',
  review: '#ffb020',
  high: '#ffb020',
  critical: '#ff4d67'
};

const RISK_LABELS = {
  low: 'Low',
  review: 'Review',
  high: 'High Risk',
  critical: 'Critical'
};

const CATEGORIES = [
  { id: 'all', label: 'All detections' },
  { id: 'fake_profile', label: 'Fake profiles' },
  { id: 'ai_generated', label: 'AI-generated' },
  { id: 'deepfake', label: 'Deepfakes' },
  { id: 'impersonation', label: 'Impersonation' },
  { id: 'celebrity', label: 'Celebrity' },
  { id: 'scam', label: 'Bots & scams' },
  { id: 'suspicious_activity', label: 'Suspicious activity' }
];

// ---- mock AI detections (build from existing users) ----
const AI_DETECTIONS = [
  {
    id: 'DET-8801',
    category: 'deepfake',
    risk: 'critical',
    confidence: 0.96,
    userId: 'u_9911',
    userName: 'Unknown',
    userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    summary: 'Face-swap artifacts detected',
    detectedAt: Date.now() - 90 * 60 * 1000,
    autoBlocked: true,
    details: 'Multiple frames show inconsistent facial geometry.'
  },
  {
    id: 'DET-8800',
    category: 'impersonation',
    risk: 'critical',
    confidence: 0.94,
    userId: 'u_8821',
    userName: 'Emma Roy',
    userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80',
    summary: 'Photos match celebrity image dataset',
    detectedAt: Date.now() - 4 * 60 * 60 * 1000,
    autoBlocked: true,
    details: 'Photos match public figures in our reference set.'
  },
  {
    id: 'DET-8799',
    category: 'ai_generated',
    risk: 'high',
    confidence: 0.78,
    userId: 'u_4422',
    userName: 'Sofia Reyes',
    userPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80',
    summary: 'AI-generation patterns detected in profile photo',
    detectedAt: Date.now() - 2 * 60 * 60 * 1000,
    autoBlocked: false,
    details: 'Spectral analysis shows synthetic generation markers.'
  },
  {
    id: 'DET-8798',
    category: 'scam',
    risk: 'critical',
    confidence: 0.91,
    userId: 'u_2211',
    userName: 'Rushi Singh',
    userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    summary: 'Bot-like message timing + suspicious links',
    detectedAt: Date.now() - 30 * 60 * 1000,
    autoBlocked: false,
    details: '27 identical messages sent within 40 seconds.'
  },
  {
    id: 'DET-8797',
    category: 'fake_profile',
    risk: 'high',
    confidence: 0.82,
    userId: 'u_9911',
    userName: 'Unknown',
    userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    summary: 'Reused photos across multiple accounts',
    detectedAt: Date.now() - 8 * 60 * 60 * 1000,
    autoBlocked: false,
    details: 'Same photo found on 3 different active accounts.'
  },
  {
    id: 'DET-8796',
    category: 'suspicious_activity',
    risk: 'review',
    confidence: 0.61,
    userId: 'u_1133',
    userName: 'Aisha Khan',
    userPhoto: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=80',
    summary: 'Login from new country + rapid swipes',
    detectedAt: Date.now() - 12 * 60 * 60 * 1000,
    autoBlocked: false,
    details: 'Login from unrecognized IP, followed by 200 swipes in 5 minutes.'
  }
];

// ---- stats computed from detections ----
function computeStats(detections) {
  return {
    total: detections.length,
    critical: detections.filter((d) => d.risk === 'critical').length,
    high: detections.filter((d) => d.risk === 'high').length,
    review: detections.filter((d) => d.risk === 'review').length,
    autoBlocked: detections.filter((d) => d.autoBlocked).length
  };
}

export default function AISafety() {
  const navigate = useNavigate();

  const [category, setCategory] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [query, setQuery] = useState('');

  // ---- filter ----
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AI_DETECTIONS.filter((d) => {
      if (category !== 'all' && d.category !== category) return false;
      if (riskFilter !== 'all' && d.risk !== riskFilter) return false;
      if (q) {
        const match =
          d.id.toLowerCase().includes(q) ||
          d.userName.toLowerCase().includes(q) ||
          d.summary.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => b.detectedAt - a.detectedAt);
  }, [category, riskFilter, query]);

  const stats = computeStats(AI_DETECTIONS);

  return (
    <div className="admin-page">
      {/* Stat cards */}
      <div className="admin-stat-grid four">
        <div className="admin-stat-card static">
          <div className="admin-stat-head">
            <div
              className="admin-stat-icon"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#b7b7c7' }}
            >
              <i className="fa-solid fa-robot" />
            </div>
          </div>
          <div className="admin-stat-value">{stats.total}</div>
          <div className="admin-stat-label">Total detections</div>
        </div>

        <div className="admin-stat-card static">
          <div className="admin-stat-head">
            <div
              className="admin-stat-icon"
              style={{ background: 'rgba(255,77,103,0.15)', color: '#ff4d67' }}
            >
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
          </div>
          <div className="admin-stat-value">{stats.critical}</div>
          <div className="admin-stat-label">Critical</div>
        </div>

        <div className="admin-stat-card static">
          <div className="admin-stat-head">
            <div
              className="admin-stat-icon"
              style={{ background: 'rgba(255,176,32,0.15)', color: '#ffb020' }}
            >
              <i className="fa-solid fa-circle-exclamation" />
            </div>
          </div>
          <div className="admin-stat-value">{stats.high}</div>
          <div className="admin-stat-label">High risk</div>
        </div>

        <div className="admin-stat-card static">
          <div className="admin-stat-head">
            <div
              className="admin-stat-icon"
              style={{ background: 'rgba(53,208,127,0.15)', color: '#35d07f' }}
            >
              <i className="fa-solid fa-shield-halved" />
            </div>
          </div>
          <div className="admin-stat-value">{stats.autoBlocked}</div>
          <div className="admin-stat-label">Auto-blocked</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Search detection ID, user, summary..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="admin-search-clear"
              onClick={() => setQuery('')}
              aria-label="Clear"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        <div className="admin-filter-row">
          <select
            className="admin-select"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="all">All risk</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="review">🟡 Review</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
      </div>

      {/* Category chips */}
      <div className="admin-filter-chips">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`admin-chip ${category === c.id ? 'active' : ''}`}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="admin-list-count">
        {filtered.length} detection{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Detections list */}
      <div className="admin-detection-list">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-regular fa-face-smile" />
            <p>No detections match your filters</p>
          </div>
        ) : (
          filtered.map((d) => (
            <div
              key={d.id}
              className="admin-detection-card"
              onClick={() => {
                // Could route to a detail page in the future
              }}
            >
              <div
                className="admin-detection-bar"
                style={{ background: RISK_COLORS[d.risk] }}
              />

              <img
                className="admin-detection-photo"
                src={d.userPhoto}
                alt={d.userName}
              />

              <div className="admin-detection-body">
                <div className="admin-detection-top">
                  <span className="admin-report-id">{d.id}</span>
                  <span className={`admin-risk ${d.risk}`}>
                    {RISK_LABELS[d.risk] || d.risk}
                  </span>
                  <span className="admin-detection-category">
                    {d.category.replace('_', ' ')}
                  </span>
                  {d.autoBlocked && (
                    <span className="admin-detection-blocked">
                      <i className="fa-solid fa-shield-halved" /> Auto-blocked
                    </span>
                  )}
                </div>

                <div className="admin-detection-title">{d.summary}</div>

                <div className="admin-detection-meta">
                  <span>
                    <i className="fa-solid fa-user" /> {d.userName} ·{' '}
                    {d.userId}
                  </span>
                  <span>
                    <i className="fa-solid fa-brain" />{' '}
                    {Math.round(d.confidence * 100)}% confidence
                  </span>
                </div>

                <div className="admin-detection-details">{d.details}</div>
              </div>

              <div className="admin-detection-actions">
                <button
                  className="admin-btn-ghost small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/users/${d.userId}`);
                  }}
                >
                  View user
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}