import { useWorkspace } from '../context/WorkspaceContext'

/**
 * MembersList Component
 * Displays list of workspace members with their roles
 */
const MembersList = () => {
  const { members, loading } = useWorkspace()

  // Get role badge styling
  const getRoleBadge = (role) => {
    const badges = {
      OWNER: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30',
      ADMIN: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
      MEMBER: 'bg-dark-border text-dark-muted border-dark-border'
    }
    return badges[role] || badges.MEMBER
  }

  // Get role icon
  const getRoleIcon = (role) => {
    const icons = {
      OWNER: '👑',
      ADMIN: '⚡',
      MEMBER: '👤'
    }
    return icons[role] || icons.MEMBER
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Loading state
  if (loading && members.length === 0) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-dark-border rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-dark-border rounded w-1/4"></div>
                <div className="h-3 bg-dark-border rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (members.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-dark-text mb-2">
            No members yet
          </h3>
          <p className="text-dark-muted">
            Invite team members to collaborate on this workspace.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      {/* Table Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dark-text">
          Team Members ({members.length})
        </h3>
        <p className="text-sm text-dark-muted mt-1">
          Manage who has access to this workspace
        </p>
      </div>

      {/* Members Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-dark-muted">
                Member
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-dark-muted">
                Email
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-dark-muted">
                Role
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-dark-muted">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr 
                key={member._id} 
                className="border-b border-dark-border hover:bg-dark-bg transition-colors"
              >
                {/* Member Name */}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <span className="text-primary-500 font-medium text-sm">
                        {member.user?.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-text">
                        {member.user?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="py-4 px-4">
                  <p className="text-sm text-dark-muted">
                    {member.user?.email || 'N/A'}
                  </p>
                </td>

                {/* Role Badge */}
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadge(member.role)}`}>
                    <span className="mr-1">{getRoleIcon(member.role)}</span>
                    {member.role}
                  </span>
                </td>

                {/* Joined Date */}
                <td className="py-4 px-4">
                  <p className="text-sm text-dark-muted">
                    {formatDate(member.createdAt)}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MembersList
