import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as authService from '../services/authService.js'
import { tokenStorage } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // عند فتح الموقع: إذا فيه توكن محفوظ نجيب بيانات المستخدم
  useEffect(() => {
    if (!tokenStorage.get()) {
      setLoading(false)
      return
    }
    authService
      .getMe()
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false))
  }, [])

  const signup = useCallback(async (form) => {
    const data = await authService.signup(form)
    if (data.access_token) setUser(data.user)
    return data
  }, [])

  const login = useCallback(async (form) => {
    const data = await authService.login(form)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)