'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ClockIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

// Move mock data outside the component
const mockStudyGroups = [
  { id: 1, name: 'Mathematics 101', members: 5, subject: 'Mathematics' },
  { id: 2, name: 'Physics Study Group', members: 3, subject: 'Physics' },
  { id: 3, name: 'Computer Science', members: 8, subject: 'CS' },
];

const mockUpcomingSessions = [
  { id: 1, title: 'Calculus Review', date: '2024-03-20T15:00:00Z', group: 'Mathematics 101' },
  { id: 2, title: 'Algorithm Practice', date: '2024-03-21T18:00:00Z', group: 'Computer Science' },
];

const mockRecentActivity = [
  { id: 1, type: 'joined_group', group: 'Physics Study Group', time: '2 hours ago' },
  { id: 2, type: 'completed_quiz', quiz: 'Mathematics Quiz 1', score: '85%', time: '1 day ago' },
  { id: 3, type: 'study_session', duration: '2 hours', subject: 'Computer Science', time: '2 days ago' },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (!isClient || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {session?.user?.name || &apos;User&apos;}!
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Here&apos;s what&apos;s happening with your studies
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Study Groups</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{mockStudyGroups.length}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CalendarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Sessions</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{mockUpcomingSessions.length}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Study Hours</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">12</div>
                        <p className="ml-2 text-sm text-gray-500">this week</p>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Average Score</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">85%</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Study Groups */}
            <div className="bg-white shadow rounded-lg">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Your Study Groups</h2>
                <div className="space-y-4">
                  {mockStudyGroups.map((group) => (
                    <div key={group.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{group.name}</h3>
                        <p className="text-sm text-gray-500">{group.members} members</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {group.subject}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white shadow rounded-lg">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Sessions</h2>
                <div className="space-y-4">
                  {mockUpcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{session.title}</h3>
                        <p className="text-sm text-gray-500">{session.group}</p>
                      </div>
                      <time className="text-sm text-gray-500">
                        {new Date(session.date).toLocaleDateString()}
                      </time>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                <div className="flow-root">
                  <ul role="list" className="-mb-8">
                    {mockRecentActivity.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== mockRecentActivity.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                {activity.type === 'joined_group' && (
                                  <UserGroupIcon className="h-5 w-5 text-indigo-600" />
                                )}
                                {activity.type === 'completed_quiz' && (
                                  <ChartBarIcon className="h-5 w-5 text-indigo-600" />
                                )}
                                {activity.type === 'study_session' && (
                                  <ClockIcon className="h-5 w-5 text-indigo-600" />
                                )}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {activity.type === 'joined_group' && (
                                    <>Joined <span className="font-medium text-gray-900">{activity.group}</span></>
                                  )}
                                  {activity.type === 'completed_quiz' && (
                                    <>Completed <span className="font-medium text-gray-900">{activity.quiz}</span> with score {activity.score}</>
                                  )}
                                  {activity.type === 'study_session' && (
                                    <>Studied <span className="font-medium text-gray-900">{activity.subject}</span> for {activity.duration}</>
                                  )}
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time>{activity.time}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 