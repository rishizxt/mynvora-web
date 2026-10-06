// =========================================================
// MYNVORA ADMIN — MOCK DATA
// Seed data for the admin panel demo.
// Replace with real API calls when backend is ready.
// =========================================================

// ---------------------------------------------------------
// USERS
// ---------------------------------------------------------
export const MOCK_USERS = [
  {
    id: 'u_2211',
    name: 'Rushi Singh',
    age: 24,
    ageGroup: 'adult',
    email: 'rushi@example.com',
    phone: '+91 *** 3210',
    city: 'Mumbai',
    country: 'India',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    tier: 'diamond',
    verified: true,
    status: 'active',
    reportsAgainst: 2,
    flagsAgainst: 2,
    joinedAt: '2026-01-12',
    lastActive: '2m ago'
  },
  {
    id: 'u_001',
    name: 'Mia Kapoor',
    age: 26,
    ageGroup: 'adult',
    email: 'mia@example.com',
    phone: '+91 *** 4102',
    city: 'Mumbai',
    country: 'India',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    tier: 'gold',
    verified: true,
    status: 'active',
    reportsAgainst: 1,
    flagsAgainst: 0,
    joinedAt: '2026-02-03',
    lastActive: 'now'
  },
  {
    id: 'u_8821',
    name: 'Emma Roy',
    age: 23,
    ageGroup: 'adult',
    email: 'emma@example.com',
    phone: '+91 *** 8821',
    city: 'Delhi',
    country: 'India',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80',
    tier: 'free',
    verified: false,
    status: 'suspended',
    reportsAgainst: 4,
    flagsAgainst: 1,
    joinedAt: '2026-03-15',
    lastActive: '1h ago'
  },
  {
    id: 'u_4422',
    name: 'Sofia Reyes',
    age: 24,
    ageGroup: 'adult',
    email: 'sofia@example.com',
    phone: '+91 *** 4422',
    city: 'Bangalore',
    country: 'India',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80',
    tier: 'light',
    verified: true,
    status: 'active',
    reportsAgainst: 1,
    flagsAgainst: 1,
    joinedAt: '2026-04-10',
    lastActive: '18m ago'
  },
  {
    id: 'u_9911',
    name: 'Unknown',
    age: 27,
    ageGroup: 'adult',
    email: 'unknown@example.com',
    phone: '+91 *** 9911',
    city: 'Pune',
    country: 'India',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    tier: 'free',
    verified: false,
    status: 'active',
    reportsAgainst: 0,
    flagsAgainst: 1,
    joinedAt: '2026-09-28',
    lastActive: '5m ago'
  },
  {
    id: 'u_1133',
    name: 'Aisha Khan',
    age: 28,
    ageGroup: 'adult',
    email: 'aisha@example.com',
    phone: '+91 *** 1133',
    city: 'Hyderabad',
    country: 'India',
    photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=80',
    tier: 'diamond',
    verified: true,
    status: 'active',
    reportsAgainst: 0,
    flagsAgainst: 0,
    joinedAt: '2026-01-20',
    lastActive: 'now'
  },
  {
    id: 'u_7822',
    name: 'Lena Müller',
    age: 27,
    ageGroup: 'adult',
    email: 'lena@example.com',
    phone: '+91 *** 7822',
    city: 'Goa',
    country: 'India',
    photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
    tier: 'gold',
    verified: true,
    status: 'active',
    reportsAgainst: 0,
    flagsAgainst: 0,
    joinedAt: '2026-05-02',
    lastActive: '3h ago'
  },
  {
    id: 'u_4412',
    name: 'Zoe Chen',
    age: 25,
    ageGroup: 'adult',
    email: 'zoe@example.com',
    phone: '+91 *** 4412',
    city: 'Mumbai',
    country: 'India',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    tier: 'free',
    verified: true,
    status: 'active',
    reportsAgainst: 0,
    flagsAgainst: 0,
    joinedAt: '2026-06-18',
    lastActive: '1d ago'
  }
];

