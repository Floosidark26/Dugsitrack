import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { LoginUser } from '../lib/types';
import { Id } from '../../convex/_generated/dataModel';

export default function Exams({ token, user }: { token: string; user: LoginUser }) {
  const exams = useQuery(api.exams.listExams, { token });
  const classes = useQuery(api.classes.listClasses, { token });
  const subjects = useQuery(api.subjects.list, { token });
  const create = useMutation(api.exams.createExam);
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('');
  const [term, setTerm] = useState('');
  const [totalMarks, setTotalMarks] = useState('100');
  const [examDate, setExamDate] = useState('');

  const canManage = ['super_admin', 'admin', 'teacher'].includes(user.role);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create({ token, name, classId: classId as Id<'classes'>, term, date: new Date(examDate).getTime(), totalMarks: Number(totalMarks) });
    setName(''); setClassId(''); setTerm(''); setTotalMarks('100'); setExamDate('');
  };

  return (
    <>
      <div className="page-header">
        <div><div className="eyebrow">Assessment</div><h1>Exams & Marks</h1><p>Schedule assessments and record student grades.</p></div>
      </div>
      {canManage && (
        <form className="panel form-panel" onSubmit={submit}>
          <h2>Schedule exam</h2>
          <div className="form-grid">
            <label>Exam name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
            <label>Class
              <select value={classId} onChange={(e) => setClassId(e.target.value)} required>
                <option value="">Select…</option>
                {(classes ?? []).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </label>
            <label>Term<input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="e.g. Term 1" /></label>
            <label>Total marks<input type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} required /></label>
            <label>Exam date<input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} required /></label>
          </div>
          <button type="submit">Schedule exam</button>
        </form>
      )}
      <section className="panel table-panel">
        {exams === undefined ? <div className="loader">Loading…</div> : exams.length === 0 ? (
          <div className="empty">No exams scheduled.</div>
        ) : (
          <table>
            <thead><tr><th>Exam</th><th>Class</th><th>Term</th><th>Total Marks</th><th>Date</th></tr></thead>
            <tbody>
              {exams.map((e) => (
                <tr key={e._id}>
                  <td><strong>{e.name}</strong></td>
                  <td>{(classes ?? []).find((c) => c._id === e.classId)?.name ?? '—'}</td>
                  <td>{e.term ?? '—'}</td>
                  <td>{e.totalMarks}</td>
                  <td>{new Date(e.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
