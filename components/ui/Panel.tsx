'use client';

import { cn } from '@/lib/utils/cn';
import type { PanelProps } from '@/types';

/**
 * GBA-style panel with chunky border and drop shadow
 */
export function Panel({ children, className, variant = 'default', ...props }: PanelProps) {
  return (
    <div
      className={cn(
        'relative',
        'bg-panel-bg',
        'border-3 border-panel-border',
        'rounded-2xl',
        variant === 'default' && 'shadow-panel',
        variant === 'card' && 'shadow-panel-sm',
        variant === 'header' && 'shadow-panel',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Panel;
