import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getBySlug = query({ args: { slug: v.string() }, handler: async (ctx, args) => ctx.db.query('schools').withIndex('by_slug', (q) => q.eq('slug', args.slug)).unique() });

export const create = mutation({ args: { name: v.string(), slug: v.string(), timezone: v.string(), ownerId: v.string() }, handler: async (ctx, args) => { const existing = await ctx.db.query('schools').withIndex('by_slug', (q) => q.eq('slug', args.slug)).unique(); if (existing) throw new Error('A school with this slug already exists'); return ctx.db.insert('schools', args); } });
