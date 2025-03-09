'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useChat } from '@/contexts/ChatContext';
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  MicrophoneIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useVirtualizer } from '@tanstack/react-virtual';

export default function ChatWindow() {
  const { data: session } = useSession();
  const {
    activeConversation,
    messages,
    sendMessage,
    isTyping,
    startTyping,
    stopTyping,
  } = useChat();
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualized list setup
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimated height of each message
    overscan: 5,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(() => {
    if (messageText.trim()) {
      sendMessage(messageText);
      setMessageText('');
    }
  }, [messageText, sendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    startTyping();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  }, [startTyping, stopTyping]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement file upload
      console.log('File selected:', file);
    }
  }, []);

  const handleVoiceRecord = useCallback(() => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  }, [isRecording]);

  const handleVideoCall = useCallback(() => {
    // TODO: Implement video call
    console.log('Video call requested');
  }, []);

  const renderMessage = useCallback((index: number) => {
    const message = messages[index];
    if (!message) return null;

    return (
      <div
        key={message.id || index}
        className={`flex ${
          message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'
        } mb-4`}
      >
        <div
          className={`max-w-[70%] rounded-lg p-3 ${
            message.senderId === session?.user?.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          {message.type === 'text' && <p>{message.content}</p>}
          {message.type === 'file' && (
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              📎 {message.content}
            </a>
          )}
          <span className="text-xs opacity-70 mt-1 block">
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
        </div>
      </div>
    );
  }, [messages, session?.user?.id]);

  if (!activeConversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10">
            <Image
              src="/default-avatar.png"
              alt="User"
              className="rounded-full"
              fill
            />
          </div>
          <div>
            <h3 className="font-semibold">Chat Name</h3>
            <p className="text-sm text-gray-500">
              {Object.values(isTyping).some(Boolean) ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        <button
          onClick={handleVideoCall}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <VideoCameraIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto p-4"
        style={{
          height: 'calc(100vh - 180px)',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {renderMessage(virtualRow.index)}
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end space-x-2">
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <textarea
              value={messageText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-3 bg-transparent focus:outline-none resize-none"
              rows={1}
            />
          </div>
          <div className="flex space-x-2">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                multiple
              />
              <PaperClipIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </label>
            <button
              onClick={handleVoiceRecord}
              className={`${
                isRecording ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MicrophoneIcon className="h-6 w-6" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 