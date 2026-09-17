import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { LoginUser } from '../lib/types';

export default function Notices({ token, user }: { token: string; user: LoginUser }) {
  const notices = useQuery(api.notices.list, { token });
  const create = useMutation(api.notices.publish);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isEvent, setIsEvent] = useState(false);
  const [audience, setAudience] = useState<'all'|'teachers'|'students'|'parents'>('all');

  const canManage = ['super_admin', 'admin'].includes(user.role);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create({ token, title, body, isEvent, audience });
    setTitle(''); setBody(''); setIsEvent(false); setAudience('all');
  };

  return (
    <>
      <div className="page-header">
        <div><div className="eyebrow">Communication</div><h1>Noticeboard</h1><p>Broadcast announcements to parents, teachers, and students.</p></div>
      </div>
      {canManage && (
        <form className="panel form-panel" onSubmit={submit}>
          <h2>Post notice</h2>
          <div className="form-grid">
            <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
            <label>Audience
              <select value={audience} onChange={(e) => setAudience(e.target.value as any)}>
                <option value="all">Everyone</option>
                <option value="teachers">Teachers</option>
                <option value="students">Students</option>
                <option value="parents">Parents</option>
              </select>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={isEvent} onChange={(e) => setIsEvent(e.target.checked)} />
              This is an event announcement
            </label>
          </div>
          <label>Message<textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} required /></label>
          <button type="submit">Post notice</button>
        </form>
      )}
      <section className="panel">
        {notices === undefined ? <div className="loader">Loading…</div> : notices.length === 0 ? (
          <div className="empty">No notices yet.</div>
        ) : (
          <div className="notices-list">
            {notices.map((n) => (
              <div key={n._id} className="notice-card">
                <div className="notice-header">
                  <div className="notice-icon">
                    <span className="material-symbols-outlined">{n.isEvent ? 'event' : 'campaign'}</span>
                  </div>
                  <div>
                    <h3>{n.title}</h3>
                    <time>{new Date(n.createdAt).toLocaleDateString()}</time>
                    <span className="role-pill">{n.audience}</span>
                  </div>
                </div>
                <p>{n.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
