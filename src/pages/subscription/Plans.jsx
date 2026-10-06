// =========================================================
// MYNVORA — SUBSCRIPTION PLANS + ADD-ONS
// Real Razorpay checkout for all products.
// =========================================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIER_INFO } from '../../data/subscriptions.js';
import { useUserStore } from '../../store/userStore.js';
import { startCheckout, fetchSubscription } from '../../lib/paymentApi.js';

const PLANS = [
  { id: 'light', name: 'Light', price: '₹99', period: '/week', tagline: 'Everything you need to start',
    features: ['See Who Liked You','Unlimited Likes','Profile Customization','Hobbies & Interests','Music / Movies','Relationship Intentions','Basic Discovery','Chat','Safety Tools','All AI Safety Features'] },
  { id: 'gold', name: 'Gold', price: '₹199', period: '/week', highlighted: true, tagline: 'The most popular choice',
    features: ['Everything in Light','See Who Viewed Your Profile','Voice Calls','Read Receipts','Read Receipt Toggle','Rewind','Super Likes','Better Discovery'] },
  { id: 'diamond', name: 'Diamond', price: '₹399', period: '/week', tagline: 'Ultimate Mynvora experience',
    features: ['Everything in Gold','Unlimited Swiping','Video Calls','Travel Mode','Incognito Mode','Hookup Access','Advanced Filters','Online-Now Discovery','Social Sharing','Advanced Intent Matching'] },
];

const TIER_RANK = { free: 0, light: 1, gold: 2, diamond: 3 };

const ADDONS = [
  { id: 'stars_6',  icon: 'fa-star',  color: '#ffb020', title: '6 Stars',           price: 99,  subtitle: 'Send 6 Super Likes' },
  { id: 'stars_14', icon: 'fa-star',  color: '#ffb020', title: '14 Stars',          price: 199, subtitle: 'Best value · 14 Super Likes', highlighted: true },
  { id: 'boost_24', icon: 'fa-bolt',  color: '#ff6b9d', title: 'Boost · 24h',       price: 149, subtitle: 'Priority matching for 24 hours' },
  { id: 'boost_48', icon: 'fa-bolt',  color: '#ff6b9d', title: 'Boost · 48h',       price: 299, subtitle: 'Extended priority matching' },
  { id: 'hookups',  icon: 'fa-fire',  color: '#ff3b81', title: 'Unlimited Hookups', price: 99,  subtitle: 'One-time · Diamond only', diamondOnly: true },
];

