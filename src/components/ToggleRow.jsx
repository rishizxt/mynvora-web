// =========================================================
// MYNVORA — TOGGLE ROW
// Settings row with icon, label, description, and switch.
// =========================================================

export default function ToggleRow({
  icon,
  iconColor,
  label,
  description,
  value,
  onChange,
  disabled = false
}) {
  return (
    <div className={`toggle-row ${disabled ? 'disabled' : ''}`}>
      {icon && (
        <div
          className="toggle-row-icon"
          style={
            iconColor
              ? { background: `${iconColor}22`, color: iconColor }
              : undefined
          }
        >
          <i className={`fa-solid ${icon}`} />
        </div>
      )}

      <div className="toggle-row-body">
        <div className="toggle-row-label">{label}</div>
        {description && (
          <div className="toggle-row-desc">{description}</div>
        )}
      </div>

      <label className={`toggle-switch ${value ? 'on' : ''}`}>
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
        />
        <span className="toggle-switch-knob" />
      </label>
    </div>
  );
}