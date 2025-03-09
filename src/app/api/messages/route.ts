import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return new NextResponse('Conversation ID required', { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
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
    const { content, type = 'text', fileUrl, conversationId } = body;

    if (!content || !conversationId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: true,
      },
    });

    if (!conversation) {
      return new NextResponse('Conversation not found', { status: 404 });
    }

    // Check if the user is a participant in the conversation
    if (!conversation.participants.some((p) => p.id === session.user.id)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        type,
        fileUrl,
        senderId: session.user.id,
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Update conversation's updatedAt
    await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 