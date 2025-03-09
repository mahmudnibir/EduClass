import { NextResponse } from 'next/server';
import { initSocket, NextApiResponseServerIO } from '@/lib/socket';

export async function GET(req: Request, res: NextApiResponseServerIO) {
  initSocket(res);
  return NextResponse.json({ success: true });
}

export async function POST(req: Request, res: NextApiResponseServerIO) {
  initSocket(res);
  return NextResponse.json({ success: true });
} 