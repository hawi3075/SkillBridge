import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  useEffect(() => {
    let socketInstance = null;

    if (isAuthenticated && token) {
      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      socketInstance = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling']
      });

      socketInstance.on('connect', () => {
        // console.log('⚡ Socket connected:', socketInstance.id);
      });

      socketInstance.on('user_status_change', (data) => {
        if (data.onlineUserIds) {
          setOnlineUserIds(data.onlineUserIds);
        }
      });

      setSocket(socketInstance);
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [token, isAuthenticated]);

  const isUserOnline = (userId) => {
    return onlineUserIds.includes(userId);
  };

  return (
    <SocketContext.Provider value={{ socket, onlineUserIds, isUserOnline }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext) || {};
};
