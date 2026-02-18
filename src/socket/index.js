const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

// Initialize Socket.io
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join workspace room
    socket.on('join:workspace', (workspaceId) => {
      socket.join(`workspace:${workspaceId}`);
      console.log(`👥 User ${socket.userId} joined workspace:${workspaceId}`);
    });

    // Leave workspace room
    socket.on('leave:workspace', (workspaceId) => {
      socket.leave(`workspace:${workspaceId}`);
      console.log(`👋 User ${socket.userId} left workspace:${workspaceId}`);
    });

    // Join board room
    socket.on('join:board', (boardId) => {
      socket.join(`board:${boardId}`);
      console.log(`📋 User ${socket.userId} joined board:${boardId}`);
    });

    // Leave board room
    socket.on('leave:board', (boardId) => {
      socket.leave(`board:${boardId}`);
      console.log(`📋 User ${socket.userId} left board:${boardId}`);
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

// Get Socket.io instance
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Emit events to specific rooms
const emitToWorkspace = (workspaceId, event, data) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit(event, data);
  }
};

const emitToBoard = (boardId, event, data) => {
  if (io) {
    io.to(`board:${boardId}`).emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  getIO,
  emitToWorkspace,
  emitToBoard
};
