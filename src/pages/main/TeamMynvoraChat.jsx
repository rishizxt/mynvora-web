// =========================================================
// MYNVORA — TEAM MYNVORA CHAT
// Read-only chat with admin announcements.
// Sponsored ad cards are interleaved between announcements.
// =========================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnnouncementStore } from '../../store/announcementStore.js';
import { useUserStore } from '../../store/userStore.js';
import { fetchAds } from '../../lib/adsApi.js';
import SponsoredCard from '../../components/SponsoredCard.jsx';

export default function TeamMynvoraChat() {
  const navigate = useNavigate();
  const announcements = useAnnouncementStore((s) => s.announcements);
  const markAllRead = useAnnouncementStore((s) => s.markAllRead);
  const fetchAnnouncements = useAnnouncementStore((s) => s.fetchAnnouncements);
  const fetched = useAnnouncementStore((s) => s.fetched);

  const tier = useUserStore((s) => s.tier);
  const ageGroup = useUserStore((s) => s.ageGroup);

  const [ads, setAds] = useState([]);

  /* ── load announcements if not already loaded ─────── */
  useEffect(() => {
    if (!fetched) fetchAnnouncements();
  }, [fetched, fetchAnnouncements]);

  /* ── fetch ads (matched to user's tier + age group) ─ */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await fetchAds({
        tier: tier || null,
        ageGroup: ageGroup || null,
        limit: 5,
      });
      if (!cancelled) setAds(list);
    })();
    return () => { cancelled = true; };
  }, [tier, ageGroup]);

  const handleBack = () => {
    markAllRead();
    navigate('/chat');
  };

  /* ── interleave: ad after every 2nd announcement ──── */
  const renderFeed = () => {
    const blocks = [];
    let adIndex = 0;

    announcements.forEach((a, i) => {
      blocks.push(
        <div className="ann-bubble" key={a.id}>
          <div
            className="ann-bubble-icon"
            style={{ background: `${a.color}22`, color: a.color }}
          >
            <i className={`fa-solid ${a.icon || 'fa-bullhorn'}`} />
          </div>
          <div className="ann-bubble-body">
            <div className="ann-bubble-title">{a.title}</div>
            <div className="ann-bubble-text">{a.body}</div>
            <div className="ann-bubble-time">
              {new Date(a.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
              })}
            </div>
          </div>
        </div>
      );

      // After every 2nd announcement, inject an ad (if any left)
      if ((i + 1) % 2 === 0 && adIndex < ads.length) {
        blocks.push(
          <SponsoredCard key={`ad-${ads[adIndex].id}`} ad={ads[adIndex]} />
        );
        adIndex += 1;
      }
    });

    // Any leftover ads go at the bottom
    while (adIndex < ads.length) {
      blocks.push(
        <SponsoredCard key={`ad-${ads[adIndex].id}`} ad={ads[adIndex]} />
      );
      adIndex += 1;
    }

    return blocks;
  };

  return (
    <div className="cr-screen">
      {/* Header */}
      <div className="cr-topbar">
        <button
          className="cr-back"
          onClick={handleBack}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>

        <div className="cr-user" style={{ cursor: 'default' }}>
          <div className="cr-avatar-wrap">
            <div
              className="admin-chat-avatar"
              style={{ width: 42, height: 42, fontSize: 18 }}
            >
              <i className="fa-solid fa-fire" />
            </div>
          </div>
          <div className="cr-user-info">
            <div className="cr-name">
              Team Mynvora
              <i className="fa-solid fa-circle-check cr-verified" />
            </div>
            <div className="cr-status">Official updates</div>
          </div>
        </div>

        <div style={{ width: 40 }} />
      </div>

      {/* Messages */}
      <div className="cr-messages">
        <div className="cr-intro">
          <div
            className="admin-chat-avatar"
            style={{ width: 84, height: 84, fontSize: 34, margin: '0 auto 14px' }}
          >
            <i className="fa-solid fa-fire" />
          </div>
          <h2>Welcome to Mynvora</h2>
          <p>You'll see updates from our team here</p>
        </div>

        {renderFeed()}
      </div>

      {/* Footer note */}
      <div
        className="mi-bar"
        style={{ justifyContent: 'center', padding: '20px' }}
      >
        <p style={{ fontSize: 12, color: '#777789', textAlign: 'center' }}>
          This is an announcement channel. Replies aren't monitored.
        </p>
      </div>
    </div>
  );
}