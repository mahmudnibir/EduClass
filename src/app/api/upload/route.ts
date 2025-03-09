import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    });

    // Update user's image URL in database
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        image: blob.url,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 