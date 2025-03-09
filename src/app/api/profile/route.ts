import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await req.json();
    const { name, bio, location, language, notifications, privacy } = data;

    const updatedUser = await prisma.user.update({
      where: { 
        email: session.user.email 
      },
      data: {
        name: name || undefined,
        bio: bio || undefined,
        location: location || undefined,
        language: language || undefined,
        notifications: notifications ? JSON.stringify(notifications) : undefined,
        privacy: privacy ? JSON.stringify(privacy) : undefined,
        updatedAt: new Date(),
      },
    });

    return new NextResponse(
      JSON.stringify({
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          bio: updatedUser.bio,
          location: updatedUser.location,
          language: updatedUser.language,
          notifications: updatedUser.notifications ? JSON.parse(updatedUser.notifications as string) : null,
          privacy: updatedUser.privacy ? JSON.parse(updatedUser.privacy as string) : null,
          image: updatedUser.image,
        }
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Profile update error:', error);
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Failed to update profile' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: { 
        email: session.user.email 
      },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          location: user.location,
          language: user.language,
          notifications: user.notifications ? JSON.parse(user.notifications as string) : null,
          privacy: user.privacy ? JSON.parse(user.privacy as string) : null,
          image: user.image,
        }
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Failed to fetch profile' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 