// =========================================================
// MYNVORA — SETTINGS HUB
// Main settings page. Groups all settings into sections.
// =========================================================

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore.js';
import { useUserStore } from '../../store/userStore.js';

const SECTIONS = [
  {
    title: 'Profile',
    items: [
      { id: 'edit-profile', icon: 'fa-user-pen',      label: 'Edit Profile',       path: '/settings/edit-profile' },
      { id: 'interests',    icon: 'fa-heart',         label: 'Interests',          path: '/settings/interests' },
      { id: 'intentions',   icon: 'fa-bullseye',      label: 'Looking For',        path: '/settings/intentions' },
      { id: 'basics',       icon: 'fa-circle-info',   label: 'Basics & Lifestyle', path: '/settings/basics' },
      { id: 'lifestyle',    icon: 'fa-mug-hot',       label: 'Love Style',         path: '/settings/lifestyle' }
    ]
  },
  {
    title: 'Privacy & Visibility',
    items: [
      { id: 'privacy',      icon: 'fa-shield-halved', label: 'Privacy & Safety',   path: '/settings/privacy' },
      { id: 'blocked',      icon: 'fa-user-slash',    label: 'Blocked Contacts',   path: '/settings/blocked' },
      { id: 'web-profile',  icon: 'fa-globe',         label: 'Web Profile',        path: '/settings/web-profile' }
    ]
  },
  {
    title: 'Discovery',
    items: [
      { id: 'discovery',    icon: 'fa-compass',       label: 'Discovery Settings', path: '/settings/discovery' }
    ]
  },
  {
    title: 'Account & Login',
    items: [
      { id: 'change-email', icon: 'fa-envelope',      label: 'Change Email',       path: '/settings/change-email' },
      { id: 'change-phone', icon: 'fa-phone',         label: 'Change Phone',       path: '/settings/change-phone' },
      { id: 'notifications',icon: 'fa-bell',          label: 'Notifications',      path: '/settings/notifications' },
      { id: 'payments',     icon: 'fa-credit-card',   label: 'Payments',           path: '/settings/payments' }
    ]
  },
  {
    title: 'Support & Legal',
    items: [
      { id: 'help',         icon: 'fa-circle-question', label: 'Help & Support',   path: '/settings/help' },
      { id: 'legal',        icon: 'fa-file-shield',     label: 'Terms & Privacy',  path: '/settings/legal' }
    ]
  },
  {
    title: 'Danger Zone',
    items: [
      { id: 'delete',       icon: 'fa-trash',         label: 'Delete Account',     path: '/settings/delete-account', danger: true }
    ]
  }
];

export default function Settings() {
  const navigate = useNavigate();
  const { name, bio, interests, photos } = useProfileStore();
  const { tier, verified } = useUserStore();

  const handleNav = (path) => navigate(path);

  return (
    <div className="settings-screen">
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
        aria-label="Back"
      >
        ←
      </button>

      <div className="settings-hero">
        <div className="settings-hero-avatar">
          {photos?.[0] ? (
            <img src={photos[0]} alt={name} />
          ) : (
            <i className="fa-solid fa-user" />
          )}
          {verified && (
            <span className="settings-hero-verified">
              <i className="fa-solid fa-circle-check" />
            </span>
          )}
        </div>

        <div className="settings-hero-info">
          <div className="settings-hero-name">
            {name || 'Your name'}
          </div>
          <div className="settings-hero-sub">
            {tier === 'diamond' && '💎 Diamond member'}
            {tier === 'gold' && '👑 Gold member'}
            {tier === 'light' && '✨ Light member'}
            {tier === 'free' && 'Free account'}
          </div>
        </div>

        <button
          className="settings-hero-edit"
          onClick={() => navigate('/settings/edit-profile')}
        >
          <i className="fa-solid fa-pen" /> Edit
        </button>
      </div>

      {SECTIONS.map((section) => (
        <div className="settings-section" key={section.title}>
          <div className="settings-section-title">{section.title}</div>

          <div className="settings-section-list">
            {section.items.map((item) => (
              <button
                key={item.id}
                className={`settings-section-item ${
                  item.danger ? 'danger' : ''
                }`}
                onClick={() => handleNav(item.path)}
              >
                <div className="settings-section-icon">
                  <i className={`fa-solid ${item.icon}`} />
                </div>
                <span className="settings-section-label">{item.label}</span>
                <i className="fa-solid fa-chevron-right settings-section-arrow" />
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="settings-footer">
        Mynvora v1.0.0
      </div>
    </div>
  );
}