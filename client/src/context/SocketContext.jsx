import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      // Disconnect if not authenticated
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Create socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, token]);

  // Join workspace room
  const joinWorkspace = (workspaceId) => {
    if (socket && connected) {
      socket.emit('join:workspace', workspaceId);
      console.log(`👥 Joined workspace:${workspaceId}`);
    }
  };

  // Leave workspace room
  const leaveWorkspace = (workspaceId) => {
    if (socket && connected) {
      socket.emit('leave:workspace', workspaceId);
      console.log(`👋 Left workspace:${workspaceId}`);
    }
  };

  // Join board room
  const joinBoard = (boardId) => {
    if (socket && connected) {
      socket.emit('join:board', boardId);
      console.log(`📋 Joined board:${boardId}`);
    }
  };

  // Leave board room
  const leaveBoard = (boardId) => {
    if (socket && connected) {
      socket.emit('leave:board', boardId);
      console.log(`📋 Left board:${boardId}`);
    }
  };

  // Subscribe to event
  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  // Unsubscribe from event
  const off = (event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  };

  const value = {
    socket,
    connected,
    joinWorkspace,
    leaveWorkspace,
    joinBoard,
    leaveBoard,
    on,
    off
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
