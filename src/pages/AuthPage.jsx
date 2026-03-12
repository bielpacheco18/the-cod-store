import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { hasSupabaseConfig, supabase } from '../lib/supabase.js';

function AuthPage({ user, authLoading }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessage('');
  }, [mode]);

  if (authLoading) {
    return <main className="container page"><p className="hint-text">Checking session...</p></main>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function submit(event) {
    event.preventDefault();

    if (!hasSupabaseConfig || !supabase) {
      setMessage('Supabase is not configured. Please add .env values first.');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    setMessage('');

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message || 'Login failed.');
      else setMessage('Login successful. Redirecting...');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message || 'Sign up failed.');
      else setMessage('Account created. Please check your email if confirmation is required.');
    }

    setLoading(false);
  }

  return (
    <main className="container page">
      <section className="auth-card">
        <h1>{mode === 'login' ? 'Sign In' : 'Create Account'}</h1>
        <p>Use your account to place orders, track progress and access support history.</p>

        <form onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              required
            />
          </label>

          <button className="btn btn-primary full" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
          {message ? <p className="hint-text">{message}</p> : null}
        </form>

        <button className="btn btn-ghost full" onClick={() => setMode((prev) => (prev === 'login' ? 'signup' : 'login'))}>
          {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Login'}
        </button>
      </section>
    </main>
  );
}

export default AuthPage;
