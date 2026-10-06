// =========================================================
// MYNVORA — ADMIN ROLES & PERMISSIONS
// 8 roles · granular permission strings
// Never use `admin = true`. Always check a specific permission.
// =========================================================

// ---------------------------------------------------------
// All available permissions
// ---------------------------------------------------------
export const PERMISSIONS = {
  // Users
  USERS_READ:        'users.read',
  USERS_EDIT:        'users.edit',
  USERS_SUSPEND:     'users.suspend',
  USERS_BAN:         'users.ban',
  USERS_RESTORE:     'users.restore',

  // Verification
  VERIFICATION_READ:    'verification.read',
  VERIFICATION_APPROVE: 'verification.approve',
  VERIFICATION_REJECT:  'verification.reject',

  // Moderation
  MODERATION_READ:   'moderation.read',
  MODERATION_ACTION: 'moderation.action',

  // Reports
  REPORTS_READ:      'reports.read',
  REPORTS_RESOLVE:   'reports.resolve',

  // AI Safety
  AI_READ:           'ai.read',
  AI_ACTION:         'ai.action',

  // Flagged content (nude / sexual / inappropriate)
  FLAGGED_READ:      'flagged.read',
  FLAGGED_ACTION:    'flagged.action',

  // Communication Safety
  COMMS_READ:        'comms.read',
  COMMS_ACTION:      'comms.action',

  // Age safety
  AGE_SAFETY_READ:   'agesafety.read',
  AGE_SAFETY_ACTION: 'agesafety.action',

  // Subscriptions
  SUBS_READ:         'subs.read',
  SUBS_MANAGE:       'subs.manage',

  // Finance
  FINANCE_READ:      'finance.read',
  REFUNDS_MANAGE:    'refunds.manage',

  // Analytics
  ANALYTICS_READ:    'analytics.read',

  // Notifications
  NOTIF_READ:        'notif.read',
  NOTIF_SEND:        'notif.send',

  // Audit
  AUDIT_READ:        'audit.read',

  // Admins & Roles
  ADMINS_READ:       'admins.read',
  ADMINS_MANAGE:     'admins.manage',

  // Settings
  SETTINGS_READ:     'settings.read',
  SETTINGS_MANAGE:   'settings.manage',

  // Security
  SECURITY_READ:     'security.read',
  SECURITY_MANAGE:   'security.manage',

  // Wildcard (Super Admin only)
  ALL:               '*'
};

// ---------------------------------------------------------
// 8 roles — each with its permission list
// ---------------------------------------------------------

export const ROLES = {
  super_admin: {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Full access to everything',
    color: '#ff3b81',
    demoName: 'Alex Rivera',
    permissions: ['*']     // wildcard → all permissions
  },

  verification_admin: {
    id: 'verification_admin',
    name: 'Verification Admin',
    description: 'Identity + verification only',
    color: '#4f8cff',
    demoName: 'Priya Sharma',
    permissions: [
      'users.read',
      'verification.read',
      'verification.approve',
      'verification.reject',
      'audit.read'
    ]
  },

  moderation_admin: {
    id: 'moderation_admin',
    name: 'Moderation Admin',
    description: 'Profiles, photos, reports',
    color: '#8b5cf6',
    demoName: 'Jordan Lee',
    permissions: [
      'users.read',
      'users.suspend',
      'users.ban',
      'users.restore',
      'moderation.read',
      'moderation.action',
      'reports.read',
      'reports.resolve',
      'flagged.read',
      'flagged.action',
      'ai.read',
      'ai.action',
      'audit.read'
    ]
  },

  safety_admin: {
    id: 'safety_admin',
    name: 'Safety Admin',
    description: 'Reports, scams, safety',
    color: '#35d07f',
    demoName: 'Sam Okafor',
    permissions: [
      'users.read',
      'reports.read',
      'reports.resolve',
      'flagged.read',
      'flagged.action',
      'ai.read',
      'ai.action',
      'comms.read',
      'comms.action',
      'agesafety.read',
      'agesafety.action',
      'audit.read'
    ]
  },

  support_admin: {
    id: 'support_admin',
    name: 'Support Admin',
    description: 'Customer support',
    color: '#ffb020',
    demoName: 'Maya Singh',
    permissions: [
      'users.read',
      'reports.read',
      'subs.read',
      'audit.read'
    ]
  },

  finance_admin: {
    id: 'finance_admin',
    name: 'Finance Admin',
    description: 'Payments + subscriptions',
    color: '#4f8cff',
    demoName: 'Chris Wong',
    permissions: [
      'subs.read',
      'subs.manage',
      'finance.read',
      'refunds.manage',
      'audit.read'
    ]
  },

  analytics_admin: {
    id: 'analytics_admin',
    name: 'Analytics Admin',
    description: 'Statistics + analytics',
    color: '#8b5cf6',
    demoName: 'Riya Patel',
    permissions: [
      'analytics.read',
      'audit.read'
    ]
  },

  content_admin: {
    id: 'content_admin',
    name: 'Content Admin',
    description: 'Prompts, categories, banners',
    color: '#ff6b9d',
    demoName: 'Noor Hassan',
    permissions: [
      'settings.read',
      'settings.manage'
    ]
  }
};

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

// Check if a role has a permission
export function roleHasPermission(roleId, permission) {
  const role = ROLES[roleId];
  if (!role) return false;

  // Wildcard = all permissions
  if (role.permissions.includes('*')) return true;

  return role.permissions.includes(permission);
}

// Get all roles as an array (for dropdowns)
export function getAllRoles() {
  return Object.values(ROLES);
}

// Get a role's badge color
export function getRoleColor(roleId) {
  return ROLES[roleId]?.color || '#777789';
}

// Get a role's display name
export function getRoleName(roleId) {
  return ROLES[roleId]?.name || 'Unknown';
}