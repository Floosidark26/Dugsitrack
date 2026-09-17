import { query } from './_generated/server';
import { v } from 'convex/values';
import { requireAuth, requirePermission } from './lib/auth';

/** Role-scoped dashboard stats. */
export const overview = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.token);
    const counts = {
      students: (await ctx.db.query('students').collect()).length,
      teachers: (await ctx.db.query('teachers').collect()).length,
      classes: (await ctx.db.query('classes').collect()).length,
      subjects: (await ctx.db.query('subjects').collect()).length,
      books: (await ctx.db.query('books').collect()).length,
      notices: (await ctx.db.query('notices').collect()).length,
      users: (await ctx.db.query('users').collect()).length,
      payments: (await ctx.db.query('payments').collect()).length,
    };
    const finance = await ctx.db.query('payments').collect();
    const collected = finance.filter((p) => p.status === 'paid').reduce((a, p) => a + (p.paidAmount ?? 0), 0);
    const outstanding = finance
      .filter((p) => p.status !== 'paid' && p.status !== 'refunded')
      .reduce((a, p) => a + p.amount - (p.paidAmount ?? 0), 0);
    const issuedBooks = (await ctx.db.query('bookIssues').collect()).filter((i) => i.status !== 'returned').length;
    return { role: user.role, counts, collected, outstanding, issuedBooks };
  },
});

/** Super admin oversight: recent audit trail. */
export const auditTrail = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await requirePermission(ctx, args.token, 'deleteAnyRecord');
    const rows = await ctx.db
      .query('auditLogs')
      .withIndex('by_created', (q) => q.gte('createdAt', 0))
      .order('desc')
      .take(25);
    return Promise.all(
      rows.map(async (r) => {
        const actor = await ctx.db.get(r.actorId);
        return { ...r, actorName: actor?.name ?? 'Unknown' };
      }),
    );
  },
});
