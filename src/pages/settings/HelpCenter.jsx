// =========================================================
// MYNVORA — HELP & SUPPORT
// FAQ · Contact us · Report a problem · Safety tips
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FAQ_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting started',
    icon: 'fa-rocket',
    color: '#4f8cff',
    questions: [
      {
        q: 'How do I create a good profile?',
        a: 'Add 4–6 clear photos showing your face and interests. Write a short bio (2–3 lines) that shows your personality. Pick interests that matter to you.'
      },
      {
        q: 'What is verification?',
        a: 'Verification confirms you are a real person. Upload a government-issued ID plus a selfie. Our AI checks liveness and face match. Verified users get a blue badge and 2× more matches.'
      },
      {
        q: 'How does matching work?',
        a: "Swipe right to like, left to pass, up for a Super Like. When two people like each other, it's a match — and you can chat."
      }
    ]
  },
  {
    id: 'safety',
    title: 'Safety & privacy',
    icon: 'fa-shield-halved',
    color: '#35d07f',
    questions: [
      {
        q: 'How do I block someone?',
        a: 'Open their profile, tap the ⋮ menu, and select Block. They won\'t be able to find you or message you anywhere on Mynvora.'
      },
      {
        q: 'How do I report inappropriate content?',
        a: 'Tap the ⋮ menu on any profile or message and select Report. Choose a reason and describe what happened. Our safety team reviews reports within hours.'
      },
      {
        q: 'Is my exact location shared?',
        a: 'No. We only show an approximate distance (e.g. "2 km away") rounded to protect you. We never share your exact GPS coordinates.'
      }
    ]
  },
  {
    id: 'subscription',
    title: 'Subscription',
    icon: 'fa-crown',
    color: '#ff3b81',
    questions: [
      {
        q: 'How do I cancel my subscription?',
        a: 'Open Settings → Payments → Cancel subscription. You keep access until the end of your billing period. No refunds for partial weeks.'
      },
      {
        q: 'How do I restore a Google Play purchase?',
        a: 'Open Settings → Payments → Restore purchases. We\'ll link your Google Play / App Store subscription to your account.'
      },
      {
        q: 'What\'s the difference between Light, Gold, and Diamond?',
        a: 'Light unlocks unlimited likes. Gold adds voice calls and read receipts. Diamond unlocks everything — unlimited swipes, video calls, Travel Mode, Incognito, and Hookups access.'
      }
    ]
  },
  {
    id: 'account',
    title: 'Account & data',
    icon: 'fa-user-gear',
    color: '#8b5cf6',
    questions: [
      {
        q: 'How do I change my phone number?',
        a: 'Settings → Account → Change phone. We\'ll send an SMS OTP to the new number to verify it.'
      },
      {
        q: 'How do I delete my account?',
        a: 'Settings → Delete Account. This is permanent — all photos, matches, and messages will be removed. You have 30 days to reactivate by logging in again.'
      },
      {
        q: 'Can I pause my account?',
        a: 'Yes. Settings → Account → Pause profile hides you from Discover. You can unpause any time.'
      }
    ]
  }
];

