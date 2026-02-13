import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkspace } from '../context/WorkspaceContext'
import { useBoard } from '../context/BoardContext'
import EditBoardModal from './EditBoardModal'

/**
 * BoardCard Component
 * Displays a single board with actions based on user role
 */
const BoardCard = ({ board }) => {
  const navigate = useNavigate()
  const { workspaceId, projectId } = useParams()
  const { selectedWorkspace, getUserRole } = useWorkspace()
  const { deleteBoard } = useBoard()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const role = selectedWorkspace ? getUserRole(selectedWorkspace) : null

  // Permission checks
  const canEdit = role === 'OWNER' || role === 'ADMIN'
  const canDelete = role === 'OWNER'

  // Handle opening board
  const handleOpen = () => {
    navigate(`/workspace/${workspaceId}/project/${projectId}/board/${board._id}`)
  }

  // Handle delete board
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${board.name}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    const result = await deleteBoard(board._id)
    
    if (!result.success) {
      alert(`Failed to delete board: ${result.error}`)
      setIsDeleting(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <>
      <div className="card hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-200 group">
        <div className="flex flex-col h-full">
          {/* Board Header */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-dark-text group-hover:text-primary-500 transition-colors mb-2">
              {board.name}
            </h3>
            <p className="text-xs text-dark-muted">
              Created {formatDate(board.createdAt)}
            </p>
            {board.createdBy && (
              <p className="text-xs text-dark-muted mt-1">
                by {board.createdBy.name}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-border">
            <div className="flex items-center space-x-2">
              {/* Edit Button */}
              {canEdit && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-dark-muted hover:text-primary-500 transition-colors"
                  title="Edit board"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}

              {/* Delete Button */}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-dark-muted hover:text-red-400 transition-colors disabled:opacity-50"
                  title="Delete board"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            {/* Open Button */}
            <button
              onClick={handleOpen}
              className="btn btn-primary text-sm py-1.5 px-4"
            >
              Open →
            </button>
          </div>
        </div>
      </div>

      {/* Edit Board Modal */}
      <EditBoardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        board={board}
      />
    </>
  )
}

export default BoardCard
