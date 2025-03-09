'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset loading state on route change
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => {
      setTimeout(() => setIsLoading(false), 500); // Add a small delay for smoother transitions
    };

    // Listen for route changes
    if (pathname) handleComplete();

    return () => {
      setIsLoading(false);
    };
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen />}
      </AnimatePresence>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
} 