import type { Role } from './types';

export interface NavItem {
  label: string;
  icon: string;
  view: string;
  roles: Role[];
}

/** Module visibility per the role spec. */
export const NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', view: 'dashboard', roles: ['super_admin', 'admin', 'accountant', 'librarian', 'teacher', 'student', 'parent'] },
  { label: 'Users', icon: 'group', view: 'users', roles: ['super_admin', 'admin'] },
  { label: 'Students', icon: 'school', view: 'students', roles: ['super_admin', 'admin', 'teacher'] },
  { label: 'Classes', icon: 'class', view: 'classes', roles: ['super_admin', 'admin'] },
  { label: 'Subjects', icon: 'menu_book', view: 'subjects', roles: ['super_admin', 'admin', 'teacher'] },
  { label: 'Exams & Marks', icon: 'fact_check', view: 'exams', roles: ['super_admin', 'admin', 'teacher', 'student', 'parent'] },
  { label: 'Timetable', icon: 'calendar_today', view: 'timetable', roles: ['super_admin', 'admin', 'teacher', 'student', 'parent'] },
  { label: 'Noticeboard', icon: 'campaign', view: 'notices', roles: ['super_admin', 'admin', 'teacher', 'student', 'parent'] },
  { label: 'Payments', icon: 'payments', view: 'payments', roles: ['super_admin', 'admin', 'accountant', 'student', 'parent'] },
  { label: 'Library', icon: 'library_books', view: 'library', roles: ['super_admin', 'admin', 'librarian', 'student', 'parent'] },
  { label: 'Materials', icon: 'folder_open', view: 'materials', roles: ['super_admin', 'admin', 'teacher', 'student'] },
  { label: 'Audit Trail', icon: 'shield', view: 'audit', roles: ['super_admin'] },
  { label: 'Settings', icon: 'settings', view: 'settings', roles: ['super_admin', 'admin'] },
];

export function navFor(role: Role): NavItem[] {
  return NAV.filter((item) => item.roles.includes(role));
}
