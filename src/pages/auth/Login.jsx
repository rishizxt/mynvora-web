// =========================================================
// MYNVORA — LOGIN (wired to backend)
// =========================================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useUserStore } from '../../store/userStore.js';

export default function Login() {
  const navigate = useNavigate();
  const login = useUserStore((s) => s.login);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isValid = identifier.trim().length >= 3 && password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError('');
    try {
      const data = await login({ identifier: identifier.trim(), password });
      if (data?.user?.onboardingComplete) {
        navigate('/discover', { replace: true });
      } else {
        navigate('/onboarding/house-rules', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <button className="login-back" onClick={() => navigate(ROUTES.WELCOME)} aria-label="Back">
        <i className="fa-solid fa-arrow-left" />
      </button>
      <div className="login-content">
        <div className="login-brand">
          <div className="login-logo"><i className="fa-solid fa-heart" /></div>
          <h1 className="login-brand-name">MYNVORA</h1>
        </div>
        <h2 className="login-title">Welcome back</h2>
        <p className="login-subtitle">Log in to continue your Mynvora journey</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Email or phone</label>
            <div className="login-input-wrap">
              <i className="fa-solid fa-user login-input-icon" />
              <input type="text" placeholder="you@example.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoFocus required />
            </div>
          </div>
          <div className="login-field">
            <label>Password</label>
            <div className="login-input-wrap">
              <i className="fa-solid fa-lock login-input-icon" />
              <input type={showPass ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="login-eye" onClick={() => setShowPass(!showPass)} aria-label="Toggle password">
                <i className={`fa-regular ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>
          {error && (<div className="input-error" style={{ marginTop: 4 }}><i className="fa-solid fa-circle-xmark" />{error}</div>)}
          <button type="button" className="login-forgot" onClick={() => navigate(ROUTES.FORGOT)}>Forgot password?</button>
          <button type="submit" className="btn-primary login-submit" disabled={!isValid || loading}>
            {loading ? (<><span className="login-spinner" /> Logging in...</>) : (<>Log in <i className="fa-solid fa-arrow-right" /></>)}
          </button>
        </form>
        <div className="login-divider"><span>or continue with</span></div>
        <div className="login-socials">
          <button type="button" className="login-social" onClick={() => alert('Google login coming soon')}><i className="fa-brands fa-google" style={{ color: '#ea4335' }} />Google</button>
          <button type="button" className="login-social" onClick={() => alert('Apple login coming soon')}><i className="fa-brands fa-apple" style={{ color: '#000' }} />Apple</button>
        </div>
        <p className="login-footer">New to Mynvora? <button type="button" onClick={() => navigate(ROUTES.SIGNUP_OPTIONS)}>Create account</button></p>
      </div>
    </div>
  );
}
