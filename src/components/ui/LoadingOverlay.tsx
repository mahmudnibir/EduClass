import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export default function LoadingOverlay({ isLoading, message }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="flex flex-col items-center space-y-4"
          >
            <LoadingSpinner size="lg" variant="primary" />
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-medium text-gray-600 dark:text-gray-300"
              >
                {message}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 