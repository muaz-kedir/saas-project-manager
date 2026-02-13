import { createContext, useState, useContext, useCallback } from 'react'
import axios from '../api/axios'

// Create Board Context
const BoardContext = createContext(null)

// Custom hook to use board context
export const useBoard = () => {
  const context = useContext(BoardContext)
  if (!context) {
    throw new Error('useBoard must be used within BoardProvider')
  }
  return context
}

// Board Provider Component
export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch all boards for a project
   */
  const fetchBoards = useCallback(async (projectId) => {
    if (!projectId) return

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`/boards/project/${projectId}`)
      
      // Backend returns { count, boards: [...] }
      const boardList = response.data.boards || []
      setBoards(boardList)
      
      return { success: true, data: boardList }
    } catch (err) {
      console.error('Fetch boards error:', err)
      const errorMessage = err.response?.data?.message || 'Failed to load boards'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Create a new board
   */
  const createBoard = async (name, projectId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('/boards', {
        name,
        projectId
      })

      // Backend returns { message, board }
      const newBoard = response.data.board

      // Add to local state
      setBoards(prev => [newBoard, ...prev])

      return { success: true, board: newBoard }
    } catch (err) {
      console.error('Create board error:', err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to create board'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update a board
   */
  const updateBoard = async (boardId, name) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.patch(`/boards/${boardId}`, {
        name
      })

      // Backend returns { message, board }
      const updatedBoard = response.data.board

      // Update in local state
      setBoards(prev => 
        prev.map(b => b._id === boardId ? updatedBoard : b)
      )

      return { success: true, board: updatedBoard }
    } catch (err) {
      console.error('Update board error:', err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to update board'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Delete a board (soft delete)
   */
  const deleteBoard = async (boardId) => {
    setLoading(true)
    setError(null)

    try {
      await axios.delete(`/boards/${boardId}`)

      // Remove from local state
      setBoards(prev => prev.filter(b => b._id !== boardId))

      return { success: true }
    } catch (err) {
      console.error('Delete board error:', err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to delete board'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Clear boards (on project change or logout)
   */
  const clearBoards = () => {
    setBoards([])
    setError(null)
  }

  // Context value
  const value = {
    boards,
    loading,
    error,
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    clearBoards,
  }

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  )
}
