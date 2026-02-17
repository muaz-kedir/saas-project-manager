import { useEffect, useState, useRef } from 'react'
import { useTaskDrawer } from '../context/TaskDrawerContext'
import { useWorkspace } from '../context/WorkspaceContext'
import TaskComments from './TaskComments'
import TaskActivity from './TaskActivity'

/**
 * TaskDrawer Component
 * Right-side drawer for viewing and editing task details
 */
const TaskDrawer = () => {
  const { 
    isOpen, 
    taskId, 
    taskDetails, 
    loading, 
    error,
    closeDrawer, 
    fetchTaskDetails,
    updateTaskDetails,
    addComment
  } = useTaskDrawer()

  const { selectedWorkspace, getUserRole } = useWorkspace()
  const [activeTab, setActiveTab] = useState('details')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editedDescription, setEditedDescription] = useState('')
  const titleInputRef = useRef(null)

  const role = selectedWorkspace ? getUserRole(selectedWorkspace) : null
  const canEdit = role === 'OWNER' || role === 'ADMIN' || role === 'MEMBER'

  // Fetch task details when drawer opens
  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails(taskId)
    }
  }, [isOpen, taskId, fetchTaskDetails])

  // Focus title input when editing
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [isEditingTitle])

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeDrawer()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, closeDrawer])

  // Handle title edit
  const handleTitleEdit = () => {
    if (!canEdit || !taskDetails) return
    setEditedTitle(taskDetails.title)
    setIsEditingTitle(true)
  }

  const handleTitleSave = async () => {
    if (!editedTitle.trim() || editedTitle === taskDetails.title) {
      setIsEditingTitle(false)
      return
    }

    const result = await updateTaskDetails(taskId, { title: editedTitle.trim() })
    if (result.success) {
      setIsEditingTitle(false)
    }
  }

  const handleTitleCancel = () => {
    setIsEditingTitle(false)
    setEditedTitle('')
  }

  // Handle description edit
  const handleDescriptionEdit = () => {
    if (!canEdit) return
    setEditedDescription(taskDetails?.description || '')
    setIsEditingDescription(true)
  }

  const handleDescriptionSave = async () => {
    const result = await updateTaskDetails(taskId, { description: editedDescription })
    if (result.success) {
      setIsEditingDescription(false)
    }
  }

  const handleDescriptionCancel = () => {
    setIsEditingDescription(false)
    setEditedDescription('')
  }

  // Handle due date change
  const handleDueDateChange = async (e) => {
    const newDate = e.target.value || null
    await updateTaskDetails(taskId, { dueDate: newDate })
  }

  // Handle label management
  const handleAddLabel = async () => {
    const label = prompt('Enter label name:')
    if (!label) return

    const currentLabels = taskDetails?.labels || []
    if (currentLabels.includes(label)) {
      alert('Label already exists')
      return
    }

    await updateTaskDetails(taskId, { labels: [...currentLabels, label] })
  }

  const handleRemoveLabel = async (labelToRemove) => {
    const currentLabels = taskDetails?.labels || []
    await updateTaskDetails(taskId, { 
      labels: currentLabels.filter(l => l !== labelToRemove) 
    })
  }

  // Handle comment add
  const handleAddComment = async (text) => {
    return await addComment(taskId, text)
  }

  if (!isOpen) return null

  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
  }

  const isOverdue = (date) => {
    if (!date) return false
    return new Date(date) < new Date() && new Date(date).toDateString() !== new Date().toDateString()
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header - Sticky */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <div className="space-y-2">
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleSave()
                      if (e.key === 'Escape') handleTitleCancel()
                    }}
                    className="w-full text-xl font-semibold text-gray-900 border border-primary-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleTitleSave}
                      className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleTitleCancel}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <h2 
                  className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-primary-600 transition-colors"
                  onClick={handleTitleEdit}
                  title={canEdit ? "Click to edit" : ""}
                >
                  {taskDetails?.title || 'Loading...'}
                </h2>
              )}
              {taskDetails?.column && (
                <p className="text-sm text-gray-500 mt-1">
                  in <span className="font-medium">{taskDetails.column.name}</span>
                </p>
              )}
            </div>
            <button
              onClick={closeDrawer}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close (ESC)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {loading && !taskDetails ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">
              <p>{error}</p>
              <button
                onClick={() => fetchTaskDetails(taskId)}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Retry
              </button>
            </div>
          ) : taskDetails ? (
            <div className="p-6 space-y-6">
              {/* Tabs */}
              <div className="flex gap-4 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 px-1 text-sm font-medium transition-colors ${
                    activeTab === 'details'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`pb-2 px-1 text-sm font-medium transition-colors ${
                    activeTab === 'comments'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Comments {taskDetails.comments?.length > 0 && `(${taskDetails.comments.length})`}
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`pb-2 px-1 text-sm font-medium transition-colors ${
                    activeTab === 'activity'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Activity
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        Description
                      </label>
                    </div>
                    {isEditingDescription ? (
                      <div className="space-y-2">
                        <textarea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                          placeholder="Add a description..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleDescriptionSave}
                            className="px-3 py-1.5 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleDescriptionCancel}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={handleDescriptionEdit}
                        className={`min-h-[80px] px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 whitespace-pre-wrap ${
                          canEdit ? 'cursor-pointer hover:border-primary-300 hover:bg-gray-50' : ''
                        }`}
                      >
                        {taskDetails.description || (
                          <span className="text-gray-400 italic">
                            {canEdit ? 'Click to add description...' : 'No description'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Assignee */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Assignee
                    </label>
                    {taskDetails.assignedTo ? (
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                          {taskDetails.assignedTo.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{taskDetails.assignedTo.name}</p>
                          <p className="text-xs text-gray-500">{taskDetails.assignedTo.email}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic px-3 py-2">Not assigned</p>
                    )}
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due Date
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={formatDate(taskDetails.dueDate)}
                        onChange={handleDueDateChange}
                        disabled={!canEdit}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                      {taskDetails.dueDate && isOverdue(taskDetails.dueDate) && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Labels */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Labels
                      </label>
                      {canEdit && (
                        <button
                          onClick={handleAddLabel}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {taskDetails.labels && taskDetails.labels.length > 0 ? (
                        taskDetails.labels.map((label, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded"
                          >
                            {label}
                            {canEdit && (
                              <button
                                onClick={() => handleRemoveLabel(label)}
                                className="hover:text-primary-900"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 italic">No labels</p>
                      )}
                    </div>
                  </div>

                  {/* Attachments Placeholder */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Attachments
                    </label>
                    <div className="px-3 py-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-500">Coming soon</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comments' && (
                <TaskComments
                  comments={taskDetails.comments || []}
                  onAddComment={handleAddComment}
                  currentUserId={localStorage.getItem('userId')}
                />
              )}

              {activeTab === 'activity' && (
                <TaskActivity activity={taskDetails.activity || []} />
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default TaskDrawer
