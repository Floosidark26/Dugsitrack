import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Classes({ token }: { token: string }) {
  const classes = useQuery(api.classes.listClasses, { token });
  const createClass = useMutation(api.classes.createClass);
  const deleteClass = useMutation(api.classes.deleteClass);
  const [name, setName] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createClass({ token, name });
    setName('');
  };

  return (
    <>
      <div className="page-header">
        <div><div className="eyebrow">Academic</div><h1>Classes</h1><p>Manage classes and their sections.</p></div>
      </div>
      <form className="panel form-panel" onSubmit={submit}>
        <h2>Add class</h2>
        <div className="form-grid">
          <label>Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Grade 9" required /></label>
        </div>
        <button type="submit">Add class</button>
      </form>
      <section className="panel table-panel">
        {classes === undefined ? <div className="loader">Loading…</div> : classes.length === 0 ? (
          <div className="empty">No classes yet.</div>
        ) : (
          <table>
            <thead><tr><th>Class</th><th>Level</th><th>Created</th><th /></tr></thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c._id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.level ?? '—'}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="icon-button" title="Delete"
                      onClick={async () => { if (confirm(`Delete ${c.name}?`)) await deleteClass({ token, id: c._id }); }}>
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
