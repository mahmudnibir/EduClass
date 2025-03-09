'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

interface ChatContextType {
  socket: Socket | null;
  activeConversation: string | null;
  setActiveConversation: (id: string | null) => void;
  messages: any[];
  sendMessage: (content: string, type?: string, fileUrl?: string) => void;
  isTyping: { [key: string]: boolean };
  startTyping: () => void;
  stopTyping: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState<{ [key: string]: boolean }>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection with optimized settings
  useEffect(() => {
    if (!socketRef.current) {
      const newSocket = io('/', {
        path: '/api/socket',
        addTrailingSlash: false,
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        forceNew: true,
        autoConnect: true,
        multiplex: false,
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
      });

      newSocket.on('new-message', (message) => {
        setMessages((prev) => {
          // Prevent duplicate messages
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      });

      newSocket.on('user-typing', (userId) => {
        setIsTyping((prev) => ({ ...prev, [userId]: true }));
      });

      newSocket.on('user-stop-typing', (userId) => {
        setIsTyping((prev) => ({ ...prev, [userId]: false }));
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      return () => {
        newSocket.close();
        socketRef.current = null;
      };
    }
  }, []);

  // Join/leave conversation with debounce
  useEffect(() => {
    if (socket && activeConversation) {
      const timeoutId = setTimeout(() => {
        socket.emit('join-conversation', activeConversation);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        socket.emit('leave-conversation', activeConversation);
      };
    }
  }, [socket, activeConversation]);

  // Memoized sendMessage function with optimistic updates
  const sendMessage = useCallback(
    (content: string, type: string = 'text', fileUrl?: string) => {
      if (socket && activeConversation && session?.user) {
        const message = {
          id: Date.now().toString(), // Temporary ID for optimistic update
          content,
          type,
          fileUrl,
          senderId: session.user.id,
          conversationId: activeConversation,
          createdAt: new Date(),
        };

        // Optimistic update
        setMessages((prev) => [...prev, message]);

        // Send to server
        socket.emit('send-message', message);
      }
    },
    [socket, activeConversation, session?.user]
  );

  // Memoized typing functions with debounce
  const startTyping = useCallback(() => {
    if (socket && activeConversation && session?.user) {
      socket.emit('typing', {
        conversationId: activeConversation,
        userId: session.user.id,
      });
    }
  }, [socket, activeConversation, session?.user]);

  const stopTyping = useCallback(() => {
    if (socket && activeConversation && session?.user) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop-typing', {
          conversationId: activeConversation,
          userId: session.user.id,
        });
      }, 1000);
    }
  }, [socket, activeConversation, session?.user]);

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      socket,
      activeConversation,
      setActiveConversation,
      messages,
      sendMessage,
      isTyping,
      startTyping,
      stopTyping,
    }),
    [socket, activeConversation, messages, sendMessage, isTyping, startTyping, stopTyping]
  );

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 