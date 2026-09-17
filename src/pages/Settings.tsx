import type { LoginUser } from '../lib/types';

export default function Settings({ token, user, me }: { token: string; user: LoginUser; me: any }) {
  return (
    <>
      <div className="page-header">
        <div><div className="eyebrow">Configuration</div><h1>Settings</h1><p>Manage school profile, academic terms, and system preferences.</p></div>
      </div>
      <section className="panel">
        <h2>Your account</h2>
        <div className="settings-row">
          <div className="avatar avatar-large avatar-purple">{user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
          <div>
            <strong>{user.name}</strong>
            <p>{user.email}</p>
            <span className="role-pill">{user.role.replace('_', ' ')}</span>
          </div>
        </div>
      </section>
      <section className="panel">
        <h2>School profile</h2>
        <div className="form-grid">
          <label>School name<input defaultValue="DugsiHub Academy" disabled /></label>
          <label>Contact email<input defaultValue="info@dugsihub.com" disabled /></label>
          <label>Address<input defaultValue="123 Education Lane, Learning City" disabled /></label>
        </div>
        <p className="hint">Profile editing available for super admins in next release.</p>
      </section>
    </>
  );
}
