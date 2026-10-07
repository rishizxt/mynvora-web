// =========================================================
// MYNVORA — LEGAL
// Links to public legal HTML pages (open in new tab).
// =========================================================

import { useNavigate } from 'react-router-dom';

const LEGAL_DOCS = [
  {
    id: 'terms',
    icon: 'fa-file-contract',
    color: '#4f8cff',
    title: 'Terms of Service',
    description: 'Rules for using Mynvora',
    href: '/terms.html',
  },
  {
    id: 'privacy',
    icon: 'fa-shield-halved',
    color: '#35d07f',
    title: 'Privacy Policy',
    description: 'How we handle your data',
    href: '/privacy.html',
  },
  {
    id: 'cookies',
    icon: 'fa-cookie-bite',
    color: '#ffb020',
    title: 'Cookie Policy',
    description: 'How we use cookies',
    href: '/cookie-policy.html',
  },
  {
    id: 'guidelines',
    icon: 'fa-handshake',
    color: '#8b5cf6',
    title: 'Community Guidelines',
    description: 'How we treat each other',
    href: '/community-guidelines.html',
  },
  {
    id: 'safety',
    icon: 'fa-life-ring',
    color: '#22c55e',
    title: 'Safety Tips',
    description: 'Stay safe on and off the app',
    href: '/safety-tips.html',
  },
  {
    id: 'grievance',
    icon: 'fa-scale-balanced',
    color: '#f97316',
    title: 'Grievance Redressal',
    description: 'File a complaint (India IT Rules)',
    href: '/grievance.html',
  },
];

export default function Legal() {
  const navigate = useNavigate();

  const openDoc = (href) => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="settings-screen">
      {/* Header */}
      <div className="settings-page-head">
        <button className="back-btn-inline" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Terms & Privacy</h1>
        <div style={{ width: 44 }} />
      </div>

      {/* Hero */}
      <div className="legal-hero">
        <div className="legal-hero-icon">
          <i className="fa-solid fa-file-shield" />
        </div>
        <h2>Legal & Privacy</h2>
        <p>Everything you need to know about how Mynvora works.</p>
      </div>

      {/* Documents */}
      <div className="legal-list">
        {LEGAL_DOCS.map((d) => (
          <button
            key={d.id}
            className="legal-item"
            onClick={() => openDoc(d.href)}
          >
            <div
              className="legal-item-icon"
              style={{
                background: `${d.color}22`,
                color: d.color,
              }}
            >
              <i className={`fa-solid ${d.icon}`} />
            </div>
            <div className="legal-item-body">
              <div className="legal-item-title">{d.title}</div>
              <div className="legal-item-sub">{d.description}</div>
            </div>
            <i className="fa-solid fa-arrow-up-right-from-square legal-item-arrow" />
          </button>
        ))}
      </div>

      {/* Privacy Preferences */}
      <div className="settings-section" style={{ marginTop: 24 }}>
        <div className="settings-section-title">Privacy Preferences</div>

        <div className="settings-card">
          <button
            className="settings-section-item"
            onClick={() =>
              window.open('/cookie-policy.html', '_blank', 'noopener,noreferrer')
            }
          >
            <div className="settings-section-icon">
              <i className="fa-solid fa-sliders" />
            </div>
            <div className="settings-section-body">
              <div className="settings-section-label">
                Manage privacy preferences
              </div>
              <div className="settings-section-sub">
                Analytics, marketing, data sharing
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-section-arrow" />
          </button>

          <button
            className="settings-section-item"
            onClick={() =>
              window.open(
                'mailto:mynvora@gmail.com?subject=Data%20export%20request',
                '_blank'
              )
            }
          >
            <div className="settings-section-icon">
              <i className="fa-solid fa-download" />
            </div>
            <div className="settings-section-body">
              <div className="settings-section-label">
                Request my data
              </div>
              <div className="settings-section-sub">
                Email us to receive a copy of your data
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-section-arrow" />
          </button>

          <button
            className="settings-section-item"
            onClick={() => navigate('/settings/delete-account')}
          >
            <div className="settings-section-icon">
              <i className="fa-solid fa-trash" />
            </div>
            <div className="settings-section-body">
              <div className="settings-section-label">
                Delete my account
              </div>
              <div className="settings-section-sub">
                Permanently remove your data
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-section-arrow" />
          </button>
        </div>
      </div>

      <div className="settings-footer">
        © 2026 Mynvora · All rights reserved
      </div>
    </div>
  );
}