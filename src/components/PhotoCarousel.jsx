// =========================================================
// MYNVORA — PHOTO CAROUSEL
// Full-bleed photos with progress bars + tap zones.
// =========================================================

import { useState, useEffect } from 'react';

export default function PhotoCarousel({ photos = [], autoAdvance = false }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [photos]);

  useEffect(() => {
    if (!autoAdvance || photos.length < 2) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, 4000);
    return () => clearInterval(t);
  }, [autoAdvance, photos.length]);

  if (!photos || photos.length === 0) {
    return <div className="pdc-empty" />;
  }

  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const goNext = () => {
    if (index < photos.length - 1) setIndex(index + 1);
  };

  return (
    <div className="pdc">
      <div
        className="pdc-photo"
        key={index}
        style={{ backgroundImage: `url(${photos[index]})` }}
      />

      <div className="pdc-scrim" />

      {photos.length > 1 && (
        <div className="pdc-progress">
          {photos.map((_, i) => (
            <div
              key={i}
              className={`pdc-bar ${i === index ? 'active' : ''}`}
            />
          ))}
        </div>
      )}

      {photos.length > 1 && (
        <>
          <button
            type="button"
            className="pdc-nav pdc-nav-left"
            onClick={goPrev}
            aria-label="Previous photo"
          />
          <button
            type="button"
            className="pdc-nav pdc-nav-right"
            onClick={goNext}
            aria-label="Next photo"
          />
        </>
      )}

      {photos.length > 1 && (
        <div className="pdc-counter">
          <i className="fa-solid fa-images" /> {index + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}