import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { hasSupabaseConfig, supabase } from '../lib/supabase.js';

function ProfilePage({ user, authLoading }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFullName(user?.user_metadata?.full_name || '');
    setEmail(user?.email || '');
  }, [user]);

  if (authLoading) {
    return <main className="container page"><p className="hint-text">Checking session...</p></main>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  async function submit(event) {
    event.preventDefault();

    if (!hasSupabaseConfig || !supabase) {
      setMessage('Supabase is not configured. Please add .env values first.');
      return;
    }

    if (password && password.length < 6) {
      setMessage('New password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    setMessage('');

    const payload = {
      data: {
        full_name: fullName.trim()
      }
    };

    if (email.trim() && email.trim() !== user.email) {
      payload.email = email.trim();
    }

    if (password) {
      payload.password = password;
    }

    const { error } = await supabase.auth.updateUser(payload);

    if (error) {
      setMessage(error.message || 'Could not update profile.');
      setLoading(false);
      return;
    }

    setPassword('');
    setMessage(payload.email ? 'Profile updated. Check your email if Supabase requires email confirmation.' : 'Profile updated successfully.');
    setLoading(false);
  }

  return (
    <main className="container page">
      <section className="auth-card">
        <h1>Edit Profile</h1>
        <p>Update your account name, email and password.</p>

        <form onSubmit={submit}>
          <label>
            Full Name
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your display name"
            />
          </label>

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
            New Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </label>

          <button className="btn btn-primary full" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save changes'}
          </button>
          {message ? <p className="hint-text">{message}</p> : null}
        </form>

        <div className="profile-actions">
          <Link className="btn btn-ghost full" to="/orders">View my orders</Link>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
