import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import AuthShowcase from '../components/AuthShowcase.jsx'
import ForgotPasswordModal from '../components/ForgotPasswordModal.jsx'
import '../styles/auth.css'

const EMPTY = { name: '', email: '', password: '', phone: '' }

export default function AuthPage() {
  const [mode, setMode] = useState('signup') // 'signup' | 'login'
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const { signup, login } = useAuth()
  const navigate = useNavigate()

  const isSignup = mode === 'signup'

  function switchMode(next) {
    setMode(next)
    setError('')
    setNotice('')
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setNotice('')

    if (isSignup && form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    try {
      if (isSignup) {
        const data = await signup(form)
        if (data.access_token) {
          navigate('/dashboard')
        } else {
          switchMode('login')
          setNotice('Account created. Check your email to confirm it, then log in.')
        }
      } else {
        await login({ email: form.email, password: form.password })
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <AuthShowcase />

        <section className="auth-panel">
          <div className="auth-panel__inner">
            <p className="auth-eyebrow">{isSignup ? 'Start your next chapter' : 'Welcome back'}</p>
            <h2 className="auth-title">{isSignup ? 'Create your account' : 'Log in to DevCompass'}</h2>
            <span className="auth-rule" />
            <p className="auth-sub">
              {isSignup
                ? 'Join your team and make every step forward visible.'
                : 'Pick up where you left off.'}
            </p>

            <div className="auth-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={isSignup}
                className={isSignup ? 'is-active' : ''}
                onClick={() => switchMode('signup')}
              >
                Sign up
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={!isSignup}
                className={!isSignup ? 'is-active' : ''}
                onClick={() => switchMode('login')}
              >
                Log in
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate={false}>
              {isSignup && (
                <Field label="Name" name="name" placeholder="Name" autoComplete="name"
                  value={form.name} onChange={handleChange} required />
              )}
              <Field label="Email" name="email" type="email" placeholder="email@gmail.com"
                autoComplete="email" value={form.email} onChange={handleChange} required />
              <Field label="Password" name="password" type="password"
                placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                value={form.password} onChange={handleChange} required />
              {!isSignup && (
                <button type="button" className="auth-forgot" onClick={() => setShowForgot(true)}>
                  Forgot password?
                </button>
              )}
              {isSignup && (
                <Field label="Phone number" name="phone" type="tel" placeholder="+966 5X XXX XXXX"
                  autoComplete="tel" value={form.phone} onChange={handleChange} />
              )}

              {error && <p className="auth-message auth-message--error" role="alert">{error}</p>}
              {notice && <p className="auth-message auth-message--ok" role="status">{notice}</p>}

              <button type="submit" className="auth-submit" disabled={submitting}>
                {submitting
                  ? isSignup ? 'Creating account…' : 'Logging in…'
                  : isSignup ? 'Create my account' : 'Log in'}
                {!submitting && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                )}
              </button>
            </form>

            {isSignup && (
              <p className="auth-legal">
                By signing up, you agree to our Terms and Privacy Policy.
              </p>
            )}
          </div>
        </section>
      </div>
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </main>
  )
}

function Field({ label, name, ...props }) {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <input id={name} name={name} {...props} />
    </label>
  )
}