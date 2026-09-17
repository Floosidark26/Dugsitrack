import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export default function Audit({ token }: { token: string }) {
  const logs = useQuery(api.audit.list, { token });
  const users = useQuery(api.users.list, { token });

  const userName = (id: Id<'users'>) => (users ?? []).find((u) => u._id === id)?.name ?? 'System';

  return (
    <>
      <div className="page-header">
        <div><div className="eyebrow">Security</div><h1>Audit Trail</h1><p>Comprehensive activity log for compliance and security monitoring.</p></div>
      </div>
      <section className="panel table-panel">
        {logs === undefined ? <div className="loader">Loading…</div> : logs.length === 0 ? (
          <div className="empty">No audit logs yet.</div>
        ) : (
          <table>
            <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Entity</th><th>Details</th></tr></thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>{userName(log.actorId)}</td>
                  <td><span className="role-pill">{log.action}</span></td>
                  <td>{log.entityType}</td>
                  <td><code>{log.detail || '—'}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
