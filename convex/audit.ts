import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireAuth } from './lib/auth';

export const log = mutation({
  args: {
    token: v.string(),
    action: v.string(),
    entityType: v.string(),
    entityId: v.optional(v.string()),
    detail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.token);
    await ctx.db.insert('auditLogs', {
      actorId: user._id,
      action: args.action,
      entityType: args.entityType,
      entityId: args.entityId,
      detail: args.detail,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.token);
    if (user.role !== 'super_admin' && user.role !== 'admin') {
      throw new Error('Access denied');
    }
    return await ctx.db.query('auditLogs').order('desc').take(500);
  },
});
