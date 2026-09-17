export type Role =
  | 'super_admin'
  | 'admin'
  | 'accountant'
  | 'librarian'
  | 'teacher'
  | 'student'
  | 'parent';

export interface LoginUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
}

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  accountant: 'Accountant',
  librarian: 'Librarian',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
};
