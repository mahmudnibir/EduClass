import { NextResponse } from 'next/server';
import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponseWithSocket } from '@/types/socket';

export async function GET(req: Request, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    return NextResponse.json({ message: 'Socket is already running' });
  }

  console.log('Socket is initializing');
  const httpServer: NetServer = res.socket.server as any;
  const io = new SocketIOServer(httpServer, {
    path: '/api/socket_io',
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  return NextResponse.json({ message: 'Socket is initialized' });
} 