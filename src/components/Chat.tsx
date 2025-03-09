'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';
import { format } from 'date-fns';

interface Message {
  content: string;
  userId: string;
  createdAt: Date;
}

interface ChatProps {
  roomId: string;
  groupName: string;
}

export default function Chat({ roomId, groupName }: ChatProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    let socketInstance: Socket;

    const initSocket = async () => {
      try {
        setIsConnecting(true);
        setConnectionError(false);
        
        await fetch('/api/socket');
        socketInstance = io({
          path: '/api/socket',
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketInstance.on('connect', () => {
          console.log('Connected to Socket.IO');
          setIsConnecting(false);
          socketInstance.emit('join-room', roomId);
        });

        socketInstance.on('connect_error', (error) => {
          console.error('Connection error:', error);
          setConnectionError(true);
          setIsConnecting(false);
        });

        socketInstance.on('new-message', (message: Message) => {
          setMessages((prev) => [...prev, message]);
        });

        setSocket(socketInstance);
      } catch (error) {
        console.error('Socket initialization error:', error);
        setConnectionError(true);
        setIsConnecting(false);
      }
    };

    initSocket();

    return () => {
      if (socketInstance) {
        socketInstance.emit('leave-room', roomId);
        socketInstance.disconnect();
      }
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !session?.user?.id) return;

    socket.emit('send-message', {
      roomId,
      message: newMessage,
      userId: session.user.id,
    });

    setNewMessage('');
  };

  const reconnect = () => {
    if (socket) {
      socket.disconnect();
      socket.connect();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">{groupName} Chat</h2>
        {connectionError && (
          <button
            onClick={reconnect}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Reconnect
          </button>
        )}
      </div>

      {isConnecting ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : connectionError ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-600">
            Connection lost. Please check your internet connection.
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.userId === session?.user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.userId === session?.user?.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-75">
                  {format(new Date(message.createdAt), 'HH:mm')}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isConnecting || connectionError}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isConnecting || connectionError}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 