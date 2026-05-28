import { createContext, useContext, useState } from 'react'
import { DEMO_USER } from '../data/mockData.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // Pre-seed with the demo account so it always works
  const [accounts, setAccounts] = useState([
    { name: DEMO_USER.name, email: DEMO_USER.email, password: DEMO_USER.password }
  ])

  function register(name, email, password) {
    const exists = accounts.find(a => a.email === email)
    if (exists) return { error: 'An account with this email already exists.' }
    const newAccount = { name, email, password }
    setAccounts(prev => [...prev, newAccount])
    setUser({ name, email })
    return { success: true }
  }

  function login(email, password) {
    const match = accounts.find(a => a.email === email && a.password === password)
    if (!match) return { error: 'Invalid email or password.' }
    setUser({ name: match.name, email: match.email })
    return { success: true }
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
