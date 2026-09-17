import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requirePermission, requireAuth, audit } from './lib/auth';

export const publish = mutation({
  args: {
    token: v.string(),
    title: v.string(),
    body: v.string(),
    audience: v.union(
      v.literal('all'),
      v.literal('teachers'),
      v.literal('students'),
      v.literal('parents'),
    ),
    isEvent: v.boolean(),
    eventDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'manageNoticeboard');
    if (args.isEvent && !args.eventDate) throw new Error('Events must have a date');
    const id = await ctx.db.insert('notices', {
      title: args.title,
      body: args.body,
      audience: args.audience,
      isEvent: args.isEvent,
      eventDate: args.eventDate,
      createdBy: actor._id,
      createdAt: Date.now(),
    });
    await audit(ctx, actor, 'notice.publish', 'notices', id);
    return id;
  },
});

export const list = query({
  args: { token: v.string(), audience: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.token);
    const rows = await ctx.db
      .query('notices')
      .withIndex('by_created', (q) => q.gte('createdAt', 0))
      .order('desc')
      .take(50);
    const visible = rows.filter(
      (n) =>
        n.audience === 'all' ||
        n.audience === (user.role === 'super_admin' || user.role === 'admin' ? 'all' : `${user.role}s`),
    );
    if (args.audience) return visible.filter((n) => n.audience === args.audience);
    return visible;
  },
});

/** Calendar feed: upcoming events visible to the current role. */
export const events = query({
  args: { token: v.string(), from: v.number(), to: v.number() },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.token);
    const rows = await ctx.db
      .query('notices')
      .withIndex('by_event_date', (q) => q.gte('eventDate', args.from).lte('eventDate', args.to))
      .collect();
    return rows.filter(
      (n) =>
        n.isEvent &&
        (n.audience === 'all' ||
          n.audience === (user.role === 'super_admin' || user.role === 'admin' ? 'all' : `${user.role}s`)),
    );
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id('notices') },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'deleteAnyRecord');
    await ctx.db.delete(args.id);
    await audit(ctx, actor, 'notice.delete', 'notices', args.id);
    return null;
  },
});
