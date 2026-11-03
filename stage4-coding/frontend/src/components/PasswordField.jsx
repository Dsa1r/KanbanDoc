import { useState } from 'react'

function EyeIcon({ off }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  )
}

export default function PasswordField({ label, name, ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="auth-field">
      <span>{label}</span>
      <span className="auth-input-wrap">
        <input id={name} name={name} type={visible ? 'text' : 'password'} {...props} />
        <button
          type="button"
          className="auth-eye"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          <EyeIcon off={visible} />
        </button>
      </span>
    </label>
  )
}