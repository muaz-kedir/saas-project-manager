import { useParams } from 'react-router-dom'

/**
 * ProjectHome Component
 * Placeholder page for individual project view
 * Boards will be implemented later
 */
const ProjectHome = () => {
  const { workspaceId, projectId } = useParams()

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-text">
              Project View
            </h1>
            <p className="text-dark-muted mt-1">
              Project ID: <code className="bg-dark-border px-2 py-1 rounded text-sm">{projectId}</code>
            </p>
            <p className="text-dark-muted mt-1">
              Workspace ID: <code className="bg-dark-border px-2 py-1 rounded text-sm">{workspaceId}</code>
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="card bg-primary-500/10 border-primary-500/30">
        <div className="flex items-start space-x-3">
          <span className="text-3xl">🎯</span>
          <div>
            <h3 className="font-bold text-dark-text mb-1">
              Kanban Boards Coming Soon!
            </h3>
            <p className="text-dark-muted text-sm">
              This project view will soon include:
            </p>
            <ul className="list-disc list-inside text-sm text-dark-muted mt-2 space-y-1">
              <li>Kanban board with columns</li>
              <li>Drag and drop tasks</li>
              <li>Task details and assignments</li>
              <li>Project timeline</li>
              <li>Activity feed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectHome
