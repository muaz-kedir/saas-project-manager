import { useParams } from 'react-router-dom'

/**
 * BoardHome Component
 * Placeholder page for individual board view
 * Kanban columns and tasks will be implemented later
 */
const BoardHome = () => {
  const { workspaceId, projectId, boardId } = useParams()

  return (
    <div className="space-y-6">
      {/* Board Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-text">
              Board View
            </h1>
            <p className="text-dark-muted mt-1">
              Board ID: <code className="bg-dark-border px-2 py-1 rounded text-sm">{boardId}</code>
            </p>
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
              Kanban Board Coming Soon!
            </h3>
            <p className="text-dark-muted text-sm">
              This board view will soon include:
            </p>
            <ul className="list-disc list-inside text-sm text-dark-muted mt-2 space-y-1">
              <li>Kanban columns (To Do, In Progress, Done)</li>
              <li>Drag and drop tasks between columns</li>
              <li>Create, edit, and delete tasks</li>
              <li>Task assignments and due dates</li>
              <li>Task descriptions and comments</li>
              <li>Real-time collaboration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardHome
