// =========================================================
// MYNVORA — SLIDER
// Reusable slider for age range, distance, etc.
// Single value or dual (range) mode.
// =========================================================

export default function Slider({
  // Single mode
  value,
  onChange,

  // Dual mode (range)
  minValue,
  maxValue,
  onRangeChange,

  // Range limits
  min = 0,
  max = 100,
  step = 1,

  // Display
  label = '',
  unit = '',
  showValue = true
}) {
  const isDual = minValue !== undefined && maxValue !== undefined;

  const percent = (v) => ((v - min) / (max - min)) * 100;

  // ---------- SINGLE MODE ----------
  if (!isDual) {
    return (
      <div className="slider-wrap">
        {label && (
          <div className="slider-head">
            <span className="slider-label">{label}</span>
            {showValue && (
              <span className="slider-value">
                {value}
                {unit && <small>{unit}</small>}
              </span>
            )}
          </div>
        )}

        <div className="slider-track-wrap">
          <div
            className="slider-fill"
            style={{ width: `${percent(value)}%` }}
          />
          <input
            type="range"
            className="slider-input"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange?.(Number(e.target.value))}
          />
        </div>

        <div className="slider-minmax">
          <span>
            {min}
            {unit}
          </span>
          <span>
            {max}
            {unit}
          </span>
        </div>
      </div>
    );
  }

  // ---------- DUAL MODE (range) ----------
  const minPct = percent(minValue);
  const maxPct = percent(maxValue);

  return (
    <div className="slider-wrap">
      {label && (
        <div className="slider-head">
          <span className="slider-label">{label}</span>
          {showValue && (
            <span className="slider-value">
              {minValue}
              {unit && <small>{unit}</small>} – {maxValue}
              {unit && <small>{unit}</small>}
            </span>
          )}
        </div>
      )}

      <div className="slider-track-wrap dual">
        {/* Track fill between min and max */}
        <div
          className="slider-fill"
          style={{
            left: `${minPct}%`,
            width: `${maxPct - minPct}%`
          }}
        />

        {/* Left thumb (min) */}
        <input
          type="range"
          className="slider-input slider-input-min"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v <= maxValue) onRangeChange?.(v, maxValue);
          }}
        />

        {/* Right thumb (max) */}
        <input
          type="range"
          className="slider-input slider-input-max"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v >= minValue) onRangeChange?.(minValue, v);
          }}
        />
      </div>

      <div className="slider-minmax">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}