'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChatContext } from '@/contexts/ChatContext';
import {
  PaperAirplaneIcon,
  MicrophoneIcon,
  PhotoIcon,
  FaceSmileIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import '@/styles/cursor.css';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage } = useChatContext();

  // Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Typing indicator effect
  useEffect(() => {
    if (input) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [input]);

  const handleSendMessage = async () => {
    if (!input.trim() || isSending) return;

    setIsSending(true);

    try {
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        content: input.trim(),
        sender: 'user',
        timestamp: new Date().toISOString(),
      };
      addMessage(userMessage);
      setInput('');

      // Simulate AI response
      setTimeout(() => {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          content: 'I received your message and will help you with that!',
          sender: 'ai',
          timestamp: new Date().toISOString(),
        };
        addMessage(aiMessage);
        setIsSending(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 cursor-default">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 hover-glow ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 dark:text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap cursor-text select-text">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block cursor-default">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t dark:border-gray-700 p-4">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full p-3 pr-32 rounded-lg border dark:border-gray-700 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none cursor-text"
            rows={1}
          />
          <div className="absolute right-2 bottom-2 flex items-center space-x-2">
            <button className="icon-hover cursor-pointer">
              <PaperClipIcon className="w-5 h-5" />
            </button>
            <button className="icon-hover cursor-pointer">
              <PhotoIcon className="w-5 h-5" />
            </button>
            <button className="icon-hover cursor-pointer">
              <FaceSmileIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`icon-hover cursor-pointer ${isRecording ? 'text-red-500' : ''}`}
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isSending}
              className={`p-2 rounded-full button-hover ${
                input.trim() && !isSending
                  ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'
              }`}
            >
              <PaperAirplaneIcon className={`w-5 h-5 ${isSending ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>
        {isTyping && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 cursor-default">
            Typing...
          </div>
        )}
      </div>
    </div>
  );
} 