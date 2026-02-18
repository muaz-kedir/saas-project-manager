# Real-Time Collaboration Guide

## Overview
Your SaaS Project Manager now supports real-time collaboration using Socket.io. Multiple users can work on the same board simultaneously and see updates instantly.

## Features

### ✅ Real-Time Updates
- **Task Creation**: See new tasks appear instantly
- **Task Movement**: Watch tasks move between columns in real-time
- **Task Updates**: See edits to task details immediately
- **Task Deletion**: Tasks disappear for all users instantly
- **Comments**: New comments appear in real-time

### 🔒 Security
- **JWT Authentication**: Socket connections require valid JWT tokens
- **Room-Based Isolation**: Users only receive updates for boards they're viewing
- **Tenant Safety**: Workspace-level isolation ensures data privacy

## Architecture

### Backend (Socket.io Server)
```
src/socket/index.js
├── initializeSocket()    # Initialize Socket.io with HTTP server
├── getIO()              # Get Socket.io instance
├── emitToWorkspace()    # Emit to workspace room
└── emitToBoard()        # Emit to board room
```

### Frontend (Socket.io Client)
```
client/src/context/SocketContext.jsx
├── SocketProvider       # Provides socket connection
├── useSocket()          # Hook to access socket
├── joinBoard()          # Join board room
├── leaveBoard()         # Leave board room
├── on()                 # Subscribe to events
└── off()                # Unsubscribe from events
```

## Socket Events

### Server → Client Events

#### `task:created`
Emitted when a new task is created.
```javascript
{
  task: {
    _id: "...",
    title: "New Task",
    column: "...",
    // ... full task object
  },
  columnId: "..."
}
```

#### `task:updated`
Emitted when a task is edited.
```javascript
{
  task: {
    _id: "...",
    title: "Updated Title",
    // ... full task object
  },
  changes: [
    { field: 'title', oldValue: '...', newValue: '...' }
  ]
}
```

#### `task:moved`
Emitted when a task is moved to a different column.
```javascript
{
  task: {
    _id: "...",
    column: "new-column-id",
    order: 2,
    // ... full task object
  },
  oldColumnId: "...",
  newColumnId: "...",
  order: 2
}
```

#### `task:deleted`
Emitted when a task is deleted.
```javascript
{
  taskId: "...",
  columnId: "..."
}
```

#### `comment:added`
Emitted when a comment is added to a task.
```javascript
{
  taskId: "...",
  comment: {
    _id: "...",
    text: "Great work!",
    author: {
      _id: "...",
      name: "John Doe",
      email: "john@example.com"
    },
    createdAt: "2026-02-18T..."
  }
}
```

### Client → Server Events

#### `join:board`
Join a board room to receive updates.
```javascript
socket.emit('join:board', boardId);
```

#### `leave:board`
Leave a board room.
```javascript
socket.emit('leave:board', boardId);
```

#### `join:workspace`
Join a workspace room (for future workspace-level updates).
```javascript
socket.emit('join:workspace', workspaceId);
```

#### `leave:workspace`
Leave a workspace room.
```javascript
socket.emit('leave:workspace', workspaceId);
```

## Implementation Details

### Backend Integration

#### 1. Initialize Socket.io in Server
```javascript
// src/server.js
const { initializeSocket } = require('./socket');

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

initializeSocket(server);
```

#### 2. Emit Events from Controllers
```javascript
// src/controllers/task.controller.js
const { emitToBoard } = require('../socket');

// After creating a task
const column = await Column.findById(columnId).populate('board');
if (column && column.board) {
  emitToBoard(column.board._id, 'task:created', {
    task,
    columnId
  });
}
```

### Frontend Integration

#### 1. Wrap App with SocketProvider
```jsx
// client/src/App.jsx
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        {/* Rest of app */}
      </SocketProvider>
    </AuthProvider>
  );
}
```

#### 2. Use Socket in Components
```jsx
// client/src/pages/BoardHome.jsx
import { useSocket } from '../context/SocketContext';

const BoardHome = () => {
  const { joinBoard, leaveBoard, on, off } = useSocket();
  const { boardId } = useParams();

  useEffect(() => {
    if (!boardId) return;

    // Join board room
    joinBoard(boardId);

    // Listen for events
    const handleTaskCreated = ({ task, columnId }) => {
      console.log('Task created:', task);
      addTask(task);
    };

    on('task:created', handleTaskCreated);

    // Cleanup
    return () => {
      off('task:created', handleTaskCreated);
      leaveBoard(boardId);
    };
  }, [boardId]);
};
```