// ---------------------------------------------------------
// REPORTS
// ---------------------------------------------------------
export const MOCK_REPORTS = [
  {
    id: 'RPT-22910',
    reportedUserId: 'u_8821',
    reportedUserName: 'Emma Roy',
    reportedUserPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80',
    reason: 'Harassment',
    details: 'Sent threatening messages after unmatch.',
    reporterId: 'u_7822',
    reporterName: 'Lena Müller',
    aiRisk: 'critical',
    status: 'new',
    assignedAdmin: null,
    previousReports: 4,
    createdAt: Date.now() - 2 * 60 * 1000,
    history: []
  },
  {
    id: 'RPT-22909',
    reportedUserId: 'u_2211',
    reportedUserName: 'Rushi Singh',
    reportedUserPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    reason: 'Fake profile',
    details: 'Photos look AI-generated.',
    reporterId: 'u_4412',
    reporterName: 'Zoe Chen',
    aiRisk: 'high',
    status: 'new',
    assignedAdmin: null,
    previousReports: 2,
    createdAt: Date.now() - 18 * 60 * 1000,
    history: []
  },
  {
    id: 'RPT-22908',
    reportedUserId: 'u_4422',
    reportedUserName: 'Sofia Reyes',
    reportedUserPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80',
    reason: 'Spam / scam',
    details: 'Tried to sell crypto in chat.',
    reporterId: 'u_1133',
    reporterName: 'Aisha Khan',
    aiRisk: 'review',
    status: 'investigating',
    assignedAdmin: 'Jordan Lee',
    previousReports: 1,
    createdAt: Date.now() - 3 * 60 * 60 * 1000,
    history: []
  },
  {
    id: 'RPT-22907',
    reportedUserId: 'u_9911',
    reportedUserName: 'Unknown',
    reportedUserPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    reason: 'Impersonation',
    details: 'Using photos of a celebrity.',
    reporterId: 'u_001',
    reporterName: 'Mia Kapoor',
    aiRisk: 'critical',
    status: 'new',
    assignedAdmin: null,
    previousReports: 0,
    createdAt: Date.now() - 5 * 60 * 60 * 1000,
    history: []
  }
];

// ---------------------------------------------------------
// VERIFICATIONS (pending queue)
// ---------------------------------------------------------
export const MOCK_VERIFICATIONS = [
  {
    id: 'VR-82931',
    userId: 'u_001',
    userName: 'Mia Kapoor',
    userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    submittedAt: Date.now() - 10 * 60 * 1000,
    status: 'pending_review',
    age: 26,
    country: 'India',
    documentType: 'Passport',
    documentFront: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    documentBack: null,
    selfieImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    checks: {
      ageCheck: 'pass',
      idAuthenticity: 'pass',
      liveness: { passed: true, confidence: 0.97 },
      faceMatch: { passed: false, similarity: 0.79 },
      duplicate: 'pass',
      photosSafe: 'pass'
    },
    reason: 'Face match below auto-approve threshold (0.85).',
    previousViolations: 0,
    reportsAgainst: 0
  },
  {
    id: 'VR-82930',
    userId: 'u_4422',
    userName: 'Sofia Reyes',
    userPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80',
    submittedAt: Date.now() - 1 * 60 * 60 * 1000,
    status: 'pending_review',
    age: 24,
    country: 'India',
    documentType: "Driver's License",
    documentFront: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    documentBack: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    selfieImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80',
    checks: {
      ageCheck: 'pass',
      idAuthenticity: 'uncertain',
      liveness: { passed: true, confidence: 0.94 },
      faceMatch: { passed: true, similarity: 0.91 },
      duplicate: 'pass',
      photosSafe: 'pass'
    },
    reason: 'ID authenticity requires human review.',
    previousViolations: 0,
    reportsAgainst: 1
  },
  {
    id: 'VR-82929',
    userId: 'u_1133',
    userName: 'Aisha Khan',
    userPhoto: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=80',
    submittedAt: Date.now() - 4 * 60 * 60 * 1000,
    status: 'pending_review',
    age: 28,
    country: 'India',
    documentType: 'Aadhaar',
    documentFront: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    documentBack: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    selfieImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80',
    checks: {
      ageCheck: 'pass',
      idAuthenticity: 'pass',
      liveness: { passed: true, confidence: 0.99 },
      faceMatch: { passed: true, similarity: 0.96 },
      duplicate: 'pass',
      photosSafe: 'pass'
    },
    reason: 'Automated checks passed. Awaiting final approval.',
    previousViolations: 0,
    reportsAgainst: 0
  }
];

