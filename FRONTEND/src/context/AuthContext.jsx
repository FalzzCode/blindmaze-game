import { useMemo, useState } from 'react'
import api from '../lib/api.js'
import { AuthContext } from './auth-context.js'

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('wtid_user') || 'null')
  } catch {
    return null
  }
}

function saveSession(data) {
  const account = data?.data || data || {}
  const token = account.token
  const user = { ...account }
  delete user.token
  if (token) localStorage.setItem('wtid_token', token)
  localStorage.setItem('wtid_user', JSON.stringify(user))
  return user
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  async function login(credentials) {
    const response = await api.post('/login', credentials)
    const nextUser = saveSession(response.data)
    setUser(nextUser)
    return nextUser
  }

  async function register(credentials) {
    const response = await api.post('/register', credentials)
    const nextUser = saveSession(response.data)
    setUser(nextUser)
    return nextUser
  }

  async function logout() {
    try {
      if (localStorage.getItem('wtid_token')) await api.post('/logout')
    } finally {
      localStorage.removeItem('wtid_token')
      localStorage.removeItem('wtid_user')
      setUser(null)
    }
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
