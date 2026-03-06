'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { PixelIcon } from '@/components/PixelIcon';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({
  size = 'md',
  className,
  color = 'var(--panel-border)',
}: LoadingSpinnerProps) {
  return (
    <motion.div
      className={cn('border-2 border-t-transparent rounded-full', sizeMap[size], className)}
      style={{ borderColor: color, borderTopColor: 'transparent' }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

// Bouncing dots loading indicator
export function LoadingDots({ color = 'var(--panel-border)' }: { color?: string }) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Full-screen loading overlay
export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-light/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="mb-4"
      >
        <PixelIcon name="diamond" size="xl" />
      </motion.div>
      <p className="text-lg font-bold text-text-dark">{message}</p>
      <LoadingDots color="var(--panel-border)" />
    </motion.div>
  );
}

export default LoadingSpinner;