// ---------------------------------------------------------
// FLAGGED CONTENT (nude / AI / deepfake)
// ---------------------------------------------------------
export const MOCK_FLAGS = [
  {
    id: 'FLG-48291',
    source: 'chat_message',
    category: 'nudity',
    confidence: 'critical',
    userId: 'u_2211',
    userName: 'Rushi Singh',
    userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    recipientId: 'u_001',
    recipientName: 'Mia Kapoor',
    photoUrl: null,
    messageText: null,
    messageImage: null,           // blurred placeholder in UI
    aiProvider: 'Mynvora AI',
    aiNotes: 'Explicit content detected in 1 image',
    violationsCount: 2,
    status: 'pending',
    assignedAdmin: null,
    actionTaken: null,
    createdAt: Date.now() - 4 * 60 * 1000,
    history: []
  },
  {
    id: 'FLG-48290',
    source: 'profile_photo',
    category: 'ai_generated',
    confidence: 'high',
    userId: 'u_4422',
    userName: 'Sofia Reyes',
    userPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80',
    recipientId: null,
    recipientName: null,
    photoUrl: null,
    messageText: null,
    messageImage: null,
    aiProvider: 'Mynvora AI',
    aiNotes: 'Image likely AI-generated (78% confidence)',
    violationsCount: 0,
    status: 'pending',
    assignedAdmin: null,
    actionTaken: null,
    createdAt: Date.now() - 30 * 60 * 1000,
    history: []
  },
  {
    id: 'FLG-48289',
    source: 'profile_photo',
    category: 'deepfake',
    confidence: 'critical',
    userId: 'u_9911',
    userName: 'Unknown',
    userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    recipientId: null,
    recipientName: null,
    photoUrl: null,
    messageText: null,
    messageImage: null,
    aiProvider: 'Mynvora AI',
    aiNotes: 'Face-swap artifacts detected (96% confidence)',
    violationsCount: 0,
    status: 'pending',
    assignedAdmin: null,
    actionTaken: null,
    createdAt: Date.now() - 90 * 60 * 1000,
    history: []
  },
  {
    id: 'FLG-48288',
    source: 'chat_message',
    category: 'suspicious_link',
    confidence: 'high',
    userId: 'u_4422',
    userName: 'Sofia Reyes',
    userPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80',
    recipientId: 'u_1133',
    recipientName: 'Aisha Khan',
    photoUrl: null,
    messageText: 'Hey check this out → bit.ly/crypto-deal',
    messageImage: null,
    aiProvider: 'Mynvora AI',
    aiNotes: 'Link matches known scam pattern',
    violationsCount: 1,
    status: 'pending',
    assignedAdmin: null,
    actionTaken: null,
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    history: []
  }
];

// ---------------------------------------------------------
// DASHBOARD STATS
// ---------------------------------------------------------
export const MOCK_DASHBOARD_STATS = {
  totalUsers: 184203,
  newToday: 1247,
  newWeek: 8210,
  newMonth: 34210,
  onlineUsers: 12840,
  teenUsers: 12340,
  adultUsers: 171863,
  verifiedUsers: 42891,
  pendingVerification: 12,
  suspendedAccounts: 342,
  bannedAccounts: 18,
  fakeProfileDetections: 47,
  aiDeepfakeDetections: 89,
  openReports: 38,
  unresolvedSafetyCases: 12,
  activeSubscriptions: 12489,
  lightSubscribers: 6201,
  goldSubscribers: 4102,
  diamondSubscribers: 2186,
  revenueToday: 84210,
  refundsToday: 1200,
  failedPayments: 3,
  matchesToday: 42180,
  messagesToday: 284932,
  voiceCallsToday: 1204,
  videoCallsToday: 892,
  boostUsageToday: 342
};

// ---------------------------------------------------------
// RECENT ACTIVITY (dashboard feed)
// ---------------------------------------------------------
export const MOCK_ACTIVITY = [
  { id: 1, type: 'verification', text: 'Admin approved verification VR-82931', at: Date.now() - 2 * 60 * 1000 },
  { id: 2, type: 'report', text: 'Report RPT-22910 filed by u_7822', at: Date.now() - 8 * 60 * 1000 },
  { id: 3, type: 'flag', text: 'Photo ph_998 flagged by AI (nudity 94%)', at: Date.now() - 15 * 60 * 1000 },
  { id: 4, type: 'subscription', text: 'User u_2190 upgraded to Diamond', at: Date.now() - 22 * 60 * 1000 },
  { id: 5, type: 'ban', text: 'Admin banned user u_2291 for repeated violations', at: Date.now() - 45 * 60 * 1000 }
];

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------
export function getUserById(id) {
  return MOCK_USERS.find((u) => u.id === id);
}

export function getReportById(id) {
  return MOCK_REPORTS.find((r) => r.id === id);
}

export function getVerificationById(id) {
  return MOCK_VERIFICATIONS.find((v) => v.id === id);
}

export function getFlagById(id) {
  return MOCK_FLAGS.find((f) => f.id === id);
}