import { useState, useEffect } from 'react'
import { useBoard } from '../context/BoardContext'

/**
 * EditBoardModal Component
 * Modal for editing an existing board
 */
const EditBoardModal = ({ isOpen, onClose, board }) => {
  const [boardName, setBoardName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { updateBoard } = useBoard()

  // Populate form when board changes
  useEffect(() => {
    if (board) {
      setBoardName(board.name || '')
    }
  }, [board])

  // Handle input change
  const handleChange = (e) => {
    setBoardName(e.target.value)
    if (error) setError('')
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate
    if (!boardName.trim()) {
      setError('Board name is required')
      return
    }

    if (boardName.trim().length < 3) {
      setError('Board name must be at least 3 characters')
      return
    }

    // Check if name changed
    if (boardName.trim() === board.name) {
      handleClose()
      return
    }

    setLoading(true)

    // Update board
    const result = await updateBoard(board._id, { name: boardName.trim() })

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
            Edit Board
          </h2>
          <p className="text-dark-muted mb-6">
            Update the board name.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Board Name */}
            <div>
              <label htmlFor="boardName" className="block text-sm font-medium text-dark-text mb-2">
                Board Name <span className="text-red-400">*</span>
              </label>
              <input
                id="boardName"
                name="boardName"
                type="text"
                value={boardName}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Sprint 1, Development Board"
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
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditBoardModal
