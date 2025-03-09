'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  PhoneIcon,
  UserGroupIcon,
  EllipsisHorizontalIcon,
  FaceSmileIcon,
  PhotoIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useVirtualizer } from '@tanstack/react-virtual';
import { generateAIResponse } from '@/lib/ai';

interface Message {
  id: string;
  content: string;
  type: string;
  senderId: string;
  createdAt: Date;
  isDraft?: boolean;
  metadata?: {
    quiz?: {
      question: string;
      options: string[];
      correctAnswer: number;
    };
    flashcard?: {
      front: string;
      back: string;
    };
  };
}

interface ChatProfile {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'typing';
  lastSeen?: Date;
}

export default function ChatInterface() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [draftMessage, setDraftMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [chatProfile, setChatProfile] = useState<ChatProfile>({
    id: 'ai-assistant',
    name: 'AI Study Assistant',
    avatar: '/ai-avatar.png',
    status: 'online',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Handle client-side initialization
  useEffect(() => {
    setMounted(true);
  }, []);

  // Virtualized list setup
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
    enabled: mounted,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: messageText,
        type: 'text',
        senderId: session?.user?.id || 'user',
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessageText('');
      setIsTyping(true);
      setChatProfile((prev) => ({ ...prev, status: 'typing' }));

      try {
        const aiResponse = await generateAIResponse(messageText);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse.content,
          type: aiResponse.type,
          senderId: 'ai',
          createdAt: new Date(),
          metadata: aiResponse.metadata,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error generating AI response:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'I apologize, but I encountered an error. Please try again.',
          type: 'text',
          senderId: 'ai',
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
        setChatProfile((prev) => ({ ...prev, status: 'online' }));
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    setDraftMessage(e.target.value);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate file upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API call
      setTimeout(() => {
        const newMessage: Message = {
          id: Date.now().toString(),
          content: `Uploaded file: ${file.name}`,
          type: 'file',
          senderId: session?.user?.id || 'user',
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // TODO: Implement voice message upload
        console.log('Voice message recorded:', audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const startVideoCall = () => {
    setIsVideoCall(true);
    // TODO: Implement video call
    console.log('Starting video call...');
  };

  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const editMessage = (messageId: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content: newContent } : msg
      )
    );
  };

  const renderMessage = (index: number) => {
    const message = messages[index];
    if (!message) return null;

    return (
      <div
        key={message.id}
        className={`flex ${
          message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'
        } mb-4 group`}
      >
        <div className="relative">
          {message.senderId !== session?.user?.id && (
            <div className="absolute -left-12 top-0">
              <div className="relative h-8 w-8">
                <Image
                  src={chatProfile.avatar}
                  alt={chatProfile.name}
                  className="rounded-full"
                  fill
                />
              </div>
            </div>
          )}
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.senderId === session?.user?.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
          >
            {message.type === 'text' && <p className="whitespace-pre-wrap">{message.content}</p>}
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
            {message.type === 'quiz' && message.metadata?.quiz && (
              <div className="space-y-4">
                <p className="font-semibold">{message.metadata.quiz.question}</p>
                <div className="space-y-2">
                  {message.metadata.quiz.options.map((option, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-2 rounded hover:bg-blue-600 transition-colors"
                      onClick={() => {
                        // Handle quiz answer
                        alert(
                          index === message.metadata?.quiz?.correctAnswer
                            ? 'Correct!'
                            : 'Incorrect. Try again!'
                        );
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {message.type === 'flashcard' && message.metadata?.flashcard && (
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
                  <p className="font-semibold">{message.metadata.flashcard.front}</p>
                </div>
                <button
                  className="text-sm text-blue-400 hover:text-blue-300"
                  onClick={() => {
                    // Toggle flashcard answer
                    alert(message.metadata?.flashcard?.back);
                  }}
                >
                  Show Answer
                </button>
              </div>
            )}
            <span className="text-xs opacity-70 mt-1 block">
              {new Date(message.createdAt).toLocaleTimeString()}
            </span>
          </div>
          {message.senderId === session?.user?.id && (
            <div className="absolute right-0 top-0 hidden group-hover:flex space-x-1">
              <button
                onClick={() => deleteMessage(message.id)}
                className="p-1 text-red-500 hover:text-red-600"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => editMessage(message.id, message.content)}
                className="p-1 text-blue-500 hover:text-blue-600"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!mounted) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10">
            <Image
              src={chatProfile.avatar}
              alt={chatProfile.name}
              className="rounded-full"
              fill
            />
            <div
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${
                chatProfile.status === 'online'
                  ? 'bg-green-500'
                  : chatProfile.status === 'typing'
                  ? 'bg-yellow-500'
                  : 'bg-gray-500'
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold">{chatProfile.name}</h3>
            <p className="text-sm text-gray-500">
              {chatProfile.status === 'typing'
                ? 'Typing...'
                : chatProfile.status === 'online'
                ? 'Online'
                : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={startVideoCall}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <VideoCameraIcon className="h-6 w-6" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <PhoneIcon className="h-6 w-6" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <EllipsisHorizontalIcon className="h-6 w-6" />
          </button>
        </div>
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
            <div className="relative">
              <button
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                <PaperClipIcon className="h-6 w-6" />
              </button>
              {showAttachmentMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
                  <button className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <PhotoIcon className="h-5 w-5" />
                    <span>Photo</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <DocumentIcon className="h-5 w-5" />
                    <span>Document</span>
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                <FaceSmileIcon className="h-6 w-6" />
              </button>
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2"
                >
                  {/* Add emoji picker component here */}
                </div>
              )}
            </div>
            <button
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              className={`p-2 ${
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