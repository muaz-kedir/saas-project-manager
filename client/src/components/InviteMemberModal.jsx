import { useState } from 'react'
import { useWorkspace } from '../context/WorkspaceContext'

/**
 * InviteMemberModal Component
 * Modal for inviting new members to workspace
 */
const InviteMemberModal = ({ isOpen, onClose, workspaceId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'MEMBER'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const { inviteMember, fetchMembers, selectedWorkspace, getAvailableRoles } = useWorkspace()

  // Get available roles based on current user's role
  const availableRoles = getAvailableRoles(selectedWorkspace)

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
    setSuccess('')

    // Validate name
    if (!formData.name || formData.name.trim().length < 2) {
      setError('Please enter a valid name (at least 2 characters)')
      return
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // Validate role
    if (!availableRoles.includes(formData.role)) {
      setError('You cannot assign this role')
      return
    }

    setLoading(true)

    // Invite member
    const result = await inviteMember(workspaceId, formData.name, formData.email, formData.role)

    if (result.success) {
      // Success! Show message
      setSuccess('Invitation sent successfully! The user will receive an email.')
      setFormData({ name: '', email: '', role: 'MEMBER' })
      setLoading(false)
      
      // Close after 2 seconds
      setTimeout(() => {
        handleClose()
      }, 2000)
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  // Handle closing modal
  const handleClose = () => {
    setFormData({ name: '', email: '', role: 'MEMBER' })
    setError('')
    setSuccess('')
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
            Invite Team Member
          </h2>
          <p className="text-dark-muted mb-6">
            Send an invitation to add a new member to this workspace.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="John Doe"
                disabled={loading}
                autoFocus
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="colleague@example.com"
                disabled={loading}
                required
              />
              <p className="text-xs text-dark-muted mt-1">
                An invitation email will be sent to this address
              </p>
            </div>

            {/* Role Dropdown */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-dark-text mb-2">
                Role <span className="text-red-400">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
                disabled={loading}
                required
              >
                {availableRoles.map(role => (
                  <option key={role} value={role}>
                    {role.charAt(0) + role.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              <p className="text-xs text-dark-muted mt-1">
                {formData.role === 'ADMIN' 
                  ? 'Can manage workspace and invite members' 
                  : 'Can view and collaborate on projects'}
              </p>
            </div>

            {/* Role Permissions Info */}
            <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-3">
              <p className="text-xs text-dark-muted">
                <span className="font-medium text-dark-text">Note:</span> You can only assign roles that are equal to or below your current role.
              </p>
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
                {loading ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default InviteMemberModal
