import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requirePermission, requireAuth, audit } from './lib/auth';

// ─── Students (admin) ──────────────────────────────────────
export const create = mutation({
  args: {
    token: v.string(),
    userId: v.id('users'),
    admissionNumber: v.string(),
    classId: v.id('classes'),
    sectionId: v.optional(v.id('sections')),
    rollNumber: v.optional(v.string()),
    guardianName: v.optional(v.string()),
    guardianPhone: v.optional(v.string()),
    guardianRelation: v.optional(v.string()),
    parentId: v.optional(v.id('users')),
    address: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    gender: v.optional(v.union(v.literal('male'), v.literal('female'))),
  },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'createAnyUser');
    const existing = await ctx.db
      .query('students')
      .withIndex('by_admission', (q) => q.eq('admissionNumber', args.admissionNumber))
      .unique();
    if (existing) throw new Error('Admission number already exists');
    const id = await ctx.db.insert('students', {
      ...args,
      admissionDate: Date.now(),
      createdAt: Date.now(),
    });
    await audit(ctx, actor, 'student.create', 'students', id);
    return id;
  },
});

export const list = query({
  args: { token: v.string(), classId: v.optional(v.id('classes')), search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.token);
    let rows;
    if (args.classId) {
      const classId = args.classId;
      rows = await ctx.db
        .query('students')
        .withIndex('by_class', (q) => q.eq('classId', classId))
        .order('desc')
        .collect();
    } else {
      rows = await ctx.db.query('students').order('desc').collect();
    }
    const search = args.search?.trim().toLowerCase();
    if (!search) return rows;
    return rows.filter((s) =>
      `${s.admissionNumber} ${s.rollNumber ?? ''} ${s.guardianName ?? ''}`.toLowerCase().includes(search),
    );
  },
});

export const byUser = query({
  args: { token: v.string(), userId: v.id('users') },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.token);
    return await ctx.db
      .query('students')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .unique();
  },
});

export const byParent = query({
  args: { token: v.string(), parentId: v.id('users') },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.token);
    return await ctx.db
      .query('students')
      .withIndex('by_parent', (q) => q.eq('parentId', args.parentId))
      .collect();
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id('students'),
    classId: v.optional(v.id('classes')),
    sectionId: v.optional(v.id('sections')),
    rollNumber: v.optional(v.string()),
    guardianName: v.optional(v.string()),
    guardianPhone: v.optional(v.string()),
    address: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    gender: v.optional(v.union(v.literal('male'), v.literal('female'))),
  },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'createAnyUser');
    const { token, id, ...updates } = args;
    await ctx.db.patch(args.id, updates);
    await audit(ctx, actor, 'student.update', 'students', args.id);
    return args.id;
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id('students') },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'deleteAnyRecord');
    await ctx.db.delete(args.id);
    await audit(ctx, actor, 'student.delete', 'students', args.id);
    return null;
  },
});

// ─── Teachers (admin) ──────────────────────────────────────
export const createTeacher = mutation({
  args: {
    token: v.string(),
    userId: v.id('users'),
    employeeNumber: v.string(),
    department: v.optional(v.string()),
    qualification: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'createAnyUser');
    const id = await ctx.db.insert('teachers', {
      ...args,
      joinDate: Date.now(),
      createdAt: Date.now(),
    });
    await audit(ctx, actor, 'teacher.create', 'teachers', id);
    return id;
  },
});

export const listTeachers = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.token);
    return await ctx.db.query('teachers').order('desc').collect();
  },
});

export const teacherByUser = query({
  args: { token: v.string(), userId: v.id('users') },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.token);
    return await ctx.db
      .query('teachers')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .unique();
  },
});
