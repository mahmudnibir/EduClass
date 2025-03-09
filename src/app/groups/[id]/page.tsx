'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Chat from '@/components/Chat';
import { PrismaClient } from '@prisma/client';

interface GroupDetails {
  id: string;
  name: string;
  description: string;
  subject: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

export default function GroupPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`/api/groups/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch group details');
        const data = await response.json();
        setGroup(data);
      } catch (error) {
        console.error('Error fetching group details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchGroupDetails();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Group not found</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Group Info */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{group.name}</h1>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">About</h3>
                  <p className="mt-1 text-gray-500">{group.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Subject</h3>
                  <p className="mt-1 text-gray-500">{group.subject}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Members ({group.members.length})</h3>
                  <ul className="mt-2 space-y-2">
                    {group.members.map((member) => (
                      <li key={member.id} className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {member.name?.[0] || member.email[0]}
                          </span>
                        </div>
                        <span className="text-gray-900">{member.name || member.email}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2">
            <Chat roomId={params.id} groupName={group.name} />
          </div>
        </div>
      </main>
    </div>
  );
} 