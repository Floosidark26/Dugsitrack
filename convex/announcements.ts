import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const recent = query({ args: { schoolId: v.id('schools') }, handler: async (ctx, args) => ctx.db.query('announcements').withIndex('by_school_date', (q) => q.eq('schoolId', args.schoolId)).order('desc').take(20) });

export const publish = mutation({ args: { schoolId: v.id('schools'), title: v.string(), body: v.string(), audience: v.union(v.literal('all'), v.literal('teachers'), v.literal('parents'), v.literal('students')), authorId: v.string() }, handler: async (ctx, args) => ctx.db.insert('announcements', { ...args, publishedAt: Date.now() }) });
