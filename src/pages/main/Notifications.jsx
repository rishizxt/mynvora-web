// =========================================================
// MYNVORA — NOTIFICATIONS
// Real-time feed: matches, likes, messages.
// =========================================================
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav.jsx';
import api from '../../lib/api.js';

const TYPE_META = {
  match:      { icon: 'fa-heart',         color: '#ff3b81' },
  like:       { icon: 'fa-heart',         color: '#ff6b9d' },
  super_like: { icon: 'fa-star',          color: '#ffb020' },
  message:    { icon: 'fa-comment',       color: '#4f8cff' },
  system:     { icon: 'fa-bullhorn',      color: '#8b5cf6' },
};

function timeAgo(ms) {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function Notifications() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('all');

  /* ── fetch ──────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/notifications');
        if (cancelled) return;
        setList(data.notifications || []);

        // Mark all as read after a short delay (so user sees the highlight)
        setTimeout(() => {
          api.post('/notifications/mark-read').catch(() => {});
        }, 1500);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.error || err.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── filter ─────────────────────────────────────────── */
  const filtered = list.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'matches') return n.type === 'match';
    if (filter === 'likes') return n.type === 'like' || n.type === 'super_like';
    if (filter === 'messages') return n.type === 'message';
    return true;
  });

  const unreadCount = list.filter((n) => !n.read).length;

  const handleOpen = (n) => {
    if (n.path) navigate(n.path);
  };

  return (
    <div className="notifications-screen" style={{ minHeight: '100vh', paddingBottom: 80, background: '#fafafc' }}>
      {/* ── Header ─────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: '#fff', borderBottom: '1px solid #ebebf0',
        padding: '14px 20px 12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 36, height: 36, borderRadius: 999,
              background: '#f4f4f8', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#1a1a2e', fontSize: 14,
            }}
            aria-label="Back"
          >
            <i className="fa-solid fa-arrow-left" />
          </button>

          <h1 style={{
            fontSize: 20, fontWeight: 800, color: '#1a1a2e',
            margin: 0, letterSpacing: -0.4, flex: 1,
          }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{
                marginLeft: 8,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                minWidth: 22, height: 22, padding: '0 7px',
                background: '#ff3b81', color: '#fff',
                borderRadius: 999, fontSize: 12, fontWeight: 800,
              }}>
                {unreadCount}
              </span>
            )}
          </h1>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto' }}>
          {[
            { id: 'all',      label: 'All' },
            { id: 'unread',   label: 'Unread', count: unreadCount },
            { id: 'matches',  label: 'Matches' },
            { id: 'likes',    label: 'Likes' },
            { id: 'messages', label: 'Messages' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '7px 14px', borderRadius: 999,
                fontSize: 12.5, fontWeight: 700,
                whiteSpace: 'nowrap',
                border: filter === f.id ? '1.5px solid #ff3b81' : '1.5px solid #ebebf0',
                background: filter === f.id ? '#ffe8ef' : '#fff',
                color: filter === f.id ? '#ff3b81' : '#63637a',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {f.label}
              {f.count > 0 && (
                <span style={{
                  marginLeft: 6,
                  display: 'inline-block', minWidth: 18, height: 18, lineHeight: '18px',
                  padding: '0 5px', borderRadius: 999,
                  background: filter === f.id ? '#ff3b81' : '#e0e0e8',
                  color: filter === f.id ? '#fff' : '#63637a',
                  fontSize: 10.5, fontWeight: 800, textAlign: 'center',
                }}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading / error / empty ────────────────── */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 60, color: '#9e9eb3' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 22 }} />
          <p style={{ marginTop: 12 }}>Loading…</p>
        </div>
      )}

      {error && (
        <div style={{ padding: 40, textAlign: 'center', color: '#9e9eb3' }}>
          <i className="fa-solid fa-circle-exclamation" style={{ fontSize: 28, marginBottom: 10 }} />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', color: '#9e9eb3' }}>
          <i className="fa-regular fa-bell" style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: '#63637a' }}>No notifications</p>
          <span style={{ fontSize: 13 }}>
            {filter === 'all' ? 'Likes and matches will show up here' : 'Nothing in this filter'}
          </span>
        </div>
      )}

      {/* ── List ───────────────────────────────────── */}
      {!loading && filtered.length > 0 && (
        <div style={{ padding: '12px 0' }}>
          {filtered.map((n) => {
            const meta = TYPE_META[n.type] || TYPE_META.system;
            return (
              <button
                key={n.id}
                onClick={() => handleOpen(n)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  width: '100%', padding: '14px 20px',
                  background: n.read ? '#fff' : '#fff7fa',
                  border: 'none',
                  borderBottom: '1px solid #f4f4f8',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s ease',
                }}
              >
                {/* Avatar / icon */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  {n.photo ? (
                    <img
                      src={n.photo}
                      alt=""
                      style={{
                        width: 52, height: 52, borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 8px rgba(26,26,46,0.08)',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${meta.color}, #8b5cf6)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 20,
                    }}>
                      <i className={`fa-solid ${meta.icon}`} />
                    </div>
                  )}

                  {/* Small type badge */}
                  <span style={{
                    position: 'absolute', bottom: -2, right: -2,
                    width: 22, height: 22, borderRadius: '50%',
                    background: meta.color,
                    border: '2px solid #fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 10,
                  }}>
                    <i className={`fa-solid ${meta.icon}`} />
                  </span>
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: n.read ? 600 : 800,
                    color: '#1a1a2e', marginBottom: 3,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {n.title}
                  </div>
                  <div style={{
                    fontSize: 12.5, color: '#777789',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {n.subtitle}
                  </div>
                </div>

                {/* Time */}
                <div style={{ flexShrink: 0, fontSize: 11.5, color: '#9e9eb3', fontWeight: 500 }}>
                  {timeAgo(n.at)}
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <div style={{
                    position: 'absolute', right: 8, top: '50%',
                    transform: 'translateY(-50%)',
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#ff3b81',
                  }} />
                )}
              </button>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
}