// =========================================================
// MYNVORA — BLOCKED CONTACTS
// Block by phone OR email (chosen via two-button tabs).
// Not both at once — one clean method.
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../store/settingsStore.js';

export default function BlockedContacts() {
  const navigate = useNavigate();
  const settings = useSettingsStore();

  const [showAdd, setShowAdd] = useState(false);
  const [input, setInput] = useState('');
  const [type, setType] = useState('phone');    // 'phone' | 'email'

  const blocked = settings.blockedContacts || [];

  const addContact = () => {
    const value = input.trim();
    if (!value) return;
    settings.addBlockedContact(value);
    setInput('');
    setShowAdd(false);
  };

  const removeContact = (value) => {
    if (confirm(`Unblock ${value}?`)) {
      settings.removeBlockedContact(value);
    }
  };

  return (
    <div className="settings-screen">
      {/* Header */}
      <div className="settings-page-head">
        <button
          className="settings-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Blocked Contacts</h1>
        <button
          className="settings-page-add"
          onClick={() => setShowAdd(true)}
          aria-label="Add"
        >
          <i className="fa-solid fa-plus" />
        </button>
      </div>

      {/* Info banner */}
      <div className="info-banner">
        <i className="fa-solid fa-shield-halved" />
        <p>
          Blocked contacts cannot find you on Mynvora — even if they create
          a new account with the same phone or email.
        </p>
      </div>

      {/* List or empty */}
      {blocked.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">
            <i className="fa-solid fa-user-slash" />
          </div>
          <p>No blocked contacts</p>
          <span>Add a phone number or email to block someone</span>
          <button
            className="btn-primary"
            onClick={() => setShowAdd(true)}
            style={{ marginTop: 20, maxWidth: 260 }}
          >
            Block a contact <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      ) : (
        <>
          <div className="blocked-list-head">
            {blocked.length} blocked
          </div>

          <div className="blocked-list">
            {blocked.map((value) => (
              <div className="blocked-item" key={value}>
                <div className="blocked-item-icon">
                  <i
                    className={`fa-solid ${
                      value.includes('@') ? 'fa-envelope' : 'fa-phone'
                    }`}
                  />
                </div>
                <div className="blocked-item-body">
                  <div className="blocked-item-value">{value}</div>
                  <div className="blocked-item-sub">
                    {value.includes('@') ? 'Email blocked' : 'Phone blocked'}
                  </div>
                </div>
                <button
                  className="blocked-item-action"
                  onClick={() => removeContact(value)}
                  aria-label="Unblock"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add modal */}
      {showAdd && (
        <div className="modal-scrim" onClick={() => setShowAdd(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <i className="fa-solid fa-user-slash" />
            </div>

            <h2 className="modal-title">Block a contact</h2>
            <p className="modal-sub">
              Choose one method — phone or email.
            </p>

            {/* Phone / Email tabs */}
            <div className="method-tabs" style={{ marginBottom: 18 }}>
              <button
                type="button"
                className={`method-tab ${type === 'phone' ? 'active' : ''}`}
                onClick={() => { setType('phone'); setInput(''); }}
              >
                📱 Phone
              </button>
              <button
                type="button"
                className={`method-tab ${type === 'email' ? 'active' : ''}`}
                onClick={() => { setType('email'); setInput(''); }}
              >
                📧 Email
              </button>
            </div>

            <div className="field">
              <input
                type={type === 'phone' ? 'tel' : 'email'}
                placeholder={
                  type === 'phone' ? '+91 98765 43210' : 'user@example.com'
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
            </div>

            <button
              className="btn-primary"
              onClick={addContact}
              disabled={!input.trim()}
            >
              Block contact <i className="fa-solid fa-arrow-right" />
            </button>

            <button
              className="btn-ghost"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}