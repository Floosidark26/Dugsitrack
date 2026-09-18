import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import type { LoginUser } from '../lib/types';

export default function Materials({ token, user }: { token: string; user: LoginUser }) {
  const materials = useQuery(api.materials.list, { token });
  const classes = useQuery(api.classes.listClasses, { token });
  const subjects = useQuery(api.subjects.list, { token });
  const upload = useMutation(api.materials.upload);
  const canUpload = ['super_admin', 'admin', 'teacher'].includes(user.role);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const submit = async (event: React.FormEvent) => { event.preventDefault(); await upload({ token, title, description: description || undefined, classId: classId as Id<'classes'>, subjectId: subjectId as Id<'subjects'>, fileUrl, fileName }); setTitle(''); setDescription(''); setClassId(''); setSubjectId(''); setFileUrl(''); setFileName(''); };

  return (
    <>
      <div className="page-header">
        <div><div className="eyebrow">Resources</div><h1>Materials</h1><p>Share study materials, assignments, and resources with students.</p></div>
      </div>
      {canUpload && <form className="panel form-panel" onSubmit={submit}><h2>Share a material</h2><div className="form-grid"><label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} required /></label><label>File name<input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="lesson-notes.pdf" required /></label><label>Class<select value={classId} onChange={(e) => setClassId(e.target.value)} required><option value="">Select…</option>{(classes ?? []).map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label><label>Subject<select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required><option value="">Select…</option>{(subjects ?? []).map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label><label>File URL<input type="url" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://…" required /></label><label>Description<input value={description} onChange={(e) => setDescription(e.target.value)} /></label></div><button type="submit">Publish material</button></form>}
      <section className="panel table-panel">{materials === undefined ? <div className="loader">Loading materials…</div> : materials.length === 0 ? <div className="empty">No materials available.</div> : <table><thead><tr><th>Material</th><th>Subject</th><th>Class</th><th>Uploaded</th></tr></thead><tbody>{materials.map((material) => <tr key={material._id}><td><a href={material.fileUrl} target="_blank" rel="noreferrer"><strong>{material.title}</strong></a><small className="table-subtitle">{material.fileName}</small></td><td>{material.subjectName || '—'}</td><td>{material.className || '—'}</td><td>{new Date(material.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table>}</section>
    </>
  );
}
