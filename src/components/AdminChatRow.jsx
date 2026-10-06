// =========================================================
// MYNVORA — ADMIN CHAT ROW
// "Team Mynvora" pinned row in Chat list.
// Shows latest admin announcement (fetched from backend).
// =========================================================

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnnouncementStore } from '../store/announcementStore.js';

export default function AdminChatRow() {
  const navigate = useNavigate();
  const latest = useAnnouncementStore((s) => s.latest());
  const hasUnread = useAnnouncementStore((s) => s.hasUnread());
  const fetchAnnouncements = useAnnouncementStore((s) => s.fetchAnnouncements);
  const fetched = useAnnouncementStore((s) => s.fetched);

  useEffect(() => {
    if (!fetched) fetchAnnouncements();
  }, [fetched, fetchAnnouncements]);

  if (!latest) return null;

  const formatTime = (ms) => {
    const diff = Date.now() - ms;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d`;
    return `${Math.floor(days / 7)}w`;
  };

  return (
    <button
      className={`admin-chat-row ${hasUnread ? 'has-unread' : ''}`}
      onClick={() => navigate('/chat/team-mynvora')}
    >
      <div
        className="admin-chat-avatar"
        style={
          latest.color
            ? { background: `linear-gradient(135deg, ${latest.color}, #8b5cf6)` }
            : undefined
        }
      >
        <i className={`fa-solid ${latest.icon || 'fa-fire'}`} />
      </div>

      <div className="admin-chat-body">
        <div className="admin-chat-top">
          <div className="admin-chat-name">
            Team Mynvora
            <span className="admin-chat-verified">
              <i className="fa-solid fa-circle-check" />
            </span>
          </div>
          <div className="admin-chat-time">
            {formatTime(latest.createdAt)}
          </div>
        </div>

        <div className="admin-chat-bottom">
          <div className="admin-chat-msg">
            {latest.title}: {latest.body.slice(0, 40)}
            {latest.body.length > 40 ? '…' : ''}
          </div>
          {hasUnread && <span className="admin-chat-dot" />}
        </div>
      </div>
    </button>
  );
}