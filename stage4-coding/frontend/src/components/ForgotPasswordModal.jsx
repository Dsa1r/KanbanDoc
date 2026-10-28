import { useEffect, useState } from 'react'
import { forgotPassword } from '../services/authService.js'

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // إغلاق بزر Esc
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const data = await forgotPassword(email)
      setMessage(data?.message || 'If the email exists, a reset link has been sent.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal__box" role="dialog" aria-modal="true" aria-labelledby="forgot-title">
        <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>×</button>
        <h2 id="forgot-title" className="modal__title">Reset your password</h2>
        <span className="auth-rule" />
        <p className="auth-sub">Enter your email and we’ll send you a link to choose a new password.</p>

        {message ? (
          <>
            <p className="auth-message auth-message--ok" role="status">{message}</p>
            <button type="button" className="auth-submit modal__done" onClick={onClose}>Back to log in</button>
          </>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                autoFocus
                required
                autoComplete="email"
                placeholder="email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            {error && <p className="auth-message auth-message--error" role="alert">{error}</p>}
            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}