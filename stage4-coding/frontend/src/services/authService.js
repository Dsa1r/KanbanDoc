import { apiFetch, tokenStorage } from './api.js'

function saveSession(data) {
  tokenStorage.set(data.access_token)
  if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token)
}

export async function signup({ name, username, email, password, phone }) {
  const data = await apiFetch('/api/v1/auth/signup', {
    method: 'POST',
    body: { name, username, email, password, phone: phone || null },
  })
  if (data.access_token) saveSession(data)
  return data
}

export async function login({ identifier, password }) {
  const data = await apiFetch('/api/v1/auth/login', {
    method: 'POST',
    body: { identifier, password },
  })
  saveSession(data)
  return data
}

export const getMe = () => apiFetch('/api/v1/auth/me', { auth: true })

export const updateMe = (fields) =>
  apiFetch('/api/v1/auth/me', { method: 'PATCH', auth: true, body: fields })

export async function logout() {
  try {
    await apiFetch('/api/v1/auth/logout', { method: 'POST', auth: true })
  } finally {
    tokenStorage.clear()
  }
}

export const forgotPassword = (email) =>
  apiFetch('/api/v1/auth/forgot-password', { method: 'POST', body: { email } })

export const resetPassword = (token, newPassword) =>
  apiFetch('/api/v1/auth/reset-password', {
    method: 'POST',
    body: { token, new_password: newPassword },
  })