import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      if (response.data.success) {
        setUser(response.data.user)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        axios.defaults.headers.common['user-id'] = response.data.user.id
        return { success: true }
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData)
      if (response.data.success) {
        return { success: true, user: response.data.user }
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['user-id']
  }

  useEffect(() => {
    if (user) {
      axios.defaults.headers.common['user-id'] = user.id
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

