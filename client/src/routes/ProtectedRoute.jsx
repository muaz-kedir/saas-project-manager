import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protected Route Component
 * Wraps routes that require authentication
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Render child routes if authenticated
  return <Outlet />
}

export default ProtectedRoute
