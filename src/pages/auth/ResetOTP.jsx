import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../navigation/routes.js';
import OTPInput from '../../components/OTPInput.jsx';

export default function ResetOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const method = location.state?.method || 'email';
  const identifier = location.state?.identifier || '';

  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(60);
  const [error, setError] = useState('');

  // countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  // auto submit when 6 digits entered
  useEffect(() => {
    if (code.length === 6) {
      // TODO: verify with API
      setTimeout(() => {
        navigate(ROUTES.RESET_PASSWORD, { state: { method, identifier, code } });
      }, 400);
    }
  }, [code, navigate, method, identifier]);

  const handleResend = () => {
    // TODO: call resend API
    setCode('');
    setError('');
    setSeconds(60);
  };

  return (
    <div className="auth-page">
      <button className="back-btn" onClick={() => navigate(ROUTES.FORGOT)}>
        ←
      </button>

      <div className="auth-body">
        <h1 className="auth-title">Check your {method}</h1>
        <p className="auth-sub">
          We sent a 6-digit code to <br />
          <strong className="masked">{identifier || (method === 'email' ? 'you@example.com' : '+91 *** ** 210')}</strong>
        </p>

        <OTPInput value={code} onChange={setCode} length={6} />

        {error && <p className="otp-error">{error}</p>}

        <p className="resend-line">
          {seconds > 0 ? (
            <>Resend in 0:{seconds.toString().padStart(2, '0')}</>
          ) : (
            <button className="resend-btn" onClick={handleResend}>
              Resend code
            </button>
          )}
        </p>

        <p className="switch-auth">
          Wrong {method}?
          <button onClick={() => navigate(ROUTES.FORGOT)}>Change</button>
        </p>
      </div>
    </div>
  );
}