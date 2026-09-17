import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requirePermission, audit } from './lib/auth';

// ─── Classes (admin) ───────────────────────────────────────
export const createClass = mutation({
  args: { token: v.string(), name: v.string(), level: v.optional(v.string()), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'manageClasses');
    const id = await ctx.db.insert('classes', { name: args.name, level: args.level, description: args.description, createdAt: Date.now() });
    await audit(ctx, actor, 'class.create', 'classes', id);
    return id;
  },
});

export const listClasses = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireAuthOrThrow(ctx, args.token);
    return await ctx.db.query('classes').order('asc').collect();
  },
});

export const updateClass = mutation({
  args: { token: v.string(), id: v.id('classes'), name: v.optional(v.string()), level: v.optional(v.string()), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'manageClasses');
    const { token, id, ...updates } = args;
    await ctx.db.patch(args.id, updates);
    await audit(ctx, actor, 'class.update', 'classes', args.id);
    return args.id;
  },
});

export const deleteClass = mutation({
  args: { token: v.string(), id: v.id('classes') },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'deleteAnyRecord');
    await ctx.db.delete(args.id);
    await audit(ctx, actor, 'class.delete', 'classes', args.id);
    return null;
  },
});

// ─── Sections (admin) ──────────────────────────────────────
export const createSection = mutation({
  args: { token: v.string(), classId: v.id('classes'), name: v.string(), capacity: v.optional(v.number()), classTeacherId: v.optional(v.id('users')) },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'manageClasses');
    const id = await ctx.db.insert('sections', { classId: args.classId, name: args.name, capacity: args.capacity, classTeacherId: args.classTeacherId, createdAt: Date.now() });
    await audit(ctx, actor, 'section.create', 'sections', id);
    return id;
  },
});

export const listSections = query({
  args: { token: v.string(), classId: v.optional(v.id('classes')) },
  handler: async (ctx, args) => {
    await requireAuthOrThrow(ctx, args.token);
    if (args.classId) {
      const classId = args.classId;
      return await ctx.db.query('sections').withIndex('by_class', (q) => q.eq('classId', classId)).order('asc').collect();
    }
    return await ctx.db.query('sections').order('asc').collect();
  },
});

export const updateSection = mutation({
  args: { token: v.string(), id: v.id('sections'), name: v.optional(v.string()), capacity: v.optional(v.number()), classTeacherId: v.optional(v.id('users')) },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'manageClasses');
    const { token, id, ...updates } = args;
    await ctx.db.patch(args.id, updates);
    await audit(ctx, actor, 'section.update', 'sections', args.id);
    return args.id;
  },
});

export const deleteSection = mutation({
  args: { token: v.string(), id: v.id('sections') },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'deleteAnyRecord');
    await ctx.db.delete(args.id);
    await audit(ctx, actor, 'section.delete', 'sections', args.id);
    return null;
  },
});

// Helper import for auth
import { requireAuth as requireAuthOrThrow } from './lib/auth';
