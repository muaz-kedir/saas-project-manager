import { createContext, useState, useContext, useCallback } from 'react'
import axios from '../api/axios'

// Create Project Context
const ProjectContext = createContext(null)

// Custom hook to use project context
export const useProject = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider')
  }
  return context
}

// Project Provider Component
export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch all projects for a workspace
   */
  const fetchProjects = useCallback(async (workspaceId) => {
    if (!workspaceId) return

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`/projects/workspace/${workspaceId}`)
      
      // Backend returns { count, projects: [...] }
      const projectList = response.data.projects || []
      setProjects(projectList)
      
      return { success: true, data: projectList }
    } catch (err) {
      console.error('Fetch projects error:', err)
      const errorMessage = err.response?.data?.message || 'Failed to load projects'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Create a new project
   */
  const createProject = async (name, workspaceId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('/projects', {
        name,
        workspaceId
      })

      // Backend returns { message, project }
      const newProject = response.data.project

      // Add to local state
      setProjects(prev => [newProject, ...prev])

      return { success: true, project: newProject }
    } catch (err) {
      console.error('Create project error:', err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to create project'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update a project
   */
  const updateProject = async (projectId, name) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.patch(`/projects/${projectId}`, {
        name
      })

      // Backend returns { message, project }
      const updatedProject = response.data.project

      // Update in local state
      setProjects(prev => 
        prev.map(p => p._id === projectId ? updatedProject : p)
      )

      return { success: true, project: updatedProject }
    } catch (err) {
      console.error('Update project error:', err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to update project'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Delete a project (soft delete)
   */
  const deleteProject = async (projectId) => {
    setLoading(true)
    setError(null)

    try {
      await axios.delete(`/projects/${projectId}`)

      // Remove from local state
      setProjects(prev => prev.filter(p => p._id !== projectId))

      return { success: true }
    } catch (err) {
      console.error('Delete project error:', err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to delete project'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Clear projects (on workspace change or logout)
   */
  const clearProjects = () => {
    setProjects([])
    setError(null)
  }

  // Context value
  const value = {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    clearProjects,
  }

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}
