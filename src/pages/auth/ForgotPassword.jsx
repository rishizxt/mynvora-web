// =========================================================
// MYNVORA — FORGOT PASSWORD (wired to backend)
// =========================================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import api from '../../lib/api.js';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [method, setMethod] = useState('email');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/password/forgot', {
        identifier: identifier.trim(),
        method,
      });
      navigate(ROUTES.RESET_OTP, {
        state: { method, identifier: identifier.trim() },
      });
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Could not send code. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <button className="back-btn" onClick={() => navigate(ROUTES.LOGIN)}>
        <i className="fa-solid fa-arrow-left" />
      </button>

      <div className="auth-body">
        <h1 className="auth-title">Reset your password</h1>
        <p className="auth-sub">Choose how you want to reset it.</p>

        <div className="method-tabs">
          <button
            type="button"
            className={`method-tab ${method === 'email' ? 'active' : ''}`}
            onClick={() => setMethod('email')}
          >
            📧 Email
          </button>
          <button
            type="button"
            className={`method-tab ${method === 'phone' ? 'active' : ''}`}
            onClick={() => setMethod('phone')}
          >
            📱 Phone
          </button>
        </div>

        <form onSubmit={handleSend}>
          <div className="field">
            <label>{method === 'email' ? 'Your email' : 'Your phone number'}</label>
            <input
              type={method === 'email' ? 'email' : 'tel'}
              placeholder={method === 'email' ? 'you@example.com' : '+91 98765 43210'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="input-error" style={{ marginTop: 8 }}>
              <i className="fa-solid fa-circle-xmark" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: 22 }}
          >
            {loading ? 'Sending code…' : 'Send code'}{' '}
            <i className="fa-solid fa-arrow-right" />
          </button>
        </form>

        <p className="switch-auth">
          Remembered it?
          <button onClick={() => navigate(ROUTES.LOGIN)}>Back to login</button>
        </p>
      </div>
    </div>
  );
}
