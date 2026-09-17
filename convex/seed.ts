import { mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * One-time bootstrap: creates roles/accounts and demo academic data
 * only if the instance is empty. Safe to call repeatedly.
 */
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const userCount = (await ctx.db.query('users').collect()).length;
    if (userCount > 0) return { alreadySeeded: true };

    const now = Date.now();
    const mkUser = async (name: string, email: string, password: string, role: string) =>
      ctx.db.insert('users', { name, email, passwordHash: password, salt: '', role: role as never, isActive: true, createdAt: now });

    const superAdmin = await mkUser('Super Admin', 'superadmin@dugsihub.com', 'admin123', 'super_admin');
    const admin = await mkUser('School Admin', 'admin@dugsihub.com', 'admin123', 'admin');
    const accountant = await mkUser('Accountant', 'accountant@dugsihub.com', 'admin123', 'accountant');
    const librarian = await mkUser('Librarian', 'librarian@dugsihub.com', 'admin123', 'librarian');
    const teacher = await mkUser('Amina Yusuf', 'amina@dugsihub.com', 'admin123', 'teacher');
    const studentUser = await mkUser('Ayaan Hassan', 'ayaan@dugsihub.com', 'admin123', 'student');
    const parentUser = await mkUser('Hassan Ali', 'hassan@dugsihub.com', 'admin123', 'parent');

    await ctx.db.insert('teachers', {
      userId: teacher,
      employeeNumber: 'EMP-001',
      department: 'Mathematics',
      qualification: 'B.Sc. Mathematics',
      joinDate: now,
      createdAt: now,
    });

    const cls = await ctx.db.insert('classes', { name: 'Grade 8', level: 'Middle', createdAt: now });
    const section = await ctx.db.insert('sections', {
      classId: cls,
      name: 'A',
      capacity: 30,
      classTeacherId: teacher,
      createdAt: now,
    });
    const subject = await ctx.db.insert('subjects', {
      name: 'Mathematics',
      code: 'MATH-8',
      classId: cls,
      teacherId: teacher,
      createdAt: now,
    });
    await ctx.db.insert('subjects', {
      name: 'English',
      code: 'ENG-8',
      classId: cls,
      createdAt: now,
    });

    const student = await ctx.db.insert('students', {
      userId: studentUser,
      admissionNumber: 'ADM-2026-001',
      classId: cls,
      sectionId: section,
      rollNumber: '01',
      guardianName: 'Hassan Ali',
      guardianPhone: '+252 61 2345678',
      guardianRelation: 'Father',
      parentId: parentUser,
      dateOfBirth: '2012-04-15',
      gender: 'male',
      admissionDate: now,
      createdAt: now,
    });
    await ctx.db.insert('parents', { userId: parentUser, occupation: 'Engineer', createdAt: now });

    const exam = await ctx.db.insert('exams', {
      name: 'Midterm Exam',
      classId: cls,
      term: 'Term 1',
      date: now,
      totalMarks: 100,
      createdAt: now,
    });
    await ctx.db.insert('marks', {
      examId: exam,
      studentId: student,
      subjectId: subject,
      marks: 86,
      grade: 'A',
      createdBy: admin,
      updatedAt: now,
    });

    await ctx.db.insert('payments', {
      studentId: student,
      title: 'Term 1 Tuition',
      amount: 250,
      type: 'tuition',
      status: 'paid',
      method: 'bank_transfer',
      paidAmount: 250,
      paidAt: now,
      receiptNumber: 'RC-SEED-001',
      createdBy: accountant,
      createdAt: now,
    });

    await ctx.db.insert('books', {
      title: 'Introduction to Mathematics',
      author: 'A. Hassan',
      isbn: '978-0-123456-78-9',
      category: 'Mathematics',
      totalCopies: 10,
      availableCopies: 10,
      shelf: 'A-1',
      createdAt: now,
    });

    await ctx.db.insert('notices', {
      title: 'Welcome to DugsiHub',
      body: 'School operations are now managed on DugsiHub. Check here for updates.',
      audience: 'all',
      isEvent: false,
      createdBy: admin,
      createdAt: now,
    });
    await ctx.db.insert('notices', {
      title: 'Parent-Teacher Meeting',
      body: 'Scheduled meeting to discuss student progress.',
      audience: 'parents',
      isEvent: true,
      eventDate: now + 7 * 24 * 60 * 60 * 1000,
      createdBy: admin,
      createdAt: now,
    });

    return { seeded: true };
  },
});
