// =========================================================
// MYNVORA — WEB PROFILE
// Create a shareable username + link.
// People worldwide can find you on mynvora.app/username.
// =========================================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../store/settingsStore.js';
import { useProfileStore } from '../../store/profileStore.js';

export default function WebProfile() {
  const navigate = useNavigate();
  const settings = useSettingsStore();
  const profile = useProfileStore();

  const currentUsername = settings.username || '';
  const [draft, setDraft] = useState(currentUsername);
  const [copied, setCopied] = useState(false);

  // Validate username
  const validation = useMemo(() => {
    const v = draft.trim().toLowerCase();
    if (!v) return { ok: false, msg: '' };
    if (v.length < 3) return { ok: false, msg: 'At least 3 characters' };
    if (v.length > 20) return { ok: false, msg: 'Maximum 20 characters' };
    if (!/^[a-z0-9_.]+$/.test(v))
      return { ok: false, msg: 'Only letters, numbers, _ and .' };
    return { ok: true, msg: 'Available' };
  }, [draft]);

  const shareLink = draft ? `mynvora.app/${draft.toLowerCase()}` : '';

  const save = () => {
    if (!validation.ok) return;
    settings.setUsername(draft.trim().toLowerCase());
    alert('Username saved! (demo)');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${shareLink}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback — ignore
    }
  };

  const shareVia = (platform) => {
    const url = `https://${shareLink}`;
    const text = `Find me on Mynvora: ${url}`;

    const links = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Find me on Mynvora')}`
    };

    if (links[platform]) {
      window.open(links[platform], '_blank');
    }
  };

  const enabled = settings.webProfileEnabled;

  return (
    <div className="settings-screen">
      {/* Header */}
      <div className="settings-page-head">
        <button className="back-btn-inline" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Web Profile</h1>
        <div style={{ width: 44 }} />
      </div>

      {/* Hero */}
      <div className="webprofile-hero">
        <div className="webprofile-hero-icon">
          <i className="fa-solid fa-globe" />
        </div>
        <h2>Share your Mynvora</h2>
        <p>
          Create a username. Share your link. People worldwide can match with
          you right on Mynvora.
        </p>
      </div>

      {/* Username input */}
      <div className="settings-section">
        <div className="settings-section-title">Username</div>

        <div className="webprofile-input-wrap">
          <span className="webprofile-prefix">mynvora.app/</span>
          <input
            className="webprofile-input"
            type="text"
            placeholder="yourname"
            maxLength={20}
            value={draft}
            onChange={(e) =>
              setDraft(e.target.value.replace(/\s/g, '').toLowerCase())
            }
          />
        </div>

        {/* Validation */}
        {draft && (
          <div
            className={`webprofile-validate ${
              validation.ok ? 'ok' : 'bad'
            }`}
          >
            {validation.ok ? (
              <>
                <i className="fa-solid fa-circle-check" /> {validation.msg}
              </>
            ) : (
              <>
                <i className="fa-solid fa-circle-xmark" /> {validation.msg}
              </>
            )}
          </div>
        )}

        <button
          className="btn-main"
          onClick={save}
          disabled={!validation.ok}
          style={{ marginTop: 12 }}
        >
          {currentUsername ? 'Update username' : 'Claim username'}{' '}
          <span>→</span>
        </button>
      </div>

      {/* Shareable link */}
      {currentUsername && enabled && (
        <div className="settings-section">
          <div className="settings-section-title">Your link</div>

          <div className="webprofile-link-card">
            <div className="webprofile-link">
              <i className="fa-solid fa-link" />
              <span>mynvora.app/{currentUsername}</span>
            </div>

            <button
              className="webprofile-copy"
              onClick={copyLink}
            >
              {copied ? (
                <>
                  <i className="fa-solid fa-check" /> Copied
                </>
              ) : (
                <>
                  <i className="fa-solid fa-copy" /> Copy
                </>
              )}
            </button>
          </div>

          {/* Share options */}
          <div className="webprofile-share-row">
            <button
              className="webprofile-share-btn whatsapp"
              onClick={() => shareVia('whatsapp')}
            >
              <i className="fa-brands fa-whatsapp" /> WhatsApp
            </button>
            <button
              className="webprofile-share-btn twitter"
              onClick={() => shareVia('twitter')}
            >
              <i className="fa-brands fa-x-twitter" /> X
            </button>
            <button
              className="webprofile-share-btn telegram"
              onClick={() => shareVia('telegram')}
            >
              <i className="fa-brands fa-telegram" /> Telegram
            </button>
            <button
              className="webprofile-share-btn more"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Find me on Mynvora',
                    url: `https://mynvora.app/${currentUsername}`
                  });
                } else {
                  copyLink();
                }
              }}
            >
              <i className="fa-solid fa-share-nodes" /> More
            </button>
          </div>

          <p className="webprofile-tip">
            💡 Tip: Add this link to your Instagram bio or WhatsApp status.
            Anyone who clicks it can match with you on Mynvora.
          </p>
        </div>
      )}

      {/* Preview */}
      {currentUsername && (
        <div className="settings-section">
          <div className="settings-section-title">Preview</div>

          <div className="webprofile-preview">
            <div className="webprofile-preview-photo">
              {profile.photos?.[0] ? (
                <img src={profile.photos[0]} alt={profile.name} />
              ) : (
                <i className="fa-solid fa-user" />
              )}
            </div>
            <div className="webprofile-preview-info">
              <div className="webprofile-preview-name">
                {profile.name || 'Your name'}
              </div>
              <div className="webprofile-preview-sub">
                {profile.age ? `${profile.age} · ` : ''}
                {profile.city || 'Your city'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}