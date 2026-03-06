'use client';

import { useQuery } from '@tanstack/react-query';
import type { Market, PricePoint } from '@/types';

interface MarketResponse {
  market: Market;
  priceHistory: PricePoint[];
  bestPrices: {
    bestBid: number;
    bestAsk: number;
    spread: number;
  } | null;
}

/**
 * Fetch market data by slug or condition ID
 */
export function useMarket(marketId: string | null) {
  return useQuery<MarketResponse>({
    queryKey: ['market', marketId],
    queryFn: async () => {
      if (!marketId) {
        throw new Error('Market ID is required');
      }

      const response = await fetch(`/api/market/${marketId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch market');
      }

      return response.json();
    },
    enabled: !!marketId,
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
  });
}
