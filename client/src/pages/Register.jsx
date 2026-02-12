import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Register Page Component
 * Handles new user registration with validation
 */
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')

  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Check password strength
  useEffect(() => {
    if (formData.password.length === 0) {
      setPasswordStrength('')
    } else if (formData.password.length < 6) {
      setPasswordStrength('weak')
    } else if (formData.password.length < 10) {
      setPasswordStrength('medium')
    } else {
      setPasswordStrength('strong')
    }
  }, [formData.password])

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate inputs
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    // Validate name
    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters')
      setLoading(false)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    // Attempt registration
    const result = await register(formData.name, formData.email, formData.password)

    if (result.success) {
      // Success! Auto-login and navigate to dashboard
      navigate('/dashboard', { replace: true })
    } else {
      // Show error message
      setError(result.error)
      setLoading(false)
    }
  }

  // Get password strength color
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'strong': return 'bg-green-500'
      default: return 'bg-gray-300'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-500 mb-2">
            📋 ProjectHub
          </h1>
          <p className="text-dark-muted">Create your account</p>
        </div>

        {/* Register Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="John Doe"
                disabled={loading}
                autoComplete="name"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
                disabled={loading}
                autoComplete="email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-text mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                disabled={loading}
                autoComplete="new-password"
                required
              />
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-dark-border rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ 
                          width: passwordStrength === 'weak' ? '33%' : 
                                 passwordStrength === 'medium' ? '66%' : 
                                 passwordStrength === 'strong' ? '100%' : '0%' 
                        }}
                      />
                    </div>
                    <span className="text-xs text-dark-muted capitalize">{passwordStrength}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-text mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                disabled={loading}
                autoComplete="new-password"
                required
              />
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <p className={`text-xs mt-1 ${
                  formData.password === formData.confirmPassword 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formData.password === formData.confirmPassword 
                    ? '✓ Passwords match' 
                    : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-dark-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
