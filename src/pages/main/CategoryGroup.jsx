// =========================================================
// MYNVORA — CATEGORY GROUP
// Real backend discovery. Special handling for Hookups.
// Real filters from filtersStore are sent on every fetch.
// =========================================================

import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileCard from '../../components/ProfileCard.jsx';
import BottomNav from '../../components/BottomNav.jsx';
import LimitReachedModal from '../../components/LimitReachedModal.jsx';
import HookupUpgradeModal from '../../components/HookupUpgradeModal.jsx';
import MatchModal from '../../components/MatchModal.jsx';
import { getCategoryById } from '../../data/categories.js';
import { useSwipeLimit } from '../../features/swipe/useSwipeLimit.js';
import { useHookupLimit } from '../../features/swipe/useHookupLimit.js';
import { useUserStore } from '../../store/userStore.js';
import { useFiltersStore } from '../../store/filtersStore.js';
import api from '../../lib/api.js';

const TAP_THRESHOLD = 5;
const SWIPE_THRESHOLD = 110;
const SUPER_THRESHOLD = 140;

export default function CategoryGroup() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = getCategoryById(categoryId);
  const isHookups = categoryId === 'hookups';

  const { verified } = useUserStore();
  const { isOut: swipeOut, consume: consumeSwipe, count, limit, isUnlimited } = useSwipeLimit();

  /* Hookups hook — real backend */
  const {
    canAccess:  canHookups,
    canSwipe:   canHookupSwipe,
    hasUnlimited: hookupUnlimited,
    used:       hookupUsed,
    limit:      hookupLimit,
    consume:    consumeHookup,
  } = useHookupLimit();

  /* ── Filters (real, from filtersStore) ────────────── */
  const ageMin       = useFiltersStore((s) => s.ageMin);
  const ageMax       = useFiltersStore((s) => s.ageMax);
  const maxDistance  = useFiltersStore((s) => s.maxDistance);
  const verifiedOnly = useFiltersStore((s) => s.verifiedOnly);
  const gender       = useFiltersStore((s) => s.gender);

  const filterQuery = useMemo(() => {
    const p = new URLSearchParams();
    p.set('minAge', String(ageMin));
    p.set('maxAge', String(ageMax));
    p.set('maxDistance', String(maxDistance));
    p.set('verified', String(verifiedOnly));
    if (gender && gender !== 'all') p.set('gender', gender);
    return p.toString();
  }, [ageMin, ageMax, maxDistance, verifiedOnly, gender]);

  /* ── Deck from backend ───────────────────────────── */
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);

  const [drag, setDrag] = useState({
    x: 0, y: 0, active: false, startX: 0, startY: 0,
  });
  const [animating, setAnimating] = useState(null);
  const [showLimit, setShowLimit] = useState(false);
  const [showHookupUpgrade, setShowHookupUpgrade] = useState(false);
  const [matchProfile, setMatchProfile] = useState(null);

  const maxMoveRef = useRef(0);
  const profile = deck[idx];

  /* ── Fetch deck (refetches on category/filter change) ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const url = isHookups
          ? `/profile/discover?mode=hookups&${filterQuery}`
          : `/profile/discover?category=${categoryId}&${filterQuery}`;

        const { data } = await api.get(url);
        if (cancelled) return;
        const users = data.users || [];
        setDeck(users.map(normalizeUser));
        setIdx(0);
      } catch (err) {
        console.warn('Discover failed:', err.message);
        if (!cancelled) setDeck([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [categoryId, isHookups, filterQuery]);

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
        type,
      });
      if (data.matched && data.match) {
        const matched = deck[idx];
        setTimeout(() => setMatchProfile(matched), 500);
      }
    } catch (err) {
      console.warn('Swipe failed:', err.response?.data || err.message);
    }
  };

  const doSwipe = (dir) => {
    if (animating) return;

    /* ── Hookups path ── */
    if (isHookups) {
      if (!canHookups) {
        navigate('/subscription');
        return;
      }
      if (!canHookupSwipe) {
        setShowHookupUpgrade(true);
        return;
      }

      setAnimating(dir);
      consumeHookup().catch((err) => {
        console.warn('Hookup consume failed:', err?.response?.data || err.message);
        setShowHookupUpgrade(true);
      });

      const current = deck[idx];
      const type = dir === 'right' ? 'like' : 'pass';
      if (current?.public_id) sendSwipeToBackend(current.public_id, type);

      if (dir === 'right') burstHearts();
      advance();
      return;
    }

    /* ── Regular swipe path ── */
    if (swipeOut) { setShowLimit(true); return; }

    setAnimating(dir);
    consumeSwipe();

    const current = deck[idx];
    const type = dir === 'right' ? 'like' : dir === 'up' ? 'super_like' : 'pass';
    if (current?.public_id) sendSwipeToBackend(current.public_id, type);

    if (dir === 'right') burstHearts();
    advance();
  };

  const openDetail = () => {
    if (profile) navigate(`/profile/${profile.public_id || profile.id}`);
  };

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
    else if (drag.y < -SUPER_THRESHOLD && Math.abs(drag.x) < 80) doSwipe('up');
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
        transition: 'transform 0.42s cubic-bezier(0.22,1,0.36,1), opacity 0.42s',
      }
    : {
        transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 22}deg)`,
        transition: drag.active ? 'none' : 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
      };

  /* ── Counter in top bar ──────────────────────────── */
  const counterLabel = (() => {
    if (isHookups) {
      if (!canHookups) return null;
      if (hookupUnlimited) return '∞';
      return `${hookupUsed}/${hookupLimit}`;
    }
    if (isUnlimited) return '∞';
    return `${count}/${limit}`;
  })();

  /* ── Loading state ───────────────────────────────── */
  if (loading) {
    return (
      <div className="swipe-screen">
        <div className="swipe-top">
          <button className="back-btn-inline" onClick={() => navigate('/explore')}>
            <i className="fa-solid fa-arrow-left" />
          </button>
          <div className="group-title">
            <span>{category?.icon}</span> {category?.name}
          </div>
          <div style={{ width: 44 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#9e9eb3' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 24, marginRight: 10 }} />
          Loading…
        </div>
        <BottomNav />
      </div>
    );
  }

  /* ── Empty state ─────────────────────────────────── */
  if (!profile) {
    return (
      <div className="swipe-screen">
        <div className="swipe-top">
          <button className="back-btn-inline" onClick={() => navigate('/explore')}>
            <i className="fa-solid fa-arrow-left" />
          </button>
          <div className="group-title">
            <span>{category?.icon}</span> {category?.name}
          </div>
          <div style={{ width: 44 }} />
        </div>

        <div className="empty">
          <div className="empty-icon">{category?.icon || '🔍'}</div>
          <p>No one here yet</p>
          <span>
            {isHookups
              ? 'Hookups only shows Diamond users. Buy Diamond to join the pool.'
              : `Try widening your filters, or be the first to join ${category?.name || 'this category'}`}
          </span>
        </div>
        <BottomNav />
      </div>
    );
  }

  /* ── Main render ─────────────────────────────────── */
  return (
    <div className="swipe-screen">
      <div className="swipe-top">
        <button className="back-btn-inline" onClick={() => navigate('/explore')}>
          <i className="fa-solid fa-arrow-left" />
        </button>

        <div className="group-title">
          <span>{category.icon}</span> {category.name}
        </div>

        <div className="group-counter">{counterLabel}</div>
      </div>

      <div className="swipe-stage">
        <div className="card-hint h2" />
        <div className="card-hint h1" />

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

        <button className="sa-btn sa-super" onClick={() => doSwipe('up')}>
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

      <HookupUpgradeModal
        open={showHookupUpgrade}
        onClose={() => setShowHookupUpgrade(false)}
      />

      <MatchModal
        open={!!matchProfile}
        profile={matchProfile}
        onClose={() => setMatchProfile(null)}
      />
    </div>
  );
}

/* ── Normalize backend user → ProfileCard shape ──── */
function normalizeUser(u) {
  const photos = u.main_photo ? [u.main_photo] : [];
  return {
    id: u.id,
    public_id: u.public_id,
    name: u.first_name || 'Someone',
    age: u.age,
    verified: u.verified,
    online: false,
    /* Real distance in km (null if unknown) */
    distanceKm: u.distance_km != null ? Number(u.distance_km) : null,
    /* Fallback string used if distanceKm is null */
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