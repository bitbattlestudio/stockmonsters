import { UserXPState, XPTransaction, HoldingStreak } from './types';

const XP_STORAGE_KEY = 'stocklings_xp';

/**
 * Get initial/default XP state
 */
function getDefaultState(): UserXPState {
  return {
    currentXP: 5000,
    lifetimeXP: 5000,
    harvestStock: null,
    holdingStreaks: {},
    transactions: []
  };
}

/**
 * Load XP state from localStorage
 */
export function loadXPState(): UserXPState {
  if (typeof window === 'undefined') return getDefaultState();

  const stored = localStorage.getItem(XP_STORAGE_KEY);
  if (!stored) return getDefaultState();

  try {
    const parsed = JSON.parse(stored);
    // Rehydrate dates
    parsed.transactions = parsed.transactions.map((t: any) => ({
      ...t,
      timestamp: new Date(t.timestamp)
    }));
    Object.keys(parsed.holdingStreaks).forEach(ticker => {
      const streak = parsed.holdingStreaks[ticker];
      streak.startDate = new Date(streak.startDate);
      streak.lastCreditedDate = new Date(streak.lastCreditedDate);
    });
    return parsed;
  } catch {
    return getDefaultState();
  }
}

/**
 * Save XP state to localStorage
 */
export function saveXPState(state: UserXPState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(state));
}

/**
 * Add XP transaction and update totals
 */
export function addXPTransaction(
  state: UserXPState,
  transaction: XPTransaction
): UserXPState {
  const newState = {
    ...state,
    currentXP: state.currentXP + transaction.amount,
    lifetimeXP: state.lifetimeXP + transaction.amount,
    transactions: [transaction, ...state.transactions].slice(0, 100) // Keep last 100
  };

  saveXPState(newState);
  return newState;
}

/**
 * Set user's harvest stock
 */
export function setHarvestStock(
  state: UserXPState,
  ticker: string
): UserXPState {
  const newState = { ...state, harvestStock: ticker };
  saveXPState(newState);
  return newState;
}

/**
 * Redeem XP for stock
 */
export function redeemXP(
  state: UserXPState,
  xpAmount: number
): UserXPState {
  if (xpAmount > state.currentXP) {
    throw new Error('Insufficient XP');
  }

  const newState = {
    ...state,
    currentXP: state.currentXP - xpAmount
  };

  saveXPState(newState);
  return newState;
}

/**
 * Update holding streak for a ticker
 */
export function updateHoldingStreak(
  state: UserXPState,
  ticker: string,
  isNewPurchase: boolean
): UserXPState {
  const now = new Date();
  const existing = state.holdingStreaks[ticker];

  let streak: HoldingStreak;

  if (!existing || isNewPurchase && !existing) {
    // Start new streak
    streak = {
      ticker,
      startDate: now,
      lastCreditedDate: now,
      totalDaysHeld: 0,
      bonuses: { day30: false, day90: false, day365: false }
    };
  } else {
    streak = { ...existing };
  }

  const newState = {
    ...state,
    holdingStreaks: {
      ...state.holdingStreaks,
      [ticker]: streak
    }
  };

  saveXPState(newState);
  return newState;
}

/**
 * Remove holding streak when position is fully sold
 */
export function removeHoldingStreak(
  state: UserXPState,
  ticker: string
): UserXPState {
  const { [ticker]: removed, ...remaining } = state.holdingStreaks;

  const newState = {
    ...state,
    holdingStreaks: remaining
  };

  saveXPState(newState);
  return newState;
}
