import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useBoard } from '../context/BoardContext'
import { useColumn } from '../context/ColumnContext'
import { useWorkspace } from '../context/WorkspaceContext'
import KanbanColumn from '../components/KanbanColumn'
import CreateColumnModal from '../components/CreateColumnModal'

/**
 * BoardHome Component
 * Kanban board view with horizontal columns
 */
const BoardHome = () => {
  const { boardId } = useParams()
  const { boards, fetchBoards } = useBoard()
  const { columns, loading, fetchColumns } = useColumn()
  const { selectedWorkspace, getUserRole } = useWorkspace()
  const [board, setBoard] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const role = selectedWorkspace ? getUserRole(selectedWorkspace) : null

  // Permission check - Owner and Admin can create columns
  const canCreate = role === 'OWNER' || role === 'ADMIN'

  // Find current board
  useEffect(() => {
    const currentBoard = boards.find(b => b._id === boardId)
    if (currentBoard) {
      setBoard(currentBoard)
    } else if (boardId) {
      // If board not in context, fetch it
      fetchBoards()
    }
  }, [boardId, boards, fetchBoards])

  // Fetch columns when board changes
  useEffect(() => {
    if (boardId) {
      fetchColumns(boardId)
    }
  }, [boardId, fetchColumns])

  // Loading state
  if (loading && columns.length === 0) {
    return (
      <div className="h-full flex flex-col">
        {/* Header Skeleton */}
        <div className="mb-6 animate-pulse">
          <div className="h-8 bg-dark-border rounded w-48 mb-2"></div>
          <div className="h-4 bg-dark-border rounded w-64"></div>
        </div>

        {/* Columns Skeleton */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-32 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Board Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-text">
              {board ? board.name : 'Loading...'}
            </h1>
            <p className="text-dark-muted mt-1">
              {columns.length} {columns.length === 1 ? 'column' : 'columns'}
            </p>
          </div>

          {/* Add Column Button */}
          {canCreate && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Column</span>
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board - Horizontal Scrolling */}
      <div className="flex-1 overflow-hidden">
        {columns.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-4 h-full">
            {/* Render Columns */}
            {columns.map(column => (
              <KanbanColumn 
                key={column._id} 
                column={column} 
              />
            ))}

            {/* Add Column Card - Always visible for Owner/Admin */}
            {canCreate && (
              <div className="flex-shrink-0 w-80">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full h-32 bg-white/50 hover:bg-white border-2 border-dashed border-gray-300 hover:border-primary-500 rounded-lg transition-all flex flex-col items-center justify-center space-y-2 text-gray-500 hover:text-primary-500"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">Add Column</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-dark-text mb-2">
                No columns yet
              </h3>
              <p className="text-dark-muted mb-6">
                Create your first column to start organizing tasks in this board.
              </p>
              {canCreate && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn btn-primary"
                >
                  Create Your First Column
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Column Modal */}
      <CreateColumnModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        boardId={boardId}
      />
    </div>
  )
}

export default BoardHome
