import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'
import ProjectBoards from './ProjectBoards'

/**
 * ProjectHome Component
 * Main project page with tabs for different views
 */
const ProjectHome = () => {
  const { projectId } = useParams()
  const { projects, fetchProjects } = useProject()
  const [activeTab, setActiveTab] = useState('boards')
  const [project, setProject] = useState(null)

  // Find current project
  useEffect(() => {
    const currentProject = projects.find(p => p._id === projectId)
    if (currentProject) {
      setProject(currentProject)
    } else if (projectId) {
      // If project not in context, fetch it
      fetchProjects()
    }
  }, [projectId, projects, fetchProjects])

  // Tab configuration
  const tabs = [
    { id: 'boards', label: 'Boards', icon: '📋' },
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'activity', label: 'Activity', icon: '📈' }
  ]

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-text">
              {project ? project.name : 'Loading...'}
            </h1>
            <p className="text-dark-muted mt-1">
              Manage boards and track project progress
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-6 border-b border-dark-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-primary-500'
                  : 'text-dark-muted hover:text-dark-text'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'boards' && <ProjectBoards />}
        
        {activeTab === 'overview' && (
          <div className="card bg-primary-500/10 border-primary-500/30">
            <div className="flex items-start space-x-3">
              <span className="text-3xl">📊</span>
              <div>
                <h3 className="font-bold text-dark-text mb-1">
                  Project Overview Coming Soon!
                </h3>
                <p className="text-dark-muted text-sm">
                  This section will include project statistics, progress tracking, and team performance metrics.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="card bg-primary-500/10 border-primary-500/30">
            <div className="flex items-start space-x-3">
              <span className="text-3xl">📈</span>
              <div>
                <h3 className="font-bold text-dark-text mb-1">
                  Activity Feed Coming Soon!
                </h3>
                <p className="text-dark-muted text-sm">
                  This section will show recent activities, updates, and changes made to the project.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectHome
