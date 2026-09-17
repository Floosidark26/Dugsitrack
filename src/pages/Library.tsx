import type { LoginUser } from '../lib/types';

export default function Library({ token, user }: { token: string; user: LoginUser }) {
  return (
    <>
      <div className="page-header">
        <div><div className="eyebrow">Resources</div><h1>Library</h1><p>Manage book inventory, issuance, and returns.</p></div>
      </div>
      <section className="panel">
        <div className="empty-state">
          <span className="material-symbols-outlined empty-icon">library_books</span>
          <h3>Library system coming soon</h3>
          <p>Book cataloging, issue tracking, and fine management will be available in the next release.</p>
        </div>
      </section>
    </>
  );
}
