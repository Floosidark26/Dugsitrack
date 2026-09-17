import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const list = query({ args: { schoolId: v.id('schools') }, handler: async (ctx, args) => ctx.db.query('payments').withIndex('by_school', (q) => q.eq('schoolId', args.schoolId)).order('desc').collect() });

export const record = mutation({ args: { schoolId: v.id('schools'), studentId: v.id('students'), amount: v.number(), currency: v.string(), reference: v.string(), recordedBy: v.string() }, handler: async (ctx, args) => { const id = await ctx.db.insert('payments', { ...args, status: 'paid', paidAt: Date.now() }); await ctx.db.insert('auditLogs', { schoolId: args.schoolId, actorId: args.recordedBy, action: 'payment.recorded', entityType: 'payment', entityId: id, createdAt: Date.now() }); return id; } });
