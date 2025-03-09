'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { StudyGroup, StudySession, User } from '@prisma/client';

interface GroupWithRelations extends StudyGroup {
  members: User[];
  sessions: StudySession[];
}

export default function GroupPage() {
  const { data: session } = useSession();
  const params = useParams();
  const [group, setGroup] = useState<GroupWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/groups/${params.id}`);
        const data = await response.json();
        setGroup(data);
      } catch (error) {
        console.error('Error fetching group:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchGroup();
    }
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <div>
      <h1>{group.name}</h1>
      {/* Rest of your component */}
    </div>
  );
} 