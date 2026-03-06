'use client';

import { useXP } from '@/hooks/useXP';
import { StockIcon } from '@/components/StockIcon';

interface XPBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showHarvestButton?: boolean;
  onClick?: () => void;
}

export function XPBadge({ size = 'md', showHarvestButton = false, onClick }: XPBadgeProps) {
  const { currentXP } = useXP();

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-1.5',
    lg: 'text-lg px-4 py-2'
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2
        bg-gradient-to-r from-amber-500/20 to-yellow-500/20
        dark:from-amber-500/30 dark:to-yellow-500/30
        border border-amber-500/30 dark:border-amber-400/40 rounded-full
        font-pixel text-amber-600 dark:text-amber-400
        hover:border-amber-400/50 dark:hover:border-amber-300/60 transition-colors
        ${sizeClasses[size]}
      `}
    >
      <StockIcon name="diamond" size="sm" />
      <span>{currentXP.toLocaleString()} XP</span>
      {showHarvestButton && currentXP >= 1000 && (
        <span className="text-green-500 dark:text-green-400 text-xs ml-1">🌾</span>
      )}
    </button>
  );
}
