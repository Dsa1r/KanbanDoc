import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';
import '../styles/dashboard.css';
import '../styles/settings.css';

const USERNAME_RE = /^[a-z0-9_.]{3,20}$/;
const USERNAME_RULE = 'Username must be 3–20 characters: letters, numbers, _ or .';

export default function SettingsPage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    phone: user?.phone || '',
  });
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSaved(false);
  }

  async function handleLogout() {
    await logout();
    navigate('/auth');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSaved(false);

    const name = form.name.trim();
    const username = form.username.trim().toLowerCase().replace(/^@/, '');

    if (!name) return setError('Please enter your name.');
    if (username && !USERNAME_RE.test(username)) return setError(USERNAME_RULE);

    const changes = { name, phone: form.phone.trim() };
    if (username) changes.username = username;

    setSaving(true);
    try {
      const updated = await updateProfile(changes);
      setForm({
        name: updated.name || '',
        username: updated.username || '',
        phone: updated.phone || '',
      });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dashboard-page">
      <Header
        userName={user?.name}
        username={user?.username}
        onSettings={() => navigate('/settings')}
        onLogout={handleLogout}
      />

      <main className="dashboard settings">
        <Link to="/dashboard" className="settings__back">
          ← Back to dashboard
        </Link>

        <header className="dashboard__header">
          <div>
            <p className="dashboard__eyebrow">Your account</p>
            <h1 className="dashboard__title">Settings</h1>
            <p className="dashboard__subtitle">
              Update how your name appears and how you log in.
            </p>
          </div>
        </header>

        <form className="settings__card" onSubmit={handleSubmit}>
          <label className="settings__field">
            <span>Name</span>
            <input name="name" value={form.name} onChange={handleChange}
              autoComplete="name" required />
          </label>

          <label className="settings__field">
            <span>Username</span>
            <input name="username" value={form.username} onChange={handleChange}
              placeholder="e.g. reema_dev" autoComplete="username" autoCapitalize="none"
              spellCheck={false} maxLength={20} />
            <small>
              {user?.username
                ? 'You can log in with your username or your email.'
                : 'Choose a username so you can log in with it instead of your email.'}
            </small>
          </label>

          <label className="settings__field">
            <span>Email</span>
            <input value={user?.email || ''} readOnly disabled />
            <small>Your email is used to sign in and recover your password.</small>
          </label>

          <label className="settings__field">
            <span>Phone number</span>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange}
              placeholder="+966 5X XXX XXXX" autoComplete="tel" />
          </label>

          {error && <p className="settings__message settings__message--error" role="alert">{error}</p>}
          {saved && <p className="settings__message settings__message--ok" role="status">Your settings were saved.</p>}

          <div className="settings__actions">
            <button type="submit" className="settings__save" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}