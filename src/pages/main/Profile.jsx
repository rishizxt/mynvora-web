// =========================================================
// MYNVORA — PROFILE (own) — full fields
// =========================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav.jsx';
import BoostModal from '../../components/BoostModal.jsx';
import SettingsMenu from '../../components/SettingsMenu.jsx';
import { ROUTES } from '../../navigation/routes.js';
import { useUserStore } from '../../store/userStore.js';
import { useProfileStore } from '../../store/profileStore.js';
import {
  ZODIAC,
  FAMILY_PLANS,
  DRINKING,
  SMOKING,
  WORKOUT,
  SOCIAL_MEDIA,
  LOVE_STYLE,
  COMM_STYLE,
  EDUCATION,
  RELATIONSHIP_TYPE,
} from '../../data/profileOptions.js';

const DEFAULT_PHOTO =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80';

// Helper — find label from options array by id
function labelFrom(options, id) {
  if (!id) return null;
  const found = options.find((o) => o.id === id);
  return found?.label || found?.name || null;
}

export default function Profile() {
  const navigate = useNavigate();
  const { tier, verified } = useUserStore();
  const profile = useProfileStore();

  const [showBoostModal, setShowBoostModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (profile.fetchProfile) await profile.fetchProfile();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const prompts = profile.prompts || [];

  const heroPhoto =
    profile.photos?.[0]?.url || profile.photos?.[0] || DEFAULT_PHOTO;

  if (loading) {
    return (
      <div className="profile-screen">
        <div className="profile-top">
          <h1>My Profile</h1>
        </div>
        <div style={{ textAlign: 'center', padding: 40, color: '#9e9eb3' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 24 }} />
          <p style={{ marginTop: 12 }}>Loading your profile…</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const completeness = profile.completeness || 0;

  return (
    <div className="profile-screen">
      <div className="profile-top">
        <h1>My Profile</h1>
        <button
          className="profile-gear-btn"
          onClick={() => setShowSettings(true)}
          aria-label="Settings"
        >
          <i className="fa-solid fa-gear" />
        </button>
      </div>

      <div className="profile-card-hero">
        <img src={heroPhoto} alt="You" />
        <div className="pch-info">
          <div className="pch-name">
            {profile.name || 'Your name'}{' '}
            {verified && <i className="fa-solid fa-circle-check" />}
          </div>
          <div className="pch-sub">
            {profile.age || ''}
            {profile.city ? ` · ${profile.city}` : ''}
            {profile.country ? `, ${profile.country}` : ''}
            {profile.height ? ` · ${profile.height}` : ''}
          </div>
        </div>
      </div>

      {completeness < 100 && (
        <div className="profile-completeness">
          <div className="profile-completeness-head">
            <div className="profile-completeness-title">
              Complete your profile
            </div>
            <div className="profile-completeness-value">{completeness}%</div>
          </div>
          <div className="profile-completeness-bar">
            <div
              className="profile-completeness-fill"
              style={{ width: `${completeness}%` }}
            />
          </div>
          <button
            className="profile-completeness-cta"
            onClick={() => navigate('/settings/edit-profile')}
          >
            Finish profile <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      )}

      {/* ABOUT ME */}
      <div className="profile-section">
        <div className="profile-section-head">
          <h3>About me</h3>
          <button
            className="profile-section-edit"
            onClick={() => navigate('/settings/edit-profile')}
            aria-label="Edit bio"
          >
            <i className="fa-solid fa-pen" />
          </button>
        </div>
        {profile.bio ? (
          <p className="profile-about">{profile.bio}</p>
        ) : (
          <button
            className="profile-about-empty"
            onClick={() => navigate('/settings/edit-profile')}
          >
            + Add a bio to stand out
          </button>
        )}
      </div>

      {/* PROMPTS */}
      <div className="profile-section">
        <div className="profile-section-head">
          <h3>Prompts</h3>
          <button
            className="profile-section-edit"
            onClick={() => navigate('/settings/prompts')}
            aria-label="Edit prompts"
          >
            <i className="fa-solid fa-pen" />
          </button>
        </div>

        {prompts.length === 0 ? (
          <button
            className="profile-about-empty"
            onClick={() => navigate('/settings/prompts')}
          >
            + Add a prompt to show your personality
          </button>
        ) : (
          <div className="profile-prompts-list">
            {prompts.map((p, i) => (
              <div className="profile-prompt-card" key={i}>
                <div className="profile-prompt-q" style={{ cursor: 'default' }}>
                  <i className="fa-solid fa-quote-left" />
                  <span>{p.q}</span>
                </div>
                <p
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    color: '#1a1a2e',
                    lineHeight: 1.5,
                  }}
                >
                  {p.a}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===================== ZODIAC ===================== */}
      {profile.zodiac && (
        <div className="profile-section">
          <div className="profile-section-head">
            <h3>Zodiac</h3>
            <button
              className="profile-section-edit"
              onClick={() => navigate('/settings/basics')}
              aria-label="Edit zodiac"
            >
              <i className="fa-solid fa-pen" />
            </button>
          </div>
          <div className="profile-chips">
            {ZODIAC.filter((z) => z.id === profile.zodiac).map((z) => (
              <span className="profile-chip" key={z.id}>
                {z.icon} {z.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ===================== FAMILY PLANS ===================== */}
      {profile.family_plans && (
        <div className="profile-section">
          <div className="profile-section-head">
            <h3>Family plans</h3>
            <button
              className="profile-section-edit"
              onClick={() => navigate('/settings/basics')}
              aria-label="Edit family plans"
            >
              <i className="fa-solid fa-pen" />
            </button>
          </div>
          <div className="profile-chips">
            <span className="profile-chip">
              {labelFrom(FAMILY_PLANS, profile.family_plans)}
            </span>
          </div>
        </div>
      )}

      {/* ===================== RELATIONSHIP TYPE ===================== */}
      {profile.relationship_type && (
        <div className="profile-section">
          <div className="profile-section-head">
            <h3>Relationship type</h3>
            <button
              className="profile-section-edit"
              onClick={() => navigate('/settings/intentions')}
              aria-label="Edit relationship type"
            >
              <i className="fa-solid fa-pen" />
            </button>
          </div>
          <div className="profile-chips">
            <span className="profile-chip">
              {labelFrom(RELATIONSHIP_TYPE, profile.relationship_type)}
            </span>
          </div>
        </div>
      )}

      {/* ===================== LOVE STYLE ===================== */}
      {profile.love_style && (
        <div className="profile-section">
          <div className="profile-section-head">
            <h3>Love style</h3>
            <button
              className="profile-section-edit"
              onClick={() => navigate('/settings/lifestyle')}
              aria-label="Edit love style"
            >
              <i className="fa-solid fa-pen" />
            </button>
          </div>
          <div className="profile-chips">
            <span className="profile-chip">
              {labelFrom(LOVE_STYLE, profile.love_style)}
            </span>
          </div>
        </div>
      )}

      {/* ===================== INTERESTS ===================== */}
      <div className="profile-section">
        <div className="profile-section-head">
          <h3>Interests</h3>
          <button
            className="profile-section-edit"
            onClick={() => navigate('/settings/interests')}
            aria-label="Edit interests"
          >
            <i className="fa-solid fa-pen" />
          </button>
        </div>
        {profile.interests && profile.interests.length > 0 ? (
          <div className="profile-chips">
            {profile.interests.map((i, idx) => (
              <span className="profile-chip" key={i.id || idx}>
                {i.name || i}
              </span>
            ))}
          </div>
        ) : (
          <button
            className="profile-about-empty"
            onClick={() => navigate('/settings/interests')}
          >
            + Add up to 10 interests
          </button>
        )}
      </div>

      {/* ===================== LANGUAGES ===================== */}
      {profile.languages && profile.languages.length > 0 && (
        <div className="profile-section">
          <div className="profile-section-head">
            <h3>Languages I speak</h3>
            <button
              className="profile-section-edit"
              onClick={() => navigate('/settings/basics')}
              aria-label="Edit languages"
            >
              <i className="fa-solid fa-pen" />
            </button>
          </div>
          <div className="profile-chips">
            {profile.languages.map((lang, i) => (
              <span className="profile-chip" key={i}>
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ===================== PETS ===================== */}
      {profile.pets && profile.pets.length > 0 && (
        <div className="profile-section">
          <div className="profile-section-head">
            <h3>Pets</h3>
            <button
              className="profile-section-edit"
              onClick={() => navigate('/settings/basics')}
              aria-label="Edit pets"
            >
              <i className="fa-solid fa-pen" />
            </button>
          </div>
          <div className="profile-chips">
            {profile.pets.map((pet, i) => (
              <span className="profile-chip" key={i}>
                {pet}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ===================== LIFESTYLE GRID ===================== */}
      {(profile.drinking || profile.smoking || profile.workout || profile.social_media) && (
        <div className="profile-section">
          <div className="profile-section-head">
            <h3>Lifestyle</h3>
            <button
              className="profile-section-edit"
              onClick={() => navigate('/settings/basics')}
              aria-label="Edit lifestyle"
            >
              <i className="fa-solid fa-pen" />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}
          >
            {profile.drinking && (
              <div className="pd-fact">
                <i className="fa-solid fa-wine-glass" />
                <span>{labelFrom(DRINKING, profile.drinking)}</span>
              </div>
            )}
            {profile.smoking && (
              <div className="pd-fact">
                <i className="fa-solid fa-smoking" />
                <span>{labelFrom(SMOKING, profile.smoking)}</span>
              </div>
            )}
            {profile.workout && (
              <div className="pd-fact">
                <i className="fa-solid fa-dumbbell" />
                <span>{labelFrom(WORKOUT, profile.workout)}</span>
              </div>
            )}
            {profile.social_media && (
              <div className="pd-fact">
                <i className="fa-solid fa-mobile-screen" />
                <span>{labelFrom(SOCIAL_MEDIA, profile.social_media)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== EDUCATION ===================== */}
      {profile.education && (
        <div className="profile-section">
          <div className="profile-section-head">
            <h3>Education</h3>
            <button
              className="profile-section-edit"
              onClick={() => navigate('/settings/basics')}
              aria-label="Edit education"
            >
              <i className="fa-solid fa-pen" />
            </button>
          </div>
          <div className="profile-chips">
            <span className="profile-chip">
              {labelFrom(EDUCATION, profile.education) || profile.education}
            </span>
          </div>
        </div>
      )}

      {/* ===================== COMMUNICATION ===================== */}
      {profile.comm_style && (
        <div className="profile-section">
          <div className="profile-section-head">
            <h3>Communication style</h3>
            <button
              className="profile-section-edit"
              onClick={() => navigate('/settings/lifestyle')}
              aria-label="Edit communication"
            >
              <i className="fa-solid fa-pen" />
            </button>
          </div>
          <div className="profile-chips">
            <span className="profile-chip">
              {labelFrom(COMM_STYLE, profile.comm_style)}
            </span>
          </div>
        </div>
      )}

      {/* ===================== PHOTOS ===================== */}
      <div className="profile-section">
        <div className="profile-section-head">
          <h3>Photos ({profile.photos?.length || 0}/6)</h3>
          <button
            className="profile-section-edit"
            onClick={() => navigate('/settings/edit-profile')}
            aria-label="Edit photos"
          >
            <i className="fa-solid fa-pen" />
          </button>
        </div>
        <div className="photo-grid">
          {(profile.photos || []).map((ph, i) => {
            const url = typeof ph === 'string' ? ph : ph.url;
            return (
              <div key={i} className="photo-slot filled">
                <img src={url} alt="" />
              </div>
            );
          })}
          {Array.from({
            length: 6 - (profile.photos?.length || 0),
          }).map((_, i) => (
            <div key={`empty-${i}`} className="photo-slot empty">
              <i className="fa-solid fa-plus" />
            </div>
          ))}
        </div>
      </div>

      <div
        className="boost-banner"
        onClick={() => setShowBoostModal(true)}
      >
        <div className="pb-left">
          <div className="pb-title">
            <i className="fa-solid fa-bolt" /> <strong>Boost my profile</strong>
          </div>
          <div className="pb-sub">
            Match with people who match your vibe, faster
          </div>
        </div>
        <i className="fa-solid fa-arrow-right" />
      </div>

      <div
        className="premium-banner"
        onClick={() => navigate(ROUTES.SUBSCRIPTION)}
      >
        <div className="pb-left">
          <div className="pb-title">
            <strong>Mynvora Plus</strong> · Unlimited Likes
          </div>
          <div className="pb-sub">
            {tier === 'free'
              ? "You're out of Likes. Unlock more now."
              : `You're on ${tier.toUpperCase()} · Manage plan`}
          </div>
        </div>
        <i className="fa-solid fa-arrow-right" />
      </div>

      <BottomNav />

      <BoostModal
        open={showBoostModal}
        onClose={() => setShowBoostModal(false)}
      />
      <SettingsMenu
        open={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}