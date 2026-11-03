import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import AuthShowcase from '../components/AuthShowcase.jsx'
import ForgotPasswordModal from '../components/ForgotPasswordModal.jsx'
import PasswordField from '../components/PasswordField.jsx'
import '../styles/auth.css'

const EMPTY = { name: '', username: '', email: '', identifier: '', password: '', phone: '' }

const USERNAME_RE = /^[a-z0-9_.]{3,20}$/
const USERNAME_RULE = 'Username must be 3–20 characters: letters, numbers, _ or .'

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

    if (isSignup) {
      const username = form.username.trim().toLowerCase().replace(/^@/, '')
      if (!USERNAME_RE.test(username)) {
        setError(USERNAME_RULE)
        return
      }
      if (form.password.length < 8) {
        setError('Password must be at least 8 characters.')
        return
      }
    }

    setSubmitting(true)
    try {
      if (isSignup) {
        const data = await signup({ ...form, username: form.username.trim() })
        if (data.access_token) {
          navigate('/dashboard')
        } else {
          switchMode('login')
          setForm((f) => ({ ...EMPTY, identifier: f.email.trim() }))
          setNotice('Account created. Check your email to confirm it, then log in.')
        }
      } else {
        await login({ identifier: form.identifier.trim(), password: form.password })
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
            <p className="auth-eyebrow">{isSignup ? 'Start your first project' : 'Welcome back'}</p>
            <h2 className="auth-title">{isSignup ? 'Create your account' : 'Log in to DevCompass'}</h2>
            <span className="auth-rule" />
            <p className="auth-sub">
              {isSignup
                ? 'Set up your workspace in a minute and get your first next step.'
                : 'Pick up right where you left off.'}
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
              {isSignup ? (
                <>
                  <Field label="Name" name="name" placeholder="Your full name" autoComplete="name"
                    value={form.name} onChange={handleChange} required />
                  <Field label="Username" name="username" placeholder="e.g. reema_dev"
                    autoComplete="username" autoCapitalize="none" spellCheck={false}
                    minLength={3} maxLength={20} value={form.username} onChange={handleChange}
                    hint="3–20 characters: letters, numbers, _ or ." required />
                  <Field label="Email" name="email" type="email" placeholder="email@gmail.com"
                    autoComplete="email" value={form.email} onChange={handleChange} required />
                </>
              ) : (
                <Field label="Username or email" name="identifier" placeholder="Username or email"
                  autoComplete="username" autoCapitalize="none" spellCheck={false}
                  value={form.identifier} onChange={handleChange} required />
              )}

              <PasswordField label="Password" name="password"
                placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                value={form.password} onChange={handleChange} required />

              {!isSignup && (
                <button type="button" className="auth-forgot" onClick={() => setShowForgot(true)}>
                  Forgot password?
                </button>
              )}
              {isSignup && (
                <Field label="Phone number (optional)" name="phone" type="tel" placeholder="+966 5X XXX XXXX"
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

function Field({ label, name, hint, ...props }) {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <input id={name} name={name} {...props} />
      {hint && <small className="auth-hint">{hint}</small>}
    </label>
  )
}