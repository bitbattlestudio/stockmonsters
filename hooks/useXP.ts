'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserXPState, XPTransaction, XP_CONSTANTS } from '@/lib/xp/types';
import {
  loadXPState,
  addXPTransaction,
  setHarvestStock,
  redeemXP,
  updateHoldingStreak,
  removeHoldingStreak
} from '@/lib/xp/store';
import {
  calculateFeedXP,
  calculateReleaseXP,
  calculateSwapXP,
  calculateHarvest
} from '@/lib/xp/calculations';

export function useXP() {
  const [state, setState] = useState<UserXPState | null>(null);

  // Load state on mount
  useEffect(() => {
    setState(loadXPState());
  }, []);

  // Award Feed XP (buy)
  const awardFeedXP = useCallback((
    dollarAmount: number,
    ticker: string,
    stockPercentChange: number
  ) => {
    if (!state) return null;

    const transaction = calculateFeedXP(dollarAmount, ticker, stockPercentChange);
    const newState = addXPTransaction(state, transaction);
    setState(newState);

    // Update holding streak
    const stateWithStreak = updateHoldingStreak(newState, ticker, true);
    setState(stateWithStreak);

    return transaction;
  }, [state]);

  // Award Release XP (sell)
  const awardReleaseXP = useCallback((
    dollarAmount: number,
    ticker: string,
    stockPercentChange: number,
    isFullSale: boolean
  ) => {
    if (!state) return null;

    const transaction = calculateReleaseXP(dollarAmount, ticker, stockPercentChange);
    let newState = addXPTransaction(state, transaction);

    // Remove streak if full sale
    if (isFullSale) {
      newState = removeHoldingStreak(newState, ticker);
    }

    setState(newState);
    return transaction;
  }, [state]);

  // Award Swap XP
  const awardSwapXP = useCallback((
    fromTicker: string,
    toTicker: string,
    isSmart: boolean
  ) => {
    if (!state) return null;

    const transaction = calculateSwapXP(fromTicker, toTicker, isSmart);
    const newState = addXPTransaction(state, transaction);
    setState(newState);

    return transaction;
  }, [state]);

  // Set harvest stock
  const setHarvest = useCallback((ticker: string) => {
    if (!state) return;
    const newState = setHarvestStock(state, ticker);
    setState(newState);
  }, [state]);

  // Harvest XP
  const harvest = useCallback((xpAmount: number, stockPrice: number) => {
    if (!state) return null;
    if (xpAmount > state.currentXP) return null;

    const result = calculateHarvest(xpAmount, stockPrice);
    const newState = redeemXP(state, xpAmount);
    setState(newState);

    return result;
  }, [state]);

  // Calculate potential harvest
  const getHarvestPreview = useCallback((xpAmount: number, stockPrice: number) => {
    return calculateHarvest(xpAmount, stockPrice);
  }, []);

  return {
    // State
    currentXP: state?.currentXP ?? 0,
    lifetimeXP: state?.lifetimeXP ?? 0,
    harvestStock: state?.harvestStock,
    transactions: state?.transactions ?? [],
    holdingStreaks: state?.holdingStreaks ?? {},

    // Actions
    awardFeedXP,
    awardReleaseXP,
    awardSwapXP,
    setHarvestStock: setHarvest,
    harvest,
    getHarvestPreview,

    // Constants (for UI display)
    constants: XP_CONSTANTS
  };
}
