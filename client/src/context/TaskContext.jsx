import { createContext, useContext, useState, useCallback } from 'react'
import axios from '../api/axios'

/**
 * TaskContext
 * Manages task state and operations for Kanban columns
 */
const TaskContext = createContext()

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTask must be used within TaskProvider')
  }
  return context
}

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState({}) // Tasks grouped by columnId
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch all tasks for a column
   * Sorted by order field
   */
  const fetchTasks = useCallback(async (columnId) => {
    if (!columnId) {
      console.error('Column ID is required to fetch tasks')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const response = await axios.get(`/tasks/column/${columnId}`, {
        headers: {
          'x-user-id': userId
        }
      })

      // Backend returns { count, tasks }
      const tasksData = response.data.tasks || response.data
      
      // Sort tasks by order field
      const sortedTasks = tasksData.sort((a, b) => a.order - b.order)
      
      // Store tasks grouped by columnId
      setTasks(prev => ({
        ...prev,
        [columnId]: sortedTasks
      }))
    } catch (err) {
      console.error('Fetch tasks error:', err)
      setError(err.response?.data?.message || 'Failed to fetch tasks')
      setTasks(prev => ({
        ...prev,
        [columnId]: []
      }))
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Create a new task
   */
  const createTask = async (title, columnId) => {
    if (!title || !columnId) {
      return { success: false, error: 'Title and column ID are required' }
    }

    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        return { success: false, error: 'User not authenticated' }
      }

      // Calculate order for new task (last position in column)
      const columnTasks = tasks[columnId] || []
      const maxOrder = columnTasks.length > 0 ? Math.max(...columnTasks.map(t => t.order)) : -1
      const newOrder = maxOrder + 1

      const response = await axios.post(`/tasks/column/${columnId}`, 
        { title, order: newOrder },
        {
          headers: {
            'x-user-id': userId
          }
        }
      )

      // Backend returns { message, task }
      const newTask = response.data.task || response.data

      // Add new task to state and re-sort
      const updatedTasks = [...columnTasks, newTask].sort((a, b) => a.order - b.order)
      setTasks(prev => ({
        ...prev,
        [columnId]: updatedTasks
      }))

      return { success: true, data: newTask }
    } catch (err) {
      console.error('Create task error:', err)
      return { 
        success: false, 
        error: err.response?.data?.message || err.response?.data?.error || 'Failed to create task' 
      }
    }
  }

  /**
   * Update a task
   */
  const updateTask = async (taskId, updates, columnId) => {
    if (!taskId) {
      return { success: false, error: 'Task ID is required' }
    }

    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        return { success: false, error: 'User not authenticated' }
      }

      const response = await axios.put(`/tasks/${taskId}`, 
        updates,
        {
          headers: {
            'x-user-id': userId
          }
        }
      )

      // Backend returns { message, task }
      const updatedTask = response.data.task || response.data

      // Update task in state
      if (columnId && tasks[columnId]) {
        const updatedTasks = tasks[columnId].map(task => 
          task._id === taskId ? updatedTask : task
        ).sort((a, b) => a.order - b.order)
        
        setTasks(prev => ({
          ...prev,
          [columnId]: updatedTasks
        }))
      }

      return { success: true, data: updatedTask }
    } catch (err) {
      console.error('Update task error:', err)
      return { 
        success: false, 
        error: err.response?.data?.message || err.response?.data?.error || 'Failed to update task' 
      }
    }
  }

  /**
   * Delete a task (soft delete)
   */
  const deleteTask = async (taskId, columnId) => {
    if (!taskId) {
      return { success: false, error: 'Task ID is required' }
    }

    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        return { success: false, error: 'User not authenticated' }
      }

      await axios.delete(`/tasks/${taskId}`, {
        headers: {
          'x-user-id': userId
        }
      })

      // Remove task from state
      if (columnId && tasks[columnId]) {
        setTasks(prev => ({
          ...prev,
          [columnId]: prev[columnId].filter(task => task._id !== taskId)
        }))
      }

      return { success: true }
    } catch (err) {
      console.error('Delete task error:', err)
      return { 
        success: false, 
        error: err.response?.data?.message || err.response?.data?.error || 'Failed to delete task' 
      }
    }
  }

  /**
   * Get tasks for a specific column
   */
  const getColumnTasks = (columnId) => {
    return tasks[columnId] || []
  }

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getColumnTasks
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}
