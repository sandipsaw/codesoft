import { createContext, useContext, useEffect, useMemo, useState } from 'react'


const AuthContext = createContext(null)
const API_BASE = import.meta.env.VITE_API_URL

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('jobboard_token') || '')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) {
          throw new Error('Session expired')
        }
        const profile = await response.json()
        setUser(profile)
      } catch (err) {
        setToken('')
        localStorage.removeItem('jobboard_token')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [token])

  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to login')
      }
      setToken(data.token)
      localStorage.setItem('jobboard_token', data.token)
      
      
      setUser(data.user)
      setError('')
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, message: err.message }
    }
  }

  const register = async ({ name, email, password }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Unable to register')
      }
      setToken(data.token)
      localStorage.setItem('jobboard_token', data.token)
      setUser(data.user)
      setError('')
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, message: err.message }
    }
  }

  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('jobboard_token')
    localStorage.removeItem('token')
  }

  const value = useMemo(
    () => ({ user, token, loading, error, login, logout, register }),
    [user, token, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
