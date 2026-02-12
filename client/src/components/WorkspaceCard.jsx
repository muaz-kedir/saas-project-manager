import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../context/WorkspaceContext'
import { useAuth } from '../context/AuthContext'

/**
 * WorkspaceCard Component
 * Displays a single workspace with role badge
 */
const WorkspaceCard = ({ workspace }) => {
  const navigate = useNavigate()
  const { selectWorkspace, getUserRole } = useWorkspace()
  const { user } = useAuth()

  // Get user's role in this workspace
  const role = getUserRole(workspace)

  // Handle opening workspace
  const handleOpen = () => {
    selectWorkspace(workspace)
    navigate(`/workspace/${workspace._id}`)
  }

  // Get role badge styling
  const getRoleBadge = () => {
    const badges = {
      OWNER: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30',
      ADMIN: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
      MEMBER: 'bg-dark-border text-dark-muted border-dark-border'
    }
    return badges[role] || badges.MEMBER
  }

  // Get role icon
  const getRoleIcon = () => {
    const icons = {
      OWNER: '👑',
      ADMIN: '⚡',
      MEMBER: '👤'
    }
    return icons[role] || icons.MEMBER
  }

  return (
    <div className="card hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-200 cursor-pointer group">
      <div className="flex flex-col h-full">
        {/* Workspace Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-dark-text group-hover:text-primary-500 transition-colors">
              {workspace.name}
            </h3>
            {workspace.description && (
              <p className="text-sm text-dark-muted mt-1 line-clamp-2">
                {workspace.description}
              </p>
            )}
          </div>
        </div>

        {/* Role Badge */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-dark-border">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadge()}`}>
            <span className="mr-1">{getRoleIcon()}</span>
            {role}
          </span>

          {/* Open Button */}
          <button
            onClick={handleOpen}
            className="btn btn-primary text-sm py-1.5 px-4"
          >
            Open →
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceCard
