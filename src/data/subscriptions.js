// =========================================================
// MYNVORA — SUBSCRIPTION TIERS & FEATURES
// =========================================================

export const TIERS = {
  FREE: 'free',
  LIGHT: 'light',
  GOLD: 'gold',
  DIAMOND: 'diamond'
};

export const TIER_INFO = {
  free:    { name: 'Free',    price: 0,   priceLabel: 'Free' },
  light:   { name: 'Light',   price: 99,  priceLabel: '₹99/week' },
  gold:    { name: 'Gold',    price: 199, priceLabel: '₹199/week' },
  diamond: { name: 'Diamond', price: 399, priceLabel: '₹399/week' }
};

// =========================================================
// FEATURE MATRIX
// Boost is NOT a subscription perk.
// Hookups is Diamond-only.
// Stars are tier-based free + purchasable.
// =========================================================

export const FEATURES = {
  // -------- Core (all paid tiers) --------
  unlimitedLikes:       ['light', 'gold', 'diamond'],
  profileCustomization: ['light', 'gold', 'diamond'],
  hobbiesInterests:     ['light', 'gold', 'diamond'],
  musicMovies:          ['light', 'gold', 'diamond'],
  relationshipIntent:   ['light', 'gold', 'diamond'],
  basicDiscovery:       ['light', 'gold', 'diamond'],
  chat:                 ['light', 'gold', 'diamond'],
  safetyTools:          ['light', 'gold', 'diamond'],

  // -------- Gold+ --------
  seeWhoLikesYou:       ['gold', 'diamond'],
  profileViewers:       ['gold', 'diamond'],
  voiceCalls:           ['gold', 'diamond'],
  readReceipts:         ['gold', 'diamond'],
  readReceiptToggle:    ['gold', 'diamond'],
  rewind:               ['gold', 'diamond'],
  superLikes:           ['gold', 'diamond'],
  betterDiscovery:      ['gold', 'diamond'],

  // -------- Diamond only --------
  unlimitedSwiping:     ['diamond'],
  videoCalls:           ['diamond'],
  travelMode:           ['diamond'],
  incognito:            ['diamond'],
  hookups:              ['diamond'],
  advancedFilters:      ['diamond'],
  onlineNow:            ['diamond'],
  socialSharing:        ['diamond'],
  advancedIntentMatch:  ['diamond']
};

// =========================================================
// STARS — tier-based free allocation + purchasable packs
// =========================================================

export const FREE_STARS = {
  free:    2,
  light:   4,
  gold:    8,
  diamond: 8
};

export const STAR_PACKS = [
  { id: 'stars_6',  stars: 6,  price: 99,  label: '6 Stars' },
  { id: 'stars_14', stars: 14, price: 199, label: '14 Stars' }
];

// =========================================================
// HOOKUPS — Diamond-only category
// =========================================================

export const HOOKUPS = {
  freeSwipes: 10,              // 10 free swipes after Diamond purchase
  unlimitedPrice: 99           // ₹99 to unlock unlimited
};

// =========================================================
// BOOST — paid add-on, available to everyone
// Effect: matching-vibe priority + shown to relevant users
// NOT a top-of-stack spam — smart matching
// =========================================================

export const BOOSTS = [
  {
    id: 'boost_24',
    hours: 24,
    price: 149,
    label: '24 hours',
    description: 'Priority matching with your vibe'
  },
  {
    id: 'boost_48',
    hours: 48,
    price: 299,
    label: '48 hours',
    description: 'Extended priority matching'
  }
];

// =========================================================
// AI SAFETY — free for every tier, never overridable
// =========================================================

export const AI_SAFETY_FEATURES = [
  'AI Fake Profile Detection',
  'AI-Generated Photo Detection',
  'Deepfake Detection',
  'Face Verification',
  'Selfie ↔ Profile Photo Match',
  'Duplicate Photo Detection',
  'Impersonation Detection',
  'Celebrity Impersonation Detection',
  'Suspicious Account Detection',
  'Scam / Bot Detection',
  'Suspicious Message Detection',
  'Spam Detection',
  'Human Review',
  'Report / Block',
  'Safety Alerts'
];

// =========================================================
// SAFETY RULES — never overridable
// =========================================================

export const SAFETY_RULES = [
  { label: 'Chat',                                  access: 'Matched users only' },
  { label: 'Voice call',                            access: 'Gold+' },
  { label: 'Video call',                            access: 'Diamond' },
  { label: 'Block',                                 access: 'Everyone' },
  { label: 'Report',                                access: 'Everyone' },
  { label: 'Unmatch',                               access: 'Everyone' },
  { label: 'Phone number protection',               access: 'Everyone' },
  { label: 'AI scam / suspicious-message detection', access: 'Everyone' },
  { label: 'Read receipts',                         access: 'Gold+' },
  { label: '16–17 ↔ 18+ communication',              access: 'NEVER allowed' },
  { label: 'Subscription bypass of age protection', access: 'NEVER allowed' }
];

// =========================================================
// HELPERS
// =========================================================

export function canUse(feature, tier) {
  const allowed = FEATURES[feature];
  if (!allowed) return false;
  return allowed.includes(tier);
}

export function isPremium(tier) {
  return tier !== 'free';
}

export function isDiamond(tier) {
  return tier === 'diamond';
}

export function getFreeStars(tier) {
  return FREE_STARS[tier] ?? FREE_STARS.free;
}