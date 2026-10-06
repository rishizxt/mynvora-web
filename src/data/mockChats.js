// =========================================================
// MYNVORA — MOCK CHAT HISTORY
// Message threads per profile id. Real backend replaces this.
// =========================================================

export const CHAT_THREADS = {
  u_001: [
    { id: 'm1', from: 'them', text: 'Hey! How was your weekend?', time: '10:21' },
    { id: 'm2', from: 'me',   text: 'Pretty chill, went hiking 🏔️', time: '10:23' },
    { id: 'm3', from: 'them', text: 'Ooh nice! Where did you go?', time: '10:24' },
    { id: 'm4', from: 'me',   text: 'Up to the north ridge, insane views', time: '10:25' },
    { id: 'm5', from: 'them', text: 'Haha that sounds fun 😄', time: '10:26' }
  ],
  u_002: [
    { id: 'm1', from: 'them', text: 'Coffee this week?', time: 'yesterday' },
    { id: 'm2', from: 'me',   text: 'Yes! Thursday?', time: 'yesterday' }
  ],
  u_003: [
    { id: 'm1', from: 'me',   text: 'Tell me more about that trip', time: 'yesterday' }
  ],
  u_004: [
    { id: 'm1', from: 'them', text: 'Hahaha 😂', time: 'today' }
  ],
  u_005: [
    { id: 'm1', from: 'them', text: 'See you soon ✨', time: 'yesterday' }
  ],
  u_006: [
    { id: 'm1', from: 'them', text: 'Sounds great!', time: '2 days ago' }
  ],
  u_007: [
    { id: 'm1', from: 'them', text: 'You free this weekend?', time: '3 days ago' },
    { id: 'm2', from: 'me',   text: 'Yeah, what did you have in mind?', time: '3 days ago' }
  ],
  u_008: [
    { id: 'm1', from: 'them', text: 'Hey stranger 👋', time: '3 days ago' }
  ]
};

// ---------------------------------------------------------
// Auto-reply templates (mock — real chat will use WebSocket)
// ---------------------------------------------------------
export const AUTO_REPLIES = [
  'Haha that\u2019s cool 😄',
  'Ooh tell me more!',
  'Sounds fun!',
  'I was just thinking the same thing 😊',
  'How\u2019s your day going?',
  'Nice! Where was that?',
  'Definitely. What time works?',
  'You\u2019re funny 😂',
  'Ooh I love that!',
  'Let\u2019s do it!'
];

export function getRandomReply() {
  return AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
}

export function getThreadForUser(id) {
  return CHAT_THREADS[id] || [];
}