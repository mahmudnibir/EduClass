import { Server } from 'socket.io';
import { NextResponse } from 'next/server';
import type { NextApiRequest } from 'next';
import { Server as NetServer } from 'http';

export async function GET(req: NextApiRequest) {
  if (!req.socket.server.io) {
    const httpServer: NetServer = req.socket.server as any;
    const io = new Server(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);

      socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
      });

      socket.on('leave-room', (roomId: string) => {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room ${roomId}`);
      });

      socket.on('send-message', async (data) => {
        const { roomId, message, userId } = data;
        io.to(roomId).emit('new-message', {
          content: message,
          userId,
          createdAt: new Date(),
        });
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
    });

    req.socket.server.io = io;
  }

  return NextResponse.json({ success: true });
} 