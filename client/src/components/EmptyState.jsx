/**
 * EmptyState Component
 * Beautiful empty states with illustrations
 */

const EmptyState = ({ 
  icon = '📭', 
  title = 'Nothing here yet', 
  description = 'Get started by creating something new',
  action,
  actionLabel = 'Create'
}) => {
  return (
    <div className="empty-state fade-in">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && (
        <button onClick={action} className="btn btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

// Preset empty states
export const EmptyWorkspaces = ({ onCreate }) => (
  <EmptyState
    icon="🏢"
    title="No workspaces yet"
    description="Create your first workspace to start organizing your projects and collaborating with your team."
    action={onCreate}
    actionLabel="Create Workspace"
  />
);

export const EmptyProjects = ({ onCreate }) => (
  <EmptyState
    icon="📁"
    title="No projects yet"
    description="Projects help you organize related boards and tasks. Create one to get started."
    action={onCreate}
    actionLabel="Create Project"
  />
);

export const EmptyBoards = ({ onCreate }) => (
  <EmptyState
    icon="📋"
    title="No boards yet"
    description="Boards are where your team collaborates on tasks. Create your first board now."
    action={onCreate}
    actionLabel="Create Board"
  />
);

export const EmptyTasks = ({ onCreate }) => (
  <EmptyState
    icon="✨"
    title="No tasks yet"
    description="Add your first task to start tracking work and collaborating with your team."
    action={onCreate}
    actionLabel="Add Task"
  />
);

export const EmptyMembers = ({ onInvite }) => (
  <EmptyState
    icon="👥"
    title="No team members yet"
    description="Invite team members to collaborate on this workspace."
    action={onInvite}
    actionLabel="Invite Member"
  />
);

export const EmptyComments = () => (
  <EmptyState
    icon="💬"
    title="No comments yet"
    description="Start a conversation about this task."
  />
);

export const EmptyActivity = () => (
  <EmptyState
    icon="📊"
    title="No activity yet"
    description="Activity will appear here as team members work on tasks."
  />
);
