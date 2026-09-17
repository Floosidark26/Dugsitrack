import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const byDate = query({ args: { schoolId: v.id('schools'), date: v.string() }, handler: async (ctx, args) => ctx.db.query('attendance').withIndex('by_school_date', (q) => q.eq('schoolId', args.schoolId).eq('date', args.date)).collect() });

export const mark = mutation({ args: { schoolId: v.id('schools'), studentId: v.id('students'), date: v.string(), status: v.union(v.literal('present'), v.literal('late'), v.literal('absent')), note: v.optional(v.string()), markedBy: v.string() }, handler: async (ctx, args) => { const existing = await ctx.db.query('attendance').withIndex('by_student_date', (q) => q.eq('studentId', args.studentId).eq('date', args.date)).unique(); if (existing) { await ctx.db.patch(existing._id, args); return existing._id; } return ctx.db.insert('attendance', args); } });
