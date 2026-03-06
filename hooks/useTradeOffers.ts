'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { TradeOffer } from '@/lib/trade-offers/types';

interface TradeOffersResponse {
  offers: TradeOffer[];
  generatedAt: string;
}

interface ExecuteTradeResponse {
  success: boolean;
  offerId: string;
  txHash: string;
  executedAt: string;
  message: string;
}

interface DismissOfferResponse {
  success: boolean;
  offerId: string;
  dismissedAt: string;
}

export function useTradeOffers() {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  // Fetch trade offers
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<TradeOffersResponse>({
    queryKey: ['trade-offers', address],
    queryFn: async () => {
      const headers: HeadersInit = {};
      if (address) {
        headers['x-wallet-address'] = address;
      }

      const res = await fetch('/api/trade-offers', { headers });
      if (!res.ok) {
        throw new Error('Failed to fetch trade offers');
      }
      return res.json();
    },
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  // Execute trade mutation
  const executeTrade = useMutation<ExecuteTradeResponse, Error, string>({
    mutationFn: async (offerId: string) => {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (address) {
        headers['x-wallet-address'] = address;
      }

      const res = await fetch(`/api/trade-offers/${offerId}/execute`, {
        method: 'POST',
        headers,
      });

      if (!res.ok) {
        throw new Error('Failed to execute trade');
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate trade offers to refresh the list
      queryClient.invalidateQueries({ queryKey: ['trade-offers'] });
      // Also invalidate portfolio data if you have it
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    },
  });

  // Dismiss offer mutation
  const dismissOffer = useMutation<DismissOfferResponse, Error, string>({
    mutationFn: async (offerId: string) => {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (address) {
        headers['x-wallet-address'] = address;
      }

      const res = await fetch(`/api/trade-offers/${offerId}/dismiss`, {
        method: 'POST',
        headers,
      });

      if (!res.ok) {
        throw new Error('Failed to dismiss offer');
      }

      return res.json();
    },
    onSuccess: (_, offerId) => {
      // Optimistically remove the dismissed offer from the cache
      queryClient.setQueryData<TradeOffersResponse>(
        ['trade-offers', address],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            offers: oldData.offers.filter(o => o.id !== offerId),
          };
        }
      );
    },
  });

  const offers = data?.offers || [];

  return {
    offers,
    isLoading,
    error,
    refetch,
    hasOffers: offers.length > 0,
    executeTrade: executeTrade.mutateAsync,
    isExecuting: executeTrade.isPending,
    executeError: executeTrade.error,
    dismissOffer: dismissOffer.mutateAsync,
    isDismissing: dismissOffer.isPending,
  };
}
