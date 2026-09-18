import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AppShell from './pages/AppShell';
import type { LoginUser } from './lib/types';

export default function App() {
  const [session, setSession] = useState<{ token: string; user: LoginUser } | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const handleShowLogin = () => setShowLogin(true);
    window.addEventListener('showLogin', handleShowLogin);
    return () => window.removeEventListener('showLogin', handleShowLogin);
  }, []);

  if (!session && !showLogin) {
    return <Landing />;
  }

  if (!session) {
    return <Login onLogin={(token, user) => setSession({ token, user })} />;
  }

  return <AppShell user={session.user} token={session.token} onLogout={() => setSession(null)} />;
}
