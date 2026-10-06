// =========================================================
// MYNVORA — CHAT ROOM (real-time via Socket.IO)
// =========================================================

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MessageBubble from '../../components/MessageBubble.jsx';
import MessageInput from '../../components/MessageInput.jsx';
import api from '../../lib/api.js';
import {
  getSocket,
  joinMatchRoom,
  leaveMatchRoom,
  emitTyping,
  emitMarkSeen,
} from '../../lib/socket.js';

function formatTime(iso) {
  const d = new Date(iso);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export default function ChatRoom() {
  const { id: matchId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typing, setTyping] = useState(false);

  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  // Load match info + initial messages
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const list = await api.get('/match/list');
        if (cancelled) return;
        const thisMatch = (list.data.matches || []).find(
          (m) => m.match_id === matchId
        );
        if (!thisMatch) {
          setError("This conversation doesn't exist");
          return;
        }
        setOtherUser(thisMatch);

        const msgs = await api.get(`/chat/${matchId}/messages`);
        if (cancelled) return;

        const me = JSON.parse(localStorage.getItem('mynvora_user') || '{}');
        const myId = me.id;

        setMessages(
          (msgs.data.messages || []).map((m) => ({
            id: m.id,
            from: m.sender_id === myId ? 'me' : 'them',
            text: m.body || '',
            imageUrl: m.image_url,
            time: formatTime(m.created_at),
            seenAt: m.seen_at,
          }))
        );

        try { await api.post(`/chat/${matchId}/seen`); } catch {}
      } catch (err) {
        console.warn('Chat load failed:', err.message);
        setError('Could not load conversation');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [matchId]);

  // Socket listeners
  useEffect(() => {
    if (loading || error) return;

    const socket = getSocket();
    if (!socket) return;

    joinMatchRoom(matchId);

    const myId = JSON.parse(localStorage.getItem('mynvora_user') || '{}').id;

    const handleNewMessage = (payload) => {
      if (payload.matchId !== matchId) return;
      const m = payload.message;
      const from = m.sender_id === myId ? 'me' : 'them';

      setMessages((prev) => {
        if (prev.some((x) => x.id === m.id)) return prev;

        // Replace optimistic
        const tempIdx = prev.findIndex(
          (x) => x.id.startsWith('temp_') && x.text === m.body && from === 'me'
        );
        if (tempIdx >= 0) {
          const next = [...prev];
          next[tempIdx] = {
            id: m.id,
            from,
            text: m.body,
            imageUrl: m.image_url,
            time: formatTime(m.created_at),
            seenAt: m.seen_at,
          };
          return next;
        }

        return [
          ...prev,
          {
            id: m.id,
            from,
            text: m.body,
            imageUrl: m.image_url,
            time: formatTime(m.created_at),
            seenAt: m.seen_at,
          },
        ];
      });

      if (from === 'them') {
        emitMarkSeen(matchId);
      }
    };

    const handleTyping = (payload) => {
      if (payload.matchId !== matchId) return;
      if (payload.userId === myId) return;

      setTyping(!!payload.isTyping);

      if (payload.isTyping) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTyping(false), 3000);
      }
    };

    const handleSeen = (payload) => {
      if (payload.matchId !== matchId) return;
      setMessages((prev) =>
        prev.map((m) => (m.from === 'me' ? { ...m, seenAt: Date.now() } : m))
      );
    };

    socket.on('new_message', handleNewMessage);
    socket.on('typing', handleTyping);
    socket.on('messages_seen', handleSeen);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('typing', handleTyping);
      socket.off('messages_seen', handleSeen);
      leaveMatchRoom(matchId);
      clearTimeout(typingTimeoutRef.current);
    };
  }, [matchId, loading, error]);

  // Send message (optimistic + socket, REST fallback)
  const handleSend = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const tempId = `temp_${Date.now()}`;
    const now = new Date();
    const optimistic = {
      id: tempId,
      from: 'me',
      text: trimmed,
      time: formatTime(now),
    };
    setMessages((prev) => [...prev, optimistic]);

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit(
        'send_message',
        { matchId, body: trimmed, tempId },
        (response) => {
          if (!response?.ok) sendViaRest(trimmed, tempId);
        }
      );
    } else {
      sendViaRest(trimmed, tempId);
    }

    emitTyping(matchId, false);
  };

  const sendViaRest = async (text, tempId) => {
    try {
      const { data } = await api.post(`/chat/${matchId}/messages`, {
        body: text,
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                id: data.message.id,
                from: 'me',
                text: data.message.body,
                time: formatTime(data.message.created_at),
              }
            : m
        )
      );
    } catch (err) {
      console.warn('Send failed:', err.message);
    }
  };

  const handleTypingInput = (isTyping) => {
    emitTyping(matchId, isTyping);
  };

  const handleBack = () => navigate('/chat');
  const openProfile = () => {
    if (otherUser?.public_id) navigate(`/profile/${otherUser.public_id}`);
  };

  if (loading) {
    return (
      <div className="cr-screen">
        <div className="cr-topbar">
          <button className="cr-back" onClick={handleBack}>
            <i className="fa-solid fa-arrow-left" />
          </button>
          <div className="cr-name">Loading…</div>
          <div style={{ width: 40 }} />
        </div>
      </div>
    );
  }

  if (error || !otherUser) {
    return (
      <div className="cr-screen">
        <div className="cr-topbar">
          <button className="cr-back" onClick={handleBack}>
            <i className="fa-solid fa-arrow-left" />
          </button>
          <div className="cr-name">Chat unavailable</div>
          <div style={{ width: 40 }} />
        </div>
        <div className="empty">
          <i className="fa-regular fa-face-frown" />
          <p>{error || "This conversation doesn't exist"}</p>
        </div>
      </div>
    );
  }

  const photo = otherUser.main_photo;

  return (
    <div className="cr-screen">
      <div className="cr-topbar">
        <button className="cr-back" onClick={handleBack} aria-label="Back">
          <i className="fa-solid fa-arrow-left" />
        </button>

        <button className="cr-user" onClick={openProfile}>
          <div className="cr-avatar-wrap">
            {photo ? (
              <img className="cr-avatar" src={photo} alt={otherUser.first_name} />
            ) : (
              <div
                className="cr-avatar"
                style={{
                  background: 'linear-gradient(135deg, #ff3b81, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                {(otherUser.first_name || '?').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="cr-user-info">
            <div className="cr-name">
              {otherUser.first_name || 'Someone'}
              {otherUser.verified && (
                <i className="fa-solid fa-circle-check cr-verified" />
              )}
            </div>
            <div className="cr-status">{typing ? 'typing…' : 'Matched'}</div>
          </div>
        </button>

        <button className="cr-more" aria-label="More">
          <i className="fa-solid fa-ellipsis-vertical" />
        </button>
      </div>

      <div className="cr-messages" ref={scrollRef}>
        <div className="cr-intro">
          {photo ? (
            <img className="cr-intro-avatar" src={photo} alt={otherUser.first_name} />
          ) : (
            <div
              className="cr-intro-avatar"
              style={{
                background: 'linear-gradient(135deg, #ff3b81, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 34,
              }}
            >
              {(otherUser.first_name || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <h2>You matched with {otherUser.first_name || 'them'}</h2>
          <p>{otherUser.city || 'Say hi 👋'}</p>
        </div>

        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#9e9eb3',
            fontSize: 13
          }}>
            No messages yet — say hi 👋
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} seen={!!m.seenAt} />
        ))}

        {typing && (
          <div className="mb-wrap mb-them">
            <div className="mb-bubble mb-typing">
              <span className="mb-dot" />
              <span className="mb-dot" />
              <span className="mb-dot" />
            </div>
          </div>
        )}
      </div>

      <MessageInput onSend={handleSend} onTyping={handleTypingInput} />
    </div>
  );
}