import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
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

    // Initialize empty arrays if no groups exist
    const hostedGroups = user.hostedGroups || [];
    const memberGroups = user.memberGroups || [];

    return new NextResponse(
      JSON.stringify({
        hostedGroups,
        memberGroups,
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Groups fetch error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: error.message || 'Failed to fetch groups',
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 