import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import PasswordStrength from '../../components/PasswordStrength.jsx';

export default function ResetNewPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);

  const matches = password && confirm && password === confirm;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!matches) return;
    // TODO: call reset API
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="auth-page">
      <button className="back-btn" onClick={() => navigate(ROUTES.RESET_OTP)}>
        ←
      </button>

      <div className="auth-body">
        <h1 className="auth-title">Create a new password</h1>
        <p className="auth-sub">Make it strong. Make it memorable.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>New password</label>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPass(!showPass)}
            >
              <i className={`fa-regular ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
            </button>
          </div>

          <PasswordStrength password={password} />

          <div className="field" style={{ marginTop: 18 }}>
            <label>Confirm password</label>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            {confirm && (
              <div className={`match-line ${matches ? 'ok' : 'bad'}`}>
                {matches ? '✓ Passwords match' : '✕ Passwords do not match'}
              </div>
            )}
          </div>

          <button type="submit" className="btn-main" disabled={!matches}>
            Reset password <span>→</span>
          </button>
        </form>

        <p className="switch-auth small-note">
          You'll be logged out of all other devices.
        </p>
      </div>
    </div>
  );
}