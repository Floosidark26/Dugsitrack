import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requirePermission, requireAuth, audit } from './lib/auth';

const gradeFor = (marks: number, total: number): string => {
  const pct = total > 0 ? (marks / total) * 100 : 0;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  if (pct >= 40) return 'E';
  return 'F';
};

// ─── Exams (admin) ─────────────────────────────────────────
export const createExam = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    classId: v.id('classes'),
    term: v.optional(v.string()),
    date: v.number(),
    totalMarks: v.number(),
  },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'manageExamRecords');
    const id = await ctx.db.insert('exams', {
      name: args.name,
      classId: args.classId,
      term: args.term,
      date: args.date,
      totalMarks: args.totalMarks,
      createdAt: Date.now(),
    });
    await audit(ctx, actor, 'exam.create', 'exams', id);
    return id;
  },
});

export const listExams = query({
  args: { token: v.string(), classId: v.optional(v.id('classes')) },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.token);
    if (args.classId) {
      const classId = args.classId;
      return await ctx.db
        .query('exams')
        .withIndex('by_class', (q) => q.eq('classId', classId))
        .order('desc')
        .collect();
    }
    return await ctx.db.query('exams').order('desc').collect();
  },
});

export const removeExam = mutation({
  args: { token: v.string(), id: v.id('exams') },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'deleteAnyRecord');
    await ctx.db.delete(args.id);
    await audit(ctx, actor, 'exam.delete', 'exams', args.id);
    return null;
  },
});

// ─── Marks (teacher for own subjects / admin) ──────────────
export const upsertMarks = mutation({
  args: {
    token: v.string(),
    examId: v.id('exams'),
    studentId: v.id('students'),
    subjectId: v.id('subjects'),
    marks: v.number(),
    remark: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await requirePermission(ctx, args.token, 'manageExamRecords');
    // Teachers may only record marks for subjects they teach.
    if (actor.role === 'teacher') {
      const subject = await ctx.db.get(args.subjectId);
      if (!subject || subject.teacherId !== actor._id) {
        throw new Error('You can only record marks for your own subjects');
      }
    }
    const exam = await ctx.db.get(args.examId);
    if (!exam) throw new Error('Exam not found');
    if (args.marks < 0 || args.marks > exam.totalMarks) {
      throw new Error(`Marks must be between 0 and ${exam.totalMarks}`);
    }
    const existing = await ctx.db
      .query('marks')
      .withIndex('by_exam_student', (q) => q.eq('examId', args.examId).eq('studentId', args.studentId))
      .unique();
    const grade = gradeFor(args.marks, exam.totalMarks);
    if (existing) {
      await ctx.db.patch(existing._id, {
        marks: args.marks,
        grade,
        remark: args.remark,
        subjectId: args.subjectId,
        updatedAt: Date.now(),
      });
      await audit(ctx, actor, 'marks.update', 'marks', existing._id);
      return existing._id;
    }
    const id = await ctx.db.insert('marks', {
      examId: args.examId,
      studentId: args.studentId,
      subjectId: args.subjectId,
      marks: args.marks,
      grade,
      remark: args.remark,
      createdBy: actor._id,
      updatedAt: Date.now(),
    });
    await audit(ctx, actor, 'marks.create', 'marks', id);
    return id;
  },
});

// Marksheet: admin sees any; student sees own; parent sees own child.
export const marksheet = query({
  args: { token: v.string(), studentId: v.id('students'), examId: v.id('exams') },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.token);
    const student = await ctx.db.get(args.studentId);
    if (!student) throw new Error('Student not found');
    if (user.role === 'student' && student.userId !== user._id) {
      throw new Error('You can only view your own marksheet');
    }
    if (user.role === 'parent' && student.parentId !== user._id) {
      throw new Error('You can only view your own child marksheet');
    }
    if (user.role === 'teacher') {
      const section = student.sectionId ? await ctx.db.get(student.sectionId) : null;
      if (section && section.classTeacherId !== user._id) {
        const subjects = await ctx.db
          .query('subjects')
          .withIndex('by_class', (q) => q.eq('classId', student.classId))
          .filter((q) => q.eq(q.field('teacherId'), user._id))
          .collect();
        if (subjects.length === 0) throw new Error('Not permitted to view this marksheet');
      }
    }
    const rows = await ctx.db
      .query('marks')
      .withIndex('by_exam', (q) => q.eq('examId', args.examId))
      .filter((q) => q.eq(q.field('studentId'), args.studentId))
      .collect();
    return Promise.all(
      rows.map(async (m) => {
        const subject = await ctx.db.get(m.subjectId);
        return { ...m, subjectName: subject?.name ?? 'Unknown', subjectCode: subject?.code ?? '' };
      }),
    );
  },
});

export const studentResults = query({
  args: { token: v.string(), studentId: v.id('students') },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.token);
    const student = await ctx.db.get(args.studentId);
    if (!student) throw new Error('Student not found');
    if (user.role === 'student' && student.userId !== user._id) throw new Error('Not permitted');
    if (user.role === 'parent' && student.parentId !== user._id) throw new Error('Not permitted');
    return await ctx.db
      .query('marks')
      .withIndex('by_student', (q) => q.eq('studentId', args.studentId))
      .order('desc')
      .collect();
  },
});
