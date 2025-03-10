import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize empty arrays if no sessions exist
    const hostedSessions = user.hostedSessions || [];
    const participatingSessions = user.sessionParticipants || [];

    return NextResponse.json({
      hostedSessions,
      participatingSessions,
    });
  } catch (error: unknown) {
    console.error('Sessions fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sessions';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 