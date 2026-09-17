import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  schools: defineTable({ name: v.string(), slug: v.string(), timezone: v.string(), ownerId: v.string() }).index('by_slug', ['slug']).index('by_owner', ['ownerId']),
  members: defineTable({ schoolId: v.id('schools'), userId: v.string(), name: v.string(), email: v.string(), role: v.union(v.literal('admin'), v.literal('teacher'), v.literal('finance'), v.literal('parent')), status: v.union(v.literal('active'), v.literal('invited')) }).index('by_school', ['schoolId']).index('by_user', ['userId']),
  students: defineTable({ schoolId: v.id('schools'), firstName: v.string(), lastName: v.string(), studentCode: v.string(), grade: v.string(), status: v.union(v.literal('active'), v.literal('inactive')), guardianName: v.optional(v.string()), guardianPhone: v.optional(v.string()), enrolledAt: v.number() }).index('by_school', ['schoolId']).index('by_code', ['schoolId', 'studentCode']),
  attendance: defineTable({ schoolId: v.id('schools'), studentId: v.id('students'), date: v.string(), status: v.union(v.literal('present'), v.literal('late'), v.literal('absent')), note: v.optional(v.string()), markedBy: v.string() }).index('by_school_date', ['schoolId', 'date']).index('by_student_date', ['studentId', 'date']),
  payments: defineTable({ schoolId: v.id('schools'), studentId: v.id('students'), amount: v.number(), currency: v.string(), status: v.union(v.literal('paid'), v.literal('pending'), v.literal('refunded')), reference: v.string(), paidAt: v.number(), recordedBy: v.string() }).index('by_school', ['schoolId']).index('by_reference', ['reference']),
  announcements: defineTable({ schoolId: v.id('schools'), title: v.string(), body: v.string(), audience: v.union(v.literal('all'), v.literal('teachers'), v.literal('parents'), v.literal('students')), publishedAt: v.number(), authorId: v.string() }).index('by_school_date', ['schoolId', 'publishedAt']),
  auditLogs: defineTable({ schoolId: v.id('schools'), actorId: v.string(), action: v.string(), entityType: v.string(), entityId: v.string(), metadata: v.optional(v.any()), createdAt: v.number() }).index('by_school_date', ['schoolId', 'createdAt']),
});
