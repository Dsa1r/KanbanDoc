import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

import * as authService from '../services/authService.js'
import { tokenStorage } from '../services/api.js'
import { useQueryClient } from '@tanstack/react-query'
import { queryPersister } from '../lib/queryPersister.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const queryClient = useQueryClient()

  useEffect(() => {
    if (!tokenStorage.get()) {
      setLoading(false)
      return
    }

    authService
      .getMe()
      .then(setUser)
      .catch(async () => {
        tokenStorage.clear()
        queryClient.clear()
        await queryPersister.removeClient()
      })
      .finally(() => setLoading(false))
  }, [queryClient])

  const signup = useCallback(async (form) => {
    const data = await authService.signup(form)

    if (data.access_token) {
      queryClient.clear()
      await queryPersister.removeClient()
      setUser(data.user)
    }

    return data
  }, [queryClient])

  const login = useCallback(async (form) => {
    const data = await authService.login(form)

    queryClient.clear()
    await queryPersister.removeClient()

    setUser(data.user)

    return data
  }, [queryClient])

  const updateProfile = useCallback(async (fields) => {
    const updated = await authService.updateMe(fields)
    setUser(updated)
    return updated
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      queryClient.clear()
      await queryPersister.removeClient()
      setUser(null)
    }
  }, [queryClient])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)