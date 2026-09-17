import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { LoginUser } from '../lib/types';
import { Id } from '../../convex/_generated/dataModel';

export default function Students({ token, user }: { token: string; user: LoginUser }) {
  const [search, setSearch] = useState('');
  const list = useQuery(api.people.list, { token, search: search || undefined });
  const users = useQuery(api.users.list, { token });
  const classes = useQuery(api.classes.listClasses, { token });
  const createStudent = useMutation(api.people.create);
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [classId, setClassId] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [error, setError] = useState('');

  const canManage = ['super_admin', 'admin'].includes(user.role);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createStudent({ token, userId: userId as Id<'users'>, admissionNumber, classId: classId as Id<'classes'>, rollNumber, guardianName });
      setShowForm(false);
      setUserId(''); setAdmissionNumber(''); setClassId(''); setRollNumber(''); setGuardianName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    }
  };

  const studentUsers = (users ?? []).filter((u) => u.role === 'student');

  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">People</div>
          <h1>Students</h1>
          <p>{canManage ? 'Manage student class/section assignments and profiles.' : 'View student information and class assignments.'}</p>
        </div>
        {canManage && (
          <button className="primary-button" onClick={() => setShowForm((v) => !v)}>
            <span className="material-symbols-outlined">person_add</span> Enroll student
          </button>
        )}
      </div>

      {canManage && showForm && (
        <form className="panel form-panel" onSubmit={submit}>
          <h2>Enroll student</h2>
          <div className="form-grid">
            <label>Account
              <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
                <option value="">Select user…</option>
                {studentUsers.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
              </select>
            </label>
            <label>Admission no.<input value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} required /></label>
            <label>Class
              <select value={classId} onChange={(e) => setClassId(e.target.value)} required>
                <option value="">Select class…</option>
                {(classes ?? []).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </label>
            <label>Roll no.<input value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} /></label>
            <label>Guardian<input value={guardianName} onChange={(e) => setGuardianName(e.target.value)} /></label>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit">Enroll</button>
        </form>
      )}

      <section className="panel table-panel">
        <div className="table-toolbar">
          <div className="search-field">
            <span className="material-symbols-outlined">search</span>
            <input placeholder="Search students" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        {list === undefined ? (
          <div className="loader">Loading…</div>
        ) : list.length === 0 ? (
          <div className="empty">No students found.</div>
        ) : (
          <table>
            <thead><tr><th>Admission</th><th>Roll</th><th>Class</th><th>Guardian</th></tr></thead>
            <tbody>
              {list.map((s) => (
                <tr key={s._id}>
                  <td><strong>{s.admissionNumber}</strong></td>
                  <td>{s.rollNumber ?? '—'}</td>
                  <td>{(classes ?? []).find((c) => c._id === s.classId)?.name ?? '—'}</td>
                  <td>{s.guardianName ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
