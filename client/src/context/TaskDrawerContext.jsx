import { createContext, useContext, useState, useCallback } from 'react'
import axios from '../api/axios'

const TaskDrawerContext = createContext()

export const useTaskDrawer = () => {
  const context = useContext(TaskDrawerContext)
  if (!context) {
    throw new Error('useTaskDrawer must be used within TaskDrawerProvider')
  }
  return context
}

export const TaskDrawerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [taskId, setTaskId] = useState(null)
  const [taskDetails, setTaskDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Open drawer with task ID
  const openDrawer = useCallback((id) => {
    setTaskId(id)
    setIsOpen(true)
    setError(null)
  }, [])

  // Close drawer
  const closeDrawer = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => {
      setTaskId(null)
      setTaskDetails(null)
      setError(null)
    }, 300) // Wait for animation
  }, [])

  // Fetch full task details
  const fetchTaskDetails = useCallback(async (id) => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const response = await axios.get(`/tasks/${id}`, {
        headers: { 'x-user-id': userId }
      })

      setTaskDetails(response.data.task)
    } catch (err) {
      console.error('Fetch task details error:', err)
      setError(err.response?.data?.message || 'Failed to load task details')
    } finally {
      setLoading(false)
    }
  }, [])

  // Update task details (optimistic)
  const updateTaskDetails = useCallback(async (id, updates) => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Optimistic update
      setTaskDetails(prev => prev ? { ...prev, ...updates } : null)

      const response = await axios.put(`/tasks/${id}`, updates, {
        headers: { 'x-user-id': userId }
      })

      setTaskDetails(response.data.task)
      return { success: true, data: response.data.task }
    } catch (err) {
      console.error('Update task error:', err)
      // Revert on error - refetch
      await fetchTaskDetails(id)
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to update task' 
      }
    }
  }, [fetchTaskDetails])

  // Add comment
  const addComment = useCallback(async (id, text) => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const response = await axios.post(`/tasks/${id}/comments`, 
        { text },
        { headers: { 'x-user-id': userId } }
      )

      // Refetch to get updated comments and activity
      await fetchTaskDetails(id)
      
      return { success: true, data: response.data.comment }
    } catch (err) {
      console.error('Add comment error:', err)
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to add comment' 
      }
    }
  }, [fetchTaskDetails])

  const value = {
    isOpen,
    taskId,
    taskDetails,
    loading,
    error,
    openDrawer,
    closeDrawer,
    fetchTaskDetails,
    updateTaskDetails,
    addComment
  }

  return (
    <TaskDrawerContext.Provider value={value}>
      {children}
    </TaskDrawerContext.Provider>
  )
}
