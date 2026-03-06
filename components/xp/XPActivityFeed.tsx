'use client';

import { useXP } from '@/hooks/useXP';
import { XPTransaction } from '@/lib/xp/types';
import { StockIcon, IconName } from '@/components/StockIcon';

const TYPE_ICONS: Record<string, IconName> = {
  feed: 'hunger-apple',
  release: 'trending-down',
  marathon: 'rocket',
  marathon_bonus: 'celebration',
  swap: 'swap'
};

const TYPE_COLORS: Record<string, string> = {
  feed: 'text-green-400',
  release: 'text-blue-400',
  marathon: 'text-purple-400',
  marathon_bonus: 'text-yellow-400',
  swap: 'text-cyan-400'
};

export function XPActivityFeed({ limit = 10 }: { limit?: number }) {
  const { transactions } = useXP();

  const recentTransactions = transactions.slice(0, limit);

  if (recentTransactions.length === 0) {
    return (
      <div className="text-center text-text-secondary py-8">
        No XP activity yet. Start feeding your StockMonsters!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recentTransactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center gap-3 p-3 bg-white/5 dark:bg-white/10 rounded-lg"
        >
          <StockIcon name={TYPE_ICONS[tx.type]} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-primary truncate">{tx.description}</p>
            <p className="text-xs text-text-secondary">
              {new Date(tx.timestamp).toLocaleDateString()}
            </p>
          </div>
          <div className={`font-pixel text-sm ${TYPE_COLORS[tx.type]}`}>
            +{tx.amount}
          </div>
        </div>
      ))}
    </div>
  );
}
