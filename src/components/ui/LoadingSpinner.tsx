import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'from-blue-500 to-blue-600',
    secondary: 'from-purple-500 to-pink-500'
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer rotating ring */}
      <motion.div
        className={`absolute ${sizeClasses[size]} rounded-full bg-gradient-to-r ${colorClasses[variant]}`}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />

      {/* Inner pulsing circle */}
      <motion.div
        className={`absolute ${sizeClasses[size]} rounded-full bg-white dark:bg-gray-900 flex items-center justify-center`}
        initial={{ opacity: 0.8 }}
        animate={{
          opacity: [0.8, 0.4, 0.8],
          scale: [0.8, 0.85, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div
          className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-gradient-to-r ${colorClasses[variant]}`}
          animate={{
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Outer glow effect */}
      <div 
        className={`absolute ${sizeClasses[size]} rounded-full opacity-20 animate-pulse bg-gradient-to-r ${colorClasses[variant]} blur-xl`}
      />
    </div>
  );
} 