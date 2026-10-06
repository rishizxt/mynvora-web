// =========================================================
// MYNVORA — SPONSORED CARD
// Ad card shown to users. Tap → counts click → opens target.
// =========================================================
import { useEffect, useRef } from 'react';
import { recordImpression, recordClick } from '../lib/adsApi.js';

export default function SponsoredCard({ ad }) {
  const seenRef = useRef(false);

  // Log impression once per mount
  useEffect(() => {
    if (!ad?.id || seenRef.current) return;
    seenRef.current = true;
    recordImpression(ad.id);
  }, [ad?.id]);

  if (!ad) return null;

  const handleClick = () => {
    recordClick(ad.id);
    if (ad.targetUrl) {
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <button className="sponsored-card" onClick={handleClick}>
      <span className="sponsored-label">
        <i className="fa-solid fa-circle-info" /> Sponsored
      </span>

      <div
        className="sponsored-img"
        style={{ backgroundImage: `url(${ad.imageUrl})` }}
      />

      <div className="sponsored-body">
        <div className="sponsored-brand-row">
          <span className="sponsored-brand">{ad.brand}</span>
        </div>

        {ad.tagline && (
          <div className="sponsored-tagline">{ad.tagline}</div>
        )}

        {ad.description && (
          <div className="sponsored-desc">{ad.description}</div>
        )}

        <div className="sponsored-cta">
          {ad.ctaText || 'Learn more'}
          <i className="fa-solid fa-arrow-up-right-from-square" />
        </div>
      </div>
    </button>
  );
}