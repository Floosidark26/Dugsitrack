import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requirePermission, requireAuth, audit } from './lib/auth';

export const upload = mutation({
  args: {
    token: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    subjectId: v.id('subjects'),
    classId: v.id('classes'),
    fileUrl: v.string(),
    fileName: v.string(),
    fileSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'uploadMaterials');
    const id = await ctx.db.insert('materials', {
      ...args,
      uploadedBy: actor._id,
      createdAt: Date.now(),
    });
    await audit(ctx, actor, 'material.upload', 'materials', id);
    return id;
  },
});

export const list = query({
  args: { token: v.string(), classId: v.optional(v.id('classes')), subjectId: v.optional(v.id('subjects')) },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.token);
    let rows = await ctx.db.query('materials').order('desc').collect();
    if (user.role === 'teacher') rows = rows.filter((m) => m.uploadedBy === user._id);
    if (user.role === 'student') {
      const mine = await ctx.db.query('students').withIndex('by_user', (q) => q.eq('userId', user._id)).unique();
      if (mine) rows = rows.filter((m) => m.classId === mine.classId);
    }
    if (args.classId) rows = rows.filter((m) => m.classId === args.classId);
    if (args.subjectId) rows = rows.filter((m) => m.subjectId === args.subjectId);
    return Promise.all(
      rows.map(async (m) => {
        const subject = await ctx.db.get(m.subjectId);
        const cls = await ctx.db.get(m.classId);
        return { ...m, subjectName: subject?.name ?? '', className: cls?.name ?? '' };
      }),
    );
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id('materials') },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'deleteAnyRecord');
    await ctx.db.delete(args.id);
    await audit(ctx, actor, 'material.delete', 'materials', args.id);
    return null;
  },
});
