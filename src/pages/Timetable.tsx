import type { LoginUser } from '../lib/types';

export default function Timetable({ token, user }: { token: string; user: LoginUser }) {
  return (
    <>
      <div className="page-header">
        <div><div className="eyebrow">Scheduling</div><h1>Timetable</h1><p>View and manage class schedules and periods.</p></div>
      </div>
      <section className="panel">
        <div className="empty-state">
          <span className="material-symbols-outlined empty-icon">calendar_today</span>
          <h3>Timetable coming soon</h3>
          <p>Period scheduling and class timetables will be available in the next release.</p>
        </div>
      </section>
    </>
  );
}
