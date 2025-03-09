'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Conversation {
  id: string;
  name?: string;
  isGroup: boolean;
  participants: any[];
  lastMessage?: {
    content: string;
    createdAt: string;
  };
}

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
}

export default function ConversationList({
  conversations,
  onSelectConversation,
}: ConversationListProps) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);

  const filteredConversations = conversations.filter((conv) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.name?.toLowerCase().includes(searchLower) ||
      conv.participants.some((p) =>
        p.name?.toLowerCase().includes(searchLower)
      )
    );
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <button
            onClick={() => setShowNewChat(true)}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => {
          const otherParticipant = conversation.participants.find(
            (p) => p.id !== session?.user?.id
          );

          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="relative h-12 w-12">
                {conversation.isGroup ? (
                  <div className="h-full w-full bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-300 font-semibold">
                      {conversation.name?.[0] || 'G'}
                    </span>
                  </div>
                ) : (
                  <Image
                    src={otherParticipant?.image || '/default-avatar.png'}
                    alt={otherParticipant?.name || 'User'}
                    className="rounded-full"
                    fill
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-medium truncate">
                    {conversation.isGroup
                      ? conversation.name
                      : otherParticipant?.name}
                  </p>
                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage.content}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">New Conversation</h3>
            {/* Add new chat form here */}
            <button
              onClick={() => setShowNewChat(false)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 