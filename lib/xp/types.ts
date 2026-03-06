// XP transaction types
export type XPEventType = 'feed' | 'release' | 'marathon' | 'marathon_bonus' | 'swap';

export interface XPTransaction {
  id: string;
  type: XPEventType;
  amount: number;
  description: string;
  timestamp: Date;
  relatedTicker?: string;
  metadata?: {
    dollarAmount?: number;
    multiplier?: number;
    streakDays?: number;
  };
}

export interface HoldingStreak {
  ticker: string;
  startDate: Date;
  lastCreditedDate: Date;
  totalDaysHeld: number;
  bonuses: {
    day30: boolean;
    day90: boolean;
    day365: boolean;
  };
}

export interface UserXPState {
  currentXP: number;
  lifetimeXP: number;
  harvestStock: string | null; // Ticker user wants to earn
  holdingStreaks: Record<string, HoldingStreak>;
  transactions: XPTransaction[];
}

export const XP_CONSTANTS = {
  // Feed XP
  FEED_XP_PER_DOLLAR: 0.1,        // 1 XP per $10 spent
  FEED_DOWN_THRESHOLD: -5,         // Stock down 5% = bonus
  FEED_DOWN_MULTIPLIER: 2,         // 2x XP when buying dips

  // Release XP
  RELEASE_XP_PER_DOLLAR: 0.05,    // 0.5 XP per $10 sold
  RELEASE_UP_THRESHOLD: 10,        // Stock up 10% = bonus
  RELEASE_UP_MULTIPLIER: 2,        // 2x XP when taking profits

  // Marathon XP
  MARATHON_DAILY_XP: 1,            // 1 XP per stock per day
  MARATHON_30_DAY_BONUS: 25,
  MARATHON_90_DAY_BONUS: 100,
  MARATHON_365_DAY_BONUS: 500,

  // Swap XP
  SWAP_BASE_XP: 50,
  SWAP_SMART_XP: 100,              // Tax-loss, rebalance, etc.

  // Redemption
  XP_TO_DOLLAR_RATIO: 1000,        // 1000 XP = $1
} as const;
