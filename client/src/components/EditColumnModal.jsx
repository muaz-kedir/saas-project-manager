import { useState, useEffect } from 'react'
import { useColumn } from '../context/ColumnContext'

/**
 * EditColumnModal Component
 * Modal for editing an existing column
 */
const EditColumnModal = ({ isOpen, onClose, column }) => {
  const [columnName, setColumnName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { updateColumn } = useColumn()

  // Populate form when column changes
  useEffect(() => {
    if (column) {
      setColumnName(column.name || '')
    }
  }, [column])

  // Handle input change
  const handleChange = (e) => {
    setColumnName(e.target.value)
    if (error) setError('')
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate
    if (!columnName.trim()) {
      setError('Column name is required')
      return
    }

    if (columnName.trim().length < 2) {
      setError('Column name must be at least 2 characters')
      return
    }

    // Check if name changed
    if (columnName.trim() === column.name) {
      handleClose()
      return
    }

    setLoading(true)

    // Update column
    const result = await updateColumn(column._id, { name: columnName.trim() })

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
            Edit Column
          </h2>
          <p className="text-gray-600 mb-6">
            Update the column name.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Column Name */}
            <div>
              <label htmlFor="columnName" className="block text-sm font-medium text-gray-700 mb-2">
                Column Name <span className="text-red-500">*</span>
              </label>
              <input
                id="columnName"
                name="columnName"
                type="text"
                value={columnName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800"
                placeholder="e.g., To Do, In Progress, Done"
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

export default EditColumnModal
