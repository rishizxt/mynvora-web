// =========================================================
// MYNVORA — LIKES (who liked you — Light tier required)
// =========================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav.jsx';
import { useUserStore } from '../../store/userStore.js';
import { ROUTES } from '../../navigation/routes.js';
import api from '../../lib/api.js';

export default function Likes() {
  const navigate = useNavigate();
  const { tier, verified } = useUserStore();

  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('recent');

  // Light, Gold, Diamond unlock "who liked you"
  const canSeeLikes =
    tier === 'light' || tier === 'gold' || tier === 'diamond';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/match/likes');
        if (cancelled) return;
        setLikes(data.likes || []);
      } catch (err) {
        console.warn('Failed to load likes:', err.message);
        if (!cancelled) setError('Could not load likes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleOpenProfile = (publicId) => {
    if (!canSeeLikes) {
      navigate(ROUTES.SUBSCRIPTION);
      return;
    }
    navigate(`/profile/${publicId}`);
  };

  return (
    <div className="likes-screen">
      <div className="page-head">
        <h1>
          Likes{' '}
          {likes.length > 0 && (
            <span style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#ff3b81',
              marginLeft: 6,
            }}>
              {likes.length}
            </span>
          )}
        </h1>
        <p>
          {canSeeLikes
            ? `${likes.length} ${likes.length === 1 ? 'person' : 'people'} liked you`
            : 'Someone liked you — unlock to see who'}
        </p>
      </div>

      {/* Filter chips */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '0 20px 16px',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'recent', label: 'Most recent' },
          { id: 'your-type', label: 'Your type' },
          { id: 'distance', label: 'Distance' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              border:
                filter === f.id
                  ? '1.5px solid #ff3b81'
                  : '1.5px solid #ebebf0',
              background: filter === f.id ? '#ffe8ef' : '#fff',
              color: filter === f.id ? '#ff3b81' : '#63637a',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 60, color: '#9e9eb3' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 24 }} />
          <p style={{ marginTop: 12 }}>Loading…</p>
        </div>
      )}

      {error && (
        <div className="empty">
          <i className="fa-solid fa-circle-exclamation" />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && likes.length === 0 && (
        <div className="empty">
          <div className="empty-icon">
            <i className="fa-solid fa-heart" />
          </div>
          <p>No likes yet</p>
          <span>Swipe more to get noticed</span>
        </div>
      )}

      {!loading && likes.length > 0 && (
        <div className="likes-grid">
          {likes.map((like) => (
            <div
              className="like-card"
              key={like.swipe_id || like.user_id}
              onClick={() => handleOpenProfile(like.public_id)}
              style={{ cursor: 'pointer' }}
            >
              <div
                className="like-img"
                style={{
                  backgroundImage: `url(${like.main_photo || ''})`,
                  filter: canSeeLikes ? 'none' : 'blur(20px)',
                  transition: 'filter 0.3s',
                }}
              >
                {like.verified && canSeeLikes && (
                  <span
                    className="online-dot"
                    style={{ background: '#4f8cff' }}
                  />
                )}

                {/* Locked overlay */}
                {!canSeeLikes && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.25)',
                      color: '#fff',
                      zIndex: 3,
                    }}
                  >
                    <i
                      className="fa-solid fa-lock"
                      style={{ fontSize: 28, marginBottom: 8 }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 700 }}>
                      Unlock to see
                    </span>
                  </div>
                )}

                {/* Info overlay */}
                <div className="like-overlay">
                  {canSeeLikes ? (
                    <>
                      <div className="like-name">
                        {like.first_name || 'Someone'}
                        {like.age ? `, ${like.age}` : ''}
                      </div>
                      <div className="like-note">
                        {like.city || 'Nearby'}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="like-name">Someone liked you</div>
                      <div className="like-note">Subscribe to reveal</div>
                    </>
                  )}
                </div>
              </div>

              {/* Quick actions (only when unlocked) */}
              {canSeeLikes && (
                <div className="like-actions">
                  <button
                    className="mini-btn mini-nope"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Skip action — TODO: send pass via API
                      setLikes(likes.filter((l) => l.swipe_id !== like.swipe_id));
                    }}
                    aria-label="Pass"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                  <button
                    className="mini-btn mini-like"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${like.public_id}`);
                    }}
                    aria-label="Like back"
                  >
                    <i className="fa-solid fa-heart" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Paywall card */}
      {!canSeeLikes && likes.length > 0 && (
        <div
          onClick={() => navigate(ROUTES.SUBSCRIPTION)}
          style={{
            margin: '20px',
            padding: 20,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #ff3b81, #8b5cf6)',
            color: '#fff',
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: '0 12px 32px rgba(255,59,129,0.35)',
          }}
        >
          <i
            className="fa-solid fa-crown"
            style={{ fontSize: 28, marginBottom: 8 }}
          />
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: '6px 0' }}>
            See who liked you
          </h3>
          <p style={{ fontSize: 13, opacity: 0.92, marginBottom: 14 }}>
            Upgrade to Light — ₹99/week
          </p>
          <div
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              background: '#fff',
              color: '#ff3b81',
              borderRadius: 999,
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            Unlock now →
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}