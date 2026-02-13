import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useWorkspace } from '../context/WorkspaceContext'
import MembersList from '../components/MembersList'
import InviteMemberModal from '../components/InviteMemberModal'
import WorkspaceProjects from './WorkspaceProjects'

/**
 * WorkspaceHome Component
 * Main workspace view with tabs for Overview, Members, and Projects
 */
const WorkspaceHome = () => {
  const { workspaceId } = useParams()
  const { selectedWorkspace, getUserRole, fetchMembers, canInviteMembers } = useWorkspace()
  const [activeTab, setActiveTab] = useState('overview')
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  const role = selectedWorkspace ? getUserRole(selectedWorkspace) : null
  const canInvite = selectedWorkspace ? canInviteMembers(selectedWorkspace) : false

  // Fetch members when Members tab is selected
  useEffect(() => {
    if (activeTab === 'members' && workspaceId) {
      fetchMembers(workspaceId)
    }
  }, [activeTab, workspaceId, fetchMembers])

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-text">
              {selectedWorkspace?.name || 'Workspace'}
            </h1>
            <p className="text-dark-muted mt-1">
              {selectedWorkspace?.description || 'No description'}
            </p>
            {role && (
              <div className="mt-3">
                <span className="text-xs text-dark-muted">Your role: </span>
                <span className="text-sm font-medium text-primary-500">{role}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="card">
        <div className="flex items-center justify-between border-b border-dark-border">
          {/* Tabs */}
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'overview'
                  ? 'text-primary-500'
                  : 'text-dark-muted hover:text-dark-text'
              }`}
            >
              Overview
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'projects'
                  ? 'text-primary-500'
                  : 'text-dark-muted hover:text-dark-text'
              }`}
            >
              Projects
              {activeTab === 'projects' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'members'
                  ? 'text-primary-500'
                  : 'text-dark-muted hover:text-dark-text'
              }`}
            >
              Members
              {activeTab === 'members' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
              )}
            </button>
          </div>

          {/* Invite Button (only show on Members tab if user can invite) */}
          {activeTab === 'members' && canInvite && (
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="btn btn-primary text-sm flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Invite Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Coming Soon Notice */}
          <div className="card bg-primary-500/10 border-primary-500/30">
            <div className="flex items-start space-x-3">
              <span className="text-3xl">🚀</span>
              <div>
                <h3 className="font-bold text-dark-text mb-1">
                  Workspace Overview
                </h3>
                <p className="text-dark-muted text-sm">
                  Quick stats and activity for this workspace.
                </p>
              </div>
            </div>
          </div>

          {/* Placeholder Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-dark-muted">Projects</p>
                  <p className="text-3xl font-bold text-dark-text mt-2">0</p>
                </div>
                <div className="bg-accent-blue/20 p-3 rounded-lg">
                  <span className="text-3xl">📊</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-dark-muted">Tasks</p>
                  <p className="text-3xl font-bold text-dark-text mt-2">0</p>
                </div>
                <div className="bg-accent-green/20 p-3 rounded-lg">
                  <span className="text-3xl">✅</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-dark-muted">Members</p>
                  <p className="text-3xl font-bold text-dark-text mt-2">
                    {selectedWorkspace?.members?.length || 0}
                  </p>
                </div>
                <div className="bg-accent-purple/20 p-3 rounded-lg">
                  <span className="text-3xl">👥</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'projects' && (
        <WorkspaceProjects />
      )}

      {activeTab === 'members' && (
        <MembersList />
      )}

      {/* Invite Member Modal */}
      <InviteMemberModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        workspaceId={workspaceId}
      />
    </div>
  )
}

export default WorkspaceHome
