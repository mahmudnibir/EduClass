'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  attachments?: Array<{
    type: string;
    url: string;
    name: string;
  }>;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you with your studies today?',
      sender: 'ai',
      timestamp: new Date().toISOString(),
    },
  ]);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        content: 'Hello! How can I help you with your studies today?',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
} 