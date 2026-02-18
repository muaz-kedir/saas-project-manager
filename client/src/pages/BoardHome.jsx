import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { 
  DndContext, 
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useBoard } from '../context/BoardContext'
import { useColumn } from '../context/ColumnContext'
import { useTask } from '../context/TaskContext'
import { useWorkspace } from '../context/WorkspaceContext'
import { useSocket } from '../context/SocketContext'
import KanbanColumn from '../components/KanbanColumn'
import CreateColumnModal from '../components/CreateColumnModal'

/**
 * BoardHome Component
 * Kanban board view with horizontal columns and drag & drop
 */
const BoardHome = () => {
  const { boardId } = useParams()
  const { boards, fetchBoards } = useBoard()
  const { columns, loading, fetchColumns } = useColumn()
  const { getColumnTasks, moveTask, reorderTasks, addTask, updateTask, deleteTask } = useTask()
  const { selectedWorkspace, getUserRole } = useWorkspace()
  const { joinBoard, leaveBoard, on, off } = useSocket()
  const [board, setBoard] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [activeTask, setActiveTask] = useState(null)

  const role = selectedWorkspace ? getUserRole(selectedWorkspace) : null
  const canCreate = role === 'OWNER' || role === 'ADMIN'

  // Drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  )

  // Find current board
  useEffect(() => {
    const currentBoard = boards.find(b => b._id === boardId)
    if (currentBoard) {
      setBoard(currentBoard)
    } else if (boardId) {
      fetchBoards()
    }
  }, [boardId, boards, fetchBoards])

  // Fetch columns when board changes
  useEffect(() => {
    if (boardId) {
      fetchColumns(boardId)
    }
  }, [boardId, fetchColumns])

  // Socket.io: Join board room and listen for real-time updates
  useEffect(() => {
    if (!boardId) return;

    // Join board room
    joinBoard(boardId);

    // Listen for task created
    const handleTaskCreated = ({ task, columnId }) => {
      console.log('🔔 Task created:', task);
      addTask(task);
    };

    // Listen for task updated
    const handleTaskUpdated = ({ task }) => {
      console.log('🔔 Task updated:', task);
      updateTask(task._id, task);
    };

    // Listen for task moved
    const handleTaskMoved = ({ task, oldColumnId, newColumnId }) => {
      console.log('🔔 Task moved:', task);
      updateTask(task._id, task);
    };

    // Listen for task deleted
    const handleTaskDeleted = ({ taskId }) => {
      console.log('🔔 Task deleted:', taskId);
      deleteTask(taskId);
    };

    // Listen for comment added
    const handleCommentAdded = ({ taskId, comment }) => {
      console.log('🔔 Comment added:', comment);
      // Refresh task to get updated comments
      // You can implement a more granular update if needed
    };

    // Register listeners
    on('task:created', handleTaskCreated);
    on('task:updated', handleTaskUpdated);
    on('task:moved', handleTaskMoved);
    on('task:deleted', handleTaskDeleted);
    on('comment:added', handleCommentAdded);

    // Cleanup
    return () => {
      off('task:created', handleTaskCreated);
      off('task:updated', handleTaskUpdated);
      off('task:moved', handleTaskMoved);
      off('task:deleted', handleTaskDeleted);
      off('comment:added', handleCommentAdded);
      leaveBoard(boardId);
    };
  }, [boardId, joinBoard, leaveBoard, on, off, addTask, updateTask, deleteTask]);

  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event
    const taskId = active.id
    
    // Find the task being dragged
    for (const column of columns) {
      const tasks = getColumnTasks(column._id)
      const task = tasks.find(t => t._id === taskId)
      if (task) {
        setActiveTask(task)
        break
      }
    }
  }

  // Handle drag over
  const handleDragOver = (event) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    // Find source and destination columns
    let sourceColumnId = null
    let destinationColumnId = null

    // Check if over a column
    const overColumn = columns.find(col => col._id === overId)
    if (overColumn) {
      destinationColumnId = overColumn._id
    }

    // Find source column
    for (const column of columns) {
      const tasks = getColumnTasks(column._id)
      if (tasks.find(t => t._id === activeId)) {
        sourceColumnId = column._id
        break
      }
    }

    // Find destination column if over a task
    if (!destinationColumnId) {
      for (const column of columns) {
        const tasks = getColumnTasks(column._id)
        if (tasks.find(t => t._id === overId)) {
          destinationColumnId = column._id
          break
        }
      }
    }

    if (!sourceColumnId || !destinationColumnId) return
    if (sourceColumnId === destinationColumnId) return

    // Move task between columns (optimistic)
    const sourceTasks = getColumnTasks(sourceColumnId)
    const destTasks = getColumnTasks(destinationColumnId)
    
    const activeTask = sourceTasks.find(t => t._id === activeId)
    if (!activeTask) return

    // Remove from source
    const newSourceTasks = sourceTasks.filter(t => t._id !== activeId)
    
    // Add to destination
    const newDestTasks = [...destTasks, activeTask]

    // Update state
    reorderTasks(sourceColumnId, newSourceTasks)
    reorderTasks(destinationColumnId, newDestTasks)
  }

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    // Find source and destination columns
    let sourceColumnId = null
    let destinationColumnId = null
    let activeIndex = -1
    let overIndex = -1

    // Find source column and active task index
    for (const column of columns) {
      const tasks = getColumnTasks(column._id)
      const index = tasks.findIndex(t => t._id === activeId)
      if (index !== -1) {
        sourceColumnId = column._id
        activeIndex = index
        break
      }
    }

    // Check if dropped on a column
    const overColumn = columns.find(col => col._id === overId)
    if (overColumn) {
      destinationColumnId = overColumn._id
      const destTasks = getColumnTasks(destinationColumnId)
      overIndex = destTasks.length // Add to end
    } else {
      // Dropped on a task
      for (const column of columns) {
        const tasks = getColumnTasks(column._id)
        const index = tasks.findIndex(t => t._id === overId)
        if (index !== -1) {
          destinationColumnId = column._id
          overIndex = index
          break
        }
      }
    }

    if (!sourceColumnId || !destinationColumnId) return

    // Same column reordering
    if (sourceColumnId === destinationColumnId) {
      if (activeIndex === overIndex) return

      const tasks = getColumnTasks(sourceColumnId)
      const reordered = arrayMove(tasks, activeIndex, overIndex)
      
      // Update UI immediately
      reorderTasks(sourceColumnId, reordered)

      // Update backend
      const movedTask = reordered[overIndex]
      await moveTask(movedTask._id, sourceColumnId, destinationColumnId, overIndex)
    } else {
      // Moving between columns
      await moveTask(activeId, sourceColumnId, destinationColumnId, overIndex)
    }
  }

  // Loading state
  if (loading && columns.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-6 animate-pulse">
          <div className="h-8 bg-dark-border rounded w-48 mb-2"></div>
          <div className="h-4 bg-dark-border rounded w-64"></div>
        </div>
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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

              {/* Add Column Card */}
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

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className="bg-white p-3 rounded-lg shadow-xl border-2 border-primary-500 rotate-3 scale-105">
              <p className="text-sm text-gray-800 font-medium">
                {activeTask.title}
              </p>
            </div>
          ) : null}
        </DragOverlay>

        {/* Create Column Modal */}
        <CreateColumnModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          boardId={boardId}
        />
      </div>
    </DndContext>
  )
}

export default BoardHome
