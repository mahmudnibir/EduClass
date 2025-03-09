'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { ChatProvider } from '@/contexts/ChatContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { Toaster } from 'react-hot-toast';
import Navigation from '@/components/Navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LoadingProvider>
          <ChatProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Navigation />
              <main>{children}</main>
            </div>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                }
              }}
            />
          </ChatProvider>
        </LoadingProvider>
      </ThemeProvider>
    </SessionProvider>
  );
} 