import { useState } from 'react';
import Login from './pages/Login';
import AppShell from './pages/AppShell';
import type { LoginUser } from './lib/types';

export default function App() {
  const [session, setSession] = useState<{ token: string; user: LoginUser } | null>(null);

  if (!session) {
    return <Login onLogin={(token, user) => setSession({ token, user })} />;
  }

  return <AppShell user={session.user} token={session.token} onLogout={() => setSession(null)} />;
}
