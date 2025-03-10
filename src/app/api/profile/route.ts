import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface ProfileUpdateData {
  name?: string;
  bio?: string;
  location?: string;
  language?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy?: {
    profileVisibility: 'public' | 'private' | 'friends';
    emailVisibility: boolean;
    activityVisibility: boolean;
  };
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data: ProfileUpdateData = await request.json();

    const updatedUser = await prisma.user.update({
      where: { 
        email: session.user.email 
      },
      data: {
        name: data.name,
        bio: data.bio,
        location: data.location,
        language: data.language,
        notifications: data.notifications ? JSON.stringify(data.notifications) : undefined,
        privacy: data.privacy ? JSON.stringify(data.privacy) : undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      user: {
        ...updatedUser,
        notifications: updatedUser.notifications ? JSON.parse(updatedUser.notifications as string) : null,
        privacy: updatedUser.privacy ? JSON.parse(updatedUser.privacy as string) : null,
      }
    });
  } catch (error: unknown) {
    console.error('Profile update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

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
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        ...user,
        notifications: user.notifications ? JSON.parse(user.notifications as string) : null,
        privacy: user.privacy ? JSON.parse(user.privacy as string) : null,
      }
    });
  } catch (error: unknown) {
    console.error('Profile fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 