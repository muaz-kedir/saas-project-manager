import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useWorkspace } from '../context/WorkspaceContext'
import { useBoard } from '../context/BoardContext'
import BoardCard from '../components/BoardCard'
import CreateBoardModal from '../components/CreateBoardModal'

/**
 * ProjectBoards Component
 * Displays all boards in a project
 */
const ProjectBoards = () => {
  const { projectId } = useParams()
  const { selectedWorkspace, getUserRole } = useWorkspace()
  const { boards, loading, fetchBoards } = useBoard()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const role = selectedWorkspace ? getUserRole(selectedWorkspace) : null

  // Permission check - Owner and Admin can create boards
  const canCreate = role === 'OWNER' || role === 'ADMIN'

  // Fetch boards when component mounts
  useEffect(() => {
    if (projectId) {
      fetchBoards(projectId)
    }
  }, [projectId, fetchBoards])

  // Loading state
  if (loading && boards.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="animate-pulse">
            <div className="h-8 bg-dark-border rounded w-32 mb-2"></div>
            <div className="h-4 bg-dark-border rounded w-48"></div>
          </div>
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
          <h2 className="text-2xl font-bold text-dark-text">
            Boards
          </h2>
          <p className="text-dark-muted mt-1">
            Manage your project boards
          </p>
        </div>

        {/* Create Board Button */}
        {canCreate && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Board</span>
          </button>
        )}
      </div>

      {/* Boards Grid */}
      {boards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map(board => (
            <BoardCard 
              key={board._id} 
              board={board} 
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="card text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-dark-text mb-2">
              No boards yet
            </h3>
            <p className="text-dark-muted mb-6">
              Create your first Kanban board to start organizing tasks.
            </p>
            {canCreate && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn btn-primary"
              >
                Create Your First Board
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create Board Modal */}
      <CreateBoardModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={projectId}
      />
    </div>
  )
}

export default ProjectBoards
