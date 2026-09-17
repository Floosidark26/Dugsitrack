import type { QueryCtx, MutationCtx } from '../_generated/server';
import type { Doc } from '../_generated/dataModel';

export type Role =
  | 'super_admin'
  | 'admin'
  | 'accountant'
  | 'librarian'
  | 'teacher'
  | 'student'
  | 'parent';

/**
 * Permission matrix derived from the role spec.
 * `requires` lists roles allowed to perform each action.
 */
export const PERMISSIONS = {
  // SUPER ADMIN only
  deleteAnyRecord: ['super_admin'],
  createAnyUser: ['super_admin', 'admin'],

  // ADMIN
  manageClasses: ['super_admin', 'admin'],
  manageSubjects: ['super_admin', 'admin'],
  manageNoticeboard: ['super_admin', 'admin'],
  editSystemSettings: ['super_admin', 'admin'],
  viewAnyMarksheet: ['super_admin', 'admin'],

  // ACCOUNTANT
  managePayments: ['super_admin', 'admin', 'accountant'],
  printReceipts: ['super_admin', 'admin', 'accountant'],

  // LIBRARIAN
  manageLibrary: ['super_admin', 'admin', 'librarian'],

  // TEACHER
  manageOwnClass: ['super_admin', 'admin', 'teacher'],
  manageExamRecords: ['super_admin', 'admin', 'teacher'],
  manageTimetable: ['super_admin', 'admin', 'teacher'],
  uploadMaterials: ['super_admin', 'admin', 'teacher'],

  // STUDENT / PARENT (read scopes handled per-query)
  viewOwnPayments: ['super_admin', 'admin', 'accountant', 'student', 'parent'],
  viewLibrary: [
    'super_admin',
    'admin',
    'librarian',
    'teacher',
    'student',
    'parent',
  ],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export async function resolveUser(ctx: QueryCtx, token: string | undefined) {
  if (!token) return null;
  const session = await ctx.db
    .query('sessions')
    .withIndex('by_token', (q) => q.eq('token', token))
    .unique();
  if (!session || session.expiresAt < Date.now()) return null;
  const user = await ctx.db.get(session.userId);
  if (!user || !user.isActive) return null;
  return user;
}

/** Throw if no authenticated user. */
export async function requireAuth(ctx: QueryCtx, token: string | undefined) {
  const user = await resolveUser(ctx, token);
  if (!user) throw new Error('Not authenticated');
  return user;
}

/** Throw if the user's role is not permitted for the given action. */
export async function requirePermission(
  ctx: QueryCtx,
  token: string | undefined,
  permission: Permission,
) {
  const user = await requireAuth(ctx, token);
  const allowed = PERMISSIONS[permission] as readonly string[];
  if (!allowed.includes(user.role)) {
    throw new Error(`Forbidden: your role (${user.role}) cannot ${permission}`);
  }
  return user as Doc<'users'>;
}

/** True/false check for optional UI gating. */
export async function can(
  ctx: QueryCtx,
  token: string | undefined,
  permission: Permission,
) {
  const user = await resolveUser(ctx, token);
  if (!user) return false;
  return (PERMISSIONS[permission] as readonly string[]).includes(user.role);
}

export async function audit(
  ctx: MutationCtx,
  actor: Doc<'users'>,
  action: string,
  entityType: string,
  entityId?: string,
  detail?: string,
) {
  await ctx.db.insert('auditLogs', {
    actorId: actor._id,
    action,
    entityType,
    entityId,
    detail,
    createdAt: Date.now(),
  });
}
