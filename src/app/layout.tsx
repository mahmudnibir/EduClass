'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { SessionProvider } from 'next-auth/react';
import { ChatProvider } from '@/contexts/ChatContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <SessionProvider>
          <Providers>
            <ChatProvider>
              {children}
            </ChatProvider>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
