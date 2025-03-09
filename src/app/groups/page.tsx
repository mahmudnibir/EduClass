'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  AcademicCapIcon,
  UsersIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface StudyGroup {
  id: number;
  name: string;
  description: string;
  subject: string;
  members: number;
  meetingTime: string;
  capacity: number;
  isJoined: boolean;
}

export default function GroupsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    subject: '',
    capacity: 10,
    meetingTime: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      // Simulated API call
      setTimeout(() => {
        setGroups([
          {
            id: 1,
            name: 'Mathematics 101',
            description: 'A group focused on calculus and linear algebra',
            subject: 'Mathematics',
            members: 8,
            meetingTime: 'Mondays and Thursdays at 3 PM',
            capacity: 10,
            isJoined: true,
          },
          {
            id: 2,
            name: 'Physics Study Group',
            description: 'Quantum mechanics and relativity discussions',
            subject: 'Physics',
            members: 5,
            meetingTime: 'Tuesdays at 4 PM',
            capacity: 8,
            isJoined: false,
          },
          {
            id: 3,
            name: 'Programming Club',
            description: 'Learn algorithms and data structures',
            subject: 'Computer Science',
            members: 12,
            meetingTime: 'Wednesdays at 5 PM',
            capacity: 15,
            isJoined: true,
          },
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [session]);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated group creation
    const newGroupData: StudyGroup = {
      id: groups.length + 1,
      ...newGroup,
      members: 1,
      isJoined: true,
    };
    setGroups([...groups, newGroupData]);
    setShowCreateModal(false);
    setNewGroup({
      name: '',
      description: '',
      subject: '',
      capacity: 10,
      meetingTime: '',
    });
  };

  const handleJoinGroup = (groupId: number) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, members: group.members + 1, isJoined: true }
        : group
    ));
  };

  const handleLeaveGroup = (groupId: number) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, members: group.members - 1, isJoined: false }
        : group
    ));
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading study groups...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Groups</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Join or create study groups to learn together</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create New Group
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups by name, subject, or description..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">{group.name}</h3>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                  {group.subject}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{group.description}</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  {group.members} / {group.capacity} members
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {group.meetingTime}
                </div>
              </div>
              <div className="mt-4">
                {group.isJoined ? (
                  <button
                    onClick={() => handleLeaveGroup(group.id)}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    Leave Group
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    disabled={group.members >= group.capacity}
                  >
                    {group.members >= group.capacity ? 'Group Full' : 'Join Group'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Create New Study Group</h3>
                  <form onSubmit={handleCreateGroup} className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Group Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        required
                        value={newGroup.subject}
                        onChange={(e) => setNewGroup({ ...newGroup, subject: e.target.value })}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        id="description"
                        required
                        rows={3}
                        value={newGroup.description}
                        onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="meetingTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Meeting Schedule
                      </label>
                      <input
                        type="text"
                        id="meetingTime"
                        required
                        value={newGroup.meetingTime}
                        onChange={(e) => setNewGroup({ ...newGroup, meetingTime: e.target.value })}
                        placeholder="e.g., Mondays at 3 PM"
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Maximum Capacity
                      </label>
                      <input
                        type="number"
                        id="capacity"
                        required
                        min="2"
                        max="50"
                        value={newGroup.capacity}
                        onChange={(e) => setNewGroup({ ...newGroup, capacity: parseInt(e.target.value) })}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      />
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                      >
                        Create Group
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 