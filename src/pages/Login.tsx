import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { LoginUser } from '../lib/types';

export default function Login({ onLogin }: { onLogin: (token: string, user: LoginUser) => void }) {
  const login = useMutation(api.users.login);
  const [email, setEmail] = useState('superadmin@dugsihub.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await login({ email, password });
      onLogin(res.token, res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="brand-mark">school</span>
          <span className="login-title">DugsiHub</span>
        </div>
        <h1>Welcome back</h1>
        <p>Sign in to your school management workspace</p>
        <form onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <div className="login-hint">
          <strong>Demo accounts</strong> (password: <code>admin123</code>)
          <ul>
            <li><code>superadmin@dugsihub.com</code> — Super Admin</li>
            <li><code>admin@dugsihub.com</code> — Admin</li>
            <li><code>accountant@dugsihub.com</code> — Accountant</li>
            <li><code>librarian@dugsihub.com</code> — Librarian</li>
            <li><code>amina@dugsihub.com</code> — Teacher</li>
            <li><code>ayaan@dugsihub.com</code> — Student</li>
            <li><code>hassan@dugsihub.com</code> — Parent</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
