import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';
import { Session } from 'next-auth';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: any & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export const initSocket = (res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('join-conversation', (conversationId: string) => {
        socket.join(conversationId);
      });

      socket.on('leave-conversation', (conversationId: string) => {
        socket.leave(conversationId);
      });

      socket.on('send-message', async (message: any) => {
        io.to(message.conversationId).emit('new-message', message);
      });

      socket.on('typing', (data: { conversationId: string; userId: string }) => {
        socket.to(data.conversationId).emit('user-typing', data.userId);
      });

      socket.on('stop-typing', (data: { conversationId: string; userId: string }) => {
        socket.to(data.conversationId).emit('user-stop-typing', data.userId);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    res.socket.server.io = io;
  }
  return res.socket.server.io;
}; 