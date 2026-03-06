'use client';

import { useQuery } from '@tanstack/react-query';
import type { PricePoint } from '@/types';

type TimeRange = '1D' | '1W' | '1M' | 'ALL';

const INTERVALS: Record<TimeRange, '1m' | '5m' | '1h' | '1d'> = {
  '1D': '1h',
  '1W': '1h',
  '1M': '1d',
  'ALL': '1d',
};

const FIDELITY: Record<TimeRange, number> = {
  '1D': 24,
  '1W': 168,
  '1M': 30,
  'ALL': 100,
};

/**
 * Fetch price history for a token
 */
export function usePriceHistory(tokenId: string | null, timeRange: TimeRange = '1W') {
  return useQuery<PricePoint[]>({
    queryKey: ['priceHistory', tokenId, timeRange],
    queryFn: async () => {
      if (!tokenId) {
        return [];
      }

      const interval = INTERVALS[timeRange];
      const fidelity = FIDELITY[timeRange];

      const response = await fetch(
        `https://clob.polymarket.com/prices-history?market=${tokenId}&interval=${interval}&fidelity=${fidelity}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch price history');
      }

      const data = await response.json();

      return (data.history || []).map((point: { t: number; p: string }) => ({
        timestamp: point.t,
        price: parseFloat(point.p) || 0,
      }));
    },
    enabled: !!tokenId,
    staleTime: 60 * 1000,
  });
}