export default function Plans() {
  const navigate = useNavigate();
  const { setTier } = useUserStore();

  const [purchasing, setPurchasing]       = useState(null);
  const [confirmAddon, setConfirmAddon]   = useState(null);
  const [successData, setSuccessData]     = useState(null);
  const [currentTier, setCurrentTier]     = useState('free');

  /* ── fetch current subscription ──────────────────── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sub = await fetchSubscription();
        if (!cancelled) {
          const t = sub?.active ? sub.tier : 'free';
          setCurrentTier(t);
          setTier(t);
        }
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [setTier]);

  /* ── buy subscription ────────────────────────────── */
  const choosePlan = async (planId) => {
    if (purchasing) return;

    if (planId === currentTier) {
      alert(`You already have the ${TIER_INFO[planId]?.name || planId} plan!\n\nIt's active and working.`);
      return;
    }
    if (TIER_RANK[planId] < TIER_RANK[currentTier]) {
      alert(
        `You currently have ${TIER_INFO[currentTier]?.name || currentTier}.\n\n` +
        `Downgrades aren't supported yet — you can only upgrade.`
      );
      return;
    }

    setPurchasing(planId);
    try {
      const result = await startCheckout({ tier: planId });
      const newTier = result?.tier || planId;
      setTier(newTier);
      setCurrentTier(newTier);
      setSuccessData({
        kind: 'subscription',
        planId: newTier,
        planName: TIER_INFO[newTier]?.name || newTier,
        expiresAt: result?.expiresAt,
        paymentId: result?.paymentId,
      });
    } catch (err) {
      if (err?.code === 'USER_CANCELLED') return;
      if (err?.code === 'PAYMENT_FAILED') { alert(`Payment failed: ${err.message}`); return; }
      alert(`Could not process payment: ${err?.response?.data?.error || err.message || 'Unknown error'}`);
    } finally {
      setPurchasing(null);
    }
  };

  /* ── buy add-on (real Razorpay) ──────────────────── */
  const buyAddon = async (addon) => {
    if (purchasing) return;
    setPurchasing(addon.id);
    setConfirmAddon(null);

    try {
      const result = await startCheckout({ addonId: addon.id });
      setSuccessData({
        kind: 'addon',
        addonId: addon.id,
        planName: addon.title,
        expiresAt: result?.boost?.expiresAt || null,
        paymentId: result?.paymentId,
        extra: result,
      });
    } catch (err) {
      if (err?.code === 'USER_CANCELLED') return;
      if (err?.code === 'PAYMENT_FAILED') { alert(`Payment failed: ${err.message}`); return; }
      alert(`Could not process payment: ${err?.response?.data?.error || err.message || 'Unknown error'}`);
    } finally {
      setPurchasing(null);
    }
  };

  /* ── plan button state ───────────────────────────── */
  const getPlanButtonState = (plan) => {
    if (plan.id === currentTier)      return { label: 'Current plan',            disabled: true };
    if (TIER_RANK[plan.id] < TIER_RANK[currentTier])
                                      return { label: 'Included in your plan',  disabled: true };
    if (TIER_RANK[plan.id] > TIER_RANK[currentTier] && TIER_RANK[currentTier] > 0)
                                      return { label: `Upgrade to ${plan.name}`, disabled: false };
    return { label: `Get ${plan.name}`, disabled: false };
  };

  return (
    <div className="plans-screen">
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>

      <div className="plans-head">
        <h1>Upgrade Mynvora</h1>
        <p>
          {currentTier === 'free'
            ? 'Choose the plan that fits you. Cancel anytime.'
            : `You're on ${TIER_INFO[currentTier]?.name || currentTier}. Upgrade for more.`}
        </p>
      </div>

      {/* ══════ SUBSCRIPTIONS ══════ */}
      <div className="plans-list">
        {PLANS.map((p) => {
          const isCurrent = p.id === currentTier;
          const isProcessing = purchasing === p.id;
          const btn = getPlanButtonState(p);

          return (
            <div
              key={p.id}
              className={`plan-card ${p.highlighted ? 'highlighted' : ''} ${isCurrent ? 'current' : ''}`}
            >
              {p.highlighted && !isCurrent && <div className="plan-badge">Most popular</div>}
              {isCurrent && <div className="plan-badge current-badge">Current plan</div>}

              <div className="plan-top">
                <div>
                  <div className="plan-name">{p.name}</div>
                  <div className="plan-tagline">{p.tagline}</div>
                </div>
                <div className="plan-price">
                  <strong>{p.price}</strong>
                  <span>{p.period}</span>
                </div>
              </div>

              <ul className="plan-features">
                {p.features.map((f) => (
                  <li key={f}><i className="fa-solid fa-check" /> {f}</li>
                ))}
              </ul>

              <button
                className={p.highlighted ? 'btn-main' : 'btn-primary'}
                onClick={() => choosePlan(p.id)}
                disabled={btn.disabled || !!purchasing}
                style={{ width: '100%', opacity: purchasing && !isProcessing ? 0.5 : 1 }}
              >
                {isProcessing
                  ? <><i className="fa-solid fa-spinner fa-spin" /> Processing…</>
                  : <>{btn.label} {!btn.disabled && <i className="fa-solid fa-arrow-right" />}</>}
              </button>
            </div>
          );
        })}
      </div>

      {/* ══════ ADD-ONS ══════ */}
      <div style={{ marginTop: 30, padding: '0 20px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', marginBottom: 6, letterSpacing: -0.4 }}>
          Add-ons
        </h2>
        <p style={{ fontSize: 13, color: '#63637a', marginBottom: 16 }}>
          One-time purchases
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {ADDONS.map((addon) => {
            const locked = addon.diamondOnly && currentTier !== 'diamond';
            const isProcessing = purchasing === addon.id;

            return (
              <div
                key={addon.id}
                style={{
                  position: 'relative', padding: 16, borderRadius: 16, background: '#fff',
                  border: addon.highlighted ? `1.5px solid ${addon.color}` : '1px solid #ebebf0',
                  boxShadow: addon.highlighted ? `0 8px 24px ${addon.color}22` : '0 2px 8px rgba(26,26,46,0.04)',
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}
              >
                {addon.highlighted && (
                  <div style={{
                    position: 'absolute', top: -10, left: 12,
                    padding: '3px 10px', borderRadius: 999,
                    background: addon.color, color: '#fff',
                    fontSize: 10, fontWeight: 800, letterSpacing: 0.3,
                  }}>BEST VALUE</div>
                )}

                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: `${addon.color}22`, color: addon.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>
                  <i className={`fa-solid ${addon.icon}`} />
                </div>

                <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1a2e', letterSpacing: -0.2 }}>
                  {addon.title}
                </div>

                <div style={{ fontSize: 11.5, color: '#777789', lineHeight: 1.4, flex: 1 }}>
                  {addon.subtitle}
                </div>

                <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e', marginTop: 4 }}>
                  ₹{addon.price}
                </div>

                <button
                  onClick={() => !locked && !purchasing && setConfirmAddon(addon)}
                  disabled={locked || !!purchasing}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 999,
                    background: locked ? '#f0f0f5' : `linear-gradient(135deg, ${addon.color}, #8b5cf6)`,
                    color: locked ? '#9e9eb3' : '#fff',
                    fontWeight: 800, fontSize: 12.5, border: 'none',
                    cursor: locked || purchasing ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    opacity: purchasing && !isProcessing ? 0.5 : 1,
                  }}
                >
                  {isProcessing ? 'Processing…' : locked ? 'Diamond only' : 'Buy'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════ SAFETY NOTE ══════ */}
      <div className="safety-note-plans" style={{ marginTop: 24 }}>
        <i className="fa-solid fa-shield-halved" />
        <p>
          <strong>All AI safety features</strong> are free for every tier — fake
          profile detection, deepfake detection, face verification, and more.{' '}
          <strong>Subscriptions never bypass age or safety rules.</strong>
        </p>
      </div>

      {/* ══════ SUCCESS MODAL ══════ */}
      {successData && (
        <SuccessModal
          data={successData}
          onClose={() => {
            const wasSubscription = successData.kind === 'subscription';
            setSuccessData(null);
            if (wasSubscription) navigate('/profile');
          }}
        />
      )}

      {/* ══════ CONFIRM MODAL ══════ */}
      {confirmAddon && (
        <div className="modal-scrim" onClick={() => !purchasing && setConfirmAddon(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon" style={{ background: `linear-gradient(135deg, ${confirmAddon.color}, #8b5cf6)` }}>
              <i className={`fa-solid ${confirmAddon.icon}`} />
            </div>
            <h2 className="modal-title">{confirmAddon.title}</h2>
            <p className="modal-sub">
              {confirmAddon.subtitle}
              <br /><br />
              <strong style={{ fontSize: 20 }}>₹{confirmAddon.price}</strong>
            </p>
            <button className="btn-primary" onClick={() => buyAddon(confirmAddon)} disabled={!!purchasing}>
              Pay ₹{confirmAddon.price}
            </button>
            <button className="btn-ghost" onClick={() => setConfirmAddon(null)} disabled={!!purchasing} style={{ marginTop: 10 }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUCCESS MODAL (subscription OR add-on)
   ═══════════════════════════════════════════════════════ */
function SuccessModal({ data, onClose }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 200);
    const t2 = setTimeout(() => setStage(2), 700);
    const t3 = setTimeout(() => setStage(3), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { onClose?.(); }, 6000);
    return () => clearTimeout(t);
  }, [onClose]);

  const fmtDate = (iso) => iso
    ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const isSubscription = data.kind === 'subscription';
  const isBoost        = data.kind === 'addon' && data.addonId?.startsWith('boost');
  const isStars        = data.kind === 'addon' && data.addonId?.startsWith('stars');
  const isHookups      = data.kind === 'addon' && data.addonId === 'hookups';

  const planColor = isSubscription
    ? (data.planId === 'gold' ? '#ffb020' : data.planId === 'diamond' ? '#8b5cf6' : '#4f8cff')
    : (isBoost ? '#ff6b9d' : isStars ? '#ffb020' : '#ff3b81');

  const planIcon = isSubscription
    ? (data.planId === 'gold' ? 'fa-crown' : data.planId === 'diamond' ? 'fa-gem' : 'fa-star')
    : (isBoost ? 'fa-bolt' : isStars ? 'fa-star' : 'fa-fire');

  const title = isSubscription ? 'Payment successful' : 'Purchase successful';
  const subtitle = isSubscription
    ? 'Welcome to the next level'
    : isStars ? 'Your stars are ready to fly'
    : isBoost ? 'Your profile is now boosted'
    : isHookups ? 'Unlimited Hookups unlocked'
    : 'Thanks for your purchase';

  const detailLine = isSubscription
    ? `Active until ${fmtDate(data.expiresAt) || '—'}`
    : isStars ? `+${data.addonId.split('_')[1]} stars added`
    : isBoost ? `Active until ${fmtDate(data.expiresAt) || '—'}`
    : isHookups ? 'One-time permanent unlock'
    : 'Purchase complete';

  return (
    <div className="success-scrim" onClick={onClose}>
      <div className="success-confetti">
        {[...Array(24)].map((_, i) => {
          const colors = ['#ff3b81', '#8b5cf6', '#4f8cff', '#ffb020', '#35d07f'];
          return (
            <span key={i} className="success-confetti-piece"
              style={{
                left: `${(i * 4.2) % 100}%`,
                background: colors[i % colors.length],
                animationDelay: `${(i % 8) * 0.08}s`,
              }}
            />
          );
        })}
      </div>

      <div className="success-card" onClick={(e) => e.stopPropagation()}>
        <div className={`success-check ${stage >= 1 ? 'draw' : ''}`}>
          <svg viewBox="0 0 52 52" className="success-check-svg">
            <circle className="success-check-circle" cx="26" cy="26" r="24" fill="none" />
            <path className="success-check-mark" fill="none" d="M14 27l7.5 7.5L38 21" />
          </svg>
        </div>

        <div className={`success-text ${stage >= 2 ? 'show' : ''}`}>
          <h2 className="success-title">{title}</h2>
          <p className="success-sub">{subtitle}</p>
        </div>

        <div
          className={`success-plan ${stage >= 2 ? 'show' : ''}`}
          style={{
            borderColor: `${planColor}44`,
            background: `linear-gradient(135deg, ${planColor}11, ${planColor}05)`,
          }}
        >
          <div className="success-plan-icon" style={{ background: `${planColor}22`, color: planColor }}>
            <i className={`fa-solid ${planIcon}`} />
          </div>
          <div className="success-plan-info">
            <div className="success-plan-name">{data.planName}</div>
            <div className="success-plan-expires">{detailLine}</div>
          </div>
          <div className="success-plan-badge" style={{ background: planColor }}>ACTIVE</div>
        </div>

        {data.paymentId && (
          <div className={`success-payment-id ${stage >= 3 ? 'show' : ''}`}>
            Payment ID: <span>{data.paymentId.slice(0, 18)}…</span>
          </div>
        )}

        <button
          className={`success-btn ${stage >= 3 ? 'show' : ''}`}
          onClick={onClose}
          style={{ background: `linear-gradient(135deg, ${planColor}, #8b5cf6)` }}
        >
          Start exploring <i className="fa-solid fa-arrow-right" />
        </button>

        <div className={`success-hint ${stage >= 3 ? 'show' : ''}`}>
          Auto-closing in a few seconds…
        </div>
      </div>

      <style>{`
        .success-scrim { position: fixed; inset: 0; background: rgba(10,10,20,0.72); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 10000; animation: fadeIn 0.25s ease; }
        .success-card { position: relative; width: 100%; max-width: 380px; background: #fff; border-radius: 28px; padding: 32px 24px 26px; text-align: center; box-shadow: 0 30px 80px rgba(0,0,0,0.3); animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); overflow: hidden; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.8) translateY(30px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .success-check { width: 88px; height: 88px; margin: 0 auto 18px; }
        .success-check-svg { width: 100%; height: 100%; }
        .success-check-circle { stroke: #35d07f; stroke-width: 2.5; stroke-dasharray: 166; stroke-dashoffset: 166; stroke-linecap: round; }
        .success-check.draw .success-check-circle { animation: drawCircle 0.55s ease-out forwards; }
        .success-check-mark { stroke: #35d07f; stroke-width: 4; stroke-dasharray: 48; stroke-dashoffset: 48; stroke-linecap: round; stroke-linejoin: round; }
        .success-check.draw .success-check-mark { animation: drawCheck 0.35s 0.5s ease-out forwards; }
        @keyframes drawCircle { to { stroke-dashoffset: 0; } }
        @keyframes drawCheck { to { stroke-dashoffset: 0; } }
        .success-text { opacity: 0; transform: translateY(10px); transition: all 0.4s ease; }
        .success-text.show { opacity: 1; transform: translateY(0); }
        .success-title { font-size: 22px; font-weight: 800; color: #1a1a2e; margin: 0 0 4px; letter-spacing: -0.5px; }
        .success-sub { font-size: 13.5px; color: #777789; margin: 0 0 22px; }
        .success-plan { display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 16px; border: 1.5px solid; margin-bottom: 16px; text-align: left; opacity: 0; transform: translateY(10px); transition: all 0.4s ease 0.1s; }
        .success-plan.show { opacity: 1; transform: translateY(0); }
        .success-plan-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .success-plan-info { flex: 1; min-width: 0; }
        .success-plan-name { font-size: 15px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.2px; }
        .success-plan-expires { font-size: 11.5px; color: #777789; margin-top: 2px; }
        .success-plan-badge { padding: 3px 10px; border-radius: 999px; color: #fff; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; }
        .success-payment-id { font-size: 11px; color: #9e9eb3; margin-bottom: 18px; opacity: 0; transition: opacity 0.3s ease; }
        .success-payment-id.show { opacity: 1; }
        .success-payment-id span { font-family: 'JetBrains Mono', monospace; color: #63637a; }
        .success-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 14px; border-radius: 14px; color: #fff; font-size: 15px; font-weight: 800; border: none; cursor: pointer; font-family: inherit; opacity: 0; transform: translateY(10px); transition: all 0.4s ease 0.15s; letter-spacing: -0.2px; }
        .success-btn.show { opacity: 1; transform: translateY(0); }
        .success-btn:hover { transform: translateY(-1px); }
        .success-hint { font-size: 11px; color: #b7b7c7; margin-top: 12px; opacity: 0; transition: opacity 0.3s ease; }
        .success-hint.show { opacity: 1; }
        .success-confetti { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 1; }
        .success-confetti-piece { position: absolute; top: -12px; width: 8px; height: 12px; border-radius: 2px; opacity: 0; animation: confettiFall 2.6s ease-in forwards; }
        @keyframes confettiFall { 0% { opacity: 1; transform: translateY(0) rotate(0deg); } 100% { opacity: 0; transform: translateY(100vh) rotate(720deg); } }
      `}</style>
    </div>
  );
}