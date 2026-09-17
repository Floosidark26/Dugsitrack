import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requirePermission, requireAuth, audit } from './lib/auth';

const receiptCode = () => `RC-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

export const recordPayment = mutation({
  args: {
    token: v.string(),
    studentId: v.id('students'),
    title: v.string(),
    amount: v.number(),
    type: v.optional(v.string()),
    method: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    note: v.optional(v.string()),
    status: v.optional(v.union(v.literal('pending'), v.literal('paid'), v.literal('partial'))),
  },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'managePayments');
    const status = args.status ?? 'paid';
    const id = await ctx.db.insert('payments', {
      studentId: args.studentId,
      title: args.title,
      amount: args.amount,
      type: args.type,
      method: args.method,
      dueDate: args.dueDate,
      note: args.note,
      status,
      paidAmount: status === 'paid' ? args.amount : status === 'partial' ? Math.round(args.amount / 2) : undefined,
      paidAt: status !== 'pending' ? Date.now() : undefined,
      receiptNumber: status !== 'pending' ? receiptCode() : undefined,
      createdBy: actor._id,
      createdAt: Date.now(),
    });
    await audit(ctx, actor, 'payment.record', 'payments', id);
    return id;
  },
});

export const listPayments = query({
  args: { token: v.string(), studentId: v.optional(v.id('students')), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.token);
    // Students/parents see only their own payments.
    if (user.role === 'student' || user.role === 'parent') {
      const myStudents =
        user.role === 'student'
          ? await ctx.db.query('students').withIndex('by_user', (q) => q.eq('userId', user._id)).collect()
          : await ctx.db.query('students').withIndex('by_parent', (q) => q.eq('parentId', user._id)).collect();
      const ids = new Set(myStudents.map((s) => s._id));
      const rows = await ctx.db
        .query('payments')
        .withIndex('by_created', (q) => q.gte('createdAt', 0))
        .order('desc')
        .take(100);
      return rows.filter((p) => ids.has(p.studentId));
    }
    if (args.studentId) {
      const studentId = args.studentId;
      const rows = await ctx.db
        .query('payments')
        .withIndex('by_student', (q) => q.eq('studentId', studentId))
        .order('desc')
        .collect();
      return args.status ? rows.filter((p) => p.status === args.status) : rows;
    }
    const rows = await ctx.db
      .query('payments')
      .withIndex('by_created', (q) => q.gte('createdAt', 0))
      .order('desc')
      .take(100);
    return args.status ? rows.filter((p) => p.status === args.status) : rows;
  },
});

export const markPaid = mutation({
  args: { token: v.string(), id: v.id('payments'), method: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'managePayments');
    const payment = await ctx.db.get(args.id);
    if (!payment) throw new Error('Payment not found');
    await ctx.db.patch(args.id, {
      status: 'paid',
      paidAmount: payment.amount,
      paidAt: Date.now(),
      method: args.method ?? 'cash',
      receiptNumber: payment.receiptNumber ?? receiptCode(),
    });
    await audit(ctx, actor, 'payment.markPaid', 'payments', args.id);
    return args.id;
  },
});

export const refund = mutation({
  args: { token: v.string(), id: v.id('payments') },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'managePayments');
    await ctx.db.patch(args.id, { status: 'refunded' });
    await audit(ctx, actor, 'payment.refund', 'payments', args.id);
    return args.id;
  },
});

/** Aggregate fee stats for the finance dashboard. */
export const stats = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.token, 'managePayments');
    const rows = await ctx.db.query('payments').collect();
    const collected = rows.filter((p) => p.status === 'paid').reduce((a, p) => a + (p.paidAmount ?? 0), 0);
    const outstanding = rows
      .filter((p) => p.status !== 'paid' && p.status !== 'refunded')
      .reduce((a, p) => a + p.amount - (p.paidAmount ?? 0), 0);
    return {
      collected,
      outstanding,
      pendingCount: rows.filter((p) => p.status === 'pending').length,
      paidCount: rows.filter((p) => p.status === 'paid').length,
    };
  },
});
