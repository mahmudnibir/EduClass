'use client';

import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80"
    >
      <div className="relative">
        {/* Outer spinning circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-4 border-blue-200 dark:border-blue-900"
        />
        {/* Inner spinning circle */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 w-10 h-10 -mt-5 -ml-5 rounded-full border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent"
        />
        {/* Loading text */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-blue-500 dark:text-blue-400"
        >
          Loading...
        </motion.span>
      </div>
    </motion.div>
  );
} 