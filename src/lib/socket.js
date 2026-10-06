// =========================================================
// MYNVORA — SOCKET.IO CLIENT
// =========================================================

import { io } from 'socket.io-client';
import { tokens } from './api.js';

let socket = null;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function connectSocket() {
  if (socket && socket.connected) return socket;

  const token = tokens.access;
  if (!token) {
    console.warn('No access token — cannot connect socket');
    return null;
  }

  socket = io(API_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('Socket connection error:', err.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}

export function joinMatchRoom(matchId) {
  if (socket && socket.connected) {
    socket.emit('join_match', { matchId });
  }
}

export function leaveMatchRoom(matchId) {
  if (socket && socket.connected) {
    socket.emit('leave_match', { matchId });
  }
}

export function sendMessageViaSocket(matchId, body, tempId) {
  return new Promise((resolve) => {
    if (!socket || !socket.connected) return resolve({ ok: false });
    socket.emit(
      'send_message',
      { matchId, body, tempId },
      (response) => resolve(response || { ok: false })
    );
  });
}

export function emitTyping(matchId, isTyping) {
  if (socket && socket.connected) {
    socket.emit('typing', { matchId, isTyping });
  }
}

export function emitMarkSeen(matchId) {
  if (socket && socket.connected) {
    socket.emit('mark_seen', { matchId });
  }
}