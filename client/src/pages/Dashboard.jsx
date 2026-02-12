import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useWorkspace } from '../context/WorkspaceContext'
import WorkspaceCard from '../components/WorkspaceCard'
import CreateWorkspaceModal from '../components/CreateWorkspaceModal'

/**
 * Dashboard Page Component
 * Main workspace dashboard showing all user's workspaces
 */
const Dashboard = () => {
  const { user } = useAuth()
  const { workspaces, loading, error, fetchWorkspaces } = useWorkspace()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch workspaces on mount
  useEffect(() => {
    fetchWorkspaces()
  }, [fetchWorkspaces])

  // Loading state
  if (loading && workspaces.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-dark-border rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-dark-border rounded w-1/3"></div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-dark-border rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-dark-border rounded w-full mb-2"></div>
              <div className="h-4 bg-dark-border rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-text">
            Your Workspaces
          </h1>
          <p className="text-dark-muted mt-1">
            Manage and access your workspaces
          </p>
        </div>

        {/* Create Workspace Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Workspace</span>
        </button>
      </div>

      {/* Info Banner - Shows all workspaces including invited ones */}
      {workspaces.length > 0 && (
        <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-primary-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-dark-text">
                Showing all workspaces you own or are a member of. Check the role badge on each card to see your permissions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading workspaces</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={fetchWorkspaces}
            className="text-sm underline mt-2"
          >
            Try again
          </button>
        </div>
      )}

      {/* Workspaces Grid */}
      {workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map(workspace => (
            <WorkspaceCard 
              key={workspace._id} 
              workspace={workspace} 
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="card text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-dark-text mb-2">
              No workspaces yet
            </h3>
            <p className="text-dark-muted mb-6">
              Create your first workspace to start organizing your projects and collaborating with your team.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
            >
              Create Your First Workspace
            </button>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {workspaces.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-muted">Total Workspaces</p>
                <p className="text-3xl font-bold text-dark-text mt-2">{workspaces.length}</p>
              </div>
              <div className="bg-primary-500/20 p-3 rounded-lg">
                <span className="text-3xl">📁</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-muted">Owned by You</p>
                <p className="text-3xl font-bold text-dark-text mt-2">
                  {workspaces.filter(w => {
                    const role = w.members?.find(m => m.user === user.id || m.user._id === user.id)?.role
                    return role === 'OWNER'
                  }).length}
                </p>
              </div>
              <div className="bg-accent-purple/20 p-3 rounded-lg">
                <span className="text-3xl">👑</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-muted">Member Of</p>
                <p className="text-3xl font-bold text-dark-text mt-2">
                  {workspaces.filter(w => {
                    const role = w.members?.find(m => m.user === user.id || m.user._id === user.id)?.role
                    return role === 'MEMBER'
                  }).length}
                </p>
              </div>
              <div className="bg-accent-blue/20 p-3 rounded-lg">
                <span className="text-3xl">👥</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default Dashboard
