'use client';

import { useQuery } from '@tanstack/react-query';
import type { Sigil } from '@/types';

interface PositionsResponse {
  sigils: Sigil[];
  totalValue: number;
  totalPnl: number;
  count: number;
}

/**
 * Fetch positions for a wallet address and transform to Sigils
 */
export function usePositions(address: string | null) {
  return useQuery<PositionsResponse>({
    queryKey: ['positions', address],
    queryFn: async () => {
      if (!address) {
        return { sigils: [], totalValue: 0, totalPnl: 0, count: 0 };
      }

      const response = await fetch(`/api/positions?address=${address}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch positions');
      }

      return response.json();
    },
    enabled: !!address,
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

/**
 * Parse wallet input (address, URL, or username)
 */
export function parseWalletInput(input: string): string | null {
  const trimmed = input.trim();

  // Check if it's a valid Ethereum address
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
    return trimmed;
  }

  // Check if it's a Polymarket URL
  const urlMatch = trimmed.match(/polymarket\.com\/@(\w+)/);
  if (urlMatch) {
    // Would need to fetch wallet from username - for now return null
    return null;
  }

  // Check if it's just a username
  if (/^@?\w+$/.test(trimmed)) {
    // Would need to fetch wallet from username - for now return null
    return null;
  }

  return null;
}
