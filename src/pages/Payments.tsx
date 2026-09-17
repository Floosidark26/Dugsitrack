import type { LoginUser } from '../lib/types';

export default function Payments({ token, user }: { token: string; user: LoginUser }) {
  return (
    <>
      <div className="page-header">
        <div><div className="eyebrow">Finance</div><h1>Payments</h1><p>Track fee collection, outstanding balances, and receipts.</p></div>
      </div>
      <section className="panel">
        <div className="empty-state">
          <span className="material-symbols-outlined empty-icon">payments</span>
          <h3>Payment processing coming soon</h3>
          <p>Fee management, receipt generation, and ledger reconciliation will be available in the next release.</p>
        </div>
      </section>
    </>
  );
}
