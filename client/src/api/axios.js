import axios from 'axios'

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user')
    
    // If user exists, add user ID to x-user-id header
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        config.headers['x-user-id'] = user.id
      } catch (error) {
        console.error('Error parsing user from localStorage:', error)
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default axiosInstance
