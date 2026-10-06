export default function PasswordStrength({ password }) {
  const score = getScore(password);

  return (
    <div className="strength-wrap">
      <div className="strength-bar">
        <div
          className={`strength-fill strength-${score.level}`}
          style={{ width: `${score.percent}%` }}
        />
      </div>
      <div className={`strength-label strength-${score.level}`}>
        {password && score.label}
      </div>
    </div>
  );
}

function getScore(password) {
  if (!password) return { level: 0, percent: 0, label: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length < 8) return { level: 1, percent: 25, label: 'Too short' };
  if (score <= 2) return { level: 2, percent: 45, label: 'Fair' };
  if (score <= 3) return { level: 3, percent: 70, label: 'Strong' };
  return { level: 4, percent: 100, label: 'Excellent' };
}