// =========================================================
// MYNVORA — CATEGORY GROUP
// Filtered swipe deck. Same strict tap detection.
// =========================================================

import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PROFILES } from '../../data/profiles.js';
import ProfileCard from '../../components/ProfileCard.jsx';
import BottomNav from '../../components/BottomNav.jsx';
import LimitReachedModal from '../../components/LimitReachedModal.jsx';
import HookupUpgradeModal from '../../components/HookupUpgradeModal.jsx';
import { getCategoryById } from '../../data/categories.js';
import { useSwipeLimit } from '../../features/swipe/useSwipeLimit.js';
import { useHookupLimit } from '../../features/swipe/useHookupLimit.js';
import { useUserStore } from '../../store/userStore.js';

const TAP_THRESHOLD = 5;
const SWIPE_THRESHOLD = 110;
const SUPER_THRESHOLD = 140;

export default function CategoryGroup() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = getCategoryById(categoryId);
  const isHookups = categoryId === 'hookups';

  const { verified } = useUserStore();
  const {
    isOut: swipeOut,
    consume: consumeSwipe,
    count,
    limit,
    isUnlimited
  } = useSwipeLimit();
  const {
    isDiamond,
    isUnlimited: hookupsUnlimited,
    isOut: hookupsOut,
    remaining: hookupsRemaining,
    freeLimit: hookupsFreeLimit,
    consume: consumeHookup
  } = useHookupLimit();

  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState({
    x: 0,
    y: 0,
    active: false,
    startX: 0,
    startY: 0
  });
  const [animating, setAnimating] = useState(null);
  const [showLimit, setShowLimit] = useState(false);
  const [showHookupUpgrade, setShowHookupUpgrade] = useState(false);

  const maxMoveRef = useRef(0);
  const filtered = filterByCategory(PROFILES, categoryId);
  const profile = filtered[idx];

  const doSwipe = (dir) => {
    if (animating) return;

    if (isHookups) {
      if (!isDiamond) {
        navigate('/subscription');
        return;
      }

      if (hookupsOut) {
        setShowHookupUpgrade(true);
        return;
      }

      setAnimating(dir);
      consumeHookup();
      if (dir === 'right') burstHearts();
      advance();
      return;
    }

    if (swipeOut) {
      setShowLimit(true);
      return;
    }

    setAnimating(dir);
    consumeSwipe();
    if (dir === 'right') burstHearts();
    advance();
  };

  const advance = () => {
    setTimeout(() => {
      setIdx((i) => (i + 1) % filtered.length);
      setAnimating(null);
      setDrag({ x: 0, y: 0, active: false, startX: 0, startY: 0 });
      maxMoveRef.current = 0;
    }, 420);
  };

  const openDetail = () => {
    if (!profile) return;
    navigate(`/profile/${profile.id}`);
  };

  const onDown = (e) => {
    const p = e.touches ? e.touches[0] : e;
    maxMoveRef.current = 0;
    setDrag({
      x: 0,
      y: 0,
      active: true,
      startX: p.clientX,
      startY: p.clientY
    });
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
    else if (drag.y < -SUPER_THRESHOLD && Math.abs(drag.x) < 80)
      doSwipe('up');
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
        transition:
          'transform 0.42s cubic-bezier(0.22,1,0.36,1), opacity 0.42s'
      }
    : {
        transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 22}deg)`,
        transition: drag.active
          ? 'none'
          : 'transform 0.3s cubic-bezier(0.22,1,0.36,1)'
      };

  const counterLabel = (() => {
    if (isHookups) {
      if (hookupsUnlimited) return '∞';
      return `${hookupsFreeLimit - hookupsRemaining}/${hookupsFreeLimit}`;
    }
    if (isUnlimited) return '∞';
    return `${count}/${limit}`;
  })();

  if (!profile) {
    return (
      <div className="swipe-screen">
        <div className="swipe-top">
          <button
            className="back-btn-inline"
            onClick={() => navigate('/explore')}
          >
            <i className="fa-solid fa-arrow-left" />
          </button>
          <div className="group-title">
            <span>{category?.icon}</span> {category?.name}
          </div>
          <div style={{ width: 44 }} />
        </div>

        <div className="empty">
          <div className="empty-icon">{category?.icon}</div>
          <p>No one here yet</p>
          <span>Be the first to join {category?.name}</span>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="swipe-screen">
      <div className="swipe-top">
        <button
          className="back-btn-inline"
          onClick={() => navigate('/explore')}
        >
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
          onClick={() =>
            setIdx((i) => (i - 1 + filtered.length) % filtered.length)
          }
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
    </div>
  );
}

function filterByCategory(all, categoryId) {
  const shuffled = [...all].sort(
    (a, b) => hash(a.id + categoryId) - hash(b.id + categoryId)
  );
  const size = 3 + (hash(categoryId) % 4);
  return shuffled.slice(0, size);
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
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