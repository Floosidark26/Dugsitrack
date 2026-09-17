import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import type { LoginUser } from '../lib/types';

export default function Subjects({ token, user }: { token: string; user: LoginUser }) {
  const subjects = useQuery(api.subjects.list, { token });
  const classes = useQuery(api.classes.listClasses, { token });
  const teachers = useQuery(api.people.listTeachers, { token });
  const users = useQuery(api.users.list, { token });
  const create = useMutation(api.subjects.create);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [classId, setClassId] = useState('');
  const [teacherId, setTeacherId] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create({ token, name, code, classId: classId as Id<'classes'>, teacherId: teacherId ? (teacherId as Id<'users'>) : undefined });
    setName(''); setCode(''); setClassId(''); setTeacherId('');
  };

  const teacherName = (id?: Id<'users'>) => (users ?? []).find((u) => u._id === id)?.name ?? 'Unassigned';
  const canManage = ['super_admin', 'admin'].includes(user.role);

  return (
    <>
      <div className="page-header">
        <div><div className="eyebrow">Academic</div><h1>Subjects</h1><p>Create and assign subjects to classes and teachers.</p></div>
      </div>
      {canManage && <form className="panel form-panel" onSubmit={submit}>
        <h2>Add subject</h2>
        <div className="form-grid">
          <label>Name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
          <label>Code<input value={code} onChange={(e) => setCode(e.target.value)} required /></label>
          <label>Class
            <select value={classId} onChange={(e) => setClassId(e.target.value)} required>
              <option value="">Select…</option>
              {(classes ?? []).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </label>
          <label>Teacher
            <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
              <option value="">Unassigned</option>
              {(teachers ?? []).map((t) => {
                const u = (users ?? []).find((x) => x._id === t.userId);
                return <option key={t._id} value={t.userId}>{u?.name ?? 'Teacher'}</option>;
              })}
            </select>
          </label>
        </div>
        <button type="submit">Add subject</button>
      </form>}
      <section className="panel table-panel">
        {subjects === undefined ? <div className="loader">Loading…</div> : subjects.length === 0 ? (
          <div className="empty">No subjects yet.</div>
        ) : (
          <table>
            <thead><tr><th>Subject</th><th>Code</th><th>Class</th><th>Teacher</th></tr></thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s._id}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.code}</td>
                  <td>{(classes ?? []).find((c) => c._id === s.classId)?.name ?? '—'}</td>
                  <td>{teacherName(s.teacherId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
