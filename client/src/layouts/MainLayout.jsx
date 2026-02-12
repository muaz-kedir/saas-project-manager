import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Main Layout Component
 * Provides consistent layout with navbar for authenticated pages
 */
const MainLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navbar */}
      <nav className="bg-dark-card shadow-lg border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-purple bg-clip-text text-transparent">
                📋 ProjectHub
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-dark-text hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>

              {/* User Menu */}
              <div className="flex items-center space-x-3 border-l border-dark-border pl-4">
                <div className="text-sm">
                  <p className="font-medium text-dark-text">{user?.name}</p>
                  <p className="text-dark-muted text-xs">{user?.email}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
