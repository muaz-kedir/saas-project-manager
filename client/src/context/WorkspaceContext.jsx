import { createContext, useState, useContext, useCallback } from 'react'
import axios from '../api/axios'
import { useAuth } from './AuthContext'

// Create Workspace Context
const WorkspaceContext = createContext(null)

// Custom hook to use workspace context
export const useWorkspace = () => {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider')
  }
  return context
}

// Workspace Provider Component
export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([])
  const [selectedWorkspace, setSelectedWorkspace] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { user } = useAuth()

  /**
   * Fetch all workspaces for current user
   */
  const fetchWorkspaces = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get('/workspaces')
      
      // Backend returns { count, workspaces: [{ workspace: {...}, role: "...", joinedAt: "..." }] }
      const workspaceData = response.data.workspaces || []
      
      // Transform to include role in members array for easier access
      const transformedWorkspaces = workspaceData.map(item => ({
        ...item.workspace,
        _id: item.workspace._id,
        name: item.workspace.name,
        description: item.workspace.description,
        owner: item.workspace.owner,
        members: [{
          user: user.id,
          role: item.role,
          joinedAt: item.joinedAt
        }]
      }))
      
      setWorkspaces(transformedWorkspaces)
      
      return { success: true, data: transformedWorkspaces }
    } catch (err) {
      console.error('Fetch workspaces error:', err)
      const errorMessage = err.response?.data?.message || 'Failed to load workspaces'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [user])

  /**
   * Create a new workspace
   */
  const createWorkspace = async (name, description = '') => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('/workspaces', {
        name,
        description
      })

      // Backend returns { message, workspace: { id, name, description, owner } }
      const newWorkspace = response.data.workspace

      // Transform to match our expected structure with members array
      const transformedWorkspace = {
        _id: newWorkspace.id,
        name: newWorkspace.name,
        description: newWorkspace.description,
        owner: newWorkspace.owner,
        members: [{
          user: user.id,
          role: 'OWNER',
          joinedAt: new Date().toISOString()
        }]
      }

      // Add to local state
      setWorkspaces(prev => [...prev, transformedWorkspace])

      return { success: true, workspace: transformedWorkspace }
    } catch (err) {
      console.error('Create workspace error:', err)
      const errorMessage = err.response?.data?.message || 'Failed to create workspace'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Select a workspace (for navigation)
   */
  const selectWorkspace = (workspace) => {
    setSelectedWorkspace(workspace)
    // Store in localStorage for persistence
    localStorage.setItem('selectedWorkspace', JSON.stringify(workspace))
  }

  /**
   * Get user's role in a specific workspace
   */
  const getUserRole = (workspace) => {
    if (!workspace || !user) return null

    // Find current user in workspace members
    const membership = workspace.members?.find(
      m => m.user === user.id || m.user._id === user.id
    )

    return membership?.role || null
  }

  /**
   * Fetch members of a specific workspace
   */
  const fetchMembers = async (workspaceId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`/workspaces/${workspaceId}/members`)
      
      // Backend returns { count, members: [...] }
      const memberList = response.data.members || []
      setMembers(memberList)
      
      return { success: true, data: memberList }
    } catch (err) {
      console.error('Fetch members error:', err)
      const errorMessage = err.response?.data?.message || 'Failed to load members'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Invite a user to workspace
   */
  const inviteMember = async (workspaceId, email, role = 'MEMBER') => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`/workspaces/${workspaceId}/invite`, {
        email,
        role
      })

      // Backend returns { message, member: { _id, user: {...}, role, createdAt } }
      const newMember = response.data.member

      // Add to local members state if it matches the expected format
      if (newMember && newMember._id) {
        setMembers(prev => [...prev, newMember])
      }

      return { success: true, member: newMember }
    } catch (err) {
      console.error('Invite member error:', err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to invite member'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Check if user can invite members (Owner or Admin)
   */
  const canInviteMembers = (workspace) => {
    const role = getUserRole(workspace)
    return role === 'OWNER' || role === 'ADMIN'
  }

  /**
   * Get available roles user can assign based on their role
   */
  const getAvailableRoles = (workspace) => {
    const role = getUserRole(workspace)
    
    if (role === 'OWNER') {
      return ['ADMIN', 'MEMBER']
    } else if (role === 'ADMIN') {
      return ['MEMBER']
    }
    
    return []
  }

  /**
   * Clear workspace context (on logout)
   */
  const clearWorkspaces = () => {
    setWorkspaces([])
    setSelectedWorkspace(null)
    setMembers([])
    setError(null)
    localStorage.removeItem('selectedWorkspace')
  }

  // Context value
  const value = {
    workspaces,
    selectedWorkspace,
    members,
    loading,
    error,
    fetchWorkspaces,
    createWorkspace,
    selectWorkspace,
    getUserRole,
    fetchMembers,
    inviteMember,
    canInviteMembers,
    getAvailableRoles,
    clearWorkspaces,
  }

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}
