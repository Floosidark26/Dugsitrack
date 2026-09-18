import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import type { LoginUser } from '../lib/types';

export default function Timetable({ token, user }: { token: string; user: LoginUser }) {
  const classes = useQuery(api.classes.listClasses, { token });
  const student = useQuery(api.people.byUser, user.role === 'student' ? { token, userId: user._id as Id<'users'> } : 'skip');
  const children = useQuery(api.people.byParent, user.role === 'parent' ? { token, parentId: user._id as Id<'users'> } : 'skip');
  const [selectedClass, setSelectedClass] = useState('');
  const teacherRows = useQuery(api.timetable.teacherTimetable, user.role === 'teacher' ? { token, teacherId: user._id as Id<'users'> } : 'skip');
  const classId = user.role === 'student' ? student?.classId : user.role === 'parent' ? children?.[0]?.classId : selectedClass as Id<'classes'>;
  const classRows = useQuery(api.timetable.classTimetable, classId ? { token, classId } : 'skip');
  const rows = user.role === 'teacher' ? teacherRows : classRows;
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  return (
    <>
      <div className="page-header">
        <div><div className="eyebrow">Scheduling</div><h1>Timetable</h1><p>View and manage class schedules and periods.</p></div>
      </div>
      {user.role !== 'teacher' && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'librarian' || user.role === 'accountant') && <div className="panel table-toolbar"><label>Class<select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}><option value="">Select a class…</option>{(classes ?? []).map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label></div>}
      <section className="panel timetable-panel">{rows === undefined ? <div className="loader">Loading timetable…</div> : rows.length === 0 ? <div className="empty">No timetable entries found.</div> : <div className="timetable-grid">{days.map((day) => <div className="timetable-day" key={day}><h3>{day}</h3>{rows.filter((row) => row.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime)).map((row) => <article className="schedule-card" key={row._id}><strong>{row.subjectName}</strong><span>{row.startTime} - {row.endTime}</span><small>{'className' in row ? row.className : row.teacherName}{row.room ? ` · ${row.room}` : ''}</small></article>)}</div>)}</div>}
      </section>
    </>
  );
}
