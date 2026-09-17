import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requirePermission, requireAuth, audit } from './lib/auth';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export const upsertSlot = mutation({
  args: {
    token: v.string(),
    classId: v.id('classes'),
    sectionId: v.optional(v.id('sections')),
    subjectId: v.id('subjects'),
    teacherId: v.id('users'),
    day: v.union(...DAYS.map((d) => v.literal(d))),
    startTime: v.string(),
    endTime: v.string(),
    room: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'manageTimetable');
    // A class teacher may only manage their own class/section timetable.
    if (actor.role === 'teacher' && args.sectionId) {
      const section = await ctx.db.get(args.sectionId);
      if (section && section.classTeacherId !== actor._id) {
        throw new Error('You can only manage the timetable of your own section');
      }
    }
    const id = await ctx.db.insert('timetable', {
      ...args,
      createdAt: Date.now(),
    });
    await audit(ctx, actor, 'timetable.create', 'timetable', id);
    return id;
  },
});

export const classTimetable = query({
  args: { token: v.string(), classId: v.id('classes'), sectionId: v.optional(v.id('sections')) },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.token);
    const rows = await ctx.db
      .query('timetable')
      .withIndex('by_class_day', (q) => q.eq('classId', args.classId))
      .collect();
    return Promise.all(
      rows
        .filter((r) => !args.sectionId || r.sectionId === args.sectionId)
        .map(async (r) => {
          const subject = await ctx.db.get(r.subjectId);
          const teacher = await ctx.db.get(r.teacherId);
          return {
            ...r,
            subjectName: subject?.name ?? 'Unknown',
            teacherName: teacher?.name ?? 'Unknown',
          };
        }),
    );
  },
});

export const teacherTimetable = query({
  args: { token: v.string(), teacherId: v.id('users') },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.token);
    const rows = await ctx.db
      .query('timetable')
      .withIndex('by_teacher_day', (q) => q.eq('teacherId', args.teacherId))
      .collect();
    return Promise.all(
      rows.map(async (r) => {
        const subject = await ctx.db.get(r.subjectId);
        const cls = await ctx.db.get(r.classId);
        return {
          ...r,
          subjectName: subject?.name ?? 'Unknown',
          className: cls?.name ?? 'Unknown',
        };
      }),
    );
  },
});

export const removeSlot = mutation({
  args: { token: v.string(), id: v.id('timetable') },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'deleteAnyRecord');
    await ctx.db.delete(args.id);
    await audit(ctx, actor, 'timetable.delete', 'timetable', args.id);
    return null;
  },
});