export default function HelpCenter() {
  const navigate = useNavigate();

  const [openCategory, setOpenCategory] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: '',
    description: ''
  });

  const toggleCategory = (id) => {
    setOpenCategory((c) => (c === id ? null : id));
    setOpenFaq(null);
  };

  const submitContact = () => {
    if (!contactForm.subject || !contactForm.description) return;
    alert('Message sent to support@mynvora.app (demo)');
    setShowContact(false);
    setContactForm({ subject: '', description: '' });
  };

  return (
    <div className="settings-screen">
      {/* Header */}
      <div className="settings-page-head">
        <button className="back-btn-inline" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Help & Support</h1>
        <div style={{ width: 44 }} />
      </div>

      {/* Hero */}
      <div className="help-hero">
        <div className="help-hero-icon">
          <i className="fa-solid fa-circle-question" />
        </div>
        <h2>How can we help?</h2>
        <p>Browse common questions or reach out to our team.</p>
      </div>

      {/* Quick actions */}
      <div className="help-actions">
        <button
          className="help-action-card"
          onClick={() => setShowContact(true)}
        >
          <i className="fa-solid fa-envelope" />
          <div>
            <div className="help-action-title">Contact us</div>
            <div className="help-action-sub">We reply within 24h</div>
          </div>
        </button>

        <button
          className="help-action-card"
          onClick={() => setShowContact(true)}
        >
          <i className="fa-solid fa-bug" />
          <div>
            <div className="help-action-title">Report a problem</div>
            <div className="help-action-sub">Something not working?</div>
          </div>
        </button>

        <button
          className="help-action-card"
          onClick={() => navigate('/settings/privacy')}
        >
          <i className="fa-solid fa-shield-halved" />
          <div>
            <div className="help-action-title">Safety centre</div>
            <div className="help-action-sub">Tips and rules</div>
          </div>
        </button>
      </div>

      {/* FAQ */}
      <div className="settings-section">
        <div className="settings-section-title">Frequently asked</div>

        {FAQ_CATEGORIES.map((cat) => {
          const isOpen = openCategory === cat.id;

          return (
            <div className="faq-category" key={cat.id}>
              <button
                className={`faq-category-head ${isOpen ? 'open' : ''}`}
                onClick={() => toggleCategory(cat.id)}
              >
                <div
                  className="faq-category-icon"
                  style={{
                    background: `${cat.color}22`,
                    color: cat.color
                  }}
                >
                  <i className={`fa-solid ${cat.icon}`} />
                </div>
                <span className="faq-category-title">{cat.title}</span>
                <i
                  className={`fa-solid fa-chevron-${
                    isOpen ? 'up' : 'down'
                  } faq-category-arrow`}
                />
              </button>

              {isOpen && (
                <div className="faq-questions">
                  {cat.questions.map((f, idx) => {
                    const qKey = `${cat.id}-${idx}`;
                    const qOpen = openFaq === qKey;

                    return (
                      <div className="faq-question" key={qKey}>
                        <button
                          className="faq-question-head"
                          onClick={() =>
                            setOpenFaq(qOpen ? null : qKey)
                          }
                        >
                          <span>{f.q}</span>
                          <i
                            className={`fa-solid fa-plus faq-question-icon ${
                              qOpen ? 'open' : ''
                            }`}
                          />
                        </button>
                        {qOpen && (
                          <div className="faq-answer">{f.a}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact info */}
      <div className="settings-section">
        <div className="settings-section-title">Reach us directly</div>

        <div className="settings-card">
          <a
            href="mailto:support@mynvora.app"
            className="settings-section-item"
          >
            <div className="settings-section-icon">
              <i className="fa-solid fa-envelope" />
            </div>
            <div className="settings-section-body">
              <div className="settings-section-label">
                support@mynvora.app
              </div>
              <div className="settings-section-sub">
                For general help
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-section-arrow" />
          </a>

          <a
            href="mailto:safety@mynvora.app"
            className="settings-section-item"
          >
            <div className="settings-section-icon danger">
              <i className="fa-solid fa-shield-halved" />
            </div>
            <div className="settings-section-body">
              <div className="settings-section-label">
                safety@mynvora.app
              </div>
              <div className="settings-section-sub">
                Report an urgent safety issue
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-section-arrow" />
          </a>
        </div>
      </div>

      {/* Contact modal */}
      {showContact && (
        <div className="modal-scrim" onClick={() => setShowContact(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <i className="fa-solid fa-envelope" />
            </div>

            <h2 className="modal-title">Contact us</h2>
            <p className="modal-sub">
              Describe your issue. We'll reply to your registered email.
            </p>

            <div className="field">
              <label>Subject</label>
              <input
                type="text"
                placeholder="e.g. Can't verify my account"
                value={contactForm.subject}
                onChange={(e) =>
                  setContactForm((f) => ({ ...f, subject: e.target.value }))
                }
              />
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                rows={5}
                placeholder="Tell us what happened..."
                value={contactForm.description}
                onChange={(e) =>
                  setContactForm((f) => ({
                    ...f,
                    description: e.target.value
                  }))
                }
              />
            </div>

            <button
              className="btn-main"
              onClick={submitContact}
              disabled={
                !contactForm.subject.trim() ||
                !contactForm.description.trim()
              }
            >
              Send message <span>→</span>
            </button>

            <button
              className="btn-ghost"
              onClick={() => setShowContact(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}