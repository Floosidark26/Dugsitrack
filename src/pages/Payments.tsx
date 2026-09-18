import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { LoginUser } from '../lib/types';

export default function Payments({ token, user }: { token: string; user: LoginUser }) {
  const canManage = ['super_admin', 'admin', 'accountant'].includes(user.role);
  const payments = useQuery(api.payments.listPayments, { token });
  const stats = useQuery(api.payments.stats, canManage ? { token } : 'skip');

  return (
    <>
      <div className="page-header">
        <div><div className="eyebrow">Finance</div><h1>Payments</h1><p>Track fee collection, outstanding balances, and receipts.</p></div>
      </div>
      {canManage && stats && <div className="metric-grid">
        <div className="metric-card"><div className="metric-icon green"><span className="material-symbols-outlined">payments</span></div><div className="metric-label">Collected</div><strong className="metric-value">${stats.collected.toLocaleString()}</strong></div>
        <div className="metric-card"><div className="metric-icon orange"><span className="material-symbols-outlined">receipt_long</span></div><div className="metric-label">Outstanding</div><strong className="metric-value">${stats.outstanding.toLocaleString()}</strong></div>
        <div className="metric-card"><div className="metric-icon blue"><span className="material-symbols-outlined">pending_actions</span></div><div className="metric-label">Pending</div><strong className="metric-value">{stats.pendingCount}</strong></div>
        <div className="metric-card"><div className="metric-icon purple"><span className="material-symbols-outlined">task_alt</span></div><div className="metric-label">Paid records</div><strong className="metric-value">{stats.paidCount}</strong></div>
      </div>}
      <section className="panel table-panel">
        {payments === undefined ? <div className="loader">Loading payments…</div> : payments.length === 0 ? <div className="empty">No payment records found.</div> : (
          <table><thead><tr><th>Title</th><th>Amount</th><th>Status</th><th>Method</th><th>Date</th></tr></thead><tbody>
            {payments.map((payment) => <tr key={payment._id}><td><strong>{payment.title}</strong></td><td>${payment.amount.toLocaleString()}</td><td><span className={`status-pill ${payment.status === 'paid' ? 'success' : ''}`}>{payment.status}</span></td><td>{payment.method ?? '—'}</td><td>{new Date(payment.createdAt).toLocaleDateString()}</td></tr>)}
          </tbody></table>
        )}
      </section>
    </>
  );
}
