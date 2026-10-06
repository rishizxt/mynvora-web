// =========================================================
// MYNVORA — OTP VERIFY (wired to backend)
// =========================================================
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import { useUserStore } from '../../store/userStore.js';
import OTPInput from '../../components/OTPInput.jsx';

export default function OTPVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const method = location.state?.method || 'email';
  const identifier = location.state?.identifier || '';
  const purpose = location.state?.purpose || 'signup_email';
  const verifyOtp = useUserStore((s) => s.verifyOtp);
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submittedRef = useRef(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  useEffect(() => {
    if (code.length !== 6 || loading || submittedRef.current) return;
    submittedRef.current = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        await verifyOtp({ identifier, purpose, code });
        navigate(ROUTES.ONBOARDING_HOUSE_RULES, { replace: true });
      } catch (err) {
        const msg = err.response?.data?.error || err.response?.data?.message || 'Invalid or expired code. Please try again.';
        setError(msg);
        setCode('');
        submittedRef.current = false;
      } finally {
        setLoading(false);
      }
    })();
  }, [code, identifier, purpose, verifyOtp, navigate, loading]);

  const handleResend = () => {
    setCode('');
    setError('');
    setSeconds(60);
    submittedRef.current = false;
  };

  return (
    <div className="auth-page">
      <button className="back-btn" onClick={() => navigate(ROUTES.SIGNUP_OPTIONS)} aria-label="Back">
        <i className="fa-solid fa-arrow-left" />
      </button>
      <div className="auth-body">
        <h1 className="auth-title">Check your {method === 'email' ? 'email' : 'phone'}</h1>
        <p className="auth-sub">We sent a 6-digit code to <br /><strong className="masked">{identifier}</strong></p>
        <OTPInput value={code} onChange={setCode} length={6} />
        {loading && (<p className="resend-line" style={{ color: '#ff3b81' }}><i className="fa-solid fa-spinner fa-spin" /> Verifying…</p>)}
        {error && <p className="otp-error">{error}</p>}
        {!loading && (
          <p className="resend-line">
            {seconds > 0 ? (<>Resend in 0:{seconds.toString().padStart(2, '0')}</>) : (<button className="resend-btn" onClick={handleResend}>Resend code</button>)}
          </p>
        )}
        <p className="auth-switch">Wrong {method}?<button onClick={() => navigate(ROUTES.SIGNUP_OPTIONS)}>Change</button></p>
      </div>
    </div>
  );
}
