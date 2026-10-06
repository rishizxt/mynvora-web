// =========================================================
// MYNVORA — MATCH MODAL
// "IT'S A MATCH" celebration when user and match like each other.
// Heartbeat title, avatars sliding together, confetti hearts.
// =========================================================

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// My own avatar (mock — replace with real user photo later)
const MY_PHOTO =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80';

export default function MatchModal({ open, profile, onClose }) {
  const navigate = useNavigate();

  // Burst hearts when modal opens
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => burstConfetti(), 120);
    return () => clearTimeout(timer);
  }, [open]);

  if (!open || !profile) return null;

  const handleSendMessage = () => {
    onClose?.();
    navigate(`/chat/${profile.id}`);
  };

  return (
    <div className="match-scrim">
      <div className="match-content">
        {/* Title */}
        <h1 className="match-title">IT'S A MATCH</h1>
        <p className="match-sub">
          You and <strong>{profile.name}</strong> liked each other.
          <br />
          Say hi before the moment fades.
        </p>

        {/* Avatars */}
        <div className="match-avatars">
          <img src={MY_PHOTO} alt="You" className="match-avatar left" />
          <img
            src={profile.photos[0]}
            alt={profile.name}
            className="match-avatar right"
          />
        </div>

        {/* Actions */}
        <button className="btn-main match-cta" onClick={handleSendMessage}>
          Send a message <span>→</span>
        </button>

        <button className="btn-ghost match-ghost" onClick={onClose}>
          Keep swiping
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Confetti hearts (explode from center)
// ---------------------------------------------------------
function burstConfetti() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2 - 40;

  const colors = ['#ff3b81', '#ff6b9d', '#8b5cf6', '#4f8cff', '#ffb020'];

  for (let i = 0; i < 30; i++) {
    const heart = document.createElement('div');
    heart.className = 'confetti-heart';
    heart.textContent = ['❤', '✦', '★'][Math.floor(Math.random() * 3)];

    const angle = Math.random() * Math.PI * 2;
    const dist = 160 + Math.random() * 260;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;

    heart.style.setProperty('--tx', `${tx}px`);
    heart.style.setProperty('--ty', `${ty}px`);
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];
    heart.style.left = `${cx}px`;
    heart.style.top = `${cy}px`;
    heart.style.fontSize = `${14 + Math.random() * 16}px`;
    heart.style.animationDelay = `${Math.random() * 0.15}s`;

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1800);
  }
}