import { createContext, useState, useEffect, useContext } from 'react'
import axios from '../api/axios'

// Create Auth Context
const AuthContext = createContext(null)

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password })
      
      // Backend returns { user: {...}, token: "..." }
      const { token, user } = response.data
      
      // Save to state
      setToken(token)
      setUser(user)
      
      // Save to localStorage for persistence
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return { success: true, user }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed. Please try again.'
      }
    }
  }

  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/auth/register', {
        name,
        email,
        password
      })
      
      // Backend returns { user: {...}, token: "..." }
      const { token, user } = response.data
      
      // Save to state
      setToken(token)
      setUser(user)
      
      // Save to localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return { success: true, user }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Registration failed. Please try again.'
      }
    }
  }

  // Logout function
  const logout = () => {
    // Clear state
    setUser(null)
    setToken(null)
    
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Context value
  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
