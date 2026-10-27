// ملف واحد لكل طلبات الـ API — كل الصفحات تستخدمه
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5001'

export const tokenStorage = {
  get: () => localStorage.getItem('access_token'),
  set: (t) => localStorage.setItem('access_token', t),
  clear: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },
}

export class ApiError extends Error {
  constructor(code, message, status) {
    super(message)
    this.code = code
    this.status = status
  }
}

export async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = tokenStorage.get()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('NETWORK_ERROR', 'Cannot reach the server. Check your connection and try again.', 0)
  }

  if (res.status === 204) return null
  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = json.error || {}
    throw new ApiError(err.code || 'UNKNOWN', err.message || 'Something went wrong.', res.status)
  }
  return json.data
}
