/**
 * LoadingSkeleton Component
 * Provides loading placeholders for better UX
 */

export const CardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="skeleton h-6 w-3/4 mb-4"></div>
    <div className="skeleton h-4 w-full mb-2"></div>
    <div className="skeleton h-4 w-5/6"></div>
  </div>
);

export const TaskSkeleton = () => (
  <div className="bg-dark-card rounded-lg p-4 mb-3 animate-pulse">
    <div className="skeleton h-5 w-4/5 mb-3"></div>
    <div className="flex items-center space-x-2">
      <div className="skeleton h-6 w-16 rounded-full"></div>
      <div className="skeleton h-6 w-20 rounded-full"></div>
    </div>
  </div>
);

export const ColumnSkeleton = () => (
  <div className="bg-dark-sidebar rounded-xl p-4 min-w-[320px]">
    <div className="skeleton h-6 w-32 mb-4"></div>
    <TaskSkeleton />
    <TaskSkeleton />
    <TaskSkeleton />
  </div>
);

export const BoardSkeleton = () => (
  <div className="flex space-x-4 overflow-x-auto pb-4">
    <ColumnSkeleton />
    <ColumnSkeleton />
    <ColumnSkeleton />
  </div>
);

export const ListSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
