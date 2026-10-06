// =========================================================
// MYNVORA — MESSAGE INPUT (with typing indicator)
// =========================================================

import { useState, useRef, useEffect } from 'react';

export default function MessageInput({
  onSend,
  onTyping,
  placeholder = 'Type a message...',
}) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Stop typing
    if (isTypingRef.current && onTyping) {
      onTyping(false);
      isTypingRef.current = false;
    }
    clearTimeout(typingTimerRef.current);

    onSend?.(trimmed);
    setText('');
    inputRef.current?.focus();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    // Emit typing: true on first keystroke
    if (value.length > 0 && !isTypingRef.current && onTyping) {
      onTyping(true);
      isTypingRef.current = true;
    }

    // Auto-stop typing after 2s of no input
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      if (isTypingRef.current && onTyping) {
        onTyping(false);
        isTypingRef.current = false;
      }
    }, 2000);

    // If cleared, stop typing immediately
    if (value.length === 0 && isTypingRef.current && onTyping) {
      onTyping(false);
      isTypingRef.current = false;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mi-bar">
      <button className="mi-icon" aria-label="Attach">
        <i className="fa-solid fa-plus" />
      </button>

      <input
        ref={inputRef}
        className="mi-input"
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (isTypingRef.current && onTyping) {
            onTyping(false);
            isTypingRef.current = false;
          }
        }}
      />

      {text.trim() ? (
        <button className="mi-send" onClick={handleSend} aria-label="Send">
          <i className="fa-solid fa-paper-plane" />
        </button>
      ) : (
        <button className="mi-icon" aria-label="Camera">
          <i className="fa-solid fa-camera" />
        </button>
      )}
    </div>
  );
}