import { httpAction, mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requirePermission, requireAuth, audit, type Role } from './lib/auth';

const ROLE = v.union(
  v.literal('super_admin'),
  v.literal('admin'),
  v.literal('accountant'),
  v.literal('librarian'),
  v.literal('teacher'),
  v.literal('student'),
  v.literal('parent'),
);

// ─── Login: email + password → session token ──────────────
export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email.toLowerCase()))
      .unique();
    if (!user) throw new Error('Invalid email or password');
    if (!user.isActive) throw new Error('Account is deactivated');
    if (user.passwordHash !== args.password) {
      throw new Error('Invalid email or password');
    }
    const token =
      Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12);
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days
    await ctx.db.insert('sessions', {
      userId: user._id,
      token,
      expiresAt,
      createdAt: Date.now(),
    });
    await ctx.db.patch(user._id, { lastLoginAt: Date.now() });
    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
      },
    };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query('sessions')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .unique();
    if (session) await ctx.db.delete(session._id);
    return null;
  },
});

// ─── Account CRUD (super_admin + admin) ────────────────────
export const create = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: ROLE,
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'createAnyUser');
    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email.toLowerCase()))
      .unique();
    if (existing) throw new Error('A user with this email already exists');
    const id = await ctx.db.insert('users', {
      name: args.name,
      email: args.email.toLowerCase(),
      passwordHash: args.password,
      salt: '',
      role: args.role as Role,
      phone: args.phone,
      address: args.address,
      isActive: true,
      createdAt: Date.now(),
    });
    await audit(ctx, actor, 'user.create', 'users', id, args.role);
    return id;
  },
});

export const list = query({
  args: { token: v.string(), role: v.optional(ROLE) },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.token, 'createAnyUser');
    const rows = await ctx.db.query('users').order('desc').collect();
    const filtered = args.role ? rows.filter((u) => u.role === args.role) : rows;
    return filtered.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      isActive: u.isActive,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
    }));
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id('users'),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(ROLE),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const target = await ctx.db.get(args.id);
    if (!target) throw new Error('User not found');
    // Self-service profile edit allowed; role/active changes require admin.
    const actor = await requireAuth(ctx, args.token);
    const isSelf = actor._id === args.id;
    if (!isSelf) {
      await requirePermission(ctx, args.token, 'createAnyUser');
    }
    const { token, id, ...updates } = args;
    const patch: Record<string, unknown> = { ...updates };
    if (updates.email) patch.email = updates.email.toLowerCase();
    if (updates.password) {
      patch.passwordHash = updates.password;
      patch.salt = '';
    }
    await ctx.db.patch(args.id, patch);
    await audit(ctx, actor, 'user.update', 'users', args.id);
    return args.id;
  },
});

// ─── Super admin only: delete any record ───────────────────
export const remove = mutation({
  args: { token: v.string(), id: v.id('users') },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'deleteAnyRecord');
    const target = await ctx.db.get(args.id);
    if (!target) throw new Error('User not found');
    if (target.role === 'super_admin' && actor.role !== 'super_admin') {
      throw new Error('Cannot delete a super admin');
    }
    await ctx.db.delete(args.id);
    await audit(ctx, actor, 'user.delete', 'users', args.id);
    return null;
  },
});

// ─── Profile: current user reads/edits own account ─────────
export const me = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.token);
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      avatarUrl: user.avatarUrl,
    };
  },
});

export const updateOwnProfile = mutation({
  args: {
    token: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.token);
    const { token, ...updates } = args;
    const patch: Record<string, unknown> = { ...updates };
    if (updates.password) {
      patch.passwordHash = updates.password;
      patch.salt = '';
      delete patch.password;
    }
    await ctx.db.patch(user._id, patch);
    await audit(ctx, user, 'profile.update', 'users', user._id);
    return user._id;
  },
});
