import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: { 
        email: session.user.email 
      },
      include: {
        hostedSessions: {
          include: {
            group: {
              select: {
                id: true,
                name: true,
                subject: true,
              }
            },
            participants: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              }
            },
          },
          where: {
            endTime: {
              gte: new Date(),
            },
          },
          orderBy: {
            startTime: 'asc',
          },
        },
        sessionParticipants: {
          include: {
            host: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              }
            },
            group: {
              select: {
                id: true,
                name: true,
                subject: true,
              }
            },
          },
          where: {
            endTime: {
              gte: new Date(),
            },
          },
          orderBy: {
            startTime: 'asc',
          },
        }
      }
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }), 
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Initialize empty arrays if no sessions exist
    const hostedSessions = user.hostedSessions || [];
    const participatingSessions = user.sessionParticipants || [];

    return new NextResponse(
      JSON.stringify({
        hostedSessions,
        participatingSessions,
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: unknown) {
    console.error('Sessions fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sessions';
    return new NextResponse(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 