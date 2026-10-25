import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { resetPassword } from '../services/authService.js'
import '../styles/auth.css'

// Supabase يرجّع التوكن في الرابط بعد #  مثل: /reset-password#access_token=...&type=recovery
function readToken() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const query = new URLSearchParams(window.location.search)
  return hash.get('access_token') || query.get('token') || ''
}

export default function ResetPasswordPage() {
  const token = useMemo(readToken, [])
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirm) return setError('Passwords do not match.')

    setSubmitting(true)
    try {
      await resetPassword(token, password)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="reset-card">
        <p className="auth-eyebrow">Account recovery</p>
        <h1 className="auth-title">Choose a new password</h1>
        <span className="auth-rule" />

        {!token ? (
          <>
            <p className="auth-message auth-message--error" role="alert">
              This reset link is invalid or has expired.
            </p>
            <Link className="reset-card__link" to="/auth">Request a new link</Link>
          </>
        ) : done ? (
          <>
            <p className="auth-message auth-message--ok" role="status">Your password has been updated.</p>
            <Link className="reset-card__link" to="/auth">Log in</Link>
          </>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>New password</span>
              <input type="password" autoComplete="new-password" placeholder="At least 8 characters"
                required value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label className="auth-field">
              <span>Confirm password</span>
              <input type="password" autoComplete="new-password" placeholder="Repeat your password"
                required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </label>
            {error && <p className="auth-message auth-message--error" role="alert">{error}</p>}
            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Update password'}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}