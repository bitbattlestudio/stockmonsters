'use client';

import { cn } from '@/lib/utils/cn';

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  backgroundColor?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Simple progress bar component
 */
export function ProgressBar({
  value,
  color = 'var(--hp-green)',
  backgroundColor = '#D0D0C8',
  className,
  size = 'md',
}: ProgressBarProps) {
  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden',
        'border border-panel-border',
        sizeStyles[size],
        className
      )}
      style={{ backgroundColor }}
    >
      <div
        className="h-full transition-all duration-300 ease-out rounded-full"
        style={{
          width: `${clampedValue}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}

export default ProgressBar;
