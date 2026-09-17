import { useState } from 'react';
import {
  ArrowRight, BarChart3, Bell, BookOpen, Check, ChevronDown, CircleHelp, ClipboardCheck,
  FileText, GraduationCap, LayoutDashboard, Menu, MessageSquare, MoreHorizontal, Play,
  Search, Settings, ShieldCheck, Sparkles, Users, WalletCards, X,
} from 'lucide-react';

type View = 'overview' | 'students' | 'attendance' | 'finance';

const navItems: { label: string; icon: typeof LayoutDashboard; view: View }[] = [
  { label: 'Overview', icon: LayoutDashboard, view: 'overview' },
  { label: 'Students', icon: Users, view: 'students' },
  { label: 'Attendance', icon: ClipboardCheck, view: 'attendance' },
  { label: 'Finance', icon: WalletCards, view: 'finance' },
];

const students = [
  ['Ayaan Hassan', 'Grade 8A', 'Present', 'AH'],
  ['Yusuf Ali', 'Grade 10B', 'Present', 'YA'],
  ['Hodan Mohamed', 'Grade 7C', 'Late', 'HM'],
  ['Abdi Rahman', 'Grade 9A', 'Absent', 'AR'],
];

function App() {
  const [view, setView] = useState<View>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2800);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand"><span className="brand-mark"><GraduationCap size={20} /></span><span>Dugsi<span>Hub</span></span></div>
        <div className="workspace-switcher"><div className="school-avatar">GH</div><div><strong>Green Hills Academy</strong><small>Admin workspace</small></div><ChevronDown size={16} /></div>
        <nav className="side-nav" aria-label="Main navigation">
          <span className="nav-label">Workspace</span>
          {navItems.map(({ label, icon: Icon, view: itemView }) => <button key={itemView} className={view === itemView ? 'nav-item active' : 'nav-item'} onClick={() => { setView(itemView); setMobileOpen(false); }}><Icon size={18} />{label}{itemView === 'attendance' && <span className="nav-count">12</span>}</button>)}
          <span className="nav-label nav-label-spaced">Manage</span>
          <button className="nav-item" onClick={() => notify('Reports are being prepared for your workspace.')}><FileText size={18} />Reports</button>
          <button className="nav-item" onClick={() => notify('Messages are all caught up.')}><MessageSquare size={18} />Messages<span className="unread-dot" /></button>
          <button className="nav-item" onClick={() => notify('Settings will be available shortly.')}><Settings size={18} />Settings</button>
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={18} /></div><strong>Need a hand?</strong><p>Visit our help center or talk to support.</p><button onClick={() => notify('Support request received. We will be in touch.')}>Get support <ArrowRight size={14} /></button></div><div className="user-row"><div className="avatar avatar-purple">MA</div><div><strong>Muna Abdi</strong><small>School administrator</small></div><MoreHorizontal size={18} className="muted-icon" /></div></div>
      </aside>
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <main className="main-content">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu /></button><div className="breadcrumb"><span>Green Hills Academy</span><span>/</span><strong>{navItems.find((item) => item.view === view)?.label}</strong></div><div className="top-actions"><button className="icon-button search-button"><Search size={19} /><span>Search anything</span><kbd>⌘ K</kbd></button><button className="icon-button notification-button" onClick={() => notify('You have 3 new notifications.')}><Bell size={19} /><i /></button><div className="avatar avatar-purple">MA</div></div></header>
        <div className="page-content">
          {view === 'overview' && <Overview onDemo={() => setDemoOpen(true)} onNotify={notify} />}
          {view === 'students' && <Students onNotify={notify} />}
          {view === 'attendance' && <Attendance onNotify={notify} />}
          {view === 'finance' && <Finance onNotify={notify} />}
        </div>
      </main>
      {notice && <div className="toast"><Check size={17} />{notice}</div>}
      {demoOpen && <div className="modal-backdrop" onClick={() => setDemoOpen(false)}><div className="demo-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setDemoOpen(false)}><X size={18} /></button><div className="demo-play"><Play size={26} fill="currentColor" /></div><h2>A calmer way to run your school</h2><p>See how DugsiHub connects student records, attendance, communication, and finance in one focused workspace.</p><button className="primary-button" onClick={() => setDemoOpen(false)}>Back to dashboard <ArrowRight size={16} /></button></div></div>}
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function Overview({ onDemo, onNotify }: { onDemo: () => void; onNotify: (message: string) => void }) {
  return <>
    <PageHeader eyebrow="Monday, 23 September 2024" title="Good morning, Muna" description="Here’s what’s happening across Green Hills Academy today." action={<button className="primary-button" onClick={() => onNotify('New student form opened.')}><span>+</span> Add new student</button>} />
    <div className="hero-banner"><div className="hero-copy"><span className="banner-kicker"><Sparkles size={14} /> SCHOOL OPERATIONS, SIMPLIFIED</span><h2>Every detail in its right place.</h2><p>Keep your whole school moving forward with a clear, connected view of the work that matters.</p><button className="light-button" onClick={onDemo}>Watch the 2-minute tour <Play size={15} fill="currentColor" /></button></div><div className="hero-illustration"><div className="orb orb-one" /><div className="orb orb-two" /><div className="floating-stat"><span className="mini-icon green"><Check size={14} /></span><div><strong>92.4%</strong><small>Attendance this week</small></div><span className="trend">+4.8%</span></div><div className="floating-calendar"><div className="calendar-head"><span>SEPT</span><strong>23</strong></div><div className="calendar-lines"><i /><i /><i /><i /></div></div><div className="building"><div className="building-roof" /><div className="building-body"><div className="building-sign">GH</div><div className="building-windows"><i /><i /><i /><i /><i /><i /></div></div></div></div></div>
    <section className="section-block"><div className="section-heading"><div><h2>Today at a glance</h2><p>Live snapshot of your school’s rhythm.</p></div><button className="text-button" onClick={() => onNotify('Dashboard data refreshed.')}>Refresh data <ArrowRight size={15} /></button></div><div className="metric-grid"><MetricCard icon={<Users />} label="Total students" value="842" change="+12 this term" tone="blue" /><MetricCard icon={<ClipboardCheck />} label="Attendance today" value="94.8%" change="+2.1% from yesterday" tone="green" /><MetricCard icon={<BookOpen />} label="Classes in session" value="18" change="4 teachers on leave" tone="purple" /><MetricCard icon={<WalletCards />} label="Fees collected" value="$24,580" change="+8.4% this month" tone="orange" /></div></section>
    <div className="content-grid"><section className="panel attendance-panel"><div className="panel-heading"><div><h2>Attendance overview</h2><p>Weekly presence across all grades</p></div><button className="icon-button" onClick={() => onNotify('Attendance report downloaded.')}><MoreHorizontal size={18} /></button></div><div className="chart-wrap"><div className="chart-y"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div className="chart"><div className="chart-grid"><i /><i /><i /><i /><i /></div><div className="bars"><div className="bar-group"><i style={{ height: '72%' }} /><i style={{ height: '82%' }} /><i style={{ height: '68%' }} /><span>Mon</span></div><div className="bar-group"><i style={{ height: '84%' }} /><i style={{ height: '92%' }} /><i style={{ height: '76%' }} /><span>Tue</span></div><div className="bar-group"><i style={{ height: '76%' }} /><i style={{ height: '88%' }} /><i style={{ height: '72%' }} /><span>Wed</span></div><div className="bar-group"><i style={{ height: '90%' }} /><i style={{ height: '96%' }} /><i style={{ height: '82%' }} /><span>Thu</span></div><div className="bar-group"><i style={{ height: '88%' }} /><i style={{ height: '94%' }} /><i style={{ height: '80%' }} /><span>Fri</span></div></div></div></div><div className="chart-legend"><span><i className="legend-blue" /> Present</span><span><i className="legend-green" /> Late</span><span><i className="legend-purple" /> Absent</span></div></section><section className="panel tasks-panel"><div className="panel-heading"><div><h2>Priority tasks</h2><p>Keep your day on track</p></div><button className="text-button" onClick={() => onNotify('All tasks are visible in the task center.')}>View all <ArrowRight size={15} /></button></div><div className="task-list"><Task title="Review Grade 9 results" meta="Academic · Due today" color="purple" /><Task title="Approve fee receipts" meta="Finance · 8 pending" color="orange" /><Task title="Follow up on absences" meta="Attendance · 12 students" color="blue" /></div><button className="add-task" onClick={() => onNotify('New task created.')}>+ Add a task</button></section></div>
    <section className="section-block recent-section"><div className="section-heading"><div><h2>Recent activity</h2><p>Latest updates from your school</p></div><button className="text-button" onClick={() => onNotify('Activity history opened.')}>View activity <ArrowRight size={15} /></button></div><div className="activity-list"><Activity icon={<Users />} title="New student enrolled" description="Ayaan Hassan was added to Grade 8A" time="8 min ago" color="blue" /><Activity icon={<WalletCards />} title="Payment received" description="School fees payment from Yusuf Ali" time="42 min ago" color="green" /><Activity icon={<MessageSquare />} title="Announcement published" description="Mid-term exam schedule shared with Grade 10" time="1 hr ago" color="purple" /></div></section>
  </>;
}

function MetricCard({ icon, label, value, change, tone }: { icon: React.ReactNode; label: string; value: string; change: string; tone: string }) { return <div className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><div className="metric-label">{label}</div><strong className="metric-value">{value}</strong><span className={`metric-change ${tone}`}>{change}</span></div>; }
function Task({ title, meta, color }: { title: string; meta: string; color: string }) { return <div className="task-row"><div className={`task-check ${color}`}><Check size={13} /></div><div><strong>{title}</strong><small>{meta}</small></div><MoreHorizontal size={17} className="muted-icon" /></div>; }
function Activity({ icon, title, description, time, color }: { icon: React.ReactNode; title: string; description: string; time: string; color: string }) { return <div className="activity-row"><div className={`activity-icon ${color}`}>{icon}</div><div className="activity-copy"><strong>{title}</strong><p>{description}</p></div><time>{time}</time></div>; }

function Students({ onNotify }: { onNotify: (message: string) => void }) { return <><PageHeader eyebrow="Student records" title="Students" description="A clear, current view of every learner in your school." action={<button className="primary-button" onClick={() => onNotify('New student form opened.')}><span>+</span> Add student</button>} /><section className="panel table-panel"><div className="table-toolbar"><div className="search-field"><Search size={17} /><input placeholder="Search students" /></div><button className="filter-button">All grades <ChevronDown size={15} /></button><button className="filter-button">Status <ChevronDown size={15} /></button></div><table><thead><tr><th>Student</th><th>Grade</th><th>Status</th><th>Last updated</th><th /></tr></thead><tbody>{students.map(([name, grade, status, initials], index) => <tr key={name}><td><div className="table-person"><div className={`avatar avatar-${index % 2 ? 'orange' : 'blue'}`}>{initials}</div><strong>{name}</strong></div></td><td>{grade}</td><td><span className={`status-pill ${status.toLowerCase()}`}><i />{status}</span></td><td>{index + 1} day{index ? 's' : ''} ago</td><td><button className="icon-button" onClick={() => onNotify(`${name}'s profile opened.`)}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></section></>; }
function Attendance({ onNotify }: { onNotify: (message: string) => void }) { return <><PageHeader eyebrow="Monday, 23 September 2024" title="Attendance" description="Mark, monitor, and follow up on attendance without the paperwork." action={<button className="primary-button" onClick={() => onNotify('Attendance session started.')}><ClipboardCheck size={16} /> Mark attendance</button>} /><div className="metric-grid"><MetricCard icon={<Check />} label="Present" value="798" change="94.8% of students" tone="green" /><MetricCard icon={<Bell />} label="Late arrivals" value="26" change="3.1% of students" tone="orange" /><MetricCard icon={<X />} label="Absent" value="18" change="2.1% of students" tone="purple" /><MetricCard icon={<BarChart3 />} label="Weekly average" value="93.2%" change="+1.8% this week" tone="blue" /></div><section className="panel attendance-table-panel"><div className="panel-heading"><div><h2>Needs follow-up</h2><p>Students who need an attendance note today</p></div><button className="text-button" onClick={() => onNotify('Attendance export downloaded.')}>Export report <ArrowRight size={15} /></button></div>{students.slice(1).map(([name, grade, status, initials]) => <div className="follow-row" key={name}><div className="avatar avatar-orange">{initials}</div><div><strong>{name}</strong><small>{grade} · {status} today</small></div><button className="secondary-button" onClick={() => onNotify(`Note request sent for ${name}.`)}>Request note</button></div>)}</section></>; }
function Finance({ onNotify }: { onNotify: (message: string) => void }) { return <><PageHeader eyebrow="Financial operations" title="Finance center" description="Keep fees, receipts, and school spending visible and accountable." action={<button className="primary-button" onClick={() => onNotify('Payment entry opened.')}><span>+</span> Record payment</button>} /><div className="metric-grid"><MetricCard icon={<WalletCards />} label="Collected this month" value="$24,580" change="+8.4% vs last month" tone="green" /><MetricCard icon={<BarChart3 />} label="Outstanding" value="$8,420" change="34 families" tone="orange" /><MetricCard icon={<FileText />} label="Receipts issued" value="182" change="This month" tone="blue" /><MetricCard icon={<ShieldCheck />} label="Reconciled" value="98.6%" change="Last synced today" tone="purple" /></div><section className="panel finance-panel"><div className="panel-heading"><div><h2>Collection progress</h2><p>September fee collection across all grades</p></div><button className="icon-button" onClick={() => onNotify('Finance options opened.')}><MoreHorizontal size={18} /></button></div><div className="progress-total"><strong>$24,580</strong><span>of $33,000 target</span></div><div className="progress-bar"><i /></div><div className="progress-meta"><span>74.5% collected</span><span>10 days remaining</span></div><div className="finance-note"><ShieldCheck size={18} /><span>All payment records are encrypted and audit-ready.</span></div></section></>; }

export default App;
