import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const ROLES = ['super_admin', 'admin', 'accountant', 'librarian', 'teacher', 'student', 'parent'] as const;

export default function Users({ token }: { token: string }) {
  const list = useQuery(api.users.list, { token });
  const create = useMutation(api.users.create);
  const remove = useMutation(api.users.remove);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<typeof ROLES[number]>('teacher');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await create({ token, name, email, password, role });
      setName(''); setEmail(''); setPassword(''); setRole('teacher');
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">Accounts</div>
          <h1>Users</h1>
          <p>Create and manage user accounts and their roles.</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm((v) => !v)}>
          <span className="material-symbols-outlined">person_add</span> New user
        </button>
      </div>

      {showForm && (
        <form className="panel form-panel" onSubmit={submit}>
          <h2>Create account</h2>
          <div className="form-grid">
            <label>Name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
            <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
            <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
            <label>Role
              <select value={role} onChange={(e) => setRole(e.target.value as typeof ROLES[number])}>
                {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </label>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create user'}</button>
        </form>
      )}

      <section className="panel table-panel">
        {list === undefined ? (
          <div className="loader">Loading…</div>
        ) : list.length === 0 ? (
          <div className="empty">No users yet.</div>
        ) : (
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last login</th><th /></tr></thead>
            <tbody>
              {list.map((u) => (
                <tr key={u._id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td><span className="role-pill">{u.role.replace('_', ' ')}</span></td>
                  <td>{u.isActive ? 'Active' : 'Inactive'}</td>
                  <td>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <button
                      className="icon-button"
                      title="Delete (super admin only)"
                      onClick={async () => { if (confirm(`Delete ${u.name}?`)) await remove({ token, id: u._id }); }}
                    >
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
