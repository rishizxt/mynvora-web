// =========================================================
// MYNVORA — NOTIFICATIONS
// Control push, email, SMS notifications.
// =========================================================

import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../store/settingsStore.js';
import ToggleRow from '../../components/ToggleRow.jsx';

export default function Notifications() {
  const navigate = useNavigate();
  const settings = useSettingsStore();

  return (
    <div className="settings-screen">
      {/* Header */}
      <div className="settings-page-head">
        <button className="back-btn-inline" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Notifications</h1>
        <div style={{ width: 44 }} />
      </div>

      {/* Push */}
      <div className="settings-section">
        <div className="settings-section-title">Push notifications</div>
        <p className="settings-section-desc">
          Get notified on your phone.
        </p>
        <div className="settings-card">
          <ToggleRow
            icon="fa-heart"
            iconColor="#ff3b81"
            label="New matches"
            description="When you match with someone new"
            value={settings.pushNewMatches}
            onChange={() => settings.toggle('pushNewMatches')}
          />
          <ToggleRow
            icon="fa-comment"
            iconColor="#4f8cff"
            label="New messages"
            description="When a match sends you a message"
            value={settings.pushNewMessages}
            onChange={() => settings.toggle('pushNewMessages')}
          />
          <ToggleRow
            icon="fa-star"
            iconColor="#ffb020"
            label="Likes"
            description="When someone likes your profile"
            value={settings.pushLikes}
            onChange={() => settings.toggle('pushLikes')}
          />
          <ToggleRow
            icon="fa-bullhorn"
            iconColor="#8b5cf6"
            label="Promotions"
            description="Special offers and new features"
            value={settings.pushPromotions}
            onChange={() => settings.toggle('pushPromotions')}
          />
        </div>
      </div>

      {/* Email */}
      <div className="settings-section">
        <div className="settings-section-title">Email</div>
        <p className="settings-section-desc">
          Emails sent to your registered address.
        </p>
        <div className="settings-card">
          <ToggleRow
            icon="fa-envelope"
            iconColor="#4f8cff"
            label="New matches"
            value={settings.emailNewMatches}
            onChange={() => settings.toggle('emailNewMatches')}
          />
          <ToggleRow
            icon="fa-envelope"
            iconColor="#4f8cff"
            label="New messages"
            value={settings.emailNewMessages}
            onChange={() => settings.toggle('emailNewMessages')}
          />
          <ToggleRow
            icon="fa-envelope"
            iconColor="#8b5cf6"
            label="Promotions"
            value={settings.emailPromotions}
            onChange={() => settings.toggle('emailPromotions')}
          />
          <ToggleRow
            icon="fa-shield-halved"
            iconColor="#35d07f"
            label="Safety alerts"
            description="Important security updates"
            value={settings.emailSafety}
            onChange={() => settings.toggle('emailSafety')}
          />
        </div>
      </div>

      {/* SMS */}
      <div className="settings-section">
        <div className="settings-section-title">SMS</div>
        <div className="settings-card">
          <ToggleRow
            icon="fa-message"
            iconColor="#35d07f"
            label="Security codes"
            description="OTP and verification codes"
            value={settings.smsSecurity}
            onChange={() => settings.toggle('smsSecurity')}
          />
        </div>
      </div>
    </div>
  );
}