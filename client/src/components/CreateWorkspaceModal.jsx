import { useState } from 'react'
import { useWorkspace } from '../context/WorkspaceContext'

/**
 * CreateWorkspaceModal Component
 * Modal for creating a new workspace
 */
const CreateWorkspaceModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { createWorkspace, fetchWorkspaces } = useWorkspace()

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate
    if (!formData.name.trim()) {
      setError('Workspace name is required')
      return
    }

    if (formData.name.trim().length < 3) {
      setError('Workspace name must be at least 3 characters')
      return
    }

    setLoading(true)

    // Create workspace
    const result = await createWorkspace(formData.name, formData.description)

    if (result.success) {
      // Success! Refresh list and close modal
      await fetchWorkspaces()
      handleClose()
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  // Handle closing modal
  const handleClose = () => {
    setFormData({ name: '', description: '' })
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
            Create New Workspace
          </h2>
          <p className="text-dark-muted mb-6">
            Create a workspace to organize your projects and collaborate with your team.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Workspace Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-2">
                Workspace Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Marketing Team"
                disabled={loading}
                autoFocus
                required
              />
            </div>

            {/* Description (Optional) */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-dark-text mb-2">
                Description <span className="text-dark-muted text-xs">(optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input resize-none"
                placeholder="Brief description of this workspace..."
                rows={3}
                disabled={loading}
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
                {loading ? 'Creating...' : 'Create Workspace'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateWorkspaceModal
