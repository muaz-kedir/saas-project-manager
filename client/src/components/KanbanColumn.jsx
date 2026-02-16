import { useState, useEffect } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useWorkspace } from '../context/WorkspaceContext'
import { useColumn } from '../context/ColumnContext'
import { useTask } from '../context/TaskContext'
import EditColumnModal from './EditColumnModal'
import TaskCard from './TaskCard'
import CreateTaskModal from './CreateTaskModal'

/**
 * KanbanColumn Component
 * Displays a single Kanban column with tasks and drag & drop support
 */
const KanbanColumn = ({ column }) => {
  const { selectedWorkspace, getUserRole } = useWorkspace()
  const { deleteColumn } = useColumn()
  const { fetchTasks, getColumnTasks } = useTask()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const role = selectedWorkspace ? getUserRole(selectedWorkspace) : null

  // Permission checks
  const canEdit = role === 'OWNER' || role === 'ADMIN'
  const canDelete = role === 'OWNER'
  const canCreateTask = role === 'OWNER' || role === 'ADMIN' || role === 'MEMBER'

  // Droppable setup
  const { setNodeRef, isOver } = useDroppable({
    id: column._id,
  })

  // Fetch tasks when column mounts
  useEffect(() => {
    if (column._id) {
      fetchTasks(column._id)
    }
  }, [column._id, fetchTasks])

  // Get tasks for this column
  const tasks = getColumnTasks(column._id)
  const taskIds = tasks.map(task => task._id)

  // Handle delete column
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${column.name}"? All tasks in this column will be lost.`)) {
      return
    }

    setIsDeleting(true)
    const result = await deleteColumn(column._id)
    
    if (!result.success) {
      alert(`Failed to delete column: ${result.error}`)
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div 
        ref={setNodeRef}
        className={`flex-shrink-0 w-80 bg-white rounded-lg shadow-md flex flex-col max-h-full transition-all ${
          isOver ? 'ring-2 ring-primary-500 ring-opacity-50 bg-primary-50' : ''
        }`}
      >
        {/* Column Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800 text-lg">
              {column.name}
            </h3>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              {/* Edit Button */}
              {canEdit && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-gray-100 rounded transition-colors"
                  title="Edit column"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}

              {/* Delete Button */}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  title="Delete column"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Task Count */}
          <p className="text-xs text-gray-500">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>

        {/* Tasks Area - Scrollable with Sortable Context */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[200px] max-h-[60vh]">
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.length > 0 ? (
              /* Render Tasks */
              tasks.map(task => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  columnId={column._id}
                />
              ))
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-sm text-gray-400">
                  {isOver ? 'Drop task here' : 'No tasks yet'}
                </p>
              </div>
            )}
          </SortableContext>
        </div>

        {/* Add Task Button */}
        {canCreateTask && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setIsCreateTaskModalOpen(true)}
              className="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-500 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Task</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Column Modal */}
      <EditColumnModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        column={column}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        columnId={column._id}
      />
    </>
  )
}

export default KanbanColumn
