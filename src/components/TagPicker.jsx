// =========================================================
// MYNVORA — TAG PICKER
// Reusable multi-select chip component.
// Used for: interests, languages, looking-for, etc.
// Props:
//   options  : array of strings OR array of {id, label, icon}
//   selected : array of selected values
//   onToggle : (value) => void
//   max      : optional max selections (0 = unlimited)
//   columns  : 'auto' | 2 | 3
// =========================================================

export default function TagPicker({
  options = [],
  selected = [],
  onToggle,
  max = 0,
  columns = 'auto',
  showCounter = true,
  counterLabel = 'selected'
}) {
  const isAtMax = max > 0 && selected.length >= max;

  const isSelected = (value) => selected.includes(value);

  const handleClick = (value) => {
    const alreadySelected = isSelected(value);
    // If at max and item is not selected → block
    if (isAtMax && !alreadySelected) return;
    onToggle?.(value);
  };

  // Normalize options to { value, label, icon }
  const normalized = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt, icon: null };
    }
    return {
      value: opt.id || opt.value,
      label: opt.label,
      icon: opt.icon || null
    };
  });

  const gridStyle =
    columns === 2
      ? { gridTemplateColumns: '1fr 1fr' }
      : columns === 3
      ? { gridTemplateColumns: '1fr 1fr 1fr' }
      : undefined;

  return (
    <div className="tagpicker">
      {/* Counter */}
      {max > 0 && showCounter && (
        <div className="tagpicker-counter">
          <span className={`tagpicker-count ${isAtMax ? 'at-max' : ''}`}>
            {selected.length} of {max}
          </span>
          <span className="tagpicker-count-label">{counterLabel}</span>
        </div>
      )}

      {/* Chips grid */}
      <div className="tagpicker-grid" style={gridStyle}>
        {normalized.map((opt) => {
          const active = isSelected(opt.value);
          const disabled = isAtMax && !active;

          return (
            <button
              key={opt.value}
              type="button"
              className={`tagpicker-chip ${active ? 'active' : ''} ${
                disabled ? 'disabled' : ''
              }`}
              onClick={() => handleClick(opt.value)}
              disabled={disabled}
            >
              {opt.icon && <span className="tagpicker-icon">{opt.icon}</span>}
              <span className="tagpicker-label">{opt.label}</span>
              {active && (
                <i className="fa-solid fa-check tagpicker-check" />
              )}
            </button>
          );
        })}
      </div>

      {/* At max hint */}
      {max > 0 && isAtMax && (
        <div className="tagpicker-hint">
          <i className="fa-solid fa-circle-info" />
          Unselect one to choose another
        </div>
      )}
    </div>
  );
}