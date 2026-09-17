import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

/**
 * DugsiHub — full school management schema.
 * Roles: super_admin | admin | accountant | librarian | teacher | student | parent
 */

const role = v.union(
  v.literal('super_admin'),
  v.literal('admin'),
  v.literal('accountant'),
  v.literal('librarian'),
  v.literal('teacher'),
  v.literal('student'),
  v.literal('parent'),
);

export default defineSchema({
  // ─── Auth ───────────────────────────────────────────────
  users: defineTable({
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    salt: v.string(),
    role,
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  })
    .index('by_email', ['email'])
    .index('by_role', ['role']),

  sessions: defineTable({
    userId: v.id('users'),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index('by_token', ['token'])
    .index('by_user', ['userId']),

  // ─── Academic structure ─────────────────────────────────
  classes: defineTable({
    name: v.string(),
    level: v.optional(v.string()),
    description: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_name', ['name']),

  sections: defineTable({
    classId: v.id('classes'),
    name: v.string(),
    capacity: v.optional(v.number()),
    classTeacherId: v.optional(v.id('users')),
    createdAt: v.number(),
  })
    .index('by_class', ['classId'])
    .index('by_class_and_name', ['classId', 'name']),

  subjects: defineTable({
    name: v.string(),
    code: v.string(),
    classId: v.id('classes'),
    teacherId: v.optional(v.id('users')),
    createdAt: v.number(),
  })
    .index('by_class', ['classId'])
    .index('by_code', ['code'])
    .index('by_teacher', ['teacherId']),

  // ─── People ─────────────────────────────────────────────
  students: defineTable({
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
    admissionDate: v.number(),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_admission', ['admissionNumber'])
    .index('by_class', ['classId'])
    .index('by_section', ['sectionId'])
    .index('by_parent', ['parentId']),

  teachers: defineTable({
    userId: v.id('users'),
    employeeNumber: v.string(),
    department: v.optional(v.string()),
    qualification: v.optional(v.string()),
    joinDate: v.number(),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_employee', ['employeeNumber']),

  parents: defineTable({
    userId: v.id('users'),
    occupation: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_user', ['userId']),

  // ─── Exams & marks ──────────────────────────────────────
  exams: defineTable({
    name: v.string(),
    classId: v.id('classes'),
    term: v.optional(v.string()),
    date: v.number(),
    totalMarks: v.number(),
    createdAt: v.number(),
  })
    .index('by_class', ['classId'])
    .index('by_date', ['date']),

  marks: defineTable({
    examId: v.id('exams'),
    studentId: v.id('students'),
    subjectId: v.id('subjects'),
    marks: v.number(),
    grade: v.optional(v.string()),
    remark: v.optional(v.string()),
    createdBy: v.id('users'),
    updatedAt: v.number(),
  })
    .index('by_exam', ['examId'])
    .index('by_student', ['studentId'])
    .index('by_subject', ['subjectId'])
    .index('by_exam_student', ['examId', 'studentId']),

  // ─── Timetable ──────────────────────────────────────────
  timetable: defineTable({
    classId: v.id('classes'),
    sectionId: v.optional(v.id('sections')),
    subjectId: v.id('subjects'),
    teacherId: v.id('users'),
    day: v.union(
      v.literal('monday'),
      v.literal('tuesday'),
      v.literal('wednesday'),
      v.literal('thursday'),
      v.literal('friday'),
      v.literal('saturday'),
      v.literal('sunday'),
    ),
    startTime: v.string(),
    endTime: v.string(),
    room: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_class_day', ['classId', 'day'])
    .index('by_teacher_day', ['teacherId', 'day'])
    .index('by_section', ['sectionId']),

  // ─── Notices & events ───────────────────────────────────
  notices: defineTable({
    title: v.string(),
    body: v.string(),
    audience: v.union(
      v.literal('all'),
      v.literal('teachers'),
      v.literal('students'),
      v.literal('parents'),
    ),
    isEvent: v.boolean(),
    eventDate: v.optional(v.number()),
    createdBy: v.id('users'),
    createdAt: v.number(),
  })
    .index('by_created', ['createdAt'])
    .index('by_event_date', ['eventDate']),

  // ─── Payments ───────────────────────────────────────────
  payments: defineTable({
    studentId: v.id('students'),
    title: v.string(),
    amount: v.number(),
    type: v.optional(v.string()),
    status: v.union(v.literal('pending'), v.literal('paid'), v.literal('partial'), v.literal('refunded')),
    method: v.optional(v.string()),
    paidAmount: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    paidAt: v.optional(v.number()),
    receiptNumber: v.optional(v.string()),
    note: v.optional(v.string()),
    createdBy: v.optional(v.id('users')),
    createdAt: v.number(),
  })
    .index('by_student', ['studentId'])
    .index('by_status', ['status'])
    .index('by_receipt', ['receiptNumber'])
    .index('by_created', ['createdAt']),

  // ─── Library ────────────────────────────────────────────
  books: defineTable({
    title: v.string(),
    author: v.string(),
    isbn: v.optional(v.string()),
    category: v.optional(v.string()),
    publisher: v.optional(v.string()),
    totalCopies: v.number(),
    availableCopies: v.number(),
    shelf: v.optional(v.string()),
    edition: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_title', ['title'])
    .index('by_category', ['category']),

  bookIssues: defineTable({
    bookId: v.id('books'),
    studentId: v.id('students'),
    issuedAt: v.number(),
    dueAt: v.number(),
    returnedAt: v.optional(v.number()),
    status: v.union(v.literal('issued'), v.literal('returned'), v.literal('overdue')),
    createdBy: v.id('users'),
  })
    .index('by_book', ['bookId'])
    .index('by_student', ['studentId'])
    .index('by_status', ['status']),

  // ─── Study materials ────────────────────────────────────
  materials: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    subjectId: v.id('subjects'),
    classId: v.id('classes'),
    uploadedBy: v.id('users'),
    fileUrl: v.string(),
    fileName: v.string(),
    fileSize: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_subject', ['subjectId'])
    .index('by_class', ['classId'])
    .index('by_uploaded', ['uploadedBy']),

  // ─── Audit log (super admin oversight) ──────────────────
  auditLogs: defineTable({
    actorId: v.id('users'),
    action: v.string(),
    entityType: v.string(),
    entityId: v.optional(v.string()),
    detail: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_created', ['createdAt']),
});
