// =========================================================
// MYNVORA — ONBOARDING OPTIONS
// All options for the signup flow.
// =========================================================

// ---------------------------------------------------------
// GENDER
// ---------------------------------------------------------
export const GENDER_OPTIONS = [
  { id: 'man', label: 'Man' },
  { id: 'woman', label: 'Woman' },
  { id: 'non_binary', label: 'Non-binary' },
  { id: 'beyond_binary', label: 'Beyond Binary' }
];

// ---------------------------------------------------------
// SEXUAL ORIENTATION
// ---------------------------------------------------------
export const ORIENTATION_OPTIONS = [
  {
    id: 'straight',
    label: 'Straight',
    desc: 'A person who is exclusively attracted to members of the opposite gender'
  },
  {
    id: 'gay',
    label: 'Gay',
    desc: 'An umbrella term used to describe someone who is attracted to members of their gender'
  },
  {
    id: 'lesbian',
    label: 'Lesbian',
    desc: 'A woman who is emotionally, romantically, or sexually attracted to other women'
  },
  {
    id: 'bisexual',
    label: 'Bisexual',
    desc: 'A person who has potential for emotional, romantic, or sexual attraction to people of more than one gender'
  },
  {
    id: 'asexual',
    label: 'Asexual',
    desc: 'A person who does not experience sexual attraction'
  },
  {
    id: 'demisexual',
    label: 'Demisexual',
    desc: 'A person who does not experience sexual attraction unless they form a strong emotional connection'
  },
  {
    id: 'pansexual',
    label: 'Pansexual',
    desc: 'A person who has potential for emotional, romantic, or sexual attraction to people regardless of their gender'
  },
  {
    id: 'queer',
    label: 'Queer',
    desc: 'An umbrella term for people who are not heterosexual or are not cisgender'
  },
  {
    id: 'questioning',
    label: 'Questioning',
    desc: 'Exploring your identity'
  }
];

// ---------------------------------------------------------
// INTERESTED IN
// ---------------------------------------------------------
export const INTERESTED_IN_OPTIONS = [
  { id: 'men',            label: 'Men' },
  { id: 'women',          label: 'Women' },
  { id: 'non_binary',     label: 'Non-binary' },
  { id: 'everyone',       label: 'Everyone' }
];

// ---------------------------------------------------------
// LOOKING FOR
// ---------------------------------------------------------
export const LOOKING_FOR_OPTIONS = [
  { id: 'long_term',      label: 'Long-term partner',       icon: '💍' },
  { id: 'long_open',      label: 'Long-term, open to short', icon: '💕' },
  { id: 'short_open',     label: 'Short-term, open to long', icon: '🌊' },
  { id: 'short_term',     label: 'Short-term fun',           icon: '🎉' },
  { id: 'new_friends',    label: 'New friends',              icon: '👋' },
  { id: 'figuring_out',   label: 'Still figuring it out',    icon: '🧭' }
];

// ---------------------------------------------------------
// INTEREST CATEGORIES (for onboarding — same as profileOptions)
// Re-exported for convenience
// ---------------------------------------------------------
export {
  INTEREST_CATEGORIES,
  MAX_INTERESTS
} from './profileOptions.js';

// ---------------------------------------------------------
// DISTANCE LIMITS
// ---------------------------------------------------------
export const DISTANCE_MIN = 2;
export const DISTANCE_MAX = 160;
export const DISTANCE_DEFAULT = 80;

// ---------------------------------------------------------
// MIN/MAX AGE
// ---------------------------------------------------------
export const MIN_AGE = 16;
export const ADULT_AGE = 18;
export const MAX_AGE = 90;

// ---------------------------------------------------------
// PHOTO REQUIREMENTS
// ---------------------------------------------------------
export const MIN_PHOTOS = 2;
export const RECOMMENDED_PHOTOS = 4;
export const MAX_PHOTOS = 6;

// ---------------------------------------------------------
// FACE CHECK TRIGGER
// ---------------------------------------------------------
export const FACE_CHECK_AFTER_SWIPES = 3;