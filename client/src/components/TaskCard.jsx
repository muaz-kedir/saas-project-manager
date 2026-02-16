import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useWorkspace } from '../context/WorkspaceContext'
import { useTask } from '../context/TaskContext'
import EditTaskModal from './EditTaskModal'

/**
 * TaskCard Component
 * Displays a single task card with edit/delete actions and drag & drop
 */
const TaskCard = ({ task, columnId }) => {
  const { selectedWorkspace, getUserRole } = useWorkspace()
  const { deleteTask } = useTask()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const role = selectedWorkspace ? getUserRole(selectedWorkspace) : null

  // Permission checks
  const canEdit = role === 'OWNER' || role === 'ADMIN'
  const canDelete = role === 'OWNER' || role === 'ADMIN'
  const canDrag = role === 'OWNER' || role === 'ADMIN' || role === 'MEMBER'

  // Drag & Drop setup
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task._id,
    disabled: !canDrag
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Handle delete task
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return
    }

    setIsDeleting(true)
    const result = await deleteTask(task._id, columnId)
    
    if (!result.success) {
      alert(`Failed to delete task: ${result.error}`)
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div 
        ref={setNodeRef}
        style={style}
        className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-500/30 transition-all duration-200 group cursor-grab active:cursor-grabbing ${
          isDragging ? 'shadow-xl scale-105 rotate-2' : ''
        }`}
        {...attributes}
        {...listeners}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 font-medium break-words">
              {task.title}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {/* Edit Button */}
            {canEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditModalOpen(true)
                }}
                className="p-1 text-gray-400 hover:text-primary-500 hover:bg-gray-100 rounded transition-colors"
                title="Edit task"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}

            {/* Delete Button */}
            {canDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}
                disabled={isDeleting}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                title="Delete task"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
        columnId={columnId}
      />
    </>
  )
}

export default TaskCard
