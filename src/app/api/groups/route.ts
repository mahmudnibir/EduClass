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
        hostedGroups: {
          include: {
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              }
            },
            sessions: true,
            resources: true,
          }
        },
        memberGroups: {
          include: {
            host: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              }
            },
            sessions: true,
            resources: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize empty arrays if no groups exist
    const hostedGroups = user.hostedGroups || [];
    const memberGroups = user.memberGroups || [];

    return NextResponse.json({
      hostedGroups,
      memberGroups,
    });
  } catch (error: unknown) {
    console.error('Groups fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch groups';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 