import { createContext, useContext, useState, useCallback } from 'react'
import axios from '../api/axios'

/**
 * ColumnContext
 * Manages column state and operations for Kanban boards
 */
const ColumnContext = createContext()

export const useColumn = () => {
  const context = useContext(ColumnContext)
  if (!context) {
    throw new Error('useColumn must be used within ColumnProvider')
  }
  return context
}

export const ColumnProvider = ({ children }) => {
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch all columns for a board
   * Sorted by order field
   */
  const fetchColumns = useCallback(async (boardId) => {
    if (!boardId) {
      console.error('Board ID is required to fetch columns')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const response = await axios.get(`/columns/board/${boardId}`, {
        headers: {
          'x-user-id': userId
        }
      })

      // Sort columns by order field
      const sortedColumns = columnsData.sort((a, b) => a.order - b.order)
      setColumns(sortedColumns)
    } catch (err) {
      console.error('Fetch columns error:', err)
      setError(err.response?.data?.message || 'Failed to fetch columns')
      setColumns([])
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Create a new column
   */
  const createColumn = async (name, boardId) => {
    if (!name || !boardId) {
      return { success: false, error: 'Name and board ID are required' }
    }

    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        return { success: false, error: 'User not authenticated' }
      }

      // Calculate order for new column (last position)
      const maxOrder = columns.length > 0 ? Math.max(...columns.map(c => c.order)) : -1
      const newOrder = maxOrder + 1

      const response = await axios.post(`/columns/board/${boardId}`, 
        { name, order: newOrder },
        {
          headers: {
            'x-user-id': userId
          }
        }
      )

      // Backend returns { message, column }
      const newColumn = response.data.column || response.data

      // Add new column to state and re-sort
      const newColumns = [...columns, newColumn].sort((a, b) => a.order - b.order)
      setColumns(newColumns)

      return { success: true, data: newColumn }
    } catch (err) {
      console.error('Create column error:', err)
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to create column' 
      }
    }
  }

  /**
   * Update a column
   */
  const updateColumn = async (columnId, updates) => {
    if (!columnId) {
      return { success: false, error: 'Column ID is required' }
    }

    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        return { success: false, error: 'User not authenticated' }
      }

      const response = await axios.put(`/columns/${columnId}`, 
        updates,
        {
          headers: {
            'x-user-id': userId
          }
        }
      )

      // Backend returns { message, column }
      const updatedColumn = response.data.column || response.data

      // Update column in state
      const updatedColumns = columns.map(col => 
        col._id === columnId ? updatedColumn : col
      ).sort((a, b) => a.order - b.order)
      
      setColumns(updatedColumns)

      return { success: true, data: updatedColumn }
    } catch (err) {
      console.error('Update column error:', err)
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to update column' 
      }
    }
  }

  /**
   * Delete a column (soft delete)
   */
  const deleteColumn = async (columnId) => {
    if (!columnId) {
      return { success: false, error: 'Column ID is required' }
    }

    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        return { success: false, error: 'User not authenticated' }
      }

      await axios.delete(`/columns/${columnId}`, {
        headers: {
          'x-user-id': userId
        }
      })

      // Remove column from state
      setColumns(columns.filter(col => col._id !== columnId))

      return { success: true }
    } catch (err) {
      console.error('Delete column error:', err)
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to delete column' 
      }
    }
  }

  const value = {
    columns,
    loading,
    error,
    fetchColumns,
    createColumn,
    updateColumn,
    deleteColumn
  }

  return (
    <ColumnContext.Provider value={value}>
      {children}
    </ColumnContext.Provider>
  )
}
