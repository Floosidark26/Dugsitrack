import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requirePermission, requireAuth, audit } from './lib/auth';

export const addBook = mutation({
  args: {
    token: v.string(),
    title: v.string(),
    author: v.string(),
    isbn: v.optional(v.string()),
    category: v.optional(v.string()),
    publisher: v.optional(v.string()),
    totalCopies: v.number(),
    shelf: v.optional(v.string()),
    edition: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'manageLibrary');
    const id = await ctx.db.insert('books', {
      ...args,
      availableCopies: args.totalCopies,
      createdAt: Date.now(),
    });
    await audit(ctx, actor, 'book.add', 'books', id);
    return id;
  },
});

export const listBooks = query({
  args: { token: v.string(), search: v.optional(v.string()), category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.token);
    let rows = await ctx.db.query('books').order('desc').collect();
    if (args.category) rows = rows.filter((b) => b.category === args.category);
    const search = args.search?.trim().toLowerCase();
    if (search) rows = rows.filter((b) => `${b.title} ${b.author} ${b.isbn ?? ''}`.toLowerCase().includes(search));
    return rows;
  },
});

export const updateBook = mutation({
  args: {
    token: v.string(),
    id: v.id('books'),
    title: v.optional(v.string()),
    author: v.optional(v.string()),
    category: v.optional(v.string()),
    totalCopies: v.optional(v.number()),
    shelf: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'manageLibrary');
    const { token, id, ...updates } = args;
    const patch: Record<string, unknown> = { ...updates };
    if (updates.totalCopies !== undefined) {
      const book = await ctx.db.get(args.id);
      const issued = book ? book.totalCopies - book.availableCopies : 0;
      patch.availableCopies = Math.max(0, updates.totalCopies - issued);
    }
    await ctx.db.patch(args.id, patch);
    await audit(ctx, actor, 'book.update', 'books', args.id);
    return args.id;
  },
});

export const removeBook = mutation({
  args: { token: v.string(), id: v.id('books') },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'deleteAnyRecord');
    await ctx.db.delete(args.id);
    await audit(ctx, actor, 'book.delete', 'books', args.id);
    return null;
  },
});

// ─── Circulation ───────────────────────────────────────────
export const issueBook = mutation({
  args: { token: v.string(), bookId: v.id('books'), studentId: v.id('students'), days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'manageLibrary');
    const book = await ctx.db.get(args.bookId);
    if (!book) throw new Error('Book not found');
    if (book.availableCopies <= 0) throw new Error('No copies available');
    const student = await ctx.db.get(args.studentId);
    if (!student) throw new Error('Student not found');
    const days = args.days ?? 14;
    const id = await ctx.db.insert('bookIssues', {
      bookId: args.bookId,
      studentId: args.studentId,
      issuedAt: Date.now(),
      dueAt: Date.now() + days * 24 * 60 * 60 * 1000,
      status: 'issued',
      createdBy: actor._id,
    });
    await ctx.db.patch(args.bookId, { availableCopies: book.availableCopies - 1 });
    await audit(ctx, actor, 'book.issue', 'bookIssues', id);
    return id;
  },
});

export const returnBook = mutation({
  args: { token: v.string(), issueId: v.id('bookIssues') },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'manageLibrary');
    const issue = await ctx.db.get(args.issueId);
    if (!issue || issue.status === 'returned') throw new Error('Invalid issue');
    const book = await ctx.db.get(issue.bookId);
    await ctx.db.patch(args.issueId, { status: 'returned', returnedAt: Date.now() });
    if (book) await ctx.db.patch(book._id, { availableCopies: book.availableCopies + 1 });
    await audit(ctx, actor, 'book.return', 'bookIssues', args.issueId);
    return args.issueId;
  },
});

export const issues = query({
  args: { token: v.string(), studentId: v.optional(v.id('students')), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.token);
    if (user.role === 'student') {
      const mine = await ctx.db.query('students').withIndex('by_user', (q) => q.eq('userId', user._id)).unique();
      if (!mine) return [];
      const rows = await ctx.db
        .query('bookIssues')
        .withIndex('by_student', (q) => q.eq('studentId', mine._id))
        .order('desc')
        .collect();
      return Promise.all(rows.map(async (r) => ({ ...r, bookTitle: (await ctx.db.get(r.bookId))?.title ?? '' })));
    }
    let rows = await ctx.db.query('bookIssues').order('desc').collect();
    if (args.studentId) rows = rows.filter((r) => r.studentId === args.studentId);
    if (args.status) rows = rows.filter((r) => r.status === args.status);
    return Promise.all(rows.map(async (r) => ({ ...r, bookTitle: (await ctx.db.get(r.bookId))?.title ?? '' })));
  },
});
