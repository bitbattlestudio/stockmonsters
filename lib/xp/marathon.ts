import { loadXPState, addXPTransaction, saveXPState } from './store';
import { calculateDailyMarathonXP, calculateMarathonBonus } from './calculations';

/**
 * Run daily to credit marathon XP
 * Call this on app load or via a daily check
 */
export function creditDailyMarathonXP(currentHoldings: string[]): void {
  const state = loadXPState();
  const today = new Date().toDateString();

  // Check if already credited today (simple check)
  const lastTx = state.transactions[0];
  if (lastTx?.type === 'marathon' && new Date(lastTx.timestamp).toDateString() === today) {
    return; // Already credited today
  }

  // Credit daily XP
  if (currentHoldings.length > 0) {
    const dailyXP = calculateDailyMarathonXP(currentHoldings);
    let newState = addXPTransaction(state, dailyXP);

    // Check for streak bonuses
    for (const ticker of currentHoldings) {
      const streak = newState.holdingStreaks[ticker];
      if (!streak) continue;

      const daysHeld = Math.floor(
        (Date.now() - new Date(streak.startDate).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Check each milestone
      if (daysHeld >= 30 && !streak.bonuses.day30) {
        const bonus = calculateMarathonBonus(ticker, 30);
        if (bonus) {
          newState = addXPTransaction(newState, bonus);
          newState.holdingStreaks[ticker].bonuses.day30 = true;
        }
      }
      if (daysHeld >= 90 && !streak.bonuses.day90) {
        const bonus = calculateMarathonBonus(ticker, 90);
        if (bonus) {
          newState = addXPTransaction(newState, bonus);
          newState.holdingStreaks[ticker].bonuses.day90 = true;
        }
      }
      if (daysHeld >= 365 && !streak.bonuses.day365) {
        const bonus = calculateMarathonBonus(ticker, 365);
        if (bonus) {
          newState = addXPTransaction(newState, bonus);
          newState.holdingStreaks[ticker].bonuses.day365 = true;
        }
      }
    }

    saveXPState(newState);
  }
}
