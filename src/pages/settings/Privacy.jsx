// =========================================================
// MYNVORA — PRIVACY & VISIBILITY
// Control who sees what and who can message you.
// =========================================================

import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../store/settingsStore.js';
import ToggleRow from '../../components/ToggleRow.jsx';
import { WHO_CAN_MESSAGE } from '../../data/profileOptions.js';

export default function Privacy() {
  const navigate = useNavigate();
  const settings = useSettingsStore();

  return (
    <div className="settings-screen">
      {/* Header */}
      <div className="settings-page-head">
        <button className="back-btn-inline" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Privacy & Safety</h1>
        <div style={{ width: 44 }} />
      </div>

      {/* Activity status */}
      <div className="settings-section">
        <div className="settings-section-title">Activity Status</div>
        <p className="settings-section-desc">
          Control what others can see about your activity.
        </p>

        <div className="settings-card">
          <ToggleRow
            icon="fa-circle-dot"
            iconColor="#35d07f"
            label="Show recently active"
            description="Let matches see when you were last online"
            value={settings.showRecentActivity}
            onChange={() => settings.toggle('showRecentActivity')}
          />
          <ToggleRow
            icon="fa-signal"
            iconColor="#4f8cff"
            label="Show online status"
            description="Green dot when you're in the app"
            value={settings.showOnlineStatus}
            onChange={() => settings.toggle('showOnlineStatus')}
          />
        </div>
      </div>

      {/* Visibility */}
      <div className="settings-section">
        <div className="settings-section-title">Visibility</div>
        <p className="settings-section-desc">
          Choose how visible you are on Mynvora.
        </p>

        <div className="visibility-options">
          <button
            className={`visibility-card ${
              settings.visibility === 'standard' ? 'active' : ''
            }`}
            onClick={() => settings.setVisibility('standard')}
          >
            <div className="visibility-icon">
              <i className="fa-solid fa-eye" />
            </div>
            <div className="visibility-body">
              <div className="visibility-label">Standard</div>
              <div className="visibility-desc">
                Visible in Discover and Explore
              </div>
            </div>
            <span className="visibility-radio">
              {settings.visibility === 'standard' && (
                <span className="visibility-radio-dot" />
              )}
            </span>
          </button>

          <button
            className={`visibility-card ${
              settings.visibility === 'incognito' ? 'active' : ''
            }`}
            onClick={() => settings.setVisibility('incognito')}
          >
            <div className="visibility-icon purple">
              <i className="fa-solid fa-moon" />
            </div>
            <div className="visibility-body">
              <div className="visibility-label">
                Incognito Mode
                <span className="visibility-diamond">💎 Diamond</span>
              </div>
              <div className="visibility-desc">
                Only people you like can see you
              </div>
            </div>
            <span className="visibility-radio">
              {settings.visibility === 'incognito' && (
                <span className="visibility-radio-dot" />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Who can message me */}
      <div className="settings-section">
        <div className="settings-section-title">Who can message me</div>
        <p className="settings-section-desc">
          Choose who can start a conversation with you.
        </p>

        <div className="who-message-grid">
          {WHO_CAN_MESSAGE.map((opt) => {
            const active = settings.whoCanMessage === opt.id;
            return (
              <button
                key={opt.id}
                className={`who-message-card ${active ? 'active' : ''}`}
                onClick={() => settings.setWhoCanMessage(opt.id)}
              >
                <div className="who-message-icon">{opt.icon}</div>
                <div className="who-message-label">{opt.label}</div>
                <div className="who-message-desc">{opt.description}</div>
                {active && (
                  <div className="who-message-check">
                    <i className="fa-solid fa-check" /> Selected
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety */}
      <div className="settings-section">
        <div className="settings-section-title">Safety</div>

        <div className="settings-card">
          <button
            className="settings-section-item"
            onClick={() => navigate('/settings/blocked')}
          >
            <div className="settings-section-icon danger">
              <i className="fa-solid fa-user-slash" />
            </div>
            <div className="settings-section-body">
              <div className="settings-section-label">
                Blocked Contacts
              </div>
              <div className="settings-section-sub">
                Manage blocked people
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-section-arrow" />
          </button>
        </div>
      </div>
    </div>
  );
}