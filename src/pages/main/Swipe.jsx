// =========================================================
// MYNVORA — SWIPE
// Two modes: regular Swipe + Hookups (Diamond only).
// Hookups: 10 free swipes, then ₹99 for unlimited.
// =========================================================

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../../components/ProfileCard.jsx';
import BottomNav from '../../components/BottomNav.jsx';
import LimitReachedModal from '../../components/LimitReachedModal.jsx';
import StarUpgradeModal from '../../components/StarUpgradeModal.jsx';
import SuperLikeToast from '../../components/SuperLikeToast.jsx';
import MatchModal from '../../components/MatchModal.jsx';
import HookupUpgradeModal from '../../components/HookupUpgradeModal.jsx';
import { useSwipeLimit } from '../../features/swipe/useSwipeLimit.js';
import { useStarLimit } from '../../features/swipe/useStarLimit.js';
import { useHookupLimit } from '../../features/swipe/useHookupLimit.js';
import { useUserStore } from '../../store/userStore.js';
import api from '../../lib/api.js';

const TAP_THRESHOLD = 5;
const SWIPE_THRESHOLD = 110;
const SUPER_THRESHOLD = 140;

export default function Swipe() {
  const navigate = useNavigate();
  const { verified } = useUserStore();
  const { isOut, consume, count, limit, isUnlimited } = useSwipeLimit();
  const { sendSuperLike, isOut: starsOut } = useStarLimit();

  /* ── Hookups ──────────────────────────────────────── */
  const {
    canAccess:  canHookups,
    canSwipe:   canHookupSwipe,
    hasUnlimited: hookupUnlimited,
    used:       hookupUsed,
    limit:      hookupLimit,
    remaining:  hookupRemaining,
    consume:    consumeHookup,
  } = useHookupLimit();

  /* ── State ────────────────────────────────────────── */
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);

  const [mode, setMode] = useState('swipe'); // 'swipe' | 'hookups'

  const [drag, setDrag] = useState({
    x: 0, y: 0, active: false, startX: 0, startY: 0
  });
  const [animating, setAnimating] = useState(null);
  const [showLimit, setShowLimit] = useState(false);
  const [showStarUpgrade, setShowStarUpgrade] = useState(false);
  const [showHookupUpgrade, setShowHookupUpgrade] = useState(false);
  const [toast, setToast] = useState({ open: false, name: '' });
  const [matchProfile, setMatchProfile] = useState(null);

  const maxMoveRef = useRef(0);
  const profile = deck[idx];

  /* ── Load discover deck ───────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/profile/discover');
        if (cancelled) return;
        const users = data.users || [];
        setDeck(users.map(normalizeUser));
      } catch (err) {
        console.warn('Discover failed:', err.message);
        if (!cancelled) setDeck([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── Auto-switch off hookups if user loses Diamond ── */
  useEffect(() => {
    if (mode === 'hookups' && !canHookups) setMode('swipe');
  }, [canHookups, mode]);

  const advance = () => {
    setTimeout(() => {
      setIdx((i) => i + 1);
      setAnimating(null);
      setDrag({ x: 0, y: 0, active: false, startX: 0, startY: 0 });
      maxMoveRef.current = 0;
    }, 420);
  };

  const sendSwipeToBackend = async (targetPublicId, type) => {
    try {
      const { data } = await api.post('/match/swipe', {
        targetPublicId,
        type
      });
      if (data.matched && data.match) {
        const matchedProfile = deck[idx];
        setTimeout(() => setMatchProfile(matchedProfile), 500);
      }
    } catch (err) {
      console.warn('Swipe failed:', err.response?.data || err.message);
    }
  };

  /* ── Regular swipe ────────────────────────────────── */
  const doSwipe = (dir) => {
    if (animating) return;

    /* Hookup mode checks */
    if (mode === 'hookups') {
      if (!canHookups || !canHookupSwipe) {
        setShowHookupUpgrade(true);
        return;
      }
    } else {
      if (isOut) { setShowLimit(true); return; }
    }

    const current = deck[idx];
    setAnimating(dir);

    /* Consume the right counter */
    if (mode === 'hookups') {
      consumeHookup().catch((err) => {
        console.warn('Hookup consume failed:', err?.response?.data || err.message);
        setShowHookupUpgrade(true);
      });
    } else {
      consume();
    }

    const type = dir === 'right' ? 'like' : 'pass';
    if (current?.public_id) {
      sendSwipeToBackend(current.public_id, type);
    }

    if (dir === 'right') burstHearts();
    advance();
  };

  /* ── Super like (disabled in hookup mode) ─────────── */
  const doSuperLike = () => {
    if (animating) return;

    if (mode === 'hookups') {
      // Super likes not available in hookups
      return;
    }

    if (starsOut) { setShowStarUpgrade(true); return; }
    if (isOut) { setShowLimit(true); return; }

    const current = deck[idx];
    const sent = sendSuperLike(current?.id || current?.public_id);
    if (!sent) { setShowStarUpgrade(true); return; }

    setToast({ open: true, name: current?.name || 'them' });
    setAnimating('up');
    consume();

    if (current?.public_id) {
      sendSwipeToBackend(current.public_id, 'super_like');
    }
    advance();
  };

  const openDetail = () => {
    if (profile) navigate(`/profile/${profile.public_id || profile.id}`);
  };

  /* ── Drag handlers ────────────────────────────────── */
  const onDown = (e) => {
    const p = e.touches ? e.touches[0] : e;
    maxMoveRef.current = 0;
    setDrag({ x: 0, y: 0, active: true, startX: p.clientX, startY: p.clientY });
  };

  const onMove = (e) => {
    if (!drag.active) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - drag.startX;
    const dy = p.clientY - drag.startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxMoveRef.current) maxMoveRef.current = dist;
    setDrag((d) => ({ ...d, x: dx, y: dy }));
  };

  const onUp = () => {
    if (!drag.active) return;
    const moved = maxMoveRef.current;
    if (moved < TAP_THRESHOLD) {
      setDrag({ x: 0, y: 0, active: false, startX: 0, startY: 0 });
      maxMoveRef.current = 0;
      openDetail();
      return;
    }
    if (drag.x > SWIPE_THRESHOLD) doSwipe('right');
    else if (drag.x < -SWIPE_THRESHOLD) doSwipe('left');
    else if (drag.y < -SUPER_THRESHOLD && Math.abs(drag.x) < 80) doSuperLike();
    else setDrag({ x: 0, y: 0, active: false, startX: 0, startY: 0 });
    maxMoveRef.current = 0;
  };

  const cardStyle = animating
    ? {
        transform:
          animating === 'right'
            ? 'translateX(150%) rotate(22deg)'
            : animating === 'left'
            ? 'translateX(-150%) rotate(-22deg)'
            : 'translateY(-150%) scale(0.9)',
        opacity: 0,
        transition: 'transform 0.42s cubic-bezier(0.22,1,0.36,1), opacity 0.42s'
      }
    : {
        transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 22}deg)`,
        transition: drag.active ? 'none' : 'transform 0.3s cubic-bezier(0.22,1,0.36,1)'
      };

  /* ── Counter shown in top bar ─────────────────────── */
  const counterText = (() => {
    if (mode === 'hookups') {
      if (!canHookups) return null;
      if (hookupUnlimited) return '∞';
      return `${hookupUsed}/${hookupLimit}`;
    }
    if (isUnlimited) return null;
    return `${count}/${limit}`;
  })();

  return (
    <div className="swipe-screen">
      <div className="swipe-top">
        <div className="st-logo"><i className="fa-solid fa-fire" /> MYNVORA</div>
               <div className="st-icons">
          {counterText && <span className="st-counter">{counterText}</span>}
        </div>
      </div>

      {/* ── Mode toggle (only if Diamond) ─────────────── */}
      {canHookups && (
        <div className="swipe-mode-toggle">
          <button
            type="button"
            className={`smt-btn ${mode === 'swipe' ? 'active' : ''}`}
            onClick={() => setMode('swipe')}
          >
            <i className="fa-solid fa-heart" /> Swipe
          </button>
          <button
            type="button"
            className={`smt-btn ${mode === 'hookups' ? 'active' : ''}`}
            onClick={() => setMode('hookups')}
          >
            <i className="fa-solid fa-fire" /> Hookups
            {!hookupUnlimited && hookupRemaining > 0 && (
              <span className="smt-badge">{hookupRemaining}</span>
            )}
          </button>
        </div>
      )}

      <div className="swipe-stage">
        <div className="card-hint h2" />
        <div className="card-hint h1" />

        {loading && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', color: '#9e9eb3', fontSize: 14
          }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 10 }} />
            Loading profiles…
          </div>
        )}

        {!loading && !profile && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', color: '#9e9eb3',
            textAlign: 'center', padding: 20
          }}>
            <i className="fa-solid fa-face-smile" style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: '#63637a', marginBottom: 4 }}>
              You've seen everyone
            </div>
            <div style={{ fontSize: 13 }}>Check back later for new profiles</div>
          </div>
        )}

        {!loading && profile && (
          <ProfileCard
            profile={profile}
            style={cardStyle}
            drag={drag}
            onMouseDown={onDown}
            onMouseMove={onMove}
            onMouseUp={onUp}
            onMouseLeave={onUp}
            onTouchStart={onDown}
            onTouchMove={onMove}
            onTouchEnd={onUp}
          />
        )}
      </div>

      <div className="swipe-actions">
        <button
          className="sa-btn sa-rewind"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
        >
          <i className="fa-solid fa-rotate-left" />
        </button>
        <button className="sa-btn sa-nope" onClick={() => doSwipe('left')}>
          <i className="fa-solid fa-xmark" />
        </button>
        <button
          className="sa-btn sa-super"
          onClick={doSuperLike}
          disabled={mode === 'hookups'}
          style={mode === 'hookups' ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
        >
          <i className="fa-solid fa-star" />
        </button>
        <button className="sa-btn sa-like" onClick={() => doSwipe('right')}>
          <i className="fa-solid fa-heart" />
        </button>
      </div>

      <BottomNav />

      <LimitReachedModal
        open={showLimit}
        onClose={() => setShowLimit(false)}
        verified={verified}
      />
      <StarUpgradeModal
        open={showStarUpgrade}
        onClose={() => setShowStarUpgrade(false)}
      />
      <HookupUpgradeModal
        open={showHookupUpgrade}
        onClose={() => setShowHookupUpgrade(false)}
      />
      <SuperLikeToast
        open={toast.open}
        name={toast.name}
        onClose={() => setToast({ open: false, name: '' })}
      />
      <MatchModal
        open={!!matchProfile}
        profile={matchProfile}
        onClose={() => setMatchProfile(null)}
      />
    </div>
  );
}

/* ── Normalize backend user → ProfileCard shape ──────── */
function normalizeUser(u) {
  const photos = u.main_photo ? [u.main_photo] : [];
  return {
    id: u.id,
    public_id: u.public_id,
    name: u.first_name || 'Someone',
    age: u.age,
    verified: u.verified,
    online: false,
    distance: u.city ? `Near ${u.city}` : 'Nearby',
    job: u.job || '',
    city: u.city || '',
    country: u.country || '',
    bio: u.bio || '',
    photos,
    interests: [],
    prompt: null,
    hasPhoto: photos.length > 0,
  };
}

function burstHearts() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2 + 100;
  for (let i = 0; i < 16; i++) {
    const h = document.createElement('div');
    h.className = 'burst';
    h.textContent = '❤';
    const angle = (Math.PI * 2 * i) / 16;
    const dist = 110 + Math.random() * 90;
    h.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    h.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
    h.style.left = `${cx}px`;
    h.style.top = `${cy}px`;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1000);
  }
}