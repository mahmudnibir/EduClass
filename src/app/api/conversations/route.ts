import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: session.user.id,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { participantIds, isGroup, name } = body;

    if (!participantIds || !Array.isArray(participantIds)) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    // Add the current user to participants if not included
    if (!participantIds.includes(session.user.id)) {
      participantIds.push(session.user.id);
    }

    const conversation = await prisma.conversation.create({
      data: {
        isGroup: isGroup || false,
        name: isGroup ? name : undefined,
        participants: {
          connect: participantIds.map((id) => ({ id })),
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 