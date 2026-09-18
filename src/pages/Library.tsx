import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { LoginUser } from '../lib/types';

export default function Library({ token, user }: { token: string; user: LoginUser }) {
  const books = useQuery(api.library.listBooks, { token });
  const issues = useQuery(api.library.issues, { token });
  const canManage = ['super_admin', 'admin', 'librarian'].includes(user.role);

  return (
    <>
      <div className="page-header">
        <div><div className="eyebrow">Resources</div><h1>Library</h1><p>Manage book inventory, issuance, and returns.</p></div>
      </div>
      <div className="content-grid">
        <section className="panel table-panel"><div className="panel-heading"><div><h2>Book catalogue</h2><p>{canManage ? 'Manage available inventory and circulation.' : 'Browse available books.'}</p></div></div>
          {books === undefined ? <div className="loader">Loading books…</div> : books.length === 0 ? <div className="empty">No books have been added.</div> : <table><thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Available</th></tr></thead><tbody>{books.map((book) => <tr key={book._id}><td><strong>{book.title}</strong><small className="table-subtitle">{book.isbn ?? 'No ISBN'}</small></td><td>{book.author}</td><td>{book.category ?? '—'}</td><td>{book.availableCopies} / {book.totalCopies}</td></tr>)}</tbody></table>}
        </section>
        <section className="panel"><div className="panel-heading"><div><h2>My circulation</h2><p>Current and previous loans.</p></div></div>{issues === undefined ? <div className="loader">Loading loans…</div> : issues.length === 0 ? <div className="empty">No loans found.</div> : <div className="notices-list">{issues.map((issue) => <div className="notice-card" key={issue._id}><div className="notice-header"><div className="notice-icon"><span className="material-symbols-outlined">menu_book</span></div><div><h3>{issue.bookTitle}</h3><time>Due {new Date(issue.dueAt).toLocaleDateString()}</time></div></div><span className={`status-pill ${issue.status === 'returned' ? 'success' : ''}`}>{issue.status}</span></div>)}</div>}</section>
      </div>
    </>
  );
}
