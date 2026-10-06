// =========================================================
// MYNVORA — LEGAL
// Terms · Privacy · Cookies · Privacy Preferences
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LEGAL_DOCS = [
  {
    id: 'terms',
    icon: 'fa-file-contract',
    color: '#4f8cff',
    title: 'Terms of Service',
    description: 'Rules for using Mynvora',
    sections: [
      {
        h: '1. Acceptance of terms',
        p: 'By creating a Mynvora account you agree to these Terms. If you do not agree, do not use the app.'
      },
      {
        h: '2. Eligibility',
        p: 'You must be at least 16 years old. Users 16–17 have restricted features. Users 18+ have full access. Age verification is required.'
      },
      {
        h: '3. Your account',
        p: 'You are responsible for your account credentials. Do not share your login. Report suspicious activity to safety@mynvora.app.'
      },
      {
        h: '4. Community rules',
        p: 'No harassment, hate speech, nudity in public areas, impersonation, spam, or illegal content. Violations result in suspension or ban.'
      },
      {
        h: '5. Subscriptions',
        p: 'Light ₹99/week, Gold ₹199/week, Diamond ₹399/week. Auto-renews unless cancelled. Subscriptions never override safety or age rules.'
      }
    ]
  },
  {
    id: 'privacy',
    icon: 'fa-shield-halved',
    color: '#35d07f',
    title: 'Privacy Policy',
    description: 'How we handle your data',
    sections: [
      {
        h: '1. What we collect',
        p: 'Account info (email, phone, birthdate), profile info (photos, bio), approximate location, usage data, device info. We never store your exact GPS.'
      },
      {
        h: '2. How we use it',
        p: 'To match you with others, verify identity, keep the community safe, and improve the app. We do not sell your data.'
      },
      {
        h: '3. Location',
        p: 'We use approximate location (rounded to ~5 km) to show nearby people. You can disable location in Settings.'
      },
      {
        h: '4. Your rights',
        p: 'You can access, export, correct, or delete your data at any time. Delete your account from Settings → Delete Account.'
      },
      {
        h: '5. Sharing',
        p: 'We share data only with service providers (verification, payments) under strict contracts. We do not share with advertisers.'
      }
    ]
  },
  {
    id: 'cookies',
    icon: 'fa-cookie-bite',
    color: '#ffb020',
    title: 'Cookie Policy',
    description: 'How we use cookies',
    sections: [
      {
        h: '1. Essential cookies',
        p: 'Required for login, security, and core features. Cannot be disabled.'
      },
      {
        h: '2. Analytics cookies',
        p: 'Help us understand how the app is used so we can improve it. You can opt out.'
      },
      {
        h: '3. Marketing cookies',
        p: 'Used to show relevant promotions. You can opt out at any time.'
      }
    ]
  },
  {
    id: 'guidelines',
    icon: 'fa-handshake',
    color: '#8b5cf6',
    title: 'Community Guidelines',
    description: 'How we treat each other',
    sections: [
      {
        h: 'Be real',
        p: 'Use your own photos. No fake profiles, no impersonation, no AI-generated images of yourself.'
      },
      {
        h: 'Be kind',
        p: 'Treat everyone with respect. No harassment, hate speech, or threats. Report anything that feels wrong.'
      },
      {
        h: 'Be safe',
        p: 'Meet in public places. Tell a friend where you\'re going. Video call before meeting. Trust your instincts.'
      },
      {
        h: 'No minors',
        p: 'Mynvora is strictly 16+. Users 16–17 have restricted features and cannot interact with 18+ accounts.'
      }
    ]
  }
];

export default function Legal() {
  const navigate = useNavigate();
  const [openDoc, setOpenDoc] = useState(null);

  if (openDoc) {
    const doc = LEGAL_DOCS.find((d) => d.id === openDoc);
    return (
      <div className="settings-screen">
        <div className="settings-page-head">
          <button
            className="back-btn-inline"
            onClick={() => setOpenDoc(null)}
          >
            <i className="fa-solid fa-arrow-left" />
          </button>
          <h1>{doc.title}</h1>
          <div style={{ width: 44 }} />
        </div>

        <div className="legal-doc">
          <div className="legal-doc-meta">
            Last updated: 1 October 2026
          </div>

          {doc.sections.map((s, i) => (
            <div className="legal-section" key={i}>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
          ))}

          <div className="legal-footer">
            Questions? Email legal@mynvora.app
          </div>
        </div>
      </div>
    );
  }

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
            onClick={() => setOpenDoc(d.id)}
          >
            <div
              className="legal-item-icon"
              style={{
                background: `${d.color}22`,
                color: d.color
              }}
            >
              <i className={`fa-solid ${d.icon}`} />
            </div>
            <div className="legal-item-body">
              <div className="legal-item-title">{d.title}</div>
              <div className="legal-item-sub">{d.description}</div>
            </div>
            <i className="fa-solid fa-chevron-right legal-item-arrow" />
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
              alert('Privacy preference centre (demo)')
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
              alert('Data export link sent to your email (demo)')
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
                Download everything we have about you
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