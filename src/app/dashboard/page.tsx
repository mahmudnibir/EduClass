'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  UserGroupIcon, 
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface StudyGroup {
  id: number;
  name: string;
  members: number;
  subject: string;
  lastActive: string;
}

interface UpcomingSession {
  id: number;
  title: string;
  date: string;
  groupName: string;
  type: 'study' | 'quiz' | 'discussion';
}

interface StudyStats {
  totalHours: number;
  averageScore: number;
  completedQuizzes: number;
  activeGroups: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<StudyStats>({
    totalHours: 0,
    averageScore: 0,
    completedQuizzes: 0,
    activeGroups: 0
  });
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    // Simulated data loading
    const loadDashboardData = () => {
      // Simulated API call delay
      setTimeout(() => {
        setStats({
          totalHours: 24,
          averageScore: 85,
          completedQuizzes: 12,
          activeGroups: 3
        });

        setStudyGroups([
          { id: 1, name: 'Mathematics 101', members: 8, subject: 'Math', lastActive: '2 hours ago' },
          { id: 2, name: 'Physics Study Group', members: 5, subject: 'Physics', lastActive: '1 day ago' },
          { id: 3, name: 'Programming Club', members: 12, subject: 'Computer Science', lastActive: '3 hours ago' },
        ]);

        setUpcomingSessions([
          { id: 1, title: 'Calculus Review', date: '2024-03-25T15:00:00Z', groupName: 'Mathematics 101', type: 'study' },
          { id: 2, title: 'Physics Quiz', date: '2024-03-26T14:00:00Z', groupName: 'Physics Study Group', type: 'quiz' },
          { id: 3, title: 'Algorithm Discussion', date: '2024-03-27T16:00:00Z', groupName: 'Programming Club', type: 'discussion' },
        ]);

        setIsLoading(false);
      }, 1000);
    };

    if (session) {
      loadDashboardData();
    }
  }, [session]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8 transition-all duration-200">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {session.user?.name || 'Student'}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's an overview of your learning progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Study Hours</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalHours}h</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.averageScore}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
          <div className="flex items-center">
            <AcademicCapIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Quizzes</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.completedQuizzes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Groups</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.activeGroups}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Study Groups Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Study Groups</h2>
              <Link
                href="/groups"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 text-sm font-medium transition-colors"
              >
                View all groups
              </Link>
            </div>
            <div className="space-y-4">
              {studyGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => router.push(`/groups/${group.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg">
                      <BookOpenIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{group.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {group.members} members · {group.lastActive}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                    {group.subject}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Sessions Section */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Upcoming Sessions</h2>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{session.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      session.type === 'quiz' 
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : session.type === 'study'
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}>
                      {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {formatDate(session.date)}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{session.groupName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 