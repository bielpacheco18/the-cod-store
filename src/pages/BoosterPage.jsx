import { useState } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase.js';

function BoosterPage({ user }) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    discord: '',
    game: '',
    rank: '',
    weekly_hours: '',
    experience: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();

    if (!hasSupabaseConfig || !supabase) {
      setMessage('Supabase is not configured. Add your .env credentials first.');
      return;
    }

    if (form.experience.trim().length < 30) {
      setMessage('Please provide at least 30 characters about your experience.');
      return;
    }

    setLoading(true);
    setMessage('Submitting your application...');

    const payload = {
      ...form,
      weekly_hours: Number(form.weekly_hours),
      user_id: user?.id ?? null
    };

    const { error } = await supabase.from('booster_applications').insert(payload);

    if (error) {
      setMessage('Failed to submit application. Please try again.');
      setLoading(false);
      return;
    }

    setMessage('Application submitted successfully. Our recruitment team will contact you by email or Discord.');
    setLoading(false);
    setForm({
      full_name: '',
      email: '',
      discord: '',
      game: '',
      rank: '',
      weekly_hours: '',
      experience: ''
    });
  }

  return (
    <main className="container page">
      <section className="booster-grid">
        <article className="booster-copy">
          <h1>Join as a Verified Booster</h1>
          <p>
            Work with a global team, choose your schedule and get paid for your competitive gaming skills.
            We are actively hiring high-rank players for COD, Marvel Rivals and Battlefield.
          </p>

          <ul>
            <li>Competitive payouts and consistent order flow</li>
            <li>Flexible work hours and remote setup</li>
            <li>Structured team operations and support</li>
            <li>Performance-based growth opportunities</li>
          </ul>
        </article>

        <form className="booster-form" onSubmit={submit}>
          <h2>Application Form</h2>

          <label>
            Full Name
            <input value={form.full_name} onChange={(e) => update('full_name', e.target.value)} required />
          </label>

          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
          </label>

          <label>
            Discord Username
            <input value={form.discord} onChange={(e) => update('discord', e.target.value)} placeholder="example#1234" required />
          </label>

          <label>
            Main Game
            <select value={form.game} onChange={(e) => update('game', e.target.value)} required>
              <option value="">Select a game</option>
              <option value="Call of Duty">Call of Duty</option>
              <option value="Marvel Rivals">Marvel Rivals</option>
              <option value="Battlefield">Battlefield</option>
            </select>
          </label>

          <label>
            Current Rank
            <input value={form.rank} onChange={(e) => update('rank', e.target.value)} placeholder="Example: Diamond 2" required />
          </label>

          <label>
            Weekly Availability (hours)
            <input type="number" min="1" max="168" value={form.weekly_hours} onChange={(e) => update('weekly_hours', e.target.value)} required />
          </label>

          <label>
            Why should we accept you?
            <textarea rows="5" value={form.experience} onChange={(e) => update('experience', e.target.value)} required />
          </label>

          <button className="btn btn-primary full" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
          {message ? <p className="hint-text">{message}</p> : null}
        </form>
      </section>
    </main>
  );
}

export default BoosterPage;
