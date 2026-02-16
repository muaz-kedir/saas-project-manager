import { useState, useEffect } from 'react'
import { useTask } from '../context/TaskContext'

/**
 * EditTaskModal Component
 * Modal for editing an existing task
 */
const EditTaskModal = ({ isOpen, onClose, task, columnId }) => {
  const [taskTitle, setTaskTitle] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { updateTask } = useTask()

  // Populate form when task changes
  useEffect(() => {
    if (task) {
      setTaskTitle(task.title || '')
    }
  }, [task])

  // Handle input change
  const handleChange = (e) => {
    setTaskTitle(e.target.value)
    if (error) setError('')
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate
    if (!taskTitle.trim()) {
      setError('Task title is required')
      return
    }

    if (taskTitle.trim().length < 2) {
      setError('Task title must be at least 2 characters')
      return
    }

    // Check if title changed
    if (taskTitle.trim() === task.title) {
      handleClose()
      return
    }

    setLoading(true)

    // Update task
    const result = await updateTask(task._id, { title: taskTitle.trim() }, columnId)

    if (result.success) {
      // Success! Close modal
      handleClose()
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  // Handle closing modal
  const handleClose = () => {
    setError('')
    setLoading(false)
    onClose()
  }

  // Don't render if not open
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full p-6 relative">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Header */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Edit Task
          </h2>
          <p className="text-gray-600 mb-6">
            Update the task title.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Task Title */}
            <div>
              <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                id="taskTitle"
                name="taskTitle"
                type="text"
                value={taskTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800"
                placeholder="e.g., Design homepage mockup"
                disabled={loading}
                autoFocus
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditTaskModal
