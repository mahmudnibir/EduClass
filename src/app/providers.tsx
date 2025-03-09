'use client';

import { ThemeProvider } from 'next-themes';
import Navigation from '@/components/Navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
} 