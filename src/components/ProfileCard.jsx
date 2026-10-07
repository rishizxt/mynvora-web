// =========================================================
// MYNVORA — PROFILE CARD
// Real distance display + "Nearby" pill for < 5 km
// =========================================================

import { useState } from 'react';
import { formatDistance } from '../lib/location.js';

export default function ProfileCard({
  profile,
  style = {},
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  drag = { x: 0, y: 0 }
}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = profile.photos || [];

  const goPrev = () => {
    if (photoIndex > 0) setPhotoIndex(photoIndex - 1);
  };

  const goNext = () => {
    if (photoIndex < photos.length - 1) setPhotoIndex(photoIndex + 1);
  };

  const likeOpacity = Math.max(0, Math.min(1, drag.x / 100));
  const nopeOpacity = Math.max(0, Math.min(1, -drag.x / 100));
  const superOpacity =
    drag.y < -60 && Math.abs(drag.x) < 60
      ? Math.max(0, Math.min(1, -drag.y / 120))
      : 0;

  /* ── distance ─────────────────────────────────────── */
  const km = profile.distanceKm;
  const distanceText =
    km != null ? formatDistance(km) : (profile.distance || 'Nearby');
  const isNearby = km != null && km < 5;

  return (
    <div
      className="pc-card"
      style={style}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Photo */}
      <div
        className="pc-photo"
        style={{ backgroundImage: `url(${photos[photoIndex]})` }}
      />

      {/* Dark gradient overlay for readability */}
      <div className="pc-gradient" />

      {/* Top: progress bars */}
      {photos.length > 1 && (
        <div className="pc-progress">
          {photos.map((_, i) => (
            <div
              key={i}
              className={`pc-bar ${i === photoIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      )}

      {/* Photo tap zones */}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            className="pc-nav pc-nav-left"
            onClick={goPrev}
            aria-label="Previous photo"
          />
          <button
            type="button"
            className="pc-nav pc-nav-right"
            onClick={goNext}
            aria-label="Next photo"
          />
        </>
      )}

      {/* Top-left: online badge */}
      {profile.online && (
        <div className="pc-badge">
          <span className="pc-dot" /> Active now
        </div>
      )}

      {/* Top-right: photo counter */}
      {photos.length > 1 && (
        <div className="pc-counter">
          <i className="fa-solid fa-images" /> {photoIndex + 1} / {photos.length}
        </div>
      )}

      {/* Stamps */}
      <div
        className="pc-stamp pc-stamp-like"
        style={{ opacity: likeOpacity }}
      >
        LIKE
      </div>
      <div
        className="pc-stamp pc-stamp-nope"
        style={{ opacity: nopeOpacity }}
      >
        NOPE
      </div>
      <div
        className="pc-stamp pc-stamp-super"
        style={{ opacity: superOpacity }}
      >
        SUPER
      </div>

      {/* Bottom info */}
      <div className="pc-info">
        {/* Nearby pill */}
        {isNearby && (
          <div className="pc-nearby-pill">
            <i className="fa-solid fa-location-dot" /> Nearby
          </div>
        )}

        {/* Name row */}
        <div className="pc-name-row">
          <span className="pc-name">{profile.name}</span>
          {profile.verified && (
            <i className="fa-solid fa-circle-check pc-verified" />
          )}
          <span className="pc-age">{profile.age}</span>
        </div>

        {/* Meta rows */}
        {profile.job && (
          <div className="pc-meta">
            <i className="fa-solid fa-briefcase" />
            <span>{profile.job}</span>
          </div>
        )}

        <div className="pc-meta">
          <i className="fa-solid fa-location-dot" />
          <span>{distanceText}</span>
        </div>

        {/* Interest tags */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="pc-tags">
            {profile.interests.slice(0, 4).map((tag, i) => (
              <span key={i} className="pc-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Prompt — if present */}
        {profile.prompt && (
          <div className="pc-prompt">
            <div className="pc-prompt-q">{profile.prompt.q}</div>
            <div className="pc-prompt-a">{profile.prompt.a}</div>
          </div>
        )}
      </div>
    </div>
  );
}