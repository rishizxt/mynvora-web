// =========================================================
// MYNVORA — SIGNUP PHONE (wired to backend)
// =========================================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import api from '../../lib/api.js';

const COUNTRY_CODES = [
  { code: '+91', flag: 'IN', name: 'India' },
  { code: '+1', flag: 'US', name: 'USA' },
  { code: '+44', flag: 'GB', name: 'UK' },
  { code: '+61', flag: 'AU', name: 'Australia' },
  { code: '+81', flag: 'JP', name: 'Japan' },
  { code: '+971', flag: 'AE', name: 'UAE' },
  { code: '+65', flag: 'SG', name: 'Singapore' }
];

export default function SignupPhone() {
  const navigate = useNavigate();
  const [country, setCountry] = useState('+91');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cleanPhone = phone.replace(/\D/g, '');
  const isValid = cleanPhone.length >= 10 && password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError('');
    try {
      const fullPhone = country + cleanPhone;
      await api.post('/auth/signup/phone', { phone: fullPhone, password });
      navigate(ROUTES.OTP_VERIFY, {
        state: { method: 'phone', identifier: fullPhone, purpose: 'signup_phone' },
      });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Signup failed. Please try again.';
      setError(msg);
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
        <h1 className="auth-title">What's your number?</h1>
        <p className="auth-sub">We'll text you a code to verify.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Phone number</label>
            <div className="phone-row">
              <select className="country-select" value={country} onChange={(e) => setCountry(e.target.value)}>
                {COUNTRY_CODES.map((c) => (<option key={c.code} value={c.code}>{c.flag} {c.code}</option>))}
              </select>
              <input type="tel" placeholder="98765 43210" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, ''))} required autoFocus />
            </div>
            {phone && cleanPhone.length < 10 && (
              <div className="input-error"><i className="fa-solid fa-circle-xmark" />Enter a valid 10-digit number</div>
            )}
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && (<div className="input-error" style={{ marginTop: 8 }}><i className="fa-solid fa-circle-xmark" />{error}</div>)}
          <button type="submit" className="btn-primary" disabled={!isValid || loading} style={{ marginTop: 22 }}>
            {loading ? 'Sending code…' : 'Continue'} <i className="fa-solid fa-arrow-right" />
          </button>
        </form>
        <p className="auth-sub small" style={{ textAlign: 'center', marginTop: 22 }}>
          By continuing you agree to our <a href="/settings/legal">Terms</a> and <a href="/settings/legal">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
