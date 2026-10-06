// =========================================================
// MYNVORA — PROFILE DETAIL (real user + all fields)
// =========================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PhotoCarousel from '../../components/PhotoCarousel.jsx';
import ProfileActionsBar from '../../components/ProfileActionsBar.jsx';
import ProfileMenu from '../../components/ProfileMenu.jsx';
import StarUpgradeModal from '../../components/StarUpgradeModal.jsx';
import SuperLikeToast from '../../components/SuperLikeToast.jsx';
import api from '../../lib/api.js';
import {
  ZODIAC,
  FAMILY_PLANS,
  DRINKING,
  SMOKING,
  WORKOUT,
  SOCIAL_MEDIA,
  LOVE_STYLE,
  COMM_STYLE,
  RELATIONSHIP_TYPE,
  LOOKING_FOR,
} from '../../data/profileOptions.js';

function labelFrom(options, id) {
  if (!id) return null;
  const found = options.find((o) => o.id === id);
  return found?.label || found?.name || id;
}

export default function ProfileDetail() {
  const { id: publicId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showStarUpgrade] = useState(false);
  const [toast, setToast] = useState({ open: false, name: '' });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/profile/${publicId}`);
        if (cancelled) return;
        setProfile(data.profile || data);
      } catch (err) {
        console.warn('Profile load failed:', err.message);
        if (!cancelled) setError('Could not load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [publicId]);

  const handleNope = async () => {
    if (!profile?.public_id) return navigate(-1);
    try {
      await api.post('/match/swipe', {
        targetPublicId: profile.public_id,
        type: 'pass',
      });
    } catch (err) { console.warn('Pass failed:', err.message); }
    navigate(-1);
  };

  const handleLike = async () => {
    if (!profile?.public_id) return navigate(-1);
    try {
      const { data } = await api.post('/match/swipe', {
        targetPublicId: profile.public_id,
        type: 'like',
      });
      if (data.matched) {
        setToast({ open: true, name: `${profile.first_name || 'them'} — It's a match!` });
      }
    } catch (err) { console.warn('Like failed:', err.message); }
    setTimeout(() => navigate(-1), 800);
  };

  const handleSuperLike = async () => {
    if (!profile?.public_id) return;
    try {
      await api.post('/match/swipe', {
        targetPublicId: profile.public_id,
        type: 'super_like',
      });
      setToast({ open: true, name: profile.first_name || 'them' });
      setTimeout(() => navigate(-1), 1200);
    } catch (err) { console.warn('Super like failed:', err.message); }
  };

  if (loading) {
    return (
      <div className="pd-screen">
        <div className="pd-topbar">
          <button className="pd-icon-btn" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left" />
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: 100, color: '#9e9eb3' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 30 }} />
          <p style={{ marginTop: 12 }}>Loading profile…</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="pd-screen">
        <div className="pd-topbar">
          <button className="pd-icon-btn" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left" />
          </button>
        </div>
        <div className="empty">
          <i className="fa-regular fa-face-frown" />
          <p>{error || 'Profile not found'}</p>
        </div>
      </div>
    );
  }

  const photos = (profile.photos || []).map((ph) =>
    typeof ph === 'string' ? ph : ph.url
  );
  const interests = (profile.interests || []).map((i) =>
    typeof i === 'string' ? i : i.name
  );
  const prompts = (profile.prompts || []).map((p) => ({
    q: p.question || p.q,
    a: p.answer || p.a,
  }));

  const zodiacObj = ZODIAC.find((z) => z.id === profile.zodiac);

  return (
    <div className="pd-screen">
      {photos.length > 0 ? (
        <PhotoCarousel photos={photos} />
      ) : (
        <div className="pdc-empty" style={{
          background: 'linear-gradient(135deg, #23232e, #1a1a2e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', color: '#55556a',
        }}>
          <i className="fa-solid fa-user" style={{ fontSize: 90 }} />
          <p style={{ marginTop: 12, fontSize: 14 }}>No photo yet</p>
        </div>
      )}

      <div className="pd-topbar">
        <button className="pd-icon-btn" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <button className="pd-icon-btn" onClick={() => setMenuOpen(true)}>
          <i className="fa-solid fa-ellipsis-vertical" />
        </button>
      </div>

      <div className="pd-body">
        <div className="pd-header">
          <div className="pd-name-row">
            <span className="pd-name">{profile.first_name || 'Someone'}</span>
            {profile.verified && <i className="fa-solid fa-circle-check pd-verified" />}
            {profile.age && <span className="pd-age">{profile.age}</span>}
          </div>
          <div className="pd-status">
            <span className="pd-offline">
              <i className="fa-solid fa-location-dot" />
              {profile.city || 'Nearby'}
            </span>
          </div>
        </div>

        <div className="pd-facts">
          {profile.job && <div className="pd-fact"><i className="fa-solid fa-briefcase" /><span>{profile.job}</span></div>}
          {profile.education && <div className="pd-fact"><i className="fa-solid fa-graduation-cap" /><span>{profile.education}</span></div>}
          {profile.height && <div className="pd-fact"><i className="fa-solid fa-ruler-vertical" /><span>{profile.height}</span></div>}
          {zodiacObj && <div className="pd-fact"><span>{zodiacObj.icon}</span><span>{zodiacObj.label}</span></div>}
        </div>

        {profile.bio && (
          <div className="pd-section">
            <h3 className="pd-section-title">About me</h3>
            <p className="pd-bio">{profile.bio}</p>
          </div>
        )}

        {prompts.length > 0 && (
          <div className="pd-section">
            <h3 className="pd-section-title">Prompts</h3>
            <div className="pd-prompts">
              {prompts.map((p, i) => (
                <div className="pd-prompt" key={i}>
                  <div className="pd-prompt-q">{p.q}</div>
                  <div className="pd-prompt-a">{p.a}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.family_plans && (
          <div className="pd-section">
            <h3 className="pd-section-title">Family plans</h3>
            <div className="pd-tags">
              <span className="pd-tag">{labelFrom(FAMILY_PLANS, profile.family_plans)}</span>
            </div>
          </div>
        )}

        {profile.looking_for && (
          <div className="pd-section">
            <h3 className="pd-section-title">Looking for</h3>
            <div className="pd-intention">
              <i className="fa-solid fa-heart" />
              {labelFrom(LOOKING_FOR, profile.looking_for)}
            </div>
          </div>
        )}

        {profile.relationship_type && (
          <div className="pd-section">
            <h3 className="pd-section-title">Relationship type</h3>
            <div className="pd-tags">
              <span className="pd-tag">{labelFrom(RELATIONSHIP_TYPE, profile.relationship_type)}</span>
            </div>
          </div>
        )}

        {profile.love_style && (
          <div className="pd-section">
            <h3 className="pd-section-title">Love style</h3>
            <div className="pd-tags">
              <span className="pd-tag">{labelFrom(LOVE_STYLE, profile.love_style)}</span>
            </div>
          </div>
        )}

        {interests.length > 0 && (
          <div className="pd-section">
            <h3 className="pd-section-title">Interests</h3>
            <div className="pd-tags">
              {interests.map((t, i) => <span className="pd-tag" key={i}>{t}</span>)}
            </div>
          </div>
        )}

        {profile.languages && profile.languages.length > 0 && (
          <div className="pd-section">
            <h3 className="pd-section-title">Languages I speak</h3>
            <div className="pd-languages">
              {profile.languages.map((l, i) => <span className="pd-lang" key={i}>{l}</span>)}
            </div>
          </div>
        )}

        {profile.pets && profile.pets.length > 0 && (
          <div className="pd-section">
            <h3 className="pd-section-title">Pets</h3>
            <div className="pd-tags">
              {profile.pets.map((pet, i) => <span className="pd-tag" key={i}>{pet}</span>)}
            </div>
          </div>
        )}

        {(profile.drinking || profile.smoking || profile.workout || profile.social_media) && (
          <div className="pd-section">
            <h3 className="pd-section-title">Lifestyle</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {profile.drinking && <div className="pd-fact"><i className="fa-solid fa-wine-glass" /><span>{labelFrom(DRINKING, profile.drinking)}</span></div>}
              {profile.smoking && <div className="pd-fact"><i className="fa-solid fa-smoking" /><span>{labelFrom(SMOKING, profile.smoking)}</span></div>}
              {profile.workout && <div className="pd-fact"><i className="fa-solid fa-dumbbell" /><span>{labelFrom(WORKOUT, profile.workout)}</span></div>}
              {profile.social_media && <div className="pd-fact"><i className="fa-solid fa-mobile-screen" /><span>{labelFrom(SOCIAL_MEDIA, profile.social_media)}</span></div>}
            </div>
          </div>
        )}

        {profile.comm_style && (
          <div className="pd-section">
            <h3 className="pd-section-title">Communication style</h3>
            <div className="pd-tags">
              <span className="pd-tag">{labelFrom(COMM_STYLE, profile.comm_style)}</span>
            </div>
          </div>
        )}

        <div className="pd-safety">
          <i className="fa-solid fa-shield-halved" />
          <p><strong>Mynvora Safety</strong> · AI-moderated profile.</p>
        </div>

        <div className="pd-spacer" />
      </div>

      <ProfileActionsBar onNope={handleNope} onSuper={handleSuperLike} onLike={handleLike} />
      <ProfileMenu open={menuOpen} onClose={() => setMenuOpen(false)} profile={profile} />
      <StarUpgradeModal open={showStarUpgrade} onClose={() => {}} />
      <SuperLikeToast
        open={toast.open}
        name={toast.name}
        onClose={() => setToast({ open: false, name: '' })}
      />
    </div>
  );
}