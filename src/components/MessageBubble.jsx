// =========================================================
// MYNVORA — MESSAGE BUBBLE
// One chat message — mine (right, pink) or theirs (left, glass).
// Includes read-receipt ticks for my messages.
// =========================================================

export default function MessageBubble({ message, seen = true }) {
  const isMe = message.from === 'me';

  return (
    <div className={`mb-wrap ${isMe ? 'mb-me' : 'mb-them'}`}>
      {/* Avatar on their side only */}
      {!isMe && message.avatar && (
        <div className="mb-avatar">
          <img src={message.avatar} alt="" />
        </div>
      )}

      <div className={`mb-bubble ${isMe ? 'mb-bubble-me' : 'mb-bubble-them'}`}>
        <div className="mb-text">{message.text}</div>

        <div className="mb-meta">
          <span className="mb-time">{message.time}</span>

          {/* Read receipts for my messages */}
          {isMe && (
            <span className={`mb-ticks ${seen ? 'mb-ticks-seen' : ''}`}>
              <i className="fa-solid fa-check" />
              <i className="fa-solid fa-check" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}