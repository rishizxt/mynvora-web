// =========================================================
// MYNVORA — CHAT LIST (real matches from backend)
// =========================================================

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav.jsx';
import NewMatches from '../../components/NewMatches.jsx';
import AdminChatRow from '../../components/AdminChatRow.jsx';
import api from '../../lib/api.js';

function timeAgo(ms) {
  if (!ms) return '';
  const diff = Date.now() - new Date(ms).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

export default function Chat() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/match/list');
        if (cancelled) return;
        setMatches(data.matches || []);
      } catch (err) {
        console.warn('Failed to load matches:', err.message);
        if (!cancelled) setMatches([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = matches;
    if (q) {
      list = list.filter((m) =>
        (m.first_name || '').toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      const at = a.last_message_at || a.matched_at;
      const bt = b.last_message_at || b.matched_at;
      return new Date(bt).getTime() - new Date(at).getTime();
    });
  }, [matches, query]);

  const openProfile = (publicId) => navigate(`/profile/${publicId}`);
  const openConversation = (matchId) => navigate(`/chat/${matchId}`);

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <h1 className="chat-title">Chat</h1>
      </div>

      <div className="chat-search">
        <i className="fa-solid fa-magnifying-glass chat-search-icon" />
        <input
          className="chat-search-input"
          type="text"
          placeholder={`Search ${matches.length} match${matches.length === 1 ? '' : 'es'}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            className="chat-search-clear"
            onClick={() => setQuery('')}
            aria-label="Clear"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>

      {!query && <NewMatches />}

      <div className="chat-section-label">Messages</div>

      <div className="convo-list">
        {!query && <AdminChatRow />}

        {loading && (
          <div className="chat-empty">
            <i className="fa-solid fa-spinner fa-spin" />
            <p>Loading matches…</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="chat-empty">
            <i className="fa-regular fa-face-smile" />
            <p>
              {query
                ? `No one named "${query}"`
                : 'No matches yet — start swiping!'}
            </p>
            {!query && <span>Matches appear here when you both like each other</span>}
          </div>
        )}

        {!loading &&
          filtered.map((m) => (
            <div
              className="convo"
              key={m.match_id}
              onClick={() => openConversation(m.match_id)}
            >
              <div
                className="convo-avatar-wrap"
                onClick={(e) => {
                  e.stopPropagation();
                  openProfile(m.public_id);
                }}
              >
                {m.main_photo ? (
                  <img
                    className="convo-avatar"
                    src={m.main_photo}
                    alt={m.first_name}
                  />
                ) : (
                  <div
                    className="convo-avatar"
                    style={{
                      background: 'linear-gradient(135deg, #ff3b81, #8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: 20
                    }}
                  >
                    {(m.first_name || '?').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="convo-body">
                <div className="convo-top">
                  <div className="convo-name">
                    {m.first_name || 'Someone'}
                    {m.verified && (
                      <i
                        className="fa-solid fa-circle-check"
                        style={{
                          color: '#4f8cff',
                          fontSize: 12,
                          marginLeft: 5
                        }}
                      />
                    )}
                  </div>
                  <div className="convo-time">
                    {timeAgo(m.last_message_at || m.matched_at)}
                  </div>
                </div>
                <div className="convo-bottom">
                  <div className="convo-last">
                    {m.last_message || 'Say hi 👋'}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <BottomNav />
    </div>
  );
}