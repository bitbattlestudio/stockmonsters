import { XP_CONSTANTS, XPEventType, XPTransaction } from './types';

/**
 * Generate a simple unique ID (alternative to uuid)
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate Feed XP (buying stock)
 */
export function calculateFeedXP(
  dollarAmount: number,
  ticker: string,
  stockPercentChange: number
): XPTransaction {
  const baseXP = dollarAmount * XP_CONSTANTS.FEED_XP_PER_DOLLAR;
  const isDown = stockPercentChange <= XP_CONSTANTS.FEED_DOWN_THRESHOLD;
  const multiplier = isDown ? XP_CONSTANTS.FEED_DOWN_MULTIPLIER : 1;
  const finalXP = Math.floor(baseXP * multiplier);

  return {
    id: generateId(),
    type: 'feed',
    amount: finalXP,
    description: isDown
      ? `Fed ${ticker} while down ${Math.abs(stockPercentChange).toFixed(1)}% (2x bonus!)`
      : `Fed ${ticker} ($${dollarAmount.toFixed(2)})`,
    timestamp: new Date(),
    relatedTicker: ticker,
    metadata: { dollarAmount, multiplier }
  };
}

/**
 * Calculate Release XP (selling stock)
 */
export function calculateReleaseXP(
  dollarAmount: number,
  ticker: string,
  stockPercentChange: number
): XPTransaction {
  const baseXP = dollarAmount * XP_CONSTANTS.RELEASE_XP_PER_DOLLAR;
  const isUp = stockPercentChange >= XP_CONSTANTS.RELEASE_UP_THRESHOLD;
  const multiplier = isUp ? XP_CONSTANTS.RELEASE_UP_MULTIPLIER : 1;
  const finalXP = Math.floor(baseXP * multiplier);

  return {
    id: generateId(),
    type: 'release',
    amount: finalXP,
    description: isUp
      ? `Released ${ticker} at +${stockPercentChange.toFixed(1)}% profit (2x bonus!)`
      : `Released ${ticker} ($${dollarAmount.toFixed(2)})`,
    timestamp: new Date(),
    relatedTicker: ticker,
    metadata: { dollarAmount, multiplier }
  };
}

/**
 * Calculate daily Marathon XP for all holdings
 */
export function calculateDailyMarathonXP(
  holdings: string[]
): XPTransaction {
  const xp = holdings.length * XP_CONSTANTS.MARATHON_DAILY_XP;

  return {
    id: generateId(),
    type: 'marathon',
    amount: xp,
    description: `Marathon: ${holdings.length} StockMonster${holdings.length === 1 ? '' : 's'} held today`,
    timestamp: new Date(),
    metadata: { streakDays: 1 }
  };
}

/**
 * Calculate Marathon streak bonus
 */
export function calculateMarathonBonus(
  ticker: string,
  daysHeld: number
): XPTransaction | null {
  let bonus = 0;
  let milestone = '';

  if (daysHeld === 30) {
    bonus = XP_CONSTANTS.MARATHON_30_DAY_BONUS;
    milestone = '30-day';
  } else if (daysHeld === 90) {
    bonus = XP_CONSTANTS.MARATHON_90_DAY_BONUS;
    milestone = '90-day';
  } else if (daysHeld === 365) {
    bonus = XP_CONSTANTS.MARATHON_365_DAY_BONUS;
    milestone = '365-day';
  } else {
    return null;
  }

  return {
    id: generateId(),
    type: 'marathon_bonus',
    amount: bonus,
    description: `🏆 ${milestone} Marathon with ${ticker}!`,
    timestamp: new Date(),
    relatedTicker: ticker,
    metadata: { streakDays: daysHeld }
  };
}

/**
 * Calculate Swap XP
 */
export function calculateSwapXP(
  fromTicker: string,
  toTicker: string,
  isSmart: boolean // tax-loss, rebalance, etc.
): XPTransaction {
  const xp = isSmart ? XP_CONSTANTS.SWAP_SMART_XP : XP_CONSTANTS.SWAP_BASE_XP;

  return {
    id: generateId(),
    type: 'swap',
    amount: xp,
    description: isSmart
      ? `Smart swap: ${fromTicker} → ${toTicker}`
      : `Swapped ${fromTicker} → ${toTicker}`,
    timestamp: new Date(),
    relatedTicker: toTicker,
    metadata: {}
  };
}

/**
 * Calculate harvest (redemption) amount
 */
export function calculateHarvest(
  xpAmount: number,
  stockPrice: number
): { dollarValue: number; shares: number } {
  const dollarValue = xpAmount / XP_CONSTANTS.XP_TO_DOLLAR_RATIO;
  const shares = dollarValue / stockPrice;

  return {
    dollarValue,
    shares
  };
}
