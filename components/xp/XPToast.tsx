'use client';

import { useEffect, useState } from 'react';
import { XPTransaction } from '@/lib/xp/types';
import { StockIcon } from '@/components/StockIcon';

interface XPToastProps {
  transaction: XPTransaction;
  onClose: () => void;
}

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  feed: { icon: 'hunger-apple', color: 'text-green-400', bg: 'bg-green-500/20 dark:bg-green-500/30' },
  release: { icon: 'trending-down', color: 'text-blue-400', bg: 'bg-blue-500/20 dark:bg-blue-500/30' },
  marathon: { icon: 'rocket', color: 'text-purple-400', bg: 'bg-purple-500/20 dark:bg-purple-500/30' },
  marathon_bonus: { icon: 'celebration', color: 'text-yellow-400', bg: 'bg-yellow-500/20 dark:bg-yellow-500/30' },
  swap: { icon: 'swap', color: 'text-cyan-400', bg: 'bg-cyan-500/20 dark:bg-cyan-500/30' },
};

export function XPToast({ transaction, onClose }: XPToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  const config = TYPE_CONFIG[transaction.type];

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        flex items-center gap-3 px-4 py-3 rounded-lg
        border border-white/10 dark:border-white/20 shadow-lg
        transition-all duration-300
        ${config.bg}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}
    >
      <StockIcon name={config.icon} size="md" />
      <div>
        <div className={`font-pixel text-sm ${config.color}`}>
          +{transaction.amount} XP
        </div>
        <div className="text-xs text-white/60 dark:text-white/70">
          {transaction.description}
        </div>
      </div>
    </div>
  );
}
