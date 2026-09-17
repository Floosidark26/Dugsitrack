import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { LoginUser } from '../lib/types';
import { ROLE_LABELS } from '../lib/types';

interface Props {
  user: LoginUser;
  token: string;
  setView: (view: string) => void;
}

export default function Dashboard({ user, token, setView }: Props) {
  const data = useQuery(api.dashboard.overview, { token });
  const notices = useQuery(api.notices.list, { token });

  if (data === undefined) return <div className="loader">Loading…</div>;

  const isFinance = ['super_admin', 'admin', 'accountant'].includes(user.role);
  const stats = [
    { label: 'Students', value: data.counts.students, icon: 'school', tone: 'blue' },
    { label: 'Teachers', value: data.counts.teachers, icon: 'group', tone: 'purple' },
    { label: 'Classes', value: data.counts.classes, icon: 'class', tone: 'green' },
    { label: 'Subjects', value: data.counts.subjects, icon: 'menu_book', tone: 'orange' },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">{ROLE_LABELS[user.role]} dashboard</div>
          <h1>Welcome, {user.name.split(' ')[0]}</h1>
          <p>Here's what's happening across your school today.</p>
        </div>
      </div>

      <div className="metric-grid">
        {stats.map((s) => (
          <div key={s.label} className="metric-card">
            <div className={`metric-icon ${s.tone}`}><span className="material-symbols-outlined">{s.icon}</span></div>
            <div className="metric-label">{s.label}</div>
            <strong className="metric-value">{s.value}</strong>
          </div>
        ))}
      </div>

      {isFinance && (
        <div className="metric-grid" style={{ marginTop: 13 }}>
          <div className="metric-card">
            <div className="metric-icon green"><span className="material-symbols-outlined">payments</span></div>
            <div className="metric-label">Fees collected</div>
            <strong className="metric-value">${data.collected.toLocaleString()}</strong>
          </div>
          <div className="metric-card">
            <div className="metric-icon orange"><span className="material-symbols-outlined">receipt_long</span></div>
            <div className="metric-label">Outstanding</div>
            <strong className="metric-value">${data.outstanding.toLocaleString()}</strong>
          </div>
          <div className="metric-card">
            <div className="metric-icon blue"><span className="material-symbols-outlined">library_books</span></div>
            <div className="metric-label">Books issued</div>
            <strong className="metric-value">{data.issuedBooks}</strong>
          </div>
          <div className="metric-card">
            <div className="metric-icon purple"><span className="material-symbols-outlined">campaign</span></div>
            <div className="metric-label">Notices</div>
            <strong className="metric-value">{data.counts.notices}</strong>
          </div>
        </div>
      )}

      <section className="panel" style={{ marginTop: 24 }}>
        <div className="panel-heading">
          <div><h2>Recent notices</h2><p>Latest announcements for your role</p></div>
          {['admin', 'super_admin'].includes(user.role) && (
            <button className="text-button" onClick={() => setView('notices')}>Manage <span className="material-symbols-outlined">arrow_forward</span></button>
          )}
        </div>
        {(notices ?? []).length === 0 ? (
          <div className="empty">No notices yet.</div>
        ) : (
          (notices ?? []).slice(0, 5).map((n) => (
            <div key={n._id} className="activity-row">
              <div className="activity-icon blue"><span className="material-symbols-outlined">{n.isEvent ? 'event' : 'campaign'}</span></div>
              <div className="activity-copy">
                <strong>{n.title}</strong>
                <p>{n.body.slice(0, 90)}{n.body.length > 90 ? '…' : ''}</p>
              </div>
              <time>{new Date(n.createdAt).toLocaleDateString()}</time>
            </div>
          ))
        )}
      </section>
    </>
  );
}
