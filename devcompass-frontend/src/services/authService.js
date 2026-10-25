import { apiFetch, tokenStorage } from './api.js'

function saveSession(data) {
  tokenStorage.set(data.access_token)
  if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token)
}

// POST /api/v1/auth/signup → { user, access_token?, refresh_token? }
export async function signup({ name, email, password, phone }) {
  const data = await apiFetch('/api/v1/auth/signup', {
    method: 'POST',
    body: { name, email, password, phone: phone || null },
  })
  if (data.access_token) saveSession(data)
  return data
}

// POST /api/v1/auth/login → { user, access_token, refresh_token }
export async function login({ email, password }) {
  const data = await apiFetch('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password },
  })
  saveSession(data)
  return data
}

// GET /api/v1/auth/me
export const getMe = () => apiFetch('/api/v1/auth/me', { auth: true })

// POST /api/v1/auth/logout
export async function logout() {
  try {
    await apiFetch('/api/v1/auth/logout', { method: 'POST', auth: true })
  } finally {
    tokenStorage.clear()
  }
}

// POST /api/v1/auth/forgot-password → { message }  (نفس الرد دائماً حتى لو الإيميل غير موجود)
export const forgotPassword = (email) =>
  apiFetch('/api/v1/auth/forgot-password', { method: 'POST', body: { email } })

// POST /api/v1/auth/reset-password → { message }
export const resetPassword = (token, newPassword) =>
  apiFetch('/api/v1/auth/reset-password', {
    method: 'POST',
    body: { token, new_password: newPassword },
  })