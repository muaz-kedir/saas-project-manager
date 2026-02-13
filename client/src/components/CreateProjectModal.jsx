import { useState } from 'react'
import { useProject } from '../context/ProjectContext'

/**
 * CreateProjectModal Component
 * Modal for creating a new project
 */
const CreateProjectModal = ({ isOpen, onClose, workspaceId }) => {
  const [projectName, setProjectName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { createProject, fetchProjects } = useProject()

  // Handle input change
  const handleChange = (e) => {
    setProjectName(e.target.value)
    if (error) setError('')
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate
    if (!projectName.trim()) {
      setError('Project name is required')
      return
    }

    if (projectName.trim().length < 3) {
      setError('Project name must be at least 3 characters')
      return
    }

    setLoading(true)

    // Create project
    const result = await createProject(projectName.trim(), workspaceId)

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
    setProjectName('')
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
        <div className="bg-dark-card rounded-lg shadow-xl border border-dark-border max-w-md w-full p-6 relative">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-dark-muted hover:text-dark-text"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Header */}
          <h2 className="text-2xl font-bold text-dark-text mb-2">
            Create New Project
          </h2>
          <p className="text-dark-muted mb-6">
            Create a project to organize your tasks and boards.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Project Name */}
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-dark-text mb-2">
                Project Name <span className="text-red-400">*</span>
              </label>
              <input
                id="projectName"
                name="projectName"
                type="text"
                value={projectName}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Website Redesign"
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
                className="btn btn-secondary flex-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateProjectModal
