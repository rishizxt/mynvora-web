// =========================================================
// MYNVORA — PERMISSION HELPERS
// Single source of truth for access control.
// =========================================================

import { ROLES, roleHasPermission } from '../data/adminRoles.js';

// ---------------------------------------------------------
// Core checks
// ---------------------------------------------------------
export function hasPermission(admin, permission) {
  if (!admin || !admin.role) return false;
  return roleHasPermission(admin.role, permission);
}

export function hasAny(admin, permissions = []) {
  return permissions.some((p) => hasPermission(admin, p));
}

export function hasAll(admin, permissions = []) {
  return permissions.every((p) => hasPermission(admin, p));
}

// ---------------------------------------------------------
// Section access
// ---------------------------------------------------------
export const SECTION_ACCESS = {
  dashboard:     ['users.read'],
  users:         ['users.read'],
  verification:  ['verification.read'],
  aiSafety:      ['ai.read'],
  photos:        ['moderation.read'],
  flagged:       ['flagged.read'],
  reports:       ['reports.read'],
  comms:         ['comms.read'],
  ageSafety:     ['agesafety.read'],
  subscriptions: ['subs.read'],
  finance:       ['finance.read'],
  analytics:     ['analytics.read'],
  notifications: ['notif.read'],
  auditLogs:     ['audit.read'],
  adminsRoles:   ['admins.read'],
  settings:      ['settings.read'],
  security:      ['security.read']
};

export function canAccessSection(admin, sectionKey) {
  const required = SECTION_ACCESS[sectionKey];
  if (!required) return false;
  return hasAny(admin, required);
}

export function getAccessibleSections(admin) {
  return Object.keys(SECTION_ACCESS).filter((key) =>
    canAccessSection(admin, key)
  );
}

// ---------------------------------------------------------
// Role helpers
// ---------------------------------------------------------
export function getRoleName(roleId) {
  return ROLES[roleId]?.name || 'Unknown';
}

export function getRoleColor(roleId) {
  return ROLES[roleId]?.color || '#777789';
}

export function isSuperAdmin(admin) {
  return admin?.role === 'super_admin';
}

// ---------------------------------------------------------
// Sensitive data checks
// ---------------------------------------------------------
export function canViewIdentityDocs(admin) {
  return hasPermission(admin, 'verification.read');
}

export function canViewFlaggedContent(admin) {
  return hasPermission(admin, 'flagged.read');
}

export function canApproveVerification(admin) {
  return hasPermission(admin, 'verification.approve');
}

export function canBanUser(admin) {
  return hasPermission(admin, 'users.ban');
}

export function canSuspendUser(admin) {
  return hasPermission(admin, 'users.suspend');
}

export function canIssueRefund(admin) {
  return hasPermission(admin, 'refunds.manage');
}

export function canManageAdmins(admin) {
  return hasPermission(admin, 'admins.manage');
}

export function canManageSettings(admin) {
  return hasPermission(admin, 'settings.manage');
}

export function canViewAuditLogs(admin) {
  return hasPermission(admin, 'audit.read');
}

export function canSendNotifications(admin) {
  return hasPermission(admin, 'notif.send');
}

// ---------------------------------------------------------
// Legacy alias — some files still import PERMISSIONS_FALLBACK
// Keeps old import statements working without breaking the app.
// ---------------------------------------------------------
export const PERMISSIONS_FALLBACK = SECTION_ACCESS;

// ---------------------------------------------------------
// Friendly error message
// ---------------------------------------------------------
export function permissionDenied(permission) {
  return `You don't have permission to ${permission}.`;
}