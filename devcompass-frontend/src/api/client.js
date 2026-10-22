const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:5001/api/v1';

// TODO: confirm the storage key with Reema (login page)
const TOKEN_STORAGE_KEY = 'token';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message ||
      (typeof data?.error === 'string' ? data.error : null) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}