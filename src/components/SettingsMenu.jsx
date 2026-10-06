// =========================================================
// MYNVORA — SETTINGS MENU (bottom sheet)
// Opens from the gear icon on Profile.
// Quick access: Account, Privacy, Notifications,
// Discovery, Safety, Help, Legal, Log out, Delete.
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/profileStore.js';
import { useUserStore } from '../store/userStore.js';

const MENU_ITEMS = [
  {
    id: 'account',
    icon: 'fa-user-gear',
    label: 'Account Settings',
    path: '/settings/account'
  },
  {
    id: 'privacy',
    icon: 'fa-shield-halved',
    label: 'Privacy & Safety',
    path: '/settings/privacy'
  },
  {
    id: 'notifications',
    icon: 'fa-bell',
    label: 'Notifications',
    path: '/settings/notifications'
  },
  {
    id: 'discovery',
    icon: 'fa-compass',
    label: 'Discovery Settings',
    path: '/settings/discovery'
  },
  {
    id: 'blocked',
    icon: 'fa-user-slash',
    label: 'Blocked Contacts',
    path: '/settings/blocked'
  },
  {
    id: 'payments',
    icon: 'fa-credit-card',
    label: 'Payment & Subscriptions',
    path: '/settings/payments'
  },
  {
    id: 'webprofile',
    icon: 'fa-globe',
    label: 'Web Profile',
    path: '/settings/web-profile'
  },
  {
    id: 'help',
    icon: 'fa-circle-question',
    label: 'Help & Support',
    path: '/settings/help'
  },
  {
    id: 'legal',
    icon: 'fa-file-shield',
    label: 'Terms & Privacy',
    path: '/settings/legal'
  }
];

export default function SettingsMenu({ open, onClose }) {
  const navigate = useNavigate();
  const { name } = useProfileStore();
  const { tier, verified, logout } = useUserStore();

  const [confirmLogout, setConfirmLogout] = useState(false);

  if (!open) return null;

  const handleNav = (path) => {
    onClose?.();
    navigate(path);
  };

  const handleLogout = () => {
    if (!confirmLogout) {
      setConfirmLogout(true);
      return;
    }
    logout?.();
    onClose?.();
    navigate('/');
  };

  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        {/* ---- User card ---- */}
        <div className="settings-user">
          <div className="settings-user-avatar">
            <i className="fa-solid fa-user" />
          </div>
          <div className="settings-user-info">
            <div className="settings-user-name">
              {name || 'Guest'}
              {verified && (
                <i className="fa-solid fa-circle-check settings-user-verified" />
              )}
            </div>
            <div className="settings-user-tier">
              {tier === 'diamond' && '💎 Diamond'}
              {tier === 'gold' && '👑 Gold'}
              {tier === 'light' && '✨ Light'}
              {tier === 'free' && 'Free account'}
            </div>
          </div>
        </div>

        {/* ---- Menu items ---- */}
        <div className="settings-items">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              className="settings-item"
              onClick={() => handleNav(item.path)}
            >
              <div className="settings-item-icon">
                <i className={`fa-solid ${item.icon}`} />
              </div>
              <span className="settings-item-label">{item.label}</span>
              <i className="fa-solid fa-chevron-right settings-item-arrow" />
            </button>
          ))}
        </div>

        {/* ---- Log out ---- */}
        <div className="settings-items settings-items-danger">
          <button
            className="settings-item settings-item-danger"
            onClick={handleLogout}
          >
            <div className="settings-item-icon">
              <i className="fa-solid fa-right-from-bracket" />
            </div>
            <span className="settings-item-label">
              {confirmLogout ? 'Tap again to confirm' : 'Log out'}
            </span>
            <i className="fa-solid fa-chevron-right settings-item-arrow" />
          </button>

          <button
            className="settings-item settings-item-danger"
            onClick={() => handleNav('/settings/delete-account')}
          >
            <div className="settings-item-icon">
              <i className="fa-solid fa-trash" />
            </div>
            <span className="settings-item-label">Delete Account</span>
            <i className="fa-solid fa-chevron-right settings-item-arrow" />
          </button>
        </div>

        {/* ---- Footer ---- */}
        <div className="settings-footer">
          Mynvora v1.0.0
        </div>
      </div>
    </div>
  );
}