## Room Strategy

### Board Rooms
- Format: `board:{boardId}`
- Purpose: Real-time updates for specific boards
- Users: Anyone viewing the board
- Events: task:created, task:updated, task:moved, task:deleted, comment:added

### Workspace Rooms
- Format: `workspace:{workspaceId}`
- Purpose: Workspace-level updates (future use)
- Users: All workspace members
- Events: member:added, member:removed, project:created, etc.

## Testing Real-Time Features

### Test with Multiple Browser Windows

1. **Open two browser windows:**
   ```
   Window 1: http://localhost:3000
   Window 2: http://localhost:3000 (incognito)
   ```

2. **Login as different users in each window**

3. **Navigate to the same board in both windows**

4. **Test scenarios:**
   - Create a task in Window 1 → See it appear in Window 2
   - Move a task in Window 2 → See it move in Window 1
   - Edit a task in Window 1 → See changes in Window 2
   - Add a comment in Window 2 → See it in Window 1
   - Delete a task in Window 1 → See it disappear in Window 2

### Check Console Logs

**Server console:**
```
✅ Socket.io initialized
✅ User connected: 507f1f77bcf86cd799439011
👥 User 507f1f77bcf86cd799439011 joined board:507f191e810c19729de860ea
```

**Client console:**
```
✅ Socket connected
📋 Joined board:507f191e810c19729de860ea
🔔 Task created: { _id: '...', title: 'New Task', ... }
```

## Performance Considerations

### Connection Management
- Socket connections are automatically managed
- Connections are established when user logs in
- Connections are closed when user logs out
- Reconnection is automatic on network issues

### Room Management
- Users automatically join board rooms when viewing a board
- Users automatically leave rooms when navigating away
- Rooms are cleaned up when empty

### Event Optimization
- Only users in the same board room receive updates
- Events include only necessary data
- Database queries are optimized to fetch board IDs

## Troubleshooting

### Socket Not Connecting

**Check environment variables:**
```env
# client/.env
VITE_API_URL=http://localhost:5000
```

**Check CORS settings:**
```javascript
// src/socket/index.js
cors: {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}
```

### Events Not Received

**Verify room membership:**
```javascript
// Check if user joined the room
console.log('Joined board:', boardId);
```

**Check event listeners:**
```javascript
// Ensure listeners are registered
on('task:created', handleTaskCreated);
```

**Check server logs:**
```
👥 User {userId} joined board:{boardId}
```

### Updates Not Showing

**Check TaskContext methods:**
- Ensure `addTask`, `updateTask`, `deleteTask` are implemented
- Verify state updates trigger re-renders

**Check component dependencies:**
```javascript
useEffect(() => {
  // ...
}, [boardId, addTask, updateTask, deleteTask]); // Include all dependencies
```

## Production Deployment

### Environment Variables

**Backend (.env):**
```env
CLIENT_URL=https://your-domain.com
```

**Frontend (.env):**
```env
VITE_API_URL=https://api.your-domain.com
```

### WebSocket Configuration

For production, ensure your hosting platform supports WebSockets:

**Render.com:**
- WebSockets are supported by default
- No additional configuration needed

**Heroku:**
- WebSockets are supported
- Ensure dyno type supports WebSockets

**AWS/DigitalOcean:**
- Configure load balancer for WebSocket support
- Enable sticky sessions

## Future Enhancements

- [ ] Presence indicators (who's viewing the board)
- [ ] Typing indicators for comments
- [ ] Cursor tracking for collaborative editing
- [ ] Conflict resolution for simultaneous edits
- [ ] Offline support with sync on reconnect
- [ ] Real-time notifications
- [ ] Activity feed updates
- [ ] Member status (online/offline)

## Security Best Practices

1. **Always authenticate socket connections**
   - Verify JWT tokens on connection
   - Reject unauthenticated connections

2. **Validate room access**
   - Check user permissions before joining rooms
   - Verify workspace membership

3. **Sanitize event data**
   - Validate all incoming data
   - Prevent XSS in real-time messages

4. **Rate limiting**
   - Implement rate limits for socket events
   - Prevent spam and abuse

5. **Monitor connections**
   - Log connection attempts
   - Track active connections
   - Alert on suspicious activity
