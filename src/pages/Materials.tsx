import type { LoginUser } from '../lib/types';

export default function Materials({ token, user }: { token: string; user: LoginUser }) {
  return (
    <>
      <div className="page-header">
        <div><div className="eyebrow">Resources</div><h1>Materials</h1><p>Share study materials, assignments, and resources with students.</p></div>
      </div>
      <section className="panel">
        <div className="empty-state">
          <span className="material-symbols-outlined empty-icon">folder_open</span>
          <h3>Materials library coming soon</h3>
          <p>File uploads, assignment distribution, and resource sharing will be available in the next release.</p>
        </div>
      </section>
    </>
  );
}
