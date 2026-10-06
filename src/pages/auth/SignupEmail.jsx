// =========================================================
// MYNVORA — SIGNUP EMAIL (wired to backend)
// =========================================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useUserStore } from '../../store/userStore.js';
import PasswordStrength from '../../components/PasswordStrength.jsx';

export default function SignupEmail() {
  const navigate = useNavigate();
  const signup = useUserStore((s) => s.signup);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isValid = email.includes('@') && password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError('');
    try {
      await signup({ email: email.trim().toLowerCase(), password });
      navigate(ROUTES.OTP_VERIFY, { state: { method: 'email', identifier: email.trim().toLowerCase() } });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Signup failed. Please try again.';
      if (msg.toLowerCase().includes('registered')) setError('This email is already registered. Try logging in.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <button className="back-btn" onClick={() => navigate(ROUTES.SIGNUP_OPTIONS)} aria-label="Back">
        <i className="fa-solid fa-arrow-left" />
      </button>
      <div className="auth-body">
        <h1 className="auth-title">What's your email?</h1>
        <p className="auth-sub">We'll send you a code to verify.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="field">
            <label>Password</label>
            <div className="password-input-wrap">
              <input type={showPass ? 'text' : 'password'} placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="password-eye" onClick={() => setShowPass(!showPass)} aria-label="Toggle password">
                <i className={`fa-regular ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>
          <PasswordStrength password={password} />
          {error && (<div className="input-error" style={{ marginTop: 12 }}><i className="fa-solid fa-circle-xmark" />{error}</div>)}
          <button type="submit" className="btn-primary" disabled={!isValid || loading} style={{ marginTop: 22 }}>
            {loading ? (<><span className="login-spinner" /> Sending code...</>) : (<>Continue <i className="fa-solid fa-arrow-right" /></>)}
          </button>
        </form>
        <p className="auth-sub small" style={{ textAlign: 'center', marginTop: 22 }}>
          By continuing you agree to our <a href="/settings/legal">Terms</a> and <a href="/settings/legal">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
