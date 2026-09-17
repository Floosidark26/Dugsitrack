import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requirePermission, requireAuth, audit } from './lib/auth';

export const create = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    code: v.string(),
    classId: v.id('classes'),
    teacherId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'manageSubjects');
    const id = await ctx.db.insert('subjects', {
      name: args.name,
      code: args.code,
      classId: args.classId,
      teacherId: args.teacherId,
      createdAt: Date.now(),
    });
    await audit(ctx, actor, 'subject.create', 'subjects', id);
    return id;
  },
});

export const list = query({
  args: { token: v.string(), classId: v.optional(v.id('classes')) },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.token);
    if (args.classId) {
      const classId = args.classId;
      return await ctx.db
        .query('subjects')
        .withIndex('by_class', (q) => q.eq('classId', classId))
        .order('asc')
        .collect();
    }
    return await ctx.db.query('subjects').order('asc').collect();
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id('subjects'),
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    teacherId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'manageSubjects');
    const { token, id, ...updates } = args;
    await ctx.db.patch(args.id, updates);
    await audit(ctx, actor, 'subject.update', 'subjects', args.id);
    return args.id;
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id('subjects') },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'deleteAnyRecord');
    await ctx.db.delete(args.id);
    await audit(ctx, actor, 'subject.delete', 'subjects', args.id);
    return null;
  },
});
