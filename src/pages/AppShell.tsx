import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { LoginUser } from '../lib/types';
import { ROLE_LABELS } from '../lib/types';
import { navFor } from '../lib/nav';
import Dashboard from './Dashboard';
import Users from './Users';
import Students from './Students';
import Classes from './Classes';
import Subjects from './Subjects';
import Exams from './Exams';
import Timetable from './Timetable';
import Notices from './Notices';
import Payments from './Payments';
import Library from './Library';
import Materials from './Materials';
import Audit from './Audit';
import Settings from './Settings';

interface AppProps {
  user: LoginUser;
  token: string;
  onLogout: () => void;
}

export default function App({ user, token, onLogout }: AppProps) {
  const [view, setView] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = navFor(user.role);
  const current = items.find((i) => i.view === view) ?? items[0];

  const me = useQuery(api.users.me, { token });

  const render = () => {
    switch (view) {
      case 'dashboard': return <Dashboard user={user} token={token} setView={setView} />;
      case 'users': return <Users token={token} />;
      case 'students': return <Students token={token} user={user} />;
      case 'classes': return <Classes token={token} />;
      case 'subjects': return <Subjects token={token} user={user} />;
      case 'exams': return <Exams token={token} user={user} />;
      case 'timetable': return <Timetable token={token} user={user} />;
      case 'notices': return <Notices token={token} user={user} />;
      case 'payments': return <Payments token={token} user={user} />;
      case 'library': return <Library token={token} user={user} />;
      case 'materials': return <Materials token={token} user={user} />;
      case 'audit': return <Audit token={token} />;
      case 'settings': return <Settings token={token} user={user} me={me} />;
      default: return <Dashboard user={user} token={token} setView={setView} />;
    }
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <span className="material-symbols-outlined brand-mark">school</span>
          <span>Dugsi<span>Hub</span></span>
        </div>
        <div className="workspace-switcher">
          <div className="school-avatar">DH</div>
          <div><strong>DugsiHub Academy</strong><small>{ROLE_LABELS[user.role]} workspace</small></div>
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          {items.map((item) => (
            <button
              key={item.view}
              className={view === item.view ? 'nav-item active' : 'nav-item'}
              onClick={() => { setView(item.view); setMobileOpen(false); }}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="user-row">
            <div className="avatar avatar-purple">{user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
            <div><strong>{user.name}</strong><small>{user.email}</small></div>
            <button className="icon-button" title="Sign out" onClick={onLogout}>
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </aside>
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="breadcrumb"><strong>{current.label}</strong></div>
          <div className="top-actions">
            <span className="role-pill">{ROLE_LABELS[user.role]}</span>
            <div className="avatar avatar-purple">{user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
          </div>
        </header>
        <div className="page-content">{render()}</div>
      </main>
    </div>
  );
}
